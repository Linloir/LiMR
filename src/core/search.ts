import type { SourceRange } from './types';
import { throwIfAborted, yieldTask } from './source-input';

export interface DocumentSearchOptions { caseSensitive?: boolean; signal?: AbortSignal; limit?: number; onProgress?: (offset: number) => void }
/** Search the entire source, including unmounted blocks, with bounded work per
 * task. Ranges always address the original UTF-16 string. */
export async function searchDocument(source: string, query: string, options: DocumentSearchOptions = {}): Promise<SourceRange[]> {
  if (!query) return [];
  const limit = Math.max(1, options.limit ?? 1000), results: SourceRange[] = [];
  const expression = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), options.caseSensitive ? 'gu' : 'giu');
  const step = Math.max(65_536, query.length * 2);
  let lastEnd = 0;
  for (let start = 0; start < source.length; start += step) {
    throwIfAborted(options.signal);
    const until = Math.min(source.length, start + step), text = source.slice(start, Math.min(source.length, until + query.length * 2));
    expression.lastIndex = Math.max(0, lastEnd - start);
    for (let match = expression.exec(text); match; match = expression.exec(text)) {
      if (match.index >= until - start) break;
      results.push({ start: start + match.index, end: start + match.index + match[0].length });
      lastEnd = start + match.index + match[0].length;
      if (results.length >= limit) return results;
    }
    options.onProgress?.(until);
    if (until < source.length) await yieldTask();
  }
  throwIfAborted(options.signal); return results;
}
