import { describe, expect, it, vi } from 'vitest';
import { createDocument, type ParseContext, type SourceRange } from '../src/core';
import { standard } from '../src/extensions';
import { createParser } from '../src/core/parser';
import { rememberOmittedSource, takeOmittedSource } from '../src/core/preparsed';
import { omitSource } from '../src/core/source-omissions';
import { lineStarts } from '../src/core/tree';

const makeContext = (source: string): ParseContext => ({ source, streaming: false, documentId: 'omitted-cache' });

describe('annotation omitted-source reuse', () => {
  it('reuses the original immutable value and map once with equal interval copies', () => {
    const source = 'A<one>B<two>C', context = makeContext(source);
    const ranges = [{ start: 1, end: 6 }, { start: 7, end: 12 }];
    const omitted = omitSource(source, ranges), original = omitted.original;
    rememberOmittedSource(context, source, ranges, omitted);
    // Neither caller-owned wrapper changes nor range mutations may rewrite the
    // stored candidate. Private offset copies preserve the initial intervals.
    omitted.value = 'changed'; omitted.original = () => -1;
    ranges[0].start = 0;
    const reused = takeOmittedSource(context, source, [{ start: 1, end: 6 }, { start: 7, end: 12 }]);
    expect(reused?.value).toBe('ABC');
    expect(reused?.original).toBe(original);
    expect(Object.isFrozen(reused)).toBe(true);
    expect(reused?.original(1, 'start')).toBe(6);
    expect(reused?.original(1, 'end')).toBe(1);
    expect(takeOmittedSource(context, source, [{ start: 1, end: 6 }, { start: 7, end: 12 }])).toBeUndefined();
  });

  it.each([
    ['source', 'different', [{ start: 1, end: 2 }, { start: 3, end: 4 }]],
    ['count', 'aaaaa', [{ start: 1, end: 2 }]],
    ['start', 'aaaaa', [{ start: 0, end: 2 }, { start: 3, end: 4 }]],
    ['end', 'aaaaa', [{ start: 1, end: 3 }, { start: 3, end: 4 }]],
    ['order', 'aaaaa', [{ start: 3, end: 4 }, { start: 1, end: 2 }]],
    ['equal output with a different map', 'aaaaa', [{ start: 0, end: 1 }, { start: 3, end: 4 }]],
  ] as const)('consumes a %s mismatch while the context remains reachable', (_name, attemptedSource, attemptedRanges) => {
    const source = 'aaaaa', context = makeContext(source);
    const ranges = [{ start: 1, end: 2 }, { start: 3, end: 4 }];
    rememberOmittedSource(context, source, ranges, omitSource(source, ranges));
    expect(takeOmittedSource(context, attemptedSource, attemptedRanges)).toBeUndefined();
    expect(takeOmittedSource(context, source, ranges)).toBeUndefined();
  });

  it('the full parser consumes the saved map while a suffix leaves it for a full retry', () => {
    const source = 'Before REMOVEafter.\n\nLast paragraph.', context = makeContext(source);
    const ranges = [{ start: 7, end: 13 }];
    context.sourceOmissions = ranges;
    const candidate = omitSource(source, ranges), original = vi.fn(candidate.original);
    rememberOmittedSource(context, source, ranges, { value: candidate.value, original });
    const parse = createParser(standard()), offset = source.indexOf('Last');
    const suffix = parse(source.slice(offset), offset, context, lineStarts(source));
    expect(suffix.nodes[0].position?.start.offset).toBe(offset);
    expect(original).not.toHaveBeenCalled();
    const full = parse(source, 0, context, lineStarts(source));
    expect(original).toHaveBeenCalled();
    expect(full.nodes[0].children?.[0].value).toBe('Before after.');
    expect(full.nodes[0].position?.end.offset).toBe(source.indexOf('\n'));
    expect(takeOmittedSource(context, source, ranges)).toBeUndefined();
  });

  it('does not use a complete candidate for a shorter offset-zero fragment', () => {
    const source = 'Before REMOVEafter.\n\nLast paragraph.', context = makeContext(source);
    const ranges = [{ start: 7, end: 13 }], candidate = omitSource(source, ranges);
    context.sourceOmissions = ranges;
    const original = vi.fn(candidate.original);
    rememberOmittedSource(context, source, ranges, { value: candidate.value, original });
    createParser(standard())(source.slice(0, source.indexOf('\n')), 0, context, lineStarts(source));
    expect(original).not.toHaveBeenCalled();
    expect(takeOmittedSource(context, source, ranges)?.original).toBe(original);
  });

  it('rebuilds omissions supplied by another preprocessor without authorizing literal markers', () => {
    const source = '::%%limr%%{<#note}Marked DELETEwords.::%%limr%%{>#note}\n\n'
      + '::%%limr%%{<#missing}Literal::%%limr%%{>#missing}\n\n'
      + ':::limr-annotation{id="note" type="footnote"}\nA note.\n:::\n';
    const customRange: SourceRange = { start: source.indexOf('DELETE'), end: source.indexOf('DELETE') + 6 };
    const snapshot = createDocument(source, { extensions: [...standard(), {
      name: 'custom-omissions', preprocess: () => [customRange],
    }] }).getSnapshot();
    const text = JSON.stringify(snapshot.blocks.map(block => block.node));
    expect(text).toContain('Marked words.');
    expect(text).toContain('::%%limr%%{<#missing}Literal::%%limr%%{>#missing}');
    expect(snapshot.diagnostics).toEqual([]);
  });
});
