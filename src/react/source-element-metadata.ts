import type { SourceRange } from '../core';

interface ElementMetadata {
  document: boolean;
  inert: boolean;
  marker?: string;
  atomic?: string;
  image?: boolean;
  range?: SourceRange;
  ignore?: boolean;
}

/** Only lives during one synchronous source-anchor pass. This observer is
 * separate from InkCache's observer: taking these records must not change when
 * the existing semantic cache invalidates. Nothing here caches layout/bindings
 * or a child list, and all attribute mutations are conservative invalidations. */
export class SourceElementMetadata {
  private cache: WeakMap<HTMLElement, ElementMetadata> | undefined;
  private observer: MutationObserver;
  private live = true;
  constructor(readonly content: HTMLElement) {
    this.observer = new MutationObserver(() => this.clear());
    this.observer.observe(content, { subtree: true, attributes: true, childList: true, characterData: true });
  }
  clear() { this.cache = undefined; }
  sync() { if (this.live && this.observer.takeRecords().length) this.clear(); }
  dispose() { this.live = false; this.observer.disconnect(); this.clear(); }
  get(element: HTMLElement): ElementMetadata {
    const known = this.live && this.cache?.get(element); if (known) return known;
    const value: ElementMetadata = { document: element.hasAttribute('data-limr-document'), inert: element.hasAttribute('inert') };
    if (!value.inert) {
      value.marker = element.dataset.limrMarker; value.atomic = element.dataset.limrAtomic;
      if (value.marker || value.atomic) {
        value.image = element.dataset.limrMedia === 'image';
        value.range = { start: Number(element.dataset.sourceStart), end: Number(element.dataset.sourceEnd) };
      } else value.ignore = element.hasAttribute('data-limr-ignore');
    }
    // A reentrant caller may dispose the lookup during a resolver. The active
    // traversal can finish, but must not recreate an unobserved retained cache.
    if (this.live) (this.cache ??= new WeakMap()).set(element, value);
    return value;
  }
}
