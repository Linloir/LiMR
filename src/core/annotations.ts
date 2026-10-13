import type { Annotation, AnnotationAnchor, AnnotationOccurrence, DocumentSnapshot, HighlightData, MarkdownNode, SourceRange } from './types';
import { intersects, rangeOf } from './tree';

export const defaultHighlight: Readonly<HighlightData> = { color: '#F2C744', style: 'background' };
export const sameRange = (a: SourceRange, b: SourceRange) => a.start === b.start && a.end === b.end;

/** Embedded references quote their nearest text block; keep the marker's own
 * range intact for source mapping, insertion and selection. */
export function annotationReferenceRange(document: DocumentSnapshot, occurrence: AnnotationOccurrence): SourceRange {
  if (occurrence.referenceRange) return occurrence.referenceRange;
  if (!occurrence.embedded) return occurrence.range;
  let reference = occurrence.range;
  const visit = (node: MarkdownNode) => {
    const range = rangeOf(node);
    if (!intersects(range, occurrence.range)) return;
    if (['paragraph', 'heading', 'listItem', 'tableCell'].includes(node.type)) reference = range;
    node.children?.forEach(visit);
  };
  for (const block of document.blocks) if (intersects(block.range, occurrence.range)) visit(block.node);
  return reference;
}

/** Resolve persisted anchors once against the current source. */
export function resolveAnnotationAnchors(annotation: Annotation, document: DocumentSnapshot): AnnotationAnchor[] {
  return (annotation.anchors ?? (annotation.range ? [{ range: annotation.range }] : [])).flatMap(anchor => {
    if (anchor.documentId && anchor.documentId !== document.id) return [];
    let range = anchor.range;
    if (anchor.quote && document.source.slice(range.start, range.end) !== anchor.quote) {
      const start = document.source.indexOf(anchor.quote);
      if (start < 0 || document.source.indexOf(anchor.quote, start + 1) >= 0) return [];
      range = { start, end: start + anchor.quote.length };
    } else if (anchor.revision !== undefined && anchor.revision !== document.revision && !anchor.quote) return [];
    return range.start >= 0 && range.end <= document.source.length && range.start <= range.end ? [{ ...anchor, range }] : [];
  });
}
