import { annotationReferenceRange, mapText, type AnnotationOccurrence, type DocumentSnapshot, type MarkdownNode } from '../core';
import { intersects, rangeOf } from '../core/tree';
import { literalValue, mapLiteral } from '../react/literal';

/** Render the anchored text, without exposing Markdown syntax or <ref> tags. */
export function annotationReferenceText(document: DocumentSnapshot, occurrence: AnnotationOccurrence): string {
  let referenceRange = annotationReferenceRange(document, occurrence);
  const point = referenceRange.start === referenceRange.end;
  if (point) {
    // Excerpts are context, never a replacement for the zero-length paint or
    // selection range. Stay in the closest prose container and favor its tail.
    let container: MarkdownNode | undefined;
    const locate = (node: MarkdownNode) => {
      const range = rangeOf(node);
      if (range.start > referenceRange.start || range.end < referenceRange.start) return;
      if (['paragraph', 'heading', 'tableCell', 'listItem'].includes(node.type)) container = node;
      node.children?.forEach(locate);
    };
    document.blocks.forEach(block => locate(block.node));
    if (!container || occurrence.id.startsWith('unanchored-')) return '';
    const range = rangeOf(container);
    referenceRange = range.start < referenceRange.start ? { start: range.start, end: referenceRange.start }
      : { start: occurrence.range.end, end: range.end };
  }
  const blocks = document.blocks.filter(block => intersects(block.range, referenceRange));
  let reference = '';
  const visit = (node: MarkdownNode) => {
    const range = rangeOf(node);
    if (!intersects(range, referenceRange) || ['footnoteReference', 'annotationDefinition', 'footnoteDefinition', 'definition'].includes(node.type)) return;
    if (node.value !== undefined) {
      const literal = node.type === 'code' || node.type === 'inlineCode' || !!node.valueRange;
      const value = literal ? literalValue(node) : node.value;
      const mapping = literal ? mapLiteral(document.source, node)
        : mapText(document.source, value, range, { escapes: node.verbatimEscapes !== true, omissions: node.sourceOmissions });
      reference += value.split('').filter((_, index) => mapping.ends[index] > referenceRange.start && mapping.starts[index] < referenceRange.end).join('');
    } else if (node.type === 'image') reference += String(node.alt ?? '');
    else node.children?.forEach(visit);
  };
  blocks.forEach((block, index) => { if (index) reference += ' '; visit(block.node); });
  if (!point && !occurrence.embedded) reference ||= occurrence.quote ?? document.source.slice(referenceRange.start, referenceRange.end);
  reference = reference.replace(/\s+/g, ' ').trim();
  return point && reference ? `…${Array.from(reference).slice(-240).join('')}…` : reference;
}

/** Fit the text nearest a point marker; preserve graphemes and both ellipses. */
export function fitPointReference(text: string, width: number, measure: (value: string) => number): string {
  if (measure(text) <= width) return text;
  const segments = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text.slice(1, -1))].map(item => item.segment);
  let low = 0, high = segments.length;
  while (low < high) {
    const count = Math.ceil((low + high) / 2);
    if (measure(`…${segments.slice(-count).join('')}…`) <= width) low = count; else high = count - 1;
  }
  return `…${low ? segments.slice(-low).join('') : ''}…`;
}
