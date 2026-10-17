import type { SourceRange } from './types';

/** Query contained omissions without rescanning the full document per node.
 * Engine ranges are ordered. Preserve original objects/order for standalone
 * parser callers that supply unsorted or unconventional ranges. */
export function createOmissionLookup(omissions: readonly SourceRange[] = []) {
  const ordered = omissions.every((range, index) => Number.isFinite(range.start) && Number.isFinite(range.end)
    && range.end >= range.start && (!index || range.start >= omissions[index - 1].start));
  return (start: number, end: number): SourceRange[] | undefined => {
    if (!ordered) {
      const inside = omissions.filter(range => range.start >= start && range.end <= end);
      return inside.length ? inside : undefined;
    }
    if (Number.isNaN(start) || Number.isNaN(end)) return;
    let lo = 0, hi = omissions.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (omissions[mid].start < start) lo = mid + 1; else hi = mid; }
    let inside: SourceRange[] | undefined;
    for (let index = lo; index < omissions.length && omissions[index].start <= end; index++) {
      const range = omissions[index];
      if (range.end <= end) (inside ??= []).push(range);
    }
    return inside;
  };
}

/** Remove known syntax, keeping both sides of each collapsed boundary exact. */
export function omitSource(source: string, omissions: readonly SourceRange[], offset = 0) {
  // Count collapsed boundaries before allocating their private index. Avoid a
  // second object per omission, and retain four packed offsets per boundary
  // instead of an array of objects. Non-integer caller offsets keep the same
  // numeric behavior through the wider fallback.
  let count = 0, scanFrom = 0, length = 0, previousAt = -1;
  let packed = source.length <= 0xffffffff;
  for (const range of omissions) {
    if (!(range.start >= offset && range.end <= offset + source.length)) continue;
    const start = range.start - offset, end = range.end - offset;
    if (start < scanFrom || end <= start) continue;
    length += Math.trunc(start) - Math.trunc(scanFrom);
    if (length !== previousAt) { count++; previousAt = length; }
    packed &&= Number.isInteger(start) && Number.isInteger(end);
    scanFrom = end;
  }
  const boundaries = packed ? new Uint32Array(count * 4) : new Float64Array(count * 4);
  let from = 0, value = '';
  let used = 0, removed = 0;
  for (const range of omissions) {
    if (!(range.start >= offset && range.end <= offset + source.length)) continue;
    const start = range.start - offset, end = range.end - offset;
    if (start < from || end <= start) continue;
    value += source.slice(from, start);
    removed = removed + end - start;
    if (used && boundaries[used - 4] === value.length) {
      boundaries[used - 2] = end; boundaries[used - 1] = removed;
    } else {
      boundaries[used++] = value.length; boundaries[used++] = start;
      boundaries[used++] = end; boundaries[used++] = removed;
    }
    from = end;
  }
  value += source.slice(from);
  const original = (at: number, edge: 'start' | 'end' = 'start') => {
    let lo = 0, hi = count;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (boundaries[mid * 4] <= at) lo = mid + 1; else hi = mid; }
    const before = (lo - 1) * 4;
    return lo ? boundaries[before] === at ? boundaries[before + (edge === 'start' ? 2 : 1)] : at + boundaries[before + 3] : at;
  };
  return { value, original };
}
