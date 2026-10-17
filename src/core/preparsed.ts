import type { MarkdownNode, ParseContext, SyntaxExtension } from './types';

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
