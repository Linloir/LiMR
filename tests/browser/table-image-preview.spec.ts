import { expect, test } from '@playwright/test';

for (const mode of ['overlay', 'adaptive', 'aligned']) test(`overflow images use the shared preview without dismissing their ${mode} card`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: mode === 'overlay' ? 900 : 1700, height: 1000 });
  await page.route('**/table-late-image.png', route => route.abort());
  await page.goto(`/media-preview.html?table${mode === 'overlay' ? '' : `&sidebar${mode === 'aligned' ? '&aligned' : ''}`}`);
  const source = await page.getByTestId('source').textContent(), table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await table.getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  const card = page.locator(mode === 'overlay' ? '.limr-annotation-overlay' : '.limr-sidebar-card[data-type="table-cell-overflow"]');
  const clone = card.locator('.limr-table-full-content'), image = clone.getByAltText('Landscape', { exact: true });
  await expect(image).toHaveAttribute('role', 'button');
  await expect(clone.getByAltText('Disabled preview')).not.toHaveAttribute('role', 'button');
  expect(await clone.evaluate(element => !!element.querySelector('[data-source-start],[data-limr-anchor]'))).toBe(false);
  await image.evaluate(element => element.closest('a')!.addEventListener('click', event => {
    element.setAttribute('data-link-click', String(event.defaultPrevented)); event.preventDefault();
  }, { once: true }));
  await image.click({ modifiers: ['Control'] });
  await expect(image).toHaveAttribute('data-link-click', 'false');
  const dialog = page.locator('.limr-image-preview'); await expect(dialog).toHaveCount(0);
  await image.click(); await expect(dialog).toBeVisible();
  await expect(dialog.getByAltText('Landscape')).toHaveJSProperty('naturalWidth', 2400);
  if (mode === 'overlay') {
    await page.locator('#theme').evaluate((button: HTMLButtonElement) => button.click());
    await expect(dialog).toHaveAttribute('data-limr-theme', 'light');
    await page.locator('#locale').evaluate((button: HTMLButtonElement) => button.click());
    await expect(dialog).toHaveAttribute('aria-label', '图片预览');
    await page.locator('#locale').evaluate((button: HTMLButtonElement) => button.click());
    await expect(dialog).toHaveAttribute('aria-label', 'Image preview');
  }
  await dialog.getByRole('button', { name: 'Actual size', exact: true }).click();
  await expect(dialog.locator('.limr-image-preview-stage')).toHaveAttribute('data-original', 'true');
  await expect(card).toBeVisible();
  await dialog.getByRole('button', { name: 'Close image preview' }).click();
  await expect(dialog).toHaveCount(0); await expect(image).toBeFocused(); await expect(card).toBeVisible();
  await image.press('Space'); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Close image preview' }).press('Escape');
  await expect(dialog).toHaveCount(0); await expect(image).toBeFocused(); await expect(card).toBeVisible();
  expect(await page.getByTestId('source').textContent()).toBe(source);
  await image.press('Enter'); await expect(dialog).toBeVisible();
  await page.locator('#toggle-preview').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveCount(0); await expect(image).not.toHaveAttribute('role', 'button');
  await page.locator('#toggle-preview').evaluate((button: HTMLButtonElement) => button.click());
  await expect(image).toHaveAttribute('role', 'button');
  await image.press('Enter'); await expect(dialog).toBeVisible();
  await page.locator('#change-image').evaluate((button: HTMLButtonElement) => button.click());
  await expect(dialog).toHaveCount(0);
  expect(await page.getByTestId('source').textContent()).not.toBe(source);
  expect(errors).toEqual([]);
});

test('a late clone resource becomes previewable and changing that resource closes its modal', async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/table-late-image.png', async route => {
    await pending;
    await route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240"><rect width="480" height="240" fill="#687f99"/></svg>' });
  });
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.goto('/media-preview.html?table', { waitUntil: 'domcontentloaded' });
  const table = page.locator('.limr-table-layout'); await expect(table).toHaveAttribute('data-table-ready', 'true');
  await table.getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  const card = page.locator('.limr-annotation-overlay'), image = card.locator('.limr-table-full-content').getByAltText('Late image');
  await expect(image).not.toHaveAttribute('role', 'button');
  release(); await image.scrollIntoViewIfNeeded(); await expect(image).toHaveAttribute('role', 'button');
  await image.click(); const dialog = page.locator('.limr-image-preview'); await expect(dialog).toBeVisible();
  await expect(dialog.locator('img')).toHaveJSProperty('naturalWidth', 480);
  // Exercise the embedding resource adapter path, independently of replacing
  // Markdown or rebuilding the table's view-only annotation data.
  await table.getByAltText('Late image').evaluate((image: HTMLImageElement) => { image.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="360" height="180"/%3E'; });
  await expect(dialog).toHaveCount(0); await expect(image).toHaveJSProperty('naturalWidth', 360);
  await expect(card).toBeVisible();
});

test('a hover-only overflow card remains available while its image dialog is open', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1000 });
  await page.route('**/table-late-image.png', route => route.abort());
  await page.goto('/media-preview.html?table');
  const table = page.locator('.limr-table-layout'); await expect(table).toHaveAttribute('data-table-ready', 'true');
  await table.getByRole('button', { name: 'Full cell content', exact: true }).first().hover();
  const card = page.locator('.limr-annotation-overlay'), image = card.locator('.limr-table-full-content').getByAltText('Landscape');
  await expect(card).toBeVisible(); await expect(card).not.toHaveAttribute('data-pinned', 'true');
  await image.click(); const dialog = page.locator('.limr-image-preview'); await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: 'Actual size', exact: true }).click();
  await expect(dialog.locator('.limr-image-preview-stage')).toHaveAttribute('data-original', 'true');
  await expect(card).toBeVisible(); await expect(card).not.toHaveAttribute('data-pinned', 'true');
  await dialog.getByRole('button', { name: 'Close image preview' }).click(); await expect(dialog).toHaveCount(0);
  // Closing the child restores focus inside the hover card. Preserve that
  // keyboard destination until the existing outside-press dismissal runs.
  await expect(image).toBeFocused(); await expect(card).not.toHaveAttribute('data-pinned', 'true');
  await page.locator('#theme').click(); await expect(card).toHaveCount(0);
});
