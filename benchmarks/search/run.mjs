import { chromium } from '@playwright/test';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { dirname, extname, resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { cpus, platform } from 'node:os';

const root = process.cwd(), output = resolve(root, 'artifacts/search-benchmark'), dist = resolve(output, 'dist');
await mkdir(output, { recursive: true });
const require = createRequire(import.meta.url);
const version = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version;
const decoder = require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] });
await build({ configFile: false, root: resolve(root, 'playground'), plugins: [react()], logLevel: 'warn',
  resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: decoder }] },
  build: { outDir: dist, emptyOutDir: true, reportCompressedSize: false, rollupOptions: { input: resolve(root, 'playground/large-reader.html') } } });
const bundleFiles = (await readdir(dist, { recursive: true })).filter(file => /\.(js|css|html)$/.test(file)).sort();
const bundleHash = createHash('sha256');
for (const file of bundleFiles) bundleHash.update(file).update('\0').update(await readFile(resolve(dist, file)));
const fingerprint = {
  bundle: bundleHash.digest('hex'),
  harness: createHash('sha256').update(await readFile(new URL(import.meta.url))).digest('hex'),
};
const server = createServer(async (request, response) => {
  const file = resolve(dist, '.' + new URL(request.url, 'http://local').pathname);
  if (!file.startsWith(dist + sep)) { response.writeHead(403); response.end(); return; }
  try {
    response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' })[extname(file)] ?? 'application/octet-stream');
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch(), runs = [];
try {
  for (const mib of [50, 75]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    page.setDefaultTimeout(120_000);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/large-reader.html`);
    await page.waitForFunction(() => window.reading.state?.status === 'ready');
    await page.evaluate(mib => {
      const phrase = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。';
      const unit = phrase.repeat(24) + '\n\n', unitBytes = new Blob([unit]).size;
      const header = `# Search ${mib} MiB\n\nSearchMarker-001\n\n`, middle = '\n\nSearchMarker-002\n\n', tail = '\n\nSearchMarker-003\n';
      const available = mib * 1024 * 1024 - new Blob([header, middle, tail]).size, count = Math.floor(available / unitBytes);
      const first = Math.floor(count / 2);
      const input = new Blob([header, unit.repeat(first), middle, unit.repeat(count - first), ' '.repeat(available - count * unitBytes), tail]);
      window.searchBench = { bytes: input.size, loadStart: performance.now(), tasks: [] };
      window.reading.render({ input, typography: 'standard', sidebar: false, toc: false });
    }, mib);
    await page.waitForFunction(mib => window.reading.state?.status === 'ready' && window.reading.runtime?.document.getSnapshot().source.startsWith(`# Search ${mib} MiB`), mib);
    const loadMs = await page.evaluate(() => performance.now() - window.searchBench.loadStart);
    await page.evaluate(() => { window.searchBench.source = window.reading.runtime.document.getSnapshot().source; });
    await page.getByRole('heading', { name: `Search ${mib} MiB`, exact: true }).click();
    await page.keyboard.press('Control+f');
    const input = page.locator('.limr-document-search input'), count = page.locator('.limr-search-count');
    await page.getByRole('button', { name: 'Use regular expression' }).click();
    await page.evaluate(() => {
      window.searchBench.observer = new PerformanceObserver(list => window.searchBench.tasks.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration }))));
      window.searchBench.observer.observe({ type: 'longtask' });
    });
    const measure = async (action, expected) => {
      const started = await page.evaluate(() => { window.searchBench.tasks = []; return performance.now(); });
      await action();
      await count.filter({ hasText: expected }).waitFor();
      await page.locator('[data-search-current]').first().waitFor({ state: 'visible' });
      const ended = await page.evaluate(() => performance.now());
      // Allow asynchronous PerformanceObserver delivery without counting this
      // observation interval as search latency.
      await page.waitForTimeout(60);
      return page.evaluate(({ started, ended }) => {
        const tasks = window.searchBench.tasks.filter(task => task.start >= started && task.start < ended);
        return { ms: ended - started, tasks, maxLongTaskMs: Math.max(0, ...tasks.map(task => task.duration)),
          highlights: document.querySelectorAll('[data-search]').length, mountedBlocks: document.querySelectorAll('[data-limr-block]').length };
      }, { started, ended });
    };
    const nearbyRegex = await measure(() => input.fill('SearchMarker-\\d{3}'), /^1\/1\+$/);
    const next = await measure(() => input.press('Enter'), /^2\/2\+$/);
    const previous = await measure(() => input.press('Shift+Enter'), /^1\/2\+$/);
    await input.press('Enter');
    await count.filter({ hasText: /^2\/2\+$/ }).waitFor();
    const tail = await measure(() => input.press('Enter'), /^3\/3(?:\+)?$/);
    await page.screenshot({ path: resolve(output, `${mib}mib-search.png`) });
    const literal = await measure(async () => { await page.getByRole('button', { name: 'Use regular expression' }).click(); await input.fill('SearchMarker-003'); }, /^1\/1\+$/);
    const sourceUnchanged = await page.evaluate(() => window.reading.runtime.document.getSnapshot().source === window.searchBench.source);
    const bytes = await page.evaluate(() => window.searchBench.bytes);
    if (bytes !== mib * 1024 * 1024 || !sourceUnchanged || errors.length) throw new Error(`Invalid ${mib} MiB search run: ${JSON.stringify({ bytes, sourceUnchanged, errors })}`);
    const record = { mib, bytes, loadMs, nearbyRegex, next, previous, tail, literal, sourceUnchanged, errors };
    runs.push(record); console.log(JSON.stringify(record));
    await writeFile(resolve(output, 'result.json'), JSON.stringify({ version, measuredAt: new Date().toISOString(), fingerprint,
      machine: { cpu: cpus()[0].model, platform: platform(), node: process.version }, browser: browser.version(), runs }, null, 2) + '\n');
    await page.close();
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
await writeFile(resolve(output, 'bundle.sha256'), fingerprint.bundle + '\n');
