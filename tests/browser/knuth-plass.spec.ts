import { expect, test } from '@playwright/test';

for (const width of [1440, 800, 390]) test(`typography dropdown stays within the viewport at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/#/playground');
  await expect(page.locator('.limr-reader-content > article')).toHaveAttribute('data-limr-typography', 'standard');
  await page.getByRole('button', { name: '排版模式', exact: true }).click();
  const menu = page.locator('#demo-typography-menu');
  await expect(menu).toBeVisible();
  const box = (await menu.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(width);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
});

test('scikit-learn scroll keeps cached paragraphs and exact selection/highlight paint', async ({ page, context }) => {
  test.setTimeout(45000);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1380, height: 1000 });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
  await page.getByRole('button', { name: '排版模式', exact: true }).click();
  await page.getByRole('button', { name: 'Knuth–Plass', exact: true }).click();
  const first = page.locator('article > p').first();
  await expect(first).toHaveAttribute('data-limr-kp');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const result = await page.evaluate(async () => {
    const paragraph = document.querySelector('article > p')!, glue = paragraph.querySelector('.limr-kp-glue');
    const height = document.documentElement.scrollHeight, frames: number[] = [];
    for (let pass = 0; pass < 2; pass++) for (let y = 0; y < height; y += 600) {
      scrollTo(0, y);
      const start = performance.now(); await new Promise(requestAnimationFrame); frames.push(performance.now() - start);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    scrollTo(0, 0); await new Promise(resolve => setTimeout(resolve, 500));
    let changes = 0;
    const observer = new MutationObserver(records => { changes += records.filter(record => record.attributeName === 'data-limr-kp').length; });
    observer.observe(paragraph, { attributes: true });
    await new Promise(resolve => setTimeout(resolve, 300)); observer.disconnect();
    return { same: paragraph.querySelector('.limr-kp-glue') === glue, changes, max: Math.max(...frames), count: document.querySelectorAll('[data-limr-kp]').length };
  });
  expect(result.same).toBe(true); expect(result.changes).toBe(0); expect(result.count).toBeGreaterThan(30);
  expect(result.max, 'scroll must not stall for seconds').toBeLessThan(500);
  // A cached offscreen line must not retain its wider viewport's overflow.
  await page.setViewportSize({ width: 600, height: 1000 });
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(600);
  const last = page.locator('article > p').last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute('data-limr-kp');
  await expect(last).not.toHaveAttribute('data-limr-kp-stale');
  await page.setViewportSize({ width: 1380, height: 1000 });
  await page.evaluate(() => scrollTo(0, 0));
  await expect(first).not.toHaveAttribute('data-limr-kp-stale');
  const original = await first.textContent();
  await first.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.locator('#selection-data').textContent().then(value => JSON.parse(value || '{}').raw?.sourceText)).toBe(original);
  await expect.poll(() => page.locator('.limr-paint-selection').count()).toBeGreaterThan(1);
  await page.keyboard.press('Control+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(original);
  await page.getByRole('toolbar').getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect.poll(() => first.locator('.limr-paint-background').count()).toBeGreaterThan(1);
  const geometry = await first.locator('.limr-paint-background').evaluateAll(elements => elements.map(element => {
    const box = element.getBoundingClientRect(); return { width: box.width, height: box.height, opacity: getComputedStyle(element).opacity };
  }));
  expect(geometry.every(rect => rect.width > 100 && rect.height > 10 && rect.opacity === '1')).toBe(true);
  await page.getByRole('button', { name: '排版模式', exact: true }).click();
  await page.getByRole('button', { name: '标准', exact: true }).click();
  await expect(first).not.toHaveAttribute('data-limr-kp');
  await expect(first).toHaveText(original!);
  expect(errors).toEqual([]);
});

test('KP retains rich text, Chinese, resize behavior and an active native range', async ({ page }) => {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  const source = ('Typography **preserves formatting** and _italics_ with `inline code` and $x^2$. 中文标点应该正确换行，选区和高亮不受影响。 ').repeat(6).trim();
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'knuth-plass' }), source);
  const paragraph = page.locator('article > p');
  await expect(paragraph.locator('.katex')).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
  await expect(paragraph).toHaveAttribute('data-limr-kp');
  const text = await paragraph.textContent();
  await paragraph.locator('strong').first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe('preserves formatting');
  await page.setViewportSize({ width: 600, height: 1000 });
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('preserves formatting');
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(5);
  expect(await paragraph.textContent()).toBe(text);
  const lines = await paragraph.getAttribute('data-limr-kp-lines');
  await paragraph.evaluate(element => { element.parentElement!.style.fontSize = '24px'; });
  await expect(paragraph).not.toHaveAttribute('data-limr-kp-lines', lines!);
  await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(5);
  expect(await paragraph.textContent()).toBe(text);
});
