import type { ReaderRuntime } from './runtime';
import type { ReadingPosition } from './types';
import { leavesIn, measurementRange, sourceRangeStartRect } from './source-geometry';

const orderedBlocks = new WeakMap<ReaderRuntime, { revision: number; documentRevision: number; elements: HTMLElement[] }>();
function readingBlocks(runtime: ReaderRuntime): HTMLElement[] {
  let cached = orderedBlocks.get(runtime);
  const documentRevision = runtime.document.getSnapshot().revision;
  if (!cached || cached.revision !== runtime.blockRevision || cached.documentRevision !== documentRevision) {
    const elements = [...runtime.blocks.values()].sort((a, b) => a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    cached = { revision: runtime.blockRevision, documentRevision, elements }; orderedBlocks.set(runtime, cached);
  }
  // A window has a bounded set of retained DOM leases outside the flow. The
  // ordinary reader has no parked slots and needs only logarithmic rect reads.
  return runtime.documentViewport ? cached.elements.filter(element => !element.closest('[inert],[data-window-parked]')) : cached.elements;
}

export function* visibleReadingBlocks(runtime: ReaderRuntime, top: number, bottom = Infinity) {
  const elements = readingBlocks(runtime);
  let lo = 0, hi = elements.length;
  while (lo < hi) { const middle = (lo + hi) >>> 1; if (elements[middle].getBoundingClientRect().bottom <= top) lo = middle + 1; else hi = middle; }
  for (let index = lo; index < elements.length; index++) {
    const element = elements[index]; if (element.closest('[inert],[data-window-parked]')) continue;
    const rect = element.getBoundingClientRect();
    if (rect.top >= bottom) break;
    if (rect.height && rect.bottom > top) yield { element, rect };
  }
}

/** Capture rendered source geometry rather than a physical scroll fraction.
 * Only the block intersecting the reading edge is inspected, even for a book. */
export function captureReadingPosition(runtime: ReaderRuntime, measuredBlock?: { element: HTMLElement; rect: DOMRect }): ReadingPosition | null {
  if (!runtime.content) return null;
  const viewport = runtime.getViewportTop(), edge = viewport + (runtime.configuration.get().scrollOffset ?? 24);
  // A virtual viewport already has a height index and can supply its measured
  // reading-edge block without sorting/filtering all retained DOM leases.
  const block = measuredBlock ?? visibleReadingBlocks(runtime, edge).next().value; if (!block) return null;
  for (const leaf of leavesIn(block.element, runtime)) {
    if (leaf.kind === 'marker') continue;
    if (leaf.kind !== 'text') {
      const element = leaf.node as HTMLElement;
      const rect = (element.querySelector(leaf.kind === 'image' ? '[data-limr-selection-surface],img' : '[data-limr-selection-surface]') ?? element).getBoundingClientRect();
      if (rect.height && rect.bottom > edge) return { source: leaf.range.start, offset: rect.top - viewport };
      continue;
    }
    const node = leaf.node as Text, length = node.length, range = measurementRange(node.ownerDocument);
    if (!length) continue;
    range.selectNodeContents(node);
    if (range.getBoundingClientRect().bottom <= edge) continue;
    // A plain text node may span many soft-wrapped lines. Locate the first
    // visible line with logarithmic character measurements, not a whole Range
    // getClientRects() allocation proportional to paragraph length.
    let lo = 0, hi = length;
    while (lo < hi) {
      const middle = (lo + hi) >>> 1;
      range.setStart(node, middle); range.setEnd(node, middle + 1);
      if (range.getBoundingClientRect().bottom <= edge) lo = middle + 1; else hi = middle;
    }
    if (lo >= length) continue;
    if (lo && /[\uDC00-\uDFFF]/.test(node.data[lo])) lo--;
    const end = Math.min(length, lo + (node.data.codePointAt(lo)! > 0xffff ? 2 : 1));
    range.setStart(node, lo); range.setEnd(node, end);
    const rect = range.getBoundingClientRect();
    if (rect.height) return { source: leaf.binding!.resolve!(leaf.offset + lo, 'start'), offset: rect.top - viewport };
  }
  const source = Number(block.element.dataset.sourceStart);
  return Number.isFinite(source) ? { source, offset: block.rect.top - viewport } : null;
}

export function restoreReadingPosition(runtime: ReaderRuntime, position: ReadingPosition): void {
  if (!Number.isFinite(position.source) || !Number.isFinite(position.offset)) return;
  const snapshot = runtime.document.getSnapshot(); if (!snapshot.source.length) return;
  const start = Math.max(0, Math.min(snapshot.source.length - 1, Math.floor(position.source)));
  const range = { start, end: Math.min(snapshot.source.length, start + 2) };
  if (runtime.documentViewport) { runtime.documentViewport.reveal(range, position.offset); return; }
  const block = snapshot.blocks.find(block => block.range.end > start && block.range.start <= start);
  const rect = sourceRangeStartRect(runtime, range) ?? (block && runtime.blocks.get(block.id)?.getBoundingClientRect());
  if (rect) runtime.scrollTo(runtime.getScrollTop() + rect.top - runtime.getViewportTop() - position.offset, 'instant');
}
