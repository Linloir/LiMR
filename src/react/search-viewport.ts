import type { ReaderRuntime } from './runtime';
import type { ReadingSearchMatch } from './reading-search';
import { visibleReadingBlocks } from './reading-position';
import { leavesIn, sourceRangeStartRect, visibleSourceRange, type Viewport } from './source-geometry';

/** Inspect visible blocks/lines rather than measuring every result in a book.
 * Selecting a visible match never implies scrolling to its reading edge. */
export function visibleSearchMatch(runtime: ReaderRuntime, matches: readonly ReadingSearchMatch[]): number {
  const content = runtime.content;
  if (!content || !matches.length) return -1;
  const window = content.ownerDocument.defaultView!;
  const vv = window.visualViewport, origin = content.getBoundingClientRect();
  const viewport: Viewport = {
    top: Math.max(origin.top, vv?.offsetTop ?? 0), bottom: Math.min(origin.bottom, (vv?.offsetTop ?? 0) + (vv?.height ?? window.innerHeight)),
    left: Math.max(origin.left, vv?.offsetLeft ?? 0), right: Math.min(origin.right, (vv?.offsetLeft ?? 0) + (vv?.width ?? window.innerWidth)),
  };
  const root = runtime.configuration.get().scrollRoot;
  if (root) {
    const box = root.getBoundingClientRect();
    viewport.top = Math.max(viewport.top, box.top + root.clientTop); viewport.bottom = Math.min(viewport.bottom, box.top + root.clientTop + root.clientHeight);
    viewport.left = Math.max(viewport.left, box.left + root.clientLeft); viewport.right = Math.min(viewport.right, box.left + root.clientLeft + root.clientWidth);
  }
  const ranges = [...visibleReadingBlocks(runtime, viewport.top, viewport.bottom)]
    .map(({ element }) => visibleSourceRange(leavesIn(element, runtime), viewport));
  return matches.findIndex(({ range }) => {
    if (!ranges.some(visible => visible.start < range.end && visible.end > range.start)) return false;
    const box = sourceRangeStartRect(runtime, range);
    return !!box && box.bottom > viewport.top && box.top < viewport.bottom && box.right > viewport.left && box.left < viewport.right;
  });
}
