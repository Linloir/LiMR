import { chromium } from '@playwright/test';
import { createReadStream, createWriteStream, readFileSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { resolve, dirname, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { environment, root, hash } from '../shared/environment.ts';
import { stats, order } from '../shared/stats.ts';
import { browserSettings, browserOutputPath, inspectBrowserIdentity, beginBrowserCase, finishBrowserCase } from '../shared/browser-environment.mjs';

const metadata = await environment(), settings = browserSettings();
const directory = resolve(root, 'artifacts/benchmarks/large-comparison'), site = resolve(directory, 'site');
const output = browserOutputPath(resolve(root, 'benchmarks/results/large-comparison.json'), settings);
await mkdir(directory, { recursive: true }); await mkdir(dirname(output), { recursive: true });
const repeats = Number(process.env.BENCH_LARGE_COMPARISON_TRIALS ?? 3), filter = process.env.BENCH_LARGE_COMPARISON_FILTER;
if (!Number.isInteger(repeats) || repeats < 1) throw new Error('Invalid trial count');
await promisify(execFile)(process.execPath, [resolve(root, 'benchmarks/large-comparison/build.mjs')], { cwd: root, env: process.env, maxBuffer: 8 * 1024 * 1024 });
const after = await environment();
for (const key of ['sourceSHA256', 'harnessSHA256', 'playgroundSHA256', 'examplesSHA256', 'lockSHA256', 'liMR']) if (metadata[key] !== after[key]) throw new Error('Sources changed during build: ' + key);
const assets = [];
async function digestAssets(base = site) {
  for (const name of (await readdir(base)).sort()) {
    const path = resolve(base, name);
    if ((await stat(path)).isDirectory()) await digestAssets(path);
    else assets.push({ path: path.slice(site.length + 1), sha256: hash(await readFile(path)) });
  }
}
await digestAssets();
const corpora = [];
const sizes = (process.env.BENCH_LARGE_COMPARISON_SIZES ?? '50,75').split(',').map(Number);
if (sizes.some(size => !Number.isInteger(size) || size < 1 || size > 75)) throw new Error('Sizes must be integer MiB between 1 and 75');
for (const kind of ['prose', 'rich']) for (const mib of sizes) {
  const id = kind + '-' + mib, file = id + '.md', stream = createWriteStream(resolve(directory, file)), digest = createHash('sha256');
  let bytes = 0, utf16 = 0, units = 0;
  const write = async text => { const data = Buffer.from(text); bytes += data.length; utf16 += text.length; digest.update(data); if (!stream.write(data)) await once(stream, 'drain'); };
  await write('# LARGE-COMPARISON-START\n\nComplete input with default rendering features.\n\n');
  while (bytes < mib * 1048576) {
    const index = units++;
    if (kind === 'prose') await write('夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。'.repeat(6) + '\n\n');
    else await write('## Section ' + index + '\n\n' +
      'This section contains **formatted prose**, *emphasis*, [a link](https://example.org/' + index + '), `inline code` and $x_{' + index + '}^2+y^2=' + (index + 1) + '$.\n\n' +
      ('Reading should remain responsive while code, equations and images become visible. Completed content should remain stable during browsing. '.repeat(20)) + '\n\n' +
      '$$\na_{' + index + '} = \\frac{' + (index + 1) + '}{2} + \\sqrt{x}\n$$\n\n' +
      '```typescript\nexport function section' + index + '(items: number[]) {\n  const factor = ' + (index + 1) + ';\n  return items.map(item => item * factor);\n}\n```\n\n' +
      '| Name | Value | Status |\n| --- | ---: | --- |\n| Entry ' + index + ' | ' + index + ' | ready |\n| Next | ' + (index + 1) + ' | pending |\n\n' +
      '- [x] Parse the document\n- [ ] Inspect all content\n\n> A quoted explanation for section ' + index + '.\n\n' +
      (index % 16 === 0 ? '![Local architecture diagram ' + index + '](/diagram.svg)\n\n' : ''));
  }
  const tailOffset = utf16;
  await write('# Final chapter\n\nLARGE-COMPARISON-END\n');
  stream.end(); await once(stream, 'finish');
  corpora.push({ id, kind, targetMiB: mib, bytes, utf16, units, file, tailOffset, sha256: digest.digest('hex') });
}
const renderers = ['limr', 'react-markdown', 'markstream'];
const cases = corpora.flatMap(corpus => renderers.map(renderer => ({ corpus: corpus.id, renderer })));
const selected = filter ? cases.filter(row => (row.corpus + '/' + row.renderer).includes(filter)) : cases;
if (!selected.length) throw new Error('No matching comparison cases');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://local').pathname);
  let file;
  if (path === '/diagram.svg') file = resolve(root, 'benchmarks/renderers/public/diagram.svg');
  else { const base = path.startsWith('/input/') ? directory : site;
    file = resolve(base, path === '/' ? 'index.html' : path.replace(/^\/input\//, '').replace(/^\/+/, ''));
    if (!file.startsWith(base + sep)) { response.writeHead(403).end(); return; }
  }
  try {
    if (!(await stat(file)).isFile()) throw new Error('Not a file');
    response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
    const stream = createReadStream(file); stream.on('error', () => response.destroy()); stream.pipe(response);
  } catch { response.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port;
const runs = [], configuration = { repeats, cases: selected, partial: !!filter || !!process.env.BENCH_LARGE_COMPARISON_SIZES || !!process.env.BENCH_LARGE_COMPARISON_TIMEOUT_MS, viewport: { width: 1440, height: 1000 }, rssSampleIntervalMs: 25, idleMs: 5000,
  rendererRSSGuardBytes: 6 * 1024 ** 3, trialTimeoutMs: Number(process.env.BENCH_LARGE_COMPARISON_TIMEOUT_MS ?? 180000), forcedGC: false,
  adapters: { limr: 'AsyncReader; default blocking Worker, default modules/TOC/sidebar/animations, automatic DOM windows',
    'react-markdown': 'ReactMarkdown + remark-gfm + remark-math + rehype-katex + async Shiki; full DOM',
    markstream: 'MarkdownRender content + final=true; default virtualization/batching/lazy rendering/effects; package CSS, KaTeX and stream-diffs' } };
let pendingCase, browserVersion;
const measurement = 'Same complete UTF-8 corpus for every renderer, three fresh browser processes per case, production builds and default rich features. File acquisition as Blob is outside timing; decode, parse, rendering, font readiness and two rAFs precede first readable heading + paragraph. This is an application integration comparison, not identical parser or DOM work. LiMR uses its documented Worker/AsyncReader API; peers use their documented React APIs and have no added custom worker/windowing layer. Native scrolling checks peers; LiMR public source navigation checks its compressed scroll range. No forced GC. RSS sampled every 25ms, peak includes read probes; loading peak and idle memory are separate. Memory/time guards are symmetric and failed/incomplete content is retained, never ranked as successful fast rendering.';
const save = async () => writeFile(output, JSON.stringify({ environment: { ...metadata, browser: browserVersion }, configuration, measurement, assets, corpora,
  complete: runs.length === selected.length * repeats, pendingCase, runs }, null, 2) + '\n');
try {
  for (let trial = 0; trial < repeats; trial++) for (const options of order(selected, trial)) {
    pendingCase = { ...options, trial }; await save();
    const corpus = corpora.find(row => row.id === options.corpus), browser = await chromium.launch(settings.launchOptions); browserVersion = browser.version();
    const errors = [], resources = [], samples = [], workers = [];
    let timer, deadline, sampling = false, closed = false, outcome = 'completed', peakRendererRSS = 0, peakBrowserGroupRSS = 0, peakLoadingRendererRSS = null, idle = null, load = null, probes = null, browserEnvironment = null, identity, before, began;
    const fail = reason => { if (outcome !== 'completed') return; outcome = reason; void browser.close(); };
    try {
      identity = await inspectBrowserIdentity(browser, settings);
      const page = await browser.newPage({ viewport: configuration.viewport });
      page.on('pageerror', error => errors.push(error.message)); page.on('crash', () => { if (outcome === 'completed') outcome = 'renderer-crash'; });
      page.on('response', response => { if (response.status() >= 400) resources.push({ url: response.url(), status: response.status() }); });
      page.on('requestfailed', request => resources.push({ url: request.url(), error: request.failure()?.errorText }));
      page.on('worker', worker => workers.push(worker.url()));
      await page.goto(url + '/?renderer=' + options.renderer); await page.waitForFunction(() => window.largeComparison?.ready);
      await page.evaluate(file => window.largeComparison.prepare(file), corpus.file); await page.evaluate(() => document.fonts.ready);
      before = await beginBrowserCase(browser, page);
      const browserCDP = await browser.newBrowserCDPSession(), pageCDP = await page.context().newCDPSession(page);
      began = performance.now();
      const sample = async () => {
        if (sampling || closed) return; sampling = true;
        try {
          const { processInfo } = await browserCDP.send('SystemInfo.getProcessInfo');
          const processes = processInfo.flatMap(item => {
            try { const match = /^VmRSS:\s+(\d+)\s+kB$/m.exec(readFileSync('/proc/' + item.id + '/status', 'utf8')); return match ? [{ type: item.type, rss: Number(match[1]) * 1024 }] : []; } catch { return []; }
          });
          const rendererRSS = Math.max(0, ...processes.filter(row => row.type === 'renderer').map(row => row.rss));
          const browserGroupRSS = processes.reduce((sum, row) => sum + row.rss, 0);
          peakRendererRSS = Math.max(peakRendererRSS, rendererRSS); peakBrowserGroupRSS = Math.max(peakBrowserGroupRSS, browserGroupRSS);
          samples.push({ atMs: performance.now() - began, rendererRSS, browserGroupRSS });
          if (rendererRSS > configuration.rendererRSSGuardBytes) fail('memory-guard');
        } catch { /* Closing/crashed browser: preserve the last successful external observation. */ }
        finally { sampling = false; }
      };
      await sample(); timer = setInterval(() => void sample(), configuration.rssSampleIntervalMs);
      deadline = setTimeout(() => fail('timeout'), configuration.trialTimeoutMs);
      load = await page.evaluate(() => window.largeComparison.startLoad());
      peakLoadingRendererRSS = peakRendererRSS;
      await page.waitForTimeout(configuration.idleMs); await sample();
      idle = { rendererRSS: samples.at(-1)?.rendererRSS, mainIsolate: await pageCDP.send('Runtime.getHeapUsage') };
      probes = await page.evaluate(offsets => window.largeComparison.probe(offsets), [0, Math.floor(corpus.utf16 / 2), corpus.tailOffset, 0]);
      browserEnvironment = await finishBrowserCase(browser, page, before, settings, identity);
      if (errors.length || resources.length) outcome = 'resource-or-page-error';
      else if (load.initialMissing || !probes.seeks.every(row => row.covered && (row.fraction !== 1 || row.tail) && (row.fraction !== 0 || row.first))) outcome = 'incomplete-content';
      else if (!browserEnvironment.performanceEnvironmentVerified) outcome = 'unverified-environment';
    } catch (error) {
      if (outcome === 'completed') outcome = error.message.includes('170s') ? 'unreadable-timeout' : 'error';
      errors.push(error.message);
    } finally {
      closed = true; clearInterval(timer); clearTimeout(deadline); await browser.close().catch(() => {});
      runs.push({ ...options, trial, corpusSHA256: corpus.sha256, outcome, elapsedMs: began ? performance.now() - began : null,
        load: load && { ...load, frames: stats(load.frames) }, idle, peakLoadingRendererRSS, peakRendererRSS, peakBrowserGroupRSS, samples,
        probes: probes && { ...probes, steady: stats(probes.steady), fast: stats(probes.fast) },
        browserIdentity: identity, browserEnvironment, environmentBefore: before, errors, resources, workers });
      console.log(JSON.stringify({ ...options, trial, outcome, firstReadableMs: load?.firstReadableMs, peakMiB: peakRendererRSS / 1048576, idleMiB: idle?.rendererRSS / 1048576, errors: errors.map(error => error.slice(0, 180)) }));
      pendingCase = undefined; await save();
    }
  }
} finally { await save(); await new Promise(resolve => server.close(resolve)); }
