import { expect, test } from '@playwright/test';

test('a giant wrapped source line stays bounded, retains exact text, and folds with a source-line count', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const value = 'abc👨‍👩‍👧‍👦e\u0301中文 '.repeat(45_000) + 'COMPLETE-CODE-END';
  await page.evaluate(value => window.limrStream({ source: '```text\n' + value + '\n```', streaming: false, parameters: { codeBlock: { autoCollapse: false } } }), value);
  const block = page.locator('.limr-code-block'), pre = block.locator('pre');
  await block.locator('.limr-code-wrap').click();
  await expect(block.locator('.limr-code-fold')).toBeVisible();
  await expect.poll(() => pre.evaluate(pre => pre.clientHeight / parseFloat(getComputedStyle(pre).lineHeight))).toBeCloseTo(40, 1);
  expect(await pre.evaluate(pre => pre.scrollWidth - pre.clientWidth)).toBeLessThan(2);
  expect(await block.locator('.limr-code-part').count()).toBeGreaterThan(100);
  await block.locator('code').evaluate(code => {
    const range = document.createRange(); range.selectNodeContents(code); getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  expect(await page.evaluate(() => getSelection()!.toString())).toBe(value);
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(value);
  await page.keyboard.press('ControlOrMeta+c'); expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await pre.evaluate(pre => { pre.scrollTop = pre.scrollHeight; });
  await expect.poll(() => pre.evaluate(pre => pre.scrollHeight - pre.scrollTop - pre.clientHeight)).toBeLessThan(2);
  await block.locator('.limr-code-fold').click();
  await expect(block.locator('.limr-code-footer')).toContainText('1 folded / 1 lines');
  await expect.poll(() => pre.evaluate(pre => pre.scrollTop)).toBe(0);
  await page.emulateMedia({ media: 'print' });
  await expect(pre).toHaveCSS('max-height', 'none');
  expect(await block.locator('code').textContent()).toBe(value);
  await expect(block.locator('.limr-code-part').first()).toHaveCSS('display', 'inline');
});

test('large numbered code defers distant line decorations while keeping selection, highlights, find and print complete', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const value = Array.from({ length: 50_000 }, (_, i) => `line ${i}: &amp; literal \\* 😀`).join('\n');
  await page.evaluate(value => window.limrStream({ source: '```text\n' + value + '\n```', streaming: false, parameters: { codeBlock: { lineNumbers: true } } }), value);
  const block = page.locator('.limr-code-block'), pre = block.locator('pre'), code = block.locator('code');
  await expect.poll(() => code.locator('.limr-code-line').count()).toBeGreaterThan(0);
  expect(await code.locator('.limr-code-line').count()).toBeLessThan(300);
  expect(await code.locator('*').count()).toBeLessThan(3000);
  await block.locator('.limr-code-fold').click();
  await expect.poll(() => pre.evaluate(pre => pre.clientHeight / parseFloat(getComputedStyle(pre).lineHeight))).toBeCloseTo(40, 1);
  expect(await pre.evaluate(pre => pre.scrollHeight)).toBeGreaterThan(1_000_000);
  await pre.evaluate(pre => { pre.scrollTop = pre.scrollHeight; });
  await expect(code.locator('[data-line="50000"]')).toBeAttached();
  await expect.poll(() => code.locator('.limr-code-line').count()).toBeLessThan(300);
  await code.evaluate(code => {
    const range = document.createRange(); range.selectNodeContents(code); getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  expect(await page.evaluate(() => getSelection()!.toString())).toBe(value);
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(value);
  await page.keyboard.press('ControlOrMeta+c'); expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  // Native find reaches text whose line wrappers have never been mounted.
  expect(await page.evaluate(() => (window as any).find('line 25000:'))).toBe(true);
  await expect.poll(() => pre.evaluate(pre => pre.scrollTop)).toBeGreaterThan(500_000);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await expect(code.locator('.limr-code-line')).toHaveCount(50_000);
  await page.emulateMedia({ media: 'print' });
  await expect(code.locator('.limr-code-chunk').last()).toHaveCSS('content-visibility', 'visible');
  expect(await code.textContent()).toBe(value);
  await page.emulateMedia({ media: 'screen' });
  await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
  await expect.poll(() => code.locator('.limr-code-line').count()).toBeLessThan(300);
});
