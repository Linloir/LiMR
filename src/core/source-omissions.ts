import type { SourceRange } from './types';

/** Remove known syntax, keeping both sides of each collapsed boundary exact. */
export function omitSource(source: string, omissions: readonly SourceRange[], offset = 0) {
  const spans = omissions.filter(range => range.start >= offset && range.end <= offset + source.length)
    .map(range => ({ start: range.start - offset, end: range.end - offset }));
  let from = 0, value = '';
  const boundaries: { at: number; start: number; end: number; removed: number }[] = [];
  for (const span of spans) {
    if (span.start < from || span.end <= span.start) continue;
    value += source.slice(from, span.start);
    const previous = boundaries.at(-1);
    const removed = (previous?.removed ?? 0) + span.end - span.start;
    if (previous?.at === value.length) { previous.end = span.end; previous.removed = removed; }
    else boundaries.push({ at: value.length, ...span, removed });
    from = span.end;
  }
  value += source.slice(from);
  const original = (at: number, edge: 'start' | 'end' = 'start') => {
    let lo = 0, hi = boundaries.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (boundaries[mid].at <= at) lo = mid + 1; else hi = mid; }
    const before = boundaries[lo - 1];
    return before?.at === at ? edge === 'start' ? before.end : before.start : at + (before?.removed ?? 0);
  };
  return { value, original };
}
