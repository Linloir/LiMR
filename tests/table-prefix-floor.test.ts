import { expect, test } from 'vitest';
import { layoutTable, type TableCellMetrics } from '../src/core/table-layout';
const short: TableCellMetrics = { tokens: [{ width: 10 }], minWidth: 10, naturalWidth: 10, lineHeight: 24 };
const long: TableCellMetrics = { tokens: [{ width: 1200 }], minWidth: 1200, naturalWidth: 1200, lineHeight: 24, minTruncatedWidth: 150 };
test('an exceptional token retains measured prefix and suffix space without widening short peers', () => {
  const rows = [[long, ...Array(18).fill(short)], Array(19).fill(short)]; const result = layoutTable({ rows, availableWidth: 500 });
  expect(result.widths[0] - 20).toBeGreaterThanOrEqual(150); expect(result.widths[1]).toBeLessThan(80); expect(result.clipped[0][0]).toBe(true);
});
test('the measured prefix floor remains subordinate to an explicit content protection limit', () => {
  const result = layoutTable({ rows: [[long, ...Array(18).fill(short)], Array(19).fill(short)], availableWidth: 500, options: { maxColumnWidth: 120 } });
  expect(result.contentWidths[0]).toBeLessThanOrEqual(120); expect(result.widths[0]).toBeLessThanOrEqual(120); expect(result.clipped[0][0]).toBe(true);
});

test('a measured near-fit header boundary can raise only the adaptive cap', () => {
  const header = { ...long, tokens: [{ width: 380 }], naturalWidth: 380, minWidth: 380 };
  const rows = (cell: TableCellMetrics) => [[cell, ...Array(18).fill(short)], Array(19).fill(short)];
  const original = layoutTable({ rows: rows(header), availableWidth: 500 });
  const refined = layoutTable({ rows: rows({ ...header, emergencyWrapWidths: [200.1, 135] }), availableWidth: 500 });
  expect(refined.widths[0]).toBeGreaterThan(original.widths[0]);
  expect(refined.widths[0]).toBeGreaterThanOrEqual(220.5);
  expect(refined.widths[0]).toBeLessThanOrEqual(original.widths[0] + 16.5);
  const protectedPlan = layoutTable({ rows: rows({ ...header, emergencyWrapWidths: [200.1, 135] }), availableWidth: 500, options: { maxColumnWidth: 219 } });
  expect(protectedPlan.widths[0]).toBeLessThanOrEqual(219);
  const distant = layoutTable({ rows: rows({ ...header, emergencyWrapWidths: [260, 160] }), availableWidth: 500 });
  expect(distant.widths[0]).toBe(original.widths[0]);
});
