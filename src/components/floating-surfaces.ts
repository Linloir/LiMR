import { useIsomorphicLayoutEffect } from '../react/context';
import { Store, type ReaderRuntime } from '../react/runtime';

interface Surfaces {
  overlay: HTMLElement | null;
  toolbar: HTMLElement | null;
  overlayRect: Store<DOMRect | null>;
  toolbarSpace: Store<number>;
}
const surfaces = new WeakMap<ReaderRuntime, Surfaces>();
/** Portals share geometry only with surfaces belonging to the same reader. */
export function floatingSurfaces(runtime: ReaderRuntime): Surfaces {
  let value = surfaces.get(runtime);
  if (!value) { value = { overlay: null, toolbar: null, overlayRect: new Store<DOMRect | null>(null), toolbarSpace: new Store(0) }; surfaces.set(runtime, value); }
  return value;
}

export function useOverlayGeometry(runtime: ReaderRuntime, element: HTMLElement | null, open: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!element || !open) return;
    const surfaces = floatingSurfaces(runtime);
    surfaces.overlay = element;
    const measure = () => {
      const rect = element.getBoundingClientRect(), previous = surfaces.overlayRect.get();
      if (!previous || (['x', 'y', 'width', 'height'] as const).some(key => Math.abs(rect[key] - previous[key]) > .5)) surfaces.overlayRect.set(rect);
    };
    const size = new ResizeObserver(measure), position = new MutationObserver(measure);
    size.observe(element); position.observe(element, { attributes: true, attributeFilter: ['style'] }); measure();
    return () => {
      size.disconnect(); position.disconnect();
      if (surfaces.overlay === element) { surfaces.overlay = null; surfaces.overlayRect.set(null); }
    };
  }, [runtime, element, open]);
}
