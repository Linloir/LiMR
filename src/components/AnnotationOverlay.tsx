import { useEffect, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { autoUpdate, flip, FloatingFocusManager, FloatingOverlay, FloatingPortal, offset, shift, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';
import { useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import { AnnotationGroup } from './AnnotationContent';

export interface AnnotationOverlayProps { disabled?: boolean; portalRoot?: HTMLElement | null; previewWidth?: number; maxHeight?: string }
export function AnnotationOverlay({ disabled = false, portalRoot, previewWidth = 340, maxHeight = '80dvh' }: AnnotationOverlayProps) {
  const runtime = useRuntime();
  const theme = useTheme(), locale = useLocale();
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered);
  const occurrences = useStoreSelector(runtime.decorations, state => state.occurrences);
  useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  const [preview, setPreview] = useState<string | null>(null);
  const [viewportTick, setViewportTick] = useState(0);
  useEffect(() => {
    if (hovered) { setPreview(hovered); return; }
    const timer = setTimeout(() => setPreview(null), 180);
    return () => clearTimeout(timer);
  }, [hovered]);
  useEffect(() => {
    const update = () => setViewportTick(value => value + 1);
    window.visualViewport?.addEventListener('resize', update);
    window.visualViewport?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => { window.visualViewport?.removeEventListener('resize', update); window.visualViewport?.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  const id = active ?? preview;
  const occurrence = occurrences.find(item => item.id === id);
  const expanded = active !== null;
  const open = !!occurrence && !disabled;
  const close = () => { runtime.activate(null); runtime.hover(null); setPreview(null); };
  const { refs, floatingStyles, context } = useFloating({ open, onOpenChange: next => { if (!next) close(); }, strategy: 'fixed', placement: 'bottom-start', whileElementsMounted: autoUpdate, middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })] });
  useEffect(() => { refs.setReference(id ? runtime.anchors.get(id) ?? null : null); }, [id, runtime, refs, open]);
  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const role = useRole(context, { role: 'dialog' });
  const { getFloatingProps } = useInteractions([dismiss, role]);
  if (!open || !occurrence) return null;
  const content = runtime.content?.getBoundingClientRect();
  const visual = window.visualViewport;
  const availableWidth = visual?.width ?? window.innerWidth;
  const availableHeight = visual?.height ?? window.innerHeight;
  const width = Math.min(expanded ? content?.width ?? 680 : previewWidth, availableWidth - 24);
  const left = Math.max((visual?.offsetLeft ?? 0) + 12, Math.min(content?.left ?? 12, (visual?.offsetLeft ?? 0) + availableWidth - width - 12));
  const insetTop = Math.max(12, availableHeight * .1);
  const heightLimit = Math.max(0, availableHeight - insetTop - 12);
  const style: CSSProperties = expanded ? { position: 'fixed', left, top: (visual?.offsetTop ?? 0) + insetTop, width, minHeight: Math.min(320, availableHeight * .4, heightLimit), maxHeight: `min(${maxHeight}, ${heightLimit}px)`, transform: 'none' } : { ...floatingStyles, width, maxHeight: Math.min(360, availableHeight - 24) };
  const card = <FloatingFocusManager context={context} modal={expanded} disabled={!expanded} returnFocus>
    <div ref={refs.setFloating} {...getFloatingProps()} className={`limr-annotation-overlay ${expanded ? 'limr-annotation-expanded' : 'limr-annotation-preview'}`} style={style} data-limr-theme={theme}
      onPointerEnter={() => { if (!expanded) runtime.hover(occurrence.id); }} onPointerLeave={() => { if (!expanded) runtime.hover(null); }}>
      <div className="limr-overlay-header"><span>{locale.annotations}</span>{expanded ? <button type="button" onClick={close} aria-label={locale.close}>×</button> : <button type="button" onClick={() => runtime.activate(occurrence.id)}>{locale.expand}</button>}</div>
      <div className="limr-overlay-content"><AnnotationGroup occurrence={occurrence} presentation={expanded ? 'expanded' : 'preview'} expanded={expanded} /></div>
    </div>
  </FloatingFocusManager>;
  return <FloatingPortal root={portalRoot}>{expanded ? <FloatingOverlay className="limr-backdrop" lockScroll>{card}</FloatingOverlay> : card}</FloatingPortal>;
}
