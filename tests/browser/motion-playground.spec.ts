import { expect, test } from '@playwright/test';

test('preview reveals at its final position, morphs continuously and honors reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.addInitScript(() => {
    (window as any).cardAnimations = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains('limr-annotation-overlay')) (window as any).cardAnimations.push(frames);
      return animate.call(this, frames, options);
    };
  });
  await page.goto('/?fixture=overlay');
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-mark').first().hover();
  const preview = page.locator('.limr-annotation-preview');
  await expect(preview).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).cardAnimations.length)).toBeGreaterThan(0);
  const entry = await page.evaluate(() => (window as any).cardAnimations[0]);
  expect(entry[0].clipPath).toMatch(/^inset\(/);
  const frames = await preview.evaluate(async element => {
    const samples = [];
    do {
      const rect = element.getBoundingClientRect(), text = element.querySelector('.limr-overlay-content')!.getBoundingClientRect();
      samples.push({ x: rect.x, y: rect.y, width: rect.width, textWidth: text.width });
      await new Promise(requestAnimationFrame);
    } while (element.getAnimations().some(animation => animation.playState === 'running'));
    return samples;
  });
  expect(frames.length).toBeGreaterThan(3);
  // The marker has its own 1px hover lift; the card itself must not travel or
  // squeeze its text through the width of the marker while revealing.
  for (const key of ['x', 'y', 'width', 'textWidth'] as const) {
    expect(Math.max(...frames.map(frame => frame[key])) - Math.min(...frames.map(frame => frame[key]))).toBeLessThan(3);
  }
  const before = (await preview.boundingBox())!;
  await preview.evaluate(element => { element.dataset.identity = 'same-card'; });
  await page.evaluate(() => {
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (this.closest('[data-motion="morphing"]')) { animation.pause(); animation.currentTime = 0; }
      return animation;
    };
  });
  await preview.getByRole('button', { name: '展开', exact: true }).click();
  const expanded = page.locator('.limr-annotation-expanded');
  await expect(expanded).toHaveAttribute('data-identity', 'same-card');
  await expect(expanded).toHaveAttribute('data-motion', 'morphing');
  const start = (await expanded.locator('.limr-overlay-surface').boundingBox())!;
  for (const key of ['x', 'y', 'width', 'height'] as const) expect(start[key]).toBeCloseTo(before[key], 0);
  const progress = await expanded.evaluate(element => {
    const shell = element.querySelector('.limr-overlay-surface')!;
    const animation = shell.getAnimations()[0];
    const target = element.parentElement!.getBoundingClientRect();
    const duration = Number(animation.effect!.getTiming().duration);
    animation.currentTime = duration / 4;
    const first = shell.getBoundingClientRect().width;
    animation.currentTime = duration * .75;
    return { first, last: shell.getBoundingClientRect().width, target: target.width, easing: animation.effect!.getTiming().easing };
  });
  expect(progress.easing).toContain('cubic-bezier');
  expect((progress.first - before.width) / (progress.target - before.width)).toBeGreaterThan(.45);
  expect((progress.last - before.width) / (progress.target - before.width)).toBeGreaterThan(.9);
  await expanded.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
  const final = (await expanded.boundingBox())!;
  expect(final.height).toBeCloseTo(850 * .8, 0);
  expect(final.y + final.height / 2).toBeCloseTo(425, 0);
  expect(final.x + final.width / 2).toBeCloseTo(350, 0);
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-annotation-overlay[data-state="closing"]')).toBeAttached();
  await expect(page.locator('.limr-annotation-overlay')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const animationCount = await page.evaluate(() => (window as any).cardAnimations.length);
  await page.locator('.limr-mark').first().hover();
  await expect(page.locator('.limr-annotation-preview')).toBeVisible();
  expect(await page.evaluate(() => (window as any).cardAnimations.length)).toBe(animationCount);
});

test('edge placement and rapid marker changes reveal from the current marker on the correct side', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 520 });
  await page.addInitScript(() => {
    (window as any).origins = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      if (this.classList.contains('limr-annotation-overlay')) {
        const element = this as HTMLElement;
        (window as any).origins.push({ frames, placement: element.dataset.placement, rect: element.getBoundingClientRect().toJSON() });
      }
      return animate.call(this, frames, options);
    };
  });
  await page.goto('/?fixture=visual'); await page.evaluate(() => document.fonts.ready);
  const first = page.locator('.limr-reader-content .limr-mark').nth(0), second = page.locator('.limr-reader-content .limr-mark').nth(1);
  await first.evaluate(element => Object.assign(element.style, { position: 'fixed', left: '24px', top: '80px', transition: 'none', zIndex: '5' }));
  await second.evaluate(element => Object.assign(element.style, { position: 'fixed', left: '650px', top: '450px', transition: 'none', zIndex: '5' }));
  await first.hover();
  const card = page.locator('.limr-annotation-preview');
  await expect(card).toHaveAttribute('data-placement', /^bottom/);
  await card.evaluate(element => { element.dataset.identity = 'retained'; });
  await second.hover();
  await expect(card).toContainText('Trailing citation');
  await expect(card).toHaveAttribute('data-placement', /^top/);
  await expect(card).toHaveAttribute('data-identity', 'retained');
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const bounds = await card.boundingBox(), marker = await second.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(12);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(688);
  expect(bounds!.y + bounds!.height).toBeLessThan(marker!.y);
  const origins = await page.evaluate(() => (window as any).origins);
  const entry = origins.filter((origin: any) => origin.placement.startsWith('top')).at(-1);
  const inset = entry.frames[0].clipPath.match(/inset\(([^)]+) round/)[1].split(' ').map(parseFloat);
  expect(inset[0]).toBe(100); expect(inset[2]).toBe(0);
  const x = entry.rect.left + entry.rect.width * inset[3] / 100;
  expect(x).toBeCloseTo(marker!.x + marker!.width / 2, 0);
  await page.mouse.move(350, 500);
  await expect(card).toHaveAttribute('data-state', 'closing');
  await first.hover();
  await expect(card).toContainText('Middle citation');
  await expect(card).toHaveAttribute('data-placement', /^bottom/);
  // Neither side can fit the natural height: cap to the available side instead
  // of extending past the viewport or oscillating between placements.
  await page.setViewportSize({ width: 700, height: 320 });
  await first.evaluate(element => Object.assign(element.style, { left: '650px', top: '140px' }));
  await first.hover();
  await expect.poll(() => card.evaluate(e => e.getBoundingClientRect().bottom)).toBeLessThanOrEqual(308);
  expect((await card.boundingBox())!.y).toBeGreaterThanOrEqual(12);
  await expect(card.locator('.limr-overlay-scroll')).toHaveAttribute('data-overflow', '');
});

test('overlay scrollbar reserves no width, stays hidden during motion and fades after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 650 });
  await page.goto('/'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  const paragraphs = Array.from({ length: 30 }, (_, i) => `Paragraph ${i}. A long annotation with stable line wrapping.`).join('&#10;&#10;');
  await page.getByRole('textbox', { name: 'Markdown source' }).fill(`Text<ref id="long" />.\n\n<citation id="long" title="Long annotation" description="${paragraphs}" />`);
  await page.getByRole('button', { name: '阅读', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-mark').hover();
  const card = page.locator('.limr-annotation-preview'), content = card.locator('.limr-overlay-content'), track = card.locator('.limr-overlay-scrollbar');
  await expect(card).toBeVisible();
  await card.evaluate(element => { for (const animation of element.getAnimations()) { animation.pause(); animation.currentTime = 80; } });
  await content.evaluate(element => { element.scrollTop = 50; });
  await expect(track).toHaveCSS('opacity', '0');
  await expect(content).toHaveCSS('scrollbar-width', 'none');
  await card.evaluate(element => { for (const animation of element.getAnimations()) animation.finish(); });
  await expect.poll(() => card.evaluate(e => e.hasAttribute('data-motion'))).toBe(false);
  const width = await content.evaluate(element => ({ outer: (element as HTMLElement).offsetWidth, inner: element.clientWidth, text: element.firstElementChild!.getBoundingClientRect().width }));
  expect(width.inner).toBe(width.outer);
  await content.hover(); await page.mouse.wheel(0, 120);
  await expect(track).toHaveCSS('opacity', '1');
  expect(await content.evaluate(element => element.firstElementChild!.getBoundingClientRect().width)).toBe(width.text);
  await expect(track).toHaveCSS('opacity', '0', { timeout: 2000 });
  await page.mouse.wheel(0, 80); await expect(track).toHaveCSS('opacity', '1');
  const thumb = await card.locator('.limr-overlay-scroll-thumb').boundingBox();
  const before = await content.evaluate(element => element.scrollTop);
  await page.mouse.move(thumb!.x + thumb!.width / 2, thumb!.y + thumb!.height / 2);
  await page.mouse.down(); await page.mouse.move(thumb!.x + thumb!.width / 2, thumb!.y + thumb!.height / 2 + 30, { steps: 4 }); await page.mouse.up();
  expect(await content.evaluate(element => element.scrollTop)).toBeGreaterThan(before + 30);
  await expect(card.getByRole('button', { name: '展开', exact: true })).toHaveCount(0);
});

test('editing has two columns and matches source blocks in both scroll directions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  const source = Array.from({ length: 40 }, (_, i) => `## Section ${i}\n\n${'Readable paragraph. '.repeat(12)}\n\nAnother paragraph.\n`).join('\n');
  const editor = page.getByRole('textbox', { name: 'Markdown source' });
  await editor.fill(source);
  await expect(page.locator('.demo-preview-scroll h2')).toHaveCount(40);
  const rects = await page.evaluate(() => ({ editor: document.querySelector('.demo-editor-pane')!.getBoundingClientRect().toJSON(), preview: document.querySelector('.demo-preview-pane')!.getBoundingClientRect().toJSON() }));
  expect(rects.editor.right).toBeLessThanOrEqual(rects.preview.left);
  const sourceY = source.slice(0, source.indexOf('## Section 12')).split('\n').length - 1;
  await editor.evaluate((element, line) => { element.scrollTop = line * parseFloat(getComputedStyle(element).lineHeight); }, sourceY);
  const heading = page.locator('.demo-preview-scroll h2').nth(12);
  await expect.poll(() => heading.evaluate(element => {
    return Math.abs(element.getBoundingClientRect().top - element.closest('.demo-preview-scroll')!.getBoundingClientRect().top);
  })).toBeLessThan(3);
  await page.locator('.demo-preview-scroll').dispatchEvent('pointerdown');
  await page.locator('.demo-preview-scroll h2').nth(20).evaluate(element => {
    const pane = element.closest('.demo-preview-scroll')!;
    pane.scrollTop += element.getBoundingClientRect().top - pane.getBoundingClientRect().top;
  });
  const expected = (source.slice(0, source.indexOf('## Section 20')).split('\n').length - 1) * 22;
  await expect.poll(() => editor.evaluate(element => element.scrollTop)).toBeCloseTo(expected, 0);
});

test('touch viewport uses the shared selection geometry and a pinned citation card', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/?fixture=visual');
  await expect(page.locator('.limr-reader-content .katex')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-reader-content > article > p').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect(page.locator('.limr-paint-selection[data-marker]')).toHaveCount(1);
  const rects = await page.locator('.limr-paint-selection').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
  expect(Math.max(...rects.map(rect => rect.height)) - Math.min(...rects.map(rect => rect.height))).toBeLessThan(.5);
  for (const rect of rects) { expect(rect.left).toBeGreaterThanOrEqual(0); expect(rect.right).toBeLessThanOrEqual(390); }
  await page.evaluate(() => getSelection()!.removeAllRanges());
  await page.locator('.limr-mark').first().tap();
  await expect(page.locator('.limr-annotation-preview')).toHaveAttribute('data-pinned', 'true');
  await expect(page.locator('.limr-annotation-expanded')).toHaveCount(0);
  await expect(page.locator('.limr-annotation-preview').getByRole('button', { name: '展开' })).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await context.close();
});

test('modules can grow to content height at either anchored edge and collapse back', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=overlay'); await page.evaluate(() => document.fonts.ready);
  const marker = page.locator('.limr-mark').nth(1);
  for (const top of [80, 740]) {
    await marker.evaluate((element, top) => Object.assign(element.style, { position: 'fixed', left: '300px', top: `${top}px`, zIndex: '5' }), top);
    await marker.hover();
    const preview = page.locator('.limr-annotation-preview');
    await expect.poll(() => preview.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
    const before = (await preview.boundingBox())!;
    await preview.getByRole('button', { name: '展开', exact: true }).click();
    const expanded = page.locator('.limr-annotation-expanded');
    await expect.poll(() => expanded.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
    const after = (await expanded.boundingBox())!;
    expect(after.width).toBeCloseTo(before.width, 1);
    expect(after.x).toBeCloseTo(before.x, 1);
    expect(after.height).toBeGreaterThan(before.height + 25);
    expect(after.height).toBeLessThan(400);
    expect(top < 400 ? after.y : after.y + after.height).toBeCloseTo(top < 400 ? before.y : before.y + before.height, 1);
    await expanded.getByRole('button', { name: '收起', exact: true }).click();
    await expect(preview).toHaveAttribute('data-pinned', 'true');
    await expect.poll(() => preview.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
    expect((await preview.boundingBox())!.height).toBeCloseTo(before.height, 1);
    await page.keyboard.press('Escape'); await expect(page.locator('.limr-annotation-overlay')).toHaveCount(0);
  }
});

test('sidebar modules opt into content-click collapse while links and conversation controls stay interactive', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?fixture=overlay');
  const citation = page.locator('.limr-sidebar-card').last();
  await page.locator('.limr-reader-content .limr-mark').last().click();
  await citation.locator('a').evaluate(element => element.addEventListener('click', event => { event.preventDefault(); element.dataset.clicks = String(Number(element.dataset.clicks ?? 0) + 1); }));
  await citation.locator('.limr-sidebar-card-content').getByText('Clickable sidebar content.').click();
  await expect(citation.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  await expect(citation.locator('a')).toHaveAttribute('data-clicks', '1');
  await citation.locator('a').click();
  await expect(citation.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  await expect(citation.locator('a')).toHaveAttribute('data-clicks', '2');
  const label = citation.locator('.limr-sidebar-toggle');
  await label.hover();
  await expect(label).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(label.locator('.limr-underline')).toHaveCSS('background-size', '100% 1px');
  // The whole card owns hover, including after collapse while the pointer stays.
  await citation.locator('.limr-sidebar-card-content').getByText('Clickable sidebar content.').hover();
  await expect(label.locator('.limr-underline')).toHaveCSS('background-size', '100% 1px');
  await citation.getByRole('button').click();
  await expect(citation.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  await expect(citation).toHaveAttribute('data-active', 'true');
  await expect(label.locator('.limr-underline')).toHaveCSS('background-size', '100% 1px');
  const conversation = page.locator('.limr-sidebar-card').first();
  await page.locator('.limr-reader-content .limr-mark').first().click();
  await conversation.getByText('Preview content').click();
  await expect(conversation.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  await conversation.getByRole('textbox').fill('Keep this draft');
  await expect(conversation.getByRole('textbox')).toHaveValue('Keep this draft');
  const clickCard = page.locator('.limr-sidebar-card').nth(2);
  await page.locator('.limr-reader-content .limr-mark').nth(2).click();
  await clickCard.getByText('Click to collapse this module.').click();
  await expect(clickCard.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});

test('citation keeps header and content geometry when pinned, with soft borderless entry motion', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=overlay'); await page.evaluate(() => document.fonts.ready);
  const marker = page.locator('.limr-mark').last();
  await marker.hover();
  const card = page.locator('.limr-annotation-preview');
  const entry = await card.evaluate(element => {
    const animation = element.getAnimations()[0];
    const content = element.querySelector('.limr-overlay-content')!;
    return { frames: (animation.effect as KeyframeEffect).getKeyframes(), timing: animation.effect!.getTiming(), content: content.getAnimations().map(item => ({ frames: (item.effect as KeyframeEffect).getKeyframes(), timing: item.effect!.getTiming() })) };
  });
  expect(entry.frames[0].opacity).toBe('0');
  expect(Number(entry.timing.duration)).toBeLessThan(600);
  expect(entry.timing.easing).toContain('cubic-bezier');
  expect(entry.content[0].frames[0].transform).toBe('translateY(6px)');
  expect(Number(entry.content[0].timing.duration) + (entry.content[0].timing.delay ?? 0)).toBe(entry.timing.duration);
  await expect.poll(() => card.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
  const before = await card.evaluate(element => ({ card: element.getBoundingClientRect().height, header: element.querySelector('.limr-overlay-header')!.getBoundingClientRect().height }));
  const enterDuration = entry.timing.duration;
  await marker.click();
  await expect(card).toHaveAttribute('data-pinned', 'true');
  await expect(card.getByRole('button', { name: '关闭' })).toBeVisible();
  await expect(card.getByRole('button', { name: '展开' })).toHaveCount(0);
  const after = await card.evaluate(element => ({ card: element.getBoundingClientRect().height, header: element.querySelector('.limr-overlay-header')!.getBoundingClientRect().height }));
  expect(after).toEqual(before);
  await expect(card).toHaveCSS('border-top-width', '0px');
  await expect(card.locator('.limr-overlay-header')).toHaveCSS('border-bottom-width', '0px');
  const exitDuration = await card.evaluate(async element => {
    (element.querySelector('.limr-overlay-close') as HTMLButtonElement).click();
    await new Promise(requestAnimationFrame);
    return element.getAnimations()[0].effect!.getTiming().duration;
  });
  expect(exitDuration).toBe(enterDuration);
});

test('hover exit responds promptly and reversals resume the live frame without stale removal', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=overlay'); await page.evaluate(() => document.fonts.ready);
  const marker = page.locator('.limr-mark').last(), card = page.locator('.limr-annotation-preview');
  await marker.hover(); await expect(card).toBeVisible();
  await card.evaluate(element => { (window as any).retainedCard = element; });
  for (let cycle = 0; cycle < 3; cycle++) {
    const beforeExit = await card.evaluate(element => {
      for (const animation of element.getAnimations({ subtree: true })) { animation.pause(); animation.currentTime = 360; }
      return { opacity: getComputedStyle(element).opacity, clipPath: getComputedStyle(element).clipPath };
    });
    await page.mouse.move(680, 820);
    await expect(card).toHaveAttribute('data-motion', 'closing');
    const closing = await card.evaluate(element => {
      const animation = element.getAnimations()[0];
      const initial = (animation.effect as KeyframeEffect).getKeyframes()[0];
      for (const item of element.getAnimations({ subtree: true })) { item.pause(); item.currentTime = 70; }
      return { same: element === (window as any).retainedCard, initial, delay: animation.effect!.getTiming().delay, opacity: getComputedStyle(element).opacity, clipPath: getComputedStyle(element).clipPath };
    });
    expect(closing.same).toBe(true);
    expect(Number(closing.initial.opacity)).toBeCloseTo(Number(beforeExit.opacity), 4);
    expect(closing.initial.clipPath).toBe(beforeExit.clipPath);
    expect(closing.delay).toBe(0);
    expect(Number(closing.opacity)).toBeLessThan(Number(beforeExit.opacity) - .1);
    await marker.hover();
    await expect(card).toHaveAttribute('data-state', 'open');
    const resumed = await card.evaluate(element => {
      const animation = element.getAnimations()[0];
      return { same: element === (window as any).retainedCard, initial: (animation.effect as KeyframeEffect).getKeyframes()[0] };
    });
    expect(resumed.same).toBe(true);
    expect(Number(resumed.initial.opacity)).toBeCloseTo(Number(closing.opacity), 4);
    expect(resumed.initial.clipPath).toBe(closing.clipPath);
  }
  await expect.poll(() => card.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
  await expect(card).toHaveCSS('opacity', '1');
  await marker.click();
  const close = card.getByRole('button', { name: '关闭' });
  await close.hover(); await expect(close).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await close.click(); await expect(card).toHaveCount(0);
  await page.mouse.move(680, 820); await marker.hover(); await expect(card).toBeVisible();
  await expect.poll(() => card.evaluate(element => element.hasAttribute('data-motion'))).toBe(false);
  await expect(card).toHaveCSS('opacity', '1');
});
