import { useEffect } from 'react';
import { selectionFromRange } from '../core';
import type { ReaderRuntime } from './runtime';

export function useSelectionTracking(runtime: ReaderRuntime, enabled: boolean) {
  useEffect(() => {
    const container = runtime.content;
    if (!container || !enabled) return;
    let timer = 0, dragging = false;
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
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.rangeCount) {
        // A toolbar/dialog owns the captured snapshot while it has focus.
        if (!(document.activeElement instanceof Element) || !document.activeElement.closest('[data-limr-selection-ui]')) {
          runtime.selectionRange = null; runtime.updateInteraction({ selection: null });
        }
        return;
      }
      const range = selection.getRangeAt(0);
      const start = resolve(range.startContainer, range.startOffset, 'start');
      const end = resolve(range.endContainer, range.endOffset, 'end');
      if (!start || !end) { runtime.updateInteraction({ selection: null }); return; }
      runtime.selectionRange = range.cloneRange();
      runtime.updateInteraction({ selection: selectionFromRange(runtime.document.getSnapshot(), { start: start.offset, end: end.offset }, {
        text: selection.toString(), settled: !dragging,
        quality: !start.exact || !end.exact ? 'unmapped' : start.atomic || end.atomic ? 'atomic' : 'exact',
      }) });
    }
    const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(process, dragging ? 32 : 0); };
    const down = () => { dragging = true; };
    const up = () => { dragging = false; schedule(); };
    document.addEventListener('selectionchange', schedule);
    container.addEventListener('pointerdown', down);
    document.addEventListener('pointerup', up);
    document.addEventListener('keyup', schedule);
    return () => { clearTimeout(timer); document.removeEventListener('selectionchange', schedule); container.removeEventListener('pointerdown', down); document.removeEventListener('pointerup', up); document.removeEventListener('keyup', schedule); };
  }, [runtime, enabled]);
}
