/** End-to-end AsyncReader: production worker, default features and complete inputs.
 * Run with pnpm bench:loading. Corpus construction and file fetch are untimed. */
import { chromium } from '@playwright/test';
import { createReadStream, createWriteStream, readFileSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile, readdir } from 'node:fs/promises';
import { once } from 'node:events';
import { createServer } from 'node:http';
import { resolve, extname, sep, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { environment, root, hash } from '../shared/environment.ts';
import { stats, order } from '../shared/stats.ts';
import { browserSettings, browserOutputPath, inspectBrowserIdentity, beginBrowserCase, finishBrowserCase } from '../shared/browser-environment.mjs';

const settings = browserSettings(), metadata = await environment();
const output = browserOutputPath(resolve(root, 'benchmarks/results/loading.json'), settings);
const directory = resolve(root, 'artifacts/benchmarks/loading'), site = resolve(directory, 'site');
const sources = resolve(process.env.BENCH_READING_SOURCE_DIR ?? resolve(root, '../test-reading'));
const documents = ['1706.03762v7.limr.md', '2305.10435v2.zh-CN.limr.md'];
const repeats = Number(process.env.BENCH_LOADING_TRIALS ?? 3);
if (!Number.isInteger(repeats) || repeats < 1) throw new Error('BENCH_LOADING_TRIALS must be a positive integer');
await mkdir(directory, { recursive: true }); await mkdir(dirname(output), { recursive: true });
const fingerprints = ['sourceSHA256', 'harnessSHA256', 'playgroundSHA256', 'examplesSHA256', 'lockSHA256', 'liMR'];
await promisify(execFile)(process.execPath, [resolve(root, 'benchmarks/large-reading/build.mjs')], {
  cwd: root, env: { ...process.env, LIMR_LARGE_SNAPSHOT: root, LIMR_LARGE_BUILD: site }, maxBuffer: 8 * 1024 * 1024,
});
const afterBuild = await environment();
if (fingerprints.some(key => metadata[key] !== afterBuild[key])) throw new Error('Inputs changed during production build');
const assets = [];
async function fingerprintAssets(base = site) {
  for (const name of (await readdir(base)).sort()) {
    const path = resolve(base, name);
    if ((await stat(path)).isDirectory()) await fingerprintAssets(path);
    else assets.push({ path: path.slice(site.length + 1), sha256: hash(await readFile(path)) });
  }
}
await fingerprintAssets();
const papers = await Promise.all(documents.map(async name => {
  const bytes = await readFile(resolve(sources, name));
  return { name, bytes: bytes.length, sha256: hash(bytes), source: bytes.toString('utf8') };
}));
const unit = papers.map(paper => paper.source).join('\n\n');
const prose = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。'.repeat(6) + '\n\n';
const sentinel = 'LIMR-COMPLETE-INPUT-END';
const corpora = [];
for (const [kind, mib] of [['prose', 50], ['prose', 75], ['papers', 50], ['papers', 75], ['unique-rich', 10]]) {
  const id = kind + '-' + mib, path = resolve(directory, id + '.md');
  const stream = createWriteStream(path), digest = createHash('sha256'); let bytes = 0, utf16 = 0, units = 0;
  const write = async text => {
    const data = Buffer.from(text); digest.update(data); bytes += data.length; utf16 += text.length;
    if (!stream.write(data)) await once(stream, 'drain');
  };
  await write('# Loading benchmark\n\nComplete UTF-8 input with all default reader features enabled.\n\n');
  while (bytes < mib * 1048576) {
    const id = units++;
    if (kind === 'papers') await write(unit + '\n\n');
    else if (kind === 'prose') await write(prose);
    else await write('## Section ' + id + '\n\n' +
      'A unique section about parsing, source positions and global references [reference][r' + id + ']. ' +
      'Mix **strong**, *emphasis*, `inline code`, 中文内容 and $a^2+b^2=c^2$.\n\n' +
      '| Column | Value |\n| --- | --- |\n| identifier | ' + id + ' |\n| formula | $x+y$ |\n\n' +
      '```ts\nconst section' + id + ' = { value: ' + id + ', name: "unique" };\n```\n\n' +
      '- First item\n- Second item\n\n' +
      '> Quoted explanation with a footnote[^f' + id + '].\n\n' +
      '[r' + id + ']: https://example.org/section/' + id + '\n\n' +
      '[^f' + id + ']: A distinct global definition for section ' + id + '.\n\n');
  }
  await write('# Final chapter\n\n' + sentinel + '\n');
  stream.end(); await once(stream, 'finish');
  corpora.push({ id, kind, targetMiB: mib, bytes, utf16, units, sha256: digest.digest('hex'), file: id + '.md' });
}
const cases = corpora.flatMap(corpus => (corpus.kind === 'papers' ? ['blocking', 'progressive'] : [corpus.targetMiB === 75 ? 'progressive' : 'blocking'])
  .map(mode => ({ corpus: corpus.id, mode, typography: 'standard' })));
cases.push({ corpus: 'prose-50', mode: 'blocking', typography: 'knuth-plass' });
const filter = process.env.BENCH_LOADING_FILTER;
const selected = filter ? cases.filter(row => [row.corpus, row.mode, row.typography].join('/').includes(filter)) : cases;
if (!selected.length) throw new Error('No matching loading cases');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://local').pathname);
  const roots = path.startsWith('/input/') ? [directory] : [site, sources];
  const relative = path === '/' ? 'index.html' : path.replace(/^\/input\//, '').replace(/^\/+/, '');
  for (const base of roots) {
    const file = resolve(base, relative); if (!file.startsWith(base + sep)) continue;
    try {
      if (!(await stat(file)).isFile()) continue;
      response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
      const input = createReadStream(file); input.on('error', () => response.destroy()); input.pipe(response); return;
    } catch { /* Try the paper asset root. */ }
  }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = 'http://127.0.0.1:' + server.address().port;
const runs = [], configuration = { repeats, cases: selected, viewport: { width: 1440, height: 1000 }, rssSampleIntervalMs: 25, idleMs: 5000, forcedGC: false, partial: !!filter };
const measurement = 'Each trial starts a fresh browser process. Supplied Blob is fetched before timing. Load includes UTF-8 decoding, worker parsing/indexing, result transport/adoption and React reading content. Complete content needs matching engine, visible heading/paragraph geometry, fonts and another rAF; this is not physical paint. Default modules, animations, sidebar folding and automatic DOM windows remain enabled. Linux renderer RSS is sampled externally every 25ms; main-thread JS heap and backing storage are separate measurements. No forced GC. Reading probes follow the 5s idle sample. Repeated complete papers retain shared IDs and are not uniquely authored 50/75 MiB documents.';
let browserVersion, pendingCase;
const save = async complete => writeFile(output, JSON.stringify({ environment: { ...metadata, browser: browserVersion }, configuration, measurement,
  assets, papers: papers.map(({ source, ...paper }) => paper), corpora, complete, pendingCase, runs }, null, 2) + '\n');
try {
  for (let trial = 0; trial < repeats; trial++) for (const options of order(selected, trial)) {
    pendingCase = { ...options, trial }; await save(false);
    const corpus = corpora.find(row => row.id === options.corpus);
    const browser = await chromium.launch(settings.launchOptions); browserVersion = browser.version();
    let sampler, deadline, sampling = false, closed = false, peakRendererRSS = 0, peakBrowserGroupRSS = 0;
    const samples = [], errors = [], resources = [], workers = [];
    try {
      const identity = await inspectBrowserIdentity(browser, settings);
      const page = await browser.newPage({ viewport: configuration.viewport });
      page.on('pageerror', error => errors.push(error.message));
      page.on('worker', worker => workers.push(worker.url()));
      page.on('response', response => { if (response.status() >= 400) resources.push({ url: response.url(), status: response.status() }); });
      page.on('requestfailed', request => resources.push({ url: request.url(), error: request.failure()?.errorText }));
      await page.goto(url); await page.waitForFunction(() => window.reading?.state?.status === 'ready'); await page.evaluate(() => document.fonts.ready);
      workers.length = 0;
      await page.evaluate(async file => { window.reading.preparedInput = await (await fetch('/input/' + file)).blob(); }, corpus.file);
      const before = await beginBrowserCase(browser, page), browserCDP = await browser.newBrowserCDPSession(), pageCDP = await page.context().newCDPSession(page);
      const started = performance.now();
      const sample = async () => {
        if (sampling || closed) return; sampling = true;
        try {
          const { processInfo } = await browserCDP.send('SystemInfo.getProcessInfo');
          const processes = processInfo.flatMap(item => {
            try { const match = /^VmRSS:\s+(\d+)\s+kB$/m.exec(readFileSync('/proc/' + item.id + '/status', 'utf8')); return match ? [{ pid: item.id, type: item.type, rss: Number(match[1]) * 1024 }] : []; } catch { return []; }
          });
          const rendererRSS = Math.max(0, ...processes.filter(row => row.type === 'renderer').map(row => row.rss));
          peakRendererRSS = Math.max(peakRendererRSS, rendererRSS);
          peakBrowserGroupRSS = Math.max(peakBrowserGroupRSS, processes.reduce((sum, row) => sum + row.rss, 0));
          samples.push({ atMs: performance.now() - started, rendererRSS, browserGroupRSS: processes.reduce((sum, row) => sum + row.rss, 0) });
          if (rendererRSS > 6 * 1024 ** 3) { errors.push('6 GiB external renderer guard exceeded'); await browser.close(); }
        } catch (error) { if (!closed) errors.push('RSS sample: ' + error.message); }
        finally { sampling = false; }
      };
      await sample(); sampler = setInterval(() => void sample(), 25);
      deadline = setTimeout(() => { errors.push('180s load deadline exceeded'); void browser.close(); }, 180000);
      const load = await page.evaluate(async ({ options, expectedUTF16 }) => {
        const frames = [], tasks = [], start = performance.now(); let previous = start, active = true, prefix = null;
        const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => ({ at: entry.startTime - start, duration: entry.duration })))); observer.observe({ type: 'longtask' });
        const visibleContent = () => {
          if (window.reading.api?.document !== window.reading.state?.document) return false;
          const article = document.querySelector('[data-limr-document]');
          const visible = selector => [...article?.querySelectorAll(selector) ?? []].some(node => {
            if (!node.textContent.trim() || node.closest('[data-window-parked]') || !node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
            const rect = node.getBoundingClientRect(), top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
            return bottom > top && rect.right > 0 && rect.left < innerWidth && node.contains(document.elementFromPoint(Math.max(0, rect.left) + Math.min(rect.width, innerWidth - rect.left) / 2, (top + bottom) / 2));
          });
          return visible('h1,h2,h3,h4,h5,h6') && visible('p');
        };
        const tick = now => {
          frames.push(now - previous); previous = now;
          if (window.reading.state?.document && !window.reading.state.complete && visibleContent()) {
            if (!prefix) prefix = { visibleAtMs: performance.now() - start, nextFrameAtMs: null };
            else if (prefix.nextFrameAtMs === null) prefix.nextFrameAtMs = performance.now() - start;
          }
          if (active) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        window.reading.render({ input: window.reading.preparedInput, mode: options.mode, typography: options.typography, automaticWindowing: true, sidebarCollapse: true, loadingFallback: null });
        while (!(window.reading.state?.status === 'ready' && window.reading.state.document.getSnapshot().source.length === expectedUTF16)) {
          if (window.reading.state?.status === 'error') throw window.reading.state.error;
          if (performance.now() - start > 170000) throw new Error('Complete snapshot not ready within 170s');
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        const readyMs = performance.now() - start;
        while (!visibleContent()) {
          if (performance.now() - start > 175000) throw new Error('Complete document not visibly mounted');
          await new Promise(requestAnimationFrame);
        }
        await document.fonts.ready; await new Promise(requestAnimationFrame);
        const completeVisibleMs = performance.now() - start;
        active = false; observer.disconnect();
        const snapshot = window.reading.state.document.getSnapshot();
        const history = window.reading.history.map(state => ({ ...state, at: state.at - start }));
        return { readyMs, completeVisibleMs, prefix, frames, tasks, history, bytes: window.reading.preparedInput.size,
          sourceUTF16: snapshot.source.length, blocks: snapshot.blocks.length, headings: snapshot.headings.length,
          annotations: snapshot.annotations.length, annotationRanges: snapshot.annotationRanges.size,
          nodes: document.querySelectorAll('*').length, mountedBlocks: document.querySelectorAll('[data-limr-block]').length,
          capability: window.reading.capability, complete: window.reading.state.complete,
          worker: window.reading.state.capabilities.worker, finalProgress: window.reading.state.overallProgress,
          tailPresent: snapshot.source.endsWith('LIMR-COMPLETE-INPUT-END\n') };
      }, { options, expectedUTF16: corpus.utf16 });
      clearTimeout(deadline);
      const peakLoadRendererRSS = peakRendererRSS;
      await page.waitForTimeout(5000); await sample();
      const idle = { rendererRSS: samples.at(-1)?.rendererRSS, mainIsolate: await pageCDP.send('Runtime.getHeapUsage') };
      const probes = await page.evaluate(async sentinel => {
        const api = window.reading.api, source = api.document.getSnapshot().source;
        const results = [];
        for (const fraction of [0, .25, .5, .75, 1, 0]) {
          const sourceOffset = fraction === 1 ? source.lastIndexOf(sentinel) : Math.floor(source.length * fraction);
          const start = performance.now(); api.scrollToSource({ start: sourceOffset, end: sourceOffset + 1 });
          await new Promise(resolve => setTimeout(resolve, 250)); await new Promise(requestAnimationFrame);
          const article = document.querySelector('[data-limr-document]'), rect = article.getBoundingClientRect();
          const visible = [...article.querySelectorAll('[data-limr-block]')].filter(node => {
            const box = node.getBoundingClientRect(); return !node.closest('[data-window-parked]') && box.bottom > 0 && box.top < innerHeight && box.height > 0;
          });
          results.push({ fraction, elapsedMs: performance.now() - start, visibleBlocks: visible.length,
            tailVisible: fraction !== 1 || visible.some(node => node.textContent.includes(sentinel)),
            horizontalOverflow: Math.max(0, rect.right - innerWidth) });
        }
        const frames = []; let previous = performance.now();
        for (let index = 0; index < 120; index++) {
          await new Promise(requestAnimationFrame); const now = performance.now(); frames.push(now - previous); previous = now;
          const target = document.querySelector('[data-limr-windowed]') ?? document.querySelector('[data-limr-document]');
          const event = new WheelEvent('wheel', { deltaY: index < 60 ? 8 : 120, bubbles: true, cancelable: true });
          target.dispatchEvent(event); if (!event.defaultPrevented) window.scrollBy(0, event.deltaY);
        }
        return { seeks: results, steadyFrames: frames.slice(0, 60), fastFrames: frames.slice(60), nodes: document.querySelectorAll('*').length };
      }, sentinel);
      const browserEnvironment = await finishBrowserCase(browser, page, before, settings, identity);
      const progress = load.history.map(state => state.overallProgress).filter(value => typeof value === 'number');
      const checks = { complete: load.complete && load.sourceUTF16 === corpus.utf16 && load.tailPresent && load.bytes === corpus.bytes,
        worker: load.worker && workers.length > 0, windowed: load.capability?.enabled === true,
        progress: progress.length > 0 && progress.every((value, index) => value >= (progress[index - 1] ?? 0)) && load.finalProgress === 1,
        presentation: options.mode !== 'blocking' || load.prefix === null,
        seeks: probes.seeks.every(probe => probe.visibleBlocks > 0 && probe.tailVisible && probe.horizontalOverflow < 2),
        noErrors: errors.length === 0 && resources.length === 0, environment: browserEnvironment.performanceEnvironmentVerified };
      runs.push({ ...options, trial, corpusSHA256: corpus.sha256, load: { ...load, frames: stats(load.frames) }, idle,
        peakLoadRendererRSS, peakRendererRSS, peakBrowserGroupRSS, samples, probes: { ...probes, steadyFrames: stats(probes.steadyFrames), fastFrames: stats(probes.fastFrames) },
        browserIdentity: identity, browserEnvironment, checks, errors, resources, workers });
      console.log(JSON.stringify({ ...options, trial, readyMs: load.readyMs, visibleMs: load.completeVisibleMs, prefix: load.prefix,
        peakMiB: peakRendererRSS / 1048576, idleMiB: idle.rendererRSS / 1048576, checks, errors, resources }));
    } finally { closed = true; clearInterval(sampler); clearTimeout(deadline); await browser.close(); }
    pendingCase = undefined; await save(runs.length === selected.length * repeats);
  }
} finally { await save(runs.length === selected.length * repeats); await new Promise(resolve => server.close(resolve)); }
if (runs.some(run => Object.values(run.checks).some(value => !value))) process.exitCode = 1;
