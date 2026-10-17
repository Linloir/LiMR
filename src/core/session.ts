import { DocumentEngine } from './engine';
import { abortError, decodeDocumentInput, throwIfAborted, yieldTask, type DocumentInput, type Utf8SourceIndex } from './source-input';
import { canPublishProsePrefix, prosePrefixEnd } from './worker-handler';
import { hasDocumentSyntax, workerExtensionDescriptor, type WorkerExtensionDescriptor } from './worker-registry';
import type { DocumentWorkerPort, DocumentWorkerResponse } from './worker-protocol';
import type { Block, DocumentProgress, DocumentSnapshot, SyntaxExtension } from './types';
import { unpackSnapshotCooperatively } from './snapshot-codec';

export interface DocumentSessionOptions {
  id?: string;
  extensions?: readonly SyntaxExtension[];
  mode?: 'blocking' | 'progressive';
  /** Factory keeps bundler/CSP/file access policy in the host. A fresh worker is
   * terminated after completion, cancellation, failure or replacement. */
  worker?: () => DocumentWorkerPort;
  fallback?: 'main-thread' | 'error';
  /** Explicit positional contracts for a host's custom worker registry. */
  registry?: readonly WorkerExtensionDescriptor[];
}
export interface DocumentSessionCapabilities { worker: boolean; progressive: boolean; reason?: string }
export interface DocumentSessionState {
  status: 'idle' | 'loading' | 'ready' | 'cancelled' | 'error';
  revision: number;
  phase: DocumentProgress['phase'];
  progress: { loaded: number; total?: number };
  /** Monotonic fraction for this request, from 0 to 1. Phase weights estimate
   * work rather than elapsed time; only an accepted complete document reaches 1. */
  overallProgress: number;
  /** A prefix document is complete only as a prefix, never as the full input. */
  complete: boolean;
  document?: DocumentEngine;
  sourceIndex?: Utf8SourceIndex;
  error?: Error;
  capabilities: DocumentSessionCapabilities;
}
let sequence = 0;
/** Asynchronous loading owns input, cancellation and worker lifetime. Existing
 * DocumentSnapshot/useDocument contracts continue to describe complete trees. */
export class DocumentSession {
  readonly id: string;
  private state: DocumentSessionState;
  private listeners = new Set<() => void>();
  private active?: { revision: number; controller: AbortController; reject: (error: Error) => void; cleanup: () => void };
  private disposed = false;
  constructor(private options: DocumentSessionOptions = {}) {
    this.id = options.id ?? `limr-session-${++sequence}`;
    this.state = { status: 'idle', revision: 0, phase: 'read', progress: { loaded: 0 }, overallProgress: 0, complete: false, capabilities: { worker: false, progressive: false } };
  }
  getSnapshot = (): DocumentSessionState => this.state;
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  private publish(next: Partial<DocumentSessionState>) { this.state = { ...this.state, ...next }; for (const listener of this.listeners) listener(); }
  cancel = (): void => {
    const active = this.active; if (!active) return;
    this.active = undefined; active.controller.abort(); active.cleanup();
    this.publish({ status: 'cancelled', complete: false, document: undefined }); active.reject(abortError());
  };
  dispose = (): void => { this.cancel(); this.disposed = true; this.listeners.clear(); };
  load(input: DocumentInput, { signal }: { signal?: AbortSignal } = {}): Promise<DocumentEngine> {
    if (this.disposed) return Promise.reject(new Error('DocumentSession is disposed.'));
    this.cancel();
    const revision = this.state.revision + 1, controller = new AbortController();
    const extensions = this.options.extensions ?? [];
    const syntax = this.options.registry ? extensions : extensions.filter(hasDocumentSyntax);
    const descriptors = this.options.registry ?? syntax.map(workerExtensionDescriptor);
    const compatible = descriptors.length === syntax.length && descriptors.every((descriptor): descriptor is WorkerExtensionDescriptor => !!descriptor);
    const reason = !this.options.worker ? 'No worker factory was supplied.' : !compatible ? 'Some syntax extensions have no matching worker registration.' : undefined;
    const worker = !!this.options.worker && compatible;
    this.publish({ status: 'loading', revision, phase: 'read', progress: { loaded: 0 }, overallProgress: 0, complete: false, document: undefined, sourceIndex: undefined, error: undefined, capabilities: { worker, progressive: false, reason } });
    return new Promise<DocumentEngine>((resolve, reject) => {
      const abort = () => this.cancel(); signal?.addEventListener('abort', abort, { once: true });
      let port: DocumentWorkerPort | undefined;
      const terminateWorker = () => { port?.terminate(); port = undefined; };
      const cleanup = () => { signal?.removeEventListener('abort', abort); terminateWorker(); };
      this.active = { revision, controller, reject, cleanup };
      const current = () => this.active?.revision === revision && !controller.signal.aborted;
      const fail = (error: unknown) => {
        if (!current()) return;
        this.active = undefined; controller.abort(); cleanup();
        const actual = error instanceof Error ? error : new Error(String(error));
        this.publish({ status: actual.name === 'AbortError' ? 'cancelled' : 'error', error: actual, complete: false, document: undefined }); reject(actual);
      };
      let transfer: { header: Extract<DocumentWorkerResponse, {type: 'snapshot-start'}>; source: string[]; sourceLength: number; blocks: Block[] } | undefined;
      let decodingPacked = false;
      const receive = (response: DocumentWorkerResponse) => {
        if (!current() || response.revision !== revision) return;
        if (response.type === 'error') { fail(new Error(response.message)); return; }
        if (response.type === 'snapshot-packed') {
          if (decodingPacked || transfer) { fail(new Error('Unexpected packed worker snapshot.')); return; }
          decodingPacked = true;
          try {
            // Keep the external abort listener until decoding completes. Only
            // worker lifetime ends here, before allocating the receiver AST.
            terminateWorker();
            this.publish({ overallProgress: Math.max(this.state.overallProgress, .95) });
            const { packed, progressive, sourceIndex } = response;
            void unpackSnapshotCooperatively<DocumentSnapshot>(packed, {
              signal: controller.signal,
              onProgress: (loaded, total) => {
                if (current()) this.publish({ overallProgress: Math.max(this.state.overallProgress, .95 + .04 * (total ? loaded / total : 1)) });
              },
            }).then(snapshot => {
              if (current()) receive({ type: 'snapshot', revision, snapshot, complete: true, progressive, sourceIndex });
            }).catch(fail);
          } catch (error) { fail(error); }
          return;
        }
        if (response.type === 'snapshot-start') {
          transfer = { header: response, source: [], sourceLength: 0, blocks: [] };
          this.publish({ overallProgress: Math.max(this.state.overallProgress, .95) }); return;
        }
        if (response.type === 'snapshot-source') {
          if (!transfer || transfer.sourceLength + response.value.length > transfer.header.sourceLength) { fail(new Error('Invalid worker source packet.')); return; }
          transfer.source.push(response.value); transfer.sourceLength += response.value.length;
          this.publish({ overallProgress: Math.max(this.state.overallProgress, .95 + .02 * transfer.sourceLength / Math.max(1, transfer.header.sourceLength)) }); return;
        }
        if (response.type === 'snapshot-blocks') {
          if (!transfer || transfer.blocks.length + response.blocks.length > transfer.header.blockCount) { fail(new Error('Invalid worker block packet.')); return; }
          for (const block of response.blocks) transfer.blocks.push(block);
          this.publish({ overallProgress: Math.max(this.state.overallProgress, .97 + .02 * transfer.blocks.length / Math.max(1, transfer.header.blockCount)) }); return;
        }
        if (response.type === 'snapshot-yield') {
          // A separate task gives input/paint/timers an opportunity before the
          // worker emits its next bounded batch of clone work.
          setTimeout(() => { if (current()) port?.postMessage({ type: 'continue', revision }); }, 0); return;
        }
        if (response.type === 'snapshot-end') {
          if (!transfer || transfer.sourceLength !== transfer.header.sourceLength || transfer.blocks.length !== transfer.header.blockCount) { fail(new Error('Incomplete worker snapshot.')); return; }
          const { header, source, blocks } = transfer; transfer = undefined;
          receive({ type: 'snapshot', revision, complete: true, progressive: header.progressive, sourceIndex: header.sourceIndex, snapshot: { ...header.metadata, source: source.join(''), blocks } }); return;
        }
        if (response.type === 'progress') {
          const { phase, loaded, total } = response.progress;
          const fraction = total === undefined ? 0 : total === 0 ? 1 : Math.max(0, Math.min(1, loaded / total));
          const estimate = phase === 'read' ? fraction * .1 : phase === 'parse' ? .1 + fraction * .75 : phase === 'index' ? .85 + fraction * .1 : .99;
          this.publish({ phase, progress: { loaded, total }, overallProgress: Math.max(this.state.overallProgress, estimate) }); return;
        }
        try {
          const document = DocumentEngine.fromSnapshot(response.snapshot, { id: this.id, extensions });
          const capabilities = { ...this.state.capabilities, progressive: response.progressive };
          if (response.complete) {
            this.active = undefined; cleanup();
            this.publish({ status: 'ready', phase: 'ready', progress: { loaded: response.snapshot.source.length, total: response.snapshot.source.length }, overallProgress: 1, document, complete: true, sourceIndex: response.sourceIndex, capabilities }); resolve(document);
          } else this.publish({ document, complete: false, sourceIndex: response.sourceIndex, capabilities });
        } catch (error) { fail(error); }
      };
      if (signal?.aborted) { this.cancel(); return; }
      if (this.options.fallback === 'error' && !worker) { fail(new Error(reason)); return; }
      if (worker) {
        try {
          port = this.options.worker!();
          port.addEventListener('message', event => receive(event.data));
          port.addEventListener('error', event => fail(new Error(event.message || 'Document parser worker failed.')));
          // Preserve the caller's bytes while avoiding structuredClone's large
          // synchronous serialization pass. Native workers transfer this copy.
          const payload = input instanceof Uint8Array ? input.slice() : input;
          const transfer = payload instanceof Uint8Array ? [payload.buffer as ArrayBuffer] : undefined;
          port.postMessage({ type: 'load', revision, id: this.id, input: payload, mode: this.options.mode ?? 'blocking', extensions: descriptors as readonly WorkerExtensionDescriptor[], acceptPackedSnapshot: true }, transfer);
        } catch (error) { fail(error); }
        return;
      }
      // Explicit compatibility fallback: the exact configured hooks run here.
      // Yield before parsing so a loading UI can paint; arbitrary hooks remain
      // synchronous and cannot promise a responsive main thread during parsing.
      void (async () => {
        await yieldTask(); throwIfAborted(controller.signal);
        const progress = (progress: DocumentProgress) => { throwIfAborted(controller.signal); receive({ type: 'progress', revision, progress }); };
        const { source, sourceIndex } = await decodeDocumentInput(input, controller.signal, progress);
        const progressive = canPublishProsePrefix(source, extensions, compatible && descriptors.every(descriptor => descriptor?.id === 'limr/standard'));
        if (this.options.mode === 'progressive' && progressive) {
          const until = prosePrefixEnd(source);
          if (until) { const prefix = new DocumentEngine(source.slice(0, until), { id: this.id, extensions }); receive({ type: 'snapshot', revision, snapshot: prefix.getSnapshot(), complete: false, progressive, sourceIndex }); await yieldTask(); }
        }
        throwIfAborted(controller.signal);
        const document = new DocumentEngine(source, { id: this.id, extensions, onProgress: progress });
        receive({ type: 'snapshot', revision, snapshot: document.getSnapshot(), complete: true, progressive, sourceIndex });
      })().catch(fail);
    });
  }
}
export function createDocumentSession(options: DocumentSessionOptions = {}): DocumentSession { return new DocumentSession(options); }
