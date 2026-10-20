import { expect, test } from '@playwright/test';

const value = Array.from({ length: 30 }, (_, index) => `const line${index + 1} = "${'wide_text_'.repeat(15)}";`).join('\n');
const source = '```js\n' + value + '\n```\n\n```text\nshort\n```';

test('code controls fold, wrap and copy full source with balanced button insets and rotation', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 480, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const block = page.locator('.limr-code-block').first(), pre = block.locator('pre'), fold = block.locator('.limr-code-fold');
  await expect(block).toHaveAttribute('data-collapsed', 'true');
  await expect(page.locator('.limr-code-block').last().locator('.limr-code-fold')).toHaveCount(0);
  await expect(pre).toHaveClass('shiki');
  const closedHeight = (await pre.boundingBox())!.height;
  expect(await pre.locator('code').evaluate(code => code.clientHeight / parseFloat(getComputedStyle(code).lineHeight))).toBeCloseTo(8, 1);
  const insets = await block.evaluate(block => {
    const header = block.querySelector('.limr-code-header')!.getBoundingClientRect(), last = block.querySelector('.limr-code-actions > :last-child')!.getBoundingClientRect();
    return { top: last.top - header.top, right: header.right - last.right, order: [...block.querySelectorAll('.limr-code-actions > button')].map(button => button.className) };
  });
  expect(insets.top).toBeCloseTo(insets.right, 1);
  expect(insets.order[0]).toContain('limr-code-wrap'); expect(insets.order[1]).toContain('limr-code-copy'); expect(insets.order[2]).toContain('limr-code-fold');
  await fold.click(); await expect(block).not.toHaveAttribute('data-collapsed');
  await expect(fold).toHaveAttribute('aria-expanded', 'true');
  expect((await pre.boundingBox())!.height).toBeGreaterThan(closedHeight * 2);
  await expect.poll(() => fold.locator('svg').evaluate(svg => getComputedStyle(svg).transform)).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  expect(await pre.evaluate(pre => pre.scrollWidth - pre.clientWidth)).toBeGreaterThan(100);
  await block.locator('.limr-code-wrap').click();
  await expect(block).toHaveAttribute('data-wrap', 'true');
  await expect.poll(() => pre.evaluate(pre => pre.scrollWidth - pre.clientWidth)).toBeLessThan(2);
  await fold.click(); await block.locator('.limr-code-copy').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
  await expect(page.locator('#stream-source')).toHaveText(source);
  await page.emulateMedia({ media: 'print' });
  await expect(pre.locator('code')).toHaveCSS('max-height', 'none');
});

test('line numbers align with wrapped source lines and do not enter selection, highlights or copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 480, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  const value = 'const escaped = "&amp; \\\\* 😀";\r\n\r\nconst wide = "' + 'Unicode_中文_'.repeat(20) + '";';
  const source = '```js\r\n' + value + '\r\n```';
  await page.evaluate(source => window.limrStream({ source, streaming: false, parameters: { codeBlock: { lineNumbers: true, wrap: true } } }), source);
  const block = page.locator('.limr-code-block'), code = block.locator('code');
  await expect(block.locator('pre')).toHaveClass('shiki');
  await expect(code.locator('.limr-code-line')).toHaveCount(3);
  const heights = await code.locator('.limr-code-line').evaluateAll(lines => lines.map(line => line.getBoundingClientRect().height));
  expect(heights[2]).toBeGreaterThan(heights[0]); expect(heights[1]).toBeGreaterThan(0);
  await code.evaluate(code => {
    const range = document.createRange(); range.selectNodeContents(code);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(value);
  expect(await page.evaluate(() => getSelection()?.toString())).toBe(value.replaceAll('\r\n', '\n'));
  await page.keyboard.press('ControlOrMeta+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value.replaceAll('\r\n', '\n'));
  await page.getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(code.locator('mark')).not.toHaveCount(0);
});

test('changing defaults updates untouched blocks while retaining explicit per-block choices', async ({ page }) => {
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const blocks = page.locator('.limr-code-block');
  await blocks.first().locator('.limr-code-fold').click();
  await blocks.first().locator('.limr-code-wrap').click();
  await page.evaluate(source => window.limrStream({ source, streaming: false, parameters: { codeBlock: { autoCollapse: true, wrap: false, lineNumbers: true } } }), source);
  await expect(blocks.first()).not.toHaveAttribute('data-collapsed');
  await expect(blocks.first()).toHaveAttribute('data-wrap', 'true');
  await expect(blocks.last()).not.toHaveAttribute('data-wrap');
  await expect(blocks.first()).toHaveAttribute('data-line-numbers', 'true');
  await page.evaluate(source => window.limrStream({ source, streaming: false, parameters: { codeBlock: { autoCollapse: false, wrap: true } } }), source);
  await expect(blocks.last()).toHaveAttribute('data-wrap', 'true');
  await expect(blocks.first()).not.toHaveAttribute('data-line-numbers');
});

test('modified code state survives real window eviction without source edits or unbounded DOM', async ({ page }) => {
  await page.goto('/large-reader.html');
  const long = source + '\n\n' + Array.from({ length: 1800 }, (_, index) => `Paragraph ${index}. Ordinary prose in a large document.\n\n`).join('');
  await page.evaluate(source => (window as any).reading.render({ source, toc: false, sidebar: false }), long);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  const block = page.locator('.limr-code-block').first();
  await block.locator('.limr-code-fold').click(); await block.locator('.limr-code-wrap').click();
  await page.evaluate(() => { getSelection()?.removeAllRanges(); (document.activeElement as HTMLElement)?.blur(); window.scrollTo(0, document.documentElement.scrollHeight); });
  await expect(page.locator('.limr-code-block')).toHaveCount(0);
  expect(await page.locator('[data-window-slot]').count()).toBeLessThan(200);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(block).toBeVisible();
  await expect(block).not.toHaveAttribute('data-collapsed');
  await expect(block).toHaveAttribute('data-wrap', 'true');
  expect(await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source)).toBe(long);
});
