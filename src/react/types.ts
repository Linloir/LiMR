import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Annotation, AnnotationOccurrence, DocumentSnapshot, Highlight, MarkdownNode, SelectionSnapshot, SyntaxExtension } from '../core/types';

export interface NodeRendererProps {
  node: MarkdownNode;
  children: ReactNode;
  pending: boolean;
  source: string;
  /** Render an existing subtree without parsing strings again. */
  renderChildren: (nodes: readonly MarkdownNode[]) => ReactNode;
}
export type NodeRenderer = ComponentType<NodeRendererProps>;
export type AnnotationPresentation = 'preview' | 'expanded' | 'sidebar';
export interface AnnotationContentProps<T = unknown> {
  annotation: Annotation<T>;
  presentation: AnnotationPresentation;
  expanded: boolean;
  data: T | undefined;
  loading: boolean;
  error: Error | null;
  retry: () => void;
}
export interface AnnotationType<T = unknown> {
  type: string;
  label: string;
  icon?: ReactNode | ComponentType;
  color?: string;
  Content?: ComponentType<AnnotationContentProps<T>>;
  Marker?: ComponentType<{ annotation: Annotation<T>; active: boolean }>;
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
  contents: string; annotations: string; expand: string; close: string; copy: string;
  copied: string; loading: string; retry: string; unavailable: string; footnotes: string;
  definition: string; extra: string; hint: string; answer: string; submit: string;
  correct: string; incorrect: string; play: string;
}
export interface ViewConfiguration {
  extensions?: readonly RendererExtension[];
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
