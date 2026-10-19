import { useEffect } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';
import type { ReaderRuntime } from '../react/runtime';

/** Move only the prose when inspecting a sidebar card. The card keeps its hit
 * area. Scrolling can change the hovered card, which must retarget the prose. */
export function useSidebarDocumentAlignment(runtime: ReaderRuntime, enabled: boolean, anchorTop?: number, cardTop?: number, preserveOffset = false) {
  const offset = anchorTop === undefined || cardTop === undefined ? 0 : cardTop - anchorTop;
  useIsomorphicLayoutEffect(() => {
    // A marker inside sidebar-displaced prose must keep its hit area. Resetting
    // the offset here makes it leave/re-enter a stationary pointer indefinitely.
    if (enabled && !preserveOffset) runtime.documentOffset.set(Math.abs(offset) < .5 ? 0 : offset);
  }, [runtime, enabled, offset, preserveOffset]);
  useEffect(() => {
    if (!enabled) return;
    return () => { runtime.documentOffset.set(0); };
  }, [runtime, enabled]);
}
