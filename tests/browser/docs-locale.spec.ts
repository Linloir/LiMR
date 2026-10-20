import { expect, test, type Page } from '@playwright/test';

const draft = '# My draft\n\nKeep **these words** and this source<ref id="one" />.\n\n<citation id="one" title="Original source" />';
async function setup(page: Page, language = 'en') {
  await page.addInitScript(({ source, language }) => {
    localStorage.setItem('limr-playground-document', JSON.stringify({ version: 2, source, annotations: [] }));
    localStorage.setItem('limr-playground-locale', language);
  }, { source: draft, language });
}
async function loadDraft(page: Page) {
  await page.getByRole('button', { name: 'Load', exact: true }).click();
  await page.getByRole('button', { name: 'Load saved document' }).click();
}
async function select(page: Page, selector = '.limr-reader-content strong') {
  const target = page.locator(selector).first();
  await target.scrollIntoViewIfNeeded();
  await target.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}
async function openPalette(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await select(page);
  const toolbar = page.getByRole('toolbar');
  const width = (await toolbar.boundingBox())!.width;
  await toolbar.locator('[data-action-id="highlight-palette"] button').hover();
  await expect(toolbar.locator('.limr-highlight-styles')).toBeVisible();
  await expect.poll(async () => (await toolbar.boundingBox())!.width).toBeCloseTo(width, 0);
  return toolbar;
}

test('Docs navigation keeps the draft, switches language, and offers downloadable skills', async ({ page }) => {
  await setup(page); await page.goto('/#/playground'); await loadDraft(page);
  const navigation = page.getByRole('navigation', { name: '页面 / Pages' });
  await expect(navigation.getByRole('link')).toHaveText(['Home', 'Playground', 'Docs', 'GitHub']);
  await navigation.getByRole('link', { name: 'Docs', exact: true }).click();
  await expect(page).toHaveURL(/#\/docs\/en\/README$/);
  const docsNavigation = page.locator('.demo-docs-links');
  await expect(docsNavigation.getByRole('heading')).toHaveText(['Start and author', 'Integrate', 'Extend', 'Reference and verification']);
  await docsNavigation.getByRole('link', { name: 'Getting started', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Load large documents', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Adjust reading policies', exact: true })).toBeVisible();
  await page.locator('.demo-docs-article').getByRole('link', { name: 'table layout', exact: true }).first().click();
  await expect(page).toHaveURL(/#\/docs\/en\/table-layout$/);
  await expect(page.getByRole('heading', { name: 'Choose a reading policy first' })).toBeVisible();
  await docsNavigation.getByRole('link', { name: 'Application integration', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Functions, module names, and tag names' })).toBeVisible();
  await page.getByRole('button', { name: '界面语言 / Reader language' }).click();
  await page.getByRole('button', { name: '中文', exact: true }).click();
  await expect(page).toHaveURL(/#\/docs\/zh-CN\/integration$/);
  await expect(page.getByRole('heading', { name: '函数、模块名和标签名的区别' })).toBeVisible();
  await page.locator('.demo-docs-links').getByRole('link', { name: 'AI Skills', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.locator('.demo-docs-downloads').getByRole('link', { name: '下载 limr-use', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('limr-use.zip');
  await navigation.getByRole('link', { name: 'Playground', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'My draft' })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!).source)).toBe(draft);
  await expect(page.locator('.limr-mark[aria-label="引用"]')).toBeVisible();
  await expect(page.locator('.limr-sidebar-card-heading').filter({ hasText: '引用' })).toBeVisible();
});

test('the syntax document renders working exercises, math, figures, citations, and translations', async ({ page }) => {
  await page.goto('/#/docs/en/syntax');
  const article = page.locator('.demo-docs-article');
  await expect(article.locator('.limr-definition')).toHaveCount(1);
  await article.locator('.katex').first().scrollIntoViewIfNeeded();
  await expect(article.locator('.katex').first()).toBeVisible();
  const question = article.locator('.limr-question');
  await question.getByRole('checkbox', { name: '2', exact: true }).check();
  await question.getByRole('checkbox', { name: '4', exact: true }).check();
  await question.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(question.getByRole('status')).toContainText('Correct');
  const figure = article.locator('.limr-figures');
  await figure.scrollIntoViewIfNeeded();
  await expect.poll(() => figure.locator('img').evaluateAll(elements => elements.every(img => (img as HTMLImageElement).naturalWidth > 0))).toBe(true);
  await expect(article.locator('.limr-translations')).toHaveCount(1);
  await article.locator('.limr-mark[aria-label="Citation"]').first().click();
  await expect(page.locator('.limr-annotation-overlay')).toContainText('Source A');
});

test('English plugin labels and editors follow locale without translating saved content', async ({ page }) => {
  await setup(page); await page.goto('/#/playground'); await loadDraft(page); await select(page);
  for (const name of ['Margin note', 'Note', 'Question', 'Footnote', 'Ask assistant']) await expect(page.getByRole('toolbar').getByRole('button', { name, exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Margin note', exact: true }).click();
  const field = page.getByRole('textbox', { name: 'Margin note content' });
  await field.fill('Keep my own words'); await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await page.locator('.demo-commandbar').getByRole('button', { name: 'Edit', exact: true }).click();
  await page.locator('.demo-commandbar').getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: '界面语言 / Reader language' }).click();
  await page.getByRole('button', { name: '中文', exact: true }).click();
  await expect(page.locator('.limr-sidebar-card[data-type="margin-note"]')).toContainText('旁注');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!).annotations.find((a: { type: string }) => a.type === 'margin-note').data.text)).toBe('Keep my own words');
});

for (const width of [320, 390, 1280]) test(`expanded tools fit their action row at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 });
  await page.goto('/#/docs/en/syntax');
  const toolbar = await openPalette(page);
  const bounds = await toolbar.evaluate(element => {
    const rect = (node: Element) => node.getBoundingClientRect().toJSON();
    return { content: rect(element.querySelector('.limr-overlay-scroll-inner')!), styles: [...element.querySelectorAll('.limr-highlight-styles button')].map(rect), colors: [...element.querySelectorAll('.limr-color-swatch')].map(rect), overflow: element.scrollWidth - element.clientWidth };
  });
  expect(bounds.overflow).toBeLessThanOrEqual(1);
  for (const items of [bounds.styles, bounds.colors]) {
    const rows = new Map<number, typeof items>();
    for (const item of items) { const y = Math.round(item.top); rows.set(y, [...rows.get(y) ?? [], item]); expect(item.right).toBeLessThanOrEqual(bounds.content.right + 1); }
    expect(rows.size).toBeGreaterThan(1);
    for (const row of rows.values()) expect(row[0].left).toBeCloseTo(bounds.content.left, 0);
  }
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  const header = page.locator('.demo-mode-nav');
  const links = await header.getByRole('link').evaluateAll(elements => elements.map(e => e.getBoundingClientRect().toJSON()));
  expect(new Set(links.map(rect => Math.round(rect.top))).size).toBe(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  if (width < 760) {
    await page.getByRole('button', { name: /Documentation ·/ }).click();
    await page.locator('.demo-docs-links').getByRole('link', { name: 'Large documents', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Large documents: loading and reading', exact: true })).toBeVisible();
  }
});

test('a wide action row fits all highlight styles on one line with intact English labels', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await setup(page); await page.goto('/#/playground'); await loadDraft(page);
  const toolbar = await openPalette(page);
  const geometry = await toolbar.locator('.limr-highlight-styles button').evaluateAll(elements => elements.map(element => {
    const label = element.querySelector('.limr-underline')!;
    return { top: element.getBoundingClientRect().top, lines: label.getClientRects().length, display: getComputedStyle(label).display, clone: getComputedStyle(label).boxDecorationBreak };
  }));
  expect(new Set(geometry.map(item => Math.round(item.top))).size).toBe(1);
  for (const item of geometry) { expect(item.lines).toBe(1); expect(item.display).toBe('inline'); expect(item.clone).toBe('clone'); }
});

test('Playground centers the reading column and balances outer margins while the sidebar gains space', async ({ page }) => {
  await setup(page); await page.goto('/#/playground'); await loadDraft(page);
  let previousSidebar = 0;
  for (const width of [390, 900, 1280, 1800, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    const reader = page.locator('.demo-reading .limr-reader');
    await expect.poll(() => reader.locator('.limr-reader-content').evaluate(element => {
      const rect = element.getBoundingClientRect(); return Math.abs(rect.left + rect.width / 2 - innerWidth / 2);
    })).toBeLessThan(1);
    if (width >= 1280) {
      await expect(reader).toHaveAttribute('data-sidebar');
      const geometry = await reader.evaluate(element => {
        const toc = element.querySelector('.limr-reader-toc')!.getBoundingClientRect();
        const sidebar = element.querySelector('.limr-sidebar')!.getBoundingClientRect();
        const content = element.querySelector('.limr-reader-content')!.getBoundingClientRect();
        return { leftMargin: toc.left, rightMargin: innerWidth - sidebar.right, sidebar: sidebar.width, leftGap: content.left - toc.right, rightGap: sidebar.left - content.right };
      });
      expect(geometry.leftMargin).toBeCloseTo(geometry.rightMargin, 0);
      expect(geometry.leftGap).toBeCloseTo(geometry.rightGap, 0);
      expect(geometry.sidebar).toBeGreaterThan(previousSidebar); previousSidebar = geometry.sidebar;
    } else await expect(reader.locator('.limr-reader-mobile-toc')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
