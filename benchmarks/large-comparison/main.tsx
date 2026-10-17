import { createRoot } from 'react-dom/client';

const renderer = new URLSearchParams(location.search).get('renderer') ?? 'limr';
const host = document.querySelector<HTMLElement>('#host')!;
const style = document.createElement('style');
style.textContent = 'body{margin:0;background:#fffefa;color:#222;font:16px/1.6 Arial,sans-serif}#host{max-width:821px;margin:24px auto;padding:0 24px}.comparison-prose table{border-collapse:collapse}.comparison-prose th,.comparison-prose td{border:1px solid #ddd;padding:6px 12px}.comparison-prose pre{overflow:auto}.comparison-prose .shiki span{color:var(--shiki-light)}.comparison-prose img{max-width:100%}' + (renderer === 'limr' ? '#host{max-width:1440px;box-sizing:border-box}' : '');
document.head.append(style);
const adapter = renderer === 'limr' ? await import('./limr') : renderer === 'markstream'
  ? await import('../renderers/adapters/markstream') : await import('../renderers/adapters/react-markdown');
if ('styles' in adapter) await adapter.styles();
const root = createRoot(host), state: any = { ready: true, renderer };
(window as any).largeComparison = state;
const frame = () => new Promise<number>(resolve => requestAnimationFrame(resolve));
function visible(node: Element | null) {
  if (!node || node.closest('[data-window-parked]') || !node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) return false;
  const box = node.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight && box.width > 0 && box.height > 0;
}
function readingBody() { return host.querySelector('.limr-reader-content') ?? host; }
function firstContent() {
  const body = readingBody(), heading = body.querySelector('h1'), paragraph = body.querySelector('p:not([data-limr-ignore])');
  return !!heading?.textContent?.includes('LARGE-COMPARISON-START') && visible(heading) && visible(paragraph);
}
function viewport() {
  const body = readingBody(), rect = body.getBoundingClientRect();
  const hits = [.25, .5, .75].map(y => document.elementsFromPoint(Math.max(1, rect.left) + Math.min(rect.width, innerWidth - rect.left) / 2, innerHeight * y)
    .some(node => { const content = node.closest('p,li,pre,table,blockquote,h1,h2,h3,img,svg,.code-block-container'); return !!content && body.contains(content) && visible(content) && !content.closest('.node-placeholder'); }));
  const paragraphs = body.querySelectorAll('p');
  const tail = [...paragraphs].slice(-8).some(node => visible(node) && node.textContent?.includes('LARGE-COMPARISON-END'));
  return { covered: hits.some(Boolean), hits, tail, first: firstContent(), width: rect.width,
    elements: host.querySelectorAll('*').length, mountedBlocks: host.querySelectorAll('[data-limr-block]').length,
    headings: body.querySelectorAll('h1,h2').length, code: body.querySelectorAll('pre').length,
    math: body.querySelectorAll('.katex').length, tables: body.querySelectorAll('table').length,
    images: body.querySelectorAll('img').length, loadedImages: [...body.querySelectorAll('img')].filter(image => image.complete && image.naturalWidth > 0).length };
}
state.prepare = async (file: string) => { state.input = await (await fetch('/input/' + file)).blob(); };
state.startLoad = async () => {
  state.start = performance.now(); let misplacedAt: number | null = null, lastProbe = 0, initialMissing = false; const frames: number[] = [], tasks: number[] = []; let previous = state.start, active = true;
  const observer = new PerformanceObserver(list => tasks.push(...list.getEntries().map(entry => entry.duration))); observer.observe({ type: 'longtask' });
  const tick = (now: number) => { frames.push(now - previous); previous = now; if (active) requestAnimationFrame(tick); }; requestAnimationFrame(tick);
  if (renderer === 'limr') root.render((adapter as typeof import('./limr')).render(state.input, state));
  else { const source = await state.input.text(); root.render((adapter as typeof import('../renderers/adapters/markstream')).render(source, false, 'default')); }
  while (!firstContent()) {
    if (state.error) throw new Error(state.error);
    if (performance.now() - state.start > 170000) throw new Error('Initial content not readable within 170s');
    const now = performance.now();
    if (now - lastProbe > 250) {
      lastProbe = now;
      const lastHeading = [...readingBody().querySelectorAll('h1')].at(-1);
      const endAtTop = scrollY === 0 && lastHeading?.textContent === 'Final chapter';
      misplacedAt = endAtTop ? misplacedAt ?? now : null;
      if (misplacedAt !== null && now - misplacedAt >= 5000) { initialMissing = true; break; }
    }
    await frame();
  }
  await document.fonts.ready; await frame(); await frame();
  const firstReadableMs = initialMissing ? null : performance.now() - state.start;
  active = false; observer.disconnect();
  return { firstReadableMs, initialMissing, sessionReadyMs: state.sessionReadyMs ?? null, frames, tasks, loading: state.loading ?? null, initial: viewport() };
};
state.probe = async (offsets: number[]) => {
  const seeks = [];
  for (const [index, fraction] of [0, .5, 1, 0].entries()) {
    if (renderer === 'limr') state.api.scrollToSource({ start: offsets[index], end: offsets[index] + 1 });
    else window.scrollTo(0, Math.max(0, document.documentElement.scrollHeight - innerHeight) * fraction);
    await new Promise(resolve => setTimeout(resolve, 450)); await frame();
    seeks.push({ fraction, ...viewport() });
  }
  const steady: number[] = [], fast: number[] = [];
  for (const [frames, delta] of [[steady, 8], [fast, 120]] as const) {
    let previous = performance.now();
    for (let index = 0; index < 60; index++) {
      await frame(); const now = performance.now(); frames.push(now - previous); previous = now;
      const target = host.querySelector('[data-limr-windowed]') ?? host;
      const event = new WheelEvent('wheel', { deltaY: delta, bubbles: true, cancelable: true }); target.dispatchEvent(event);
      if (!event.defaultPrevented) window.scrollBy(0, delta);
    }
  }
  return { seeks, steady, fast, final: viewport() };
};
