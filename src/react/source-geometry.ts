import type { SourceRange } from '../core';
import { intersects } from '../core/tree';
import type { ReaderRuntime, SourceBinding } from './runtime';

export interface Leaf {
  node: Text | HTMLElement;
  kind: 'text' | 'marker' | 'inline' | 'block' | 'image';
  range: SourceRange;
  flow: HTMLElement;
  binding?: SourceBinding;
  offset: number;
}
export interface Viewport { top: number; bottom: number; left: number; right: number }

function flowOf(element: HTMLElement, container: HTMLElement): HTMLElement {
  const known = element.closest<HTMLElement>('pre,p,figcaption,li,th,td,h1,h2,h3,h4,h5,h6,.limr-choice-text,.limr-definition-title,.limr-question-title,.limr-block-content');
  return known && container.contains(known) ? known : element.closest<HTMLElement>('[data-limr-block]') ?? container;
}

export function leavesIn(block: HTMLElement, runtime: ReaderRuntime): Leaf[] {
  runtime.prepareTextBindings(block);
  const result: Leaf[] = [];
  const visit = (node: Node, inherited?: { binding: SourceBinding; offset: number }) => {
    if (node instanceof HTMLElement) {
      if (node !== block && node.hasAttribute('data-limr-document') || node.hasAttribute('inert')) return;
      const marker = node.dataset.limrMarker;
      const atomic = node.dataset.limrAtomic;
      if (marker || atomic) {
        const image = node.dataset.limrMedia === 'image';
        result.push({ node, kind: marker ? 'marker' : image ? 'image' : atomic === 'block' ? 'block' : 'inline', range: { start: Number(node.dataset.sourceStart), end: Number(node.dataset.sourceEnd) }, flow: image ? node : flowOf(node, runtime.content!), offset: 0 });
        return;
      }
      if (node.hasAttribute('data-limr-ignore')) return;
      const binding = runtime.bindings.get(node);
      if (binding) inherited = { binding, offset: 0 };
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const binding = runtime.bindings.get(node) ?? inherited?.binding;
      const offset = runtime.bindings.has(node) ? 0 : inherited?.offset ?? 0;
      const length = node.textContent?.length ?? 0;
      if (binding?.resolve && length) result.push({ node: node as Text, kind: 'text', range: { start: binding.resolve(offset, 'start'), end: binding.resolve(offset + length, 'end') }, flow: flowOf(node.parentElement!, runtime.content!), binding, offset });
      if (inherited) inherited.offset += length;
      return;
    }
    node.childNodes.forEach(child => visit(child, inherited));
  };
  visit(block);
  return result;
}

export function textRange(leaf: Leaf, source: SourceRange, viewport?: Viewport): Range | null {
  const node = leaf.node as Text, length = node.length;
  const resolve = leaf.binding!.resolve!;
  // Binary searches preserve decoded entities, surrogate pairs and source gaps.
  let lo = 0, hi = length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (resolve(leaf.offset + mid + 1, 'end') <= source.start) lo = mid + 1; else hi = mid; }
  let start = lo;
  lo = start; hi = length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (resolve(leaf.offset + mid, 'start') < source.end) lo = mid + 1; else hi = mid; }
  if (start === lo) return null;
  let end = lo;
  const range = document.createRange();
  // A single unwrapped text node can contain a book or a large code fence.
  // Bound its native Range before requesting line rectangles.
  if (viewport && end - start > 1024) {
    range.setStart(node, start); range.setEnd(node, end);
    const box = range.getBoundingClientRect();
    if (box.height > viewport.bottom - viewport.top + 80) {
      lo = start; hi = end;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        range.setStart(node, mid); range.setEnd(node, mid + 1);
        if (range.getBoundingClientRect().bottom < viewport.top) lo = mid + 1; else hi = mid;
      }
      start = lo; hi = end;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        range.setStart(node, mid); range.setEnd(node, mid + 1);
        if (range.getBoundingClientRect().top <= viewport.bottom) lo = mid + 1; else hi = mid;
      }
      end = lo;
    }
  }
  if (start === end) return null;
  range.setStart(node, start); range.setEnd(node, end); return range;
}

/** First rendered character of a source range, independent of its trailing marker. */
export function sourceRangeStartRect(runtime: ReaderRuntime, source: SourceRange): DOMRect | null {
  for (const block of runtime.document.getSnapshot().blocks) {
    if (!intersects(block.range, source)) continue;
    const element = runtime.blocks.get(block.id);
    if (!element) continue;
    for (const leaf of leavesIn(element, runtime)) {
      if (leaf.kind === 'marker' || !intersects(leaf.range, source)) continue;
      if (leaf.kind === 'text') {
        const range = textRange(leaf, source);
        if (!range) continue;
        const node = leaf.node as Text, end = range.endOffset;
        // Measure a character rather than the full range: book-length anchors
        // must not create thousands of line rectangles just to locate a card.
        for (let start = range.startOffset; start < end;) {
          const next = Math.min(end, start + (node.data.codePointAt(start)! > 0xffff ? 2 : 1));
          range.setStart(node, start); range.setEnd(node, next);
          const rect = range.getBoundingClientRect();
          if (rect.width && rect.height) return rect;
          start = next;
        }
      } else {
        const node = leaf.node as HTMLElement;
        const rect = (node.querySelector(leaf.kind === 'image' ? 'img' : '[data-limr-selection-surface]') ?? node).getBoundingClientRect();
        if (rect.width && rect.height) return rect;
      }
    }
  }
  return null;
}

