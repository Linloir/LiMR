import { annotationReferenceRange, applySourceEdits, createDocument, defaultHighlight, resolveAnnotationAnchors, sameRange, ResourceCache, selectionFromRange } from '../core';
import { intersects, rangeOf } from '../core/tree';
import type { Annotation, AnnotationOccurrence, DocumentEngine, DocumentSnapshot, HighlightData, MarkdownNode, SelectionSnapshot, SourceRange } from '../core';
import type { AnnotationType, DocumentCommands, LiMRLocale, NodeRenderer, RendererExtension, ViewConfiguration } from './types';
import { scrollWithMotion } from './motion';
import { indexBlockDecorations } from './decoration-index';

export const english: LiMRLocale = {
  language: 'en', citation: 'Citation',
  contents: 'Contents', annotations: 'Annotations', expand: 'Expand', collapse: 'Collapse', close: 'Close', copy: 'Copy', copied: 'Copied',
  copyFailed: 'Copy failed', copyImage: 'Copy image URL', copyFigures: 'Copy figures Markdown',
  previewImage: 'Preview image', imagePreview: 'Image preview', closeImagePreview: 'Close image preview', imageFit: 'Fit to window', imageActualSize: 'Actual size',
  imageFill: 'Fill window', imageZoomIn: 'Zoom in', imageZoomOut: 'Zoom out', imageCopy: 'Copy image',
  imageLoadFailed: 'Unable to load image', imageLoadFailedHint: 'The link may be broken or the file may not exist.',
  translationOriginal: 'original', translationTranslated: 'translation', translationBoth: 'bilingual',
  translationSwitchLabel: 'Showing {mode}; switch to {next}', translationLockedLabel: 'Showing {mode}; controlled by display settings',
  loading: 'Loading…', retry: 'Retry', unavailable: 'Content unavailable', footnotes: 'Footnotes',
  definition: 'Definition', question: 'Question', note: 'Note', extra: 'Extended reading', hint: 'Hint', answer: 'Answer', submit: 'Submit',
  correct: 'Correct', incorrect: 'Try again', play: 'Play video',
  highlight: 'Highlight', addHighlight: 'Add highlight', editHighlight: 'Edit highlight', highlightColor: 'Color', highlightStyle: 'Style',
  highlightBackground: 'Background', highlightUnderline: 'Underline', highlightDotted: 'Dotted', highlightWavy: 'Wavy',
  hideHighlight: 'Hide highlight', showHighlight: 'Show highlight',
  inlineHighlightHint: 'Markdown inline highlight, editing unavailable',
  translationSelectionHint: 'Selections cannot cross translation paragraph boundaries.',
  deleteAnnotations: 'Delete', deleteAnnotationsHint: 'Deletes {count} annotations on this text and any highlight.',
};
export const chinese: LiMRLocale = {
  language: 'zh-CN', citation: '引用',
  contents: '目录', annotations: '注释', expand: '展开', collapse: '收起', close: '关闭', copy: '复制', copied: '已复制',
  copyFailed: '复制失败', copyImage: '复制图片 URL', copyFigures: '复制图组 Markdown',
  previewImage: '预览图片', imagePreview: '图片预览', closeImagePreview: '关闭图片预览', imageFit: '适应窗口', imageActualSize: '原始大小',
  imageFill: '铺满窗口', imageZoomIn: '放大', imageZoomOut: '缩小', imageCopy: '复制图片',
  imageLoadFailed: '图片无法加载', imageLoadFailedHint: '可能是链接损坏或文件不存在。',
  translationOriginal: '原文', translationTranslated: '译文', translationBoth: '对照',
  translationSwitchLabel: '当前{mode}，切换到{next}', translationLockedLabel: '当前{mode}，由全局展示模式控制',
  loading: '加载中…', retry: '重试', unavailable: '暂无内容', footnotes: '脚注',
  definition: '释义', question: '提问', note: '注释', extra: '拓展阅读', hint: '提示', answer: '答案', submit: '提交',
  correct: '回答正确', incorrect: '再试一次', play: '播放视频',
  highlight: '高亮', addHighlight: '添加高亮', editHighlight: '调整高亮', highlightColor: '颜色', highlightStyle: '样式',
  highlightBackground: '底色', highlightUnderline: '下划线', highlightDotted: '点线', highlightWavy: '波浪线',
  hideHighlight: '隐藏高亮', showHighlight: '显示高亮',
  inlineHighlightHint: 'Markdown 内嵌高亮，不支持编辑',
  translationSelectionHint: '翻译块不支持选区跨过原文或译文的段落边界。',
  deleteAnnotations: '删除', deleteAnnotationsHint: '将删除这段文字关联的 {count} 个注释及高亮。',
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
  /** Transient feedback from a module's native selection boundary. */
  selectionHint?: string | null;
  activeHeading: string | null;
  hovered: string | null;
  active: string | null;
  editing: string | null;
  activeHighlight: string | null;
  toolbarOccurrence?: string | null;
  hoveredHighlight: string | null;
  hoverSource?: 'marker' | 'sidebar' | null;
  activeSource?: 'marker' | 'sidebar' | null;
}
export interface PaintHighlight extends HighlightData {
  id: string; annotationId: string; range: SourceRange;
  /** Derived hover feedback, never persisted or edited as a user highlight. */
  occurrenceId?: string;
}
export interface Decorations {
  annotations: ReadonlyMap<string, Annotation>;
  highlights: ReadonlyMap<string, PaintHighlight>;
  occurrences: readonly AnnotationOccurrence[];
  referenceRanges: ReadonlyMap<string, SourceRange>;
  byBlock: ReadonlyMap<string, BlockDecorations>;
}
export interface BlockDecorations { occurrences: readonly AnnotationOccurrence[]; highlights: readonly PaintHighlight[] }
export interface ViewAnnotation {
  annotation: Annotation;
  occurrence: AnnotationOccurrence;
  type: AnnotationType<any>;
}
export interface DocumentViewport {
  reveal(range: SourceRange, viewportOffset?: number): void;
  activeHeading(): string | null;
}
export interface SourceBinding {
  range: SourceRange;
  atomic: boolean;
  /** Source interval for a DOM text boundary (UTF-16). */
  resolve?: (offset: number, edge: 'start' | 'end') => number;
  exact?: boolean;
}

const EMPTY: readonly never[] = Object.freeze([]);
export const emptyDecorations: BlockDecorations = Object.freeze({ occurrences: EMPTY, highlights: EMPTY });
type ResolvedAnnotationType = Omit<AnnotationType<any>, 'label'> & { label: string };
export class ReaderRuntime {
  readonly document: DocumentEngine;
  readonly interaction = new Store<InteractionState>({ selection: null, activeHeading: null, hovered: null, active: null, editing: null, activeHighlight: null, hoveredHighlight: null });
  readonly layout = new Store(0);
  readonly viewport = new Store(0);
  /** Visible text/state changes, separate from high-frequency geometry updates. */
  readonly presentation = new Store(0);
  readonly documentOffset = new Store(0);
  readonly decorations = new Store<Decorations>({ annotations: new Map(), highlights: new Map(), occurrences: [], referenceRanges: new Map(), byBlock: new Map() });
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
  readonly nodeStates = new WeakMap<MarkdownNode, Map<string, Store<unknown>>>();
  components: Readonly<Record<string, NodeRenderer>> = {};
  rendererOverrides = new Map<string, import('./types').RendererOverride[]>();
  annotationTypes = new Map<string, ResolvedAnnotationType>();
  private resolvedTypes = new WeakMap<AnnotationType<any>, ResolvedAnnotationType>();
  /** Presentation modules may expose computed detail without editing Markdown.
   * Entries are owned by their mounted view and published in one batch. */
  private viewAnnotations = new Map<object, readonly ViewAnnotation[]>();
  private viewAnnotationIds = new Set<string>();
  // Private prototype: staged views can only initialize a never-published runtime.
  private viewHandoffPublished = false;
  private initialViewOwners = new Set<object>();
  private initialViewAnchors = new Map<string, HTMLElement>();
  locale = english;
  content: HTMLElement | null = null;
  documentViewport: DocumentViewport | null = null;
  selectionRange: Range | null = null;
  /** Select-all in a windowed view addresses source outside mounted DOM. */
  virtualSelection = false;
  /** Live geometry supplied by the paint layer; independent of native selection. */
  highlightReference: { getBoundingClientRect: () => DOMRect; getClientRects: () => DOMRect[]; text?: string } | null = null;
  private layoutFrame = 0;
  private observer: ResizeObserver | null = null;
  private headingPositions: { id: string; top: number }[] = [];
  private localAnnotations: readonly Annotation[] = [];
  private pendingOpen: string | null = null;
  private pendingAnnotations?: { input: readonly Annotation[]; value: readonly Annotation[] };
  private annotationCreations = new Map<string, { source: boolean; highlights: Set<string> }>();
  private taskController = new AbortController();
  get signal() { return this.taskController.signal; }
  readonly commands: DocumentCommands = {
    canEditSource: () => !this.configuration.get().readOnly && !!this.configuration.get().onSourceChange && !this.document.getSnapshot().streaming,
    canEditAnnotation: id => {
      if (this.configuration.get().readOnly) return false;
      if (this.viewAnnotationIds.has(id)) return false;
      const annotation = this.decorations.get().annotations.get(id);
      if (!annotation || !this.supportsAnnotation(annotation)) return false;
      if (annotation.source) return this.commands.canEditSource() && !!this.configuration.get().extensions?.some(extension => extension.sourceEditing);
      if (this.document.getSnapshot().annotations.some(item => item.id === id)) return false;
      const config = this.configuration.get();
      return config.annotations === undefined || !!config.onAnnotationsChange;
    },
    editSource: (edits, options) => {
      if (this.configuration.get().readOnly) throw new Error('This document is read-only.');
      const document = this.document.getSnapshot(), accept = this.configuration.get().onSourceChange;
      if (!accept) throw new Error('Source editing requires onSourceChange.');
      if (document.streaming) throw new Error('Source editing is unavailable while streaming.');
      if (options?.revision !== undefined && options.revision !== document.revision) throw new Error('Source edit belongs to a stale document revision.');
      const next = applySourceEdits(document.source, edits);
      if (next === document.source) return true;
      if (accept(next, { document, edits }) === false) return false;
      // Publish immediately so successive commands in one event use the accepted
      // revision. React's controlled source prop can echo it on its next render.
      this.document.update(next);
      return true;
    },
    addAnnotation: (annotation, options = {}) => {
      let creation: { source: boolean; highlights: Set<string> } | undefined;
      const accepted = this.changeAnnotations(items => {
        const previous = items.find(item => item.id === annotation.id);
        if (options.edit && !previous) creation = { source: options.target === 'source', highlights: new Set() };
        const next = [...items.filter(item => item.id !== annotation.id), previous?.source ? { ...annotation, source: previous.source } : annotation];
        if (annotation.type !== 'highlight' && options.highlight !== false && (options.highlight !== undefined || this.annotationTypes.get(annotation.type)?.highlight !== 'hover')) {
          const doc = this.document.getSnapshot();
          for (const anchor of resolveAnnotationAnchors(annotation, doc)) {
            if (anchor.range.start === anchor.range.end) continue;
            const existing = next.find(item => item.type === 'highlight' && resolveAnnotationAnchors(item, doc).some(other => sameRange(other.range, anchor.range)));
            if (existing) {
              // Multiple unsaved creations may share their temporary paint.
              // Across persistence stores, reused paint remains independently
              // owned; canceling one store must not mutate the other.
              if (creation && [...this.annotationCreations.values()].some(owner => owner.source === creation!.source && owner.highlights.has(existing.id))) creation.highlights.add(existing.id);
              continue;
            }
            const highlight = { id: `highlight-${crypto.randomUUID()}`, type: 'highlight', anchors: [{ ...anchor, id: undefined }], data: { ...defaultHighlight, ...options.highlight } };
            next.push(highlight); creation?.highlights.add(highlight.id);
          }
        }
        return next;
      }, options.target);
      if (accepted && options.edit) {
        if (creation && (this.decorations.get().annotations.has(annotation.id) || this.pendingAnnotations?.value.some(item => item.id === annotation.id))) this.annotationCreations.set(annotation.id, creation);
        this.commands.editAnnotation(annotation.id);
      }
    },
    updateAnnotation: (id, update) => this.changeAnnotations(items => items.map(item => item.id === id ? { ...item, ...update, id, source: item.source } : item)),
    removeAnnotation: id => this.changeAnnotations(items => items.filter(item => item.id !== id)),
    removeAnnotationsAt: ranges => this.changeAnnotations(items => items.flatMap(item => {
      if (!this.supportsAnnotation(item)) return [item];
      const anchors = item.anchors ?? (item.range ? [{ range: item.range }] : []);
      const keep = anchors.filter(anchor => !resolveAnnotationAnchors({ ...item, range: undefined, anchors: [anchor] }, this.document.getSnapshot()).some(resolved => ranges.some(range => sameRange(range, resolved.range))));
      if (keep.length === anchors.length) return [item];
      return keep.length ? [{ ...item, range: undefined, anchors: keep }] : [];
    })),
    editAnnotation: id => {
      if (id && this.configuration.get().readOnly) return;
      const annotation = id && (this.decorations.get().annotations.get(id) ?? this.pendingAnnotations?.value.find(item => item.id === id));
      if (id && (!annotation || !this.supportsAnnotation(annotation))) return;
      if (!id) this.commitCreation(this.interaction.get().editing);
      this.updateInteraction({ editing: id });
      if (id) this.commands.activateAnnotation(id);
    },
    commitAnnotationEdit: supplied => {
      const id = supplied ?? this.interaction.get().editing;
      this.commitCreation(id);
      if (id && this.interaction.get().editing === id) this.updateInteraction({ editing: null });
    },
    cancelAnnotationEdit: supplied => {
      const id = supplied ?? this.interaction.get().editing;
      if (!id) return true;
      const creation = this.annotationCreations.get(id);
      if (creation) {
        const accepted = this.changeAnnotations(items => {
          const remaining = items.filter(item => item.id !== id);
          const doc = this.document.getSnapshot();
          const references = [...doc.annotations.filter(item => !item.source && item.id !== id && !remaining.some(other => other.id === item.id)), ...remaining]
            .filter(item => item.type !== 'highlight');
          const referenceIds = new Set(references.map(item => item.id));
          const referencedRanges = [...references.flatMap(item => resolveAnnotationAnchors(item, doc).map(anchor => anchor.range)),
            ...doc.occurrences.filter(occurrence => occurrence.annotationIds.some(id => referenceIds.has(id))).map(occurrence => annotationReferenceRange(doc, occurrence))];
          return remaining.filter(item => {
            if (!creation.highlights.has(item.id) || item.type !== 'highlight' || !!item.source !== creation.source) return true;
            const ranges = resolveAnnotationAnchors(item, doc).map(anchor => anchor.range);
            return referencedRanges.some(reference => ranges.some(range => intersects(range, reference)));
          });
        });
        if (!accepted) return false;
        this.annotationCreations.delete(id);
      }
      if (this.interaction.get().editing === id) this.updateInteraction({ editing: null });
      return true;
    },
    activateAnnotation: id => {
      const occurrence = this.decorations.get().occurrences.find(item => item.id === id || item.annotationIds.includes(id ?? ''));
      const annotation = id && (this.decorations.get().annotations.get(id) ?? this.pendingAnnotations?.value.find(item => item.id === id));
      this.pendingOpen = id && !occurrence && (!annotation || this.supportsAnnotation(annotation)) ? id : null;
      this.activate(occurrence?.id ?? null);
    },
  };
  private commitCreation(id: string | null) {
    const creation = id && this.annotationCreations.get(id);
    if (!creation || !id) return;
    this.annotationCreations.delete(id);
    // Saving any owner makes shared paint durable, including for other open
    // drafts that happened to reuse that newly created highlight.
    for (const pending of this.annotationCreations.values()) for (const highlight of creation.highlights) pending.highlights.delete(highlight);
  }
  private changeAnnotations(update: (items: readonly Annotation[]) => readonly Annotation[], target: 'annotations' | 'source' = 'annotations') {
    const config = this.configuration.get();
    if (config.readOnly) throw new Error('This document is read-only.');
    const external = this.pendingAnnotations && this.pendingAnnotations.input === config.annotations ? this.pendingAnnotations.value : config.annotations ?? this.localAnnotations;
    const document = this.document.getSnapshot();
    const authored = document.annotations.filter(annotation => annotation.source && !external.some(item => item.id === annotation.id));
    const current = [...authored, ...external];
    const next = update(current);
    const before = new Map(current.map(item => [item.id, item])), after = new Map(next.map(item => [item.id, item]));
    const added = next.filter(item => !before.has(item.id));
    const updated = next.filter(item => item.source && before.has(item.id) && before.get(item.id) !== item).map(annotation => ({ previous: before.get(annotation.id)!, annotation }));
    const removed = authored.filter(item => !after.has(item.id));
    const handlers = config.onSourceChange ? config.extensions?.flatMap(extension => extension.sourceEditing ? [extension.sourceEditing.annotations] : []) ?? [] : [];
    const sourceAdded = target === 'source' ? added : [];
    const sourceChange = { added: sourceAdded, updated, removed };
    let edits: readonly import('../core').SourceEdit[] | undefined;
    if (sourceAdded.length || updated.length || removed.length) for (let index = handlers.length - 1; index >= 0; index--) {
      edits = handlers[index](sourceChange, document);
      if (edits !== undefined) break;
    }
    if ((sourceAdded.length || updated.length || removed.length) && !edits) throw new Error('This Markdown annotation is read-only; enable onSourceChange and its source editing module.');
    const sourceIds = new Set([...authored, ...(edits ? sourceAdded : [])].map(item => item.id));
    const nextExternal = next.filter(item => !sourceIds.has(item.id));
    const externalChanged = external.length !== nextExternal.length || external.some((item, index) => item !== nextExternal[index]);
    if (externalChanged && config.annotations !== undefined && !config.onAnnotationsChange) throw new Error('Controlled annotations require onAnnotationsChange to accept edits.');
    if (edits && !this.commands.editSource(edits, { revision: document.revision })) return false;
    if (externalChanged) {
      const previousPending = this.pendingAnnotations;
      const pending = config.annotations === undefined ? undefined : { input: config.annotations, value: nextExternal };
      if (pending) this.pendingAnnotations = pending;
      try {
        const acceptance: unknown = config.onAnnotationsChange?.(nextExternal);
        if (acceptance === false) {
          if (this.pendingAnnotations === pending) this.pendingAnnotations = previousPending;
          return false;
        }
      } catch (error) {
        if (this.pendingAnnotations === pending) this.pendingAnnotations = previousPending;
        throw error;
      }
      if (config.annotations === undefined) { this.localAnnotations = nextExternal; this.rebuildDecorations(); }
    }
    return true;
  }
  start() { this.sealViewHandoff(); if (this.taskController.signal.aborted) this.taskController = new AbortController(); }
  dispose() { this.taskController.abort(); this.resources.invalidate(); this.resourceKeys.clear(); this.annotationCreations.clear(); }
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

  constructor(id: string, source: string, streaming: boolean, config: ViewConfiguration, document?: DocumentEngine, nodeStates?: ReaderRuntime['nodeStates']) {
    if (nodeStates) this.nodeStates = nodeStates;
    this.configuration = new Store(config);
    this.installConfiguration(config);
    this.document = document ?? createDocument(source, { id, streaming, extensions: config.extensions });
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
    this.locale = { ...english, ...config.locale };
    this.components = Object.assign({}, ...(config.extensions ?? []).map(ext => ext.components), config.components);
    this.rendererOverrides = new Map();
    const rules = [...(config.extensions ?? []).flatMap(ext => ext.rendererOverrides ?? []),
      ...Object.entries(config.components ?? {}).map(([type, component]) => ({ type, component })), ...config.rendererOverrides ?? []];
    for (const rule of rules) this.rendererOverrides.set(rule.type, [...this.rendererOverrides.get(rule.type) ?? [], rule]);
    const viewTypes = new Map<string, AnnotationType<any>>();
    for (const entries of this.viewAnnotations.values()) for (const entry of entries) viewTypes.set(entry.type.type, entry.type);
    const annotationTypes = [...viewTypes.values(), ...(config.extensions ?? []).flatMap(ext => [...ext.annotationTypes ?? []]), ...config.annotationTypes ?? []];
    this.annotationTypes = new Map(annotationTypes.map(type => {
      if (typeof type.label === 'string') return [type.type, type as ResolvedAnnotationType];
      const label = type.label(this.locale);
      const previous = this.resolvedTypes.get(type);
      const resolved = previous?.label === label ? previous : { ...type, label };
      this.resolvedTypes.set(type, resolved);
      return [type.type, resolved];
    }));
  }
  /** Stored data stays available when its presentation module is uninstalled. */
  supportsAnnotation(annotation: Annotation) { return annotation.type === 'highlight' || this.annotationTypes.has(annotation.type); }
  setViewAnnotations(owner: object, entries: readonly ViewAnnotation[]) {
    if (this.viewAnnotations.get(owner) === entries || !entries.length && !this.viewAnnotations.has(owner)) return;
    if (entries.length) this.viewAnnotations.set(owner, entries);
    else this.viewAnnotations.delete(owner);
    this.viewAnnotationIds = new Set([...this.viewAnnotations.values()].flatMap(items => items.map(item => item.annotation.id)));
    this.installConfiguration(this.configuration.get());
    this.rebuildDecorations();
    this.requestLayout();
  }
  private sealViewHandoff() { this.viewHandoffPublished = true; this.initialViewOwners.clear(); this.initialViewAnchors.clear(); }
  /** Private prototype initialization, never a plugin/runtime migration API.
   * Called only before the receiving content/reader has ever been published.
   * No layout scheduling or user activation callbacks occur during staging. */
  initializeViewHandoff(owners: readonly { owner: object; entries: readonly ViewAnnotation[] }[],
    interaction: Partial<Pick<InteractionState, 'active' | 'activeSource' | 'hovered' | 'hoverSource' | 'toolbarOccurrence'>>,
    anchors: readonly (readonly [string, HTMLElement])[]): void {
    if (this.viewHandoffPublished || this.content || this.signal.aborted) throw new Error('Cannot seed a published reader');
    for (const owner of this.initialViewOwners) this.viewAnnotations.delete(owner);
    for (const [id, element] of this.initialViewAnchors) if (this.anchors.get(id) === element) this.anchors.delete(id);
    this.initialViewOwners = new Set(owners.map(item => item.owner));
    this.initialViewAnchors = new Map(anchors);
    for (const { owner, entries } of owners) if (entries.length) this.viewAnnotations.set(owner, entries);
    this.viewAnnotationIds = new Set([...this.viewAnnotations.values()].flatMap(entries => entries.map(entry => entry.annotation.id)));
    // Removing a no-longer-admitted initial pin must not synthesize an old
    // user's close event. These are fresh, unpublished stores only.
    this.interaction.set({ ...this.interaction.get(), active: null, activeSource: null, hovered: null, hoverSource: null, toolbarOccurrence: null });
    this.installConfiguration(this.configuration.get());
    this.rebuildDecorations();
    const ids = this.decorations.get().referenceRanges;
    const active = interaction.active && ids.has(interaction.active) ? interaction.active : null;
    const hovered = interaction.hovered && ids.has(interaction.hovered) ? interaction.hovered : null;
    this.interaction.set({ ...this.interaction.get(), active, activeSource: active ? interaction.activeSource : null,
      hovered, hoverSource: hovered ? interaction.hoverSource : null,
      toolbarOccurrence: interaction.toolbarOccurrence && ids.has(interaction.toolbarOccurrence) ? interaction.toolbarOccurrence : null });
    for (const [id, element] of anchors) if (ids.has(id) && element.isConnected) this.anchors.set(id, element);
  }
  configure(config: ViewConfiguration) {
    const old = this.configuration.get();
    if (this.pendingAnnotations?.input !== config.annotations) this.pendingAnnotations = undefined;
    this.installConfiguration(config);
    this.configuration.set(config);
    if (old.extensions !== config.extensions) {
      const previous = this.document.getSnapshot();
      this.document.setExtensions(config.extensions ?? []);
      if (previous === this.document.getSnapshot()) this.rebuildDecorations();
    } else if (old.annotations !== config.annotations || old.annotationTypes !== config.annotationTypes) this.rebuildDecorations();
    if (old.annotationTypes !== config.annotationTypes || old.extensions !== config.extensions) this.resources.invalidate();
  }
  updateInteraction(patch: Partial<InteractionState>) {
    if (patch.selection === null) { this.virtualSelection = false; patch = { ...patch, selectionHint: null }; }
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
    this.updateInteraction({ active: id, activeSource: id ? source : null, hovered: null, hoverSource: null,
      toolbarOccurrence: source === 'marker' ? id : null, ...(id ? { selection: null, activeHighlight: null } : {}),
    });
    const occurrence = this.decorations.get().occurrences.find(item => item.id === id);
    if (occurrence) this.configuration.get().onAnnotationClick?.(occurrence);
  }
  hoverHighlight(id: string | null) {
    if (this.interaction.get().hoveredHighlight === id) return;
    this.updateInteraction({ hoveredHighlight: id });
    this.configuration.get().onHighlightHover?.(id ? this.decorations.get().annotations.get(this.decorations.get().highlights.get(id)?.annotationId ?? '') as Annotation<HighlightData> ?? null : null);
  }
  activateHighlight(id: string | null) {
    this.updateInteraction({ activeHighlight: id, selection: null, toolbarOccurrence: null });
    const highlight = id && this.decorations.get().highlights.get(id);
    if (highlight) this.configuration.get().onHighlightClick?.(this.decorations.get().annotations.get(highlight.annotationId) as Annotation<HighlightData>);
    else this.highlightReference = null;
  }
  clearSelection() {
    this.selectionRange = null;
    const selection = typeof window === 'undefined' ? null : window.getSelection();
    if (selection?.anchorNode && this.content?.contains(selection.anchorNode)) selection.removeAllRanges();
    this.highlightReference = null;
    this.updateInteraction({ selection: null, activeHighlight: null, toolbarOccurrence: null });
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
    for (const entries of this.viewAnnotations.values()) for (const entry of entries) annotations.set(entry.annotation.id, entry.annotation);
    for (const annotation of config.annotations ?? this.localAnnotations) annotations.set(annotation.id, annotation);
    for (const id of this.annotationCreations.keys()) if (!annotations.has(id) && !this.pendingAnnotations?.value.some(annotation => annotation.id === id)) this.annotationCreations.delete(id);
    for (const [id, resource] of this.resourceKeys) if (!annotations.has(id)) {
      this.resources.invalidate(resource.key); this.resourceKeys.delete(id);
    }
    const versions = this.resourceVersions.get();
    if ([...versions.keys()].some(id => !annotations.has(id))) this.resourceVersions.set(new Map([...versions].filter(([id]) => annotations.has(id))));
    const occurrences: AnnotationOccurrence[] = doc.occurrences.flatMap(occurrence => {
      const annotationIds = occurrence.annotationIds.filter(id => {
        const annotation = annotations.get(id);
        // An installed citation module can still explain a missing definition.
        return annotation ? this.supportsAnnotation(annotation) : this.annotationTypes.has('citation');
      });
      // Keep the parsed source group intact, but give every annotation its own
      // stable marker/card identity, including while modules are removed.
      return [...new Set(annotationIds)].map(id => ({ ...occurrence,
        id: `${occurrence.id}:${encodeURIComponent(id)}`, markerId: occurrence.id, annotationIds: [id],
      }));
    });
    for (const entries of this.viewAnnotations.values()) for (const entry of entries) occurrences.push({ ...entry.occurrence, embedded: true });
    const allHighlights: PaintHighlight[] = [];
    for (const annotation of annotations.values()) {
      if (!this.supportsAnnotation(annotation)) continue;
      resolveAnnotationAnchors(annotation, doc).forEach((anchor, index) => {
        if (annotation.type === 'highlight') {
          const id = index ? `${annotation.id}:${index}` : annotation.id;
          const value = { ...(annotation.data as HighlightData), id, annotationId: annotation.id, range: anchor.range };
          const old = previous.highlights.get(id);
          allHighlights.push(old && !old.occurrenceId && sameRange(old.range, value.range) && old.color === value.color && old.style === value.style && old.hidden === value.hidden && old.readOnly === value.readOnly ? old : value);
        } else if (!this.viewAnnotationIds.has(annotation.id) && annotation.source?.module !== 'source-annotations') occurrences.push({ ...anchor, id: anchor.id ?? `${doc.id}-${annotation.id}-${index}`, annotationIds: [annotation.id] });
      });
    }
    occurrences.sort((a, b) => a.range.end - b.range.end || a.id.localeCompare(b.id));
    const referenceRanges = new Map(occurrences.map(occurrence => [occurrence.id, annotationReferenceRange(doc, occurrence)]));
    const savedHighlights = new Map<string, PaintHighlight>();
    for (const item of allHighlights) {
      const key = `${item.range.start}:${item.range.end}`, previous = savedHighlights.get(key);
      if (!previous || previous.hidden || !item.hidden) savedHighlights.set(key, item);
    }
    for (const occurrence of occurrences) {
      const annotation = annotations.get(occurrence.annotationIds[0]);
      const definition = annotation && this.annotationTypes.get(annotation.type);
      if (!annotation || definition?.highlight !== 'hover' && !occurrence.referenceColor) continue;
      const range = referenceRanges.get(occurrence.id)!;
      if (range.start === range.end) continue;
      const explicit = savedHighlights.get(`${range.start}:${range.end}`);
      // A visible saved highlight is already the hover target. Hidden ones
      // still own the color, without becoming persistent or painted twice.
      if (explicit && !explicit.hidden) continue;
      const id = `reference-${occurrence.id}`;
      const value: PaintHighlight = { id, annotationId: annotation.id, occurrenceId: occurrence.id, range, color: explicit?.color ?? occurrence.referenceColor ?? definition?.color ?? defaultHighlight.color, style: 'background' };
      const old = previous.highlights.get(id);
      allHighlights.push(old && old.occurrenceId === value.occurrenceId && old.annotationId === value.annotationId && sameRange(old.range, range) && old.color === value.color ? old : value);
    }
    const byBlock = new Map<string, BlockDecorations>();
    const marksByBlock = indexBlockDecorations(doc.blocks, occurrences.filter(item => !item.embedded), 'endpoint');
    const highlightsByBlock = indexBlockDecorations(doc.blocks, allHighlights, 'overlap');
    for (const [index, block] of (occurrences.length || allHighlights.length ? doc.blocks : []).entries()) {
      const marks = marksByBlock.get(index) ?? [];
      const before = previous.byBlock.get(block.id) ?? emptyDecorations;
      const old = before.occurrences;
      const same = old && old.length === marks.length && old.every((item, index) => item.id === marks[index].id && item.range.start === marks[index].range.start && item.range.end === marks[index].range.end && item.annotationIds.join('\0') === marks[index].annotationIds.join('\0'));
      const highlights = highlightsByBlock.get(index) ?? [];
      const oldHighlights = before.highlights;
      const sameHighlights = oldHighlights.length === highlights.length && oldHighlights.every((item, i) => item === highlights[i]);
      if (marks.length || highlights.length) byBlock.set(block.id, same && sameHighlights ? before : { occurrences: same ? old : marks, highlights: sameHighlights ? oldHighlights : highlights });
    }
    const sameBlocks = byBlock.size === previous.byBlock.size && [...byBlock].every(([id, value]) => previous.byBlock.get(id) === value);
    const highlights = new Map(allHighlights.map(item => [item.id, item]));
    this.decorations.set({ annotations, highlights, occurrences, referenceRanges, byBlock: sameBlocks ? previous.byBlock : byBlock });
    const state = this.interaction.get();
    if (this.pendingOpen && annotations.has(this.pendingOpen) && !this.supportsAnnotation(annotations.get(this.pendingOpen)!)) this.pendingOpen = null;
    if (state.editing && (!annotations.has(state.editing) || !this.supportsAnnotation(annotations.get(state.editing)!)) && this.pendingOpen !== state.editing) this.updateInteraction({ editing: null });
    if (state.activeHighlight && !highlights.has(state.activeHighlight)) this.activateHighlight(null);
    if (state.hoveredHighlight && !highlights.has(state.hoveredHighlight)) this.hoverHighlight(null);
    if (state.active && !occurrences.some(item => item.id === state.active)) this.activate(null);
    if (state.hovered && !occurrences.some(item => item.id === state.hovered)) this.hover(null);
    if (this.pendingOpen) {
      const occurrence = occurrences.find(item => item.id === this.pendingOpen || item.annotationIds.includes(this.pendingOpen!));
      if (occurrence) { this.pendingOpen = null; this.activate(occurrence.id); }
    }
  }
  registerAnchor(id: string, element: HTMLElement | null) { if (element) this.anchors.set(id, element); else this.anchors.delete(id); this.requestLayout(); }
  registerHeading(id: string, element: HTMLElement | null) { if (element) this.headings.set(id, element); else this.headings.delete(id); this.requestLayout(); }
  blockRevision = 0;
  observeBlock(element: HTMLElement | null) { if (element) { if (element.dataset.limrBlock && this.blocks.get(element.dataset.limrBlock) !== element) { this.blocks.set(element.dataset.limrBlock, element); this.blockRevision++; } this.observer?.observe(element); } }
  unobserveBlock(element: HTMLElement) { if (element.dataset.limrBlock && this.blocks.get(element.dataset.limrBlock) === element) { this.blocks.delete(element.dataset.limrBlock); this.blockRevision++; } this.observer?.unobserve(element); }
  getScrollTop() { return this.configuration.get().scrollRoot?.scrollTop ?? (typeof window !== 'undefined' ? window.scrollY : 0); }
  getViewportTop() { return this.configuration.get().scrollRoot?.getBoundingClientRect().top ?? 0; }
  /** Share a small arrival tolerance across ordinary and windowed readers. */
  getHeadingActivationInset() { return (this.configuration.get().scrollOffset ?? 24) + 16; }
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
  private scrollToElement(element: HTMLElement) {
    let top = element.getBoundingClientRect().top - this.getViewportTop() + this.getScrollTop() - (this.configuration.get().scrollOffset ?? 24);
    // Leaving a sidebar card can start a prose translation before this click.
    // Navigate to the settled position, rather than that animation's first frame.
    if (this.content?.getAnimations().some(animation => animation instanceof CSSTransition && animation.transitionProperty === 'translate' && animation.playState === 'running')) {
      top += this.documentOffset.get() - this.getContentOffset();
    }
    this.scrollTo(top);
  }
  scrollToHeading(id: string) {
    if (this.documentViewport) {
      const heading = this.document.getSnapshot().headings.find(item => item.id === id);
      if (heading) { this.documentViewport.reveal(heading.range); return; }
    }
    const element = this.headings.get(id);
    if (element) this.scrollToElement(element);
  }
  scrollToSource(range: SourceRange) {
    if (this.documentViewport) { this.documentViewport.reveal(range); return; }
    const block = this.document.getSnapshot().blocks.find(block => block.range.end > range.start && block.range.start <= range.start);
    const element = block && this.blocks.get(block.id);
    if (element) this.scrollToElement(element);
  }
  scrollToOccurrence(id: string) {
    if (this.documentViewport) {
      const occurrence = this.decorations.get().occurrences.find(item => item.id === id);
      if (occurrence) { this.documentViewport.reveal(occurrence.referenceRange ?? occurrence.range); return; }
    }
    const element = this.anchors.get(id);
    if (element) this.scrollToElement(element);
  }
  /** Called by the article's React bubble handler after child controls have
   * had the opportunity to claim a click or prevent its default action. */
  followFragment = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
    if (!link || link.hasAttribute('download') || link.target && link.target !== '_self' || !this.content?.contains(link)) return;
    // Markdown fragment-only links belong to this reader even when a host
    // supplies <base> for relative image/document resources (for example an
    // editor webview). Explicit URLs still need to identify this actual page.
    const href = link.getAttribute('href') ?? '';
    let fragment: string;
    if (href.startsWith('#')) fragment = href.slice(1);
    else {
      const url = new URL(link.href, document.baseURI);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      fragment = url.hash.slice(1);
    }
    if (!fragment) return;
    let id: string;
    try { id = decodeURIComponent(fragment); } catch { return; }
    const rawId = fragment, snapshot = this.document.getSnapshot();
    // Prefer exact IDs, including literal encoded IDs, before accepting the
    // document-local heading slug used in ordinary Markdown links.
    const candidates = [...new Set([id, rawId, `${snapshot.id}-${id}`, `${snapshot.id}-${rawId}`])];
    const findTarget = () => {
      for (const candidate of candidates) {
        const target = this.content?.querySelector<HTMLElement>(`[id="${CSS.escape(candidate)}"]`);
        if (target) return target;
      }
    };
    const focusTarget = (target: HTMLElement) => {
      if (!target.hasAttribute('tabindex')) { target.tabIndex = -1; target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true }); }
      target.focus({ preventScroll: true });
    };
    const target = findTarget();
    if (this.documentViewport && (!target || target.closest('[data-window-parked]'))) {
      let destination: SourceRange | undefined;
      for (const candidate of candidates) { destination = snapshot.headings.find(heading => heading.id === candidate)?.range; if (destination) break; }
      const notePrefix = `${snapshot.id}-fn-`, referencePrefix = `${snapshot.id}-fnref-`;
      if (!destination && id.startsWith(notePrefix)) {
        const identifier = id.slice(notePrefix.length), note = snapshot.footnotes.get(identifier);
        if (note) destination = rangeOf(note);
      }
      if (!destination && id.startsWith(referencePrefix)) {
        const offset = Number(id.slice(referencePrefix.length));
        if (Number.isInteger(offset) && offset >= 0 && offset < snapshot.source.length) destination = { start: offset, end: offset + 1 };
      }
      if (destination) {
        event.preventDefault(); this.documentViewport.reveal(destination);
        if (event.detail === 0) {
          let attempts = 0;
          const focus = () => {
            const mounted = findTarget();
            if (mounted && !mounted.closest('[data-window-parked],[inert]')) focusTarget(mounted);
            else if (++attempts < 4 && this.content) requestAnimationFrame(focus);
          };
          requestAnimationFrame(focus);
        }
      }
      return;
    }
    if (!target) return;
    event.preventDefault();
    this.scrollToElement(target);
    // Keyboard navigation retains a meaningful destination without a second jump.
    if (event.detail === 0) {
      focusTarget(target);
    }
  };
  requestLayout = () => {
    if (typeof window === 'undefined' || !this.content || this.layoutFrame) return;
    this.layoutFrame = window.requestAnimationFrame(() => {
      this.layoutFrame = 0;
      const offset = this.getScrollTop() - this.getViewportTop() - this.getContentOffset();
      this.headingPositions = [...this.headings].filter(([, element]) => !element.closest('[inert]')).map(([id, element]) => ({ id, top: element.getBoundingClientRect().top + offset })).sort((a, b) => a.top - b.top);
      const state = this.interaction.get();
      if (state.active && this.anchors.get(state.active)?.closest('[inert]')) this.activate(null);
      if (state.hovered && this.anchors.get(state.hovered)?.closest('[inert]')) this.hover(null);
      this.layout.set(this.layout.get() + 1);
      this.trackHeading();
    });
  };
  private trackHeading = () => {
    if (this.documentViewport) { this.updateInteraction({ activeHeading: this.documentViewport.activeHeading() }); return; }
    const positions = this.headingPositions;
    const top = this.getScrollTop() + this.getHeadingActivationInset() - this.getContentOffset();
    let lo = 0, hi = positions.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (positions[mid].top <= top) lo = mid + 1; else hi = mid; }
    const root = this.configuration.get().scrollRoot;
    const maximum = (root?.scrollHeight ?? document.documentElement.scrollHeight) - (root?.clientHeight ?? window.innerHeight);
    const atEnd = maximum > 0 && this.getScrollTop() >= maximum - 2;
    this.updateInteraction({ activeHeading: positions[atEnd ? positions.length - 1 : Math.max(0, lo - 1)]?.id ?? null });
  };
  mountContent(element: HTMLElement): () => void {
    this.sealViewHandoff();
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
