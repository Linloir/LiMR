import { expect, test } from '@playwright/test';

test('figures use measured aspect ratios and release manual columns on small containers', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?fixture=media');
  const auto = page.locator('#auto-grid'), manual = page.locator('#manual-grid'), fixed = page.locator('#fixed-grid');
  await expect(auto).toHaveAttribute('data-columns', '2');
  await expect(manual).toHaveAttribute('data-columns', '3');
  await page.getByRole('spinbutton', { name: 'Reader width' }).fill('320');
  await expect(auto).toHaveAttribute('data-columns', '1');
  await expect(manual).toHaveAttribute('data-columns', '1');
  await expect(fixed).toHaveAttribute('data-columns', '3');
  const geometry = await page.locator('#target-figure img').evaluate(image => {
    const bounds = image.getBoundingClientRect(); return { width: bounds.width, height: bounds.height };
  });
  expect(geometry.height).toBeLessThanOrEqual(180);
  expect(Math.abs(geometry.width - geometry.height)).toBeLessThan(1);
  await page.setViewportSize({ width: 360, height: 800 });
  expect(await auto.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('images copy their URL and groups copy the complete Markdown source', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=media');
  const button = page.locator('#auto-grid .limr-figure-copy').first();
  await button.click();
  await expect(button).toHaveAttribute('data-status', 'copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('/papers/feature-channel.png');
  await page.locator('#auto-grid > .limr-figures-copy').click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('<figcaption>A group caption');
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new DOMException('Denied', 'NotAllowedError'); }; });
  await button.click();
  await expect(button).toHaveAttribute('data-status', 'error');
});

test('translation markers cycle inline without cards and animate the following text in both directions', async ({ page }) => {
  await page.goto('/?fixture=media');
  const block = page.locator('.limr-translations').first();
  await block.scrollIntoViewIfNeeded();
  const following = page.getByRole('heading', { name: 'Following paragraph' });
  const originHeight = await block.evaluate(element => element.getBoundingClientRect().height);
  await block.locator('[data-translation-switch]').hover();
  await expect(page.locator('.limr-annotation-overlay')).toHaveCount(0);
  await block.locator('[data-translation-switch]').click();
  await expect(block).toHaveAttribute('data-mode', 'translation');
  await block.locator('[data-translation-switch]').click();
  await expect(block).toHaveAttribute('data-mode', 'both');
  const intermediate = await following.evaluate(element => element.getBoundingClientRect().top);
  await page.waitForTimeout(560);
  const final = await following.evaluate(element => element.getBoundingClientRect().top);
  expect(final).not.toBe(intermediate);
  expect(await block.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThan(originHeight + 30);
  await expect(block.locator('[data-language="origin"] p [data-translation-switch]')).toHaveAttribute('aria-label', '当前对照，切换到原文');
  await expect(block.locator('[data-translation-switch] svg')).toHaveCount(1);
  await expect(block.locator('[data-translation-switch]')).toBeFocused();
  await block.locator('[data-translation-switch]').click();
  await expect(block).toHaveAttribute('data-mode', 'origin');
  await expect.poll(() => block.evaluate(element => element.getBoundingClientRect().height)).toBeCloseTo(originHeight, 0);
  expect(await block.locator('[data-language="translation"]').evaluate(element => !!element.closest('[inert]'))).toBe(true);
});

test('global parameters override and restore local modes without affecting another reader', async ({ page }) => {
  await page.goto('/?fixture=media');
  const block = page.locator('.limr-translations').first();
  await block.locator('[data-translation-switch]').click();
  await page.getByRole('combobox', { name: 'Translation mode' }).selectOption('both');
  await expect(block).toHaveAttribute('data-mode', 'both');
  await expect(page.getByTestId('isolated').locator('.limr-translations')).toHaveAttribute('data-mode', 'origin');
  await block.locator('[data-translation-switch]').click();
  await expect(page.getByRole('combobox', { name: 'Translation mode' })).toHaveValue('origin');
  await page.getByRole('combobox', { name: 'Translation mode' }).selectOption('local');
  await expect(block).toHaveAttribute('data-mode', 'translation');
});

test('hidden translations leave the TOC and sidebar while visible text keeps exact source selection', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.goto('/?fixture=translation-details');
  const toc = page.locator('.limr-reader-toc');
  await expect(page.locator('.limr-sidebar-card')).toHaveCount(1);
  await expect(toc.getByRole('link', { name: 'Original heading' })).toHaveCount(1);
  await expect(toc.getByRole('link', { name: '译文标题' })).toHaveCount(0);
  await page.locator('[data-translation-switch]').click();
  await expect(page.locator('.limr-sidebar-card')).toHaveCount(1);
  await expect(toc.getByRole('link', { name: 'Original heading' })).toHaveCount(0);
  await expect(toc.getByRole('link', { name: '译文标题' })).toHaveCount(1);
  await page.locator('[data-language="translation"] strong').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange')); document.dispatchEvent(new Event('pointerup'));
  });
  await expect.poll(async () => JSON.parse(await page.getByTestId('translation-selection').textContent() ?? 'null')?.raw.sourceText).toBe('可选择');
  await page.keyboard.press('Escape');
  await page.locator('[data-translation-switch]').click();
  await expect(page.locator('.limr-sidebar-card')).toHaveCount(2);
  await expect(toc.getByRole('link').first()).toHaveText('译文标题');
  await expect(page.locator('.limr-sidebar-reference').first()).toContainText('中文');
});

test('scrolling respects reduced motion and lets user input interrupt an ongoing jump', async ({ page }) => {
  await page.goto('/?fixture=media&nested');
  const scroll = page.getByTestId('media-scroll');
  await page.getByRole('link', { name: 'Jump to figure' }).click();
  await page.waitForTimeout(80);
  await scroll.dispatchEvent('wheel');
  const stopped = await scroll.evaluate(element => element.scrollTop);
  await page.waitForTimeout(600);
  expect(await scroll.evaluate(element => element.scrollTop)).toBe(stopped);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await scroll.evaluate(element => { element.scrollTop = 0; });
  await page.getByRole('link', { name: 'Jump to figure' }).click();
  const completed = await scroll.evaluate(element => element.scrollTop);
  expect(completed).toBeGreaterThan(stopped + 10);
  await page.waitForTimeout(40);
  expect(await scroll.evaluate(element => element.scrollTop)).toBe(completed);
});

for (const nested of [false, true]) test(`fragment and footnote links animate inside ${nested ? 'an element' : 'the window'}`, async ({ page }) => {
  await page.goto(`/?fixture=media${nested ? '&nested' : ''}`);
  const read = () => page.evaluate(nested => nested ? document.querySelector('[data-testid="media-scroll"]')!.scrollTop : scrollY, nested);
  const target = await page.locator('#target-figure').evaluate((element, nested) => {
    const root = nested ? document.querySelector('[data-testid="media-scroll"]')! : document.documentElement;
    const current = nested ? root.scrollTop : scrollY;
    const top = element.getBoundingClientRect().top - (nested ? root.getBoundingClientRect().top : 0) + current - 24;
    return Math.min(top, root.scrollHeight - (nested ? root.clientHeight : innerHeight));
  }, nested);
  await page.getByRole('link', { name: 'Jump to figure' }).click();
  const start = await read();
  expect(start).toBeLessThan(target - 20);
  await page.waitForTimeout(100);
  const middle = await read();
  expect(middle).toBeGreaterThan(start);
  expect(middle).toBeLessThan(target);
  await expect.poll(read).toBeCloseTo(target, 0);
  await page.evaluate(nested => { (nested ? document.querySelector('[data-testid="media-scroll"]')! : window).scrollTo({ top: 0, behavior: 'instant' }); }, nested);
  await page.getByRole('link', { name: 'Footnote 1', exact: true }).click();
  await expect.poll(read).toBeGreaterThan(target - 50);
});

test('dropdowns reveal downward, fade their contents, and can reverse on rapid reopen', async ({ page }) => {
  await page.goto('/#/playground');
  const trigger = page.getByRole('button', { name: '加载', exact: true });
  await trigger.click();
  const menu = page.locator('#demo-load-menu');
  await expect(menu).toHaveAttribute('data-open', 'true');
  const early = await menu.evaluate(element => getComputedStyle(element).clipPath);
  await page.waitForTimeout(420);
  expect(await menu.evaluate(element => getComputedStyle(element).clipPath)).not.toBe(early);
  await trigger.click();
  await expect(menu).toHaveAttribute('aria-hidden', 'true');
  await trigger.click();
  await expect(menu).toHaveAttribute('aria-hidden', 'false');
  await expect(menu.getByRole('button', { name: 'Feature Visualization', exact: false })).toBeVisible();
});

test('paper presets render local illustrations, real captions and paired translations', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/playground');
  for (const name of ['Feature Visualization', '可解释性的基础积木']) {
    await page.getByRole('button', { name: '加载', exact: true }).click();
    await page.getByRole('button', { name, exact: false }).click();
    await expect(page.locator('.limr-translations').first()).toBeVisible();
    await expect(page.locator('.limr-prose figure').first()).toBeVisible();
    await expect(page.locator('.limr-literal,.limr-extension-error')).toHaveCount(0);
    const images = page.locator('.demo-page .limr-prose img');
    for (const image of await images.all()) { await image.scrollIntoViewIfNeeded(); await expect.poll(() => image.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0); }
    await page.getByRole('button', { name: '全局翻译展示模式', exact: true }).click();
    await page.locator('#demo-translation-menu').getByRole('button', { name: '译文', exact: true }).click();
    await expect(page.locator('.limr-translations').first()).toHaveAttribute('data-mode', 'translation');
  }
  expect(errors).toEqual([]);
});
