import { describe, expect, it } from 'vitest';
import { createDocument } from '../src/core';
import { literalValue, mapLiteral } from '../src/react/literal';

describe('literal source mapping', () => {
  for (const source of ['`inline &amp; \\* code`', '`` a`b ``', '`\r\nvalue\r\n`', '`two\nlines`']) it(`maps code spans without decoding literal characters: ${JSON.stringify(source)}`, () => {
    const node = createDocument(source).getSnapshot().blocks[0].node.children![0];
    const mapping = mapLiteral(source, node);
    expect(mapping.exact).toBe(true);
    expect(mapping.starts.length).toBe(literalValue(node).length);
    expect(mapping.starts.map((start, index) => source.slice(start, mapping.ends[index]).replace(/\r\n?|\n/g, ' ')).join('')).toBe(literalValue(node));
  });
  for (const source of ['```ts\r\nconst 你好 = 1;\r\n\r\nnext();\r\n```', '    first\n    second\n', '> ```js\n> let x = 2;\n> next();\n> ```']) it('maps fenced/indented code payload and newline offsets', () => {
    const doc = createDocument(source).getSnapshot();
    const block = doc.blocks[0].node;
    const node = block.type === 'blockquote' ? block.children![0] : block;
    const mapping = mapLiteral(source, node);
    expect(mapping.exact).toBe(true);
    expect(mapping.starts.length).toBe(literalValue(node).length);
    expect(mapping.starts.map((start, index) => source.slice(start, mapping.ends[index]).replace(/\r\n?/g, '\n')).join('')).toBe(literalValue(node));
  });
});

describe('literal mapping with removed annotation boundaries', () => {
  for (const [source, value, type] of [
    ['`a::%%limr%%{<#r}b::%%limr%%{>#r}c`', 'abc', 'inlineCode'],
    ['```ts\r\na::%%limr%%{<#r}b\r\nc::%%limr%%{>#r}d\r\n```', 'ab\ncd', 'code'],
    ['> ```ts\n> ::%%limr%%{<#r}code::%%limr%%{>#r}\n> ```', 'code', 'code'],
  ]) it(`maps ${type} payload through exact source omissions`, () => {
    const omissions = [...source.matchAll(/::%%limr%%\{[<>]#r\}/g)].map(match => ({ start: match.index!, end: match.index! + match[0].length }));
    const node = { type, value, sourceOmissions: omissions, position: { start: { offset: source.startsWith('>') ? 2 : 0, line: 1, column: 1 }, end: { offset: source.length, line: 1, column: 1 } } };
    const mapping = mapLiteral(source, node);
    expect(mapping.exact).toBe(true);
    expect(mapping.starts.map((start, index) => source.slice(start, mapping.ends[index]).replace(/\r\n?/g, '\n')).join('')).toBe(value);
    expect(mapping.starts.every(start => omissions.every(span => start < span.start || start >= span.end))).toBe(true);
  });
});
