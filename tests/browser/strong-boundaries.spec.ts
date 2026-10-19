import { expect, test } from '@playwright/test';
import type { SelectionSnapshot } from '../../src/core';

test.beforeEach(async ({ page }) => {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

for (const typography of ['standard', 'knuth-plass'] as const) test(`renders multilingual strong and complete URL text with ${typography} typography`, async ({ page }) => {
  const source = '这是一段**“不可以"**的样例\n\n这也是一段**http:www\\.baidu.com**不可以样例\n\n同样的还有**中文带标点，**或是标点**，后面有**中文等\n\nдо**«текст»**после\n\n前**https://example.com/path**后';
  await page.evaluate(({ source, typography }) => window.limrStream({ source, typography, streaming: false, effect: false }), { source, typography });
  const article = page.locator('.limr-reader-content > article');
  await expect(article.locator('strong')).toHaveText(['“不可以"', 'http:www.baidu.com', '中文带标点，', '，后面有', '«текст»', 'https://example.com/path']);
  await expect(article).not.toContainText('**');
  await expect(article.locator('strong').last().locator('a')).toHaveAttribute('href', 'https://example.com/path');
});

for (const [raw, visible] of [['“中&amp;文\\!”', '“中&文!”'], ['http:www\\.baidu.com', 'http:www.baidu.com'], ['https://example.com/path', 'https://example.com/path']]) test(`maps selected bold text to its exact source: ${raw}`, async ({ page }) => {
  const source = `𠀀前**${raw}**后`;
  await page.evaluate(source => window.limrStream({ source, streaming: false, effect: false }), source);
  const bold = page.locator('.limr-reader-content strong');
  await expect(bold).toHaveText(visible);
  await bold.evaluate(element => {
    const range = document.createRange();
    range.selectNodeContents(element);
    getSelection()!.removeAllRanges();
    getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
  const selection = async (): Promise<SelectionSnapshot | null> => JSON.parse(await page.locator('#stream-selection').textContent() ?? 'null');
  await expect.poll(async () => (await selection())?.raw.sourceText).toBe(raw);
  const selected = (await selection())!;
  expect(selected.quality).toBe('exact');
  expect(selected.raw.ranges).toEqual([{ start: source.indexOf(raw), end: source.indexOf(raw) + raw.length }]);
  expect(selected.syntax.sourceText).toBe(`**${raw}**`);
});
