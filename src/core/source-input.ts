import type { DocumentProgress } from './types';
export type DocumentInput = string | Uint8Array | Blob;
export interface Utf8Checkpoint { byteOffset: number; sourceOffset: number }
export interface Utf8SourceIndex { encoding: 'utf-8'; byteLength: number; checkpoints: readonly Utf8Checkpoint[] }
export interface DecodedDocumentInput { source: string; sourceIndex?: Utf8SourceIndex }
export interface DocumentDecodeOptions {
  /** Yield between decoding chunks on the main thread (default true). A
   * dedicated worker can disable this and use worker termination to cancel. */
  cooperative?: boolean;
}
const decoder = () => new TextDecoder('utf-8', { ignoreBOM: true });
export function abortError(): Error { const error = new Error('Document loading was cancelled.'); error.name = 'AbortError'; return error; }
export function throwIfAborted(signal?: AbortSignal) { if (signal?.aborted) throw abortError(); }
export const yieldTask = () => new Promise<void>(resolve => setTimeout(resolve, 0));

/** UTF-8 checkpoints occur before ASCII bytes, so neither a valid multibyte
 * sequence nor a malformed replacement sequence crosses a checkpoint. BOM,
 * CRLF and astral characters retain their original UTF-16 source positions. */
export async function decodeDocumentInput(input: DocumentInput, signal?: AbortSignal, progress?: (value: DocumentProgress) => void, options: DocumentDecodeOptions = {}): Promise<DecodedDocumentInput> {
  throwIfAborted(signal);
  if (typeof input === 'string') { progress?.({ phase: 'read', loaded: input.length, total: input.length }); return { source: input }; }
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(await input.arrayBuffer());
  throwIfAborted(signal);
  const parts: string[] = [], checkpoints: Utf8Checkpoint[] = [{ byteOffset: 0, sourceOffset: 0 }];
  let from = 0, length = 0;
  while (from < bytes.length) {
    let until = Math.min(bytes.length, from + 256 * 1024);
    // Long text without ASCII is still correct; defer its next checkpoint.
    while (until < bytes.length && bytes[until] >= 128) until++;
    const part = decoder().decode(bytes.subarray(from, until)); parts.push(part); length += part.length; from = until;
    checkpoints.push({ byteOffset: from, sourceOffset: length });
    progress?.({ phase: 'read', loaded: from, total: bytes.length });
    if (options.cooperative !== false) await yieldTask();
    throwIfAborted(signal);
  }
  return { source: parts.join(''), sourceIndex: { encoding: 'utf-8', byteLength: bytes.length, checkpoints } };
}
/** An offset inside an unfinished UTF-8 sequence addresses its leading edge. */
export function utf8ByteToSourceOffset(bytes: Uint8Array, index: Utf8SourceIndex, offset: number): number {
  const at = Math.max(0, Math.min(bytes.length, Math.trunc(offset)));
  let low = 0, high = index.checkpoints.length - 1;
  while (low < high) { const middle = Math.ceil((low + high) / 2); if (index.checkpoints[middle].byteOffset <= at) low = middle; else high = middle - 1; }
  const checkpoint = index.checkpoints[low];
  return checkpoint.sourceOffset + decoder().decode(bytes.subarray(checkpoint.byteOffset, at), { stream: at < bytes.length }).length;
}
/** The nearest byte boundary before a UTF-16 offset (including mid-surrogate). */
export function sourceOffsetToUtf8Byte(bytes: Uint8Array, index: Utf8SourceIndex, offset: number): number {
  const total = index.checkpoints.at(-1)?.sourceOffset ?? 0, at = Math.max(0, Math.min(total, Math.trunc(offset)));
  let low = 0, high = bytes.length;
  while (low < high) { const middle = Math.ceil((low + high) / 2); if (utf8ByteToSourceOffset(bytes, index, middle) <= at) low = middle; else high = middle - 1; }
  const source = utf8ByteToSourceOffset(bytes, index, low);
  high = low; low = 0;
  while (low < high) { const middle = Math.floor((low + high) / 2); if (utf8ByteToSourceOffset(bytes, index, middle) < source) low = middle + 1; else high = middle; }
  return low;
}
