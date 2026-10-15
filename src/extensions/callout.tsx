import { useState, type CSSProperties } from 'react';
import { walk } from '../core';
import { sliceInline } from './inline-source';
import { BlockLoading } from '../components/LoadingRing';
import { Collapse } from '../components/Collapse';
import { ToolIcon } from '../components/ToolIcon';
import { useLocale } from '../react/context';
import type { NodeRenderer, NodeRendererProps, RendererExtension } from '../react/types';
import { defineBlock } from './define';

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
  const [expanded, setExpanded] = useState(fold !== '-' && fold !== 'closed');
  const content = <div className="limr-block-content">{renderChildren(body)}</div>;
  const label = <span>{title ? renderChildren(title.children ?? []) : node.attributes?.title ? renderAttribute('title') : <span data-limr-ignore="true">{name.charAt(0).toUpperCase() + name.slice(1)}</span>}</span>;
  return <aside className="limr-note limr-callout" data-callout={name} data-callout-type={type} style={{ '--limr-callout-color': types[type] } as CSSProperties}>
    <div className="limr-card-label limr-callout-title">{label}{fold && <button type="button" className="limr-callout-toggle" aria-label={expanded ? zh ? '收起提示块' : 'Collapse callout' : zh ? '展开提示块' : 'Expand callout'} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} data-limr-ignore="true"><ToolIcon name="chevron" /></button>}</div>
    {fold ? <Collapse open={expanded} keepMounted>{content}</Collapse> : content}
  </aside>;
}

/** Obsidian blockquotes and LiMR ::callout share the same renderer and AST. */
export function callout(options: { component?: NodeRenderer } = {}): RendererExtension {
  return { ...defineBlock({ name: 'callout', component: options.component ?? Callout, streaming: options.component ? undefined : { Loading: BlockLoading } }),
    transform(root, context) {
      walk(root, node => {
        if (node.type !== 'blockquote') return;
        const first = node.children?.[0];
        if (first?.type !== 'paragraph' || !first.position) return;
        const from = first.position.start.offset, end = first.position.end.offset;
        const raw = context.source.slice(from, end);
        const header = /^\[!([\w-]+)\]([+-])?[ \t]*/.exec(raw);
        if (!header) {
          if (context.streaming && /^\[![\w-]*$/.test(raw)) { node.type = 'callout'; node.incomplete = true; node.children = []; }
          return;
        }
        node.type = 'callout';
        node.attributes = { type: header[1].toLowerCase(), ...(header[2] ? { fold: header[2] } : {}) };
        const newline = /\r\n|\r|\n/.exec(raw), titleEnd = newline ? from + newline.index : end;
        const bodyStart = newline ? titleEnd + newline[0].length : end;
        const title = sliceInline(first, from + header[0].length, titleEnd, context.source);
        const body = sliceInline(first, bodyStart, end, context.source);
        node.children = [...title?.children?.length ? [{ ...title, type: 'calloutTitle' }] : [], ...body?.children?.length ? [body] : [], ...node.children!.slice(1)];
      });
    },
  };
}
