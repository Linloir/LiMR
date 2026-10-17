import { literalDirective } from './literal-directive';
import { rangeOf, walk } from '../core/tree';
import type { MarkdownNode, SyntaxExtension } from '../core/types';
import { sliceInline } from './inline-source';

export const transformCallout: NonNullable<SyntaxExtension['transform']> = (root, context) => {
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

};

export const transformCitation: NonNullable<SyntaxExtension['transform']> = (root) => {
  walk(root, node => {
    if (node.type !== 'component' || node.incomplete) return;
    if (node.name === 'citation') {
      const attributes = node.attributes ?? {};
      const id = String(attributes['cite-id'] ?? attributes.id ?? '');
      node.type = 'annotationDefinition';
      node.annotation = { id, type: 'citation', data: { title: attributes.title, url: attributes.url, description: attributes.desc ?? attributes.description, summary: attributes.summary } };
    } else if (node.name === 'ref') {
      const value = String(node.attributes?.['cite-from-ids'] ?? node.attributes?.ids ?? node.attributes?.id ?? '');
      let ids: string[];
      try { const parsed = JSON.parse(value); ids = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)]; }
      catch { ids = value.split(',').map(id => id.trim()).filter(Boolean); }
      node.type = 'annotationReference'; node.annotationIds = ids;
      const first = node.children?.[0], last = node.children?.at(-1);
      if (first && last) node.referenceRange = { start: rangeOf(first).start, end: rangeOf(last).end };
    }
  });

};

export const transformFigures: NonNullable<SyntaxExtension['transform']> = (root) => {
  // Attribute images retain a source binding just like Markdown images.
  const visit = (node: MarkdownNode) => {
    if (node.type === 'component' && node.name === 'img') { node.selection = 'atomic'; node.inline = true; }
    if (node.type === 'component' && node.name === 'figure' && (node.attributes?.src || node.attributes?.url)) {
      const image = node.attributeNodes?.[node.attributes.src ? 'src' : 'url'];
      node.children = [{ type: 'image', url: node.attributes.src ?? node.attributes.url, alt: node.attributes.alt ?? '', position: image?.position ?? node.position }, ...(node.children ?? [])];
    }
    node.children?.forEach(visit);
  };
  visit(root);

};

export const transformCode: NonNullable<SyntaxExtension['transform']> = (root, context) => literalDirective(root, context.source, 'code', ['code', 'code-highlight']);
export const transformMermaid: NonNullable<SyntaxExtension['transform']> = (root, context) => {
  literalDirective(root, context.source, 'mermaid');
  walk(root, node => {
    if (node.type === 'code' && String(node.lang).toLowerCase() === 'mermaid') node.type = 'mermaid';
    if (node.type === 'mermaid') node.selection = 'atomic';
  });
};
