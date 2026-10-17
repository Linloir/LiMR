import { expect, test } from '@playwright/test';

test('large wrapped TOCs retain every keyboard destination with bounded DOM', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 2400 }, (_, index) =>
    `## Chapter ${index} — a deliberately long wrapped heading with enough words to occupy several lines\n\nParagraph ${index}.\n\n`).join('') }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const toc = page.locator('.limr-reader-toc');
  await expect(toc.locator('[data-limr-toc-windowed]')).toBeVisible();
  expect(await toc.locator('a').count()).toBeLessThan(100);
  await expect(toc.locator('li').first()).toHaveAttribute('aria-setsize', '2400');
  const first = toc.getByRole('link', { name: /^Chapter 0 / });
  await first.focus(); await page.keyboard.press('End');
  const last = toc.getByRole('link', { name: /^Chapter 2399 / });
  await expect(last).toBeFocused(); await expect(last).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-limr-document]').getByRole('heading', { name: /^Chapter 2399 / })).toBeInViewport();
  await page.keyboard.press('Home');
  await expect(first).toBeFocused();
  for (let count = 0; count < 50; count++) await page.keyboard.press('Tab');
  await expect(toc.getByRole('link', { name: /^Chapter 50 / })).toBeFocused();
  expect(await toc.locator('a').count()).toBeLessThan(100);
  await page.evaluate(() => { const api = (window as any).reading.api; const heading = api.document.getSnapshot().headings[1700]; api.scrollToSource(heading.range); (document.activeElement as HTMLElement)?.blur(); });
  await expect(toc.getByRole('link', { name: /^Chapter 1700 / })).toBeInViewport({ timeout: 5000 });
  await expect(toc.getByRole('link', { name: /^Chapter 1700 / })).toHaveAttribute('aria-current', 'location');
  expect(errors).toEqual([]);
});

test('a large mobile TOC opens, resizes and reaches its final heading', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 620, height: 900 });
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 600 }, (_, index) => `# Mobile chapter ${index}\n\nText ${index}.\n\n`).join('') }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const toc = page.locator('.limr-reader-mobile-toc');
  await toc.getByRole('button', { name: 'Contents', exact: true }).click();
  await expect(toc.locator('[data-limr-toc-windowed]')).toBeVisible();
  await toc.getByRole('link', { name: 'Mobile chapter 0', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(toc.getByRole('link', { name: 'Mobile chapter 599', exact: true })).toBeFocused();
  expect(await toc.locator('a').count()).toBeLessThan(100);
  await page.setViewportSize({ width: 440, height: 750 });
  await expect(toc.getByRole('link', { name: 'Mobile chapter 599', exact: true })).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-limr-document]').getByRole('heading', { name: 'Mobile chapter 599', exact: true })).toBeInViewport();
  expect(errors).toEqual([]);
});
