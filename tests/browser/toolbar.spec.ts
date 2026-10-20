import { expect, test, type Page } from '@playwright/test';

async function select(page: Page, selector = '.limr-reader-content strong') {
  await page.locator(selector).first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

test('default tools animate outward with delayed, staggered fades and normalize plugin icons', async ({ page }) => {
  await page.goto('/?fixture=toolbar'); await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-reader-content > article > p').first().evaluate(element => { element.style.marginTop = '300px'; });
  await select(page);
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar.locator('.limr-toolbar-action')).toHaveCount(3);
  await expect(toolbar).toHaveAttribute('data-placement', 'top');
  const motions = await toolbar.evaluate(element => {
    const timing = (node: Element) => node.getAnimations().map(animation => ({ name: (animation as CSSAnimation).animationName, timing: animation.effect!.getTiming(), frames: (animation.effect as KeyframeEffect).getKeyframes() }));
    return { surface: timing(element.querySelector('.limr-toolbar-surface')!), items: [...element.querySelectorAll('.limr-toolbar-item')].map(timing) };
  });
  expect(motions.surface.map(item => item.name)).toEqual(['limr-tool-float', 'limr-tool-fade']);
  expect(motions.surface[0].frames[0].transform).toBe('translateY(6px)');
  expect(motions.surface[1].timing.delay).toBeGreaterThan(motions.surface[0].timing.delay ?? 0);
  for (let i = 0; i < motions.items.length; i++) {
    expect(motions.items[i][0].frames[0].easing).toContain('cubic-bezier');
    expect(motions.items[i][1].timing.delay).toBeGreaterThan(motions.items[i][0].timing.delay ?? 0);
    if (i) expect(motions.items[i][0].timing.delay ?? 0).toBeGreaterThan(motions.items[i - 1][0].timing.delay ?? 0);
  }
  const icons = await toolbar.locator('.limr-tool-face[data-visible] .limr-tool-icon').evaluateAll(elements => elements.map(element => ({ slot: element.getBoundingClientRect().toJSON(), icon: element.querySelector('svg')!.getBoundingClientRect().toJSON() })));
  // Animated translations can round DOMRect subtraction by a few millionths
  // of a pixel. Keep the 18px size contract without exact float equality.
  for (const { slot, icon } of icons) {
    expect(slot.width).toBeCloseTo(18, 3); expect(slot.height).toBeCloseTo(18, 3);
    expect(icon.width).toBeLessThanOrEqual(18.001); expect(icon.height).toBeLessThanOrEqual(18.001);
  }
  await page.keyboard.press('Escape');
  await page.locator('.limr-reader-content > article > p').first().evaluate(element => Object.assign(element.style, { position: 'fixed', marginTop: '0', top: '4px', left: '80px' }));
  await select(page);
  await expect(toolbar).toHaveAttribute('data-placement', 'bottom');
  const offset = await toolbar.locator('.limr-toolbar-surface').evaluate(element => ((element.getAnimations()[0].effect as KeyframeEffect).getKeyframes()[0]).transform);
  expect(offset).toBe('translateY(-6px)');
  await page.keyboard.press('Escape'); await page.emulateMedia({ reducedMotion: 'reduce' }); await select(page);
  expect(await toolbar.locator('.limr-toolbar-surface').evaluate(element => element.getAnimations().every(animation => Number(animation.effect!.getTiming().duration) < 1))).toBe(true);
});

test('hover panels preserve input and captured text, share errors, and support keyboard dismissal', async ({ page }) => {
  await page.goto('/?fixture=toolbar'); await select(page);
  const toolbar = page.getByRole('toolbar'), tool = toolbar.getByRole('button', { name: 'Custom tool', exact: true });
  await tool.hover();
  await expect(page.locator('#hover-count')).toHaveText('1');
  const field = toolbar.getByRole('textbox', { name: 'Panel input' });
  await field.fill('my draft');
  await expect(field).toHaveValue('my draft');
  await field.press('ControlOrMeta+A');
  await page.keyboard.type('revised draft');
  await expect(field).toHaveValue('revised draft');
  await toolbar.getByRole('button', { name: 'Read selection' }).click();
  await expect(field).toHaveValue('bravo');
  await toolbar.getByRole('button', { name: 'Fail action' }).click();
  await expect(toolbar.getByRole('alert')).toHaveText('Panel action failed');
  await page.keyboard.press('Escape');
  await expect(field).toHaveCount(0); await expect(tool).toBeFocused();
  await page.keyboard.press('ArrowDown'); await expect(field).toBeFocused();
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await expect(toolbar).toHaveCount(0);
});

test('hover panels animate in both directions and reverse an interrupted exit', async ({ page }) => {
  await page.goto('/?fixture=toolbar'); await select(page);
  const toolbar = page.getByRole('toolbar'), tool = toolbar.getByRole('button', { name: 'Custom tool', exact: true });
  const collapse = toolbar.locator('.limr-toolbar-panel-collapse'), panel = toolbar.locator('.limr-toolbar-panel');
  await tool.hover();
  await expect(collapse).toHaveAttribute('data-open');
  await expect.poll(() => collapse.evaluate(element => element.getAnimations().length)).toBe(0);
  const height = (await collapse.boundingBox())!.height;
  expect(height).toBeGreaterThan(30);
  await page.mouse.move(1, 1);
  await expect(collapse).not.toHaveAttribute('data-open');
  await expect(collapse).toHaveAttribute('inert');
  const exit = await collapse.evaluate(element => {
    const animation = element.getAnimations().find(animation => (animation as CSSTransition).transitionProperty === 'grid-template-rows');
    if (!animation) throw new Error('Missing panel exit transition');
    animation.pause(); animation.currentTime = Number(animation.effect!.getTiming().duration) / 2;
    return element.getBoundingClientRect().height;
  });
  expect(exit).toBeGreaterThan(0); expect(exit).toBeLessThan(height);
  await expect(panel).toBeAttached();
  await tool.hover();
  await expect(collapse).toHaveAttribute('data-open');
  await expect(collapse).not.toHaveAttribute('inert');
  await expect(toolbar.getByRole('textbox', { name: 'Panel input' })).toBeVisible();
  await page.mouse.move(1, 1);
  await expect(panel).toHaveCount(0);
  await expect.poll(() => collapse.evaluate(element => element.getBoundingClientRect().height)).toBe(0);
});

test('overlapping controlled highlights hit the top layer and edit in place without hiding text', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=toolbar&controlled');
  await page.evaluate(() => document.fonts.ready);
  const text = page.locator('.limr-reader-content strong');
  await text.hover();
  await expect(page.locator('#hovered-highlight')).toHaveText('upper');
  await expect(page.locator('.limr-paint-wavy[data-hovered]')).not.toHaveCount(0);
  await expect(page.locator('.limr-paint-background[data-hovered]')).toHaveCount(0);
  await expect(page.locator('.limr-highlight-layer').first()).toHaveCSS('z-index', '-1');
  await text.click();
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toHaveAttribute('data-highlight', 'upper');
  await toolbar.getByRole('button', { name: '复制', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('bravo');
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).hover();
  await toolbar.getByRole('button', { name: '雾蓝', exact: true }).click();
  await toolbar.getByRole('button', { name: '下划线', exact: true }).click();
  const highlights = JSON.parse(await page.locator('#highlight-data').textContent() || '[]');
  expect(highlights.map((item: any) => item.id)).toEqual(['lower', 'upper']);
  expect(highlights[0].data.color).toBe('#F2C744'); expect(highlights[1].data).toMatchObject({ color: '#6B9BD2', style: 'underline' });
  await expect(page.locator('.limr-paint-underline[data-paint="upper"]')).not.toHaveCount(0);
  await toolbar.getByRole('button', { name: '删除', exact: true }).click();
  await expect(toolbar).toHaveCount(0);
  await text.hover(); await expect(page.locator('#hovered-highlight')).toHaveText('lower');
  await text.click(); await expect(toolbar).toHaveAttribute('data-highlight', 'lower');
});

test('new highlights apply palette choices and remain editable after selecting over them', async ({ page }) => {
  await page.goto('/?fixture=toolbar'); await select(page);
  let toolbar = page.getByRole('toolbar');
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).hover();
  await toolbar.getByRole('button', { name: '青瓷', exact: true }).click();
  await toolbar.getByRole('button', { name: '波浪线', exact: true }).click();
  await toolbar.getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect(toolbar).toHaveCount(0);
  await expect(page.locator('.limr-paint-wavy')).not.toHaveCount(0);
  await select(page);
  await expect(toolbar.getByRole('button', { name: '添加高亮', exact: true })).toHaveCount(0);
  await expect(toolbar.getByRole('button', { name: '隐藏高亮', exact: true })).toHaveCount(0);
  expect(JSON.parse(await page.locator('#highlight-data').textContent() || '[]')).toHaveLength(1);
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).hover();
  await expect(toolbar.getByRole('button', { name: '波浪线', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await toolbar.getByRole('button', { name: '删除', exact: true }).click();
  expect(JSON.parse(await page.locator('#highlight-data').textContent() || '[]')).toHaveLength(0);

});

test('touch users can open options explicitly and edit a highlight in a narrow viewport', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('/?fixture=toolbar'); await select(page);
  const toolbar = page.getByRole('toolbar');
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).tap();
  await toolbar.getByRole('button', { name: '点线', exact: true }).tap();
  await toolbar.getByRole('button', { name: '添加高亮', exact: true }).tap();
  await page.locator('.limr-reader-content strong').tap();
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).tap();
  await expect(toolbar.getByRole('button', { name: '点线', exact: true })).toHaveAttribute('aria-pressed', 'true');
  const box = (await toolbar.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(9); expect(box.x + box.width).toBeLessThanOrEqual(381); expect(box.y).toBeGreaterThanOrEqual(9); expect(box.y + box.height).toBeLessThanOrEqual(835);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await context.close();
});

test('copy crossfades in place, reports green success, and resets for another copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=toolbar'); await select(page);
  const toolbar = page.getByRole('toolbar');
  await toolbar.getByRole('button', { name: '复制', exact: true }).click();
  const copied = toolbar.getByRole('button', { name: '已复制', exact: true });
  await expect(copied).toBeVisible();
  const widthMotion = async () => copied.locator('.limr-tool-faces').evaluate(element => {
    const animation = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === 'width');
    if (!animation) return null;
    const time = animation.currentTime, duration = Number(animation.effect!.getTiming().duration), easing = animation.effect!.getTiming().easing;
    animation.pause();
    const widths = [0, .25, .5, 1].map(fraction => { animation.currentTime = duration * fraction; return element.getBoundingClientRect().width; });
    animation.currentTime = time; animation.play();
    return { widths, easing, duration };
  });
  const growing = await widthMotion();
  expect(growing).not.toBeNull();
  expect(growing!.easing).toContain('cubic-bezier');
  expect(growing!.widths[3]).toBeGreaterThan(growing!.widths[0]);
  expect((growing!.widths[1] - growing!.widths[0]) / (growing!.widths[3] - growing!.widths[0])).toBeGreaterThan(.35);
  await expect(copied).toHaveCSS('color', 'rgb(82, 136, 94)');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('bravo');
  const faces = copied.locator('.limr-tool-face');
  const styles = await faces.evaluateAll(elements => elements.map(element => ({ transition: getComputedStyle(element).transition, transform: getComputedStyle(element).transform })));
  expect(styles.every(style => style.transition.includes('opacity') && style.transition.includes('transform') && style.transition.includes('cubic-bezier'))).toBe(true);
  await expect(copied.locator('.limr-tool-face[data-visible]')).toHaveCSS('opacity', '1');
  await expect(copied.locator('.limr-tool-face:not([data-visible])')).toHaveCSS('opacity', '0');
  await expect(toolbar.getByRole('button', { name: '复制', exact: true })).toBeVisible({ timeout: 4000 });
  const shrinking = await toolbar.getByRole('button', { name: '复制', exact: true }).locator('.limr-tool-faces').evaluate(element => {
    const animation = element.getAnimations().find(animation => animation instanceof CSSTransition && animation.transitionProperty === 'width');
    return animation ? (animation.effect as KeyframeEffect).getKeyframes().map(frame => parseFloat(String(frame.width))) : [];
  });
  expect(shrinking.length).toBeGreaterThanOrEqual(2);
  expect(shrinking[0]).toBeGreaterThan(shrinking.at(-1)!);
});

test('panels prefer below, keep the row steady, and scroll inside the shell height budget', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/?fixture=toolbar&tall'); await select(page);
  const toolbar = page.getByRole('toolbar'), tool = toolbar.getByRole('button', { name: 'Custom tool', exact: true });
  await expect(toolbar).toHaveAttribute('data-placement', 'bottom');
  await expect.poll(() => tool.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  const before = (await tool.boundingBox())!;
  await tool.hover();
  const panel = toolbar.locator('.limr-toolbar-panel'), body = panel.locator('.limr-overlay-content');
  await expect(panel.locator('.limr-overlay-scroll')).toHaveAttribute('data-overflow', '');
  expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(261);
  await expect(body).toHaveCSS('scrollbar-width', 'none');
  await expect.poll(async () => (await tool.boundingBox())!.y).toBeCloseTo(before.y, 0);
  const scroller = await body.evaluate(element => ({ overflow: element.scrollHeight - element.clientHeight, gutter: element.getBoundingClientRect().width - element.clientWidth }));
  expect(scroller.overflow).toBeGreaterThan(200); expect(scroller.gutter).toBe(0);
  await body.hover(); await page.mouse.wheel(0, 300);
  await expect.poll(() => body.evaluate(element => element.scrollTop)).toBeGreaterThan(50);
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1100, height: 400 });
  await page.locator('.limr-reader-content > article > p').first().evaluate(element => Object.assign(element.style, { position: 'fixed', top: '275px', left: '80px' }));
  await select(page); await expect(toolbar).toHaveAttribute('data-placement', 'top');
  await tool.hover();
  await expect.poll(async () => { const bounds = (await toolbar.boundingBox())!; return bounds.y >= 9 && bounds.y + bounds.height <= 391; }).toBe(true);
});

test('an external skin reaches the portalled toolbar and overrides its panel contract', async ({ page }) => {
  await page.goto('/?fixture=toolbar&skin'); await select(page);
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toHaveAttribute('data-limr-appearance', 'paper');
  await expect(toolbar.locator('.limr-toolbar-surface')).toHaveCSS('border-radius', '3px');
  await toolbar.getByRole('button', { name: '调整高亮', exact: true }).hover();
  const contentWidth = await toolbar.locator('.limr-toolbar-panel .limr-overlay-scroll-inner').evaluate(element => element.getBoundingClientRect().width);
  const panelWidth = await toolbar.locator('.limr-toolbar-panel').evaluate(element => element.getBoundingClientRect().width);
  expect(contentWidth).toBeCloseTo(panelWidth - 18, 0);
  await expect(toolbar.locator('.limr-toolbar-panel')).toHaveCSS('max-height', '190px');
  await expect(toolbar.locator('[data-action-id="highlight-palette"]')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(toolbar.locator('.limr-toolbar-expand')).toHaveCount(0);
  await expect(toolbar.locator('.limr-highlight-preview')).toHaveCount(0);
  await expect(toolbar.getByRole('button', { name: '底色', exact: true })).toHaveCSS('border-color', 'rgb(24, 81, 69)');
  const widths = await toolbar.evaluate(element => ({ row: element.querySelector('.limr-toolbar-actions')!.getBoundingClientRect().width, panel: element.querySelector('.limr-toolbar-panel')!.getBoundingClientRect().width }));
  expect(widths.panel).toBe(widths.row);
});

test('errors and custom content fill the action width and wrap long words without resizing the toolbar', async ({ page }) => {
  await page.goto('/?fixture=toolbar&wide'); await select(page);
  const toolbar = page.getByRole('toolbar');
  const actions = toolbar.locator('.limr-toolbar-actions');
  const originalWidth = (await actions.boundingBox())!.width;
  expect(originalWidth).toBeGreaterThan(350);
  await toolbar.getByRole('button', { name: 'Custom annotation integration', exact: true }).hover();
  const panel = toolbar.locator('.limr-toolbar-panel');
  await expect(panel).toBeVisible();
  expect((await panel.boundingBox())!.width).toBeCloseTo(originalWidth, 1);
  const details = panel.locator('[data-toolbar-details]');
  const detailsWidth = await details.evaluate(element => ({ width: element.getBoundingClientRect().width, parent: element.parentElement!.getBoundingClientRect().width, overflow: element.scrollWidth - element.clientWidth }));
  expect(detailsWidth.width).toBeCloseTo(detailsWidth.parent, 1);
  expect(detailsWidth.overflow).toBeLessThanOrEqual(1);
  await toolbar.getByRole('button', { name: 'Fail action', exact: true }).click();
  const error = toolbar.getByRole('alert');
  await expect(error).toContainText('The annotation integration could not complete');
  expect((await actions.boundingBox())!.width).toBeCloseTo(originalWidth, 1);
  expect((await error.boundingBox())!.width).toBeCloseTo(originalWidth, 1);
  expect(await error.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(async () => (await toolbar.boundingBox())!.width).toBeLessThanOrEqual(370);
  expect((await error.boundingBox())!.width).toBeCloseTo((await actions.boundingBox())!.width, 1);
  expect(await error.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
});
