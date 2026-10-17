import { describe, expect, it } from 'vitest';
import { rangeOf, walk, type MarkdownNode, type SourceRange } from '../src/core';
import { gfm } from '../src/extensions/gfm';
import { standard } from '../src/extensions/standard';
import { defineBlock } from '../src/extensions/define';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { resolveVirtualizedRenderer, windowedReadingText, windowedSelectionText } from '../src/react/windowed-copy';
import type { ViewConfiguration } from '../src/react/types';
import { translations } from '../src/extensions/translations';
import { windowedHeadings } from '../src/react/windowed-headings';
import { searchWindowedDocument } from '../src/react/windowed-search';

const create = (source: string, config: ViewConfiguration = {}) => new ReaderRuntime('copy', source, false, { extensions: standard(), ...config });
const all = (runtime: ReaderRuntime) => windowedSelectionText(runtime, [{ start: 0, end: runtime.document.getSnapshot().source.length }]);
const find = (runtime: ReaderRuntime, name: string) => {
  let found: MarkdownNode | undefined;
  runtime.document.getSnapshot().blocks.forEach(block => walk(block.node, node => { if (!found && (node.name === name || node.type === name)) found = node; }));
  if (!found) throw new Error(`Missing ${name}`); return found;
};
const local = (runtime: ReaderRuntime, node: MarkdownNode, key: string, value: unknown) => {
  let states = runtime.nodeStates.get(node); if (!states) runtime.nodeStates.set(node, states = new Map());
  states.set(key, new Store(value));
};

describe('windowed reading-text projection', () => {
  it('copies readable spelling without Markdown syntax, hidden definitions or annotations', () => {
    const runtime = create('# Heading\r\n\r\nA **bold** &amp; escaped \\*word\\* with [a link][id].\r\n\r\n[id]: https://example.com\r\n\r\n<citation id="one" title="Hidden citation" />');
    expect(all(runtime)).toBe('Heading\n\nA bold & escaped *word* with a link.');
  });
  it('maps partial UTF-16 ranges through entities, escapes and CRLF without leaking adjacent text', () => {
    const source = 'Before &amp; \\*middle\\*\r\nnext 😀 after', runtime = create(source);
    const range = { start: source.indexOf('&amp;'), end: source.indexOf(' after') };
    expect(windowedSelectionText(runtime, [range])).toBe('& *middle* next 😀');
    const emoji = source.indexOf('😀');
    expect(windowedSelectionText(runtime, [{ start: emoji, end: emoji + 2 }])).toBe('😀');
  });
  it('copies literal code payloads while preserving complete original atomic media and math source', () => {
    const source = 'Use ` a &amp;  b ` and $x^2$.\n\n```js\nconst a = "&amp;";\n  literal\\*\n```\n\n![a diagram](/diagram.png)';
    const runtime = create(source);
    expect(all(runtime)).toBe('Use a &amp;  b and $x^2$.\n\nconst a = "&amp;";\n  literal\\*\n\n![a diagram](/diagram.png)');
    const start = source.indexOf('literal');
    expect(windowedSelectionText(runtime, [{ start, end: start + 7 }])).toBe('literal');
  });
  it('provides selected literal values to custom code renderers without exposing the whole block', () => {
    const source = '```text\r\n  first &amp;\r\n  second\\*word\r\n```';
    const runtime = create(source, { rendererOverrides: [{ type: 'code', component: () => null, virtualization: { copyText: (_node, { value }) => value } }] });
    expect(all(runtime)).toBe('  first &amp;\n  second\\*word');
    const start = source.indexOf('second');
    expect(windowedSelectionText(runtime, [{ start, end: start + 6 }])).toBe('second');
    expect(windowedReadingText(runtime, [{ start, end: start + 6 }])).toBe('second');
  });
  it('keeps table tabs, row breaks and list reading order without pipe/list syntax', () => {
    const runtime = create('| Name | Value |\n| --- | --- |\n| A | **one** |\n| B | two |\n\n- first\n- second');
    expect(all(runtime)).toBe('Name\tValue\nA\tone\nB\ttwo\n\nfirst\nsecond');
  });
  it('projects translation visibility from local state and global precedence in visual order', () => {
    const source = '<translations>\n\n<origin>\n\nOriginal **words**.\n\n</origin>\n\n<translation>\n\n译文。\n\n</translation>\n\n</translations>';
    const runtime = create(source), node = find(runtime, 'translations');
    expect(all(runtime)).toBe('Original words.');
    local(runtime, node, 'translation-mode', 'translation');
    expect(all(runtime)).toBe('译文。');
    local(runtime, node, 'translation-mode', 'both');
    expect(all(runtime)).toBe('译文。\n\nOriginal words.');
    runtime.configure({ ...runtime.configuration.get(), parameters: { translationMode: 'origin' } });
    expect(all(runtime)).toBe('Original words.');
  });
  it('uses persistent per-block preferences for unmounted copy, search and headings', async () => {
    const source = '<translations>\n\n<origin>\n\n## Original words\n\n</origin>\n\n<translation>\n\n## Translated words\n\n</translation>\n\n</translations>';
    const runtime = create(source, { parameters: { translationMode: 'origin', translationModeForNode: (node, document) => {
      expect(node.name).toBe('translations'); expect(document.source).toBe(source); return 'translation';
    } } });
    expect(all(runtime)).toBe('Translated words');
    expect(windowedHeadings(runtime).map(heading => heading.text)).toEqual(['Translated words']);
    expect(await searchWindowedDocument(runtime, 'Original')).toEqual([]);
    expect(await searchWindowedDocument(runtime, 'Translated')).toHaveLength(1);
    runtime.configure({ ...runtime.configuration.get(), parameters: { translationModeForNode: () => undefined } });
    expect(all(runtime)).toBe('Original words');
    const translatedDefault = create(source, { extensions: [...standard().filter(extension => extension.name !== 'translations'), translations({ defaultMode: 'translation' })] });
    expect(all(translatedDefault)).toBe('Translated words');
  });
  it('excludes collapsed callout bodies and unopened question hints and answers', () => {
    const runtime = create('> [!note]- Visible title\n> Hidden body.\n\n::question{title="Prompt"}\n::question-content\nVisible question.\n::\n::question-hint\nSecret hint.\n::\n::question-answer\nSecret answer.\n::\n::');
    expect(all(runtime)).toBe('Visible title\n\nPrompt\nVisible question.');
    local(runtime, find(runtime, 'callout'), 'callout-expanded', true);
    local(runtime, find(runtime, 'question'), 'question-hint', true);
    expect(all(runtime)).toBe('Visible title\nHidden body.\n\nPrompt\nVisible question.\nSecret hint.');
  });
  it('places legacy footnotes at the end in reference order and includes a selected footnote once', () => {
    const source = '[^b]: Second definition.\n\nText[^a] and note[^b].\n\n[^a]: First definition.', runtime = create(source, { extensions: [gfm()] });
    expect(all(runtime)).toBe('Text and note.\n\nFirst definition.\n\nSecond definition.');
    const node = runtime.document.getSnapshot().footnotes.get('b')!;
    expect(windowedSelectionText(runtime, [rangeOf(node)])).toBe('Second definition.');
    expect(all(create(source))).toBe('Text and note.');
  });
  it('removes recognized annotation syntax while preserving literal syntax inside an atom', () => {
    const source = 'Before ::%%limr%%{<#r}visible::%%limr%%{>#r} after.\n\n:::limr-annotation{#n ranges="r" type="footnote"}\nHidden body.\n:::';
    expect(all(create(source))).toBe('Before visible after.');
    const atomic = create('<card>Marked ::%%limr%%{<#r}word::%%limr%%{>#r}.</card>', {
      extensions: [...standard(), defineBlock({ name: 'card', selection: 'atomic', component: () => null })],
    });
    expect(all(atomic)).toBe('<card>Marked ::%%limr%%{<#r}word::%%limr%%{>#r}.</card>');
  });
  it('uses explicit custom copy adapters with the same matching override priority as rendering', () => {
    const component = () => null;
    const adapter = { copyText: (_node: MarkdownNode, context: { children: string }) => `Custom(${context.children})` };
    const custom = { ...defineBlock({ name: 'card', component }), virtualization: { card: adapter } };
    const runtime = create('<card>One **word**.</card>', { extensions: [...standard(), custom] });
    const node = find(runtime, 'card');
    expect(resolveVirtualizedRenderer(runtime, node)).toBe(adapter);
    expect(all(runtime)).toBe('Custom(One word.)');
    runtime.configure({ ...runtime.configuration.get(), rendererOverrides: [
      { type: 'card', component, virtualization: { copyText: () => 'Chosen' } },
      { type: 'card', component, when: () => false, virtualization: { copyText: () => 'Wrong' } },
    ] });
    expect(all(runtime)).toBe('Chosen');
  });
  it('keeps disjoint selection order and skips unselected blocks', () => {
    const source = 'First paragraph.\n\nMiddle paragraph.\n\nLast paragraph.', runtime = create(source);
    const ranges: SourceRange[] = [{ start: source.indexOf('Last'), end: source.indexOf('Last') + 4 }, { start: 0, end: 5 }];
    expect(windowedSelectionText(runtime, ranges)).toBe('Last\n\nFirst');
    expect(windowedSelectionText(runtime, [])).toBe('');
  });
  it('reports custom hidden or generated reading fragments without leaking hidden children', () => {
    const component = () => null, runtime = create('# Heading words', { rendererOverrides: [{ type: 'heading', component, virtualization: { copyText: () => '' } }] });
    const range = { start: 0, end: runtime.document.getSnapshot().source.length }, hidden: SourceRange[] = [];
    expect(windowedReadingText(runtime, [range], undefined, hidden)).toBe('');
    expect(hidden).toEqual([]);
    runtime.configure({ ...runtime.configuration.get(), rendererOverrides: [{ type: 'heading', component, virtualization: { copyText: () => 'Generated label' } }] });
    const visible: SourceRange[] = [];
    expect(windowedReadingText(runtime, [range], undefined, visible)).toBe('Generated label');
    expect(visible).not.toEqual([]);
  });
});
