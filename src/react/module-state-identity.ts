import type { MarkdownNode } from '../core';
import type { NodeStateSignature } from './node-state-handoff';

/** Private identity descriptions used only by the declaring built-in modules.
 * The handoff registry separately proves exact owner raw source, unique range,
 * same request/revision and actual default renderer. These descriptions identify
 * the user's choice, not all content that choice may reveal after resolution. */
function describe(node: MarkdownNode, workLimit: number, project: (read: Reader) => unknown): NodeStateSignature | undefined {
  try { const read = new Reader(node, workLimit), key = JSON.stringify(project(read)); return { key, work: read.used }; } catch { return undefined; }
}
class Reader {
  private work = 0;
  get used() { return this.work; }
  constructor(readonly node: MarkdownNode, private readonly limit: number) {}
  spend(amount = 1) { if ((this.work += amount) > this.limit) throw new Error('Changed or oversized choice owner'); }
  field(value: unknown, key: string): unknown {
    this.spend();
    if (!value || typeof value !== 'object' || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) throw new Error('Not an ordinary owner');
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (descriptor && !('value' in descriptor)) throw new Error('Accessor owner');
    return descriptor?.value;
  }
  scalar(value: unknown): unknown {
    if (value === undefined) return ['absent'];
    if (value !== null && !['string', 'number', 'boolean'].includes(typeof value)) throw new Error('Non-scalar owner attribute');
    this.spend(typeof value === 'string' ? value.length : 1); return value;
  }
  attribute(node: MarkdownNode, name: string) { const attributes = this.field(node, 'attributes'); return this.scalar(attributes ? this.field(attributes, name) : undefined); }
  boundary(node: MarkdownNode, parent?: readonly unknown[]): readonly unknown[] {
    if (this.field(node, 'incomplete')) throw new Error('Incomplete owner');
    const position = this.field(node, 'position'), start = this.field(this.field(position, 'start'), 'offset'), end = this.field(this.field(position, 'end'), 'offset');
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || (start as number) < 0 || (end as number) < (start as number)) throw new Error('Invalid owner range');
    if (parent && ((start as number) < (parent[2] as number) || (end as number) > (parent[3] as number))) throw new Error('Noncontained owner range');
    return [this.scalar(this.field(node, 'type')), this.scalar(this.field(node, 'name')), start, end];
  }
  children(node: MarkdownNode): MarkdownNode[] {
    const value = this.field(node, 'children'); if (value === undefined) return [];
    if (!Array.isArray(value)) throw new Error('Non-array children'); this.spend(value.length);
    // Read own values only. A hidden accessor must not run during permission proof.
    return Array.from({ length: value.length }, (_, index) => {
      const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
      if (!descriptor || !('value' in descriptor)) throw new Error('Non-data child');
      return descriptor.value as MarkdownNode;
    });
  }
}

export function translationStateIdentity(node: MarkdownNode, workLimit = Infinity): NodeStateSignature | undefined {
  return describe(node, workLimit, read => {
    const outer = read.boundary(node);
    if (outer[0] !== 'component' || outer[1] !== 'translations') throw new Error('Wrong module owner');
    const roles = new Map<string, readonly unknown[]>(), visited = new Set<MarkdownNode>();
    const visit = (parent: MarkdownNode) => {
      if (visited.has(parent)) throw new Error('Repeated paragraph wrapper'); visited.add(parent);
      for (const child of read.children(parent)) {
        const name = read.field(child, 'name'), type = read.field(child, 'type');
        if (name === 'origin' || name === 'translation') {
          if (type !== 'component' || roles.has(name)) throw new Error('Ambiguous role');
          roles.set(name, read.boundary(child, outer));
        } else if (type === 'paragraph') { read.boundary(child, outer); visit(child); }
      }
    };
    visit(node);
    if (roles.size !== 2) throw new Error('Missing complete pair');
    // Descendant links/annotations can resolve later without changing the choice
    // between these exact complete source regions.
    return [outer, read.attribute(node, 'default'), roles.get('origin'), roles.get('translation')];
  });
}

export function calloutStateIdentity(node: MarkdownNode, workLimit = Infinity): NodeStateSignature | undefined {
  return describe(node, workLimit, read => {
    const outer = read.boundary(node);
    if (outer[0] !== 'callout' && !(outer[0] === 'component' && outer[1] === 'callout')) throw new Error('Wrong module owner');
    return [outer, read.attribute(node, 'fold'), read.attribute(node, 'type')];
  });
}

export function tableStateIdentity(node: MarkdownNode, workLimit = Infinity): NodeStateSignature | undefined {
  return describe(node, workLimit, read => {
    const outer = read.boundary(node); if (outer[0] !== 'table') throw new Error('Wrong module owner');
    return [outer, read.children(node).map((row, rowIndex) => {
      const rowRange = read.boundary(row, outer); if (rowRange[0] !== 'tableRow') throw new Error('Changed row role');
      return [rowIndex, rowRange, read.children(row).map((cell, column) => {
        const cellRange = read.boundary(cell, rowRange); if (cellRange[0] !== 'tableCell') throw new Error('Changed cell role');
        // Parent raw equality plus this exact cell interval proves cell bytes.
        // Resolved inline descendants and alignment do not invalidate expansion.
        return [column, cellRange];
      })];
    })];
  });
}
