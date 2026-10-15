import { expect, test, type Page } from '@playwright/test';

async function selectImportant(page: Page) {
  await page.locator('.limr-reader-content strong').first().evaluate(element => {
    const text = element.querySelector('[data-limr-text]')?.firstChild ?? element.firstChild!;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, text.textContent!.length);
    const selection = window.getSelection()!; selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
    document.dispatchEvent(new Event('pointerup'));
  });
}

test('desktop rendering, selections, highlights and aligned citation cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/playground');
  await expect(page.locator('.limr-reader[data-sidebar]')).toBeVisible();
  await expect(page.locator('.limr-definition')).toHaveCount(1);
  await expect(page.locator('.katex').first()).toBeAttached();
  await selectImportant(page);
  await expect(page.getByRole('toolbar')).toBeVisible();
  const selection = JSON.parse(await page.locator('#selection-data').textContent() || '{}');
  expect(selection.quality).toBe('exact');
  expect(selection.raw.sourceText).toBe('重要内容');
  expect(selection.syntax.sourceText).toBe('**重要内容**');
  expect(selection.blocks.sourceText).toContain('重要内容');
  await page.getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect(page.locator('mark')).toHaveText('重要内容');
  const marker = page.locator('.limr-mark').first();
  await marker.click();
  await expect(page.locator('.limr-sidebar-card[data-active]')).toHaveCount(1);
  const geometry = await page.evaluate(() => {
    const range = document.createRange(); range.selectNodeContents(document.querySelector('.limr-mark')!.closest('p')!);
    const card = document.querySelector('.limr-sidebar-card')!.getBoundingClientRect();
    return { anchor: range.getClientRects()[0].top, card: card.top };
  });
  expect(Math.abs(geometry.anchor - geometry.card)).toBeLessThan(6);
  await page.locator('.limr-disclosure summary').filter({ hasText: '提示' }).click();
  await expect(page.locator('.limr-disclosure').first().locator('.limr-question-detail')).toBeVisible();
  await page.locator('.limr-code-block').scrollIntoViewIfNeeded();
  await expect(page.locator('.shiki')).toBeAttached();
  await page.getByRole('button', { name: '深色', exact: true }).click();
  await expect(page.locator('.limr-reader')).toHaveAttribute('data-limr-theme', 'dark');
  await expect(page.locator('.limr-sidebar')).toHaveAttribute('data-limr-theme', 'dark');
  const colors = await page.evaluate(() => ({ toc: getComputedStyle(document.querySelector('.limr-reader-toc a[aria-current]')!).color, heading: getComputedStyle(document.querySelector('.limr-reader-content h1')!).color }));
  expect(colors.toc).toBe(colors.heading);
  expect(errors).toEqual([]);
});

test('TOC wraps, retains its title and follows active headings within scroll limits', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '长文阅读' }).click();
  await page.getByRole('button', { name: '保存', exact: true }).click();
  const toc = page.locator('.limr-reader-toc .limr-toc');
  const link = toc.locator('a').nth(49);
  await link.click();
  await expect(link).toHaveAttribute('aria-current', 'location');
  await expect.poll(async () => link.evaluate(element => Math.abs(element.getBoundingClientRect().top - element.closest('.limr-toc-scroll')!.getBoundingClientRect().top))).toBeLessThan(25);
  await expect(toc.locator('.limr-toc-title')).toBeInViewport();
  const sizes = await toc.locator('.limr-toc-scroll').evaluate(element => ({ scroll: element.scrollWidth, client: element.clientWidth, scrollbar: getComputedStyle(element).scrollbarWidth }));
  expect(sizes.scroll).toBe(sizes.client);
  expect(sizes.scrollbar).toBe('none');
  const last = toc.locator('a').last(); await last.click();
  await expect(last).toHaveAttribute('aria-current', 'location');
  await expect.poll(async () => toc.locator('.limr-toc-scroll').evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2);
});

test('narrow pointer preview expands in the page viewport and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  await page.goto('/?fixture=overlay');
  const marker = page.locator('.limr-mark').first();
  await marker.hover();
  await expect(page.locator('.limr-annotation-preview')).toBeVisible();
  await page.locator('.limr-annotation-preview').getByRole('button', { name: '展开' }).click();
  await expect(page.locator('.limr-annotation-expanded')).toBeVisible();
  await expect.poll(() => page.locator('.limr-annotation-expanded').evaluate(element => element.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  const rects = await page.evaluate(() => ({ card: document.querySelector('.limr-annotation-expanded')!.getBoundingClientRect().toJSON() }));
  expect(rects.card.width).toBeCloseTo(640, 0);
  expect(rects.card.left + rects.card.width / 2).toBeCloseTo(350, 0);
  expect(rects.card.left).toBeGreaterThanOrEqual(12);
  expect(rects.card.bottom).toBeLessThanOrEqual(800 - 12);
  await page.evaluate(() => {
    Object.defineProperty(window.visualViewport, 'height', { configurable: true, value: 240 });
    window.visualViewport!.dispatchEvent(new Event('resize'));
  });
  await expect.poll(async () => page.locator('.limr-annotation-expanded').evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(228);
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-annotation-expanded')).toHaveCount(0);
  await expect(marker).toBeFocused();
});

test('application plugin adds its action and streams into its own annotation renderer', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 });
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?fixture=assistant-test');
  await selectImportant(page);
  await page.getByRole('button', { name: '询问助手' }).click();
  await expect(page.locator('.limr-mark')).toHaveAttribute('aria-label', '询问助手');
  await expect(page.locator('.limr-annotation-expanded')).toBeVisible();
  await expect(page.locator('.limr-overlay-header')).toContainText('询问助手');
  await expect(page.locator('.limr-annotation-expanded strong')).toHaveText('重要内容');
  await expect(page.locator('#adapter-status')).toHaveText('已完成');
  await expect(page.locator('.limr-annotation-expanded')).toContainText('并通过同一个插件持续更新。');
  await expect(page.getByRole('toolbar')).toHaveCount(0);
  await page.locator('.limr-overlay-header').getByRole('button', { name: '收起', exact: true }).click();
  await expect(page.locator('.limr-annotation-preview .limr-overlay-header')).toContainText('询问助手');
  expect(errors).toEqual([]);
});

test('plugin transport is cancelled when its reader unmounts', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?fixture=assistant-test');
  await selectImportant(page);
  await page.getByRole('button', { name: '询问助手' }).click();
  await expect(page.locator('#adapter-status')).toHaveText('回答中');
  await page.getByRole('button', { name: '卸载阅读器' }).click();
  await expect(page.locator('#adapter-status')).toHaveText('已取消');
});

test('custom scroll root keeps TOC and sidebar aligned with the body', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?fixture=scroll');
  const root = page.locator('#scroll-root');
  const link = root.locator('.limr-toc a').nth(15);
  await link.click();
  await expect(link).toHaveAttribute('aria-current', 'location');
  expect(await root.evaluate(element => element.scrollTop)).toBeGreaterThan(500);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect.poll(() => root.locator('.limr-sidebar-reference').count()).toBeGreaterThan(0);
  const offsets = await page.evaluate(() => Array.from(document.querySelectorAll('[data-limr-anchor]')).map(marker => {
    const card = document.querySelector(`[data-occurrence="${marker.getAttribute('data-limr-anchor')}"]`);
    if (!card) return 999;
    const rail = card.closest('.limr-sidebar')!.getBoundingClientRect(), bounds = card.getBoundingClientRect();
    // This fixture uses self-closing refs: the point marker itself is the
    // reference location, even at the end of a many-line paragraph.
    return Math.abs(Math.max(rail.top, Math.min(marker.getBoundingClientRect().top, rail.bottom - bounds.height)) - bounds.top);
  }));
  expect(Math.max(...offsets)).toBeLessThan(6);
});

test('multiple readers scope heading IDs and radio groups', async ({ page }) => {
  await page.goto('/?fixture=multiple');
  const values = await page.evaluate(() => ({ ids: Array.from(document.querySelectorAll('h1')).map(element => element.id), names: Array.from(document.querySelectorAll('input[type=radio]')).map(element => (element as HTMLInputElement).name) }));
  expect(new Set(values.ids).size).toBe(2);
  expect(new Set(values.names).size).toBe(2);
  await page.locator('article').first().locator('input').first().check();
  await page.locator('article').last().locator('input').first().check();
  await expect(page.locator('input:checked')).toHaveCount(2);
});

test('touch marker pins a citation without an expansion control', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/#/playground');
  await page.locator('.limr-mark').first().tap();
  await expect(page.locator('.limr-annotation-preview')).toHaveAttribute('data-pinned', 'true');
  await expect(page.locator('.limr-annotation-expanded')).toHaveCount(0);
  await expect(page.locator('.limr-annotation-preview').getByRole('button', { name: '展开' })).toHaveCount(0);
  await page.locator('.limr-annotation-preview').getByRole('button', { name: '关闭' }).tap();
  await expect(page.locator('.limr-annotation-overlay')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await context.close();
});

test('server HTML hydrates with stable IDs and object selectors update without loops', async ({ page }) => {
  const { renderToString } = await import('react-dom/server');
  const { createElement } = await import('react');
  const { HydrationFixture } = await import('../../playground/hydration');
  const { preloadMath } = await import('../../src');
  await preloadMath();
  const markup = renderToString(createElement(HydrationFixture));
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.route('**/?fixture=hydrate', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace('<div id="root"></div>', `<div id="root">${markup}</div>`) });
  });
  await page.goto('/?fixture=hydrate');
  await expect(page.locator('#snapshot-readout')).toHaveText('0:1');
  await expect(page.locator('.katex')).toHaveCount(1);
  const ids = await page.locator('h1').evaluateAll(elements => elements.map(element => element.id));
  expect(new Set(ids).size).toBe(2);
  await page.getByRole('button', { name: 'Append' }).click();
  await expect(page.locator('#snapshot-readout')).toHaveText('1:2');
  expect(await page.locator('h1').evaluateAll(elements => elements.map(element => element.id))).toEqual(ids);
  expect(await page.locator('html').getAttribute('data-hydration-error')).toBeNull();
  expect(errors).toEqual([]);
});

test('annotation requests survive preview expansion, cache hits and payload invalidation', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  let requests = 0;
  const outside: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) outside.push(request.url()); });
  await page.route('**/mock/annotation?*', async route => {
    requests++;
    const version = Number(new URL(route.request().url()).searchParams.get('version'));
    await new Promise(resolve => setTimeout(resolve, 300));
    await route.fulfill({ json: { version, title: `Resource ${version}` } });
  });
  await page.goto('/?fixture=resource');
  await expect(page.locator('.limr-mark')).toHaveCount(1);
  expect(requests).toBe(0);
  await expect(page.locator('iframe')).toHaveCount(0);
  const marker = page.locator('.limr-mark');
  await marker.hover();
  await expect(page.locator('.limr-annotation-preview')).toContainText('Loading resource');
  await page.locator('.limr-annotation-preview').getByRole('button', { name: 'Expand' }).click();
  await expect(page.locator('.limr-annotation-expanded')).toContainText('Resource 1');
  expect(requests).toBe(1);
  await page.keyboard.press('Escape');
  await marker.click();
  await expect(page.locator('.limr-annotation-expanded')).toContainText('Resource 1');
  expect(requests).toBe(1);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Change resource' }).click();
  await marker.click();
  await expect(page.locator('.limr-annotation-expanded')).toContainText('Resource 2');
  expect(requests).toBe(2);
  expect(outside).toEqual([]);
});

test('native text bindings preserve entities, escapes, emoji and partial inline code', async ({ page }) => {
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill('A &amp; \\* 😀 plus **bold** and `code`.');
  await page.locator('.limr-reader-content strong').evaluate(strong => {
    const first = strong.parentElement!.firstChild!;
    const range = document.createRange(); range.setStart(first, 2); range.setEnd(strong.firstChild!, 2);
    const selection = window.getSelection()!; selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#selection-data').textContent() || '{}').raw?.sourceText).toBe('&amp; \\* 😀 plus **bo');
  expect(JSON.parse(await page.locator('#selection-data').textContent() || '{}').quality).toBe('exact');
  await page.locator('.limr-reader-content code').evaluate(code => {
    const range = document.createRange(); const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT); const text = walker.nextNode()!; range.setStart(text, 1); range.setEnd(text, 2);
    const selection = window.getSelection()!; selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#selection-data').textContent() || '{}').raw?.sourceText).toBe('o');
  expect(JSON.parse(await page.locator('#selection-data').textContent() || '{}').quality).toBe('exact');
});
