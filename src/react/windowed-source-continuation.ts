import type { Block } from '../core';

type Entry = Block & { footnoteId?: string };
type SourceEntry = { block: Entry; index: number };

/** Source locations only, never permission to reuse a React key or DOM owner.
 * The caller memoizes this partition with the existing sorted source metadata.
 * A nested footnote can overlap its parent body's range while rendering in the
 * footer. Keep those two display classes separate during a runtime handoff. */
export function windowedSourceContinuation(sourceOrder: readonly SourceEntry[]) {
  const body: SourceEntry[] = [], footnotes = new Map<string, number>();
  for (const entry of sourceOrder) {
    if (entry.block.footnoteId !== undefined) footnotes.set(entry.block.footnoteId, entry.index);
    else body.push(entry);
  }
  return (previous: Entry): readonly number[] => {
    if (previous.footnoteId !== undefined) {
      const index = footnotes.get(previous.footnoteId);
      // Removed footer content has no continued footer slot. In particular, its
      // parent source block is not a substitute footer or an identity grant.
      return index === undefined ? [] : [index];
    }
    let low = 0, high = body.length;
    while (low < high) { const middle = (low + high) >>> 1; if (body[middle].block.range.end <= previous.range.start) low = middle + 1; else high = middle; }
    const result: number[] = [];
    for (let index = low; index < body.length && body[index].block.range.start < previous.range.end; index++) result.push(body[index].index);
    // A removed body owner continues near its next body location, without
    // importing footer nodes or resetting a distant viewport to the opening.
    if (!result.length && body.length) result.push(body[Math.min(low, body.length - 1)].index);
    return result;
  };
}
