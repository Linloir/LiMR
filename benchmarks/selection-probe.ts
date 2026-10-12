import type { Page } from '@playwright/test';

/** Real pointer moves at the browser's cadence, including visible paints during
 * the gesture. A fast final render alone cannot pass the starvation regression. */
export async function dragSelection(page: Page, selector = '.limr-prose > p', moves = 90) {
  const started = Date.now();
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const point = await target.evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const text = walker.nextNode()!;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, 1);
    const rect = range.getBoundingClientRect(), box = element.getBoundingClientRect();
    return { x: rect.left + 1, y: (rect.top + rect.bottom) / 2, width: box.width };
  });
  await page.mouse.move(point.x, point.y);
  if (process.env.DEBUG_SELECTION_BENCH) console.log('Selection probe ready', { elapsedMs: Date.now() - started, point });
  await page.evaluate(() => {
    const probe = window.selectionProbe; probe.updates = probe.dragging = 0;
    const data = { frames: [] as number[], latency: [] as number[], longTasks: [] as number[], nativeChanges: 0, paints: 0, start: performance.now(), latest: 0, active: true };
    let previous = performance.now();
    const handlers = {
      tick(now: number) { if (!data.active) return; data.frames.push(now - previous); previous = now; requestAnimationFrame(handlers.tick); },
      changed() { data.latest = performance.now(); data.nativeChanges++; },
      percentile(values: number[], p: number) { return values.slice().sort((a, b) => a - b)[Math.floor(values.length * p)] ?? 0; },
      finish() {
        data.active = false; mutations.disconnect(); tasks.disconnect(); document.removeEventListener('selectionchange', handlers.changed);
        return { nativeChanges: data.nativeChanges, updates: probe.updates, dragging: probe.dragging, paints: data.paints, frameP95Ms: handlers.percentile(data.frames, .95), maxFrameMs: Math.max(...data.frames), paintP95Ms: handlers.percentile(data.latency, .95), longTasks: data.longTasks, rectangles: document.querySelectorAll('.limr-paint-rect').length, elapsedMs: performance.now() - data.start };
      },
    };
    requestAnimationFrame(handlers.tick);
    document.addEventListener('selectionchange', handlers.changed);
    const mutations = new MutationObserver(() => {
      if (data.latest && document.querySelector('.limr-paint-selection')) { data.paints++; data.latency.push(performance.now() - data.latest); data.latest = 0; }
    });
    const layer = document.querySelector('.limr-paint-layer');
    if (layer) mutations.observe(layer, { childList: true, attributes: true, subtree: true });
    const tasks = new PerformanceObserver(list => data.longTasks.push(...list.getEntries().map(entry => entry.duration)));
    tasks.observe({ type: 'longtask' });
    (window as any).finishSelectionProbe = handlers.finish;
  });
  await page.mouse.down();
  // Move forward/back through a paragraph without lifting the button. Every
  // step changes the native selection; there is no artificial quiet interval.
  for (let i = 0; i < moves; i++) {
    const x = point.x + 12 + (i % 30) / 30 * Math.min(point.width - 24, 600);
    await page.mouse.move(x, point.y + Math.floor(i / 30) % 2 * 28);
    if (process.env.DEBUG_SELECTION_BENCH && i % 30 === 29) console.log('Selection probe moves', { moves: i + 1, elapsedMs: Date.now() - started });
  }
  const during = await page.evaluate(() => (window as any).finishSelectionProbe()) as {
    nativeChanges: number; updates: number; dragging: number; paints: number; frameP95Ms: number; maxFrameMs: number; paintP95Ms: number; longTasks: number[]; rectangles: number; elapsedMs: number;
  };
  await page.mouse.up();
  return during;
}
