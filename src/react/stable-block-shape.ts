// Verbatim complete-shape helper from the recorded private layer-1 source.
import type { MarkdownNode } from '../core';

const scalarFields = ['type', 'name', 'value', 'inline', 'selection', 'url', 'title', 'alt', 'lang', 'meta', 'depth', 'ordered', 'start', 'spread', 'checked', 'verbatimEscapes'] as const;
const shapeFields = new Set<string>([...scalarFields, 'position', 'children', 'attributes', 'attributeNodes', 'sourceOmissions', 'align', 'incomplete']);
export function completeNodeStateShape(node: MarkdownNode, workLimit = Infinity): string | undefined {
  const active = new Set<MarkdownNode>(); let work = 0;
  const spend = (amount: number) => { work += amount; if (work > workLimit) throw new Error('Changed or oversized state owner'); };
  const data = (object: object, key: string): unknown => {
    const property = Object.getOwnPropertyDescriptor(object, key);
    if (property && !('value' in property)) throw new Error('Accessor state owner');
    return property?.value;
  };
  const scalar = (value: unknown): unknown => {
    if (value === undefined || value === null) { spend(1); return value === undefined ? ['absent'] : null; }
    if (!['string', 'number', 'boolean'].includes(typeof value)) throw new Error('Non-scalar state owner');
    spend(typeof value === 'string' ? value.length + 1 : 1); return value;
  };
  const plain = (value: object) => { if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new Error('Non-data state owner'); };
  const point = (value: unknown): unknown => {
    if (!value || typeof value !== 'object') throw new Error('Missing source point'); plain(value);
    return ['offset', 'line', 'column'].map(key => scalar(data(value, key)));
  };
  const visit = (current: MarkdownNode): unknown => {
    if (!current || typeof current !== 'object') throw new Error('Missing state owner'); plain(current); spend(1);
    if (data(current, 'incomplete') || active.has(current)) throw new Error('Incomplete state owner');
    if (['linkReference', 'imageReference', 'footnoteReference', 'definition', 'footnoteDefinition'].includes(current.type)) throw new Error('Document-resolved state owner');
    const keys = Reflect.ownKeys(current); spend(keys.length);
    if (keys.some(key => typeof key !== 'string' || !shapeFields.has(key))) throw new Error('Unknown state owner field');
    active.add(current);
    const attributes = data(current, 'attributes') as MarkdownNode['attributes'];
    let pairs: unknown = null;
    if (attributes) {
      plain(attributes); const names = Object.keys(attributes); spend(names.length);
      pairs = names.sort().map(key => { spend(key.length); return [key, scalar(data(attributes, key))]; });
    }
    const position = data(current, 'position') as MarkdownNode['position'];
    const children = data(current, 'children') as MarkdownNode[] | undefined;
    if (children && !Array.isArray(children)) throw new Error('Non-array children');
    spend(children?.length ?? 0);
    const align = data(current, 'align') as unknown[] | undefined;
    if (align && !Array.isArray(align)) throw new Error('Non-array alignment');
    spend(align?.length ?? 0);
    const omissions = data(current, 'sourceOmissions') as MarkdownNode['sourceOmissions'];
    if (omissions && !Array.isArray(omissions)) throw new Error('Non-array omissions');
    spend(omissions?.length ?? 0);
    const attributeNodes = data(current, 'attributeNodes') as MarkdownNode['attributeNodes'];
    if (attributeNodes) plain(attributeNodes);
    const attributeNames = Object.keys(attributeNodes ?? {}); spend(attributeNames.length);
    const result = [scalarFields.map(key => scalar(data(current, key))), pairs,
      position ? [point(position.start), point(position.end)] : null,
      align?.map(scalar) ?? null, omissions?.map(range => [scalar(range.start), scalar(range.end)]) ?? null,
      attributeNames.sort().map(key => { spend(key.length); return [key, visit(data(attributeNodes!, key) as MarkdownNode)]; }),
      children?.map(visit) ?? null];
    active.delete(current); return result;
  };
  try { return JSON.stringify(visit(node)); } catch { return undefined; }
}

