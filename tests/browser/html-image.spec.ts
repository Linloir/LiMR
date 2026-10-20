import { expect, test } from '@playwright/test';

test('standalone HTML images share figure controls, sizing, preview and source annotations', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const source = '<img src="/prototype-image.svg" alt="LiMR" width="96" />';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const figure = page.locator('.limr-figure'), image = figure.locator('img'), atomic = figure.locator('.limr-atomic-image');
  await expect.poll(() => image.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect((await image.boundingBox())!.width).toBeCloseTo(96, 0);
  await figure.hover(); await figure.getByRole('button', { name: 'Copy image URL' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('/prototype-image.svg');
  await image.click();
  await expect(page.locator('.limr-image-preview')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-image-preview')).toHaveCount(0);
  await atomic.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(source);
  await page.keyboard.press('ControlOrMeta+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await page.getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(atomic).toHaveClass(/limr-atomic-highlight/);
  await expect(atomic.locator('.limr-paint-background')).not.toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() => window.limrStream({ source: '<img src="/prototype-image.svg" width="9600" />', streaming: false }));
  await expect.poll(() => page.locator('article').evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
});
