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

test('search undo and redo use native input history without reaching the host', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.getByRole('heading', { name: 'Start', exact: true }).click();
  await page.keyboard.press('Control+f');
  await page.evaluate(() => {
    (window as any).hostUndoKeys = [];
    window.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase()))
        (window as any).hostUndoKeys.push(event.key);
    });
  });
  const input = page.locator('.limr-document-search input');
  await input.pressSequentially('hello');
  await input.press('Control+z');
  await expect(input).toHaveValue('');
  await input.press('Control+y');
  await expect(input).toHaveValue('hello');
  // Replacing selected text is a separate undo transaction.
  await input.press('Control+a');
  await input.pressSequentially('replacement');
  await input.press('Control+z');
  await expect(input).toHaveValue('hello');
  await input.press('Control+Shift+z');
  await expect(input).toHaveValue('replacement');
  expect(await page.evaluate(() => (window as any).hostUndoKeys)).toEqual([]);
  expect(await page.evaluate(() => (window as any).reading.runtime.document.getSnapshot().source))
    .toBe('# Start\n\nSmall initial document.');
});
