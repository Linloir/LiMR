import { describe, expect, it } from 'vitest';
import { rangeOf, walk, type MarkdownNode } from '../src/core';
import { standard } from '../src/extensions/standard';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { searchWindowedDocument } from '../src/react/windowed-search';

const create = (source: string) => new ReaderRuntime('search', source, false, { extensions: standard() });
const translation = (runtime: ReaderRuntime) => {
  let found: MarkdownNode | undefined;
  runtime.document.getSnapshot().blocks.forEach(block => walk(block.node, node => { if (node.name === 'translations') found = node; }));
  return found!;
};
const pair = '<translations>\n\n<origin>\n\nOriginal shared phrase.\n\n</origin>\n\n<translation>\n\nTranslated shared phrase.\n\n</translation>\n\n</translations>';

describe('windowed visible-text search', () => {
  it('finds unmounted ordinary text with exact source ranges and hides definitions and markup', async () => {
    const source = 'Before **visible** text.\n\n[definition]: https://secret.test/\n\n<citation id="hidden" title="secret" />\n\nLast visible word.', runtime = create(source);
    expect(await searchWindowedDocument(runtime, 'visible')).toEqual([
      { start: source.indexOf('visible'), end: source.indexOf('visible') + 7 },
      { start: source.lastIndexOf('visible'), end: source.lastIndexOf('visible') + 7 },
    ]);
    expect(await searchWindowedDocument(runtime, '**')).toEqual([]);
    expect(await searchWindowedDocument(runtime, 'secret')).toEqual([]);
  });
  it('filters hidden translation matches and returns bilingual matches in visual order', async () => {
    const runtime = create(pair), node = translation(runtime);
    expect(await searchWindowedDocument(runtime, 'Translated')).toEqual([]);
    runtime.nodeStates.set(node, new Map([['translation-mode', new Store<unknown>('both')]]));
    expect(await searchWindowedDocument(runtime, 'shared')).toEqual([
      { start: pair.lastIndexOf('shared'), end: pair.lastIndexOf('shared') + 6 },
      { start: pair.indexOf('shared'), end: pair.indexOf('shared') + 6 },
    ]);
    runtime.nodeStates.get(node)!.get('translation-mode')!.set('translation');
    expect(await searchWindowedDocument(runtime, 'Original')).toEqual([]);
  });
  it('searches media labels and math payloads without atomic clipboard delimiters or URLs', async () => {
    const source = '![Chart label](/private-image-url.png) and $x^2$.\n\n<video src="https://private-video-url.test/movie.mp4" title="Lecture title" />';
    const runtime = create(source);
    expect(await searchWindowedDocument(runtime, 'Chart label')).toHaveLength(1);
    expect(await searchWindowedDocument(runtime, 'Lecture title')).toHaveLength(1);
    expect(await searchWindowedDocument(runtime, 'x^2')).toHaveLength(1);
    expect(await searchWindowedDocument(runtime, '$x^2$')).toEqual([]);
    expect(await searchWindowedDocument(runtime, 'private-image-url')).toEqual([]);
    expect(await searchWindowedDocument(runtime, 'private-video-url')).toEqual([]);
  });
  it('finds phrases across inline formatting with an explicit block navigation fallback', async () => {
    const runtime = create('A **formatted** phrase appears.\n\nNext block.');
    expect(await searchWindowedDocument(runtime, 'formatted phrase')).toEqual([rangeOf(runtime.document.getSnapshot().blocks[0].node)]);
    expect(await searchWindowedDocument(runtime, 'appears.\n\nNext')).toEqual([]);
  });
  it('does not assign a later literal anchor to an earlier styled occurrence in the same block', async () => {
    const runtime = create('**foo**bar appears before literal foobar.');
    const block = rangeOf(runtime.document.getSnapshot().blocks[0].node);
    expect(await searchWindowedDocument(runtime, 'foobar')).toEqual([block, block]);
  });
  it('preserves exact CRLF/entity/escaped source boundaries where a raw match exists', async () => {
    const source = 'Before &amp; escaped \\*value\\*\r\nnext word.', runtime = create(source);
    const from = source.indexOf('next');
    expect(await searchWindowedDocument(runtime, 'next word')).toEqual([{ start: from, end: from + 9 }]);
    expect(await searchWindowedDocument(runtime, '&')).toEqual([{ start: source.indexOf('&'), end: source.indexOf('&') + 1 }]);
  });
  it('escapes literal query syntax and respects case and result limits', async () => {
    const runtime = create('A+B and a+b then A+B.');
    expect(await searchWindowedDocument(runtime, 'a+b')).toHaveLength(3);
    expect(await searchWindowedDocument(runtime, 'a+b', { caseSensitive: true })).toHaveLength(1);
    expect(await searchWindowedDocument(runtime, 'A+B', { limit: 2 })).toHaveLength(2);
    expect(await searchWindowedDocument(runtime, '')).toEqual([]);
  });
  it('yields during a long search and observes cancellation without returning stale results', async () => {
    const runtime = create(Array.from({ length: 800 }, (_, i) => `Paragraph ${i}: ${'reading words '.repeat(80)}`).join('\n\n'));
    const controller = new AbortController(), progress: number[] = [];
    const search = searchWindowedDocument(runtime, 'missing needle', { signal: controller.signal, onProgress: value => { progress.push(value); controller.abort(); } });
    await expect(search).rejects.toMatchObject({ name: 'AbortError' });
    expect(progress.length).toBeGreaterThan(0);
    expect(progress[0]).toBeLessThan(runtime.document.getSnapshot().source.length);
  });
  it('rejects a search whose document presentation changes between batches', async () => {
    const runtime = create('No matching query here.');
    await expect(searchWindowedDocument(runtime, 'missing', { onProgress: () => runtime.presentation.set(runtime.presentation.get() + 1) })).rejects.toMatchObject({ name: 'AbortError' });
  });
});
