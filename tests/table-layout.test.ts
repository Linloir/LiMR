import { describe, expect, it } from 'vitest';
import { layoutTable, tableCellLines, type TableCellMetrics } from '../src/core/table-layout';
const cell = (words: number, token = 32): TableCellMetrics => ({ tokens: Array.from({ length: words }, () => ({ width: token, space: 4 })), naturalWidth: Math.max(0, words * (token + 4) - 4), minWidth: token, lineHeight: 24 });
const header = (columns: number) => Array.from({ length: columns }, () => cell(1));

describe('content-aware table layout', () => {
  it('wraps around locally scrolling math while retaining its intrinsic width and fixed suffix', () => {
    const formula: TableCellMetrics = { tokens: [{ width: 1200, minWidth: 18 }, { width: 40 }], naturalWidth: 1240, minWidth: 40, lineHeight: 24 };
    expect(tableCellLines(formula, 200)).toBe(2);
    const result = layoutTable({ rows: [header(1), [formula]], availableWidth: 300 });
    expect(result.scroll).toBe(false);
    expect(result.clipped[1]).toEqual([false]);
    expect(result.heights[1]).toBe(48);
    expect(formula.tokens[0].width).toBe(1200);
  });
  it('keeps feasible tables within the viewport and protects the configured column width', () => {
    const result = layoutTable({ rows: [header(3), [cell(2), cell(18), cell(4)], [cell(1), cell(15), cell(2)]], availableWidth: 600, options: { maxColumnWidth: 280 } });
    expect(result.scroll).toBe(false);
    expect(result.width).toBeCloseTo(600, 6);
    expect(Math.max(...result.widths)).toBeLessThanOrEqual(280);
    expect(result.widths[1]).toBeGreaterThan(result.widths[0]);
  });
  it('gives a remarks column useful width even when many short columns require scrolling', () => {
    const rows = [header(19), ...Array.from({ length: 7 }, () => [...Array.from({ length: 18 }, () => cell(1, 10)), cell(50)])];
    const result = layoutTable({ rows, availableWidth: 760 });
    expect(result.scroll).toBe(true);
    expect(result.widths[18]).toBeGreaterThan(220);
    expect(result.widths[18]).toBeGreaterThan(result.widths[2] * 2);
    expect(result.heights[1]).toBeLessThan(350);
  });
  it('allows dense rows to grow while limiting the whitespace created by an isolated outlier', () => {
    const isolated = layoutTable({ rows: [header(5), [cell(250), cell(1), cell(1), cell(1), cell(1)]], availableWidth: 800 });
    const dense = layoutTable({ rows: [header(5), Array.from({ length: 5 }, () => cell(250))], availableWidth: 800 });
    expect(dense.heights[1]).toBeGreaterThan(isolated.heights[1]);
    expect(dense.heights[1] / 24).toBeGreaterThan(8);
    expect(dense.clipped[1].filter(Boolean).length).toBeLessThan(5);
  });
  it('does not use a fixed body line cap for increasingly dense content', () => {
    const short = layoutTable({ rows: [header(2), [cell(35), cell(35)]], availableWidth: 400 });
    const long = layoutTable({ rows: [header(2), [cell(180), cell(180)]], availableWidth: 400 });
    expect(long.heights[1]).toBeGreaterThan(short.heights[1]);
    expect(long.clipped[1]).toEqual([false, false]);
  });
  it('bounds headings to three lines and reports indivisible long tokens for full previews', () => {
    const result = layoutTable({ rows: [[cell(100), cell(1, 1400)], [cell(1), cell(1)]], availableWidth: 500, options: { maxColumnWidth: 240 } });
    expect(result.heights[0]).toBeLessThanOrEqual(72);
    expect(result.clipped[0]).toEqual([true, true]);
    expect(tableCellLines(cell(1, 1400), 100)).toBe(1);
  });
  it('allows explicit row protection without applying it to ordinary tables', () => {
    const rows = [header(2), [cell(500), cell(500)]];
    const protectedResult = layoutTable({ rows, availableWidth: 400, options: { maxRowHeight: 300 } });
    expect(protectedResult.heights[1]).toBeLessThanOrEqual(300);
    expect(protectedResult.clipped[1]).toEqual([true, true]);
    expect(layoutTable({ rows, availableWidth: 400 }).heights[1]).toBeGreaterThan(300);
  });
  it('keeps optimization work bounded as row counts grow and returns every row', () => {
    const rows = [header(8), ...Array.from({ length: 1500 }, (_, i) => Array.from({ length: 8 }, (_, j) => cell((i + j) % 12 + 1)))];
    const result = layoutTable({ rows, availableWidth: 900 });
    expect(result.heights).toHaveLength(1501);
    expect(result.evaluations).toBeLessThan(600);
    expect(result).toEqual(layoutTable({ rows, availableWidth: 900 }));
  });
  it('handles empty tables, empty cells and narrow widths without invalid geometry', () => {
    expect(layoutTable({ rows: [], availableWidth: 0 }).widths).toEqual([]);
    const result = layoutTable({ rows: [header(2), [cell(0), cell(0)]], availableWidth: 15 });
    expect(result.scroll).toBe(true);
    expect([...result.widths, ...result.heights].every(value => Number.isFinite(value) && value > 0)).toBe(true);
  });
  it.each([500, 760, 1100])('fills a %ipx viewport for sparse, single-column and prose tables', availableWidth => {
    const cases = [
      [header(7), Array.from({ length: 7 }, (_, i) => cell(1, i === 0 ? 65 : 10))],
      [header(1), [cell(1, 10)]],
      [header(2), [cell(1, 50), cell(90)], [cell(1, 50), cell(75)]],
    ];
    for (const rows of cases) {
      const result = layoutTable({ rows, availableWidth });
      expect(result.scroll).toBe(false);
      expect(result.width).toBeCloseTo(availableWidth, 6);
      expect(result.widths.reduce((sum, value) => sum + value, 0)).toBeCloseTo(availableWidth, 6);
    }
    const prose = layoutTable({ rows: cases[2], availableWidth });
    expect(prose.widths[1]).toBeGreaterThan(prose.widths[0]);
    expect(prose.clipped[1][0]).toBe(false);
  });
  it('keeps the readable line-length protection when a single track must fill a wide viewport', () => {
    const result = layoutTable({ rows: [header(1), [cell(90)]], availableWidth: 1100, options: { maxColumnWidth: 400 } });
    expect(result.widths).toEqual([1100]);
    expect(result.contentWidths).toEqual([400]);
    expect(result.heights[1]).toBe(tableCellLines(cell(90), 380) * 24);
  });
  it('keeps a short reference column compact while a wide prose track fills the page', () => {
    const rows = [header(2), [cell(1, 35), cell(32)], [cell(1, 35), cell(28)]];
    const result = layoutTable({ rows, availableWidth: 1100 });
    expect(result.width).toBeCloseTo(1100, 6);
    expect(result.widths[0]).toBeLessThan(220);
    expect(result.contentWidths[1]).toBeGreaterThan(48 * 16);
    const explicit = layoutTable({ rows, availableWidth: 1100, options: { maxColumnWidth: 600 } });
    expect(explicit.widths[0]).toBeLessThan(220);
    expect(explicit.contentWidths[1]).toBe(600);
    const nearFit = layoutTable({ rows: [header(2), [cell(1, 35), cell(24, 35)]], availableWidth: 1100 });
    expect(nearFit.heights[1]).toBe(24);
  });
  it('protects a rare short phrase instead of inheriting the checkmark majority width', () => {
    const phrase: TableCellMetrics = { tokens: [{ width: 28, space: 4 }, { width: 52, space: 4 }, { width: 44 }], naturalWidth: 132, minWidth: 52, lineHeight: 24 };
    const rows = [header(8), ...Array.from({ length: 12 }, () => Array.from({ length: 8 }, () => cell(1, 8))), [phrase, ...Array.from({ length: 7 }, () => cell(1, 8))]];
    const result = layoutTable({ rows, availableWidth: 500 });
    expect(tableCellLines(phrase, result.contentWidths[0] - 20)).toBeLessThanOrEqual(2);
    expect(result.clipped.at(-1)![0]).toBe(false);
  });
  it('prefers wrapping for moderate tables but considers wider scrolling for uniformly dense rows', () => {
    const moderate = layoutTable({ rows: [header(3), [cell(12), cell(12), cell(12)]], availableWidth: 600 });
    const dense = layoutTable({ rows: [header(3), [cell(250), cell(250), cell(250)]], availableWidth: 600 });
    expect(moderate.scroll).toBe(false);
    expect(moderate.width).toBeCloseTo(600, 6);
    expect(dense.scroll).toBe(true);
    const fittedHeight = tableCellLines(cell(250), 600 / 3 - 20) * 24;
    expect(dense.heights[1]).toBeLessThan(fittedHeight * .75);
    expect(dense.clipped[1]).toEqual([false, false, false]);
  });
});
