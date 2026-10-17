import { fromMarkdown, type Options } from 'mdast-util-from-markdown';
import { parse, postprocess, preprocess } from 'micromark';
import type { Chunk, ParseContext, TokenizeContext } from 'micromark-util-types';
import { createMarkdownCompiler } from './micromark/mdast-compiler.js';

type Root = ReturnType<typeof fromMarkdown>;
interface Point { line: number; column: number; offset: number }
interface Window { start: number; end: number; from: Point }
interface DefinitionState { defined: string[]; footnotes: string[] }
export interface BoundedMarkdownOptions {
  /** Internal opt-in: the caller has verified the unchanged bundled grammar.
   * Third-party tokenizer/compiler extensions retain the upstream path. */
  enabled?: boolean;
  /** Desired UTF-16 workspace size; a single open block/container is indivisible. */
  targetSize?: number;
  onProgress?: (offset: number) => void;
}
const DEFAULT_TARGET = 64 * 1024;
const INPUT_CHUNK = 64 * 1024;

function point(context: TokenizeContext): Point {
  const { line, column, offset } = context.now();
  return { line, column, offset };
}
function parserWithDefinitions(options: Options | undefined, definitions: DefinitionState): ParseContext {
  const parser = parse(options);
  parser.defined = definitions.defined;
  (parser as ParseContext & { gfmFootnotes: string[] }).gfmFootnotes = definitions.footnotes;
  return parser;
}

/** Feed the original preprocessor continuously, including CRLF, tabs and BOM.
 * At most one physical line and one input chunk are buffered here. */
function* lines(source: string): Generator<Chunk[]> {
  const prepare = preprocess();
  let pending: Chunk[] = [];
  for (let offset = 0; offset < source.length || offset === 0; offset += INPUT_CHUNK) {
    const end = Math.min(source.length, offset + INPUT_CHUNK);
    const chunks = prepare(source.slice(offset, end), undefined, end === source.length);
    for (const chunk of chunks) {
      pending.push(chunk);
      if (chunk === null || chunk === -3 || chunk === -4 || chunk === -5) {
        yield pending;
        pending = [];
      }
    }
  }
}

/** JSX containers span separate micromark flow tags; unlike Markdown
 * containers their nesting is enforced by the mdast compiler. Keep the entire
 * component together, using tokenizer events rather than text heuristics. */
function hasOpenJsx(document: TokenizeContext): boolean {
  const seen = new Set<TokenizeContext>();
  let depth = 0;
  for (const [, token] of document.events) {
    const flow = token._tokenizer;
    if (!flow || seen.has(flow)) continue;
    seen.add(flow);
    let closing = false, selfClosing = false;
    for (const [kind, child] of flow.events) {
      if (child.type === 'mdxJsxFlowTag') {
        if (kind === 'enter') { closing = false; selfClosing = false; }
        else depth += closing ? -1 : selfClosing ? 0 : 1;
      } else if (child.type === 'mdxJsxFlowTagClosingMarker') closing = true;
      else if (child.type === 'mdxJsxFlowTagSelfClosingMarker') selfClosing = true;
    }
  }
  return depth !== 0;
}

/** Definitions are block grammar. Discover them globally before resolving any
 * inline reference, while discarding completed token workspaces along the way.
 * A cut requires the actual flow tokenizer to finish a blank line, and every
 * document container to be closed. Blank lines inside fences, directives,
 * lists, quotes, HTML or footnotes therefore cannot split their constructs. */
function splitState(document: TokenizeContext): 'skip' | 'open' | 'closed' {
  // Nested directives create their own flow contexts on the same parser. The
  // root document's latest chunk identifies its active flow precisely.
  let flow: TokenizeContext | undefined;
  for (let index = document.events.length - 1; index >= 0; index--) {
    const token = document.events[index][1];
    if (token.type === 'chunkFlow') { flow = token._tokenizer; break; }
  }
  if (flow?.currentConstruct || flow?.events.at(-1)?.[1].type !== 'lineEndingBlank') return 'skip';
  let open = 0;
  for (const event of document.events) {
    if (event[1]._container) open += event[0] === 'enter' ? 1 : -1;
  }
  return open !== 0 || hasOpenJsx(document) ? 'open' : 'closed';
}

function discover(source: string, options: Options | undefined, target: number, onProgress?: (offset: number) => void) {
  const definitions: DefinitionState = { defined: [], footnotes: [] };
  const windows: Window[] = [];
  let from: Point = { line: 1, column: 1, offset: 0 };
  let start = 0;
  const make = () => parserWithDefinitions(options, definitions).document(from);
  let document = make();
  let nextCheck = target;
  const retry = Math.max(1, Math.min(4096, Math.floor(target / 16)));
  const bom = source.charCodeAt(0) === 0xfeff ? 1 : 0;
  for (const line of lines(source)) {
    document.write(line);
    const eof = line.at(-1) === null;
    const end = Math.min(source.length, document.now().offset + bom);
    if (eof) {
      windows.push({ start, end: source.length, from });
      onProgress?.(Math.floor(source.length / 2));
      break;
    }
    if (end < nextCheck) continue;
    const state = splitState(document);
    if (state === 'skip') continue;
    if (state === 'open') {
      // Retry nearby for ordinary short wrappers. For a giant indivisible
      // container, geometrically space full guard scans so their total work
      // stays linear instead of rescanning a growing graph on every blank.
      nextCheck = end - start < target * 2 ? end + retry : start + (end - start) * 2;
      continue;
    }
    const next = point(document);
    document.write([null]);
    windows.push({ start, end, from });
    onProgress?.(Math.floor(end / 2));
    from = next;
    start = end;
    nextCheck = start + target;
    document = make();
  }
  return { definitions, windows };
}

/** Same mdast contract as upstream, with bounded temporary token graphs for
 * opted-in built-in grammars. The final AST and source still scale with input;
 * the largest indivisible root block remains the workspace lower bound. */
export function fromMarkdownBounded(source: string, options?: Options, tuning: BoundedMarkdownOptions = {}): Root {
  const target = Math.max(1, tuning.targetSize ?? DEFAULT_TARGET);
  if (!tuning.enabled || source.length < target) {
    const tree = fromMarkdown(source, options);
    tuning.onProgress?.(source.length);
    return tree;
  }
  // Whole-document postprocessing can discover a later inline syntax error
  // before compilation sees an earlier mismatched JSX tag. On malformed input
  // retry upstream after this function has unwound and released its token/AST
  // locals, preserving upstream diagnostic precedence. Caller progress errors
  // are propagated directly rather than being mistaken for malformed syntax.
  let progressFailure: { error: unknown } | undefined;
  const progress = tuning.onProgress && ((offset: number) => {
    try { tuning.onProgress!(offset); }
    catch (error) { progressFailure = { error }; throw error; }
  });
  try { return parseInWindows(source, options, target, progress); }
  catch {
    if (progressFailure) throw progressFailure.error;
    const tree = fromMarkdown(source, options);
    tuning.onProgress?.(source.length);
    return tree;
  }
}

function compileWindow(input: Generator<Chunk[]>, window: Window, options: Options | undefined, definitions: DefinitionState, bom: number, compile: ReturnType<typeof createMarkdownCompiler>) {
  const document = parserWithDefinitions(options, definitions).document(window.from);
  while (true) {
    const line = input.next().value!;
    document.write(line);
    if (line.at(-1) === null) break;
    if (document.now().offset + bom >= window.end) {
      document.write([null]);
      break;
    }
  }
  const events = document.events;
  return { tree: compile.compile(postprocess(events)), hasEvents: events.length > 0 };
}

function parseInWindows(source: string, options: Options | undefined, target: number, onProgress?: (offset: number) => void): Root {
  const { definitions, windows } = discover(source, options, target, onProgress);
  const compile = createMarkdownCompiler(options, true);
  let root: Root | undefined;
  const input = lines(source);
  const bom = source.charCodeAt(0) === 0xfeff ? 1 : 0;
  const definedCount = definitions.defined.length;
  const footnoteCount = definitions.footnotes.length;
  for (let index = 0; index < windows.length; index++) {
    const window = windows[index];
    const { tree: part, hasEvents } = compileWindow(input, window, options, definitions, bom, compile);
    if (!root) root = part;
    else {
      for (const child of part.children) root.children.push(child);
      if (hasEvents) root.position!.end = part.position!.end;
    }
    definitions.defined.length = definedCount;
    definitions.footnotes.length = footnoteCount;
    onProgress?.(Math.floor(source.length / 2) + Math.ceil(window.end / 2));
  }
  return compile.transform(root!);
}
