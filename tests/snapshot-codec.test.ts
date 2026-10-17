import { describe, expect, it } from 'vitest';
import { createDocument, type DocumentSnapshot } from '../src/core';
import { standard } from '../src/extensions';
import { packSnapshot, packOwnedSnapshot, packOwnedSnapshotCooperatively, packedSnapshotByteLength, snapshotTransferList, unpackSnapshot, unpackSnapshotCooperatively, type PackedSnapshot } from '../src/core/snapshot-codec';
import { parserGraphFingerprint } from '../benchmarks/core/parser-graph';

function packed(value: unknown, chunkBytes = 256): PackedSnapshot {
  const result = packSnapshot(value, { chunkBytes });
  expect(result).toBeDefined();
  return result!;
}
function roundtrip<T>(value: T, chunkBytes = 256): T {
  const result = unpackSnapshot<T>(packed(value, chunkBytes));
  expect(parserGraphFingerprint(result)).toEqual(parserGraphFingerprint(value));
  return result;
}

describe('packed snapshot graph transport', () => {
  it('preserves cycles, Map keys, Set entries and cross-container aliases', () => {
    const shared = { offset: 42, line: 3, column: 7 };
    const graph: { first: typeof shared; last: typeof shared; map: Map<unknown, unknown>; set: Set<unknown>; self?: unknown } = {
      first: shared, last: shared, map: new Map(), set: new Set(),
    };
    graph.self = graph;
    graph.map.set(shared, graph); graph.map.set('same point', shared); graph.map.set(graph.map, graph.set);
    graph.set.add(shared); graph.set.add(graph); graph.set.add(graph.set);
    const result = roundtrip(graph, 64);
    expect(result.self).toBe(result);
    expect(result.first).toBe(result.last);
    expect(result.map.get(result.first)).toBe(result);
    expect(result.map.get(result.map)).toBe(result.set);
    expect(result.set.has(result.set)).toBe(true);
    expect(result.set.has(result.first)).toBe(true);
    expect(result.first).not.toBe(shared);
  });

  it('keeps array holes, length, extra keys, null prototypes and __proto__ data', () => {
    const array = new Array(9) as unknown[] & { extra?: unknown };
    array[2] = undefined; array[4] = 'four'; array.extra = array;
    const value = Object.create(null) as Record<string, unknown>;
    value.z = array; value.a = array;
    Object.defineProperty(value, '__proto__', { value: array, enumerable: true });
    const result = roundtrip(value);
    expect(Object.getPrototypeOf(result)).toBeNull();
    expect(Object.keys(result)).toEqual(['z', 'a', '__proto__']);
    const restored = result.z as typeof array;
    expect(restored.length).toBe(9);
    expect(0 in restored).toBe(false); expect(2 in restored).toBe(true);
    expect(Object.keys(restored)).toEqual(['2', '4', 'extra']);
    expect(restored.extra).toBe(restored);
    expect(result.__proto__).toBe(restored);
    const ordinary = {};
    Object.defineProperty(ordinary, '__proto__', { value: { safe: true }, enumerable: true });
    const restoredOrdinary = roundtrip(ordinary);
    expect(Object.getPrototypeOf(restoredOrdinary)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(restoredOrdinary, '__proto__')).toBe(true);
  });

  it('preserves exact scalar values and UTF-16 units across tiny pool boundaries', () => {
    const text = '\uFEFF\u0000中文😀\ud83d / \ude00\r\n'.repeat(17);
    const values = [undefined, null, true, false, 0, -0, NaN, Infinity, -Infinity, 0.25, -12.75, Number.MAX_SAFE_INTEGER,
      Number.MIN_VALUE, 0x1fffffff, -0x1fffffff, 0x20000000, -0x20000000, 123456789012345678901234567890n, text, text];
    expect(roundtrip(values, 32)).toEqual(values);
    for (const value of [undefined, null, false, -0, NaN, 4.5, '', '🪶\ud83d', 12n]) expect(roundtrip(value, 32)).toEqual(value);
  });

  it('roundtrips a standard document snapshot including annotation and definition aliases', () => {
    const source = '\uFEFF# Heading 中文 😀\r\n\r\n'
      + '::%%limr%%{<#note}Marked **words** and [link][target], [^native].::%%limr%%{>#note}\r\n\r\n'
      + '98. First\r\n99. Second\r\n\r\n| A | B |\r\n| - | - |\r\n| $x$ | ~~gone~~ |\r\n\r\n'
      + '<callout title="Escaped &amp; 中文">\r\n\r\nInside.\r\n\r\n</callout>\r\n\r\n'
      + ':::limr-annotation{id="note" type="footnote"}\r\nA **complete** note.\r\n:::\r\n\r\n'
      + '[target]: /target "Target"\r\n\r\n[^native]: Native footnote.\r\n';
    const snapshot = createDocument(source, { id: 'packed-roundtrip', extensions: standard() }).getSnapshot();
    const result = roundtrip<DocumentSnapshot>(snapshot);
    expect(result).toEqual(snapshot);
    expect(result.definitions.get('target')).toBe(result.blocks.find(block => block.node.type === 'definition')?.node);
    expect(result.footnotes.get('native')).toBe(result.blocks.find(block => block.node.type === 'footnoteDefinition')?.node);
    expect(parserGraphFingerprint(result).aliases).toBeGreaterThan(0);
    const expected = parserGraphFingerprint(snapshot), owned = packOwnedSnapshot(snapshot);
    expect(owned.version).toBe(2);
    expect(parserGraphFingerprint(unpackSnapshot(owned))).toEqual(expected);
  });

  it('transfers bounded backing pages without keeping a second contiguous payload', () => {
    const value = { text: '中文\ud800 words\n'.repeat(30), arrays: Array.from({ length: 45 }, (_, index) => ({ index, position: { line: index, column: 1 } })) };
    const encoded = packed(value, 128), transfer = snapshotTransferList(encoded);
    expect(transfer.length).toBeGreaterThan(4);
    expect(transfer.every(buffer => buffer.byteLength <= 128)).toBe(true);
    expect(packedSnapshotByteLength(encoded)).toBe(transfer.reduce((total, buffer) => total + buffer.byteLength, 0));
    const received = structuredClone(encoded, { transfer });
    expect(transfer.every(buffer => buffer.byteLength === 0)).toBe(true);
    expect(unpackSnapshot(received)).toEqual(value);
  });

  it('falls back without invoking accessors or mutating the input graph', () => {
    let calls = 0;
    const getter = { get value() { calls++; return 'unexpected'; } };
    const hidden = Object.defineProperty({}, 'hidden', { value: 1 });
    const symbolKey = { [Symbol('key')]: 1 };
    const specialMap = new Map() as Map<unknown, unknown> & { extra?: boolean }; specialMap.extra = true;
    for (const value of [getter, hidden, symbolKey, specialMap, new Date(), /regex/g, new Uint8Array(2), new WeakMap(),
      new (class Custom { value = 1; })(), () => 1, Symbol('value')]) expect(packSnapshot({ before: { valid: true }, value })).toBeUndefined();
    expect(calls).toBe(0);
    expect(Object.getOwnPropertyDescriptor(getter, 'value')?.get).toBeTypeOf('function');
    const original = { first: { nested: true }, second: new Date(0) }, first = original.first;
    expect(packSnapshot(original)).toBeUndefined();
    expect(original.first).toBe(first); expect(original.second.getTime()).toBe(0);
  });

  it('consumes only owned edges while preserving cycles, aliases and sparse arrays after transfer', () => {
    const shared = { position: { line: 1, column: 4, offset: 3 }, text: '中文\ud800' };
    const sparse = new Array(7) as unknown[] & { extra?: unknown };
    sparse[2] = shared; sparse[4] = undefined; sparse.extra = sparse;
    const map = new Map<unknown, unknown>(), set = new Set<unknown>();
    const root = Object.assign(Object.create(null), { sparse, shared, map, set });
    root.self = root; map.set(shared, root); map.set(map, set); set.add(shared); set.add(set);
    Object.defineProperty(root, '__proto__', { value: shared, writable: true, enumerable: true, configurable: true });
    const expected = parserGraphFingerprint(root);
    const encoded = packOwnedSnapshot(root, { chunkBytes: 64 });
    expect(root.shared).toBeUndefined(); expect(shared.position).toBeUndefined();
    expect(Object.keys(sparse)).toEqual(['2', '4', 'extra']);
    expect(sparse[2]).toBeUndefined(); expect(sparse.length).toBe(7);
    expect(map.size).toBe(0); expect(set.size).toBe(0);
    const restored = unpackSnapshot<typeof root>(structuredClone(encoded, { transfer: snapshotTransferList(encoded) }));
    expect(parserGraphFingerprint(restored)).toEqual(expected);
    expect(restored.sparse[2]).toBe(restored.shared); expect(restored.self).toBe(restored);
    expect(restored.map.get(restored.shared)).toBe(restored); expect(restored.set.has(restored.set)).toBe(true);
  });

  it('never offers a clone fallback after an owned graph was partially consumed', () => {
    const child = { valid: true }, graph = { unsupported: new Date(0), child };
    expect(() => packOwnedSnapshot(graph)).toThrow('Unsupported packed');
    expect(graph.child).toBeUndefined(); expect(child.valid).toBeUndefined();
    expect(() => packOwnedSnapshot({ child: Object.freeze({ valid: true }) })).toThrow('Unsupported packed');
    expect(() => packOwnedSnapshot({}, { chunkBytes: 0 })).toThrow('Unsupported packed');
  });

  it('yields between owned record batches while preserving the final graph', async () => {
    const nodes = Array.from({ length: 16 }, (_, id) => ({ id, next: undefined as unknown }));
    for (let at = 0; at < nodes.length; at++) nodes[at].next = nodes[(at + 1) % nodes.length];
    const graph = { first: nodes[0], nodes }, expected = parserGraphFingerprint(graph);
    let yields = 0, sawPartiallyConsumed = false;
    const encoded = await packOwnedSnapshotCooperatively(graph, { chunkBytes: 64, workBudget: 1, timeBudgetMs: 0, yield: async () => {
      yields++;
      sawPartiallyConsumed ||= graph.first === undefined && nodes.some(node => node !== undefined);
    } });
    expect(yields).toBeGreaterThan(3); expect(sawPartiallyConsumed).toBe(true);
    expect(parserGraphFingerprint(unpackSnapshot(encoded))).toEqual(expected);
    await expect(packOwnedSnapshotCooperatively({ value: new Date(0) })).rejects.toThrow('Unsupported packed');
  });

  it('keeps the existing wire IDs and UTF-16 pages when string emission is deferred', async () => {
    const graph = { a: '\ud800\u0000😀', b: [1, 'repeat', undefined], c: 'repeat', map: new Map([['a', 1]]) };
    const encoded = packSnapshot(graph, { chunkBytes: 32 })!;
    // Captured before deferred emission: string IDs include both shape keys
    // and values, and the Map key reuses an already interned shape key.
    expect(JSON.parse(JSON.stringify(encoded, (_key, item) => ArrayBuffer.isView(item) ? Array.from(item as Uint32Array) : item))).toEqual({
      version: 1, chunkBytes: 32, root: 1, objectCount: 3, stringCount: 6, recordWords: 15, shapeWords: 5, stringUnits: 16, numberCount: 0,
      records: [[0, 0, 34, 9, 42, 17, 2, 3], [11, 42, 0, 4, 1, 2, 11]], shapes: [[4, 0, 1, 2, 3]],
      stringIndex: [[0, 1, 1, 1, 2, 1, 3, 3], [6, 4, 10, 6]],
      strings: [[97, 98, 99, 109, 97, 112, 55296, 0, 55357, 56832, 114, 101, 112, 101, 97, 116]], numbers: [],
    });
    const owned = await packOwnedSnapshotCooperatively(structuredClone(graph), { chunkBytes: 32 });
    expect(encoded.version).toBe(1); expect(owned.version).toBe(2);
    expect(parserGraphFingerprint(unpackSnapshot(owned))).toEqual(parserGraphFingerprint(graph));
    expect(unpackSnapshot(owned)).toEqual(graph);
    expect(graph.a).toBe('\ud800\u0000😀');
  });

  it('yields while copying one huge UTF-16 string after the owned graph is released', async () => {
    const source = '\uFEFF中文😀\ud800\u0000\r\n'.repeat(20000), graph = { source };
    let yields = 0;
    const encoded = await packOwnedSnapshotCooperatively(graph, { workBudget: 1024, timeBudgetMs: 0, yield: async () => {
      yields++; expect(graph.source).toBeUndefined();
    } });
    expect(yields).toBeGreaterThan(10);
    expect(unpackSnapshot<{ source: string }>(encoded).source).toBe(source);
    expect(encoded.strings).toEqual(packSnapshot({ source })!.strings);
  });

  it('decodes explicit DFS IDs with both decoders and rejects duplicate, missing or invalid IDs', async () => {
    const encoded = packOwnedSnapshot({ a: {}, b: {} });
    expect(encoded.version).toBe(2);
    // Root discovers a=1 and b=2; the owned stack emits b before a.
    expect(Array.from(encoded.records[0])).toEqual([0, 0, 0, 9, 17, 2, 0, 3, 1, 0, 3]);
    expect(unpackSnapshot(encoded)).toEqual({ a: {}, b: {} });
    expect(await unpackSnapshotCooperatively(encoded, { workBudget: 1, yield: async () => {} })).toEqual({ a: {}, b: {} });
    const duplicate = structuredClone(encoded); duplicate.records[0][8] = 2;
    const missing = structuredClone(encoded); missing.recordWords -= 3; missing.records[0] = missing.records[0].subarray(0, missing.recordWords);
    const outside = structuredClone(encoded); outside.records[0][5] = outside.objectCount;
    for (const malformed of [duplicate, missing, outside]) {
      expect(() => unpackSnapshot(malformed)).toThrow('Invalid packed');
      await expect(unpackSnapshotCooperatively(malformed, { workBudget: 1, yield: async () => {} })).rejects.toThrow('Invalid packed');
    }
  });

  it('cooperatively restores aliases with monotonic progress and supports cancellation', async () => {
    const shared = { text: '\uFEFF中文\ud800'.repeat(100) }, value = [shared, shared, { shared }];
    const encoded = packed(value, 128), progress: [number, number][] = [];
    let yields = 0;
    const result = await unpackSnapshotCooperatively<typeof value>(encoded, {
      workBudget: 16, yield: async () => { yields++; }, onProgress: (loaded, total) => progress.push([loaded, total]),
    });
    expect(parserGraphFingerprint(result)).toEqual(parserGraphFingerprint(value));
    expect(yields).toBeGreaterThan(1);
    expect(progress.every(([loaded, total], index) => loaded <= total && (!index || loaded >= progress[index - 1][0]))).toBe(true);
    expect(progress.at(-1)?.[0]).toBe(progress.at(-1)?.[1]);
    const controller = new AbortController();
    await expect(unpackSnapshotCooperatively(encoded, { signal: controller.signal, workBudget: 1, yield: async () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
    expect(unpackSnapshot(encoded)).toEqual(value);
  });

  it('rejects malformed pool sizes, object records and string ranges', () => {
    const encoded = packed({ text: 'value', child: {} });
    expect(() => unpackSnapshot({ ...encoded, objectCount: encoded.recordWords + 1 })).toThrow();
    const record = structuredClone(encoded); record.records[0][0] = 99;
    expect(() => unpackSnapshot(record)).toThrow();
    const string = structuredClone(encoded); string.stringIndex[0][0] = 0xffffffff;
    expect(() => unpackSnapshot(string)).toThrow();
  });
});
