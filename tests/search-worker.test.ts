import { Worker } from 'node:worker_threads';
import { expect, it } from 'vitest';
import { SearchMatcher, searchWorkerSource, type SearchWorkerPort } from '../src/core/search-worker';

function worker(): SearchWorkerPort {
  const thread = new Worker(`const { parentPort } = require('node:worker_threads');
globalThis.self = { postMessage: message => parentPort.postMessage(message) };
parentPort.on('message', data => self.onmessage({ data }));
${searchWorkerSource}`, { eval: true });
  const listeners = new Map<Function, (data: unknown) => void>();
  return {
    postMessage: message => thread.postMessage(message),
    addEventListener(type, listener) { const handler = (data: unknown) => listener(type === 'message' ? { data } : data); listeners.set(listener, handler); thread.on(type, handler); },
    removeEventListener(type, listener) { const handler = listeners.get(listener); if (handler) thread.off(type, handler); listeners.delete(listener); },
    terminate() { void thread.terminate(); },
  };
}
it('supports regex, case, Unicode offsets, anchors and zero-width progress in a real worker', async () => {
  const matcher = new SearchMatcher('(?=😀)|^ID-\\d+|😀|word', { regex: true, caseSensitive: true, worker });
  try {
    expect(await matcher.scan(['ID-42\nword WORD 😀'], 20)).toEqual({ matches: [[{ start: 0, end: 5 }, { start: 6, end: 10 }]], limited: false });
  } finally { matcher.dispose(); }
  const unicode = new SearchMatcher('😀|word', { regex: true, worker });
  try { expect((await unicode.scan(['😀 WORD word'], 10)).matches[0]).toEqual([{ start: 0, end: 2 }, { start: 3, end: 7 }, { start: 8, end: 12 }]); }
  finally { unicode.dispose(); }
});
it('escapes literal regex syntax and limits dense results', async () => {
  const matcher = new SearchMatcher('[A+B]', { worker });
  try { expect(await matcher.scan(['[a+b] [A+B] [a+b]'], 2)).toEqual({ matches: [[{ start: 0, end: 5 }, { start: 6, end: 11 }]], limited: true }); }
  finally { matcher.dispose(); }
});
it('terminates catastrophic backtracking without blocking the caller', async () => {
  const matcher = new SearchMatcher('(a+)+$', { regex: true, worker, timeoutMs: 80 });
  const started = performance.now();
  await expect(matcher.scan(['a'.repeat(200) + '!'], 10)).rejects.toMatchObject({ name: 'SearchTimeoutError' });
  expect(performance.now() - started).toBeLessThan(2000);
});
it('aborts a running expression and rejects invalid syntax before scanning', async () => {
  expect(() => new SearchMatcher('[', { regex: true, worker })).toThrow(SyntaxError);
  const controller = new AbortController(), matcher = new SearchMatcher('(a+)+$', { regex: true, worker, signal: controller.signal });
  const result = matcher.scan(['a'.repeat(200) + '!'], 10);
  setTimeout(() => controller.abort(), 40);
  await expect(result).rejects.toMatchObject({ name: 'AbortError' });
});
