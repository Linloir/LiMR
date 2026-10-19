import type { Extension } from 'mdast-util-from-markdown';
import { lineStarts } from './tree';

interface MarkdownSource { value: string; lines: () => readonly number[] }
const sources = new WeakMap<object, MarkdownSource>();

/** Per-tree compiler input, before LiMR restores BOM/fragment/omission offsets.
 * A WeakMap keeps concurrent and nested parses independent, without exposing
 * source metadata to compiler hooks or retaining it on the public AST. */
export function markdownSource(source: string): Extension {
  const value = source.charCodeAt(0) === 0xfeff ? source.slice(1) : source;
  let lines: readonly number[] | undefined;
  return { transforms: [tree => { sources.set(tree, { value, lines: () => lines ??= lineStarts(value) }); }] };
}

export const sourceForMarkdownTree = (tree: object) => sources.get(tree);
export const forgetMarkdownSource = (tree: object) => { sources.delete(tree); };
