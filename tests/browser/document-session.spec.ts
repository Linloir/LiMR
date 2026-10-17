import { test, expect } from '@playwright/test';
async function state(page: import('@playwright/test').Page) { return JSON.parse(await page.getByTestId('state').textContent() ?? '{}'); }
test('a real module worker retains complete reference/annotation semantics', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/document-session.html'); await page.getByRole('button', { name: 'References' }).click();
  await expect.poll(async () => (await state(page)).status).toBe('ready');
  expect(await state(page)).toMatchObject({ worker: true, complete: true, definition: '/correct', annotations: 1, prefix: 0, error: '' }); expect(errors).toEqual([]);
});
test('large worker results assemble bounded packets before marking the document complete', async ({ page }) => {
  await page.goto('/document-session.html'); const before = (await state(page)).ticks;
  await page.getByRole('button', { name: 'Novel' }).click(); await expect.poll(async () => (await state(page)).status).toBe('ready');
  const value = await state(page); expect(value.sourceLength).toBe(value.expected); expect(value.blocks).toBe(30000); expect(value.prefix).toBeGreaterThan(0); expect(value.prefix).toBeLessThan(value.sourceLength); expect(value.complete).toBe(true); expect(value.worker).toBe(true); expect(value.ticks - before).toBeGreaterThan(2);
});
test('cancelling a busy worker cannot overwrite a newer document', async ({ page }) => {
  await page.goto('/document-session.html');
  await page.getByRole('button', { name: 'Novel' }).click(); await page.getByRole('button', { name: 'Cancel' }).click();
  await expect.poll(async () => (await state(page)).status).toBe('cancelled');
  await page.getByRole('button', { name: 'References' }).click(); await expect.poll(async () => (await state(page)).status).toBe('ready');
  expect(await state(page)).toMatchObject({ complete: true, definition: '/correct', revision: 2 });
});
