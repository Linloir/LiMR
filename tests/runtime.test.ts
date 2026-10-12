import { describe, expect, it } from 'vitest';
import { ReaderRuntime } from '../src/react/runtime';

describe('application plugin commands and resource identity', () => {
  it('adds, activates, streams and removes arbitrary annotation types', () => {
    const runtime = new ReaderRuntime('plugin', 'A question', false, {});
    runtime.commands.addAnnotation({ id: 'answer', type: 'my-codex', range: { start: 2, end: 10 }, data: { text: '' } });
    runtime.commands.activateAnnotation('answer');
    expect(runtime.interaction.get().active).toBe('plugin-answer-0');
    runtime.commands.updateAnnotation('answer', { data: { text: '**Streamed answer**' } });
    expect(runtime.decorations.get().annotations.get('answer')?.data).toEqual({ text: '**Streamed answer**' });
    runtime.commands.removeAnnotation('answer');
    expect(runtime.decorations.get().occurrences).toHaveLength(0);
    const signal = runtime.signal;
    runtime.dispose();
    expect(signal.aborted).toBe(true);
  });
  it('shares cached results for the same annotation and refreshes changed payloads', async () => {
    const runtime = new ReaderRuntime('resources', 'Text', false, {});
    const first = { id: 'a', type: 'remote', data: 1 };
    const key = runtime.getResourceKey(first);
    expect(runtime.getResourceKey(first)).toBe(key);
    await runtime.resources.acquire(key, async () => 1).promise;
    const secondKey = runtime.getResourceKey({ ...first, data: 2 });
    expect(secondKey).not.toBe(key);
    expect(await runtime.resources.acquire(secondKey, async () => 2).promise).toBe(2);
    runtime.invalidateAnnotation('a');
    expect(await runtime.resources.acquire(secondKey, async () => 3).promise).toBe(3);
  });
  it('rejects controlled edits without a change handler', () => {
    const runtime = new ReaderRuntime('controlled', 'Text', false, { annotations: [] });
    expect(() => runtime.commands.addAnnotation({ id: 'a', type: 'custom' })).toThrow('onAnnotationsChange');
  });
  it('preserves batched controlled edits and activates after the host accepts them', () => {
    let accepted: readonly import('../src/core').Annotation[] = [];
    const configuration = { annotations: accepted, onAnnotationsChange: (value: typeof accepted) => { accepted = value; } };
    const runtime = new ReaderRuntime('controlled', 'Text', false, configuration);
    runtime.commands.addAnnotation({ id: 'first', type: 'custom', range: { start: 0, end: 4 } });
    runtime.commands.addAnnotation({ id: 'second', type: 'custom' });
    runtime.commands.activateAnnotation('first');
    runtime.configure({ ...configuration, annotations: accepted });
    expect(runtime.decorations.get().annotations.size).toBe(2);
    expect(runtime.interaction.get().active).toBe('controlled-first-0');
  });
});
