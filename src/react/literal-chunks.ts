import type { TextToken } from './types';

export interface LiteralChunk { start: number; end: number; line: number; lines: number; long: boolean }

/** Modest source groups let the browser skip distant layout without removing
 * text needed by native selection, find, accessibility or printing. */
export function literalChunks(value: string): LiteralChunk[] {
  const chunks: LiteralChunk[] = [];
  let start = 0, at = 0, line = 1, first = 1;
  const push = (end: number, long = false) => {
    chunks.push({ start, end, line: first, lines: line - first + 1, long });
    start = end; first = line + 1;
  };
  for (;;) {
    const newline = value.indexOf('\n', at), end = newline < 0 ? value.length : newline + 1;
    if (end - at > 8192) {
      if (at > start) { line--; push(at); line++; }
      push(end, true);
    } else if (line - first >= 63 || end - start >= 8192 || newline < 0) push(end);
    if (newline < 0) break;
    at = end; line++;
  }
  return chunks;
}

/** Keep UTF-16 token offsets/styles, including tokens crossing a chunk edge. */
export function literalTokensBetween(value: string, tokens: readonly TextToken[] | undefined, start: number, end: number): TextToken[] {
  if (!tokens?.length) return [{ content: value.slice(start, end), offset: start }];
  let low = 0, high = tokens.length;
  while (low < high) { const mid = (low + high) >>> 1; if (tokens[mid].offset + tokens[mid].content.length <= start) low = mid + 1; else high = mid; }
  const result: TextToken[] = [];
  for (let index = low; index < tokens.length && tokens[index].offset < end; index++) {
    const token = tokens[index], from = Math.max(start, token.offset), to = Math.min(end, token.offset + token.content.length);
    result.push({ ...token, offset: from, content: token.content.slice(from - token.offset, to - token.offset) });
  }
  return result;
}

let segmenter: Intl.Segmenter | undefined;
/** Only pathological source lines need continuation groups. They remain inline
 * in no-wrap mode; wrapping can skip their distant groups independently. */
export function literalParts(value: string, start: number, end: number): { start: number; end: number }[] {
  const parts: { start: number; end: number }[] = [];
  const segments = (segmenter ??= new Intl.Segmenter(undefined, { granularity: 'grapheme' })).segment(value);
  while (start < end) {
    let until = Math.min(end, start + 4096);
    if (until < end) {
      const segment = segments.containing(until);
      if (segment && segment.index !== until) until = segment.index > start ? segment.index : segment.index + segment.segment.length;
    }
    parts.push({ start, end: until }); start = until;
  }
  return parts;
}
