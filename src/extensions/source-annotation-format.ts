import type { SourceRange } from '../core';

/** The definition range starts at its colon fence, after any container prefix.
 * List markers become indentation on continuation lines; quote markers remain. */
export function annotationContinuationPrefix(source: string, start: number): string {
  // Stop at the nearest newline of either kind. Searching separately for CR
  // and LF scans the entire preceding document for every annotation when one
  // newline kind is absent (as in an ordinary LF-only document).
  let line = start;
  while (line > 0 && source.charCodeAt(line - 1) !== 10 && source.charCodeAt(line - 1) !== 13) line--;
  return source.slice(line, start).replace(/(?:[*+-]|\d+[.)])(?=[ \t])/g, marker => ' '.repeat(marker.length));
}

/** Extract Markdown inside a definition without its enclosing list/quote syntax. */
export function annotationBody(source: string, definition: SourceRange, body: SourceRange): string {
  const raw = source.slice(body.start, body.end), prefix = annotationContinuationPrefix(source, definition.start);
  if (!prefix) return raw;
  const pattern = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/>[ \t]?/g, '>[ \\t]?');
  const continuation = new RegExp(`^${pattern}`);
  return raw.replace(/(\r\n|\r|\n)([^\r\n]*)/g, (_match, newline: string, line: string) =>
    newline + (line.trimEnd() === prefix.trimEnd() ? '' : line.replace(continuation, '')));
}
