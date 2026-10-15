import { useMemo } from 'react';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { rangeOf, textContent, type Annotation, type MarkdownNode, type SourceRange } from '../core';
import { useLocale } from '../react/context';
import type { AnnotationContentProps, AnnotationOverlayCardProps, AnnotationSidebarPreviewProps, AnnotationType, RendererExtension } from '../react/types';
import { AnnotationCard } from '../components/AnnotationCard';
import { ToolIcon } from '../components/ToolIcon';
import { point, sliceChildren, textTokens } from './inline-source';
import { SourceAnnotationBody } from './source-annotation-actions';

export interface FootnoteData { body: string; title?: string }
const idFor = (identifier: unknown) => `footnote:${String(identifier).trim().replace(/\s+/g, ' ').toLowerCase()}`;
function Icon() { return <ToolIcon name="comment" />; }
function Content(props: AnnotationContentProps<FootnoteData>) { return <>{props.presentation === 'sidebar' && props.data?.title && <small className="limr-footnote-title">{props.data.title}</small>}<SourceAnnotationBody {...props} /></>; }
function Card(props: AnnotationOverlayCardProps<FootnoteData>) { const label = useLocale().footnotes; return <AnnotationCard {...props} title={props.annotation.data?.title ? `${label} · ${props.annotation.data.title}` : label} />; }
function Preview({ data }: AnnotationSidebarPreviewProps<FootnoteData>) {
  const summary = useMemo(() => textContent(fromMarkdown(data?.body ?? '') as unknown as MarkdownNode).replace(/\s+/g, ' ').trim(), [data?.body]);
  const text = [data?.title, summary].filter(Boolean).join(' · ');
  return text ? <span title={text}>{text}</span> : null;
}

/** GFM definitions keep their AST identity for incremental parsing, but their
 * references use the same marker/sidebar/overlay contract as other modules. */
export function footnotes(options: Partial<AnnotationType<FootnoteData>> = {}): RendererExtension {
  const type = options.type ?? 'footnote';
  const definition = (id: string, body: string, title?: string): Annotation<FootnoteData> => ({ id, type, data: { body, ...(title ? { title } : {}) } });
  return {
    name: 'footnotes', tags: ['footnote', 'footnote-ref'], scope: 'local',
    annotationTypes: [{ type, label: locale => locale.footnotes, icon: Icon, color: '#6B9BD2', highlight: 'hover', Content, ...options,
      sidebar: { Preview, collapseOnContentClick: false, ...options.sidebar }, overlay: { Card, expand: false, ...options.overlay } }],
    transform(root, { source, streaming }) {
      const visit = (node: MarkdownNode) => {
        if (node.type === 'footnoteDefinition') {
          const range = rangeOf(node), raw = source.slice(range.start, range.end);
          // Remove only the footnote container indentation; retain nested lists,
          // paragraphs, code, rich inline content and original line endings.
          const body = raw.replace(/^\[\^[^\]]+\]:[ \t]*/, '').replace(/(\r\n|\r|\n)(?: {4}|\t)/g, '$1');
          node.annotation = definition(idFor(node.identifier), body, String(node.label ?? node.identifier)); return;
        }
        if (node.type === 'footnoteReference') {
          node.type = 'annotationReference'; node.inline = true; node.annotationIds = [idFor(node.identifier)]; return;
        }
        if (node.type === 'component' && ['footnote', 'footnote-ref'].includes(node.name ?? '')) {
          if (node.incomplete) { node.children = []; return; }
          const id = idFor(node.attributes?.id ?? '');
          if (node.name === 'footnote') {
            const first = node.children?.[0], last = node.children?.at(-1);
            node.type = 'annotationDefinition'; node.annotation = definition(id, first && last ? source.slice(rangeOf(first).start, rangeOf(last).end) : String(node.attributes?.body ?? ''), String(node.attributes?.title ?? node.attributes?.id ?? ''));
            return;
          }
          node.type = 'annotationReference'; node.annotationIds = [id]; return;
        }
        if (!node.children || ['code', 'inlineCode', 'math', 'inlineMath', 'html', 'annotationDefinition'].includes(node.type)) return;
        node.children.forEach(visit);
        const opens = textTokens(node.children, /\^\[/g, source);
        if (opens.length && node.position) {
          const children: MarkdownNode[] = [], range = rangeOf(node);
          let from = range.start;
          for (const open of opens) {
            if (open.start < from) continue;
            let depth = 1, at = open.end;
            const protectedNodes = node.children.filter(child => child.type !== 'text').map(rangeOf);
            for (; at < range.end && depth; at++) {
              const protectedNode = protectedNodes.find(child => child.start <= at && child.end > at);
              if (protectedNode) { at = protectedNode.end - 1; continue; }
              if (source[at] === '\\') { at++; continue; }
              if (source[at] === '[') depth++; else if (source[at] === ']') depth--;
            }
            if (depth) {
              if (streaming && range.end >= source.trimEnd().length) { children.push(...sliceChildren(node.children, from, open.start, source)); from = range.end; break; }
              continue;
            }
            const id = `inline-footnote:${open.start}`;
            children.push(...sliceChildren(node.children, from, open.start, source), {
              type: 'annotationReference', inline: true, annotationIds: [id], annotation: definition(id, source.slice(open.end, at - 1)),
              position: { start: point(source, open.start, node.position.start), end: point(source, at, node.position.start) },
            });
            from = at;
          }
          children.push(...sliceChildren(node.children, from, range.end, source)); node.children = children;
        }
        node.children.forEach((child, index) => {
          const previous = node.children![index - 1];
          if (child.type === 'annotationReference' && previous?.type === 'embeddedHighlight' && rangeOf(previous).end === rangeOf(child).start) child.referenceRange = previous.highlightRange as SourceRange;
        });
      };
      visit(root);
    },
  };
}
