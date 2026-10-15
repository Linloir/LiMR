import type { SourceEdit } from './types';

/** Validate the entire transaction before changing any text. Coordinates belong
 * to the same original source, not the result of the previous edit. */
export function applySourceEdits(source: string, edits: readonly SourceEdit[]): string {
  const ordered = edits.map((edit, index) => ({ ...edit, index })).sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || a.index - b.index);
  let end = 0;
  const parts: string[] = [];
  for (const edit of ordered) {
    const { start, end: to } = edit.range;
    if (!Number.isInteger(start) || !Number.isInteger(to) || start < 0 || to < start || to > source.length) throw new Error('Source edit is outside the document.');
    if (start < end) throw new Error('Source edits must not overlap.');
    parts.push(source.slice(end, start), edit.text);
    end = to;
  }
  parts.push(source.slice(end));
  return parts.join('');
}
