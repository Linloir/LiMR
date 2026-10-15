import type { Extension as MicromarkExtension } from 'micromark-util-types';
import type { Extension as MdastExtension } from 'mdast-util-from-markdown';

/** UTF-16 offsets into the unmodified input. The end is exclusive. */
export interface SourceRange { start: number; end: number }
/** Replace an original UTF-16 source span. Edits in a transaction must not overlap. */
export interface SourceEdit { range: SourceRange; text: string }
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
  /** Source-mapped attribute values, available to custom text renderers. */
  attributeNodes?: Record<string, MarkdownNode>;
  inline?: boolean;
  selection?: 'content' | 'atomic';
  /** The opening syntax is known but its closing delimiter has not arrived. */
  incomplete?: boolean;
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
  /** Directive bodies are literal source (for example code or LaTeX). */
  literal?: boolean;
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
  /** Module-owned source syntax. Duplicate definitions retain every span so
   * deleting or rewriting an ID cannot reveal an older definition. */
  source?: { module: string; ranges: readonly SourceRange[]; rangeIds?: readonly string[] };
}
/** A named range authored as ==text==[^%%limr:id%%]. */
export interface SourceAnnotationRange {
  id: string;
  range: SourceRange;
  syntaxRange: SourceRange;
  markerRange: SourceRange;
}
export interface AnnotationOccurrence extends AnnotationAnchor {
  id: string;
  annotationIds: readonly string[];
  embedded?: boolean;
  /** Optional referenced text range, distinct from the marker's source range. */
  referenceRange?: SourceRange;
}
/** Data for the built-in `highlight` annotation type. */
export interface HighlightData {
  color?: string;
  style?: 'background' | 'underline' | 'dotted' | 'wavy';
  hidden?: boolean;
  /** Authored in Markdown: the default toolbar offers copying without editing. */
  readOnly?: boolean;
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
  annotationRanges: ReadonlyMap<string, readonly SourceAnnotationRange[]>;
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
  /** Readable selected text; the browser adapter substitutes complete original
   * source (including delimiters) for selected atomic content once settled. */
  text: string;
  quality: 'exact' | 'atomic' | 'unmapped';
  raw: SelectionResult;
  /** Absorb adjacent standard Markdown delimiters independently at each edge. */
  syntax: SelectionResult;
  blocks: SelectionResult;
  /** False while a pointer selection is being adjusted. */
  settled: boolean;
}

export interface Rect { x: number; y: number; top: number; right: number; bottom: number; left: number; width: number; height: number }
