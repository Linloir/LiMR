import { test, expect } from '@playwright/test';

const groups = [
  ['source-order', 'source pruning, Unicode first ink, and atomic guard order'],
  ['mutations', 'same-task prepare and DOM changes preserve source geometry'],
  ['resolvers-and-coverage', 'live bindings and resolver mutations stay fresh inside and outside content'],
  ['lifecycle', 'nested, throwing, disposed, and async passes release temporary observers'],
  ['isolation', 'documents and reader instances retain independent, current geometry'],
] as const;
for (const [group, title] of groups) test(title, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/source-anchor-pass.html'); await page.evaluate(() => document.fonts.ready);
  const result = await page.evaluate(name => (window as any).sourceAnchorPass.run(name), group);
  expect(result.ok).toBe(true); expect(result.group).toBe(group); expect(errors).toEqual([]);
});
