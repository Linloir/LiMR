import { expect, test } from 'vitest';
import { reflowSidebar } from '../src/components/sidebar-layout';

const boxes = new Map([
  ['a', { id: 'a', top: 100, height: 80 }],
  ['b', { id: 'b', top: 194, height: 90 }],
  ['c', { id: 'c', top: 298, height: 70 }],
  ['d', { id: 'd', top: 600, height: 100 }],
]);
const items = [...boxes.values()].map(box => ({ id: box.id, anchorTop: 100, height: box.height }));

test('changing focus preserves the complete stack and its intentional gaps', () => {
  for (const box of boxes.values()) {
    expect(reflowSidebar(items, { id: box.id, top: box.top, boxes }, 14).map(item => item.anchorTop)).toEqual([100, 194, 298, 600]);
  }
});

test('expansion makes room around the pinned card and collapse restores the spacing', () => {
  const lock = { id: 'b', top: 194, boxes };
  const expanded = reflowSidebar(items.map(item => ({ ...item, height: item.height + (item.id === 'a' ? 20 : item.id === 'b' ? 60 : 0) })), lock, 14);
  expect(expanded.map(item => item.anchorTop)).toEqual([80, 194, 358, 660]);
  expect(reflowSidebar(items, lock, 14).map(item => item.anchorTop)).toEqual([100, 194, 298, 600]);
  expect(items.map(item => item.anchorTop)).toEqual([100, 100, 100, 100]);
});

test('new virtual-window items retain their source separation from an older pinned card', () => {
  const lock = { id: 'b', top: 194, boxes };
  const next = [{ id: 'b', anchorTop: 100, height: 90 }, { id: 'new', anchorTop: 10000, height: 80 }];
  expect(reflowSidebar(next, lock, 14).map(item => item.anchorTop)).toEqual([194, 10094]);
  const previous = [{ id: 'new', anchorTop: 100, height: 80 }, { id: 'b', anchorTop: 10000, height: 90 }];
  expect(reflowSidebar(previous, { ...lock, top: 10094 }, 14).map(item => item.anchorTop)).toEqual([194, 10094]);
});
