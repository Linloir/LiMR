import { chromium, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { environment, hash, root, saveResult } from '../shared/environment';
import { stats, order } from '../shared/stats';

const metadata = await environment();
const paper = await readFile(`${root}/playground/presets/scikit-learn-paper.md`, 'utf8');
const browser = await chromium.launch({ args: ['--enable-precise-memory-info'] });
const results = [];
async function settle(page: Page, kp: boolean) {
  return page.evaluate(async kp => {
    const start = performance.now(); let stable = 0, previous = '';
    for (let attempt = 0; attempt < 300; attempt++) {
      await new Promise(requestAnimationFrame);
      const paragraphs = [...document.querySelectorAll<HTMLElement>('article p,article li')].filter(e => { const r = e.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 0 && !e.querySelector('p,ul,ol,aside'); });
      const signature = paragraphs.map(e => `${e.getBoundingClientRect().width}:${e.getBoundingClientRect().height}:${e.dataset.limrKpLines}`).join('|');
      const ready = !kp || paragraphs.every(e => !e.hasAttribute('data-limr-kp-stale')) && !!document.querySelector('[data-limr-kp]');
      stable = ready && signature === previous ? stable + 1 : 0; previous = signature;
      if (stable >= 4) return { settled: true, elapsedMs: performance.now() - start, visibleParagraphs: paragraphs.length };
    }
    return { settled: false, elapsedMs: performance.now() - start, visibleParagraphs: 0 };
  }, kp);
}
try {
  for (const width of [1380, 390]) for (let trial = 0; trial < 3; trial++) for (const mode of order(['standard', 'justify', 'knuth-plass'], trial)) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Performance.enable');
    const metrics = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m: { name: string; value: number }) => [m.name, m.value])) as Record<string, number>;
    try {
      await page.goto(process.env.BENCH_URL ?? 'http://127.0.0.1:4174/LiMR/');
      await page.getByRole('button', { name: '加载', exact: true }).click();
      await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
      await page.evaluate(() => document.fonts.ready);
      const original = await page.locator('article > p').first().textContent();
      const activationStart = await page.evaluate(() => performance.now());
      if (mode !== 'standard') {
        await page.getByRole('button', { name: '排版模式', exact: true }).click();
        await page.getByRole('button', { name: mode === 'knuth-plass' ? 'Knuth–Plass' : '两端对齐', exact: true }).click();
      }
      const activationState = await settle(page, mode === 'knuth-plass');
      const activationMs = await page.evaluate(start => performance.now() - start, activationStart);
      await page.evaluate(() => { (window as any).kpFirstGlue = document.querySelector('article > p .limr-kp-glue'); });
      const before = await metrics();
      const scroll = await page.evaluate(async () => {
        const sweeps = [];
        for (let pass = 0; pass < 3; pass++) {
          const frames = [];
          for (let step = 0; step < 120; step++) {
            const start = performance.now();
            scrollTo(0, (step < 60 ? step / 60 : (120 - step) / 60) * (document.documentElement.scrollHeight - innerHeight));
            await new Promise(requestAnimationFrame); frames.push(performance.now() - start);
          }
          sweeps.push(frames);
        }
        scrollTo(0, 0); return sweeps;
      });
      const afterScroll = await metrics();
      await settle(page, mode === 'knuth-plass');
      const cachedNodesPreserved = await page.evaluate(() => document.querySelector('article > p .limr-kp-glue') === (window as any).kpFirstGlue);
      const resize = [];
      for (const nextWidth of [1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200, 1380]) {
        const before = await page.evaluate(() => performance.now());
        await page.setViewportSize({ width: nextWidth, height: 1000 });
        const frameMs = await page.evaluate(async before => { await new Promise(requestAnimationFrame); return performance.now() - before; }, before);
        const state = await settle(page, mode === 'knuth-plass');
        const measured = await page.evaluate(before => ({ settledMs: performance.now() - before, contentWidth: document.querySelector('article > p')!.getBoundingClientRect().width, horizontalOverflow: document.documentElement.scrollWidth - innerWidth }), before);
        resize.push({ viewportWidth: nextWidth, frameMs, ...measured, ...state });
      }
      // Native range must survive a narrow resize without replacing its text.
      await page.locator('article > p').first().evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
      const selectedBefore = await page.evaluate(() => getSelection()!.toString());
      await page.setViewportSize({ width: 390, height: 1000 });
      const selectionPreserved = await page.evaluate(text => getSelection()!.toString() === text, selectedBefore);
      await page.evaluate(() => getSelection()!.removeAllRanges());
      await settle(page, mode === 'knuth-plass');
      const contentPreserved = await page.locator('article > p').first().textContent() === original;
      await cdp.send('HeapProfiler.collectGarbage');
      const heapBytes = (await cdp.send('Runtime.getHeapUsage')).usedSize;
      const result = { mode, trial, viewport: { width, height: 1000 }, activationMs, activationState,
        scroll: scroll.map(samples => ({ ...stats(samples), over50Ms: samples.filter(v => v > 50).length })),
        scrollMainThreadMs: (afterScroll.TaskDuration - before.TaskDuration) * 1000,
        resize, resizeFrames: stats(resize.map(r => r.frameMs)), resizeSettled: stats(resize.map(r => r.settledMs)),
        cachedNodesPreserved, selectionPreserved, contentPreserved, heapBytes, nodes: await page.locator('*').count(), typesetParagraphs: await page.locator('[data-limr-kp]').count(), errors,
        valid: activationState.settled && resize.every(r => r.settled && r.horizontalOverflow <= 1) && contentPreserved && selectionPreserved && cachedNodesPreserved && errors.length === 0 };
      results.push(result);
      await saveResult('kp-browser', { environment: { ...metadata, browser: browser.version() }, fixture: { characters: paper.length, sourceSHA256: hash(paper) }, methodology: 'Production Playground, scikit-learn paper, default Reader with TOC/sidebar/plugins. Three isolated pages per mode and viewport. Fonts ready before mode activation; activation includes menu/protocol and lazy module load, not navigation. Three 120-step down/up sweeps; first encounters uncached paragraphs. Scroll/resize frame timing ends at next rAF (not a completed paint); settled resize additionally waits four identical visible-layout frames. Twelve 390–1380px viewport changes include actual content-width changes. Raw samples, CDP scroll task time and post-GC heap retained. Native range, text, cached nodes and horizontal overflow checked.', results });
      console.log(JSON.stringify({ width, mode, trial, valid: result.valid, activationMs, scrollP95: result.scroll.map(s => s.p95Ms), resizeP95: result.resizeFrames.p95Ms }));
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
