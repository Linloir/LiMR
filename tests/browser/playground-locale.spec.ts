import { expect, test, type Page } from '@playwright/test';

async function language(page: Page, label: '中文' | 'English') {
  await page.getByRole('button', { name: '界面语言 / Reader language' }).click();
  await page.getByRole('button', { name: label, exact: true }).click();
}

async function selectPassage(page: Page) {
  const passage = page.locator('.limr-reader-content strong').first();
  await passage.scrollIntoViewIfNeeded();
  await passage.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/playground');
  await language(page, 'English');
});

test('English document controls, dropdowns and editor affordances remain usable', async ({ page }) => {
  const controls = page.locator('.demo-commandbar');
  for (const name of ['Edit', 'Load', 'Plugins', 'Stream demo']) {
    await expect(controls.getByRole('button', { name, exact: true })).toBeVisible();
  }
  await expect(controls).not.toContainText(/[\u3400-\u9fff]/);

  await controls.getByRole('button', { name: 'Load', exact: true }).click();
  const load = page.locator('#demo-load-menu');
  for (const name of ['Load saved document', 'Open Markdown file', 'Download Markdown']) {
    await expect(load.getByRole('button', { name, exact: false })).toBeVisible();
  }
  await expect(load).not.toContainText(/[\u3400-\u9fff]/);
  await page.keyboard.press('Escape');
  await expect(controls.getByRole('button', { name: 'Load', exact: true })).toBeFocused();

  await controls.getByRole('button', { name: 'Plugins', exact: true }).click();
  const plugins = page.locator('#demo-plugin-menu');
  for (const name of ['Enable notes and annotations', 'Enable AI assistant', 'Enable inline notes', 'Allow Markdown editing']) {
    await expect(plugins.getByRole('checkbox', { name, exact: true })).toBeVisible();
  }
  await expect(plugins).not.toContainText(/[\u3400-\u9fff]/);
  await page.keyboard.press('Escape');

  await controls.getByRole('button', { name: 'Typography', exact: true }).click();
  const typography = page.getByRole('group', { name: 'Typography', exact: true });
  await expect(typography.getByRole('button')).toHaveText(['Knuth–Plass', 'Standard', 'Justified']);
  await typography.getByRole('button', { name: 'Justified', exact: true }).click();
  await expect(page.locator('.limr-reader-content > article')).toHaveAttribute('data-limr-typography', 'justify');

  await controls.getByRole('button', { name: 'Translation display', exact: true }).click();
  const translations = page.getByRole('group', { name: 'Translation display', exact: true });
  await expect(translations.getByRole('button')).toHaveText(['Per passage', 'Original', 'Translation', 'Both']);
  await translations.getByRole('button', { name: 'Both', exact: true }).click();
  await expect(controls.getByRole('button', { name: 'Translation display', exact: true })).toContainText('Both');

  await controls.getByRole('button', { name: 'Collapse notes', exact: true }).click();
  const collapse = page.getByRole('group', { name: 'Collapse notes', exact: true });
  await expect(collapse.getByRole('button')).toHaveText(['On', 'Off']);
  await collapse.getByRole('button', { name: 'Off', exact: true }).click();
  await expect(controls.getByRole('button', { name: 'Collapse notes', exact: true })).toContainText('Off');

  await controls.getByRole('button', { name: 'Edit', exact: true }).click();
  await expect(page.getByRole('separator', { name: 'Resize editor width', exact: true })).toHaveAttribute('title', 'Drag or use arrow keys to resize; double-click to restore equal widths');
  const wrap = page.getByRole('button', { name: 'Word wrap', exact: true });
  await wrap.click();
  await expect(wrap).toHaveAttribute('aria-pressed', 'true');
  for (const label of await page.locator('.demo-pane-label').all()) await expect(label).not.toContainText(/[\u3400-\u9fff]/);
  await controls.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('.demo-context-line')).not.toContainText(/[\u3400-\u9fff]/);

  await controls.getByRole('button', { name: 'Stream demo', exact: true }).click();
  await expect(page.getByRole('progressbar', { name: 'Streaming progress', exact: true })).toBeVisible();
  await controls.getByRole('button', { name: 'Stop demo', exact: true }).click();
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await expect(page.locator('.demo-context-line')).not.toContainText(/[\u3400-\u9fff]/);
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Light', exact: true })).toBeVisible();
});

test('unmodified built-in documents follow the selected language and restore their original source', async ({ page }) => {
  await page.reload();
  await expect(page.locator('.demo-commandbar').getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('limr-playground-locale'))).toBe('en');
  for (const [label, heading, chineseHeading] of [
    ['Reading and typography', 'Take your time reading', '阅读，从容一点'],
    ['Leave a note', 'Leave a thought beside the words', '在文字旁，留下想法'],
    ['Mathematics and code', 'Make complex ideas clear', '让复杂的内容，清晰一点'],
  ]) {
    if (label !== 'Reading and typography') {
      await page.getByRole('button', { name: 'Load', exact: true }).click();
      await page.locator('#demo-load-menu').getByRole('button', { name: new RegExp(`^${label}`) }).click();
    }
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    await page.locator('.demo-commandbar').getByRole('button', { name: 'Edit', exact: true }).click();
    const editor = page.getByRole('textbox', { name: 'Markdown source', exact: true });
    const englishSource = await editor.inputValue();
    expect(englishSource.startsWith(`# ${heading}\n`)).toBe(true);
    await language(page, '中文');
    await expect(editor).toHaveValue(new RegExp(`^# ${chineseHeading}\\n`));
    expect(await editor.inputValue()).not.toBe(englishSource);
    await language(page, 'English');
    await expect(editor).toHaveValue(englishSource);
    await page.locator('.demo-commandbar').getByRole('button', { name: 'Save', exact: true }).click();
  }
});

for (const input of ['edited', 'imported', 'built-in'] as const) test(`language switches preserve ${input} text and authored annotations`, async ({ page }) => {
  let source = '# My own document\n\nKeep **these exact words**. 中文原文 stays as authored.';
  const note = '我的旁注 stays as authored.';
  if (input === 'edited' || input === 'built-in') {
    await page.locator('.demo-commandbar').getByRole('button', { name: 'Edit', exact: true }).click();
    const editor = page.getByRole('textbox', { name: 'Markdown source', exact: true });
    if (input === 'edited') await editor.fill(source);
    else source = await editor.inputValue();
    await page.locator('.demo-commandbar').getByRole('button', { name: 'Save', exact: true }).click();
  } else {
    await page.locator('input[type=file]').setInputFiles({ name: 'my-own-document.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  }
  await expect(page.getByRole('heading', { name: input === 'built-in' ? 'Take your time reading' : 'My own document', exact: true })).toBeVisible();
  await selectPassage(page);
  await page.getByRole('toolbar').getByRole('button', { name: 'Margin note', exact: true }).click();
  await page.getByRole('textbox', { name: 'Margin note content', exact: true }).fill(note);
  await page.locator('.limr-sidebar-card[data-type="margin-note"]').getByRole('button', { name: 'Submit', exact: true }).click();
  await page.locator('.demo-commandbar').getByRole('button', { name: 'Edit', exact: true }).click();
  await page.locator('.demo-commandbar').getByRole('button', { name: 'Save', exact: true }).click();
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!));
  expect(before.source).toBe(source);
  expect(before.annotations).toHaveLength(2);
  expect(before.annotations).toEqual(expect.arrayContaining([
    expect.objectContaining({ type: 'margin-note', data: { text: note } }),
    expect.objectContaining({ type: 'highlight' }),
  ]));

  await language(page, '中文');
  await expect(page.locator('.limr-sidebar-card[data-type="margin-note"]')).toContainText(note);
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Markdown source', exact: true });
  await expect(editor).toHaveValue(source);
  await expect(page.getByRole('separator', { name: '调整编辑器宽度', exact: true })).toBeVisible();
  await language(page, 'English');
  await expect(editor).toHaveValue(source);
  await page.locator('.demo-commandbar').getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.locator('.limr-sidebar-card[data-type="margin-note"]')).toContainText(note);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!))).toEqual(before);
});
