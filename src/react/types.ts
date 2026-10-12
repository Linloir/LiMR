import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Annotation, AnnotationOccurrence, DocumentSnapshot, Highlight, MarkdownNode, SelectionSnapshot, SyntaxExtension } from '../core/types';

export interface NodeRendererProps {
  node: MarkdownNode;
  children: ReactNode;
  pending: boolean;
  source: string;
  /** Render an existing subtree without parsing strings again. */
  renderChildren: (nodes: readonly MarkdownNode[]) => ReactNode;
  /** Render a literal node value with optional syntax tokens, preserving source
   * selection, highlights and annotation insertion. Token offsets are UTF-16. */
  renderValue: (tokens?: readonly TextToken[]) => ReactNode;
  /** Render a text attribute with source selection, highlights and annotations. */
  renderAttribute: (name: string) => ReactNode;
}
export interface TextToken { content: string; offset: number; style?: CSSProperties }
export type NodeRenderer = ComponentType<NodeRendererProps>;
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
  label: string;
  icon?: ReactNode | ComponentType;
  color?: string;
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
  components?: Readonly<Record<string, NodeRenderer>>;
  annotationTypes?: readonly AnnotationType<any>[];
  actions?: readonly SelectionAction[];
}
export interface DocumentCommands {
  addAnnotation: (annotation: Annotation) => void;
  updateAnnotation: (id: string, update: Partial<Annotation>) => void;
  removeAnnotation: (id: string) => void;
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (id: string) => void;
  /** Open the first occurrence of an annotation, or an explicit occurrence ID. */
  activateAnnotation: (id: string | null) => void;
}
export interface ActionContext extends DocumentCommands {
  selection: SelectionSnapshot;
  document: DocumentSnapshot;
  clearSelection: () => void;
  /** Aborted when this reader is disposed, not when its menu closes. */
  signal: AbortSignal;
}
export interface SelectionAction {
  id: string;
  label: string;
  icon?: ReactNode;
  visible?: (context: ActionContext) => boolean;
  disabled?: (context: ActionContext) => boolean;
  run?: (context: ActionContext) => void | Promise<void>;
  render?: (context: ActionContext & { busy: boolean }) => ReactNode;
}
export interface LiMRLocale {
  contents: string; annotations: string; expand: string; collapse: string; close: string; copy: string;
  copied: string; loading: string; retry: string; unavailable: string; footnotes: string;
  definition: string; question: string; note: string; extra: string; hint: string; answer: string; submit: string;
  correct: string; incorrect: string; play: string;
}
export interface ViewConfiguration {
  extensions?: readonly RendererExtension[];
  /** Add installed plugins to the default extensions (or your extensions list). */
  plugins?: readonly RendererExtension[];
  /** CSS skin name, applied to every view including portalled controls. */
  appearance?: string;
  components?: Readonly<Record<string, NodeRenderer>>;
  annotationTypes?: readonly AnnotationType<any>[];
  annotations?: readonly Annotation[];
  highlights?: readonly Highlight[];
  theme?: 'light' | 'dark' | 'auto';
  locale?: Partial<LiMRLocale>;
  scrollRoot?: HTMLElement | null;
  scrollOffset?: number;
  onSelectionChange?: (selection: SelectionSnapshot | null) => void;
  onAnnotationClick?: (occurrence: AnnotationOccurrence) => void;
  onAnnotationHover?: (occurrence: AnnotationOccurrence | null) => void;
  onDocumentChange?: (document: DocumentSnapshot) => void;
  onAnnotationsChange?: (annotations: readonly Annotation[]) => void;
  onHighlightsChange?: (highlights: readonly Highlight[]) => void;
}
export interface StyledProps { className?: string; style?: CSSProperties }
