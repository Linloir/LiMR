import { describe, expect, it } from 'vitest';
import { fromMarkdown, type Extension as MdastExtension } from 'mdast-util-from-markdown';
import { gfm as rawGfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { createDocument, walk, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { parseInBatches } from '../src/core/batched-parse';
import { gfm } from '../src/extensions/gfm';
import { standard } from '../src/extensions/standard';

const original = (): SyntaxExtension => ({ ...gfm(), micromark: [rawGfm()], mdast: gfmFromMarkdown() });
const options = { extensions: [rawGfm()], mdastExtensions: gfmFromMarkdown() };
const parse = (source: string) => fromMarkdown(source, options) as unknown as MarkdownNode;
const compact = { minimum: 0, target: 1 };
const nodes = (document: ReturnType<typeof createDocument>) => document.getSnapshot().blocks.map(block => block.node);
const longSource = Array.from({ length: 72 }, (_, index) => `## Section ${index} 中文\n\n${'Words retain exact source positions. '.repeat(32)}\n\n- first\n- second\n\n| Name | Value |\n| --- | ---: |\n| text | ${index} |\n`).join('\n');
const fragments = [
  'A plain paragraph.',
  '*Open emphasis and **nested strong.',
  '`unclosed code span and [unclosed link (',
  '- one\n- two',
  '- one\n\n- two\n\n  continuation',
  '- one\n  - nested\n\n    nested continuation\n\n- two',
  '99. ordered\n100. more',
  '> quote\nlazy continuation',
  '> quote\n>\n> blank inside quote\n> - nested',
  '    indented code\n\n    still code',
  '\tindented code with tab\n\tcontinuation',
  'name | value\n--- | ---:\none | two\nthree | four',
  'name | value\n--- | ---:\ntrailing | cell\\|pipe',
  '- [ ] pending task\n- [x] completed task',
  'Heading\n=======',
  'Heading\n-------',
  '---',
  '[unknown]\n[unknown][ref]\n![unknown]',
  'www.example.com and reader@example.com and https://example.com/a?q=1#tag',
  '&#119;&#119;&#119;.example.com and a&#64;example.com',
  '**strong**, *emphasis*, ~~deleted~~, `code`, and [link](https://example.com)',
  'Unicode 中文 😀 and nul\u0000 and mid BOM\uFEFFword',
  'A final line with hard break  \nnext line\\\nlast line',
];

describe('bounded parsing at top-level headings', () => {
  it('preserves complete trees across containers, inline syntax and line-ending combinations', () => {
    let calls = 0;
    const counted = (source: string) => { calls++; return parse(source); };
    for (const eol of ['\n', '\r\n', '\r']) for (const before of fragments) for (const after of fragments) {
      const source = `${before}\n\n# Heading \t##\n\n${after}\n\n###### Another\n\nTail \t\n\n`.replaceAll('\n', eol);
      calls = 0;
      expect(parseInBatches(source, true, counted, compact), JSON.stringify(source)).toStrictEqual(parse(source));
      expect(calls).toBeGreaterThan(1);
    }
  }, 15000);

  it('retains separators, empty list items, empty headings and trailing newlines', () => {
    for (const heading of ['#', '######', '# ', '#\t', '# title ###', '# title \\#', '## title # not closing']) {
      for (const tail of ['', '\n', '\r\n', '\n\n', '\n \t\n']) {
        const source = `- first\n-\n\n \t\n${heading}\n\nTail${tail}`;
        expect(parseInBatches(source, true, parse, compact)).toStrictEqual(parse(source));
      }
    }
  });

  it.each([
    '[ref]\n\n# heading\n\n[ref]: /target',
    '[^note]\n\n# heading\n\n[^note]: footnote',
    '[ref]\n\n# heading\n\n[long\nlabel]: /target',
    '<div>\n\n# inside HTML\n\n</div>',
    '```md\n\n# inside fence\n\n```',
    '~~~md\n\n# inside fence\n\n~~~',
    '$$\n\n# inside math\n\n$$',
    'paragraph\n# single newline',
    'paragraph\n\n #### indented heading',
    'paragraph\n\n\\# escaped',
    'paragraph\r\n# single CRLF',
  ])('uses one complete parse when a boundary cannot be proven: %s', source => {
    const calls: string[] = [];
    const result = parseInBatches(source, true, value => { calls.push(value); return parse(value); }, compact);
    expect(calls).toEqual([source]);
    expect(result).toStrictEqual(parse(source));
  });

  it('keeps the production size threshold and caller eligibility gate', () => {
    for (const [source, eligible] of [['first\n\n# second\n\nTail', true], [longSource, false]] as const) {
      const calls: string[] = [];
      parseInBatches(source, eligible, value => { calls.push(value); return parse(value); });
      expect(calls).toEqual([source]);
    }
    expect(longSource.length).toBeGreaterThan(64 * 1024);
    const calls: string[] = [];
    expect(parseInBatches(longSource, true, value => { calls.push(value); return parse(value); })).toStrictEqual(parse(longSource));
    expect(calls.length).toBeGreaterThan(2);
    expect(calls.join('')).toBe(longSource);
  });

  it('runs document transforms once over the complete merged tree', () => {
    const observed: MarkdownNode[][] = [];
    const documents = [gfm(), original()].map(extension => {
      const roots: MarkdownNode[] = [];
      observed.push(roots);
      return createDocument(longSource, { extensions: [extension, { name: 'whole-document-transform', transform(root) {
        roots.push(structuredClone(root));
        const count = root.children?.length;
        walk(root, node => { if (node.type === 'text') node.value += `:${count}`; });
      } }] });
    });
    expect(observed[0]).toHaveLength(1);
    expect(observed[0]).toStrictEqual(observed[1]);
    expect(nodes(documents[0])).toStrictEqual(nodes(documents[1]));
  });

  it('preserves streaming append offsets, finalization and complete replacements', () => {
    const initial = '😀 Beginning\r\n\r\n## Retained\r\n\r\nTail';
    const actual = createDocument(initial, { id: 'batch', extensions: [gfm()], streaming: true });
    const expected = createDocument(initial, { id: 'batch', extensions: [original()], streaming: true });
    const compare = () => {
      expect(nodes(actual)).toStrictEqual(nodes(expected));
      expect(actual.getSnapshot().headings).toStrictEqual(expected.getSnapshot().headings);
    };
    for (const chunk of ['\r\n\r\n' + longSource.replaceAll('\n', '\r\n'), '\r\n\r\n# Last\r\n\r\n**pending', '** done\r\n']) {
      actual.append(chunk); expected.append(chunk); compare();
    }
    actual.finish(); expected.finish(); compare();
    actual.update(longSource + '\n\n# Replacement\n\n新正文');
    expected.update(longSource + '\n\n# Replacement\n\n新正文'); compare();
  });

  it('preserves retained definition environments on a large append', () => {
    const initial = '[reference]: /resolved\n\nFirst';
    const actual = createDocument(initial, { extensions: [gfm()], streaming: true });
    const expected = createDocument(initial, { extensions: [original()], streaming: true });
    const chunk = '\n\n' + longSource.replaceAll('Words retain', '[Link][reference] and words retain');
    actual.append(chunk); expected.append(chunk);
    expect(nodes(actual)).toStrictEqual(nodes(expected));
    const links: MarkdownNode[] = [];
    nodes(actual).forEach(node => walk(node, child => { if (child.type === 'linkReference') links.push(child); }));
    expect(links.length).toBeGreaterThan(100);
  });

  it.each([
    (source: string) => `:::unknown\n\n${source}\n\n:::`,
    (source: string) => `::callout\n\n${source}\n\n::`,
    (source: string) => `<callout>\n\n${source}\n\n</callout>`,
  ])('keeps generic directives, prepared fallback syntax and JSX on the full parser', wrap => {
    const source = wrap(longSource);
    const actual = createDocument(source, { extensions: standard() });
    const expected = createDocument(source, { extensions: standard().map(extension => extension.name === 'gfm' ? original() : extension) });
    expect(nodes(actual)).toStrictEqual(nodes(expected));
  });

  it('preserves foreign and mutated builtin compiler hooks observing the complete root', () => {
    for (const inPlace of [false, true]) {
      const roots: number[] = [];
      const extension = gfm();
      const hook: NonNullable<MdastExtension['transforms']>[number] = root => {
        roots.push(root.children.length);
        for (const node of root.children) (node as unknown as MarkdownNode).data = { wholeChildren: root.children.length };
      };
      const extensions: SyntaxExtension[] = [extension];
      if (inPlace) extension.mdast![0].transforms!.push(hook);
      else extensions.push({ name: 'foreign-compiler', mdast: [{ transforms: [hook] }] });
      const document = createDocument(longSource, { extensions });
      expect(roots).toEqual([document.getSnapshot().blocks.length]);
      expect(document.getSnapshot().blocks.every(block => (block.node.data as { wholeChildren: number }).wholeChildren === roots[0])).toBe(true);
    }
  });
});
