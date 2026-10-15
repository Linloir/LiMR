import { expect, test } from '@playwright/test';

test('a DOM selection from plain text into part of bold text creates exact source highlights', async ({ page }) => {
  const source = '激活 LiMR 阅读器标签页，在 **VS Code 原生编辑器工具栏的 AI 子菜单**中选择安装 Skill。';
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false, sidebar: false }), source);
  const paragraph = page.locator('.limr-reader-content > article > p');
  await expect(paragraph.locator('strong')).toHaveText('VS Code 原生编辑器工具栏的 AI 子菜单');
  const selected = await paragraph.evaluate(element => {
    const first = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()!;
    const bold = document.createTreeWalker(element.querySelector('strong')!, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange();
    range.setStart(first, first.textContent!.indexOf('LiMR'));
    range.setEnd(bold, bold.textContent!.indexOf('工具栏') + 2);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    return range.toString();
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
  const selection = JSON.parse(await page.locator('#stream-selection').textContent() ?? 'null');
  expect(selection.quality).toBe('exact');
  expect(selection.text).toBe(selected);
  expect(selection.raw.ranges).toEqual([{ start: source.indexOf('LiMR'), end: source.indexOf('工具栏') + 2 }]);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.locator('#stream-source')).toContainText('type="highlight"');
  await expect(paragraph.locator('strong')).toHaveText('VS Code 原生编辑器工具栏的 AI 子菜单');
  await expect(paragraph).toHaveText(source.replaceAll('**', ''));
  const changed = await page.locator('#stream-source').textContent() ?? '';
  expect(changed.match(/type="highlight"/g)).toHaveLength(1);
  expect(changed.match(/\[\^%%limr:/g)).toHaveLength(2);
  expect(changed).toMatch(/^激活 ==LiMR 阅读器标签页，在 ==\[\^%%limr:[^\]]+\]\*\*==VS Code 原生编辑器工具==\[\^%%limr:[^\]]+\]栏的 AI 子菜单\*\*中选择安装 Skill。/);
  await expect(page.locator('.limr-highlight-layer .limr-paint-rect')).not.toHaveCount(0);
});
