import { expect, test, type Locator, type Page } from '@playwright/test';

async function separate(page: Page, card: Locator) {
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toBeVisible(); await expect(card).toBeVisible();
  await expect.poll(async () => {
    const a = (await toolbar.boundingBox())!, b = (await card.boundingBox())!;
    return a.x + a.width <= b.x + 1 || b.x + b.width <= a.x + 1 || a.y + a.height <= b.y + 1 || b.y + b.height <= a.y + 1;
  }).toBe(true);
  const box = (await toolbar.boundingBox())!, view = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(view.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(view.height + 1);
}

async function stream(page: Page, source: string) {
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true, editable: true }), source);
  await page.evaluate(() => document.fonts.ready);
}

const blocks = [
  ['math', '$$\nx^2 + y^2 = z^2\n$$', '.katex-html'],
  ['code', '```ts\nconst value = 42;\n```', '.limr-code-block'],
  ['mermaid', '```mermaid\nflowchart LR\nA-->B\n```', '.limr-mermaid-canvas svg'],
  ['custom', '<atomic-card title="Card title">\n\n**Body** with $x$.\n\n</atomic-card>', '[data-atomic-card]'],
] as const;

for (const width of [560, 1500]) for (const [name, block, selector] of blocks) {
  test(`${name} marker keeps its source tools alongside its card at ${width}px`, async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.setViewportSize({ width, height: 950 });
    await stream(page, `# Atomic annotations\n\n::%%limr%%{<#r}\n${block}\n::%%limr%%{>#r}\n\n:::limr-annotation{#note ranges="r" type="inline-note"}\nA note on this ${name} block.\n:::`);
    await expect(page.locator(selector).first()).toBeVisible();
    const marker = page.locator('.limr-reader-content .limr-mark');
    await marker.click();
    const card = page.locator(width > 1120 ? '.limr-sidebar-card[data-expanded]' : '.limr-overlay-positioner');
    await expect(card).toContainText(`A note on this ${name} block.`);
    await separate(page, card);
    const toolbar = page.getByRole('toolbar');
    await toolbar.getByRole('button', { name: 'Copy', exact: true }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).not.toContain('%%limr');
    expect(copied.trim()).toBe(name === 'code' ? 'const value = 42;' : block);
    await expect(card).toBeVisible(); await expect(toolbar).toBeVisible();
    await toolbar.locator('[data-action-id="highlight-palette"] button').hover();
    await expect(toolbar.locator('.limr-toolbar-panel')).toBeVisible();
    await separate(page, card);
    await card.hover(); await expect(toolbar).toBeVisible();
    await page.keyboard.press('Escape'); await page.mouse.move(2, 2);
    await expect(page.getByRole('toolbar')).toHaveCount(0);
    await marker.click(); await expect(page.getByRole('toolbar')).toBeVisible();
  });
}

test('a tall narrow card leaves a usable toolbar and panel inside the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 430 });
  await stream(page, `::%%limr%%{<#r}words::%%limr%%{>#r}.\n\n:::limr-annotation{#note ranges="r" type="footnote"}\n${'A long note body.\n\n'.repeat(30)}:::`);
  await page.locator('.limr-reader-content .limr-mark').click();
  const card = page.locator('.limr-overlay-positioner');
  await separate(page, card);
  await page.getByRole('toolbar').locator('[data-action-id="highlight-palette"] button').hover();
  await expect(page.getByRole('toolbar').locator('.limr-toolbar-panel')).toBeVisible();
  await separate(page, card);
  expect(await card.locator('.limr-overlay-content').first().evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(100);
  expect((await page.getByRole('toolbar').locator('.limr-toolbar-panel').boundingBox())!.height).toBeGreaterThan(40);
  await page.setViewportSize({ width: 560, height: 700 }); await separate(page, card);
});

test('height-only viewport changes preserve a readable card and scrollable tools', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await stream(page, `Before ::%%limr%%{<#r}shared words::%%limr%%{>#r} after.\n\n:::limr-annotation{#note ranges="r" type="footnote"}\n${'A long note body.\n\n'.repeat(30)}:::`);
  await page.locator('.limr-reader-content .limr-mark').click();
  const card = page.locator('.limr-overlay-positioner'), toolbar = page.getByRole('toolbar');
  for (const height of [320, 220, 140, 800]) {
    await page.setViewportSize({ width: 390, height });
    await separate(page, card);
    expect((await card.boundingBox())!.height).toBeGreaterThanOrEqual(60);
    if (height < 320) {
      expect(await toolbar.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0);
      await toolbar.locator('[data-action-id="highlight-palette"] button').hover();
      await expect(toolbar.locator('.limr-toolbar-panel')).toBeVisible(); await separate(page, card);
      await toolbar.evaluate(element => { element.scrollTop = element.scrollHeight; });
      expect(await toolbar.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
      await toolbar.evaluate(element => { element.scrollTop = 0; });
    }
  }
});

for (const width of [560, 1500]) test(`new math inline notes reopen their marker tools after saving at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 });
  await stream(page, '# Formula\n\n$$\nx^2 + y^2 = z^2\n$$');
  const math = page.locator('.katex-html'); await expect(math).toBeVisible();
  await math.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range); document.dispatchEvent(new Event('selectionchange'));
  });
  await page.getByRole('toolbar').getByRole('button', { name: 'Add inline note', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Annotation Markdown' });
  await expect(page.getByRole('toolbar')).toHaveCount(0);
  await editor.fill('Saved formula note.');
  await page.locator('.limr-annotation-editor').getByRole('button', { name: 'Submit', exact: true }).click();
  await page.mouse.click(2, 2);
  await page.locator('.limr-reader-content .limr-mark').click();
  const card = page.locator(width > 1120 ? '.limr-sidebar-card[data-expanded]' : '.limr-overlay-positioner');
  await expect(card).toContainText('Saved formula note.'); await separate(page, card);
  expect(await page.evaluate(() => getSelection()?.isCollapsed)).toBe(true);
});

test('centered annotation dialogs keep their related toolbar usable by mouse and keyboard', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 560, height: 700 });
  await page.goto('/?fixture=sidebar');
  await page.locator('.limr-reader-content .limr-mark').first().click();
  const card = page.locator('.limr-overlay-positioner'), toolbar = page.getByRole('toolbar');
  await expect(card.locator('.limr-annotation-overlay')).toHaveAttribute('data-placement', 'center');
  await separate(page, card);
  const copy = toolbar.getByRole('button', { name: '复制', exact: true });
  await copy.focus(); await expect(copy).toBeFocused(); await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('重要内容');
  await expect(card).toBeVisible();
  await toolbar.locator('[data-action-id="highlight-palette"] button').hover();
  await expect(toolbar.locator('.limr-toolbar-panel')).toBeVisible(); await separate(page, card);
});

test('saved ordinary math notes reopen marker tools after leaving their editor', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  await page.goto('/?fixture=media-annotations');
  const math = page.locator('.limr-math-display'); await expect(math.locator('.katex')).toBeVisible();
  await math.scrollIntoViewIfNeeded();
  await math.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range); document.dispatchEvent(new Event('selectionchange'));
  });
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  await expect(page.getByRole('toolbar')).toHaveCount(0);
  await page.getByRole('textbox', { name: '笔记内容' }).fill('Saved ordinary math note.');
  await page.getByRole('button', { name: '提交', exact: true }).click();
  await page.mouse.click(2, 2);
  const marker = math.locator('xpath=ancestor::*[@data-limr-atomic][1]').locator('.limr-mark');
  await marker.click();
  const card = page.locator('.limr-overlay-positioner');
  await expect(card).toContainText('Saved ordinary math note.'); await separate(page, card);
});
