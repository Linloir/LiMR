import { annotationReferenceRange, mapText, type AnnotationOccurrence, type DocumentSnapshot, type MarkdownNode } from '../core';
import { intersects, rangeOf } from '../core/tree';

/** Render the anchored text, without exposing Markdown syntax or <ref> tags. */
export function annotationReferenceText(document: DocumentSnapshot, occurrence: AnnotationOccurrence): string {
  const referenceRange = annotationReferenceRange(document, occurrence);
  const blocks = document.blocks.filter(block => intersects(block.range, referenceRange));
  let reference = '';
  const visit = (node: MarkdownNode) => {
    const range = rangeOf(node);
    if (!intersects(range, referenceRange) || ['annotationReference', 'footnoteReference', 'annotationDefinition', 'definition'].includes(node.type)) return;
    if (node.value !== undefined) {
      const mapping = mapText(document.source, node.value, range);
      reference += node.value.split('').filter((_, index) => mapping.ends[index] > referenceRange.start && mapping.starts[index] < referenceRange.end).join('');
    } else if (node.type === 'image') reference += String(node.alt ?? '');
    else node.children?.forEach(visit);
  };
  blocks.forEach((block, index) => { if (index) reference += ' '; visit(block.node); });
  if (!occurrence.embedded) reference ||= occurrence.quote ?? document.source.slice(referenceRange.start, referenceRange.end);
  return reference.replace(/\s+/g, ' ').trim();
}
