import { describe, expect, it, vi } from 'vitest';
import { applySourceEdits } from '../src/core';
import { standard } from '../src/extensions';
import { ReaderRuntime } from '../src/react/runtime';

const fixture = 'Before ==words==[^%%limr:r1%%] after.\n\n:::limr-annotation{#n1 ranges="r1" type="footnote"}\nA note.\n:::\n';
const setup = (source = fixture) => {
  const accept = vi.fn();
  const runtime = new ReaderRuntime('source', source, false, { extensions: standard(), annotationTypes: [{ type: 'question', label: 'Question' }], onSourceChange: accept });
  return { runtime, accept };
};

describe('atomic source editing capability', () => {
  it('does not emit another source edit or reparse when the controlled host echoes accepted text', () => {
    const { runtime, accept } = setup('text');
    runtime.commands.editSource([{ range: { start: 0, end: 1 }, text: 'T' }]);
    const accepted = runtime.document.getSnapshot();
    runtime.document.update(accept.mock.calls[0][0], { streaming: false });
    expect(runtime.document.getSnapshot()).toBe(accepted);
    expect(accept).toHaveBeenCalledTimes(1);
    runtime.document.update('External file change', { streaming: false });
    expect(accept).toHaveBeenCalledTimes(1);
  });
  it('keeps regular insertions external even when source editing and a writer are enabled', () => {
    const { runtime, accept } = setup('Some words.');
    runtime.commands.addAnnotation({ id: 'external', type: 'footnote', range: { start: 0, end: 4 }, data: { body: 'Ordinary note' } });
    expect(accept).not.toHaveBeenCalled();
    expect(runtime.document.getSnapshot().source).toBe('Some words.');
    expect(runtime.decorations.get().annotations.get('external')?.source).toBeUndefined();
    runtime.commands.addAnnotation({ id: 'inline', type: 'footnote', range: { start: 5, end: 10 }, data: { body: 'Inline note' } }, { target: 'source' });
    expect(accept).toHaveBeenCalledTimes(1);
    expect(runtime.document.getSnapshot().source).toContain('Inline note');
    expect(runtime.document.getSnapshot().source).not.toContain('Ordinary note');
  });
  it('uses the standard source serializer when the host enables source editing', () => {
    const runtime = new ReaderRuntime('default', 'Text.', false, { extensions: standard(), onSourceChange: () => {} });
    expect(runtime.commands.canEditSource()).toBe(true);
    runtime.commands.addAnnotation({ id: 'inline', type: 'footnote', range: { start: 0, end: 4 }, data: { body: 'Saved inline' } }, { target: 'source' });
    expect(runtime.document.getSnapshot().source).toContain('Saved inline');
    expect(runtime.document.getSnapshot().annotations.find(annotation => annotation.id === 'inline')?.source?.module).toBe('source-annotations');
  });
  it('validates all UTF-16 edits before applying them and preserves CRLF', () => {
    expect(applySourceEdits('😀\r\n- [ ] task', [{ range: { start: 7, end: 8 }, text: 'x' }, { range: { start: 0, end: 2 }, text: '🌱' }])).toBe('🌱\r\n- [x] task');
    expect(() => applySourceEdits('abc', [{ range: { start: 0, end: 2 }, text: '' }, { range: { start: 1, end: 3 }, text: '' }])).toThrow('overlap');
    expect(() => applySourceEdits('abc', [{ range: { start: 4, end: 4 }, text: '' }])).toThrow('outside');
    expect(() => applySourceEdits('abc', [{ range: { start: .5, end: 1 }, text: '' }])).toThrow('outside');
  });
  it('is opt-in, rejects stale edits and disables mutation during generation', () => {
    const readonly = new ReaderRuntime('readonly', 'text', false, { extensions: standard() });
    expect(readonly.commands.canEditSource()).toBe(false);
    expect(() => readonly.commands.editSource([{ range: { start: 0, end: 1 }, text: 'T' }])).toThrow('onSourceChange');
    const { runtime, accept } = setup('text');
    const revision = runtime.document.getSnapshot().revision;
    runtime.commands.editSource([{ range: { start: 0, end: 1 }, text: 'T' }], { revision });
    expect(runtime.document.getSnapshot().source).toBe('Text');
    expect(accept.mock.calls[0][1].document.source).toBe('text');
    expect(() => runtime.commands.editSource([], { revision })).toThrow('stale');
    runtime.document.update('Text', { streaming: true });
    expect(runtime.commands.canEditSource()).toBe(false);
    expect(() => runtime.commands.editSource([])).toThrow('streaming');
  });
  it('does not publish rejected edits or mutate source when a handler throws', () => {
    const runtime = new ReaderRuntime('reject', fixture, false, { extensions: standard(), onSourceChange: () => false });
    expect(runtime.commands.editSource([{ range: { start: 0, end: 6 }, text: 'After' }])).toBe(false);
    runtime.commands.updateAnnotation('n1', { data: { body: 'Rejected' } });
    expect(runtime.document.getSnapshot().source).toBe(fixture);
    expect(runtime.decorations.get().annotations.get('n1')?.data).toEqual({ body: 'A note.' });
  });
  it('keeps default browser annotations external and source annotations read-only', () => {
    const runtime = new ReaderRuntime('default', fixture, false, { extensions: standard() });
    runtime.commands.addAnnotation({ id: 'external', type: 'footnote', range: { start: 0, end: 6 }, data: { body: 'Remote' } });
    expect(runtime.document.getSnapshot().source).toBe(fixture);
    expect(runtime.commands.canEditAnnotation('external')).toBe(true);
    expect(runtime.commands.canEditAnnotation('n1')).toBe(false);
    expect(() => runtime.commands.updateAnnotation('n1', { data: { body: 'No' } })).toThrow('read-only');
  });
  it('preserves source ownership when updates attempt to replace or remove metadata', () => {
    const { runtime, accept } = setup();
    runtime.commands.updateAnnotation('n1', { source: undefined, data: { body: 'Still in source' } });
    expect(accept).toHaveBeenCalledTimes(1);
    expect(runtime.document.getSnapshot().source).toContain('Still in source');
    expect(runtime.decorations.get().annotations.get('n1')?.source?.module).toBe('source-annotations');
    runtime.commands.updateAnnotation('n1', { source: { module: 'foreign', ranges: [] }, data: { body: 'Still owned' } });
    expect(runtime.document.getSnapshot().source).toContain('Still owned');
    expect(runtime.decorations.get().annotations.get('n1')?.source?.module).toBe('source-annotations');
  });
  it('does not enter editing or retain a pending open request after a rejected add', () => {
    const runtime = new ReaderRuntime('reject-add', 'Text.', false, { extensions: standard(), onSourceChange: () => false });
    runtime.commands.addAnnotation({ id: 'rejected', type: 'footnote', range: { start: 0, end: 4 }, data: { body: 'No' } }, { edit: true, target: 'source' });
    expect(runtime.interaction.get()).toMatchObject({ editing: null, active: null });
    runtime.configure({ extensions: standard(), onSourceChange: () => {} });
    runtime.commands.addAnnotation({ id: 'rejected', type: 'footnote', range: { start: 0, end: 4 }, data: { body: 'Later' } }, { target: 'source' });
    expect(runtime.interaction.get()).toMatchObject({ editing: null, active: null });
  });
});

describe('source annotation serialization', () => {
  it('creates a shared named range for a note and its explicit highlight in one transaction', () => {
    const { runtime, accept } = setup('Some **words** here.');
    runtime.commands.addAnnotation({ id: 'new', type: 'footnote', range: { start: 5, end: 14 }, data: { body: 'A **note**.' } }, { highlight: { color: '#E5C07B' }, edit: true, target: 'source' });
    const snapshot = runtime.document.getSnapshot();
    expect(accept).toHaveBeenCalledTimes(1);
    expect(snapshot.annotationRanges.size).toBe(1);
    expect(snapshot.annotations).toHaveLength(2);
    expect(snapshot.annotations.map(item => item.type).sort()).toEqual(['footnote', 'highlight']);
    expect(snapshot.annotations.every(item => item.source?.module === 'source-annotations')).toBe(true);
    expect(snapshot.annotations[0].anchors?.[0].range).toEqual({ start: 7, end: 16 });
    expect(runtime.decorations.get().occurrences).toHaveLength(1);
    expect(runtime.interaction.get().editing).toBe('new');
    expect(runtime.interaction.get().active).toBe(runtime.decorations.get().occurrences[0].id);
  });
  it('updates, upserts and removes definitions without resurrecting duplicate IDs', () => {
    const { runtime } = setup(fixture + '\n:::limr-annotation{#n1 ranges="r1" type="footnote"}\nNewest\n:::\n');
    runtime.commands.updateAnnotation('n1', { data: { body: 'Updated **body**' } });
    expect(runtime.document.getSnapshot().source.match(/limr-annotation/g)).toHaveLength(1);
    expect(runtime.document.getSnapshot().annotations[0].data).toEqual({ body: 'Updated **body**' });
    const range = runtime.document.getSnapshot().annotations[0].anchors![0].range;
    runtime.commands.addAnnotation({ id: 'n1', type: 'question', range, data: { body: 'Question?' } }, { highlight: false, target: 'source' });
    expect(runtime.document.getSnapshot().annotations[0].type).toBe('question');
    runtime.commands.removeAnnotation('n1');
    expect(runtime.document.getSnapshot().source.trim()).toBe('Before words after.');
    expect(runtime.document.getSnapshot().annotations).toHaveLength(0);
  });
  it('preserves a range while another annotation uses it and clears all selected annotations', () => {
    const { runtime } = setup(fixture + '\n:::limr-annotation{#q1 ranges="r1" type="question"}\nWhy?\n:::\n');
    runtime.commands.removeAnnotation('n1');
    expect(runtime.document.getSnapshot().source).toContain('==words==[^%%limr:r1%%]');
    expect(runtime.document.getSnapshot().annotations.map(item => item.id)).toEqual(['q1']);
    runtime.commands.removeAnnotationsAt([{ start: 9, end: 14 }]);
    expect(runtime.document.getSnapshot().source.trim()).toBe('Before words after.');
  });
  it('retains other ranges when removing one anchor of a shared annotation', () => {
    const source = '==one==[^%%limr:a%%] and ==two==[^%%limr:b%%]\n\n:::limr-annotation{#n ranges="a b" type="footnote"}\nBoth\n:::';
    const { runtime } = setup(source);
    runtime.commands.removeAnnotationsAt([{ start: 2, end: 5 }]);
    const snapshot = runtime.document.getSnapshot();
    expect(snapshot.source).toMatch(/^one and ==two==\[\^%%limr:b%%\]/);
    expect(snapshot.annotations[0].anchors).toHaveLength(1);
    expect(snapshot.annotations[0].source?.rangeIds).toEqual(['b']);
  });
  it('upgrades a plain inline highlight and applies appearance changes from source', () => {
    const { runtime } = setup('Before ==blue **words**== after.');
    const original = runtime.document.getSnapshot().annotations[0];
    expect(runtime.commands.canEditAnnotation(original.id)).toBe(true);
    runtime.commands.updateAnnotation(original.id, { data: { color: '#E57373', style: 'wavy', hidden: true } });
    const changed = runtime.document.getSnapshot().annotations[0];
    expect(changed.source?.module).toBe('source-annotations');
    expect(changed.data).toMatchObject({ color: '#E57373', style: 'wavy', hidden: true });
    runtime.commands.removeAnnotation(changed.id);
    expect(runtime.document.getSnapshot().source.trim()).toBe('Before blue **words** after.');
  });
  it('preserves Markdown bodies with nested directives, escaped attributes and CRLF', () => {
    const { runtime } = setup('Words.\r\n');
    runtime.commands.addAnnotation({ id: 'n"&', type: 'footnote', range: { start: 0, end: 5 }, data: { title: 'A "quote" & B', body: ':::note\nNested **body**\n:::' } }, { highlight: false, target: 'source' });
    const snapshot = runtime.document.getSnapshot();
    expect(snapshot.annotations[0].id).toBe('n"&');
    expect(snapshot.annotations[0].data).toMatchObject({ title: 'A "quote" & B', body: ':::note\nNested **body**\n:::' });
    expect(snapshot.source).toContain('\r\n\r\n::::limr-annotation');
  });
  it('supports point annotations and refuses unsupported source ranges without changing text', () => {
    const { runtime } = setup('Text.');
    runtime.commands.addAnnotation({ id: 'point', type: 'footnote', range: { start: 4, end: 4 }, data: { body: 'At this point' } }, { target: 'source' });
    expect(runtime.document.getSnapshot().annotations[0].anchors?.[0].range).toEqual({ start: 4, end: 4 });
    const code = setup('```js\nconst a = 1;\n```');
    const original = code.runtime.document.getSnapshot().source;
    expect(() => code.runtime.commands.addAnnotation({ id: 'code', type: 'highlight', range: { start: 0, end: original.length } }, { target: 'source' })).toThrow('inline text range');
    expect(code.runtime.document.getSnapshot().source).toBe(original);
  });
  it('lets a later module own serialization through the same source capability', () => {
    const { runtime } = setup('word');
    const handler = vi.fn(() => [{ range: { start: 4, end: 4 }, text: ' custom' }]);
    runtime.configure({ extensions: [...standard(), { name: 'custom-writer', sourceEditing: { annotations: handler } }], onSourceChange: () => {} });
    runtime.commands.addAnnotation({ id: 'custom', type: 'custom', range: { start: 0, end: 4 } }, { highlight: false, target: 'source' });
    expect(handler).toHaveBeenCalledTimes(1);
    expect(runtime.document.getSnapshot().source).toBe('word custom');
  });
});
