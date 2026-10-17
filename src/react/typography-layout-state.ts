import type { SourceRange } from '../core';
import type { ReaderRuntime } from './runtime';
import { leavesIn } from './source-geometry';

// Lightweight shared state: consulting it must not load the lazy typesetter.
const probes = new WeakMap<Element, () => boolean>();
const initializing = new WeakSet<Element>();
export function initializeTypographyLayout(element: Element, pending: boolean): void {
  if (pending) initializing.add(element); else initializing.delete(element);
}
const versions = new WeakMap<ReaderRuntime, number>();
const queued = new WeakMap<ReaderRuntime, Set<Element>>();
export function queueTypographyLayout(runtime: ReaderRuntime, element: Element, pending: boolean): void {
  let elements = queued.get(runtime);
  if (pending) { if (!elements) queued.set(runtime, elements = new Set()); elements.add(element); }
  else if (elements?.delete(element)) runtime.requestLayout();
}
export const typographyLayoutVersion = (runtime: ReaderRuntime): number => versions.get(runtime) ?? 0;
export function finishTypographyLayout(runtime: ReaderRuntime): void {
  versions.set(runtime, typographyLayoutVersion(runtime) + 1);
  runtime.requestLayout();
}
export function observeTypographyLayout(element: Element, pending?: () => boolean): void {
  if (pending) probes.set(element, pending); else probes.delete(element);
}

/** Wait for the source paragraph and scheduled predecessors in its current
 * flow. Other paragraphs in a list/translation may intentionally stay lazy. */
export function sourceTypographyPending(runtime: ReaderRuntime, block: HTMLElement, range: SourceRange, flow?: HTMLElement): boolean {
  if (runtime.configuration.get().typography !== 'knuth-plass') return false;
  if (initializing.has(block)) return true;
  const own = probes.get(block); if (own?.()) return true;
  const preceding = flow && queued.get(runtime);
  if (own && !preceding?.size) return false;
  const leaf = leavesIn(block, runtime).find(leaf => leaf.kind !== 'marker' && leaf.range.end > range.start);
  const target = leaf?.node instanceof Element ? leaf.node : leaf?.node.parentElement;
  for (let element = target; element; element = element.parentElement) {
    if (probes.get(element)?.()) return true;
    if (element === block) break;
  }
  // A preceding paragraph can move this character after its own paragraph has
  // settled. Wait only for scheduled work in this mounted flow, never for lazy
  // offscreen dirty jobs or retained/parked media and selection leases.
  if (target && preceding) for (const element of preceding) {
    if (flow!.contains(element) && !element.closest('[data-window-parked]') && (element.contains(target) || element.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING)) return true;
  }
  return false;
}
