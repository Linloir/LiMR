import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDocument, walk, textContent, type MarkdownNode } from '../src/core';
import { standard, defineBlock } from '../src/extensions';
import { Markdown } from '../src/react';
import { mapLiteral } from '../src/react/literal';

const extensions = standard();
const snapshot = (source: string, streaming = false) => createDocument(source, { extensions, streaming }).getSnapshot();
function all(source: string, streaming = false) {
  const nodes: MarkdownNode[] = [];
  snapshot(source, streaming).blocks.forEach(block => walk(block.node, node => nodes.push(node)));
  return nodes;
}

describe('component syntax and streaming', () => {
  for (const name of ['gfm', 'definition', 'title', 'content', 'question', 'question-content', 'question-hint', 'question-answer', 'question-sel-grp', 'question-sel', 'extras', 'extra', 'video', 'md-video', 'figures', 'figure', 'figcaption', 'caption', 'img', 'translations', 'origin', 'translation']) {
    it(`accepts the two-colon form of ${name}`, () => {
      const source = `::${name}{title="Mapped &amp; title"}\nBody\n::`;
      const node = all(source).find(node => node.name === name)!;
      expect(node.type).toBe('component');
      expect(node.incomplete).toBeUndefined();
      expect(node.attributes?.title).toBe('Mapped & title');
      const title = node.attributeNodes?.title?.position!;
      expect(source.slice(title.start.offset, title.end.offset)).toBe('Mapped &amp; title');
      expect(node.position?.end.offset).toBe(source.length);
    });
  }
  it('preserves nested double-colon blocks, CRLF and original positions', () => {
    const source = 'Before\r\n\r\n::question{title="😀 &amp; choice"}\r\n::question-content\r\nPick **one**.\r\n::\r\n::question-hint\r\nA hint.\r\n::\r\n::\r\n\r\nAfter';
    const nodes = all(source), question = nodes.find(node => node.name === 'question')!;
    expect(question.children?.map(node => node.name)).toEqual(['question-content', 'question-hint']);
    expect(nodes.find(node => node.value === 'one')?.position?.start.offset).toBe(source.indexOf('one'));
    expect(nodes.find(node => node.value === 'After')?.position?.start.offset).toBe(source.indexOf('After'));
    expect(snapshot(source).diagnostics).toEqual([]);
  });
  it('keeps old leaf directives and fenced code literal', () => {
    const source = ':::figures\n::figure{src="/a.png"}\n::figure{src="/b.png"}\n:::\n\n```md\n::question\nBody\n::\n```';
    expect(all(source).filter(node => node.name === 'figure')).toHaveLength(2);
    expect(all(source).find(node => node.type === 'code')?.value).toBe('::question\nBody\n::');
    const figures = all(source).find(node => node.name === 'figures')!;
    expect(figures.children?.filter(node => node.name === 'figure')).toHaveLength(2);
  });
  it('supports citation and reference aliases', () => {
    const doc = snapshot('::ref{ids="paper"}\nReference text\n::\n\n::citation{id="paper" title="A paper"}\n::');
    expect(doc.annotations[0]).toMatchObject({ id: 'paper', data: { title: 'A paper' } });
    expect(doc.occurrences).toHaveLength(1);
  });
  it('supports the code-highlight module name and keeps intraword underscores literal', () => {
    expect(snapshot('::code-highlight{lang="js"}\nconst a = 1;\n::').blocks[0].node).toMatchObject({ type: 'code', lang: 'js', value: 'const a = 1;' });
    expect(textContent(snapshot('some_identifier', true).blocks[0].node)).toBe('some_identifier');
  });
  for (const name of ['code', 'math']) it(`renders ${name} directive payloads literally`, () => {
    const source = `::${name}{lang="ts"}\r\n  **raw** &amp; \\value\r\nnext\r\n::`;
    const node = all(source).find(node => node.type === name)!;
    expect(node.value).toBe('  **raw** &amp; \\value\nnext');
    expect(mapLiteral(source, node).starts[2]).toBe(source.indexOf('**raw**'));
  });
  it('does not interpret JSX, directives, or fences inside a literal component', () => {
    const source = '::code{lang="tsx"}\nconst element = <Thing />;\n::question\n~~~\n~~~\n::';
    const doc = snapshot(source);
    expect(doc.diagnostics).toEqual([]);
    expect(doc.blocks).toHaveLength(1);
    expect(doc.blocks[0].node.value).toBe('const element = <Thing />;\n::question\n~~~\n~~~');
  });
  it('does not balance tags inside indented code or inline math', () => {
    for (const source of ['    <definition>', '$<definition>$', 'Read $<definition>']) {
      const doc = snapshot(source, true);
      expect(doc.diagnostics).toEqual([]);
      expect(all(source, true).filter(node => node.type === 'component')).toEqual([]);
    }
  });
  for (const source of [
    'Before\n\n::definition{title="Title"}\n**Content**\n::\n\nAfter',
    '::question\n::question-content\nPrompt\n::\n::question-answer\nAnswer\n::\n::',
    '<definition title="Title">\n\nText <ref ids="a">nested</ref>\n\n</definition>\n\nAfter',
    'Before <ref ids="paper">quoted **words**</ref> after.',
    '> ::definition{title="Quote"}\n> Inside\n> ::\n\nAfter',
    '- ::definition\n  Inside\n  ::\n\nAfter',
    '::code{lang="js"}\nconst value = 1;\n::\n\nAfter',
    '```js\r\nconst value = 1;\r\n\r\nconsole.log(value);\r\n```\r\n\r\nAfter',
  ]) it(`agrees with fresh parsing at every character: ${source.slice(0, 24)}`, () => {
    const document = createDocument('', { extensions, streaming: true });
    for (let at = 1; at <= source.length; at++) {
      const prefix = source.slice(0, at);
      expect(document.update(prefix, { streaming: true }).blocks.map(block => block.node), `offset ${at}`).toEqual(snapshot(prefix, true).blocks.map(block => block.node));
    }
    expect(document.finish().blocks.map(block => block.node)).toEqual(snapshot(source).blocks.map(block => block.node));
  });
  it('withholds partial tags and gives the owning module an intermediate state', () => {
    for (const source of ['<definition title="half', '<definition>\n\ncontent', '::definition{title="half', '::definition\ncontent']) {
      const html = renderToStaticMarkup(<Markdown source={source} streaming />);
      expect(html).toContain('limr-loading');
      expect(html).not.toContain('&lt;definition');
      expect(html).not.toContain('::definition');
    }
  });
  it('lets a plugin own its pending presentation or render progressively', () => {
    const plugin = defineBlock({ name: 'counter', component: ({ incomplete, children }) => <aside data-open={incomplete}>{children}</aside>, streaming: { Loading: () => <i>Waiting for counter</i> } });
    expect(renderToStaticMarkup(<Markdown extensions={[plugin]} source="::counter\nPartial" streaming />)).toContain('Waiting for counter');
    expect(renderToStaticMarkup(<Markdown extensions={[{ ...plugin, streaming: undefined }]} source="::counter\nPartial" streaming />)).toContain('data-open="true"');
  });
  for (const syntax of ['**unfinished', '~~unfinished', '`unfinished', '[link](https://unfinished', '![image](https://unfinished', '&amp', '$x^']) it(`conceals unfinished inline syntax ${syntax}`, () => {
    const nodes = all(`Ready ${syntax}`, true);
    expect(nodes.map(node => node.type === 'text' ? node.value : '').join('')).toBe('Ready ');
  });
  it('withholds a partial table header until its separator is usable', () => {
    expect(textContent(snapshot('| Left | Right |\n| --', true).blocks[0].node)).toBe('');
    expect(snapshot('| Left | Right |\n| --- | --- |\n| a | b |', true).blocks[0].node.type).toBe('table');
  });
  it('shows unclosed literal code and math without a loader', () => {
    for (const source of ['```text\nconst value = 1;', '$$\nx^2']) {
      const doc = snapshot(source, true);
      expect(doc.blocks[0].node.incomplete).toBe(true);
      expect(renderToStaticMarkup(<Markdown source={source} streaming />)).not.toContain('limr-loading');
    }
  });
  it('keeps finalizing work limited to the mutable tail', () => {
    const document = createDocument('First\n\nSecond\n\n```js\nlet a = 1;', { extensions, streaming: true });
    const first = document.getSnapshot().blocks[0];
    const finished = document.finish();
    expect(finished.blocks[0]).toBe(first);
    expect(finished.metrics.fullParse).toBe(false);
    expect(textContent(finished.blocks.at(-1)!.node)).toBe('let a = 1;');
  });
});
