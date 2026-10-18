export interface SidebarBox { id: string; top: number; height: number }
export interface SidebarLayoutLock { id: string; top: number; boxes: ReadonlyMap<string, SidebarBox>; scrollAdjustment?: number }

/** Virtual height corrections preserve source pixels by adjusting native
 * scroll. Preserve locked card pixels across that same coordinate change. */
export function adjustSidebarLock<T extends SidebarLayoutLock>(lock: T | null | undefined, adjustment: number): T | null | undefined {
  if (!lock || lock.scrollAdjustment === undefined || lock.scrollAdjustment === adjustment) return lock;
  return { ...lock, top: lock.top + adjustment - lock.scrollAdjustment, scrollAdjustment: adjustment };
}

/** Preserve the gaps the pointer actually saw. Only changed card heights move
 * neighbors; switching the focused card must not repack them at prose anchors. */
export function reflowSidebar<T extends { id: string; anchorTop: number; height: number }>(items: readonly T[], lock: SidebarLayoutLock, gap: number): T[] {
  const pivot = items.findIndex(item => item.id === lock.id);
  if (pivot < 0) return [...items];
  const result = items.map(item => ({ ...item }));
  result[pivot].anchorTop = lock.top;
  const spacing = (before: T, after: T) => {
    const a = lock.boxes.get(before.id), b = lock.boxes.get(after.id);
    return a && b ? Math.max(gap, b.top - a.top - a.height)
      : Math.max(gap, after.anchorTop - before.anchorTop - before.height);
  };
  for (let i = pivot - 1; i >= 0; i--) result[i].anchorTop = result[i + 1].anchorTop - result[i].height - spacing(items[i], items[i + 1]);
  for (let i = pivot + 1; i < items.length; i++) result[i].anchorTop = result[i - 1].anchorTop + result[i - 1].height + spacing(items[i - 1], items[i]);
  return result;
}
