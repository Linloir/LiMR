import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDocument, rangeOf, walk, type MarkdownNode } from '../src/core';
import { calloutType, standard } from '../src/extensions';
import { Markdown, type NodeRenderer, type RendererExtension } from '../src/react';

const extensions = standard();
const parse = (source: string, streaming = false) => createDocument(source, { extensions, streaming }).getSnapshot();
const nodes = (source: string) => { const list: MarkdownNode[] = []; parse(source).blocks.forEach(block => walk(block.node, node => list.push(node))); return list; };

describe('Mermaid and nested callouts', () => {
  it('keeps diagram syntax literal, atomic and unrendered until closure', () => {
    for (const [open, close] of [['```mermaid\n', '\n```'], ['::mermaid\n', '\n::']]) {
      const code = 'flowchart LR\n  A["<word>"] --> B';
      expect(parse(open + code, true).blocks[0].node).toMatchObject({ type: 'mermaid', value: code, incomplete: true, selection: 'atomic' });
      expect(parse(open + code + close, true).blocks[0].node.incomplete).toBeUndefined();
      const html = renderToStaticMarkup(<Markdown source={open + code} streaming />);
      expect(html).toContain('data-mermaid-state="loading"');
      expect(html).not.toContain('<word>');
    }
  });
  it('supports all Obsidian aliases and case insensitive fallback', () => {
    const groups = { abstract: ['summary', 'tldr'], tip: ['hint', 'important'], success: ['check', 'done'], question: ['help', 'faq'], warning: ['caution', 'attention'], failure: ['fail', 'missing'], danger: ['error'], quote: ['cite'] };
    for (const [type, aliases] of Object.entries(groups)) for (const alias of aliases) expect(calloutType(alias.toUpperCase())).toBe(type);
    expect(calloutType('custom')).toBe('note');
    for (const type of ['note', 'abstract', 'info', 'todo', 'tip', 'success', 'question', 'warning', 'failure', 'danger', 'bug', 'example', 'quote']) {
      expect(renderToStaticMarkup(<Markdown source={`> [!${type}]\n> Body`} />)).toContain(`data-callout-type="${type}"`);
    }
  });
  it('preserves rich titles, nested quotes/callouts and original CRLF offsets', () => {
    const source = '> [!TIP]+ A **rich** &amp; 😀 title\r\n> Body *text*\r\n>\r\n> > A plain quote\r\n> >\r\n> > > [!warning]- Nested\r\n> > > More\r\n';
    const tree = nodes(source);
    expect(tree.filter(node => node.type === 'callout')).toHaveLength(2);
    expect(tree.filter(node => node.type === 'blockquote')).toHaveLength(1);
    for (const word of ['rich', 'text', 'More']) {
      const node = tree.find(node => node.value === word)!;
      expect(source.slice(rangeOf(node).start, rangeOf(node).end)).toBe(word);
    }
    const html = renderToStaticMarkup(<Markdown source={source} />);
    expect(html).toContain('<strong>'); expect(html).toContain('😀 title'); expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('[!');
  });
  for (const source of [
    '> [!note] A **title**\n> Body\n>\n> > [!warning]- Inner\n> > Text\n\nAfter',
    '::callout{type="tip" title="Outer"}\n> Quote\n>\n> > [!example] Inner\n> > Text\n::',
    '```mermaid\nflowchart LR\nA --> B\n```\n\nAfter',
  ]) it(`preserves incremental/full parse equivalence: ${source.slice(0, 20)}`, () => {
    const document = createDocument('', { extensions, streaming: true });
    for (let i = 1; i <= source.length; i++) expect(document.update(source.slice(0, i), { streaming: true }).blocks.map(block => block.node), `offset ${i}`).toEqual(parse(source.slice(0, i), true).blocks.map(block => block.node));
    expect(document.finish().blocks.map(block => block.node)).toEqual(parse(source).blocks.map(block => block.node));
  });
  it('does not consume escaped callout text or code', () => {
    expect(nodes('> \\[!note] plain\n\n```md\n> [!tip]\n```').filter(node => node.type === 'callout')).toHaveLength(0);
  });
});

describe('conditional renderer overrides', () => {
  const Special: NodeRenderer = ({ renderValue }) => <pre data-custom="js">{renderValue()}</pre>;
  const plugin: RendererExtension = { name: 'override', rendererOverrides: [{ type: 'code', when: node => node.lang === 'js', component: Special }] };
  it('limits replacement by type and predicate within one reader', () => {
    const source = '```js\nfirst\n```\n\n```py\nsecond\n```\n\n```mermaid\nflowchart LR\nA-->B\n```';
    const html = renderToStaticMarkup(<><Markdown source={source} plugins={[plugin]} /><Markdown source={'```js\noriginal\n```'} /></>);
    expect(html.match(/data-custom="js"/g)).toHaveLength(1);
    expect(html.match(/limr-code-block/g)).toHaveLength(2);
    expect(html).toContain('limr-mermaid-block');
  });
  it('supports ancestor restrictions and reader precedence', () => {
    const Component: NodeRenderer = ({ children }) => <b data-replaced>{children}</b>;
    const source = 'plain\n\n> quoted';
    const html = renderToStaticMarkup(<Markdown source={source} rendererOverrides={[{ type: 'paragraph', when: (_node, context) => context.ancestors.some(node => node.type === 'blockquote'), component: Component }]} />);
    expect(html).toContain('<p'); expect(html.match(/data-replaced/g)).toHaveLength(1);
    const own = renderToStaticMarkup(<Markdown source={'```js\nvalue\n```'} plugins={[plugin]} components={{ code: Component }} />);
    expect(own).toContain('data-replaced'); expect(own).not.toContain('data-custom');
  });
});
