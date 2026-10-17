import { expect, test, type Locator, type Page } from '@playwright/test';
import { referenceTop } from './annotation-geometry';

const reader = (page: Page) => page.locator('.limr-reader').first();
const markers = (page: Page) => reader(page).locator('.limr-reader-content .limr-mark');
const paints = (page: Page) => reader(page).locator('.limr-paint-rect[data-reference]');
async function referencePaint(page: Page, marker: Locator) {
  return reader(page).locator(`[data-paint="reference-${await marker.getAttribute('data-limr-anchor')}"]`);
}
async function unpainted(paint: Locator) {
  // Dormant references can release their geometry instead of retaining hidden
  // rectangles. Both representations must leave no visible paint.
  await expect.poll(() => paint.evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0'))).toBe(true);
}
async function settled(page: Page) {
  await expect.poll(() => reader(page).evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
}
async function aligned(page: Page, marker: Locator, card: Locator) {
  await expect.poll(async () => {
    const top = await referenceTop(marker), bounds = (await card.boundingBox())!, rail = (await reader(page).locator('.limr-sidebar').boundingBox())!;
    return Math.abs(bounds.y - Math.max(rail.y, Math.min(top, rail.y + rail.height - bounds.height)));
  }).toBeLessThan(1);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/?fixture=sidebar&citations');
  await page.evaluate(() => document.fonts.ready);
  await settled(page);
});

test('citation paint is hidden by default, light, behind text and isolated to the hovered occurrence', async ({ page }) => {
  await expect(paints(page)).toHaveCount(0);
  expect(await paints(page).evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0'))).toBe(true);
  const marker = markers(page).nth(1), paint = await referencePaint(page, marker);
  await marker.hover();
  await expect(paint.first()).toHaveCSS('opacity', '1');
  const appearance = await paint.first().evaluate(element => {
    const layer = element.parentElement!, host = layer.parentElement!, style = getComputedStyle(element);
    return { background: style.backgroundColor, layer: layer.className, zIndex: getComputedStyle(layer).zIndex, isolation: getComputedStyle(host).isolation, pointer: style.pointerEvents, color: style.getPropertyValue('--limr-highlight') };
  });
  expect(appearance).toMatchObject({ layer: 'limr-highlight-layer', zIndex: '-1', isolation: 'isolate', pointer: 'none', color: '#6366f1' });
  expect(appearance.background).toMatch(/\/ 0\.18\)/);
  await settled(page);
  expect(await paints(page).evaluateAll(elements => new Set(elements.filter(element => getComputedStyle(element).opacity !== '0').map(element => (element as HTMLElement).dataset.paint)).size)).toBe(1);
  // A pinned citation retains its highlight after the pointer leaves.
  await marker.click();
  await page.mouse.move(10, 10);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await expect(marker).toHaveAttribute('aria-expanded', 'true');
  await page.mouse.click(10, 10);
  await unpainted(paint);
  await expect(reader(page).locator('[data-paint="saved"]').first()).toHaveCSS('opacity', '1');
  await expect(reader(page).locator('[data-paint="hidden"]').first()).toHaveCSS('opacity', '0');
  // The hover decoration does not insert user-editable marks into the text.
  await expect(reader(page).locator('mark')).toHaveCount(2);
  await page.getByRole('button', { name: 'Citation color', exact: true }).click();
  await page.getByRole('button', { name: 'Theme', exact: true }).click();
  await marker.hover();
  await expect(paint.first()).toHaveCSS('--limr-highlight', '#0d9488');
  await expect(paint.first()).toHaveCSS('opacity', '1');
});

for (const nested of [false, true]) test(`citation markers and sidebar cards align in both directions${nested ? ' inside a nested scroll root' : ''}`, async ({ page }) => {
  if (nested) {
    await page.goto('/?fixture=sidebar&citations&nested');
    await page.evaluate(() => document.fonts.ready);
    await settled(page);
  }
  const marker = markers(page).nth(2), id = await marker.getAttribute('data-limr-anchor');
  const card = reader(page).locator(`[data-occurrence="${id}"]`);
  const initialCard = (await card.boundingBox())!.y;
  const initialReference = await referenceTop(marker);
  expect(Math.abs(initialCard - initialReference)).toBeGreaterThan(40);
  const geometry = () => page.evaluate(() => ({ height: document.documentElement.scrollHeight, scroll: scrollY, nested: document.querySelector('#sidebar-scroll-root')?.scrollTop ?? 0 }));
  const initial = await geometry();
  await marker.hover();
  await aligned(page, marker, card);
  await page.mouse.move(10, 10);
  await settled(page);
  const rest = (await card.boundingBox())!.y;
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect(card).toHaveAttribute('data-locked', 'true');
  expect((await card.boundingBox())!.y).toBeCloseTo(rest, 0);
  await expect.poll(() => referenceTop(marker)).toBeCloseTo(rest, 0);
  await expect((await referencePaint(page, marker)).first()).toHaveCSS('opacity', '1');
  expect(await geometry()).toEqual(initial);
  await page.mouse.move(10, 10);
  await expect.poll(() => referenceTop(marker)).toBeCloseTo(initialReference, 0);
  await unpainted(await referencePaint(page, marker));
});

test('ranged citations and narrow overlay previews use the same temporary paint', async ({ page }) => {
  const marker = reader(page).locator('[data-limr-anchor="sidebar-fixture-ranged-0"]'), paint = await referencePaint(page, marker);
  await marker.hover();
  await expect(paint.first()).toHaveCSS('opacity', '1');
  const text = reader(page).locator('strong').filter({ hasText: 'selected passage' });
  const bounds = await text.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()!);
    return range.getBoundingClientRect().toJSON();
  }), ink = (await paint.first().boundingBox())!;
  expect(ink.x).toBeCloseTo(bounds.x, 0);
  expect(ink.width).toBeCloseTo(bounds.width, 0);
  await page.setViewportSize({ width: 900, height: 850 });
  await expect(reader(page).locator('.limr-sidebar')).toHaveCount(0);
  await markers(page).first().hover();
  await expect(page.locator('.limr-annotation-preview')).toBeVisible();
  await expect((await referencePaint(page, markers(page).first())).first()).toHaveCSS('opacity', '1');
  await markers(page).first().click();
  await page.mouse.move(10, 10);
  await expect((await referencePaint(page, markers(page).first())).first()).toHaveCSS('opacity', '1');
  await page.mouse.click(10, 10);
  await expect(reader(page).locator('.limr-paint-rect[data-reference][data-active]')).toHaveCount(0);
});

test('pinned citation highlights survive hover transfers and clear when deactivated', async ({ page }) => {
  const marker = markers(page).first(), paint = await referencePaint(page, marker);
  await marker.click();
  await page.mouse.move(10, 10);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  // A second explicit range in the same paragraph preserves the first pin.
  await markers(page).nth(1).hover();
  await settled(page);
  expect(await paints(page).evaluateAll(elements => new Set(elements.filter(element => getComputedStyle(element).opacity !== '0').map(element => (element as HTMLElement).dataset.paint)).size)).toBe(2);
  await page.mouse.move(10, 10);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  // A reference to another paragraph can be hovered without erasing the pin.
  await markers(page).last().hover();
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await expect((await referencePaint(page, markers(page).last())).first()).toHaveCSS('opacity', '1');
  await page.mouse.move(10, 10);
  await page.keyboard.press('Escape');
  await expect(marker).toHaveAttribute('aria-expanded', 'false');
  await unpainted(paint);
  await marker.click();
  await marker.click();
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await page.mouse.move(10, 10);
  await unpainted(paint);
});

for (const nested of [false, true]) test(`sidebar hover reveals offscreen prose without scrolling the page${nested ? ' inside a nested scroll root' : ''}`, async ({ page }) => {
  await page.goto(`/?fixture=sidebar&citations&viewport${nested ? '&nested' : ''}`);
  await page.evaluate(() => document.fonts.ready);
  await markers(page).first().click();
  await page.mouse.move(10, 10);
  await settled(page);
  await page.evaluate(() => (document.querySelector('#sidebar-scroll-root') ?? window).scrollTo(0, 450));
  await settled(page);
  const candidates = await reader(page).locator('.limr-sidebar-card').evaluateAll(elements => {
    const root = document.querySelector('#sidebar-scroll-root')?.getBoundingClientRect();
    const top = Math.max(0, root?.top ?? 0), bottom = Math.min(innerHeight, root?.bottom ?? innerHeight);
    return elements.filter(card => {
      const box = card.getBoundingClientRect(), id = (card as HTMLElement).dataset.occurrence;
      const marker = document.querySelector(`[data-limr-anchor="${id}"]`)!;
      return box.top > top && box.bottom < bottom && marker.closest('p')!.getBoundingClientRect().bottom < top - 32;
    }).map(card => (card as HTMLElement).dataset.occurrence!);
  });
  expect(candidates.length).toBeGreaterThan(0);
  const id = candidates[0], card = reader(page).locator(`[data-occurrence="${id}"]`);
  const marker = reader(page).locator(`[data-limr-anchor="${id}"]`), paint = await referencePaint(page, marker);
  await expect(paint).toHaveCount(0);
  const original = await referenceTop(marker);
  const scroll = await page.evaluate(() => ({ page: scrollY, nested: document.querySelector('#sidebar-scroll-root')?.scrollTop }));
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect(card).toHaveAttribute('data-active', 'true');
  await expect.poll(async () => Math.abs(await referenceTop(marker) - (await card.boundingBox())!.y)).toBeLessThan(1);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await expect(paint.first()).toBeInViewport();
  expect(await page.evaluate(() => ({ page: scrollY, nested: document.querySelector('#sidebar-scroll-root')?.scrollTop }))).toEqual(scroll);
  await page.mouse.move(10, 10);
  await expect.poll(() => referenceTop(marker)).toBeCloseTo(original, 0);
  await marker.scrollIntoViewIfNeeded(); await marker.hover();
  await aligned(page, marker, card);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await expect(paint.first()).toBeInViewport();
  await page.mouse.move(10, 10);

});

for (const width of [1800, 1380]) test(`scikit-learn's unfolded bibliography aligns in both directions without changing page height at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '旁注折叠', exact: true }).click();
  await page.locator('#demo-sidebar-collapse-menu').getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
  await page.evaluate(() => document.fonts.ready);
  const references = reader(page).locator('.limr-reader-content ol .limr-mark');
  await expect(references).toHaveCount(16);
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  // The packed rail can expose a point reference whose marker is offscreen.
  // Aligning it must not manufacture a whole-paragraph highlight.
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * .55));
  await settled(page);
  const candidates = await reader(page).locator('.limr-sidebar-card').evaluateAll(elements => elements.filter(card => {
    const box = card.getBoundingClientRect(), id = (card as HTMLElement).dataset.occurrence;
    const marker = document.querySelector(`[data-limr-anchor="${id}"]`)!;
    const source = marker.closest('p,li,h1,h2,h3,h4,h5,h6')!.getBoundingClientRect();
    return box.top > 0 && box.bottom < innerHeight && source.top > innerHeight + 32;
  }).map(card => (card as HTMLElement).dataset.occurrence!));
  expect(candidates.length).toBeGreaterThan(0);
  const offscreenId = candidates.at(-1)!;
  const offscreenCard = reader(page).locator(`[data-occurrence="${offscreenId}"]`);
  const offscreenMarker = reader(page).locator(`[data-limr-anchor="${offscreenId}"]`);
  const offscreenPaint = await referencePaint(page, offscreenMarker);
  await expect(offscreenPaint).toHaveCount(0);
  await offscreenCard.locator('.limr-sidebar-card-heading').hover();
  await expect.poll(async () => Math.abs(await referenceTop(offscreenMarker) - (await offscreenCard.boundingBox())!.y)).toBeLessThan(1);
  await expect(offscreenPaint).toHaveCount(0);
  await offscreenCard.locator('.limr-sidebar-card-heading').click();
  await page.mouse.move(10, 10);
  await expect(offscreenPaint).toHaveCount(0);
  await page.mouse.click(10, 10);
  await settled(page);
  await expect(offscreenPaint).toHaveCount(0);
  for (const marker of await references.all()) {
    await marker.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await marker.hover();
    const id = await marker.getAttribute('data-limr-anchor');
    const card = reader(page).locator(`[data-occurrence="${id}"]`);
    await expect(card).toHaveAttribute('data-active', 'true');
    await aligned(page, marker, card);
    const bounds = (await card.boundingBox())!, rail = (await reader(page).locator('.limr-sidebar').boundingBox())!;
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(rail.y + rail.height + 1);
    await expect(card.locator('.limr-sidebar-card-heading')).toBeInViewport();
  }
  // Transfer from the last marker into its height-constrained card, then read
  // the expanded citation without changing the document's scroll range.
  const last = reader(page).locator('.limr-sidebar-card').last();
  await last.locator('.limr-sidebar-card-heading').hover();
  await expect(last).toHaveAttribute('data-locked', 'true');
  await last.locator('.limr-sidebar-card-heading').click();
  await expect(last).toHaveAttribute('data-expanded', 'true');
  await settled(page);
  await expect.poll(async () => Math.abs(await referenceTop(references.last()) - (await last.boundingBox())!.y)).toBeLessThan(1);
  await expect(last.locator('.limr-citation-title')).toBeInViewport();
  await page.mouse.click(10, 10);
  await settled(page);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await settled(page);
  // These cards were packed hundreds of pixels above their source references.
  const cards = reader(page).locator('.limr-sidebar-card');
  for (const index of [await cards.count() - 5, await cards.count() - 1]) {
    const card = cards.nth(index), id = await card.getAttribute('data-occurrence');
    const marker = reader(page).locator(`[data-limr-anchor="${id}"]`);
    const before = (await card.boundingBox())!.y, scroll = await page.evaluate(() => scrollY);
    await card.locator('.limr-sidebar-card-heading').hover();
    await expect(card).toHaveAttribute('data-locked', 'true');
    await expect.poll(async () => Math.abs(await referenceTop(marker) - (await card.boundingBox())!.y)).toBeLessThan(1);
    expect((await card.boundingBox())!.y).toBeCloseTo(before, 0);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
    await page.mouse.move(10, 10);
    await expect(reader(page).locator('.limr-reader-content > article')).toHaveCSS('translate', 'none');
    await settled(page);
  }
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(pageHeight);
  // Releasing a footer item used to jump straight into the packed layout as
  // soon as collapse disabled CSS top transitions for resize synchronization.
  const releaseMarker = references.nth(10), releaseId = await releaseMarker.getAttribute('data-limr-anchor');
  const releaseCard = reader(page).locator(`[data-occurrence="${releaseId}"]`);
  const rest = (await releaseCard.boundingBox())!.y;
  await releaseMarker.click();
  await page.mouse.move(10, 10);
  await settled(page);
  const motion = await releaseCard.evaluate(async element => {
    const start = element.getBoundingClientRect().top;
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
    const frames = [];
    for (let i = 0; i < 40; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => { setTimeout(resolve, 0); }));
      const box = element.getBoundingClientRect();
      const cards = [...element.parentElement!.children].map(card => card.getBoundingClientRect());
      frames.push({ top: box.top, overflow: box.bottom - element.parentElement!.getBoundingClientRect().bottom, gap: Math.min(...cards.slice(1).map((card, index) => card.top - cards[index].bottom)) });
    }
    return { start, frames };
  });
  const distance = Math.abs(motion.start - rest);
  expect(distance).toBeGreaterThan(100);
  expect(Math.abs(motion.frames[0].top - motion.start)).toBeLessThan(distance * .25);
  expect(motion.frames.filter(frame => Math.abs(frame.top - motion.start) > 10 && Math.abs(frame.top - rest) > 10).length).toBeGreaterThan(3);
  expect(Math.max(...motion.frames.map(frame => frame.overflow))).toBeLessThan(1);
  expect(Math.min(...motion.frames.map(frame => frame.gap))).toBeGreaterThanOrEqual(13);
  expect(motion.frames.at(-1)!.top).toBeCloseTo(rest, 0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await releaseMarker.click();
  await page.mouse.click(10, 10);
  await expect(releaseMarker).toHaveAttribute('aria-expanded', 'false');
  await expect(reader(page).locator('.limr-sidebar')).not.toHaveAttribute('data-releasing', '');
  await expect(await referencePaint(page, releaseMarker)).toHaveCount(0);
});
