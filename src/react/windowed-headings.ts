import { intersects, type Heading, type SourceRange } from '../core';
import type { ReaderRuntime } from './runtime';
import { windowedReadingText } from './windowed-copy';

/** Global TOC visibility and visual language order cannot depend on mounted
 * headings: only a small fraction of the complete document is in the DOM. */
export function windowedHeadings(runtime: ReaderRuntime): readonly Heading[] {
  const snapshot = runtime.document.getSnapshot(), groups = new Map<number, Heading[]>();
  for (const heading of snapshot.headings) {
    let lo = 0, hi = snapshot.blocks.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (snapshot.blocks[mid].range.end <= heading.range.start) lo = mid + 1; else hi = mid; }
    const block = snapshot.blocks[lo]; if (!block) continue;
    const entries = groups.get(lo) ?? []; entries.push(heading); groups.set(lo, entries);
  }
  const result: Heading[] = [];
  for (const [index, headings] of groups) {
    const block = snapshot.blocks[index], fragments: SourceRange[] = [];
    windowedReadingText(runtime, [block.range], undefined, fragments);
    const visible = headings.map(heading => ({ heading, order: fragments.findIndex(fragment => intersects(fragment, heading.range)) })).filter(item => item.order >= 0);
    visible.sort((a, b) => a.order - b.order);
    result.push(...visible.map(item => item.heading));
  }
  return result;
}
