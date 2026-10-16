import { omitSource, walk, type MarkdownNode } from '../core';

/** Literal component payloads retain source syntax rather than flattening their
 * Markdown children (which would lose asterisks, backslashes and indentation). */
export function literalDirective(root: MarkdownNode, source: string, name: 'code' | 'math' | 'mermaid', aliases: readonly string[] = [name]) {
  walk(root, node => {
    if (node.type !== 'component' || !aliases.includes(node.name ?? '') || !node.position) return;
    const start = node.position.start.offset, end = node.position.end.offset;
    const raw = source.slice(start, end);
    const header = /^[^\r\n]*(?:\r\n|\r|\n)/.exec(raw);
    const closing = /(?:\r\n|\r|\n)[ \t]*:{2,}[ \t]*$/.exec(raw);
    const from = start + (header?.[0].length ?? raw.length);
    const until = closing ? start + closing.index : end;
    node.type = name;
    node.value = omitSource(source.slice(from, until), node.sourceOmissions ?? [], from).value.replace(/\r\n?/g, '\n').replace(node.incomplete ? /\n$/ : /$^/, '');
    node.valueRange = { start: from, end: until };
    if (name === 'code') node.lang = String(node.attributes?.lang ?? node.attributes?.language ?? 'text');
    node.children = undefined;
  });
}
