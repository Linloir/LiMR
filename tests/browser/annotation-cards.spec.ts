import { expect, test } from '@playwright/test';

test('a module owns the whole card, preserves content state and controls viewport-centered width', async ({ page }) => {
  await page.setViewportSize({ width: 1000, height: 850 });
  await page.goto('/?fixture=overlay');
  await page.locator('.demo-page').evaluate(element => Object.assign((element as HTMLElement).style, { width: '600px', marginLeft: '24px' }));
  await page.getByRole('button', { name: 'Custom card', exact: true }).hover();
  const card = page.locator('.limr-annotation-overlay');
  await expect(card.getByTestId('module-card-header')).toContainText('Preview by module');
  await expect(card.locator('.limr-overlay-header')).toHaveCount(0);
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  expect((await card.boundingBox())!.width).toBeCloseTo(286, 0);
  await card.getByRole('button', { name: 'More detail' }).click();
  await expect(card.getByTestId('module-card-header')).toContainText('Expanded by module');
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const bounds = (await card.boundingBox())!;
  expect(bounds.width).toBeCloseTo(512, 0);
  expect(bounds.x + bounds.width / 2).toBeCloseTo(500, 0);
  expect(bounds.y + bounds.height / 2).toBeCloseTo(425, 0);
  await card.getByRole('textbox', { name: 'Module draft' }).fill('Persist across presentations');
  await card.getByRole('textbox').evaluate(element => { (window as any).moduleInput = element; });
  await card.getByRole('button', { name: 'Less detail' }).click();
  await expect(card.getByTestId('module-card-header')).toContainText('Preview by module');
  await expect(card.getByRole('textbox')).toHaveValue('Persist across presentations');
  await card.getByRole('button', { name: 'More detail' }).click();
  expect(await card.getByRole('textbox').evaluate(element => element === (window as any).moduleInput)).toBe(true);
  await page.evaluate(() => {
    for (const [name, value] of Object.entries({ width: 760, height: 500, offsetLeft: 40, offsetTop: 35 })) Object.defineProperty(visualViewport, name, { configurable: true, value });
    visualViewport!.dispatchEvent(new Event('resize'));
  });
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const adjusted = (await card.boundingBox())!;
  expect(adjusted.x + adjusted.width / 2).toBeCloseTo(420, 0);
  expect(adjusted.y + adjusted.height / 2).toBeCloseTo(285, 0);
  await card.getByRole('button', { name: 'Dismiss module' }).click();
  await expect(card).toHaveCount(0);
});

test('touch expands from the measured preview and closes back to it with fade and equal timing', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/?fixture=overlay');
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (this.closest('[data-motion="morphing"]')) { animation.pause(); animation.currentTime = 0; }
      return animation;
    };
  });
  const marker = page.locator('.limr-mark').first();
  await marker.tap();
  const card = page.locator('.limr-annotation-expanded');
  await expect(card).toBeAttached();
  const entry = await card.evaluate(element => {
    const effect = element.getAnimations().find(animation => !(animation instanceof CSSTransition))!.effect!;
    return { rect: element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON(), duration: effect.getTiming().duration, easing: effect.getTiming().easing };
  });
  const anchor = (await marker.boundingBox())!;
  expect(entry.rect.width).toBeCloseTo(340, 0);
  expect(entry.rect.top).toBeCloseTo(anchor.y + anchor.height + 8, 0);
  expect(entry.rect.height).toBeLessThan(300);
  expect(entry.easing).toContain('cubic-bezier');
  await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect(card).not.toHaveAttribute('data-motion');
  await expect(page.locator('.limr-overlay-positioner')).toBeFocused();
  await expect(card.getByRole('button', { name: '收起', exact: true })).not.toBeFocused();
  await page.keyboard.press('Tab');
  await expect(card.getByRole('button', { name: '收起', exact: true })).toBeFocused();
  await expect(card.getByRole('button', { name: '收起', exact: true })).toHaveCSS('outline-style', 'solid');
  const before = (await card.boundingBox())!;
  const closing = await card.evaluate(async element => {
    (element.querySelector('.limr-overlay-close') as HTMLButtonElement).click();
    await new Promise(requestAnimationFrame);
    const animations = element.getAnimations({ subtree: true }).filter(animation => !(animation instanceof CSSTransition));
    for (const animation of animations) { animation.pause(); animation.currentTime = 80; }
    const opacity = Number(getComputedStyle(element).opacity);
    const midway = element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON();
    for (const animation of animations) animation.currentTime = Number(animation.effect!.getComputedTiming().endTime);
    return { state: (element as HTMLElement).dataset.state, opacity, midway, end: element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON(), duration: animations[0].effect!.getTiming().duration, delays: animations.map(a => a.effect!.getTiming().delay) };
  });
  expect(closing.state).toBe('closing');
  expect(closing.opacity).toBeLessThan(.8);
  expect(closing.midway.height).toBeLessThan(before.height);
  expect(closing.duration).toBe(entry.duration);
  expect(closing.delays.every(delay => delay === 0)).toBe(true);
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(closing.end[key]).toBeCloseTo(entry.rect[key], 0);
  await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect(card).toHaveCount(0);
  await context.close();
});

test('collapse and interrupted expansion morph only the shell, keeping text and controls undistorted', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=overlay');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-mark').first().click();
  const card = page.locator('.limr-annotation-overlay');
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const before = await card.evaluate(element => {
    const title = element.querySelector('.limr-overlay-header > span')!;
    const range = document.createRange(); range.selectNodeContents(title);
    return { shell: element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON(), title: range.getBoundingClientRect().toJSON() };
  });
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (this.closest('[data-motion="morphing"]')) { animation.pause(); animation.currentTime = 0; }
      return animation;
    };
  });
  await card.getByRole('button', { name: '收起', exact: true }).evaluate((element: HTMLButtonElement) => element.click());
  await expect(card).toHaveClass(/limr-annotation-preview/);
  const start = (await card.locator('.limr-overlay-surface').boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(start[key]).toBeCloseTo(before.shell[key], 0);
  const partial = await card.evaluate(element => {
    for (const animation of element.getAnimations({ subtree: true })) animation.currentTime = 100;
    const range = document.createRange(); range.selectNodeContents(element.querySelector('.limr-overlay-header > span')!);
    const matrices = [element, element.querySelector('.limr-overlay-card')!, element.querySelector('.limr-overlay-header')!].map(node => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(node).transform);
      return [matrix.a, matrix.d];
    });
    return { title: range.getBoundingClientRect().toJSON(), matrices, shell: element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON() };
  });
  expect(partial.title.width).toBeCloseTo(before.title.width, 1);
  expect(partial.title.height).toBeCloseTo(before.title.height, 1);
  expect(partial.matrices.every(pair => pair.every(scale => scale === 1))).toBe(true);
  expect(partial.shell.width).toBeLessThan(before.shell.width);
  await card.getByRole('button', { name: '展开', exact: true }).evaluate((element: HTMLButtonElement) => element.click());
  await expect(card).toHaveClass(/limr-annotation-expanded/);
  const resumed = (await card.locator('.limr-overlay-surface').boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(resumed[key]).toBeCloseTo(partial.shell[key], 0);
  await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const exiting = await card.evaluate(async element => {
    (element.querySelector('.limr-overlay-close') as HTMLButtonElement).click();
    await new Promise(requestAnimationFrame);
    for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = 100; }
    return element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON();
  });
  await page.locator('.limr-mark').first().evaluate((element: HTMLButtonElement) => element.click());
  await expect(card).toHaveAttribute('data-state', 'open');
  const reopening = await card.evaluate(element => {
    for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = 0; }
    return element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON();
  });
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(reopening[key]).toBeCloseTo(exiting[key], 0);
  await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  await expect(card).toHaveCSS('opacity', '1');
});

test('mobile contents has one hoverable heading and reverses motion during rapid toggles', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=assistant-test');
  const toc = page.locator('.limr-reader-mobile-toc'), toggle = toc.getByRole('button', { name: '目录' });
  const panel = toc.locator('.limr-collapse');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const heading = page.locator('.limr-reader-content h1');
  expect((await heading.boundingBox())!.y - ((await toggle.boundingBox())!.y + (await toggle.boundingBox())!.height)).toBeLessThan(70);
  await expect(panel).toHaveAttribute('inert', '');
  await expect(toc.locator('.limr-toc-title')).toBeHidden();
  await toggle.hover();
  await expect(toggle).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(toggle.locator('.limr-underline')).toHaveCSS('background-size', '100% 1px');
  await toggle.click();
  await page.waitForTimeout(100);
  const first = (await panel.boundingBox())!.height;
  expect(first).toBeGreaterThan(0);
  await toggle.evaluate((element: HTMLButtonElement) => element.click());
  const near = (await panel.boundingBox())!.height;
  expect(Math.abs(near - first)).toBeLessThan(12);
  await page.waitForTimeout(80);
  expect((await panel.boundingBox())!.height).toBeLessThan(near);
  await toggle.evaluate((element: HTMLButtonElement) => element.click());
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toc.getByRole('link', { name: '另一个章节' })).toBeVisible();
  await expect.poll(() => panel.evaluate(element => element.getAnimations({ subtree: true }).filter(a => a.playState === 'running').length)).toBe(0);
  expect(await toggle.locator('svg').evaluate(element => new DOMMatrixReadOnly(getComputedStyle(element).transform).a)).toBeCloseTo(-1, 4);
  await toggle.focus(); await page.keyboard.press('Enter');
  await expect.poll(() => panel.evaluate(element => element.getBoundingClientRect().height)).toBe(0);
  await expect(panel).toHaveAttribute('inert', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toc.getByRole('link', { name: '另一个章节' })).toBeVisible();
});
