import { describe, expect, it, vi } from 'vitest';
import { ReaderRuntime } from '../src/react/runtime';
import { citation } from '../src/extensions';

describe('application plugin commands and resource identity', () => {
  it('adds, activates, streams and removes arbitrary annotation types', () => {
    const runtime = new ReaderRuntime('plugin', 'A question', false, { annotationTypes: [{ type: 'my-codex', label: 'Codex' }] });
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
    const configuration = { annotationTypes: [{ type: 'custom', label: 'Custom' }], annotations: accepted, onAnnotationsChange: (value: typeof accepted) => { accepted = value; } };
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

describe('citation hover highlights', () => {
  const source = '<ref ids="one,two">First **passage** and more</ref> and <ref id="one">another passage</ref>.\n\n<ref id="one">Second passage</ref>.\n\n<citation id="one" title="One" />\n\n<citation id="two" title="Two" />';

  it('derives one highlight per occurrence with explicit excerpt ranges and the module color without persisting it', () => {
    const onAnnotationsChange = vi.fn();
    const runtime = new ReaderRuntime('citations', source, false, { extensions: [citation({ color: '#14b8a6' })], annotations: [], onAnnotationsChange });
    const { occurrences, highlights, referenceRanges, annotations } = runtime.decorations.get();
    expect(occurrences).toHaveLength(3);
    expect(highlights.size).toBe(3);
    expect(referenceRanges.get(occurrences[0].id)).not.toEqual(referenceRanges.get(occurrences[1].id));
    expect(referenceRanges.get(occurrences[2].id)).not.toEqual(referenceRanges.get(occurrences[0].id));
    for (const occurrence of occurrences) expect(highlights.get(`reference-${occurrence.id}`)).toMatchObject({ occurrenceId: occurrence.id, color: '#14b8a6', range: referenceRanges.get(occurrence.id) });
    runtime.hover(occurrences[1].id);
    runtime.hover(occurrences[2].id, 'sidebar');
    runtime.hover(null);
    expect(annotations.size).toBe(2);
    expect(onAnnotationsChange).not.toHaveBeenCalled();
  });

  it('refreshes colors, source ranges and opt-out behavior when configuration or source changes', () => {
    const extensions = [citation()];
    const runtime = new ReaderRuntime('citations', source, false, { extensions });
    const occurrence = runtime.decorations.get().occurrences[0];
    const range = runtime.decorations.get().referenceRanges.get(occurrence.id)!;
    runtime.document.update(source.replace(' and more', ' and even more'));
    expect(runtime.decorations.get().referenceRanges.get(occurrence.id)?.end).toBe(range.end + 5);
    runtime.configure({ extensions, annotationTypes: citation({ color: 'var(--custom-citation)' }).annotationTypes });
    expect([...runtime.decorations.get().highlights.values()].every(highlight => highlight.color === 'var(--custom-citation)')).toBe(true);
    runtime.configure({ extensions, annotationTypes: citation({ highlight: false }).annotationTypes });
    expect(runtime.decorations.get().highlights.size).toBe(0);
    expect(runtime.decorations.get().occurrences).toHaveLength(3);
  });

  it('supports ranged citations while preserving explicit saved and hidden highlights', () => {
    const runtime = new ReaderRuntime('citations', 'One passage', false, { extensions: [citation()] });
    const range = { start: 0, end: 3 };
    runtime.commands.addAnnotation({ id: 'one', type: 'citation', range });
    expect(runtime.decorations.get().annotations.size).toBe(1);
    expect([...runtime.decorations.get().highlights.values()]).toMatchObject([{ range, occurrenceId: 'citations-one-0' }]);
    runtime.commands.addAnnotation({ id: 'hidden', type: 'highlight', range, data: { color: '#F2C744', hidden: true } });
    runtime.hover('citations-one-0');
    expect(runtime.decorations.get().highlights.get('hidden')).toMatchObject({ hidden: true });
    runtime.commands.removeAnnotation('one');
    expect([...runtime.decorations.get().highlights.keys()]).toEqual(['hidden']);
    expect(runtime.interaction.get().hovered).toBeNull();
    runtime.commands.addAnnotation({ id: 'two', type: 'citation', range: { start: 4, end: 11 } }, { highlight: { color: '#81B29A' } });
    expect([...runtime.decorations.get().annotations.values()].filter(annotation => annotation.type === 'highlight')).toHaveLength(2);
  });

  it('keeps point references at zero length without deriving paragraph paint', () => {
    const runtime = new ReaderRuntime('points', 'Text<ref id="one" />.\n\n<citation id="one" title="One" />', false, { extensions: [citation()] });
    const { occurrences, highlights, referenceRanges } = runtime.decorations.get();
    expect(occurrences).toHaveLength(1);
    expect(referenceRanges.get(occurrences[0].id)).toEqual({ start: 4, end: 4 });
    runtime.hover(occurrences[0].id); runtime.activate(occurrences[0].id);
    expect(highlights.size).toBe(0);
    expect(runtime.decorations.get().highlights.size).toBe(0);
    runtime.dispose();
  });
});

describe('annotations on a shared text fragment', () => {
  it('adds a default highlight once and keeps multiple content types independent', () => {
    const runtime = new ReaderRuntime('shared', 'One fragment and another', false, { annotationTypes: [{ type: 'note', label: 'Note' }, { type: 'question', label: 'Question' }] });
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
    const runtime = new ReaderRuntime('anchors', 'First and second', false, { annotationTypes: [{ type: 'note', label: 'Note' }] });
    const first = { start: 0, end: 5 }, second = { start: 10, end: 16 };
    runtime.commands.addAnnotation({ id: 'note', type: 'note', anchors: [{ range: first }, { range: second }] });
    runtime.commands.removeAnnotationsAt([first]);
    expect(runtime.decorations.get().annotations.get('note')?.anchors).toEqual([{ range: second }]);
    expect([...runtime.decorations.get().highlights.values()].map(item => item.range)).toEqual([second]);
  });
});
