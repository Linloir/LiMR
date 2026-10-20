import { expect, it } from 'vitest';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { standard } from '../src/extensions/standard';
import { ReadingSearch } from '../src/react/reading-search';
import { windowedReadingProjection } from '../src/react/windowed-copy';
import { rangeOf, walk, type MarkdownNode } from '../src/core';

it('maps styled, repeated, decoded and literal reading text to exact source intervals', () => {
  const source = '**foo**bar then foobar &amp; \\*value\\* and `a&b`.',
    runtime = new ReaderRuntime('projection', source, false, { extensions: standard() });
  const projection = windowedReadingProjection(runtime, rangeOf(runtime.document.getSnapshot().blocks[0].node));
  expect(projection.text).toBe('foobar then foobar & *value* and a&b.');
  for (const [text, raw] of [['foobar', 'foo**bar'], ['&', '&amp;'], ['*value*', '\\*value\\*'], ['a&b', 'a&b']]) {
    const from = projection.text.indexOf(text), range = projection.resolve({ start: from, end: from + text.length });
    expect(source.slice(range.start, range.end)).toBe(raw);
  }
});

it('starts explicit navigation at the reading anchor and wraps only at document edges', async () => {
  const source = 'First needle.\n\nMiddle reading position.\n\nSecond needle.\n\nThird needle.';
  const runtime = new ReaderRuntime('anchor', source, false, { extensions: standard() }), search = new ReadingSearch(runtime, 'needle');
  await search.initialize();
  expect(await search.move(-1, 1, source.indexOf('Middle'))).toBe(1);
  expect(await search.move(-1, -1, source.indexOf('Middle'))).toBe(0);
  expect(await search.move(-1, 1, source.length - 1)).toBe(0);
  expect(await search.move(-1, -1, 0)).toBe(2);
  search.dispose();
});

it('uses reading order within bilingual blocks when navigating from an unselected position', async () => {
  const source = '<translations>\n\n<origin>\n\nOrigin anchor needle.\n\n</origin>\n\n<translation>\n\nTranslation needle.\n\n</translation>\n\n</translations>';
  const runtime = new ReaderRuntime('bilingual', source, false, { extensions: standard() });
  let node: MarkdownNode | undefined;
  runtime.document.getSnapshot().blocks.forEach(block => walk(block.node, candidate => { if (candidate.name === 'translations') node = candidate; }));
  runtime.nodeStates.set(node!, new Map([['translation-mode', new Store<unknown>('both')]]));
  const search = new ReadingSearch(runtime, 'needle');
  await search.initialize();
  expect(search.matches.map(match => match.range.start)).toEqual([source.lastIndexOf('needle'), source.indexOf('needle')]);
  expect(await search.move(-1, 1, source.indexOf('anchor'))).toBe(1);
  expect(await search.move(-1, -1, source.indexOf('anchor'))).toBe(0);
  search.dispose();
});

it('scans the nearest unknown interval before wrapping a partial search', async () => {
  const paragraphs = Array.from({ length: 450 }, (_, index) => `Block ${index}. ${[40, 180, 340].includes(index) ? 'needle ' : ''}${'a'.repeat(10_000)}\n\n`);
  const source = paragraphs.join(''), runtime = new ReaderRuntime('partial', source, false, { extensions: standard() });
  const search = new ReadingSearch(runtime, 'needle');
  const anchor = source.indexOf('Block 240.');
  await search.initialize(anchor);
  expect(search.partial).toBe(true);
  expect(search.matches).toHaveLength(0);
  const previous = await search.move(-1, -1, anchor);
  expect(search.matches[previous].range.start).toBe(source.indexOf('needle', source.indexOf('Block 180.')));
  const next = await search.move(-1, 1, anchor);
  expect(search.matches[next].range.start).toBe(source.indexOf('needle', source.indexOf('Block 340.')));
  // A user scroll into an unscanned earlier chapter must not skip its result.
  const earlier = await search.move(-1, 1, source.indexOf('Block 30.'));
  expect(search.matches[earlier].range.start).toBe(source.indexOf('needle'));
  search.dispose();
});
it('navigates, wraps and cancels without editing the document', async () => {
  const source = '# Heading\n\nFirst **needle**.\n\nLast needle.', runtime = new ReaderRuntime('search', source, false, { extensions: standard() });
  const controller = new AbortController(), search = new ReadingSearch(runtime, 'needle', { signal: controller.signal });
  await search.initialize();
  expect(search.matches.map(match => source.slice(match.range.start, match.range.end))).toEqual(['needle', 'needle']);
  expect(search.partial).toBe(false);
  expect(await search.move(0, 1)).toBe(1);
  expect(await search.move(1, 1)).toBe(0);
  expect(await search.move(0, -1)).toBe(1);
  controller.abort();
  await expect(search.move(0, 1)).rejects.toMatchObject({ name: 'AbortError' });
  expect(runtime.document.getSnapshot().source).toBe(source);
});
