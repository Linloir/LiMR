import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir, stat, cp, rm, symlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, dirname, extname, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { environment, hash, root } from '../shared/environment.ts';
import { stats as summarize, order } from '../shared/stats.ts';
import { browserSettings, browserOutputPath, inspectBrowserIdentity, beginBrowserCase, finishBrowserCase, capturePageGeometry } from '../shared/browser-environment.mjs';
import { measureScroll, prepareTranslation, measureTranslation, measureResize, completeness } from './probes.mjs';

const browserConfiguration = browserSettings();
const sourceDirectory = resolve(process.env.BENCH_READING_SOURCE_DIR ?? resolve(root, '../test-reading'));
const docs = (process.env.BENCH_READING_DOCUMENTS ?? '1706.03762v7.limr.md,2305.10435v2.zh-CN.limr.md').split(',');
const modes = (process.env.BENCH_READING_MODES ?? 'standard,justify,knuth-plass').split(',');
const booleanModes = (value, name) => {
  const values = value.split(',');
  if (values.some(item => !['true', 'false'].includes(item))) throw new Error(`${name} accepts only true,false`);
  return values.map(item => item === 'true');
};
const collapseModes = booleanModes(process.env.BENCH_READING_COLLAPSE ?? 'true,false', 'BENCH_READING_COLLAPSE');
const sidebarModes = booleanModes(process.env.BENCH_READING_SIDEBAR ?? 'true', 'BENCH_READING_SIDEBAR');
const reserveSidebar = process.env.BENCH_READING_RESERVE_SIDEBAR !== '0';
const renderers = (process.env.BENCH_READING_RENDERERS ?? 'reader').split(',');
if (renderers.some(value => !['reader', 'async'].includes(value))) throw new Error('BENCH_READING_RENDERERS accepts reader,async');
const loadingMode = process.env.BENCH_READING_LOADING ?? 'blocking';
if (!['blocking', 'progressive'].includes(loadingMode)) throw new Error('BENCH_READING_LOADING accepts blocking or progressive');
const virtualization = process.env.BENCH_READING_VIRTUALIZATION === undefined ? undefined
  : booleanModes(process.env.BENCH_READING_VIRTUALIZATION, 'BENCH_READING_VIRTUALIZATION')[0];
const combinations = docs.flatMap(document => modes.flatMap(typography => sidebarModes.flatMap(sidebar =>
  (sidebar ? collapseModes : [false]).flatMap(sidebarCollapse => renderers.map(renderer => ({ document, typography, sidebar, sidebarCollapse, renderer }))))));
if (modes.some(mode => !['standard', 'justify', 'knuth-plass'].includes(mode))) throw new Error('Unknown reading typography mode');
const repeats = Number(process.env.BENCH_READING_TRIALS ?? '3');
if (!Number.isInteger(repeats) || repeats < 1) throw new Error('BENCH_READING_TRIALS must be a positive integer');
const sources = new Map(await Promise.all(docs.map(async document => {
  const bytes = await readFile(resolve(sourceDirectory, document));
  return [document, { source: bytes.toString('utf8'), sha256: hash(bytes), bytes: bytes.length }];
})));
const directory = dirname(fileURLToPath(import.meta.url));
const buildDirectory = resolve(process.env.BENCH_READING_BUILD ?? resolve(root, 'artifacts/benchmarks/reading-dist'));
const output = browserOutputPath(resolve(root, 'artifacts/benchmarks/reading.json'), browserConfiguration);
await mkdir(dirname(output), { recursive: true });
const metadata = { ...await environment(), browserRequest: browserConfiguration };
await writeFile(output, JSON.stringify({ environment: metadata, complete: false, phase: 'preparing', runs: [] }, null, 2) + '\n');
const fingerprints = ['sourceSHA256', 'harnessSHA256', 'lockSHA256'];
let buildMetadata;
if (process.env.BENCH_NO_BUILD === '1') {
  buildMetadata = JSON.parse(await readFile(resolve(buildDirectory, 'reading-build.json'), 'utf8'));
  if (fingerprints.some(key => metadata[key] !== buildMetadata[key])) throw new Error('The saved reading build does not match the current source, harness or lockfile');
} else {
  // Freeze inputs before building, so editing the workspace cannot introduce
  // HMR or mixed source versions into a long measurement run.
  const snapshot = buildDirectory + '-source';
  await rm(snapshot, { recursive: true, force: true });
  await mkdir(resolve(snapshot, 'benchmarks'), { recursive: true });
  await cp(resolve(root, 'src'), resolve(snapshot, 'src'), { recursive: true });
  await cp(directory, resolve(snapshot, 'benchmarks/reading'), { recursive: true });
  await mkdir(resolve(snapshot, 'benchmarks/shared'), { recursive: true });
  await cp(resolve(root, 'benchmarks/shared/browser-environment.mjs'), resolve(snapshot, 'benchmarks/shared/browser-environment.mjs'));
  await cp(resolve(root, 'package.json'), resolve(snapshot, 'package.json'));
  await symlink(resolve(root, 'node_modules'), resolve(snapshot, 'node_modules'), 'dir');
  const after = await environment();
  if (fingerprints.some(key => metadata[key] !== after[key])) throw new Error('Source, harness or lockfile changed while copying the snapshot; repeat the run');
  buildMetadata = { ...Object.fromEntries([...fingerprints, 'revision', 'date'].map(key => [key, metadata[key]])), snapshot };
  await promisify(execFile)(process.execPath, [resolve(directory, 'build.mjs')], { cwd: root,
    env: { ...process.env, BENCH_READING_BUILD: buildDirectory, BENCH_READING_SNAPSHOT: snapshot }, maxBuffer: 8 * 1024 * 1024 });
  await writeFile(resolve(buildDirectory, 'reading-build.json'), JSON.stringify(buildMetadata, null, 2));
}
// Local relative media resolves beside the input Markdown; bundle resources
// take precedence. Resolve only within these two explicitly selected roots.
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.woff': 'font/woff', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    const path = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const relative = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
    for (const base of [buildDirectory, sourceDirectory]) {
      const candidate = resolve(base, relative);
      if (!candidate.startsWith(base + sep)) continue;
      try {
        if (!(await stat(candidate)).isFile()) continue;
        response.setHeader('Content-Type', mime[extname(candidate)] ?? 'application/octet-stream');
        response.end(await readFile(candidate)); return;
      } catch { /* Try the media root after a missing bundle resource. */ }
    }
    response.writeHead(404); response.end('Not found');
  } catch { response.writeHead(400); response.end('Invalid request'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseURL = `http://127.0.0.1:${server.address().port}`;
const stats = values => ({ ...summarize(values), over50: values.filter(value => value > 50).length });
const measurement = 'Production React and default renderer features/animations. Font-ready isolated pages. Steady reading at 480px/s, fast scroll at 120px per animation frame, and 120 whole-document seeks are separate scenarios. rAF intervals are not physical input-to-photon latency. Resize completion is a visible-paragraph geometry/KP signature stable for 150ms with no visible stale KP; it is not an internal queue-drain signal. Visibility probes check DOM coverage, not rasterized pixels. Lazy images outside the visited viewport may remain unloaded. No public report is updated.';
const browser = await chromium.launch(browserConfiguration.launchOptions).catch(error => { server.close(); throw error; });
const browserMetadata = await inspectBrowserIdentity(browser, browserConfiguration);
const runs = [];
let pendingCase;
try {
  for (let repeat = 0; repeat < repeats; repeat++) for (const combination of order(combinations, repeat)) {
    const { document, typography, sidebar, sidebarCollapse, renderer } = combination;
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [], resources = [], workers = [];
    pendingCase = { ...combination, repeat, errors, resources, workers };
    page.on('worker', worker => workers.push(worker.url()));
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) resources.push({ url: response.url(), status: response.status() }); });
    page.on('requestfailed', request => resources.push({ url: request.url(), error: request.failure()?.errorText }));
    await page.goto(`${baseURL}/`);
    await page.waitForFunction(() => window.limrReadingReady);
    const browserCase = await beginBrowserCase(browser, page);
    Object.assign(pendingCase, { browserEnvironment: browserCase });
    const mount = await page.evaluate(async options => {
      window.limrReadingEvents = [];
      const start = performance.now(), frames = []; window.limrReadingRender(options);
      const dispatched = performance.now() - start;
      let previous = start;
      do {
        await new Promise(requestAnimationFrame);
        const now = performance.now(); frames.push(now - previous); previous = now;
        const error = window.limrReadingLoading.find(state => state.status === 'error');
        if (error) throw new Error(error.error ?? 'Document loading failed');
        if (now - start > 120000) throw new Error('Document was not ready within 120 seconds');
      } while (frames.length < 2 || !window.limrReadingLoaded || !document.querySelector('.limr-reader-content [data-limr-block]'));
      const ready = performance.now() - start;
      await new Promise(resolve => setTimeout(resolve, 0));
      return { dispatched, firstFrame: frames[0], secondFrame: frames[0] + frames[1], ready,
        frames, longtasks: window.limrReadingEvents.filter(task => task.start >= start),
        loading: window.limrReadingLoading.map(state => ({ ...state, at: state.at - start })),
        sourceBlocks: document.querySelectorAll('.limr-reader-content [data-limr-block]').length };
    }, { source: sources.get(document).source, typography, sidebar, sidebarCollapse, reserveSidebar, renderer, loadingMode, virtualization });
    Object.assign(pendingCase, { mount });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    const initialGeometry = await capturePageGeometry(page);
    const initial = await completeness(page);
    const steady = await measureScroll(page, 'steady'); await page.waitForTimeout(250);
    const fast = await measureScroll(page, 'fast'); await page.waitForTimeout(400);
    const seeks = await measureScroll(page, 'seek'); await page.waitForTimeout(600);
    const toggles = [], toggleDuringScroll = [];
    Object.assign(pendingCase, { initial, steady, fast, seeks, toggles, toggleDuringScroll });
    const hasTranslations = await prepareTranslation(page);
    if (hasTranslations) {
      for (const scrolling of [false, true]) for (let index = 0; index < 3; index++) {
        if (!await prepareTranslation(page)) throw new Error('Translation switch could not be brought into the viewport');
        (scrolling ? toggleDuringScroll : toggles).push(await measureTranslation(page, scrolling));
      }
    }
    const resizes = [];
    for (const width of [1280, 1440]) resizes.push(await measureResize(page, width));
    const final = await completeness(page);
    const browserEnvironment = await finishBrowserCase(browser, page, browserCase, browserConfiguration, browserMetadata);
    const checks = {
      noPageErrors: errors.length === 0, noResourceFailures: resources.length === 0, mounted: initial.sourceBlocks > 0,
      viewportCovered: [steady, fast, seeks].every(probe => probe.emptySamples === 0),
      windowSlotsAligned: [steady, fast, seeks].every(probe => probe.misalignedSlotSamples === 0),
      translationsChanged: [...toggles, ...toggleDuringScroll].every(probe => probe.modeChanged && probe.visibleAtStart),
      workerEnabled: renderer !== 'async' || workers.length > 0 && mount.loading.some(state => state.status === 'ready' && state.capabilities.worker),
      resizesSettled: resizes.every(probe => !probe.timeout && !probe.stale), noVisibleStaleKP: final.visibleStale === 0,
    };
    const summarizeProbe = probe => ({ ...probe, frames: stats(probe.frames) });
    const result = { ...combination, repeat, reserveSidebar, loadingMode, virtualization, documentSHA256: sources.get(document).sha256,
      bytes: sources.get(document).bytes, mount: summarizeProbe(mount), initial, initialGeometry, completeness: final, checks, hasTranslations, browserEnvironment,
      steady: summarizeProbe(steady), fast: summarizeProbe(fast), seeks: summarizeProbe(seeks),
      toggles: toggles.map(summarizeProbe), toggleDuringScroll: toggleDuringScroll.map(summarizeProbe),
      resizes: resizes.map(summarizeProbe), errors, resources, workers };
    runs.push(result);
    pendingCase = undefined;
    await writeFile(output, JSON.stringify({ environment: { ...metadata, browser: browser.version(), browserEnvironment: browserMetadata }, measurement,
      build: buildMetadata, complete: runs.length === repeats * combinations.length, runs }, null, 2) + '\n');
    console.log(JSON.stringify({ ...combination, repeat, contentWidth: initial.contentWidth,
      steadyP95: result.steady.frames.p95Ms, fastP95: result.fast.frames.p95Ms, seeksP95: result.seeks.frames.p95Ms,
      toggleMax: result.toggles.map(probe => probe.frames.maxMs),
      toggleDuringScrollMax: result.toggleDuringScroll.map(probe => probe.frames.maxMs),
      resizeStable: resizes.map(probe => probe.stable), checks, errors, resources }));
    await page.close();
  }
} catch (error) {
  await writeFile(output, JSON.stringify({ environment: { ...metadata, browser: browser.version(), browserEnvironment: browserMetadata }, measurement,
    build: buildMetadata, complete: false, error: String(error), pendingCase, runs }, null, 2) + '\n');
  throw error;
} finally {
  await browser.close(); await new Promise(resolve => server.close(resolve));
}
