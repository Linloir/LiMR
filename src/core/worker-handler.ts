import { DocumentEngine } from './engine';
import { isIndependentProse } from './batched-parse';
import { decodeDocumentInput, yieldTask } from './source-input';
import { resolveWorkerExtensions, type WorkerExtensionRegistry } from './worker-registry';
import type { DocumentWorkerRequest, DocumentWorkerResponse } from './worker-protocol';
import type { SyntaxExtension } from './types';

export interface DocumentWorkerHandlerOptions {
  /** Exact, versioned registry IDs whose factories preserve completed prose
   * prefixes and absolute UTF-16 ranges for every supported descriptor option.
   * On the isIndependentProse subset, these factories must not introduce shared
   * object identity between blocks or between blocks and document metadata.
   * This is a worker-author guarantee, not an inference from extension names.
   * Explicit document scope and the final snapshot guards still take priority. */
  independentProseExtensions?: readonly string[];
  /** Exact registry IDs whose factories permit a separate incomplete parse.
   * The worker owner guarantees fresh instances can process streaming prefixes
   * without observable cross-instance/global side effects or mutations of the
   * original descriptor graph. Shared backing resources must remain read-only.
   * Hooks and source ranges must stay within the supplied incomplete source.
   * Prefix semantics may change after the complete source arrives. This does
   * not declare block independence or permit packet transport. */
  provisionalPreviewExtensions?: readonly string[];
}

/** Prefix publication requires both grammar proof and a caller-owned registry
 * guarantee. Unknown custom transforms cannot silently opt into partial trees. */
export function canPublishProsePrefix(source: string, extensions: readonly SyntaxExtension[], independentSyntax: boolean): boolean {
  return independentSyntax && source.length > 128 * 1024 && isIndependentProse(source) && !extensions.some(extension => extension.scope === 'document');
}
export function prosePrefixEnd(source: string): number {
  for (const match of source.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)) {
    if (!match[0]) break;
    if (match.index! >= 32 * 1024 && /^[ \t]*(?:\r\n|\r|\n)$/.test(match[0])) return match.index! + match[0].length;
  }
  return 0;
}
/** A provisional parse must not read an unbounded line or split a source unit. */
export function provisionalPrefixEnd(source: string): number {
  let end = Math.min(32 * 1024, source.length);
  if (end < source.length) {
    const previous = source.charCodeAt(end - 1), next = source.charCodeAt(end);
    if ((previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff)
      || (previous === 13 && next === 10)) end--;
  }
  return end;
}
/** Install this protocol in a custom worker with its own extension registry.
 * Cancellation belongs to worker termination, including a busy tokenizer. */
export function createDocumentWorkerHandler(registry: WorkerExtensionRegistry, options: DocumentWorkerHandlerOptions = {}) {
  // Copy the capability once. Load descriptors cannot assert their own safety,
  // and later mutations of the caller's array cannot change this worker's policy.
  const independentProse = new Set(['limr/standard', ...(options.independentProseExtensions ?? [])]);
  const provisionalPreview = new Set(options.provisionalPreviewExtensions ?? []);
  const acknowledgements = new Map<number, () => void>();
  return async (request: DocumentWorkerRequest, send: (message: DocumentWorkerResponse) => void): Promise<void> => {
    if (request?.type === 'continue') { acknowledgements.get(request.revision)?.(); acknowledgements.delete(request.revision); return; }
    if (request?.type !== 'load') return;
    const { revision, id } = request;
    try {
      let previewDescriptors: typeof request.extensions | undefined;
      if (request.mode === 'progressive' && provisionalPreview.size
        && request.extensions.every(extension => provisionalPreview.has(extension.id))) {
        // Clone the complete graph before any factory can touch its options.
        // Internal option aliases survive. The declared capability also keeps
        // shared backing resources read-only. A failed optional preview cannot
        // invalidate the final load.
        try { previewDescriptors = structuredClone(request.extensions); } catch { /* no preview */ }
      }
      const extensions = resolveWorkerExtensions(request.extensions, registry);
      const progress = (progress: import('./types').DocumentProgress) => send({ type: 'progress', revision, progress });
      // The worker can be terminated even while decoding. Per-chunk timers only
      // add browser timer-clamping latency here; keep cooperative yields for
      // the public/main-thread decoder and packet receiver's input/paint budget.
      const { source, sourceIndex } = await decodeDocumentInput(request.input, undefined, progress, { cooperative: false });
      const independent = canPublishProsePrefix(source, extensions, request.extensions.every(extension => independentProse.has(extension.id)));
      let progressive = independent, prefixPublished = false;
      if (request.mode === 'progressive' && independent) {
        const until = prosePrefixEnd(source);
        if (until) {
          const prefix = new DocumentEngine(source.slice(0, until), { id, extensions });
          send({ type: 'snapshot', revision, snapshot: prefix.getSnapshot(), complete: false, progressive, sourceIndex });
          prefixPublished = true;
          await yieldTask();
        }
      }
      if (!prefixPublished && previewDescriptors && source.length > 128 * 1024) {
        try {
          const previewExtensions = resolveWorkerExtensions(previewDescriptors, registry);
          const prefix = new DocumentEngine(source.slice(0, provisionalPrefixEnd(source)), { id, extensions: previewExtensions, streaming: true });
          const snapshot = prefix.getSnapshot();
          // Transform failures become diagnostics in the parser. Do not expose
          // a half-transformed optional preview; final hooks still run normally.
          if (!snapshot.diagnostics.some(diagnostic => diagnostic.extension !== undefined)) {
            send({ type: 'snapshot', revision, snapshot, complete: false, progressive: true, sourceIndex });
            progressive = true;
            await yieldTask();
          }
        } catch { /* optional preview failed; parse the complete original source */ }
      }
      const document = new DocumentEngine(source, { id, extensions, onProgress: progress });
      const snapshot = document.getSnapshot();
      // Proven independent prose has no cross-block object references. Ship
      // bounded packets to avoid one large structured-clone task at readiness.
      // Arbitrary extension payloads retain the full clone/identity contract.
      if (independent && source.length > 1024 * 1024 && !snapshot.definitions.size && !snapshot.footnotes.size && !snapshot.annotations.length && !snapshot.annotationRanges.size && !snapshot.occurrences.length) {
        const { source: text, blocks, ...metadata } = snapshot;
        // Backpressure bounds queued clone work as well as individual packets.
        // Merely posting small messages can still monopolize a MessagePort poll.
        const breathe = () => new Promise<void>(resolve => {
          acknowledgements.set(revision, resolve); send({ type: 'snapshot-yield', revision });
        });
        send({ type: 'snapshot-start', revision, metadata, sourceLength: text.length, blockCount: blocks.length, sourceIndex, progressive });
        for (let at = 0; at < text.length; at += 256 * 1024) {
          send({ type: 'snapshot-source', revision, value: text.slice(at, at + 256 * 1024) });
          if (at % (2 * 1024 * 1024) === 0) await breathe();
        }
        for (let at = 0; at < blocks.length; at += 256) {
          send({ type: 'snapshot-blocks', revision, blocks: blocks.slice(at, at + 256) });
          if (at % 2048 === 0) await breathe();
        }
        send({ type: 'snapshot-end', revision });
      } else send({ type: 'snapshot', revision, snapshot, complete: true, progressive, sourceIndex });
    } catch (error) { send({ type: 'error', revision, message: error instanceof Error ? error.message : String(error) }); }
  };
}
