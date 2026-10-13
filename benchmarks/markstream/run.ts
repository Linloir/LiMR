import { chromium, type Page, type CDPSession } from '@playwright/test';
import { build, preview, type InlineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { cpus, platform, release } from 'node:os';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cases, richFixture } from './fixtures';
import type { Renderer } from './options';
import type {} from './page';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const output = resolve(root, process.env.BENCH_OUTPUT ?? 'benchmarks/results/markstream.json');
const outDir = resolve(root, 'artifacts/markstream-dist');
const artifacts = resolve(root, 'artifacts/markstream');
const suite = process.env.BENCH_SUITE ?? 'all';
const trials = Number(process.env.BENCH_TRIALS ?? 5);
const readingTrials = Number(process.env.BENCH_READING_TRIALS ?? 3);
const sections = Number(process.env.BENCH_RICH_SECTIONS ?? 240);
const packageVersion = async (name: string) => {
  let path = dirname(fileURLToPath(import.meta.resolve(name)));
  for (;;) {
    try { const data = JSON.parse(await readFile(resolve(path, 'package.json'), 'utf8')); if (data.name === name) return data.version; } catch { /* parent package */ }
    const parent = dirname(path); if (parent === path) throw new Error(`No package.json for ${name}`); path = parent;
  }
};
const median = (values: number[]) => [...values].sort((a,b) => a-b)[Math.floor(values.length/2)];
const hash = (source: string) => createHash('sha256').update(source).digest('hex');
const results: Record<string, unknown>[] = [];
const environment = {
  date: new Date().toISOString(), timezone: 'Asia/Shanghai', node: process.version,
  platform: `${platform()} ${release()}`, cpu: cpus()[0].model,
  revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  sourceDiff: execFileSync('git', ['diff', '--', 'src'], { cwd: root, encoding: 'utf8' }),
  versions: Object.fromEntries(await Promise.all(['react', 'react-dom', 'markstream-react', 'stream-diffs', 'katex', 'shiki'].map(async name => [name, await packageVersion(name)]))),
  liMR: JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version,
  viewport: { width: 1440, height: 900 }, cpuThrottle: 1, network: 'Local Vite production preview; no network emulation',
};
const config: InlineConfig = { configFile: false, root: resolve(root, 'benchmarks/markstream'), plugins: [react()], logLevel: 'warn',
  build: { outDir, emptyOutDir: true, target: 'esnext', reportCompressedSize: false, rollupOptions: {
    onwarn(warning, warn) { if (warning.code !== 'INVALID_ANNOTATION') warn(warning); },
  } },
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
};
await mkdir(dirname(output), { recursive: true }); await mkdir(artifacts, { recursive: true });
if (!process.env.BENCH_NO_BUILD) await build(config);
const server = await preview(config);
const browser = await chromium.launch({ headless: true, args: ['--enable-precise-memory-info'] });
const browserVersion = await browser.version();
const save = async () => writeFile(output, JSON.stringify({ environment: { ...environment, browser: browserVersion }, methodology: {
  fullDOM: 'Production React. GFM only, native code, identical neutral CSS. No virtualisation, animation, highlight or deferred rendering. Fresh page per trial, two small warmups, alternating order. Each synchronous flushSync commit includes forced layout; one rAF between chunks; separate final=true commit included. CDP TaskDuration also captures asynchronous browser work. Final semantic DOM compared to react-markdown + remark-gfm outside timing. JS heap measured after CDP GC, not total process memory.',
  reading: 'Independent cold browser context per renderer, production build, renderer default plugins/options and vendor CSS. LiMR default Markdown + full styles including Maple; Markstream default MarkdownRender + CSS with optional stream-diffs and KaTeX installed. Real local images; unique code/math. First readable frame is a two-rAF DOM-readiness proxy, not FCP/LCP. Compositor wheel gesture over 7 seconds, then middle/end seeks. Scroll rAF telemetry excludes snapshot scans and GC. Resource totals are measured local transfers, not npm installation or compressed bundle sizes.',
}, results }, null, 2) + '\n');
const metrics = async (cdp: CDPSession) => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m: { name: string; value: number }) => [m.name, m.value])) as Record<string, number>;
const heap = async (cdp: CDPSession) => { await cdp.send('HeapProfiler.collectGarbage'); return (await cdp.send('Runtime.getHeapUsage')).usedSize; };
async function newPage(renderer: Renderer, profile: string) {
  const page = await browser.newPage({ viewport: environment.viewport });
  page.setDefaultTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  await page.goto(`http://127.0.0.1:4175/?renderer=${renderer}&profile=${profile}&sections=${sections}`, { waitUntil: 'load', timeout: 120000 });
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
    const reference = renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm], children: scenario.source }));
    const samples: Record<Renderer, Record<string, unknown>[]> = { limr: [], markstream: [] };
    for (let trial = 0; trial < trials; trial++) for (const renderer of (trial % 2 ? ['markstream', 'limr'] : ['limr', 'markstream']) as Renderer[]) {
      const { page, cdp, errors } = await newPage(renderer, 'full-dom');
      try {
        const warmup = scenario.id === 'stream-code' ? '```typescript\nconst warmup = 1;\n```' : cases[0].source;
        for (let i=0;i<2;i++) { await page.evaluate(source => window.comparison.run({ source }), warmup); await page.evaluate(() => window.comparison.reset()); }
        const heapBefore = await heap(cdp); const before = await metrics(cdp);
        const result = await page.evaluate(options => window.comparison.run(options), { source: scenario.source, chunkSize: 'chunkSize' in scenario ? scenario.chunkSize : undefined });
        const after = await metrics(cdp); const heapAfter = await heap(cdp);
        const validation = await page.evaluate(html => window.comparison.inspect(html), reference);
        if (!validation.valid || errors.length) {
          await writeFile(resolve(artifacts, 'failure.json'), JSON.stringify({ renderer, scenario: scenario.id, validation, errors }, null, 2));
          throw new Error(`${scenario.id}/${renderer}: invalid DOM (${validation.mismatch.join(',')}) or errors ${errors.join(';')}`);
        }
        const sample = { trial, ...result, mainThreadMs: (after.TaskDuration-before.TaskDuration)*1000, layoutMs: (after.LayoutDuration-before.LayoutDuration)*1000, retainedHeapBytes: heapAfter-heapBefore, heapBefore, heapAfter, validation, errors };
        samples[renderer].push(sample);
        results.push({ suite: 'full-dom', scenario: scenario.id, sourceSHA256: hash(scenario.source), renderer, ...sample }); await save();
        console.log(JSON.stringify({ suite: 'full-dom', scenario: scenario.id, renderer, trial, totalMs: result.totalMs, p95Ms: result.p95Ms, mainThreadMs: sample.mainThreadMs, heapMB: sample.retainedHeapBytes/1048576 }));
      } finally { await page.close(); }
    }
    console.log('MEDIAN', scenario.id, Object.fromEntries(Object.entries(samples).map(([renderer, list]) => [renderer, median(list.map(s => s.totalMs as number))])));
  }
  if (suite === 'all' || suite === 'reading') for (let trial = 0; trial < readingTrials; trial++) for (const renderer of (trial % 2 ? ['markstream', 'limr'] : ['limr', 'markstream']) as Renderer[]) {
    const { page, cdp, errors } = await newPage(renderer, 'default');
    try {
      await page.waitForFunction(() => !!window.richInitial);
      const initial = await page.evaluate(() => window.richInitial!);
      const initialSettle = await page.evaluate(() => window.comparison.settle());
      const initialTelemetry = await page.evaluate(() => window.comparison.telemetry());
      const initialResources = await resources(page);
      const initialHeapBytes = await heap(cdp);
      if (trial === 0) await page.screenshot({ path: resolve(artifacts, `${renderer}-initial.png`) });
      await page.evaluate(() => window.comparison.monitor('scroll'));
      const before = await metrics(cdp);
      await cdp.send('Input.synthesizeScrollGesture', { x: 950, y: 650, yDistance: -15000, speed: 3000, gestureSourceType: 'mouse' });
      await cdp.send('Input.synthesizeScrollGesture', { x: 950, y: 650, yDistance: 6000, speed: 3000, gestureSourceType: 'mouse' });
      const after = await metrics(cdp);
      const scrolling = await page.evaluate(() => ({ ...window.comparison.telemetry(), state: window.comparison.richState() }));
      const seeks = [];
      for (const fraction of [.5, 1, 0]) {
        await page.evaluate(fraction => { window.comparison.monitor(`seek-${fraction}`); window.scrollTo(0, (document.documentElement.scrollHeight-innerHeight)*fraction); }, fraction);
        const settled = await page.evaluate(() => window.comparison.settle(8000));
        seeks.push({ fraction, ...settled, telemetry: await page.evaluate(() => window.comparison.telemetry()) });
        if (trial === 0) await page.screenshot({ path: resolve(artifacts, `${renderer}-seek-${fraction}.png`) });
      }
      const heapAfterBytes = await heap(cdp);
      const readingPassed = initialSettle.settled && seeks.every(seek => seek.settled) && !!seeks.find(seek => seek.fraction === 1)?.state.endVisible && errors.length === 0;
      const sample = { suite: 'default-reading', renderer, trial, sourceSHA256: hash(richFixture(sections)), readingPassed, initial, initialSettle, initialTelemetry, initialResources, initialHeapBytes, scrolling: { ...scrolling, mainThreadMs: (after.TaskDuration-before.TaskDuration)*1000 }, seeks, heapAfterBytes, resourcesAfter: await resources(page), errors };
      results.push(sample); await save();
      console.log(JSON.stringify({ suite: 'default-reading', renderer, trial, readableMs: initial.readableFromNavigationMs, initialSettled: initialSettle.settled, settleMs: initialSettle.elapsedMs, scrollP95: scrolling.frameP95Ms, scrollMax: scrolling.frameMaxMs, heapMB: heapAfterBytes/1048576, errors }));
    } finally { await page.close(); }
  }
  await save();
  console.log(`Saved ${results.length} samples to ${output}`);
} finally { await browser.close(); await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())); }
