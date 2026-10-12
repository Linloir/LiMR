import { describe, expect, it } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { createDocument, mapText, replaceExtension, selectionFromRange, walk } from '../src/core';
import { gfm } from '../src/extensions/gfm';
import { math } from '../src/extensions/math';
import { standard } from '../src/extensions/standard';

const fixtures = [
  '# Heading\r\n\r\nA **bold** &amp; escaped \\*word\\*.\r\n\r\n- one\r\n- two\r\n',
  'First paragraph\n\nSecond paragraph\n---\n\n> quote\n> continued\n\nlast',
  '- one\n\n  nested paragraph\n\n  - nested list\n\n    continuation\n\n- two',
  'Use [late][ref] and [shortcut].\n\nAnother block.\n\n[ref]: https://example.com\n[shortcut]: /local "Title"\n',
  '| Name | Value |\n| :--- | ---: |\n| alpha | **one** |\n\n- [x] task\n\nA note[^a].\n\n[^a]: Footnote\n\n    Second paragraph\n',
  '```typescript\nconst text = "```";\n\nconsole.log(text);\n```\n\n$E=mc^2$\n\n$$\nx^2+y^2\n$$\n',
];

describe('document engine', () => {
  it('retains CommonMark nodes and original CRLF offsets', () => {
    const source = fixtures[0];
    const doc = createDocument(source).getSnapshot();
    expect(doc.blocks.map(block => block.node)).toEqual(fromMarkdown(source).children);
    expect(doc.source).toBe(source);
  });
  for (const [index, source] of fixtures.entries()) it(`streaming prefixes and final parse agree, fixture ${index}`, () => {
    const extensions = [gfm(), math()];
    const stream = createDocument('', { id: 'test', extensions, streaming: true });
    for (let at = 0; at < source.length; at += 7) {
      const prefix = source.slice(0, at + 7);
      const next = stream.update(prefix, { streaming: true });
      const once = createDocument(prefix, { id: 'test', extensions, streaming: true }).getSnapshot();
      expect(next.blocks.map(block => block.node), `prefix ending ${at + 7}`).toEqual(once.blocks.map(block => block.node));
      expect(next.headings.map(({ blockId, ...heading }) => heading)).toEqual(once.headings.map(({ blockId, ...heading }) => heading));
    }
    expect(stream.finish().blocks.map(block => block.node)).toEqual(createDocument(source, { extensions }).getSnapshot().blocks.map(block => block.node));
  });
  it('reuses completed blocks and reprocesses references when definitions arrive', () => {
    const document = createDocument('[late][id]\n\nUnchanged paragraph.\n\nTail', { streaming: true });
    const first = document.getSnapshot().blocks[0];
    const appended = document.append(' text');
    expect(appended.blocks[0]).toBe(first);
    expect(appended.metrics.parsedCharacters).toBeLessThan(appended.source.length);
    const resolved = document.append('\n\n[id]: /destination\n');
    expect(resolved.metrics.reason).toBe('definitions');
    expect(resolved.blocks[0].node.children?.[0].type).toBe('linkReference');
  });
  it('keeps the TOC snapshot stable when streamed text does not change headings', () => {
    const document = createDocument('# Heading\n\nTail', { streaming: true });
    const headings = document.getSnapshot().headings;
    expect(document.append(' continues').headings).toBe(headings);
    expect(document.append('\n\n## Next').headings).not.toBe(headings);
  });
  it('falls back to whole-document processing for unconstrained transforms', () => {
    const extension = { name: 'global', transform(root: any) { root.children[0].value = String(root.children.length); } };
    const document = createDocument('First\n\nSecond', { extensions: [extension], streaming: true });
    expect(document.append('\n\nThird').metrics.fullParse).toBe(true);
  });
  it('invalidates resolved reference semantics on non-streaming source replacement', () => {
    const document = createDocument('[word][id]\n\nTail\n\n[id]: /old');
    document.update('[word][id]\n\nTail');
    expect(document.getSnapshot().blocks[0].node.children?.[0].type).toBe('text');
    document.update('[word][id]\n\nTail\n\n[id]: /new');
    expect(document.getSnapshot().blocks[0].node.children?.[0].type).toBe('linkReference');
  });
  it('refreshes line and column positions when a replacement moves line breaks', () => {
    const doc = createDocument('A B C\n\nTail');
    const next = 'A\nB C\n\nTail';
    expect(doc.update(next).blocks.map(block => block.node)).toEqual(fromMarkdown(next).children);
  });
  it('does not let parsing-environment footnotes swallow an indented suffix', () => {
    const extensions = [gfm()];
    const doc = createDocument('Note[^a].\n\n[^a]: Definition\n\nMiddle paragraph.\n\n    code', { extensions, streaming: true });
    const snapshot = doc.append(' continues');
    expect(snapshot.blocks.map(block => block.node)).toEqual(createDocument(snapshot.source, { extensions, streaming: true }).getSnapshot().blocks.map(block => block.node));
    expect(snapshot.blocks.at(-1)?.node.type).toBe('code');
  });
  it('supports replacement without silently overriding colliding extensions', () => {
    expect(() => createDocument('', { extensions: [gfm(), gfm()] })).toThrow('Duplicate');
    expect(replaceExtension([gfm()], gfm())).toHaveLength(1);
  });
});

describe('default extension modules', () => {
  const source = `# 原始位置\n\n<definition title="定义">\n\n<content>中文 **强调**，$x^2$。</content>\n\n</definition>\n\n<ref cite-from-ids='["paper"]'>引用的文字</ref>\n\n<citation cite-id="paper" title="Paper" url="https://example.com" />\n\n## 后续标题\n`;
  it('parses original tag attributes and children without rewriting input offsets', () => {
    const doc = createDocument(source, { extensions: standard() }).getSnapshot();
    expect(doc.diagnostics).toEqual([]);
    expect(doc.annotations[0]).toMatchObject({ id: 'paper', type: 'citation', data: { title: 'Paper' } });
    expect(doc.occurrences).toHaveLength(1);
    expect(doc.headings[1].range.start).toBe(source.indexOf('## 后续标题'));
    const texts: string[] = [];
    for (const block of doc.blocks) walk(block.node, node => { if (node.type === 'text') { const range = node.position!; texts.push(source.slice(range.start.offset, range.end.offset)); } });
    expect(texts).toContain('中文 ');
    expect(texts).toContain('引用的文字');
  });
  it('recovers incomplete tags then produces the same complete tree', () => {
    const extensions = standard();
    const document = createDocument('', { extensions, streaming: true });
    for (let i = 0; i < source.length; i += 11) {
      const prefix = source.slice(0, i + 11);
      const snapshot = document.update(prefix, { streaming: true });
      expect(snapshot.blocks.map(block => block.node), `prefix ${i + 11}`).toEqual(createDocument(prefix, { extensions, streaming: true }).getSnapshot().blocks.map(block => block.node));
    }
    expect(document.finish().blocks.map(block => block.node)).toEqual(createDocument(source, { extensions }).getSnapshot().blocks.map(block => block.node));
  });
  it('has reference annotations only by default', () => {
    expect(standard().flatMap(extension => extension.annotationTypes?.map(type => type.type) ?? [])).toEqual(['citation']);
  });
});

describe('selection source mapping', () => {
  it('maps entities, escapes and emoji UTF-16 offsets to original ranges', () => {
    const raw = 'A &amp; \\* 😀';
    const text = 'A & * 😀';
    const result = mapText(raw, text, { start: 0, end: raw.length });
    expect(result.exact).toBe(true);
    expect(raw.slice(result.starts[2], result.ends[2])).toBe('&amp;');
    expect(raw.slice(result.starts[4], result.ends[4])).toBe('\\*');
    expect(raw.slice(result.starts[6], result.ends[7])).toBe('😀');
  });
  it('returns three distinct selections and block sets without selecting the whole document', () => {
    const source = 'First **important** paragraph.\n\nSecond paragraph.\n\nLast paragraph.';
    const document = createDocument(source).getSnapshot();
    const start = source.indexOf('port');
    const selection = selectionFromRange(document, { start, end: start + 4 });
    expect(selection.raw.sourceText).toBe('port');
    expect(selection.syntax.sourceText).toBe('**important**');
    expect(selection.blocks.sourceText).toBe('First **important** paragraph.');
    expect(selectionFromRange(document, { start, end: source.indexOf('Second') + 4 }).blocks.ranges).toHaveLength(2);
  });
});
