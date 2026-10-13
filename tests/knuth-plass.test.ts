import { describe, expect, it } from 'vitest';
import { knuthPlass, texBadness, type LineItem } from '../src/core/knuth-plass';

const end: LineItem[] = [{ type: 'penalty', width: 0, penalty: 10000 }, { type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true }, { type: 'penalty', width: 0, penalty: -10000 }];
const box = (width: number): LineItem => ({ type: 'box', width });
const glue = (): LineItem => ({ type: 'glue', width: 5, stretch: 3, shrink: 2 });
const words = (widths: number[]) => [...widths.flatMap((width, i) => i ? [glue(), box(width)] : [box(width)]), ...end];

describe('TeX paragraph optimization', () => {
  it('uses integer badness, not a squared or unbounded ratio approximation', () => {
    expect([texBadness(0, 0), texBadness(10, 10), texBadness(5, 10), texBadness(20, 10), texBadness(100, 1), texBadness(1, 0)]).toEqual([0, 100, 12, 800, 10000, 10000]);
  });
  it('charges squared penalties separately and preserves double/final hyphen demerits', () => {
    const penalty: LineItem = { type: 'penalty', width: 10, penalty: 50, flagged: true, automatic: true };
    const result = knuthPlass([box(40), penalty, box(40), ...end], 50);
    expect(result.pass).toBe('tolerance');
    expect(result.lines.map(line => line.index)).toEqual([1, 5]);
    expect(result.demerits).toBe(7700);
    expect(knuthPlass([box(40), penalty, box(40), penalty, box(40), ...end], 50).demerits).toBe(20300);
    expect(knuthPlass([box(40), { ...penalty, flagged: false, penalty: -50 }, box(40), ...end], 50).demerits).toBe(-2300);
  });
  it('runs an emergency pass without turning its artificial stretch into visible spacing', () => {
    const result = knuthPlass(words([40, 40, 40]), 100, { pretolerance: 0, tolerance: 0, emergencyStretch: 100 });
    expect(result.pass).toBe('emergency');
    expect(result.lines[0].index).toBe(3);
    expect(result.lines[0].ratio).toBe(5);
  });
  it('retains forced breaks and indivisible overfull content in the final pass', () => {
    const result = knuthPlass([box(400), { type: 'penalty', width: 0, penalty: -10000 }, box(20), ...end], 100);
    expect(result.lines.map(line => line.index)).toEqual([1, 5]);
    expect(result.demerits).toBe(100);
  });
  it('matches exhaustive minimum-demerit paths across four fitness classes', () => {
    // Independent exponential oracle: enumerate all line partitions, recomputing
    // their sums. The production active-list optimization must keep the optimum.
    for (let trial = 0; trial < 64; trial++) {
      const widths = Array.from({ length: 9 }, (_, i) => 12 + (trial * 13 + i * i * 7) % 31);
      const width = 95;
      let minimum = Infinity;
      const enumerate = (from: number, fitness: number, cost: number) => {
        let natural = 0;
        for (let until = from; until < widths.length; until++) {
          natural += widths[until] + (until > from ? 5 : 0);
          const spaces = until - from, delta = width - natural, last = until === widths.length - 1;
          if (delta < -2 * spaces) continue;
          const badness = last && delta >= 0 ? 0 : texBadness(delta, (delta < 0 ? 2 : 3) * spaces);
          const fit = delta < 0 ? badness > 12 ? 0 : 1 : badness > 99 ? 3 : badness > 12 ? 2 : 1;
          const sum = cost + Math.min(10000, 10 + badness) ** 2 + (Math.abs(fit - fitness) > 1 ? 10000 : 0);
          if (last) minimum = Math.min(minimum, sum); else enumerate(until + 1, fit, sum);
        }
      };
      enumerate(0, 1, 0);
      expect(knuthPlass(words(widths), width, { pretolerance: 10000 }).demerits, `partition ${trial}`).toBe(minimum);
    }
  });
  it('supports line-dependent widths and looseness without a paragraph-size cutoff', () => {
    const items = words(Array.from({ length: 2000 }, (_, i) => 18 + i % 13));
    const regular = knuthPlass(items, 400), indented = knuthPlass(items, [120, 400]);
    expect(regular.lines.at(-1)?.index).toBe(items.length - 1);
    expect(indented.lines[0].index).toBeLessThan(regular.lines[0].index);
    const loose = knuthPlass(words(Array(25).fill(25)), 160, { tolerance: 10000, pretolerance: 10000, looseness: 1 });
    const normal = knuthPlass(words(Array(25).fill(25)), 160, { tolerance: 10000, pretolerance: 10000 });
    expect(loose.lines.length).toBe(normal.lines.length + 1);
  });
});
