import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { annotationReferenceRange, createDocument, mapText, rangeOf, selectionFromRange, walk, type Annotation, type MarkdownNode } from '../src/core';
import { standard } from '../src/extensions';
import { Markdown } from '../src/react';
import { mapLiteral } from '../src/react/literal';

const extensions = standard();
const parse = (source: string, streaming = false) => createDocument(source, { extensions, streaming, id: 'source' }).getSnapshot();
const definition = (id: string, ranges: string, type = 'footnote', body = 'A **note**.', attrs = '') => `:::limr-annotation{#${id} ranges="${ranges}" type="${type}" ${attrs}}\n${body}\n:::`;
const open = (id: string) => `::%%limr%%{<#${id}}`, close = (id: string) => `::%%limr%%{>#${id}}`;
const pair = (id: string, value: string) => `${open(id)}${value}${close(id)}`;
const text = (source: string, annotation: Annotation) => annotation.anchors?.map(anchor => source.slice(anchor.range.start, anchor.range.end));
const nodes = (source: string) => { const result: MarkdownNode[] = []; parse(source).blocks.forEach(block => walk(block.node, node => result.push(node))); return result; };

describe('source-authored paired annotations', () => {
  it('groups annotations on one explicit range and exposes original boundary spans', () => {
    const source = `abcd${pair('r1', 'efg')}\n\n${definition('h1', 'r1', 'highlight', '', 'color="#E5C07B" hidden="false"')}\n\n${definition('n1', 'r1')}\n\n${definition('q1', 'r1', 'question', 'Why cache?')}`;
    const document = parse(source);
    expect(document.diagnostics).toEqual([]);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['h1', 'n1', 'q1']);
    for (const annotation of document.annotations) expect(text(source, annotation)).toEqual(['efg']);
    expect(document.annotations[0].data).toEqual({ color: '#E5C07B', hidden: false, style: 'background', readOnly: true });
    expect(document.occurrences).toHaveLength(1);
    expect(document.occurrences[0].annotationIds).toEqual(['n1', 'q1']);
    const range = document.annotationRanges.get('r1')![0];
    expect(source.slice(range.syntaxRange.start, range.syntaxRange.end)).toBe(pair('r1', 'efg'));
    expect(source.slice(range.openingRange.start, range.openingRange.end)).toBe(open('r1'));
    expect(source.slice(range.markerRange.start, range.markerRange.end)).toBe(close('r1'));
    expect(annotationReferenceRange(document, document.occurrences[0])).toEqual(range.range);
    expect(renderToStaticMarkup(<Markdown source={source} />)).not.toContain('%%limr');
  });

  it('supports independent crossings, nesting, multiple paragraphs and partial formatting/link boundaries', () => {
    const source = `${open('a')}before **bo${open('b')}ld**\n\n[li${close('a')}nk](https://example.com) after${close('b')}\n\n${definition('a-note', 'a')}\n\n${definition('b-note', 'b')}`;
    const document = parse(source), tree = nodes(source);
    expect(document.diagnostics).toEqual([]);
    expect(document.annotationRanges.size).toBe(2);
    expect(text(source, document.annotations[0])).toEqual([`before **bo${open('b')}ld**\n\n[li`]);
    expect(text(source, document.annotations[1])).toEqual([`ld**\n\n[li${close('a')}nk](https://example.com) after`]);
    expect(tree.find(node => node.type === 'strong')?.children?.map(node => node.value).join('')).toBe('bold');
    expect(tree.find(node => node.type === 'link')?.children?.map(node => node.value).join('')).toBe('link');
    const nested = parse(`${pair('a', `first ${pair('b', 'inside')} last`)}\n\n${definition('a-note', 'a')}\n\n${definition('b-note', 'b')}`);
    expect([...nested.annotationRanges.keys()]).toEqual(['b', 'a']);
  });

  it('supports repeated sequential ranges, last definitions and last highlight per range', () => {
    const source = `${pair('a', 'one')} ${pair('b', 'two')} ${pair('a', 'again')}\n\n${definition('h1', 'a b', 'highlight', '', 'color="red"')}\n\n${definition('h2', 'a', 'highlight', '', 'hidden="true"')}\n\n${definition('n1', 'a', 'footnote', 'Old')}\n\n${definition('n1', 'a,b', 'question', 'New')}`;
    const document = parse(source), get = (id: string) => document.annotations.find(annotation => annotation.id === id)!;
    expect(text(source, get('h1'))).toEqual(['two']);
    expect(text(source, get('h2'))).toEqual(['one', 'again']);
    expect(get('n1')).toMatchObject({ type: 'question', data: { body: 'New' } });
    expect(get('n1').source?.ranges).toHaveLength(2);
    expect(document.occurrences.map(occurrence => occurrence.annotationIds)).toEqual([['n1'], ['n1'], ['n1']]);
  });

  it('defaults ranges to definition id, preserves case, supports unknown module types and marker-only annotations', () => {
    const source = `${pair('R1', '')} ${pair('r1', 'literal')}\n\n:::limr-annotation{#R1 type="review" status="draft"}\nBody\n:::`;
    const document = parse(source);
    expect(document.annotations[0]).toMatchObject({ type: 'review', data: { body: 'Body', status: 'draft' } });
    expect(document.annotations[0].anchors?.[0].range).toEqual({ start: open('R1').length, end: open('R1').length });
    expect([...document.annotationRanges.keys()]).toEqual(['R1']);
    expect(document.occurrences).toHaveLength(1);
  });

  for (const content of [
    `${pair('a', 'plain')}`,
    `\`${pair('a', 'inline')}\``,
    `\`\`\`md\n${pair('a', 'fenced')}\n\`\`\``,
  ]) it('requires an actual closed definition before consuming markers', () => {
    expect(parse(content).annotationRanges.size).toBe(0);
    expect(renderToStaticMarkup(<Markdown source={content} />)).toContain('%%limr');
    expect(parse(`${content}\n\n:::limr-annotation{#n ranges="a"}\nIncomplete`, true).annotationRanges.size).toBe(0);
    for (const example of [`\`\`\`md\n${definition('n', 'a')}\n\`\`\``, definition('n', 'a').split('\n').map(line => `    ${line}`).join('\n'), `\`${definition('n', 'a').replaceAll('\n', ' ')}\``]) {
      expect(parse(`${content}\n\n${example}`).annotationRanges.size).toBe(0);
    }
  });

  it('treats escaped, orphan, duplicate-open and invalid IDs as literal source', () => {
    for (const content of [open('a'), close('a'), `${open('a')}one${open('a')}two${close('a')}${close('a')}`, `\\${open('a')}escaped${close('a')}`, '::%%limr%%{<#a b}value::%%limr%%{>#a b}']) {
      const source = `${content}\n\n${definition('n', 'a')}`;
      expect(parse(source).annotationRanges.size).toBe(0);
      expect(renderToStaticMarkup(<Markdown source={source} />)).toContain('%%limr');
    }
  });

  it('removes the legacy reserved-label semantics while retaining ordinary highlights and GFM footnotes', () => {
    const source = `==standalone== and ==word==[^%%limr:a%%]\n\n[^%%limr:a%%]: Ordinary footnote\n\n${definition('n', 'a')}`;
    const document = parse(source);
    expect(document.annotationRanges.size).toBe(0);
    expect(document.annotations.find(annotation => annotation.id === 'footnote:%%limr:a%%')?.data).toMatchObject({ body: 'Ordinary footnote' });
    expect(document.annotations.some(annotation => annotation.type === 'highlight')).toBe(true);
    expect(document.annotations.find(annotation => annotation.id === 'n')?.anchors).toEqual([]);
    expect(document.occurrences[0].annotationIds).toEqual(['footnote:%%limr:a%%']);
  });

  it('keeps code text and exact mappings through active boundary omissions', () => {
    const source = `\`let ${pair('inline', 'x = &amp;')}\`\n\n\`\`\`js\r\nconst ${pair('fenced', 'n = 1')}\r\n\`\`\`\n\n${definition('i', 'inline')}\n\n${definition('f', 'fenced')}`;
    const tree = nodes(source);
    for (const [type, expected] of [['inlineCode', 'let x = &amp;'], ['code', 'const n = 1']]) {
      const node = tree.find(node => node.type === type)!;
      expect(node.value).toBe(expected);
      const mapped = mapLiteral(source, node);
      expect(mapped.exact).toBe(true);
      expect(mapped.starts.map((start, index) => source.slice(start, mapped.ends[index])).join('')).toBe(expected);
    }
    expect(parse(source).occurrences).toHaveLength(2);
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html).not.toContain('%%limr');
    expect((html.match(/data-limr-marker=/g) ?? [])).toHaveLength(2);
  });

  it('preserves decoded entity, escape and UTF-16 source mappings around crossing boundaries', () => {
    const source = `a${open('a')}&amp; 😀 \\*${open('b')}tail${close('a')} end${close('b')}\n\n${definition('a-note', 'a')}\n\n${definition('b-note', 'b')}`;
    const node = nodes(source).find(node => node.type === 'text')!;
    expect(node.value).toBe('a& 😀 *tail end');
    const mapped = mapText(source, node.value!, rangeOf(node), { omissions: node.sourceOmissions });
    expect(mapped.exact).toBe(true);
    expect(source.slice(mapped.starts[1], mapped.ends[1])).toBe('&amp;');
    expect(source.slice(mapped.starts[6], mapped.ends[6])).toBe('\\*');
  });

  it('supports a range enclosing a complete fenced block without activating its example definitions', () => {
    const source = `${pair('outer', `\`\`\`md\n${pair('example', 'demo')}\n${definition('example-note', 'example')}\n\`\`\``)}\n\n${definition('outer-note', 'outer')}`;
    const document = parse(source);
    expect([...document.annotationRanges.keys()]).toEqual(['outer']);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['outer-note']);
    expect(document.blocks[0].node.type).toBe('code');
    expect(document.blocks[0].node.value).toContain(open('example'));
  });

  it('resolves only the final duplicate definition when authorizing range markers', () => {
    const source = `${pair('a', 'old')} ${pair('b', 'new')}\n\n${definition('n', 'a')}\n\n${definition('n', 'b')}`;
    const document = parse(source);
    expect([...document.annotationRanges.keys()]).toEqual(['b']);
    expect(document.annotations[0].source?.ranges).toHaveLength(2);
    expect(nodes(source).filter(node => node.type === 'text').map(node => node.value).join('')).toContain(open('a'));
  });

  it('keeps definitions inside literal directives and math blocks inert', () => {
    for (const content of [
      `:::code{lang="markdown"}\n${definition('n', 'a')}\n:::`,
      `::code{lang="markdown"}\n${definition('n', 'a')}\n::`,
      `:::mermaid\n${definition('n', 'a')}\n:::`,
      `$$\n${definition('n', 'a')}\n$$`,
    ]) {
      const source = `${pair('a', 'literal')}\n\n${content}`;
      expect(parse(source).annotationRanges.size, content).toBe(0);
      expect(parse(source).annotations, content).toEqual([]);
    }
  });

  it('requires definitions to survive the registered JSX whitelist', () => {
    for (const tag of ['unknown', 'div']) {
      const source = `${pair('a', 'word')}\n\n<${tag}>\n\n${definition('n', 'a')}\n\n</${tag}>`;
      const document = parse(source);
      expect(document.annotationRanges.size, tag).toBe(0);
      expect(document.annotations, tag).toEqual([]);
      expect(nodes(source).find(node => node.type === 'text')?.value).toBe(pair('a', 'word'));
    }
    const source = `${pair('a', 'word')}\n\n<definition>\n\n${definition('n', 'a')}\n\n</definition>`;
    expect(parse(source).annotations.map(annotation => annotation.id)).toEqual(['n']);
    expect([...parse(source).annotationRanges.keys()]).toEqual(['a']);
  });

  it('leaves unresolved and escaped boundaries literal without breaking adjacent JSX', () => {
    for (const content of [pair('a', 'word'), `\\${open('a')}word${close('a')}`, `${open('a')}word`]) {
      const source = `${content}\n\n<definition title="Term">\n\nBody\n\n</definition>`;
      const document = parse(source);
      expect(document.diagnostics).toEqual([]);
      expect(document.annotationRanges.size).toBe(0);
      expect(nodes(source).some(node => node.type === 'component' && node.name === 'definition')).toBe(true);
    }
    const embedded = ':::limr-annotation{#n ranges=a type=footnote}\nNote\n:::';
    const source = `${pair('a', 'word')}\n\n<definition title="prefix\n\n${embedded}\n\nsuffix" />`;
    expect(parse(source).diagnostics).toEqual([]);
    expect(parse(source).annotations).toEqual([]);
    expect(parse(source).annotationRanges.size).toBe(0);
  });

  it('preserves exact source mappings for paired ranges in component attributes', () => {
    for (const component of [
      `<definition title="before ${pair('a', 'word')} after">\n\nBody\n\n</definition>`,
      `:::definition{title="before ${pair('a', 'word')} after"}\nBody\n:::`,
    ]) {
      const source = `${component}\n\n${definition('n', 'a')}`;
      const document = parse(source), node = document.blocks[0].node.attributeNodes?.title;
      expect(node?.value).toBe('before word after');
      expect(node?.sourceOmissions).toHaveLength(2);
      const mapping = mapText(source, node!.value!, rangeOf(node!), { omissions: node!.sourceOmissions, escapes: node!.verbatimEscapes !== true });
      expect(mapping.exact).toBe(true);
      expect(source.slice(mapping.starts[7], mapping.ends[10])).toBe('word');
    }
  });

  it('supports annotations in literal code directives with exact text mapping', () => {
    const source = `:::code{lang="javascript"}\nlet ${pair('a', 'x = 1')}\n:::\n\n${definition('n', 'a')}`;
    const node = parse(source).blocks[0].node;
    expect(node.type).toBe('code');
    expect(node.value).toBe('let x = 1');
    expect(mapLiteral(source, node).exact).toBe(true);
  });

  it('preserves real blockquote annotation definitions', () => {
    const source = `${pair('a', 'word')}\n\n${definition('n', 'a').split('\n').map(line => `> ${line}`).join('\n')}`;
    expect(parse(source).annotations.map(annotation => annotation.id)).toEqual(['n']);
    expect([...parse(source).annotationRanges.keys()]).toEqual(['a']);
  });

  it('does not add empty layout blocks for standalone boundary lines', () => {
    for (const type of ['highlight', 'footnote']) {
      const source = `${open('a')}\n\nFirst\n\nSecond\n\n${close('a')}\n\n${definition('n', 'a', type)}`;
      const document = parse(source);
      expect(document.blocks.filter(block => block.node.type === 'paragraph')).toHaveLength(2);
      const html = renderToStaticMarkup(<Markdown source={source} />);
      expect((html.match(/<p(?:\s|>)/g) ?? [])).toHaveLength(2);
      if (type === 'footnote') expect((html.match(/data-limr-marker=/g) ?? [])).toHaveLength(1);
    }
  });

  it('allows a visible range to cross hidden definitions while ignoring boundaries inside their bodies', () => {
    const body = `Hidden ${pair('a', 'definition example')}`;
    const source = `${open('a')}First\n\n${definition('unbound', 'missing', 'footnote', body)}\n\nSecond${close('a')}\n\n${definition('n', 'a')}`;
    const document = parse(source), range = document.annotationRanges.get('a')!;
    expect(range).toHaveLength(1);
    expect(document.annotations.find(annotation => annotation.id === 'n')?.anchors?.[0].range).toEqual(range[0].range);
    expect(document.annotations.find(annotation => annotation.id === 'unbound')?.data).toEqual({ body });
    expect(document.occurrences).toHaveLength(1);
    expect(document.blocks.filter(block => block.node.type === 'paragraph')).toHaveLength(2);
  });

  it('keeps annotation-body syntax out of main document annotations', () => {
    const source = `${pair('a', 'one')}\n\n${definition('n', 'a', 'footnote', `Nested ==highlight==^[note] ${pair('a', 'literal')}`)}`;
    const document = parse(source);
    expect(document.annotations.map(annotation => annotation.id)).toEqual(['n']);
    expect(document.occurrences).toHaveLength(1);
    expect(document.annotations[0].data).toEqual({ body: `Nested ==highlight==^[note] ${pair('a', 'literal')}` });
  });

  for (const source of [
    `${pair('a', 'word')}\n\n<unknown>\n\n${definition('n', 'a')}\n\n</unknown>\n\nAfter`,
    `${definition('n', 'a')}\n\n${pair('a', 'before **bold**')}\n\nAfter`,
    `Before ${open('a')}rich **te${open('b')}xt** &amp; 😀${close('a')}\n\nNext ${close('b')}\n\n${definition('n', 'a')}\n\n${definition('h', 'b', 'highlight', '')}\n\nAfter`,
    `\`\`\`js\nlet ${pair('a', 'x = 1')}\n\`\`\`\n\n${definition('n', 'a')}\n\nAfter`,
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

  it('normalizes DOM-equivalent selection endpoints across known omitted boundaries only', () => {
    const source = `let ${pair('a', 'readCache()')};\n\n${definition('n', 'a')}`;
    const document = parse(source), range = document.annotationRanges.get('a')![0];
    const selected = selectionFromRange(document, { start: range.openingRange.start, end: range.markerRange.end });
    expect(selected.raw.sourceText).toBe('readCache()');
    expect(selected.raw.ranges).toEqual([range.range]);
    const literal = parse(pair('a', 'readCache()'));
    expect(selectionFromRange(literal, { start: 0, end: literal.source.length }).raw.sourceText).toBe(literal.source);
  });

  it('retains the incremental parser path for documents with ordinary Markdown only', () => {
    const document = createDocument('One\n\nTwo\n\nThree', { extensions, streaming: true });
    const snapshot = document.append(' more');
    expect(snapshot.metrics.fullParse).toBe(false);
    expect(snapshot.metrics.reusedBlocks).toBeGreaterThan(0);
  });
});
