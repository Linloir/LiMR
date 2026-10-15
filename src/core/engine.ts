import { createParser } from './parser';
import { lineStarts, rangeOf, slugify, textContent, walk } from './tree';
import type { Annotation, AnnotationOccurrence, Block, DocumentMetrics, DocumentOptions, DocumentSnapshot, Heading, MarkdownNode, SourceAnnotationRange, SyntaxExtension } from './types';

let sequence = 0;

/** A synchronous, DOM-free document session. React/scroll state never enters it. */
export class DocumentEngine {
  readonly id: string;
  private extensions: readonly SyntaxExtension[];
  private parse: ReturnType<typeof createParser>;
  private snapshot?: DocumentSnapshot;
  private nextBlock = 0;
  private listeners = new Set<() => void>();
  private definitionSignature = '';
  private recoveryOffset: number | undefined;
  private lines: number[] = [0];
  private facts = new WeakMap<MarkdownNode, readonly MarkdownNode[]>();
  private relevant(node: MarkdownNode): readonly MarkdownNode[] {
    let result = this.facts.get(node);
    if (!result) {
      const nodes: MarkdownNode[] = [];
      walk(node, child => { if (child.annotation || ['heading', 'definition', 'footnoteDefinition', 'footnoteReference', 'annotationDefinition', 'annotationReference'].includes(child.type)) nodes.push(child); });
      this.facts.set(node, result = nodes);
    }
    return result;
  }

  constructor(source = '', options: DocumentOptions = {}) {
    this.id = options.id ?? `limr-${++sequence}`;
    this.extensions = options.extensions ?? [];
    this.parse = createParser(this.extensions);
    this.update(source, { streaming: options.streaming });
  }

  getSnapshot = (): DocumentSnapshot => this.snapshot!;
  subscribe = (listener: () => void): (() => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };

  setExtensions(extensions: readonly SyntaxExtension[]): void {
    if (extensions === this.extensions) return;
    this.parse = createParser(extensions);
    this.extensions = extensions;
    const previous = this.snapshot!;
    this.update(previous.source, { streaming: previous.streaming }, true);
  }

  append(chunk: string): DocumentSnapshot { return this.update(this.snapshot!.source + chunk, { streaming: true }); }
  finish(): DocumentSnapshot { return this.update(this.snapshot!.source, { streaming: false }); }

  update(source: string, options: { streaming?: boolean } = {}, force = false): DocumentSnapshot {
    const previous = this.snapshot;
    const streaming = options.streaming ?? false;
    if (!force && previous?.source === source && previous.streaming === streaming) return previous;
    const globalTransform = this.extensions.some(ext => ext.transform && ext.scope !== 'local');
    const append = !force && previous?.streaming && source.startsWith(previous.source) && !globalTransform;
    const finalizing = !!previous?.streaming && !streaming;
    let start = append && previous.blocks.length ? previous.blocks[previous.blocks.length - 1].range.start : 0;
    const recovering = this.recoveryOffset !== undefined;
    if (append && recovering) start = Math.min(start, this.recoveryOffset!);
    let reason: DocumentMetrics['reason'] = force || globalTransform ? 'extension' : !previous ? 'initial' : finalizing ? 'finalize' : append ? 'append' : 'replace';
    if (append && previous) {
      // Rescan the last code unit as CR and LF may arrive in separate chunks.
      const from = Math.max(0, previous.source.length - 1);
      while (this.lines.length > 1 && this.lines.at(-1)! > from) this.lines.pop();
      for (const at of lineStarts(source.slice(from)).slice(1)) this.lines.push(from + at);
    } else this.lines = lineStarts(source);
    const lines = this.lines;
    const context = { source, streaming, documentId: this.id };
    let retained = start ? previous!.blocks.filter(block => block.range.end <= start) : [];
    const environment: string[] = [];
    for (const block of retained) for (const node of this.relevant(block.node)) {
      if (node.type === 'definition' || node.type === 'footnoteDefinition') { const range = rangeOf(node); environment.push(source.slice(range.start, range.end)); }
    }
    let parsed = this.parse(source.slice(start), start, context, lines, environment.join('\n\n'));
    const getSignature = (nodes: readonly MarkdownNode[]) => {
      const entries: string[] = [];
      for (const node of nodes) for (const child of this.relevant(node)) {
        if (child.type === 'definition' || child.type === 'footnoteDefinition') { const range = rangeOf(child); entries.push(source.slice(range.start, range.end)); }
      }
      return entries.join('\u0000');
    };
    let signature = getSignature([...retained.map(block => block.node), ...parsed.nodes]);
    let parsedCharacters = source.length - start + environment.join('\n\n').length;
    const definitionsChanged = !!previous && signature !== this.definitionSignature;
    if (start && definitionsChanged) {
      reason = 'definitions';
      start = 0;
      retained = [];
      parsed = this.parse(source, 0, context, lines);
      signature = getSignature(parsed.nodes);
      parsedCharacters += source.length;
    }
    this.definitionSignature = signature;
    this.recoveryOffset = parsed.recoveryOffset;
    const oldAt = new Map(previous?.blocks.slice(retained.length).map(block => [block.range.start, block]));
    let reused = retained.length;
    const blocks: Block[] = [...retained];
    for (let index = 0; index < parsed.nodes.length; index++) {
      const node = parsed.nodes[index];
      const range = rangeOf(node);
      const old = oldAt.get(range.start);
      const pending = streaming && index === parsed.nodes.length - 1;
      // Definition changes can change semantic nodes without changing their raw text.
      const reusable = !definitionsChanged && !recovering && reason === 'append' && old && old.node.type === node.type && old.pending === pending && previous!.source.slice(old.range.start, old.range.end) === source.slice(range.start, range.end);
      if (reusable) { blocks.push(old); reused++; }
      else blocks.push({ id: old?.id ?? `${this.id}-b${++this.nextBlock}`, node, range, pending });
    }
    const headings: Heading[] = [];
    const definitions = new Map<string, MarkdownNode>();
    const footnotes = new Map<string, MarkdownNode>();
    const footnoteOrder: string[] = [];
    const annotations = new Map<string, Annotation>();
    const annotationRanges = new Map<string, SourceAnnotationRange[]>();
    const sourceOccurrences: { occurrence: AnnotationOccurrence; rangeId: string }[] = [];
    const occurrences: AnnotationOccurrence[] = [];
    const slugCounts = new Map<string, number>();
    for (const block of blocks) for (const node of this.relevant(block.node)) {
      if (node.type === 'heading') {
        const text = textContent(node);
        const base = slugify(text);
        const count = slugCounts.get(base) ?? 0;
        slugCounts.set(base, count + 1);
        headings.push({ id: `${this.id}-${base}${count ? `-${count}` : ''}`, text, level: Number(node.depth), range: rangeOf(node), blockId: block.id });
      }
      if (node.type === 'definition' && !definitions.has(String(node.identifier))) definitions.set(String(node.identifier), node);
      if (node.type === 'footnoteDefinition' && !footnotes.has(String(node.identifier))) footnotes.set(String(node.identifier), node);
      if (node.type === 'footnoteReference' && !footnoteOrder.includes(String(node.identifier))) footnoteOrder.push(String(node.identifier));
      if (node.annotation) {
        const annotation = node.annotation as Annotation;
        if (annotation.source?.module === 'source-annotations') {
          const previous = annotations.get(annotation.id);
          const ranges = previous?.source?.module === 'source-annotations' ? [...previous.source.ranges, ...annotation.source.ranges] : annotation.source.ranges;
          // Move replacement definitions to their final source order: highlight
          // precedence follows declarations, including repeated annotation IDs.
          annotations.delete(annotation.id);
          annotations.set(annotation.id, { ...annotation, source: { ...annotation.source, ranges } });
        }
        // GFM resolves duplicate named footnotes to their first definition.
        else if (node.type !== 'footnoteDefinition' || !annotations.has(annotation.id)) annotations.set(annotation.id, annotation);
      }
      if (node.type === 'annotationReference') {
        const range = rangeOf(node);
        const occurrence: AnnotationOccurrence = { id: `${this.id}-ref-${range.start}`, range, annotationIds: node.annotationIds as string[], embedded: true, ...(node.referenceRange ? { referenceRange: node.referenceRange as AnnotationOccurrence['referenceRange'] } : {}) };
        if (node.sourceAnnotationRange) {
          const reference = node.sourceAnnotationRange as SourceAnnotationRange;
          const ranges = annotationRanges.get(reference.id) ?? [];
          ranges.push(reference); annotationRanges.set(reference.id, ranges);
          sourceOccurrences.push({ occurrence, rangeId: reference.id });
        } else occurrences.push(occurrence);
      }
    }
    const highlightOwners = new Map<string, string>(), rangeAnnotations = new Map<string, string[]>();
    for (const annotation of annotations.values()) if (annotation.source?.module === 'source-annotations') {
      for (const rangeId of annotation.source.rangeIds ?? []) {
        if (annotation.type === 'highlight') highlightOwners.set(rangeId, annotation.id);
        else { const ids = rangeAnnotations.get(rangeId) ?? []; ids.push(annotation.id); rangeAnnotations.set(rangeId, ids); }
      }
    }
    for (const annotation of annotations.values()) if (annotation.source?.module === 'source-annotations') {
      const anchors = (annotation.source.rangeIds ?? []).flatMap(rangeId => {
        if (annotation.type === 'highlight' && highlightOwners.get(rangeId) !== annotation.id) return [];
        return (annotationRanges.get(rangeId) ?? []).map((reference, index) => ({ id: `${annotation.id}:${rangeId}:${index}`, range: reference.range, quote: source.slice(reference.range.start, reference.range.end) }));
      });
      annotations.set(annotation.id, { ...annotation, anchors });
    }
    for (const { occurrence, rangeId } of sourceOccurrences) {
      const ids = rangeAnnotations.get(rangeId);
      if (ids?.length) occurrences.push({ ...occurrence, annotationIds: ids });
    }
    if (sourceOccurrences.length) occurrences.sort((a, b) => a.range.start - b.range.start);
    this.snapshot = {
      id: this.id, revision: (previous?.revision ?? -1) + 1, source, streaming,
      blocks,
      headings: previous && headings.length === previous.headings.length && headings.every((heading, index) => {
        const old = previous.headings[index];
        return heading.id === old.id && heading.text === old.text && heading.level === old.level && heading.blockId === old.blockId && heading.range.start === old.range.start && heading.range.end === old.range.end;
      }) ? previous.headings : headings,
      definitions, footnotes, footnoteOrder, annotations: [...annotations.values()], annotationRanges, occurrences,
      diagnostics: parsed.diagnostics,
      metrics: { parsedCharacters, reusedBlocks: reused, parsedBlocks: parsed.nodes.length, fullParse: start === 0, reason },
    };
    for (const listener of this.listeners) listener();
    return this.snapshot;
  }
}

export function createDocument(source = '', options: DocumentOptions = {}): DocumentEngine { return new DocumentEngine(source, options); }

export function replaceExtension<T extends SyntaxExtension>(extensions: readonly T[], replacement: T): T[] {
  const exists = extensions.some(extension => extension.name === replacement.name);
  return exists ? extensions.map(extension => extension.name === replacement.name ? replacement : extension) : [...extensions, replacement];
}
