import { useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';
import type { ReaderRuntime } from '../react/runtime';

/** Move only the prose when inspecting a sidebar card. The card keeps its hit
 * area. Scrolling can change the hovered card, which must retarget the prose. */
export function useSidebarDocumentAlignment(runtime: ReaderRuntime, enabled: boolean, anchorTop?: number, cardTop?: number) {
  const offset = anchorTop === undefined || cardTop === undefined ? 0 : cardTop - anchorTop;
  useIsomorphicLayoutEffect(() => {
    if (enabled) runtime.documentOffset.set(Math.abs(offset) < .5 ? 0 : offset);
  }, [runtime, enabled, offset]);
  useEffect(() => {
    if (!enabled) return;
    return () => { runtime.documentOffset.set(0); };
  }, [runtime, enabled]);
}
