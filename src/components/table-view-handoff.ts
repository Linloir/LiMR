// Private mechanism prototype. No package export and no plugin capability.
// Only Table registers owners; only the complete-block proof issues grants.
import { useMemo, useSyncExternalStore, useLayoutEffect, useEffect } from 'react';
import type { Block, DocumentSnapshot, MarkdownNode } from '../core';
import { Store, type InteractionState, type ReaderRuntime, type ViewAnnotation } from '../react/runtime';
import type { AnnotationType } from '../react/types';
import { sameAsyncAnnotationPolicy } from '../react/async-handoff-policy';

const layoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const stateKey = 'table-expanded-cells';
interface DOMStamp { node: Node; value: string | null; attributes: string | null }
export interface CellContentLease {
  readonly owner: object;
  readonly cell: HTMLTableCellElement;
  readonly original: HTMLElement;
}
export interface CellPreview {
  readonly cell: HTMLTableCellElement;
  readonly content: CellContentLease;
  readonly row: number;
  readonly column: number;
  readonly source: string;
  readonly summary: string;
  readonly expand: () => void;
}
interface TableRecord {
  readonly owner: object;
  readonly node: MarkdownNode;
  readonly table: HTMLTableElement;
  readonly type: AnnotationType<CellPreview>;
  readonly store: Store<unknown>;
  readonly entries: readonly ViewAnnotation[];
}
interface TablePair { before: MarkdownNode; after: MarkdownNode; beforeBlock: Block; afterBlock: Block }
export interface TableViewGrant {
  readonly previous: ReaderRuntime;
  readonly target: ReaderRuntime;
  readonly pairs: readonly TablePair[];
}
const grants = new WeakMap<TableViewGrant, { proofs: ReadonlyMap<CellContentLease, readonly DOMStamp[]>; before: DocumentSnapshot; after: DocumentSnapshot }>();
const registries = new WeakMap<ReaderRuntime, Store<ReadonlyMap<object, TableRecord>>>();
const staged = new WeakMap<ReaderRuntime, { records: Map<object, TableRecord>; claimed: Set<object>; proofs: ReadonlyMap<CellContentLease, readonly DOMStamp[]>; grant: TableViewGrant }>();
const registry = (runtime: ReaderRuntime) => {
  let value = registries.get(runtime);
  if (!value) { value = new Store<ReadonlyMap<object, TableRecord>>(new Map()); registries.set(runtime, value); }
  return value;
};
function stamp(original: HTMLElement): DOMStamp[] {
  const result: DOMStamp[] = [], walk = (node: Node) => {
    const element = node.nodeType === 1 ? node as Element : undefined;
    // Same node identity plus exact current text/attributes. No summary, image
    // URL equality, or block ID substitutes for this source-DOM check.
    result.push({ node, value: node.nodeValue, attributes: element ? JSON.stringify([...element.attributes].map(a => [a.name, a.value])) : null });
    for (const child of node.childNodes) walk(child);
  };
  walk(original); return result;
}
export function cellContentLease(owner: object, cell: HTMLTableCellElement): CellContentLease | undefined {
  const original = cell.querySelector<HTMLElement>('.limr-table-cell-content');
  return original ? { owner, cell, original } : undefined;
}
export function sameCellContent(value: CellContentLease, cell = value.cell): boolean {
  return !!cell?.isConnected && value.cell === cell && cell.querySelector('.limr-table-cell-content') === value.original;
}
function sameDOMProof(value: CellContentLease, proof: readonly DOMStamp[] | undefined): boolean {
  if (!proof || !sameCellContent(value)) return false;
  const current = stamp(value.original);
  return current.length === proof.length && current.every((entry, i) => {
    const old = proof[i]; return entry.node === old.node && entry.value === old.value && entry.attributes === old.attributes;
  });
}
export function recordTableViews(runtime: ReaderRuntime, record: Omit<TableRecord, 'store'>): void {
  const store = runtime.nodeStates.get(record.node)?.get(stateKey); if (!store) return;
  const current = registry(runtime), before = current.get().get(record.owner);
  if (before?.node === record.node && before.table === record.table && before.type === record.type && before.store === store && before.entries === record.entries) return;
  current.set(new Map(current.get()).set(record.owner, { ...record, store }));
}
export function forgetTableViews(runtime: ReaderRuntime, owner: object): void {
  const current = registries.get(runtime); if (!current?.get().has(owner)) return;
  const next = new Map(current.get()); next.delete(owner); current.set(next);
}

/** Called only after the existing bounded complete-block proof succeeded.
 * This deliberately walks only those already-proved prefix subtrees. */
export function tableViewGrant(previous: ReaderRuntime, target: ReaderRuntime, blocks: readonly { before: Block; after: Block }[]): TableViewGrant {
  const pairs: TablePair[] = [];
  for (const block of blocks) {
    const walk = (before: MarkdownNode, after: MarkdownNode) => {
      if (before.type === 'table') pairs.push({ before, after, beforeBlock: block.before, afterBlock: block.after });
      const old = before.children ?? [], next = after.children ?? [];
      // Proof owner promises identical complete shape; still fail closed here.
      if (before.type !== after.type || old.length !== next.length) throw new Error('Broken complete-block grant');
      for (let index = 0; index < old.length; index++) walk(old[index], next[index]);
    };
    walk(block.before.node, block.after.node);
  }
  const proofs = new Map<CellContentLease, readonly DOMStamp[]>();
  for (const record of registries.get(previous)?.get().values() ?? []) if (pairs.some(pair => pair.before === record.node)) {
    for (const entry of record.entries) { const lease = (entry.annotation.data as CellPreview).content; if (sameCellContent(lease)) proofs.set(lease, stamp(lease.original)); }
  }
  const grant = { previous, target, pairs }; grants.set(grant, { proofs, before: previous.document.getSnapshot(), after: target.document.getSnapshot() }); return grant;
}
const configKeys = ['extensions', 'plugins', 'components', 'rendererOverrides', 'parameters', 'annotationTypes', 'annotations', 'appearance', 'theme', 'locale', 'typography', 'justify', 'knuthPlass', 'streamEffect', 'scrollRoot', 'scrollOffset'] as const;
function moduleTypeAllowed(runtime: ReaderRuntime, type: AnnotationType<CellPreview>): boolean {
  const config = runtime.configuration.get();
  return ![...(config.extensions ?? []).flatMap(extension => extension.annotationTypes ?? []), ...config.annotationTypes ?? []].some(item => item.type === type.type);
}
function sameRendererPolicy(previous: ReaderRuntime, target: ReaderRuntime): boolean {
  const before = previous.configuration.get(), after = target.configuration.get();
  return configKeys.every(key => key === 'annotations' ? sameAsyncAnnotationPolicy(previous, target) : Object.is(before[key], after[key]));
}
function hasForeignOccurrence(runtime: ReaderRuntime, block: Block, allowed: ReadonlySet<string>): boolean {
  return runtime.decorations.get().occurrences.some(item => !allowed.has(item.id) && item.range.start <= block.range.end && item.range.end >= block.range.start);
}
function expand(runtime: ReaderRuntime, node: MarkdownNode, store: Store<unknown>, row: number, column: number): void {
  // Require the final module's exact inherited Store and a still-live runtime.
  // Never invoke an old useOwnedNodeState setter captured from the prefix.
  if (runtime.signal.aborted || runtime.nodeStates.get(node)?.get(stateKey) !== store) return;
  const previous = store.get(); if (!(previous instanceof Set)) return;
  store.set(new Set([...previous, `${row}:${column}`]));
  runtime.presentation.set(runtime.presentation.get() + 1);
  runtime.activate(null); runtime.hover(null);
}
function prepare(grant: TableViewGrant, interaction: InteractionState, records: ReadonlyMap<object, TableRecord>): void {
  const { previous, target } = grant;
  const saved = grants.get(grant), proofs = saved?.proofs;
  if (!proofs || saved?.before !== previous.document.getSnapshot() || saved?.after !== target.document.getSnapshot() || previous.signal.aborted || !sameRendererPolicy(previous, target)) { staged.delete(target); target.initializeViewHandoff([], {}, []); return; }
  const next = new Map<object, TableRecord>(), admitted = new Set<string>(), anchors: [string, HTMLElement][] = [];
  const oldIds = new Set([...records.values()].flatMap(record => record.entries.map(entry => entry.occurrence.id)));
  const oldDecorations = previous.decorations.get(), newDecorations = target.decorations.get();
  // Ignore only our own previous staging when a precommit Store change causes
  // another render. Never treat a source/config annotation as a staged entry.
  const previousStage = staged.get(target), stagedIds = new Set([...previousStage?.records.values() ?? []].flatMap(record => record.entries.map(entry => entry.occurrence.id)));
  const stagedAnnotations = new Set([...previousStage?.records.values() ?? []].flatMap(record => record.entries.map(entry => entry.annotation)));
  for (const record of records.values()) {
    const pair = grant.pairs.find(item => item.before === record.node);
    if (!pair || !record.table.isConnected || !moduleTypeAllowed(previous, record.type) || !moduleTypeAllowed(target, record.type) ||
        target.nodeStates.get(pair.after)?.get(stateKey) !== record.store ||
        hasForeignOccurrence(previous, pair.beforeBlock, oldIds) || hasForeignOccurrence(target, pair.afterBlock, stagedIds)) continue;
    const entries: ViewAnnotation[] = [];
    for (const entry of record.entries) {
      const data = entry.annotation.data as CellPreview;
      const cellNode = pair.after.children?.[data.row]?.children?.[data.column];
      const cell = record.table.rows[data.row]?.cells[data.column];
      const newAnnotation = newDecorations.annotations.get(entry.annotation.id);
      if (entry.type !== record.type || oldDecorations.annotations.get(entry.annotation.id) !== entry.annotation ||
          oldDecorations.referenceRanges.get(entry.occurrence.id) === undefined ||
          (newAnnotation && !stagedAnnotations.has(newAnnotation)) ||
          (newDecorations.referenceRanges.has(entry.occurrence.id) && !stagedIds.has(entry.occurrence.id)) ||
          !cellNode || !sameCellContent(data.content, cell) || !sameDOMProof(data.content, proofs.get(data.content)) || data.content.owner !== record.owner ||
          cellNode.position?.start.offset !== entry.occurrence.range.start || cellNode.position?.end.offset !== entry.occurrence.range.end) continue;
      const range = { ...entry.occurrence.range }, source = target.document.getSnapshot().source.slice(range.start, range.end);
      if (source !== data.source) continue;
      const nextData: CellPreview = { ...data, source, expand: () => expand(target, pair.after, record.store, data.row, data.column) };
      const occurrence = { ...entry.occurrence, range, referenceRange: range, annotationIds: [...entry.occurrence.annotationIds] };
      entries.push({ type: record.type, occurrence, annotation: { ...entry.annotation, range, data: nextData } });
      admitted.add(occurrence.id);
      const marker = previous.anchors.get(occurrence.id); if (marker?.isConnected && record.table.contains(marker)) anchors.push([occurrence.id, marker]);
    }
    if (entries.length) next.set(record.owner, { ...record, node: pair.after, entries });
  }
  staged.set(target, { records: next, claimed: new Set(), proofs, grant });
  const active = interaction.active && admitted.has(interaction.active) ? interaction.active : null;
  const hovered = interaction.hovered && admitted.has(interaction.hovered) ? interaction.hovered : null;
  target.initializeViewHandoff([...next.values()].map(record => ({ owner: record.owner, entries: record.entries })), {
    active, activeSource: active ? interaction.activeSource : null,
    hovered, hoverSource: hovered ? interaction.hoverSource : null,
    toolbarOccurrence: interaction.toolbarOccurrence && admitted.has(interaction.toolbarOccurrence) ? interaction.toolbarOccurrence : null,
  }, anchors);
}
export function claimTableViews(runtime: ReaderRuntime, owner: object, node: MarkdownNode, table: HTMLTableElement): readonly ViewAnnotation[] | undefined {
  const state = staged.get(runtime), record = state?.records.get(owner), saved = state && grants.get(state.grant);
  if (!state || saved?.before !== state.grant.previous.document.getSnapshot() || saved?.after !== runtime.document.getSnapshot() || !record || record.node !== node || record.table !== table || record.store !== runtime.nodeStates.get(node)?.get(stateKey) ||
      !record.entries.every(entry => { const lease = (entry.annotation.data as CellPreview).content; return sameDOMProof(lease, state.proofs.get(lease)); })) return;
  state.claimed.add(owner); return record.entries;
}

/** Internal request plumbing, never an AsyncReader/public capability. The full
 * request owner must issue grant before first target render and consume it at
 * that provider only. Hook state observes last prefix pin/close synchronously. */
export function useTableViewHandoff(grant: TableViewGrant | undefined): void {
  const bridge = useMemo(() => {
    const previous = grant?.previous, views = previous && registry(previous);
    let committed = false, snapshot: { interaction: InteractionState; records: ReadonlyMap<object, TableRecord>; config: unknown; document: DocumentSnapshot } | undefined;
    const get = () => {
      if (!previous || !views || committed) return snapshot;
      const interaction = previous.interaction.get(), records = views.get(), config = previous.configuration.get(), document = previous.document.getSnapshot();
      if (!snapshot || snapshot.interaction !== interaction || snapshot.records !== records || snapshot.config !== config || snapshot.document !== document) snapshot = { interaction, records, config, document };
      return snapshot;
    };
    const subscriptions = new Set<() => void>();
    const subscribe = (listener: () => void) => {
      if (!previous || !views || committed) return () => {};
      const notify = () => { if (!committed) listener(); };
      const cleanups = [previous.interaction.subscribe(notify), views.subscribe(notify), previous.configuration.subscribe(notify), previous.document.subscribe(notify)];
      const cleanup = () => { cleanups.forEach(stop => stop()); subscriptions.delete(cleanup); };
      subscriptions.add(cleanup); return cleanup;
    };
    return { get, subscribe, get committed() { return committed; }, commit: () => { committed = true; for (const cleanup of subscriptions) cleanup(); } };
  }, [grant]);
  const snapshot = useSyncExternalStore(bridge.subscribe, bridge.get, bridge.get);
  if (grant && snapshot && !bridge.committed) prepare(grant, snapshot.interaction, snapshot.records);
  layoutEffect(() => {
    bridge.commit();
    if (!grant) return;
    const state = staged.get(grant.target);
    // Child Table layout effects have now validated the actual same DOM. Any
    // unclaimed staged view is removed; continuity cannot be claimed for it.
    for (const record of state?.records.values() ?? []) if (!state?.claimed.has(record.owner)) grant.target.setViewAnnotations(record.owner, []);
    staged.delete(grant.target);
  }, [bridge, grant]);
}
