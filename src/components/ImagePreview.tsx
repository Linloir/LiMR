import { useContext, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { safeUrl } from '../core';
import { RuntimeContext, useIsomorphicLayoutEffect, useStoreSelector } from '../react/context';
import type { LiMRLocale, ViewConfiguration } from '../react/types';
import { ToolIcon } from './ToolIcon';
import { registerImagePreview } from './image-preview-behavior';

export interface ImagePreviewSource {
  /** A browser-readable URL, after any resource resolution performed by the host. */
  src: string;
  alt?: string;
  width: number;
  height: number;
  /** Optional originating image, used for resource invalidation and focus return. */
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
  };
}

/** A controlled image dialog, also usable outside a Reader. It performs no file
 * lookup: resource access and URL resolution remain the embedding host's job. */
export function ImagePreview({ image, ...props }: ImagePreviewProps) {
  if (!image || !safeUrl(image.src, true) || typeof document === 'undefined') return null;
  return <OpenImagePreview key={image.src} image={image} {...props} />;
}

function OpenImagePreview({ image, onClose, locale: suppliedLocale, theme: suppliedTheme, appearance: suppliedAppearance, className = '', style }: Omit<ImagePreviewProps, 'image'> & { image: ImagePreviewSource }) {
  const runtime = useContext(RuntimeContext);
  const theme = useStoreSelector(runtime?.configuration ?? noReader, config => config.theme ?? 'light');
  const appearance = useStoreSelector(runtime?.configuration ?? noReader, config => config.appearance ?? 'classic');
  const readerLocale = useImageLocale(), labels = imagePreviewLabels(suppliedLocale ?? readerLocale);
  const dialog = useRef<HTMLDialogElement>(null), closeButton = useRef<HTMLButtonElement>(null);
  const close = useRef(onClose); close.current = onClose;
  const [original, setOriginal] = useState(false);
  const source = image.element;
  useIsomorphicLayoutEffect(() => {
    const element = dialog.current!;
    const unregister = registerImagePreview(element, source);
    const previousFocus = element.ownerDocument.activeElement;
    element.showModal();
    closeButton.current?.focus({ preventScroll: true });
    // Observe this image only. Body-wide observation wakes on every unrelated
    // paragraph/annotation update in a large document.
    const sourceAttributes = source ? ['src', 'srcset', 'sizes'].map(name => source.getAttribute(name)) : [];
    const observer = source ? new MutationObserver(() => {
      if (['src', 'srcset', 'sizes'].some((name, index) => source.getAttribute(name) !== sourceAttributes[index])) close.current();
    }) : undefined;
    const loaded = () => { if (source && (source.currentSrc || source.src) !== image.src) close.current(); };
    if (source) observer?.observe(source, { attributes: true, attributeFilter: ['src', 'srcset', 'sizes'] });
    source?.addEventListener('load', loaded);
    const wheel = (event: WheelEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.limr-image-preview-stage')) event.preventDefault();
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      unregister(); observer?.disconnect(); source?.removeEventListener('load', loaded); element.removeEventListener('wheel', wheel); element.close();
      const focus = source?.isConnected ? source : previousFocus instanceof HTMLElement && previousFocus.isConnected ? previousFocus : null;
      focus?.focus({ preventScroll: true });
    };
  }, [source, image.src]);
  useIsomorphicLayoutEffect(() => {
    if (!source || !dialog.current || suppliedTheme !== undefined || suppliedAppearance !== undefined) return;
    // Portals retain React context but not inherited CSS custom properties.
    // Copy only the skin tokens used by this surface, once per skin change.
    const apply = () => {
      const computed = getComputedStyle(source);
      for (const token of ['text', 'secondary', 'border', 'background', 'surface', 'link', 'shadow', 'font-text']) {
        const name = `--limr-${token}`, value = computed.getPropertyValue(name);
        if (style && name in style) continue;
        if (value) dialog.current?.style.setProperty(name, value);
        else dialog.current?.style.removeProperty(name);
      }
    };
    apply();
    const media = theme === 'auto' ? source.ownerDocument.defaultView?.matchMedia('(prefers-color-scheme: dark)') : undefined;
    media?.addEventListener('change', apply);
    return () => media?.removeEventListener('change', apply);
  }, [source, theme, appearance, suppliedTheme, suppliedAppearance, style]);
  return createPortal(<dialog ref={dialog} className={`limr-image-preview ${className}`} style={style}
    data-limr-theme={suppliedTheme ?? theme} data-limr-appearance={suppliedAppearance ?? appearance} data-limr-ignore="true"
    aria-label={labels.title} onCancel={event => { event.preventDefault(); close.current(); }}
    onClose={() => { if (!dialog.current?.open) close.current(); }}
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close.current(); }
      if (event.key === 'Tab') {
        // Native dialog focus may otherwise leave an embedded browser frame.
        event.preventDefault(); event.stopPropagation();
        const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')];
        const index = controls.indexOf(event.currentTarget.ownerDocument.activeElement as HTMLButtonElement);
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]?.focus();
      }
    }}
    onClick={event => { event.stopPropagation(); if (event.target === event.currentTarget) close.current(); }}>
    <header className="limr-image-preview-header">
      <span className="limr-image-preview-caption" title={image.alt}>{image.alt || labels.title}</span>
      <span className="limr-image-preview-dimensions">{image.width} × {image.height}</span>
      <button type="button" className="limr-image-preview-size" aria-pressed={original} onClick={() => setOriginal(value => !value)}>
        <ToolIcon name={original ? 'zoom-out' : 'zoom-in'} /><span className="limr-underline">{original ? labels.fit : labels.actual}</span>
      </button>
      <button ref={closeButton} type="button" className="limr-image-preview-close" aria-label={labels.close} onClick={() => close.current()}><ToolIcon name="close" /></button>
    </header>
    <div className="limr-image-preview-stage" data-original={original || undefined} onClick={event => { if (event.target === event.currentTarget) close.current(); }}>
      <img src={image.src} alt={image.alt ?? ''} width={original ? image.width : undefined} height={original ? image.height : undefined}
        title={original ? labels.fit : labels.actual} draggable={false} onClick={() => setOriginal(value => !value)} />
    </div>
  </dialog>, source?.ownerDocument.body ?? document.body);
}
