import { expect, test } from 'vitest';
import { annotationReferenceRange, createDocument } from '../src/core';
import { standard } from '../src/extensions';
import { annotationReferenceText, fitPointReference } from '../src/components/annotation-reference';

test('anchored excerpts preserve readable rich text, entities and partial selections', () => {
  const source = '# 标题\n\n前文 **重要内容**，&amp; `code` 后文。';
  const document = createDocument(source).getSnapshot();
  const quote = (start: number, end: number) => annotationReferenceText(document, { id: 'a', annotationIds: ['a'], range: { start, end } });
  expect(quote(source.indexOf('重要'), source.indexOf(' 后文'))).toBe('重要内容，& code');
  expect(quote(source.indexOf('重要') + 1, source.indexOf('重要') + 3)).toBe('要内');
});

test('point citation excerpts use preceding text without changing their source spans', () => {
  const source = '# 标题\n\n关联 **内容**<ref id="one" /> 与更多内容<ref id="two" />。\n\n<citation id="one" title="One" />\n\n<citation id="two" title="Two" />';
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  for (const occurrence of document.occurrences) {
    expect(annotationReferenceText(document, occurrence)).toMatch(/^…关联 内容(?: 与更多内容)?…$/);
    expect(annotationReferenceRange(document, occurrence)).toEqual({ start: occurrence.range.start, end: occurrence.range.start });
    expect(source.slice(occurrence.range.start, occurrence.range.end)).toMatch(/^<ref /);
  }
  expect(document.occurrences).toHaveLength(2);
});

test('scoped references use only their explicit rich content', () => {
  const source = '# Before <ref id="one">Heading</ref>\n\n- First paragraph.\n\n  Second <ref id="one">**paragraph**</ref>.\n\n| Left | Right |\n| --- | --- |\n| <ref id="one">Cell</ref> | Other cell |\n\n<citation id="one" title="One" />';
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  const expected = ['Heading', '**paragraph**', 'Cell'];
  expect(document.occurrences).toHaveLength(expected.length);
  document.occurrences.forEach((occurrence, index) => {
    const range = annotationReferenceRange(document, occurrence);
    expect(source.slice(range.start, range.end)).toBe(expected[index]);
    expect(source.slice(occurrence.range.start, occurrence.range.end)).toBe(`<ref id="one">${expected[index]}</ref>`);
  });
  expect(document.occurrences.map(occurrence => annotationReferenceText(document, occurrence))).toEqual(['Heading', 'paragraph', 'Cell']);
});

test('point excerpts stay inside prose and fit the suffix without splitting graphemes', () => {
  const source = 'Unrelated paragraph.\n\n普通 **脚注** &amp; `code` 在这里[^n]，后面的内容。\n\n[^n]: Definition';
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  const reference = annotationReferenceText(document, document.occurrences[0]);
  expect(reference).toBe('…普通 脚注 & code 在这里…');
  const measure = (text: string) => [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].length * 10;
  expect(fitPointReference('…前文👩‍💻尾部…', 50, measure)).toBe('…👩‍💻尾部…');
  expect(fitPointReference(reference, 50, measure)).toBe('…在这里…');
});
