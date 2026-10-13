import { describe, expect, it, vi } from 'vitest';
import { LruCache, ResourceCache } from '../src/core';
import { alignSidebar } from '../src/components/AnnotationSidebar';

describe('resource lifetime', () => {
  it('shares in-flight work and only aborts after its last consumer leaves', async () => {
    const cache = new ResourceCache<number>();
    let signal: AbortSignal | undefined;
    const loader = vi.fn((value: AbortSignal) => { signal = value; return Promise.resolve(42); });
    const first = cache.acquire('a', loader), second = cache.acquire('a', loader);
    first.release();
    expect(await second.promise).toBe(42);
    expect(signal?.aborted).toBe(false);
    expect(loader).toHaveBeenCalledTimes(1);
    second.release();
    expect(await cache.acquire('a', loader).promise).toBe(42);
    expect(loader).toHaveBeenCalledTimes(1);
    cache.invalidate('a');
    await cache.acquire('a', loader).promise;
    expect(loader).toHaveBeenCalledTimes(2);
  });
  it('evicts least recently used values', () => {
    const cache = new LruCache<string, number>(2);
    cache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3);
    expect(cache.get('b')).toBeUndefined(); expect(cache.get('a')).toBe(1);
  });
  it('hands a pending request between presentations, then aborts on final release', async () => {
    const cache = new ResourceCache<number>();
    let signal: AbortSignal | undefined;
    const load = vi.fn((next: AbortSignal) => { signal = next; return new Promise<number>(() => {}); });
    const preview = cache.acquire('a', load);
    await Promise.resolve();
    preview.release();
    const expanded = cache.acquire('a', load);
    await Promise.resolve();
    expect(signal!.aborted).toBe(false);
    expect(load).toHaveBeenCalledTimes(1);
    expanded.release();
    await Promise.resolve();
    expect(signal!.aborted).toBe(true);
  });
});
it('keeps colliding cards separate and aligns the active anchor even when earlier cards are clipped', () => {
  const items = [{ id: 'a', anchorTop: 0, height: 50 }, { id: 'b', anchorTop: 10, height: 100 }, { id: 'c', anchorTop: 30, height: 60 }];
  const positions = alignSidebar(items, { activeId: 'b', gap: 14 });
  expect(positions.get('a')).toBeLessThan(0);
  expect(positions.get('b')).toBe(items[1].anchorTop);
  expect(positions.get('b')! - positions.get('a')!).toBeGreaterThanOrEqual(64);
  expect(positions.get('c')! - positions.get('b')!).toBeGreaterThanOrEqual(114);
});

it('packs footer cards upward into spare rail space while retaining order and gaps', () => {
  const items = [{ id: 'a', anchorTop: 80, height: 100 }, { id: 'b', anchorTop: 460, height: 80 }, { id: 'c', anchorTop: 480, height: 90 }];
  const positions = alignSidebar(items, { activeId: 'c', gap: 14, height: 500 });
  expect(positions.get('a')).toBe(80);
  expect(positions.get('b')).toBe(316);
  expect(positions.get('c')).toBe(410);
});

it('keeps the focused card visible when the complete stack cannot fit', () => {
  const items = Array.from({ length: 8 }, (_, index) => ({ id: String(index), anchorTop: 220 + index, height: 100 }));
  const positions = alignSidebar(items, { activeId: '6', gap: 14, height: 300 });
  expect(positions.get('6')).toBe(200);
  expect(positions.get('5')! + 114).toBeLessThanOrEqual(positions.get('6')!);
  expect(positions.get('7')!).toBeGreaterThanOrEqual(314);
});
