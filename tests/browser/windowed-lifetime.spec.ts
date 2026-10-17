import { expect, test } from '@playwright/test';

for (const mode of ['keep', 'conditional', 'owner']) test(`custom lifetime ${mode}: owner contract controls DOM and state after leaving the window`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(`/windowed-lifetime.html?mode=${mode}`);
  await expect.poll(() => page.evaluate(() => (window as any).lifetime.state?.status)).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  const widget = page.locator('[data-widget]'); await widget.getByRole('button', { name: 'Count 0' }).click();
  await expect(widget.getByRole('button', { name: 'Count 1' })).toBeVisible();
  await page.evaluate(() => {
    const audit = (window as any).lifetime; audit.original = document.querySelector('[data-widget]');
    (document.activeElement as HTMLElement)?.blur(); getSelection()?.removeAllRanges();
    const start = audit.source.indexOf('Paragraph 1500.'); audit.api.scrollToSource({ start, end: start + 1 });
  });
  await expect(page.getByText(/^Paragraph 1500\./)).toBeInViewport();
  if (mode === 'keep') {
    expect(await page.evaluate(() => { const node = (window as any).lifetime.original; return node.isConnected && node === document.querySelector('[data-widget]') && !!node.closest('[data-window-parked]') && node.getBoundingClientRect().bottom < 0; })).toBe(true);
  } else {
    await expect(widget).toHaveCount(0);
    expect(await page.evaluate(() => (window as any).lifetime.original.isConnected)).toBe(false);
  }
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(100);
  await page.evaluate(() => (window as any).lifetime.api.scrollToSource({ start: 0, end: 1 }));
  await expect(widget).toBeInViewport();
  await expect(widget.getByRole('button', { name: mode === 'keep' ? 'Count 1' : 'Count 0' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).lifetime.original === document.querySelector('[data-widget]'))).toBe(mode === 'keep');
  expect(errors).toEqual([]);
});

test('custom lifetime release still honors and then releases an independent focus lease', async ({ page }) => {
  await page.goto('/windowed-lifetime.html?mode=conditional');
  await expect.poll(() => page.evaluate(() => (window as any).lifetime.state?.status)).toBe('ready');
  const widget = page.locator('[data-widget]'); await widget.getByRole('button', { name: 'Count 0' }).click();
  await page.evaluate(() => { const audit = (window as any).lifetime; audit.original = document.querySelector('[data-widget]'); const start = audit.source.indexOf('Paragraph 1500.'); audit.api.scrollToSource({ start, end: start + 1 }); });
  await expect(page.getByText(/^Paragraph 1500\./)).toBeInViewport();
  expect(await page.evaluate(() => { const node = (window as any).lifetime.original; return node.isConnected && !!node.closest('[data-window-parked]') && node.contains(document.activeElement); })).toBe(true);
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); const audit = (window as any).lifetime, start = audit.source.indexOf('Paragraph 1600.'); audit.api.scrollToSource({ start, end: start + 1 }); });
  await expect(page.getByText(/^Paragraph 1600\./)).toBeInViewport(); await expect(widget).toHaveCount(0);
  await page.evaluate(() => (window as any).lifetime.api.scrollToSource({ start: 0, end: 1 }));
  await expect(widget.getByRole('button', { name: 'Count 0' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).lifetime.original === document.querySelector('[data-widget]'))).toBe(false);
});
