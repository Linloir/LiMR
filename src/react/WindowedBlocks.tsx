import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { rangeOf, selectionFromRange, type Block, type SourceRange } from '../core';
import { BlockHeightIndex, readingScrollGeometry } from '../core/height-index';
import { BlockView, Footnotes } from './render';
import { orderedListStyle } from './ordered-list';
import { useIsomorphicLayoutEffect, useRuntime, useStoreSelector } from './context';
import { emptyDecorations } from './runtime';
import { sourceRangeStartRect } from './source-geometry';
import { windowedHeadings } from './windowed-headings';
import { windowedKeepAliveBlocks } from './windowed-lifetime';
import { ownsReaderInteraction, rememberReaderOwner } from './reader-ownership';
import { captureReadingPosition } from './reading-position';
import type { ReadingPosition } from './types';
import { sourceTypographyPending, typographyLayoutVersion } from './typography-layout-state';
import { asyncHandoffScope } from './async-handoff-policy';
import { windowedSourceContinuation } from './windowed-source-continuation';

const hidden = new Set(['definition', 'footnoteDefinition', 'annotationDefinition']);
interface WindowState { start: number; end: number; top: number; height: number; printing: boolean; slots: readonly { index: number; top: number }[] }

/** Only DOM is windowed. All public document hooks keep the complete snapshot,
 * including definitions, annotations, references and UTF-16 source offsets. */
export function WindowedBlocks({ blocks, overscan = 1400, windowed = true, proof }: { blocks: readonly Block[]; overscan?: number; windowed?: boolean; proof?: { key(block: Block): string; retain: readonly number[] } }) {
  const runtime = useRuntime();
  const config = useStoreSelector(runtime.configuration, value => value);
  const decorations = useStoreSelector(runtime.decorations, value => value.byBlock);
  const presentation = useStoreSelector(runtime.presentation, revision => revision);
  const visibleHeadings = useMemo(() => windowedHeadings(runtime), [runtime, blocks, config, presentation]);
  const currentHeadings = useRef(visibleHeadings); currentHeadings.current = visibleHeadings;
  const entries = useMemo<readonly (Block & { footnoteId?: string; footnoteOrder?: number })[]>(() => {
    const snapshot = runtime.document.getSnapshot();
    const definitions = new Map(blocks.filter(block => block.node.type === 'footnoteDefinition').map(block => [String(block.node.identifier), block]));
    const notes = snapshot.footnoteOrder.flatMap((id, order) => {
      const node = snapshot.footnotes.get(id); if (!node) return [];
      const block = definitions.get(id) ?? { id: `${snapshot.id}-fn-${id}`, node, range: rangeOf(node), pending: false };
      return [{ ...block, footnoteId: id, footnoteOrder: order }];
    });
    return [...blocks.filter(block => !hidden.has(block.node.type)), ...notes];
  }, [runtime, blocks]);
  // This is the existing source lookup order, shared by the replacement render
  // and the viewport effect. Mapping touches only previously committed slots.
  const sourceOrder = useMemo(() => windowed ? entries.map((block, index) => ({ block, index })).sort((a, b) => a.block.range.start - b.block.range.start) : [], [entries, windowed]);
  const continueSource = useMemo(() => proof && windowed ? windowedSourceContinuation(sourceOrder) : undefined, [sourceOrder, !!proof, windowed]);
  const host = useRef<HTMLDivElement>(null), window = useRef<HTMLDivElement>(null);
  // Bootstrap a small set; the layout effects fill and measure the full viewport
  // and overscan before paint, without first mounting distant heavy blocks.
  const [view, setView] = useState<WindowState>({ start: 0, end: Math.min(8, entries.length), top: 0, height: 1000, printing: false, slots: Array.from({ length: Math.min(8, entries.length) }, (_, index) => ({ index, top: index * 80 })) });
  const renderedRuntime = useRef(runtime);
  const committedHost = useRef<{ runtime: typeof runtime; entries: typeof entries; windowed: boolean; view: WindowState; slots: WindowState['slots']; visible?: ReadonlySet<number> } | null>(null);
  const latest = useRef(view);
  const committedView = useRef(view);
  const measureCommitted = useRef<(() => void) | null>(null);
  const captureCommitted = useRef<((committed: WindowState) => void) | null>(null);
  const refineAfterCommit = useRef(false);
  const measuredWindow = useRef<{ start: number; end: number; width: number; entries: typeof entries } | null>(null);
  const [printProgress, setPrintProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [printMessage, setPrintMessage] = useState<string | null>(null);
  const printController = useRef<AbortController | null>(null);
  const savedAnchor = useRef<{ source: number; inside: number } | null>(null);
  useIsomorphicLayoutEffect(() => {
    if (!windowed) return;
    const element = host.current!, content = window.current!;
    const scrollRoot = config.scrollRoot ?? globalThis.window;
    const viewportHeight = () => config.scrollRoot?.clientHeight ?? innerHeight;
    const physicalTop = () => config.scrollRoot?.scrollTop ?? scrollY;
    const viewportTop = () => config.scrollRoot?.getBoundingClientRect().top ?? 0;
    let width = element.clientWidth || 800;
    const css = getComputedStyle(element), em = parseFloat(css.fontSize) || 16, line = parseFloat(css.lineHeight) || em * 1.8;
    const estimate = (block: Block) => Math.max(line, Math.ceil(Math.max(1, block.range.end - block.range.start) * em * .57 / width) * line) + em;
    let heights = new BlockHeightIndex(entries.map(estimate));
    const positions = new Map(entries.map((block, index) => [block.id, index]));
    let geometry = readingScrollGeometry(heights.total, viewportHeight()), frame = 0, pendingMeasure = false, disposed = false, logical = 0, origin = 0;
    let measuredTypography = typographyLayoutVersion(runtime);
    let requested: { range: SourceRange; offset: number } | undefined, printing = false, touch: { x: number; y: number } | undefined;
    let bottomAnchor: { outside: number; top: number } | undefined;
    let logicalPosition: { physical: number; origin: number; scale: number; logical: number } | undefined;
    let readingAnchor: { position: ReadingPosition; top: number; logical: number; width: number; revision: number; presentation: number; typography: number; configuration: typeof config } | undefined;
    // Media elements keep their actual DOM, decoder and playback position.
    // Focus/selection leases expire as soon as their owner moves elsewhere.
    const media = new Set<number>();
    const customLeases = windowedKeepAliveBlocks(runtime, entries);
    const sourceIndex = (offset: number) => {
      let lo = 0, hi = sourceOrder.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (sourceOrder[mid].block.range.end <= offset) lo = mid + 1; else hi = mid; }
      return sourceOrder[Math.min(lo, Math.max(0, sourceOrder.length - 1))]?.index ?? 0;
    };
    const logicalAt = (physical: number) => {
      // Native scroll coordinates can round a compressed logical movement to
      // the same physical pixel. Keep that local position until native scroll,
      // the reader origin, or the compression mapping actually changes.
      if (logicalPosition?.physical === physical && logicalPosition.origin === origin && logicalPosition.scale === geometry.scale) return logicalPosition.logical;
      logicalPosition = undefined;
      return geometry.toLogical(physical - origin);
    };
    const retainLogicalPosition = () => {
      if (geometry.scale <= 1) { logicalPosition = undefined; return; }
      const physical = physicalTop(), wanted = origin + geometry.toPhysical(logical);
      // This bound represents native pixel quantization, not source-refinement
      // tolerance. A large old-spacer clamp must follow normal source recovery.
      logicalPosition = physical >= origin && physical <= origin + geometry.physicalMax && Math.abs(wanted - physical) <= 1
        ? { physical, origin, scale: geometry.scale, logical } : undefined;
    };
    const commit = () => {
      let start = heights.at(Math.max(0, logical - overscan));
      let end = Math.min(entries.length, heights.at(logical + viewportHeight() + overscan) + 2);
      const pinned = new Set<number>();
      const selected = runtime.virtualSelection ? null : runtime.interaction.get().selection;
      if (selected?.raw.ranges.length) {
        pinned.add(sourceIndex(selected.raw.ranges[0].start));
        pinned.add(sourceIndex(selected.raw.ranges.at(-1)!.end - 1));
      }
      const interaction = runtime.interaction.get(), details = runtime.decorations.get();
      for (const occurrence of details.occurrences) {
        if (occurrence.id === interaction.active || occurrence.id === interaction.toolbarOccurrence || interaction.editing && occurrence.annotationIds.includes(interaction.editing)) pinned.add(sourceIndex((details.referenceRanges.get(occurrence.id) ?? occurrence.range).start));
      }
      if (interaction.activeHighlight) { const highlight = details.highlights.get(interaction.activeHighlight); if (highlight) pinned.add(sourceIndex(highlight.range.start)); }
      for (const [id, node] of runtime.blocks) {
        const index = positions.get(id); if (index === undefined) continue;
        if (customLeases.has(index) || node.querySelector('video,audio,iframe,.limr-video')) media.add(index);
        if (node.contains(element.ownerDocument.activeElement) || node.querySelector('[data-limr-keep-alive]')) pinned.add(index);
      }
      for (const index of media) pinned.add(index);
      const mounted = new Set(Array.from({ length: end - start }, (_, index) => start + index));
      for (const index of pinned) mounted.add(index);
      // Use the actual native coordinate for a retained logical position. A
      // second ideal mapping here would reintroduce its rounding residual into
      // the glyph position, especially when the compression scale is near one.
      const physical = logicalPosition?.logical === logical && logicalPosition.physical === physicalTop() && logicalPosition.origin === origin && logicalPosition.scale === geometry.scale
        ? logicalPosition.physical - origin : geometry.toPhysical(logical);
      const slots = [...mounted].sort((a, b) => a - b).map(index => ({ index, top: index >= start && index < end
        ? physical + heights.offset(index) - logical
        : -1_000_000 }));
      const next = { start, end, top: physical + heights.offset(start) - logical, height: geometry.height, printing, slots };
      const old = latest.current;
      if (old.start !== next.start || old.end !== next.end || Math.abs(old.top - next.top) > .1 || Math.abs(old.height - next.height) > .1 || old.printing !== next.printing || old.slots.length !== slots.length || old.slots.some((slot, index) => slot.index !== slots[index].index || Math.abs(slot.top - slots[index].top) > .1)) {
        latest.current = next; setView(next); return true;
      }
      return false;
    };
    const move = (next: number, preserveOffset = false) => {
      bottomAnchor = undefined;
      const previous = physicalTop();
      logical = Math.min(geometry.logicalMax, Math.max(0, next));
      const outside = preserveOffset ? next - logical : 0;
      scrollRoot.scrollTo({ top: origin + geometry.toPhysical(logical) + outside, behavior: 'instant' });
      retainLogicalPosition();
      const changed = commit(), moved = Math.abs(physicalTop() - previous) > .5, pendingCommit = committedView.current !== latest.current;
      if (requested && pendingCommit) refineAfterCommit.current = true;
      if (changed || moved) runtime.requestLayout();
      return changed || moved || pendingCommit;
    };
    const rememberPosition = (committed = latest.current) => {
      // Read only committed, stable geometry. In particular, a ResizeObserver
      // sees the *new* line wraps and cannot reconstruct the old reading line.
      if (disposed || printing || requested || bottomAnchor || latest.current !== committed || committedView.current !== latest.current || !runtime.content) return;
      const top = physicalTop(), currentLogical = logicalAt(top), revision = runtime.document.getSnapshot().revision, presentation = runtime.presentation.get(), configuration = runtime.configuration.get(), typography = typographyLayoutVersion(runtime);
      // A parent commit may run before the observer measures a new KP write.
      // Keep the previous source block until that height correction is done.
      if (typography !== measuredTypography) return;
      if (top < origin || top > origin + geometry.physicalMax) { readingAnchor = undefined; return; }
      if (readingAnchor?.top === top && readingAnchor.logical === currentLogical && readingAnchor.width === width && readingAnchor.revision === revision && readingAnchor.presentation === presentation && readingAnchor.configuration === configuration && readingAnchor.typography === typography) return;
      if (Math.abs(element.clientWidth - width) > .5) return;
      const edge = viewportTop() + (config.scrollOffset ?? 24);
      let index = heights.at(currentLogical + (config.scrollOffset ?? 24));
      // The height index includes paragraph margins. Inspect only neighbouring
      // mounted blocks when the reading edge falls in that space.
      for (; index < latest.current.end; index++) {
        const node = entries[index] && runtime.blocks.get(entries[index].id);
        if (!node || node.closest('[inert],[data-window-parked]')) continue;
        const rect = node.getBoundingClientRect(); if (!rect.height || rect.bottom <= edge) continue;
        const position = captureReadingPosition(runtime, { element: node, rect });
        if (position && !sourceTypographyPending(runtime, node, { start: position.source, end: position.source + 2 }, content)) readingAnchor = { position, top, logical: currentLogical, width, revision, presentation, typography, configuration };
        else readingAnchor = undefined;
        return;
      }
      readingAnchor = undefined;
    };
    captureCommitted.current = rememberPosition;
    const refresh = (measure: boolean) => {
      frame = 0; if (disposed || printing) return;
      const current = physicalTop();
      origin = element.getBoundingClientRect().top - viewportTop() + current;
      // A native thumb/end seek reaches the current estimated bottom before
      // its last blocks are measured. Preserve that intent across the ensuing
      // React commits, including trailing reader padding. A newer scroll or
      // explicit source reveal takes priority over the pending correction.
      if (bottomAnchor && Math.abs(current - bottomAnchor.top) > 1) bottomAnchor = undefined;
      if (!bottomAnchor && !requested && geometry.physicalMax > 0 && current >= origin + geometry.physicalMax - 1 && current < origin + geometry.height) {
        bottomAnchor = { outside: Math.max(0, current - origin - geometry.physicalMax), top: current };
      }
      // Measuring a reader below (or above) the current viewport must not move
      // the outer page into it. Only anchor a viewport inside its scroll range.
      const anchorInReader = current >= origin && current <= origin + geometry.physicalMax;
      logical = logicalAt(current);
      const typography = measure ? typographyLayoutVersion(runtime) : measuredTypography;
      // A late KP write may move the source reading line after its explicit
      // request has settled. Keep its block while measuring that new version;
      // y=0 may still lie in the previous paragraph's trailing margin.
      const stableReading = measure && typography !== measuredTypography && !requested && !bottomAnchor && logical > 0 && anchorInReader
        && readingAnchor?.width === width && Math.abs(readingAnchor.top - current) <= 1
        && readingAnchor.revision === runtime.document.getSnapshot().revision && readingAnchor.presentation === runtime.presentation.get() && readingAnchor.configuration === runtime.configuration.get();
      const anchor = stableReading ? sourceIndex(readingAnchor!.position.source) : heights.at(logical), inside = logical - heights.offset(anchor);
      if (measure) {
        const nextWidth = element.clientWidth;
        if (nextWidth > 0 && Math.abs(width - nextWidth) > .5) {
          // Keep the same source character at the same viewport offset when
          // wrapping changes. A block-relative pixel offset is not invariant
          // under a width change, even when the book is below the scroll cap.
          if (!requested && !bottomAnchor && anchorInReader && readingAnchor?.width === width && Math.abs(readingAnchor.top - current) <= 1
            && readingAnchor.revision === runtime.document.getSnapshot().revision && readingAnchor.presentation === runtime.presentation.get() && readingAnchor.configuration === runtime.configuration.get()) {
            const { source, offset } = readingAnchor.position;
            requested = { range: { start: source, end: Math.min(source + 2, runtime.document.getSnapshot().source.length) }, offset };
          }
          readingAnchor = undefined;
          const ratio = width / nextWidth; width = nextWidth;
          heights = new BlockHeightIndex(Array.from({ length: entries.length }, (_, index) => Math.max(line, heights.height(index) * ratio)));
        }
        // Stable keyed slots preserve focused/media/selection endpoint DOM
        // without mounting every paragraph between distant endpoints.
        for (const slot of content.querySelectorAll<HTMLElement>(':scope > [data-window-slot]')) {
          const index = Number(slot.dataset.windowSlot);
          if (heights.set(index, slot.getBoundingClientRect().height)) readingAnchor = undefined;
        }
        measuredTypography = typography;
        geometry = readingScrollGeometry(heights.total, viewportHeight());
        // A reading block can begin below y=0. Preserve that negative inside
        // offset, then clamp native boundaries before using logical in CSS.
        const anchored = Math.min(geometry.logicalMax, Math.max(0, heights.offset(anchor) + inside));
        logical = bottomAnchor ? geometry.logicalMax : anchored;
        const wanted = origin + geometry.toPhysical(logical);
        if (!bottomAnchor && anchorInReader && Math.abs(wanted - current) > .5) scrollRoot.scrollTo({ top: wanted, behavior: 'instant' });
        if (bottomAnchor) logicalPosition = undefined; else retainLogicalPosition();
      }
      if (bottomAnchor) logical = geometry.logicalMax;
      // Source geometry belongs to the committed slot positions. A height
      // correction may have moved those slots; refine after their next layout.
      const changed = commit();
      const pendingCommit = committedView.current !== latest.current;
      if (bottomAnchor) {
        if (changed || pendingCommit) refineAfterCommit.current = true;
        else {
          // Applying this before the new spacer height commits would clamp to
          // the old native maximum and silently abandon the final paragraphs.
          const maximum = config.scrollRoot ? config.scrollRoot.scrollHeight - config.scrollRoot.clientHeight
            : (element.ownerDocument.scrollingElement?.scrollHeight ?? 0) - innerHeight;
          const wanted = Math.min(Math.max(0, maximum), origin + geometry.physicalMax + bottomAnchor.outside);
          bottomAnchor = undefined;
          if (Math.abs(wanted - current) > .5) scrollRoot.scrollTo({ top: wanted, behavior: 'instant' });
        }
      }
      if (requested && (changed || pendingCommit)) refineAfterCommit.current = true;
      if (requested && !changed && !pendingCommit) {
        const index = sourceIndex(requested.range.start), block = entries[index], node = block && runtime.blocks.get(block.id);
        // A width change can request a physical offset beyond the old spacer
        // before its new height commits. Recover the original source window
        // after that commit, then refine its exact glyph with the same request.
        if (block && (index < committedView.current.start || index >= committedView.current.end)) {
          move(heights.offset(index));
          return;
        }
        if (node) {
          // The first seek uses estimates; refine once the destination exists.
          const target = (sourceRangeStartRect(runtime, requested.range)?.top ?? node.getBoundingClientRect().top) - viewportTop() - requested.offset;
          // KP may still be applying the new width in a later frame. Keep this
          // exact source anchor until its own paragraph is settled; its layout
          // notification will refine again without polling or delaying frames.
          const pendingTypography = sourceTypographyPending(runtime, node, requested.range, content);
          if (Math.abs(target) > 1) {
            // Moving can mount another edge block. Its first measurement may
            // move this slot again, so complete only after that commit settles.
            // A native clamp with no DOM/scroll progress is an actual boundary,
            // not a reason to schedule an endless refinement loop.
            if (!move(logical + target, true) && !pendingTypography) { requested = undefined; rememberPosition(); }
            return;
          }
          if (!pendingTypography) requested = undefined;
        }
      }
      if (!changed) rememberPosition();
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(() => { const measure = pendingMeasure; pendingMeasure = false; refresh(measure); }); };
    // Geometry work must not lose to a scroll callback that was queued first:
    // otherwise continuous scrolling can indefinitely retain estimated gaps.
    const schedule = () => { pendingMeasure = true; queue(); };
    const scroll = () => queue();
    const committed = () => {
      if (disposed) return;
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      const next = new Set<Element>([element, content, ...content.querySelectorAll(':scope > [data-window-slot]')]);
      for (const target of observed) if (!next.has(target)) { resize.unobserve(target); observed.delete(target); }
      for (const target of next) if (!observed.has(target)) { resize.observe(target); observed.add(target); }
      pendingMeasure = false; refresh(true);
    };
    measureCommitted.current = committed;
    const viewport = {
      reveal(range: SourceRange, offset = config.scrollOffset ?? 24) { requested = { range, offset }; refineAfterCommit.current = true; move(heights.offset(sourceIndex(range.start))); schedule(); },
      activeHeading() {
        const headings = currentHeadings.current, cutoff = viewportTop() + runtime.getHeadingActivationInset();
        const visible = new Set(headings.map(heading => heading.id));
        let nearest: { id: string; top: number } | undefined;
        for (const [id, node] of runtime.headings) {
          if (!visible.has(id) || node.closest('[inert],[data-window-parked]')) continue;
          const top = node.getBoundingClientRect().top;
          if (top <= cutoff && (!nearest || top > nearest.top)) nearest = { id, top };
        }
        if (nearest) return nearest.id;
        const index = heights.at(logical + runtime.getHeadingActivationInset());
        let active = headings[0]?.id ?? null;
        for (const heading of headings) { if (sourceIndex(heading.range.start) < index) active = heading.id; else break; }
        return active;
      },
    };
    runtime.documentViewport = viewport;
    const insideScroller = (target: EventTarget | null) => {
      for (let node = target instanceof Element ? target : null; node && node !== element; node = node.parentElement) {
        if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(node).overflowY)) return true;
      }
      return false;
    };
    const wheel = (event: WheelEvent) => {
      if (!event.defaultPrevented && !event.ctrlKey && !event.shiftKey && Math.abs(event.deltaY) >= Math.abs(event.deltaX) && event.deltaY && !insideScroller(event.target)) {
        requested = undefined; bottomAnchor = undefined; readingAnchor = undefined;
      }
      if (geometry.scale <= 1 || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.defaultPrevented || insideScroller(event.target) || !event.deltaY) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? line : event.deltaMode === 2 ? viewportHeight() : 1);
      if (logical <= 0 && delta < 0 || logical >= geometry.logicalMax && delta > 0) return;
      event.preventDefault(); flushSync(() => move(logical + delta));
    };
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (!ownsReaderInteraction(runtime)) return;
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'p') {
        event.preventDefault(); if (printController.current) return;
        if (runtime.configuration.get().provisional || runtime.document.getSnapshot().streaming) {
          setPrintMessage(runtime.locale.language?.startsWith('zh') ? '完整文档加载完成后才能打印。' : 'Finish loading the complete document before printing.'); return;
        }
        setPrintMessage(null);
        const controller = new AbortController(); printController.current = controller;
        setPrintProgress({ loaded: 0, total: entries.length });
        void import('./document-print').then(module => module.prepareDocumentPrint(runtime, { signal: controller.signal, onProgress: setPrintProgress })).then(prepared => {
          setPrintProgress(null); printController.current = null; prepared.print();
        }).catch(error => { setPrintProgress(null); printController.current = null; if (error?.name !== 'AbortError') globalThis.console?.error(error); });
        return;
      }
      if (!event.defaultPrevented && (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'a' && !(event.target instanceof Element && event.target.closest('input,textarea,[contenteditable],[data-limr-selection-ui]'))) {
        event.preventDefault();
        const document = runtime.document.getSnapshot();
        const native = globalThis.window.getSelection(), range = element.ownerDocument.createRange(); range.selectNodeContents(content); native?.removeAllRanges(); native?.addRange(range);
        runtime.virtualSelection = true; runtime.selectionRange = range;
        runtime.updateInteraction({ selection: selectionFromRange(document, { start: 0, end: document.source.length }) }); return;
      }
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.target instanceof Element && event.target.closest('input,textarea,button,[contenteditable],[data-limr-selection-ui]')) return;
      const delta = event.key === 'ArrowDown' ? line : event.key === 'ArrowUp' ? -line : event.key === 'PageDown' || event.key === ' ' ? viewportHeight() * .9 : event.key === 'PageUp' ? -viewportHeight() * .9 : 0;
      if (delta || event.key === 'Home' || event.key === 'End') { requested = undefined; bottomAnchor = undefined; readingAnchor = undefined; }
      if (geometry.scale <= 1) return;
      if (delta || event.key === 'Home' || event.key === 'End') { event.preventDefault(); flushSync(() => move(event.key === 'Home' ? 0 : event.key === 'End' ? geometry.logicalMax : logical + delta)); }
    };
    const touchStart = (event: TouchEvent) => { touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined; };
    const touchMove = (event: TouchEvent) => {
      if (touch === undefined || event.touches.length !== 1 || insideScroller(event.target)) return;
      const next = { x: event.touches[0].clientX, y: event.touches[0].clientY }, delta = touch.y - next.y;
      if (Math.abs(touch.x - next.x) > Math.abs(delta)) { touch = next; return; }
      touch = next;
      requested = undefined; bottomAnchor = undefined; readingAnchor = undefined;
      if (geometry.scale <= 1) return;
      event.preventDefault(); flushSync(() => move(logical + delta));
    };

    // Visible slots share normal flow, so animated or decoded content moves its
    // neighbours in the same layout. Refresh the book's height estimates in a
    // later frame: writing an observed ancestor's height inside this callback
    // would trigger ResizeObserver's depth limit and undelivered notifications.
    const observed = new Set<Element>([content, element]);
    const resize = new ResizeObserver(() => { if (!disposed) schedule(); });
    resize.observe(content); resize.observe(element);
    const unsubscribe = runtime.layout.subscribe(schedule), selectionChanged = runtime.interaction.subscribe(scroll);
    const claim = (event: PointerEvent) => { requested = undefined; rememberReaderOwner(runtime, event.target); };
    const fontChanged = () => { readingAnchor = undefined; };
    element.ownerDocument.fonts?.addEventListener('loadingdone', fontChanged);
    element.ownerDocument.addEventListener('pointerdown', claim, true);
    element.ownerDocument.addEventListener('focusin', scroll);
    scrollRoot.addEventListener('scroll', scroll, { passive: true });
    element.addEventListener('wheel', wheel, { passive: false }); element.ownerDocument.addEventListener('keydown', key);
    element.addEventListener('touchstart', touchStart, { passive: true }); element.addEventListener('touchmove', touchMove, { passive: false });

    if (savedAnchor.current) {
      origin = element.getBoundingClientRect().top - viewportTop() + physicalTop();
      move(heights.offset(sourceIndex(savedAnchor.current.source)) + savedAnchor.current.inside);
    }
    refresh(true);
    return () => {
      const anchor = heights.at(logical);
      savedAnchor.current = physicalTop() >= origin && physicalTop() <= origin + geometry.physicalMax && entries[anchor] ? { source: entries[anchor].range.start, inside: logical - heights.offset(anchor) } : null;
      element.ownerDocument.removeEventListener('pointerdown', claim, true);
      element.ownerDocument.removeEventListener('focusin', scroll);
      element.ownerDocument.fonts?.removeEventListener('loadingdone', fontChanged);
      disposed = true; if (measureCommitted.current === committed) measureCommitted.current = null; cancelAnimationFrame(frame); resize.disconnect(); unsubscribe(); selectionChanged();
      if (captureCommitted.current === rememberPosition) captureCommitted.current = null;
      if (runtime.documentViewport === viewport) runtime.documentViewport = null;
      scrollRoot.removeEventListener('scroll', scroll); element.removeEventListener('wheel', wheel); element.ownerDocument.removeEventListener('keydown', key);
      element.removeEventListener('touchstart', touchStart); element.removeEventListener('touchmove', touchMove);
      printController.current?.abort(); printController.current = null;
    };
  }, [runtime, entries, config.scrollRoot, config.scrollOffset, config.extensions, config.rendererOverrides, overscan, windowed]);
  // A same-request handoff continues the committed source window even when a
  // changed interpretation refuses every old React key. Source positioning is
  // separate from the stronger shape/renderer proof that grants DOM leases.
  const replacing = renderedRuntime.current !== runtime, previous = committedHost.current;
  const scope = replacing && proof ? asyncHandoffScope(runtime) : undefined;
  const previousScope = scope && previous && asyncHandoffScope(previous.runtime);
  let replacement: (WindowState & { visible: ReadonlySet<number> }) | undefined;
  if (windowed && !view.printing && previous && previousScope && scope?.previous === previous.runtime && scope.identity === previousScope.identity && !previousScope.complete) {
    const visible = new Set<number>();
    for (const slot of previous.slots) {
      if (previous.windowed && (previous.visible ? !previous.visible.has(slot.index) : slot.index < previous.view.start || slot.index >= previous.view.end)) continue;
      const block = previous.entries[slot.index]; if (!block) continue;
      for (const index of continueSource!(block)) visible.add(index);
    }
    // Only an empty previous host has no source window to continue.
    if (!previous.slots.length) for (let index = 0; index < Math.min(8, entries.length); index++) visible.add(index);
    let start = entries.length, end = 0;
    for (const index of visible) { start = Math.min(start, index); end = Math.max(end, index + 1); }
    const mounted = new Set([...visible, ...proof!.retain]);
    replacement = { ...previous.view, start: visible.size ? start : 0, end, top: previous.windowed ? previous.view.top : 0, visible,
      slots: [...mounted].sort((a, b) => a - b).map(index => ({ index, top: 0 })) };
  }
  const displayed = replacement ?? view;
  latest.current = displayed;
  // On an unrelated runtime replacement retain the existing cold bootstrap.
  // The same-request path above keeps offscreen leases parked independently.
  const slots = !windowed || displayed.printing ? entries.map((_, index) => ({ index, top: 0 })).filter(({index}) => windowed || !entries[index].footnoteId)
    : replacement ? replacement.slots
    : replacing && proof ? [...new Set([...Array.from({length: Math.min(8, entries.length)}, (_, index) => index), ...proof.retain])].sort((a,b) => a-b).map(index => ({index,top:0}))
    : view.slots;
  // Newly mounted mixed-height blocks are measured before paint; their slots
  // must become contiguous even while more scroll events keep arriving.
  useIsomorphicLayoutEffect(() => {
    renderedRuntime.current = runtime;
    if (proof) committedHost.current = { runtime, entries, windowed, view: displayed, slots, visible: replacement?.visible };
    if (!windowed) return;
    committedView.current = displayed;
    const previous = measuredWindow.current;
    const width = host.current?.clientWidth ?? 0;
    // Parent commits can change the content width (for example a responsive
    // sidebar) without changing this window's props. Correct the new layout in
    // that same commit instead of waiting for a second ResizeObserver cycle.
    if (refineAfterCommit.current || !previous || previous.start !== displayed.start || previous.end !== displayed.end || previous.entries !== entries || previous.width !== width) {
      refineAfterCommit.current = false; measuredWindow.current = { start: displayed.start, end: displayed.end, width, entries }; measureCommitted.current?.();
    }
    captureCommitted.current?.(displayed);
  });
  return <><div ref={host} className={windowed ? "limr-document-window" : undefined} style={windowed ? { position: 'relative', height: displayed.printing ? undefined : displayed.height, overflowAnchor: 'none' } : {display:'contents'}} data-limr-windowed={windowed ? '' : undefined} data-stable-block-host={proof ? '' : undefined} data-window-start={windowed ? displayed.start : undefined} data-window-end={windowed ? displayed.end : undefined}>
    {windowed && <p className="limr-print-unprepared" data-limr-ignore="true">{runtime.locale.language?.startsWith('zh') ? '此长文需要先准备完整打印内容。请关闭打印预览，在阅读区按 Ctrl+P（macOS：⌘P）。' : 'This large document needs print preparation. Close print preview and press Ctrl+P (macOS: ⌘P) inside the reader.'}</p>}
    {windowed && printMessage && <div className="limr-print-progress" role="status" data-limr-ignore="true"><span>{printMessage}</span><button type="button" onClick={() => setPrintMessage(null)}>{runtime.locale.language?.startsWith('zh') ? '关闭' : 'Close'}</button></div>}
    {windowed && printProgress && <div className="limr-print-progress" role="status" data-limr-ignore="true"><span>{runtime.locale.language?.startsWith('zh') ? '正在准备完整文档' : 'Preparing complete document'} · {printProgress.loaded}/{printProgress.total}</span><progress value={printProgress.loaded} max={printProgress.total || 1} /><button type="button" onClick={() => printController.current?.abort()}>{runtime.locale.language?.startsWith('zh') ? '取消' : 'Cancel'}</button></div>}
    <div ref={window} style={!windowed ? {display:'contents'} : { position: displayed.printing ? undefined : 'absolute', top: displayed.printing ? undefined : displayed.top, insetInline: 0 }}>
      {slots.map(({ index }) => { const block = entries[index], parked = windowed && !displayed.printing && (replacement ? !replacement.visible.has(index) : index < displayed.start || index >= displayed.end); return block && <div key={proof?.key(block) ?? block.id} data-window-slot={windowed ? index : undefined} data-stable-slot={proof ? '' : undefined} data-window-parked={parked || undefined} style={{ position: displayed.printing ? undefined : parked ? 'absolute' : 'relative', top: parked ? -1_000_000 - displayed.top : undefined, insetInline: 0, display: windowed ? 'flow-root' : 'contents', opacity: parked ? 0 : undefined, pointerEvents: parked ? 'none' : undefined }}>
        {block.footnoteId ? <ol className="limr-footnotes" start={block.footnoteOrder! + 1} style={orderedListStyle(1, runtime.document.getSnapshot().footnoteOrder.length)}><BlockView block={block} footnoteId={block.footnoteId} runtime={runtime} components={config.components} extensions={config.extensions} rendererOverrides={config.rendererOverrides} decorations={decorations.get(block.id) ?? emptyDecorations} /></ol> : <BlockView block={block} runtime={runtime} components={config.components} extensions={config.extensions} rendererOverrides={config.rendererOverrides} decorations={decorations.get(block.id) ?? emptyDecorations} />}
      </div>; })}
    </div>
  </div>{!windowed && <Footnotes />}</>;
}
