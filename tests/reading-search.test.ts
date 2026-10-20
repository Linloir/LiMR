import { expect, it } from 'vitest';
import { ReaderRuntime } from '../src/react/runtime';
import { standard } from '../src/extensions/standard';
import { ReadingSearch } from '../src/react/reading-search';
import { windowedReadingProjection } from '../src/react/windowed-copy';
import { rangeOf } from '../src/core';

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
