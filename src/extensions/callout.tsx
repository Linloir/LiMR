import { transformCallout } from './syntax-transforms';
import type { CSSProperties } from 'react';
import { walk } from '../core';
import { sliceInline } from './inline-source';
import { BlockLoading } from '../components/LoadingRing';
import { Collapse } from '../components/Collapse';
import { ToolIcon } from '../components/ToolIcon';
import { useLocale, useOwnedNodeState } from '../react/context';
import type { NodeRenderer, NodeRendererProps, RendererExtension } from '../react/types';
import { defineBlock } from './define';
import { declareNodeStateRenderer, type NodeStateOwner } from '../react/node-state-handoff';
import { calloutStateIdentity } from '../react/module-state-identity';

const calloutStateOwner: NodeStateOwner = { name: 'calloutStateOwner', keys: { 'callout-expanded': value => typeof value === 'boolean' }, signature: calloutStateIdentity };


const types: Record<string, string> = {
  note: '#6488b5', abstract: '#4b9ba0', info: '#6488b5',
  todo: '#6488b5', tip: '#4b9b8d', success: '#659664',
  question: '#b38b4e', warning: '#bc8850', failure: '#be6967',
  danger: '#be6967', bug: '#be6967', example: '#9580b4', quote: '#928b80',
};
const aliases: Record<string, string> = { summary: 'abstract', tldr: 'abstract', hint: 'tip', important: 'tip', check: 'success', done: 'success', help: 'question', faq: 'question', caution: 'warning', attention: 'warning', fail: 'failure', missing: 'failure', error: 'danger', cite: 'quote' };
export function calloutType(value: string): string {
  const name = value.toLowerCase();
  return aliases[name] ?? (Object.hasOwn(types, name) ? name : 'note');
}

function Callout({ node, renderChildren, renderAttribute }: NodeRendererProps) {
  const zh = useLocale().language?.startsWith('zh');
  const name = String(node.attributes?.type ?? 'note').toLowerCase(), type = calloutType(name);
  const title = node.children?.find(child => child.type === 'calloutTitle');
  const body = node.children?.filter(child => child.type !== 'calloutTitle') ?? [];
  const fold = node.attributes?.fold;
  const [expanded, setExpanded] = useOwnedNodeState(calloutStateOwner, node, 'callout-expanded', fold !== '-' && fold !== 'closed');
  const content = <div className="limr-block-content">{renderChildren(body)}</div>;
  const label = <span>{title ? renderChildren(title.children ?? []) : node.attributes?.title ? renderAttribute('title') : <span data-limr-ignore="true">{name.charAt(0).toUpperCase() + name.slice(1)}</span>}</span>;
  return <aside className="limr-note limr-callout" data-callout={name} data-callout-type={type} data-collapsed={fold && !expanded || undefined} style={{ '--limr-callout-color': types[type] } as CSSProperties}>
    <div className="limr-card-label limr-callout-title">{label}{fold && <button type="button" className="limr-callout-toggle" aria-label={expanded ? zh ? '收起提示块' : 'Collapse callout' : zh ? '展开提示块' : 'Expand callout'} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} data-limr-ignore="true"><ToolIcon name="chevron" /></button>}</div>
    {fold ? <Collapse open={expanded} keepMounted>{content}</Collapse> : content}
  </aside>;
}

/** Obsidian blockquotes and LiMR ::callout share the same renderer and AST. */
export function callout(options: { component?: NodeRenderer } = {}): RendererExtension {
  if (!options.component) declareNodeStateRenderer(calloutStateOwner, Callout);
  return { ...defineBlock({ name: 'callout', component: options.component ?? Callout, streaming: options.component ? undefined : { Loading: BlockLoading } }),
    transform: transformCallout,
  };
}
