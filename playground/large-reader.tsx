import { useState } from 'react';
import { standard } from '../src/extensions';
import type { Annotation, DocumentWorkerPort, RendererExtension } from '../src';
import type { DocumentWorkerResponse } from '../src/worker-api';
import { createRoot } from 'react-dom/client';
import { Reader, AsyncReader, useLiMR, type AsyncReaderProps } from '../src';
import '../src/styles.css';
import 'katex/dist/katex.min.css';
import { useRuntime } from '../src/react/context';
import { sourceRangeStartRect } from '../src/react/source-geometry';

const root = createRoot(document.getElementById('root')!);
const worker = () => { audit.workerStarts = (audit.workerStarts ?? 0) + 1; const port = new Worker(new URL('../src/worker.ts', import.meta.url), { type: 'module' }); port.addEventListener('message', event => { if (event.data.type === 'snapshot-end' || event.data.type === 'snapshot' && event.data.complete) audit.workerComplete = performance.now(); }); return port; };
// Functional handoff tests hold only the final result from a real worker. This
// is never enabled by loading/performance benchmarks; ACK packets still flow.
const heldWorker = (): DocumentWorkerPort => {
  const port = worker(), events = new EventTarget(); let final: MessageEvent | undefined;
  audit.completionQueued = false;
  audit.releaseCompletion = () => { if (final) { const event = final; final = undefined; events.dispatchEvent(new MessageEvent('message', { data: event.data })); } };
  port.addEventListener('message', event => {
    if (event.data.type === 'snapshot-end' || event.data.type === 'snapshot' && event.data.complete) { final = event; audit.completionQueued = true; }
    else events.dispatchEvent(new MessageEvent('message', { data: event.data }));
  });
  port.addEventListener('error', event => events.dispatchEvent(new ErrorEvent('error', { message: event.message })));
  return { postMessage: (message, transfer) => port.postMessage(message, transfer ?? []),
    addEventListener: events.addEventListener.bind(events) as DocumentWorkerPort['addEventListener'],
    removeEventListener: events.removeEventListener.bind(events) as DocumentWorkerPort['removeEventListener'],
    terminate: () => { final = undefined; port.terminate(); } };
};
export const audit: any = (window as any).reading = { state: undefined, api: undefined, history: [] };
function AuditBridge() { const api = useLiMR(), runtime = useRuntime(); audit.api = api; audit.runtime = runtime; return null; }
audit.positionRect = (position: { source: number }) => sourceRangeStartRect(audit.runtime, { start: position.source, end: position.source + 2 })?.top;
audit.prepare = (mib?: number): Blob | undefined => {
  if (!mib) return;
  const phrase = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。';
  const unit = phrase.repeat(6) + '\n\n';
  const input = new Blob(['# Start\n\n', unit.repeat(Math.ceil(mib * 1024 * 1024 / new Blob([unit]).size)), '# Final chapter\n\nTHE-END-OF-THE-COMPLETE-BOOK\n']);
  audit.bytes = input.size; return input;
};
audit.render = ({ source, mib, input: suppliedInput, mode = 'blocking', typography = 'standard', automaticWindowing = false, holdCompletion = false, ...options }: { source?: string; mib?: number; mode?: 'blocking' | 'progressive'; automaticWindowing?: boolean; holdCompletion?: boolean } & Partial<AsyncReaderProps>) => {
  const input = suppliedInput ?? audit.prepare(mib) ?? source ?? '# Start\n\nSmall initial document.';
  audit.history = []; audit.started = performance.now(); audit.capability = undefined;
  root.render(<AsyncReader {...options} input={input} loading={{ worker: holdCompletion ? heldWorker : worker, mode, fallback: 'error' }} typography={typography} virtualization={options.virtualization ?? (automaticWindowing ? undefined : true)} onVirtualizationChange={capability => { audit.capability = capability; }}
    onLoadStateChange={state => { audit.state = state; audit.history.push({ at: performance.now(), status: state.status, phase: state.phase, complete: state.complete, prefix: !state.complete && !!state.document }); }}><AuditBridge /></AsyncReader>);
};
function Lifecycle({ blob, echo }: { blob: boolean; echo: boolean }) {
  const [input, setInput] = useState<string | Blob>(() => blob ? new Blob(['# Original\n\nEditable original.']) : '# Original\n\nEditable original.');
  const [extensions, setExtensions] = useState(standard);
  const [plugins, setPlugins] = useState<RendererExtension[]>([]);
  const [mode, setMode] = useState<'blocking' | 'progressive'>('blocking');
  audit.replaceInput = setInput; audit.changeMode = () => setMode(previous => previous === 'blocking' ? 'progressive' : 'blocking');
  audit.addViewPlugin = () => setPlugins([{ name: 'pure-view' }]);
  audit.reconfigureSyntax = () => setExtensions(standard());
  return <AsyncReader input={input} extensions={extensions} plugins={plugins} loading={{ worker, mode, fallback: 'error' }} virtualization
    onSourceChange={source => { if (echo) setInput(source); }} onLoadStateChange={state => { audit.state = state; audit.readyEvents = (audit.readyEvents ?? 0) + (state.status === 'ready' ? 1 : 0); }}><AuditBridge /></AsyncReader>;
}
audit.prefixActionPlugins = [{ name: 'prefix-test-actions', actions: [
  { id: 'prefix-write', label: 'Write note', icon: '+', run: () => {} },
  { id: 'prefix-read', label: 'Read action', icon: 'o', readOnly: true, run: () => {} },
] }];
audit.legacyNotes = (source: string, options: Partial<AsyncReaderProps> = {}) => audit.render({ ...options, source, extensions: standard().filter(extension => extension.name !== 'footnotes') });
audit.lifecycle = (options: { blob: boolean; echo: boolean }) => root.render(<Lifecycle key={Date.now()} {...options} />);
document.body.style.cssText = 'margin:0;background:#fffefa';
document.getElementById('root')!.style.cssText = 'max-width:1440px;margin:auto;padding:24px';
audit.addSecond = () => { const element = document.createElement('div'); element.id = 'secondary-reader'; document.body.append(element); createRoot(element).render(<Reader documentId="secondary" source={'# Secondary reader\n\nSeparate visible text.'} virtualization />); };

// Explicit regression entry only. Default render()/benchmark input and worker
// paths above are unchanged; this small source never needs packet ACKs.
const progressWorker = (): DocumentWorkerPort => {
  const port = worker(), events = new EventTarget(), queue: DocumentWorkerResponse[] = [];
  const check = audit.progressRegressionState; let holding = false, closed = false;
  const deliver = (data: DocumentWorkerResponse) => events.dispatchEvent(new MessageEvent('message', { data }));
  check.releaseOne = () => { const next = queue.shift(); if (!next || closed) throw new Error('No queued progress'); deliver(next); return next; };
  check.releaseAll = () => { while (queue.length && !closed) deliver(queue.shift()!); };
  port.addEventListener('message', (event: MessageEvent<DocumentWorkerResponse>) => {
    const data = event.data;
    if (data.type === 'snapshot' && !data.complete) { deliver(data); holding = true; return; }
    if (data.type === 'snapshot' && data.complete) { check.finalSnapshot = data.snapshot; check.completionQueued = true; }
    if (holding) queue.push(data); else deliver(data);
  });
  port.addEventListener('error', event => events.dispatchEvent(new ErrorEvent('error', { message: event.message })));
  return { postMessage: (message, transfer) => port.postMessage(message, transfer ?? []),
    addEventListener: events.addEventListener.bind(events) as DocumentWorkerPort['addEventListener'],
    removeEventListener: events.removeEventListener.bind(events) as DocumentWorkerPort['removeEventListener'],
    terminate: () => { closed = true; queue.length = 0; port.terminate(); } };
};
function ProgressRegression({ source }: { source: string }) {
  const [changed, setChanged] = useState(false);
  const [annotations] = useState<readonly Annotation[]>(() => [{ id: 'progress-highlight', type: 'highlight', range: { start: 0, end: 22 }, data: { color: '#f5ce58', style: 'background' } }]);
  return <><button type="button" onClick={() => setChanged(true)}>Update reader props</button>
    <AsyncReader documentId="progress-regression" input={source} theme={changed ? 'dark' : 'light'} annotations={changed ? annotations : undefined}
      loading={{ worker: progressWorker, mode: 'progressive', fallback: 'error' }}
      onLoadStateChange={state => { audit.state = state; audit.progressRegressionState.history.push({ status: state.status, phase: state.phase, loaded: state.progress.loaded, total: state.progress.total, complete: state.complete, observer: changed ? 1 : 0 }); }}>
      <AuditBridge />{changed && <span data-testid="progress-reader-child">Updated Reader child</span>}
    </AsyncReader></>;
}
audit.progressRegression = () => {
  const source = Array.from({ length: 650 }, (_, i) => `Reading paragraph ${String(i).padStart(4, '0')}: ${'Letters remain ordinary prose while the reader accepts input. '.repeat(6)}\n\n`).join('');
  audit.progressRegressionState = { history: [], source, completionQueued: false };
  root.render(<ProgressRegression source={source} />);
};

audit.render({});
