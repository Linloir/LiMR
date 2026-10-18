import { createRoot } from 'react-dom/client';
import { AsyncReader, useLiMR } from '../../src';
import { useRuntime } from '../../src/react/context';
import { sourceRangeStartRect } from '../../src/react/source-geometry';
import '../../src/styles.css';
import 'katex/dist/katex.min.css';

const audit: any = (window as any).sidebarAudit = { events: [], state: null };
const root = createRoot(document.getElementById('app')!);
function Bridge() { audit.api = useLiMR(); audit.runtime = useRuntime(); return null; }
document.body.style.cssText = 'margin:0;background:#fffefa';
document.getElementById('app')!.style.cssText = 'max-width:1440px;margin:auto;padding:24px';
new PerformanceObserver(list => audit.events.push(...list.getEntries().map(entry => ({ start: entry.startTime, duration: entry.duration })))).observe({ type: 'longtask', buffered: true });
audit.mount = (input: Blob, sidebarCollapse: boolean) => {
  audit.events = []; audit.state = null; audit.started = performance.now();
  root.render(<AsyncReader input={input} sidebar sidebarCollapse={sidebarCollapse} typography="standard"
    loading={{ mode: 'blocking', worker: () => new Worker(new URL('../../src/worker.ts', import.meta.url), { type: 'module' }), fallback: 'error' }}
    onLoadStateChange={state => { audit.state = state; }}><Bridge /></AsyncReader>);
};
audit.referenceTop = (id: string) => {
  const runtime = audit.runtime, decorations = runtime.decorations.get();
  const occurrence = decorations.occurrences.find((item: { id: string }) => item.id === id);
  return occurrence && sourceRangeStartRect(runtime, decorations.referenceRanges.get(id) ?? occurrence.range)?.top;
};
