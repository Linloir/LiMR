import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { useAppearance, useDocument, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import type { AnnotationOccurrence } from '../core';
import type { StyledProps } from '../react/types';
import { AnnotationGroup } from './AnnotationContent';
import { Collapse } from './Collapse';
import { annotationReferenceText } from './annotation-reference';
import { sourceRangeStartRect } from '../react/source-geometry';

/** anchorTop is the first anchored text line, or the marker for embedded references. */
export interface SidebarItem { id: string; anchorTop: number; height: number }
export type SidebarPositioner = (items: readonly SidebarItem[], context: { activeId: string | null; gap: number }) => ReadonlyMap<string, number>;
export const alignSidebar: SidebarPositioner = (items, { activeId, gap }) => {
  const positions = items.map(item => item.anchorTop);
  const activeIndex = items.findIndex(item => item.id === activeId);
  const pivot = activeIndex < 0 ? 0 : activeIndex;
  if (!items.length) return new Map();
  positions[pivot] = items[pivot].anchorTop;
  for (let i = pivot - 1; i >= 0; i--) positions[i] = Math.min(items[i].anchorTop, positions[i + 1] - items[i].height - gap);
  // Earlier cards may move above the clipped rail. Keeping them above zero
  // would push a late active card away from its anchor in a short document.
  for (let i = pivot + 1; i < items.length; i++) positions[i] = Math.max(items[i].anchorTop, positions[i - 1] + items[i - 1].height + gap);
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
  const [anchorTops, setAnchorTops] = useState<Map<string, number>>(new Map());
  const [railHeight, setRailHeight] = useState(0);
  const [viewportTop, setViewportTop] = useState(0);
  const [cardLock, setCardLock] = useState<{ id: string; top: number } | null>(null);
  const occurrences = useMemo(() => {
    const values = [...decorations.occurrences].sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || a.id.localeCompare(b.id));
    if (sync === 'none') for (const annotation of decorations.annotations.values()) if (annotation.type !== 'highlight' && !values.some(item => item.annotationIds.includes(annotation.id))) values.push({ id: `unanchored-${annotation.id}`, range: { start: 0, end: 0 }, annotationIds: [annotation.id] });
    return values;
  }, [decorations, sync]);
  const references = useMemo(() => new Map(occurrences.map(occurrence => [occurrence.id, annotationReferenceText(document, occurrence)])), [document, occurrences]);
  const annotationGroups = useMemo(() => new Map(occurrences.map(occurrence => [occurrence.id, occurrence.annotationIds.flatMap(id => { const annotation = decorations.annotations.get(id); return annotation ? [annotation] : []; })])), [decorations, occurrences]);
  const measure = useCallback(() => {
    const next = new Map<string, number>();
    cards.current.forEach((element, id) => next.set(id, element.getBoundingClientRect().height));
    setSizes(old => old.size === next.size && [...next].every(([id, size]) => Math.abs(size - (old.get(id) ?? 0)) < .5) ? old : next);
    setRailHeight(rail.current?.clientHeight ?? 0);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (rail.current) observer.observe(rail.current);
    cards.current.forEach(element => observer.observe(element));
    measure();
    return () => observer.disconnect();
  }, [occurrences, measure, anchorTops]);
  useIsomorphicLayoutEffect(() => {
    if (sync === 'none' || !rail.current) return;
    const top = rail.current.getBoundingClientRect().top;
    const values = new Map<string, number>();
    const displacement = runtime.getContentOffset();
    for (const occurrence of occurrences) {
      const marker = runtime.anchors.get(occurrence.id);
      if (!marker) continue;
      const rect = !occurrence.embedded && sourceRangeStartRect(runtime, occurrence.range);
      values.set(occurrence.id, (rect || marker.getBoundingClientRect()).top - top - displacement);
    }
    setAnchorTops(old => old.size === values.size && [...values].every(([id, value]) => Math.abs(value - (old.get(id) ?? -Infinity)) < .5) ? old : values);
  }, [runtime, occurrences, layout, sync]);
  useIsomorphicLayoutEffect(() => {
    if (sync === 'document' && rail.current) setViewportTop(Math.max(0, runtime.getViewportTop() - rail.current.getBoundingClientRect().top + (runtime.configuration.get().scrollOffset ?? 24)));
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
  const readingId = items.find(item => (anchorTops.get(item.id) ?? 0) >= viewportTop)?.id ?? items.at(-1)?.id ?? null;
  const alignmentId = hovered ?? active ?? readingId;
  const source = hovered ? hoverSource : active ? activeSource : null;
  const locked = source === 'sidebar' && cardLock?.id === alignmentId ? cardLock : null;
  const positions = positioner(items.map(item => ({ id: item.id, anchorTop: (locked?.id === item.id ? locked.top : anchorTops.get(item.id)) ?? 0, height: sizes.get(item.id) ?? 80 })), { activeId: alignmentId, gap });
  const displacement = sync === 'document' && locked ? locked.top - (anchorTops.get(locked.id) ?? locked.top) : 0;
  useIsomorphicLayoutEffect(() => { if (sync === 'document') runtime.documentOffset.set(displacement); }, [runtime, displacement, sync]);
  const lockCard = (id: string) => {
    const card = cards.current.get(id);
    if (card && rail.current) {
      const origin = rail.current.getBoundingClientRect().top;
      setCardLock({ id, top: card.getBoundingClientRect().top - origin });
    }
  };
  return <aside ref={rail} aria-label={locale.annotations} className={`limr-sidebar ${className ?? ''}`} data-sync={sync} data-limr-theme={theme} data-limr-appearance={appearance} style={style}>
    {items.map(occurrence => {
      const annotation = decorations.annotations.get(occurrence.annotationIds[0]);
      const definition = runtime.annotationTypes.get(annotation?.type ?? 'citation');
      const isActive = active === occurrence.id;
      const palette = definition?.sidebar;
      const Preview = palette?.Preview;
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
          '--limr-sidebar-card-height': `${Math.max(0, railHeight - (positions.get(occurrence.id) ?? 0))}px`,
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
            {Preview && annotation && <Collapse open={!isActive} className="limr-sidebar-preview-panel"><div className="limr-sidebar-preview"><Preview annotation={annotation} data={annotation.data} occurrence={occurrence} annotations={annotationGroups.get(occurrence.id)!} referenceText={references.get(occurrence.id) ?? ''} /></div></Collapse>}
            <Collapse open={isActive} className="limr-sidebar-expansion"><div className="limr-sidebar-card-content"><AnnotationGroup occurrence={occurrence} presentation="sidebar" enabled={isActive} /></div></Collapse>
          </div>
        </>}
      </div>;
    })}
  </aside>;
}
