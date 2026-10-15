import { chromium, type Page, type CDPSession } from '@playwright/test';
import { preview } from 'vite';
import { spawn } from 'node:child_process';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { freemem, loadavg } from 'node:os';
import { cases, richFixture } from './fixtures';
import { renderers, type Renderer } from './options';
import { environment as collectEnvironment } from '../shared/environment';
import { order } from '../shared/stats';
import { hostState } from '../shared/host-state';
import { rendererConfig as config } from './config';
import type {} from './page';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, process.env.BENCH_OUTPUT ?? 'benchmarks/results/renderers.json');
const artifacts = resolve(root, 'artifacts/benchmarks/renderers');
const suite = process.env.BENCH_SUITE ?? 'all';
const trials = Number(process.env.BENCH_TRIALS ?? 5);
const readingTrials = Number(process.env.BENCH_READING_TRIALS ?? 3);
const profiling = process.env.BENCH_PROFILE === '1';
const sections = Number(process.env.BENCH_RICH_SECTIONS ?? 240);
const median = (values: number[]) => [...values].sort((a,b) => a-b)[Math.floor(values.length/2)];
const hash = (source: string) => createHash('sha256').update(source).digest('hex');
const results: Record<string, unknown>[] = [];
const preconditions: { phase: string; state: Awaited<ReturnType<typeof hostState>> }[] = [];
const recordPrecondition = async (phase: string) => preconditions.push({ phase, state: await hostState() });
const environment = { ...await collectEnvironment(), viewport: { width: 1440, height: 900 } };
await mkdir(dirname(output), { recursive: true }); await mkdir(artifacts, { recursive: true });
await recordPrecondition('before-build');
if (!process.env.BENCH_NO_BUILD) await new Promise<void>((resolve, reject) => {
  // Build assets before measuring, then release Rollup/Vite's retained heap.
  // The renderer controller and every competitor share the same configuration.
  const child = spawn('pnpm', ['exec', 'tsx', 'benchmarks/renderers/build.ts'], { cwd: root, env: process.env, stdio: 'inherit' });
  child.on('error', reject);
  child.on('close', (code, signal) => code === 0 ? resolve() : reject(new Error(`Renderer build failed: ${signal ?? code}`)));
});
await recordPrecondition('after-build');
const server = await preview(config);
const browser = await chromium.launch({ headless: true, args: ['--enable-precise-memory-info'] });
const browserVersion = await browser.version();
const browserCDP = await browser.newBrowserCDPSession();
async function rendererIds() {
  try { return (await browserCDP.send('SystemInfo.getProcessInfo')).processInfo.filter(process => process.type === 'renderer').map(process => process.id); }
  catch { return []; }
}
const save = async () => writeFile(output, JSON.stringify({ environment: { ...environment, browser: browserVersion }, configuration: { trials, readingTrials, sections, suite, profiling, buildProcess: process.env.BENCH_NO_BUILD ? 'reused-bundle' : 'isolated-child' }, methodology: {
  build: 'Production Vite build runs in a child that exits before browser measurement, releasing build-only heap for all three libraries. Preview and build share the same config. This reduces unrelated controller memory, without claiming a proven cause/fix for historical native-layout stalls. BENCH_NO_BUILD reuses an existing unchanged bundle.',
  fullDOM: 'Production React. GFM only, native code, identical neutral CSS. No virtualisation, animation, highlight or deferred rendering. Fresh page per trial, two small warmups, cyclic/reversed renderer order. Each synchronous flushSync commit includes forced layout; one rAF between chunks; separate final=true commit included. CDP TaskDuration also captures asynchronous browser work. Final semantic DOM compared to react-markdown + remark-gfm outside timing. JS heap measured after CDP GC, not total process memory.',
  reading: 'Independent cold browser context per renderer, production build. LiMR and Markstream retain default plugins/options and vendor CSS; react-markdown uses remark-gfm, remark-math, rehype-katex and an async Shiki component, neutral article CSS. LiMR default Markdown + full styles including Maple; Markstream default MarkdownRender + CSS with optional stream-diffs and KaTeX installed. Real local images; unique code/math. First readable frame is a two-rAF DOM-readiness proxy, not FCP/LCP. Compositor wheel gesture over 7 seconds, then middle/end seeks. Scroll rAF telemetry excludes snapshot scans and GC. Resource totals are measured local transfers, not npm installation or compressed bundle sizes.',
  hostSnapshots: 'Full-DOM trials record host/procfs and renderer process/main-thread CPU before and after the whole run, outside page commit timing. These boundaries include trailing rAFs and adjacent CDP metric calls, not only flushSync. CPU ticks use clockTicksPerSecond; process CPU includes workers. Node RSS/heap is also recorded around build and reference SSR. No periodic sampling or tracing is enabled in ordinary runs. Host-wide pressure/reclaim counters show correlation, not process attribution. Unavailable OS fields are null.',
}, preconditions, results }, null, 2) + '\n');
const metrics = async (cdp: CDPSession) => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m: { name: string; value: number }) => [m.name, m.value])) as Record<string, number>;
const heap = async (cdp: CDPSession) => { await cdp.send('HeapProfiler.collectGarbage'); return (await cdp.send('Runtime.getHeapUsage')).usedSize; };
const systemState = () => ({ at: new Date().toISOString(), freeMemoryBytes: freemem(), loadAverage: loadavg() });
async function startProfile(cdp: CDPSession) {
  if (!profiling) return;
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.start');
  await cdp.send('Tracing.start', { categories: 'devtools.timeline,v8,blink.user_timing', transferMode: 'ReturnAsStream' });
}
async function stopProfile(cdp: CDPSession, name: string) {
  if (!profiling) return undefined;
  const { profile } = await cdp.send('Profiler.stop');
  const complete = new Promise<string>(resolve => cdp.once('Tracing.tracingComplete', event => resolve(event.stream!)));
  await cdp.send('Tracing.end');
  const stream = await complete;
  let trace = '';
  for (;;) { const chunk = await cdp.send('IO.read', { handle: stream }); trace += chunk.base64Encoded ? Buffer.from(chunk.data, 'base64').toString() : chunk.data; if (chunk.eof) break; }
  await cdp.send('IO.close', { handle: stream });
  const cpu = resolve(artifacts, `${name}.cpuprofile`), timeline = resolve(artifacts, `${name}.trace.json`);
  await writeFile(cpu, JSON.stringify(profile)); await writeFile(timeline, trace);
  return { cpu, timeline };
}
async function newPage(renderer: Renderer, profile: string, readingSections = sections, width = 1440) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  page.setDefaultTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await page.goto(`http://127.0.0.1:4175/?renderer=${renderer}&profile=${profile}&sections=${readingSections}`, { waitUntil: 'load', timeout: 120000 });
  await page.waitForFunction(() => !!window.comparison);
  return { page, cdp, errors };
}
async function resources(page: Page) {
  return page.evaluate(() => {
    const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return { count: entries.length, transferBytes: entries.reduce((sum,e) => sum+e.transferSize, 0), decodedBytes: entries.reduce((sum,e) => sum+e.decodedBodySize, 0),
      entries: entries.map(e => ({ name: new URL(e.name).pathname, type: e.initiatorType, bytes: e.transferSize, duration: e.duration })) };
  });
}

try {
  if (suite === 'all' || suite === 'full') for (const scenario of cases.filter(c => !process.env.BENCH_FILTER || c.id.includes(process.env.BENCH_FILTER))) {
    await recordPrecondition(`${scenario.id}:before-reference`);
    const reference = renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: scenario.source }));
    await recordPrecondition(`${scenario.id}:after-reference`);
    const samples: Record<Renderer, Record<string, unknown>[]> = { limr: [], 'react-markdown': [], markstream: [] };
    for (let trial = 0; trial < trials; trial++) for (const renderer of order(renderers, trial)) {
      const { page, cdp, errors } = await newPage(renderer, 'full-dom');
      try {
        const warmup = scenario.id === 'stream-code' ? '```typescript\nconst warmup = 1;\n```' : cases[0].source;
        for (let i=0;i<2;i++) { await page.evaluate(source => window.comparison.run({ source }), warmup); await page.evaluate(() => window.comparison.reset()); }
        const heapBefore = await heap(cdp);
        const processIds = await rendererIds();
        const processBefore = await hostState(processIds);
        const before = await metrics(cdp);
        const systemBefore = systemState();
        await startProfile(cdp);
        const result = await page.evaluate(options => window.comparison.run(options), { source: scenario.source, chunkSize: 'chunkSize' in scenario ? scenario.chunkSize : undefined });
        const profile = await stopProfile(cdp, `${scenario.id}-${renderer}-${trial + 1}`);
        const after = await metrics(cdp);
        const processAfter = await hostState(processIds);
        const heapAfter = await heap(cdp);
        const validation = await page.evaluate(html => window.comparison.inspect(html), reference);
        if (!validation.valid || errors.length) {
          await writeFile(resolve(artifacts, 'failure.json'), JSON.stringify({ renderer, scenario: scenario.id, validation, errors }, null, 2));
          throw new Error(`${scenario.id}/${renderer}: invalid DOM (${validation.mismatch.join(',')}) or errors ${errors.join(';')}`);
        }
        const sample = { trial, ...result, ...(profile ? { profile } : {}), processBefore, processAfter, systemBefore, systemAfter: systemState(), mainThreadMs: (after.TaskDuration-before.TaskDuration)*1000, layoutMs: (after.LayoutDuration-before.LayoutDuration)*1000, retainedHeapBytes: heapAfter-heapBefore, heapBefore, heapAfter, validation, errors };
        samples[renderer].push(sample);
        results.push({ suite: 'full-dom', scenario: scenario.id, sourceSHA256: hash(scenario.source), renderer, ...sample }); await save();
        console.log(JSON.stringify({ suite: 'full-dom', scenario: scenario.id, renderer, trial, totalMs: result.totalMs, p95Ms: result.p95Ms, mainThreadMs: sample.mainThreadMs, heapMB: sample.retainedHeapBytes/1048576 }));
      } finally { await page.close(); }
    }
    console.log('MEDIAN', scenario.id, Object.fromEntries(Object.entries(samples).map(([renderer, list]) => [renderer, median(list.map(s => s.totalMs as number))])));
  }
  if (suite === 'all' || suite === 'streaming') for (let trial = 0; trial < readingTrials; trial++) for (const renderer of order(renderers, trial)) {
    const { page, cdp, errors } = await newPage(renderer, 'default', 1);
    try {
      await page.waitForFunction(() => !!window.richInitial);
      await page.evaluate(() => window.comparison.settle());
      await page.evaluate(() => window.comparison.reset());
      const source = richFixture(8);
      const before = await metrics(cdp);
      const result = await page.evaluate(source => window.comparison.run({ source, chunkSize: 256 }), source);
      const settled = await page.evaluate(() => window.comparison.settle());
      const after = await metrics(cdp);
      const sample = { suite: 'default-streaming', scenario: 'rich-stream', renderer, trial, sourceSHA256: hash(source), ...result,
        settled, valid: settled.settled && settled.state.headings === 8 && settled.state.hasEnd && errors.length === 0,
        mainThreadMs: (after.TaskDuration - before.TaskDuration) * 1000, errors };
      results.push(sample); await save();
      console.log(JSON.stringify({ suite: sample.suite, renderer, trial, totalMs: result.totalMs, p95Ms: result.p95Ms, valid: sample.valid }));
    } finally { await page.close(); }
  }
  if (suite === 'all' || suite === 'reading') for (const readingCase of [{ id: 'rich-medium', sections: 24, width: 1440 }, { id: 'rich-large', sections, width: 1440 }, { id: 'rich-mobile', sections: 24, width: 390 }].filter(c => !process.env.BENCH_READING_CASE || c.id === process.env.BENCH_READING_CASE)) for (let trial = 0; trial < readingTrials; trial++) for (const renderer of order(renderers, trial)) {
    const { page, cdp, errors } = await newPage(renderer, 'default', readingCase.sections, readingCase.width);
    try {
      await page.waitForFunction(() => !!window.richInitial);
      const initial = await page.evaluate(() => window.richInitial!);
      const initialSettle = await page.evaluate(() => window.comparison.settle());
      const initialTelemetry = await page.evaluate(() => window.comparison.telemetry());
      const initialResources = await resources(page);
      const initialHeapBytes = await heap(cdp);
      if (trial === 0) await page.screenshot({ path: resolve(artifacts, `${readingCase.id}-${renderer}-initial.png`) });
      await page.evaluate(() => window.comparison.monitor('scroll'));
      const before = await metrics(cdp);
      await cdp.send('Input.synthesizeScrollGesture', { x: Math.floor(readingCase.width * .65), y: 650, yDistance: -15000, speed: 3000, gestureSourceType: 'mouse' });
      await cdp.send('Input.synthesizeScrollGesture', { x: Math.floor(readingCase.width * .65), y: 650, yDistance: 6000, speed: 3000, gestureSourceType: 'mouse' });
      const after = await metrics(cdp);
      const scrolling = await page.evaluate(() => ({ ...window.comparison.telemetry(), state: window.comparison.richState() }));
      const seeks = [];
      for (const fraction of [.5, 1, 0]) {
        await page.evaluate(fraction => { window.comparison.monitor(`seek-${fraction}`); window.scrollTo(0, (document.documentElement.scrollHeight-innerHeight)*fraction); }, fraction);
        const settled = await page.evaluate(() => window.comparison.settle(8000));
        seeks.push({ fraction, ...settled, telemetry: await page.evaluate(() => window.comparison.telemetry()) });
        if (trial === 0) await page.screenshot({ path: resolve(artifacts, `${readingCase.id}-${renderer}-seek-${fraction}.png`) });
      }
      const heapAfterBytes = await heap(cdp);
      const readingPassed = initialSettle.state.firstHeading === 'Reading section 1' && initialSettle.settled && seeks.every(seek => seek.settled) && !!seeks.find(seek => seek.fraction === 1)?.state.endVisible && errors.length === 0;
      const sample = { suite: 'default-reading', scenario: readingCase.id, viewport: { width: readingCase.width, height: 900 }, sections: readingCase.sections, renderer, trial, sourceSHA256: hash(richFixture(readingCase.sections)), readingPassed, initial, initialSettle, initialTelemetry, initialResources, initialHeapBytes, scrolling: { ...scrolling, mainThreadMs: (after.TaskDuration-before.TaskDuration)*1000 }, seeks, heapAfterBytes, resourcesAfter: await resources(page), errors };
      results.push(sample); await save();
      console.log(JSON.stringify({ suite: 'default-reading', scenario: readingCase.id, renderer, trial, readingPassed, readableMs: initial.readableFromNavigationMs, initialSettled: initialSettle.settled, settleMs: initialSettle.elapsedMs, scrollP95: scrolling.frameP95Ms, scrollMax: scrolling.frameMaxMs, heapMB: heapAfterBytes/1048576, errors }));
    } finally { await page.close(); }
  }
  await save();
  console.log(`Saved ${results.length} samples to ${output}`);
} finally { await browser.close(); await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); }
