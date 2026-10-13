import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useAppearance, useDocument, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import type { AnnotationOccurrence } from '../core';
import type { StyledProps } from '../react/types';
import { AnnotationGroup } from './AnnotationContent';
import { Collapse } from './Collapse';
import { annotationReferenceText } from './annotation-reference';
import { sourceRangeStartRect } from '../react/source-geometry';
import { useOverflowFade } from '../react/overflow-fade';

/** anchorTop is the first referenced text line, falling back to the marker. */
export interface SidebarItem { id: string; anchorTop: number; height: number }
export type SidebarPositioner = (items: readonly SidebarItem[], context: { activeId: string | null; gap: number; height?: number; prioritizeActive?: boolean }) => ReadonlyMap<string, number>;
export const alignSidebar: SidebarPositioner = (items, { activeId, gap, height, prioritizeActive }) => {
  const positions = items.map(item => item.anchorTop);
  const activeIndex = items.findIndex(item => item.id === activeId);
  const pivot = activeIndex < 0 ? 0 : activeIndex;
  if (!items.length) return new Map();
  positions[pivot] = height === undefined ? items[pivot].anchorTop : Math.max(0, Math.min(items[pivot].anchorTop, height - items[pivot].height));
  for (let i = pivot - 1; i >= 0; i--) positions[i] = Math.min(items[i].anchorTop, positions[i + 1] - items[i].height - gap);
  // Earlier cards may move above the clipped rail. Keeping them above zero
  // would push a late active card away from its anchor in a short document.
  for (let i = pivot + 1; i < items.length; i++) positions[i] = Math.max(items[i].anchorTop, positions[i - 1] + items[i - 1].height + gap);
  if (height !== undefined && items.reduce((sum, item) => sum + item.height, gap * (items.length - 1)) <= height) {
    // With enough total room, borrow unused space above the final cards.
    // Earlier cards intentionally clipped by the focused pivot must stay there:
    // restoring the top boundary would push that card away from its reference.
    const start = prioritizeActive && activeIndex >= 0 ? pivot + 1 : 0;
    for (let i = items.length - 1; i >= start; i--) positions[i] = Math.min(positions[i], (i === items.length - 1 ? height : positions[i + 1] - gap) - items[i].height);
    if (start || activeIndex < 0 || positions[0] >= 0) for (let i = start; i < items.length; i++) positions[i] = Math.max(positions[i], i === 0 ? 0 : positions[i - 1] + items[i - 1].height + gap);
  }
  return new Map(items.map((item, index) => [item.id, positions[index]]));
};

export interface AnnotationSidebarProps extends StyledProps {
  sync?: 'document' | 'none';
  gap?: number;
  positioner?: SidebarPositioner;
  renderCard?: (props: { occurrence: AnnotationOccurrence; active: boolean; activate: () => void }) => ReactNode;
}
export function AnnotationSidebar({ sync = 'document', gap = 14, positioner = alignSidebar, renderCard, className, style }: AnnotationSidebarProps) {
  const runtime = useRuntime();
  const document = useDocument();
  const appearance = useAppearance();
  const theme = useTheme(), locale = useLocale();
  const decorations = useStoreSelector(runtime.decorations, value => value);
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered);
  const hoverSource = useStoreSelector(runtime.interaction, state => state.hoverSource);
  const activeSource = useStoreSelector(runtime.interaction, state => state.activeSource);
  useSyncExternalStore(runtime.configuration.subscribe, runtime.configuration.get, runtime.configuration.get);
  const layout = useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  const viewport = useSyncExternalStore(runtime.viewport.subscribe, runtime.viewport.get, runtime.viewport.get);
  const rail = useRef<HTMLElement>(null);
  const cards = useRef(new Map<string, HTMLDivElement>());
  const [sizes, setSizes] = useState<Map<string, number>>(new Map());
  const [minimumSizes, setMinimumSizes] = useState<Map<string, number>>(new Map());
  const [anchorTops, setAnchorTops] = useState<Map<string, number>>(new Map());
  const [railHeight, setRailHeight] = useState(0);
  const measured = useRef({ sizes: new Map<string, number>(), minimum: new Map<string, number>(), height: 0 });
  const resizeFrame = useRef(0);
  const [viewportTop, setViewportTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [cardLock, setCardLock] = useState<{ id: string; top: number } | null>(null);
  const lastFocus = useRef<{ id: string; top?: number } | null>(null);
  const [release, setRelease] = useState<{ id: string; top?: number; progress: number } | null>(null);
  const occurrences = useMemo(() => {
    const values = [...decorations.occurrences].sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || a.id.localeCompare(b.id));
    if (sync === 'none') for (const annotation of decorations.annotations.values()) if (annotation.type !== 'highlight' && !values.some(item => item.annotationIds.includes(annotation.id))) values.push({ id: `unanchored-${annotation.id}`, range: { start: 0, end: 0 }, annotationIds: [annotation.id] });
    return values;
  }, [decorations, sync]);
  const references = useMemo(() => new Map(occurrences.map(occurrence => [occurrence.id, annotationReferenceText(document, occurrence)])), [document, occurrences]);
  const annotationGroups = useMemo(() => new Map(occurrences.map(occurrence => [occurrence.id, occurrence.annotationIds.flatMap(id => { const annotation = decorations.annotations.get(id); return annotation ? [annotation] : []; })])), [decorations, occurrences]);
  const measure = useCallback((beforePaint = false) => {
    const next = new Map<string, number>();
    const minimum = new Map<string, number>();
    cards.current.forEach((element, id) => {
      const height = element.getBoundingClientRect().height;
      next.set(id, height);
      const panels = [...element.querySelectorAll<HTMLElement>(':scope > .limr-sidebar-card-body > .limr-collapse')];
      minimum.set(id, height - panels.reduce((sum, panel) => sum + panel.getBoundingClientRect().height, 0));
    });
    // Keep the rail and card bounds in the same subpixel coordinate system.
    // Rounded clientHeight can put a bottom-aligned card outside the mask.
    const height = rail.current?.getBoundingClientRect().height ?? 0;
    const old = measured.current;
    if (old.height === height && old.sizes.size === next.size && [...next].every(([id, size]) => size === old.sizes.get(id) && Math.abs(minimum.get(id)! - (old.minimum.get(id) ?? 0)) < .5)) return;
    measured.current = { sizes: next, minimum, height };
    const update = () => { setSizes(next); setMinimumSizes(minimum); setRailHeight(height); };
    if (!beforePaint) { update(); return; }
    // The heights already contain the collapse animation's easing. Applying a
    // second top transition makes neighbors chase them and overlap the card.
    const element = rail.current;
    element?.setAttribute('data-resizing', '');
    flushSync(update);
    cancelAnimationFrame(resizeFrame.current);
    resizeFrame.current = requestAnimationFrame(() => {
      resizeFrame.current = requestAnimationFrame(() => element?.removeAttribute('data-resizing'));
    });
  }, []);
  const prepareFade = useCallback(() => measure(true), [measure]);
  useOverflowFade(rail, runtime, ':scope > .limr-sidebar-card', prepareFade);
  useEffect(() => {
    const observer = new ResizeObserver(() => measure(true));
    if (rail.current) observer.observe(rail.current);
    cards.current.forEach(element => observer.observe(element));
    measure();
    return () => observer.disconnect();
  }, [occurrences, measure, anchorTops]);
  useEffect(() => () => cancelAnimationFrame(resizeFrame.current), []);
  useIsomorphicLayoutEffect(() => {
    if (sync === 'none' || !rail.current) return;
    const top = rail.current.getBoundingClientRect().top;
    const values = new Map<string, number>();
    const displacement = runtime.getContentOffset();
    for (const occurrence of occurrences) {
      const marker = runtime.anchors.get(occurrence.id);
      if (!marker || marker.closest('[inert]')) continue;
      const rect = sourceRangeStartRect(runtime, decorations.referenceRanges.get(occurrence.id) ?? occurrence.range);
      values.set(occurrence.id, (rect || marker.getBoundingClientRect()).top - top - displacement);
    }
    setAnchorTops(old => old.size === values.size && [...values].every(([id, value]) => Math.abs(value - (old.get(id) ?? -Infinity)) < .5) ? old : values);
  }, [runtime, decorations.referenceRanges, occurrences, layout, sync]);
  useIsomorphicLayoutEffect(() => {
    if (sync !== 'document' || !rail.current) return;
    const root = runtime.configuration.get().scrollRoot;
    const bounds = rail.current.getBoundingClientRect();
    const top = Math.max(bounds.top, runtime.getViewportTop() + (root?.clientTop ?? 0), window.visualViewport?.offsetTop ?? 0);
    const bottom = Math.min(bounds.bottom, root ? runtime.getViewportTop() + root.clientTop + root.clientHeight : Infinity, (window.visualViewport?.offsetTop ?? 0) + (window.visualViewport?.height ?? innerHeight));
    setViewportTop(Math.max(0, top - bounds.top + (runtime.configuration.get().scrollOffset ?? 24)));
    setViewportHeight(Math.max(0, bottom - top));
  }, [runtime, layout, viewport, sync]);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const card = target.closest('.limr-sidebar-card');
      const marker = target.closest<HTMLElement>('[data-limr-anchor]');
      if ((card && rail.current?.contains(card)) || (marker && runtime.anchors.get(marker.dataset.limrAnchor!) === marker)) return;
      // Floating module UI and selection actions keep their own dismissal rules.
      if (target.closest('.limr-overlay-positioner,.limr-selection-toolbar')) return;
      const { active, hovered } = runtime.interaction.get();
      if (active || hovered) runtime.activate(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented || !runtime.interaction.get().active) return;
      const anchor = runtime.anchors.get(runtime.interaction.get().active!);
      anchor?.focus({ preventScroll: true });
      runtime.activate(null);
    };
    window.document.addEventListener('pointerdown', dismiss);
    window.document.addEventListener('keydown', escape);
    return () => { window.document.removeEventListener('pointerdown', dismiss); window.document.removeEventListener('keydown', escape); if (sync === 'document') runtime.documentOffset.set(0); };
  }, [runtime, sync]);
  const items = occurrences.filter(item => sync === 'none' || anchorTops.has(item.id));
  // Extensions may present source subtrees in another order (e.g. translation
  // before original). Aligned cards follow their rendered anchors.
  if (sync !== 'none') items.sort((a, b) => (anchorTops.get(a.id) ?? 0) - (anchorTops.get(b.id) ?? 0));
  const readingId = items.find(item => (anchorTops.get(item.id) ?? 0) >= viewportTop)?.id ?? items.at(-1)?.id ?? null;
  const alignmentId = hovered ?? active ?? readingId;
  const focusedId = hovered ?? active;
  const source = hovered ? hoverSource : active ? activeSource : null;
  const locked = source === 'sidebar' && cardLock?.id === alignmentId ? cardLock : null;
  const lockedTop = locked?.top;
  useIsomorphicLayoutEffect(() => {
    const previous = lastFocus.current;
    lastFocus.current = focusedId ? { id: focusedId, top: lockedTop } : null;
    if (focusedId || sync !== 'document' || !rail.current || matchMedia('(prefers-reduced-motion: reduce)').matches) { setRelease(null); return; }
    if (!previous) return;
    const style = getComputedStyle(rail.current), value = style.getPropertyValue('--limr-motion-slow').trim();
    const milliseconds = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
    const duration = Number.isFinite(milliseconds) ? Math.max(0, milliseconds) : 460;
    if (!duration) { setRelease(null); return; }
    // Use the skin's timing as a clock. Interpolate two layouts computed with
    // the SAME current card heights, so collapse and repacking share an easing
    // without a second CSS top transition making neighbors collide.
    const motion = rail.current.animate([{}, {}], { duration, easing: style.getPropertyValue('--limr-ease').trim() || 'ease-out' });
    setRelease({ ...previous, progress: 0 });
    let frame = 0;
    const step = () => {
      if (motion.playState === 'finished') { setRelease(null); return; }
      setRelease({ ...previous, progress: motion.effect?.getComputedTiming().progress ?? 0 });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(frame); motion.cancel(); };
  }, [focusedId, lockedTop, sync]);
  const sidebarItems = items.map(item => ({ id: item.id, anchorTop: anchorTops.get(item.id) ?? 0, height: sizes.get(item.id) ?? 80 }));
  const positionContext = { activeId: alignmentId, gap, height: sync === 'document' && railHeight > 0 ? railHeight : undefined, prioritizeActive: !!(hovered || active) };
  const positions = new Map(positioner(locked ? sidebarItems.map(item => item.id === locked.id ? { ...item, anchorTop: locked.top } : item) : sidebarItems, positionContext));
  const releasing = !focusedId && release;
  if (releasing) {
    const origin = positioner(sidebarItems.map(item => item.id === releasing.id && releasing.top !== undefined ? { ...item, anchorTop: releasing.top } : item), { ...positionContext, activeId: releasing.id, prioritizeActive: true });
    for (const [id, top] of positions) positions.set(id, top + ((origin.get(id) ?? top) - top) * (1 - releasing.progress));
  }
  const lockedAnchor = locked ? anchorTops.get(locked.id) ?? locked.top : 0;
  // Footer packing must not disable reverse alignment. Keep the hovered card
  // under the pointer and move its referenced text, even at the rail boundary.
  const displacement = sync === 'document' && locked ? (positions.get(locked.id) ?? locked.top) - lockedAnchor : 0;
  useIsomorphicLayoutEffect(() => { if (sync === 'document') runtime.documentOffset.set(displacement); }, [runtime, displacement, sync]);
  const lockCard = (id: string) => {
    // Keep the original resting position while this card is hovered or active.
    // Relocking its boundary-raised top would prevent a collapse from moving
    // back down, then jump when pointer leave releases the new lock.
    if (locked?.id === id) return;
    const card = cards.current.get(id);
    if (card && rail.current) {
      const origin = rail.current.getBoundingClientRect().top;
      const top = card.getBoundingClientRect().top - origin;
      setCardLock({ id, top });
    }
  };
  return <aside ref={rail} aria-label={locale.annotations} className={`limr-sidebar ${className ?? ''}`} data-sync={sync} data-releasing={releasing ? '' : undefined} data-limr-theme={theme} data-limr-appearance={appearance} style={style}>
    {items.map(occurrence => {
      const annotation = decorations.annotations.get(occurrence.annotationIds[0]);
      const definition = runtime.annotationTypes.get(annotation?.type ?? 'citation');
      const isActive = active === occurrence.id;
      const palette = definition?.sidebar;
      const Preview = palette?.Preview;
      // A marker at the end of the article can align its collapsed card by
      // giving the reference/title priority over the optional summary. Expanded
      // content is bounded by the viewport and scrolls inside the card.
      const available = source === 'marker' && alignmentId === occurrence.id && !isActive
        ? Math.max(minimumSizes.get(occurrence.id) ?? 80, railHeight - (anchorTops.get(occurrence.id) ?? 0)) : railHeight;
      const cardHeight = isActive ? Math.min(available, Math.max(minimumSizes.get(occurrence.id) ?? 80, viewportHeight || railHeight)) : available;
      const cardStyle = {
        '--limr-annotation-color': palette?.color ?? definition?.color,
        '--limr-annotation-border': palette?.borderColor,
        '--limr-annotation-title': palette?.titleColor,
        '--limr-annotation-text': palette?.textColor,
        '--limr-annotation-excerpt': palette?.excerptColor,
        '--limr-annotation-preview': palette?.previewColor,
        '--limr-sidebar-preview-lines': String(Math.max(1, Math.floor(palette?.previewLines ?? 2))),
        ...(sync === 'document' ? {
          position: 'absolute', top: positions.get(occurrence.id) ?? 0, insetInline: 0,
          '--limr-sidebar-card-height': `${cardHeight}px`,
        } : { marginBlockEnd: gap }),
      } as CSSProperties & { [token: `--${string}`]: string | undefined };
      // A mixed card must not dismiss a conversation because a citation opted in.
      const collapseOnContentClick = occurrence.annotationIds.every(id => runtime.annotationTypes.get(decorations.annotations.get(id)?.type ?? '')?.sidebar?.collapseOnContentClick);
      const activate = () => {
        const hovering = runtime.interaction.get().hovered === occurrence.id || cards.current.get(occurrence.id)?.matches(':hover');
        lockCard(occurrence.id);
        runtime.activate(isActive ? null : occurrence.id, 'sidebar');
        // Activation clears marker hover; the pointer is still inside this card.
        if (hovering) runtime.hover(occurrence.id, 'sidebar');
      };
      return <div key={occurrence.id} ref={element => { if (element) cards.current.set(occurrence.id, element); else cards.current.delete(occurrence.id); }}
        className="limr-sidebar-card" data-type={annotation?.type} data-locked={locked?.id === occurrence.id || undefined} data-active={isActive || hovered === occurrence.id || undefined} data-expanded={isActive || undefined} data-default-card={!renderCard || undefined} data-content-toggle={collapseOnContentClick || undefined} data-citations={occurrence.annotationIds.every(id => decorations.annotations.get(id)?.type === 'citation') || undefined} data-occurrence={occurrence.id}
        style={cardStyle}
        onPointerEnter={event => { if (event.pointerType !== 'touch') { lockCard(occurrence.id); runtime.hover(occurrence.id, 'sidebar'); } }} onPointerLeave={() => { if (runtime.interaction.get().hovered === occurrence.id && runtime.interaction.get().hoverSource === 'sidebar') runtime.hover(null); }}
        onClick={event => {
          if ((!isActive || collapseOnContentClick) && !renderCard && !event.defaultPrevented && !(event.target as Element).closest('button,a,input,select,textarea,summary,[role="button"],[role="link"],[contenteditable="true"],[data-limr-card-interactive]') && window.getSelection()?.isCollapsed !== false) activate();
        }}>
        {renderCard ? renderCard({ occurrence, active: isActive, activate }) : <>
          {references.get(occurrence.id) && <div className="limr-sidebar-reference" title={references.get(occurrence.id)}><p className="limr-sidebar-excerpt">{references.get(occurrence.id)}</p></div>}
          <div className="limr-sidebar-card-body">
            <button type="button" className="limr-sidebar-card-heading" onClick={activate} aria-expanded={isActive}>{definition?.label ?? annotation?.type ?? 'Reference'}<span className="limr-sidebar-toggle"><span key={String(isActive)} className="limr-button-label limr-underline">{isActive ? locale.collapse : locale.expand}</span></span></button>
            {Preview && annotation && <Collapse open={!isActive} keepMounted className="limr-sidebar-preview-panel"><div className="limr-sidebar-preview"><Preview annotation={annotation} data={annotation.data} occurrence={occurrence} annotations={annotationGroups.get(occurrence.id)!} referenceText={references.get(occurrence.id) ?? ''} /></div></Collapse>}
            <Collapse open={isActive} className="limr-sidebar-expansion"><div className="limr-sidebar-card-content"><AnnotationGroup occurrence={occurrence} presentation="sidebar" enabled={isActive} /></div></Collapse>
          </div>
        </>}
      </div>;
    })}
  </aside>;
}
