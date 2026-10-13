import type { Annotation, AnnotationAnchor, DocumentSnapshot, HighlightData, SourceRange } from './types';

export const defaultHighlight: Readonly<HighlightData> = { color: '#F2C744', style: 'background' };
export const sameRange = (a: SourceRange, b: SourceRange) => a.start === b.start && a.end === b.end;

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
