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
  return resolveAnnotationAnchors(annotation, snapshot).map(anchor => snapshot.source.slice(anchor.range.start, anchor.range.end));
}

describe('source annotation writer boundaries', () => {
  it('splits repeated range IDs when one occurrence is removed and preserves other annotations', () => {
    const source = '==one==[^%%limr:r%%] and ==two==[^%%limr:r%%]\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::\n\n:::limr-annotation{#q ranges="r" type="question"}\nBoth question\n:::';
    const { runtime } = setup(source);
    const annotation = runtime.document.getSnapshot().annotations.find(item => item.id === 'n')!;
    runtime.commands.updateAnnotation('n', { anchors: annotation.anchors!.slice(1) });
    expect(quotes(runtime, 'n')).toEqual(['two']);
    expect(quotes(runtime, 'q')).toEqual(['one', 'two']);
    expect(runtime.document.getSnapshot().annotations.find(item => item.id === 'q')!.data).toEqual({ body: 'Both question' });
  });
  it('removes one occurrence from a repeated range without restoring it on reparse', () => {
    const source = '==one==[^%%limr:r%%] and ==two==[^%%limr:r%%]\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::';
    const { runtime } = setup(source);
    runtime.commands.removeAnnotationsAt([{ start: 2, end: 5 }]);
    expect(runtime.document.getSnapshot().source).toMatch(/^one and ==two==/);
    expect(quotes(runtime, 'n')).toEqual(['two']);
  });
  it('adds to only one occurrence of an existing shared named range', () => {
    const source = '==one==[^%%limr:r%%] and ==two==[^%%limr:r%%]\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nBoth\n:::';
    const { runtime } = setup(source);
    add(runtime, [runtime.document.getSnapshot().annotations[0].anchors![1].range]);
    expect(quotes(runtime, 'new')).toEqual(['two']);
    expect(quotes(runtime, 'n')).toEqual(['one', 'two']);
  });
  it.each([
    ['existing inner range', 'Before ==words==[^%%limr:r%%] after.\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nNote\n:::', [{ start: 10, end: 12 }]],
    ['new intersecting ranges', 'abcdefgh', [{ start: 1, end: 5 }, { start: 3, end: 7 }]],
    ['new nested ranges', 'abcdefgh', [{ start: 1, end: 7 }, { start: 3, end: 5 }]],
    ['partial emphasis', '**bold** plain', [{ start: 4, end: 11 }]],
    ['inside code', 'Use `const value` here', [{ start: 7, end: 11 }]],
    ['inside URL', '[text](https://example.com)', [{ start: 9, end: 14 }]],
    ['half entity', 'An &amp; entity', [{ start: 5, end: 8 }]],
    ['adjacent delimiter', 'word=value', [{ start: 0, end: 4 }]],
    ['code point', 'Use `code` here', [{ start: 6, end: 6 }]],
    ['half Unicode character', 'A 😀 glyph', [{ start: 2, end: 3 }]],
    ['point after inline highlight', '==word== next', [{ start: 8, end: 8 }]],
  ] as const)('rejects %s before publishing any source change', (_name, source, ranges) => {
    const { runtime, accept } = setup(source);
    expect(() => add(runtime, [...ranges])).toThrow();
    expect(runtime.document.getSnapshot().source).toBe(source);
    expect(accept).not.toHaveBeenCalled();
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
