import { expect, it } from 'vitest';
import { searchDocument } from '../src/core/search';

it('searches literal syntax across chunk boundaries with original Unicode offsets', async () => {
  const source = 'a'.repeat(65_533) + '😀 [A+B] 尾部\n' + 'x'.repeat(70_000) + '[a+b]';
  const hits = await searchDocument(source, '[a+b]');
  expect(hits.map(range => source.slice(range.start, range.end))).toEqual(['[A+B]', '[a+b]']);
  expect(hits[0].start).toBe(65_536);
  expect(await searchDocument(source, '😀 [A+B]', { caseSensitive: true })).toEqual([{ start: 65_533, end: 65_541 }]);
});
it('yields and cancels a complete-source search without returning partial success', async () => {
  const controller = new AbortController();
  await expect(searchDocument('text '.repeat(100_000), 'absent', { signal: controller.signal, onProgress: () => controller.abort() })).rejects.toMatchObject({ name: 'AbortError' });
});
