import { expect, test } from '@playwright/test';

for (const typography of ['standard', 'justify', 'knuth-plass'] as const) test(`long inline math remains bounded and source-copyable with ${typography}`, async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const value = 'sdlfkjsldkjsdlkfjsldkfjsldkfjsldkfjlaksdjf';
  const source = `开始和结束边界使用相同的范围 ID；只有完整$${value}$的标注定义引用该 ID 时，边界才生效。`;
  await page.evaluate(({ source, typography }) => window.limrStream({ source, typography, streaming: false }), { source, typography });
  const paragraph = page.locator('article > p'), scroll = paragraph.locator('[data-limr-math-scroll],[data-limr-kp-scroll]');
  await expect(scroll).toHaveCount(1);
  await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
  expect(await scroll.evaluate(element => { element.scrollLeft = element.scrollWidth; return element.scrollLeft; })).toBeGreaterThan(10);
  await paragraph.locator('[data-limr-atomic]').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(`$${value}$`);
  await page.keyboard.press('ControlOrMeta+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`$${value}$`);
  await page.setViewportSize({ width: 320, height: 1000 });
  await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await page.setViewportSize({ width: 1200, height: 1000 });
  await expect(scroll).toHaveCount(0);
});

test('native math uses operator breaks, leaves short baselines alone and bounds formulas in headings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const source = '# $' + 'abcdefgh'.repeat(12) + '$\n\nShort $x^2$. Long $' + Array.from({ length: 30 }, (_, i) => `a_{${i}}`).join(' + ') + '$.';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  await expect(page.locator('h1 [data-limr-math-scroll]')).toHaveCount(1);
  const paragraph = page.locator('article > p');
  await expect(paragraph.locator('.katex')).toHaveCount(2);
  await expect(paragraph.locator('[data-limr-math-scroll]')).toHaveCount(0);
  await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
  const rows = await paragraph.locator('.katex').last().locator('.katex-base').evaluateAll(bases => new Set(bases.map(base => base.getBoundingClientRect().top)).size);
  expect(rows).toBeGreaterThan(2);
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'knuth-plass' }), source);
  await expect(page.locator('h1 [data-limr-math-scroll]')).toHaveCount(1);
});
