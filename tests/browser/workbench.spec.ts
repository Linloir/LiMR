import { expect, test, type Page } from '@playwright/test';
import { sample } from '../../playground/sample';

async function important(page: Page) {
  await page.locator('.limr-reader-content strong').first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

for (const width of [560, 1440]) test(`reading note modules keep borderless editor focus at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/#/playground');
  for (const label of ['旁注', '笔记', '提问', '脚注']) {
    await important(page);
    await page.getByRole('toolbar').getByRole('button', { name: label, exact: true }).click();
    const surface = page.locator(width < 800 ? '.limr-annotation-overlay' : '.limr-sidebar-card');
    const editor = surface.getByRole('textbox', { name: `${label}内容`, exact: true });
    await expect(editor).toBeFocused();
    await expect(editor).toHaveCSS('outline-style', 'none');
    await expect(editor).toHaveCSS('box-shadow', 'none');
    await expect(editor).toHaveCSS('border-width', '0px');
    await surface.getByRole('button', { name: '取消', exact: true }).click();
    await expect(editor).toHaveCount(0);
  }
});

test('notes open directly in the sidebar, share highlights, and support editing and deletion', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/playground'); await important(page);
  const toolbar = page.getByRole('toolbar');
  await toolbar.getByRole('button', { name: '旁注', exact: true }).click();
  const card = page.locator('.limr-sidebar-card[data-type="margin-note"]');
  await expect(card).toHaveAttribute('data-expanded', 'true');
  const input = card.getByRole('textbox', { name: '旁注内容' });
  await expect(input).toBeFocused();
  await input.fill('我的 **第一个想法**。');
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await expect(card.locator('strong')).toHaveText('第一个想法');
  await card.getByRole('button', { name: '修改', exact: true }).click();
  await input.fill('修改后的旁注。');
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await important(page);
  await toolbar.getByRole('button', { name: '删除', exact: true }).hover();
  await expect(toolbar.locator('.limr-toolbar-delete-hint')).toHaveCount(0);
  await toolbar.getByRole('button', { name: '笔记', exact: true }).click();
  const note = page.locator('.limr-sidebar-card[data-type="reading-note"]');
  await note.getByRole('textbox', { name: '笔记内容' }).fill('同一片段的笔记');
  await note.getByRole('button', { name: '提交', exact: true }).click();
  await expect(page.locator('.demo-context-line output')).toContainText('1 处高亮 · 2 条注释');
  expect(await page.evaluate(() => localStorage.getItem('limr-playground-document'))).toBeNull();
  await important(page);
  const hint = toolbar.locator('.limr-toolbar-delete-hint');
  await expect(hint).not.toBeVisible();
  await toolbar.getByRole('button', { name: '删除', exact: true }).hover();
  await expect(hint).toBeVisible();
  await expect(hint).toContainText('2 个注释');
  await toolbar.getByRole('button', { name: '复制', exact: true }).hover();
  await expect(hint).not.toBeVisible();
  await toolbar.getByRole('button', { name: '隐藏高亮', exact: true }).click();
  await expect(toolbar.getByRole('button', { name: '显示高亮', exact: true })).toBeVisible();
  await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveAttribute('data-muted', '');
  await toolbar.getByRole('button', { name: '显示高亮', exact: true }).click();
  await toolbar.getByRole('button', { name: '删除', exact: true }).click();
  await expect(card).toHaveCount(0); await expect(note).toHaveCount(0);
  await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('text save/load, file import/export and presets share the editor while streaming uses the current draft', async ({ page }) => {
  await page.goto('/#/playground'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  const source = '# My current draft\n\n' + 'This text belongs to this session. '.repeat(30);
  const editor = page.getByRole('textbox', { name: 'Markdown source' });
  await editor.fill(source);
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await expect(page.locator('.demo-context-line output')).toHaveText('已保存到此浏览器，可从加载菜单手动打开');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '公式与代码', exact: false }).click();
  await expect(editor).toContainText('import { Reader }');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '加载已保存文本' }).click();
  await expect(editor).toHaveValue(source);
  await page.getByRole('button', { name: '流式演示', exact: true }).click();
  await expect(page.getByRole('progressbar')).toBeVisible();
  await expect(page.locator('.limr-reader h1')).toHaveText('My current draft');
  await page.getByRole('button', { name: '结束演示', exact: true }).click();
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await expect(editor).toHaveValue(source);
  const imported = '# Imported file\n\n**Keep this text.**';
  await page.locator('input[type=file]').setInputFiles({ name: 'imported.md', mimeType: 'text/markdown', buffer: Buffer.from(imported) });
  await expect(editor).toHaveValue(imported);
  await page.getByRole('button', { name: '加载', exact: true }).click();
  const download = page.waitForEvent('download'); await page.getByRole('button', { name: '下载 Markdown' }).click();
  const downloaded = await download;
  expect(downloaded.suggestedFilename()).toBe('limr-notes.md');
  const stream = await downloaded.createReadStream(); const chunks: Buffer[] = []; for await (const chunk of stream!) chunks.push(chunk);
  expect(Buffer.concat(chunks).toString()).toBe(imported);
  await page.reload(); await page.getByRole('button', { name: '加载', exact: true }).click(); await page.getByRole('button', { name: '加载已保存文本' }).click();
  await expect(page.locator('.limr-reader h1')).toHaveText('My current draft');
});

test('refresh starts with the default document and preset, retaining only explicitly saved drafts for manual loading', async ({ page }) => {
  await page.goto('/#/playground');
  const saved = '# Saved draft\n\nKeep only when explicitly loaded.';
  await page.evaluate(source => localStorage.setItem('limr-playground-document', JSON.stringify({ version: 2, source, annotations: [] })), saved);
  await page.reload();
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(sample);
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await expect(page.getByRole('group', { name: '预设文本' }).locator('[aria-pressed="true"]')).toContainText('阅读与排版');
  await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill('# Unsaved edits');
  await page.reload();
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(sample);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!).source)).toBe(saved);
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await expect(page.getByRole('group', { name: '预设文本' }).locator('[aria-pressed="true"]')).toContainText('阅读与排版');
  await page.getByRole('button', { name: '加载已保存文本' }).click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(saved);
});

test('the same page runs the assistant and supports light/dark controls on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/playground'); await page.getByRole('button', { name: '深色', exact: true }).click();
  await important(page);
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-limr-theme', 'dark');
  await page.getByRole('toolbar').getByRole('button', { name: '询问助手', exact: true }).click();
  await expect(page.locator('.limr-annotation-expanded')).toContainText('本地模拟回答');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await expect(page.getByRole('group', { name: '预设文本' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: '浅色', exact: true }).click();
  await expect(page.locator('.limr-reader')).toHaveAttribute('data-limr-theme', 'light');
});

test('copying an existing highlight preserves decoded attribute text and literal code', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#/playground'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill('<definition title="Title &amp; 😀"><content>Body</content></definition>\n\n```ts\ntest & value\n```');
  for (const [selector, expected] of [['.limr-definition-title', 'Title & 😀'], ['.limr-code-block code', 'test & value']]) {
    const text = page.locator(selector); await text.scrollIntoViewIfNeeded();
    await text.evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
    await page.getByRole('toolbar').getByRole('button', { name: '添加高亮', exact: true }).click();
    await text.locator('mark').first().click();
    await page.getByRole('toolbar').getByRole('button', { name: '复制', exact: true }).click();
    expect((await page.evaluate(() => navigator.clipboard.readText())).trim()).toBe(expected);
    await page.keyboard.press('Escape');
  }
});

test('mobile annotations open an editor, preserve drafts on resize, and remain editable after saving', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/playground'); await important(page);
  await page.getByRole('toolbar').getByRole('button', { name: '脚注', exact: true }).click();
  const overlay = page.locator('.limr-annotation-preview');
  await expect(overlay).toBeVisible();
  await expect(page.locator('.limr-annotation-expanded')).toHaveCount(0);
  await expect(overlay.getByRole('button', { name: '展开', exact: true })).toHaveCount(0);
  const field = overlay.getByRole('textbox', { name: '脚注内容' });
  await expect(field).toBeFocused(); await field.fill('保留这条正在编辑的脚注');
  await page.setViewportSize({ width: 1440, height: 1000 });
  const card = page.locator('.limr-sidebar-card[data-type="reader-footnote"]');
  await expect(card.getByRole('textbox', { name: '脚注内容' })).toHaveValue('保留这条正在编辑的脚注');
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await overlay.getByRole('button', { name: '修改', exact: true }).click();
  await field.fill('修订后的脚注');
  await overlay.getByRole('button', { name: '提交', exact: true }).click();
  await expect(overlay).toContainText('修订后的脚注');
  await overlay.getByRole('button', { name: '删除', exact: true }).click();
  await expect(overlay).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('activating an annotation temporarily masks other fragments and restores them on dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/playground'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill('# Focus\n\n**Alpha** and **Bravo** are separate fragments.');
  await page.getByRole('button', { name: '保存', exact: true }).click();
  for (const word of ['Alpha', 'Bravo']) {
    await page.locator('.limr-reader-content strong').filter({ hasText: word }).evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
    await page.getByRole('toolbar').getByRole('button', { name: '添加高亮', exact: true }).click();
  }
  await important(page);
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(1);
  await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-muted])')).toHaveCount(1);
  await page.mouse.click(10, 600);
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(0);
  await page.locator('.limr-sidebar-card[data-type="reading-note"]').hover();
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(1);
  await page.mouse.move(10, 600);
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(0);
  await page.locator('.limr-mark').hover();
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(1);
  await page.mouse.move(10, 600);
  await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(0);
});

for (const [presentation, width] of [['sidebar', 1440], ['overlay', 900]] as const) {
  test(`dismissing note editing in the ${presentation} restores highlight actions and preserves the draft`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/playground'); await page.getByRole('button', { name: '编辑', exact: true }).click();
    await page.getByRole('textbox', { name: 'Markdown source' }).fill('# Highlight actions\n\n**Alpha** and **Bravo** are separate fragments.\n\n**Charlie** remains unmarked.');
    await page.getByRole('button', { name: '保存', exact: true }).click();
    const toolbar = page.getByRole('toolbar');
    const word = (text: string) => page.locator('.limr-reader-content strong').filter({ hasText: text });
    for (const text of ['Alpha', 'Bravo']) {
      await word(text).evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
      await toolbar.getByRole('button', { name: '添加高亮', exact: true }).click();
      await expect(toolbar).toHaveCount(0);
    }
    const highlights = page.locator('.limr-highlight-layer [data-paint]');
    await expect(highlights).toHaveCount(2);
    const firstId = (await highlights.nth(0).getAttribute('data-paint'))!;
    const secondId = (await highlights.nth(1).getAttribute('data-paint'))!;
    await word('Alpha').click();
    await expect(toolbar).toHaveAttribute('data-highlight', firstId);
    await toolbar.getByRole('button', { name: '笔记', exact: true }).click();
    const editor = presentation === 'sidebar' ? page.locator('.limr-sidebar-card[data-type="reading-note"]') : page.locator('.limr-annotation-preview');
    const field = editor.getByRole('textbox', { name: '笔记内容' });
    await expect(field).toBeFocused();
    await field.fill('A draft to keep after dismissal');
    await expect(toolbar).toHaveCount(0);
    await page.mouse.click(10, 850);
    await expect(field).not.toBeVisible();
    await expect(page.locator('.limr-highlight-layer [data-muted]')).toHaveCount(0);

    await word('Bravo').click();
    await expect(toolbar).toBeVisible();
    await expect(toolbar).toHaveAttribute('data-highlight', secondId);
    await word('Alpha').click();
    await expect(toolbar).toHaveAttribute('data-highlight', firstId);
    await word('Charlie').evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
    await expect(toolbar.getByRole('button', { name: '添加高亮', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');

    await page.locator('.limr-mark').click();
    await expect(field).toBeVisible();
    await expect(field).toHaveValue('A draft to keep after dismissal');
    await expect(toolbar).toHaveCount(0);
    await field.fill('The resumed draft');
    await editor.getByRole('button', { name: '提交', exact: true }).click();
    await expect(editor.locator('.demo-note-content')).toContainText('The resumed draft');
  });
}

test('load and plugin dropdowns work in reading mode and plugin choices stay open for multiple selections', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  const presets = page.getByRole('group', { name: '预设文本' });
  await expect(presets.getByRole('button')).toHaveCount(12);
  await expect(presets.getByRole('button', { name: '逐字抵达', exact: false })).toBeVisible();
  await presets.getByRole('button', { name: '前赤壁赋' }).click();
  await expect(page.locator('.limr-reader h1')).toContainText('前赤壁赋');
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveCount(0);
  await page.getByRole('button', { name: '插件', exact: true }).click();
  const plugins = page.getByRole('group', { name: '插件', exact: true });
  await plugins.getByRole('checkbox', { name: '启用旁注与笔记' }).uncheck();
  await plugins.getByRole('checkbox', { name: '启用 AI 问答' }).uncheck();
  await expect(plugins).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '插件', exact: true })).toBeFocused();
  await page.locator('.limr-reader h1').evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar.getByRole('button', { name: '添加高亮', exact: true })).toBeVisible();
  await expect(toolbar.getByRole('button', { name: /旁注|询问助手/ })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '插件', exact: true }).click();
  await plugins.getByRole('checkbox', { name: '启用旁注与笔记' }).check();
  await page.keyboard.press('Escape');
  await page.locator('.limr-reader h1').evaluate(element => { const range = document.createRange(); range.selectNodeContents(element); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
  await expect(toolbar.getByRole('button', { name: '旁注', exact: true })).toBeVisible();
  await expect(toolbar.getByRole('button', { name: '询问助手', exact: true })).toHaveCount(0);
});
