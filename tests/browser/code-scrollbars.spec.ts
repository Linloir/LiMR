import { expect, test } from '@playwright/test';

// Playwright hides scrollbars by default. Exercise layout-occupying scrollbars
// explicitly so the row budget cannot silently clip the last visible line.
test.use({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } });

test('classic scrollbars preserve short, folded and expanded code row heights', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 1200 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.addStyleTag({ content: 'pre::-webkit-scrollbar { height: 18px; width: 18px; } pre::-webkit-scrollbar-thumb { background: #888; }' });
  const line = 'long_'.repeat(100);
  const block = page.locator('.limr-code-block'), pre = block.locator('pre');
  const rows = () => pre.evaluate(pre => pre.clientHeight / parseFloat(getComputedStyle(pre).lineHeight));
  const scrollbar = () => pre.evaluate(pre => (pre as HTMLElement).offsetHeight - pre.clientHeight);
  await page.evaluate(line => window.limrStream({ source: '```text\n' + line + '\n```', streaming: false }), line);
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(scrollbar).toBe(18);
  await expect.poll(rows).toBeCloseTo(1, 1);
  expect(await pre.evaluate(pre => pre.scrollHeight - pre.clientHeight)).toBeLessThan(2);
  const value = Array.from({ length: 80 }, () => line).join('\n');
  await page.evaluate(value => window.limrStream({ source: '```text\n' + value + '\n```', streaming: false }), value);
  await expect.poll(rows).toBeCloseTo(8, 1);
  await expect(block.locator('.limr-code-footer')).toContainText('72 folded / 80 lines');
  await block.locator('.limr-code-fold').click();
  await expect.poll(rows).toBeCloseTo(40, 1);
  await block.locator('.limr-code-wrap').click();
  await expect.poll(scrollbar).toBe(0);
  await expect.poll(rows).toBeCloseTo(40, 1);
  await block.locator('.limr-code-fold').click();
  await expect.poll(rows).toBeCloseTo(8, 1);
  await block.locator('.limr-code-wrap').click();
  await expect.poll(scrollbar).toBe(18);
  await expect.poll(rows).toBeCloseTo(8, 1);
  await expect(block.locator('code')).toHaveText(value);
});
