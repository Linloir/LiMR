import type { MarkdownNode, SourcePoint, SourceRange } from './types';

export function walk(node: MarkdownNode, visit: (node: MarkdownNode, parent?: MarkdownNode) => void, parent?: MarkdownNode): void {
  visit(node, parent);
  for (const child of node.children ?? []) walk(child, visit, node);
}
export function textContent(node: MarkdownNode): string {
  if (node.type === 'image') return String(node.alt ?? '');
  return node.value ?? node.children?.map(textContent).join('') ?? '';
}
export function rangeOf(node: MarkdownNode): SourceRange {
  return { start: node.position?.start.offset ?? 0, end: node.position?.end.offset ?? 0 };
}
export function intersects(a: SourceRange, b: SourceRange): boolean { return a.start < b.end && b.start < a.end; }
export function lineStarts(source: string): number[] {
  const result = [0];
  for (let i = 0; i < source.length; i++) {
    if (source[i] === '\r') { if (source[i + 1] === '\n') i++; result.push(i + 1); }
    else if (source[i] === '\n') result.push(i + 1);
  }
  return result;
}
export function sourcePoint(offset: number, lines: readonly number[]): SourcePoint {
  let lo = 0, hi = lines.length;
  while (lo + 1 < hi) { const mid = (lo + hi) >>> 1; if (lines[mid] <= offset) lo = mid; else hi = mid; }
  return { offset, line: lo + 1, column: offset - lines[lo] + 1 };
}
export function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, '').replace(/[\s_]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
}
export function safeUrl(value: unknown, image = false): string | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().replace(/[\u0000-\u0020\u007f]/g, '');
  if (/^(?:https?:|mailto:|tel:)/i.test(normalized) || !/^[a-z][a-z\d+.-]*:/i.test(normalized)) return value;
  if (image && /^data:image\/(?:png|gif|jpe?g|webp|avif);base64,/i.test(normalized)) return value;
  return undefined;
}
