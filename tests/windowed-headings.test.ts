import { expect, it } from 'vitest';
import { standard } from '../src/extensions/standard';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { windowedHeadings } from '../src/react/windowed-headings';
import { windowingCapability } from '../src/react/windowing-capabilities';
import { walk, type MarkdownNode } from '../src/core';

it('keeps global headings visible in their active language and bilingual visual order without DOM', () => {
  const source = '# First\n\n<translations>\n\n<origin>\n\n## Original heading\n\nOriginal paragraph.\n\n</origin>\n\n<translation>\n\n## Translated heading\n\nTranslated paragraph.\n\n</translation>\n\n</translations>\n\n# Final';
  const runtime = new ReaderRuntime('headings', source, false, { extensions: standard(), virtualization: true });
  let pair!: MarkdownNode; runtime.document.getSnapshot().blocks.forEach(block => walk(block.node, node => { if (node.name === 'translations') pair = node; }));
  expect(windowedHeadings(runtime).map(item => item.text)).toEqual(['First', 'Original heading', 'Final']);
  runtime.nodeStates.set(pair, new Map([['translation-mode', new Store<unknown>('both')]]));
  expect(windowedHeadings(runtime).map(item => item.text)).toEqual(['First', 'Translated heading', 'Original heading', 'Final']);
  runtime.nodeStates.get(pair)!.get('translation-mode')!.set('translation');
  expect(windowedHeadings(runtime).map(item => item.text)).toEqual(['First', 'Translated heading', 'Final']);
});

it('requires custom presentation to declare its own copy/lifetime contract', () => {
  const extensions = standard(), runtime = new ReaderRuntime('capability', '# Text\n\nParagraph.', false, { extensions });
  const document = runtime.document.getSnapshot(), component = () => null;
  expect(windowingCapability(document, { extensions, virtualization: true })).toEqual({ enabled: true });
  expect(windowingCapability(document, { extensions, virtualization: true, components: { paragraph: component } }).enabled).toBe(false);
  expect(windowingCapability(document, { extensions, virtualization: true, rendererOverrides: [{ type: 'paragraph', component }] }).enabled).toBe(false);
  expect(windowingCapability(document, { extensions, virtualization: true, rendererOverrides: [{ type: 'paragraph', component, virtualization: { copyText: (_node, { children }) => children } }] }).enabled).toBe(true);
  const first = extensions.find(extension => extension.components && Object.keys(extension.components).length)!;
  first.components = { ...first.components, replacement: component };
  expect(windowingCapability(document, { extensions, virtualization: true }).enabled).toBe(false);
});
it('recognizes the built-in inert directive fallback as a native presentation', () => {
  const extensions = standard(), runtime = new ReaderRuntime('directives', 'Unknown :unregistered[label] content.\n\n::unknown[Leaf]\n\n:::unknown\nContainer.\n:::', false, { extensions });
  const types = new Set<string>();
  runtime.document.getSnapshot().blocks.forEach(block => walk(block.node, node => types.add(node.type)));
  expect(types.has('textDirective')).toBe(true);
  expect(windowingCapability(runtime.document.getSnapshot(), { extensions, virtualization: true })).toEqual({ enabled: true });
});

it('accepts an unknown node only when its contracted override actually matches', () => {
  const runtime = new ReaderRuntime('unknown', 'Text.', false, {}), snapshot = runtime.document.getSnapshot();
  const node: MarkdownNode = { ...snapshot.blocks[0].node.children![0], type: 'unknown' };
  const document = { ...snapshot, blocks: [{ ...snapshot.blocks[0], node: { ...snapshot.blocks[0].node, children: [node] } }] };
  const rule = { type: 'unknown', component: () => null, virtualization: { copyText: () => 'Text.' } };
  expect(windowingCapability(document, { virtualization: true, rendererOverrides: [rule] }).enabled).toBe(true);
  expect(windowingCapability(document, { virtualization: true, rendererOverrides: [{ ...rule, when: () => false }] }).enabled).toBe(false);
  expect(windowingCapability(document, { virtualization: true, rendererOverrides: [{ ...rule, when: (_node, context) => !context.pending && !context.incomplete && context.ancestors.at(-1)?.type === 'paragraph' }] }).enabled).toBe(true);
  expect(windowingCapability({ ...document, blocks: [{ ...document.blocks[0], pending: true }] }, { virtualization: true, rendererOverrides: [{ ...rule, when: (_node, context) => !context.pending }] }).enabled).toBe(false);
  expect(windowingCapability(document, { virtualization: true, extensions: [{ name: 'unowned-adapter', virtualization: { unknown: rule.virtualization } }] }).enabled).toBe(false);
});
