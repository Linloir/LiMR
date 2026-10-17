import { createContext } from 'react';
import type { DocumentEngine, DocumentSnapshot, MarkdownNode } from '../core';
import type { ReaderRuntime, Store } from './runtime';
import type { NodeRenderer } from './types';

/** Private to view modules. Calling an owned hook is the declaration: arbitrary
 * useNodeState keys and custom renderer objects acquire no transfer permission. */
export interface NodeStateSignature { readonly key: string; readonly work: number }
export interface NodeStateOwner {
  readonly name: string;
  readonly nativeTypes?: readonly string[];
  readonly keys: Readonly<Record<string, (value: unknown) => boolean>>;
  /** Module-owned meaning of this exact, complete source owner. Undefined
   * refuses migration; never serialize arbitrary plugin state or resources. */
  signature(node: MarkdownNode, workLimit?: number): string | NodeStateSignature | undefined;
}
interface Identity { range: string; start: number; end: number; type: string; name?: string; key: string; source: string; signature: string; proofWork: number; lookupWork: number }
interface Saved { identity: Identity; stores: Map<string, Store<unknown>> }
interface Registry {
  collect: boolean;
  owned: Map<NodeStateOwner, Map<string, Saved>>;
  borrowed: Map<Store<unknown>, unknown>;
  identities: WeakMap<MarkdownNode, Map<NodeStateOwner, Identity | undefined>>;
}
const registries = new WeakMap<ReaderRuntime, Registry>();
export const NodeStateHandoffContext = createContext<{ target: DocumentEngine | undefined; previous: ReaderRuntime | null; collect: boolean } | null>(null);
function registry(runtime: ReaderRuntime): Registry {
  let value = registries.get(runtime);
  if (!value) { value = { collect: false, owned: new Map(), borrowed: new Map(), identities: new WeakMap() }; registries.set(runtime, value); }
  return value;
}

const rendererOwners = new WeakMap<NodeRenderer, NodeStateOwner>();
/** A factory declares only its own default renderer, not a caller replacement. */
export function declareNodeStateRenderer(owner: NodeStateOwner, renderer: NodeRenderer): void { rendererOwners.set(renderer, owner); }
function declaredOwner(runtime: ReaderRuntime, owner: NodeStateOwner, node: MarkdownNode): boolean {
  const name = node.type === 'component' ? node.name ?? '' : node.type;
  // A conditional/custom owner can change after full-document resolution. It
  // needs a separate explicit contract, even when its config identity is equal.
  if (runtime.rendererOverrides.get(name)?.length) return false;
  const renderer = runtime.components[name];
  return renderer ? rendererOwners.get(renderer) === owner : !!owner.nativeTypes?.includes(name);
}
export function collectNodeState(runtime: ReaderRuntime): void { registry(runtime).collect = true; }

/** The built-in modules explicitly admit these interpreted scalar fields.
 * Unknown fields/accessors and global-reference nodes refuse handoff instead
 * of pretending equal raw text proves equal rendered meaning. Modules with
 * document-resolved references need their own snapshot-aware contract later. */
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

function describe(runtime: ReaderRuntime, owner: NodeStateOwner, node: MarkdownNode, proofLimit?: number, lookupLimit?: number): Identity | undefined {
  const state = registry(runtime), cached = state.identities.get(node);
  if (cached?.has(owner)) return cached.get(owner);
  const identities = cached ?? new Map<NodeStateOwner, Identity | undefined>();
  if (!cached) state.identities.set(node, identities);
  const snapshot = runtime.document.getSnapshot(), position = node.position;
  let result: Identity | undefined;
  if (position && Number.isSafeInteger(position.start.offset) && Number.isSafeInteger(position.end.offset) &&
      position.start.offset >= 0 && position.end.offset > position.start.offset && position.end.offset <= snapshot.source.length) {
    const proof = owner.signature(node, proofLimit);
    const signature = typeof proof === 'string' ? proof : proof?.key;
    const proofWork = typeof proof === 'string' ? proof.length : proof?.work;
    if (signature !== undefined && proofWork !== undefined && Number.isSafeInteger(proofWork) && proofWork >= 0) {
      const found = findSourceOwner(snapshot, position.start.offset, position.end.offset, node.type, node.name, lookupLimit);
      if (found?.node === node) result = {
        range: `${position.start.offset}:${position.end.offset}`, start: position.start.offset, end: position.end.offset, type: node.type, name: node.name, signature, proofWork, lookupWork: found.work,
        key: JSON.stringify([position.start.offset, position.end.offset, signature]),
        source: snapshot.source.slice(position.start.offset, position.end.offset),
      };
    }
  }
  identities.set(owner, result); return result;
}
/** Verify the source owner, including duplicate transformed nodes. Descend only
 * into source-containing branches of the matching top-level block, never scan
 * every final-document node to find a short prefix's interactive state. */
const checkedBlockOrder = new WeakMap<DocumentSnapshot, boolean>();
/** Binary source lookup is permitted only after this metadata-only proof.
 * Touching zero-length blocks are allowed: they cannot own a positive range.
 * Do not sort or inspect children of an extension-produced ambiguous snapshot. */
function orderedSourceBlocks(snapshot: DocumentSnapshot): boolean {
  const known = checkedBlockOrder.get(snapshot); if (known !== undefined) return known;
  let end = 0, valid = true;
  for (const block of snapshot.blocks) {
    const range = block.range;
    if (!Number.isSafeInteger(range.start) || !Number.isSafeInteger(range.end) || range.start < end || range.end < range.start || range.end > snapshot.source.length) { valid = false; break; }
    end = range.end;
  }
  checkedBlockOrder.set(snapshot, valid); return valid;
}

function findSourceOwner(snapshot: DocumentSnapshot, start: number, end: number, type: string, name?: string, workLimit = Infinity): { node: MarkdownNode; work: number } | undefined {
  if (!orderedSourceBlocks(snapshot)) return;
  let low = 0, high = snapshot.blocks.length;
  while (low < high) { const middle = (low + high) >>> 1; if (snapshot.blocks[middle].range.end < end) low = middle + 1; else high = middle; }
  const block = snapshot.blocks[low];
  if (!block || block.range.start > start) return;
  let matches = 0, found: MarkdownNode | undefined, repeated = false;
  const visited = new Set<MarkdownNode>(); let work = 0;
  const visit = (node: MarkdownNode) => {
    if (++work > workLimit) { repeated = true; return; }
    const position = node.position;
    if (position && (position.start.offset > start || position.end.offset < end)) return;
    if (visited.has(node)) { repeated = true; return; } visited.add(node);
    if (position?.start.offset === start && position.end.offset === end && node.type === type && node.name === name) {
      matches++; found = node;
    }
    if (work + (node.children?.length ?? 0) > workLimit) { repeated = true; return; }
    node.children?.forEach(visit);
  };
  visit(block.node); return matches === 1 && !repeated && found ? { node: found, work } : undefined;
}

/** Called only while constructing the independent final runtime, under the
 * AsyncReader's same committed session/request/revision transition. Copy the
 * small registry, not its runtime or AST. Borrow the approved Store so a late
 * prefix click before React commits cannot be lost to an early value copy. */
export function inheritNodeState(next: ReaderRuntime, previous: ReaderRuntime): void {
  const before = previous.configuration.get(), after = next.configuration.get();
  if (before.components !== after.components || before.extensions !== after.extensions || before.rendererOverrides !== after.rendererOverrides ||
      previous.document.id !== next.document.id) return;
  const previousRegistry = registries.get(previous); if (!previousRegistry) return;
  const snapshot = next.document.getSnapshot(), borrowed = registry(next).borrowed;
  for (const [owner, entries] of previousRegistry.owned) for (const entry of entries.values()) {
    const old = entry.identity;
    if (snapshot.source.slice(old.start, old.end) !== old.source) continue;
    const found = findSourceOwner(snapshot, old.start, old.end, old.type, old.name, old.lookupWork), node = found?.node;
    if (!node || !declaredOwner(next, owner, node)) continue;
    // Independent old-prefix budgets bound source lookup and semantic proof.
    // A compact identity must not make an unchanged large container ineligible;
    // final-only owners still never request proof and larger changed trees stop.
    const identity = describe(next, owner, node, old.proofWork, old.lookupWork);
    if (!identity || identity.key !== old.key || identity.source !== old.source) continue;
    let stores = next.nodeStates.get(node);
    if (!stores) { stores = new Map(); next.nodeStates.set(node, stores); }
    for (const [key, saved] of entry.stores) if (owner.keys[key]?.(saved.get())) {
      stores.set(key, saved); borrowed.set(saved, saved.get());
    }
  }
}
/** Runs once in the receiving provider's layout commit. A user can click the
 * still-painted prefix after a concurrent full render began: borrowed Stores
 * retain that value, and this invalidates projections computed before it.
 * Built-in declared state updates are synchronous immutable UI values; async
 * resources and arbitrary external setters are not transferable owners. */
export function publishNodeStateHandoff(runtime: ReaderRuntime): void {
  const borrowed = registries.get(runtime)?.borrowed; if (!borrowed?.size) return;
  let changed = false;
  for (const [store, renderedValue] of borrowed) if (!Object.is(store.get(), renderedValue)) changed = true;
  borrowed.clear();
  if (changed) runtime.presentation.set(runtime.presentation.get() + 1);
}

export function registerNodeState(runtime: ReaderRuntime, owner: NodeStateOwner, node: MarkdownNode, key: string, store: Store<unknown>): void {
  if (!owner.keys[key] || !registries.get(runtime)?.collect || !declaredOwner(runtime, owner, node)) return;
  const identity = describe(runtime, owner, node); if (!identity) return;
  const state = registry(runtime); let entries = state.owned.get(owner);
  if (!entries) { entries = new Map(); state.owned.set(owner, entries); }
  let entry = entries.get(identity.range);
  if (!entry) { entry = { identity, stores: new Map() }; entries.set(identity.range, entry); }
  entry.stores.set(key, store);
}
