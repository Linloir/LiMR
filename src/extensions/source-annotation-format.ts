import type { SourceRange } from '../core';

/** The definition range starts at its colon fence, after any container prefix.
 * List markers become indentation on continuation lines; quote markers remain. */
export function annotationContinuationPrefix(source: string, start: number): string {
  const line = Math.max(source.lastIndexOf('\n', start - 1), source.lastIndexOf('\r', start - 1)) + 1;
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
