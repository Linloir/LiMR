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

for (const nested of [false, true]) test(`huge code and virtual book scrolling preserve independent state during animation (${nested ? 'nested' : 'page'})`, async ({ page }) => {
  await page.goto('/large-reader.html');
  const code = Array.from({ length: 15_000 }, (_, i) => `code ${i}: ${'long_content_'.repeat(10)}`).join('\n');
  const source = '# Beginning\n\n```text\n' + code + '\n```\n\n' +
    Array.from({ length: 1800 }, (_, i) => `Paragraph ${i}. ${'Ordinary prose. '.repeat(5)}\n\n`).join('') + '# Book end\n\nCOMPLETE-BOOK-END';
  await page.evaluate(({ source, nested }) => {
    let scrollRoot: HTMLElement | undefined;
    if (nested) {
      scrollRoot = document.createElement('div'); scrollRoot.id = 'book-scroller'; scrollRoot.style.cssText = 'height:600px;overflow:auto';
      const root = document.getElementById('root')!; root.before(scrollRoot); scrollRoot.append(root);
    }
    (window as any).reading.render({ source, scrollRoot, sidebar: false, toc: false, parameters: { codeBlock: { lineNumbers: true } } });
  }, { source, nested });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  const block = page.locator('.limr-code-block');
  await expect(block).toHaveAttribute('data-collapsed', 'true');
  await block.locator('.limr-code-fold').click();
  await block.locator('.limr-code-wrap').click();
  // Leave during the height transition, then return after actual unmount.
  await page.evaluate(nested => {
    (document.activeElement as HTMLElement)?.blur();
    const root = nested ? document.getElementById('book-scroller')! : document.scrollingElement!;
    root.scrollTop = root.scrollHeight;
  }, nested);
  await expect(block).toHaveCount(0);
  await expect(page.getByText('COMPLETE-BOOK-END', { exact: true })).toBeInViewport();
  expect(await page.locator('[data-window-slot]').count()).toBeLessThan(200);
  await page.evaluate(nested => {
    const root = nested ? document.getElementById('book-scroller')! : document.scrollingElement!;
    root.scrollTop = 0;
  }, nested);
  await expect(block).toBeVisible();
  await expect(block).not.toHaveAttribute('data-collapsed');
  await expect(block).toHaveAttribute('data-wrap', 'true');
  await expect.poll(() => block.locator('pre').evaluate(pre => pre.clientHeight / parseFloat(getComputedStyle(pre).lineHeight))).toBeCloseTo(40, 1);
  expect(await block.locator('.limr-code-line').count()).toBeLessThan(300);
  await block.locator('.limr-code-fold').click();
  await expect.poll(() => block.locator('pre').evaluate(pre => pre.clientHeight / parseFloat(getComputedStyle(pre).lineHeight))).toBeCloseTo(8, 1);
  await page.evaluate(() => {
    const { api } = (window as any).reading, start = api.document.getSnapshot().source.indexOf('Paragraph 900.');
    api.scrollToSource({ start, end: start + 1 });
  });
  await expect(page.getByText(/^Paragraph 900\./)).toBeInViewport();
  const movement = await page.evaluate(async nested => {
    const values: number[] = [];
    for (let i = 0; i < 20; i++) { await new Promise(requestAnimationFrame); values.push(nested ? document.getElementById('book-scroller')!.scrollTop : scrollY); }
    return Math.max(...values) - Math.min(...values);
  }, nested);
  expect(movement).toBeLessThan(2);
  // Source navigation into an unmounted, folded block must reveal the inner
  // code viewport before the outer book tries to align the requested text.
  await page.evaluate(() => {
    const { api } = (window as any).reading, start = api.document.getSnapshot().source.indexOf('code 12000:');
    api.scrollToSource({ start, end: start + 1 });
  });
  await expect(block).not.toHaveAttribute('data-collapsed');
  await expect(block.locator('[data-line="12001"]')).toBeInViewport();
  expect(await block.locator('pre').evaluate(pre => pre.scrollTop)).toBeGreaterThan(100_000);
  expect(await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source)).toBe(source);
});

test('source navigation opens and scrolls a bounded code viewport in an ordinary Reader', async ({ page }) => {
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(() => {
    const source = '```text\n' + Array.from({ length: 1000 }, (_, i) => `code ${i}`).join('\n') + '\n```';
    window.limrStream({ source, streaming: false, parameters: { codeBlock: { lineNumbers: true } } });
    const start = source.indexOf('code 900');
    window.limrStreamRuntime!.scrollToSource({ start, end: start + 1 });
  });
  await expect(page.locator('.limr-code-block')).not.toHaveAttribute('data-collapsed');
  await expect(page.locator('[data-line="901"]')).toBeInViewport();
});
