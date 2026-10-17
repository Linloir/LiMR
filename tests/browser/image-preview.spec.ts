import { expect, test } from '@playwright/test';

const fixture = '/media-preview.html';
test('ordinary, reference, figure, attribute and linked images share a modal with stable focus and source', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(fixture);
  const source = await page.getByTestId('source').textContent(), scroll = page.locator('#reader-scroll');
  for (const alt of ['Landscape', 'Reference image', 'Figure image', 'Attribute image', 'Linked image']) {
    const image = page.locator('.limr-reader').getByAltText(alt, { exact: true });
    await image.scrollIntoViewIfNeeded(); await expect(image).toHaveJSProperty('naturalWidth', 2400);
    await expect(image).toHaveAttribute('role', 'button');
    const top = await scroll.evaluate(element => element.scrollTop), resolved = await image.evaluate(element => (element as HTMLImageElement).currentSrc);
    await image.click(); const dialog = page.getByRole('dialog'), close = dialog.getByRole('button', { name: 'Close image preview' });
    await expect(dialog).toBeVisible(); await expect(dialog).toHaveAttribute('data-limr-theme', 'dark');
    await expect(dialog.getByAltText(alt, { exact: true })).toHaveAttribute('src', resolved);
    await expect(close).toBeFocused(); await close.press('Tab');
    expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    await page.locator(':focus').press('Shift+Tab'); expect(await dialog.evaluate(element => element.contains(document.activeElement))).toBe(true);
    const size = await dialog.locator('img').evaluate(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height, availableWidth: element.parentElement!.clientWidth, availableHeight: element.parentElement!.clientHeight }));
    expect(size.width).toBeLessThanOrEqual(size.availableWidth); expect(size.height).toBeLessThanOrEqual(size.availableHeight);
    await dialog.getByRole('button', { name: 'Actual size', exact: true }).click();
    await expect.poll(() => dialog.locator('img').evaluate(image => image.getBoundingClientRect().width)).toBe(2400);
    expect(await dialog.locator('.limr-image-preview-stage').evaluate(stage => stage.scrollWidth > stage.clientWidth)).toBe(true);
    await close.press('Escape'); await expect(dialog).toHaveCount(0); await expect(image).toBeFocused();
    expect(Math.abs(await scroll.evaluate(element => element.scrollTop) - top)).toBeLessThan(2);
  }
  expect(await page.getByTestId('source').textContent()).toBe(source);
  expect(new URL(page.url()).hash).toBe(''); expect(errors).toEqual([]);
});

test('keyboard, standalone images, opt-out and failed resources retain their intended behavior', async ({ page }) => {
  await page.goto(fixture);
  const image = page.locator('#standalone').getByAltText('Standalone', { exact: true });
  await image.scrollIntoViewIfNeeded(); await expect(image).toHaveAttribute('role', 'button');
  await image.focus(); await image.press('Enter'); await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close image preview' }).click(); await expect(image).toBeFocused();
  await image.press('Space'); await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('.limr-image-preview-stage').click({ position: { x: 3, y: 3 } }); await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByAltText('Disabled preview')).not.toHaveAttribute('role', 'button');
  const missing = page.locator('img[alt="Missing image"]'), atomic = missing.locator('..');
  await atomic.scrollIntoViewIfNeeded(); await expect(atomic.locator('[data-limr-image-fallback]')).toBeVisible();
  await expect(missing).toBeHidden(); await expect(missing).not.toHaveAttribute('role', 'button');
});

test('theme and locale updates retain the modal, while resource changes and removals close it', async ({ page }) => {
  await page.setViewportSize({ width: 480, height: 720 }); await page.goto(fixture);
  const image = page.locator('.limr-reader').getByAltText('Landscape', { exact: true });
  await image.click(); const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  await page.locator('#theme').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveAttribute('data-limr-theme', 'light');
  await page.locator('#locale').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveAttribute('aria-label', '图片预览'); await expect(dialog.getByRole('button', { name: '原始大小' })).toBeVisible();
  const bounds = await dialog.evaluate(element => ({ right: element.getBoundingClientRect().right, viewport: innerWidth, width: element.clientWidth, content: element.scrollWidth }));
  expect(bounds.right).toBeLessThanOrEqual(bounds.viewport); expect(bounds.content).toBe(bounds.width);
  await page.locator('#change-image').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveCount(0); await expect(image).toHaveJSProperty('naturalWidth', 1800);
  await image.click(); await expect(dialog).toBeVisible();
  await page.locator('#remove-image').evaluate((button: HTMLButtonElement) => button.click()); await expect(dialog).toHaveCount(0);
});

test('modified clicks and an existing selection do not become previews', async ({ page }) => {
  await page.goto(fixture);
  const image = page.locator('.limr-reader').getByAltText('Linked image', { exact: true });
  await image.scrollIntoViewIfNeeded(); await expect(image).toHaveAttribute('role', 'button');
  await image.evaluate(element => {
    element.closest('a')!.addEventListener('click', event => { element.setAttribute('data-link-click', String(event.defaultPrevented)); event.preventDefault(); });
  });
  await image.click({ modifiers: ['Control'] }); await expect(image).toHaveAttribute('data-link-click', 'false');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.locator('.limr-reader p').first().evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
  await image.dispatchEvent('click'); await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('preview modes, panning, pixel copying and equally spaced toolbar work on a narrow viewport', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 700 });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(fixture);
  const source = page.locator('.limr-reader').getByAltText('Landscape', { exact: true });
  await source.click();
  const dialog = page.getByRole('dialog'), stage = dialog.locator('.limr-image-preview-stage'), image = dialog.locator('img');
  const buttons = await dialog.getByRole('toolbar').locator('button').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect(), icon = element.querySelector('svg')!.getBoundingClientRect();
    return { x: box.x, width: box.width, height: box.height, iconWidth: icon.width, iconHeight: icon.height };
  }));
  expect(buttons).toHaveLength(5);
  for (const button of buttons) expect(button).toMatchObject({ width: 42, height: 42, iconWidth: 24, iconHeight: 24 });
  const gaps = buttons.slice(1).map((button, index) => button.x - buttons[index].x - buttons[index].width);
  expect(new Set(gaps).size).toBe(1);
  await dialog.getByRole('button', { name: 'Actual size', exact: true }).click();
  await expect(stage).toHaveAttribute('data-mode', 'actual');
  const initialLeft = await stage.evaluate(element => element.scrollLeft);
  await page.mouse.move(200, 280); await page.mouse.down(); await page.mouse.move(260, 300, { steps: 4 }); await page.mouse.up();
  expect(await stage.evaluate(element => element.scrollLeft)).toBeLessThan(initialLeft - 40);
  await expect(stage).toHaveAttribute('data-mode', 'actual');
  await dialog.getByRole('button', { name: 'Fill window', exact: true }).click(); await expect(stage).toHaveAttribute('data-mode', 'fill');
  await dialog.getByRole('button', { name: 'Fit to window', exact: true }).click(); await expect(stage).toHaveAttribute('data-mode', 'fit');
  const fitWidth = await image.evaluate(element => element.getBoundingClientRect().width);
  await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
  expect(await image.evaluate(element => element.getBoundingClientRect().width)).toBeGreaterThan(fitWidth);
  await dialog.getByRole('button', { name: 'Zoom out', exact: true }).click();
  expect(await image.evaluate(element => element.getBoundingClientRect().width)).toBeCloseTo(fitWidth, 0);
  await dialog.getByRole('button', { name: 'Copy image', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  expect(await page.evaluate(async () => (await (await navigator.clipboard.read())[0].getType('image/png')).size)).toBeGreaterThan(100);
  await page.evaluate(() => { Object.defineProperty(navigator.clipboard, 'write', { configurable: true, value: async () => { throw new Error('Denied'); } }); });
  await dialog.getByRole('button', { name: 'Copied', exact: true }).click();
  await expect(dialog.getByRole('button', { name: 'Copy failed', exact: true })).toBeVisible();
  await dialog.getByRole('button', { name: 'Close image preview' }).click(); await expect(dialog).toHaveCount(0); await expect(source).toBeFocused();
});

test('Escape can reverse the opening hero and return focus without waiting for entrance', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto(fixture);
  const source = page.locator('.limr-reader').getByAltText('Landscape', { exact: true });
  await source.click();
  const dialog = page.getByRole('dialog'); await expect(dialog).toBeVisible();
  await dialog.press('Escape'); await expect(dialog).toHaveCount(0); await expect(source).toBeFocused();
  await source.press('Enter'); await expect(dialog).toBeVisible();
  await page.locator('#remove-image').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveCount(0); expect(errors).toEqual([]);
});

for (const kp of [false, true]) test(`list translation markers remain inline and preserve task/source behavior (${kp ? 'KP' : 'standard'})`, async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1200, height: 1000 }); await page.goto(`${fixture}?translations${kp ? '&kp' : ''}`);
  const blocks = page.locator('.limr-translations'); await expect(blocks).toHaveCount(6);
  for (let index = 0; index < 6; index++) {
    const block = blocks.nth(index), marker = block.locator('[data-translation-switch]'); await marker.scrollIntoViewIfNeeded();
    expect(await marker.evaluate(element => !!element.closest('li'))).toBe(true);
    const source = await page.getByTestId('source').textContent();
    for (const mode of ['translation', 'both', 'origin']) {
      await marker.click(); await expect(block).toHaveAttribute('data-mode', mode); await expect(marker).toBeFocused();
      expect(await marker.evaluate(element => !!element.closest('li'))).toBe(true); await expect(marker).toHaveCount(1);
    }
    expect(await page.getByTestId('source').textContent()).toBe(source);
  }
  const task = blocks.nth(3).locator('[data-language="origin"] .limr-task-control input').last();
  await expect(task).not.toBeChecked(); await task.check(); await expect(task).toBeChecked();
  expect(await page.getByTestId('source').textContent()).toContain('- [x] Final item');
});

test('a controlled TranslationBlock reports changes without DOM interception', async ({ page }) => {
  await page.goto(`${fixture}?translations&controlled`);
  const first = page.locator('.limr-translations').first();
  await first.locator('[data-translation-switch]').click(); await expect(page.getByTestId('mode')).toHaveText('translation');
  await expect(first).toHaveAttribute('data-mode', 'translation'); await expect(first.locator('[data-translation-switch]')).toBeFocused();
});
