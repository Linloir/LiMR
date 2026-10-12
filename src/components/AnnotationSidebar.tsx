import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import type { AnnotationOccurrence } from '../core';
import type { StyledProps } from '../react/types';
import { AnnotationGroup } from './AnnotationContent';

export interface SidebarItem { id: string; anchorTop: number; height: number }
export type SidebarPositioner = (items: readonly SidebarItem[], context: { activeId: string | null; gap: number }) => ReadonlyMap<string, number>;
export const alignSidebar: SidebarPositioner = (items, { activeId, gap }) => {
  const positions = items.map((item, index) => item.anchorTop);
  const activeIndex = items.findIndex(item => item.id === activeId);
  const pivot = activeIndex < 0 ? 0 : activeIndex;
  if (!items.length) return new Map();
  positions[pivot] = Math.max(0, items[pivot].anchorTop);
  for (let i = pivot - 1; i >= 0; i--) positions[i] = Math.min(items[i].anchorTop, positions[i + 1] - items[i].height - gap);
  if (positions[0] < 0) { const shift = -positions[0]; for (let i = 0; i <= pivot; i++) positions[i] += shift; }
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
  const theme = useTheme(), locale = useLocale();
  const decorations = useStoreSelector(runtime.decorations, value => value);
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered);
  const layout = useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  const rail = useRef<HTMLElement>(null);
  const cards = useRef(new Map<string, HTMLDivElement>());
  const [sizes, setSizes] = useState<Map<string, number>>(new Map());
  const [anchorTops, setAnchorTops] = useState<Map<string, number>>(new Map());
  const occurrences = useMemo(() => {
    const values = [...decorations.occurrences];
    if (sync === 'none') for (const annotation of decorations.annotations.values()) if (!values.some(item => item.annotationIds.includes(annotation.id))) values.push({ id: `unanchored-${annotation.id}`, range: { start: 0, end: 0 }, annotationIds: [annotation.id] });
    return values;
  }, [decorations, sync]);
  const measure = useCallback(() => {
    const next = new Map<string, number>();
    cards.current.forEach((element, id) => next.set(id, element.getBoundingClientRect().height));
    setSizes(old => old.size === next.size && [...next].every(([id, size]) => Math.abs(size - (old.get(id) ?? 0)) < .5) ? old : next);
  }, []);
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    cards.current.forEach(element => observer.observe(element));
    measure();
    return () => observer.disconnect();
  }, [occurrences, measure, anchorTops]);
  useEffect(() => {
    if (sync === 'none' || !rail.current) return;
    const top = rail.current.getBoundingClientRect().top;
    const values = new Map<string, number>();
    for (const occurrence of occurrences) { const element = runtime.anchors.get(occurrence.id); if (element) values.set(occurrence.id, element.getBoundingClientRect().top - top); }
    setAnchorTops(old => old.size === values.size && [...values].every(([id, value]) => Math.abs(value - (old.get(id) ?? -Infinity)) < .5) ? old : values);
  }, [runtime, occurrences, layout, sync]);
  const items = occurrences.filter(item => sync === 'none' || anchorTops.has(item.id));
  const positions = positioner(items.map(item => ({ id: item.id, anchorTop: anchorTops.get(item.id) ?? 0, height: sizes.get(item.id) ?? 80 })), { activeId: active, gap });
  const height = Math.max(0, ...items.map(item => (positions.get(item.id) ?? 0) + (sizes.get(item.id) ?? 80)));
  return <aside ref={rail} aria-label={locale.annotations} className={`limr-sidebar ${className ?? ''}`} data-sync={sync} data-limr-theme={theme} style={{ ...style, ...(sync === 'document' ? { minHeight: height } : {}) }}>
    {items.map(occurrence => {
      const annotation = decorations.annotations.get(occurrence.annotationIds[0]);
      const definition = runtime.annotationTypes.get(annotation?.type ?? 'citation');
      const isActive = active === occurrence.id;
      const activate = () => runtime.activate(isActive ? null : occurrence.id);
      return <div key={occurrence.id} ref={element => { if (element) cards.current.set(occurrence.id, element); else cards.current.delete(occurrence.id); }}
        className="limr-sidebar-card" data-active={isActive || hovered === occurrence.id || undefined} data-occurrence={occurrence.id}
        style={sync === 'document' ? { position: 'absolute', top: positions.get(occurrence.id) ?? 0, insetInline: 0 } : { marginBlockEnd: gap }}
        onPointerEnter={event => { if (event.pointerType !== 'touch') runtime.hover(occurrence.id); }} onPointerLeave={() => runtime.hover(null)}>
        {renderCard ? renderCard({ occurrence, active: isActive, activate }) : <>
          <button type="button" className="limr-sidebar-card-heading" onClick={activate} aria-expanded={isActive}>{definition?.label ?? annotation?.type ?? 'Reference'}<span aria-hidden="true">{isActive ? '−' : '+'}</span></button>
          {!isActive && <p className="limr-sidebar-excerpt">{runtime.document.getSnapshot().source.slice(occurrence.range.start, occurrence.range.end).replace(/<[^>]*>/g, '').slice(0, 160)}</p>}
          {isActive && <div className="limr-sidebar-card-content"><AnnotationGroup occurrence={occurrence} presentation="sidebar" /></div>}
        </>}
      </div>;
    })}
  </aside>;
}
