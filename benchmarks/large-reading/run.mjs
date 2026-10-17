/** Frozen production source + actual module worker + complete browser Reader.
 * pnpm exec node benchmarks/large-reading/run.mjs
 * LIMR_LARGE_CASES=novels|papers chooses a shorter exclusive measurement window. */
import { chromium } from '@playwright/test';
import { cp, mkdir, readFile, readdir, stat, symlink, writeFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { resolve, dirname, sep, extname } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { browserSettings, browserOutputPath, inspectBrowserIdentity, beginBrowserCase, finishBrowserCase, capturePageGeometry } from '../shared/browser-environment.mjs';
const browserConfiguration = browserSettings();
const resultOutput = browserOutputPath(`/tmp/limr-large-reading-${process.env.LIMR_LARGE_CASES ?? 'all'}.json`, browserConfiguration);
await mkdir(dirname(resultOutput), { recursive: true });
const root = process.cwd(), snapshot = '/tmp/limr-large-reading-snapshot', output = '/tmp/limr-large-reading-dist', samples = resolve(root, '../test-reading');
const inputs = ['src', 'benchmarks/large-reading', 'benchmarks/shared/browser-environment.mjs', 'playground/large-reader.tsx', 'package.json', 'pnpm-lock.yaml'];
async function treeDigest(base, entries = ['']) {
  const hash = createHash('sha256'); let files = 0, bytes = 0;
  const visit = async relative => {
    const path = resolve(base, relative), info = await stat(path);
    if (info.isDirectory()) { for (const name of (await readdir(path)).sort()) await visit(relative ? `${relative}/${name}` : name); return; }
    const body = await readFile(path); hash.update(`${relative}\0${body.length}\0`); hash.update(body); files++; bytes += body.length;
  };
  for (const entry of [...entries].sort()) await visit(entry);
  return { sha256: hash.digest('hex'), files, bytes };
}
const before = await treeDigest(root, inputs);
await rm(snapshot, { recursive: true, force: true }); await mkdir(snapshot, { recursive: true });
for (const directory of ['src', 'benchmarks/large-reading']) await cp(resolve(root, directory), resolve(snapshot, directory), { recursive: true });
await mkdir(resolve(snapshot, 'benchmarks/shared'), { recursive: true });
await cp(resolve(root, 'benchmarks/shared/browser-environment.mjs'), resolve(snapshot, 'benchmarks/shared/browser-environment.mjs'));
await mkdir(resolve(snapshot, 'playground')); await cp(resolve(root, 'playground/large-reader.tsx'), resolve(snapshot, 'playground/large-reader.tsx'));
await cp(resolve(root, 'package.json'), resolve(snapshot, 'package.json')); await cp(resolve(root, 'pnpm-lock.yaml'), resolve(snapshot, 'pnpm-lock.yaml')); await symlink(resolve(root, 'node_modules'), resolve(snapshot, 'node_modules'));
const after = await treeDigest(root, inputs), frozen = await treeDigest(snapshot, inputs);
if (before.sha256 !== after.sha256 || before.sha256 !== frozen.sha256) throw new Error('Benchmark sources changed while freezing; retry with a stable tree.');
await promisify(execFile)(process.execPath, [resolve(snapshot, 'benchmarks/large-reading/build.mjs')], { cwd: snapshot, env: { ...process.env, LIMR_LARGE_SNAPSHOT: snapshot, LIMR_LARGE_BUILD: output }, maxBuffer: 2 * 1024 * 1024 });
const assets = await treeDigest(output);
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.png': 'image/png', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname, relative = decodeURIComponent(pathname === '/' ? 'index.html' : pathname.slice(1));
  for (const base of [output, samples]) {
    const path = resolve(base, relative); if (!path.startsWith(base + sep)) continue;
    try { if (!(await stat(path)).isFile()) continue; response.setHeader('Content-Type', mime[extname(path)] ?? 'application/octet-stream'); response.end(await readFile(path)); return; } catch {}
  }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); const url = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(browserConfiguration.launchOptions).catch(error => { server.close(); throw error; });
const browserVersion = browser.version(), browserMetadata = await inspectBrowserIdentity(browser, browserConfiguration), runs = [];
const summarize = values => { const ordered = [...values].sort((a, b) => a - b); return { count: values.length, max: Math.max(0, ...values), p95: ordered[Math.floor(ordered.length * .95)] ?? 0, over50: values.filter(value => value > 50).length }; };
const cases = process.env.LIMR_LARGE_CASES === 'papers' ? [] : [ { mib: 50, typography: 'standard', mode: 'blocking' }, { mib: 50, typography: 'knuth-plass', mode: 'blocking' }, { mib: 75, typography: 'standard', mode: 'progressive' } ];
if (process.env.LIMR_LARGE_CASES !== 'novels') for (const name of ['1706.03762v7.limr.md', '2305.10435v2.zh-CN.limr.md']) for (const typography of ['standard', 'knuth-plass']) cases.push({ name, source: await readFile(resolve(samples, name), 'utf8'), typography, mode: 'blocking' });
try {
  for (const options of cases) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }), errors = [], failures = [], workerURLs = [];
    page.on('worker', worker => workerURLs.push(worker.url())); page.on('pageerror', error => errors.push(error.message)); page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    await page.goto(url); await page.waitForFunction(() => window.reading?.state?.status === 'ready').catch(async error => { console.error({ errors, failures, state: await page.evaluate(() => ({ body: document.body.innerText, state: window.reading?.state?.status })) }); throw error; }); await page.evaluate(() => document.fonts.ready);
    const browserCase = await beginBrowserCase(browser, page);
    const inputPreparation = await page.evaluate(options => { const start = performance.now(); window.reading.preparedInput = window.reading.prepare(options.mib); return performance.now() - start; }, options);
    const load = await page.evaluate(async options => {
      const tasks = [], frames = [], start = performance.now(); let previous = start, ticking = true;
      const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => ({ at: entry.startTime - start, duration: entry.duration })))); observer.observe({ type: 'longtask' });
      // State notifications can precede React's visible content commit. Observe
      // the current engine's real heading and paragraph, then another rAF;
      // these are DOM/geometry milestones, never physical paint timestamps.
      const contentVisibility = () => {
        const state = window.reading.state, engine = window.reading.api?.document;
        if (!state?.document || engine !== state.document) return null;
        const article = [...document.querySelectorAll('[data-limr-document]')].find(node => node.getAttribute('data-limr-document') === engine.id);
        if (!article) return null;
        const visible = selector => {
          for (const node of article.querySelectorAll(selector)) {
            if (node.closest('[data-window-parked]') || !node.textContent.trim() || !node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue;
            const rect = node.getBoundingClientRect(), left = Math.max(0, rect.left), right = Math.min(innerWidth, rect.right), top = Math.max(0, rect.top), bottom = Math.min(innerHeight, rect.bottom);
            if (right <= left || bottom <= top) continue;
            const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
            if (hit && (hit === node || node.contains(hit))) return { tag: node.tagName, top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, textLength: node.textContent.trim().length };
          }
          return null;
        };
        return { heading: visible('h1,h2,h3,h4,h5,h6'), paragraph: visible('p'), scrollY };
      };
      let prefixVisual = null, prefixEngine;
      const tick = now => {
        frames.push(now - previous); previous = now;
        const state = window.reading.state;
        if (!prefixVisual && state?.document && !state.complete && state.document.getSnapshot().source.length > 1000) {
          const geometry = contentVisibility();
          if (geometry?.heading && geometry.paragraph) {
            prefixEngine = state.document;
            prefixVisual = { geometryAt: performance.now() - start, geometry, fontStatusAtGeometry: document.fonts.status, fontsReadyAt: null, nextFrameAt: null };
            void document.fonts.ready.then(() => { prefixVisual.fontsReadyAt = performance.now() - start; });
          }
        } else if (prefixVisual && prefixVisual.nextFrameAt === null) {
          prefixVisual.nextFrameAt = performance.now() - start;
          prefixVisual.nextFrameGeometry = contentVisibility();
          prefixVisual.stillProvisionalAtNextFrame = !state?.complete;
          prefixVisual.sameEngineAtNextFrame = state?.document === prefixEngine;
          prefixVisual.fontStatusAtNextFrame = document.fonts.status;
        }
        if (ticking) requestAnimationFrame(tick);
      }; requestAnimationFrame(tick);
      window.reading.render({ ...options, input: window.reading.preparedInput, sidebarCollapse: true });
      while (window.reading.state?.status !== 'ready' || window.reading.state.document.getSnapshot().source.length < 1000) await new Promise(resolve => setTimeout(resolve, 5));
      const parsed = performance.now() - start, workerComplete = window.reading.workerComplete - start; await new Promise(requestAnimationFrame); await document.fonts.ready; await new Promise(requestAnimationFrame);
      const completeGeometry = contentVisibility(), completeGeometryAt = performance.now() - start;
      ticking = false; observer.disconnect();
      const snapshot = window.reading.state.document.getSnapshot();
      return { elapsed: performance.now() - start, parsed, workerComplete, readyStateNotifiedAt: window.reading.history.find(item => item.status === 'ready')?.at - start || null, readyLongTask: Math.max(0, ...tasks.filter(task => task.at + task.duration >= workerComplete).map(task => task.duration)), prefixStateNotifiedAt: window.reading.history.find(item => item.prefix)?.at - start || null, prefixVisual, completeGeometryAt, completeGeometry, fontStatusAtCompleteGeometry: document.fonts.status, sourceUTF16: snapshot.source.length, sourceBlocks: snapshot.blocks.length, mounted: document.querySelectorAll('[data-limr-block]').length, nodes: document.querySelectorAll('*').length, capability: window.reading.capability, frames, tasks, heap: performance.memory?.usedJSHeapSize };
    }, options);
    const initialGeometry = await capturePageGeometry(page);
    const phases = {};
    for (const phase of ['steady', 'fast', 'jump']) phases[phase] = await page.evaluate(async phase => {
      const frames = [], tasks = [], start = performance.now(); let previous = start;
      const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => ({ at: entry.startTime - start, duration: entry.duration })))); observer.observe({ type: 'longtask' });
      const source = window.reading.api.document.getSnapshot().source; let pointMisses = 0, maxSlotGap = 0; const gapFrames = [], pointMissDetails = [];
      for (let i = 0; i < (phase === 'jump' ? 30 : 60); i++) {
        await new Promise(requestAnimationFrame); const now = performance.now(); frames.push(now - previous); previous = now;
        if (phase === 'jump' && i % 10 === 0) window.reading.api.scrollToSource({ start: Math.floor(source.length * ((i + 5) / 35)), end: Math.floor(source.length * ((i + 5) / 35)) + 1 });
        else if (phase !== 'jump') { const target = document.querySelector('[data-limr-windowed]') ?? document.querySelector('[data-limr-document]'), event = new WheelEvent('wheel', { deltaY: phase === 'fast' ? 120 : 8, bubbles: true, cancelable: true }); target.dispatchEvent(event); if (!event.defaultPrevented) window.scrollBy(0, event.deltaY); }
        if (i % 10 === 5) { const box = document.querySelector('[data-limr-document]').getBoundingClientRect(); if (![.3, .6].some(y => document.elementsFromPoint(box.left + box.width / 2, innerHeight * y).some(node => node.closest('[data-limr-block]')))) { pointMisses++; pointMissDetails.push({ frame: i, scroll: scrollY, x: box.left + box.width / 2, hit: document.elementsFromPoint(box.left + box.width / 2, innerHeight * .3).slice(0, 6).map(node => [node.tagName, node.className]), slots: [...document.querySelectorAll('[data-window-slot]:not([data-window-parked])')].map(node => { const rect = node.getBoundingClientRect(); return [node.getAttribute('data-window-slot'), rect.x, rect.y, rect.width, rect.height]; }).filter(rect => rect[2] + rect[4] > 0 && rect[2] < innerHeight) }); } }
        const visibleSlots = [...document.querySelectorAll('[data-window-slot]:not([data-window-parked])')].map(node => { const rect = node.getBoundingClientRect(); return { index: node.getAttribute('data-window-slot'), top: rect.top, bottom: rect.bottom }; }).filter(rect => rect.bottom > 0 && rect.top < innerHeight).sort((a, b) => a.top - b.top);
        const gaps = visibleSlots.slice(1).flatMap((slot, index) => { const gap = slot.top - visibleSlots[index].bottom; maxSlotGap = Math.max(maxSlotGap, Math.abs(gap)); return Math.abs(gap) > 2 ? [{ from: visibleSlots[index].index, to: slot.index, gap, top: visibleSlots[index].bottom, bottom: slot.top }] : []; });
        if (gaps.length) gapFrames.push({ frame: i, scroll: scrollY, gaps });
      }
      observer.disconnect(); return { frames, tasks, pointMisses, pointMissDetails, maxSlotGap, gapFrames, mounted: document.querySelectorAll('[data-limr-block]').length, height: document.documentElement.scrollHeight };
    }, phase);
    const resizeStart = await page.evaluate(() => { window.limrResizeFrames = []; window.limrResizeLast = performance.now(); window.limrResizeActive = true; const tick = now => { window.limrResizeFrames.push(now - window.limrResizeLast); window.limrResizeLast = now; if (window.limrResizeActive) requestAnimationFrame(tick); }; requestAnimationFrame(tick); return performance.now(); });
    await page.setViewportSize({ width: 1000, height: 1000 }); await page.waitForTimeout(350);
    const resize = await page.evaluate(start => { window.limrResizeActive = false; return { elapsed: performance.now() - start, frames: window.limrResizeFrames, stale: [...document.querySelectorAll('[data-limr-kp-stale]')].filter(node => { const box = node.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight; }).length }; }, resizeStart);
    const browserEnvironment = await finishBrowserCase(browser, page, browserCase, browserConfiguration, browserMetadata);
    const reading = Object.fromEntries(Object.entries(phases).map(([key, value]) => [key, { ...value, frameStats: summarize(value.frames) }]));
    const result = { name: options.name ?? `${options.mib}MiB`, typography: options.typography, mode: options.mode, inputPreparation, initialGeometry, browserEnvironment, load: { ...load, frameStats: summarize(load.frames) }, reading, resize: { ...resize, frameStats: summarize(resize.frames) }, workerURLs, sourceHash: options.source ? await page.evaluate(async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)))].map(value => value.toString(16).padStart(2, '0')).join(''), options.source) : undefined, errors, failures };
    runs.push(result); console.log(JSON.stringify({ name: result.name, typography: result.typography, load: load.elapsed, prefixStateNotifiedAt: load.prefixStateNotifiedAt, prefixVisual: load.prefixVisual, completeGeometry: load.completeGeometry, capability: load.capability, loadFrames: result.load.frameStats, reading: Object.fromEntries(Object.entries(reading).map(([key, value]) => [key, { frames: value.frameStats, gapFrames: value.gapFrames.length, maxSlotGap: value.maxSlotGap, pointMisses: value.pointMisses, mounted: value.mounted }])), resize: result.resize.frameStats, readyLongTask: load.readyLongTask, errors, failures }));
    await page.close();
  }
} finally { await browser.close(); server.close(); }
const result = { at: new Date().toISOString(), snapshot: frozen, inputTreeBefore: before, inputTreeAfter: after, assets, browserVersion, browserEnvironment: browserMetadata, node: process.version, platform: process.platform, cpu: (await import('node:os')).cpus()[0]?.model, viewport: [1440, 1000], note: 'Frozen production React, real worker, complete semantic snapshot. rAF/longtasks measure main thread scheduling, not physical input-to-photon latency. prefixStateNotifiedAt is only the onLoadStateChange notification. prefixVisual requires the current prefix engine plus visible, viewport-hit-tested heading and paragraph; geometryAt and nextFrameAt are geometry/rAF observations, not physical paint. Font readiness is recorded independently. Complete elapsed waits for ready-state polling, one rAF, document.fonts.ready and another rAF; completeGeometry confirms DOM visibility, not compositor presentation. Synthetic Blob preparation is measured separately before loading; actual file reading/decoding remains included. Lazy images outside visited viewports may remain unloaded. Steady and fast wheel gestures, three source seeks, and width change are separate measurements.', runs };
await writeFile(resultOutput, JSON.stringify(result, null, 2));
