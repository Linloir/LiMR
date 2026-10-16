import { fromMarkdown } from 'mdast-util-from-markdown';
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { omitSource, rangeOf, type Annotation, type HighlightData, type MarkdownNode, type ParseContext, type SourceAnnotationRange, type SourceRange, type SyntaxExtension } from '../core';
import { lineStarts, sourcePoint } from '../core/tree';
import { prepareSource } from '../core/streaming';
import type { RendererExtension } from '../react/types';
import { editSourceAnnotations } from './source-annotation-editing';
import { annotationBody } from './source-annotation-format';
import { sourceAnnotationTokenizer } from './source-annotation-tokenizer';

const marker = /::%%limr%%\{([<>])#([A-Za-z0-9][A-Za-z0-9_.:-]*)\}/g;
interface Boundary extends SourceRange { id: string; opening: boolean }
interface Prepared { ranges: SourceAnnotationRange[]; definitions: SourceRange[] }
const isEscaped = (source: string, at: number) => {
  let slashes = 0;
  while (at > 0 && source[--at] === '\\') slashes++;
  return slashes % 2 === 1;
};

/** Discover definitions using Markdown's own block grammar. Removing candidate
 * boundaries here also permits a range to surround a fenced code block. Only
 * real, closed ::: definitions subsequently authorize any source removal. */
function prepare(source: string, extensions: readonly SyntaxExtension[]): Prepared {
  const boundaries: Boundary[] = [...source.matchAll(marker)].filter(match => !isEscaped(source, match.index!))
    .map(match => ({ start: match.index!, end: match.index! + match[0].length, id: match[2], opening: match[1] === '<' }));
  if (!boundaries.length || !source.includes(':::limr-annotation')) return { ranges: [], definitions: [] };
  const candidate = omitSource(source, boundaries);
  const names = new Set(extensions.flatMap(extension => [...extension.tags ?? [], ...extension.directives ?? []]));
  const tags = new Set(extensions.flatMap(extension => [...extension.tags ?? []]));
  const literals = new Set(extensions.filter(extension => extension.literal).flatMap(extension => [...extension.tags ?? [], ...extension.directives ?? []]));
  const adapted = prepareSource(candidate.value, names, tags, false, literals);
  const syntax = [...extensions.flatMap(extension => [...extension.micromark ?? []]), directive()];
  const mdast = [...extensions.flatMap(extension => [...extension.mdast ?? []]), directiveFromMarkdown()];
  // Match the main parser's JSX whitelist and recovery. Unknown JSX owns its
  // entire inert source, so apparent definitions inside it cannot authorize
  // removing markers elsewhere in the document.
  let tree: MarkdownNode;
  try {
    tree = fromMarkdown(adapted.value, tags.size && adapted.value.includes('<') ? {
      extensions: [...syntax, { disable: { null: ['htmlFlow', 'htmlText'] } }, mdxJsx()], mdastExtensions: [...mdast, mdxJsxFromMarkdown()],
    } : { extensions: syntax, mdastExtensions: mdast }) as unknown as MarkdownNode;
  } catch {
    tree = fromMarkdown(adapted.value, { extensions: syntax, mdastExtensions: mdast }) as unknown as MarkdownNode;
  }
  const definitions: SourceRange[] = [], finalDefinitions = new Map<string, string[]>();
  const visit = (node: MarkdownNode) => {
    if (node.type === 'footnoteDefinition' || node.type.endsWith('Directive') && literals.has(node.name ?? '')) return;
    if (['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type) && (!tags.has(node.name ?? '') || literals.has(node.name ?? ''))) return;
    if (node.type === 'containerDirective' && node.name === 'limr-annotation' && node.position) {
      const start = adapted.original(node.position.start.offset), end = adapted.original(node.position.end.offset);
      const raw = candidate.value.slice(start, end);
      const opening = /^:{3,}limr-annotation(?:\[|\{|\s|$)/.exec(raw);
      const closing = /(?:\r\n|\r|\n)(?:[ \t]*>[ \t]?)*[ \t]*(:{3,})[ \t]*$/.exec(raw);
      if (opening && closing && closing[1].length >= /^:+/.exec(opening[0])![0].length && node.attributes?.id) {
        const range = { start: candidate.original(start, 'start'), end: candidate.original(end, 'end') };
        definitions.push(range);
        const rangeIds = String(node.attributes.ranges ?? node.attributes.id).split(/[\s,]+/).filter(Boolean);
        finalDefinitions.set(String(node.attributes.id), rangeIds);
      }
      return;
    }
    node.children?.forEach(visit);
  };
  visit(tree);
  const ids = new Set([...finalDefinitions.values()].flat());
  const grouped = new Map<string, Boundary[]>();
  for (const boundary of boundaries) {
    if (!ids.has(boundary.id) || definitions.some(range => boundary.start >= range.start && boundary.end <= range.end)) continue;
    const items = grouped.get(boundary.id) ?? []; items.push(boundary); grouped.set(boundary.id, items);
  }
  const ranges: SourceAnnotationRange[] = [];
  for (const [id, items] of grouped) {
    // Reusing an ID sequentially is unambiguous. A second open before a close,
    // an orphan close, or a remaining open leaves that ID entirely literal.
    if (items.length % 2 || items.some((item, index) => item.opening !== (index % 2 === 0))) continue;
    for (let index = 0; index < items.length; index += 2) {
      const opening = items[index], closing = items[index + 1];
      ranges.push({ id, openingRange: { start: opening.start, end: opening.end }, markerRange: { start: closing.start, end: closing.end },
        range: { start: opening.end, end: closing.start }, syntaxRange: { start: opening.start, end: closing.end } });
    }
  }
  return { ranges: ranges.sort((a, b) => a.markerRange.start - b.markerRange.start), definitions };
}

/** Explicit paired ranges are resolved before Markdown tokenization, allowing
 * independent crossing/nested ranges across blocks, formatting and code. */
export function sourceAnnotations(): RendererExtension {
  const prepared = new WeakMap<ParseContext, Prepared>();
  return {
    name: 'source-annotations', directives: ['limr-annotation'], scope: 'local',
    micromark: [sourceAnnotationTokenizer],
    sourceEditing: { annotations: editSourceAnnotations },
    preprocess(context, extensions) {
      const state = prepare(context.source, extensions); prepared.set(context, state);
      return state.ranges.flatMap(range => [range.openingRange, range.markerRange]).sort((a, b) => a.start - b.start);
    },
    transform(root, context) {
      const { source } = context;
      const visit = (node: MarkdownNode) => {
        if (node.type === 'component' && node.name === 'limr-annotation' && /^:{3,}limr-annotation(?:\[|\{|\s|$)/.test(source.slice(rangeOf(node).start))) {
          const attrs = node.attributes ?? {}, id = String(attrs.id ?? ''), type = String(attrs.type ?? 'footnote');
          const first = node.children?.[0], last = node.children?.at(-1);
          const body = first && last ? annotationBody(source, rangeOf(node), { start: rangeOf(first).start, end: rangeOf(last).end }) : String(attrs.body ?? '');
          node.type = 'annotationDefinition'; node.children = [];
          const raw = source.slice(rangeOf(node).start, rangeOf(node).end), opening = /^:+/.exec(raw)?.[0].length ?? 3;
          const closing = /(?:\r\n|\r|\n)(?:[ \t]*>[ \t]?)*[ \t]*(:{3,})[ \t]*$/.exec(raw);
          if (node.incomplete || !id || !closing || closing[1].length < opening) return;
          const rangeIds = [...new Set(String(attrs.ranges ?? id).split(/[\s,]+/).filter(Boolean))];
          const attributes = Object.fromEntries(Object.entries(attrs).filter(([key]) => !['id', 'ranges', 'type', 'body'].includes(key)));
          const data = type === 'highlight' ? {
            ...attributes, color: String(attrs.color ?? 'var(--limr-inline-highlight, #6B9BD2)'),
            style: ['background', 'underline', 'dotted', 'wavy'].includes(String(attrs.style)) ? attrs.style as HighlightData['style'] : 'background',
            hidden: attrs.hidden === true || attrs.hidden === 'true', readOnly: true,
          } satisfies HighlightData : { ...attributes, body };
          node.annotation = { id, type, data, source: { module: 'source-annotations', ranges: [rangeOf(node)], rangeIds } } satisfies Annotation;
          return;
        }
        if (!['footnoteDefinition', 'annotationDefinition', 'code', 'inlineCode', 'math', 'inlineMath', 'html'].includes(node.type)) node.children?.forEach(visit);
      };
      visit(root);
      const ranges = prepared.get(context)?.ranges ?? [];
      if (!ranges.length) return;
      const lines = lineStarts(source), nodes = root.children ??= [];
      const rootRange = rangeOf(root);
      for (const range of ranges) {
        if (range.markerRange.end < rootRange.start || range.markerRange.start > rootRange.end) continue;
        let host = nodes.find(node => !['annotationDefinition', 'definition', 'footnoteDefinition'].includes(node.type) && rangeOf(node).start <= range.markerRange.end && rangeOf(node).end >= range.markerRange.start);
        if (!host) host = [...nodes].reverse().find(node => {
          const end = rangeOf(node).end;
          return !['annotationDefinition', 'definition', 'footnoteDefinition'].includes(node.type) && end < range.markerRange.start
            && !omitSource(source.slice(end, range.markerRange.start), context.sourceOmissions ?? [], end).value.trim();
        });
        if (!host) {
          const at = range.markerRange.start;
          host = { type: 'paragraph', position: { start: sourcePoint(at, lines), end: sourcePoint(range.markerRange.end, lines) },
            children: [{ type: 'text', value: '', position: { start: sourcePoint(at, lines), end: sourcePoint(at, lines) } }] };
          nodes.push(host); nodes.sort((a, b) => rangeOf(a).start - rangeOf(b).start);
        }
        (host.sourceAnnotationRanges as SourceAnnotationRange[] | undefined ?? (host.sourceAnnotationRanges = []) as SourceAnnotationRange[]).push(range);
        // Keep collapsed boundaries within their host block for incremental
        // parsing and the ordinary external-marker placement path.
        const hostRange = rangeOf(host);
        host.position = { start: sourcePoint(Math.min(hostRange.start, range.markerRange.start), lines), end: sourcePoint(Math.max(hostRange.end, range.markerRange.end), lines) };
      }
    },
  };
}
