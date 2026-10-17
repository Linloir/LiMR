import { useEffect } from 'react';
import { selectionFromRange, type SelectionSnapshot, type SourceRange } from '../core';
import type { ReaderRuntime } from './runtime';
import { atomicSelectionText, leavesIn, measurementRange } from './source-geometry';
import { windowedSelectionText } from './windowed-copy';
import { ownsReaderInteraction } from './reader-ownership';
import { selectionBoundaryGuard } from './selection-boundary';

/** Attribute captions can occur before an image in source, while being rendered
 * after it. Project these selections in reading order without covering captions
 * the user did not select. Ordinary prose keeps its fast endpoint-only path. */
function visualSelection(runtime: ReaderRuntime, native: Range, options: Parameters<typeof selectionFromRange>[2]): SelectionSnapshot | undefined {
  if (![...runtime.content!.querySelectorAll('[data-limr-selection-order="visual"]')].some(element => native.intersectsNode(element))) return;
  const blocks = [...runtime.blocks.values()].filter(block => native.intersectsNode(block));
  blocks.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  const leaves = blocks.flatMap(block => leavesIn(block, runtime)).filter(leaf => leaf.kind !== 'marker');
  const selected: SourceRange[] = [];
  for (const leaf of leaves) {
    if (!native.intersectsNode(leaf.node)) continue;
    if (leaf.kind !== 'text') { selected.push(leaf.range); continue; }
    const node = leaf.node as Text;
    const start = native.startContainer === node ? native.startOffset : 0;
    const end = native.endContainer === node ? native.endOffset : node.length;
    if (start < end) selected.push({ start: leaf.binding!.resolve!(leaf.offset + start, 'start'), end: leaf.binding!.resolve!(leaf.offset + end, 'end') });
  }
  if (!selected.length) return;
  // Only bridge syntax gaps: a previously visited or unselected rendered leaf
  // in that source gap would otherwise be painted a second time.
  const sourceOrder = leaves.map(leaf => leaf.range).sort((a, b) => a.end - b.end);
  const ranges: SourceRange[] = [];
  for (const range of selected) {
    const previous = ranges.at(-1);
    let lo = 0, hi = sourceOrder.length;
    if (previous) while (lo < hi) { const mid = (lo + hi) >>> 1; if (sourceOrder[mid].end <= previous.end) lo = mid + 1; else hi = mid; }
    if (previous && range.start >= previous.end && (!sourceOrder[lo] || sourceOrder[lo].start >= range.start)) previous.end = range.end;
    else ranges.push({ ...range });
  }
  const snapshot = runtime.document.getSnapshot();
  const selections = ranges.map(range => selectionFromRange(snapshot, range, options));
  const combine = (key: 'raw' | 'syntax' | 'blocks') => {
    const seen = new Set<string>();
    const ranges = selections.flatMap(selection => selection[key].ranges).filter(range => { const key = `${range.start}:${range.end}`; if (seen.has(key)) return false; seen.add(key); return true; });
    return { ranges, sourceText: ranges.map(range => snapshot.source.slice(range.start, range.end)).join('\n\n') };
  };
  return { ...selections[0], raw: combine('raw'), syntax: combine('syntax'), blocks: combine('blocks') };
}

export function useSelectionTracking(runtime: ReaderRuntime, enabled: boolean) {
  useEffect(() => {
    const container = runtime.content;
    if (!container || !enabled) return;
    let frame = 0, dragging = false;
    const boundary = selectionBoundaryGuard(runtime, container);
    let pointer: { x: number; y: number } | undefined;
    let previous: { startNode: Node; start: number; endNode: Node; end: number; revision: number; settled: boolean } | undefined;
    type Endpoint = { offset: number; atomic: boolean; exact: boolean } | null;
    function resolve(node: Node, offset: number, edge: 'start' | 'end'): Endpoint {
      let element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
      if (!element || element.closest('[data-limr-document]') !== container || element.closest('[data-limr-ignore]')) return null;
      // Plugin atoms can contain mapped children or attributes. The enclosing
      // atomic contract takes precedence over their individual text bindings.
      let atom = element.closest('[data-limr-atomic]');
      for (let outer = atom?.parentElement?.closest('[data-limr-atomic]'); outer && container?.contains(outer); outer = atom.parentElement?.closest('[data-limr-atomic]')) atom = outer;
      const atomicBinding = atom && runtime.bindings.get(atom);
      if (atomicBinding?.atomic) return { offset: edge === 'start' ? atomicBinding.range.start : atomicBinding.range.end, atomic: true, exact: true };
      runtime.prepareTextBindings(element);
      const native = node.nodeType === Node.TEXT_NODE ? runtime.bindings.get(node) : undefined;
      if (native?.resolve) return { offset: native.resolve(offset, edge), atomic: false, exact: native.exact !== false };
      while (element && element !== container) {
        const binding = runtime.bindings.get(element);
        if (binding) {
          if (binding.atomic) return { offset: edge === 'start' ? binding.range.start : binding.range.end, atomic: true, exact: true };
          const range = measurementRange(element.ownerDocument);
          range.setStart(element, 0);
          try { range.setEnd(node, offset); } catch { return null; }
          const localOffset = range.toString().length;
          return { offset: binding.resolve?.(localOffset, edge) ?? (edge === 'start' ? binding.range.start : binding.range.end), atomic: false, exact: binding.exact !== false };
        }
        element = element.parentElement;
      }
      // Native select-all and paragraph-boundary selections can have element
      // endpoints outside a text wrapper. Resolve their first/last visible leaf.
      const children = node.nodeType === Node.ELEMENT_NODE ? Array.from(node.childNodes) : [];
      const candidates = edge === 'start' ? children.slice(offset) : children.slice(0, offset).reverse();
      const descend = (candidate: Node): Endpoint => {
        if (candidate.nodeType === Node.TEXT_NODE && candidate.textContent) return resolve(candidate, edge === 'start' ? 0 : candidate.textContent.length, edge);
        if (candidate instanceof Element) {
          if (candidate.hasAttribute('data-limr-ignore') || candidate.hasAttribute('inert')) return null;
          const binding = runtime.bindings.get(candidate);
          if (binding?.atomic) return { offset: edge === 'start' ? binding.range.start : binding.range.end, atomic: true, exact: true };
        }
        const list = Array.from(candidate.childNodes);
        if (edge === 'end') list.reverse();
        for (const child of list) { const result = descend(child); if (result) return result; }
        return null;
      };
      for (const child of candidates) { const result = descend(child); if (result) return result; }
      return null;
    }
    function process() {
      frame = 0;
      if (runtime.virtualSelection && !dragging) {
        const native = container?.ownerDocument.getSelection();
        if (ownsReaderInteraction(runtime) && native && !native.isCollapsed) return;
        runtime.virtualSelection = false;
      }
      // Selecting/editing text inside a plugin panel must never replace the
      // captured document selection with the form's own native selection.
      if (!dragging && document.activeElement instanceof Element && document.activeElement.closest('[data-limr-selection-ui]')) return;
      const selection = window.getSelection();
      const selectionHint = selection?.rangeCount && !selection.isCollapsed ? boundary.constrain(selection, pointer) : null;
      if (!dragging) pointer = undefined;
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        boundary.reset();
        // A toolbar/dialog owns the captured snapshot while it has focus.
        if (!(document.activeElement instanceof Element) || !document.activeElement.closest('[data-limr-selection-ui]')) {
          previous = undefined; runtime.selectionRange = null; runtime.updateInteraction({ selection: null });
        }
        return;
      }
      const range = selection.getRangeAt(0);
      const revision = runtime.document.getSnapshot().revision;
      if (runtime.interaction.get().selection && previous?.startNode === range.startContainer && previous.start === range.startOffset && previous.endNode === range.endContainer && previous.end === range.endOffset && previous.revision === revision && previous.settled === !dragging) {
        runtime.updateInteraction({ selectionHint }); return;
      }
      const start = resolve(range.startContainer, range.startOffset, 'start');
      const end = resolve(range.endContainer, range.endOffset, 'end');
      if (!start || !end) { previous = undefined; runtime.selectionRange = null; runtime.updateInteraction({ selection: null }); return; }
      previous = { startNode: range.startContainer, start: range.startOffset, endNode: range.endContainer, end: range.endOffset, revision, settled: !dragging };
      runtime.selectionRange = range.cloneRange();
      runtime.highlightReference = null;
      const text = selection.toString();
      const options = {
        // An image/diagram can prohibit internal text selection while its
        // complete source block remains selectable and copyable.
        text: text || (start.atomic && end.atomic ? runtime.document.getSnapshot().source.slice(start.offset, end.offset) : ''), settled: !dragging,
        quality: (!start.exact || !end.exact ? 'unmapped' : start.atomic || end.atomic ? 'atomic' : 'exact') as SelectionSnapshot['quality'],
      };
      let captured = visualSelection(runtime, range, options) ?? selectionFromRange(runtime.document.getSnapshot(), { start: start.offset, end: end.offset }, options);
      if (!dragging) {
        const atomicText = atomicSelectionText(runtime, captured.raw.ranges);
        if (atomicText !== undefined) captured = { ...captured, text: atomicText, quality: 'atomic' };
      }
      if (!dragging && runtime.documentViewport) captured = { ...captured, text: windowedSelectionText(runtime, captured.raw.ranges) };
      runtime.updateInteraction({ activeHighlight: null, selection: captured, selectionHint });
    }
    // Coalesce within a frame, never debounce a continuous drag. A resetting
    // timeout can starve updates for the entire gesture on a 60/120 Hz pointer.
    const schedule = () => { if (!frame) frame = requestAnimationFrame(process); };
    const position = (event: Event) => event instanceof PointerEvent ? { x: event.clientX, y: event.clientY } : undefined;
    const down = (event: PointerEvent) => { runtime.virtualSelection = false; dragging = true; pointer = position(event); boundary.reset(); };
    const move = (event: PointerEvent) => { if (dragging) { pointer = position(event); schedule(); } };
    const up = (event: Event) => { if (dragging) pointer = position(event); dragging = false; schedule(); };
    const atomicCopyText = (event: Event) => {
      const native = window.getSelection(), captured = runtime.interaction.get().selection;
      if (event.defaultPrevented || !native?.anchorNode || native.isCollapsed || !container.contains(native.anchorNode) || captured?.quality !== 'atomic') return null;
      if (event.target instanceof Element && event.target.closest('input,textarea,[contenteditable],[data-limr-selection-ui]')) return null;
      return captured.settled ? captured.text : atomicSelectionText(runtime, captured.raw.ranges) ?? captured.text;
    };
    const windowedCopyText = (event: Event) => {
      const selection = runtime.interaction.get().selection, native = container.ownerDocument.getSelection();
      if (!runtime.documentViewport || !selection || !ownsReaderInteraction(runtime) || !native || native.isCollapsed || event.defaultPrevented) return undefined;
      if (event.target instanceof Element && event.target.closest('input,textarea,[contenteditable],[data-limr-selection-ui]')) return undefined;
      return windowedSelectionText(runtime, selection.raw.ranges);
    };
    const copy = (event: ClipboardEvent) => {
      const projected = windowedCopyText(event);
      if (projected !== undefined && event.clipboardData) {
        event.clipboardData.setData('text/plain', projected); event.preventDefault(); return;
      }
      const text = atomicCopyText(event);
      if (!text || !event.clipboardData) return;
      event.clipboardData.setData('text/plain', text); event.preventDefault();
    };
    const copyKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'c' || !(event.ctrlKey || event.metaKey) || event.altKey || !navigator.clipboard?.writeText) return;
      if (window.getSelection()?.toString()) return;
      const projected = windowedCopyText(event);
      if (projected !== undefined) { event.preventDefault(); void navigator.clipboard.writeText(projected).catch(() => {}); return; }
      const text = atomicCopyText(event); if (!text) return;
      // Chromium omits the copy event entirely for user-select:none SVGs.
      // This fallback only handles those otherwise empty atomic selections.
      event.preventDefault(); void navigator.clipboard.writeText(text).catch(() => {});
    };
    const release = (event: PointerEvent) => { if (!container.contains(event.target as Node)) { runtime.virtualSelection = false; schedule(); } };
    document.addEventListener('pointerdown', release, true);
    document.addEventListener('selectionchange', schedule);
    container.addEventListener('pointerdown', down);
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
    document.addEventListener('keyup', schedule);
    document.addEventListener('copy', copy);
    document.addEventListener('keydown', copyKey);
    const unsubscribe = runtime.configuration.subscribe(schedule);
    if (window.getSelection()?.isCollapsed === false) schedule();
    return () => { document.removeEventListener('pointerdown', release, true); unsubscribe(); cancelAnimationFrame(frame); document.removeEventListener('selectionchange', schedule); container.removeEventListener('pointerdown', down); document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); document.removeEventListener('keyup', schedule); document.removeEventListener('copy', copy); document.removeEventListener('keydown', copyKey); };
  }, [runtime, enabled]);
}
