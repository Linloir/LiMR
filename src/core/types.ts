import type { Extension as MicromarkExtension } from 'micromark-util-types';
import type { Extension as MdastExtension } from 'mdast-util-from-markdown';

/** UTF-16 offsets into the unmodified input. The end is exclusive. */
export interface SourceRange { start: number; end: number }
export interface SourcePoint { offset: number; line: number; column: number }
export interface SourcePosition { start: SourcePoint; end: SourcePoint }

/** The portable, serializable tree consumed by LiMR's views. */
export interface MarkdownNode {
  type: string;
  position?: SourcePosition;
  children?: MarkdownNode[];
  value?: string;
  name?: string;
  attributes?: Record<string, string | boolean | number>;
  inline?: boolean;
  selection?: 'content' | 'atomic';
  [key: string]: unknown;
}

export interface ParseContext {
  source: string;
  streaming: boolean;
  documentId: string;
}
export interface SyntaxExtension {
  /** Unique name. Duplicate names are an error unless explicitly replaced. */
  name: string;
  micromark?: readonly MicromarkExtension[];
  mdast?: readonly MdastExtension[];
  tags?: readonly string[];
  directives?: readonly string[];
  selection?: 'content' | 'atomic';
  transform?: (root: MarkdownNode, context: ParseContext) => void;
  display?: 'block' | 'inline' | 'auto';
  /** Transforms default to document scope. Opt into local only when safe. */
  scope?: 'local' | 'document';
}
export interface Heading {
  id: string;
  text: string;
  level: number;
  range: SourceRange;
  blockId: string;
}
export interface AnnotationAnchor {
  id?: string;
  range: SourceRange;
  documentId?: string;
  revision?: number;
  /** Optional original text used to validate or relocate persisted anchors. */
  quote?: string;
}
export interface Annotation<T = unknown> {
  id: string;
  type: string;
  data?: T;
  /** Shorthand for a single occurrence. */
  range?: SourceRange;
  anchors?: readonly AnnotationAnchor[];
}
export interface AnnotationOccurrence extends AnnotationAnchor {
  id: string;
  annotationIds: readonly string[];
  embedded?: boolean;
}
export interface Highlight {
  id: string;
  range: SourceRange;
  color?: string;
  style?: 'background' | 'underline' | 'dotted' | 'wavy';
}
export interface Block {
  id: string;
  node: MarkdownNode;
  range: SourceRange;
  pending: boolean;
}
export interface Diagnostic { message: string; offset?: number; extension?: string }
export interface DocumentMetrics {
  parsedCharacters: number;
  reusedBlocks: number;
  parsedBlocks: number;
  fullParse: boolean;
  reason: 'initial' | 'append' | 'replace' | 'definitions' | 'extension' | 'finalize';
}
export interface DocumentSnapshot {
  id: string;
  revision: number;
  source: string;
  streaming: boolean;
  blocks: readonly Block[];
  headings: readonly Heading[];
  definitions: ReadonlyMap<string, MarkdownNode>;
  footnotes: ReadonlyMap<string, MarkdownNode>;
  footnoteOrder: readonly string[];
  annotations: readonly Annotation[];
  occurrences: readonly AnnotationOccurrence[];
  diagnostics: readonly Diagnostic[];
  metrics: DocumentMetrics;
}
export interface DocumentOptions {
  id?: string;
  extensions?: readonly SyntaxExtension[];
  streaming?: boolean;
}
export interface SelectionResult {
  ranges: readonly SourceRange[];
  sourceText: string;
}
export interface SelectionSnapshot {
  documentId: string;
  revision: number;
  text: string;
  quality: 'exact' | 'atomic' | 'unmapped';
  raw: SelectionResult;
  syntax: SelectionResult;
  blocks: SelectionResult;
  /** False while a pointer selection is being adjusted. */
  settled: boolean;
}

export interface Rect { x: number; y: number; top: number; right: number; bottom: number; left: number; width: number; height: number }
