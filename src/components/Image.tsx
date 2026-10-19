import { forwardRef, useCallback, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
import { safeUrl } from '../core';
import { useIsomorphicLayoutEffect } from '../react/context';
import { ImagePreview, imagePreviewLabels, useImageLocale, type ImagePreviewSource } from './ImagePreview';
import { canActivateImage, loadedImageSource } from './image-preview-behavior';
import { ToolIcon } from './ToolIcon';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Loaded images open the shared LiMR preview by default. */
  preview?: boolean;
}

function ImageFallback({ alt, title, hint, style }: { alt: string; title: string; hint: string; style: CSSProperties }) {
  const fallback = useRef<HTMLSpanElement>(null), message = useRef<HTMLSpanElement>(null);
  useIsomorphicLayoutEffect(() => {
    const element = fallback.current!, text = message.current!;
    const measure = () => {
      // Measure the same wrapped message even in icon-only mode. Hiding it
      // must not change the fit decision and start a resize feedback loop.
      const width = element.clientWidth, requiredHeight = text.offsetHeight + 28 + 10 + 48;
      const preferredHeight = `${width >= 68 ? Math.max(156, requiredHeight) : 156}px`;
      if (element.style.getPropertyValue('--limr-image-fallback-height') !== preferredHeight) element.style.setProperty('--limr-image-fallback-height', preferredHeight);
      const height = element.clientHeight;
      element.toggleAttribute('data-compact', width < 68 || requiredHeight > height + .5 || text.scrollWidth > width);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element); observer.observe(text);
    return () => observer.disconnect();
  }, [title, hint]);
  return <span ref={fallback} className="limr-image-fallback" role="img" style={style}
    aria-label={`${alt ? `${alt}: ` : ''}${title}. ${hint}`}
    data-limr-image-fallback="" data-limr-selection-surface="" data-limr-ignore="">
    <span className="limr-image-fallback-icon"><ToolIcon name="image-error" /></span>
    <span ref={message} className="limr-image-fallback-message">
      <span className="limr-image-fallback-title">{title}</span>
      <span className="limr-image-fallback-hint">{hint}</span>
    </span>
  </span>;
}

/** Source-bound renderers keep their own Atomic wrapper; this component adds no
 * wrapper DOM and preserves normal image selection and modified link clicks. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ src, alt = '', preview: enabled = true, className = '', loading = 'lazy', decoding = 'async', onLoad, onError, onClick, onKeyDown, ...props }, forwarded) {
  const image = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false), [preview, setPreview] = useState<ImagePreviewSource | null>(null);
  const labels = imagePreviewLabels(useImageLocale()), url = safeUrl(src, true);
  const [failure, setFailure] = useState<{ src: typeof url; srcSet?: string } | null>(null);
  // Key errors to the resource so a replacement lazy image becomes visible
  // immediately and can load, while keeping its native element/ref mounted.
  const failed = !!failure && failure.src === url && failure.srcSet === props.srcSet;
  const ref = useCallback((element: HTMLImageElement | null) => {
    image.current = element;
    if (typeof forwarded === 'function') forwarded(element);
    else if (forwarded) forwarded.current = element;
  }, [forwarded]);
  useIsomorphicLayoutEffect(() => {
    setReady(!!image.current && !!loadedImageSource(image.current));
    setFailure(image.current?.complete && !image.current.naturalWidth ? { src: url, srcSet: props.srcSet } : null);
    setPreview(null);
  }, [url, props.srcSet, enabled]);
  const open = (element: HTMLImageElement) => {
    const source = loadedImageSource(element); if (source) setPreview(source);
  };
  const interactive = enabled && ready && !failed;
  // A failed resource has no intrinsic dimensions for an explicit `auto` size.
  const fallbackWidth = props.style?.width ?? props.width, fallbackHeight = props.style?.height ?? props.height;
  return <>{failed && !props.hidden && <ImageFallback alt={alt} title={labels.loadFailed} hint={labels.loadFailedHint}
    style={{ width: fallbackWidth === 'auto' ? undefined : fallbackWidth, height: fallbackHeight === 'auto' ? undefined : fallbackHeight,
      maxWidth: props.style?.maxWidth, maxHeight: props.style?.maxHeight }} />}
    <img {...props} ref={ref} src={url} alt={alt} loading={loading} decoding={decoding}
    hidden={failed || props.hidden} style={failed ? { ...props.style, display: 'none' } : props.style}
    className={`${className}${interactive ? ' limr-previewable-image' : ''}`.trim() || undefined}
    role={interactive ? 'button' : props.role} tabIndex={interactive ? props.tabIndex ?? 0 : props.tabIndex}
    aria-label={props['aria-label'] ?? (interactive ? `${labels.open}${alt ? `: ${alt}` : ''}` : undefined)}
    data-limr-keep-alive={preview ? "image-preview" : undefined}
    data-limr-image-preview={enabled ? 'true' : 'false'}
    aria-haspopup={interactive ? 'dialog' : props['aria-haspopup']}
    onLoad={event => { setFailure(null); setReady(!!event.currentTarget.naturalWidth); onLoad?.(event); }}
    onError={event => { setFailure({ src: url, srcSet: props.srcSet }); setReady(false); setPreview(null); onError?.(event); }}
    onClick={event => {
      onClick?.(event);
      if (!interactive || !canActivateImage(event, event.currentTarget)) return;
      event.preventDefault(); event.stopPropagation(); open(event.currentTarget);
    }}
    onKeyDown={event => {
      onKeyDown?.(event);
      if (!interactive || !canActivateImage(event, event.currentTarget)) return;
      event.preventDefault(); event.stopPropagation(); open(event.currentTarget);
    }} />{preview && <ImagePreview image={preview} onClose={() => setPreview(null)} />}</>;
});
