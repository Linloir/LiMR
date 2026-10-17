import { describe, expect, it } from 'vitest';
import type { ParseContext, SourceRange } from '../src/core';
import { createOmissionLookup, omitSource } from '../src/core/source-omissions';
import { rememberSourceLines, sourceLines } from '../src/core/source-position';
import { lineStarts, sourcePoint } from '../src/core/tree';

// Previous object-based implementation is the mapping oracle, including its
// handling of overlapping, adjacent, unsorted and partially external ranges.
function reference(source: string, omissions: readonly SourceRange[], offset = 0) {
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
  return {
    value,
    original(at: number, edge: 'start' | 'end' = 'start') {
      let lo = 0, hi = boundaries.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (boundaries[mid].at <= at) lo = mid + 1; else hi = mid; }
      const before = boundaries[lo - 1];
      return before?.at === at ? edge === 'start' ? before.end : before.start : at + (before?.removed ?? 0);
    },
  };
}

function compare(source: string, ranges: SourceRange[], offset = 0) {
  const expected = reference(source, ranges, offset), actual = omitSource(source, ranges, offset);
  expect(actual.value).toBe(expected.value);
  for (let at = -1; at <= actual.value.length + 1; at += 0.5) {
    expect(actual.original(at)).toBe(expected.original(at));
    expect(actual.original(at, 'end')).toBe(expected.original(at, 'end'));
  }
}

describe('compact source omission maps', () => {
  it('preserves both sides of adjacent collapsed markers and partial suffix omissions', () => {
    const ranges = [{ start: 1, end: 3 }, { start: 3, end: 5 }, { start: 7, end: 9 }];
    compare('0123456789', ranges);
    const mapped = omitSource('0123456789', ranges);
    expect(mapped.value).toBe('0569');
    expect(mapped.original(1, 'start')).toBe(5);
    expect(mapped.original(1, 'end')).toBe(1);
    compare('3456789', ranges, 3);
    compare('😀\r\n中文\rbody\n', [{ start: 2, end: 4 }, { start: 4, end: 6 }]);
  });

  it('matches the reference on deterministic overlapping and unsorted ranges', () => {
    let state = 0x7b1d;
    const next = (max: number) => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state % max; };
    const source = 'A😀\r\n中文\rbody\n'.repeat(4);
    for (let sample = 0; sample < 160; sample++) {
      const offset = sample % 3 ? next(20) : 0x1_0000_0000 + next(20);
      const ranges = Array.from({ length: next(40) }, () => {
        const start = next(source.length + 10) - 5;
        return { start: offset + start, end: offset + start + next(12) - 2 };
      });
      if (sample % 2) ranges.sort((a, b) => a.start - b.start);
      compare(source, ranges, offset);
    }
  });

  it('uses a lossless fallback for non-integer offsets', () => {
    compare('0123456789', [{ start: 0.2, end: 1.1 }, { start: 1.4, end: 2.7 }, { start: 5.2, end: 7.8 }]);
    compare('0123456789', [{ start: 1, end: 3 }, { start: 3, end: 5 }], 0.25);
  });
});

describe('internal line index sharing', () => {
  it('reuses a registered index without sharing source point objects', () => {
    const context: ParseContext = { source: '😀\r\n中文\rbody\n', streaming: false, documentId: 'lines' };
    const lines = lineStarts(context.source);
    rememberSourceLines(context, lines);
    expect(sourceLines(context)).toBe(lines);
    expect(sourcePoint(4, sourceLines(context))).toEqual({ offset: 4, line: 2, column: 1 });
    expect(sourcePoint(4, sourceLines(context))).not.toBe(sourcePoint(4, sourceLines(context)));
  });

  it('builds standalone context indexes lazily and replaces stale source indexes', () => {
    const context: ParseContext = { source: 'first\r\nlast', streaming: true, documentId: 'standalone' };
    const first = sourceLines(context);
    expect(sourceLines(context)).toBe(first);
    context.source += '\nnext';
    expect(sourceLines(context)).not.toBe(first);
    expect(sourceLines(context)).toEqual(lineStarts(context.source));
  });
});

describe('contained omission lookup', () => {
  const verify = (ranges: SourceRange[]) => {
    const within = createOmissionLookup(ranges);
    for (let start = -2; start < 16; start++) for (let end = -2; end < 16; end++) {
      const expected = ranges.filter(range => range.start >= start && range.end <= end);
      const actual = within(start, end);
      expect(actual).toEqual(expected.length ? expected : undefined);
      actual?.forEach((range, index) => expect(range).toBe(expected[index]));
    }
    expect(within(NaN, 12)).toBeUndefined();
    expect(within(0, NaN)).toBeUndefined();
  };

  it('matches filter semantics for ordered, nested, overlapping and zero-length ranges', () => {
    verify([{ start: 0, end: 12 }, { start: 1, end: 3 }, { start: 1, end: 8 }, { start: 4, end: 4 }, { start: 7, end: 10 }, { start: 11, end: 12 }]);
    verify([]);
  });

  it('preserves caller order and range aliases for unsorted or unconventional inputs', () => {
    verify([{ start: 8, end: 9 }, { start: 0, end: 3 }, { start: 4, end: 7 }]);
    verify([{ start: 1, end: 8 }, { start: 9, end: 6 }, { start: 10, end: 12 }]);
    verify([{ start: NaN, end: 3 }, { start: 1, end: 2 }, { start: 5, end: Infinity }]);
  });
});
