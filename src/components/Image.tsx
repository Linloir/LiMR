import { forwardRef, useCallback, useRef, useState, type ImgHTMLAttributes } from 'react';
import { safeUrl } from '../core';
import { useIsomorphicLayoutEffect } from '../react/context';
import { ImagePreview, imagePreviewLabels, useImageLocale, type ImagePreviewSource } from './ImagePreview';
import { canActivateImage, loadedImageSource } from './image-preview-behavior';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Loaded images open the shared LiMR preview by default. */
  preview?: boolean;
}

/** Source-bound renderers keep their own Atomic wrapper; this component adds no
 * wrapper DOM and preserves normal image selection and modified link clicks. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ src, alt = '', preview: enabled = true, className = '', loading = 'lazy', decoding = 'async', onLoad, onError, onClick, onKeyDown, ...props }, forwarded) {
  const image = useRef<HTMLImageElement>(null);
  const [ready, setReady] = useState(false), [preview, setPreview] = useState<ImagePreviewSource | null>(null);
  const labels = imagePreviewLabels(useImageLocale()), url = safeUrl(src, true);
  const ref = useCallback((element: HTMLImageElement | null) => {
    image.current = element;
    if (typeof forwarded === 'function') forwarded(element);
    else if (forwarded) forwarded.current = element;
  }, [forwarded]);
  useIsomorphicLayoutEffect(() => {
    setReady(!!image.current && !!loadedImageSource(image.current));
    setPreview(null);
  }, [url, props.srcSet, enabled]);
  const open = (element: HTMLImageElement) => {
    const source = loadedImageSource(element); if (source) setPreview(source);
  };
  const interactive = enabled && ready;
  return <><img {...props} ref={ref} src={url} alt={alt} loading={loading} decoding={decoding}
    className={`${className}${interactive ? ' limr-previewable-image' : ''}`.trim() || undefined}
    role={interactive ? 'button' : props.role} tabIndex={interactive ? props.tabIndex ?? 0 : props.tabIndex}
    aria-label={props['aria-label'] ?? (interactive ? `${labels.open}${alt ? `: ${alt}` : ''}` : undefined)}
    data-limr-keep-alive={preview ? "image-preview" : undefined}
    data-limr-image-preview={enabled ? 'true' : 'false'}
    aria-haspopup={interactive ? 'dialog' : props['aria-haspopup']}
    onLoad={event => { setReady(!!event.currentTarget.naturalWidth); onLoad?.(event); }}
    onError={event => { setReady(false); setPreview(null); onError?.(event); }}
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
