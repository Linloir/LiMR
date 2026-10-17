import { expect, it, vi } from 'vitest';
import { ReaderRuntime, type ViewAnnotation } from '../src/react/runtime';

it('leases computed annotations to shared views without editing or duplicating source markers', () => {
  const onSourceChange = vi.fn(), onAnnotationsChange = vi.fn();
  const config = { onSourceChange, onAnnotationsChange };
  const runtime = new ReaderRuntime('table', 'Original cell content', false, config);
  const owner = {}, document = runtime.document.getSnapshot();
  const entry: ViewAnnotation = {
    annotation: { id: 'table-detail', type: 'table-cell', range: { start: 0, end: 8 } },
    occurrence: { id: 'table-detail-anchor', annotationIds: ['table-detail'], range: { start: 0, end: 8 }, referenceRange: { start: 0, end: 8 } },
    type: { type: 'table-cell', label: 'Complete cell' },
  };
  runtime.setViewAnnotations(owner, [entry]);
  expect(runtime.decorations.get().occurrences).toEqual([{ ...entry.occurrence, embedded: true }]);
  expect(runtime.decorations.get().byBlock.size).toBe(0);
  expect(runtime.commands.canEditAnnotation('table-detail')).toBe(false);
  runtime.commands.activateAnnotation('table-detail');
  expect(runtime.interaction.get().active).toBe('table-detail-anchor');
  runtime.configure({ ...config, theme: 'dark' });
  expect(runtime.annotationTypes.get('table-cell')?.label).toBe('Complete cell');
  expect(runtime.document.getSnapshot()).toBe(document);
  expect(onSourceChange).not.toHaveBeenCalled();
  expect(onAnnotationsChange).not.toHaveBeenCalled();
  runtime.setViewAnnotations(owner, []);
  expect(runtime.decorations.get().occurrences).toEqual([]);
  expect(runtime.interaction.get().active).toBeNull();
  expect(runtime.annotationTypes.has('table-cell')).toBe(false);
});

it('retains another owner when a computed table view is unmounted', () => {
  const runtime = new ReaderRuntime('two', 'Two tables', false, {}), first = {}, second = {};
  const entry = (id: string): ViewAnnotation => ({ annotation: { id, type: 'detail' }, occurrence: { id: `${id}-anchor`, annotationIds: [id], range: { start: 0, end: 3 } }, type: { type: 'detail', label: 'Detail' } });
  runtime.setViewAnnotations(first, [entry('one')]); runtime.setViewAnnotations(second, [entry('two')]);
  runtime.setViewAnnotations(first, []);
  expect([...runtime.decorations.get().annotations.keys()]).toEqual(['two']);
  expect(runtime.annotationTypes.has('detail')).toBe(true);
});
