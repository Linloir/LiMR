import { walk } from './tree';
import type { DocumentProgress, MarkdownNode } from './types';

/** A deliberately conservative prose subset: no concrete/container blocks or
 * document-wide reference syntax. Blank lines are boundaries only after this
 * whole-source proof; arbitrary Markdown is never split on blank lines. */
export function isIndependentProse(source: string): boolean {
  if (source.charCodeAt(0) === 0xfeff) source = source.slice(1);
  return !/[<`~$|]|\]:|:[a-zA-Z]|::%%|\\/.test(source)
    && !/^(?:[ \t]+[^ \t\r\n]| {0,3}(?:>|[-+*](?:[ \t]|$)|\d{1,9}[.)](?:[ \t]|$)|[=-]+[ \t]*$))/m.test(source);
}

/** Bound the tokenizer event workspace only at proven top-level boundaries.
 * The caller must exclude foreign syntax/compiler hooks, prepared source and
 * active component syntax. Definitions and concrete blocks need full parsing.
 * This stays internal; smaller limits let tests exercise boundaries directly. */
export function parseInBatches(source: string, eligible: boolean, parse: (source: string) => MarkdownNode,
  { minimum = 64 * 1024, target = 32 * 1024, onProgress }: { minimum?: number; target?: number; onProgress?: (progress: DocumentProgress) => void } = {}): MarkdownNode {
  if (!eligible || source.length < minimum || /\]:|<|\$\$|`{3}|~{3}/.test(source)) return parse(source);
  const boundaries = [{ offset: 0, line: 0 }];
  const prose = isIndependentProse(source);
  if (source.charCodeAt(0) === 0xfeff && !prose) return parse(source);
  let blank = false, line = 0;
  for (const match of source.matchAll(/[^\r\n]*(?:\r\n|\r|\n|$)/g)) {
    if (!match[0]) break;
    const body = match[0].replace(/(?:\r\n|\r|\n)$/, '');
    // With concrete blocks/definitions globally excluded, a column-zero ASCII
    // letter or ATX heading after a complete blank line starts a root leaf.
    // Keep all separators on the left for container spread and EOF positions.
    if (blank && (prose && !!body.trim() || /^[A-Za-z]/.test(body) || /^#{1,6}(?:[ \t]|$)/.test(body)) && match.index! - boundaries.at(-1)!.offset >= target) {
      boundaries.push({ offset: match.index!, line });
    }
    blank = /^[ \t]*$/.test(body);
    line++;
  }
  if (boundaries.length === 1) return parse(source);
  let root: MarkdownNode | undefined;
  for (let index = 0; index < boundaries.length; index++) {
    const { offset, line } = boundaries[index];
    // Keep all separators on the left. Trimming would change list spread,
    // EOF handling and positions of the last block in each batch.
    const until = boundaries[index + 1]?.offset ?? source.length;
    const tree = parse(source.slice(offset, until));
    onProgress?.({ phase: 'parse', loaded: until, total: source.length });
    if (offset) walk(tree, node => {
      if (node.position) node.position = {
        start: { ...node.position.start, offset: node.position.start.offset + offset, line: node.position.start.line + line },
        end: { ...node.position.end, offset: node.position.end.offset + offset, line: node.position.end.line + line },
      };
    });
    if (!root) root = tree;
    else {
      for (const child of tree.children ?? []) (root.children ??= []).push(child);
      // Match upstream root positions, including BOM/blank/EOF conventions.
      if (root.position && tree.position) root.position.end = tree.position.end;
    }
  }
  return root!;
}
