import type { Block, MarkdownNode } from '../core';
import type { ReaderRuntime } from './runtime';
import { resolveVirtualizedRenderer } from './windowed-copy';

/** Candidate names only narrow the scan; the existing renderer resolver still
 * decides conditional overrides, reader-local components and final ownership. */
export function windowedKeepAliveBlocks(runtime: ReaderRuntime, blocks: readonly Block[]): Set<number> {
  const candidates = new Set<string>();
  for (const [name, rules] of runtime.rendererOverrides) {
    if (rules.some(rule => rule.virtualization?.keepAlive)) candidates.add(name);
  }
  for (const extension of runtime.configuration.get().extensions ?? []) {
    for (const name of Object.keys(extension.components ?? {})) {
      if (extension.components?.[name] && extension.virtualization?.[name]?.keepAlive) candidates.add(name);
    }
  }
  const leases = new Set<number>();
  if (!candidates.size) return leases;
  const ancestors: MarkdownNode[] = [];
  const visit = (node: MarkdownNode, pending: boolean): boolean => {
    const name = node.type === 'component' ? node.name ?? '' : node.type;
    // Predicates may retain the readonly path. Never expose the mutable traversal
    // stack, even when an earlier override ultimately rejects this candidate.
    if (candidates.has(name) && resolveVirtualizedRenderer(runtime, node, ancestors.slice(), pending)?.keepAlive) return true;
    if (!node.children?.length) return false;
    ancestors.push(node);
    let keep = false;
    for (const child of node.children) if (visit(child, pending)) { keep = true; break; }
    ancestors.pop();
    return keep;
  };
  blocks.forEach((block, index) => { if (visit(block.node, block.pending)) leases.add(index); });
  return leases;
}
