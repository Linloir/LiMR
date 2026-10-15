import { gfm as syntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { tableLocalSyntax } from '../core/incremental-table';
import { sourceAwareAutolinks } from '../core/source-syntax';
import type { RendererExtension } from '../react/types';

interface CandidateNode { type: string; value?: unknown; children?: readonly CandidateNode[] }
const autolinkCandidate = /https?:\/\/|www\.|@/i;
function hasAutolinkCandidate(node: CandidateNode): boolean {
  // Match the upstream transform's ignored ancestors and inspect decoded text,
  // so entities and escapes can still introduce a URL or email address.
  if (node.type === 'link' || node.type === 'linkReference') return false;
  if (node.type === 'text') return typeof node.value === 'string' && autolinkCandidate.test(node.value);
  return node.children?.some(hasAutolinkCandidate) ?? false;
}

export function gfm(): RendererExtension {
  const mdast = gfmFromMarkdown().map(extension => {
    if (!extension.enter?.literalAutolink || !extension.transforms?.length) return tableLocalSyntax(extension);
    // findAndReplace traverses every ancestor path twice, even when a tree has
    // no literal URL/email candidates. Keep its original semantics when needed.
    return tableLocalSyntax({ ...extension, transforms: extension.transforms.map(transform => (tree: Parameters<typeof transform>[0]) => hasAutolinkCandidate(tree) ? transform(tree) : undefined) });
  });
  return { name: 'gfm', directives: ['gfm'], micromark: [tableLocalSyntax(sourceAwareAutolinks(syntax()))], mdast, scope: 'local', components: { gfm: ({ children }) => children } };
}
