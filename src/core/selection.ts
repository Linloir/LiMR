import { decodeString } from 'micromark-util-decode-string';
import { intersects, rangeOf, walk } from './tree';
import type { DocumentSnapshot, MarkdownNode, SelectionResult, SelectionSnapshot, SourceRange } from './types';

export interface TextMapping { starts: readonly number[]; ends: readonly number[]; exact: boolean }

/** Align decoded text to original source, retaining escape/entity/CRLF boundaries. */
export function mapText(source: string, value: string, range: SourceRange): TextMapping {
  const raw = source.slice(range.start, range.end);
  const starts: number[] = [], ends: number[] = [];
  let rendered = 0, exact = true;
  for (let at = 0; at < raw.length && rendered < value.length;) {
    let length = 1, decoded = raw[at];
    if (raw[at] === '\\' && /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(raw[at + 1] ?? '')) { length = 2; decoded = raw[at + 1]; }
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
  const syntax = { ...initial };
  const nodes: MarkdownNode[] = [];
  for (const block of document.blocks) if (intersects(block.range, initial)) walk(block.node, node => nodes.push(node));
  const semantic = new Set(['strong', 'emphasis', 'delete', 'link', 'linkReference', 'image', 'imageReference', 'inlineCode', 'code', 'math', 'inlineMath']);
  // Ancestors are visited first; repeated expansion handles selections crossing siblings.
  let changed = true;
  while (changed) {
    changed = false;
    for (const node of nodes) {
      if (!semantic.has(node.type) && node.selection !== 'atomic') continue;
      const range = rangeOf(node);
      if (intersects(range, syntax) && (range.start < syntax.start || range.end > syntax.end)) {
        syntax.start = Math.min(syntax.start, range.start); syntax.end = Math.max(syntax.end, range.end); changed = true;
      }
    }
  }
  const blockRanges: SourceRange[] = [];
  const blockTypes = new Set(['paragraph', 'heading', 'code', 'math', 'table', 'listItem', 'thematicBreak', 'html']);
  function collect(node: MarkdownNode) {
    const range = rangeOf(node);
    if (!intersects(range, initial)) return;
    if (blockTypes.has(node.type) || node.type === 'component' && !node.inline) { blockRanges.push(range); return; }
    node.children?.forEach(collect);
  }
  document.blocks.forEach(block => collect(block.node));
  const result = (ranges: SourceRange[]): SelectionResult => ({ ranges, sourceText: ranges.map(range => document.source.slice(range.start, range.end)).join('\n\n') });
  return {
    documentId: document.id, revision: document.revision, text: options.text ?? document.source.slice(initial.start, initial.end),
    quality: options.quality ?? 'exact', settled: options.settled ?? true,
    raw: result([initial]), syntax: result([syntax]), blocks: result(blockRanges.length ? blockRanges : [initial]),
  };
}
