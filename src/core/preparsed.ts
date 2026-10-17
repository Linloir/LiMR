import type { omitSource } from './source-omissions';
import type { MarkdownNode, ParseContext, SourceRange, SyntaxExtension } from './types';

type OmittedSource = Readonly<ReturnType<typeof omitSource>>;
const omittedSources = new WeakMap<ParseContext, { source: string; ranges: Float64Array; omitted: OmittedSource }>();

/** Annotation discovery already removed its candidate markers. Save that exact
 * value and map, without retaining mutable caller ranges or result wrappers. */
export function rememberOmittedSource(context: ParseContext, source: string, ranges: readonly SourceRange[], omitted: OmittedSource): void {
  const intervals = new Float64Array(ranges.length * 2);
  for (let index = 0; index < ranges.length; index++) {
    intervals[index * 2] = ranges[index].start;
    intervals[index * 2 + 1] = ranges[index].end;
  }
  omittedSources.set(context, { source, ranges: intervals, omitted: Object.freeze({ value: omitted.value, original: omitted.original }) });
}

/** Consume only at the full-source parser boundary. Exact ordered intervals
 * matter: equal output text alone does not imply equal source-position maps.
 * Both hits and misses release the cache before replacement text is built. */
export function takeOmittedSource(context: ParseContext, source: string, ranges: readonly SourceRange[]): OmittedSource | undefined {
  const cached = omittedSources.get(context);
  omittedSources.delete(context);
  if (!cached || cached.source !== source || cached.ranges.length !== ranges.length * 2) return;
  for (let index = 0; index < ranges.length; index++) {
    if (cached.ranges[index * 2] !== ranges[index].start || cached.ranges[index * 2 + 1] !== ranges[index].end) return;
  }
  return cached.omitted;
}

// A grammar-aware preprocessor may already have parsed the exact input the
// main parser will see. Transfer that raw tree once, before transforms or
// position remapping. The main parser additionally checks builtin grammar
// identity; arbitrary tokenizer/compiler hooks always retain their calls.
const trees = new WeakMap<ParseContext, { input: string; tree: MarkdownNode; extensions: readonly SyntaxExtension[] }>();
export function rememberPreparsed(context: ParseContext, input: string, tree: MarkdownNode, extensions: readonly SyntaxExtension[]) {
  trees.set(context, { input, tree, extensions });
}
export function takePreparsed(context: ParseContext, input: string, extensions: readonly SyntaxExtension[]): MarkdownNode | undefined {
  const cached = trees.get(context);
  if (cached?.input !== input || cached.extensions !== extensions) return;
  trees.delete(context);
  return cached.tree;
}

/** A discovery tree that cannot be reused must not remain reachable through
 * the live parse context while a replacement tokenizer/tree is allocated. */
export function discardPreparsed(context: ParseContext): void {
  trees.delete(context);
}
