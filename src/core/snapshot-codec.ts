import { throwIfAborted, yieldTask } from './source-input';

/** Internal graph transport. This is not a replacement for the public AST.
 * Strings are UTF-16 code units: UTF-8 encoders would lose lone surrogates.
 * Property descriptors normalize like structuredClone; unsupported objects,
 * accessors, symbol keys and non-enumerable payload properties use its fallback. */
export interface PackedSnapshot {
  version: 1 | 2;
  chunkBytes: number;
  root: number;
  objectCount: number;
  stringCount: number;
  recordWords: number;
  shapeWords: number;
  stringUnits: number;
  numberCount: number;
  records: Uint32Array[];
  shapes: Uint32Array[];
  stringIndex: Uint32Array[];
  strings: Uint16Array[];
  numbers: Float64Array[];
}
export interface SnapshotPackOptions { chunkBytes?: number }
interface OwnedPackOptions extends SnapshotPackOptions {
  workBudget?: number;
  timeBudgetMs?: number;
  yield?: () => Promise<void>;
}
export interface SnapshotUnpackOptions {
  signal?: AbortSignal;
  /** Approximate scalar operations between opportunities for input/paint. */
  workBudget?: number;
  /** Check elapsed CPU work at each budget boundary; the default is 8 ms.
   * An explicit workBudget without this option gives deterministic checkpoints. */
  timeBudgetMs?: number;
  yield?: () => Promise<void>;
  onProgress?: (loaded: number, total: number) => void;
}

type Numbers = Uint16Array | Uint32Array | Float64Array;
const MAX_ID = 0x1fffffff;
const MAX_WORD = 0xffffffff;
const enum Kind { Object, NullObject, Array, SparseArray, Map, Set }
const enum Tag { Special, Object, String, Positive, Negative, Float, BigInt }
const enum Special { Undefined, Null, False, True, NaN, Infinity, NegativeInfinity, NegativeZero }
const unsupported = new Error('Unsupported packed snapshot graph.');
const invalid = (): never => { throw new TypeError('Invalid packed LiMR snapshot.'); };

/** Pools allocate bounded pages directly; no document-sized JS number array
 * or second contiguous packed buffer exists during encoding. */
class Pool<T extends Numbers> {
  readonly chunks: T[] = [];
  length = 0;
  constructor(private ArrayType: new (length: number) => T, readonly capacity: number) {}
  push(value: number): void {
    if (this.length >= MAX_WORD) throw unsupported;
    const at = this.length % this.capacity;
    if (!at) this.chunks.push(new this.ArrayType(this.capacity));
    this.chunks[this.chunks.length - 1][at] = value;
    this.length++;
  }
  finish(): T[] {
    const used = this.length % this.capacity;
    if (used) this.chunks[this.chunks.length - 1] = this.chunks[this.chunks.length - 1].subarray(0, used) as T;
    return this.chunks;
  }
}

/** Return undefined before publishing anything if the complete graph cannot
 * be represented. Callers can then retain their ordinary structured clone. */
export function packSnapshot(value: unknown, options: SnapshotPackOptions = {}): PackedSnapshot | undefined {
  return drainEncoding(encodeSnapshot(value, options, false));
}

/** Internal, destructive handoff for the shipped worker's fresh standard tree.
 * Every encoded edge is released after its target has a graph-wide ID. Never
 * use a consumed graph as a clone fallback: unsupported payloads must fail. */
export function packOwnedSnapshot(value: unknown, options: SnapshotPackOptions = {}): PackedSnapshot {
  return drainEncoding(encodeSnapshot(value, options, true))!;
}

/** Bounded jobs let the worker collect released AST edges while the packed
 * buffers grow. Terminating the worker still owns cancellation of this work. */
export async function packOwnedSnapshotCooperatively(value: unknown, options: OwnedPackOptions = {}): Promise<PackedSnapshot> {
  const steps = encodeSnapshot(value, options, true);
  try {
    while (true) {
      const next = steps.next();
      if (next.done) return next.value!;
      await (options.yield ?? yieldTask)();
    }
  } finally { steps.return(undefined); }
}

function drainEncoding(steps: Generator<void, PackedSnapshot | undefined>): PackedSnapshot | undefined {
  let next = steps.next();
  while (!next.done) next = steps.next();
  return next.value;
}

function* encodeSnapshot(value: unknown, options: OwnedPackOptions, consume: boolean): Generator<void, PackedSnapshot | undefined> {
  try {
    const requested = options.chunkBytes ?? 64 * 1024;
    if (!Number.isFinite(requested) || requested < 32 || requested > 16 * 1024 * 1024) throw unsupported;
    const chunkBytes = Math.floor(requested / 8) * 8;
    const records = new Pool(Uint32Array, chunkBytes / 4), shapes = new Pool(Uint32Array, chunkBytes / 4);
    const stringIndex = new Pool(Uint32Array, chunkBytes / 4), strings = new Pool(Uint16Array, chunkBytes / 2);
    const numbers = new Pool(Float64Array, chunkBytes / 8);
    let objects = new WeakMap<object, number>();
    const text = new Map<string, number>(), shapeIds = new Map<string, number>();
    // Only unencoded objects remain in this queue. Completed pages release
    // their references; the ID map itself does not keep graph objects alive.
    const queue: (object[] | undefined)[] = [];
    // Owned trees use depth-first records with explicit IDs. Processing a
    // child's subtree before its siblings bounds the live traversal frontier.
    const pending: object[] = [];
    let objectCount = 0, reservedUnits = 0;
    const stringId = (value: string): number => {
      const known = text.get(value);
      if (known !== undefined) return known;
      const id = text.size;
      if (id > MAX_ID || reservedUnits + value.length > MAX_WORD) throw unsupported;
      text.set(value, id);
      reservedUnits += value.length;
      return id;
    };
    const encoded = (item: unknown): number => {
      if (item === undefined) return Special.Undefined * 8;
      if (item === null) return Special.Null * 8;
      if (typeof item === 'boolean') return (item ? Special.True : Special.False) * 8;
      if (typeof item === 'string') return stringId(item) * 8 + Tag.String;
      if (typeof item === 'bigint') return stringId(String(item)) * 8 + Tag.BigInt;
      if (typeof item === 'number') {
        if (Object.is(item, -0)) return Special.NegativeZero * 8;
        if (Number.isNaN(item)) return Special.NaN * 8;
        if (item === Infinity) return Special.Infinity * 8;
        if (item === -Infinity) return Special.NegativeInfinity * 8;
        if (Number.isInteger(item) && Math.abs(item) <= MAX_ID) return Math.abs(item) * 8 + (item < 0 ? Tag.Negative : Tag.Positive);
        const id = numbers.length;
        if (id > MAX_ID) throw unsupported;
        numbers.push(item); return id * 8 + Tag.Float;
      }
      if (typeof item !== 'object') throw unsupported;
      let id = objects.get(item);
      if (id === undefined) {
        id = objectCount++;
        if (id > MAX_ID) throw unsupported;
        objects.set(item, id);
        if (consume) pending.push(item);
        else {
          const page = Math.floor(id / 1024);
          (queue[page] ??= []).push(item);
        }
      }
      return id * 8 + Tag.Object;
    };
    const shape = (keys: string[]): number => {
      const ids = keys.map(stringId), signature = ids.join(',');
      const previous = shapeIds.get(signature);
      if (previous !== undefined) return previous;
      const at = shapes.length;
      shapes.push(ids.length); for (const id of ids) shapes.push(id);
      shapeIds.set(signature, at); return at;
    };
    const property = (object: object, key: string): number => {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      if (!descriptor?.enumerable || !('value' in descriptor)) throw unsupported;
      if (consume && !descriptor.writable) throw unsupported;
      const code = encoded(descriptor.value);
      // Keep the object's shape and array holes intact while its children wait
      // in the queue. Weak IDs still resolve aliases to already consumed nodes.
      if (consume) (object as Record<string, unknown>)[key] = undefined;
      return code;
    };
    const root = encoded(value);
    const workBudget = Math.max(1, Math.floor(options.workBudget ?? 1024));
    const timeBudget = Math.max(0, options.timeBudgetMs ?? 8);
    let resumed = performance.now();
    for (let completed = 0; completed < objectCount; completed++) {
      const page = Math.floor(completed / 1024), at = completed % 1024;
      const item = consume ? pending.pop()! : queue[page]![at];
      if (consume) records.push(objects.get(item)!);
      const prototype = Object.getPrototypeOf(item);
      if (Object.getOwnPropertySymbols(item).length) throw unsupported;
      if (prototype === Map.prototype || prototype === Set.prototype) {
        if (Object.getOwnPropertyNames(item).length) throw unsupported;
        if (prototype === Map.prototype) {
          const map = item as Map<unknown, unknown>;
          records.push(Kind.Map); records.push(map.size);
          for (const [key, entry] of map) { records.push(encoded(key)); records.push(encoded(entry)); }
          if (consume) map.clear();
        } else {
          const set = item as Set<unknown>;
          records.push(Kind.Set); records.push(set.size);
          for (const entry of set) records.push(encoded(entry));
          if (consume) set.clear();
        }
      } else {
        const array = Array.isArray(item);
        if (array ? prototype !== Array.prototype : prototype !== Object.prototype && prototype !== null) throw unsupported;
        const keys = Object.getOwnPropertyNames(item).filter(key => !array || key !== 'length');
        if (array) {
          const length = (item as unknown[]).length;
          const dense = keys.length === length && keys.every((key, index) => key === String(index));
          records.push(dense ? Kind.Array : Kind.SparseArray); records.push(length);
          if (!dense) records.push(shape(keys));
        } else { records.push(prototype === null ? Kind.NullObject : Kind.Object); records.push(shape(keys)); }
        for (const key of keys) records.push(property(item, key));
      }
      // The ordinary encoder leaves every object unchanged, including after a
      // fallback. The owned encoder has also released that object's edges.
      if (!consume) {
        queue[page]![at] = undefined as unknown as object;
        if (at === 1023) queue[page] = undefined;
      }
      if (consume && (completed + 1) % workBudget === 0 && performance.now() - resumed >= timeBudget) {
        yield;
        resumed = performance.now();
      }
    }
    // IDs and records are now complete. Retire lookup tables before allocating
    // the potentially large UTF-16 pool alongside the remaining text strings.
    objects = new WeakMap(); shapeIds.clear(); queue.length = 0; pending.length = 0;
    const stringCount = text.size;
    if (consume && stringCount) { yield; resumed = performance.now(); }
    // Map insertion order is the original ID order. Deleting the current key
    // is safe after its units are emitted: no graph traversal can intern more
    // strings now, and no separate document-sized string queue is necessary.
    for (const value of text.keys()) {
      stringIndex.push(strings.length); stringIndex.push(value.length);
      for (let at = 0; at < value.length;) {
        const end = Math.min(at + 16384, value.length);
        for (; at < end; at++) strings.push(value.charCodeAt(at));
        if (consume && performance.now() - resumed >= timeBudget) {
          yield;
          resumed = performance.now();
        }
      }
      text.delete(value);
    }
    return { version: consume ? 2 : 1, chunkBytes, root, objectCount, stringCount,
      recordWords: records.length, shapeWords: shapes.length, stringUnits: strings.length, numberCount: numbers.length,
      records: records.finish(), shapes: shapes.finish(), stringIndex: stringIndex.finish(), strings: strings.finish(), numbers: numbers.finish() };
  } catch (error) { if (consume) throw error; return undefined; }
}

/** Native Worker postMessage can transfer each backing page without cloning. */
export function snapshotTransferList(packed: PackedSnapshot): ArrayBuffer[] {
  return [...new Set([...packed.records, ...packed.shapes, ...packed.stringIndex, ...packed.strings, ...packed.numbers].map(chunk => chunk.buffer as ArrayBuffer))];
}
export function packedSnapshotByteLength(packed: PackedSnapshot): number {
  return snapshotTransferList(packed).reduce((bytes, buffer) => bytes + buffer.byteLength, 0);
}

class Reader<T extends Numbers> {
  at = 0;
  constructor(readonly chunks: readonly T[], readonly length: number, readonly capacity: number, ArrayType: new (length: number) => T) {
    if (!Number.isInteger(length) || length < 0 || length > MAX_WORD || chunks.length !== Math.ceil(length / capacity)) invalid();
    for (let index = 0; index < chunks.length; index++) {
      if (!(chunks[index] instanceof ArrayType) || chunks[index].length !== Math.min(capacity, length - index * capacity)) invalid();
    }
  }
  get(at: number): number {
    if (at < 0 || at >= this.length || !Number.isInteger(at)) return invalid();
    return this.chunks[Math.floor(at / this.capacity)][at % this.capacity];
  }
  next(): number { return this.get(this.at++); }
  skip(count: number): void { if (count < 0 || this.at + count > this.length) invalid(); this.at += count; }
}

interface DecodeProgress { loaded: number; total: number }
function* decode(packed: PackedSnapshot, options: SnapshotUnpackOptions = {}): Generator<DecodeProgress, unknown> {
  throwIfAborted(options.signal);
  if (!packed || (packed.version !== 1 && packed.version !== 2) || !Number.isInteger(packed.chunkBytes) || packed.chunkBytes < 32 || packed.chunkBytes > 16 * 1024 * 1024 || packed.chunkBytes % 8) invalid();
  if (!Number.isInteger(packed.root) || packed.root < 0 || packed.root > MAX_WORD
    || !Number.isInteger(packed.objectCount) || packed.objectCount < 0 || packed.objectCount > MAX_ID
    || !Number.isInteger(packed.stringCount) || packed.stringCount < 0 || packed.stringCount > MAX_ID) invalid();
  const words = packed.chunkBytes / 4, units = packed.chunkBytes / 2;
  const records = new Reader(packed.records, packed.recordWords, words, Uint32Array);
  const shapes = new Reader(packed.shapes, packed.shapeWords, words, Uint32Array);
  const indexes = new Reader(packed.stringIndex, packed.stringCount * 2, words, Uint32Array);
  const chars = new Reader(packed.strings, packed.stringUnits, units, Uint16Array);
  const numbers = new Reader(packed.numbers, packed.numberCount, packed.chunkBytes / 8, Float64Array);
  const headerWords = packed.version === 2 ? 3 : 2;
  if (packed.objectCount * headerWords > packed.recordWords) invalid();
  const total = packed.stringUnits + packed.stringCount + packed.shapeWords + packed.objectCount + packed.recordWords;
  const budget = Math.max(1, Math.floor(options.workBudget ?? 16384));
  const timeBudget = Math.max(0, options.timeBudgetMs ?? (options.workBudget === undefined ? 8 : 0));
  let loaded = 0, until = budget;
  let resumed = performance.now();
  const tick = (count = 1) => {
    loaded += count;
    if (loaded < until) return false;
    until = loaded + budget;
    return !timeBudget || performance.now() - resumed >= timeBudget;
  };
  function* checkpoint(): Generator<DecodeProgress, void> {
    throwIfAborted(options.signal);
    yield { loaded, total };
    resumed = performance.now();
  }
  const text: string[] = new Array(packed.stringCount);
  for (let id = 0; id < text.length; id++) {
    const offset = indexes.next(), length = indexes.next();
    if (offset + length > chars.length) invalid();
    const parts: string[] = [];
    for (let at = offset; at < offset + length;) {
      const page = Math.floor(at / units), start = at % units;
      const count = Math.min(8192, chars.chunks[page].length - start, offset + length - at);
      // Bounded argument count also preserves every UTF-16 code unit.
      parts.push(String.fromCharCode(...chars.chunks[page].subarray(start, start + count)));
      at += count;
      if (tick(count)) yield* checkpoint();
    }
    text[id] = parts.join('');
    if (tick()) yield* checkpoint();
  }
  const shapeKeys = new Map<number, string[]>();
  while (shapes.at < shapes.length) {
    const at = shapes.at, count = shapes.next(), keys: string[] = [];
    if (count > shapes.length - shapes.at) invalid();
    if (tick()) yield* checkpoint();
    for (let key = 0; key < count; key++) {
      const id = shapes.next(); if (id >= text.length) invalid(); keys.push(text[id]);
      if (tick()) yield* checkpoint();
    }
    shapeKeys.set(at, keys);
  }
  const keysAt = (at: number): string[] => shapeKeys.get(at) ?? invalid();
  const objects: unknown[] = new Array(packed.objectCount);
  // Allocate shells first. Forward references, cycles and Map keys then need
  // no fixup objects, and all aliases resolve to the same final object.
  for (let ordinal = 0; ordinal < objects.length; ordinal++) {
    const id = packed.version === 2 ? records.next() : ordinal;
    if (id >= objects.length || objects[id] !== undefined) invalid();
    const kind = records.next(), detail = records.next();
    if (kind === Kind.Object || kind === Kind.NullObject) {
      objects[id] = kind === Kind.NullObject ? Object.create(null) : {}; records.skip(keysAt(detail).length);
    } else if (kind === Kind.Array || kind === Kind.SparseArray) {
      objects[id] = new Array(detail); records.skip(kind === Kind.Array ? detail : keysAt(records.next()).length);
    } else if (kind === Kind.Map) { objects[id] = new Map(); records.skip(detail * 2); }
    else if (kind === Kind.Set) { objects[id] = new Set(); records.skip(detail); }
    else invalid();
    if (tick()) yield* checkpoint();
  }
  if (records.at !== records.length) invalid();
  const value = (code: number): unknown => {
    const tag = code % 8, id = Math.floor(code / 8);
    if (tag === Tag.Object) return id < objects.length ? objects[id] : invalid();
    if (tag === Tag.String) return id < text.length ? text[id] : invalid();
    if (tag === Tag.BigInt) return id < text.length ? BigInt(text[id]) : invalid();
    if (tag === Tag.Positive) return id;
    if (tag === Tag.Negative) return -id;
    if (tag === Tag.Float) return numbers.get(id);
    if (tag !== Tag.Special) return invalid();
    switch (id) {
      case Special.Undefined: return undefined;
      case Special.Null: return null;
      case Special.False: return false;
      case Special.True: return true;
      case Special.NaN: return NaN;
      case Special.Infinity: return Infinity;
      case Special.NegativeInfinity: return -Infinity;
      case Special.NegativeZero: return -0;
      default: return invalid();
    }
  };
  const assign = (target: object, key: string, entry: unknown) => {
    if (key === '__proto__') Object.defineProperty(target, key, { value: entry, writable: true, enumerable: true, configurable: true });
    else (target as Record<string, unknown>)[key] = entry;
  };
  records.at = 0;
  for (let ordinal = 0; ordinal < objects.length; ordinal++) {
    const id = packed.version === 2 ? records.next() : ordinal;
    const kind = records.next(), detail = records.next(), target = objects[id];
    if (tick(headerWords)) yield* checkpoint();
    if (kind === Kind.Map) {
      for (let at = 0; at < detail; at++) {
        (target as Map<unknown, unknown>).set(value(records.next()), value(records.next()));
        if (tick(2)) yield* checkpoint();
      }
    } else if (kind === Kind.Set || kind === Kind.Array) {
      for (let at = 0; at < detail; at++) {
        const entry = value(records.next());
        if (kind === Kind.Set) (target as Set<unknown>).add(entry); else (target as unknown[])[at] = entry;
        if (tick()) yield* checkpoint();
      }
    } else {
      const keys = keysAt(kind === Kind.SparseArray ? records.next() : detail);
      if (kind === Kind.SparseArray && tick()) yield* checkpoint();
      for (const key of keys) {
        assign(target as object, key, value(records.next()));
        if (tick()) yield* checkpoint();
      }
    }
  }
  if (loaded !== total) invalid();
  throwIfAborted(options.signal);
  yield { loaded, total };
  return value(packed.root);
}

export function unpackSnapshot<T = unknown>(packed: PackedSnapshot): T {
  const steps = decode(packed);
  let next = steps.next();
  while (!next.done) next = steps.next();
  return next.value as T;
}

/** The host can terminate the producing worker before calling this decoder,
 * avoiding simultaneous worker and main-thread object graphs. */
export async function unpackSnapshotCooperatively<T = unknown>(packed: PackedSnapshot, options: SnapshotUnpackOptions = {}): Promise<T> {
  const steps = decode(packed, options);
  try {
    while (true) {
      throwIfAborted(options.signal);
      const next = steps.next();
      if (next.done) return next.value as T;
      options.onProgress?.(next.value.loaded, next.value.total);
      await (options.yield ?? yieldTask)();
    }
  } finally { steps.return(undefined); }
}
