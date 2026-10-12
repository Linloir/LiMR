import { expect, test } from 'vitest';
import { createDocument } from '../src/core';
import { standard } from '../src/extensions';
import { annotationReferenceText } from '../src/components/annotation-reference';

test('anchored excerpts preserve readable rich text, entities and partial selections', () => {
  const source = '# 标题\n\n前文 **重要内容**，&amp; `code` 后文。';
  const document = createDocument(source).getSnapshot();
  const quote = (start: number, end: number) => annotationReferenceText(document, { id: 'a', annotationIds: ['a'], range: { start, end } });
  expect(quote(source.indexOf('重要'), source.indexOf(' 后文'))).toBe('重要内容，& code');
  expect(quote(source.indexOf('重要') + 1, source.indexOf('重要') + 3)).toBe('要内');
});

test('embedded citation excerpts use the surrounding paragraph without reference markup', () => {
  const source = '# 标题\n\n关联 **内容**<ref id="one" /> 与更多内容<ref id="two" />。\n\n<citation id="one" title="One" />\n\n<citation id="two" title="Two" />';
  const document = createDocument(source, { extensions: standard() }).getSnapshot();
  for (const occurrence of document.occurrences) expect(annotationReferenceText(document, occurrence)).toBe('关联 内容 与更多内容。');
  expect(document.occurrences).toHaveLength(2);
});
