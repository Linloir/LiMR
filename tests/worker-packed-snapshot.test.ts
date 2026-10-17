import { describe, expect, it } from 'vitest';
import { DocumentEngine } from '../src/core/engine';
import { createDocumentSession, type DocumentSessionState } from '../src/core/session';
import { createDocumentWorkerHandler, createOwnedDocumentWorkerHandler } from '../src/core/worker-handler';
import type { DocumentWorkerPort, DocumentWorkerRequest, DocumentWorkerResponse } from '../src/core/worker-protocol';
import { workerExtensionDescriptor, type WorkerExtensionRegistry } from '../src/core/worker-registry';
import type { DocumentSnapshot } from '../src/core/types';
import { packSnapshot, packOwnedSnapshot, unpackSnapshot } from '../src/core/snapshot-codec';
import { standard } from '../src/extensions/standard';
import { standardWorkerRegistry } from '../src/extensions/worker-syntax';
import { parserGraphFingerprint } from '../benchmarks/core/parser-graph';

// Global references force the graph-preserving transport, while the large
// literal keeps this protocol test's parser workspace small.
const large = '# Packed document\n\n[resolved][ref] and [^note].\n\n```text\n' + 'literal '.repeat(140000)
  + '\n```\n\n[ref]: /target\n\n[^note]: Footnote body.\n';
const descriptors = standard().map(extension => workerExtensionDescriptor(extension)!);

async function collect(packedSnapshots: boolean, acceptPackedSnapshot: boolean, registry: WorkerExtensionRegistry = standardWorkerRegistry, extensions = descriptors, owned = false) {
  const handler = (owned ? createOwnedDocumentWorkerHandler : createDocumentWorkerHandler)(registry, { packedSnapshots }), messages: DocumentWorkerResponse[] = [];
  let transferred = 0;
  await handler({ type: 'load', revision: 1, id: 'packed-protocol', input: large, mode: 'blocking', extensions, acceptPackedSnapshot }, (message, transfer) => {
    transferred += transfer?.length ?? 0;
    messages.push(structuredClone(message, transfer ? { transfer } : undefined));
  });
  expect(messages.filter(message => message.type === 'error')).toEqual([]);
  return { messages, transferred };
}

class ControlledWorker implements DocumentWorkerPort {
  terminated = false;
  request?: Extract<DocumentWorkerRequest, { type: 'load' }>;
  listener?: (event: MessageEvent<DocumentWorkerResponse>) => void;
  postMessage(message: DocumentWorkerRequest) { if (message.type === 'load') this.request = message; }
  addEventListener(type: string, listener: ((event: MessageEvent<DocumentWorkerResponse>) => void) | ((event: ErrorEvent) => void)) {
    if (type === 'message') this.listener = listener as typeof this.listener;
  }
  removeEventListener() {}
  terminate() { this.terminated = true; }
  send(response: DocumentWorkerResponse) { this.listener?.({ data: response } as MessageEvent<DocumentWorkerResponse>); }
  packed(snapshot: DocumentSnapshot, version: 1 | 2 = 1) { this.send({ type: 'snapshot-packed', revision: this.request!.revision,
    packed: version === 2 ? packOwnedSnapshot(structuredClone(snapshot)) : packSnapshot(snapshot)!, progressive: false }); }
}
const small = '# Complete\n\n[link][target] and [^note].\n\n[target]: /target\n\n[^note]: Native note.\n';

describe('negotiated packed worker snapshots', () => {
  it('transfers one complete graph with bounded buffers for the trusted built-in registry', async () => {
    const { messages, transferred } = await collect(true, true);
    const message = messages.find(message => message.type === 'snapshot-packed');
    expect(message?.type).toBe('snapshot-packed'); expect(transferred).toBeGreaterThan(1);
    expect(messages.some(message => message.type === 'snapshot' || message.type === 'snapshot-start')).toBe(false);
    if (message?.type !== 'snapshot-packed') throw new Error('Missing packed result');
    const actual = unpackSnapshot<DocumentSnapshot>(message.packed);
    const expected = new DocumentEngine(large, { id: 'packed-protocol', extensions: standard() }).getSnapshot();
    expect(parserGraphFingerprint(actual)).toEqual(parserGraphFingerprint(expected));
    expect(actual.definitions.get('ref')).toBe(actual.blocks.find(block => block.node.type === 'definition')?.node);
    expect(actual.footnotes.get('note')).toBe(actual.blocks.find(block => block.node.type === 'footnoteDefinition')?.node);
  });

  it('uses a fresh owned standard tree in the shipped worker and preserves the full ordered graph', async () => {
    const { messages, transferred } = await collect(true, true, standardWorkerRegistry, descriptors, true);
    const message = messages.find(message => message.type === 'snapshot-packed');
    if (message?.type !== 'snapshot-packed') throw new Error('Missing owned packed result');
    expect(transferred).toBeGreaterThan(1);
    const expected = new DocumentEngine(large, { id: 'packed-protocol', extensions: standard() }).getSnapshot();
    const actual = unpackSnapshot<DocumentSnapshot>(message.packed);
    expect(parserGraphFingerprint(actual)).toEqual(parserGraphFingerprint(expected));
    expect(actual.definitions.get('ref')).toBe(actual.blocks.find(block => block.node.type === 'definition')?.node);
  });

  it('reports an unexpected owned payload as an error instead of cloning a consumed graph', async () => {
    const handler = createOwnedDocumentWorkerHandler({ 'limr/standard': () => ({ name: 'unexpected-payload', transform(root) {
      root.children![0].data = new Date(0);
    } }) }, { packedSnapshots: true });
    const messages: DocumentWorkerResponse[] = [];
    await handler({ type: 'load', revision: 1, id: 'owned-invalid', input: large, mode: 'blocking', extensions: [{ id: 'limr/standard' }], acceptPackedSnapshot: true }, message => messages.push(message));
    expect(messages.some(message => message.type.startsWith('snapshot'))).toBe(false);
    expect(messages.at(-1)).toMatchObject({ type: 'error', message: 'Unsupported packed snapshot graph.' });
  });

  it('releases only the private shipped-worker input after decoding', async () => {
    for (const owned of [false, true]) {
      const input = new TextEncoder().encode(small);
      const request: Extract<DocumentWorkerRequest, { type: 'load' }> = { type: 'load', revision: 1, id: 'owned-input', input, mode: 'blocking', extensions: descriptors };
      const handler = (owned ? createOwnedDocumentWorkerHandler : createDocumentWorkerHandler)(standardWorkerRegistry);
      const messages: DocumentWorkerResponse[] = [];
      await handler(request, response => messages.push(response));
      expect(request.input).toBe(owned ? '' : input);
      const result = messages.find(response => response.type === 'snapshot');
      expect(result?.type === 'snapshot' && result.snapshot.source).toBe(small);
    }
  });

  it.each([[false, true], [true, false]])('keeps legacy transport when handler=%s and receiver=%s', async (handler, receiver) => {
    const { messages, transferred } = await collect(handler, receiver);
    expect(messages.filter(message => message.type === 'snapshot')).toHaveLength(1);
    expect(messages.some(message => message.type === 'snapshot-packed')).toBe(false);
    expect(transferred).toBe(0);
  });

  it('keeps custom registry IDs on the full-clone path even when the receiver opts in', async () => {
    const id = 'custom/graph@1';
    const { messages } = await collect(true, true, { [id]: () => ({ name: 'custom', transform(root) {
      const shared = { payload: 'shared' }; root.children![0].data = shared; root.children!.at(-1)!.data = shared;
    } }) }, [{ id }]);
    const message = messages.find(message => message.type === 'snapshot');
    expect(message?.type).toBe('snapshot');
    if (message?.type !== 'snapshot') throw new Error('Missing fallback');
    expect(message.snapshot.blocks[0].node.data).toBe(message.snapshot.blocks.at(-1)!.node.data);
  });

  it('falls back before sending any packed data when a graph contains an unsupported payload', async () => {
    const { messages, transferred } = await collect(true, true, { 'limr/standard': () => ({ name: 'unexpected-payload', transform(root) {
      root.children![0].data = new Date('2026-10-17T00:00:00Z');
    } }) }, [{ id: 'limr/standard' }]);
    expect(messages.some(message => message.type === 'snapshot-packed')).toBe(false);
    expect(transferred).toBe(0);
    const message = messages.find(message => message.type === 'snapshot');
    expect(message?.type === 'snapshot' && message.snapshot.blocks[0].node.data).toBeInstanceOf(Date);
  });

  it.each([1, 2] as const)('ends the worker before decoding v%s and publishes only the complete identical snapshot', async version => {
    const port = new ControlledWorker(), extensions = standard(), states: DocumentSessionState[] = [];
    const session = createDocumentSession({ id: 'packed-session', extensions, worker: () => port });
    session.subscribe(() => states.push(session.getSnapshot()));
    const pending = session.load(small);
    expect(port.request?.acceptPackedSnapshot).toBe(true);
    const expected = new DocumentEngine(small, { id: session.id, extensions }).getSnapshot();
    port.packed(expected, version);
    expect(port.terminated).toBe(true);
    expect(session.getSnapshot().status).toBe('loading');
    const actual = (await pending).getSnapshot();
    expect(parserGraphFingerprint(actual)).toEqual(parserGraphFingerprint(expected));
    expect(actual.definitions.get('target')).toBe(actual.blocks.find(block => block.node.type === 'definition')?.node);
    expect(states.filter(state => state.status === 'loading').every(state => !state.document && !state.complete)).toBe(true);
    expect(states.map(state => state.overallProgress)).toEqual([...states.map(state => state.overallProgress)].sort((a, b) => a - b));
    expect(states.slice(1, -1).every(state => state.overallProgress >= .95 && state.overallProgress <= .99)).toBe(true);
    expect(session.getSnapshot()).toMatchObject({ status: 'ready', complete: true, overallProgress: 1 });
    session.dispose();
  });

  it('keeps external cancellation active after worker termination and ignores the pending decode', async () => {
    const port = new ControlledWorker(), session = createDocumentSession({ id: 'packed-abort', worker: () => port });
    const controller = new AbortController(), pending = session.load(small, { signal: controller.signal });
    const rejected = expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    port.packed(new DocumentEngine(small, { id: session.id }).getSnapshot(), 2);
    expect(port.terminated).toBe(true);
    controller.abort(); await rejected;
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(session.getSnapshot()).toMatchObject({ status: 'cancelled', complete: false, document: undefined });
    session.dispose();
  });

  it('rejects a superseded decode and accepts a newer ordinary worker reply', async () => {
    const ports: ControlledWorker[] = [], session = createDocumentSession({ id: 'packed-replace', worker: () => {
      const port = new ControlledWorker(); ports.push(port); return port;
    } });
    const first = session.load(small), rejected = expect(first).rejects.toMatchObject({ name: 'AbortError' });
    ports[0].packed(new DocumentEngine(small, { id: session.id }).getSnapshot(), 2);
    const second = session.load('New document.'); await rejected;
    ports[0].send({ type: 'progress', revision: ports[0].request!.revision, progress: { phase: 'ready', loaded: 1, total: 1 } });
    expect(session.getSnapshot().overallProgress).toBe(0);
    ports[1].send({ type: 'snapshot', revision: ports[1].request!.revision, snapshot: new DocumentEngine('New document.', { id: session.id }).getSnapshot(), complete: true, progressive: false });
    expect((await second).getSnapshot().source).toBe('New document.');
    await new Promise(resolve => setTimeout(resolve, 10));
    expect(session.getSnapshot().document?.getSnapshot().source).toBe('New document.');
    session.dispose();
  });

  it('reports malformed packed results without publishing a partial document', async () => {
    const port = new ControlledWorker(), session = createDocumentSession({ id: 'packed-invalid', worker: () => port });
    const pending = session.load(small), rejected = expect(pending).rejects.toThrow('Invalid packed');
    const packed = packSnapshot(new DocumentEngine(small, { id: session.id }).getSnapshot())!;
    packed.objectCount = 0x1fffffff;
    port.send({ type: 'snapshot-packed', revision: port.request!.revision, packed, progressive: false });
    await rejected;
    expect(port.terminated).toBe(true);
    expect(session.getSnapshot()).toMatchObject({ status: 'error', document: undefined, complete: false });
    session.dispose();
  });
});
