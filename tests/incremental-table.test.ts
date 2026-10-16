import { describe, expect, it } from 'vitest';
import { createDocument, walk, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { gfm, standard } from '../src/extensions';

describe('growing tables', () => {
  const inputs = [
    '| Name | Value |\n| --- | ---: |\n| one | **bold** |\n| two | `a\\|b` |\n| three | &amp; *word* |\n',
    '| Name | Value |\r\n| --- | ---: |\r\n| one | a |\r\n| two | b |\r\n',
    '| Name | Value |\n| --- | ---: |\n| [a][ref] | [^note] |\n| b | c |\n\n[ref]: /resolved\n\n[^note]: Resolved note\n',
    'Before\n\n| Name | Value |\n| --- | ---: |\n| a | b |\n| c | d |\n\nAfter\n',
    '| Name | Value |\n| --- | ---: |\n| a | <ref id="c" /> |\n| b | ==marked== |\n\n:::callout\nAfter\n:::\n',
    '| Name | Value |\n| --- | ---: |\n| a | ::%%limr%%{<#r}marked::%%limr%%{>#r} |\n| b | keep |\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nNote\n:::\n',
  ];

  it.each([1, 7, 31])('matches a fresh full parse at every %i-character boundary', chunk => {
    for (const extensions of [[gfm()], standard()]) for (const source of inputs) {
      const document = createDocument('', { extensions, id: 'table', streaming: true });
      for (let at = 0; at < source.length; at += chunk) {
        document.append(source.slice(at, at + chunk));
        const actual = document.getSnapshot();
        const expected = createDocument(actual.source, { extensions, id: 'table', streaming: true }).getSnapshot();
        expect(actual.blocks.map(block => block.node)).toEqual(expected.blocks.map(block => block.node));
        expect(actual.annotations).toEqual(expected.annotations);
      }
      const expected = createDocument(source, { extensions, id: 'table' }).getSnapshot();
      expect(document.finish().blocks.map(block => block.node)).toEqual(expected.blocks.map(block => block.node));
    }
  });

  it('reruns local transforms over the full raw table without mutating previous snapshots', () => {
    const transform: SyntaxExtension = { name: 'table-context', scope: 'local', transform(root) {
      const count = root.children?.[0].children?.length;
      walk(root, node => { if (node.type === 'text') node.value += `:${count}`; });
    } };
    const extensions = [gfm(), transform];
    const source = '|a|b|\n|-|-|\n|c|d|\n';
    const document = createDocument(source, { extensions, streaming: true });
    const before = structuredClone(document.getSnapshot().blocks[0].node);
    const previous = document.getSnapshot();
    const next = document.append('|e|f|\n');
    const expected = createDocument(source + '|e|f|\n', { extensions, streaming: true });
    expect(next.blocks[0].node).toEqual(expected.getSnapshot().blocks[0].node);
    expect(previous.blocks[0].node).toEqual(before);
  });

  it('preserves custom mdast hooks that depend on all rows', () => {
    const extensions: SyntaxExtension[] = [gfm(), { name: 'compiler-context', scope: 'local', mdast: [{ transforms: [root => {
      walk(root as unknown as MarkdownNode, node => { if (node.type === 'text') node.value += `:${root.children[0]?.type === 'table' ? root.children[0].children.length : 0}`; });
    }] }] }];
    const source = '|a|b|\n|-|-|\n|c|d|\n';
    const document = createDocument(source, { extensions, streaming: true });
    const next = document.append('|e|f|\n');
    expect(next.blocks[0].node).toEqual(createDocument(source + '|e|f|\n', { extensions, streaming: true }).getSnapshot().blocks[0].node);
  });
});
