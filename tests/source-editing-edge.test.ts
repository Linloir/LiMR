import { describe, expect, it, vi } from 'vitest';
import { resolveAnnotationAnchors, type SourceRange } from '../src/core';
import { standard } from '../src/extensions';
import { ReaderRuntime } from '../src/react/runtime';

function setup(source: string) {
  const accept = vi.fn();
  const runtime = new ReaderRuntime('edges', source, false, { extensions: standard(), onSourceChange: accept });
  return { runtime, accept };
}
function add(runtime: ReaderRuntime, ranges: SourceRange[], id = 'new') {
  runtime.commands.addAnnotation({ id, type: 'footnote', anchors: ranges.map(range => ({ range })), data: { body: 'A note' } }, { highlight: false, target: 'source' });
}
function quotes(runtime: ReaderRuntime, id: string) {
  const snapshot = runtime.document.getSnapshot();
  const annotation = snapshot.annotations.find(item => item.id === id)!;
  return resolveAnnotationAnchors(annotation, snapshot).map(anchor => snapshot.source.slice(anchor.range.start, anchor.range.end).replace(/::%%limr%%\{[<>]#[A-Za-z0-9][A-Za-z0-9_.:-]*\}/g, ''));
}

describe('source annotation writer boundaries', () => {
  it('splits repeated range IDs when one occurrence is removed and preserves other annotations', () => {
    const source = '::%%limr%%{<#r}one::%%limr%%{>#r} and ::%%limr%%{<#r}two::%%limr%%{>#r}\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::\n\n:::limr-annotation{#q ranges="r" type="question"}\nBoth question\n:::';
    const { runtime } = setup(source);
    const annotation = runtime.document.getSnapshot().annotations.find(item => item.id === 'n')!;
    runtime.commands.updateAnnotation('n', { anchors: annotation.anchors!.slice(1) });
    expect(quotes(runtime, 'n')).toEqual(['two']);
    expect(quotes(runtime, 'q')).toEqual(['one', 'two']);
    expect(runtime.document.getSnapshot().annotations.find(item => item.id === 'q')!.data).toEqual({ body: 'Both question' });
  });
  it('removes one occurrence from a repeated range without restoring it on reparse', () => {
    const source = '::%%limr%%{<#r}one::%%limr%%{>#r} and ::%%limr%%{<#r}two::%%limr%%{>#r}\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::';
    const { runtime } = setup(source);
    runtime.commands.removeAnnotationsAt([runtime.document.getSnapshot().annotations[0].anchors![0].range]);
    expect(runtime.document.getSnapshot().source).toMatch(/^one and ::%%limr%%\{<#/);
    expect(quotes(runtime, 'n')).toEqual(['two']);
  });
  it('adds to only one occurrence of an existing shared named range', () => {
    const source = '::%%limr%%{<#r}one::%%limr%%{>#r} and ::%%limr%%{<#r}two::%%limr%%{>#r}\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::';
    const { runtime } = setup(source);
    add(runtime, [runtime.document.getSnapshot().annotations[0].anchors![1].range]);
    expect(quotes(runtime, 'new')).toEqual(['two']);
    expect(quotes(runtime, 'n')).toEqual(['one', 'two']);
    for (const [id, ranges] of runtime.document.getSnapshot().annotationRanges) for (const range of ranges) {
      const source = runtime.document.getSnapshot().source;
      expect(source.slice(range.openingRange.start, range.openingRange.end)).toBe(`::%%limr%%{<#${id}}`);
      expect(source.slice(range.markerRange.start, range.markerRange.end)).toBe(`::%%limr%%{>#${id}}`);
    }
  });
  it.each([
    ['inside URL', '[text](https://example.com)', [{ start: 9, end: 14 }]],
    ['half entity', 'An &amp; entity', [{ start: 5, end: 8 }]],
    ['half escape', 'An \\* escaped star', [{ start: 4, end: 8 }]],
    ['half Unicode character', 'A 😀 glyph', [{ start: 2, end: 3 }]],
    ['half CRLF', 'first\r\nsecond', [{ start: 0, end: 6 }]],
    ['fractional offset', 'text', [{ start: .5, end: 2 }]],
    ['hidden marker token', 'Before ::%%limr%%{<#r}words::%%limr%%{>#r} after.\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nNote\n:::', [{ start: 10, end: 12 }]],
  ] as const)('rejects %s before publishing any source change', (_name, source, ranges) => {
    const { runtime, accept } = setup(source);
    expect(() => add(runtime, [...ranges])).toThrow();
    expect(runtime.document.getSnapshot().source).toBe(source);
    expect(accept).not.toHaveBeenCalled();
  });
  it.each([
    ['new intersecting ranges', 'abcdefgh', [{ start: 1, end: 5 }, { start: 3, end: 7 }], ['bcde', 'defg']],
    ['new nested ranges', 'abcdefgh', [{ start: 1, end: 7 }, { start: 3, end: 5 }], ['bcdefg', 'de']],
    ['partial bold', '**bold** plain', [{ start: 4, end: 11 }], ['ld** pl']],
    ['plain into partial bold', 'A **bold** phrase.', [{ start: 0, end: 6 }], ['A **bo']],
    ['partial emphasis', '*bold* plain', [{ start: 3, end: 9 }], ['ld* pl']],
    ['partial link text', '[text](url) tail', [{ start: 3, end: 14 }], ['xt](url) ta']],
    ['inside inline code', 'Use `const value` here', [{ start: 7, end: 11 }], ['nst ']],
    ['adjacent equals', 'word=value', [{ start: 0, end: 4 }], ['word']],
    ['point inside code', 'Use `code` here', [{ start: 6, end: 6 }], ['']],
    ['point after inline highlight', '==word== next', [{ start: 8, end: 8 }], ['']],
    ['crossing paragraphs', 'first paragraph\n\nsecond paragraph', [{ start: 6, end: 23 }], ['paragraph\n\nsecond']],
    ['inside fenced code', '```js\nconst value = "&amp;";\n```', [{ start: 9, end: 25 }], ['st value = "&amp']],
  ] as const)('round-trips %s without changing Markdown', (_name, source, ranges, expected) => {
    const { runtime, accept } = setup(source);
    add(runtime, [...ranges]);
    expect(accept).toHaveBeenCalledTimes(1);
    expect(quotes(runtime, 'new')).toEqual(expected);
    runtime.commands.removeAnnotation('new');
    expect(runtime.document.getSnapshot().source.trim()).toBe(source.trim());
  });
  it('keeps rich inline ranges, surrounding whitespace and table cell content intact', () => {
    for (const [source, text] of [
      ['A **bold** phrase.', '**bold**'],
      ['A **bold** phrase.', 'bold'],
      ['A  spaced text  end.', ' spaced text '],
      ['| Name | Value |\n| --- | --- |\n| **bold** and `code` | Other |', '**bold** and `code`'],
      ['| Name | Value |\n| --- | --- |\n| left \\| right | Other |', 'left \\| right'],
    ]) {
      const { runtime } = setup(source);
      const start = source.indexOf(text);
      add(runtime, [{ start, end: start + text.length }]);
      expect(quotes(runtime, 'new')).toEqual([text]);
      runtime.commands.removeAnnotation('new');
      expect(runtime.document.getSnapshot().source.trim()).toBe(source.trim());
    }
  });
  it('orders adjacent ranges independently of the incoming anchor order', () => {
    const { runtime } = setup('abcdef');
    add(runtime, [{ start: 3, end: 6 }, { start: 0, end: 3 }]);
    expect(quotes(runtime, 'new').sort()).toEqual(['abc', 'def']);
  });
  it('updates and deletes crossing and nested ranges independently', () => {
    const { runtime } = setup('abcdefgh');
    add(runtime, [{ start: 1, end: 5 }], 'outer');
    let source = runtime.document.getSnapshot().source;
    const inner = runtime.document.getSnapshot().annotations[0].anchors![0].range.start + 1;
    add(runtime, [{ start: inner, end: inner + 2 }], 'inner');
    source = runtime.document.getSnapshot().source;
    const nested = runtime.document.getSnapshot().annotations.find(annotation => annotation.id === 'inner')!.anchors![0].range;
    add(runtime, [{ start: nested.start + 1, end: source.indexOf('fgh') + 2 }], 'crossing');
    expect(quotes(runtime, 'outer')).toEqual(['bcde']);
    expect(quotes(runtime, 'inner')).toEqual(['cd']);
    expect(quotes(runtime, 'crossing')).toEqual(['defg']);
    runtime.commands.updateAnnotation('inner', { data: { body: 'Updated nested note' } });
    runtime.commands.removeAnnotation('outer');
    expect(quotes(runtime, 'inner')).toEqual(['cd']);
    expect(quotes(runtime, 'crossing')).toEqual(['defg']);
    runtime.commands.removeAnnotation('crossing');
    expect(quotes(runtime, 'inner')).toEqual(['cd']);
    expect(runtime.document.getSnapshot().annotations[0].data).toEqual({ body: 'Updated nested note' });
    runtime.commands.removeAnnotation('inner');
    expect(runtime.document.getSnapshot().source.trim()).toBe('abcdefgh');
  });
  it.each(['Use `abcdefgh` here.', '```js\nabcdefgh\n```'])('keeps literal character mappings editable after inserting nested code annotations: %s', source => {
    const { runtime } = setup(source), start = source.indexOf('abcdefgh');
    add(runtime, [{ start: start + 1, end: start + 7 }], 'outer');
    let updated = runtime.document.getSnapshot().source, inside = updated.indexOf('bcdefg') + 1;
    add(runtime, [{ start: inside, end: inside + 2 }], 'inner');
    expect(quotes(runtime, 'outer')).toEqual(['bcdefg']);
    expect(quotes(runtime, 'inner')).toEqual(['cd']);
    runtime.commands.removeAnnotation('outer');
    expect(quotes(runtime, 'inner')).toEqual(['cd']);
    runtime.commands.removeAnnotation('inner');
    expect(runtime.document.getSnapshot().source.trim()).toBe(source);
  });
  it('moves an existing named range and removes its old boundary tokens', () => {
    const { runtime } = setup('first &amp; second 😀');
    add(runtime, [{ start: 0, end: 5 }]);
    const source = runtime.document.getSnapshot().source, start = source.indexOf('second');
    runtime.commands.updateAnnotation('new', { anchors: [{ range: { start, end: start + 'second 😀'.length } }] });
    expect(quotes(runtime, 'new')).toEqual(['second 😀']);
    expect(runtime.document.getSnapshot().annotationRanges.size).toBe(1);
    runtime.commands.removeAnnotation('new');
    expect(runtime.document.getSnapshot().source.trim()).toBe('first &amp; second 😀');
  });
  it('round-trips a visible selection across a hidden annotation definition', () => {
    const source = 'First ::%%limr%%{<#r}word::%%limr%%{>#r}.\n\n:::limr-annotation{#existing ranges="r"}\nKeep this note.\n:::\n\nSecond paragraph.';
    const { runtime } = setup(source);
    add(runtime, [{ start: 0, end: source.length }]);
    let snapshot = runtime.document.getSnapshot();
    expect(snapshot.annotations.find(annotation => annotation.id === 'new')?.anchors).toHaveLength(1);
    expect(quotes(runtime, 'existing')).toEqual(['word']);
    runtime.commands.updateAnnotation('new', { data: { body: 'Spanning both visible paragraphs' } });
    snapshot = runtime.document.getSnapshot();
    expect(snapshot.annotations.find(annotation => annotation.id === 'new')?.anchors).toHaveLength(1);
    expect(snapshot.annotations.find(annotation => annotation.id === 'new')?.data).toEqual({ body: 'Spanning both visible paragraphs' });
    runtime.commands.removeAnnotation('new');
    expect(runtime.document.getSnapshot().source.trim()).toBe(source);
    expect(quotes(runtime, 'existing')).toEqual(['word']);
  });
  it('adds another annotation inside a trailing fenced block already wrapped by a named range', () => {
    const source = ':::limr-annotation{#existing ranges="r"}\nExisting note.\n:::\n\n::%%limr%%{<#r}```js\nconst value = 1;\n```::%%limr%%{>#r}';
    const { runtime } = setup(source), start = source.indexOf('value');
    add(runtime, [{ start, end: start + 5 }]);
    expect(quotes(runtime, 'new')).toEqual(['value']);
    expect(quotes(runtime, 'existing')).toEqual(['```js\nconst value = 1;\n```']);
    expect(runtime.document.getSnapshot().blocks.find(block => block.node.type === 'code')?.node.value).toBe('const value = 1;');
    runtime.commands.removeAnnotation('new');
    expect(runtime.document.getSnapshot().source.trim()).toBe(source);
  });
  it('keeps zero-length ranges ordered between adjacent closing and opening markers', () => {
    const { runtime } = setup('abcdef');
    add(runtime, [{ start: 3, end: 6 }, { start: 3, end: 3 }, { start: 0, end: 3 }]);
    expect(quotes(runtime, 'new').sort()).toEqual(['', 'abc', 'def']);
    expect(runtime.document.getSnapshot().annotationRanges.size).toBe(3);
    runtime.commands.removeAnnotation('new');
    expect(runtime.document.getSnapshot().source.trim()).toBe('abcdef');
  });
  it('rejects the entire transaction when a later anchor splits a character', () => {
    const source = 'good 😀 text', { runtime, accept } = setup(source);
    expect(() => add(runtime, [{ start: 0, end: 4 }, { start: 5, end: 6 }])).toThrow('boundaries');
    expect(accept).not.toHaveBeenCalled();
    expect(runtime.document.getSnapshot().source).toBe(source);
  });
  it('retains an existing inline highlight when a source note shares its range', () => {
    const { runtime } = setup('Before ==words== after.');
    const highlight = runtime.document.getSnapshot().annotations[0];
    add(runtime, [highlight.range!]);
    const snapshot = runtime.document.getSnapshot();
    expect(snapshot.annotations.map(item => item.type).sort()).toEqual(['footnote', 'highlight']);
    expect(quotes(runtime, highlight.id)).toEqual(['words']);
    expect(quotes(runtime, 'new')).toEqual(['words']);
    runtime.commands.removeAnnotation('new');
    expect(quotes(runtime, highlight.id)).toEqual(['words']);
  });
  it('moves an inline highlight to another selection without leaving its original delimiters', () => {
    const { runtime } = setup('==first== second');
    const highlight = runtime.document.getSnapshot().annotations[0];
    runtime.commands.updateAnnotation(highlight.id, { range: { start: 10, end: 16 }, data: { color: 'red' } });
    expect(quotes(runtime, highlight.id)).toEqual(['second']);
    expect(runtime.document.getSnapshot().source).not.toContain('==');
    runtime.commands.removeAnnotation(highlight.id);
    expect(runtime.document.getSnapshot().source.trim()).toBe('first second');
  });
  it.each(['remove', 'convert'] as const)('can %s a plain highlight without deleting an enclosed named annotation', action => {
    const source = '==before ::%%limr%%{<#r}inside::%%limr%%{>#r} after==\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nNote\n:::';
    const { runtime } = setup(source);
    const highlight = runtime.document.getSnapshot().annotations.find(item => item.type === 'highlight')!;
    if (action === 'convert') {
      runtime.commands.updateAnnotation(highlight.id, { data: { color: 'red', style: 'wavy' } });
      expect(quotes(runtime, highlight.id)).toEqual(['before inside after']);
      expect(runtime.document.getSnapshot().annotations.find(item => item.id === highlight.id)?.source?.module).toBe('source-annotations');
    }
    runtime.commands.removeAnnotation(highlight.id);
    expect(quotes(runtime, 'n')).toEqual(['inside']);
    expect(runtime.document.getSnapshot().source).not.toContain('==');
    runtime.commands.removeAnnotation('n');
    expect(runtime.document.getSnapshot().source.trim()).toBe('before inside after');
  });
  it('atomically removes overlapping annotations and a containing plain highlight', () => {
    const source = '==::%%limr%%{<#a}ab::%%limr%%{<#b}cd::%%limr%%{>#a}ef::%%limr%%{>#b}==\n\n:::limr-annotation{#a type="footnote"}\nA\n:::\n\n:::limr-annotation{#b type="footnote"}\nB\n:::';
    const { runtime, accept } = setup(source), snapshot = runtime.document.getSnapshot();
    runtime.commands.removeAnnotationsAt(snapshot.annotations.flatMap(annotation => resolveAnnotationAnchors(annotation, snapshot).map(anchor => anchor.range)));
    expect(accept).toHaveBeenCalledTimes(1);
    expect(runtime.document.getSnapshot().annotations).toHaveLength(0);
    expect(runtime.document.getSnapshot().source.trim()).toBe('abcdef');
  });
  it.each([
    ['list', '- ', '  '],
    ['ordered list', '12. ', '    '],
    ['blockquote', '> ', '> '],
    ['list in blockquote', '> - ', '>   '],
    ['blockquote in list', '- > ', '  > '],
    ['nested blockquotes', '> > ', '> > '],
  ])('preserves %s containers and semantic Markdown when editing a definition', (_name, first, continuation) => {
    const original = 'First **note**.\n\n- item\n  continuation';
    const definition = `:::limr-annotation{#n ranges="r"}\n${original}\n:::`;
    const source = 'Before ::%%limr%%{<#r}word::%%limr%%{>#r} after.\n\n' + first + definition.replace(/\n/g, '\n' + continuation) + '\n\nTail paragraph.';
    const { runtime } = setup(source);
    expect(runtime.document.getSnapshot().annotations.find(item => item.id === 'n')?.data).toEqual({ body: original });
    const body = 'Updated **body**\n\n- nested\n  line';
    runtime.commands.updateAnnotation('n', { data: { body } });
    const snapshot = runtime.document.getSnapshot();
    expect(snapshot.annotations.find(item => item.id === 'n')?.data).toEqual({ body });
    expect(quotes(runtime, 'n')).toEqual(['word']);
    expect(snapshot.source).toContain(first + ':::limr-annotation');
    expect(snapshot.source).toContain('\n' + continuation + 'Updated **body**\n' + continuation);
    expect(snapshot.source).toContain('\n\nTail paragraph.');
    runtime.commands.removeAnnotation('n');
    expect(runtime.document.getSnapshot().annotations).toHaveLength(0);
    expect(runtime.document.getSnapshot().source).toContain('Before word after.');
    expect(runtime.document.getSnapshot().source).toContain('\n\nTail paragraph.');
  });
  it.each(['```js\nopen', '<!-- comment', '<script>\ncontent', '```mermaid\nflowchart LR\nA-->B'])('does not hide appended definitions inside an unclosed block: %s', tail => {
    const source = `word\n\n${tail}`, { runtime, accept } = setup(source);
    expect(() => add(runtime, [{ start: 0, end: 4 }])).toThrow('trailing');
    expect(runtime.document.getSnapshot().source).toBe(source);
    expect(accept).not.toHaveBeenCalled();
  });
  it.each(['id', 'ranges', 'type'])('rejects reserved annotation data %s instead of replacing definition identity', name => {
    const { runtime, accept } = setup('word');
    expect(() => runtime.commands.addAnnotation({ id: 'new', type: 'footnote', range: { start: 0, end: 4 }, data: { body: 'Note', [name]: 'overridden' } }, { highlight: false, target: 'source' })).toThrow('reserved');
    expect(runtime.document.getSnapshot().source).toBe('word');
    expect(accept).not.toHaveBeenCalled();
  });
});
