import { createDocument, ResourceCache, selectionFromRange } from '../core';
import { intersects } from '../core/tree';
import type { Annotation, AnnotationOccurrence, DocumentEngine, DocumentSnapshot, Highlight, SelectionSnapshot, SourceRange } from '../core';
import type { AnnotationType, DocumentCommands, LiMRLocale, NodeRenderer, RendererExtension, ViewConfiguration } from './types';
import { scrollWithMotion } from './motion';

export const english: LiMRLocale = {
  contents: 'Contents', annotations: 'Annotations', expand: 'Expand', collapse: 'Collapse', close: 'Close', copy: 'Copy', copied: 'Copied',
  loading: 'Loading…', retry: 'Retry', unavailable: 'Content unavailable', footnotes: 'Footnotes',
  definition: 'Definition', question: 'Question', note: 'Note', extra: 'Extended reading', hint: 'Hint', answer: 'Answer', submit: 'Submit',
  correct: 'Correct', incorrect: 'Try again', play: 'Play video',
};
export const chinese: LiMRLocale = {
  contents: '目录', annotations: '注释', expand: '展开', collapse: '收起', close: '关闭', copy: '复制', copied: '已复制',
  loading: '加载中…', retry: '重试', unavailable: '暂无内容', footnotes: '脚注',
  definition: '释义', question: '提问', note: '注释', extra: '拓展阅读', hint: '提示', answer: '答案', submit: '提交',
  correct: '回答正确', incorrect: '再试一次', play: '播放视频',
};

export class Store<T> {
  private listeners = new Set<() => void>();
  constructor(private value: T) {}
  get = () => this.value;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  set(value: T) { if (Object.is(this.value, value)) return; this.value = value; for (const listener of this.listeners) listener(); }
}
export interface InteractionState {
  selection: SelectionSnapshot | null;
  activeHeading: string | null;
  hovered: string | null;
  active: string | null;
  hoverSource?: 'marker' | 'sidebar' | null;
  activeSource?: 'marker' | 'sidebar' | null;
}
export interface Decorations {
  annotations: ReadonlyMap<string, Annotation>;
  occurrences: readonly AnnotationOccurrence[];
  byBlock: ReadonlyMap<string, BlockDecorations>;
}
export interface BlockDecorations { occurrences: readonly AnnotationOccurrence[]; highlights: readonly Highlight[] }
export interface SourceBinding {
  range: SourceRange;
  atomic: boolean;
  /** Source interval for a DOM text boundary (UTF-16). */
  resolve?: (offset: number, edge: 'start' | 'end') => number;
  exact?: boolean;
}

const EMPTY: readonly never[] = Object.freeze([]);
export const emptyDecorations: BlockDecorations = Object.freeze({ occurrences: EMPTY, highlights: EMPTY });
export class ReaderRuntime {
  readonly document: DocumentEngine;
  readonly interaction = new Store<InteractionState>({ selection: null, activeHeading: null, hovered: null, active: null });
  readonly layout = new Store(0);
  readonly viewport = new Store(0);
  readonly documentOffset = new Store(0);
  readonly decorations = new Store<Decorations>({ annotations: new Map(), occurrences: [], byBlock: new Map() });
  readonly configuration: Store<ViewConfiguration>;
  readonly resources = new ResourceCache<unknown>(128);
  readonly resourceVersions = new Store<ReadonlyMap<string, number>>(new Map());
  private resourceKeys = new Map<string, { annotation: Annotation; key: string }>();
  private nextResource = 0;
  readonly anchors = new Map<string, HTMLElement>();
  readonly blocks = new Map<string, HTMLElement>();
  readonly headings = new Map<string, HTMLElement>();
  readonly bindings = new WeakMap<Node, SourceBinding>();
  readonly textBinders = new WeakMap<HTMLElement, () => void>();
  components: Readonly<Record<string, NodeRenderer>> = {};
  annotationTypes = new Map<string, AnnotationType>();
  locale = english;
  content: HTMLElement | null = null;
  selectionRange: Range | null = null;
  private layoutFrame = 0;
  private observer: ResizeObserver | null = null;
  private headingPositions: { id: string; top: number }[] = [];
  private localAnnotations: readonly Annotation[] = [];
  private localHighlights: readonly Highlight[] = [];
  private pendingOpen: string | null = null;
  private pendingAnnotations?: { input: readonly Annotation[]; value: readonly Annotation[] };
  private pendingHighlights?: { input: readonly Highlight[]; value: readonly Highlight[] };
  private taskController = new AbortController();
  get signal() { return this.taskController.signal; }
  readonly commands: DocumentCommands = {
    addAnnotation: annotation => this.changeAnnotations(items => [...items.filter(item => item.id !== annotation.id), annotation]),
    updateAnnotation: (id, update) => this.changeAnnotations(items => items.map(item => item.id === id ? { ...item, ...update, id } : item)),
    removeAnnotation: id => this.changeAnnotations(items => items.filter(item => item.id !== id)),
    addHighlight: highlight => this.changeHighlights(items => [...items.filter(item => item.id !== highlight.id), highlight]),
    removeHighlight: id => this.changeHighlights(items => items.filter(item => item.id !== id)),
    activateAnnotation: id => {
      const occurrence = this.decorations.get().occurrences.find(item => item.id === id || item.annotationIds.includes(id ?? ''));
      this.pendingOpen = id && !occurrence ? id : null;
      this.activate(occurrence?.id ?? null);
    },
  };
  private changeAnnotations(update: (items: readonly Annotation[]) => readonly Annotation[]) {
    const config = this.configuration.get();
    const current = this.pendingAnnotations && this.pendingAnnotations.input === config.annotations ? this.pendingAnnotations.value : config.annotations ?? this.localAnnotations;
    const next = update(current);
    if (config.annotations !== undefined && !config.onAnnotationsChange) throw new Error('Controlled annotations require onAnnotationsChange to accept edits.');
    if (config.annotations === undefined) { this.localAnnotations = next; this.rebuildDecorations(); }
    else this.pendingAnnotations = { input: config.annotations, value: next };
    config.onAnnotationsChange?.(next);
  }
  private changeHighlights(update: (items: readonly Highlight[]) => readonly Highlight[]) {
    const config = this.configuration.get();
    const current = this.pendingHighlights && this.pendingHighlights.input === config.highlights ? this.pendingHighlights.value : config.highlights ?? this.localHighlights;
    const next = update(current);
    if (config.highlights !== undefined && !config.onHighlightsChange) throw new Error('Controlled highlights require onHighlightsChange to accept edits.');
    if (config.highlights === undefined) { this.localHighlights = next; this.rebuildDecorations(); }
    else this.pendingHighlights = { input: config.highlights, value: next };
    config.onHighlightsChange?.(next);
  }
  start() { if (this.taskController.signal.aborted) this.taskController = new AbortController(); }
  dispose() { this.taskController.abort(); this.resources.invalidate(); this.resourceKeys.clear(); }
  getResourceKey(annotation: Annotation) {
    const old = this.resourceKeys.get(annotation.id);
    if (old?.annotation === annotation) return old.key;
    if (old) this.resources.invalidate(old.key);
    const key = `${annotation.id}:${++this.nextResource}`;
    this.resourceKeys.set(annotation.id, { annotation, key });
    return key;
  }
  invalidateAnnotation(id: string) {
    const current = this.resourceKeys.get(id);
    if (current) this.resources.invalidate(current.key);
    const versions = new Map(this.resourceVersions.get());
    versions.set(id, (versions.get(id) ?? 0) + 1);
    this.resourceVersions.set(versions);
  }

  constructor(id: string, source: string, streaming: boolean, config: ViewConfiguration) {
    this.configuration = new Store(config);
    this.installConfiguration(config);
    this.document = createDocument(source, { id, streaming, extensions: config.extensions });
    this.rebuildDecorations();
    this.document.subscribe(() => {
      this.rebuildDecorations();
      const selection = this.interaction.get().selection;
      if (selection && selection.raw.ranges.length === 1) {
        const doc = this.document.getSnapshot(), range = selection.raw.ranges[0];
        this.updateInteraction({ selection: doc.source.slice(range.start, range.end) === selection.raw.sourceText ? selectionFromRange(doc, range, { text: selection.text, quality: selection.quality, settled: selection.settled }) : null });
      }
      this.requestLayout();
      this.configuration.get().onDocumentChange?.(this.document.getSnapshot());
    });
  }
  private installConfiguration(config: ViewConfiguration) {
    this.components = Object.assign({}, ...(config.extensions ?? []).map(ext => ext.components), config.components);
    const annotationTypes = [...(config.extensions ?? []).flatMap(ext => [...ext.annotationTypes ?? []]), ...config.annotationTypes ?? []];
    this.annotationTypes = new Map(annotationTypes.map(type => [type.type, type]));
    this.locale = { ...english, ...config.locale };
  }
  configure(config: ViewConfiguration) {
    const old = this.configuration.get();
    if (this.pendingAnnotations?.input !== config.annotations) this.pendingAnnotations = undefined;
    if (this.pendingHighlights?.input !== config.highlights) this.pendingHighlights = undefined;
    this.installConfiguration(config);
    this.configuration.set(config);
    if (old.extensions !== config.extensions) this.document.setExtensions(config.extensions ?? []);
    if (old.annotations !== config.annotations || old.highlights !== config.highlights) this.rebuildDecorations();
    if (old.annotationTypes !== config.annotationTypes || old.extensions !== config.extensions) this.resources.invalidate();
  }
  updateInteraction(patch: Partial<InteractionState>) {
    const old = this.interaction.get();
    if (Object.keys(patch).every(key => Object.is(old[key as keyof InteractionState], patch[key as keyof InteractionState]))) return;
    this.interaction.set({ ...old, ...patch });
    if ('selection' in patch) this.configuration.get().onSelectionChange?.(patch.selection ?? null);
  }
  hover(id: string | null, source: 'marker' | 'sidebar' = 'marker') {
    this.updateInteraction({ hovered: id, hoverSource: id ? source : null });
    this.configuration.get().onAnnotationHover?.(this.decorations.get().occurrences.find(item => item.id === id) ?? null);
  }
  activate(id: string | null, source: 'marker' | 'sidebar' = 'marker') {
    this.updateInteraction({ active: id, activeSource: id ? source : null, hovered: null, hoverSource: null });
    const occurrence = this.decorations.get().occurrences.find(item => item.id === id);
    if (occurrence) this.configuration.get().onAnnotationClick?.(occurrence);
  }
  clearSelection() {
    this.selectionRange = null;
    const selection = typeof window === 'undefined' ? null : window.getSelection();
    if (selection?.anchorNode && this.content?.contains(selection.anchorNode)) selection.removeAllRanges();
    this.updateInteraction({ selection: null });
  }
  prepareTextBindings(element: Element) {
    const block = element.closest<HTMLElement>('[data-limr-block]');
    const bind = block && this.textBinders.get(block);
    if (bind) { this.textBinders.delete(block!); bind(); }
  }
  private rebuildDecorations() {
    const doc = this.document.getSnapshot();
    const config = this.configuration.get();
    const previous = this.decorations.get();
    const annotations = new Map(doc.annotations.map(annotation => [annotation.id, annotation]));
    for (const annotation of config.annotations ?? this.localAnnotations) annotations.set(annotation.id, annotation);
    for (const [id, resource] of this.resourceKeys) if (!annotations.has(id)) {
      this.resources.invalidate(resource.key); this.resourceKeys.delete(id);
    }
    const versions = this.resourceVersions.get();
    if ([...versions.keys()].some(id => !annotations.has(id))) this.resourceVersions.set(new Map([...versions].filter(([id]) => annotations.has(id))));
    const occurrences: AnnotationOccurrence[] = [...doc.occurrences];
    for (const annotation of config.annotations ?? this.localAnnotations) {
      const anchors = annotation.anchors ?? (annotation.range ? [{ range: annotation.range }] : []);
      anchors.forEach((anchor, index) => {
        if (anchor.documentId && anchor.documentId !== doc.id) return;
        let range = anchor.range;
        if (anchor.quote && doc.source.slice(range.start, range.end) !== anchor.quote) {
          const at = doc.source.indexOf(anchor.quote);
          if (at < 0 || doc.source.indexOf(anchor.quote, at + 1) >= 0) return;
          range = { start: at, end: at + anchor.quote.length };
        } else if (anchor.revision !== undefined && anchor.revision !== doc.revision && !anchor.quote) return;
        if (range.start < 0 || range.end > doc.source.length || range.start > range.end) return;
        occurrences.push({ ...anchor, range, id: anchor.id ?? `${doc.id}-${annotation.id}-${index}`, annotationIds: [annotation.id] });
      });
    }
    occurrences.sort((a, b) => a.range.end - b.range.end || a.id.localeCompare(b.id));
    const byBlock = new Map<string, BlockDecorations>();
    const allHighlights = config.highlights ?? this.localHighlights;
    for (const block of occurrences.length || allHighlights.length ? doc.blocks : []) {
      const marks = occurrences.filter(item => !item.embedded && item.range.end > block.range.start && item.range.end <= block.range.end);
      const before = previous.byBlock.get(block.id) ?? emptyDecorations;
      const old = before.occurrences;
      const same = old && old.length === marks.length && old.every((item, index) => item.id === marks[index].id && item.range.start === marks[index].range.start && item.range.end === marks[index].range.end && item.annotationIds.join('\0') === marks[index].annotationIds.join('\0'));
      const highlights = allHighlights.filter(item => intersects(item.range, block.range));
      const oldHighlights = before.highlights;
      const sameHighlights = oldHighlights.length === highlights.length && oldHighlights.every((item, i) => item === highlights[i]);
      if (marks.length || highlights.length) byBlock.set(block.id, same && sameHighlights ? before : { occurrences: same ? old : marks, highlights: sameHighlights ? oldHighlights : highlights });
    }
    const sameBlocks = byBlock.size === previous.byBlock.size && [...byBlock].every(([id, value]) => previous.byBlock.get(id) === value);
    this.decorations.set({ annotations, occurrences, byBlock: sameBlocks ? previous.byBlock : byBlock });
    const state = this.interaction.get();
    if (state.active && !occurrences.some(item => item.id === state.active)) this.activate(null);
    if (state.hovered && !occurrences.some(item => item.id === state.hovered)) this.hover(null);
    if (this.pendingOpen) {
      const occurrence = occurrences.find(item => item.id === this.pendingOpen || item.annotationIds.includes(this.pendingOpen!));
      if (occurrence) { this.pendingOpen = null; this.activate(occurrence.id); }
    }
  }
  registerAnchor(id: string, element: HTMLElement | null) { if (element) this.anchors.set(id, element); else this.anchors.delete(id); this.requestLayout(); }
  registerHeading(id: string, element: HTMLElement | null) { if (element) this.headings.set(id, element); else this.headings.delete(id); this.requestLayout(); }
  observeBlock(element: HTMLElement | null) { if (element) { if (element.dataset.limrBlock) this.blocks.set(element.dataset.limrBlock, element); this.observer?.observe(element); } }
  unobserveBlock(element: HTMLElement) { if (element.dataset.limrBlock) this.blocks.delete(element.dataset.limrBlock); this.observer?.unobserve(element); }
  getScrollTop() { return this.configuration.get().scrollRoot?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0); }
  getViewportTop() { return this.configuration.get().scrollRoot?.getBoundingClientRect().top ?? 0; }
  getContentOffset() {
    // Read the interpolated value during motion, not the destination offset.
    const translate = this.content && getComputedStyle(this.content).translate;
    return translate ? parseFloat(translate.split(' ')[1] ?? '0') || 0 : 0;
  }
  scrollTo(top: number, behavior: ScrollBehavior = 'smooth') {
    const root = this.configuration.get().scrollRoot ?? window;
    if (behavior === 'smooth') scrollWithMotion(root, top);
    else root.scrollTo({ top: Math.max(0, top), behavior });
  }
  scrollToHeading(id: string) {
    const element = this.headings.get(id);
    if (element) this.scrollTo(element.getBoundingClientRect().top - this.getViewportTop() + this.getScrollTop() - (this.configuration.get().scrollOffset ?? 24));
  }
  scrollToOccurrence(id: string) {
    const element = this.anchors.get(id);
    if (element) this.scrollTo(element.getBoundingClientRect().top - this.getViewportTop() + this.getScrollTop() - (this.configuration.get().scrollOffset ?? 24));
  }
  requestLayout = () => {
    if (typeof window === 'undefined' || !this.content || this.layoutFrame) return;
    this.layoutFrame = window.requestAnimationFrame(() => {
      this.layoutFrame = 0;
      const offset = this.getScrollTop() - this.getViewportTop();
      this.headingPositions = [...this.headings].map(([id, element]) => ({ id, top: element.getBoundingClientRect().top + offset })).sort((a, b) => a.top - b.top);
      this.layout.set(this.layout.get() + 1);
      this.trackHeading();
    });
  };
  private trackHeading = () => {
    const positions = this.headingPositions;
    const top = this.getScrollTop() + (this.configuration.get().scrollOffset ?? 24) + 2;
    let lo = 0, hi = positions.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (positions[mid].top <= top) lo = mid + 1; else hi = mid; }
    const root = this.configuration.get().scrollRoot;
    const maximum = (root?.scrollHeight ?? document.documentElement.scrollHeight) - (root?.clientHeight ?? window.innerHeight);
    const atEnd = maximum > 0 && this.getScrollTop() >= maximum - 2;
    this.updateInteraction({ activeHeading: positions[atEnd ? positions.length - 1 : Math.max(0, lo - 1)]?.id ?? null });
  };
  mountContent(element: HTMLElement): () => void {
    this.content = element;
    this.observer = new ResizeObserver(this.requestLayout);
    this.observer.observe(element);
    element.querySelectorAll<HTMLElement>('[data-limr-block]').forEach(block => this.observer!.observe(block));
    let frame = 0;
    const scroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = 0; this.trackHeading(); this.viewport.set(this.viewport.get() + 1); });
    };
    const scrollRoot = this.configuration.get().scrollRoot ?? window;
    scrollRoot.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', this.requestLayout);
    document.fonts?.addEventListener('loadingdone', this.requestLayout);
    element.addEventListener('load', this.requestLayout, true);
    this.requestLayout();
    return () => {
      this.content = null; this.observer?.disconnect(); this.observer = null;
      cancelAnimationFrame(frame); cancelAnimationFrame(this.layoutFrame); this.layoutFrame = 0;
      scrollRoot.removeEventListener('scroll', scroll); window.removeEventListener('resize', this.requestLayout);
      document.fonts?.removeEventListener('loadingdone', this.requestLayout); element.removeEventListener('load', this.requestLayout, true);
    };
  }
}

export const emptyList = EMPTY;
