import { describe, expect, it } from 'vitest';
import { BlockHeightIndex, readingScrollGeometry } from '../src/core/height-index';

describe('reading height index', () => {
  it('keeps exact block boundaries after measurements change above the viewport', () => {
    const index = new BlockHeightIndex([10, 0, 30, 20]);
    expect([0, 9, 10, 39, 40, 60].map(offset => index.at(offset))).toEqual([0, 0, 2, 2, 3, 3]);
    const anchor = index.offset(3) + 7;
    const delta = index.set(0, 26);
    expect(index.offset(3) + 7).toBe(anchor + delta);
    expect(index.total).toBe(76);
    expect(index.set(1, 8)).toBe(8);
    expect(index.at(26)).toBe(1);
    expect(index.offset(3)).toBe(64);
  });
  it('matches prefix sums during nonuniform updates', () => {
    const heights = Array.from({ length: 257 }, (_, i) => i % 13 * 7 + .25);
    const index = new BlockHeightIndex(heights);
    for (let i = 0; i < heights.length; i += 3) { heights[i] = i * .7; index.set(i, heights[i]); }
    let total = 0;
    for (let i = 0; i < heights.length; i++) {
      expect(index.offset(i)).toBeCloseTo(total, 7);
      if (heights[i]) expect(index.at(total + heights[i] / 2)).toBe(i);
      total += heights[i];
    }
    expect(index.total).toBeCloseTo(total, 7);
  });
  it('represents a book taller than Chromium CSS limits without losing the end', () => {
    const geometry = readingScrollGeometry(180_000_000, 900);
    expect(geometry.height).toBe(8_000_000);
    for (const position of [0, 19_200, 75_000_000, geometry.logicalMax]) {
      expect(geometry.toLogical(geometry.toPhysical(position))).toBeCloseTo(position, 6);
    }
    expect(geometry.toLogical(geometry.physicalMax)).toBe(geometry.logicalMax);
    expect(readingScrollGeometry(400, 900).toPhysical(20)).toBe(0);
  });
});
