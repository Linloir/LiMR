import { expect, test } from '@playwright/test';
import { dragSelection } from '../../benchmarks/selection-probe';

test('continuous selection paints while dragging a long document, within a frame budget', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/?fixture=selection-bench&sections=2000');
  await expect(page.locator('.limr-prose')).toHaveAttribute('data-limr-painted', 'true');
  await expect(page.locator('[data-limr-block]')).toHaveCount(8000);
  const result = await dragSelection(page);
  expect(result.nativeChanges).toBeGreaterThan(60);
  expect(result.dragging).toBeGreaterThan(result.nativeChanges * .6);
  expect(result.paints).toBeGreaterThan(result.nativeChanges * .6);
  expect(result.paintP95Ms).toBeLessThan(40);
  expect(result.frameP95Ms).toBeLessThan(40);
  expect(result.longTasks.filter(ms => ms > 100)).toHaveLength(0);
  await expect.poll(() => page.evaluate(() => window.selectionProbe.last?.settled)).toBe(true);
});

test('select-all paint stays bounded to the viewport and follows scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/?fixture=selection-bench&sections=2000');
  await expect(page.locator('.limr-prose')).toHaveAttribute('data-limr-painted', 'true');
  await page.locator('.limr-prose').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range);
  });
  await expect(page.locator('.limr-paint-selection').first()).toBeVisible();
  const count = await page.locator('.limr-paint-selection').count();
  expect(count).toBeLessThan(250);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2));
  await expect.poll(() => page.locator('.limr-paint-selection').evaluateAll(elements => elements.some(element => { const rect = element.getBoundingClientRect(); return rect.top >= 0 && rect.bottom <= innerHeight; }))).toBe(true);
  expect(await page.locator('.limr-paint-selection').count()).toBeLessThan(250);
  expect(await page.evaluate(() => window.selectionProbe.last?.raw.sourceText.length)).toBeGreaterThan(800_000);
});

test('tokenized code remains responsive during continuous partial selection', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/?fixture=selection-bench&kind=code&sections=1000');
  await expect(page.locator('.shiki')).toBeAttached();
  const result = await dragSelection(page, '.limr-prose pre');
  expect(result.dragging).toBeGreaterThan(result.nativeChanges * .6);
  expect(result.paints).toBeGreaterThan(result.nativeChanges * .6);
  expect(result.frameP95Ms).toBeLessThan(40);
  expect(result.paintP95Ms).toBeLessThan(40);
  expect(result.longTasks.filter(ms => ms > 100)).toHaveLength(0);
});
