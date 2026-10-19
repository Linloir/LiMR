import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { createDocument, mapText, rangeOf, textContent, walk, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { fromMarkdownSource } from '../src/core/markdown-input';
import { gfm, standard } from '../src/extensions';
import { Markdown } from '../src/react';
import { createDocumentWorkerHandler, standardWorkerRegistry, type DocumentWorkerResponse } from '../src/worker-api';
import { workerExtensionDescriptor } from '../src/core/worker-registry';

function nodes(source: string, extensions: readonly SyntaxExtension[] = []) {
  const snapshot = createDocument(source, { extensions }).getSnapshot();
  expect(snapshot.diagnostics).toEqual([]);
  const all: MarkdownNode[] = [];
  snapshot.blocks.forEach(block => walk(block.node, node => all.push(node)));
  return all;
}
const strong = (source: string, extensions?: readonly SyntaxExtension[]) => nodes(source, extensions).filter(node => node.type === 'strong').map(textContent);
const cases: [string, string[]][] = [
  ['这是一段**“不可以"**的样例', ['“不可以"']],
  ['这是一&#x6BB5;**“不可以"**&#x7684;样例', ['“不可以"']],
  ['这也是一段**http:www\\.baidu.com**不可以样例', ['http:www.baidu.com']],
  ['这也是一段**http:www.baidu.com**不可以样例', ['http:www.baidu.com']],
  ['同样的还有**中文带标点，**或是标点**，后面有**中文等', ['中文带标点，', '，后面有']],
  ['同样的还有**中文带标点，**&#x6216;是标点\\*\\*，后面有\\*\\*中文等', ['中文带标点，']],
  ['前**！**后**？**尾', ['！', '？']],
  ['前**「日本語。」**後', ['「日本語。」']],
  ['앞**“한국어!”**뒤', ['“한국어!”']],
  ['до**«текст»**после', ['«текст»']],
  ['قبل**«العربية؟»**بعد', ['«العربية؟»']],
  ['לפני**״עברית!״**אחרי', ['״עברית!״']],
  ['ก่อน**“ไทย!”**หลัง', ['“ไทย!”']],
  ['पहले**“हिन्दी।”**बाद', ['“हिन्दी।”']],
  ['πριν**«Ελληνικά!»**μετά', ['«Ελληνικά!»']],
  ['before**(English!)**after', ['(English!)']],
  ['cafe\u0301**«été!»**après', ['«été!»']],
  ['𠀀**「𠀁！」**𠀂', ['「𠀁！」']],
  ['前**©**后**🙂**尾', ['©', '🙂']],
  ['前***“粗斜体！”***后', ['“粗斜体！”']],
  ['前**“*斜体*！”**后', ['“斜体！”']],
  ['前**“[链接](/target)！”**后', ['“链接！”']],
];

describe('LiMR strong delimiter boundaries', () => {
  it.each(cases)('parses multilingual punctuation without spaces: %s', (source, expected) => {
    for (const extensions of [[], [gfm()], standard()]) expect(strong(source, extensions)).toEqual(expected);
  });

  it.each([
    'plain **bold** and *italic* and ***both***',
    '**outer *inner* end** and *outer **inner** end*',
    '**a **b** c** and a**b**c',
    'a_b_c a__b__c __bold__ _italic_',
    '前*“斜体”*后 前__“下划线”__后',
    '\\*\\*literal\\*\\* and **escaped \\* marker**',
    '** spaced** **spaced ** **\tspaced** **spaced\u00a0**',
    '**\u3000中文** **中文\u3000** **\nline** **line\n**',
    '`前**“code”**后`\n\n```md\n前**“code”**后\n```',
    '[label](/path/**literal** "**title**") ![alt](/img/**literal**)',
    '***\n\n****\n\n- **bold**\n\n> **quote**',
    '**unclosed ** ** *',
  ])('preserves ordinary Markdown, literals and whitespace rules: %s', source => {
    expect(createDocument(source).getSnapshot().blocks.map(block => block.node)).toEqual(fromMarkdown(source).children);
  });

  it('keeps UTF-16 coordinates through entities, escapes, CRLF and BOM', () => {
    const source = '\uFEFF# Heading\r\n\r\n𠀀**“中&amp;文\\!”**后';
    const all = nodes(source), bold = all.find(node => node.type === 'strong')!;
    expect(source.slice(bold.position!.start.offset, bold.position!.end.offset)).toBe('**“中&amp;文\\!”**');
    const text = bold.children![0], mapping = mapText(source, text.value!, rangeOf(text));
    expect(text.value).toBe('“中&文!”');
    expect(mapping.starts.map((start, index) => source.slice(start, mapping.ends[index]))).toEqual(['“', '中', '&amp;', '文', '\\!', '”']);
    expect(text.position!.start).toMatchObject({ line: 3, column: 5, offset: source.indexOf('“') });
  });

  it('uses identical grammar in bounded and ordinary parsing', () => {
    const source = Array.from({ length: 500 }, (_, index) => `## ${index}\n\n${cases[index % cases.length][0]}\n\n${'ordinary prose '.repeat(8)}\n`).join('\n');
    expect(source.length).toBeGreaterThan(65536);
    const progress: number[] = [];
    expect(fromMarkdownSource(source, undefined, true, value => progress.push(value))).toEqual(fromMarkdownSource(source));
    expect(progress.length).toBeGreaterThan(2);
    expect(progress.at(-1)).toBe(source.length);
  });

  it.each(['blocking', 'progressive'] as const)('uses the same strong and URL grammar in a %s Worker', async mode => {
    const source = cases.map(([source]) => source).join('\n\n') + '\n\n前**https://例子.测试/路径**后';
    const extensions = standard(), responses: DocumentWorkerResponse[] = [];
    const handler = createDocumentWorkerHandler(standardWorkerRegistry);
    await handler({ type: 'load', revision: 1, id: 'strong-worker', input: source, mode, extensions: extensions.map(extension => workerExtensionDescriptor(extension)!) }, response => { responses.push(response); });
    expect(responses.filter(response => response.type === 'error')).toEqual([]);
    const result = responses.find(response => response.type === 'snapshot' && response.complete);
    expect(result?.type).toBe('snapshot');
    if (result?.type !== 'snapshot') throw new Error('Missing complete Worker snapshot');
    expect(result.snapshot.blocks).toEqual(createDocument(source, { extensions, id: 'strong-worker' }).getSnapshot().blocks);
  });

  it('converges after every streamed character and after finish', () => {
    const extensions = standard();
    const source = '# 已完成\n\n' + cases.slice(0, 7).map(([source]) => source).join('\n\n') + '\n\n前**https://example.com/path**后';
    const stream = createDocument('', { extensions, streaming: true });
    for (const character of source) {
      const snapshot = stream.append(character);
      expect(snapshot.blocks.map(block => block.node)).toEqual(createDocument(snapshot.source, { extensions, streaming: true }).getSnapshot().blocks.map(block => block.node));
    }
    expect(stream.finish().blocks.map(block => block.node)).toEqual(createDocument(source, { extensions }).getSnapshot().blocks.map(block => block.node));
  });

  it('renders real strong elements through the default React entry', () => {
    const html = renderToStaticMarkup(<Markdown source={'前**“中文！”**后，以及**http:www\\.baidu.com**。'} />);
    expect(html.match(/<strong>/g)).toHaveLength(2);
    expect(html.replace(/<[^>]*>/g, '')).toContain('http:www.baidu.com');
    expect(html).not.toContain('**');
  });
});

describe('strong, directives and automatic links', () => {
  it.each(['http:www.baidu.com', 'http:www\\.baidu.com', 'urn:isbn:12345', 'text:label', '12:30', ':unknown[body]', ':unknown{key="value"}', '::unknown\nBody'])('keeps unregistered colon syntax visible: %s', source => {
    const all = nodes(source, standard());
    expect(all.some(node => node.type.endsWith('Directive'))).toBe(false);
    expect(all.filter(node => node.type === 'paragraph').map(textContent).join('\n')).toBe(source.replace('\\.', '.'));
  });

  it('retains registered inline, leaf and container directives', () => {
    const source = ':gfm[前**“内联！”**后]\n\n::gfm[前**“叶子！”**后]\n\n:::gfm\n前**“容器！”**后\n:::';
    expect(nodes(source, [gfm()]).filter(node => node.type === 'component').map(node => node.name)).toEqual(['gfm', 'gfm', 'gfm']);
    expect(strong(source, [gfm()])).toEqual(['“内联！”', '“叶子！”', '“容器！”']);
  });

  it.each(['https://example.com', 'http://example.com/path?q=one', 'www.example.com/path', 'https://例子.测试/路径'])('closes bold URLs before adjacent prose: %s', url => {
    const source = `前**${url}**后`;
    const all = nodes(source, standard());
    expect(all.filter(node => node.type === 'strong').map(textContent)).toEqual([url]);
    const link = all.find(node => node.type === 'link')!;
    expect(link.url).toBe(url.startsWith('www.') ? `http://${url}` : url);
    expect(source.slice(link.position!.start.offset, link.position!.end.offset)).toBe(url);
    expect(source.slice(link.children![0].position!.start.offset, link.children![0].position!.end.offset)).toBe(url);
  });

  it('shares the fixes with annotation discovery and preserves mapped selections', () => {
    const source = '\uFEFF# 开头\r\n\r\n前::%%limr%%{<#a}**“中文！”**和**http:www\\.baidu.com**::%%limr%%{>#a}后\n\n:::limr-annotation{#a type="footnote"}\n正文\n:::';
    const snapshot = createDocument(source, { extensions: standard() }).getSnapshot();
    expect(snapshot.annotationRanges.size).toBe(1);
    expect(strong(source, standard())).toEqual(['“中文！”', 'http:www.baidu.com']);
    for (const node of nodes(source, standard()).filter(node => node.type === 'strong')) {
      expect(source.slice(node.position!.start.offset, node.position!.end.offset)).toMatch(/^\*\*.*\*\*$/);
    }
    const link = nodes(source, standard()).find(node => node.type === 'link')!;
    expect(source.slice(link.position!.start.offset, link.position!.end.offset)).toBe('www\\.baidu.com');
  });

  it.each([
    ['www\\.example.com', 'www.example.com'],
    ['www&#46;example.com', 'www.example.com'],
    ['http&#58;//example.com?a=1&amp;b=2', 'http://example.com?a=1&b=2'],
    ['a&#64;example.com', 'a@example.com'],
    ['a\\@example.com', 'a@example.com'],
  ])('maps decoded automatic links and surrounding text: %s', (raw, visible) => {
    const source = `\uFEFF# 第一段\r\n\r\n𠀀前**${raw}**后`;
    const all = nodes(source, standard()), link = all.find(node => node.type === 'link')!;
    expect(textContent(link)).toBe(visible);
    expect(source.slice(link.position!.start.offset, link.position!.end.offset)).toBe(raw);
    for (const node of all.filter(node => node.type === 'text')) {
      expect(node.position).toBeDefined();
      expect(mapText(source, node.value!, rangeOf(node)).exact).toBe(true);
    }
  });

  it('maps multiple decoded URLs and emails in the same text run', () => {
    const source = 'See www\\.example.com, a&#64;example.com and http&#58;//example.org.';
    const all = nodes(source, [gfm()]);
    expect(all.filter(node => node.type === 'link').map(node => source.slice(node.position!.start.offset, node.position!.end.offset)))
      .toEqual(['www\\.example.com', 'a&#64;example.com', 'http&#58;//example.org']);
    for (const node of all.filter(node => node.type === 'text')) expect(mapText(source, node.value!, rangeOf(node)).exact).toBe(true);
  });

  it.each([
    ['**see https://example.com/a(b).**后', 'https://example.com/a(b)', 'see https://example.com/a(b).'],
    ['**https://example.com/a(b))**后', 'https://example.com/a(b)', 'https://example.com/a(b))'],
    ['**https://example.com?q=a&b=c**后', 'https://example.com?q=a&b=c', 'https://example.com?q=a&b=c'],
    ['***https://example.com***后', 'https://example.com', 'https://example.com'],
    ['**前 *斜体* https://example.com**后', 'https://example.com', '前 斜体 https://example.com'],
  ])('retains URL grammar inside nested strong: %s', (source, url, text) => {
    const all = nodes(source, [gfm()]);
    expect(all.filter(node => node.type === 'strong').map(textContent)).toEqual([text]);
    const link = all.find(node => node.type === 'link')!;
    expect(link.url).toBe(url);
    expect(source.slice(link.position!.start.offset, link.position!.end.offset)).toBe(url);
  });

  it.each([
    'https://example.com/a**b',
    '**done** https://example.com/a**b',
    '**outer *inner*** https://example.com/a**b',
    '`**code**` https://example.com/a**b',
    '\\*\\*escaped https://example.com/a**b',
    '[**label**](/target) https://example.com/a**b',
    '*italic https://example.com/a**b',
  ])('keeps URL asterisks when there is no open strong: %s', source => {
    const links = nodes(source, [gfm()]).filter(node => node.type === 'link');
    expect(links.at(-1)?.url).toBe('https://example.com/a**b');
  });
});
