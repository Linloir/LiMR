import { useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AsyncReader, standard, useLiMR, type Annotation, type DocumentWorkerPort, type RendererExtension } from '../src';
import { useRuntime } from '../src/react/context';
import { asyncHandoffScope } from '../src/react/async-handoff-policy';
import '../src/styles.css';
import '../src/image-preview.css';
import 'katex/dist/katex.min.css';

// The real protocol/Worker produces both independent engines. This adapter
// delays only final delivery so a real user can interact with the prefix.
const api: any = (window as any).__stableHost = { workers: [], history: [], engines: {}, full: false };
const query = new URLSearchParams(location.search), ending = query.get('end') ?? 'windowed', first = query.get('first') ?? 'full';
const tableCase = query.get('case') === 'table', surface = query.get('surface') ?? 'overlay';
const extensions = standard(), photo = '/prototype-image.svg';
const lateReference = query.has('late-reference');
// A view-only unknown renderer remains on its existing full-render fallback.
// It gets no state/DOM lease permission and supplies no false window contract.
const opaqueCode: RendererExtension = { name: 'private-opaque-code', components: { code: ({ node }) => <pre data-private-opaque-code><code>{node.value}</code></pre> } };
const plugins = ending === 'full-unknown' ? [opaqueCode] : undefined;
const head = tableCase
  ? `# Table handoff\n\n| ![Clone owner](${photo}) ${'ExtraordinaryHeader'.repeat(25)} ${lateReference ? '[late label][late]' : ''} | Value |\n| --- | --- |\n| Compact | ✓ |\n| Short | ✓ |\n\n`
  : `# Media handoff\n\n![First owner](${photo})\n\n<video provider="native" url="/prototype-media.webm" loading="eager" title="Native continuity" />\n\n<video provider="youtube" url="https://www.youtube.com/watch?v=M7lc1UVf-VE" loading="eager" title="Frame continuity" />\n\n![Duplicate URL distinct owner](${photo})\n\n`;
const prefix = head + (ending === 'full-unknown' ? '\n```text\nOpaque plugin code remains readable.\n```\n\n' : '') + Array.from({ length: 16 }, (_, index) => `Prefix ${index}. ` + 'Stable provisional reading text. '.repeat(85)).join('\n\n') + '\n\n';
const suffix = ending === 'full-giant' ? 'Giant ' + 'x'.repeat(300_000) + '\n\n'
  : Array.from({ length: 500 }, (_, index) => `Appended paragraph ${index}. ` + 'Complete book text. '.repeat(16)).join('\n\n');
api.expectedSource = prefix + suffix + (lateReference ? '\n\n[late]: https://example.test/new-meaning\n' : '');
function heldWorker(): DocumentWorkerPort {
  const worker = new Worker(new URL('../src/worker.ts', import.meta.url), { type: 'module', name: 'integrated-handoff' });
  const events = new EventTarget(), record: any = { messages: [], terminated: false };
  api.workers.push(record); let final: MessageEvent | undefined;
  record.release = () => { if (!final || record.terminated) return false; const message = final; final = undefined; record.released = performance.now(); events.dispatchEvent(new MessageEvent('message', { data: message.data })); return true; };
  worker.addEventListener('message', event => {
    const value = event.data;
    record.messages.push({ at: performance.now(), type: value.type, complete: value.complete, revision: value.revision, length: value.snapshot?.source.length });
    if (value.type === 'snapshot' && value.complete || value.type === 'snapshot-end') {
      final = event; record.held = performance.now(); record.finalSnapshot = value.snapshot;
    } else {
      if (value.type === 'snapshot' && !value.complete) record.prefixSnapshot = value.snapshot;
      events.dispatchEvent(new MessageEvent('message', { data: value }));
    }
  });
  worker.addEventListener('error', event => events.dispatchEvent(new ErrorEvent('error', { message: event.message })));
  return { postMessage(message, transfer) { if (message.type === 'load') record.request = message; worker.postMessage(message, transfer ?? []); },
    addEventListener: events.addEventListener.bind(events) as DocumentWorkerPort['addEventListener'],
    removeEventListener: events.removeEventListener.bind(events) as DocumentWorkerPort['removeEventListener'],
    terminate() { record.terminated = true; record.discardedFinal = !!final; final = undefined; worker.terminate(); } };
}
function Bridge() {
  const commands = useLiMR(), runtime = useRuntime();
  useLayoutEffect(() => {
    api.commands = commands; api.runtime = runtime; api.full = commands.isDocumentComplete();
    const scope = asyncHandoffScope(runtime), annotations = runtime.configuration.get().annotations;
    api.scopeReceipt = { admitted: !!scope, complete: scope?.complete, privateEmpty: !!scope?.injectedAnnotations && annotations === scope.injectedAnnotations, publicUndefined: scope?.publicAnnotations === undefined };
    // Read the current configuration after provider layout effects, rather than
    // relying on this child effect's earlier observation of the same commit.
    api.readScopeReceipt = () => { const current = api.runtime, accepted = asyncHandoffScope(current); return { admitted: !!accepted, complete: accepted?.complete, privateEmpty: !!accepted?.injectedAnnotations && current.configuration.get().annotations === accepted.injectedAnnotations, publicUndefined: accepted?.publicAnnotations === undefined }; };
    if (!api.full) { api.engines.before = commands.document; api.prefixRuntime = runtime; }
    else api.engines.after = commands.document;
  });
  return null;
}
function Harness() {
  const [input, setInput] = useState(api.expectedSource), [annotations, setAnnotations] = useState<readonly Annotation[] | undefined>(undefined);
  api.replaceInput = setInput; api.setAnnotations = setAnnotations;
  api.complete = () => { if (!api.workers.at(-1)?.release()) throw new Error('No real Worker final waiting'); };
  const virtualization = ending === 'full-explicit' ? false : first === 'windowed' ? true : undefined;
  return <><nav><button id="finish" onClick={api.complete}>Deliver real Worker completion</button><button id="play-video" onClick={() => { const video = document.querySelector('video')!; video.muted = true; video.loop = true; void video.play(); }}>Play valid media</button></nav>
    <AsyncReader input={input} documentId="integrated-handoff" extensions={extensions} plugins={plugins} loading={{ worker: heldWorker, mode: 'progressive', fallback: 'error' }}
      annotations={annotations} sidebar={surface !== 'overlay'} sidebarCollapse={surface === 'adaptive'} sidebarBreakpoint={0} toc={false} fillHeight={false}
      virtualization={virtualization} onVirtualizationChange={capability => { api.capability = capability; }}
      onLoadStateChange={state => { api.state = state; api.history.push({ at: performance.now(), complete: state.complete, worker: state.capabilities.worker, revision: state.revision, status: state.status, error: state.error?.message }); }}>
      <Bridge />
    </AsyncReader></>;
}
createRoot(document.getElementById('root')!).render(<Harness />);
