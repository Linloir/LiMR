import { decodeString } from 'micromark-util-decode-string';
import { intersects, rangeOf } from './tree';
import { omitSource } from './source-omissions';
import type { DocumentSnapshot, MarkdownNode, SelectionResult, SelectionSnapshot, SourceRange } from './types';

export interface TextMapping { starts: readonly number[]; ends: readonly number[]; exact: boolean }

/** Align decoded text to original source, retaining escape/entity/CRLF boundaries. */
export function mapText(source: string, value: string, range: SourceRange, options: { escapes?: boolean; omissions?: readonly SourceRange[] } = {}): TextMapping {
  if (options.omissions?.some(span => span.start >= range.start && span.end <= range.end)) {
    const omitted = omitSource(source.slice(range.start, range.end), options.omissions, range.start);
    const mapping = mapText(omitted.value, value, { start: 0, end: omitted.value.length }, { escapes: options.escapes });
    return { starts: mapping.starts.map(at => range.start + omitted.original(at, 'start')), ends: mapping.ends.map(at => range.start + omitted.original(at, 'end')), exact: mapping.exact };
  }
  const raw = source.slice(range.start, range.end);
  const starts: number[] = [], ends: number[] = [];
  let rendered = 0, exact = true;
  for (let at = 0; at < raw.length && rendered < value.length;) {
    let length = 1, decoded = raw[at];
    if (options.escapes !== false && raw[at] === '\\' && /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(raw[at + 1] ?? '')) { length = 2; decoded = raw[at + 1]; }
    else if (raw[at] === '&') {
      const entity = /^&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/i.exec(raw.slice(at));
      if (entity) { const result = decodeString(entity[0]); if (result !== entity[0]) { length = entity[0].length; decoded = result; } }
    } else if (raw[at] === '\r') { length = raw[at + 1] === '\n' ? 2 : 1; decoded = '\n'; }
    if (value.startsWith(decoded, rendered)) {
      for (let unit = 0; unit < decoded.length; unit++) { starts.push(range.start + at); ends.push(range.start + at + length); }
      rendered += decoded.length;
    } else if (!/[\s>]/.test(decoded)) exact = false;
    at += length;
  }
  if (rendered !== value.length) exact = false;
  while (starts.length < value.length) { starts.push(range.start); ends.push(range.end); }
  return { starts, ends, exact };
}

export function selectionFromRange(document: DocumentSnapshot, raw: SourceRange, options: { text?: string; quality?: SelectionSnapshot['quality']; settled?: boolean } = {}): SelectionSnapshot {
  const initial = { start: Math.max(0, raw.start), end: Math.min(document.source.length, raw.end) };
  // The end of one DOM text node and the start of its next sibling denote the
  // same visual caret. Known removed syntax between them must not enter a
  // selection merely because the browser chose the preceding text endpoint.
  const omissions = [...document.annotationRanges.values()].flatMap(ranges => ranges.flatMap(range => [range.openingRange, range.markerRange])).sort((a, b) => a.start - b.start);
  for (const range of omissions) if (initial.start >= range.start && initial.start < range.end) initial.start = range.end;
  for (let index = omissions.length - 1; index >= 0; index--) {
    const range = omissions[index];
    if (initial.end > range.start && initial.end <= range.end) initial.end = range.start;
  }
  initial.end = Math.max(initial.start, initial.end);
  const syntax = { ...initial };
  const containers = new Set(['strong', 'emphasis', 'delete', 'link', 'linkReference', 'heading', 'listItem', 'blockquote']);
  const source = document.source;
  const whitespace = (start: number, end: number) => !source.slice(start, end).trim();
  // Walk boundary ancestors inside-out. Each edge absorbs only its adjacent
  // delimiter, never the unselected words inside an ancestor. Custom component
  // tags remain boundaries; their Markdown children still participate normally.
  function expand(node: MarkdownNode) {
    const range = rangeOf(node);
    if (!intersects(range, syntax) || range.start >= syntax.start && range.end <= syntax.end) return;
    node.children?.forEach(expand);
    let content: SourceRange | undefined;
    if (containers.has(node.type) && node.children?.length) {
      content = { start: rangeOf(node.children[0]).start, end: rangeOf(node.children.at(-1)!).end };
    } else if (node.type === 'inlineCode' || node.type === 'inlineMath') {
      const length = (node.type === 'inlineCode' ? /^`+/ : /^\$+/).exec(source.slice(range.start, range.end))?.[0].length ?? 0;
      content = { start: range.start + length, end: range.end - length };
    } else if (node.type === 'code' || node.type === 'math') {
      const raw = source.slice(range.start, range.end);
      const opening = /^[ \t]*(`{3,}|~{3,}|\${2,})[^\r\n]*(?:\r\n|\r|\n)/.exec(raw);
      if (opening) {
        const fence = opening[1];
        const closing = /(?:\r\n|\r|\n)[ \t]*(`+|~+|\$+)[ \t]*$/.exec(raw);
        const closed = closing && closing[1][0] === fence[0] && closing[1].length >= fence.length;
        content = { start: range.start + opening[0].length, end: closed ? range.start + closing.index : range.end };
      }
    }
    if (content) {
      if (syntax.start > range.start && syntax.start < range.end && (syntax.start <= content.start || whitespace(content.start, syntax.start))) syntax.start = range.start;
      if (syntax.end < range.end && syntax.end > range.start && (syntax.end >= content.end || whitespace(syntax.end, content.end))) syntax.end = range.end;
    }
    if (node.type === 'blockquote') {
      // Continuation lines have their own quote prefixes, independent of the
      // paragraph's first line. Do not consume earlier, unselected quote text.
      const line = Math.max(range.start, source.lastIndexOf('\n', syntax.start - 1) + 1);
      if (/^[ \t]*(?:>[ \t]*)+$/.test(source.slice(line, syntax.start))) syntax.start = line;
    }
  }
  let lo = 0, hi = document.blocks.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (document.blocks[mid].range.end <= initial.start) lo = mid + 1; else hi = mid; }
  const selectedBlocks = [];
  for (let index = lo; index < document.blocks.length && document.blocks[index].range.start < initial.end; index++) {
    const block = document.blocks[index]; selectedBlocks.push(block); expand(block.node);
  }
  const blockRanges: SourceRange[] = [];
  const blockTypes = new Set(['paragraph', 'heading', 'code', 'math', 'table', 'listItem', 'thematicBreak', 'html']);
  function collect(node: MarkdownNode) {
    const range = rangeOf(node);
    if (!intersects(range, initial)) return;
    if (blockTypes.has(node.type) || node.type === 'component' && !node.inline) { blockRanges.push(range); return; }
    node.children?.forEach(collect);
  }
  selectedBlocks.forEach(block => collect(block.node));
  const result = (ranges: SourceRange[]): SelectionResult => ({ ranges, sourceText: ranges.map(range => document.source.slice(range.start, range.end)).join('\n\n') });
  return {
    documentId: document.id, revision: document.revision, text: options.text ?? document.source.slice(initial.start, initial.end),
    quality: options.quality ?? 'exact', settled: options.settled ?? true,
    raw: result([initial]), syntax: result([syntax]), blocks: result(blockRanges.length ? blockRanges : [initial]),
  };
}
