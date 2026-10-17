import { describe, expect, it } from 'vitest';
import { intersects, type SourceRange } from '../src/core';
import { indexBlockDecorations } from '../src/react/decoration-index';

const ranged = (start: number, end: number) => ({ range: { start, end } });
function compare(blocks: { range: SourceRange }[], entries: { range: SourceRange }[]) {
  for (const mode of ['overlap', 'endpoint'] as const) {
    const actual = indexBlockDecorations(blocks, entries, mode);
    blocks.forEach((block, index) => {
      const expected = entries.filter(item => mode === 'overlap' ? intersects(item.range, block.range)
        : item.range.end > block.range.start && item.range.end <= block.range.end);
      expect(actual.get(index) ?? []).toEqual(expected);
      actual.get(index)?.forEach((item, at) => expect(item).toBe(expected[at]));
    });
  }
}

describe('block decoration indexing', () => {
  it('matches exact endpoint/overlap rules without reordering or cloning decorations', () => {
    compare([ranged(0, 10), ranged(10, 10), ranged(10, 20), ranged(24, 30)], [
      ranged(19, 25), ranged(3, 5), ranged(0, 10), ranged(10, 10), ranged(9, 11),
      ranged(12, 12), ranged(30, 30), ranged(8, 3), ranged(-1, Infinity),
      ranged(NaN, 7), ranged(1, NaN), ranged(-Infinity, 0), ranged(0, 0),
    ]);
  });

  it('retains custom overlapping, reordered and invalid block behavior', () => {
    const entries = [ranged(12, 12), ranged(0, 20), ranged(4, 8), ranged(10, 4), ranged(-Infinity, Infinity), ranged(NaN, 8), ranged(1, NaN)];
    compare([ranged(10, 20), ranged(0, 10)], entries);
    compare([ranged(0, 20), ranged(5, 10), ranged(8, 30)], entries);
    compare([ranged(8, 4), ranged(NaN, 10), ranged(1, Infinity)], entries);
    compare([ranged(Infinity, Infinity), ranged(-Infinity, Infinity), ranged(-Infinity, -Infinity), ranged(1, NaN)], entries);
  });

  it('differentially checks unsorted, nested, fractional and zero-width decorations', () => {
    let seed = 0x7654321;
    const next = (max: number) => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % max; };
    for (let sample = 0; sample < 150; sample++) {
      const blocks = Array.from({ length: 24 }, (_, index) => ranged(index * 10, index * 10 + 8));
      const entries = Array.from({ length: 80 }, () => { const start = next(520) / 2 - 10; return ranged(start, start + next(60) / 2 - 5); });
      compare(blocks, entries);
      compare(blocks.map(block => ranged(block.range.start - next(50), block.range.end + next(50))).reverse(), entries);
    }
  });

  it('does not scan every decoration for every disjoint book block', () => {
    const blocks = Array.from({ length: 10_000 }, (_, index) => ranged(index * 10, index * 10 + 10));
    let reads = 0;
    const entries = blocks.map((_, index) => ({ get range() { reads++; return { start: index * 10 + 1, end: index * 10 + 3 }; } }));
    expect(indexBlockDecorations(blocks, entries, 'overlap').size).toBe(blocks.length);
    expect(reads).toBeLessThan(100_000);
  });

  it('prunes reordered overlapping blocks even with one interval spanning the whole book', () => {
    let comparisons = 0;
    // Count numeric comparisons rather than getter reads: caching the ranges
    // must not disguise a quadratic scan of their cached numeric endpoints.
    const tracked = (value: number) => ({ valueOf() { comparisons++; return value; } }) as unknown as number;
    const blocks = Array.from({ length: 10_000 }, (_, index) => ranged(tracked(index * 10), tracked(index * 10 + 12))).reverse();
    blocks.splice(5_000, 0, ranged(tracked(-1), tracked(100_001)));
    const entries = Array.from({ length: 10_000 }, (_, index) => ranged(index * 10 + 1, index * 10 + 3));
    for (const mode of ['overlap', 'endpoint'] as const) {
      comparisons = 0;
      const actual = indexBlockDecorations(blocks, entries, mode);
      expect(actual.get(5_000)).toEqual(entries);
      expect(actual.size).toBe(blocks.length);
      expect(comparisons).toBeLessThan(1_000_000);
      for (const index of [0, 4_999, 5_001, 10_000]) {
        const expected = entries.filter(item => mode === 'overlap' ? intersects(item.range, blocks[index].range)
          : item.range.end > blocks[index].range.start && item.range.end <= blocks[index].range.end);
        expect(actual.get(index)).toEqual(expected);
      }
    }
  });
});
