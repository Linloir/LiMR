import { describe, expect, it } from 'vitest';
import { ReaderRuntime, chinese, english } from '../src/react/runtime';
import { citation } from '../src/extensions';

describe('localized annotation labels', () => {
  it('changes built-in labels without reparsing or replacing stored annotations', () => {
    const extensions = [citation()];
    const runtime = new ReaderRuntime('locale', 'A source<ref id="one" />.\n\n<citation id="one" title="Original title" />', false, { extensions, locale: chinese });
    const snapshot = runtime.document.getSnapshot();
    const data = runtime.decorations.get().annotations;
    expect(runtime.annotationTypes.get('citation')?.label).toBe('引用');
    runtime.configure({ extensions, locale: english });
    expect(runtime.annotationTypes.get('citation')?.label).toBe('Citation');
    expect(runtime.document.getSnapshot()).toBe(snapshot);
    expect(runtime.decorations.get().annotations).toBe(data);
    runtime.dispose();
  });

  it('preserves string overrides and type identity when a resolved label stays the same', () => {
    const fixed = { type: 'fixed', label: 'My label' };
    const localized = { type: 'localized', label: (locale: typeof english) => locale.citation ?? 'Citation' };
    const annotationTypes = [fixed, localized];
    const runtime = new ReaderRuntime('locale', 'Text', false, { annotationTypes, locale: chinese });
    const resolved = runtime.annotationTypes.get('localized');
    runtime.configure({ annotationTypes, locale: { ...chinese, copy: '复制选区' } });
    expect(runtime.annotationTypes.get('localized')).toBe(resolved);
    expect(runtime.annotationTypes.get('fixed')).toBe(fixed);
    runtime.configure({ annotationTypes, locale: english });
    expect(runtime.annotationTypes.get('fixed')?.label).toBe('My label');
    expect(runtime.annotationTypes.get('localized')?.label).toBe('Citation');
    runtime.dispose();
  });
});
