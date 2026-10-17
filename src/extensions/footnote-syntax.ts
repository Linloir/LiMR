import { rangeOf } from '../core/tree';
import type { Annotation, MarkdownNode, SourceRange, SyntaxExtension } from '../core/types';
import { point, sliceChildren, textTokens } from './inline-source';

const idFor = (identifier: unknown) => `footnote:${String(identifier).trim().replace(/\s+/g, ' ').toLowerCase()}`;
export function footnoteSyntax(type = 'footnote'): SyntaxExtension {
  const definition = (id: string, body: string, title?: string): Annotation => ({ id, type, data: { body, ...(title ? { title } : {}) } });
  return { name: 'footnotes', tags: ['footnote', 'footnote-ref'], scope: 'local',
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
          if (child.type === 'annotationReference' && previous?.type === 'embeddedHighlight' && rangeOf(previous).end === rangeOf(child).start) {
            child.referenceRange = previous.highlightRange as SourceRange;
            child.referenceColor = previous.highlightColor;
            delete previous.annotation;
          }
        });
      };
      visit(root);
    },
  };
}
