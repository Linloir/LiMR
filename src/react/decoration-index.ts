import type { SourceRange } from '../core';

type Ranged = { range: SourceRange };

/** Distribute decorations without changing their order or identity. The
 * balanced interval tree also supports overlapping and reordered custom blocks;
 * one enclosing block cannot force a scan of every earlier block. */
export function indexBlockDecorations<T extends Ranged>(blocks: readonly Ranged[], items: readonly T[], mode: 'overlap' | 'endpoint'): ReadonlyMap<number, T[]> {
  const result = new Map<number, T[]>();
  const intervals = blocks.flatMap((block, index) => {
    const { start, end } = block.range;
    // Either NaN makes both original predicates false. Reversed ranges and
    // infinities are retained: overlap uses the literal inequalities below.
    return Number.isNaN(start) || Number.isNaN(end) ? [] : [{ start, end, index }];
  }).sort((a, b) => a.start - b.start || a.index - b.index);
  const maxEnd = new Float64Array(intervals.length);
  const build = (low: number, high: number): number => {
    if (low >= high) return -Infinity;
    const middle = (low + high) >>> 1;
    return maxEnd[middle] = Math.max(intervals[middle].end, build(low, middle), build(middle + 1, high));
  };
  build(0, intervals.length);
  for (const item of items) {
    const { start, end } = item.range;
    const point = mode === 'endpoint' ? end : start;
    if (Number.isNaN(point) || Number.isNaN(end)) continue;
    const visit = (low: number, high: number): void => {
      if (low >= high || !(intervals[low].start < end)) return;
      const middle = (low + high) >>> 1;
      if (mode === 'endpoint' ? maxEnd[middle] < point : maxEnd[middle] <= point) return;
      const block = intervals[middle];
      if (block.start < end && (mode === 'endpoint' ? point <= block.end : point < block.end)) {
        const entries = result.get(block.index);
        if (entries) entries.push(item); else result.set(block.index, [item]);
      }
      visit(low, middle);
      visit(middle + 1, high);
    };
    visit(0, intervals.length);
  }
  return result;
}
