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
    expect(runtime.decorations.get().annotations.size).toBe(3);
    expect(runtime.interaction.get().active).toBe('controlled-first-0');
  });
  it('updates highlights in place and clears interaction when the active highlight is removed', () => {
    const runtime = new ReaderRuntime('highlights', 'Overlap these words', false, {});
    runtime.commands.addAnnotation({ id: 'lower', type: 'highlight', range: { start: 0, end: 13 } });
    runtime.commands.addAnnotation({ id: 'upper', type: 'highlight', range: { start: 0, end: 7 } });
    runtime.activateHighlight('upper'); runtime.hoverHighlight('upper');
    runtime.commands.updateAnnotation('lower', { data: { color: '#6B9BD2', style: 'wavy' } });
    expect([...runtime.decorations.get().highlights.keys()]).toEqual(['lower', 'upper']);
    expect(runtime.decorations.get().highlights.get('lower')).toMatchObject({ range: { start: 0, end: 13 }, color: '#6B9BD2', style: 'wavy' });
    runtime.commands.removeAnnotation('upper');
    expect(runtime.interaction.get()).toMatchObject({ activeHighlight: null, hoveredHighlight: null });
  });
  it('batches controlled highlight edits without dropping changes or reordering layers', () => {
    let accepted: readonly import('../src/core').Annotation[] = [{ id: 'one', type: 'highlight', range: { start: 0, end: 4 } }, { id: 'two', type: 'highlight', range: { start: 1, end: 3 } }];
    const configuration = { annotations: accepted, onAnnotationsChange: (value: typeof accepted) => { accepted = value; } };
    const runtime = new ReaderRuntime('controlled', 'Text', false, configuration);
    runtime.commands.updateAnnotation('one', { data: { color: '#81B29A' } });
    runtime.commands.updateAnnotation('one', { data: { color: '#81B29A', style: 'dotted' } });
    runtime.configure({ ...configuration, annotations: accepted });
    expect([...runtime.decorations.get().highlights.keys()]).toEqual(['one', 'two']);
    expect(runtime.decorations.get().highlights.get('one')).toMatchObject({ color: '#81B29A', style: 'dotted' });
    const readonly = new ReaderRuntime('readonly', 'Text', false, { annotations: accepted });
    expect(() => readonly.commands.updateAnnotation('one', { data: { color: 'red' } })).toThrow('onAnnotationsChange');
  });
});

describe('annotations on a shared text fragment', () => {
  it('adds a default highlight once and keeps multiple content types independent', () => {
    const runtime = new ReaderRuntime('shared', 'One fragment and another', false, {});
    const range = { start: 0, end: 12 };
    runtime.commands.addAnnotation({ id: 'note', type: 'note', range }, { edit: true });
    runtime.commands.addAnnotation({ id: 'question', type: 'question', range });
    const annotations = [...runtime.decorations.get().annotations.values()];
    expect(annotations.map(item => item.type).sort()).toEqual(['highlight', 'note', 'question']);
    expect(runtime.interaction.get()).toMatchObject({ editing: 'note', active: 'shared-note-0' });
    const highlight = annotations.find(item => item.type === 'highlight')!;
    runtime.commands.updateAnnotation(highlight.id, { data: { hidden: true } });
    expect(runtime.decorations.get().occurrences).toHaveLength(2);
    runtime.commands.removeAnnotationsAt([range]);
    expect(runtime.decorations.get().annotations.size).toBe(0);
    expect(runtime.interaction.get()).toMatchObject({ active: null, editing: null });
  });
  it('preserves unrelated ranges, including other anchors of the same annotation', () => {
    const runtime = new ReaderRuntime('anchors', 'First and second', false, {});
    const first = { start: 0, end: 5 }, second = { start: 10, end: 16 };
    runtime.commands.addAnnotation({ id: 'note', type: 'note', anchors: [{ range: first }, { range: second }] });
    runtime.commands.removeAnnotationsAt([first]);
    expect(runtime.decorations.get().annotations.get('note')?.anchors).toEqual([{ range: second }]);
    expect([...runtime.decorations.get().highlights.values()].map(item => item.range)).toEqual([second]);
  });
});
