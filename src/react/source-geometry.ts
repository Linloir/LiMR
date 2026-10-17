import type { SourceRange } from '../core';
import { intersects } from '../core/tree';
import type { ReaderRuntime, SourceBinding } from './runtime';
import { SourceElementMetadata } from './source-element-metadata';

export interface Leaf {
  node: Text | HTMLElement;
  kind: 'text' | 'marker' | 'inline' | 'block' | 'image';
  range: SourceRange;
  flow: HTMLElement;
  binding?: SourceBinding;
  offset: number;
}
export interface Viewport { top: number; bottom: number; left: number; right: number }

const measurementRanges = new WeakMap<Document, Range>();
/** Synchronous scratch range, never retained as a selection. Reusing it avoids
 * thousands of live browser ranges updating during subsequent DOM mutations. */
export function measurementRange(document: Document): Range {
  let range = measurementRanges.get(document);
  if (!range) { range = document.createRange(); measurementRanges.set(document, range); }
  return range;
}

function flowOf(element: HTMLElement, container: HTMLElement): HTMLElement {
  const known = element.closest<HTMLElement>('pre,p,figcaption,li,th,td,h1,h2,h3,h4,h5,h6,.limr-choice-text,.limr-definition-title,.limr-question-title,.limr-block-content');
  return known && container.contains(known) ? known : element.closest<HTMLElement>('[data-limr-block]') ?? container;
}

export function leavesIn(block: HTMLElement, runtime: ReaderRuntime): Leaf[] {
  const result: Leaf[] = [];
  visitLeaves(block, runtime, leaf => { result.push(leaf); return false; });
  return result;
}

/** Short-circuit a source lookup without building every KP line's leaf list.
 * Full-range paint still visits all leaves; card anchors stop at the first ink. */
function visitLeaves(block: HTMLElement, runtime: ReaderRuntime, accept: (leaf: Leaf) => boolean, source?: SourceRange, onBreak?: (range: SourceRange) => void, metadata?: SourceElementMetadata) {
  runtime.prepareTextBindings(block);
  metadata?.sync();
  // Custom/stale block registrations can sit outside the observed reader.
  // Check once per actual walk, after prepare may have moved its DOM.
  if (metadata && (metadata.content !== runtime.content || !metadata.content.contains(block))) metadata = undefined;
  const emit = (leaf: Leaf) => {
    const accepted = (!source || intersects(leaf.range, source)) && accept(leaf);
    // A custom resolver/callback may mutate a later node before traversal
    // continues. Successful queries synchronize again at the next startRect.
    if (!accepted) metadata?.sync();
    return accepted;
  };
  const visit = (node: Node, inherited?: { binding: SourceBinding; offset: number }): boolean => {
    if (node instanceof HTMLElement) {
      const known = metadata?.get(node);
      if (node !== block && (known ? known.document : node.hasAttribute('data-limr-document')) || (known ? known.inert : node.hasAttribute('inert'))) return false;
      const marker = known ? known.marker : node.dataset.limrMarker;
      const atomic = known ? known.atomic : node.dataset.limrAtomic;
      if (marker || atomic) {
        const image = known ? known.image : node.dataset.limrMedia === 'image';
        return emit({ node, kind: marker ? 'marker' : image ? 'image' : atomic === 'block' ? 'block' : 'inline', range: known?.range ?? { start: Number(node.dataset.sourceStart), end: Number(node.dataset.sourceEnd) }, flow: image ? node : flowOf(node, runtime.content!), offset: 0 });
      }
      if (known ? known.ignore : node.hasAttribute('data-limr-ignore')) return false;
      if (onBreak && node.hasAttribute('data-limr-break')) onBreak({ start: Number(node.dataset.sourceStart), end: Number(node.dataset.sourceEnd) });
      const binding = runtime.bindings.get(node);
      if (source && binding && !intersects(binding.range, source)) return false;
      if (binding) inherited = { binding, offset: 0 };
    }
    if (node.nodeType === Node.TEXT_NODE) {
      const binding = runtime.bindings.get(node) ?? inherited?.binding;
      const offset = runtime.bindings.has(node) ? 0 : inherited?.offset ?? 0;
      const length = node.textContent?.length ?? 0;
      if (inherited) inherited.offset += length;
      if (binding?.resolve && length) return emit({ node: node as Text, kind: 'text', range: { start: binding.resolve(offset, 'start'), end: binding.resolve(offset + length, 'end') }, flow: flowOf(node.parentElement!, runtime.content!), binding, offset });
      return false;
    }
    for (const child of node.childNodes) if (visit(child, inherited)) return true;
    return false;
  };
  return visit(block);
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
  const range = measurementRange(node.ownerDocument);
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

/** Native math selections include KaTeX's presentation/accessibility trees,
 * sometimes just one glyph. Serialize selected atoms from source, preserving
 * surrounding rendered text and visual order instead of copying those trees. */
export function atomicSelectionText(runtime: ReaderRuntime, ranges: readonly SourceRange[]): string | undefined {
  const document = runtime.document.getSnapshot();
  const selected = (range: SourceRange) => ranges.some(source => intersects(source, range));
  const blocks = document.blocks.filter(block => selected(block.range)).map(block => runtime.blocks.get(block.id)).filter((element): element is HTMLElement => !!element);
  const hasAtomic = blocks.some(block => [block, ...block.querySelectorAll<HTMLElement>('[data-limr-atomic]')].some(element =>
    element.hasAttribute('data-limr-atomic') && selected({ start: Number(element.dataset.sourceStart), end: Number(element.dataset.sourceEnd) })));
  if (!hasAtomic) return;
  const omissions = [...document.annotationRanges.values()].flatMap(references => references.flatMap(reference => [reference.openingRange, reference.markerRange])).sort((a, b) => a.start - b.start);
  const atomicText = (range: SourceRange) => {
    let text = '', start = range.start;
    for (const omission of omissions) {
      if (omission.end <= start || omission.start >= range.end) continue;
      text += document.source.slice(start, Math.max(start, omission.start));
      start = Math.min(range.end, omission.end);
    }
    return text + document.source.slice(start, range.end);
  };
  const paragraphs: string[] = [];
  for (const block of blocks) {
    const parts: string[] = []; let previousFlow: HTMLElement | undefined;
    visitLeaves(block, runtime, leaf => {
      if (leaf.kind === 'marker' || !selected(leaf.range)) return false;
      const text = leaf.kind !== 'text' ? atomicText(leaf.range) : ranges.filter(range => intersects(range, leaf.range)).map(range => textRange(leaf, range)?.toString() ?? '').join('');
      if (!text) return false;
      if (previousFlow && previousFlow !== leaf.flow) parts.push(previousFlow.matches('th,td') && leaf.flow.matches('th,td') && previousFlow.parentElement === leaf.flow.parentElement ? '\t' : '\n');
      parts.push(text); previousFlow = leaf.flow;
      return false;
    }, undefined, range => { if (selected(range)) parts.push('\n'); });
    if (parts.length) paragraphs.push(parts.join(''));
  }
  return paragraphs.join('\n\n');
}

interface SourceInk { node: Text | HTMLElement; start?: number; end?: number }
function inkRect(ink: SourceInk): DOMRect | null {
  if (!ink.node.isConnected || (ink.node instanceof HTMLElement ? ink.node : ink.node.parentElement)?.closest('[inert]')) return null;
  if (ink.node instanceof Text) {
    const range = measurementRange(ink.node.ownerDocument);
    range.setStart(ink.node, ink.start!); range.setEnd(ink.node, ink.end!);
    const rect = range.getBoundingClientRect();
    return rect.width && rect.height ? rect : null;
  }
  const rect = ink.node.getBoundingClientRect();
  return rect.width && rect.height ? rect : null;
}
type InkCache = WeakMap<HTMLElement, Map<string, SourceInk>>;

/** Cache the source-to-DOM lookup, never its viewport rectangle. Moving a block
 * does not change its first character. One observer invalidates only blocks
 * whose text, visibility or KP-owned nodes changed; paint layers are ignored. */
export function createSourceRangeLookup(runtime: ReaderRuntime) {
  let content: HTMLElement | null = null, observer: MutationObserver | undefined;
  let snapshot = runtime.document.getSnapshot(), cache: InkCache = new WeakMap();
  type Pass = { previous?: Pass; metadata?: SourceElementMetadata };
  let pass: Pass | undefined;
  const passMetadata = () => {
    if (!pass) return;
    if (pass.metadata?.content !== runtime.content) {
      pass.metadata?.dispose();
      pass.metadata = runtime.content ? new SourceElementMetadata(runtime.content) : undefined;
    }
    return pass.metadata;
  };
  const invalidate = (records: MutationRecord[]) => {
    if (records.length) pass?.metadata?.clear();
    for (const record of records) {
      const target = record.target instanceof Element ? record.target : record.target.parentElement;
      if (target?.closest('.limr-highlight-layer,.limr-paint-layer')) continue;
      if (record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].every(node => node instanceof Element && node.matches('.limr-highlight-layer,.limr-paint-layer'))) continue;
      const block = target?.closest<HTMLElement>('[data-limr-block]');
      if (block) cache.delete(block); else cache = new WeakMap();
    }
  };
  return {
    withPass<T>(read: () => T): T {
      const current: Pass = { previous: pass }; pass = current;
      try {
        const result = read();
        if (result && typeof (result as { then?: unknown }).then === 'function') throw new TypeError('Source lookup passes must be synchronous.');
        return result;
      } finally {
        current.metadata?.dispose();
        if (pass === current) { pass = current.previous; pass?.metadata?.clear(); }
      }
    },
    startRect(source: SourceRange) {
      if (content !== runtime.content) {
        observer?.disconnect(); content = runtime.content; cache = new WeakMap();
        if (content) {
          observer = new MutationObserver(invalidate);
          observer.observe(content, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['inert', 'hidden', 'class', 'style'] });
        }
      }
      // Layout effects can query after a React commit but before the observer's
      // microtask. Drain those mutations before using an old character offset.
      if (observer) invalidate(observer.takeRecords());
      if (snapshot !== runtime.document.getSnapshot()) { snapshot = runtime.document.getSnapshot(); cache = new WeakMap(); pass?.metadata?.clear(); }
      const metadata = passMetadata(); metadata?.sync();
      return sourceRangeStartRect(runtime, source, cache, metadata);
    },
    dispose() {
      observer?.disconnect(); observer = undefined; content = null; cache = new WeakMap();
      for (let current = pass; current; current = current.previous) current.metadata?.dispose();
      pass = undefined;
    },
  };
}

/** First rendered character of a source range, independent of its trailing marker. */
export function sourceRangeStartRect(runtime: ReaderRuntime, source: SourceRange, cache?: InkCache, metadata?: SourceElementMetadata): DOMRect | null {
  if (source.start === source.end) return null;
  const blocks = runtime.document.getSnapshot().blocks;
  let lo = 0, hi = blocks.length;
  while (lo < hi) { const mid = (lo + hi) >>> 1; if (blocks[mid].range.end <= source.start) lo = mid + 1; else hi = mid; }
  for (let index = lo; index < blocks.length && blocks[index].range.start < source.end; index++) {
    const block = blocks[index];
    const element = runtime.blocks.get(block.id);
    if (!element) continue;
    const key = `${source.start}:${source.end}`, known = cache?.get(element)?.get(key);
    if (known && element.contains(known.node)) { const rect = inkRect(known); if (rect) return rect; }
    let found: DOMRect | null = null;
    const remember = (ink: SourceInk, rect: DOMRect) => {
      found = rect;
      if (cache) { let entries = cache.get(element); if (!entries) cache.set(element, entries = new Map()); entries.set(key, ink); }
      return true;
    };
    visitLeaves(element, runtime, leaf => {
      if (leaf.kind === 'marker') return false;
      if (leaf.kind === 'text') {
        const range = textRange(leaf, source);
        if (!range) return false;
        const node = leaf.node as Text, end = range.endOffset;
        // Measure a character rather than the full range: book-length anchors
        // must not create thousands of line rectangles just to locate a card.
        for (let start = range.startOffset; start < end;) {
          const next = Math.min(end, start + (node.data.codePointAt(start)! > 0xffff ? 2 : 1));
          range.setStart(node, start); range.setEnd(node, next);
          const rect = range.getBoundingClientRect();
          if (rect.width && rect.height) return remember({ node, start, end: next }, rect);
          start = next;
        }
      } else {
        const node = leaf.node as HTMLElement;
        const surface = node.querySelector<HTMLElement>(leaf.kind === 'image' ? 'img' : '[data-limr-selection-surface]') ?? node;
        const rect = surface.getBoundingClientRect();
        if (rect.width && rect.height) return remember({ node: surface }, rect);
      }
      return false;
    }, source, undefined, metadata);
    if (found) return found;
  }
  return null;
}

