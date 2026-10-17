import { expect, it } from 'vitest';
import { createAnnotationHostLookup, createDefinitionContainment } from '../src/extensions/source-annotation-lookup';
import type { MarkdownNode, SourceRange } from '../src/core/types';

const node = (start: number, end: number, type = 'paragraph'): MarkdownNode => ({ type, position: { start: { line: 1, column: start + 1, offset: start }, end: { line: 1, column: end + 1, offset: end } } });
const eligible = (value: MarkdownNode) => !['definition', 'annotationDefinition', 'footnoteDefinition'].includes(value.type);
function compare(nodes: MarkdownNode[], queries: SourceRange[]) {
  const lookup = createAnnotationHostLookup(nodes);
  for (const { start, end } of queries) {
    expect(lookup.find(start, end)).toBe(nodes.find(value => eligible(value) && (value.position?.start.offset ?? 0) <= end && (value.position?.end.offset ?? 0) >= start));
    expect([...lookup.preceding(start)]).toStrictEqual([...nodes].reverse().filter(value => eligible(value) && (value.position?.end.offset ?? 0) < start));
  }
}
it('preserves first-host identity and preceding order for touching, overlapping and skipped siblings', () => {
  const nodes = [node(0, 5), node(4, 10), node(6, 11, 'definition'), node(10, 10), node(11, 20, 'footnoteDefinition'), node(21, 25)];
  const queries = Array.from({ length: 28 }, (_, start) => ({ start, end: start + 2 }));
  compare(nodes, queries); compare([...nodes].reverse(), queries);
  compare([node(0, 50), node(2, 6), node(7, 9)], queries);
  compare([{ type: 'paragraph' }, node(1, 10)], queries);
});
it('maintains queries after selected-host expansion and falls back if sibling order changes', () => {
  const nodes = [node(0, 5), node(10, 15), node(20, 25)], lookup = createAnnotationHostLookup(nodes);
  expect(lookup.find(4, 6)).toBe(nodes[0]); nodes[0].position!.end.offset = 8; lookup.changed(nodes[0]);
  expect(lookup.find(7, 8)).toBe(nodes[0]);
  const preceding = lookup.preceding(19); const selected = preceding.next().value!; expect(selected).toBe(nodes[1]); preceding.return(undefined);
  selected.position!.end.offset = 30; lookup.changed(selected);
  expect(lookup.find(26, 27)).toBe(nodes[1]); expect([...lookup.preceding(40)]).toStrictEqual([...nodes].reverse());
  expect(lookup.find(22, 23)).toBe(nodes[1]);
});
it('indexes containment without changing nested, overlapping or out-of-order definition semantics', () => {
  let state = 9137; const random = () => (state = (state * 1664525 + 1013904223) >>> 0);
  const ranges = Array.from({ length: 400 }, () => { const start = random() % 10000; return { start, end: start + random() % 400 }; });
  for (const values of [ranges, [{ start: NaN, end: 90 }, ...ranges]]) {
    const contains = createDefinitionContainment(values);
    for (let index = 0; index < 1000; index++) {
      const start = random() % 10000, end = start + random() % 400;
      expect(contains(start, end)).toBe(values.some(range => start >= range.start && end <= range.end));
    }
  }
});
