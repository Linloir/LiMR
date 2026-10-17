import { describe, expect, it } from 'vitest';
import { DocumentEngine } from '../src/core/engine';
import { walk } from '../src/core/tree';
import { createDocumentWorkerHandler, type DocumentWorkerHandlerOptions } from '../src/worker-api';
import type { DocumentWorkerRequest, DocumentWorkerResponse } from '../src/core/worker-protocol';
import type { WorkerExtensionDescriptor, WorkerExtensionRegistry } from '../src/core/worker-registry';
import type { DocumentSnapshot, SyntaxExtension } from '../src/core/types';

const localId = 'test/local-text@1';
const paragraph = `中文🪶 **styled** ${'ordinary prose '.repeat(72)}\r\n\r\n`;
const source = '\uFEFF' + paragraph.repeat(1000);
const prefixSource = '\uFEFF' + paragraph.repeat(140);
function localSyntax(): SyntaxExtension {
  return { name: 'local-text', scope: 'local', transform(root, context) {
    walk(root, node => {
      if (node.type !== 'text' || !node.position) return;
      const { start, end } = node.position;
      node.data = { original: context.source.slice(start.offset, end.offset), range: { start: start.offset, end: end.offset } };
    });
  } };
}

async function collect(input: string, registry: WorkerExtensionRegistry, descriptors: readonly WorkerExtensionDescriptor[],
  options: DocumentWorkerHandlerOptions = {}, mode: 'blocking' | 'progressive' = 'progressive') {
  const messages: DocumentWorkerResponse[] = [], handler = createDocumentWorkerHandler(registry, options);
  const receive = (response: DocumentWorkerResponse) => {
    // Model separate postMessage clones, including the full snapshot's shared
    // references. A flattened JSON comparison would miss identity regressions.
    messages.push(structuredClone(response));
    if (response.type === 'snapshot-yield') void handler({ type: 'continue', revision: response.revision }, receive);
  };
  await handler({ type: 'load', revision: 1, id: 'contract', input, mode, extensions: descriptors }, receive);
  expect(messages.filter(message => message.type === 'error')).toEqual([]);
  return messages;
}
function completeSnapshot(messages: readonly DocumentWorkerResponse[]): DocumentSnapshot {
  const complete = messages.find(message => message.type === 'snapshot' && message.complete);
  if (complete?.type === 'snapshot') return complete.snapshot;
  const start = messages.find(message => message.type === 'snapshot-start');
  if (start?.type !== 'snapshot-start') throw new Error('Missing snapshot start');
  const blocks = messages.flatMap(message => message.type === 'snapshot-blocks' ? message.blocks : []);
  const text = messages.flatMap(message => message.type === 'snapshot-source' ? [message.value] : []).join('');
  expect(text.length).toBe(start.sourceLength); expect(blocks.length).toBe(start.blockCount);
  expect(messages.at(-1)?.type).toBe('snapshot-end');
  return { ...start.metadata, source: text, blocks };
}

describe('custom worker independent-prose contracts', () => {
  it('publishes a stable UTF-16 prefix and separately cloned packets for an exact declared factory', async () => {
    expect(source.length).toBeGreaterThan(1024 * 1024);
    const messages = await collect(source, { [localId]: localSyntax }, [{ id: localId }], { independentProseExtensions: [localId] });
    const prefix = messages.find(message => message.type === 'snapshot' && !message.complete);
    expect(prefix?.type).toBe('snapshot');
    const final = completeSnapshot(messages);
    expect(final).toEqual(new DocumentEngine(source, { id: 'contract', extensions: [localSyntax()] }).getSnapshot());
    if (prefix?.type !== 'snapshot') throw new Error('Missing prefix');
    expect(prefix.progressive).toBe(true);
    expect(prefix.snapshot.source.length).toBeLessThan(source.length);
    expect(prefix.snapshot.blocks).toEqual(final.blocks.slice(0, prefix.snapshot.blocks.length));
    expect(final.blocks[0].range.start).toBe(1);
    expect(messages.filter(message => message.type === 'snapshot-blocks').length).toBeGreaterThan(1);
    expect(messages.some(message => message.type === 'snapshot-yield')).toBe(true);
    expect(DocumentEngine.fromSnapshot(final, { extensions: [localSyntax()] }).getSnapshot()).toBe(final);
  });

  it('keeps blocking publication complete while allowing bounded packet transport', async () => {
    const messages = await collect(source, { [localId]: localSyntax }, [{ id: localId }], { independentProseExtensions: [localId] }, 'blocking');
    expect(messages.some(message => message.type === 'snapshot')).toBe(false);
    expect(completeSnapshot(messages).source).toBe(source);
  });

  it('keeps an undeclared registered factory on one full clone and preserves cross-block identity', async () => {
    const factory = (): SyntaxExtension => ({ name: localId, scope: 'local', transform(root) {
      const shared = { value: 'shared payload' };
      for (const child of root.children ?? []) child.payload = shared;
    } });
    const messages = await collect(source, { [localId]: factory }, [{ id: localId }]);
    expect(messages.filter(message => message.type === 'snapshot')).toHaveLength(1);
    expect(messages.some(message => message.type === 'snapshot-start')).toBe(false);
    const final = completeSnapshot(messages);
    expect(final.blocks[0].node.payload).toBe(final.blocks.at(-1)!.node.payload);
    expect(messages.find(message => message.type === 'snapshot')).toMatchObject({ complete: true, progressive: false });
  });

  it.each([
    ['a different version', [{ id: 'test/local-text@2' }], ['test/local-text@1']],
    ['a similar name', [{ id: 'test/local-text@1-extra' }], ['test/local-text@1']],
    ['one undeclared factory', [{ id: localId }, { id: 'other@1' }], [localId]],
  ] as const)('does not infer safety from %s', async (_label, descriptors, allowed) => {
    const registry = Object.fromEntries(descriptors.map((descriptor, index) => [descriptor.id, () => ({ ...localSyntax(), name: `local-${index}` })]));
    const messages = await collect(prefixSource, registry, descriptors, { independentProseExtensions: allowed });
    expect(messages.filter(message => message.type === 'snapshot')).toHaveLength(1);
    expect(messages.find(message => message.type === 'snapshot')).toMatchObject({ complete: true, progressive: false });
  });

  it('still excludes explicit document scope and global Markdown syntax', async () => {
    const options = { independentProseExtensions: [localId] };
    const documentScope = await collect(prefixSource, { [localId]: () => ({ ...localSyntax(), scope: 'document' }) }, [{ id: localId }], options);
    const references = await collect(prefixSource + '[ref]: /target\n', { [localId]: localSyntax }, [{ id: localId }], options);
    for (const messages of [documentScope, references]) {
      expect(messages.filter(message => message.type === 'snapshot')).toHaveLength(1);
      expect(messages.find(message => message.type === 'snapshot')).toMatchObject({ complete: true, progressive: false });
    }
    expect(completeSnapshot(references).definitions.get('ref')?.url).toBe('/target');
  });

  it('retains final semantic guards when a declared factory introduces annotations', async () => {
    const factory = (): SyntaxExtension => ({ name: 'annotated', scope: 'local', transform(root) {
      root.children![0].annotation = { id: 'note', type: 'note', data: { text: 'Annotation' } };
    } });
    const messages = await collect(source, { [localId]: factory }, [{ id: localId }], { independentProseExtensions: [localId] }, 'blocking');
    expect(messages.some(message => message.type === 'snapshot-start')).toBe(false);
    expect(completeSnapshot(messages).annotations).toHaveLength(1);
  });

  it('copies the worker-owned policy instead of accepting later mutations or load assertions', async () => {
    const allowed: string[] = [], messages: DocumentWorkerResponse[] = [];
    const handle = createDocumentWorkerHandler({ [localId]: localSyntax }, { independentProseExtensions: allowed });
    allowed.push(localId);
    const request = { type: 'load', revision: 1, id: 'contract', input: prefixSource, mode: 'progressive', extensions: [{ id: localId }], independentProseExtensions: [localId] };
    await handle(request as DocumentWorkerRequest, response => messages.push(response));
    expect(messages.filter(message => message.type === 'snapshot')).toHaveLength(1);
    expect(messages.find(message => message.type === 'snapshot')).toMatchObject({ complete: true, progressive: false });
  });
});
