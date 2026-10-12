import { useEffect } from 'react';
import { selectionFromRange } from '../core';
import type { ReaderRuntime } from './runtime';

export function useSelectionTracking(runtime: ReaderRuntime, enabled: boolean) {
  useEffect(() => {
    const container = runtime.content;
    if (!container || !enabled) return;
    let frame = 0, dragging = false;
    let previous: { startNode: Node; start: number; endNode: Node; end: number; revision: number; settled: boolean } | undefined;
    type Endpoint = { offset: number; atomic: boolean; exact: boolean } | null;
    function resolve(node: Node, offset: number, edge: 'start' | 'end'): Endpoint {
      let element = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
      if (!element || element.closest('[data-limr-document]') !== container || element.closest('[data-limr-ignore]')) return null;
      runtime.prepareTextBindings(element);
      const native = node.nodeType === Node.TEXT_NODE ? runtime.bindings.get(node) : undefined;
      if (native?.resolve) return { offset: native.resolve(offset, edge), atomic: false, exact: native.exact !== false };
      while (element && element !== container) {
        const binding = runtime.bindings.get(element);
        if (binding) {
          if (binding.atomic) return { offset: edge === 'start' ? binding.range.start : binding.range.end, atomic: true, exact: true };
          const range = document.createRange();
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
        if (candidate instanceof Element && candidate.hasAttribute('data-limr-ignore')) return null;
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
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        // A toolbar/dialog owns the captured snapshot while it has focus.
        if (!(document.activeElement instanceof Element) || !document.activeElement.closest('[data-limr-selection-ui]')) {
          previous = undefined; runtime.selectionRange = null; runtime.updateInteraction({ selection: null });
        }
        return;
      }
      const range = selection.getRangeAt(0);
      const revision = runtime.document.getSnapshot().revision;
      if (previous?.startNode === range.startContainer && previous.start === range.startOffset && previous.endNode === range.endContainer && previous.end === range.endOffset && previous.revision === revision && previous.settled === !dragging) return;
      const start = resolve(range.startContainer, range.startOffset, 'start');
      const end = resolve(range.endContainer, range.endOffset, 'end');
      if (!start || !end) { previous = undefined; runtime.selectionRange = null; runtime.updateInteraction({ selection: null }); return; }
      previous = { startNode: range.startContainer, start: range.startOffset, endNode: range.endContainer, end: range.endOffset, revision, settled: !dragging };
      runtime.selectionRange = range.cloneRange();
      runtime.updateInteraction({ selection: selectionFromRange(runtime.document.getSnapshot(), { start: start.offset, end: end.offset }, {
        text: selection.toString(), settled: !dragging,
        quality: !start.exact || !end.exact ? 'unmapped' : start.atomic || end.atomic ? 'atomic' : 'exact',
      }) });
    }
    // Coalesce within a frame, never debounce a continuous drag. A resetting
    // timeout can starve updates for the entire gesture on a 60/120 Hz pointer.
    const schedule = () => { if (!frame) frame = requestAnimationFrame(process); };
    const down = () => { dragging = true; };
    const up = () => { dragging = false; schedule(); };
    document.addEventListener('selectionchange', schedule);
    container.addEventListener('pointerdown', down);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
    document.addEventListener('keyup', schedule);
    if (window.getSelection()?.isCollapsed === false) schedule();
    return () => { cancelAnimationFrame(frame); document.removeEventListener('selectionchange', schedule); container.removeEventListener('pointerdown', down); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); document.removeEventListener('keyup', schedule); };
  }, [runtime, enabled]);
}
