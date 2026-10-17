import { useEffect, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';
import type { ReaderRuntime } from '../react/runtime';

/** Move only the prose when inspecting a sidebar card. The card keeps its hit
 * area, and viewport scrolling never becomes an input to the displacement. */
export function useSidebarDocumentAlignment(runtime: ReaderRuntime, enabled: boolean, anchorTop?: number, cardTop?: number) {
  const [frozen, setFrozen] = useState<number | null>(null);
  const scrollRoot = runtime.configuration.get().scrollRoot;
  const offset = frozen ?? (anchorTop === undefined || cardTop === undefined ? 0 : cardTop - anchorTop);
  useIsomorphicLayoutEffect(() => {
    if (enabled) runtime.documentOffset.set(Math.abs(offset) < .5 ? 0 : offset);
  }, [runtime, enabled, offset]);
  useEffect(() => {
    if (!enabled) return;
    const root = scrollRoot ?? window;
    let pointer: { x: number; y: number } | undefined;
    const freeze = () => setFrozen(runtime.documentOffset.get());
    const resume = () => setFrozen(null);
    const move = (event: PointerEvent) => {
      if (!pointer || pointer.x !== event.clientX || pointer.y !== event.clientY) resume();
      pointer = { x: event.clientX, y: event.clientY };
    };
    const key = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) freeze();
      else resume();
    };
    // A stationary pointer enters other cards as the page scrolls. Keep the
    // existing displacement until the next deliberate pointer/key interaction.
    root.addEventListener('wheel', freeze, { passive: true });
    root.addEventListener('touchstart', freeze, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', resume, { passive: true });
    document.addEventListener('keydown', key);
    return () => {
      root.removeEventListener('wheel', freeze); root.removeEventListener('touchstart', freeze);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerdown', resume); document.removeEventListener('keydown', key);
      runtime.documentOffset.set(0);
    };
  }, [runtime, enabled, scrollRoot]);
}
