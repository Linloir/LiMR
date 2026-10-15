import { expect, test, type Page } from '@playwright/test';

async function plugins(page: Page) {
  // Expanded mobile cards are modal; dismiss them before using page controls.
  if (await page.locator('.limr-annotation-expanded[data-state="open"]').count()) await page.keyboard.press('Escape');
  const button = page.getByRole('button', { name: '插件', exact: true });
  if (await button.getAttribute('aria-expanded') !== 'true') await button.click();
  return page.getByRole('group', { name: '插件', exact: true });
}
async function load(page: Page, source: string, annotations: unknown[] = []) {
  await page.goto('/#/playground');
  await page.evaluate(value => localStorage.setItem('limr-playground-document', JSON.stringify(value)), { version: 2, source, annotations });
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '加载已保存文本' }).click();
}
async function select(page: Page) {
  await page.locator('.limr-reader-content strong').first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

for (const width of [560, 1460]) test(`uninstall hides note UI and preserves saved data and hidden notes during range deletion at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  const source = 'Saved **passage** and **answer**.';
  const range = { start: source.indexOf('passage'), end: source.indexOf('passage') + 7 };
  await load(page, source, [
    { id: 'note', type: 'margin-note', range, data: { text: 'Saved note body', draft: 'Saved note body' } },
    { id: 'paint', type: 'highlight', range },
    { id: 'answer', type: 'assistant', range: { start: source.indexOf('answer'), end: source.indexOf('answer') + 6 }, data: { text: 'Saved assistant body', status: 'complete' } },
    { id: 'unknown', type: 'not-installed', range, data: { body: 'Keep unknown data' } },
  ]);
  await expect(page.locator('.limr-mark')).toHaveCount(2);
  if (width > 1000) await expect(page.locator('.limr-sidebar-card[data-type="margin-note"]')).toHaveCount(1);
  else {
    await page.getByRole('button', { name: '旁注', exact: true }).click();
    await expect(page.locator('.limr-annotation-overlay')).toContainText('Saved note body');
  }
  await (await plugins(page)).getByRole('checkbox', { name: '启用旁注与笔记' }).uncheck();
  await expect(page.locator('.limr-mark')).toHaveCount(1);
  await expect(page.locator('.limr-sidebar-card[data-type="margin-note"]')).toHaveCount(0);
  await expect(page.locator('.limr-annotation-overlay[data-type="margin-note"]')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await select(page);
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar.getByRole('button', { name: '旁注', exact: true })).toHaveCount(0);
  await toolbar.getByRole('button', { name: '删除', exact: true }).click();
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('button', { name: '保存', exact: true }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!).annotations.map((annotation: { id: string }) => annotation.id))).toEqual(['note', 'answer', 'unknown']);
  await (await plugins(page)).getByRole('checkbox', { name: '启用旁注与笔记' }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-mark')).toHaveCount(2);
  await page.locator('.limr-mark[aria-label="旁注"]').click();
  const card = width > 1000 ? page.locator('.limr-sidebar-card[data-type="margin-note"]') : page.locator('.limr-annotation-overlay[data-type="margin-note"]');
  await expect(card).toContainText('Saved note body');
  await (await plugins(page)).getByRole('checkbox', { name: '启用 AI 问答' }).uncheck();
  await expect(page.locator('.limr-mark[aria-label="询问助手"]')).toHaveCount(0);
});

test('uninstalling inline notes preserves source, registered questions and default task editing', async ({ page }) => {
  await page.setViewportSize({ width: 1460, height: 1000 });
  const source = '==**passage**==[^%%limr:r1%%]\n\n- [ ] Task\n\n:::limr-annotation{#n1 ranges="r1" type="inline-note"}\nSaved inline note\n:::\n\n:::limr-annotation{#q1 ranges="r1" type="question"}\nA registered question\n:::';
  await load(page, source);
  await expect(page.locator('.limr-sidebar-card[data-type="inline-note"]')).toHaveCount(1);
  let menu = await plugins(page);
  await menu.getByRole('checkbox', { name: '允许修改 Markdown' }).check();
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-task-control input')).toBeEnabled();
  await select(page);
  await expect(page.getByRole('toolbar').getByRole('button', { name: '修改内联笔记', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  menu = await plugins(page);
  await menu.getByRole('checkbox', { name: '启用内联笔记' }).uncheck();
  await expect(page.locator('.limr-mark')).toHaveCount(1);
  await expect(page.locator('.limr-sidebar-card[data-type="inline-note"]')).toHaveCount(0);
  await expect(page.locator('.limr-sidebar-card[data-type="question"]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-reader-content')).toContainText('passage');
  await page.locator('.limr-task-control input').check();
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(source.replace('- [ ]', '- [x]'));
  await page.getByRole('button', { name: '保存', exact: true }).click();
  menu = await plugins(page);
  await menu.getByRole('checkbox', { name: '启用内联笔记' }).check();
  await expect(page.locator('.limr-sidebar-card[data-type="inline-note"]')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-task-control input')).toBeChecked();
});
