import { expect, test } from 'vitest';
import { fitSidebarBoxes, planSidebarCollapse } from '../src/components/sidebar-collapse';

test('minimal-displacement packing keeps mild collisions and isolated cards unfolded', () => {
  const items = [{ id: 'a', anchorTop: 100, height: 100 }, { id: 'b', anchorTop: 180, height: 100 }, { id: 'c', anchorTop: 700, height: 100 }];
  const plan = planSidebarCollapse(items, 1000);
  expect(plan.every(group => !group.folded)).toBe(true);
  const positions = fitSidebarBoxes(plan, 14, 1000);
  expect(positions.get('a')).toBe(83); expect(positions.get('b')).toBe(197); expect(positions.get('c')).toBe(700);
  expect(planSidebarCollapse([items[0]], 80)[0].folded).toBe(false);
});

test('folding combines a dense continuous range with at least two clipped cards', () => {
  const items = Array.from({ length: 18 }, (_, index) => ({ id: String(index), anchorTop: index * 65 + 50, height: 110 }));
  const plan = planSidebarCollapse(items, 1500, 420);
  expect(plan.some(group => group.folded)).toBe(true);
  for (const group of plan.filter(group => group.folded)) {
    expect(group.items.length).toBeGreaterThanOrEqual(3);
    expect(group.hidden).toBeGreaterThanOrEqual(2);
    expect(group.height).toBeGreaterThan(group.items[0].height);
    let top = 0;
    const cut = group.items.find(item => { const partial = top < group.height && top + item.height > group.height; if (!partial) top += item.height + 14; return partial; });
    expect(cut).toBeDefined();
    expect((group.height - top) / cut!.height).toBeGreaterThanOrEqual(.5);
    expect((group.height - top) / cut!.height).toBeLessThan(.85);
  }
  expect(plan.flatMap(group => group.items.map(item => item.id))).toEqual(items.map(item => item.id));
});

test('long dense sections stay local instead of folding a whole article into one window', () => {
  const items = Array.from({ length: 80 }, (_, i) => ({ id: String(i), anchorTop: 50 + i * 65, height: 110 }));
  const plan = planSidebarCollapse(items, 6400);
  expect(plan.filter(group => group.folded).length).toBeGreaterThan(1);
  expect(plan.filter(group => !group.folded).length).toBeGreaterThan(0);
  for (const group of plan.filter(group => group.folded)) expect(group.items.at(-1)!.anchorTop - group.anchorTop).toBeLessThanOrEqual(420);
});

test('a local dense group does not consume distant sparse annotations', () => {
  const dense = Array.from({ length: 12 }, (_, index) => ({ id: String(index), anchorTop: 100, height: 100 }));
  const plan = planSidebarCollapse([...dense, { id: 'b', anchorTop: 700, height: 100 }, { id: 'c', anchorTop: 950, height: 100 }], 1200, 420);
  expect(plan.find(group => group.id === 'b')?.folded).toBe(false);
  expect(plan.find(group => group.id === 'c')?.folded).toBe(false);
  expect(plan.filter(group => group.folded)).toHaveLength(1);
  expect(planSidebarCollapse([], 100)).toEqual([]);
});
