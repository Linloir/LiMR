import { describe, expect, it } from 'vitest';
import { DocumentEngine, createDocumentSession, decodeDocumentInput, registerWorkerExtension, sourceOffsetToUtf8Byte, utf8ByteToSourceOffset, workerExtensionDescriptor, type DocumentSessionState, type DocumentWorkerPort, type DocumentWorkerRequest, type DocumentWorkerResponse, type SyntaxExtension } from '../src/core';
import { createDocumentWorkerHandler } from '../src/core/worker-handler';
import { standardWorkerRegistry } from '../src/extensions/worker-syntax';
import { standard } from '../src/extensions/standard';
import { defineAnnotation } from '../src/extensions/define';
import { parseInBatches } from '../src/core/batched-parse';
import { fromMarkdownSource as fromMarkdown } from '../src/core/markdown-input';
import type { MarkdownNode } from '../src/core';

class TestWorker implements DocumentWorkerPort {
  listeners = new Map<string, Set<Function>>(); terminated = false;
  private handle: ReturnType<typeof createDocumentWorkerHandler>;
  constructor(registry = standardWorkerRegistry) { this.handle = createDocumentWorkerHandler(registry); }
  addEventListener(type: string, listener: Function) { const set = this.listeners.get(type) ?? new Set(); set.add(listener); this.listeners.set(type, set); }
  removeEventListener(type: string, listener: Function) { this.listeners.get(type)?.delete(listener); }
  postMessage(message: DocumentWorkerRequest) {
    const copy = structuredClone(message);
    setTimeout(() => { if (!this.terminated) void this.handle(copy, response => {
      if (!this.terminated) for (const listener of this.listeners.get('message') ?? []) listener({ data: structuredClone(response) });
    }); }, 0);
  }
  terminate() { this.terminated = true; this.listeners.clear(); }
}
const paragraph = '原文中的文字 🪶 保留准确位置。 This paragraph contains **emphasis** and readable text.\n\n';
const prose = paragraph.repeat(2400);

describe('asynchronous document sessions', () => {
  it('keeps one overall progress across phases and result transfer, resetting only for a new request', async () => {
    let receive!: (event: MessageEvent<DocumentWorkerResponse>) => void;
    const session = createDocumentSession({ id: 'progress', worker: () => ({
      postMessage() {}, terminate() {}, removeEventListener() {},
      addEventListener(type, listener) { if (type === 'message') receive = listener as typeof receive; },
    }) });
    const states: DocumentSessionState[] = [];
    session.subscribe(() => states.push(session.getSnapshot()));
    const pending = session.load('Complete.');
    const revision = session.getSnapshot().revision;
    const send = (message: DocumentWorkerResponse) => receive({ data: message } as MessageEvent<DocumentWorkerResponse>);
    for (const progress of [
      { phase: 'read', loaded: 5, total: 10 }, { phase: 'read', loaded: 10, total: 10 },
      { phase: 'parse', loaded: 0, total: 9 }, { phase: 'parse', loaded: 9, total: 9 },
      // A nested parser can report a new local range without resetting the bar.
      { phase: 'parse', loaded: 0, total: 4 }, { phase: 'index', loaded: 0, total: 1 },
      { phase: 'index', loaded: 1, total: 1 },
    ] as const) send({ type: 'progress', revision, progress });
    const { source, blocks, ...metadata } = new DocumentEngine('Complete.', { id: 'progress' }).getSnapshot();
    send({ type: 'snapshot-start', revision, metadata, sourceLength: source.length, blockCount: blocks.length, progressive: false });
    send({ type: 'snapshot-source', revision, value: source });
    send({ type: 'snapshot-blocks', revision, blocks: [...blocks] });
    expect(states.every(state => state.overallProgress >= 0 && state.overallProgress < 1)).toBe(true);
    expect(states.map(state => state.overallProgress)).toEqual([...states.map(state => state.overallProgress)].sort((a, b) => a - b));
    expect(session.getSnapshot().overallProgress).toBeCloseTo(.99);
    send({ type: 'snapshot-end', revision }); await pending;
    expect(session.getSnapshot()).toMatchObject({ status: 'ready', overallProgress: 1 });
    const next = session.load('Another request.');
    expect(session.getSnapshot().overallProgress).toBe(0);
    session.cancel(); await expect(next).rejects.toMatchObject({ name: 'AbortError' });
    send({ type: 'progress', revision, progress: { phase: 'index', loaded: 1, total: 1 } });
    expect(session.getSnapshot()).toMatchObject({ status: 'cancelled', overallProgress: 0 });
    session.dispose();
  });
  it('adopts complete snapshots without copying source/blocks and safely rebuilds private state on edit', () => {
    const extensions = standard(), original = new DocumentEngine('[link][ref]\n\n[ref]: /first', { id: 'shared', extensions });
    original.update('[link][ref]\n\n[ref]: /second');
    const snapshot = original.getSnapshot(), adopted = DocumentEngine.fromSnapshot(snapshot, { extensions });
    expect(adopted.getSnapshot()).toBe(snapshot); expect(adopted.id).toBe('shared');
    expect(() => DocumentEngine.fromSnapshot(snapshot, { id: 'different' })).toThrow('id');
    expect(() => DocumentEngine.fromSnapshot({ ...snapshot, blocks: [{ ...snapshot.blocks[0], range: { start: -1, end: 5 } }] })).toThrow('range');
    const updated = adopted.update('# Heading\n\n[link][ref]\n\n[ref]: /third');
    expect(updated.definitions.get('ref')?.url).toBe('/third'); expect(updated.revision).toBe(snapshot.revision + 1);
    expect(updated.blocks.map(block => block.node)).toEqual(new DocumentEngine(updated.source, { extensions }).getSnapshot().blocks.map(block => block.node));
  });
  it('preserves the snapshot when only view plugins change and still validates names', () => {
    const extensions = standard(), document = new DocumentEngine('**Text**.', { extensions });
    const snapshot = document.getSnapshot();
    document.setExtensions([...extensions, { name: 'view' }]);
    expect(document.getSnapshot()).toBe(snapshot);
    document.setExtensions([...extensions, { name: 'another-view' }]);
    expect(document.getSnapshot()).toBe(snapshot);
    expect(() => document.setExtensions([...extensions, { name: 'same' }, { name: 'same' }])).toThrow('Duplicate');
    document.setExtensions([...extensions, { name: 'syntax', transform(root) { root.children![0].data = { changed: true }; } }]);
    expect(document.getSnapshot()).not.toBe(snapshot);
    expect(document.getSnapshot().blocks[0].node.data).toEqual({ changed: true });
  });
  it('keeps blocking mode empty until a complete worker parse and preserves global syntax', async () => {
    const extensions = standard(), workers: TestWorker[] = [], states: DocumentSessionState[] = [];
    const session = createDocumentSession({ id: 'all', extensions, worker: () => { const worker = new TestWorker(); workers.push(worker); return worker; } });
    session.subscribe(() => states.push(session.getSnapshot()));
    const source = '# Duplicate\n\n[link][later] and a note[^note].\n\n# Duplicate\n\n[later]: /resolved\n\n[^note]: Full note.\n\n::%%limr%%{<#range}Words::%%limr%%{>#range}\n\n:::limr-annotation{id="saved" ranges="range"}\nSaved note.\n:::\n';
    const document = await session.load(source);
    expect(document.getSnapshot()).toEqual(new DocumentEngine(source, { id: 'all', extensions }).getSnapshot());
    expect(states.filter(state => state.status === 'loading').every(state => !state.document && !state.complete)).toBe(true);
    expect(session.getSnapshot().capabilities.worker).toBe(true); expect(workers[0].terminated).toBe(true); session.dispose();
  });
  it('uses the same default syntax implementations as the renderer modules', async () => {
    const extensions = standard(), source = `> [!TIP]+ A title
> A **body**.

Inline ==highlight== and ^[inline note].

$E=mc^2$

\`\`\`mermaid
graph TD; A-->B
\`\`\`

<figure src="/figure.png" alt="Figure" />

<img src="/image.png" alt="Image" />

<citation id="reference" title="Source" />

<ref id="reference">Quoted words</ref>

<translations><origin>Original</origin><translation>Translated</translation></translations>`;
    const session = createDocumentSession({ id: 'modules', extensions, worker: () => new TestWorker() });
    expect((await session.load(source)).getSnapshot()).toEqual(new DocumentEngine(source, { id: 'modules', extensions }).getSnapshot());
  });
  it('publishes explicitly incomplete safe prefixes only in progressive mode', async () => {
    const session = createDocumentSession({ id: 'progressive', mode: 'progressive', extensions: standard(), worker: () => new TestWorker() });
    const prefixes: DocumentSessionState[] = []; session.subscribe(() => { const state = session.getSnapshot(); if (state.document && !state.complete) prefixes.push(state); });
    const document = await session.load(prose);
    expect(new Set(prefixes.map(state => state.document)).size).toBe(1); expect(prefixes[0].status).toBe('loading'); expect(prefixes[0].document!.getSnapshot().source.length).toBeLessThan(prose.length);
    expect(document.getSnapshot().source).toBe(prose); expect(document.getSnapshot().blocks.length).toBe(2400);
    expect(session.getSnapshot().complete).toBe(true); session.dispose();
  });
  it('keeps document-wide references and unknown transforms on a complete parse', async () => {
    let calls = 0;
    const foreign: SyntaxExtension = { name: 'custom', transform(root, context) { calls++; root.children![0].value = `total:${context.source.length}`; } };
    const session = createDocumentSession({ mode: 'progressive', extensions: [foreign], worker: () => { throw new Error('must not start'); } });
    const promise = session.load('First paragraph.\n\nSecond paragraph.');
    expect(session.getSnapshot().status).toBe('loading'); expect(calls).toBe(0);
    const document = await promise;
    expect(calls).toBe(1); expect(document.getSnapshot().blocks[0].node.value).toBe('total:35');
    expect(session.getSnapshot().capabilities).toMatchObject({ worker: false, progressive: false });
    expect(session.getSnapshot().capabilities.reason).toContain('registration'); session.dispose();
  });
  it('keeps view-only plugins on the host without disabling registered worker syntax', async () => {
    const view = { name: 'reading-notes', annotationTypes: [{ type: 'note', label: 'Note', Content: () => null }], actions: [{ id: 'custom', run: () => {} }] };
    const extensions = [...standard(), view], session = createDocumentSession({ extensions, fallback: 'error', worker: () => new TestWorker() });
    const document = await session.load('**Host text**.');
    expect(session.getSnapshot().capabilities.worker).toBe(true);
    expect(document.getSnapshot().blocks[0].node.children![0].type).toBe('strong');
    expect(document.update('Updated **text**.').source).toBe('Updated **text**.');
    session.dispose();
  });
  it('keeps annotation factories and scope-only metadata out of worker syntax and reparsing', async () => {
    const base = standard(), note = defineAnnotation({ type: 'host-note', label: 'Host note', Content: () => null });
    const metadata: SyntaxExtension = { name: 'metadata-only', scope: 'document' };
    const extensions = [...base, note, metadata];
    const session = createDocumentSession({ extensions, fallback: 'error', worker: () => new TestWorker() });
    const document = await session.load('**Host text**.');
    expect(session.getSnapshot().capabilities.worker).toBe(true);
    const snapshot = document.getSnapshot();
    document.setExtensions([...base, defineAnnotation({ type: 'other-note', label: 'Other note', Content: () => null }), { name: 'other-metadata', scope: 'local' }]);
    expect(document.getSnapshot()).toBe(snapshot);
    session.dispose();
  });
  it('rejects unsupported worker-only configurations instead of losing a plugin', async () => {
    const session = createDocumentSession({ fallback: 'error', extensions: [{ name: 'unknown', transform() {} }], worker: () => new TestWorker() });
    await expect(session.load('text')).rejects.toThrow('registration'); expect(session.getSnapshot().status).toBe('error');
  });
  it('terminates cancelled and replaced loads and ignores stale responses', async () => {
    const workers: TestWorker[] = [], session = createDocumentSession({ worker: () => { const worker = new TestWorker(); workers.push(worker); return worker; } });
    const first = session.load('first'), rejected = expect(first).rejects.toMatchObject({ name: 'AbortError' });
    const next = session.load('second'); await rejected;
    const document = await next; expect(document.getSnapshot().source).toBe('second'); expect(workers.every(worker => worker.terminated)).toBe(true);
    const controller = new AbortController(), third = session.load('third', { signal: controller.signal }); const aborted = expect(third).rejects.toMatchObject({ name: 'AbortError' }); controller.abort(); await aborted;
    expect(session.getSnapshot().status).toBe('cancelled'); session.dispose(); await expect(session.load('fourth')).rejects.toThrow('disposed');
  });
  it('accepts custom worker registries only through an explicit registration', async () => {
    const extension = registerWorkerExtension<SyntaxExtension>({ name: 'custom', transform(root) { root.children![0].value = 'custom'; } }, { id: 'custom/v1' });
    const registry = { 'custom/v1': () => ({ name: 'custom', transform(root: MarkdownNode) { root.children![0].value = 'custom'; } }) };
    const session = createDocumentSession({ extensions: [extension], worker: () => new TestWorker(registry) });
    expect((await session.load('text')).getSnapshot().blocks[0].node.value).toBe('custom'); expect(session.getSnapshot().capabilities.worker).toBe(true);
  });
  it('invalidates registration when syntax hooks or nested tokenizer objects change', () => {
    const extension = standard().find(extension => extension.name === 'gfm')!;
    expect(workerExtensionDescriptor(extension)).toBeDefined(); extension.micromark![0].text = {};
    expect(workerExtensionDescriptor(extension)).toBeUndefined();
    const transform = standard().find(extension => extension.name === 'figures')!; transform.transform = () => {};
    expect(workerExtensionDescriptor(transform)).toBeUndefined();
    const scoped = registerWorkerExtension<SyntaxExtension>({ name: 'scoped', scope: 'local', transform() {} }, { id: 'scoped@1' });
    scoped.scope = 'document'; expect(workerExtensionDescriptor(scoped)).toBeUndefined();
    const view = standard()[0]; view.components = {}; expect(workerExtensionDescriptor(view)).toBeDefined();
  });
});

describe('UTF-8 input and conservative prose batching', () => {
  it('preserves BOM, CRLF, surrogate offsets and byte checkpoints', async () => {
    const source = '\uFEFF第一段🪶\r\n\r\n' + '中文🪶 test\n\n'.repeat(30000), bytes = new TextEncoder().encode(source);
    const decoded = await decodeDocumentInput(bytes); expect(decoded.source).toBe(source); expect(decoded.sourceIndex!.checkpoints.length).toBeGreaterThan(2);
    for (const offset of [0, 1, 2, 4, 6, source.indexOf('test'), 250000, source.length]) {
      const byte = new TextEncoder().encode(source.slice(0, offset)).length;
      // This fixture's sampled offsets do not split a surrogate pair.
      expect(utf8ByteToSourceOffset(bytes, decoded.sourceIndex!, byte)).toBe(offset);
      expect(sourceOffsetToUtf8Byte(bytes, decoded.sourceIndex!, offset)).toBe(byte);
    }
    expect((await decodeDocumentInput(new Blob([bytes]))).source).toBe(source);
  });
  it('keeps malformed UTF-8 replacement boundaries and caller bytes intact', async () => {
    const bytes = new Uint8Array([65, 0xf0, 0x9f, 0xaa, 0xb6, 0xff, 0x80, 66, 0xe2, 0x82]);
    const decoded = await decodeDocumentInput(bytes); expect(decoded.source).toBe('A🪶��B�');
    expect(sourceOffsetToUtf8Byte(bytes, decoded.sourceIndex!, 2)).toBe(1);
    for (const [source, byte] of [[0, 0], [1, 1], [3, 5], [4, 6], [5, 7], [6, 8], [7, 10]]) {
      expect(sourceOffsetToUtf8Byte(bytes, decoded.sourceIndex!, source)).toBe(byte);
      expect(utf8ByteToSourceOffset(bytes, decoded.sourceIndex!, byte)).toBe(source);
    }
    const session = createDocumentSession({ worker: () => new TestWorker() });
    await session.load(bytes); expect(bytes.length).toBe(10); expect(bytes[1]).toBe(0xf0);
  });
  it('keeps BOM source positions aligned before transforms and source annotation indexing', () => {
    const source = '\uFEFF# Heading\r\n\r\n**Bold** and <img src="/image.png" />.\r\n\r\n::%%limr%%{<#range}Selected::%%limr%%{>#range}\r\n\r\n:::limr-annotation{#note ranges="range"}\r\nNote.\r\n:::';
    const snapshot = new DocumentEngine(source, { extensions: standard() }).getSnapshot();
    expect(snapshot.blocks[0].range.start).toBe(1);
    expect(source.slice(snapshot.headings[0].range.start, snapshot.headings[0].range.end)).toBe('# Heading');
    const ranges = snapshot.annotationRanges.get('range')!;
    expect(source.slice(ranges[0].range.start, ranges[0].range.end)).toBe('Selected');
  });
  it('batches only proven independent prose and matches the complete grammar', () => {
    for (const separator of ['\n\n', '\r\n\r\n', '\r\r']) {
      const source = ['\uFEFFFirst **paragraph** with [unresolved] references.', '####### ordinary text', '#not-a-heading', 'Last paragraph.'].join(separator), calls: string[] = [];
      const parse = (value: string) => fromMarkdown(value) as unknown as MarkdownNode;
      const tree = parseInBatches(source, true, value => { calls.push(value); return parse(value); }, { minimum: 1, target: 1 });
      expect(tree).toEqual(parse(source)); expect(calls.length).toBeGreaterThan(1);
    }
  });
});
