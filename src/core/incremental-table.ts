import { lineStarts, sourcePoint, walk } from './tree';
import type { MarkdownNode } from './types';

interface TableCache { source: string; offset: number; root: MarkdownNode; headerEnd: number }
interface SyntaxObjectSnapshot { object: object; prototype: object | null; properties: readonly (readonly [PropertyKey, PropertyDescriptor])[] }
const localSyntax = new WeakMap<object, readonly SyntaxObjectSnapshot[]>();

/** Internal opt-in for the shipped row-local tokenizers. Arbitrary third-party
 * tokenizer/compile hooks can depend on earlier rows and keep full parsing. */
export function tableLocalSyntax<T extends object>(syntax: T): T {
  const pending = [syntax as object], seen = new WeakSet<object>(), snapshot: SyntaxObjectSnapshot[] = [];
  while (pending.length) {
    const object = pending.pop()!;
    if (seen.has(object)) continue;
    seen.add(object);
    const properties = Reflect.ownKeys(object).map(key => [key, Object.getOwnPropertyDescriptor(object, key)!] as const);
    snapshot.push({ object, prototype: Object.getPrototypeOf(object), properties });
    for (const [, descriptor] of properties) {
      // Functions are compared by identity. Their implementation/private
      // properties are outside the tokenizer/compiler configuration tree.
      if (descriptor.value !== null && typeof descriptor.value === 'object') pending.push(descriptor.value);
    }
  }
  localSyntax.set(syntax, snapshot);
  return syntax;
}
export function hasTableLocalSyntax(syntax: readonly object[]): boolean {
  return syntax.every(extension => localSyntax.get(extension)?.every(({ object, prototype, properties }) => {
    if (Object.getPrototypeOf(object) !== prototype) return false;
    const keys = Reflect.ownKeys(object);
    if (keys.length !== properties.length) return false;
    return properties.every(([key, saved], index) => {
      if (keys[index] !== key) return false;
      const current = Object.getOwnPropertyDescriptor(object, key)!;
      return Object.is(current.value, saved.value) && current.get === saved.get && current.set === saved.set
        && current.writable === saved.writable && current.enumerable === saved.enumerable && current.configurable === saved.configurable;
    });
  }) ?? false);
}

function cloneRawNode(node: MarkdownNode): MarkdownNode {
  const copy = { ...node };
  // The common mdast shape consists of primitives, child nodes and positions.
  // Avoid serializing this entire tree through structuredClone on every chunk;
  // uncommon extension metadata still receives an independent deep copy.
  for (const key of Object.keys(copy)) {
    const value = copy[key];
    if (key === 'children') copy.children = node.children?.map(cloneRawNode);
    else if (key === 'position' && node.position) copy.position = { start: { ...node.position.start }, end: { ...node.position.end } };
    else if (value !== null && (typeof value === 'object' || typeof value === 'function' || typeof value === 'symbol')) copy[key] = structuredClone(value);
  }
  return copy;
}

/** GFM cells cannot continue across physical rows. Keep the raw, untransformed
 * prefix and reparse the last row with the original header as its environment.
 * Definitions, components and table termination use the complete parser again.
 * Transforms still receive the complete tree, with independent mutable nodes. */
export function incrementalTable() {
  let cached: TableCache | undefined;
  return (source: string, offset: number, streaming: boolean, eligible: boolean, parse: (source: string) => MarkdownNode): MarkdownNode => {
    const previous = cached;
    cached = undefined;
    let root: MarkdownNode | undefined;
    if (eligible && previous?.offset === offset && source.startsWith(previous.source)) {
      const table = previous.root.children![0];
      const tailStart = table.children!.at(-1)!.position!.start.offset;
      const suffix = parse(source.slice(0, previous.headerEnd) + source.slice(tailStart));
      const tail = suffix.children?.length === 1 && suffix.children[0];
      if (tail && tail.type === 'table' && tail.children?.length && JSON.stringify(tail.align) === JSON.stringify(table.align)) {
        const lines = lineStarts(source), shift = tailStart - previous.headerEnd;
        walk(suffix, node => {
          if (!node.position) return;
          const map = (at: number) => at >= previous.headerEnd ? at + shift : at;
          node.position = { start: sourcePoint(map(node.position.start.offset), lines), end: sourcePoint(map(node.position.end.offset), lines) };
        });
        tail.children = [...table.children!.slice(0, -1), ...tail.children.slice(1)];
        root = suffix;
      }
    }
    root ??= parse(source);
    const table = eligible && streaming && root.children?.length === 1 && root.children[0];
    if (table && table.type === 'table' && table.position?.start.offset === 0 && (table.children?.length ?? 0) > 1) {
      const starts = lineStarts(source), headerEnd = starts[2];
      if (headerEnd !== undefined) {
        // Third-party mdast extensions may attach non-cloneable values. In that
        // case retain ordinary parsing instead of narrowing their contract.
        try { cached = { source, offset, headerEnd, root: cloneRawNode(root) }; } catch { /* no reusable raw tree */ }
      }
    }
    return root;
  };
}
