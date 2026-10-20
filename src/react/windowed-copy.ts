import { intersects, mapText, rangeOf, type DocumentSnapshot, type MarkdownNode, type SourceRange, type TextMapping } from '../core';
import type { ReaderRuntime } from './runtime';
import type { RendererParameters, VirtualizedRenderer } from './types';
import { literalValue, mapLiteral } from './literal';
import { resolveTranslationMode } from '../extensions/translation-mode';

const hidden = new Set(['definition', 'footnoteDefinition', 'annotationDefinition', 'footnoteReference', 'streamPending']);
const atoms = new Set(['math', 'inlineMath', 'image', 'imageReference', 'html']);
const proseBlocks = new Set(['paragraph', 'heading', 'blockquote', 'list', 'listItem', 'table', 'tableRow', 'code', 'callout', 'calloutTitle']);
const join = (parts: readonly string[], separator: string) => parts.filter(Boolean).join(separator);
const footnoteIndexes = new WeakMap<DocumentSnapshot, { node: MarkdownNode; order: number; span: SourceRange }[]>();
interface ReadingFragment { text: string; resolve: (from: number, to: number) => SourceRange }
export interface ReadingProjection { text: string; resolve: (range: SourceRange) => SourceRange; offsetAt: (source: number) => number }

/** Keep leaf mappings lazy: a long plain/code leaf needs no per-character index.
 * Synthetic renderer text has an explicit block fallback instead of guessing. */
export function windowedReadingProjection(runtime: ReaderRuntime, span: SourceRange): ReadingProjection {
  const trace: ReadingFragment[] = [];
  const text = projectWindowedText(runtime, [span], true, undefined, undefined, trace);
  const segments: { from: number; to: number; fragment: ReadingFragment }[] = [];
  let at = 0;
  for (const fragment of trace) {
    const from = text.indexOf(fragment.text, at);
    if (from < 0 || /\S/.test(text.slice(at, from))) return { text, resolve: () => span, offsetAt: () => 0 };
    segments.push({ from, to: from + fragment.text.length, fragment }); at = from + fragment.text.length;
  }
  if (/\S/.test(text.slice(at))) return { text, resolve: () => span, offsetAt: () => 0 };
  return { text, offsetAt: source => {
    let nearest = 0, distance = Infinity;
    for (const segment of segments) {
      const length = segment.to - segment.from, range = segment.fragment.resolve(0, length);
      if (source >= range.start && source < range.end) {
        let low = 0, high = length;
        while (low < high) {
          const mid = (low + high) >>> 1;
          if (segment.fragment.resolve(mid, mid + 1).end <= source) low = mid + 1; else high = mid;
        }
        return segment.from + low;
      }
      const delta = Math.min(Math.abs(source - range.start), Math.abs(source - range.end));
      if (delta < distance) { distance = delta; nearest = source < range.start ? segment.from : segment.to; }
    }
    return nearest;
  }, resolve: range => {
    let low = 0, high = segments.length;
    while (low < high) { const mid = (low + high) >>> 1; if (segments[mid].to <= range.start) low = mid + 1; else high = mid; }
    const first = segments[low];
    let last = first;
    while (segments[low] && segments[low].from < range.end) last = segments[low++];
    if (!first || !last) return span;
    const start = first.fragment.resolve(Math.max(0, range.start - first.from), Math.min(first.to, range.end) - first.from).start;
    const end = last.fragment.resolve(Math.max(last.from, range.start) - last.from, Math.min(last.to, range.end) - last.from).end;
    return end >= start ? { start, end } : span;
  } };
}

/** Match the same reader-local override and last module owner as renderNode. */
export function resolveVirtualizedRenderer(runtime: ReaderRuntime, node: MarkdownNode, ancestors: readonly MarkdownNode[] = [], pending = false): VirtualizedRenderer | undefined {
  const name = node.type === 'component' ? node.name ?? '' : node.type;
  const rule = runtime.rendererOverrides.get(name)?.slice().reverse().find(rule => !rule.when || rule.when(node, { pending, incomplete: !!node.incomplete, ancestors }));
  if (rule) return rule.virtualization;
  const config = runtime.configuration.get();
  if (config.components?.[name]) return;
  const extensions = config.extensions ?? [];
  for (let i = extensions.length - 1; i >= 0; i--) if (extensions[i].components?.[name]) return extensions[i].virtualization?.[name];
}

/** Project selected source intervals into visible reading text without mounting
 * the missing blocks. Copy Markdown remains a separate source-based command.
 * Full leaves avoid per-character mapping; only cut boundary leaves map text. */
export function windowedSelectionText(runtime: ReaderRuntime, ranges: readonly SourceRange[]): string {
  return projectWindowedText(runtime, ranges, false);
}

/** Search uses textual media labels and math payloads, not atomic copy source.
 * The optional boundary cache is short-lived within one search block. */
export function windowedReadingText(runtime: ReaderRuntime, ranges: readonly SourceRange[], mappings?: WeakMap<MarkdownNode, TextMapping>, fragments?: SourceRange[]): string {
  return projectWindowedText(runtime, ranges, true, mappings, fragments);
}

function projectWindowedText(runtime: ReaderRuntime, ranges: readonly SourceRange[], reading: boolean, mappings?: WeakMap<MarkdownNode, TextMapping>, fragments?: SourceRange[], trace?: ReadingFragment[]): string {
  const document = runtime.document.getSnapshot(), config = runtime.configuration.get();
  const selected = ranges.filter(range => range.end > range.start);
  if (!selected.length) return '';
  const extensions = config.extensions ?? [];
  let omissions: SourceRange[] | undefined;
  const sourceFor = (span: SourceRange) => {
    omissions ??= [...document.annotationRanges.values()].flatMap(references => references.flatMap(reference => [reference.openingRange, reference.markerRange])).sort((a, b) => a.start - b.start);
    let low = 0, high = omissions.length;
    while (low < high) { const middle = (low + high) >>> 1; if (omissions[middle].end <= span.start) low = middle + 1; else high = middle; }
    const parts: string[] = []; let from = span.start;
    for (let i = low; i < omissions.length && omissions[i].start < span.end; i++) {
      const omission = omissions[i];
      if (omission.start > from) parts.push(document.source.slice(from, omission.start));
      from = Math.max(from, Math.min(span.end, omission.end));
    }
    parts.push(document.source.slice(from, span.end)); return parts.join('');
  };
  const state = <T,>(node: MarkdownNode, key: string, fallback: T): T => (runtime.nodeStates.get(node)?.get(key)?.get() as T | undefined) ?? fallback;
  const parameter = <K extends keyof RendererParameters>(name: K): RendererParameters[K] => {
    if (config.parameters?.[name] !== undefined) return config.parameters[name];
    for (let i = extensions.length - 1; i >= 0; i--) {
      const values = extensions[i].parameters;
      if (values && name in values) return values[name];
    }
    return undefined as RendererParameters[K];
  };
  const globalMode = parameter('translationMode'), modeForNode = parameter('translationModeForNode'), defaultMode = parameter('translationDefaultMode');
  const section = (node: MarkdownNode, name: string): MarkdownNode | undefined => {
    for (const child of node.children ?? []) {
      if (child.name === name) return child;
      if (child.type === 'paragraph') { const found = section(child, name); if (found) return found; }
    }
  };
  const partsNamed = (node: MarkdownNode, name: string): MarkdownNode[] => {
    const result: MarkdownNode[] = [];
    const walk = (parent: MarkdownNode) => { for (const child of parent.children ?? []) { if (child.name === name) result.push(child); walk(child); } };
    walk(node); return result;
  };
  const isBlock = (node: MarkdownNode) => proseBlocks.has(node.type) || node.type === 'component' && !node.inline;
  const projectRange = (selection: SourceRange) => {
    const selectedNode = (node: MarkdownNode) => !node.position || intersects(rangeOf(node), selection);
    const text = (node: MarkdownNode, literal = false): string => {
      const span = rangeOf(node), value = literal ? literalValue(node) : (node.value ?? '').replace(/\r\n?/g, '\n');
      if (!value || !selectedNode(node)) return '';
      let result = value;
      if (node.position && (selection.start > span.start || selection.end < span.end)) {
        if (document.source.slice(span.start, span.end) === value) result = value.slice(Math.max(0, selection.start - span.start), Math.max(0, selection.end - span.start));
        else {
          let mapping = mappings?.get(node);
          if (!mapping) {
            mapping = literal ? mapLiteral(document.source, node) : mapText(document.source, value, span, { escapes: node.verbatimEscapes !== true && node.type !== 'math' && node.type !== 'inlineMath', omissions: node.sourceOmissions });
            mappings?.set(node, mapping);
          }
          let low = 0, high = value.length;
          while (low < high) { const middle = (low + high) >>> 1; if (mapping.ends[middle] <= selection.start) low = middle + 1; else high = middle; }
          const start = low; high = value.length;
          while (low < high) { const middle = (low + high) >>> 1; if (mapping.starts[middle] < selection.end) low = middle + 1; else high = middle; }
          result = value.slice(start, low);
        }
      }
      if (result) fragments?.push(span);
      const rendered = literal ? result : result.replace(/[\t\r\n ]+/g, ' ');
      if (rendered && trace) {
        let mapping: TextMapping | undefined, boundaries: { from: number; to: number }[] | undefined;
        const raw = document.source.slice(span.start, span.end);
        const payload = node.valueRange as SourceRange | undefined;
        const direct = raw === result ? span.start
          : payload && document.source.slice(payload.start, payload.end) === result ? payload.start
          : literal && node.type === 'code' && !node.sourceOmissions?.length && raw.includes(result) ? span.start + raw.indexOf(result) : undefined;
        trace.push({ text: rendered, resolve: (from, to) => {
          if (rendered !== result) {
            boundaries ??= (() => {
              const output: { from: number; to: number }[] = [];
              for (let at = 0; at < result.length;) {
                const start = at++;
                if (/[\t\r\n ]/.test(result[start])) while (at < result.length && /[\t\r\n ]/.test(result[at])) at++;
                output.push({ from: start, to: at });
              }
              return output;
            })();
            from = boundaries[from]?.from ?? result.length; to = boundaries[to - 1]?.to ?? from;
          }
          if (direct !== undefined) return { start: direct + from, end: direct + to };
          mapping ??= literal ? mapLiteral(document.source, node) : mapText(document.source, result, span, { escapes: node.verbatimEscapes !== true && node.type !== 'math' && node.type !== 'inlineMath', omissions: node.sourceOmissions });
          return { start: mapping.starts[from] ?? span.start, end: mapping.ends[to - 1] ?? span.end };
        } });
      }
      return rendered;
    };
    const visit = (node: MarkdownNode, ancestors: readonly MarkdownNode[], pending: boolean): string => {
      if (!selectedNode(node) || hidden.has(node.type)) return '';
      const span = rangeOf(node), name = node.type === 'component' ? node.name ?? '' : node.type;
      const path = [...ancestors, node];
      const children = (nodes = node.children ?? [], separator?: string) => {
        const values = nodes.map(child => visit(child, path, pending));
        return join(values, separator ?? (nodes.some(isBlock) ? '\n\n' : ''));
      };
      const attribute = (key: string) => {
        const child = node.attributeNodes?.[key];
        return child ? text(child) : node.attributes?.[key] !== undefined && selection.start <= span.start && selection.end >= span.end ? String(node.attributes[key]) : '';
      };
      const adapter = resolveVirtualizedRenderer(runtime, node, ancestors, pending);
      if (!reading && (node.selection === 'atomic' || atoms.has(node.type))) return sourceFor(span);
      if (adapter) {
        const from = fragments?.length ?? 0;
        const traceFrom = trace?.length ?? 0, childText = children(), childEnd = trace?.length ?? 0;
        const value = (reading && adapter.searchText || adapter.copyText)(node, { source: sourceFor(span), children: childText, get value() { return text(node, node.type === 'code' || node.type === 'inlineCode'); } });
        if (trace) {
          if (value === childText) trace.splice(childEnd);
          else if (childEnd > traceFrom || trace.length === traceFrom) {
            trace.splice(traceFrom);
            if (value) trace.push({ text: value, resolve: () => span });
          }
        }
        if (fragments) {
          if (!value) fragments.splice(from);
          else if (fragments.length === from) fragments.push(span);
        }
        return value;
      }
      if (reading && (node.selection === 'atomic' || atoms.has(node.type))) {
        if (node.type === 'math' || node.type === 'inlineMath') return text(node);
        if (node.type === 'image' || node.type === 'imageReference') return text({ ...node, value: String(node.alt ?? '') });
        if (name === 'img') return attribute('alt');
        if (name === 'video' || name === 'md-video') return attribute('title');
        if (node.type === 'html') return text(node);
        // Opaque diagrams/editors need an explicit searchText adapter. Their
        // hidden source syntax is not silently exposed as visible prose.
        return '';
      }
      if (node.type === 'text') return text(node);
      if (node.type === 'code' || node.type === 'inlineCode') return text(node, true);
      if (node.type === 'break') return '\n';
      if (node.type === 'thematicBreak') return '';
      if (name === 'translations') {
        const origin = section(node, 'origin'), translation = section(node, 'translation');
        if (!origin && !translation) return children();
        const requested = resolveTranslationMode(node, state<unknown>(node, 'translation-mode', undefined), globalMode, modeForNode?.(node, document), defaultMode);
        const mode = !origin ? 'translation' : !translation ? 'origin' : requested;
        return join([mode !== 'origin' && translation ? visit(translation, path, pending) : '', mode !== 'translation' && origin ? visit(origin, path, pending) : ''], '\n\n');
      }
      if (name === 'callout') {
        const title = node.children?.find(child => child.type === 'calloutTitle');
        const fold = node.attributes?.fold;
        const expanded = !fold || state(node, 'callout-expanded', fold !== '-' && fold !== 'closed');
        return join([title ? visit(title, path, pending) : attribute('title'), expanded ? children(node.children?.filter(child => child !== title)) : ''], '\n');
      }
      if (name === 'question') {
        const content = partsNamed(node, 'question-content')[0], hint = partsNamed(node, 'question-hint')[0], answer = partsNamed(node, 'question-answer')[0];
        const choices = partsNamed(node, 'question-sel');
        return join([attribute('title'), content ? visit(content, path, pending) : !choices.length && !hint && !answer ? children() : '', children(choices, '\n'), hint && state(node, 'question-hint', false) ? visit(hint, path, pending) : '', answer && state(node, 'question-answer', false) ? visit(answer, path, pending) : ''], '\n');
      }
      if (name === 'definition') {
        const title = partsNamed(node, 'title')[0], content = partsNamed(node, 'content')[0];
        return join([title ? visit(title, path, pending) : attribute('title'), content ? visit(content, path, pending) : children()], '\n');
      }
      if (name === 'figure' || name === 'figures') {
        const caption = (node: MarkdownNode) => node.name === 'figcaption' || node.name === 'caption';
        const nodes = (node.children ?? []).flatMap(child => child.type === 'paragraph' && child.children?.some(item => item.name === 'figure' || caption(item)) ? child.children : [child]);
        const captions = nodes.filter(caption);
        return join([children(nodes.filter(child => !caption(child))), captions.length ? children(captions) : attribute('caption')], '\n');
      }
      if (name === 'extra') return join([attribute(node.attributes?.title ? 'title' : 'url'), attribute('desc'), children()], '\n');
      if (node.type === 'table') return children(node.children, '\n');
      if (node.type === 'tableRow') return (node.children ?? []).filter(selectedNode).map(child => visit(child, path, pending)).join('\t');
      if (node.type === 'list' || node.type === 'listItem') return children(node.children, '\n');
      return node.children?.length ? children() : node.value ? text(node) : '';
    };
    // Binary search skips unrelated prefixes for a short selection in a book.
    let low = 0, high = document.blocks.length;
    while (low < high) { const middle = (low + high) >>> 1; if (document.blocks[middle].range.end <= selection.start) low = middle + 1; else high = middle; }
    const result: string[] = [];
    for (let i = low; i < document.blocks.length && document.blocks[i].range.start < selection.end; i++) {
      const block = document.blocks[i], value = visit(block.node, [], block.pending);
      if (value) result.push(value);
    }
    // Legacy footnotes are displayed at the end in first-reference order, not
    // where their Markdown definitions occur. Standard annotation footnotes
    // have no legacy footnoteOrder entry and remain outside ordinary copy.
    let notes = footnoteIndexes.get(document);
    if (!notes) {
      notes = document.footnoteOrder.flatMap((id, order) => {
        const node = document.footnotes.get(id); return node ? [{ node, order, span: rangeOf(node) }] : [];
      }).sort((a, b) => a.span.start - b.span.start);
      footnoteIndexes.set(document, notes);
    }
    low = 0; high = notes.length;
    while (low < high) { const middle = (low + high) >>> 1; if (notes[middle].span.end <= selection.start) low = middle + 1; else high = middle; }
    const visibleNotes: typeof notes = [];
    for (let i = low; i < notes.length && notes[i].span.start < selection.end; i++) visibleNotes.push(notes[i]);
    for (const { node } of visibleNotes.sort((a, b) => a.order - b.order)) {
      const value = join((node.children ?? []).map(child => visit(child, [node], false)), '\n');
      if (value) result.push(value);
    }
    return result.join('\n\n');
  };
  return join(selected.map(projectRange), '\n\n');
}
