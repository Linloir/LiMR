import { expect, test } from '@playwright/test';

for (const virtualization of [false, true]) test(`find seeds plain selected text in ${virtualization ? 'windowed' : 'ordinary'} readers`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(virtualization => (window as any).reading.render({
    source: '# Selection search\n\n**中文** &amp; `a+b` \\*literal\\*.', virtualization,
  }), virtualization);
  const paragraph = page.locator('.limr-reader-content p').filter({ hasText: 'literal' }).first();
  await expect(paragraph).toBeVisible();
  await paragraph.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range);
  });
  // The same seed path is shared by host commands and the core shortcut.
  if (virtualization) await page.evaluate(() => (window as any).reading.api.find());
  else await page.keyboard.press('Control+f');
  const input = page.locator('.limr-document-search input');
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('中文 & a+b *literal*.');
  await expect(page.locator('.limr-search-count')).toHaveText('1/1');
  await input.fill('new query');
  await page.keyboard.press('Control+f');
  await expect(input).toHaveValue('new query');
});

test('Playground reader Ctrl+F uses its selected prose', async ({ page }) => {
  await page.goto('/#/playground');
  const paragraph = page.locator('.limr-reader-content p').filter({ hasText: /\S/ }).first();
  await expect(paragraph).toBeVisible();
  const selected = await paragraph.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range);
    return selection.toString().trim();
  });
  await page.keyboard.press('Control+f');
  await expect(page.locator('.limr-document-search input')).toHaveValue(selected);
  await expect(page.locator('.limr-document-search input')).toBeFocused();
});
