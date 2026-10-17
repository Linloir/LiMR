import { describe, expect, it } from 'vitest';
import { DocumentEngine } from '../src/core/engine';
import { DocumentSession } from '../src/core/session';
import { createDocumentWorkerHandler, provisionalPrefixEnd, type DocumentWorkerHandlerOptions } from '../src/core/worker-handler';
import { standardWorkerRegistry } from '../src/extensions/worker-syntax';
import { standard } from '../src/extensions/standard';
import { workerExtensionDescriptor, type WorkerExtensionDescriptor, type WorkerExtensionRegistry } from '../src/core/worker-registry';
import type { DocumentWorkerRequest, DocumentWorkerResponse } from '../src/core/worker-protocol';
import type { DocumentSnapshot, SyntaxExtension } from '../src/core/types';

const standardDescriptors = standard().map(extension => workerExtensionDescriptor(extension)!);
const declared = { provisionalPreviewExtensions: ['limr/standard'] };
const id = 'test/provisional@1';
const filler = 'Plain prose 汉字 astral 🪶 and neutral punctuation.\n\n'.repeat(3000);
const raw = (prefix = '[later] is resolved by the final source.\n\n', suffix = '\n\n[later]: /final-target\n') => prefix + filler + suffix;
const noop = (): SyntaxExtension => ({ name: 'test-provisional', scope: 'local' });

function aliases(value: unknown): string[] {
  const seen = new Map<object, string>(), edges: string[] = [];
  const visit = (item: unknown, path: string) => {
    if (!item || typeof item !== 'object') return;
    const previous = seen.get(item);
    if (previous !== undefined) { edges.push(`${path} -> ${previous}`); return; }
    seen.set(item, path);
    if (item instanceof Map) { let index = 0; for (const [key, value] of item) { visit(key, `${path}/map${index}/key`); visit(value, `${path}/map${index++}/value`); } }
    else if (item instanceof Set) { let index = 0; for (const value of item) visit(value, `${path}/set${index++}`); }
    else for (const key of Object.keys(item).sort()) visit((item as Record<string, unknown>)[key], `${path}/${key}`);
  };
  visit(value, '$'); return edges;
}
function finalSnapshot(messages: DocumentWorkerResponse[]): DocumentSnapshot {
  const message = messages.find(message => message.type === 'snapshot' && message.complete);
  if (message?.type === 'snapshot') return message.snapshot;
  const start = messages.find(message => message.type === 'snapshot-start');
  if (start?.type !== 'snapshot-start') throw new Error('No complete snapshot');
  expect(messages.at(-1)?.type).toBe('snapshot-end');
  const source = messages.flatMap(message => message.type === 'snapshot-source' ? [message.value] : []).join('');
  const blocks = messages.flatMap(message => message.type === 'snapshot-blocks' ? message.blocks : []);
  expect(source.length).toBe(start.sourceLength); expect(blocks.length).toBe(start.blockCount);
  return { ...start.metadata, source, blocks };
}
function prefixSnapshot(messages: DocumentWorkerResponse[]) {
  return messages.find((message): message is Extract<DocumentWorkerResponse, {type: 'snapshot'}> => message.type === 'snapshot' && !message.complete);
}
async function collect(input: string, options: DocumentWorkerHandlerOptions = declared, {
  registry = standardWorkerRegistry, descriptors = standardDescriptors, mode = 'progressive' as const,
  failPrefixSend = false,
}: { registry?: WorkerExtensionRegistry; descriptors?: readonly WorkerExtensionDescriptor[]; mode?: 'blocking' | 'progressive'; failPrefixSend?: boolean } = {}) {
  const handler = createDocumentWorkerHandler(registry, options);
  const messages: DocumentWorkerResponse[] = [];
  const receive = (message: DocumentWorkerResponse) => {
    if (failPrefixSend && message.type === 'snapshot' && !message.complete) throw new Error('Test prefix clone failure');
    messages.push(structuredClone(message));
    if (message.type === 'snapshot-yield') void handler({ type: 'continue', revision: message.revision }, receive);
  };
  await handler({ type: 'load', revision: 41, id: 'provisional-oracle', input, mode, extensions: descriptors }, receive);
  return messages;
}
function completeSnapshot(input: string): DocumentSnapshot {
  // Independent of Worker preview, transport and snapshot adoption: parse the
  // entire original input once with the normal complete DocumentEngine path.
  return new DocumentEngine(input, { id: 'provisional-oracle', extensions: standard(), streaming: false }).getSnapshot();
}
async function standardOracle(input: string, { mode = 'progressive' }: { mode?: 'blocking' | 'progressive' } = {}) {
  const after = await collect(input, declared, { mode });
  expect(after.filter(message => message.type === 'error')).toEqual([]);
  const expected = completeSnapshot(input), actual = finalSnapshot(after);
  expect(actual).toEqual(expected); expect(aliases(actual)).toEqual(aliases(expected));
  return { after, actual };
}
function rangesWithin(snapshot: DocumentSnapshot) {
  const seen = new Set<object>();
  const visit = (value: unknown) => {
    if (!value || typeof value !== 'object' || seen.has(value)) return;
    seen.add(value);
    const object = value as Record<string, any>;
    if (object.position?.start?.offset !== undefined && object.position?.end?.offset !== undefined) {
      expect(object.position.start.offset).toBeGreaterThanOrEqual(0);
      expect(object.position.end.offset).toBeGreaterThanOrEqual(object.position.start.offset);
      expect(object.position.end.offset).toBeLessThanOrEqual(snapshot.source.length);
    }
    if (typeof object.start === 'number' && typeof object.end === 'number') {
      expect(object.start).toBeGreaterThanOrEqual(0); expect(object.end).toBeGreaterThanOrEqual(object.start); expect(object.end).toBeLessThanOrEqual(snapshot.source.length);
    }
    if (value instanceof Map) { for (const [key, item] of value) { visit(key); visit(item); } }
    else if (value instanceof Set) { for (const item of value) visit(item); }
    else Object.values(object).forEach(visit);
  };
  visit(snapshot);
}

describe('generic provisional Worker preview', () => {
  it('keeps the blocking protocol independent of preview permission, including full AST aliases', async () => {
    const input = raw();
    const before = await collect(input, {}, { mode: 'blocking' });
    const { after } = await standardOracle(input, { mode: 'blocking' });
    expect(after).toEqual(before); expect(prefixSnapshot(after)).toBeUndefined();
  });

  it('keeps an actually published independent stable prefix and its packet permission unchanged', async () => {
    // Exercise the >1 MiB packet and >2048-block ACK boundaries with 3000
    // paragraphs. Generic-preview permission must not change this existing path.
    const input = ('Ordinary 汉字 prose. '.repeat(20) + '\n\n').repeat(3000);
    expect(input.length).toBeGreaterThan(1024 * 1024);
    const run = async (options: DocumentWorkerHandlerOptions) => {
      const messages = await collect(input, options);
      let phase = 'prefix', sourceACKs = 0, blockACKs = 0;
      for (const message of messages) {
        if (message.type === 'snapshot-source') phase = 'source';
        if (message.type === 'snapshot-blocks') phase = 'blocks';
        if (message.type === 'snapshot-yield') {
          if (phase === 'source') sourceACKs++; else if (phase === 'blocks') blockACKs++;
        }
      }
      const snapshot = finalSnapshot(messages);
      expect(snapshot.blocks.length).toBe(3000);
      expect(sourceACKs).toBeGreaterThanOrEqual(1); expect(blockACKs).toBeGreaterThanOrEqual(2);
      return messages;
    };
    const before = await run({}), after = await run(declared);
    const expected = completeSnapshot(input), actual = finalSnapshot(after);
    expect(actual).toEqual(expected); expect(aliases(actual)).toEqual(aliases(expected));
    expect(prefixSnapshot(before)).toBeDefined(); expect(after).toEqual(before);
    expect(after.some(message => message.type === 'snapshot-start')).toBe(true);
  });

  it.each(['甲'.repeat(140000), 'A'.repeat(45000) + '\n' + '汉'.repeat(100000)])('provides a bounded prefix when the independent proof has no blank-line endpoint (%#)', async input => {
    const before = await collect(input, {});
    const { after, actual } = await standardOracle(input);
    expect(finalSnapshot(before)).toEqual(actual);
    expect(aliases(finalSnapshot(before))).toEqual(aliases(actual));
    expect(prefixSnapshot(before)).toBeUndefined();
    const prefix = prefixSnapshot(after)!;
    expect(prefix.snapshot.source).toBe(input.slice(0, 32768));
    expect(prefix.snapshot.streaming).toBe(true); rangesWithin(prefix.snapshot);
  });

  it.each([
    ['fenced code', '```text\n', '\n```'],
    ['indented code', '    unfinished code ', '\nnext'],
    ['HTML', '<section>unfinished ', '</section>'],
    ['registered component', '<Definition title="partial', '">content</Definition>'],
    ['math', '$$\nunfinished ', '\n$$'],
    ['list', '- unfinished **item ', '**\n- next'],
    ['comment', '<!-- unfinished ', '-->'],
    ['reference', '[missing][later] ', '\n[later]: /later'],
    ['footnote', 'text[^later] ', '\n[^later]: complete footnote'],
    ['source annotation', '::%%note[unfinished', ']%%'],
  ])('leaves final %s semantics identical to the complete DocumentEngine', async (_name, open, close) => {
    const head = 'First readable paragraph.\n\n' + 'a'.repeat(32700) + '\n\n' + open;
    const input = head + filler + close + '\n\n[final-global]: /target\n';
    const { after } = await standardOracle(input);
    const prefix = prefixSnapshot(after);
    expect(prefix).toBeDefined(); expect(prefix!.snapshot.streaming).toBe(true);
    expect(prefix!.snapshot.source).toBe(input.slice(0, provisionalPrefixEnd(input)));
    expect(prefix!.snapshot.source.length).toBeLessThanOrEqual(32768);
    rangesWithin(prefix!.snapshot); rangesWithin(finalSnapshot(after));
    expect(after.some(message => message.type === 'snapshot-start')).toBe(false);
  });

  it.each([
    ['astral crossing', 'a'.repeat(32767) + '🪶' + filler, 32767],
    ['CRLF crossing', 'a'.repeat(32767) + '\r\n' + filler, 32767],
    ['lone high surrogate', 'a'.repeat(32767) + '\uD800X' + filler, 32768],
    ['lone low surrogate', 'a'.repeat(32767) + '\uDC00X' + filler, 32768],
    ['BOM NUL tab', '\uFEFF\0\t' + 'a'.repeat(32766) + filler, 32768],
  ])('keeps exact source units at %s', async (_name, source, end) => {
    expect(provisionalPrefixEnd(source)).toBe(end);
    const { after } = await standardOracle(source + '\n\n[global]: /end\n');
    const prefix = prefixSnapshot(after)!;
    expect(prefix.snapshot.source).toBe(source.slice(0, end)); rangesWithin(prefix.snapshot);
  });

  it('clones the whole options graph, preserving its internal aliases and isolating final mutation', async () => {
    const shared = { visits: 0 }, descriptors = [{ id: 'test/one@1', options: { shared } }, { id: 'test/two@1', options: { shared } }];
    const registry = Object.fromEntries(descriptors.map((descriptor, index) => [descriptor.id, (options: unknown): SyntaxExtension => {
      const own = (options as {shared: typeof shared}).shared;
      return { name: `owner-${index}`, scope: 'document', transform(root) {
        own.visits++;
        for (const child of root.children ?? []) child[`payload${index}`] = own;
      } };
    }]));
    const messages = await collect(raw(), { provisionalPreviewExtensions: descriptors.map(value => value.id) }, { registry, descriptors });
    expect(messages.filter(message => message.type === 'error')).toEqual([]);
    const prefix = prefixSnapshot(messages)!, final = finalSnapshot(messages);
    expect(prefix).toBeDefined(); expect(shared.visits).toBe(2);
    for (const snapshot of [prefix.snapshot, final]) {
      const first = snapshot.blocks[0].node;
      expect(first.payload0).toBe(first.payload1);
      expect(first.payload0).toBe(snapshot.blocks.at(-1)!.node.payload0);
      expect(first.payload0).toEqual({ visits: 2 });
    }
    expect(prefix.snapshot.blocks[0].node.payload0).not.toBe(final.blocks[0].node.payload0);
    expect(messages.some(message => message.type === 'snapshot-start')).toBe(false);
  });

  it.each(['default deny', 'wrong version', 'partial list', 'scope-only without declaration'])('does not infer the new capability: %s', async kind => {
    const descriptors = kind === 'partial list' ? [{ id }, { id: 'test/other@1' }] : [{ id }];
    const registry = Object.fromEntries(descriptors.map((descriptor, index) => [descriptor.id, () => ({ ...noop(), name: `item-${index}` })]));
    const options = kind === 'default deny' || kind === 'scope-only without declaration' ? {} : { provisionalPreviewExtensions: [kind === 'wrong version' ? 'test/provisional@2' : id] };
    const messages = await collect(raw(), options, { registry, descriptors });
    expect(prefixSnapshot(messages)).toBeUndefined(); expect(finalSnapshot(messages).source).toBe(raw());
  });

  it.each(['factory', 'preprocess', 'transform', 'send'])('keeps an optional %s failure out of the final result', async failure => {
    let calls = 0;
    const registry = { [id]: (): SyntaxExtension => {
      if (++calls === 2 && failure === 'factory') throw new Error('Optional factory failure');
      return { name: 'failure-probe', scope: 'local',
        preprocess(context) { if (context.streaming && failure === 'preprocess') throw new Error('Optional preprocess failure'); return []; },
        transform(_root, context) { if (context.streaming && failure === 'transform') throw new Error('Optional transform failure'); },
      };
    } };
    const messages = await collect(raw(), { provisionalPreviewExtensions: [id] }, { registry, descriptors: [{ id }], failPrefixSend: failure === 'send' });
    expect(prefixSnapshot(messages)).toBeUndefined(); expect(messages.filter(message => message.type === 'error')).toEqual([]);
    expect(finalSnapshot(messages).source).toBe(raw()); expect(finalSnapshot(messages).diagnostics).toEqual([]);
    expect(calls).toBe(2);
  });

  it('still reports a real final failure after the preview succeeded', async () => {
    const registry = { [id]: (): SyntaxExtension => ({ name: 'final-failure', scope: 'local', preprocess(context) { if (!context.streaming) throw new Error('Actual final failure'); return []; } }) };
    const messages = await collect(raw(), { provisionalPreviewExtensions: [id] }, { registry, descriptors: [{ id }] });
    expect(prefixSnapshot(messages)).toBeDefined();
    expect(messages.at(-1)).toMatchObject({ type: 'error', message: 'Actual final failure' });
    expect(messages.some(message => message.type === 'snapshot' && message.complete)).toBe(false);
  });

  it('treats an uncloneable direct-handler preview descriptor as optional', async () => {
    // Real Worker descriptors have already crossed postMessage; this locks the
    // public handler's direct-call failure boundary without faking a browser.
    let calls = 0;
    const messages = await collect(raw(), { provisionalPreviewExtensions: [id] }, {
      registry: { [id]: () => { calls++; return noop(); } }, descriptors: [{ id, options: { uncloneable: new WeakMap() } }],
    });
    expect(prefixSnapshot(messages)).toBeUndefined(); expect(finalSnapshot(messages).source).toBe(raw()); expect(calls).toBe(1);
  });

  it('ignores old completion after cancellation and replacement from a generic prefix', async () => {
    const work: Promise<void>[] = [], ports: {terminated:boolean}[] = [], observations: {status:string;source?:string}[] = [];
    const session = new DocumentSession({ id: 'replacement', mode: 'progressive', fallback: 'error', extensions: standard(), registry: standardDescriptors,
      worker: () => {
        const port = {terminated:false}; ports.push(port);
        const listeners = new Set<(event:any)=>void>(), handler = createDocumentWorkerHandler(standardWorkerRegistry,declared);
        return { postMessage(request:DocumentWorkerRequest) {
          work.push(handler(request,response=>{
            // Intentionally deliver even after terminate, so the session's
            // revision guard is exercised instead of hidden by this fake port.
            for(const listener of listeners) listener({data:structuredClone(response)});
          }));
        }, addEventListener(type:string,listener:any) {if(type==='message')listeners.add(listener);}, removeEventListener(type:string,listener:any) {if(type==='message')listeners.delete(listener);}, terminate(){port.terminated=true;} };
      },
    });
    const unsubscribe = session.subscribe(()=>{const state=session.getSnapshot();observations.push({status:state.status,source:state.document?.getSnapshot().source});});
    const first = session.load(raw()).then(()=>{throw new Error('Old load unexpectedly ready');}, error=>error);
    await new Promise<void>(resolve=>{
      const off=session.subscribe(()=>{if(session.getSnapshot().document&&!session.getSnapshot().complete){off();resolve();}});
    });
    session.cancel(); const replacement='Replacement after cancellation.';
    await session.load(replacement);
    expect((await first).name).toBe('AbortError');
    // A second pass includes work registered by a continuation, if any.
    await Promise.all(work); await Promise.all(work);
    expect(observations.filter(value=>value.status==='ready').map(value=>value.source)).toEqual([replacement]);
    expect(session.getSnapshot().document!.getSnapshot().source).toBe(replacement);
    expect(ports.every(port=>port.terminated)).toBe(true);unsubscribe();session.dispose();
  });

  it('copies the owner allowlist and ignores a forged load permission', async () => {
    const allowed: string[] = [], messages: DocumentWorkerResponse[] = [];
    const handler = createDocumentWorkerHandler({ [id]: noop }, { provisionalPreviewExtensions: allowed });
    allowed.push(id);
    const request = { type: 'load', id: 'provisional-oracle', revision: 1, input: raw(), mode: 'progressive', extensions: [{ id }], provisionalPreviewExtensions: [id] };
    await handler(request as DocumentWorkerRequest, response => messages.push(structuredClone(response)));
    expect(prefixSnapshot(messages)).toBeUndefined(); expect(finalSnapshot(messages).source).toBe(raw());
  });
});
