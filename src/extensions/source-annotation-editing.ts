import { mapText, rangeOf, resolveAnnotationAnchors, sameRange, walk, type Annotation, type DocumentSnapshot, type MarkdownNode, type SourceEdit, type SourceRange } from '../core';
import type { SourceAnnotationChange } from '../react/types';

const key = (range: SourceRange) => `${range.start}:${range.end}`;
const attribute = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\r/g, '&#13;').replace(/\n/g, '&#10;');
const overlaps = (a: SourceRange, b: SourceRange) => a.start === a.end ? a.start > b.start && a.start < b.end : b.start === b.end ? b.start > a.start && b.start < a.end : a.start < b.end && b.start < a.end;
const inlineContainers = new Set(['paragraph', 'heading', 'tableCell', 'strong', 'emphasis', 'delete', 'link', 'linkReference']);

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

/** Each delimiter pair must stay in one inline parent. A visual selection can
 * cross partially selected formatting nodes; split those edges into named
 * ranges instead of moving Markdown delimiters or including unselected text. */
function inlineRangeParts(document: DocumentSnapshot, range: SourceRange): SourceRange[] {
  const { source } = document;
  const boundary = (children: readonly MarkdownNode[], offset: number) => children.some(child => {
    const span = rangeOf(child);
    if (offset === span.start || offset === span.end) return true;
    if (child.type !== 'text' || offset < span.start || offset > span.end) return false;
    const mapped = mapText(source, child.value ?? '', span);
    return mapped.starts.includes(offset) || mapped.ends.includes(offset);
  });
  const descendantBoundary = (node: MarkdownNode, offset: number): boolean => !!node.children && (boundary(node.children, offset)
    || node.children.some(child => inlineContainers.has(child.type) && rangeOf(child).start < offset && rangeOf(child).end > offset && descendantBoundary(child, offset)));
  let valid = false, container: MarkdownNode | undefined;
  for (const block of document.blocks) {
    if (block.range.end < range.start || block.range.start > range.end) continue;
    walk(block.node, node => {
      if (!inlineContainers.has(node.type) || !node.children?.length) return;
      const span = rangeOf(node);
      if (span.start <= range.start && span.end >= range.end && boundary(node.children, range.start) && boundary(node.children, range.end)) valid = true;
      if (['paragraph', 'heading', 'tableCell'].includes(node.type) && span.start <= range.start && span.end >= range.end
        && descendantBoundary(node, range.start) && descendantBoundary(node, range.end)) container = node;
    });
  }
  const brokenBoundary = [range.start, range.end].some(offset => {
    const previous = source.charCodeAt(offset - 1), next = source.charCodeAt(offset);
    const slashes = /\\+$/.exec(source.slice(0, offset))?.[0].length ?? 0;
    return previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff || slashes % 2 === 1 || source[offset - 1] === '=' || source[offset] === '=';
  });
  const invalid = () => { throw new Error('Source annotations need an inline text range with complete Markdown boundaries inside one paragraph, heading or table cell.'); };
  if (!valid && !container || brokenBoundary || /\r?\n\s*\r?\n|(?<!\\)==/.test(source.slice(range.start, range.end))) invalid();
  if (valid) return [range];
  const split = (node: MarkdownNode): SourceRange[] => {
    const parts: SourceRange[] = [];
    let pending: SourceRange | undefined;
    const flush = () => { if (pending) parts.push(pending); pending = undefined; };
    for (const child of node.children ?? []) {
      const span = rangeOf(child);
      if (span.end <= range.start || span.start >= range.end) continue;
      if (child.type === 'text' || span.start >= range.start && span.end <= range.end) {
        const selected = { start: Math.max(span.start, range.start), end: Math.min(span.end, range.end) };
        if (pending) pending.end = selected.end; else pending = selected;
      } else {
        if (!inlineContainers.has(child.type)) invalid();
        flush(); parts.push(...split(child));
      }
    }
    flush(); return parts;
  };
  const parts = split(container!);
  if (!parts.length) invalid();
  return parts;
}

function validateAppend(document: DocumentSnapshot) {
  const last = document.blocks.at(-1);
  if (!last) return;
  const raw = document.source.slice(last.range.start, last.range.end);
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
  const newRanges: SourceRange[] = [];
  const preservedInline = new Set<string>();
  const existingSyntax = [...document.annotationRanges.values()].flat().map(range => ({ start: range.syntaxRange.start, end: range.markerRange.end }));
  const inlineHighlights = document.annotations.filter(item => item.source?.module === 'inline-highlights');
  const createRange = (range: SourceRange): string => {
    const found = bindings.get(key(range));
    if (found) return found;
    const inline = inlineHighlights.find(item => resolveAnnotationAnchors(item, document).some(anchor => sameRange(anchor.range, range)));
    if (existingSyntax.some(span => overlaps(range, span)) || newRanges.some(span => overlaps(range, span)) || inlineHighlights.some(item => item !== inline && item.source!.ranges.some(span => overlaps(range, span) || range.start === range.end && range.start === span.end))) throw new Error('Source annotation ranges cannot overlap or nest; reuse the existing exact range or select a separate range.');
    // The body of an existing highlight is already inside its own == delimiters.
    if (!inline) inlineRangeParts(document, range);
    const id = `r-${crypto.randomUUID()}`, marker = `[^%%limr:${id}%%]`;
    if (inline) {
      edits.push({ range: inline.source!.ranges[0], text: `==${source.slice(range.start, range.end)}==${marker}` });
      if (!removedIds.has(inline.id) && !replacements.has(inline.id) && !preservedInline.has(inline.id)) {
        additions.push(serialize(inline, [id], newline)); preservedInline.add(inline.id);
      }
    } else if (range.start === range.end) insert(range.start, marker, 1);
    else {
      insert(range.start, '==', 2);
      insert(range.end, `==${marker}`, 0);
    }
    newRanges.push(range); bindings.set(key(range), id); return id;
  };
  // The automatic highlight and its note receive the same segment IDs even
  // though both commands still describe the original, continuous selection.
  const groupedBindings = new Map<string, string[]>();
  const createRanges = (range: SourceRange): string[] => {
    const cached = groupedBindings.get(key(range));
    if (cached) return cached;
    const reusable = bindings.has(key(range)) || inlineHighlights.some(item => resolveAnnotationAnchors(item, document).some(anchor => sameRange(anchor.range, range)));
    const ids = (reusable ? [range] : inlineRangeParts(document, range)).map(createRange);
    groupedBindings.set(key(range), ids); return ids;
  };
  for (const annotation of changed) {
    const anchors = resolveAnnotationAnchors(annotation, document);
    if (!anchors.length) throw new Error('A source annotation requires an anchor in the current document.');
    const ids = [...new Set(anchors.flatMap(anchor => createRanges(anchor.range)))];
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
    if (previous.source?.module === 'inline-highlights') { additions.push(serialize(annotation, definitionIds.get(annotation.id)!, newline)); continue; }
    const spans = previous.source!.ranges;
    spans.forEach((range, index) => edits.push({ range, text: index === spans.length - 1 ? serialize(annotation, definitionIds.get(annotation.id)!, newline) : '' }));
  }
  for (const annotation of change.added) additions.push(serialize(annotation, definitionIds.get(annotation.id)!, newline));
  for (const annotation of change.removed) {
    if (annotation.source?.module === 'inline-highlights') {
      const range = resolveAnnotationAnchors(annotation, document)[0]?.range;
      if (range) edits.push({ range: annotation.source.ranges[0], text: source.slice(range.start, range.end) });
    } else annotation.source!.ranges.forEach(range => edits.push({ range, text: '' }));
  }
  const unwrapped = new Set<string>();
  const touchedIds = new Set([...change.removed, ...change.updated.map(item => item.previous)].flatMap(item => [...item.source?.rangeIds ?? []]));
  for (const id of touchedIds) for (const range of document.annotationRanges.get(id) ?? []) if (!activeRangeIds.has(bindings.get(key(range.range)) ?? id)) {
    edits.push({ range: { start: range.syntaxRange.start, end: range.markerRange.end }, text: source.slice(range.range.start, range.range.end) });
    unwrapped.add(key(range.markerRange));
  }
  for (const [id, ids] of splits) (document.annotationRanges.get(id) ?? []).forEach((range, index) => {
    if (ids[index] !== id && !unwrapped.has(key(range.markerRange))) edits.push({ range: range.markerRange, text: `[^%%limr:${ids[index]}%%]` });
  });
  if (additions.length) {
    validateAppend(document);
    insert(source.length, `${source.endsWith(newline + newline) || !source ? '' : source.endsWith(newline) ? newline : newline + newline}${additions.join(newline + newline)}${newline}`, 3);
  }
  // Close one range before opening its adjacent neighbor, regardless of the
  // annotation/anchor order supplied by the caller.
  return edits.sort((a, b) => a.range.start - b.range.start || a.range.end - b.range.end || (insertionOrder.get(a) ?? 1) - (insertionOrder.get(b) ?? 1));
}
