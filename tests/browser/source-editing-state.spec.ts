import { expect, test, type Page } from '@playwright/test';

const original = 'Before ==words==[^%%limr:r1%%] after.\n\n:::limr-annotation{#n1 ranges="r1" type="footnote"}\nOriginal body.\n:::\n';
async function startEditor(page: Page, width = 1460, source = original) {
  await page.setViewportSize({ width, height: 950 });
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false, sidebar: true }), source);
  await page.locator('.limr-reader-content .limr-mark').click();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Annotation Markdown' });
  await expect(editor).toBeVisible();
  return editor;
}

for (const width of [560, 1460]) test(`source footnote and question editors keep borderless focus at ${width}px`, async ({ page }) => {
  for (const type of ['footnote', 'question']) {
    const editor = await startEditor(page, width, original.replace('type="footnote"', `type="${type}"`));
    await editor.focus();
    await expect(editor).toBeFocused();
    await expect(editor).toHaveCSS('outline-style', 'none');
    await expect(editor).toHaveCSS('box-shadow', 'none');
    const cancel = page.locator('.limr-annotation-editor').getByRole('button', { name: 'Cancel', exact: true });
    await editor.press('Tab');
    await expect(cancel).toBeFocused();
    await expect(cancel).toHaveCSS('outline-style', 'solid');
    await cancel.press('Shift+Tab');
    await expect(editor).toBeFocused();
    await expect(editor).toHaveCSS('outline-style', 'none');
  }
});

test('an unsaved source draft survives responsive sidebar and overlay transitions', async ({ page }) => {
  const editor = await startEditor(page);
  await editor.fill('Unsaved **draft**.');
  for (const width of [560, 1460]) {
    await page.setViewportSize({ width, height: 950 });
    await expect(editor).toBeVisible();
    await expect(editor).toHaveValue('Unsaved **draft**.');
    await expect(page.locator('#stream-source')).toHaveText(original);
  }
  await editor.press('ControlOrMeta+Enter');
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('Unsaved **draft**.');
});

test('external source changes retain the draft and require conflict recovery before saving', async ({ page }) => {
  const editor = await startEditor(page);
  await editor.fill('My draft.');
  const changed = original.replace('Original body.', 'Changed elsewhere.');
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false, sidebar: true }), changed);
  await expect(editor).toHaveValue('My draft.');
  await editor.press('ControlOrMeta+Enter');
  await expect(page.getByRole('alert')).toContainText('source changed elsewhere');
  await expect(page.locator('#stream-source')).toHaveText(changed);
  await page.getByRole('button', { name: 'Load current content', exact: true }).click();
  await expect(editor).toHaveValue('Changed elsewhere.');
  await editor.fill('Merged body.');
  await editor.press('ControlOrMeta+Enter');
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('Merged body.');
});

test('accepted source edits with surrounding blank lines close cleanly', async ({ page }) => {
  const editor = await startEditor(page);
  await editor.fill('\nSaved body.\n\n');
  await editor.press('ControlOrMeta+Enter');
  await expect(editor).toHaveCount(0);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('\nSaved body.\n\n');
});

test('temporarily disabling source editing preserves an unfinished draft', async ({ page }) => {
  const editor = await startEditor(page);
  await editor.fill('Keep this draft.');
  await page.evaluate(source => window.limrStream({ source, editable: false, streaming: false, sidebar: true }), original);
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(original);
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false, sidebar: true }), original);
  await expect(editor).toHaveValue('Keep this draft.');
  await editor.press('ControlOrMeta+Enter');
  await expect(page.locator('#stream-source')).toContainText('Keep this draft.');
});

for (const width of [560, 1460]) test(`shared inline-note editor grows with content and separates cancel, submit and outside blur at ${width}px`, async ({ page }, testInfo) => {
  const source = original.replace('type="footnote"', 'type="inline-note"');
  const editor = await startEditor(page, width, source);
  await expect(editor).toBeFocused();
  await expect(editor).toHaveAttribute('placeholder', 'Write a note using Markdown.');
  await expect(editor).toHaveCSS('border-top-width', '0px');
  await expect(editor).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(editor).toHaveCSS('padding', '0px');
  await expect(editor).toHaveCSS('resize', 'none');
  await expect(editor).toHaveCSS('outline-style', 'none');
  await expect(editor).toHaveCSS('box-shadow', 'none');
  const form = page.locator('.limr-annotation-editor');
  const initial = (await editor.boundingBox())!.height;
  await editor.fill('First line.\nSecond line with **Markdown**.\nThird line.');
  expect((await editor.boundingBox())!.height).toBeGreaterThan(initial * 2);
  const submit = form.getByRole('button', { name: 'Submit', exact: true });
  await submit.focus();
  await expect(editor).toBeVisible();
  await expect(page.locator('#stream-source')).toHaveText(source);
  const geometry = await form.evaluate(element => {
    const bounds = element.getBoundingClientRect(), actions = element.querySelector('.limr-annotation-actions')!.getBoundingClientRect(), button = element.querySelector('button[type="submit"]')!.getBoundingClientRect();
    return { bottom: bounds.bottom - actions.bottom, right: bounds.right - button.right };
  });
  expect(geometry.bottom).toBeLessThan(3); expect(geometry.right).toBeLessThan(4);
  await testInfo.attach(`inline-editor-${width}`, { body: await page.screenshot(), contentType: 'image/png' });
  await form.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(source);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(editor).toHaveValue('Original body.');
  await editor.fill('Discard with Escape'); await editor.press('Escape');
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(source);
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await editor.fill('Submitted body.');
  await form.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('Submitted body.');
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await editor.fill('Saved after leaving the editor.');
  await page.locator('.limr-reader-content').click({ position: { x: 4, y: 4 } });
  await expect(editor).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('Saved after leaving the editor.');
});
