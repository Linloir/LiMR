import type { TextToken } from './types';

/** Split tokens only at actual source newlines; wrapped visual rows keep the
 * original line number, token styling and UTF-16 selection offsets. */
export function literalLines(value: string, tokens?: readonly TextToken[]): TextToken[][] {
  const lines: TextToken[][] = [[]];
  for (const token of tokens?.length ? tokens : [{ content: value, offset: 0 }]) {
    let start = 0;
    while (start < token.content.length) {
      const newline = token.content.indexOf('\n', start);
      const end = newline < 0 ? token.content.length : newline + 1;
      lines.at(-1)!.push({ ...token, content: token.content.slice(start, end), offset: token.offset + start });
      if (newline >= 0) lines.push([]);
      start = end;
    }
  }
  return lines;
}
