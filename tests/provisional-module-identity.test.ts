import { describe, expect, it } from 'vitest';
import type { MarkdownNode } from '../src/core';
import { standard } from '../src/extensions/standard';
import { ReaderRuntime, Store } from '../src/react/runtime';
import { calloutStateIdentity, tableStateIdentity, translationStateIdentity } from '../src/react/module-state-identity';
import { collectNodeState, declareNodeStateRenderer, inheritNodeState, registerNodeState, type NodeStateOwner } from '../src/react/node-state-handoff';

const samples = [
  { name: 'translations', type: 'component', source: '<translations>\n<origin>\n\nOriginal [later][destination].\n\n</origin>\n<translation>\n\nTranslated [later][destination].\n\n</translation>\n</translations>\n\n', signature: translationStateIdentity },
  { name: 'callout', type: 'callout', source: '> [!NOTE]- Fold this container\n> Body [later][destination].\n\n', signature: calloutStateIdentity },
  { name: 'table', type: 'table', source: '| Header | Other |\n| --- | --- |\n| [later][destination] | Value |\n\n', signature: tableStateIdentity },
] as const;
function find(runtime: ReaderRuntime, name: string): MarkdownNode {
  let found: MarkdownNode | undefined;
  function visit(node: MarkdownNode) { if (node.name === name || node.type === name) found ??= node; node.children?.forEach(visit); }
  runtime.document.getSnapshot().blocks.forEach(block => visit(block.node));
  expect(found, `Real parsed ${name} owner`).toBeDefined(); return found!;
}
function pair(sample: { name: string; source: string; signature: typeof translationStateIdentity }) {
  const extensions = standard(), options = { extensions };
  const before = new ReaderRuntime('module-choice', sample.source, true, { ...options, provisional: true });
  const after = new ReaderRuntime('module-choice', sample.source + 'Final paragraph.\n\n[destination]: /resolved-later\n', false, options);
  return { before, after, oldNode: find(before, sample.name), node: find(after, sample.name) };
}
function changed(node: MarkdownNode, edit: (node: MarkdownNode) => void): MarkdownNode { const next = structuredClone(node); edit(next); return next; }
function role(node: MarkdownNode, name: string): MarkdownNode {
  let found: MarkdownNode | undefined; const visit = (current: MarkdownNode) => { if (current.name === name) found ??= current; current.children?.forEach(visit); }; visit(node); expect(found).toBeDefined(); return found!;
}

describe('module-owned provisional choices', () => {
  for (const sample of samples) it(`keeps the ${sample.name} choice when later reference definitions resolve descendants`, () => {
    const { before, after, oldNode, node } = pair(sample), oldJSON = JSON.stringify(oldNode), finalJSON = JSON.stringify(node);
    expect(oldJSON).not.toBe(finalJSON); // The fixture must really reinterpret content.
    const signature = sample.signature(oldNode); expect(signature).toBeDefined();
    expect(sample.signature(node, signature!.work)).toEqual(signature);
    expect(oldNode.position).toEqual(node.position);
    const owner: NodeStateOwner = { name: 'module-choice-test-' + sample.name, ...(sample.name === 'table' ? { nativeTypes: ['table'] } : {}), keys: { choice: value => value === true }, signature: sample.signature };
    if (sample.name !== 'table') declareNodeStateRenderer(owner, before.components[sample.name]);
    collectNodeState(before); const choice = new Store<unknown>(true);
    registerNodeState(before, owner, oldNode, 'choice', choice); inheritNodeState(after, before);
    expect(after.nodeStates.get(node)?.get('choice')).toBe(choice);
    expect(JSON.stringify(oldNode)).toBe(oldJSON); expect(JSON.stringify(node)).toBe(finalJSON);
  });
  it('uses measured old work rather than compact key length for unchanged large containers', () => {
    const longSamples = [
      { ...samples[1], source: '> [!NOTE]- Many complete paragraphs\n' + Array.from({ length: 300 }, (_, i) => `>\n> Body paragraph ${i}.\n`).join('') + '\n' },
      { ...samples[0], source: '<translations>\n\n' + Array.from({ length: 300 }, (_, i) => `Ignored paragraph ${i}.\n\n`).join('') + '<origin>\n\nOriginal.\n\n</origin>\n<translation>\n\nTranslated.\n\n</translation>\n</translations>\n\n' },
    ];
    for (const sample of longSamples) {
      const { before, after, oldNode, node } = pair(sample), signature = sample.signature(oldNode); expect(signature).toBeDefined();
      expect(oldNode.children!.length).toBeGreaterThan(signature!.key.length);
      expect(sample.signature(node, signature!.work)).toEqual(signature);
      const owner: NodeStateOwner = { name: 'large-module-test-' + sample.name, keys: { choice: value => value === true }, signature: sample.signature };
      declareNodeStateRenderer(owner, before.components[sample.name]); collectNodeState(before);
      const store = new Store<unknown>(true); registerNodeState(before, owner, oldNode, 'choice', store); inheritNodeState(after, before);
      expect(after.nodeStates.get(node)?.get('choice')).toBe(store);
    }
  });
  it('bounds a changed final source-owner search by the real old-prefix traversal', () => {
    const { before, after, oldNode, node } = pair(samples[1]);
    const owner: NodeStateOwner = { name: 'bounded-callout-test', keys: { choice: value => value === true }, signature: calloutStateIdentity };
    declareNodeStateRenderer(owner, before.components.callout); collectNodeState(before);
    registerNodeState(before, owner, oldNode, 'choice', new Store<unknown>(true));
    let reads = 0; node.children = new Array(1_000_000); Object.defineProperty(node.children, '0', { get() { reads++; throw new Error('Changed giant children must not be visited'); } });
    inheritNodeState(after, before); expect(reads).toBe(0); expect(after.nodeStates.get(node)?.has('choice') ?? false).toBe(false);
  });
  it('rejects changed translation role boundaries, default, duplicates and incomplete regions', () => {
    const { oldNode } = pair(samples[0]), signature = translationStateIdentity(oldNode); expect(signature).toBeDefined();
    for (const altered of [
      changed(oldNode, node => { role(node, 'translation').position!.start.offset++; }),
      changed(oldNode, node => { node.attributes = { ...node.attributes, default: 'both' }; }),
      changed(oldNode, node => { node.children!.push(structuredClone(role(node, 'origin'))); }),
      changed(oldNode, node => { role(node, 'origin').incomplete = true; }),
    ]) expect(translationStateIdentity(altered)).not.toEqual(signature);
  });
  it('rejects changed callout fold ownership but does not inspect resolved body payloads', () => {
    const { oldNode } = pair(samples[1]), signature = calloutStateIdentity(oldNode); expect(signature).toBeDefined();
    for (const [key, value] of [['fold', '+'], ['type', 'warning']]) expect(calloutStateIdentity(changed(oldNode, node => { node.attributes = { ...node.attributes, [key]: value }; }))).not.toEqual(signature);
    const bodyChanged = structuredClone(oldNode); Object.defineProperty(bodyChanged, 'children', { get() { throw new Error('Choice proof must not inspect resolved body'); } });
    expect(calloutStateIdentity(bodyChanged, signature!.work)).toEqual(signature);
  });
  it('ties table expansion to the indexed row/cell source ownership rather than inline interpretation or alignment', () => {
    const { oldNode } = pair(samples[2]), signature = tableStateIdentity(oldNode); expect(signature).toBeDefined();
    expect(tableStateIdentity(changed(oldNode, node => { node.align = ['right', 'left']; }), signature!.work)).toEqual(signature);
    for (const altered of [
      changed(oldNode, node => { node.children!.reverse(); }),
      changed(oldNode, node => { node.children![1].children![0].position!.start.offset++; }),
      changed(oldNode, node => { node.children![1].children!.pop(); }),
    ]) expect(tableStateIdentity(altered)).not.toEqual(signature);
    const bodyChanged = structuredClone(oldNode); for (const row of bodyChanged.children!) for (const cell of row.children!) Object.defineProperty(cell, 'children', { get() { throw new Error('Choice proof must not inspect resolved inline payload'); } });
    expect(tableStateIdentity(bodyChanged, signature!.work)).toEqual(signature);
  });
  it('refuses accessor owner fields and stops before allocating changed oversized row arrays', () => {
    const { oldNode } = pair(samples[2]), signature = tableStateIdentity(oldNode); expect(signature).toBeDefined();
    const accessor = structuredClone(oldNode); let reads = 0; Object.defineProperty(accessor, 'position', { get() { reads++; return oldNode.position; } });
    expect(tableStateIdentity(accessor)).toBeUndefined(); expect(reads).toBe(0);
    const oversized = structuredClone(oldNode); oversized.children = new Array(1_000_000);
    expect(tableStateIdentity(oversized, signature!.work)).toBeUndefined();
  });
});
