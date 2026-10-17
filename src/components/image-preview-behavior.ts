import type { ImagePreviewSource } from './ImagePreview';

/** Shared activation rules for source images and read-only rich-content clones. */
export function loadedImageSource(element: HTMLImageElement): ImagePreviewSource | null {
  return element.complete && element.naturalWidth && element.getAttribute('src')
    ? { element, src: element.currentSrc || element.src, alt: element.alt, width: element.naturalWidth, height: element.naturalHeight }
    : null;
}

export function canActivateImage(event: { defaultPrevented: boolean; ctrlKey: boolean; metaKey: boolean; altKey: boolean; shiftKey: boolean; key?: string }, element: HTMLImageElement): boolean {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return false;
  return event.key === undefined ? element.ownerDocument.getSelection()?.isCollapsed !== false : event.key === 'Enter' || event.key === ' ';
}

// A portal belongs to its originating card, not to every annotation surface in
// the document. Entries exist only while that image dialog is mounted.
const origins = new Map<HTMLDialogElement, HTMLImageElement>();
export function registerImagePreview(dialog: HTMLDialogElement, source: HTMLImageElement | undefined): () => void {
  if (source) origins.set(dialog, source);
  return () => { origins.delete(dialog); };
}
export function imagePreviewSurfaces(owner: Element | null | undefined): HTMLDialogElement[] {
  return owner ? [...origins].filter(([, source]) => owner.contains(source)).map(([dialog]) => dialog) : [];
}
export function isOwnedImagePreview(target: EventTarget | null, owner: Element | null | undefined): boolean {
  return target instanceof Node && imagePreviewSurfaces(owner).some(dialog => dialog.contains(target));
}
