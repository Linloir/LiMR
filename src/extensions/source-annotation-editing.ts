import { mapText, omitSource, rangeOf, resolveAnnotationAnchors, sameRange, type Annotation, type DocumentSnapshot, type MarkdownNode, type SourceEdit, type SourceRange } from '../core';
import type { SourceAnnotationChange } from '../react/types';
import { mapLiteral } from '../react/literal';
import { annotationContinuationPrefix } from './source-annotation-format';

const key = (range: SourceRange) => `${range.start}:${range.end}`;
const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\r/g, '&#13;').replace(/\n/g, '&#10;');
const openingMarker = (id: string) => `::%%limr%%{<#${id}}`;
const closingMarker = (id: string) => `::%%limr%%{>#${id}}`;

function serialize(annotation: Annotation, rangeIds: readonly string[], newline: string) {
  const data = annotation.data ?? {};
  if (typeof data !== 'object' || Array.isArray(data)) throw new Error('This annotation needs a module-owned source serializer.');
  if (['id', 'ranges', 'type'].some(name => Object.hasOwn(data, name))) throw new Error('Annotation data cannot override reserved source attributes: id, ranges or type.');
  if (!annotation.id || !annotation.type) throw new Error('Source annotations require a nonempty id and type.');
  const { body = '', readOnly: _readOnly, ...attributes } = data as Record<string, unknown>;
  if (typeof body !== 'string' || Object.values(attributes).some(value => value !== undefined && !['string', 'number', 'boolean'].includes(typeof value))) throw new Error('This annotation needs a module-owned source serializer.');
  const attrs = { id: annotation.id, ranges: rangeIds.join(' '), type: annotation.type, ...attributes };
  const encoded = Object.entries(attrs).filter(([, value]) => value !== undefined).map(([name, value]) => {
    if (!/^[\w-]+$/.test(name)) throw new Error('Annotation attribute names must contain only letters, digits, underscores or hyphens.');
    return `${name}="${attribute(String(value))}"`;
  }).join(' ');
  const fence = ':'.repeat(Math.max(3, ...[...body.matchAll(/^\s*(:{3,})/gm)].map(match => match[1].length + 1)));
  return `${fence}limr-annotation{${encoded}}${newline}${body ? body + newline : ''}${fence}`;
}

/** Boundaries are independent: a range may cross Markdown nodes, blocks and
 * other annotations, but must not split an encoded character or hidden token. */
function validateRange(document: DocumentSnapshot, range: SourceRange) {
  const { source } = document;
  const tokens = [...document.annotationRanges.values()].flat().flatMap(item => [item.openingRange, item.markerRange]);
  const boundary = (offset: number) => {
    if (!Number.isInteger(offset) || offset < 0 || offset > source.length) return false;
    const previous = source.charCodeAt(offset - 1), next = source.charCodeAt(offset);
    const slashes = /\\+$/.exec(source.slice(0, offset))?.[0].length ?? 0;
    if (previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff || previous === 13 && next === 10 || slashes % 2 === 1) return false;
    if (tokens.some(token => offset > token.start && offset < token.end)) return false;
    const visit = (node: MarkdownNode): boolean => {
      if (['annotationDefinition', 'definition', 'footnoteDefinition'].includes(node.type)) return false;
      const span = rangeOf(node);
      if (offset < span.start || offset > span.end) return false;
      if (offset === span.start || offset === span.end) return true;
      if (node.type === 'text' || ['inlineCode', 'code'].includes(node.type)) {
        const mapped = node.type === 'text'
          ? mapText(source, node.value ?? '', span, { escapes: node.verbatimEscapes !== true, omissions: node.sourceOmissions as readonly SourceRange[] | undefined })
          : mapLiteral(source, node);
        return mapped.exact && (mapped.starts.includes(offset) || mapped.ends.includes(offset));
      }
      return node.children?.some(visit) ?? false;
    };
    return !source.length || document.blocks.some(block => visit(block.node));
  };
  if (!boundary(range.start) || !boundary(range.end)) throw new Error('Source annotations require complete text boundaries; do not split an escape, entity, Unicode character or source token.');
}

function validateAppend(document: DocumentSnapshot) {
  const last = document.blocks.at(-1);
  if (!last) return;
  // Closing annotation markers can extend a literal block's source span beyond
  // its fence. Validate the same Markdown text that the parser actually saw.
  const omissions = [...document.annotationRanges.values()].flatMap(ranges => ranges.flatMap(range => [range.openingRange, range.markerRange])).sort((a, b) => a.start - b.start);
  const raw = omitSource(document.source.slice(last.range.start, last.range.end), omissions, last.range.start).value;
  const opening = ['code', 'mermaid', 'math'].includes(last.node.type) && /^[ \t]*(`{3,}|~{3,}|\${2,})/.exec(raw);
  const closing = /(?:\r\n|\r|\n)[ \t]*(`+|~+|\$+)[ \t]*$/.exec(raw);
  const openFence = opening && (!closing || opening[1][0] !== closing[1][0] || closing[1].length < opening[1].length);
  const rawTag = /^<(script|pre|style|textarea)(?:\s|>)/i.exec(raw)?.[1];
  const openHtml = last.node.type === 'html' && (rawTag ? !new RegExp(`</${rawTag}\\s*>`, 'i').test(raw)
    : raw.startsWith('<!--') ? !raw.includes('-->') : raw.startsWith('<?') ? !raw.includes('?>')
    : raw.startsWith('<![CDATA[') ? !raw.includes(']]>') : /^<![A-Z]/.test(raw) && !raw.includes('>'));
  if (openFence || openHtml) throw new Error('Close the trailing code, math or HTML block before adding source annotations.');
}

/** Serialize one annotation command atomically, preserving unrelated source.
 * A custom module can register a later handler for another storage syntax. */
export function editSourceAnnotations(change: SourceAnnotationChange, document: DocumentSnapshot): readonly SourceEdit[] | undefined {
  if ([...change.updated.map(item => item.previous), ...change.removed].some(item => !['source-annotations', 'inline-highlights'].includes(item.source?.module ?? ''))) return undefined;
  const { source } = document, newline = /\r\n|\r|\n/.exec(source)?.[0] ?? '\n';
  const edits: SourceEdit[] = [], additions: string[] = [];
  const changed = [...change.added, ...change.updated.map(item => item.annotation)];
  const removedIds = new Set(change.removed.map(item => item.id));
  const replacements = new Map(changed.map(item => [item.id, item]));
  const finalAnnotations = [...document.annotations.filter(item => !removedIds.has(item.id) && !replacements.has(item.id)), ...changed];
  const bindings = new Map<string, string>(), splits = new Map<string, string[]>();
  const activeRangeIds = new Set<string>(), definitionIds = new Map<string, string[]>();
  const insertionOrder = new Map<SourceEdit, number>();
  const insert = (offset: number, text: string, order: number) => {
    const edit = { range: { start: offset, end: offset }, text };
    insertionOrder.set(edit, order); edits.push(edit);
  };

  // Split a reused name only when a command targets a subset of its occurrences.
  // Other definitions are rewritten to keep every one of their original anchors.
  for (const [id, ranges] of document.annotationRanges) {
    const partial = ranges.length > 1 && changed.some(annotation => {
      const requested = new Set(resolveAnnotationAnchors(annotation, document).map(anchor => key(anchor.range)));
      return ranges.some(range => requested.has(key(range.range))) && !ranges.every(range => requested.has(key(range.range)));
    });
    const ids = ranges.map((range, index) => {
      const name = partial && index ? `r-${crypto.randomUUID()}` : id;
      bindings.set(key(range.range), name); return name;
    });
    if (partial) splits.set(id, ids);
  }
  const preservedInline = new Set<string>();
  const inlineHighlights = document.annotations.filter(item => item.source?.module === 'inline-highlights');
  const unwrappedInline = new Set<string>();
  const unwrapInline = (annotation: Annotation) => {
    if (unwrappedInline.has(annotation.id)) return;
    const range = resolveAnnotationAnchors(annotation, document)[0]?.range, syntax = annotation.source?.ranges[0];
    if (!range || !syntax) return;
    // Remove the highlight's own delimiters, preserving any named boundaries
    // and other syntax already inside its selected text.
    if (syntax.start < range.start) edits.push({ range: { start: syntax.start, end: range.start }, text: '' });
    if (range.end < syntax.end) edits.push({ range: { start: range.end, end: syntax.end }, text: '' });
    unwrappedInline.add(annotation.id);
  };
  const createRange = (range: SourceRange): string => {
    const found = bindings.get(key(range));
    if (found) return found;
    const inline = inlineHighlights.find(item => resolveAnnotationAnchors(item, document).some(anchor => sameRange(anchor.range, range)));
    validateRange(document, range);
    const id = `r-${crypto.randomUUID()}`;
    if (inline) {
      unwrapInline(inline);
      if (!removedIds.has(inline.id) && !replacements.has(inline.id) && !preservedInline.has(inline.id)) {
        additions.push(serialize(inline, [id], newline)); preservedInline.add(inline.id);
      }
    }
    if (range.start === range.end) insert(range.start, openingMarker(id) + closingMarker(id), 1);
    else {
      insert(range.start, openingMarker(id), 2);
      insert(range.end, closingMarker(id), 0);
    }
    bindings.set(key(range), id); return id;
  };
  for (const annotation of changed) {
    const anchors = resolveAnnotationAnchors(annotation, document);
    if (!anchors.length) throw new Error('A source annotation requires an anchor in the current document.');
    const ids = [...new Set(anchors.map(anchor => createRange(anchor.range)))];
    definitionIds.set(annotation.id, ids); ids.forEach(id => activeRangeIds.add(id));
  }
  const rewritten = finalAnnotations.filter(annotation => !definitionIds.has(annotation.id) && annotation.source?.module === 'source-annotations' && annotation.source.rangeIds?.some(id => splits.has(id)));
  for (const annotation of finalAnnotations) {
    if (definitionIds.has(annotation.id)) continue;
    const ids = annotation.source?.rangeIds?.flatMap(id => splits.get(id) ?? [id]) ?? [];
    ids.forEach(id => activeRangeIds.add(id));
    if (rewritten.includes(annotation)) definitionIds.set(annotation.id, ids);
  }
  for (const { previous, annotation } of [...change.updated, ...rewritten.map(annotation => ({ previous: annotation, annotation }))]) {
    if (previous.source?.module === 'inline-highlights') { unwrapInline(previous); additions.push(serialize(annotation, definitionIds.get(annotation.id)!, newline)); continue; }
    const spans = previous.source!.ranges;
    spans.forEach((range, index) => {
      const prefix = annotationContinuationPrefix(source, range.start);
      const text = index === spans.length - 1 ? serialize(annotation, definitionIds.get(annotation.id)!, newline).replace(/\r\n|\r|\n/g, line => line + prefix) : '';
      edits.push({ range, text });
    });
  }
  for (const annotation of change.added) additions.push(serialize(annotation, definitionIds.get(annotation.id)!, newline));
  for (const annotation of change.removed) {
    if (annotation.source?.module === 'inline-highlights') unwrapInline(annotation);
    else annotation.source!.ranges.forEach(range => edits.push({ range, text: '' }));
  }
  const unwrapped = new Set<string>();
  const touchedIds = new Set([...change.removed, ...change.updated.map(item => item.previous)].flatMap(item => [...item.source?.rangeIds ?? []]));
  for (const id of touchedIds) for (const range of document.annotationRanges.get(id) ?? []) if (!activeRangeIds.has(bindings.get(key(range.range)) ?? id)) {
    edits.push({ range: range.openingRange, text: '' }, { range: range.markerRange, text: '' });
    unwrapped.add(key(range.markerRange));
  }
  for (const [id, ids] of splits) (document.annotationRanges.get(id) ?? []).forEach((range, index) => {
    if (ids[index] !== id && !unwrapped.has(key(range.markerRange))) edits.push({ range: range.openingRange, text: openingMarker(ids[index]) }, { range: range.markerRange, text: closingMarker(ids[index]) });
  });
  if (additions.length) {
    validateAppend(document);
    insert(source.length, `${source.endsWith(newline + newline) || !source ? '' : source.endsWith(newline) ? newline : newline + newline}${additions.join(newline + newline)}${newline}`, 3);
  }
  // Close one range before opening its adjacent neighbor, regardless of the
  // annotation/anchor order supplied by the caller.
  return edits.sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || (insertionOrder.get(a) ?? 1) - (insertionOrder.get(b) ?? 1));
}
