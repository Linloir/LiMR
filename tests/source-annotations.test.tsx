import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { annotationReferenceRange, createDocument, walk, type Annotation, type MarkdownNode } from '../src/core';
import { standard } from '../src/extensions';
import { Markdown } from '../src/react';

const extensions = standard();
const parse = (source: string, streaming = false) => createDocument(source, { extensions, streaming, id: 'source' }).getSnapshot();
const definition = (id: string, ranges: string, type = 'footnote', body = 'A **note**.', attrs = '') => `:::limr-annotation{#${id} ranges="${ranges}" type="${type}" ${attrs}}\n${body}\n:::`;
const text = (source: string, annotation: Annotation) => annotation.anchors?.map(anchor => source.slice(anchor.range.start, anchor.range.end));

describe('source-authored named annotations', () => {
  it('uses reserved labels without fallback footnote definitions and groups annotations on one range', () => {
    const source = `abcd==efg==[^%%limr:r1%%]\n\n${definition('h1', 'r1', 'highlight', '', 'color="#E5C07B" hidden="false"')}\n\n${definition('n1', 'r1')}\n\n${definition('q1', 'r1', 'question', 'Why cache?')}`;
    const document = parse(source);
    expect(document.diagnostics).toEqual([]);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['h1', 'n1', 'q1']);
    for (const annotation of document.annotations) expect(text(source, annotation)).toEqual(['efg']);
    expect(document.annotations[0].data).toEqual({ color: '#E5C07B', hidden: false, style: 'background', readOnly: true });
    expect(document.occurrences).toHaveLength(1);
    expect(document.occurrences[0].annotationIds).toEqual(['n1', 'q1']);
    const range = document.annotationRanges.get('r1')![0];
    expect(source.slice(range.syntaxRange.start, range.syntaxRange.end)).toBe('==efg==');
    expect(source.slice(range.markerRange.start, range.markerRange.end)).toBe('[^%%limr:r1%%]');
    expect(annotationReferenceRange(document, document.occurrences[0])).toEqual(range.range);
  });
  it('suppresses optional Markdown fallback definitions and preserves case-sensitive range ids', () => {
    const source = `==Named==[^%%limr:R1%%] and ==other==[^%%limr:r1%%].\n\n[^%%limr:R1%%]: Fallback body\n\n${definition('n1', 'R1')}`;
    const document = parse(source);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['n1']);
    expect(text(source, document.annotations[0])).toEqual(['Named']);
    expect(document.occurrences).toHaveLength(1);
    expect(document.footnoteOrder).toEqual([]);
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html).not.toContain('Fallback body'); expect(html).not.toContain('%%limr');
  });
  it('supports several ranges per annotation, repeated ranges, last IDs and last highlight per named range', () => {
    const source = `==one==[^%%limr:a%%] ==two==[^%%limr:b%%] ==again==[^%%limr:a%%]\n\n${definition('h1', 'a b', 'highlight', '', 'color="red"')}\n\n${definition('h2', 'a', 'highlight', '', 'hidden="true"')}\n\n${definition('n1', 'a', 'footnote', 'Old')}\n\n${definition('n1', 'a,b', 'question', 'New')}`;
    const document = parse(source), get = (id: string) => document.annotations.find(annotation => annotation.id === id)!;
    expect(text(source, get('h1'))).toEqual(['two']);
    expect(text(source, get('h2'))).toEqual(['one', 'again']);
    expect(get('h2').data).toMatchObject({ hidden: true });
    expect(get('n1')).toMatchObject({ type: 'question', data: { body: 'New' } });
    expect(get('n1').source?.ranges).toHaveLength(2);
    expect(document.occurrences.map(occurrence => occurrence.annotationIds)).toEqual([['n1'], ['n1'], ['n1']]);
    const replacement = parse(source + `\n\n${definition('h1', 'a b', 'highlight', '', 'color="blue"')}`);
    expect(text(source, replacement.annotations.find(annotation => annotation.id === 'h1')!)).toEqual(['one', 'again', 'two']);
    expect(replacement.annotations.find(annotation => annotation.id === 'h2')?.anchors).toEqual([]);
  });
  it('keeps unsupported types and missing range definitions inert but available to modules', () => {
    const document = parse(`==one==[^%%limr:a%%]\n\n${definition('custom', 'a', 'review', 'Body', 'status="draft"')}\n\n${definition('orphan', 'absent')}`);
    expect(document.annotations[0]).toMatchObject({ type: 'review', data: { body: 'Body', status: 'draft' } });
    expect(document.annotations[1].anchors).toEqual([]);
    expect(document.occurrences).toHaveLength(1);
  });
  for (const id of ['citation', 'ref', 'footnote', 'footnote-ref', 'question', 'a:b', 'a*bold*', 'a`code`']) it(`recognizes reserved ids independently of inline tokenizers: ${id}`, () => {
    const source = `==word==[^%%limr:${id}%%]\n\n${definition('n', id)}`;
    const document = parse(source);
    expect([...document.annotationRanges.keys()]).toEqual([id]);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['n']);
    expect(text(source, document.annotations[0])).toEqual(['word']);
    expect(document.occurrences).toHaveLength(1);
  });
  for (const syntax of [
    '::limr-annotation{#n1 ranges="a" type="footnote"}\n**Body**\n::',
    '<limr-annotation id="n1" ranges="a" type="footnote">**Body**</limr-annotation>',
  ]) it(`supports ${syntax.startsWith('<') ? 'HTML' : 'two-colon fallback'} definitions`, () => {
    const source = `==one==[^%%limr:a%%]\n\n${syntax}`;
    expect(parse(source).annotations[0]).toMatchObject({ id: 'n1', data: { body: '**Body**' } });
  });
  it('ignores escaped and literal reserved labels, without altering ordinary footnotes', () => {
    const source = `\`==code==[^%%limr:a%%]\` \\[^%%limr:a%%] [^normal] [^%%other:a%%]\n\n[^normal]: Normal\n\n[^%%other:a%%]: Other\n\n${definition('n1', 'a')}`;
    const document = parse(source);
    expect(document.annotationRanges.size).toBe(0);
    expect(document.occurrences.map(occurrence => occurrence.annotationIds)).toEqual([['footnote:normal'], ['footnote:%%other:a%%']]);
    for (const occurrence of document.occurrences) expect(annotationReferenceRange(document, occurrence)).toEqual({ start: occurrence.range.start, end: occurrence.range.start });
  });
  it('keeps body syntax out of the main document annotations', () => {
    const document = parse(`==one==[^%%limr:a%%]\n\n${definition('n1', 'a', 'footnote', 'Nested ==highlight==^[note] and <ref id="x" />')}`);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['n1']);
    expect(document.occurrences).toHaveLength(1);
  });
  for (const source of [
    `Before ==rich **text** &amp; 😀==[^%%limr:a%%]\n\n${definition('n1', 'a')}\n\nAfter`,
    `==word==[^%%limr:a%%]\n\n[^%%limr:a%%]: Fallback\n\n${definition('h1', 'a', 'highlight', '')}\n\n${definition('n1', 'a')}\n\nAfter`,
  ]) it('keeps incremental and fresh parsing identical at every streamed character', () => {
    const document = createDocument('', { extensions, streaming: true, id: 'source' });
    for (let size = 1; size <= source.length; size++) {
      const partial = source.slice(0, size), snapshot = document.update(partial, { streaming: true }), fresh = parse(partial, true);
      expect(snapshot.blocks.map(block => block.node), `tree at ${size}`).toEqual(fresh.blocks.map(block => block.node));
      expect(snapshot.annotations, `annotations at ${size}`).toEqual(fresh.annotations);
      expect(snapshot.occurrences, `occurrences at ${size}`).toEqual(fresh.occurrences);
      expect(snapshot.annotationRanges, `ranges at ${size}`).toEqual(fresh.annotationRanges);
    }
    expect(document.finish().annotations).toEqual(parse(source).annotations);
    expect(document.getSnapshot().metrics.reusedBlocks).toBeGreaterThan(0);
  });
  it('does not retain a hidden default highlight on a reserved reference node', () => {
    const document = parse('==text==[^%%limr:a%%]');
    const nodes: MarkdownNode[] = [];
    document.blocks.forEach(block => walk(block.node, node => { if (node.type === 'embeddedHighlight') nodes.push(node); }));
    expect(nodes).toHaveLength(1); expect(nodes[0].annotation).toBeUndefined();
    expect(document.annotations).toEqual([]); expect(document.occurrences).toEqual([]);
  });
});
