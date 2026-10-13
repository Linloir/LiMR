import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { richFixture } from './fixtures';
import type { Profile } from './options';

const params = new URLSearchParams(location.search);
const profile: Profile = params.get('profile') === 'default' ? 'default' : 'full-dom';
const host = document.querySelector<HTMLElement>('#host')!;
const style = document.createElement('style');
style.textContent = `body{margin:0;background:white;color:#222}#host{max-width:900px;margin:24px auto;padding:0 24px}body{font:16px/1.6 Arial,sans-serif}.comparison-prose table{border-collapse:collapse}.comparison-prose th,.comparison-prose td{border:1px solid #ddd;padding:6px 12px}.comparison-prose pre{overflow:auto}.comparison-prose .shiki span{color:var(--shiki-light)}.comparison-prose img{max-width:100%}` + (profile === 'full-dom' ? `
  #host *{animation:none!important;transition:none!important;content-visibility:visible!important}
  #host p{margin:0 0 16px}#host h2{font:600 24px/1.4 Arial;margin:24px 0 12px}
  #host table{border-collapse:collapse;margin:16px 0}#host th,#host td{border:1px solid #ddd;padding:6px 12px}
  #host pre,#host pre code{font:14px/21px monospace!important;white-space:pre!important}#host pre{overflow:auto}#host code{font-family:monospace}
  #host ul,#host ol{padding-left:24px}#host li>p{margin:0}#host .limr-paint-layer{display:none}
` : '');
document.head.append(style);
const frame = () => new Promise<number>(resolve => requestAnimationFrame(resolve));
const frames = async (n = 3) => { for (let i = 0; i < n; i++) await frame(); };
const adapter = params.get('renderer') === 'markstream' ? await import('./adapters/markstream') : params.get('renderer') === 'react-markdown' ? await import('./adapters/react-markdown') : await import('./adapters/limr');
if (profile === 'default') await adapter.styles();
let root: Root | undefined;
let phase = '';
let rafId = 0;
let lastFrame = 0;
const intervals: { at: number; duration: number; phase: string }[] = [];
const longTasks: { at: number; duration: number; phase: string }[] = [];
const shifts: { at: number; value: number; recentInput: boolean; phase: string }[] = [];
let observer: PerformanceObserver | undefined;
let shiftObserver: PerformanceObserver | undefined;

function monitor(next: string) {
  phase = next;
  intervals.length = 0; longTasks.length = 0; shifts.length = 0;
  lastFrame = performance.now();
  const tick = (now: number) => {
    intervals.push({ at: now, duration: now - lastFrame, phase }); lastFrame = now;
    rafId = requestAnimationFrame(tick);
  };
  cancelAnimationFrame(rafId); rafId = requestAnimationFrame(tick);
  observer?.disconnect();
  observer = new PerformanceObserver(list => { for (const item of list.getEntries()) longTasks.push({ at: item.startTime, duration: item.duration, phase }); });
  observer.observe({ type: 'longtask', buffered: false });
  shiftObserver?.disconnect();
  shiftObserver = new PerformanceObserver(list => { for (const item of list.getEntries()) {
    const entry = item as PerformanceEntry & { value: number; hadRecentInput: boolean };
    shifts.push({ at: entry.startTime, value: entry.value, recentInput: entry.hadRecentInput, phase });
  } });
  shiftObserver.observe({ type: 'layout-shift', buffered: false });
}
function quantile(values: number[], p: number) { return values.length ? [...values].sort((a,b) => a-b)[Math.ceil(values.length*p)-1] : 0; }
function telemetry() {
  const timings = intervals.map(v => v.duration);
  return { phase, frames: intervals.length, frameSamplesMs: timings, frameP95Ms: quantile(timings, .95), frameP99Ms: quantile(timings, .99), frameMaxMs: Math.max(0, ...timings), framesOver33Ms: timings.filter(v => v > 33.4).length,
    longTasks: [...longTasks], layoutShifts: [...shifts] };
}
async function reset() {
  if (root) flushSync(() => root!.unmount());
  root = undefined; host.replaceChildren(); window.scrollTo(0, 0); await frames();
}
function commit(source: string, streaming: boolean) {
  root ??= createRoot(host);
  const start = performance.now();
  flushSync(() => root!.render(adapter.render(source, streaming, profile)));
  host.getBoundingClientRect();
  return performance.now() - start;
}
function inspect(expectedHTML?: string) {
  const normalize = (text: string | null) => (text ?? '').replace(/\s+/g, '');
  const signature = (element: ParentNode) => ({
    headings: [...element.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e => normalize(e.textContent)),
    paragraphs: [...element.querySelectorAll('p')].filter(e => !e.closest('li')).map(e => normalize(e.textContent)),
    rows: [...element.querySelectorAll('tr')].map(e => [...e.querySelectorAll('th,td')].map(c => normalize(c.textContent))),
    items: [...element.querySelectorAll('li')].map(e => normalize(e.textContent)),
    code: [...element.querySelectorAll('pre code')].map(e => (e.textContent ?? '').replace(/\r\n/g, '\n').trimEnd()),
  });
  const actual = signature(host);
  const template = document.createElement('template');
  if (expectedHTML) template.innerHTML = expectedHTML;
  const expected = expectedHTML ? signature(template.content) : undefined;
  const mismatch = expected ? Object.keys(expected).filter(key => JSON.stringify(expected[key as keyof typeof expected]) !== JSON.stringify(actual[key as keyof typeof actual])) : [];
  return { elements: host.querySelectorAll('*').length, textCharacters: host.textContent?.length ?? 0, height: host.getBoundingClientRect().height,
    headings: actual.headings.length, rows: actual.rows.length, codeBlocks: actual.code.length,
    valid: expectedHTML ? mismatch.length === 0 : null, mismatch,
    ...(mismatch.length ? { actual, expected } : {}),
  };
}
function visible(el: Element) { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.height > 0; }
function richState() {
  const codes = [...host.querySelectorAll('.limr-code-block, .code-block-container, .comparison-code')];
  const visibleCodes = codes.filter(visible);
  const shadows = [...host.querySelectorAll('*')].filter(el => el.shadowRoot);
  const shadowElements = shadows.reduce((sum, el) => sum + el.shadowRoot!.querySelectorAll('*').length, 0);
  const visibleContent = [...host.querySelectorAll('h1,h2,p,li,table,pre,.limr-code-block,.code-block-container,img')].filter(el => visible(el) && (el.textContent!.trim().length > 0 || el instanceof HTMLImageElement));
  const visibleUnrenderedMath = [...host.querySelectorAll('.limr-math-source,.math-block,.math-inline-wrapper')].filter(el => visible(el) && !el.querySelector('.katex'));
  return {
    elements: host.querySelectorAll('*').length, shadowElements, height: host.getBoundingClientRect().height,
    headings: host.querySelectorAll('h2').length, firstHeading: host.querySelector('h2')?.textContent,
    lastHeading: [...host.querySelectorAll('h2')].at(-1)?.textContent,
    visibleHeadings: [...host.querySelectorAll('h1,h2')].filter(visible).map(el => el.textContent),
    visibleContentElements: visibleContent.length, blankViewport: visibleContent.length === 0,
    codeBlocks: codes.length, highlightedCodeBlocks: host.querySelectorAll('pre.shiki').length + shadows.filter(el => el.shadowRoot!.querySelector('pre')).length,
    visibleCodeBlocks: visibleCodes.length,
    visibleHighlightedCodeBlocks: visibleCodes.filter(el => el.querySelector('pre.shiki') || [...el.querySelectorAll('*')].some(child => child.shadowRoot?.querySelector('pre'))).length,
    math: host.querySelectorAll('.katex').length, mathFallbacks: host.querySelectorAll('.limr-math-source').length,
    visibleMathFallbacks: [...host.querySelectorAll('.limr-math-source')].filter(visible).length,
    visibleUnrenderedMath: visibleUnrenderedMath.length,
    placeholders: host.querySelectorAll('.node-placeholder').length,
    visiblePlaceholders: [...host.querySelectorAll('.node-placeholder')].filter(visible).length,
    visibleImages: [...host.querySelectorAll('img')].filter(visible).length,
    visibleLoadedImages: [...host.querySelectorAll('img')].filter(el => visible(el) && el.complete && el.naturalWidth > 0).length,
    images: [...host.querySelectorAll('img')].length,
    loadedImages: [...host.querySelectorAll('img')].filter(el => el.complete && el.naturalWidth > 0).length,
    hasEnd: host.textContent!.includes('END-OF-RICH-DOCUMENT'), endVisible: [...host.querySelectorAll('p')].some(el => el.textContent!.includes('END-OF-RICH-DOCUMENT') && visible(el)), scrollY,
  };
}

const api = {
  reset, inspect, richState, monitor, telemetry,
  async run({ source, chunkSize }: { source: string; chunkSize?: number }) {
    const samples: number[] = [];
    monitor('full-dom');
    const start = performance.now();
    if (chunkSize) {
      samples.push(commit('', true));
      for (let end = chunkSize; end < source.length + chunkSize; end += chunkSize) {
        samples.push(commit(source.slice(0, end), true)); await frame();
      }
      samples.push(commit(source, false));
    } else samples.push(commit(source, false));
    await frames();
    return { characters: source.length, updates: samples.length, totalMs: samples.reduce((a,b) => a+b, 0), p95Ms: quantile(samples, .95), maxMs: Math.max(...samples), finalMs: samples.at(-1)!, wallMs: performance.now() - start, telemetry: telemetry(), samples };
  },
  async startRich(sections = 240) {
    const source = richFixture(sections);
    monitor('initial');
    const start = performance.now();
    root = createRoot(host);
    root.render(adapter.render(source, false, profile));
    // Use an ordinary concurrent root in the real reading scenario. Only the
    // controlled throughput benchmark forces synchronous React commits.
    while (!host.firstElementChild) await frame();
    await frames(2);
    const state = richState();
    return { characters: source.length, sections, firstFrameMs: performance.now() - start,
      readableFrameMs: state.blankViewport ? null : performance.now() - start,
      readableFromNavigationMs: state.blankViewport ? null : performance.now(), state };
  },
  async settle(timeoutMs = 15000) {
    const start = performance.now(); let stable = 0; let last = '';
    while (performance.now() - start < timeoutMs) {
      await frames(3);
      const state = richState();
      const signature = JSON.stringify(state);
      const ready = !state.blankViewport && state.visiblePlaceholders === 0 && state.visibleUnrenderedMath === 0 && state.visibleCodeBlocks === state.visibleHighlightedCodeBlocks && state.visibleImages === state.visibleLoadedImages;
      stable = ready && signature === last ? stable + 1 : 0; last = signature;
      if (stable >= 5) return { settled: true, elapsedMs: performance.now()-start, fromNavigationMs: performance.now(), state };
    }
    return { settled: false, elapsedMs: performance.now()-start, fromNavigationMs: performance.now(), state: richState() };
  },
};
declare global { interface Window { comparison: typeof api; richInitial?: Awaited<ReturnType<typeof api.startRich>> } }
window.comparison = api;
if (profile === 'default') window.richInitial = await api.startRich(Number(params.get('sections') ?? 240));
