import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { standard } from '../src/extensions/standard';
import type { MarkdownNode } from '../src/core';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { DocumentProvider, useOwnedNodeState, useRuntime } from '../src/react/context';
import { collectNodeState, completeNodeStateShape, declareNodeStateRenderer, inheritNodeState, NodeStateHandoffContext, publishNodeStateHandoff, registerNodeState, type NodeStateOwner } from '../src/react/node-state-handoff';
import { windowedSelectionText } from '../src/react/windowed-copy';

const owner: NodeStateOwner = { name: 'test-paragraph', nativeTypes: ['paragraph'], keys: { open: value => typeof value === 'boolean' }, signature: completeNodeStateShape };
const pair = (source = 'A complete paragraph.\n\n') => {
  const extensions = standard();
  const before = new ReaderRuntime('handoff', source, true, { extensions, provisional: true });
  const after = new ReaderRuntime('handoff', `${source}Final appended paragraph.`, false, { extensions });
  collectNodeState(before);
  return { before, after, oldNode: before.document.getSnapshot().blocks[0].node, node: after.document.getSnapshot().blocks[0].node };
};
const save = (before: ReaderRuntime, node: MarkdownNode, value = true) => {
  const store = new Store<unknown>(value); registerNodeState(before, owner, node, 'open', store); return store;
};
describe('private provisional state owners', () => {
  it('seeds an independent final engine before any final component mounts', () => {
    const { before, after, oldNode, node } = pair(), store = save(before, oldNode);
    inheritNodeState(after, before);
    expect(after.document).not.toBe(before.document);
    expect(node).not.toBe(oldNode);
    expect(after.nodeStates.get(node)?.get('open')).toBe(store);
    expect(before.document.getSnapshot().source).not.toBe(after.document.getSnapshot().source);
  });
  it('retains a last prefix click and invalidates the receiving projection on commit', () => {
    const { before, after, oldNode, node } = pair(), store = save(before, oldNode, false);
    inheritNodeState(after, before); const version = after.presentation.get();
    store.set(true); before.presentation.set(before.presentation.get() + 1);
    publishNodeStateHandoff(after);
    expect(after.nodeStates.get(node)?.get('open')?.get()).toBe(true);
    expect(after.presentation.get()).toBe(version + 1);
    publishNodeStateHandoff(after); expect(after.presentation.get()).toBe(version + 1);
    before.dispose(); expect(after.nodeStates.get(node)?.get('open')?.get()).toBe(true);
  });
  it('does not grant arbitrary keys, invalid values or changed renderer owners permission', () => {
    const { before, after, oldNode, node } = pair();
    registerNodeState(before, owner, oldNode, 'unknown-resource', new Store({ mutable: true }));
    registerNodeState(before, owner, oldNode, 'open', new Store({ not: 'boolean' }));
    inheritNodeState(after, before); expect(after.nodeStates.get(node)?.size ?? 0).toBe(0);
    save(before, oldNode);
    after.rendererOverrides.set('paragraph', [{ type: 'paragraph', component: () => null, when: () => false }]);
    inheritNodeState(after, before); expect(after.nodeStates.get(node)?.size ?? 0).toBe(0);
  });
  it('includes built-in scalar meaning and rejects references or unknown plugin objects', () => {
    for (const [left, right] of [
      [{ type: 'link', url: '/old', title: 'title', children: [] }, { type: 'link', url: '/new', title: 'title', children: [] }],
      [{ type: 'list', ordered: true, start: 2, children: [] }, { type: 'list', ordered: true, start: 3, children: [] }],
      [{ type: 'table', align: ['left'], children: [] }, { type: 'table', align: ['right'], children: [] }],
    ] as [MarkdownNode, MarkdownNode][]) expect(completeNodeStateShape(left)).not.toBe(completeNodeStateShape(right));
    expect(completeNodeStateShape({ type: 'linkReference', identifier: 'later', children: [] })).toBeUndefined();
    expect(completeNodeStateShape({ type: 'paragraph', pluginObject: { retained: true }, children: [] })).toBeUndefined();
  });
  it('does not visit new final-only owners, and bounds changed descendants by the old representation', () => {
    const { before, after, oldNode, node } = pair(); save(before, oldNode);
    const newNode = after.document.getSnapshot().blocks[1].node;
    Object.defineProperty(newNode, 'children', { get() { throw new Error('Final-only owner was read'); } });
    inheritNodeState(after, before); expect(after.nodeStates.get(node)?.get('open')?.get()).toBe(true);
    expect(completeNodeStateShape({ type: 'paragraph', children: Array.from({ length: 1000 }, () => ({ type: 'text', value: 'x' })) }, 20)).toBeUndefined();
  });
  it('seeds offscreen translations for whole-document copy before mounting their component', () => {
    const text = '<translations>\n<origin>Original only.</origin>\n<translation>Translated only.</translation>\n</translations>\n\n';
    const { before, after } = pair(text);
    const find = (runtime: ReaderRuntime) => {
      let found: MarkdownNode | undefined;
      const visit = (node: MarkdownNode) => { if (node.name === 'translations') found = node; node.children?.forEach(visit); };
      runtime.document.getSnapshot().blocks.forEach(block => visit(block.node)); return found!;
    };
    const translation: NodeStateOwner = { name: 'test-translation', keys: { 'translation-mode': value => value === 'translation' }, signature: completeNodeStateShape };
    declareNodeStateRenderer(translation, before.components.translations);
    registerNodeState(before, translation, find(before), 'translation-mode', new Store('translation'));
    inheritNodeState(after, before);
    expect(after.nodeStates.get(find(after))?.get('translation-mode')?.get()).toBe('translation');
    const copied = windowedSelectionText(after, [{ start: 0, end: after.document.getSnapshot().source.length }]);
    expect(copied).toContain('Translated only.'); expect(copied).not.toContain('Original only.');
  });
  it('consumes handoff authorization once; a nested reader of the same engine stays independent', () => {
    const { before, after, oldNode } = pair(); save(before, oldNode);
    const extensions = before.configuration.get().extensions;
    function Probe({ name }: { name: string }) {
      const runtime = useRuntime(), node = runtime.document.getSnapshot().blocks[0].node;
      const [value] = useOwnedNodeState(owner, node, 'open', false); return <span>{name}:{String(value)}</span>;
    }
    const output = renderToString(<NodeStateHandoffContext.Provider value={{ target: after.document, previous: before, collect: false }}>
      <DocumentProvider document={after.document} extensions={extensions}><Probe name="outer" />
        <DocumentProvider document={after.document} extensions={extensions}><Probe name="inner" /></DocumentProvider>
      </DocumentProvider>
    </NodeStateHandoffContext.Provider>);
    expect(output.replace(/<!-- -->/g, '')).toContain('outer:true'); expect(output.replace(/<!-- -->/g, '')).toContain('inner:false');
  });
});
