import type { PaintHighlight } from './runtime';
import { useEffect, useRef } from 'react';
import type { SourceRange } from '../core';
import { intersects } from '../core/tree';
import { sameRange } from '../core/annotations';
import type { ReaderRuntime } from './runtime';
import { leavesIn, textRange, type Leaf, type Viewport } from './source-geometry';

interface PaintRect { left: number; top: number; width: number; height: number; flow: HTMLElement; marker?: string; atomic?: boolean; image?: boolean; radius?: string }

/** Separate paint from content. Every inline fragment uses its line's typography
 * instead of the (different) code, KaTeX or superscript box height. */
function rectangles(leaves: readonly Leaf[], source: SourceRange, viewport: Viewport, measure: (element: HTMLElement) => { ascent: number; descent: number; height: number }): PaintRect[] {
  const raw: (PaintRect & { baseline: number; flow: HTMLElement })[] = [];
  const geometry = (leaf: Leaf, rect: DOMRect, reference?: { rect: DOMRect; element: HTMLElement }) => {
    const flowMetrics = measure(leaf.flow);
    const own = measure(reference?.element ?? (leaf.kind === 'text' ? leaf.node.parentElement! : leaf.flow));
    const baseline = reference ? reference.rect.top + own.ascent : leaf.kind === 'text' ? rect.top + own.ascent : rect.bottom - flowMetrics.descent;
    return { left: rect.left, top: baseline - flowMetrics.ascent, width: rect.width, height: flowMetrics.height, baseline, flow: leaf.flow };
  };
  const neighbor = (index: number, direction: number): Leaf | undefined => {
    for (let at = index + direction; at >= 0 && at < leaves.length; at += direction) {
      const candidate = leaves[at];
      if (candidate.flow !== leaves[index].flow) return;
      if (candidate.kind === 'text') {
        const value = candidate.node.textContent ?? '';
        if (value.trim()) return candidate;
        // Tokenizers often split the space next to an identifier into its own
        // token. Ignore spaces, but never tint a trailing marker across a line.
        if (!value.includes('\n')) continue;
      }
      if (candidate.kind !== 'marker') return;
    }
  };
  const edgeRect = (leaf: Leaf, edge: 'first' | 'last') => {
    const node = leaf.node as Text;
    const range = document.createRange();
    const offset = edge === 'first' ? 0 : Math.max(0, node.length - 1);
    range.setStart(node, offset); range.setEnd(node, Math.min(node.length, offset + 1));
    return range.getBoundingClientRect();
  };
  const referenceFor = (index: number, rect: DOMRect) => {
    const left = neighbor(index, -1), right = neighbor(index, 1);
    const candidates = [left && { rect: edgeRect(left, 'last'), element: left.node.parentElement! }, right && { rect: edgeRect(right, 'first'), element: right.node.parentElement! }].filter(value => !!value);
    // Wrapping can put the left neighbor on the previous line. Prefer the
    // baseline on this line, including when a formula starts a mobile line.
    candidates.sort((a, b) => Math.abs(a.rect.bottom - rect.bottom) - Math.abs(b.rect.bottom - rect.bottom));
    const nearest = candidates[0];
    return nearest && Math.abs(nearest.rect.bottom - rect.bottom) < Math.max(rect.height, nearest.rect.height) ? nearest : undefined;
  };
  let first = 0, last = leaves.length;
  // Tokenized code is in visual/source order. Skip offscreen token runs without
  // asking the browser for the geometry of every token on every pointer move.
  if (leaves.length > 80 && leaves[0].flow.tagName === 'PRE' && leaves.at(-1)?.flow === leaves[0].flow) {
    const boxAt = (index: number) => {
      const leaf = leaves[index];
      if (leaf.kind !== 'text') return (leaf.node as HTMLElement).getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(leaf.node); return range.getBoundingClientRect();
    };
    let lo = 0, hi = leaves.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (boxAt(mid).bottom < viewport.top) lo = mid + 1; else hi = mid; }
    first = lo; hi = leaves.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (boxAt(mid).top <= viewport.bottom) lo = mid + 1; else hi = mid; }
    last = lo;
  }
  for (let index = first; index < last; index++) {
    const leaf = leaves[index];
    if (leaf.kind === 'marker') {
      const left = neighbor(index, -1), right = neighbor(index, 1);
      // A trailing marker, or a range stopping at the marker, is never tinted.
      if (!left || !right || source.start >= left.range.end || source.end <= right.range.start) continue;
      const rect = (leaf.node as HTMLElement).getBoundingClientRect();
      if (!rect.width || !rect.height || rect.bottom < viewport.top || rect.top > viewport.bottom) continue;
      const item = geometry(leaf, rect, referenceFor(index, rect));
      raw.push({ ...item, marker: (leaf.node as HTMLElement).dataset.limrMarker });
    } else if (intersects(leaf.range, source)) {
      if (leaf.kind === 'text') {
        const range = textRange(leaf, source, viewport);
        const shell = leaf.node.parentElement?.closest<HTMLElement>('[data-limr-inline-syntax]');
        const edges = shell ? Array.from(shell.getClientRects()) : [];
        const css = shell && getComputedStyle(shell);
        for (const rect of range?.getClientRects() ?? []) if (rect.width && rect.height && rect.bottom >= viewport.top && rect.top <= viewport.bottom) {
          const item = geometry(leaf, rect), first = edges[0], last = edges.at(-1);
          // Include code padding only at the source edges whose backticks were
          // absorbed. Partial code selections retain their exact character box.
          if (shell && css && first && source.start <= Number(shell.dataset.sourceStart) && Math.abs(first.top - rect.top) < rect.height && Math.abs(rect.left - first.left - parseFloat(css.paddingLeft)) < 1) {
            item.width += item.left - first.left; item.left = first.left;
          }
          if (shell && css && last && source.end >= Number(shell.dataset.sourceEnd) && Math.abs(last.top - rect.top) < rect.height && Math.abs(last.right - parseFloat(css.paddingRight) - rect.right) < 1) item.width = last.right - item.left;
          raw.push(item);
        }
      } else {
        const element = leaf.node as HTMLElement;
        const surface = leaf.kind === 'image' ? element.querySelector<HTMLImageElement>('img') ?? element : leaf.kind === 'block' ? element.querySelector<HTMLElement>('[data-limr-selection-surface]') ?? element : element;
        const rect = surface.getBoundingClientRect();
        if (!rect.width || !rect.height || rect.bottom < viewport.top || rect.top > viewport.bottom) continue;
        if (leaf.kind === 'block' || leaf.kind === 'image') raw.push({ left: rect.left, top: rect.top, width: rect.width, height: rect.height, atomic: true, image: leaf.kind === 'image', baseline: rect.bottom, flow: leaf.kind === 'image' ? element : surface, radius: getComputedStyle(surface).borderRadius });
        else {
          const item = geometry(leaf, rect, referenceFor(index, rect));
          raw.push({ ...item, atomic: true });
        }
      }
    }
  }
  // All pieces of the same text line share exactly the same top and height.
  const lines = new Map<HTMLElement, Map<number, { baseline: number; top: number; height: number }>>();
  const aligned = raw.map(rect => {
    if (rect.image || rect.atomic && rect.height > measure(rect.flow).height * 1.5) return rect;
    let flow = lines.get(rect.flow);
    if (!flow) { flow = new Map(); lines.set(rect.flow, flow); }
    const key = Math.floor(rect.baseline / 3);
    let line = [flow.get(key), flow.get(key - 1), flow.get(key + 1)].find(line => line && Math.abs(line.baseline - rect.baseline) < 3);
    if (!line) { line = rect; flow.set(key, line); }
    return { ...rect, top: line.top, height: line.height };
  });
  const bridges: PaintRect[] = [];
  for (let i = 1; i < aligned.length; i++) {
    const left = aligned[i - 1], right = aligned[i];
    const gap = right.left - left.left - left.width;
    if (left.flow === right.flow && Math.abs(left.top - right.top) < .5 && gap > .1 && gap < left.height * .6) bridges.push({ left: left.left + left.width, top: left.top, width: gap, height: left.height, flow: left.flow });
  }
  return [...aligned, ...bridges];
}

export function SelectionPaint({ runtime, interactive = true }: { runtime: ReaderRuntime; interactive?: boolean }) {
  const layer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = runtime.content, paint = layer.current;
    if (!container || !paint) return;
    let frame = 0;
    let leavesCache = new WeakMap<HTMLElement, Leaf[]>();
    type Metric = { ascent: number; descent: number; height: number };
    let metrics = new WeakMap<HTMLElement, Metric>();
    const fontMetrics = new Map<string, Metric>();
    let blocks: { element: HTMLElement; range: SourceRange; id: string }[] | undefined;
    let snapshot = runtime.document.getSnapshot();
    let lastSelection = runtime.interaction.get().selection;
    let lastDecorations = runtime.decorations.get().byBlock;
    let lastHovered = runtime.interaction.get().hoveredHighlight;
    let lastActive = runtime.interaction.get().activeHighlight;
    let lastAnnotation = runtime.interaction.get().active;
    let lastHoveredAnnotation = runtime.interaction.get().hovered;
    const highlightLayers = new Map<HTMLElement, HTMLSpanElement>();
    let hits: { id: string; rect: { left: number; top: number; width: number; height: number } }[] = [];
    const highlightRects = (id: string) => [...highlightLayers.values()].flatMap(layer => Array.from(layer.children).filter(item => (item as HTMLElement).dataset.paint === id).map(item => item.getBoundingClientRect()));
    const focusedRange = () => {
      const state = runtime.interaction.get(), decorations = runtime.decorations.get();
      return decorations.occurrences.find(item => item.id === state.hovered)?.range
        ?? (state.activeHighlight ? decorations.highlights.get(state.activeHighlight)?.range : undefined)
        ?? decorations.occurrences.find(item => item.id === state.active)?.range;
    };
    const feedback = () => {
      const state = runtime.interaction.get();
      const decorations = runtime.decorations.get();
      const focused = focusedRange();
      for (const layer of highlightLayers.values()) for (const item of layer.children as HTMLCollectionOf<HTMLElement>) {
        item.toggleAttribute('data-hovered', item.dataset.paint === state.hoveredHighlight);
        const highlight = decorations.highlights.get(item.dataset.paint ?? '');
        item.toggleAttribute('data-active', item.dataset.paint === state.activeHighlight || !!focused && !!highlight && sameRange(focused, highlight.range));
        item.toggleAttribute('data-muted', !!highlight?.hidden || !!focused && !!highlight && !sameRange(focused, highlight.range));
      }
    };
    const removeLayer = (host: HTMLElement, layer: HTMLElement) => {
      layer.remove(); delete host.dataset.limrHighlightHost; delete host.dataset.limrHighlightPosition;
      highlightLayers.delete(host);
    };
    const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
    const measure = (element: HTMLElement): Metric => {
      const saved = metrics.get(element); if (saved) return saved;
      const style = getComputedStyle(element), size = parseFloat(style.fontSize), lineHeight = parseFloat(style.lineHeight) || size * 1.5;
      const font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`, key = `${font}/${lineHeight}`;
      let metric = fontMetrics.get(key);
      if (!metric) {
        if (context) context.font = font;
        const text = context?.measureText('Mg');
        const ascent = text?.fontBoundingBoxAscent ?? size * .9, descent = text?.fontBoundingBoxDescent ?? size * .25;
        const height = Math.min(ascent + descent, lineHeight - .5);
        metric = { ascent: ascent - Math.max(0, ascent + descent - height) / 2, descent, height };
        fontMetrics.set(key, metric);
      }
      metrics.set(element, metric); return metric;
    };
    const clear = () => {
      if (paint.childNodes.length) paint.replaceChildren();
      for (const [host, layer] of highlightLayers) removeLayer(host, layer);
      hits = [];
    };
    const render = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      const selections = runtime.interaction.get().selection?.raw.ranges ?? [];
      const decorations = runtime.decorations.get().byBlock;
      if (!selections.length && ![...decorations.values()].some(value => value.highlights.length)) { clear(); return; }
      const doc = runtime.document.getSnapshot();
      if (doc !== snapshot) { snapshot = doc; blocks = undefined; }
      if (!blocks) {
        const notes = new Map(doc.blocks.filter(block => block.node.type === 'footnoteDefinition').map(block => [String(block.node.identifier), block]));
        const ordered = [...doc.blocks.filter(block => block.node.type !== 'footnoteDefinition'), ...doc.footnoteOrder.flatMap(id => {
          const block = notes.get(id), node = doc.footnotes.get(id);
          return block ? [block] : node ? [{ id: `${doc.id}-fn-${id}`, range: { start: node.position!.start.offset, end: node.position!.end.offset } }] : [];
        })];
        blocks = ordered.flatMap(block => {
          const element = runtime.blocks.get(block.id);
          return element ? [{ element, range: block.range, id: block.id }] : [];
        });
      }
      const vv = window.visualViewport;
      const viewport: Viewport = { top: vv?.offsetTop ?? 0, bottom: (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight), left: vv?.offsetLeft ?? 0, right: (vv?.offsetLeft ?? 0) + (vv?.width ?? window.innerWidth) };
      const root = runtime.configuration.get().scrollRoot;
      if (root) {
        const box = root.getBoundingClientRect();
        viewport.top = Math.max(viewport.top, box.top + root.clientTop); viewport.bottom = Math.min(viewport.bottom, box.top + root.clientTop + root.clientHeight);
        viewport.left = Math.max(viewport.left, box.left + root.clientLeft); viewport.right = Math.min(viewport.right, box.left + root.clientLeft + root.clientWidth);
      }
      // Top-level reading blocks follow document order. Search the viewport in
      // logarithmic time instead of walking an entire selected document.
      let lo = 0, hi = blocks.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (blocks[mid].element.getBoundingClientRect().bottom < viewport.top - 32) lo = mid + 1; else hi = mid; }
      const origin = container.getBoundingClientRect();
      viewport.top = Math.max(viewport.top, origin.top);
      viewport.bottom = Math.min(viewport.bottom, origin.bottom);
      const scrollLeft = container.scrollLeft, scrollTop = container.scrollTop;
      const output: { rect: PaintRect; task: { id: string; color?: string; style?: PaintHighlight['style']; selection?: boolean } }[] = [];
      const clips = new Map<HTMLElement, { left: number; right: number; top: number; bottom: number }>();
      const clipFor = (flow: HTMLElement) => {
        const saved = clips.get(flow); if (saved) return saved;
        const clip = { ...viewport };
        for (let element: HTMLElement | null = flow; element && element !== container; element = element.parentElement) {
          const css = getComputedStyle(element), box = element.getBoundingClientRect();
          if (/hidden|clip|auto|scroll/.test(css.overflowX)) { clip.left = Math.max(clip.left, box.left + element.clientLeft); clip.right = Math.min(clip.right, box.left + element.clientLeft + element.clientWidth); }
          if (/hidden|clip|auto|scroll/.test(css.overflowY)) { clip.top = Math.max(clip.top, box.top + element.clientTop); clip.bottom = Math.min(clip.bottom, box.top + element.clientTop + element.clientHeight); }
        }
        clips.set(flow, clip); return clip;
      };
      for (let index = lo; index < blocks.length; index++) {
        const block = blocks[index];
        if (block.element.getBoundingClientRect().top > viewport.bottom + 32) break;
        const tasks: { id: string; range: SourceRange; color?: string; style?: PaintHighlight['style']; selection?: boolean }[] = [...decorations.get(block.id)?.highlights ?? []];
        for (const range of selections) if (intersects(range, block.range)) tasks.push({ id: 'selection', range, selection: true });
        if (!tasks.length) continue;
        let leaves = leavesCache.get(block.element);
        if (!leaves) { leaves = leavesIn(block.element, runtime); leavesCache.set(block.element, leaves); }
        for (const task of tasks) {
          const rects = rectangles(leaves, task.range, { ...viewport, top: viewport.top - 32, bottom: viewport.bottom + 32 }, measure);
          for (const rect of rects) {
            const clip = clipFor(rect.flow);
            const left = Math.max(rect.left, clip.left), top = Math.max(rect.top, clip.top);
            const width = Math.min(rect.left + rect.width, clip.right) - left, height = Math.min(rect.top + rect.height, clip.bottom) - top;
            if (width <= 0 || height <= 0) continue;
            output.push({ rect: { ...rect, left: left - origin.left + scrollLeft, top: top - viewport.top, width, height }, task });
          }
        }
      }
      // All reads precede writes. Reuse the small visible pool instead of
      // replacing thousands of spans and forcing layout between measurements.
      // The layer itself is viewport-sized too: a book-sized stacking layer can
      // otherwise cause expensive browser layout, hit testing and pre-paint.
      paint.style.top = `${viewport.top - origin.top + scrollTop}px`;
      paint.style.height = `${Math.max(0, viewport.bottom - viewport.top)}px`;
      // Each text flow is its own stacking context: its paper/background is
      // below the ink, and highlight paint sits between the two. Selection
      // retains its independent foreground layer, including atomic media.
      const hostGeometry = new Map<HTMLElement, { box: DOMRect; top: number; positioned: boolean }>();
      for (const { rect, task } of output) if (!task.selection && !hostGeometry.has(rect.flow)) {
        const host = rect.flow, box = host.getBoundingClientRect();
        hostGeometry.set(host, { box, top: Math.max(viewport.top, box.top) - box.top - host.clientTop + host.scrollTop, positioned: getComputedStyle(host).position !== 'static' });
      }
      const counts = new Map<HTMLElement, number>();
      const nextHits: typeof hits = [];
      output.forEach(({ rect, task }) => {
        let target: HTMLElement = paint, left = rect.left, top = rect.top;
        if (!task.selection) {
          const host = rect.flow, geometry = hostGeometry.get(host)!;
          let layer = highlightLayers.get(host);
          if (!layer) {
            layer = document.createElement('span'); layer.className = 'limr-highlight-layer'; layer.dataset.limrIgnore = 'true'; layer.setAttribute('aria-hidden', 'true');
            host.dataset.limrHighlightHost = 'true';
            if (!geometry.positioned) host.dataset.limrHighlightPosition = 'true';
            host.append(layer); highlightLayers.set(host, layer);
          }
          layer.style.top = `${geometry.top}px`;
          // A layer inside a scrollable formula must not enlarge its scroll area.
          layer.style.height = `${Math.max(0, Math.min(viewport.bottom, geometry.box.bottom) - Math.max(viewport.top, geometry.box.top))}px`;
          target = layer;
          left += origin.left - geometry.box.left - host.clientLeft + host.scrollLeft;
          top += viewport.top - geometry.box.top - host.clientTop + host.scrollTop - geometry.top;
          nextHits.push({ id: task.id, rect: { left: rect.left + origin.left - scrollLeft, top: rect.top + viewport.top, width: rect.width, height: rect.height } });
        }
        const index = counts.get(target) ?? 0; counts.set(target, index + 1);
        const item = target.children[index] as HTMLElement | undefined ?? document.createElement('span');
        const className = `limr-paint-rect limr-paint-${task.selection ? 'selection' : task.style ?? 'background'}`;
        if (item.className !== className) item.className = className;
        item.dataset.paint = task.id;
        if (rect.marker) item.dataset.marker = rect.marker; else delete item.dataset.marker;
        if (rect.atomic) item.dataset.atomic = 'true'; else delete item.dataset.atomic;
        if (rect.image) item.dataset.media = 'image'; else delete item.dataset.media;
        // Assign user colors as a single property, never interpolate CSS text.
        const css = `left:${left}px;top:${top}px;width:${rect.width}px;height:${rect.height}px;border-radius:${rect.radius ?? '0'};`;
        if (item.dataset.geometry !== css) { item.style.cssText = css; item.dataset.geometry = css; }
        if (!task.selection) item.style.setProperty('--limr-highlight', task.color ?? '#F2C744');
        if (!item.parentNode) target.append(item);
      });
      for (const layer of [paint, ...highlightLayers.values()]) while (layer.children.length > (counts.get(layer) ?? 0)) layer.lastChild!.remove();
      for (const [host, layer] of highlightLayers) if (!counts.has(layer)) removeLayer(host, layer);
      hits = nextHits;
      const active = runtime.interaction.get().activeHighlight;
      if (active && !hits.some(hit => hit.id === active)) runtime.clearSelection();
      feedback();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const invalidate = () => { blocks = undefined; metrics = new WeakMap(); schedule(); };
    const fontsChanged = () => { fontMetrics.clear(); invalidate(); };
    const unsubscribers = [runtime.interaction.subscribe(() => {
      const state = runtime.interaction.get(), selection = state.selection;
      if (state.hoveredHighlight !== lastHovered || state.activeHighlight !== lastActive || state.active !== lastAnnotation || state.hovered !== lastHoveredAnnotation) {
        lastHovered = state.hoveredHighlight; lastActive = state.activeHighlight; lastAnnotation = state.active; lastHoveredAnnotation = state.hovered; feedback();
      }
      if (selection === lastSelection) return;
      lastSelection = selection;
      // Selection tracking already runs in rAF: paint in that same frame.
      render();
    }), runtime.decorations.subscribe(() => {
      const decorations = runtime.decorations.get().byBlock;
      if (decorations === lastDecorations) return;
      lastDecorations = decorations; leavesCache = new WeakMap(); schedule();
    }), runtime.layout.subscribe(invalidate), runtime.configuration.subscribe(invalidate)];
    const observer = new MutationObserver(records => {
      let changed = false;
      for (const record of records) {
        const target = record.target instanceof Element ? record.target : record.target.parentElement;
        if (!target || target === paint || paint.contains(target) || target.closest('.limr-highlight-layer')) continue;
        if (record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].every(node => node instanceof Element && node.classList.contains('limr-highlight-layer'))) continue;
        const block = target.closest<HTMLElement>('[data-limr-block]');
        if (block) leavesCache.delete(block); else blocks = undefined;
        changed = true;
      }
      if (changed) { metrics = new WeakMap(); schedule(); }
    });
    observer.observe(container, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'inert', 'open', 'data-limr-theme', 'data-limr-justify'] });
    const scroll = () => { runtime.hoverHighlight(null); schedule(); };
    document.addEventListener('scroll', scroll, { capture: true, passive: true });
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    document.fonts?.addEventListener('loadingdone', fontsChanged);
    const hitAt = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element || element.closest('[data-limr-document]') !== container || element.closest('button,input,textarea,select,[contenteditable],[data-limr-ignore]')) return null;
      const focused = focusedRange(), decorations = runtime.decorations.get();
      for (let index = hits.length - 1; index >= 0; index--) {
        const { rect, id } = hits[index];
        const highlight = decorations.highlights.get(id);
        if (highlight?.hidden || focused && highlight && !sameRange(focused, highlight.range)) continue;
        if (event.clientX >= rect.left && event.clientX <= rect.left + rect.width && event.clientY >= rect.top && event.clientY <= rect.top + rect.height) return id;
      }
      return null;
    };
    const move = (event: PointerEvent) => { if (!event.buttons) runtime.hoverHighlight(hitAt(event)); };
    const leave = () => runtime.hoverHighlight(null);
    let down: { x: number; y: number } | null = null;
    const pointerDown = (event: PointerEvent) => { down = { x: event.clientX, y: event.clientY }; };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !down || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 4 || window.getSelection()?.isCollapsed === false) return;
      const id = hitAt(event); if (!id) return;
      event.preventDefault();
      const highlight = runtime.decorations.get().highlights.get(id)!;
      const text: string[] = [];
      let atomic = false;
      // Capture rendered text from the same bindings used by selection. AST
      // fallback alone misses decoded attributes and literal code boundaries.
      for (const block of runtime.document.getSnapshot().blocks) {
        if (!intersects(block.range, highlight.range)) continue;
        const element = runtime.blocks.get(block.id); if (!element) continue;
        const parts: string[] = [];
        for (const leaf of leavesIn(element, runtime)) {
          if (!intersects(leaf.range, highlight.range) || leaf.kind === 'marker') continue;
          if (leaf.kind !== 'text') { atomic = true; continue; }
          const range = textRange(leaf, highlight.range, { top: -Infinity, bottom: Infinity, left: -Infinity, right: Infinity });
          if (range) parts.push(range.toString());
        }
        if (parts.length) text.push(parts.join(''));
      }
      runtime.highlightReference = {
        text: !atomic && text.length ? text.join('\n\n') : undefined,
        getClientRects: () => highlightRects(id),
        getBoundingClientRect: () => {
          const rects = highlightRects(id); if (!rects.length) return new DOMRect();
          const left = Math.min(...rects.map(rect => rect.left)), top = Math.min(...rects.map(rect => rect.top));
          return new DOMRect(left, top, Math.max(...rects.map(rect => rect.right)) - left, Math.max(...rects.map(rect => rect.bottom)) - top);
        },
      };
      runtime.activateHighlight(id);
    };
    if (interactive) {
      container.addEventListener('pointermove', move); container.addEventListener('pointerleave', leave);
      container.addEventListener('pointerdown', pointerDown); container.addEventListener('click', click);
    }
    container.dataset.limrPainted = 'true'; schedule();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); unsubscribers.forEach(unsubscribe => unsubscribe()); document.removeEventListener('scroll', scroll, true); window.visualViewport?.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('scroll', schedule); document.fonts?.removeEventListener('loadingdone', fontsChanged); container.removeEventListener('pointermove', move); container.removeEventListener('pointerleave', leave); container.removeEventListener('pointerdown', pointerDown); container.removeEventListener('click', click); delete container.dataset.limrPainted; clear(); };
  }, [runtime, interactive]);
  return <div ref={layer} className="limr-paint-layer" data-limr-ignore="true" aria-hidden="true" />;
}
