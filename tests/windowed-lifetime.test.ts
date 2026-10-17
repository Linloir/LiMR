import { describe, expect, it, vi } from 'vitest';
import type { Block, MarkdownNode } from '../src/core';
import { ReaderRuntime } from '../src/react/runtime';
import { windowedKeepAliveBlocks } from '../src/react/windowed-lifetime';
import type { RendererExtension, ViewConfiguration, VirtualizedRenderer } from '../src/react/types';

const component = () => null;
const keep: VirtualizedRenderer = { copyText: (_node, { children }) => children, keepAlive: true };
const release: VirtualizedRenderer = { copyText: (_node, { children }) => children };
const runtime = (config: ViewConfiguration) => new ReaderRuntime('lifetime', '', false, config);
const block = (node: MarkdownNode, pending = false): Block => ({ id: 'test', node, range: { start: 0, end: 1 }, pending });
const text = (value: string): MarkdownNode => ({ type: 'text', value });
const paragraph = (value: string): MarkdownNode => ({ type: 'paragraph', children: [text(value)] });
const module = (name: string, adapter: VirtualizedRenderer | undefined): RendererExtension => ({
  name, components: { paragraph: component }, ...(adapter ? { virtualization: { paragraph: adapter } } : {}),
});

describe('windowed custom renderer lifetime ownership', () => {
  it('uses the last actual component owner rather than an earlier same-name lifetime adapter', () => {
    const first = module('stateful', keep), last = module('replacement', release);
    const blocks = [block(paragraph('State belongs to the replacement.'))];
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [first, last] }), blocks)]).toEqual([]);
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [last, first] }), blocks)]).toEqual([0]);
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [first, module('opaque replacement', undefined)] }), blocks)]).toEqual([]);
  });

  it('respects reader-local component shadowing and an explicit later contracted override', () => {
    const config: ViewConfiguration = { extensions: [module('stateful', keep)], components: { paragraph: component } };
    const blocks = [block(paragraph('The reader-local component owns this paragraph.'))];
    expect([...windowedKeepAliveBlocks(runtime(config), blocks)]).toEqual([]);
    expect([...windowedKeepAliveBlocks(runtime({ ...config, rendererOverrides: [{ type: 'paragraph', component, virtualization: keep }] }), blocks)]).toEqual([0]);
  });

  it('lets rejected conditional overrides fall through and a matching release override veto a lease', () => {
    const matches = (value: string) => (node: MarkdownNode) => node.children?.[0].value === value;
    const reader = runtime({ extensions: [module('stateful', keep)], rendererOverrides: [
      { type: 'paragraph', component, when: matches('kept'), virtualization: keep },
      { type: 'paragraph', component, when: matches('released'), virtualization: release },
    ] });
    const blocks = ['kept', 'released', 'fallback'].map(value => block(paragraph(value)));
    expect([...windowedKeepAliveBlocks(reader, blocks)]).toEqual([0, 2]);
  });

  it('retains extension override ordering relative to reader overrides', () => {
    const extension: RendererExtension = { name: 'rule owner', rendererOverrides: [{ type: 'paragraph', component, virtualization: keep }] };
    const blocks = [block(paragraph('A later rule releases this component.'))];
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [extension], rendererOverrides: [{ type: 'paragraph', component, virtualization: release }] }), blocks)]).toEqual([]);
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [extension], rendererOverrides: [{ type: 'paragraph', component, when: () => false, virtualization: release }] }), blocks)]).toEqual([0]);
  });

  it('matches a component by its authored name rather than the generic component AST type', () => {
    const named: MarkdownNode = { type: 'component', name: 'stateful-card', children: [paragraph('Stateful body.')] };
    const other: MarkdownNode = { ...named, name: 'plain-card' };
    const reader = runtime({ extensions: [{ name: 'cards', components: { 'stateful-card': component }, virtualization: { 'stateful-card': keep } }] });
    expect([...windowedKeepAliveBlocks(reader, [block(named), block(other)])]).toEqual([0]);
    const generic = runtime({ rendererOverrides: [{ type: 'component', component, virtualization: keep }] });
    expect([...windowedKeepAliveBlocks(generic, [block(named)])]).toEqual([]);
  });

  it('passes the block pending flag, per-node incompleteness and exact ancestors to the existing predicate', () => {
    const make = (incomplete: boolean): MarkdownNode => ({ type: 'blockquote', children: [{ type: 'paragraph', children: [{ type: 'strong', incomplete, children: [text('draft')] }] }] });
    const reader = runtime({ rendererOverrides: [{ type: 'strong', component, virtualization: keep,
      when: (_node, context) => context.pending && context.incomplete && context.ancestors.map(node => node.type).join('/') === 'blockquote/paragraph',
    }] });
    expect([...windowedKeepAliveBlocks(reader, [block(make(true), true), block(make(true)), block(make(false), true), block(make(false))])]).toEqual([0]);
  });

  it('does not mutate ancestor arrays retained by a predicate while traversing siblings and later blocks', () => {
    const retained: (readonly MarkdownNode[])[] = [];
    const strong = (): MarkdownNode => ({ type: 'strong', children: [text('word')] });
    const first: MarkdownNode = { type: 'blockquote', children: [{ type: 'paragraph', children: [strong(), strong()] }] };
    const second: MarkdownNode = { type: 'list', children: [{ type: 'listItem', children: [{ type: 'paragraph', children: [strong()] }] }] };
    const reader = runtime({ rendererOverrides: [{ type: 'strong', component, virtualization: keep,
      when: (_node, context) => { retained.push(context.ancestors); return false; },
    }] });
    expect([...windowedKeepAliveBlocks(reader, [block(first), block(second)])]).toEqual([]);
    expect(retained.map(ancestors => ancestors.map(node => node.type))).toEqual([
      ['blockquote', 'paragraph'], ['blockquote', 'paragraph'], ['list', 'listItem', 'paragraph'],
    ]);
    expect(retained[0]).not.toBe(retained[1]);
    expect(retained[0][0]).toBe(first); expect(retained[2][0]).toBe(second);
  });

  it('ignores orphan adapters without a corresponding component and avoids unrelated predicate work', () => {
    const unrelated = vi.fn(() => true);
    const orphan: RendererExtension = { name: 'orphan', components: { heading: component }, virtualization: { paragraph: keep } };
    expect([...windowedKeepAliveBlocks(runtime({ extensions: [module('actual owner', release), orphan] }), [block(paragraph('The orphan cannot take over another component.'))])]).toEqual([]);
    const reader = runtime({ extensions: [orphan],
      rendererOverrides: [{ type: 'paragraph', component, when: unrelated, virtualization: release }] });
    expect([...windowedKeepAliveBlocks(reader, [block(paragraph('No component owns the orphan adapter.'))])]).toEqual([]);
    expect(unrelated).not.toHaveBeenCalled();
  });
});
