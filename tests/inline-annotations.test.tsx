import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { annotationReferenceRange, createDocument, mapText, rangeOf, walk, type MarkdownNode } from '../src/core';
import { inlineHighlights, replaceExtension, standard } from '../src';
import { Markdown } from '../src/react';
import { ReaderRuntime } from '../src/react/runtime';

const extensions = standard();
const parse = (source: string, streaming = false) => createDocument(source, { extensions, streaming }).getSnapshot();
describe('Markdown-authored highlights and footnotes', () => {
  it('maps rich, escaped and decoded highlighted text to the original UTF-16 source', () => {
    const source = 'First\r\n\r\n==blue **bold** &amp; 😀 \\*literal\\*==';
    const snapshot = parse(source), annotation = snapshot.annotations[0];
    expect(annotation).toMatchObject({ type: 'highlight', data: { readOnly: true, style: 'background' } });
    expect(source.slice(annotation.range!.start, annotation.range!.end)).toBe('blue **bold** &amp; 😀 \\*literal\\*');
    const texts: MarkdownNode[] = [];
    snapshot.blocks.forEach(block => walk(block.node, node => { if (node.type === 'text') texts.push(node); }));
    for (const node of texts) expect(mapText(source, node.value!, rangeOf(node)).exact).toBe(true);
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html).toContain('<strong>'); expect(html).toContain('limr-highlight'); expect(html).not.toContain('==');
    const runtime = new ReaderRuntime('marks', source, false, { extensions });
    expect([...runtime.decorations.get().highlights.values()]).toHaveLength(1);
    runtime.dispose();
  });
  it('ignores literal syntax inside code/math, escaped punctuation and entities', () => {
    const snapshot = parse('`==code==` $==math==$ \\==escaped\\== &#61;&#61;entity&#61;&#61;\n\n```md\n==fenced==\n```');
    expect(snapshot.annotations).toHaveLength(0);
    expect(parse('===not a mark===\n\n==real==').annotations).toHaveLength(1);
  });
  it('lets modules override the default highlight color', () => {
    const html = renderToStaticMarkup(<Markdown source="==blue==" extensions={replaceExtension(standard(), inlineHighlights({ color: '#123456' }))} />);
    expect(html).toContain('--limr-highlight:#123456');
  });
  it('uses annotation cards instead of ordered endnotes and retains rich definition bodies', () => {
    const source = 'B[^b] A[^a] Again[^b].\n\n[^a]: First.\n\n[^b]: **Second**.\n\n    Another paragraph.\n\n        literal code';
    const snapshot = parse(source);
    expect(snapshot.occurrences.map(item => item.annotationIds)).toEqual([['footnote:b'], ['footnote:a'], ['footnote:b']]);
    expect(snapshot.footnoteOrder).toEqual([]);
    expect(snapshot.annotations.find(item => item.id === 'footnote:b')?.data).toEqual({ body: '**Second**.\n\nAnother paragraph.\n\n    literal code' });
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html.match(/data-limr-marker=/g)).toHaveLength(3);
    expect(html).not.toContain('<sup'); expect(html).not.toContain('limr-footnotes');
  });
  it('associates both adjacent forms with exactly their highlighted text', () => {
    const source = 'Before ==named **note**==[^n] and ==inline==^[Rich **note** with [link](https://example.com) and `]`].\n\n[^n]: Named body';
    const snapshot = parse(source);
    expect(snapshot.occurrences.map(item => { const range = annotationReferenceRange(snapshot, item); return source.slice(range.start, range.end); })).toEqual(['named **note**', 'inline']);
    expect(snapshot.annotations.find(item => item.id.startsWith('inline-footnote:'))?.data).toEqual({ body: 'Rich **note** with [link](https://example.com) and `]`' });
  });
  it('retains the first named footnote definition, including through streaming and edits', () => {
    const source = 'Text[^NOTE].\n\n[^note]: First body.\n\n[^NOTE]: Duplicate body.';
    const document = createDocument('', { extensions, streaming: true });
    for (const chunk of source.match(/.{1,7}|\n/g)!) document.append(chunk);
    expect(document.finish().annotations.find(item => item.id === 'footnote:note')?.data).toEqual({ body: 'First body.' });
    expect(document.update(source.replace('First body.', 'Edited first body.')).annotations.find(item => item.id === 'footnote:note')?.data).toEqual({ body: 'Edited first body.' });
  });
  it('supports the same capabilities through :: containers', () => {
    const snapshot = parse('::highlight\nHighlighted\n::\n\n::footnote{id="n"}\n**Body**\n::\n\n::footnote-ref{id="n"}\n::');
    expect(snapshot.annotations.map(item => item.type)).toEqual(['highlight', 'footnote']);
    expect(snapshot.occurrences[0].annotationIds).toEqual(['footnote:n']);
  });
  for (const source of [
    '==blue **bold** &amp; 😀==[^n]\n\n[^n]: Rich **body**\n\n    Second paragraph.',
    '> [!note] Title\n> ==inside==^[inline **body**]\n>\n> > Nested ==mark==\n\nAfter',
    '==first== and ==second==^[with [balanced] brackets and `]`]\n\nAfter',
  ]) it(`keeps incremental and fresh parsing equivalent: ${source.slice(0, 24)}`, () => {
    const document = createDocument('', { extensions, streaming: true, id: 'same' });
    for (let size = 1; size <= source.length; size++) {
      const partial = source.slice(0, size), snapshot = document.update(partial, { streaming: true });
      const fresh = createDocument(partial, { extensions, streaming: true, id: 'same' }).getSnapshot();
      expect(snapshot.blocks.map(block => block.node), `offset ${size}`).toEqual(fresh.blocks.map(block => block.node));
      expect(snapshot.annotations, `annotations at ${size}`).toEqual(fresh.annotations);
      expect(snapshot.occurrences, `occurrences at ${size}`).toEqual(fresh.occurrences);
    }
    expect(document.finish().blocks.map(block => block.node)).toEqual(parse(source).blocks.map(block => block.node));
  });
  it('keeps legacy endnotes when only the footnotes module is removed', () => {
    const html = renderToStaticMarkup(<Markdown source={'Text[^n]\n\n[^n]: Note'} extensions={standard().filter(module => module.name !== 'footnotes')} />);
    expect(html).toContain('<sup'); expect(html).toContain('limr-footnotes');
  });
  it('withholds partial highlight delimiters and inline notes with nested brackets', () => {
    for (const source of ['Before =', 'Before ==', 'Before ^[a [link](https://example.com) with more']) {
      const html = renderToStaticMarkup(<Markdown source={source} streaming />);
      expect(html).not.toContain('Before ='); expect(html).not.toContain('^['); expect(html).not.toContain('href="https://example.com"');
    }
  });
});
