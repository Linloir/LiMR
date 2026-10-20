import type { DocumentSnapshot, MarkdownNode } from '../core';
import { standardRendererIsUnchanged } from '../extensions/worker-syntax';
import { isChunkedCodeRenderer } from '../extensions/code';
import type { NodeRenderer, RendererOverride, ViewConfiguration, VirtualizationCapability } from './types';

const native = new Set(['text', 'paragraph', 'heading', 'strong', 'emphasis', 'delete', 'inlineCode', 'code', 'math', 'inlineMath', 'blockquote', 'list', 'listItem', 'link', 'linkReference', 'image', 'imageReference', 'thematicBreak', 'break', 'table', 'tableRow', 'tableCell', 'definition', 'footnoteDefinition', 'footnoteReference', 'annotationDefinition', 'annotationReference', 'html', 'streamPending', 'callout', 'calloutTitle', 'mermaid', 'textDirective', 'leafDirective', 'containerDirective']);
/** A renderer must state its logical copy and lifetime contract before its DOM
 * can disappear. Unknown custom presentation stays on the ordinary renderer. */
export function windowingCapability(snapshot: DocumentSnapshot, config: ViewConfiguration): VirtualizationCapability {
  if (!config.virtualization) return { enabled: false };
  const adapters = new Set<string>();
  const standardNames = new Set<string>();
  const renderers = new Map<string, NodeRenderer>();
  for (const extension of config.extensions ?? []) {
    const known = standardRendererIsUnchanged(extension);
    for (const name of Object.keys(extension.components ?? {})) {
      if (known) standardNames.add(name);
      else if (!extension.virtualization?.[name]) return { enabled: false, reason: `Renderer ${name} needs a virtualization copyText/lifetime contract.` };
    }
    // An adapter belongs to its actual renderer, not any same-named node.
    for (const name of Object.keys(extension.components ?? {})) {
      renderers.set(name, extension.components![name]);
      adapters.delete(name); standardNames.delete(name);
      if (known) standardNames.add(name);
      else if (extension.virtualization?.[name]) adapters.add(name);
    }
  }
  for (const name of Object.keys(config.components ?? {})) return { enabled: false, reason: `Component ${name} needs a virtualization copyText/lifetime contract.` };
  const overrides = new Map<string, RendererOverride[]>();
  for (const override of [...(config.extensions ?? []).flatMap(extension => extension.rendererOverrides ?? []), ...config.rendererOverrides ?? []]) {
    if (!override.virtualization) return { enabled: false, reason: `Renderer override ${override.type} needs a virtualization copyText/lifetime contract.` };
    const rules = overrides.get(override.type) ?? []; rules.push(override); overrides.set(override.type, rules);
  }
  let reason: string | undefined;
  for (const block of snapshot.blocks) {
    let count = 0;
    const visit = (node: MarkdownNode, ancestors: readonly MarkdownNode[]) => {
      if (reason) return;
      const name = node.type === 'component' ? node.name ?? '' : node.type;
      const match = overrides.get(name)?.slice().reverse().find(rule => !rule.when || rule.when(node, { pending: block.pending, incomplete: !!node.incomplete, ancestors }));
      const chunkedCode = node.type === 'code' && !match && isChunkedCodeRenderer(renderers.get(name));
      if (++count > 4096 || !chunkedCode && (node.value?.length ?? 0) > 256 * 1024) { reason = 'A single semantic block exceeds the current DOM window limit; nested block windowing is required.'; return; }
      if (!(match?.virtualization || native.has(node.type) || standardNames.has(name) || adapters.has(name))) { reason = `Node ${name} has no virtualization presentation contract.`; return; }
      const parents = overrides.size ? [...ancestors, node] : ancestors;
      node.children?.forEach(child => visit(child, parents));
    };
    visit(block.node, []); if (reason) break;
  }
  return reason ? { enabled: false, reason } : { enabled: true };
}
