import { expect, it, vi } from 'vitest';
import { ReaderRuntime } from '../src/react/runtime';
import { copyText, highlightSelection } from '../src/extensions/actions';

it('enforces explicit read-only source and annotation transactions without changing ordinary readers', () => {
  const onSourceChange = vi.fn(), onAnnotationsChange = vi.fn();
  const annotation = { id: 'highlight', type: 'highlight', range: { start: 0, end: 4 }, data: { color: '#fed' } };
  const config = { readOnly: true, onSourceChange, onAnnotationsChange, annotations: [annotation] };
  const runtime = new ReaderRuntime('read-only', 'Text body.', false, config);
  const before = runtime.document.getSnapshot();
  expect(runtime.commands.canEditSource()).toBe(false);
  expect(runtime.commands.canEditAnnotation(annotation.id)).toBe(false);
  expect(() => runtime.commands.editSource([{ range: { start: 0, end: 4 }, text: 'Changed' }])).toThrow('read-only');
  expect(() => runtime.commands.addAnnotation({ ...annotation, id: 'new' })).toThrow('read-only');
  expect(() => runtime.commands.updateAnnotation(annotation.id, { data: { color: '#abc' } })).toThrow('read-only');
  expect(() => runtime.commands.removeAnnotation(annotation.id)).toThrow('read-only');
  expect(() => runtime.commands.removeAnnotationsAt([{ start: 0, end: 4 }])).toThrow('read-only');
  runtime.commands.editAnnotation(annotation.id);
  expect(runtime.interaction.get().editing).toBeNull();
  expect(runtime.document.getSnapshot()).toBe(before);
  expect(onSourceChange).not.toHaveBeenCalled(); expect(onAnnotationsChange).not.toHaveBeenCalled();
  runtime.configure({ ...config, readOnly: false });
  expect(runtime.commands.canEditSource()).toBe(true);
  expect(runtime.commands.canEditAnnotation(annotation.id)).toBe(true);
  runtime.commands.updateAnnotation(annotation.id, { data: { color: '#abc' } });
  expect(onAnnotationsChange).toHaveBeenCalledOnce();
});

it('marks source/text clipboard actions safe for explicit read-only presentation', () => {
  expect(copyText().readOnly).toBe(true); expect(copyText({ format: 'raw' }).readOnly).toBe(true);
  expect(highlightSelection().readOnly).not.toBe(true);
});
