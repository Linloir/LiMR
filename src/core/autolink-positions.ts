import type { Transform } from 'mdast-util-from-markdown';
import { mapText } from './selection';
import { sourceForMarkdownTree } from './markdown-source';
import { rangeOf, sourcePoint, textContent } from './tree';
import type { MarkdownNode } from './types';

const autolinkCandidate = /https?:\/\/|www\.|@/i;

/** GFM's decoded-text fallback replaces text with unpositioned links/text.
 * Retain each original text run before that transform, then map its decoded
 * slices back through escapes/entities. Tokenized links are left untouched.
 * Run while coordinates still address compiler input; the main parser maps
 * every repaired node through BOM, fragment and annotation offsets afterward. */
export function positionAutolinks(transform: Transform): Transform {
  return tree => {
    const source = sourceForMarkdownTree(tree);
    const parents: { node: MarkdownNode; before: MarkdownNode[] }[] = [];
    let possible = false;
    function collect(node: MarkdownNode) {
      if (node.type === 'link' || node.type === 'linkReference') return;
      const children = node.children;
      if (!children) return;
      if (children.some(child => child.type === 'text' && autolinkCandidate.test(child.value ?? ''))) {
        possible = true;
        if (source) parents.push({ node, before: children.slice() });
      }
      children.forEach(collect);
    }
    collect(tree as unknown as MarkdownNode);
    if (!possible) return;
    const result = transform(tree);
    if (!source) return result;
    for (const { node, before } of parents) {
      const after = node.children!, retained = new Set(before);
      let at = 0;
      for (const original of before) {
        if (after[at] === original) { at++; continue; }
        const start = at;
        while (at < after.length && !retained.has(after[at])) at++;
        if (original.type !== 'text' || !original.position || start === at) continue;
        const replacement = after.slice(start, at), value = original.value ?? '';
        // A preceding custom transform may have generated text with no source
        // counterpart. Never invent coordinates for that content.
        if (replacement.map(textContent).join('') !== value) continue;
        const mapping = mapText(source.value, value, rangeOf(original));
        if (!mapping.exact) continue;
        const lines = source.lines();
        let offset = 0;
        function position(node: MarkdownNode) {
          const start = offset;
          if (node.children) node.children.forEach(position);
          else offset += node.value?.length ?? 0;
          if (offset > start && !node.position) node.position = {
            start: sourcePoint(mapping.starts[start], lines),
            end: sourcePoint(mapping.ends[offset - 1], lines),
          };
        }
        replacement.forEach(position);
      }
    }
    return result;
  };
}
