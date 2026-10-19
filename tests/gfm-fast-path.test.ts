import { describe, expect, it } from 'vitest';
import { gfm as rawGfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { createDocument, walk, type SyntaxExtension, type MarkdownNode } from '../src/core';
import { gfm } from '../src/extensions/gfm';
import { standard } from '../src/extensions/standard';
import { positionAutolinks } from '../src/core/autolink-positions';

// Keep source restoration in both paths; this oracle isolates tokenizer and
// impossible-candidate pruning from LiMR's positioned-autolink contract.
const original = (): SyntaxExtension => ({ ...gfm(), micromark: [rawGfm()], mdast: gfmFromMarkdown().map(extension =>
  extension.enter?.literalAutolink ? { ...extension, transforms: extension.transforms?.map(positionAutolinks) } : extension) });
const nodes = (document: ReturnType<typeof createDocument>) => document.getSnapshot().blocks.map(block => block.node);
const inputs = [
  'A paragraph with **strong**, *emphasis*, [a link](https://example.com) and `code`.\n\n- Item one\n- Item two',
  'www.example.org WWW.example.org WwW.example.org/path. http://example.org HTTPS://example.org/a?b=c&d=e',
  'Contact first.last+tag@example.org, a@b.c, a_b@www.example.org and literal name@localhost.',
  'www&#46;example.org http&#58;//example.org a&#64;example.org &commat; b&commat;example.org',
  '&#119;&#119;&#119;.example.org &#104;ttp&#58;&#47;&#47;example.org a&commat;example.org',
  'www\\.example.org http\\://example.org a\\@example.org **www.example.org** ~~a@example.org~~',
  '[www.example.org](https://example.org) ![a@example.org](/image) <https://example.org> <a@example.org>',
  '`www.example.org a@example.org`\n\n```text\nhttps://example.org\n```\n\n<em>www.example.org</em>',
  '[www.example.org][ref] and [a@example.org].\n\n[ref]: /resolved\n[a@example.org]: /email',
  '| Name | Value |\n| --- | ---: |\n| a | **one** |\n| b | www.example.org |\n| c | a@example.org |\n',
  '- [ ] Task\n- [x] Complete\n\nNote[^x].\n\n[^x]: www.example.org and a@example.org\n',
  '中文中文。a@example.org 😀www.example.org\r\n\r\nhttps://例子.测试/路径',
  'http://www.example.org/a(b)c). **before www.example.org/after** [open www.example.org',
];

describe('GFM impossible-autolink fast paths', () => {
  it.each(inputs)('preserves upstream GFM nodes, values and exact positions: %s', source => {
    expect(nodes(createDocument(source, { extensions: [gfm()] }))).toEqual(nodes(createDocument(source, { extensions: [original()] })));
  });

  it.each([1, 13])('preserves every growing prefix at %i-character boundaries', chunk => {
    for (const source of inputs) {
      const actual = createDocument('', { extensions: [gfm()], streaming: true });
      const expected = createDocument('', { extensions: [original()], streaming: true });
      for (let at = 0; at < source.length; at += chunk) {
        actual.append(source.slice(at, at + chunk));
        expected.append(source.slice(at, at + chunk));
        expect(nodes(actual), `prefix ${at + chunk} of ${source}`).toEqual(nodes(expected));
      }
      actual.finish(); expected.finish();
      expect(nodes(actual)).toEqual(nodes(expected));
    }
  });

  it('preserves the standard module combination and component recovery', () => {
    const source = '<callout title="www.example.org">\n\n**text** $x$ and a@example.org.\n\n</callout>\n\n:::definition{title="定义"}\nwww&#46;example.org\n:::';
    const originalModules = standard().map(extension => extension.name === 'gfm' ? original() : extension);
    for (let at = 1; at <= source.length; at += 3) {
      const prefix = source.slice(0, at);
      expect(nodes(createDocument(prefix, { extensions: standard(), streaming: true }))).toEqual(nodes(createDocument(prefix, { extensions: originalModules, streaming: true })));
    }
  });

  it('retains token boundaries observed by third-party compiler hooks', () => {
    const seen: string[][] = [];
    for (const extension of [gfm(), original()]) {
      const tokens: string[] = [];
      const custom: SyntaxExtension = { name: 'observe-data-tokens', mdast: [{ exit: { data(token) {
        tokens.push(this.sliceSerialize(token));
        // CommonMark uses the same default data handler for codeTextData.
        this.config.exit.codeTextData.call(this, token);
      } } }] };
      createDocument('A plain paragraph with **strong** words and no address.', { extensions: [extension, custom] });
      seen.push(tokens);
    }
    expect(seen[0].length).toBeGreaterThan(1);
    expect(seen[0]).toEqual(seen[1]);
  });

  it('retains token boundaries when a registered compiler object receives an in-place hook', () => {
    const seen: string[][] = [];
    for (const extension of [gfm(), original()]) {
      const tokens: string[] = [];
      extension.mdast![0].exit!.data = function (token) {
        tokens.push(this.sliceSerialize(token));
        this.config.exit.codeTextData.call(this, token);
      };
      createDocument('A plain paragraph with **strong** words and no address.', { extensions: [extension] });
      seen.push(tokens);
    }
    expect(seen[0].length).toBeGreaterThan(1);
    expect(seen[0]).toEqual(seen[1]);
  });

  it('keeps a tokenizer replaced in place observable even without an address candidate', () => {
    const extension = gfm();
    const candidates = extension.micromark![0].text![65];
    const construct = (Array.isArray(candidates) ? candidates : [candidates]).find(item => item?.name === 'emailAutolink')!;
    const tokenize = construct.tokenize;
    let calls = 0;
    construct.tokenize = function (effects, ok, nok) { calls++; return tokenize.call(this, effects, ok, nok); };
    try {
      const source = 'A plain paragraph with **strong** words and no address.';
      const actual = createDocument(source, { extensions: [extension] });
      const actualCalls = calls;
      calls = 0;
      const expected = createDocument(source, { extensions: [original()] });
      expect(actualCalls).toBeGreaterThan(0);
      expect(actualCalls).toBe(calls);
      expect(nodes(actual)).toEqual(nodes(expected));
    } finally { construct.tokenize = tokenize; }
  });

  it('still processes autolinks created by an earlier custom mdast transform', () => {
    const custom: SyntaxExtension = { name: 'generated-text', mdast: [{ transforms: [root => {
      walk(root as unknown as MarkdownNode, node => { if (node.type === 'text') node.value = 'www.example.org and a@example.org'; });
    }] }] };
    const actual = createDocument('Plain text', { extensions: [custom, gfm()] });
    const expected = createDocument('Plain text', { extensions: [custom, original()] });
    expect(nodes(actual)).toEqual(nodes(expected));
    expect(actual.getSnapshot().blocks[0].node.children?.filter(node => node.type === 'link')).toHaveLength(2);
  });

  it('does not revisit autolinks inside existing link and link-reference subtrees', () => {
    const custom: SyntaxExtension = { name: 'generated-link-labels', mdast: [{ transforms: [root => {
      walk(root as unknown as MarkdownNode, node => {
        if (node.type === 'link' || node.type === 'linkReference') for (const child of node.children ?? []) if (child.type === 'text') child.value = 'WWW.example.org and a@example.org';
      });
    }] }] };
    const source = '[label](/target) [reference][r]\n\n[r]: /reference';
    const actual = createDocument(source, { extensions: [custom, gfm()] });
    const expected = createDocument(source, { extensions: [custom, original()] });
    expect(nodes(actual)).toEqual(nodes(expected));
    const nestedLinks: MarkdownNode[] = [];
    for (const block of actual.getSnapshot().blocks) walk(block.node, node => {
      if (node.type === 'link' || node.type === 'linkReference') nestedLinks.push(node);
    });
    expect(nestedLinks.map(node => node.type)).toEqual(['link', 'linkReference']);
    expect(nestedLinks.every(node => node.children?.every(child => child.type === 'text'))).toBe(true);
  });

  it('selects the right cached tokenizer variant after replacements remove and restore candidates', () => {
    const actual = createDocument('', { extensions: [gfm()] });
    const expected = createDocument('', { extensions: [original()] });
    for (const source of ['Plain **text**.', 'a@example.org', 'www.example.org', 'HTTPS://example.org', 'a@example.org www.example.org https://example.org', 'Plain **text**.', '&#119;&#119;&#119;.example.org', 'www.example.org']) {
      actual.update(source); expected.update(source);
      expect(nodes(actual), source).toEqual(nodes(expected));
    }
  });
});
