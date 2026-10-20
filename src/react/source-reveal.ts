import type { SourceRange } from '../core';
import type { ReaderRuntime } from './runtime';

type Reveal = { range: SourceRange; prepare: (range: SourceRange) => boolean };
const readers = new WeakMap<ReaderRuntime, Set<Reveal>>();

/** Source navigation first opens/scrolls bounded inner views, then positions
 * the outer document. true asks the caller to retry after the next commit. */
export function registerSourceReveal(runtime: ReaderRuntime, range: SourceRange, prepare: Reveal['prepare']): () => void {
  let entries = readers.get(runtime);
  if (!entries) { entries = new Set(); readers.set(runtime, entries); }
  const entry = { range, prepare }; entries.add(entry);
  return () => { entries!.delete(entry); };
}
export function prepareSourceReveal(runtime: ReaderRuntime, range: SourceRange): boolean {
  let pending = false;
  for (const entry of readers.get(runtime) ?? []) {
    if (range.start >= entry.range.start && range.start < entry.range.end) pending = entry.prepare(range) || pending;
  }
  return pending;
}
