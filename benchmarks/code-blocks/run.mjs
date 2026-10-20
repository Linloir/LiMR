import { chromium } from '@playwright/test';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { cp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { cpus, platform } from 'node:os';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = resolve(process.env.BENCH_CODE_SOURCE ?? root);
const output = resolve(process.env.BENCH_CODE_OUTPUT ?? resolve(root, 'artifacts/benchmarks/code-blocks.json'));
const snapshot = resolve(root, 'artifacts/benchmarks/code-blocks-source'), dist = resolve(root, 'artifacts/benchmarks/code-blocks-dist');
await rm(snapshot, { recursive: true, force: true }); await mkdir(snapshot, { recursive: true });
await cp(resolve(source, 'src'), resolve(snapshot, 'src'), { recursive: true });
await cp(resolve(source, 'package.json'), resolve(snapshot, 'package.json'));
await cp(resolve(root, 'benchmarks/code-blocks'), resolve(snapshot, 'benchmarks/code-blocks'), { recursive: true });
await symlink(resolve(root, 'node_modules'), resolve(snapshot, 'node_modules'), 'dir');
async function hashTree(directory) {
  const parts = [];
  for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = resolve(directory, item.name);
    parts.push(item.name, item.isDirectory() ? await hashTree(path) : createHash('sha256').update(await readFile(path)).digest('hex'));
  }
  return createHash('sha256').update(parts.join('\n')).digest('hex');
}
const require = createRequire(import.meta.url);
const entityDecoder = require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] });
await build({ configFile: false, root: resolve(snapshot, 'benchmarks/code-blocks'), plugins: [react()], logLevel: 'warn',
  resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: entityDecoder }] },
  build: { outDir: dist, emptyOutDir: true, reportCompressedSize: false } });
const server = createServer(async (request, response) => {
  const path = resolve(dist, '.' + new URL(request.url, 'http://local').pathname.replace(/\/$/, '/index.html'));
  if (!path.startsWith(dist + sep)) { response.writeHead(403); response.end(); return; }
  try {
    response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2' })[extname(path)] ?? 'application/octet-stream');
    response.end(await readFile(path));
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch(), runs = [];
try {
  const cases = [
    { name: 'million-character-line', value: 'abcdefghij '.repeat(90910), numbers: false, autoCollapse: false },
    { name: '50000-lines', value: Array.from({ length: 50000 }, (_, i) => `${i}: const value = 123456789;`).join('\n'), numbers: false, autoCollapse: true },
    { name: '50000-numbered-lines', value: Array.from({ length: 50000 }, (_, i) => `${i}: const value = 123456789;`).join('\n'), numbers: true, autoCollapse: true },
  ];
  for (let trial = 0; trial < Number(process.env.BENCH_CODE_TRIALS ?? 3); trial++) for (const fixture of [...cases.slice(trial % 3), ...cases.slice(0, trial % 3)]) {
    const page = await browser.newPage({ viewport: { width: 900, height: 900 } }), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForFunction(() => !!window.benchCode);
    await page.evaluate(async () => { window.benchCode('```text\nWarm font 0123456789\n```'); await document.fonts.ready; });
    const mount = await page.evaluate(async fixture => {
      const start = performance.now();
      window.benchCode('```text\n' + fixture.value + '\n```', { codeBlock: { lineNumbers: fixture.numbers, autoCollapse: fixture.autoCollapse } });
      document.querySelector('pre').getBoundingClientRect();
      const layout = performance.now() - start;
      await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame);
      return { layout, firstPaint: performance.now() - start };
    }, fixture);
    await page.waitForTimeout(250);
    const actions = [];
    for (const action of fixture.autoCollapse ? ['fold', 'wrap', 'fold'] : ['wrap']) actions.push(await page.evaluate(async action => {
      const start = performance.now(), frames = [], heights = [];
      let previous = start;
      document.querySelector('.limr-code-' + action).click();
      await Promise.resolve();
      const pre = document.querySelector('pre'); pre.getBoundingClientRect();
      const dispatch = performance.now() - start;
      do {
        await new Promise(requestAnimationFrame);
        const now = performance.now(); frames.push(now - previous); previous = now; heights.push(pre.clientHeight);
      } while (performance.now() - start < 550);
      return { action, dispatch, firstPaint: frames[0] + (frames[1] ?? 0), maxFrame: Math.max(...frames),
        framesOver50: frames.filter(ms => ms > 50).length, heightSteps: new Set(heights).size,
        height: pre.clientHeight, scrollHeight: pre.scrollHeight };
    }, action));
    const dom = await page.evaluate(value => ({ nodes: document.querySelector('.limr-code-block').querySelectorAll('*').length,
      lineDecorations: document.querySelectorAll('.limr-code-line').length, completeText: document.querySelector('code').textContent === value }), fixture.value);
    const result = { name: fixture.name, trial, characters: fixture.value.length, mount, actions, dom, errors };
    runs.push(result); console.log(JSON.stringify(result)); await page.close();
  }
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify({ date: new Date().toISOString(), browser: browser.version(), node: process.version, platform: platform(), cpu: cpus()[0].model,
    viewport: { width: 900, height: 900 }, build: 'frozen production source', throttle: 'none', sourceSHA256: await hashTree(resolve(snapshot, 'src')),
    harnessSHA256: await hashTree(resolve(snapshot, 'benchmarks/code-blocks')),
    lockSHA256: createHash('sha256').update(await readFile(resolve(root, 'pnpm-lock.yaml'))).digest('hex'),
    version: JSON.parse(await readFile(resolve(snapshot, 'package.json'))).version, runs }, null, 2) + '\n');
  if (runs.some(run => !run.dom.completeText || run.errors.length)) throw new Error('Code benchmark failed text completeness or page-error checks; inspect the saved result.');
} finally { await browser.close(); server.close(); }
