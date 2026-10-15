import { rangeOf, type Annotation, type HighlightData, type MarkdownNode, type SourceAnnotationRange } from '../core';
import type { RendererExtension } from '../react/types';
import { point, sliceChildren, textTokens } from './inline-source';
import { editSourceAnnotations } from './source-annotation-editing';

/** The reserved spelling is deliberately case-sensitive; ordinary footnotes
 * continue to use GFM's normalized, case-insensitive identifiers. */
const reserved = /^\[\^%%limr:([^\]\s%]+)%%\]$/;
const label = /^%%limr:([^\]\s%]+)%%$/;
const ignored = new Set(['code', 'inlineCode', 'math', 'inlineMath', 'html', 'footnoteDefinition', 'annotationDefinition']);

/** Source-authored annotations resolve named anchors after local parsing, so a
 * definition arriving later in a stream does not reparse preceding prose. */
export function sourceAnnotations(): RendererExtension {
  return {
    name: 'source-annotations', tags: ['limr-annotation'], scope: 'local',
    sourceEditing: { annotations: editSourceAnnotations },
    transform(root, { source }) {
      const visit = (node: MarkdownNode) => {
        if (node.type === 'footnoteDefinition' && label.test(String(node.label ?? node.identifier))) {
          // These optional definitions exist solely for ordinary Markdown
          // viewers. Their bodies never become LiMR annotation cards.
          node.type = 'annotationDefinition'; delete node.annotation; node.children = []; return;
        }
        if (node.type === 'component' && node.name === 'limr-annotation') {
          const attrs = node.attributes ?? {}, id = String(attrs.id ?? ''), type = String(attrs.type ?? 'footnote');
          const first = node.children?.[0], last = node.children?.at(-1);
          const body = first && last ? source.slice(rangeOf(first).start, rangeOf(last).end) : String(attrs.body ?? '');
          node.type = 'annotationDefinition'; node.children = [];
          if (node.incomplete || !id) return;
          const rangeIds = [...new Set(String(attrs.ranges ?? '').split(/[\s,]+/).filter(Boolean))];
          const attributes = Object.fromEntries(Object.entries(attrs).filter(([key]) => !['id', 'ranges', 'type', 'body'].includes(key)));
          const data = type === 'highlight' ? {
            ...attributes,
            color: String(attrs.color ?? 'var(--limr-inline-highlight, #6B9BD2)'),
            style: ['background', 'underline', 'dotted', 'wavy'].includes(String(attrs.style)) ? attrs.style as HighlightData['style'] : 'background',
            hidden: attrs.hidden === true || attrs.hidden === 'true', readOnly: true,
          } satisfies HighlightData : { ...attributes, body };
          node.annotation = { id, type, data, source: { module: 'source-annotations', ranges: [rangeOf(node)], rangeIds } } satisfies Annotation;
          return;
        }
        if (node.type === 'annotationReference' || node.type === 'footnoteReference') {
          const id = reserved.exec(source.slice(rangeOf(node).start, rangeOf(node).end))?.[1];
          if (id) { node.type = 'annotationReference'; node.inline = true; node.annotationIds = []; node.sourceRangeId = id; delete node.annotation; delete node.identifier; delete node.label; }
        }
        if (!node.children || ignored.has(node.type)) return;
        node.children.forEach(visit);
        // GFM only parses footnote references once their optional definition
        // exists. Recognize undefined reserved refs directly in mapped text.
        // Directive tokenizers can split the `:id` part of an undefined
        // reference into a textDirective (or a registered component). Start in
        // literal mapped text, then absorb only that exact reserved spelling.
        const tokens = textTokens(node.children, /\[\^%%limr/g, source).flatMap(open => {
          const match = /^\[\^%%limr:[^\]\s%]+%%\]/.exec(source.slice(open.start));
          if (!match) return [];
          const end = open.start + match[0].length;
          const valid = node.children!.every(child => {
            const range = rangeOf(child);
            // The mapped opening must start in literal text. Once the complete
            // reserved label is known, punctuation in its ID belongs to the
            // label, even if a preceding tokenizer split it into inline nodes.
            // Constructs containing the opening (code, links, math) never enter
            // this path because textTokens only examines direct text children.
            return range.end <= open.start || range.start >= end || child.type === 'text'
              || range.start >= open.start && range.end <= end;
          });
          return valid ? [{ start: open.start, end }] : [];
        });
        if (tokens.length && node.position) {
          const children: MarkdownNode[] = [];
          let from = rangeOf(node).start;
          for (const token of tokens) {
            const id = reserved.exec(source.slice(token.start, token.end))![1];
            children.push(...sliceChildren(node.children, from, token.start, source), {
              type: 'annotationReference', inline: true, annotationIds: [], sourceRangeId: id,
              position: { start: point(source, token.start, node.position.start), end: point(source, token.end, node.position.start) },
            });
            from = token.end;
          }
          children.push(...sliceChildren(node.children, from, rangeOf(node).end, source)); node.children = children;
        }
        node.children.forEach((child, index) => {
          if (!child.sourceRangeId) return;
          const previous = node.children![index - 1], markerRange = rangeOf(child);
          const scoped = previous?.type === 'embeddedHighlight' && rangeOf(previous).end === markerRange.start;
          const range = scoped ? previous.highlightRange as SourceAnnotationRange['range'] : { start: markerRange.start, end: markerRange.start };
          if (scoped) { delete previous.annotation; child.referenceColor = previous.highlightColor; }
          child.referenceRange = range;
          child.sourceAnnotationRange = { id: String(child.sourceRangeId), range, markerRange, syntaxRange: scoped ? rangeOf(previous) : range } satisfies SourceAnnotationRange;
        });
      };
      visit(root);
    },
  };
}
