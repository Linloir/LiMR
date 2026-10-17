import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { autoUpdate, flip, FloatingFocusManager, FloatingOverlay, FloatingPortal, offset, shift, size, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';
import { useAppearance, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import { AnnotationGroup } from './AnnotationContent';
import { useCardMotion } from './card-motion';
import { AnnotationCard } from './AnnotationCard';
import type { AnnotationOccurrence } from '../core';
import type { AnnotationOverlayCardProps } from '../react/types';
import { floatingSurfaces, useOverlayGeometry } from './floating-surfaces';
import { imagePreviewSurfaces, isOwnedImagePreview } from './image-preview-behavior';

export interface AnnotationOverlayProps { disabled?: boolean; portalRoot?: HTMLElement | null; previewWidth?: number; maxHeight?: string }
const length = (value: number | string) => typeof value === 'number' ? `${value}px` : value;
const idleSubscribe = () => () => {};
export function AnnotationOverlay({ disabled = false, portalRoot, previewWidth = 340, maxHeight = '80dvh' }: AnnotationOverlayProps) {
  const runtime = useRuntime();
  const surfaces = floatingSurfaces(runtime);
  const toolbarSpace = useSyncExternalStore(surfaces.toolbarSpace.subscribe, surfaces.toolbarSpace.get, surfaces.toolbarSpace.get);
  const appearance = useAppearance();
  const theme = useTheme(), locale = useLocale();
  const editing = useStoreSelector(runtime.interaction, state => state.editing);
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered);
  const toolbarOccurrence = useStoreSelector(runtime.interaction, state => state.toolbarOccurrence);
  const occurrences = useStoreSelector(runtime.decorations, state => state.occurrences);
  useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  const [preview, setPreview] = useState<string | null>(null);
  const [collapsedId, setCollapsedId] = useState<string | null>(null);
  const [, setViewportTick] = useState(0);
  useEffect(() => {
    if (active || disabled) { setPreview(null); return; }
    if (hovered) { setPreview(hovered); return; }
    const timer = setTimeout(() => setPreview(null), 90);
    return () => clearTimeout(timer);
  }, [hovered, active, disabled]);
  useEffect(() => {
    const update = () => setViewportTick(value => value + 1);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => { window.visualViewport?.removeEventListener('resize', update); window.visualViewport?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const wantedId = active ?? preview;
  const wanted = occurrences.find(item => item.id === wantedId);
  const [retained, setRetained] = useState<AnnotationOccurrence | null>(null);
  // Exit animations may retain a surface, but never an uninstalled capability.
  const occurrence = wanted ?? (retained && occurrences.find(item => item.id === retained.id));
  const id = occurrence?.id;
  const annotation = useStoreSelector(runtime.decorations, state => state.annotations.get(occurrence?.annotationIds[0] ?? ''));
  const definition = useStoreSelector(runtime.configuration, () => runtime.annotationTypes.get(annotation?.type ?? 'citation'));
  const policy = definition?.overlay?.expand;
  const expansion = typeof policy === 'function' ? annotation && policy(annotation) : policy;
  const pinned = active === id;
  const expanded = pinned && !!expansion && collapsedId !== id;
  const [lastExpanded, setLastExpanded] = useState(false);
  const [lastPinned, setLastPinned] = useState(false);
  const open = !!wanted && !disabled;
  const retainedSpace = useRef<{ id?: string; height: number } | null>(null);
  const retainedGeometry = useRef<{ id?: string; rect: DOMRect } | null>(null);
  if (open && toolbarSpace) retainedSpace.current = { id, height: toolbarSpace };
  const awaitingToolbar = pinned && toolbarOccurrence === id && !(editing && occurrence?.annotationIds.includes(editing));
  // Unmounting the toolbar must not resize a card halfway through its exit or
  // the first frame of reversing that exit. Editing releases the reservation.
  const reservedSpace = toolbarSpace || ((!open || awaitingToolbar) && retainedSpace.current && retainedSpace.current.id === id ? retainedSpace.current.height : 0);
  useIsomorphicLayoutEffect(() => {
    // Hover previews replace an old text selection. A clicked marker owns its
    // own action range, which remains available alongside the pinned card.
    if (open && !pinned) runtime.clearSelection();
  }, [runtime, open, id, pinned]);
  useSyncExternalStore(open ? runtime.viewport.subscribe : idleSubscribe, runtime.viewport.get, runtime.viewport.get);
  useEffect(() => {
    if (open) { setRetained(wanted!); setLastExpanded(expanded); setLastPinned(pinned); }
  }, [wanted, open, expanded, pinned]);
  const close = () => {
    const anchor = id ? runtime.anchors.get(id) : null;
    anchor?.focus({ preventScroll: true });
    runtime.activate(null); runtime.hover(null); setPreview(null);
  };
  const anchor = id ? runtime.anchors.get(id) : undefined;
  const [previewGeometry, setPreviewGeometry] = useState<{ id?: string; rect: DOMRect; placement: string } | null>(null);
  const fromPreview = previewGeometry?.id === id ? previewGeometry : null;
  const requestedExpanded = open ? expanded : lastExpanded;
  // Even a toolbar/touch opening first measures the real module preview at
  // its anchor. It stays hidden for this layout pass, and is never duplicated.
  const measuringPreview = open && requestedExpanded && !fromPreview;
  const shownExpanded = requestedExpanded && !measuringPreview;
  const shownPinned = open ? pinned : lastPinned;
  const centered = shownExpanded && expansion && expansion.placement === 'center';
  const anchoredExpansion = shownExpanded && !centered && fromPreview;
  // Floating UI can finish an asynchronous preview calculation after React has
  // switched the same host to another card or to its expanded dimensions.
  const sizing = useRef({ id, expanded: shownExpanded, open });
  sizing.current = { id, expanded: shownExpanded, open };
  const { refs, update, floatingStyles, context, isPositioned, placement, middlewareData } = useFloating({ open, elements: { reference: anchor ?? null }, onOpenChange: next => { if (!next) close(); }, strategy: 'fixed', transform: false, placement: 'bottom-start', whileElementsMounted: autoUpdate, middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 }), size({ padding: 12, apply: ({ availableHeight, elements }) => {
    if (!sizing.current.open || sizing.current.id !== id || sizing.current.expanded !== shownExpanded) return;
    if (!shownExpanded) {
      const viewHeight = window.visualViewport?.height ?? window.innerHeight;
      const room = reservedSpace && viewHeight < 320 ? viewHeight - 24 - reservedSpace - 10 : availableHeight - (reservedSpace ? reservedSpace + 10 : 0);
      elements.floating.style.maxHeight = `${Math.max(0, Math.floor(Math.min(360, room)))}px`;
    }
    else if (!centered && !fromPreview) elements.floating.style.maxHeight = `min(${length(expansion && expansion.maxHeight || maxHeight)}, ${Math.max(0, Math.floor(availableHeight))}px)`;
  } }, [id, shownExpanded, !!centered, !!fromPreview, expansion && expansion.maxHeight, maxHeight, reservedSpace]), {
    name: 'limrAnchor',
    options: { id, expanded: shownExpanded },
    // Capture this calculation's identity, rather than reading a reused marker's
    // new ID after earlier asynchronous middleware has already measured it.
    fn: ({ elements, rects }) => ({ data: { id: (elements.reference as HTMLElement).dataset?.limrAnchor === id ? id : undefined, expanded: shownExpanded, width: rects.floating.width, height: rects.floating.height } }),
  }] });
  useIsomorphicLayoutEffect(() => {
    // A retained surface never remounts when an exit is reversed. Floating UI
    // resets isPositioned on close, so explicitly remeasure that same surface.
    if (open && anchor) update();
  }, [anchor, update, open, shownExpanded]);
  useOverlayGeometry(runtime, refs.floating.current, open);
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: event => !(event.target instanceof Node && surfaces.toolbar?.contains(event.target)) && !isOwnedImagePreview(event.target, refs.floating.current) });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);
  const positioned = middlewareData.limrAnchor;
  const hostRect = refs.floating.current?.getBoundingClientRect();
  const dimensionsReady = !!hostRect && Math.abs(hostRect.width - (positioned?.width ?? -1)) < .5 && Math.abs(hostRect.height - (positioned?.height ?? -1)) < .5;
  const ready = !!centered || !!anchoredExpansion || !open || isPositioned && positioned?.id === id && positioned?.expanded === shownExpanded && dimensionsReady;
  const [surface, setSurface] = useState<HTMLDivElement | null>(null);
  const edge = (shownExpanded ? fromPreview?.placement ?? 'bottom' : placement).startsWith('top') ? 'bottom' : 'top';
  useCardMotion(surface, refs.floating.current, anchor, open, shownExpanded, ready && !measuringPreview, id, edge, fromPreview?.rect, () => { setRetained(null); setCollapsedId(null); setPreviewGeometry(null); retainedSpace.current = null; retainedGeometry.current = null; });
  useIsomorphicLayoutEffect(() => {
    if (open && ready && !measuringPreview && refs.floating.current) retainedGeometry.current = { id, rect: refs.floating.current.getBoundingClientRect() };
  });
  useIsomorphicLayoutEffect(() => {
    if (!shownExpanded && open && ready && refs.floating.current) {
      const rect = refs.floating.current.getBoundingClientRect();
      if (!fromPreview || fromPreview.placement !== placement || (['x', 'y', 'width', 'height'] as const).some(key => Math.abs(rect[key] - fromPreview.rect[key]) > .5)) setPreviewGeometry({ id, rect, placement });
    }
  });
  if (!occurrence || disabled) return null;
  const visual = window.visualViewport;
  const viewLeft = visual?.offsetLeft ?? 0, viewTop = visual?.offsetTop ?? 0;
  const availableWidth = visual?.width ?? window.innerWidth, availableHeight = visual?.height ?? window.innerHeight;
  // Portalled dialogs belong to the whole visible page, including when the
  // reader lives in an offset column or a nested scroll container.
  const top = viewTop + 12;
  const bottom = viewTop + availableHeight - 12;
  const compact = !!reservedSpace && availableHeight < 320;
  const heightLimit = Math.max(0, centered && !compact && reservedSpace ? availableHeight - 2 * (reservedSpace + 20) : bottom - top - (reservedSpace ? reservedSpace + 10 : 0));
  const settings = shownExpanded && expansion ? expansion : undefined;
  const width = `min(${length(settings?.width ?? (centered ? 640 : definition?.overlay?.previewWidth ?? previewWidth))}, ${Math.max(0, availableWidth - 24)}px)`;
  let style: CSSProperties = { ...floatingStyles, width, maxHeight: Math.min(360, heightLimit) };
  if (settings) {
    style = { ...style, height: settings.height === undefined ? undefined : `min(${length(settings.height)}, ${heightLimit}px)`, maxHeight: `min(${length(settings.maxHeight ?? maxHeight)}, ${heightLimit}px)` };
    if (centered) style = { ...style, left: viewLeft + availableWidth / 2, top: viewTop + availableHeight / 2, transform: 'translate(-50%, -50%)' };
    else if (fromPreview) {
      const upward = fromPreview.placement.startsWith('top');
      const room = Math.max(0, (upward ? fromPreview.rect.bottom - top : bottom - fromPreview.rect.top) - (reservedSpace ? reservedSpace + 10 : 0));
      style = { ...style, left: fromPreview.rect.left, top: upward ? fromPreview.rect.bottom : fromPreview.rect.top, transform: upward ? 'translateY(-100%)' : 'none', maxWidth: viewLeft + availableWidth - 12 - fromPreview.rect.left, maxHeight: `min(${length(settings.maxHeight ?? maxHeight)}, ${room}px)` };
    }
  }
  // In a short visual viewport (for example above a software keyboard), an
  // anchored popup cannot leave usable space on either side of the marker.
  // Share the viewport vertically with the independently scrolling toolbar.
  if (compact) style = { ...style, top, transform: centered ? 'translateX(-50%)' : 'none', maxHeight: heightLimit, height: settings?.height ? heightLimit : undefined };
  if (!open && retainedGeometry.current && retainedGeometry.current.id === id) {
    const rect = retainedGeometry.current.rect;
    style = { ...style, left: rect.left, top: rect.top, width: rect.width, height: rect.height, maxHeight: rect.height, transform: 'none' };
  }
  const Card = definition?.overlay?.Card;
  const cardProps: AnnotationOverlayCardProps = {
    annotation: annotation ?? { id: occurrence.annotationIds[0], type: 'unknown' }, occurrence,
    presentation: shownExpanded ? 'expanded' : 'preview', expanded: shownExpanded, pinned: shownPinned,
    canExpand: !!expansion,
    expand: () => { setCollapsedId(null); runtime.activate(occurrence.id); },
    collapse: () => { setCollapsedId(occurrence.id); runtime.activate(occurrence.id); },
    close,
    children: <AnnotationGroup occurrence={occurrence} presentation={shownExpanded ? 'expanded' : 'preview'} expanded={shownExpanded} />,
  };
  const modal = open && !!centered;
  const card = <FloatingFocusManager context={context} modal={modal} disabled={!open || !pinned || measuringPreview} initialFocus={editing ? -1 : refs.floating} returnFocus={false} getInsideElements={() => [...(surfaces.toolbar ? [surfaces.toolbar] : []), ...imagePreviewSurfaces(refs.floating.current)]}>
    <div ref={refs.setFloating} {...getFloatingProps()} tabIndex={-1} aria-label={definition?.label ?? locale.annotations} className="limr-overlay-positioner" style={{ ...style, pointerEvents: open ? 'auto' : 'none', visibility: ready && !measuringPreview ? 'visible' : 'hidden' }}>
      <div ref={setSurface} className={`limr-annotation-overlay ${shownExpanded ? 'limr-annotation-expanded' : 'limr-annotation-preview'}`} style={{ '--limr-annotation-color': definition?.color } as CSSProperties} data-type={annotation?.type} data-state={open ? 'open' : 'closing'} data-pinned={shownPinned || undefined} data-placement={centered ? 'center' : anchoredExpansion ? fromPreview.placement : placement} data-limr-theme={theme} data-limr-appearance={appearance}
        onPointerEnter={event => { if (!pinned && event.pointerType !== 'touch') runtime.hover(occurrence.id); }} onPointerLeave={() => { if (!pinned) runtime.hover(null); }}>
        <div className="limr-overlay-surface" aria-hidden="true" />
        <div className="limr-overlay-card">{Card && annotation ? <Card {...cardProps} /> : <AnnotationCard {...cardProps} title={definition?.label ?? annotation?.type ?? locale.annotations} />}</div>
      </div>
    </div>
  </FloatingFocusManager>;
  return <FloatingPortal root={portalRoot}><FloatingOverlay className="limr-backdrop" data-expanded={modal || undefined} lockScroll={modal} style={{ pointerEvents: modal ? 'auto' : 'none' }}>{card}</FloatingOverlay></FloatingPortal>;
}
