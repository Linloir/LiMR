import { gfm as syntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { tableLocalSyntax } from '../core/incremental-table';
import { sourceAwareAutolinks } from '../core/source-syntax';
import { strongAutolinks } from '../core/strong-autolinks';
import { positionAutolinks } from '../core/autolink-positions';
import type { RendererExtension } from '../react/types';

export function gfm(): RendererExtension {
  const mdast = gfmFromMarkdown().map(extension => {
    if (!extension.enter?.literalAutolink || !extension.transforms?.length) return tableLocalSyntax(extension);
    // findAndReplace traverses every ancestor path twice, even when a tree has
    // no literal URL/email candidates. Keep its original semantics when needed.
    return tableLocalSyntax({ ...extension, transforms: extension.transforms.map(positionAutolinks) });
  });
  return { name: 'gfm', directives: ['gfm'], micromark: [tableLocalSyntax(sourceAwareAutolinks(strongAutolinks(syntax())))], mdast, scope: 'local', components: { gfm: ({ children }) => children } };
}
