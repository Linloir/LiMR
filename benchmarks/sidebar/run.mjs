import { chromium } from '@playwright/test';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { readFile, writeFile, mkdir, cp, symlink, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { resolve, dirname, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { environment, root } from '../shared/environment.ts';
import { stats } from '../shared/stats.ts';
import { browserSettings, inspectBrowserIdentity, beginBrowserCase, finishBrowserCase } from '../shared/browser-environment.mjs';
import { sidebarCorpus } from './corpus.ts';

const hash = value => createHash('sha256').update(value).digest('hex');
async function fingerprint(directory) {
  const files = {};
  async function visit(path) {
    for (const entry of await readdir(resolve(directory, path), { withFileTypes: true })) {
      const name = path ? `${path}/${entry.name}` : entry.name;
      if (entry.isDirectory()) await visit(name); else files[name] = hash(await readFile(resolve(directory, name)));
    }
  }
  await visit(''); return { sha256: hash(JSON.stringify(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)))), files };
}
const output = resolve(process.env.BENCH_SIDEBAR_OUTPUT ?? 'artifacts/benchmarks/sidebar-1.3.4');
const baseline = process.env.BENCH_SIDEBAR_BASELINE ?? '1b3d4d961dc72ed3bda734802108ea4a09ae88e4';
const repeats = Number(process.env.BENCH_SIDEBAR_TRIALS ?? 3);
const sizes = (process.env.BENCH_SIDEBAR_SIZES ?? '5,50').split(',').map(Number);
if (!Number.isInteger(repeats) || repeats < 1 || sizes.some(size => !Number.isFinite(size) || size <= 0)) throw new Error('Invalid benchmark trials/sizes');
await mkdir(output, { recursive: true });
const settings = browserSettings(), metadata = await environment();
const corpora = new Map(sizes.map(size => [size, sidebarCorpus(size)]));
for (const [size, corpus] of corpora) await writeFile(resolve(output, `corpus-${size}.md`), corpus.source);
const builds = {};
const reuse = process.env.BENCH_SIDEBAR_REUSE === '1' ? JSON.parse(await readFile(resolve(output, 'results.json'), 'utf8')) : null;
const require = createRequire(import.meta.url);
for (const label of ['baseline', 'current']) {
  // Immutable copies and identical benchmark fixtures; no development server/HMR.
  const snapshot = resolve(output, `${label}-source`), dist = resolve(output, label);
  if (reuse) {
    const saved = reuse.builds[label];
    if (reuse.environment.lockSHA256 !== metadata.lockSHA256 || reuse.builds.baseline.revision !== baseline
      || saved.source.sha256 !== (await fingerprint(label === 'current' ? resolve(root, 'src') : resolve(snapshot, 'src'))).sha256
      || saved.bundle.sha256 !== (await fingerprint(dist)).sha256) throw new Error('Saved sidebar build inputs do not match');
    for (const file of ['main.tsx', 'index.html']) if (!Buffer.from(await readFile(resolve(snapshot, 'benchmarks/sidebar', file))).equals(await readFile(resolve(root, 'benchmarks/sidebar', file)))) throw new Error('Saved sidebar fixture differs');
    builds[label] = saved; continue;
  }
  await mkdir(snapshot, { recursive: true });
  if (label === 'baseline') {
    const archive = execFileSync('git', ['archive', '--format=tar', baseline, 'src', 'package.json'], { cwd: root, maxBuffer: 32 * 1024 * 1024 });
    execFileSync('tar', ['-xf', '-', '-C', snapshot], { input: archive });
  } else {
    await cp(resolve(root, 'src'), resolve(snapshot, 'src'), { recursive: true });
    await cp(resolve(root, 'package.json'), resolve(snapshot, 'package.json'));
  }
  await cp(resolve(root, 'benchmarks/sidebar'), resolve(snapshot, 'benchmarks/sidebar'), { recursive: true });
  await symlink(resolve(root, 'node_modules'), resolve(snapshot, 'node_modules'), 'dir').catch(error => { if (error.code !== 'EEXIST') throw error; });
  await build({ configFile: false, root: resolve(snapshot, 'benchmarks/sidebar'), base: `/${label}/`, plugins: [react()], logLevel: 'warn',
    resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] }) }] },
    worker: { format: 'es' }, build: { outDir: dist, emptyOutDir: true, reportCompressedSize: false } });
  builds[label] = { version: JSON.parse(await readFile(resolve(snapshot, 'package.json'), 'utf8')).version,
    revision: label === 'baseline' ? baseline : metadata.revision, source: await fingerprint(resolve(snapshot, 'src')), bundle: await fingerprint(dist) };
}
const sourceFingerprint = await fingerprint(resolve(root, 'src'));
if (sourceFingerprint.sha256 !== builds.current.source.sha256) throw new Error('Workspace source changed while freezing benchmark');
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(output, `.${pathname}`);
    if (!file.startsWith(output + sep)) throw new Error('Invalid path');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.md': 'text/plain', '.woff2': 'font/woff2' })[extname(file)] ?? 'application/octet-stream');
    response.end(await readFile(file));
  } catch { response.statusCode = 404; response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseURL = `http://127.0.0.1:${server.address().port}`;
const runs = [];
let pending;
const browser = await chromium.launch(settings.launchOptions);
const identity = await inspectBrowserIdentity(browser, settings);
const save = async (complete, error) => writeFile(resolve(output, 'results.json'), JSON.stringify({
  complete, error, pending, environment: metadata, browser: identity, builds,
  corpus: Object.fromEntries([...corpora].map(([size, corpus]) => [size, { bytes: corpus.bytes, utf16: corpus.source.length, sha256: hash(corpus.source), sections: corpus.starts.length, annotations: corpus.annotations }])),
  measurement: 'Production, automatic windowing, real Worker blocking load, default animations and features. Fresh pages, alternating version order, no CPU throttling. Loading excludes generation/fetch. rAF intervals measure scheduling, not physical presentation latency. Synthetic repeated Chinese prose has unique sections and notes. Raw samples and CDP layout/script durations are retained.', runs,
}, null, 2) + '\n');
const metrics = async session => Object.fromEntries((await session.send('Performance.getMetrics')).metrics.map(({ name, value }) => [name, value]));
const delta = (before, after) => Object.fromEntries(['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount'].map(key => [key, after[key] - before[key]]));
const geometry = page => page.locator('.limr-sidebar').evaluate(rail => {
  const origin = rail.getBoundingClientRect().top;
  return [...rail.querySelectorAll('.limr-sidebar-card')].map(card => ({ id: card.dataset.occurrence, top: card.getBoundingClientRect().top - origin, screenTop: card.getBoundingClientRect().top, height: card.getBoundingClientRect().height }));
});
const monitor = page => page.evaluate(() => {
  const probe = window.sidebarProbe = { started: performance.now(), frames: [], previous: null, running: true };
  function step(now) {
    if (!probe.running) return;
    if (probe.previous !== null) probe.frames.push(now - probe.previous);
    probe.previous = now; requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
});
const stop = async page => {
  const result = await page.evaluate(() => { const probe = window.sidebarProbe; probe.running = false; return { frames: probe.frames, longtasks: window.sidebarAudit.events.filter(event => event.start >= probe.started) }; });
  return { ...result, frames: stats(result.frames) };
};
async function scrollProbe(page, fast) {
  await monitor(page);
  const result = await page.evaluate(async fast => {
    let maxCards = 0, maxBlocks = 0, emptySamples = 0, last = performance.now();
    for (let i = 0; i < 120; i++) {
      await new Promise(requestAnimationFrame);
      const now = performance.now();
      if (i % 6 === 0) {
        maxCards = Math.max(maxCards, document.querySelectorAll('.limr-sidebar-card').length);
        maxBlocks = Math.max(maxBlocks, document.querySelectorAll('[data-limr-block]').length);
        const article = document.querySelector('.limr-reader-content article'), box = article.getBoundingClientRect();
        if (![.2, .5, .8].some(y => document.elementsFromPoint(box.x + box.width / 2, innerHeight * y).some(element => {
          const block = element.closest('[data-limr-block]'); return block && !block.closest('[inert],[data-window-parked]') && block.textContent.trim();
        }))) emptySamples++;
      }
      scrollBy(0, fast ? 120 : 480 * (now - last) / 1000); last = now;
    }
    return { maxCards, maxBlocks, emptySamples };
  }, fast);
  return { ...result, ...await stop(page) };
}
try {
  for (let repeat = 0; repeat < repeats; repeat++) for (const size of sizes) for (const collapse of [false, true]) {
    for (const label of repeat % 2 ? ['current', 'baseline'] : ['baseline', 'current']) {
      const corpus = corpora.get(size), errors = [];
      pending = { label, size, collapse, repeat, stage: 'mount', errors };
      console.log(JSON.stringify(pending));
      const page = await browser.newPage({ viewport: { width: 1800, height: 1000 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${baseURL}/${label}/`);
      const browserCase = await beginBrowserCase(browser, page);
      const session = await page.context().newCDPSession(page); await session.send('Performance.enable');
      const beforeMount = await metrics(session);
      const mount = await page.evaluate(async ({ size, collapse }) => {
        const input = await (await fetch(`/corpus-${size}.md`)).blob(), audit = window.sidebarAudit;
        const start = performance.now(), frames = []; let previous = start;
        audit.mount(input, collapse);
        do {
          await new Promise(requestAnimationFrame); const now = performance.now(); frames.push(now - previous); previous = now;
          if (audit.state?.status === 'error') throw new Error(audit.state.error?.message);
          if (now - start > 120_000) throw new Error('Complete loading timed out');
        } while (audit.state?.status !== 'ready' || !document.querySelector('.limr-sidebar-card'));
        await document.fonts.ready; await new Promise(requestAnimationFrame);
        return { readyMs: performance.now() - start, frames, longtasks: audit.events.filter(event => event.start >= start),
          sourceLength: audit.api.document.getSnapshot().source.length, windowed: !!document.querySelector('[data-limr-windowed]'),
          annotations: audit.runtime.decorations.get().annotations.size };
      }, { size, collapse });
      mount.frames = stats(mount.frames); mount.metrics = delta(beforeMount, await metrics(session));
      pending.mount = mount;
      await page.waitForTimeout(750);
      const visits = [];
      for (const section of [0, Math.floor(corpus.starts.length / 2), corpus.starts.length - 1]) {
        pending.stage = `section-${section}`;
        await page.mouse.click(2, 2);
        // Compare stable reading phases; immediate navigation during dismissal
        // is independently covered by the assertion-based regression test.
        await page.waitForTimeout(450);
        await page.evaluate(start => window.sidebarAudit.api.scrollToSource({ start, end: start + 1 }), corpus.starts[section]);
        await page.waitForTimeout(650);
        const target = page.locator('.limr-sidebar-card').filter({ hasText: `Note ${section}-2.` });
        const before = await geometry(page);
        await target.hover(); await page.waitForTimeout(450);
        const after = await geometry(page), id = await target.getAttribute('data-occurrence');
        const alignment = await target.evaluate((card, id) => Math.abs(card.getBoundingClientRect().top - window.sidebarAudit.referenceTop(id)), id);
        const movement = Math.max(...after.map(card => Math.abs(card.screenTop - (before.find(old => old.id === card.id)?.screenTop ?? card.screenTop))));
        await target.locator('.limr-sidebar-card-heading').click(); await page.mouse.move(2, 2); await page.waitForTimeout(550);
        const pinned = (await geometry(page)).find(card => card.id === id).screenTop;
        await page.locator('.limr-sidebar-card').filter({ hasText: `Note ${section}-1.` }).hover();
        await page.mouse.move(2, 2); await page.waitForTimeout(550);
        visits.push({ section, movement, alignment, pinnedReturn: Math.abs((await geometry(page)).find(card => card.id === id).screenTop - pinned),
          cards: await page.locator('.limr-sidebar-card').count(), blocks: await page.locator('[data-limr-block]').count() });
      }
      await page.mouse.click(2, 2);
      await page.waitForTimeout(450); pending.stage = 'hover';
      await page.evaluate(() => window.sidebarAudit.api.scrollToSource({ start: 0, end: 1 })); await page.waitForTimeout(700);
      const beforeHover = await metrics(session); await monitor(page);
      for (let i = 0; i < 12; i++) {
        const card = page.locator('.limr-sidebar-card').filter({ hasText: `Note 0-${i % 2}.` });
        await card.hover(); await page.waitForTimeout(75);
      }
      const hover = { ...await stop(page), metrics: delta(beforeHover, await metrics(session)) };
      await page.mouse.click(2, 2); await page.waitForTimeout(650);
      const beforeScroll = await metrics(session), steady = await scrollProbe(page, false), fast = await scrollProbe(page, true);
      pending.stage = 'final';
      const scrollMetrics = delta(beforeScroll, await metrics(session));
      await page.evaluate(() => { const audit = window.sidebarAudit, source = audit.api.document.getSnapshot().source; audit.api.scrollToSource({ start: source.indexOf('SIDEBAR-COMPLETE-BOOK-END'), end: source.length }); });
      await page.waitForTimeout(650);
      const finalVisible = await page.getByText('SIDEBAR-COMPLETE-BOOK-END').evaluate(element => { const box = element.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight; });
      const browserEnvironment = await finishBrowserCase(browser, page, browserCase, settings, identity);
      const result = { label, version: builds[label].version, size, collapse, repeat, mount, visits, hover, steady, fast, scrollMetrics, finalVisible, errors, browserEnvironment };
      runs.push(result); pending = undefined; await save(false);
      console.log(JSON.stringify({ label, size, collapse, repeat, readyMs: mount.readyMs, hoverLayoutMs: hover.metrics.LayoutDuration * 1000,
        steadyP95: steady.frames.p95Ms, fastP95: fast.frames.p95Ms, maxCards: Math.max(...visits.map(visit => visit.cards), steady.maxCards, fast.maxCards), visits, errors, environmentVerified: browserEnvironment.performanceEnvironmentVerified }));
      await page.close();
    }
  }
  await save(true);
} catch (error) { await save(false, String(error)); throw error; }
finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
