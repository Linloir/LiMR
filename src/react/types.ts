import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Annotation, AnnotationOccurrence, DocumentSnapshot, HighlightData, MarkdownNode, SelectionSnapshot, SourceRange, SyntaxExtension } from '../core/types';
import type { KnuthPlassOptions } from '../core/knuth-plass';
export type { KnuthPlassOptions } from '../core/knuth-plass';

export interface NodeRendererProps {
  node: MarkdownNode;
  children: ReactNode;
  pending: boolean;
  /** True only for this unclosed construct, not every child of a growing block. */
  incomplete?: boolean;
  source: string;
  /** Render an existing subtree without parsing strings again. */
  renderChildren: (nodes: readonly MarkdownNode[], options?: { trailing?: ReactNode }) => ReactNode;
  /** Render a literal node value with optional syntax tokens, preserving source
   * selection, highlights and annotation insertion. Token offsets are UTF-16. */
  renderValue: (tokens?: readonly TextToken[]) => ReactNode;
  /** Render a text attribute with source selection, highlights and annotations. */
  renderAttribute: (name: string) => ReactNode;
}
export interface TextToken { content: string; offset: number; style?: CSSProperties }
export type NodeRenderer = ComponentType<NodeRendererProps>;
export interface RendererOverride {
  /** AST type, or the registered name of a component. */
  type: string;
  component: NodeRenderer;
  /** Limits the replacement; false falls back to the next match or built-in. */
  when?: (node: MarkdownNode, context: { pending: boolean; incomplete: boolean; ancestors: readonly MarkdownNode[] }) => boolean;
}
export type TypographyMode = 'knuth-plass' | 'standard' | 'justify';
export type AnnotationPresentation = 'preview' | 'expanded' | 'sidebar';
export interface AnnotationExpansion {
  /** Grow beside the marker, or center within the page's visual viewport. */
  placement: 'anchor' | 'center';
  /** CSS lengths or pixels. Unset height fits content; centered width defaults to 640px. */
  width?: number | string;
  height?: number | string;
  maxHeight?: number | string;
}
export interface AnnotationContentProps<T = unknown> {
  annotation: Annotation<T>;
  presentation: AnnotationPresentation;
  expanded: boolean;
  /** Shared editor state, preserved when switching between sidebar and overlay. */
  editing: boolean;
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}
/** A compact sidebar summary from local annotation data; rendering it never
 * invokes the annotation's loader. The first annotation owns a grouped preview. */
export interface AnnotationSidebarPreviewProps<T = unknown> {
  annotation: Annotation<T>;
  data: T | undefined;
  occurrence: AnnotationOccurrence;
  annotations: readonly Annotation[];
  referenceText: string;
}
/** The registering module owns the entire inside of the floating surface.
 * `children` renders the occurrence's Content components, sharing their cache
 * and preserving their state between preview and expanded presentations. */
export interface AnnotationOverlayCardProps<T = unknown> {
  annotation: Annotation<T>;
  occurrence: AnnotationOccurrence;
  presentation: 'preview' | 'expanded';
  expanded: boolean;
  pinned: boolean;
  canExpand: boolean;
  expand: () => void;
  collapse: () => void;
  close: () => void;
  children: ReactNode;
}
export interface AnnotationType<T = unknown> {
  type: string;
  /** Resolve labels from the reader locale without recreating the plugin. */
  label: string | ((locale: LiMRLocale) => string);
  icon?: ReactNode | ComponentType;
  color?: string;
  /** Highlight referenced text in the marker color while hovered or active. */
  highlight?: 'hover' | false;
  Content?: ComponentType<AnnotationContentProps<T>>;
  Marker?: ComponentType<{ annotation: Annotation<T>; active: boolean }>;
  overlay?: {
    /** Render the full card, including its title, body and controls. */
    Card?: ComponentType<AnnotationOverlayCardProps<T>>;
    /** CSS length or pixels, constrained to the visual viewport. */
    previewWidth?: number | string;
    /** Expansion is opt-in. A resolver may vary the layout per annotation. */
    expand?: false | AnnotationExpansion | ((annotation: Annotation<T>) => false | AnnotationExpansion);
  };
  sidebar?: {
    /** Collapsed summary below the title. Return null or use false to hide it. */
    Preview?: ComponentType<AnnotationSidebarPreviewProps<T>> | false;
    /** Maximum summary lines. Default: 2. */
    previewLines?: number;
    previewColor?: string;
    /** Card accent; defaults to the marker color. CSS colors/variables are accepted. */
    color?: string;
    /** Resting decorative border; defaults to the card accent. */
    borderColor?: string;
    /** Title defaults to the accent; body and excerpt keep the reader text colors. */
    titleColor?: string;
    textColor?: string;
    excerptColor?: string;
    /** Toggle an expanded card by clicking its noninteractive content. Default: false. */
    collapseOnContentClick?: boolean;
  };
  /** Only called when content is displayed; requests share a per-reader cache. */
  load?: (annotation: Annotation<T>, context: { signal: AbortSignal }) => Promise<T>;
}
export interface RendererExtension extends SyntaxExtension {
  streaming?: {
    /** Optional module-owned intermediate state. Omit to render progressively. */
    Loading?: NodeRenderer;
    /** Last configured effect wins. The reader may override it. */
    effect?: StreamEffect | false;
  };
  /** Register document parameter defaults. Plugins extend RendererParameters
   * through TypeScript declaration merging and read them with useRendererParameter. */
  parameters?: Readonly<RendererParameters>;
  components?: Readonly<Record<string, NodeRenderer>>;
  /** Ordered, reader-local overrides. Last matching entry wins. */
  rendererOverrides?: readonly RendererOverride[];
  annotationTypes?: readonly AnnotationType<any>[];
  actions?: readonly SelectionAction[];
}
/** Animation applies to newly appended text and newly appearing blocks. CSS can style the supplied
 * class; keyframes/timing use the Web Animations API. No source rewriting. */
export interface StreamEffect {
  className?: string;
  keyframes?: Keyframe[];
  timing?: KeyframeAnimationOptions;
}
/** Open to module augmentation; parameter names and semantics belong to plugins. */
export interface RendererParameters {}
export interface DocumentCommands {
  /** Content annotations get a shared highlight unless disabled or their type
   * uses hover highlighting. An explicit appearance still creates a saved highlight. */
  addAnnotation: (annotation: Annotation, options?: { highlight?: HighlightData | false; edit?: boolean }) => void;
  updateAnnotation: (id: string, update: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  /** Remove all annotations bound to these exact fragments, preserving other anchors. */
  removeAnnotationsAt: (ranges: readonly SourceRange[]) => void;
  editAnnotation: (id: string | null) => void;
  /** Open the first occurrence of an annotation, or an explicit occurrence ID. */
  activateAnnotation: (id: string | null) => void;
}
export interface ActionContext extends DocumentCommands {
  selection: SelectionSnapshot;
  /** Annotations bound to the selected fragment, including its highlight. */
  annotations: readonly Annotation[];
  highlight: Annotation<HighlightData> | null;
  document: DocumentSnapshot;
  locale: LiMRLocale;
  clearSelection: () => void;
  /** Aborted when this reader is disposed, not when its menu closes. */
  signal: AbortSignal;
}
export interface ToolbarActionContext extends ActionContext {
  busy: boolean;
  expanded: boolean;
  highlightAppearance: HighlightData;
  setHighlightAppearance: (appearance: HighlightData) => void;
  expand: () => void;
  collapse: () => void;
  /** Run a panel operation through the toolbar's busy/error handling. */
  run: (operation: (context: ActionContext) => void | Promise<void>) => Promise<void>;
}
export interface SelectionAction {
  id: string;
  label: string | ((context: ActionContext) => string);
  /** Required, decorative, ideally a rounded SVG with a square viewBox. */
  icon: NonNullable<ReactNode> | ((context: ActionContext) => ReactNode);
  placement?: 'start' | 'end';
  tone?: 'danger';
  /** Optional transient success feedback after run() resolves. */
  successLabel?: string | ((context: ActionContext) => string);
  successIcon?: ReactNode;
  visible?: (context: ActionContext) => boolean;
  disabled?: (context: ActionContext) => boolean;
  run?: (context: ToolbarActionContext) => void | Promise<void>;
  onHover?: (context: ToolbarActionContext) => void;
  /** Automatically opens on hover; also accessible by keyboard and touch. */
  renderExpanded?: (context: ToolbarActionContext) => ReactNode;
  render?: (context: ToolbarActionContext) => ReactNode;
}
export interface LiMRLocale {
  /** Optional language tag for plugin-owned translations. */
  language?: string;
  citation?: string;
  contents: string; annotations: string; expand: string; collapse: string; close: string; copy: string;
  copied: string; copyFailed: string; copyImage: string; copyFigures: string; loading: string; retry: string; unavailable: string; footnotes: string;
  definition: string; question: string; note: string; extra: string; hint: string; answer: string; submit: string;
  correct: string; incorrect: string; play: string;
  highlight: string; addHighlight: string; editHighlight: string; highlightColor: string; highlightStyle: string;
  highlightBackground: string; highlightUnderline: string; highlightDotted: string; highlightWavy: string;
  hideHighlight: string; showHighlight: string;
  inlineHighlightHint?: string;
  deleteAnnotations: string; deleteAnnotationsHint: string;
}
export interface ViewConfiguration {
  /** Document-wide overrides of parameters registered by extensions. */
  parameters?: Readonly<RendererParameters>;
  extensions?: readonly RendererExtension[];
  /** Add installed plugins to the default extensions (or your extensions list). */
  plugins?: readonly RendererExtension[];
  /** CSS skin name, applied to every view including portalled controls. */
  appearance?: string;
  components?: Readonly<Record<string, NodeRenderer>>;
  /** Reader rules take precedence over extension rules and component mappings. */
  rendererOverrides?: readonly RendererOverride[];
  annotationTypes?: readonly AnnotationType<any>[];
  annotations?: readonly Annotation[];
  theme?: 'light' | 'dark' | 'auto';
  /** Justify prose paragraphs and list items, leaving the last line start-aligned. */
  justify?: boolean;
  /** TeX Knuth–Plass, standard (default), or browser justification.
   * pretty/normal remain compatible native-CSS aliases. */
  typography?: TypographyMode | 'pretty' | 'normal';
  knuthPlass?: KnuthPlassOptions;
  streamEffect?: StreamEffect | false;
  locale?: Partial<LiMRLocale>;
  scrollRoot?: HTMLElement | null;
  scrollOffset?: number;
  onSelectionChange?: (selection: SelectionSnapshot | null) => void;
  onAnnotationClick?: (occurrence: AnnotationOccurrence) => void;
  onAnnotationHover?: (occurrence: AnnotationOccurrence | null) => void;
  onDocumentChange?: (document: DocumentSnapshot) => void;
  onAnnotationsChange?: (annotations: readonly Annotation[]) => void;
  onHighlightHover?: (highlight: Annotation<HighlightData> | null) => void;
  onHighlightClick?: (highlight: Annotation<HighlightData>) => void;
}
export interface StyledProps { className?: string; style?: CSSProperties }
