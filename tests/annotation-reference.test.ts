import { expect, test } from 'vitest';
import { annotationReferenceRange, createDocument } from '../src/core';
import { standard } from '../src/extensions';
import { annotationReferenceText, createAnnotationReferenceReader, fitPointReference } from '../src/components/annotation-reference';

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

test('paired annotation excerpts use exact prose and literal code mappings', () => {
  const pair = (id: string, text: string) => `::%%limr%%{<#${id}}${text}::%%limr%%{>#${id}}`;
  const source = `Before ${pair('prose', 'marked &amp; **words**')} after.\n\n\`pre ${pair('inline', '&amp; literal')} post\`\n\n\`\`\`ts\nconst value = ${pair('code', 'readCache()')};\n\`\`\`\n\n`
    + ['prose', 'inline', 'code'].map(id => `:::limr-annotation{#${id} type="footnote"}\nNote\n:::`).join('\n\n');
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  expect(document.occurrences.map(occurrence => annotationReferenceText(document, occurrence))).toEqual(['marked & words', '&amp; literal', 'readCache()']);
});

test('sidebar reference projection is lazy, cached per occurrence and refreshed for a new snapshot', () => {
  const source = 'Visible **words**<ref id="one" />.\n\n<ref id="one">Scoped &amp; words</ref>.\n\n<citation id="one" title="One" />';
  const engine = createDocument(source, { extensions: standard() });
  const document = engine.getSnapshot();
  let reads = 0;
  const observed = { ...document, get blocks() { reads++; return document.blocks; } };
  const reference = createAnnotationReferenceReader(observed);
  expect(reads).toBe(0);
  expect(reference(document.occurrences[0])).toBe('…Visible words…');
  const firstReads = reads;
  expect(firstReads).toBeGreaterThan(0);
  for (let index = 0; index < 1000; index++) expect(reference(document.occurrences[0])).toBe('…Visible words…');
  expect(reads).toBe(firstReads);
  expect(reference(document.occurrences[1])).toBe('Scoped & words');
  expect(reads).toBeGreaterThan(firstReads);
  engine.update(source.replace('Visible', 'Updated'));
  const updated = engine.getSnapshot();
  expect(createAnnotationReferenceReader(updated)(updated.occurrences[0])).toBe('…Updated words…');
});

test('lazy sidebar references retain original and translated scoped excerpts', () => {
  const source = '<translations>\n\n<origin>\n\n<ref id="one">Original **text**</ref>\n\n</origin>\n\n<translation>\n\n<ref id="one">译文 **内容**</ref>\n\n</translation>\n\n</translations>\n\n<citation id="one" title="One" />';
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  const reference = createAnnotationReferenceReader(document);
  expect(document.occurrences.map(reference)).toEqual(['Original text', '译文 内容']);
});
