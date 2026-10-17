import { useCallback, useContext, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { safeUrl } from '../core';
import { RuntimeContext, useIsomorphicLayoutEffect, useStoreSelector } from '../react/context';
import type { LiMRLocale, ViewConfiguration } from '../react/types';
import { CopyGlyph } from './CopyButton';
import { ToolIcon } from './ToolIcon';
import { registerImagePreview } from './image-preview-behavior';

export interface ImagePreviewSource {
  /** A browser-readable URL, after any resource resolution performed by the host. */
  src: string;
  alt?: string;
  width: number;
  height: number;
  /** Optional originating image, used for the hero transition and focus return. */
  element?: HTMLImageElement;
}
export interface ImagePreviewProps {
  image: ImagePreviewSource | null;
  onClose: () => void;
  locale?: Partial<LiMRLocale>;
  theme?: ViewConfiguration['theme'];
  appearance?: string;
  className?: string;
  style?: CSSProperties;
}

const emptyConfiguration: ViewConfiguration = {};
const noReader = { get: () => emptyConfiguration, subscribe: (_listener: () => void) => () => {} };
export function useImageLocale(): Partial<LiMRLocale> {
  const runtime = useContext(RuntimeContext);
  return useStoreSelector(runtime?.configuration ?? noReader, config => config.locale) ?? {};
}
export function imagePreviewLabels(locale: Partial<LiMRLocale>) {
  const zh = locale.language?.startsWith('zh');
  return {
    open: locale.previewImage ?? (zh ? '预览图片' : 'Preview image'),
    title: locale.imagePreview ?? (zh ? '图片预览' : 'Image preview'),
    close: locale.closeImagePreview ?? (zh ? '关闭图片预览' : 'Close image preview'),
    fit: locale.imageFit ?? (zh ? '适应窗口' : 'Fit to window'),
    actual: locale.imageActualSize ?? (zh ? '原始大小' : 'Actual size'),
    fill: locale.imageFill ?? (zh ? '铺满窗口' : 'Fill window'),
    zoomIn: locale.imageZoomIn ?? (zh ? '放大' : 'Zoom in'),
    zoomOut: locale.imageZoomOut ?? (zh ? '缩小' : 'Zoom out'),
    copy: locale.imageCopy ?? (zh ? '复制图片' : 'Copy image'),
    copied: locale.copied ?? (zh ? '已复制' : 'Copied'),
    copyFailed: locale.copyFailed ?? (zh ? '复制失败' : 'Copy failed'),
  };
}

type SizeMode = 'fit' | 'actual' | 'fill' | 'custom';
const ease = 'cubic-bezier(.16, 1, .3, 1)';
const originKeys = new WeakMap<HTMLImageElement, number>();
let nextOriginKey = 1;
const transformBetween = (from: DOMRect, to: DOMRect) => `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
function originRect(source: HTMLImageElement | undefined): DOMRect | undefined {
  if (!source?.isConnected) return;
  const rect = source.getBoundingClientRect(), view = source.ownerDocument.defaultView!;
  if (rect.width && rect.height && rect.bottom > 0 && rect.right > 0 && rect.top < view.innerHeight && rect.left < view.innerWidth) return rect;
}

/** A controlled image dialog, also usable outside a Reader. Resource URL
 * resolution remains the embedding host's job. Copying pixels requires a
 * clipboard-capable browser and a same-origin or CORS-readable image. */
export function ImagePreview({ image, ...props }: ImagePreviewProps) {
  if (!image || !safeUrl(image.src, true) || typeof document === 'undefined') return null;
  if (image.element && !originKeys.has(image.element)) originKeys.set(image.element, nextOriginKey++);
  return <OpenImagePreview key={`${image.src}:${image.width}:${image.height}:${image.element ? originKeys.get(image.element) : ''}`} image={image} {...props} />;
}

function SizeIcon({ mode }: { mode: SizeMode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/* These layers share the copy glyph's outgoing shrink/turn and delayed
        incoming spring, so size changes and copy confirmation feel identical. */}
    <g className="limr-image-mode-glyph" data-active={mode === 'fit' || mode === 'custom'}><rect x="4" y="6" width="16" height="12" rx="3" /><path d="M8 9v6m8-6v6M10.5 12h3" /></g>
    <g className="limr-image-mode-glyph" data-active={mode === 'actual'}><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="m7 10 1.5-1v6m7-5 1.5-1v6M12 10.5h.01M12 13.5h.01" /></g>
    <g className="limr-image-mode-glyph" data-active={mode === 'fill'}><path d="M8 4H6a2 2 0 0 0-2 2v2m12-4h2a2 2 0 0 1 2 2v2M4 16v2a2 2 0 0 0 2 2h2m8 0h2a2 2 0 0 0 2-2v-2M9 9l-4-4m10 4 4-4M9 15l-4 4m10-4 4 4" /></g>
  </svg>;
}

async function imagePng(image: ImagePreviewSource): Promise<Blob> {
  const response = await fetch(image.src);
  if (!response.ok) throw new Error('Image unavailable');
  const blob = await response.blob();
  if (blob.type === 'image/png') return blob;
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
    const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
    context.drawImage(bitmap, 0, 0);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(result => result ? resolve(result) : reject(new Error('Image conversion failed')), 'image/png'));
  } finally { bitmap.close(); }
}

function OpenImagePreview({ image, onClose, locale: suppliedLocale, theme: suppliedTheme, appearance: suppliedAppearance, className = '', style }: Omit<ImagePreviewProps, 'image'> & { image: ImagePreviewSource }) {
  const runtime = useContext(RuntimeContext);
  const theme = useStoreSelector(runtime?.configuration ?? noReader, config => config.theme ?? 'light');
  const appearance = useStoreSelector(runtime?.configuration ?? noReader, config => config.appearance ?? 'classic');
  const readerLocale = useImageLocale(), labels = imagePreviewLabels(suppliedLocale ?? readerLocale);
  const dialog = useRef<HTMLDialogElement>(null), closeButton = useRef<HTMLButtonElement>(null), stage = useRef<HTMLDivElement>(null), picture = useRef<HTMLImageElement>(null);
  const close = useRef(onClose); close.current = onClose;
  const animation = useRef<Animation | undefined>(undefined), previousRect = useRef<DOMRect | undefined>(undefined);
  const opened = useRef(false), exiting = useRef(false), mounted = useRef(false), copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [closing, setClosing] = useState(false), [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [mode, setMode] = useState<SizeMode>('fit'), [customScale, setCustomScale] = useState(1), [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const drag = useRef<{ x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const source = image.element, width = Math.max(1, image.width), height = Math.max(1, image.height);
  const fit = Math.min(viewport.width / width, viewport.height / height, 2);
  const scale = mode === 'fit' ? fit : mode === 'fill' ? Math.max(viewport.width / width, viewport.height / height) : mode === 'actual' ? 1 : customScale;
  const nextMode = mode === 'fit' ? 'actual' : mode === 'actual' ? 'fill' : 'fit';
  const reducedMotion = () => dialog.current?.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const requestClose = useCallback(() => {
    if (exiting.current) return;
    exiting.current = true;
    const element = picture.current;
    if (!element || reducedMotion()) { close.current(); return; }
    const from = element.getBoundingClientRect(), to = originRect(source);
    const host = dialog.current!;
    host.style.setProperty('--limr-image-close-mask-opacity', getComputedStyle(host, '::backdrop').opacity);
    const tools = host.querySelector<HTMLElement>('.limr-image-preview-toolbar');
    if (tools) {
      const computed = getComputedStyle(tools);
      host.style.setProperty('--limr-image-close-tools-opacity', computed.opacity);
      host.style.setProperty('--limr-image-close-tools-translate', computed.translate);
      host.style.setProperty('--limr-image-close-tools-scale', computed.scale);
    }
    animation.current?.cancel();
    // Lift the closing image out of its scroller so the return flight is not
    // clipped, even after panning an oversized original.
    Object.assign(element.style, { position: 'fixed', left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
    if (stage.current) stage.current.style.overflow = 'visible';
    setClosing(true);
    const base = element.getBoundingClientRect();
    animation.current = element.animate([
      { transform: transformBetween(from, base), opacity: 1 },
      { transform: to ? transformBetween(to, base) : 'scale(.96)', opacity: to ? 1 : 0 },
    ], { duration: 320, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards' });
    animation.current.finished.then(() => { if (mounted.current) close.current(); }, () => {});
  }, [source]);
  useIsomorphicLayoutEffect(() => {
    const element = dialog.current!, surface = stage.current!;
    mounted.current = true; opened.current = false; exiting.current = false;
    const unregister = registerImagePreview(element, source), previousFocus = element.ownerDocument.activeElement;
    element.showModal(); closeButton.current?.focus({ preventScroll: true });
    const measure = () => setViewport({ width: surface.clientWidth, height: surface.clientHeight });
    measure(); const resize = new ResizeObserver(measure); resize.observe(surface);
    // Observe this image only; document-wide observation wakes on every
    // unrelated paragraph/annotation update in a large document.
    const sourceAttributes = source ? ['src', 'srcset', 'sizes'].map(name => source.getAttribute(name)) : [];
    const observer = source ? new MutationObserver(() => {
      if (['src', 'srcset', 'sizes'].some((name, index) => source.getAttribute(name) !== sourceAttributes[index])) close.current();
    }) : undefined;
    const loaded = () => { if (source && (source.currentSrc || source.src) !== image.src) close.current(); };
    if (source) observer?.observe(source, { attributes: true, attributeFilter: ['src', 'srcset', 'sizes'] });
    source?.addEventListener('load', loaded);
    const wheel = (event: WheelEvent) => { if (!(event.target instanceof Element) || !event.target.closest('.limr-image-preview-stage')) event.preventDefault(); };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      mounted.current = false; animation.current?.cancel(); clearTimeout(copyTimer.current);
      unregister(); resize.disconnect(); observer?.disconnect(); source?.removeEventListener('load', loaded); element.removeEventListener('wheel', wheel); element.close();
      const focus = source?.isConnected ? source : previousFocus instanceof HTMLElement && previousFocus.isConnected ? previousFocus : null;
      focus?.focus({ preventScroll: true });
    };
  }, [source, image.src]);
  useIsomorphicLayoutEffect(() => {
    if (!viewport.width || !viewport.height || !picture.current || !stage.current || exiting.current) return;
    const element = picture.current, surface = stage.current;
    animation.current?.cancel();
    surface.style.removeProperty('overflow');
    surface.scrollLeft = (surface.scrollWidth - surface.clientWidth) / 2;
    surface.scrollTop = (surface.scrollHeight - surface.clientHeight) / 2;
    const from = opened.current ? previousRect.current : originRect(source), to = element.getBoundingClientRect();
    if (!reducedMotion() && (!opened.current || from)) {
      if (!opened.current) surface.style.overflow = 'visible';
      const active = animation.current = element.animate([
        { transform: from ? transformBetween(from, to) : 'scale(.94)', opacity: from ? 1 : 0 },
        { transform: 'none', opacity: 1 },
      ], { duration: opened.current ? 360 : 460, easing: ease });
      active.finished.then(() => { if (animation.current === active && !exiting.current) surface.style.removeProperty('overflow'); }, () => {});
    }
    opened.current = true; previousRect.current = undefined;
  }, [viewport.width, viewport.height, scale, source]);
  useIsomorphicLayoutEffect(() => {
    if (!source || !dialog.current || suppliedTheme !== undefined || suppliedAppearance !== undefined) return;
    // Portals retain React context but not inherited CSS custom properties.
    const apply = () => {
      const computed = getComputedStyle(source);
      for (const token of ['text', 'secondary', 'border', 'background', 'surface', 'link', 'shadow', 'font-text', 'success', 'error']) {
        const name = `--limr-${token}`, value = computed.getPropertyValue(name);
        if (style && name in style) continue;
        if (value) dialog.current?.style.setProperty(name, value); else dialog.current?.style.removeProperty(name);
      }
    };
    apply();
    const media = theme === 'auto' ? source.ownerDocument.defaultView?.matchMedia('(prefers-color-scheme: dark)') : undefined;
    media?.addEventListener('change', apply);
    return () => media?.removeEventListener('change', apply);
  }, [source, theme, appearance, suppliedTheme, suppliedAppearance, style]);
  const changeSize = (next: SizeMode, zoom = scale) => {
    if (exiting.current) return;
    previousRect.current = picture.current?.getBoundingClientRect();
    setMode(next); setCustomScale(zoom);
  };
  const copy = async () => {
    try {
      // Supply the promise synchronously to keep the browser's user activation.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': imagePng(image) })]);
      if (!mounted.current) return; setCopyStatus('copied');
    } catch { if (!mounted.current) return; setCopyStatus('error'); }
    clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopyStatus('idle'), 2200);
  };
  const copyLabel = copyStatus === 'copied' ? labels.copied : copyStatus === 'error' ? labels.copyFailed : labels.copy;
  return createPortal(<dialog ref={dialog} className={`limr-image-preview ${className}`} style={style}
    data-limr-theme={suppliedTheme ?? theme} data-limr-appearance={suppliedAppearance ?? appearance} data-limr-ignore="true" data-closing={closing || undefined}
    aria-label={labels.title} onCancel={event => { event.preventDefault(); requestClose(); }}
    onClose={() => { if (!dialog.current?.open && mounted.current) close.current(); }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); requestClose(); }
      if (event.key === 'Tab') {
        // Native dialog focus may otherwise leave an embedded browser frame.
        event.preventDefault(); event.stopPropagation();
        const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        const index = controls.indexOf(event.currentTarget.ownerDocument.activeElement as HTMLButtonElement);
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
      }
    }} onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) requestClose(); }}>
    <div ref={stage} className="limr-image-preview-stage" data-original={mode === 'actual' || undefined} data-mode={mode} data-scale={scale}
      onClick={event => { if (drag.current?.moved) { drag.current = null; return; } if (event.target === event.currentTarget || (event.target as HTMLElement).classList.contains('limr-image-preview-canvas')) requestClose(); }}>
      <div className="limr-image-preview-canvas" style={{ width: Math.max(viewport.width, width * scale), height: Math.max(viewport.height, height * scale) }}>
        <img ref={picture} src={image.src} alt={image.alt ?? ''} width={width} height={height} draggable={false}
          style={{ width: width * scale, height: height * scale, visibility: viewport.width ? undefined : 'hidden' }}
          onPointerDown={event => {
            if (event.button !== 0 || !stage.current) return;
            drag.current = { x: event.clientX, y: event.clientY, left: stage.current.scrollLeft, top: stage.current.scrollTop, moved: false };
            event.currentTarget.setPointerCapture(event.pointerId);
          }} onPointerMove={event => {
            const start = drag.current, surface = stage.current; if (!start || !surface || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const dx = event.clientX - start.x, dy = event.clientY - start.y;
            if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
            if (start.moved) { surface.scrollLeft = start.left - dx; surface.scrollTop = start.top - dy; surface.dataset.dragging = 'true'; }
          }} onPointerUp={event => { event.currentTarget.releasePointerCapture(event.pointerId); if (stage.current) delete stage.current.dataset.dragging; }}
          onPointerCancel={() => { drag.current = null; if (stage.current) delete stage.current.dataset.dragging; }}
          onClick={event => { event.stopPropagation(); if (drag.current?.moved) { drag.current = null; return; } changeSize(mode === 'actual' ? 'fit' : 'actual'); }} />
      </div>
    </div>
    <div className="limr-image-preview-toolbar" role="toolbar" aria-label={labels.title}>
      <button type="button" className="limr-image-preview-size" aria-label={labels[nextMode]} title={`${mode === 'custom' ? `${Math.round(scale * 100)}%` : labels[mode]} · ${labels[nextMode]}`} onClick={() => changeSize(nextMode)}><SizeIcon mode={mode} /></button>
      <button type="button" aria-label={labels.zoomIn} title={labels.zoomIn} disabled={scale >= 8} onClick={() => changeSize('custom', Math.min(8, scale * 1.25))}><ToolIcon name="zoom-in" /></button>
      <button type="button" aria-label={labels.zoomOut} title={labels.zoomOut} disabled={scale <= .05} onClick={() => changeSize('custom', Math.max(.05, scale / 1.25))}><ToolIcon name="zoom-out" /></button>
      <button type="button" className="limr-copy-button" data-status={copyStatus} aria-label={copyLabel} title={copyLabel} onClick={copy}><CopyGlyph /></button>
      <button ref={closeButton} type="button" className="limr-image-preview-close" aria-label={labels.close} title={labels.close} onClick={requestClose}><ToolIcon name="close" /></button>
      <span className="limr-sr-only" role="status">{copyStatus === 'copied' ? labels.copied : copyStatus === 'error' ? labels.copyFailed : ''}</span>
    </div>
  </dialog>, source?.ownerDocument.body ?? document.body);
}
