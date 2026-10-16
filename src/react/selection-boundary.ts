import type { ReaderRuntime } from './runtime';

const selector = '[data-limr-selection-boundary]';
type Point = { node: Node; offset: number };
type Pointer = { x: number; y: number };
const elementOf = (node: Node) => node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;

/** Modules opt into native selection boundaries, supplying their own hint.
 * Source ranges and saved annotations deliberately do not use this constraint. */
export function selectionBoundaryGuard(runtime: ReaderRuntime, container: HTMLElement) {
  let applied: { anchor: Point; focus: Point; origin: Element | null; boundary: Element; showHint: boolean } | undefined;
  const boundaryOf = (node: Node) => {
    const element = elementOf(node);
    return element?.closest('[data-limr-document]') === container ? element.closest(selector) : null;
  };
  // Use mapped content at the boundary, rather than a wrapper endpoint that
  // may have no source binding (or a trailing mode switch/annotation marker).
  function edge(node: Node, end: boolean): Point | undefined {
    if (node instanceof Element) {
      if (node.matches('[inert],[data-limr-ignore]') || node !== container && node.hasAttribute('data-limr-document')) return;
      if (node.hasAttribute('data-limr-atomic')) return { node, offset: end ? node.childNodes.length : 0 };
    }
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const element = node.parentElement!;
      runtime.prepareTextBindings(element);
      if (runtime.bindings.has(node) || element.closest('[data-source-start]')) return { node, offset: end ? node.textContent.length : 0 };
    }
    const children = Array.from(node.childNodes);
    if (end) children.reverse();
    for (const child of children) { const point = edge(child, end); if (point) return point; }
  }
  function outside(boundary: Element, forward: boolean): Point | undefined {
    for (let node: Node | null = boundary; node && node !== container; node = node.parentNode) {
      for (let sibling = forward ? node.previousSibling : node.nextSibling; sibling; sibling = forward ? sibling.previousSibling : sibling.nextSibling) {
        const point = edge(sibling, forward); if (point) return point;
      }
    }
  }
  return {
    reset() { applied = undefined; },
    constrain(selection: Selection, pointer?: Pointer): string | null {
      if (applied && (!applied.boundary.isConnected || !applied.boundary.hasAttribute('data-limr-selection-boundary'))) applied = undefined;
      const { anchorNode, anchorOffset, focusNode, focusOffset } = selection;
      if (!anchorNode || !focusNode || !container.contains(anchorNode)) { applied = undefined; return null; }
      const unchanged = applied && applied.anchor.node === anchorNode && applied.anchor.offset === anchorOffset && applied.focus.node === focusNode && applied.focus.offset === focusOffset;
      if (!unchanged) {
        applied = undefined;
        const range = selection.getRangeAt(0), origin = boundaryOf(anchorNode);
        const forward = range.startContainer === anchorNode && range.startOffset === anchorOffset;
        // Only immediate boundary children can be entered from this region.
        // In particular, an outside drag stops before the entire translation
        // block, including its hidden language panel.
        const candidates = [...container.querySelectorAll(selector)].filter(boundary =>
          boundary.closest('[data-limr-document]') === container && boundary.parentElement?.closest(selector) === origin && !boundary.closest('[inert],[data-limr-ignore]') && range.intersectsNode(boundary));
        const entered = forward ? candidates[0] : candidates.at(-1);
        const boundary = entered ?? (origin && !origin.contains(focusNode) ? origin : null);
        if (boundary) {
          const focus = (entered ? outside(entered, forward) : edge(boundary, forward)) ?? { node: anchorNode, offset: anchorOffset };
          const showHint = !!(origin || boundaryOf(focusNode));
          selection.setBaseAndExtent(anchorNode, anchorOffset, focus.node, focus.offset);
          applied = { anchor: { node: anchorNode, offset: anchorOffset }, focus, origin, boundary, showHint };
        }
      }
      if (applied && pointer) {
        // Pointer capture can keep event.target at the drag origin. Hit-test
        // the actual release position, even if the native range is unchanged.
        const target = container.ownerDocument.elementFromPoint(pointer.x, pointer.y);
        applied.showHint = !!target && (applied.origin ? !applied.origin.contains(target) : !!boundaryOf(target));
      }
      return applied?.showHint ? applied.boundary.getAttribute('data-limr-selection-boundary') : null;
    },
  };
}
