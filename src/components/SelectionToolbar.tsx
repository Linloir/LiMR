import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { autoUpdate, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import { defaultHighlight, resolveAnnotationAnchors, sameRange, selectionFromRange, type Annotation, type HighlightData } from '../core';
import { copyText, deleteAnnotations, highlightPalette, highlightSelection } from '../extensions/actions';
import { useAppearance, useRuntime, useSelection, useStoreSelector, useTheme } from '../react/context';
import type { ActionContext, SelectionAction, StyledProps, ToolbarActionContext } from '../react/types';
import { annotationReferenceText } from './annotation-reference';
import { OverlayScrollArea } from './OverlayScrollArea';
import { Collapse } from './Collapse';
import { atomicSelectionText } from '../react/source-geometry';
import { ToolFaces } from './ToolFaces';

export interface SelectionToolbarProps extends StyledProps {
  /** Replaces the built-in actions. Extension actions are added. */
  actions?: readonly SelectionAction[];
  portalRoot?: HTMLElement | null;
  /** Maximum panel body height in pixels; plugins inherit the available space. */
  maxPanelHeight?: number;
  render?: (props: { context: ActionContext; actions: readonly SelectionAction[]; run: (action: SelectionAction) => Promise<void> }) => ReactNode;
}
const defaults = [highlightPalette(), highlightSelection(), copyText(), deleteAnnotations()];

export function SelectionToolbar({ actions, portalRoot, maxPanelHeight = 260, className = '', style, render }: SelectionToolbarProps) {
  const runtime = useRuntime();
  const appearance = useAppearance(), theme = useTheme();
  const selection = useSelection();
  const interaction = useStoreSelector(runtime.interaction, value => value);
  const decorations = useStoreSelector(runtime.decorations, value => value);
  const config = useStoreSelector(runtime.configuration, value => value);
  const paint = interaction.activeHighlight ? decorations.highlights.get(interaction.activeHighlight) : null;
  const active = decorations.occurrences.find(item => item.id === interaction.active);
  const hiddenActive = active && [...decorations.highlights.values()].some(item => item.hidden && sameRange(item.range, active.range));
  const combined = useMemo(() => {
    const map = new Map((actions ?? defaults).map(action => [action.id, action]));
    config.extensions?.forEach(extension => extension.actions?.forEach(action => map.set(action.id, action)));
    actions?.forEach(action => map.set(action.id, action));
    const order = (action: SelectionAction) => action.placement === 'start' ? -1 : action.placement === 'end' ? 1 : 0;
    return [...map.values()].sort((a, b) => order(a) - order(b));
  }, [config.extensions, actions]);
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteHintOpen, setDeleteHintOpen] = useState(false);
  const [preferredHighlight, setPreferredHighlight] = useState<HighlightData>(defaultHighlight);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const successTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const panelId = useId();
  const documentSnapshot = runtime.document.getSnapshot();
  const effectiveSelection = useMemo(() => {
    if (selection) return selection;
    // Dismissed annotations can retain their edit state for later resumption.
    // Only the active annotation's editor suppresses highlight actions.
    if (interaction.editing && active?.annotationIds.includes(interaction.editing)) return null;
    const range = paint?.range ?? (hiddenActive ? active?.range : undefined);
    return range ? selectionFromRange(documentSnapshot, range, {
      text: atomicSelectionText(runtime, [range]) ?? (paint ? runtime.highlightReference?.text ?? annotationReferenceText(documentSnapshot, { id: paint.id, annotationIds: [], range }) : annotationReferenceText(documentSnapshot, active!)),
    }) : null;
  }, [documentSnapshot, paint, active, selection, interaction.editing, hiddenActive]);
  const blockReference = useMemo(() => {
    const ranges = effectiveSelection?.raw.ranges;
    if (ranges?.length !== 1) return null;
    const { start, end } = ranges[0];
    // Atomic source selection can start in one tiny SVG label or math glyph.
    // Anchor to the whole block, including when reopening its saved highlight.
    return runtime.content?.querySelector<HTMLElement>(`[data-limr-atomic="block"][data-source-start="${start}"][data-source-end="${end}"]`) ?? null;
  }, [runtime, effectiveSelection]);
  const annotations = useMemo(() => effectiveSelection ? [...decorations.annotations.values()].filter(annotation =>
    runtime.supportsAnnotation(annotation) && resolveAnnotationAnchors(annotation, documentSnapshot).some(anchor => [...effectiveSelection.raw.ranges, ...effectiveSelection.syntax.ranges].some(range => sameRange(anchor.range, range)))) : [], [runtime, decorations, effectiveSelection, documentSnapshot]);
  const highlight = (paint ? decorations.annotations.get(paint.annotationId) : annotations.find(annotation => annotation.type === 'highlight')) as Annotation<HighlightData> | undefined;
  const highlightAppearance = highlight?.data ?? preferredHighlight;
  const context: ActionContext | null = effectiveSelection ? {
    ...runtime.commands, selection: effectiveSelection, annotations, highlight: highlight ?? null, locale: runtime.locale,
    addAnnotation: (annotation, options) => runtime.commands.addAnnotation(annotation, { highlight: highlightAppearance, ...options }),
    document: documentSnapshot, signal: runtime.signal, clearSelection: () => runtime.clearSelection(),
  } : null;
  const readOnly = highlight?.data?.readOnly === true && !runtime.commands.canEditAnnotation(highlight.id);
  const available = context ? readOnly ? [defaults[2]] : combined.filter(action => action.visible?.(context) ?? true) : [];
  const expandedAction = available.find(action => action.id === expanded && action.renderExpanded);
  const hasPanels = available.some(action => action.renderExpanded);
  const open = !!context && effectiveSelection!.settled && available.length > 0;
  const { refs, floatingStyles, placement, isPositioned } = useFloating({
    open, strategy: 'fixed', placement: 'bottom',
    middleware: [offset(10), { name: 'toolbarSpace', options: { hasPanels, maxPanelHeight, blockReference }, fn({ rects, placement, elements }) {
      const viewport = window.visualViewport;
      const root = runtime.configuration.get().scrollRoot?.getBoundingClientRect();
      const top = Math.max(viewport?.offsetTop ?? 0, root?.top ?? 0);
      const bottom = Math.min((viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight), root?.bottom ?? Infinity);
      const above = Math.max(0, rects.reference.y - top - 20), below = Math.max(0, bottom - rects.reference.y - rects.reference.height - 20);
      const row = (elements.floating.querySelector('.limr-toolbar-actions')?.getBoundingClientRect().height ?? 34) + (elements.floating.querySelector('.limr-toolbar-delete-hint,.limr-toolbar-readonly-hint')?.getBoundingClientRect().height ?? 0);
      const limit = Math.max(0, parseFloat(getComputedStyle(elements.floating).getPropertyValue('--limr-toolbar-panel-max-height')) || maxPanelHeight);
      const needed = row + (hasPanels ? limit : 0) + 24;
      // Reserve the same budget while closed or expanded, so hover never moves the action row.
      const next = blockReference || below >= needed || below >= above ? 'bottom' : 'top';
      const room = next === 'bottom' ? below : above;
      elements.floating.style.setProperty('--limr-toolbar-panel-height', `${Math.max(0, Math.min(limit, room - row - 24))}px`);
      elements.floating.style.setProperty('--limr-toolbar-available-height', `${room}px`);
      return placement !== next ? { reset: { placement: next } } : {};
    } }, shift({ padding: 10 })], whileElementsMounted: autoUpdate,
  });
  useEffect(() => {
    const reference = blockReference ?? (selection ? runtime.selectionRange : paint ? runtime.highlightReference : active ? runtime.anchors.get(active.id) : null);
    if (reference) refs.setPositionReference({ getBoundingClientRect: () => reference.getBoundingClientRect(), getClientRects: () => reference.getClientRects(), contextElement: blockReference ?? runtime.content ?? undefined });
  }, [runtime, refs, blockReference, selection, paint, active]);
  const selectionKey = effectiveSelection?.raw.ranges.map(range => `${range.start}-${range.end}`).join(',') ?? '';
  useEffect(() => { setError(null); setExpanded(null); setSuccess(null); setDeleteHintOpen(false); clearTimeout(closeTimer.current); clearTimeout(successTimer.current); }, [selectionKey, open]);
  useEffect(() => () => { clearTimeout(closeTimer.current); clearTimeout(successTimer.current); }, []);
  const dismiss = () => { runtime.clearSelection(); runtime.activate(null); };
  useEffect(() => {
    if (!open) return;
    const down = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[data-limr-selection-ui],.limr-sidebar-card,.limr-overlay-positioner,[data-limr-anchor]')) return;
      if (runtime.interaction.get().activeHighlight) runtime.clearSelection();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      if (expanded) {
        setExpanded(null);
        refs.floating.current?.querySelector<HTMLButtonElement>(`[data-action-id="${CSS.escape(expanded)}"] button`)?.focus();
      } else dismiss();
      event.preventDefault();
    };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open, expanded, runtime, refs]);
  const expand = (id: string) => { clearTimeout(closeTimer.current); setExpanded(id); };
  const execute = async (action: SelectionAction, operation: () => void | Promise<void>) => {
    if (!context || busyRef.current || action.disabled?.(context)) return;
    busyRef.current = true; setBusy(action.id); setError(null);
    try { await operation(); }
    catch (cause) { if (!runtime.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { busyRef.current = false; if (!runtime.signal.aborted) setBusy(null); }
  };
  const actionContext = (action: SelectionAction): ToolbarActionContext => ({
    ...context!, busy: !!busy, expanded: expanded === action.id, highlightAppearance, setHighlightAppearance: setPreferredHighlight,
    expand: () => expand(action.id), collapse: () => setExpanded(null),
    run: operation => execute(action, () => operation(context!)),
  });
  const run = (action: SelectionAction) => execute(action, async () => {
    if (action.run) await action.run(actionContext(action));
    else if (action.renderExpanded) expanded === action.id ? setExpanded(null) : expand(action.id);
    if (action.successLabel && !runtime.signal.aborted) {
      setSuccess(action.id); clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(null), 2400);
    }
  });
  if (!open || !context) return null;
  const label = (action: SelectionAction) => {
    const value = success === action.id && action.successLabel ? action.successLabel : action.label;
    return typeof value === 'function' ? value(context) : value;
  };
  const annotationCount = annotations.filter(annotation => annotation.type !== 'highlight').length;
  const hint = available.some(action => action.id === 'delete-annotations') && annotationCount > 1 ? context.locale.deleteAnnotationsHint.replace('{count}', String(annotationCount)) : null;
  return <FloatingPortal root={portalRoot}><div ref={refs.setFloating} className={`limr-selection-toolbar ${className}`} style={{ ...style, ...floatingStyles, visibility: isPositioned ? undefined : 'hidden' }} role="toolbar" aria-label="Text actions" data-limr-selection-ui="true" data-limr-theme={theme} data-limr-appearance={appearance} data-placement={placement} data-highlight={highlight?.id} data-readonly={readOnly || undefined} data-expanded={expandedAction?.id}
    onMouseDown={event => { if (!(event.target instanceof Element) || !event.target.closest('input,textarea,select,[contenteditable]')) event.preventDefault(); }}
    onPointerEnter={() => clearTimeout(closeTimer.current)}
    onPointerLeave={event => {
      if (event.pointerType !== 'mouse' || event.currentTarget.contains(document.activeElement)) return;
      closeTimer.current = setTimeout(() => setExpanded(null), 200);
    }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) setExpanded(null); }}
    onKeyDown={event => {
      if (event.target instanceof Element && event.target.closest('.limr-toolbar-panel')) return;
      if (!['ArrowRight', 'ArrowLeft', 'Home', 'End', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const id = (event.target as Element).closest<HTMLElement>('[data-action-id]')?.dataset.actionId;
        const action = available.find(item => item.id === id);
        if (action?.renderExpanded) { expand(action.id); requestAnimationFrame(() => refs.floating.current?.querySelector<HTMLElement>('.limr-toolbar-panel button,.limr-toolbar-panel input,.limr-toolbar-panel textarea')?.focus()); }
      } else {
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('.limr-toolbar-actions button:not(:disabled)'));
        const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
        const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
        buttons[index]?.focus();
      }
      event.preventDefault();
    }}>
    <div className="limr-toolbar-surface" key={selectionKey} data-ready={isPositioned || undefined}>
      <div className="limr-toolbar-actions">{render && !readOnly ? render({ context, actions: available, run }) : available.map((action, index) => <div className="limr-toolbar-item" key={action.id} data-action-id={action.id} data-active={expanded === action.id || undefined} data-tone={action.tone} data-status={success === action.id ? 'success' : undefined} style={{ '--limr-tool-index': index } as CSSProperties}
        onPointerEnter={event => {
          if (event.pointerType !== 'mouse' || busy || action.disabled?.(context)) return;
          if (expandedAction && expandedAction.id !== action.id && refs.floating.current?.querySelector('.limr-toolbar-panel')?.contains(document.activeElement)) return;
          clearTimeout(closeTimer.current);
          if (action.renderExpanded) expand(action.id); else setExpanded(null);
          try { action.onHover?.(actionContext(action)); }
          catch (cause) { setError(cause instanceof Error ? cause.message : String(cause)); }
        }}>
        {action.render ? action.render(actionContext(action)) : <button className="limr-toolbar-action" type="button" disabled={!!busy || action.disabled?.(context)} onClick={() => void run(action)} aria-label={label(action)} aria-busy={busy === action.id} aria-expanded={action.renderExpanded ? expanded === action.id : undefined} aria-controls={action.renderExpanded && expanded === action.id ? panelId : undefined}
          aria-describedby={action.id === 'delete-annotations' && hint && deleteHintOpen ? `${panelId}-delete` : undefined}
          onPointerEnter={event => { if (action.id === 'delete-annotations' && event.pointerType !== 'touch') setDeleteHintOpen(true); }}
          onPointerLeave={event => { if (action.id === 'delete-annotations') setDeleteHintOpen(event.currentTarget.matches(':focus-visible')); }}
          onFocus={event => { if (action.id === 'delete-annotations' && event.currentTarget.matches(':focus-visible')) setDeleteHintOpen(true); }}
          onBlur={event => { if (action.id === 'delete-annotations' && !event.currentTarget.matches(':hover')) setDeleteHintOpen(false); }}>
          <ToolFaces state={label(action)}><span className="limr-tool-face" data-visible={success !== action.id || undefined} aria-hidden="true">
            <span className="limr-tool-icon" key={typeof action.label === 'function' ? action.label(context) : action.label}>{typeof action.icon === 'function' ? action.icon(context) : action.icon}</span><span className="limr-tool-label limr-underline">{typeof action.label === 'function' ? action.label(context) : action.label}</span>
          </span>
          {action.successLabel && <span className="limr-tool-face" data-visible={success === action.id || undefined} aria-hidden="true">
            <span className="limr-tool-icon">{action.successIcon ?? (typeof action.icon === 'function' ? action.icon(context) : action.icon)}</span><span className="limr-tool-label limr-underline">{typeof action.successLabel === 'function' ? action.successLabel(context) : action.successLabel}</span>
          </span>}</ToolFaces>
        </button>}
      </div>)}</div>
      {readOnly && <p className="limr-toolbar-readonly-hint">{context.locale.inlineHighlightHint ?? 'Markdown inline highlight, editing unavailable'}</p>}
      {expandedAction && <div id={panelId} className="limr-toolbar-panel" key={expandedAction.id} role="group" aria-label={label(expandedAction)}><OverlayScrollArea active label={label(expandedAction)}>{expandedAction.renderExpanded!(actionContext(expandedAction))}</OverlayScrollArea></div>}
      {hint && <Collapse open={deleteHintOpen} keepMounted className="limr-toolbar-delete-warning"><p id={`${panelId}-delete`} className="limr-toolbar-delete-hint">{hint}</p></Collapse>}
      {error && <span role="alert" className="limr-action-error">{error}</span>}
    </div>
  </div></FloatingPortal>;
}
