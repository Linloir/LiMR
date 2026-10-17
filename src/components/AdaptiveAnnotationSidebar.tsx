import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import type { AnnotationOccurrence } from '../core';
import { useAppearance, useDocument, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import { createSourceRangeLookup } from '../react/source-geometry';
import { createAnnotationReferenceReader } from './annotation-reference';
import { SidebarCardBody } from './SidebarCardBody';
import { fitSidebarBoxes, foldWindowHeight, planSidebarCollapse, planSidebarCollapseSteps, reanchorSidebarPlan, type CollapsibleSidebarItem, type SidebarClusterPlan } from './sidebar-collapse';
import type { AnnotationSidebarProps } from './AnnotationSidebar';
import { isOwnedImagePreview } from './image-preview-behavior';

interface Geometry { anchors: Map<string, number>; height: number; viewportHeight: number; clipTop: number; clipBottom: number }
interface Pose { top: number; height: number; offset: number }
interface Target extends Pose { contentHeight: number; bottomFade: number; cards: { id: string; top: number; height: number }[] }
const sameSizes = (a: Map<string, number>, b: Map<string, number>) => a.size === b.size && [...a].every(([id, value]) => Math.abs(value - (b.get(id) ?? -Infinity)) < .5);

/** One clock for group placement, clipping and content translation. Geometry is
 * cached before the animation; frames only write transforms and clipping state,
 * with no scroll events, layout reads or React renders to feed back into hover. */
function useSidebarMotion(rail: RefObject<HTMLElement | null>, targets: Map<string, Target>, membership: string, intent: string, geometry: Geometry, gap: number, focusGroup?: string) {
  const latest = useRef({ targets, geometry, gap, focusGroup }), previousIntent = useRef(intent), frame = useRef(0), current = useRef(new Map<string, Pose>());
  const nodes = useRef(new Map<string, { group: HTMLElement; viewport: HTMLElement; content: HTMLElement; cards: Map<string, HTMLElement> }>());
  const write = useCallback((poses: Map<string, Pose>) => {
    const { targets, geometry, gap, focusGroup } = latest.current;
    // A card may finish measuring during a reversal. Constrain the interpolated
    // boxes too, so that new heights cannot outrun a neighbor's current pose.
    poses = new Map([...poses].map(([id, pose]) => [id, { ...pose }]));
    const entries = [...poses], pivot = Math.max(0, entries.findIndex(([id]) => id === focusGroup));
    for (let i = pivot - 1; i >= 0; i--) entries[i][1].top = Math.min(entries[i][1].top, entries[i + 1][1].top - entries[i][1].height - gap);
    for (let i = pivot + 1; i < entries.length; i++) entries[i][1].top = Math.max(entries[i][1].top, entries[i - 1][1].top + entries[i - 1][1].height + gap);
    for (const [id, pose] of poses) {
      const node = nodes.current.get(id), target = targets.get(id); if (!node || !target) continue;
      const previous = current.current.get(id);
      if (!previous || previous.top !== pose.top) node.group.style.transform = `translate3d(0,${pose.top}px,0)`;
      if (!previous || previous.height !== pose.height) node.viewport.style.height = `${pose.height}px`;
      if (!previous || previous.offset !== pose.offset) node.content.style.transform = `translate3d(0,${-pose.offset}px,0)`;
      if (node.group.dataset.ready !== 'true') node.group.dataset.ready = 'true';
      const start = Math.max(0, Math.min(pose.height, geometry.clipTop - pose.top)), end = Math.max(start, Math.min(pose.height, geometry.clipBottom - pose.top));
      const topOverflow = Math.max(0, pose.offset + start), bottomOverflow = Math.max(0, target.contentHeight - pose.offset - end);
      node.viewport.toggleAttribute('data-overflow-top', end > start && topOverflow > .5);
      node.viewport.toggleAttribute('data-overflow-bottom', end > start && bottomOverflow > .5);
      const set = (name: string, value: number) => { const css = `${value.toFixed(2)}px`; if (node.viewport.style.getPropertyValue(name) !== css) node.viewport.style.setProperty(name, css); };
      set('--limr-fade-start', start); set('--limr-fade-end', end);
      // Masks belong to the clipping window, not the moving cards. When the
      // tail comes into view, reduce the fade to the actual remaining overflow
      // instead of dimming a fully revealed item until the animation ends.
      set('--limr-fade-top', Math.min(24, topOverflow));
      set('--limr-fade-bottom', Math.min(end === pose.height ? target.bottomFade : 24, bottomOverflow));
      for (const card of target.cards) {
        const element = node.cards.get(card.id); if (!element) continue;
        const folded = card.top >= pose.offset + pose.height - 1 || card.top + card.height <= pose.offset + 1;
        if (element.hasAttribute('inert') === folded) continue;
        element.toggleAttribute('inert', folded); element.toggleAttribute('data-folded', folded);
        if (folded) element.setAttribute('aria-hidden', 'true'); else element.removeAttribute('aria-hidden');
      }
    }
    current.current = poses;
  }, []);
  useIsomorphicLayoutEffect(() => {
    const host = rail.current; if (!host) return;
    const groups = new Map<string, { group: HTMLElement; viewport: HTMLElement; content: HTMLElement; cards: Map<string, HTMLElement> }>();
    for (const group of host.querySelectorAll<HTMLElement>(':scope > .limr-sidebar-cluster')) {
      const viewport = group.firstElementChild as HTMLElement, content = viewport.firstElementChild as HTMLElement;
      groups.set(group.dataset.group!, { group, viewport, content, cards: new Map([...content.children].map(card => [(card as HTMLElement).dataset.occurrence!, card as HTMLElement])) });
    }
    nodes.current = groups;
  }, [membership, rail]);
  useIsomorphicLayoutEffect(() => {
    latest.current = { targets, geometry, gap, focusGroup };
    const host = rail.current; if (!host) return;
    if (previousIntent.current === intent) { if (!frame.current) write(targets); return; }
    previousIntent.current = intent;
    cancelAnimationFrame(frame.current); frame.current = 0;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { delete host.dataset.moving; write(targets); return; }
    const origins = current.current;
    const css = getComputedStyle(host).getPropertyValue('--limr-motion-slow').trim();
    const duration = Math.max(1, (parseFloat(css) || .46) * (css.endsWith('ms') ? 1 : 1000));
    const start = performance.now(); host.dataset.moving = 'true';
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration), eased = 1 - (1 - progress) ** 4;
      const poses = new Map<string, Pose>();
      for (const [id, target] of latest.current.targets) {
        const origin = origins.get(id) ?? target;
        const height = origin.height + (target.height - origin.height) * eased;
        poses.set(id, { top: origin.top + (target.top - origin.top) * eased, height,
          offset: Math.max(0, Math.min(target.contentHeight - height, origin.offset + (target.offset - origin.offset) * eased)) });
      }
      write(poses);
      if (progress < 1) frame.current = requestAnimationFrame(step);
      else { frame.current = 0; delete host.dataset.moving; }
    };
    frame.current = requestAnimationFrame(step);
  }, [targets, geometry, gap, focusGroup, intent, rail, write]);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
}

function useSidebarPlans(items: readonly CollapsibleSidebarItem[], height: number, maxHeight: number, gap: number) {
  const [settled, setSettled] = useState<{ items: readonly CollapsibleSidebarItem[]; height: number; maxHeight: number; gap: number; plans: SidebarClusterPlan[] }>();
  const immediate = useMemo(() => items.length <= 32 ? planSidebarCollapse(items, height, maxHeight, gap) : undefined, [items, height, maxHeight, gap]);
  useEffect(() => {
    if (immediate) return;
    const steps = planSidebarCollapseSteps(items, height, maxHeight, gap);
    let frame = 0, cancelled = false;
    const advance = () => {
      const deadline = performance.now() + 3;
      do {
        const next = steps.next();
        if (next.done) { if (!cancelled) setSettled({ items, height, maxHeight, gap, plans: next.value }); return; }
      } while (performance.now() < deadline);
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [items, height, maxHeight, gap, immediate]);
  return useMemo(() => immediate ?? (settled?.items === items && settled.height === height && settled.maxHeight === maxHeight && settled.gap === gap
    ? settled.plans : reanchorSidebarPlan(settled?.plans ?? [], items, maxHeight, gap)), [immediate, settled, items, height, maxHeight, gap]);
}

export function AdaptiveAnnotationSidebar({ gap = 14, renderCard, className = '', style }: AnnotationSidebarProps) {
  const runtime = useRuntime(), theme = useTheme(), appearance = useAppearance(), locale = useLocale(), document = useDocument();
  const sourceLookup = useMemo(() => createSourceRangeLookup(runtime), [runtime]);
  useEffect(() => () => sourceLookup.dispose(), [sourceLookup]);
  const decorations = useStoreSelector(runtime.decorations, value => value), interaction = useStoreSelector(runtime.interaction, value => value);
  const layout = useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  const viewport = useSyncExternalStore(runtime.viewport.subscribe, runtime.viewport.get, runtime.viewport.get);
  const rail = useRef<HTMLElement>(null), cards = useRef(new Map<string, HTMLDivElement>());
  const [geometry, setGeometry] = useState<Geometry>({ anchors: new Map(), height: 0, viewportHeight: 0, clipTop: 0, clipBottom: 0 });
  const [sizes, setSizes] = useState({ preview: new Map<string, number>(), actual: new Map<string, number>() });
  const measuredSizes = useRef(sizes);
  const [alignment, setAlignment] = useState<string | null>(null), aligned = useRef(alignment), pinned = useRef<string | null>(null);
  aligned.current = alignment;
  const focused = interaction.hovered ?? interaction.active;
  useIsomorphicLayoutEffect(() => {
    if (interaction.active && (interaction.activeSource === 'marker' || interaction.active === aligned.current)) pinned.current = interaction.active;
    else if (pinned.current !== interaction.active) pinned.current = null;
    if (interaction.hovered && interaction.hoverSource === 'marker') { setAlignment(interaction.hovered); return; }
    if (interaction.hoverSource === 'sidebar' && interaction.hovered === aligned.current) return;
    if (pinned.current) { setAlignment(pinned.current); return; }
    // Allow the pointer to cross from a marker to its revealed card. Leaving
    // that card restores the original window unless a click pinned a card.
    const timer = setTimeout(() => setAlignment(null), 140); return () => clearTimeout(timer);
  }, [interaction.hovered, interaction.hoverSource, interaction.active, interaction.activeSource]);
  useIsomorphicLayoutEffect(() => {
    const element = rail.current; if (!element) return;
    const top = element.getBoundingClientRect().top, anchors = new Map<string, number>();
    const parked = new Set<string>(), interaction = runtime.interaction.get();
    sourceLookup.withPass(() => {
    for (const occurrence of decorations.occurrences) {
      const marker = runtime.anchors.get(occurrence.id);
      if (!marker || marker.closest('[inert]')) continue;
      if (marker.closest('[data-window-parked]')) {
        if (interaction.active === occurrence.id || interaction.hovered === occurrence.id || interaction.toolbarOccurrence === occurrence.id || interaction.editing && occurrence.annotationIds.includes(interaction.editing)) parked.add(occurrence.id);
        continue;
      }
      const rect = sourceLookup.startRect(decorations.referenceRanges.get(occurrence.id) ?? occurrence.range) ?? marker.getBoundingClientRect();
      anchors.set(occurrence.id, Math.max(0, rect.top - top));
    }
    });
    setGeometry(old => {
      // Kept-alive editors/media live outside the physical reading window.
      // Their artificial parking position must never become a card anchor.
      const next = parked.size ? new Map(anchors) : anchors;
      for (const id of parked) if (old.anchors.has(id)) next.set(id, old.anchors.get(id)!);
      return sameSizes(old.anchors, next) ? old : { ...old, anchors: next };
    });
  }, [runtime, sourceLookup, decorations, layout]);
  useIsomorphicLayoutEffect(() => {
    const element = rail.current; if (!element) return;
    const bounds = element.getBoundingClientRect(), root = runtime.configuration.get().scrollRoot, rootBounds = root?.getBoundingClientRect();
    const screenTop = window.visualViewport?.offsetTop ?? 0, screenHeight = window.visualViewport?.height ?? innerHeight;
    const clipTop = Math.max(0, Math.max(screenTop, rootBounds ? rootBounds.top + root!.clientTop : 0) - bounds.top);
    const clipBottom = Math.max(clipTop, Math.min(bounds.height, Math.min(screenTop + screenHeight, rootBounds ? rootBounds.top + root!.clientTop + root!.clientHeight : Infinity) - bounds.top));
    const viewportHeight = Math.min(screenHeight, root?.clientHeight ?? Infinity);
    setGeometry(old => old.height === bounds.height && old.viewportHeight === viewportHeight && old.clipTop === clipTop && old.clipBottom === clipBottom ? old : { ...old, height: bounds.height, viewportHeight, clipTop, clipBottom });
  }, [runtime, layout, viewport]);
  const measure = useCallback((entries?: readonly ResizeObserverEntry[]) => {
    const old = measuredSizes.current, actual = new Map(old.actual), preview = new Map(old.preview);
    const changed = entries ? new Set(entries.flatMap(entry => {
      const card = (entry.target as HTMLElement).closest<HTMLElement>('.limr-sidebar-card'); return card ? [card] : [];
    })) : new Set(cards.current.values());
    for (const id of actual.keys()) if (!cards.current.has(id)) { actual.delete(id); preview.delete(id); }
    changed.forEach(element => {
      const id = element.dataset.occurrence!;
      if (cards.current.get(id) !== element) return;
      actual.set(id, element.getBoundingClientRect().height);
      const body = element.querySelector<HTMLElement>(':scope > .limr-sidebar-card-body');
      if (!body) { preview.set(id, element.getBoundingClientRect().height); return; }
      const css = getComputedStyle(body), reference = element.querySelector<HTMLElement>('.limr-sidebar-reference');
      const heading = body.querySelector<HTMLElement>('.limr-sidebar-card-heading'), summary = body.querySelector<HTMLElement>('.limr-sidebar-preview');
      const summaryHeight = summary?.getBoundingClientRect().height ?? 0;
      preview.set(id, (reference ? reference.getBoundingClientRect().height + (parseFloat(getComputedStyle(reference).marginBottom) || 0) : 0)
        + (heading?.getBoundingClientRect().height ?? 0) + parseFloat(css.paddingTop) + parseFloat(css.paddingBottom)
        + summaryHeight + (summaryHeight && summary ? parseFloat(getComputedStyle(summary).marginTop) || 0 : 0));
    });
    const samePreview = sameSizes(old.preview, preview);
    if (sameSizes(old.actual, actual) && samePreview) return;
    const next = { actual, preview: samePreview ? old.preview : preview };
    measuredSizes.current = next; setSizes(next);
  }, []);
  const items = useMemo(() => decorations.occurrences.filter(item => geometry.anchors.has(item.id)).map(item => ({ id: item.id, anchorTop: geometry.anchors.get(item.id)!, height: sizes.preview.get(item.id) ?? 110 })).sort((a, b) => a.anchorTop - b.anchorTop), [decorations.occurrences, geometry.anchors, sizes.preview]);
  const plans = useSidebarPlans(items, geometry.height, Math.min(460, geometry.viewportHeight * .55), gap);
  const membership = plans.map(group => group.items.map(item => item.id).join(',')).join('|');
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    cards.current.forEach(element => { observer.observe(element); element.querySelectorAll('.limr-sidebar-preview,.limr-sidebar-reference').forEach(child => observer.observe(child)); });
    measure(); return () => observer.disconnect();
  }, [membership, decorations, measure]);
  useEffect(() => {
    runtime.documentOffset.set(0);
    const observer = new ResizeObserver(() => runtime.requestLayout()); if (rail.current) observer.observe(rail.current);
    const dismiss = (event: PointerEvent) => {
      if (event.button !== 0 || !(event.target instanceof Element) || rail.current?.contains(event.target) || event.target.closest('.limr-selection-toolbar,.limr-overlay-positioner') || isOwnedImagePreview(event.target, rail.current)) return;
      const marker = event.target.closest<HTMLElement>('[data-limr-anchor]');
      if (marker && runtime.anchors.get(marker.dataset.limrAnchor!) === marker) return;
      runtime.activate(null); setAlignment(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      const active = runtime.interaction.get().active;
      if (active) { runtime.anchors.get(active)?.focus({ preventScroll: true }); runtime.activate(null); }
      setAlignment(null);
    };
    window.document.addEventListener('pointerdown', dismiss); window.document.addEventListener('keydown', escape);
    return () => { observer.disconnect(); window.document.removeEventListener('pointerdown', dismiss); window.document.removeEventListener('keydown', escape); };
  }, [runtime]);
  const { targets, focusGroup } = useMemo(() => {
    const targets = new Map<string, Target>();
    let focusGroup: string | undefined;
    const boxes = plans.map(plan => {
    let contentHeight = 0, selectedTop = 0, selectedHeight = 0;
    const cardPositions = plan.items.map(item => {
      const height = sizes.actual.get(item.id) ?? item.height, top = contentHeight;
      if (item.id === alignment) { selectedTop = top; selectedHeight = height; }
      contentHeight += height + gap;
      return { id: item.id, top, height };
    });
    contentHeight = Math.max(0, contentHeight - gap);
    const isFocused = plan.items.some(item => item.id === alignment);
    if (isFocused) focusGroup = plan.id;
    const cap = Math.min(600, geometry.viewportHeight * .72, geometry.height);
    let height = plan.folded ? Math.min(contentHeight, Math.max(plan.height, isFocused ? Math.min(cap, selectedHeight + 24) : 0)) : Math.min(contentHeight, cap);
    if (plan.folded && !isFocused) height = foldWindowHeight(cardPositions, height, gap);
    let top = plan.anchorTop, offset = 0;
    if (isFocused && alignment) {
      const anchor = geometry.anchors.get(alignment) ?? top, inset = selectedTop > 0 ? 24 : 0;
      // The tail window shrinks to real remaining content. No scroll padding
      // or empty spacer is needed to align a late card with its marker.
      height = Math.min(height, contentHeight - selectedTop + inset);
      const desiredTop = Math.max(0, plan.anchorTop - inset, Math.min(anchor - inset, plan.items.at(-1)!.anchorTop + selectedHeight - height));
      offset = Math.max(0, Math.min(contentHeight - height, selectedTop - (anchor - desiredTop)));
      top = anchor - selectedTop + offset;
    }
    const cutCard = cardPositions.find(card => card.top < height && card.top + card.height > height);
    const bottomFade = plan.folded && !isFocused && cutCard ? Math.max(24, cutCard.height * .5) : 24;
    targets.set(plan.id, { top, height, offset, contentHeight, bottomFade, cards: cardPositions });
    return { id: plan.id, anchorTop: top, height, weight: isFocused ? 10000 : 1 };
    });
    const positions = fitSidebarBoxes(boxes, gap, geometry.height, focusGroup);
    for (const [id, target] of targets) target.top = positions.get(id)!;
    return { targets, focusGroup };
  }, [plans, sizes.actual, alignment, geometry.anchors, geometry.height, geometry.viewportHeight, gap]);
  useSidebarMotion(rail, targets, membership, `${alignment ?? ''}:${interaction.active ?? ''}:${membership}`, geometry, gap, focusGroup);
  const activate = useCallback((id: string) => {
    const state = runtime.interaction.get(); runtime.activate(state.active === id ? null : id, 'sidebar');
    if (cards.current.get(id)?.matches(':hover')) runtime.hover(id, 'sidebar');
  }, [runtime]);
  const referenceText = useMemo(() => createAnnotationReferenceReader(document), [document]);
  const annotationGroups = useMemo(() => new Map(decorations.occurrences.map(item => [item.id, item.annotationIds.flatMap(id => { const annotation = decorations.annotations.get(id); return annotation ? [annotation] : []; })])), [decorations]);
  const occurrences = useMemo(() => new Map(decorations.occurrences.map(item => [item.id, item])), [decorations.occurrences]);
  const renderItem = useCallback((occurrence: AnnotationOccurrence) => {
    const id = occurrence.id, annotation = decorations.annotations.get(occurrence.annotationIds[0]);
    const definition = runtime.annotationTypes.get(annotation?.type ?? 'citation'), palette = definition?.sidebar;
    const active = interaction.active === id;
    const cardStyle = {
      [renderCard ? '--limr-sidebar-card-height' : '--limr-sidebar-layout-height']: `${Math.max(80, Math.min(560, geometry.viewportHeight * .65, geometry.height))}px`,
      '--limr-annotation-color': palette?.color ?? definition?.color, '--limr-annotation-border': palette?.borderColor,
      '--limr-annotation-title': palette?.titleColor, '--limr-annotation-text': palette?.textColor, '--limr-annotation-excerpt': palette?.excerptColor,
      '--limr-annotation-preview': palette?.previewColor, '--limr-sidebar-preview-lines': String(Math.max(1, Math.floor(palette?.previewLines ?? 2))),
    } as CSSProperties;
    return <div key={id} ref={element => { if (element) cards.current.set(id, element); else cards.current.delete(id); }} className="limr-sidebar-card"
      data-occurrence={id} data-type={annotation?.type} data-default-card={!renderCard || undefined} data-citations={annotation?.type === 'citation' || undefined} data-active={focused === id || undefined} data-expanded={active || undefined} style={cardStyle}
      onPointerEnter={event => { if (event.pointerType !== 'touch') runtime.hover(id, 'sidebar'); }}
      onPointerLeave={() => { if (runtime.interaction.get().hovered === id && runtime.interaction.get().hoverSource === 'sidebar') runtime.hover(null); }}
      onFocus={event => { if (!event.currentTarget.contains(event.relatedTarget)) runtime.hover(id, 'sidebar'); }}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && runtime.interaction.get().hovered === id) runtime.hover(null); }}
      onClick={event => { if ((!active || definition?.sidebar?.collapseOnContentClick) && !renderCard && !event.defaultPrevented && !(event.target as Element).closest('button,a,input,textarea,select,summary,[role="button"],[contenteditable],[data-limr-card-interactive]') && window.getSelection()?.isCollapsed !== false) activate(id); }}>
      {renderCard ? renderCard({ occurrence, active, activate: () => activate(id) }) : <SidebarCardBody occurrence={occurrence} annotation={annotation} annotations={annotationGroups.get(id)!}
        reference={referenceText(occurrence)} point={decorations.referenceRanges.get(id)?.start === decorations.referenceRanges.get(id)?.end} active={active}
        title={definition?.label ?? annotation?.type ?? locale.annotations} toggleLabel={active ? locale.collapse : locale.expand} Preview={palette?.Preview} activate={activate} />}
    </div>;
  }, [runtime, decorations, interaction.active, focused, geometry.viewportHeight, geometry.height, renderCard, annotationGroups, referenceText, locale.annotations, locale.collapse, locale.expand, activate]);
  const content = useMemo(() => plans.map(plan => <section key={plan.id} className="limr-sidebar-cluster" data-group={plan.id} data-collapsible={plan.folded || undefined}>
      <div className="limr-sidebar-cluster-list"><div className="limr-sidebar-cluster-items" style={{ gap }}>
        {plan.items.map(item => renderItem(occurrences.get(item.id)!))}
      </div></div>
    </section>), [plans, gap, renderItem, occurrences]);
  return <aside ref={rail} className={`limr-sidebar ${className}`} aria-label={locale.annotations} data-sync="document" data-collapse-overflow="true" data-limr-theme={theme} data-limr-appearance={appearance} style={style}>
    {content}
  </aside>;
}
