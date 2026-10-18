import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/missing-image.png', route => route.fulfill({ status: 404, contentType: 'text/plain', body: 'Missing image' }));
});

test('failed Markdown, figure, table and linked images show a localized fallback that fits narrow readers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto('/media-preview.html?failures');
  const original = await page.getByTestId('source').textContent();
  for (const alt of ['Missing image', 'Missing figure', 'Missing table image', 'Missing linked image']) {
    const image = page.locator(`img[alt="${alt}"]`), atomic = image.locator('..'), fallback = atomic.locator('[data-limr-image-fallback]');
    await atomic.scrollIntoViewIfNeeded(); await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAccessibleName(`${alt}: Unable to load image. The link may be broken or the file may not exist.`);
    await expect(fallback.locator('svg')).toBeVisible(); await expect(image).toBeHidden();
    await expect(fallback).toHaveCSS('border-top-width', '0px');
    await expect(fallback.locator('.limr-image-fallback-icon')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(fallback).toHaveCSS('border-radius', await image.evaluate(element => getComputedStyle(element).borderRadius));
    await expect(image).not.toHaveAttribute('role', 'button');
    const box = await fallback.boundingBox();
    expect(box!.width).toBeGreaterThan(100); expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  }
  await page.locator('#locale').click();
  const fallback = page.locator('.limr-reader [data-limr-image-fallback]').first();
  await fallback.scrollIntoViewIfNeeded();
  await expect(fallback).toContainText('图片无法加载'); await expect(fallback).toContainText('可能是链接损坏或文件不存在。');
  const darkColor = await fallback.evaluate(element => getComputedStyle(element).color);
  await page.locator('#theme').click();
  await expect.poll(() => fallback.evaluate(element => getComputedStyle(element).color)).not.toBe(darkColor);
  await expect(page.locator('figcaption')).toContainText('Caption remains available.');
  expect(await page.getByTestId('source').textContent()).toBe(original);
  const link = page.locator('a:has(img[alt="Missing linked image"])');
  await link.focus(); await link.press('Enter');
  await expect(page.getByRole('heading', { name: 'target', exact: true })).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'target', exact: true })).toBeFocused();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('a replacement src or srcSet recovers the same native image and retains load/error callbacks', async ({ page }) => {
  await page.goto('/media-preview.html?failures');
  const image = page.locator('img[alt="Missing image"]'), atomic = image.locator('..');
  await atomic.scrollIntoViewIfNeeded(); await expect(atomic.locator('[data-limr-image-fallback]')).toBeVisible();
  await image.evaluate(element => { (window as unknown as { originalImage: Element }).originalImage = element; });
  const responsive = page.locator('#responsive-image');
  await responsive.scrollIntoViewIfNeeded(); await expect(responsive.locator('[data-limr-image-fallback]')).toBeVisible();
  await expect(page.getByTestId('image-events')).toHaveText('{"load":0,"error":1}');
  await page.locator('#repair-images').click();
  await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('naturalWidth', 2400);
  await expect(atomic.locator('[data-limr-image-fallback]')).toHaveCount(0);
  expect(await image.evaluate(element => (window as unknown as { originalImage: Element }).originalImage === element)).toBe(true);
  await image.click(); await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close image preview' }).click();
  await responsive.scrollIntoViewIfNeeded(); await expect(responsive.locator('img')).toHaveJSProperty('naturalWidth', 2400);
  await expect(responsive.locator('[data-limr-image-fallback]')).toHaveCount(0);
  await expect(page.getByTestId('image-events')).toHaveText('{"load":1,"error":1}');
});

test('a failed image keeps source selection, copy and highlight geometry on the placeholder', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const source = '![Missing image](/missing-image.png)';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const atomic = page.locator('.limr-atomic-image'), fallback = atomic.locator('[data-limr-image-fallback]');
  await expect(fallback).toBeVisible();
  await atomic.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(() => page.locator('#stream-selection').textContent().then(value => JSON.parse(value || 'null')?.raw.sourceText)).toBe(source);
  const paint = page.locator('.limr-paint-selection[data-media="image"]');
  await expect(paint).toBeVisible(); expect(await paint.boundingBox()).toEqual(await fallback.boundingBox());
  await page.getByRole('toolbar').getByRole('button', { name: 'Copy', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(atomic.locator('.limr-paint-background')).toBeVisible();
  expect(await atomic.locator('.limr-paint-background').boundingBox()).toEqual(await fallback.boundingBox());
  await expect(page.locator('#stream-source')).toHaveText(source);
});
