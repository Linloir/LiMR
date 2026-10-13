import { mapText, rangeOf, type MarkdownNode, type SourcePoint } from '../core';

export function point(source: string, offset: number, base: SourcePoint): SourcePoint {
  const between = source.slice(base.offset, offset), breaks = [...between.matchAll(/\r\n|\r|\n/g)], last = breaks.at(-1);
  return { offset, line: base.line + breaks.length, column: last ? between.length - last.index! - last[0].length + 1 : base.column + between.length };
}

/** Slice an existing inline tree without reparsing, retaining decoded UTF-16
 * mappings, formatting, CRLF coordinates and original source delimiters. */
export function sliceInline(node: MarkdownNode, from: number, until: number, source: string): MarkdownNode | undefined {
  if (!node.position) return;
  const range = rangeOf(node);
  if (range.end <= from || range.start >= until) return;
  if (range.start >= from && range.end <= until) return node;
  let start = Math.max(range.start, from), end = Math.min(range.end, until);
  const result = { ...node };
  if (node.type === 'text') {
    const value = (node.value ?? '').replace(/\r\n?/g, '\n'), mapped = mapText(source, value, range);
    const first = mapped.ends.findIndex(offset => offset > start);
    let last = mapped.starts.findIndex(offset => offset >= end);
    if (first < 0) return;
    if (last < 0) last = mapped.starts.length;
    if (last <= first) return;
    result.value = value.slice(first, last); start = mapped.starts[first]; end = mapped.ends[last - 1];
  }
  if (node.children) result.children = sliceChildren(node.children, start, end, source);
  result.position = { start: point(source, start, node.position.start), end: point(source, end, node.position.start) };
  return result;
}
export function sliceChildren(children: readonly MarkdownNode[], from: number, until: number, source: string): MarkdownNode[] {
  return children.flatMap(child => { const value = sliceInline(child, from, until, source); return value ? [value] : []; });
}

/** Only literal text punctuation can introduce a new inline construct. Escaped
 * punctuation, entities, code, URLs and component attributes cannot do so. */
export function textTokens(children: readonly MarkdownNode[], expression: RegExp, source: string): { start: number; end: number }[] {
  return children.flatMap(node => {
    if (node.type !== 'text' || !node.value || !node.position) return [];
    const matches = [...node.value.matchAll(expression)];
    if (!matches.length) return [];
    const map = mapText(source, node.value, rangeOf(node));
    return matches.flatMap(match => {
      const start = map.starts[match.index!], end = map.ends[match.index! + match[0].length - 1];
      return source.slice(start, end) === match[0] ? [{ start, end }] : [];
    });
  });
}
