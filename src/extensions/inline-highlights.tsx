import { rangeOf, type Annotation, type HighlightData, type MarkdownNode, type SourceRange } from '../core';
import type { NodeRenderer, RendererExtension } from '../react/types';
import { point, sliceChildren, textTokens } from './inline-source';

export interface InlineHighlightOptions { color?: string; component?: NodeRenderer }
const Content: NodeRenderer = ({ children }) => <>{children}</>;

/** Markdown-authored highlights share the normal paint/hover/copy machinery,
 * while their source remains the authority for editing. */
export function inlineHighlights(options: InlineHighlightOptions = {}): RendererExtension {
  const decorate = (node: MarkdownNode, range: SourceRange) => {
    node.type = 'embeddedHighlight'; node.highlightRange = range;
    node.highlightColor = options.color ?? 'var(--limr-inline-highlight, #6B9BD2)';
    node.annotation = { id: `inline-highlight:${rangeOf(node).start}`, type: 'highlight', range,
      data: { color: String(node.highlightColor), style: 'background', readOnly: true },
      source: { module: 'inline-highlights', ranges: [rangeOf(node)] },
    } satisfies Annotation<HighlightData>;
  };
  return {
    name: 'inline-highlights', tags: ['highlight'], scope: 'local', components: { embeddedHighlight: options.component ?? Content },
    transform(root, { source, streaming }) {
      const visit = (node: MarkdownNode) => {
        if (!node.children || ['code', 'inlineCode', 'math', 'inlineMath', 'html', 'footnoteDefinition', 'annotationDefinition'].includes(node.type)) return;
        node.children.forEach(visit);
        if (node.type === 'component' && node.name === 'highlight') {
          const first = node.children[0], last = node.children.at(-1);
          if (first && last) decorate(node, { start: rangeOf(first).start, end: rangeOf(last).end });
          return;
        }
        const tokens = textTokens(node.children, /(?<!=)==(?!=)/g, source);
        if (!node.position) return;
        if (!tokens.length) {
          const last = node.children.at(-1), end = rangeOf(node).end;
          if (streaming && end === source.length && last?.type === 'text' && source.endsWith('=') && source[end - 2] !== '\\') node.children = sliceChildren(node.children, rangeOf(node).start, end - 1, source);
          return;
        }
        const children: MarkdownNode[] = [];
        let from = rangeOf(node).start;
        for (let index = 0; index < tokens.length; index += 2) {
          const open = tokens[index], close = tokens[index + 1];
          if (!close && (!streaming || rangeOf(node).end < source.trimEnd().length)) break;
          let end = close?.start ?? rangeOf(node).end;
          // A closing delimiter may arrive one character at a time.
          if (!close && source[end - 1] === '=' && source[end - 2] !== '=' && source[end - 2] !== '\\') end--;
          const body = sliceChildren(node.children, open.end, end, source);
          if (!body.length && close) continue;
          children.push(...sliceChildren(node.children, from, open.start, source));
          const highlight: MarkdownNode = { type: 'embeddedHighlight', inline: true, children: body, incomplete: close ? undefined : true,
            position: { start: point(source, open.start, node.position.start), end: point(source, close?.end ?? rangeOf(node).end, node.position.start) } };
          if (body.length) decorate(highlight, { start: open.end, end }); children.push(highlight);
          from = close?.end ?? rangeOf(node).end;
        }
        children.push(...sliceChildren(node.children, from, rangeOf(node).end, source));
        node.children = children;
      };
      visit(root);
    },
  };
}
