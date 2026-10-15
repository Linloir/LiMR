import { describe, expect, it, vi } from 'vitest';
import { resolveAnnotationAnchors, selectionFromRange, type DocumentSnapshot, type MarkdownNode } from '../src/core';
import { standard } from '../src/extensions';
import { ReaderRuntime } from '../src/react/runtime';

/** Compare each rendered character's formatting, independently of text-node
 * splits introduced by source ranges. Marker/definition text is not prose. */
function prose(snapshot: DocumentSnapshot) {
  const chars: { char: string; formatting: string[] }[] = [];
  const visit = (node: MarkdownNode, formatting: string[] = []) => {
    if (['annotationDefinition', 'annotationReference'].includes(node.type)) return;
    const own = ['strong', 'emphasis', 'delete', 'link', 'linkReference', 'inlineCode'].includes(node.type)
      ? [...formatting, `${node.type}:${node.url ?? node.identifier ?? ''}`] : formatting;
    if (typeof node.value === 'string') for (const char of node.value) chars.push({ char, formatting: own });
    else node.children?.forEach(child => visit(child, own));
  };
  snapshot.blocks.forEach(block => visit(block.node));
  return chars;
}

describe('source ranges crossing inline formatting boundaries', () => {
  const guide = '激活 LiMR 阅读器标签页，在 **VS Code 原生编辑器工具栏的 AI 子菜单**中选择安装 Skill。';
  it.each([
    { source: guide, start: 0, end: guide.indexOf('工具栏') + 2, parts: ['激活 LiMR 阅读器标签页，在 ', 'VS Code 原生编辑器工具'] },
    { source: 'A **bold** phrase.', start: 0, end: 6, parts: ['A ', 'bo'] },
    { source: '**bold** plain', start: 4, end: 11, parts: ['ld', ' pl'] },
    { source: '**bold** and *italics* tail', start: 4, end: 17, parts: ['ld', ' and ', 'ita'] },
    { source: '**outer *nested* tail** end', start: 11, end: 19, parts: ['sted', ' ta'] },
    { source: '[linked text](https://example.com "A title") tail', start: 3, end: 48, parts: ['nked text', ' tai'] },
    { source: 'Left **&amp; 😀 end** tail', start: 0, end: 15, parts: ['Left ', '&amp; 😀'] },
  ])('preserves formatting and exact selected characters: $source', ({ source, start, end, parts }) => {
    const accept = vi.fn();
    const runtime = new ReaderRuntime('inline-boundaries', source, false, { extensions: standard(), onSourceChange: accept });
    const before = runtime.document.getSnapshot(), rendered = prose(before);
    const selection = selectionFromRange(before, { start, end });
    runtime.commands.addAnnotation({ id: 'note', type: 'footnote', anchors: selection.syntax.ranges.map(range => ({ range })), data: { body: 'Selected passage' } }, { target: 'source', highlight: { color: '#E5C07B' } });
    const after = runtime.document.getSnapshot();
    const note = after.annotations.find(item => item.id === 'note')!;
    const highlight = after.annotations.find(item => item.type === 'highlight')!;
    expect(accept).toHaveBeenCalledTimes(1);
    expect(resolveAnnotationAnchors(note, after).map(anchor => after.source.slice(anchor.range.start, anchor.range.end))).toEqual(parts);
    expect(highlight.source?.rangeIds).toEqual(note.source?.rangeIds);
    expect(prose(after)).toEqual(rendered);
    expect(after.annotations).toHaveLength(2);
    runtime.commands.removeAnnotation('note');
    expect(runtime.document.getSnapshot().annotations).toHaveLength(1);
    runtime.commands.removeAnnotation(highlight.id);
    expect(runtime.document.getSnapshot().source.trimEnd()).toBe(source);
    expect(prose(runtime.document.getSnapshot())).toEqual(rendered);
  });
  it('retains the other segment when removal explicitly targets one segment', () => {
    const runtime = new ReaderRuntime('partial-remove', '**bold** plain', false, { extensions: standard(), onSourceChange: () => {} });
    runtime.commands.addAnnotation({ id: 'note', type: 'footnote', range: { start: 4, end: 11 }, data: { body: 'Shared note' } }, { target: 'source', highlight: {} });
    const snapshot = runtime.document.getSnapshot(), note = snapshot.annotations.find(item => item.id === 'note')!;
    const anchors = resolveAnnotationAnchors(note, snapshot);
    expect(anchors).toHaveLength(2);
    expect(runtime.decorations.get().occurrences).toHaveLength(2);
    runtime.commands.removeAnnotationsAt([anchors[0].range]);
    const remaining = runtime.document.getSnapshot();
    for (const annotation of remaining.annotations) {
      expect(resolveAnnotationAnchors(annotation, remaining).map(anchor => remaining.source.slice(anchor.range.start, anchor.range.end))).toEqual([' pl']);
    }
    expect(runtime.decorations.get().occurrences).toHaveLength(1);
  });
  it.each([
    ['**bold** plain', 1, 11],
    ['A **&amp; text** end', 0, 7],
    ['A **😀 text** end', 0, 5],
    ['A [label](https://example.com) end', 0, 17],
    ['A **bold**\n\nOther paragraph', 4, 22],
  ] as const)('rejects non-text boundaries atomically: %s [%i, %i)', (source, start, end) => {
    const accept = vi.fn(), runtime = new ReaderRuntime('unsafe-boundary', source, false, { extensions: standard(), onSourceChange: accept });
    expect(() => runtime.commands.addAnnotation({ id: 'bad', type: 'highlight', range: { start, end } }, { target: 'source' })).toThrow();
    expect(runtime.document.getSnapshot().source).toBe(source);
    expect(accept).not.toHaveBeenCalled();
  });
});
