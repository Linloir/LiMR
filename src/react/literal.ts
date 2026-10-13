import { rangeOf, type MarkdownNode, type TextMapping } from '../core';

export function literalValue(node: MarkdownNode): string { return (node.value ?? '').replace(/\r\n?|\n/g, node.type === 'inlineCode' ? ' ' : '\n'); }

/** Literal code does not decode Markdown entities/escapes. Map only its visible
 * payload, including CommonMark code-span whitespace and fence indentation. */
export function mapLiteral(source: string, node: MarkdownNode): TextMapping {
  const range = rangeOf(node), raw = source.slice(range.start, range.end), value = literalValue(node);
  const starts: number[] = [], ends: number[] = [];
  if (node.valueRange) {
    const payload = node.valueRange as { start: number; end: number };
    for (let at = payload.start; at < payload.end && starts.length < value.length; at++) {
      const size = source[at] === '\r' && source[at + 1] === '\n' ? 2 : 1;
      starts.push(at); ends.push(at + size); at += size - 1;
    }
    return { starts, ends, exact: starts.length === value.length };
  }
  if (node.type === 'inlineCode') {
    const fence = /^`+/.exec(raw)?.[0].length ?? 0;
    let from = fence, until = raw.length - fence;
    const normalized = raw.slice(from, until).replace(/\r\n?|\n/g, ' ');
    if (normalized.startsWith(' ') && normalized.endsWith(' ') && /[^ ]/.test(normalized)) {
      from += raw.slice(from, from + 2) === '\r\n' ? 2 : 1;
      until -= raw.slice(until - 2, until) === '\r\n' ? 2 : 1;
    }
    for (let at = from; at < until; at++) {
      const length = raw[at] === '\r' && raw[at + 1] === '\n' ? 2 : 1;
      starts.push(range.start + at); ends.push(range.start + at + length); at += length - 1;
    }
    return { starts, ends, exact: starts.length === value.length };
  }
  const lines = [...raw.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)].filter(match => match[0]);
  const fenced = /^[ \t]*(?:`{3,}|~{3,})/.test(lines[0]?.[0] ?? '');
  let index = fenced ? 1 : 0;
  let exact = true;
  const values = value.split('\n');
  for (let line = 0; line < values.length; line++, index++) {
    const match = lines[index], text = values[line];
    const rawLine = (match?.[0] ?? '').replace(/[\r\n]+$/, '');
    const at = rawLine.endsWith(text) ? rawLine.length - text.length : -1;
    if (at < 0 || !match) exact = false;
    const start = range.start + (match?.index ?? raw.length) + Math.max(0, at);
    for (let unit = 0; unit < text.length; unit++) { starts.push(start + unit); ends.push(start + unit + 1); }
    if (line < values.length - 1) {
      starts.push(range.start + (match?.index ?? 0) + rawLine.length);
      ends.push(range.start + (match?.index ?? 0) + (match?.[0].length ?? rawLine.length));
    }
  }
  return { starts, ends, exact };
}
