import { expect, test, type Page } from '@playwright/test';

async function source(page: Page, markdown: string) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill(markdown);
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
}

async function saveAnnotations(page: Page) {
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('button', { name: '保存', exact: true }).click();
  return page.evaluate(() => JSON.parse(localStorage.getItem('limr-playground-document')!).annotations);
}

test('default notes absorb code delimiters, cover padding and place their marker after the code', async ({ page }) => {
  const markdown = 'Serialize data objects to `multipart/form-data` or `application/json`.';
  await source(page, markdown);
  const article = page.locator('.limr-reader-content > article'), code = article.locator('code').first();
  await article.locator('p').evaluate(p => {
    const text = document.createTreeWalker(p.querySelector('code')!, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange(); range.selectNodeContents(p); range.setEnd(text, text.textContent!.length);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await page.getByRole('toolbar').getByRole('button', { name: '脚注', exact: true }).click();
  const card = page.locator('.limr-sidebar-card[data-type="reader-footnote"]');
  await card.getByRole('textbox', { name: '脚注内容' }).fill('Code explanation');
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await expect(code.locator('.limr-mark')).toHaveCount(0);
  await expect(article.locator('code + .limr-mark-wrap')).toHaveCount(1);
  const saved = await saveAnnotations(page);
  expect(saved.map((item: any) => item.type).sort()).toEqual(['highlight', 'reader-footnote']);
  for (const annotation of saved) expect(annotation.anchors[0].quote).toBe('Serialize data objects to `multipart/form-data`');
  const rects = await article.locator('.limr-paint-background').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
  expect(Math.max(...rects.map(rect => rect.right))).toBeCloseTo((await code.boundingBox())!.x + (await code.boundingBox())!.width, 1);
  expect(Math.max(...rects.map(rect => rect.top)) - Math.min(...rects.map(rect => rect.top))).toBeLessThan(.5);
  expect(Math.max(...rects.map(rect => rect.height)) - Math.min(...rects.map(rect => rect.height))).toBeLessThan(.5);
  const marker = article.locator('.limr-mark-wrap');
  expect((await marker.boundingBox())!.x).toBeGreaterThanOrEqual((await code.boundingBox())!.x + (await code.boundingBox())!.width);
});

for (const [selected, expected] of [['alpha', '`alpha'], ['beta', 'beta`'], ['pha be', 'pha be']]) test(`code edge expansion preserves the other boundary when selecting ${selected}`, async ({ page }) => {
  await source(page, 'Before `alpha beta` after.');
  const code = page.locator('.limr-reader-content .limr-inline-code');
  const native = await code.evaluate((code, selected) => {
    const node = document.createTreeWalker(code, NodeFilter.SHOW_TEXT).nextNode()!;
    const at = node.textContent!.indexOf(selected), range = document.createRange();
    range.setStart(node, at); range.setEnd(node, at + selected.length);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    return range.getBoundingClientRect().toJSON();
  }, selected);
  await page.getByRole('toolbar').getByRole('button', { name: '添加高亮', exact: true }).click();
  const saved = await saveAnnotations(page);
  expect(saved[0].anchors[0].quote).toBe(expected);
  const paint = page.locator('.limr-paint-background');
  await expect(paint).toHaveCount(1);
  const bounds = (await paint.boundingBox())!, shell = (await code.boundingBox())!;
  expect(bounds.x).toBeCloseTo(selected === 'alpha' ? shell.x : native.left, 1);
  expect(bounds.x + bounds.width).toBeCloseTo(selected === 'beta' ? shell.x + shell.width : native.right, 1);
});

test('inline math and nested formats keep their annotation outside the completed syntax inside a custom block', async ({ page }) => {
  await source(page, '<definition title="A block">\n\nSelect ***`code here`*** and $x^2$ inside this block.\n\n</definition>');
  const content = page.locator('.limr-reader-content .limr-definition');
  await expect(content.locator('.katex')).toHaveCount(1);
  for (const [selector, quote] of [['code', '***`code here`***'], ['.limr-atomic', '$x^2$']]) {
    const target = content.locator(selector).first();
    await target.evaluate(element => {
      const range = document.createRange(); range.selectNodeContents(element);
      getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    });
    await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
    const card = page.locator('.limr-sidebar-card[data-type="reading-note"][data-expanded]');
    await card.getByRole('textbox', { name: '笔记内容' }).fill('A syntax-aware note');
    await card.getByRole('button', { name: '提交', exact: true }).click();
    await expect(target.locator('.limr-mark')).toHaveCount(0);
    const saved = await saveAnnotations(page);
    const notes = saved.filter((item: any) => item.type === 'reading-note');
    expect(notes.at(-1).anchors[0].quote).toBe(quote);
    if (selector === 'code') await expect(content.locator('em + .limr-mark-wrap')).toHaveCount(1);
    else {
      await expect(content.locator('.limr-atomic + .limr-mark-wrap')).toHaveCount(1);
      const formula = (await target.boundingBox())!, paint = (await content.locator('.limr-paint-background[data-atomic]').boundingBox())!;
      expect(paint.x).toBeCloseTo(formula.x, 1); expect(paint.width).toBeCloseTo(formula.width, 1);
    }
  }
});
