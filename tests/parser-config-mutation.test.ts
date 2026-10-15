import { describe, expect, it } from 'vitest';
import { gfm as rawGfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { createDocument, walk, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { gfm } from '../src/extensions/gfm';

const original = (): SyntaxExtension => ({ ...gfm(), micromark: [rawGfm()], mdast: gfmFromMarkdown() });
const nodes = (document: ReturnType<typeof createDocument>) => document.getSnapshot().blocks.map(block => block.node);

describe('parser configuration changes after session creation', () => {
  it('observes an added data hook on the next real append', () => {
    const seen: string[][] = [];
    const documents = [gfm(), original()].map(extension => {
      const document = createDocument('Initial plain words.', { extensions: [extension], streaming: true });
      const tokens: string[] = [];
      seen.push(tokens);
      extension.mdast![0].exit!.data = function (token) {
        tokens.push(this.sliceSerialize(token));
        this.config.exit.codeTextData.call(this, token);
      };
      document.append(' Newly appended **strong** words.');
      return document;
    });
    expect(seen[0].length).toBeGreaterThan(1);
    expect(seen[0]).toEqual(seen[1]);
    expect(nodes(documents[0])).toStrictEqual(nodes(documents[1]));
  });

  it('runs a replaced tokenizer even when no matching autolink is present', () => {
    const extension = gfm();
    const document = createDocument('Initial words.', { extensions: [extension], streaming: true });
    const candidates = extension.micromark![0].text![65];
    const construct = (Array.isArray(candidates) ? candidates : [candidates]).find(item => item?.name === 'emailAutolink')!;
    const tokenize = construct.tokenize;
    let calls = 0;
    construct.tokenize = function (effects, ok, nok) { calls++; return tokenize.call(this, effects, ok, nok); };
    try {
      const source = 'Initial words. Another plain paragraph with **strong** text.';
      document.append(source.slice(document.getSnapshot().source.length));
      const actualCalls = calls;
      calls = 0;
      const expected = createDocument(source, { extensions: [original()], streaming: true });
      expect(actualCalls).toBeGreaterThan(0);
      expect(actualCalls).toBe(calls);
      expect(nodes(document)).toStrictEqual(nodes(expected));
    } finally { construct.tokenize = tokenize; }
  });

  it('invalidates a retained raw table when a new compiler transform observes all rows', () => {
    const extension = gfm();
    const initial = '| name | value |\n| --- | --- |\n| first | one |\n';
    const document = createDocument(initial, { extensions: [extension], streaming: true });
    const previous = structuredClone(nodes(document));
    extension.mdast![0].transforms!.push(root => {
      const rows = root.children[0]?.type === 'table' ? root.children[0].children.length : 0;
      walk(root as unknown as MarkdownNode, node => { if (node.type === 'text') node.value += `:${rows}`; });
    });
    document.append('| second | two |\n');
    expect(nodes(document)).toStrictEqual(nodes(createDocument(document.getSnapshot().source, { extensions: [extension], streaming: true })));
    expect(previous[0].children?.[1].children?.[0].children?.[0].value).toBe('first');
    expect(nodes(document)[0].children?.[1].children?.[0].children?.[0].value).toBe('first:3');
  });

  it('invalidates an incomplete literal fence when a new compiler hook is installed', () => {
    const extension = gfm();
    const document = createDocument('```text\none\n', { extensions: [extension], streaming: true });
    let calls = 0;
    extension.mdast![0].transforms!.push(root => {
      calls++;
      if (root.children[0]?.type === 'code') root.children[0].value += ':observed';
    });
    document.append('two\n');
    expect(calls).toBe(1);
    expect(nodes(document)).toStrictEqual(nodes(createDocument(document.getSnapshot().source, { extensions: [extension], streaming: true })));
    expect(nodes(document)[0].value).toBe('one\ntwo:observed');
  });

  it('retains foreign compiler behavior during literal streaming from the outset', () => {
    let calls = 0;
    const extensions: SyntaxExtension[] = [gfm(), { name: 'foreign-code-transform', mdast: [{ transforms: [root => {
      calls++;
      if (root.children[0]?.type === 'code') root.children[0].value += ':foreign';
    }] }] }];
    const document = createDocument('```text\none\n', { extensions, streaming: true });
    document.append('two\n');
    expect(calls).toBe(2);
    expect(nodes(document)[0].value).toBe('one\ntwo:foreign');
  });

  it('disables batching after a transform is added to a live compiler object', () => {
    const extension = gfm();
    const document = createDocument('Initial', { extensions: [extension], streaming: true });
    const children: number[] = [];
    extension.mdast![0].transforms!.push(root => { children.push(root.children.length); });
    const large = Array.from({ length: 90 }, (_, index) => `\n\n## Section ${index}\n\n${'Words within the paragraph. '.repeat(40)}`).join('');
    expect(large.length).toBeGreaterThan(64 * 1024);
    document.append(large);
    expect(children).toEqual([document.getSnapshot().blocks.length]);
  });
});
