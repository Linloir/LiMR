import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Reader, type ReaderProps } from '../../src/components/Reader';
import { AsyncReader } from '../../src/components/AsyncReader';
import type { DocumentSessionState } from '../../src/core';
import '../../src/styles.css';
import 'katex/dist/katex.min.css';

export interface ReadingLongTask { name: string; start: number; duration: number }
interface ReadingOptions extends Partial<ReaderProps> {
  reserveSidebar?: boolean;
  renderer?: 'reader' | 'async';
  loadingMode?: 'blocking' | 'progressive';
}
interface LoadingSample {
  at: number; status: string; phase: string; complete: boolean; error?: string;
  capabilities: DocumentSessionState['capabilities'];
}
declare global {
  interface Window {
    limrReadingReady: boolean;
    limrReadingRender: (next: ReadingOptions) => void;
    limrReadingEvents: ReadingLongTask[];
    limrReadingLoading: LoadingSample[];
    limrReadingLoaded: boolean;
  }
}
const root = createRoot(document.getElementById('app')!);
const state: ReaderProps = { source: '', typography: 'standard', sidebar: true, sidebarCollapse: true };
const style = document.createElement('style');
// The fixture has 72px of horizontal padding; preserve the reader's ordinary
// 1120px sidebar breakpoint without adding layout containment to the frame.
style.textContent = `body{margin:0;background:#f9f8f5}#app{max-width:1500px;margin:auto;padding:24px 36px}
@media(min-width:1192px){
  .limr-reading-reserve-sidebar:not([data-sidebar]){grid-template-columns:minmax(0,1fr) var(--limr-sidebar-width,clamp(270px,calc(50% - 450px),480px))}
  .limr-reading-reserve-sidebar[data-toc]:not([data-sidebar]){grid-template-columns:var(--limr-toc-width,clamp(190px,calc(20% - 100px),280px)) minmax(0,1fr) var(--limr-sidebar-width,clamp(270px,calc(50% - 450px),480px))}
  .limr-reading-reserve-sidebar .limr-reader-content{align-self:stretch;overflow:clip;overflow-anchor:none}
  .limr-reading-reserve-sidebar .limr-reader-content>.limr-prose{display:flow-root}
}`;
document.head.append(style);
const worker = () => new Worker(new URL('../../src/worker.ts', import.meta.url), { type: 'module' });
const loadState = (state: DocumentSessionState) => {
  window.limrReadingLoaded = state.status === 'ready';
  window.limrReadingLoading.push({ at: performance.now(), status: state.status, phase: state.phase,
    complete: state.complete, capabilities: state.capabilities, error: state.error?.message });
};
window.limrReadingRender = ({ reserveSidebar = false, renderer = 'reader', loadingMode = 'blocking', ...next }) => {
  Object.assign(state, next, { className: reserveSidebar ? 'limr-reading-reserve-sidebar' : undefined });
  window.limrReadingLoading = []; window.limrReadingLoaded = renderer === 'reader';
  if (renderer === 'reader') root.render(createElement(Reader, state));
  else {
    const reader = { ...state }, input = reader.source ?? '';
    delete reader.source; delete reader.document; delete reader.streaming;
    root.render(createElement(AsyncReader, { ...reader, input, loading: { worker, mode: loadingMode, fallback: 'error' }, onLoadStateChange: loadState }));
  }
};
window.limrReadingEvents = [];
window.limrReadingLoading = [];
window.limrReadingLoaded = false;
new PerformanceObserver(list => {
  window.limrReadingEvents.push(...list.getEntries().map(entry => ({ name: entry.name, start: entry.startTime, duration: entry.duration })));
}).observe({ type: 'longtask', buffered: true });
window.limrReadingReady = true;
