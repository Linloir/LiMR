import { expect, test, type Page } from '@playwright/test';

async function selectPassage(page: Page) {
  await page.locator('.limr-reader-content > article > p strong').first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}
test.beforeEach(async ({ page }) => { await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream); });

for (const width of [560, 1460]) test(`optional inline notes reuse their range and autosave in ${width}px reader`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.evaluate(() => window.limrStream({ source: 'Before **selected words** after.', editable: true, streaming: false, sidebar: true }));
  await selectPassage(page);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add inline note', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Annotation Markdown' });
  await expect(editor).toBeVisible();
  await editor.fill('A **saved footnote**.');
  await editor.press('Tab');
  await expect(editor).toBeVisible();
  await expect(page.locator('#stream-source')).not.toContainText('A **saved footnote**.');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('A **saved footnote**.');
  await expect(page.locator('.limr-source-annotation-body')).toContainText('A saved footnote.');
  await selectPassage(page);
  await page.getByRole('toolbar').getByRole('button', { name: 'Edit inline note', exact: true }).click();
  await expect(editor).toBeVisible();
  await editor.fill('Why **this range**?');
  await editor.press('ControlOrMeta+Enter');
  await expect(editor).toHaveCount(0);
  const source = await page.locator('#stream-source').textContent() ?? '';
  expect(source.match(/::%%limr%%\{<#/g)).toHaveLength(1);
  expect(source.match(/type="inline-note"/g)).toHaveLength(1);
  expect(source.match(/type="highlight"/g)).toHaveLength(1);
  expect(source).toContain('Why **this range**?');
  await selectPassage(page);
  await page.getByRole('toolbar').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect.poll(async () => (await page.locator('#stream-source').textContent())?.trim()).toBe('Before **selected words** after.');
  await expect(page.locator('.limr-reader-content [data-limr-marker]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('authored highlight edits persist in source and browser mode remains read-only', async ({ page }) => {
  const original = 'Before ==**selected words**== after.';
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false }), original);
  await page.locator('.limr-reader-content strong').click();
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).not.toHaveAttribute('data-readonly', 'true');
  await toolbar.getByRole('button', { name: 'Edit highlight', exact: true }).hover();
  await toolbar.getByRole('button', { name: 'Rose', exact: true }).click();
  await expect(page.locator('#stream-source')).toContainText('color="#E57373"');
  const source = await page.locator('#stream-source').textContent() ?? '';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  await page.locator('.limr-reader-content strong').click();
  await expect(toolbar).toHaveAttribute('data-readonly', 'true');
  await expect(toolbar.getByRole('button')).toHaveCount(1);
  await expect(page.locator('#stream-source')).toHaveText(source);
});
