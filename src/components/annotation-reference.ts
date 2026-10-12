import { mapText, type AnnotationOccurrence, type DocumentSnapshot, type MarkdownNode } from '../core';
import { intersects, rangeOf, textContent } from '../core/tree';

/** Render the anchored text, without exposing Markdown syntax or <ref> tags. */
export function annotationReferenceText(document: DocumentSnapshot, occurrence: AnnotationOccurrence): string {
  const blocks = document.blocks.filter(block => intersects(block.range, occurrence.range));
  let reference = '';
  if (occurrence.embedded) {
    // An embedded citation has no selected range: quote its nearest paragraph.
    let context: MarkdownNode | undefined;
    const visit = (node: MarkdownNode) => {
      if (!intersects(rangeOf(node), occurrence.range)) return;
      if (['paragraph', 'heading', 'listItem'].includes(node.type)) context = node;
      node.children?.forEach(visit);
    };
    blocks.forEach(block => visit(block.node));
    reference = context ? textContent(context) : '';
  } else {
    const visit = (node: MarkdownNode) => {
      const range = rangeOf(node);
      if (!intersects(range, occurrence.range) || ['annotationReference', 'footnoteReference', 'annotationDefinition', 'definition'].includes(node.type)) return;
      if (node.value !== undefined) {
        const mapping = mapText(document.source, node.value, range);
        reference += node.value.split('').filter((_, index) => mapping.ends[index] > occurrence.range.start && mapping.starts[index] < occurrence.range.end).join('');
      } else if (node.type === 'image') reference += String(node.alt ?? '');
      else node.children?.forEach(visit);
    };
    blocks.forEach((block, index) => { if (index) reference += ' '; visit(block.node); });
    reference ||= occurrence.quote ?? document.source.slice(occurrence.range.start, occurrence.range.end);
  }
  return reference.replace(/\s+/g, ' ').trim();
}
