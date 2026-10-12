import { mapText, rangeOf, type MarkdownNode } from '../core';
import type { NodeRenderer } from './types';
import type { ReaderRuntime, SourceBinding } from './runtime';

const atomic = new Set(['inlineCode', 'code', 'math', 'inlineMath', 'image', 'imageReference', 'html']);
const hidden = new Set(['definition', 'footnoteDefinition', 'annotationDefinition', 'footnoteReference']);
const ordinary = new Set(['text', 'paragraph', 'heading', 'strong', 'emphasis', 'delete', 'blockquote', 'list', 'listItem', 'link', 'linkReference', 'table', 'tableRow', 'tableCell', 'thematicBreak', 'break', 'annotationReference']);

/** Native text nodes suffice for ordinary Markdown. Custom layouts keep explicit
 * wrappers so reordered/conditional children retain independent source bindings. */
export function compactTextNodes(node: MarkdownNode, components: Readonly<Record<string, NodeRenderer>>): readonly MarkdownNode[] | null {
  const texts: MarkdownNode[] = [];
  let supported = true;
  const visit = (node: MarkdownNode) => {
    if (node.selection === 'atomic' || atomic.has(node.type) || hidden.has(node.type)) return;
    if (!ordinary.has(node.type) || components[node.type]) { supported = false; return; }
    if (node.type === 'text') { if (node.value) texts.push(node); return; }
    node.children?.forEach(visit);
  };
  visit(node);
  return supported ? texts : null;
}

function bindingFor(node: MarkdownNode, source: string): SourceBinding {
  const range = rangeOf(node), value = node.value ?? '';
  // Retain only this node's raw slice, never the history of streaming prefixes.
  const raw = source.slice(range.start, range.end);
  const direct = raw === value;
  let mapping: ReturnType<typeof mapText> | undefined;
  const mapped = () => mapping ??= mapText(raw, value, { start: 0, end: raw.length });
  return {
    range, atomic: false,
    get exact() { return direct || mapped().exact; },
    resolve(offset, edge) {
      const at = Math.max(0, Math.min(value.length, offset));
      return direct ? range.start + at : range.start + (edge === 'start' ? mapped().starts[at] ?? raw.length : mapped().ends[at - 1] ?? 0);
    },
  };
}

/** Attach metadata only: React continues to own all text and element mutations. */
export function bindCompactText(element: HTMLElement, nodes: readonly MarkdownNode[], runtime: ReaderRuntime): () => void {
  const bound: Node[] = [];
  const clear = () => bound.forEach(node => runtime.bindings.delete(node));
  const bindings = nodes.map(node => bindingFor(node, runtime.document.getSnapshot().source));
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        return element.hasAttribute('data-limr-ignore') || element.hasAttribute('data-limr-text') || runtime.bindings.get(element)?.atomic ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let index = 0, inValue = 0;
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    const value = text.textContent ?? '';
    if (!value) continue;
    const parts: { start: number; end: number; offset: number; binding: SourceBinding }[] = [];
    for (let at = 0; at < value.length;) {
      const expected = nodes[index]?.value ?? '';
      const size = Math.min(value.length - at, expected.length - inValue);
      if (size <= 0 || value.slice(at, at + size) !== expected.slice(inValue, inValue + size)) { clear(); return () => {}; }
      parts.push({ start: at, end: at + size, offset: inValue, binding: bindings[index] });
      at += size; inValue += size;
      if (inValue === expected.length) { index++; inValue = 0; }
    }
    const first = parts[0], last = parts[parts.length - 1];
    runtime.bindings.set(text, parts.length === 1 && first.offset === 0 && value === nodes[index - 1]?.value ? first.binding : {
      range: { start: first.binding.range.start, end: last.binding.range.end }, atomic: false,
      get exact() { return parts.every(part => part.binding.exact); },
      resolve(offset, edge) {
        const part = parts.find(part => edge === 'start' ? part.end > offset : part.end >= offset) ?? last;
        return part.binding.resolve!(part.offset + offset - part.start, edge);
      },
    });
    bound.push(text);
  }
  return clear;
}
