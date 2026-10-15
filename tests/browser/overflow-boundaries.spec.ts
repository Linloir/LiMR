import { expect, test, type Page } from '@playwright/test';

async function paper(page: Page, title = 'Feature Visualization') {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '旁注折叠', exact: true }).click();
  await page.locator('#demo-sidebar-collapse-menu').getByRole('button', { name: '关闭', exact: true }).click();
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: title, exact: false }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.limr-reader-content > article > [data-limr-block]').last().scrollIntoViewIfNeeded();
}

test('footer cards pack into free space at rest and keep prose still on sidebar hover', async ({ page }) => {
  await paper(page);
  const rail = page.locator('.limr-sidebar'), cards = rail.locator('.limr-sidebar-card');
  const last = cards.last(), previous = cards.nth(await cards.count() - 2);
  await expect.poll(async () => {
    const r = (await rail.boundingBox())!, a = (await previous.boundingBox())!, b = (await last.boundingBox())!;
    return a.y >= r.y && b.y + b.height <= r.y + r.height + 1 && a.y + a.height + 13 <= b.y;
  }).toBe(true);
  const article = page.locator('.limr-reader-content > article');
  await last.locator('.limr-sidebar-card-heading').scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, top: scrollY }));
  await last.locator('.limr-sidebar-card-heading').hover();
  await expect(last).toHaveAttribute('data-active', 'true');
  await expect(article).toHaveCSS('translate', 'none');
  await last.locator('.limr-sidebar-card-heading').click();
  await expect(last).toHaveAttribute('data-expanded', 'true');
  await expect.poll(async () => {
    const card = (await last.boundingBox())!, r = (await rail.boundingBox())!;
    return card.y + card.height - r.y - r.height;
  }).toBeLessThan(1);
  await last.locator('.limr-sidebar-card-heading').click();
  await expect.poll(async () => {
    const card = (await last.boundingBox())!, r = (await rail.boundingBox())!;
    return card.y + card.height - r.y - r.height;
  }).toBeLessThan(1);
  await page.mouse.click(10, 10);
  await expect(article).toHaveCSS('translate', 'none');
  expect(await page.evaluate(() => ({ height: document.documentElement.scrollHeight, top: scrollY }))).toEqual(before);
});

for (const lowerState of ['collapsed', 'expanded', 'expanding'] as const) test(`focused footer collapse stays bounded and separates neighbors with the lower card ${lowerState}`, async ({ page }) => {
  await paper(page, '可解释性的基础积木');
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const rail = page.locator('.limr-sidebar'), cards = rail.locator('.limr-sidebar-card');
  const upper = cards.nth(await cards.count() - 2), lower = cards.last();
  const settled = () => expect.poll(() => rail.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  await settled();
  const initial = (await upper.boundingBox())!;
  if (lowerState !== 'collapsed') {
    await lower.locator('.limr-sidebar-card-heading').click();
    if (lowerState === 'expanded') await settled();
    else await page.waitForTimeout(80);
  }
  let lockedTop: number;
  if (lowerState === 'expanding') {
    // Click while both the preceding card and the lower expansion still move.
    await upper.locator('.limr-sidebar-card-heading').hover({ force: true });
    lockedTop = (await upper.boundingBox())!.y;
    await upper.locator('.limr-sidebar-card-heading').evaluate((button: HTMLButtonElement) => button.click());
  } else {
    await upper.locator('.limr-sidebar-card-heading').hover();
    lockedTop = (await upper.boundingBox())!.y;
    await upper.locator('.limr-sidebar-card-heading').click();
  }
  await settled();
  const expanded = (await upper.boundingBox())!;
  expect(expanded.height).toBeGreaterThan(initial.height + 20);
  for (const leaveDuringCollapse of [false, true]) {
    // Keep the pointer in the shared portion, so staying hovered and
    // intentionally leaving during the animation exercise distinct paths.
    const bounds = (await upper.boundingBox())!;
    await upper.hover({ position: { x: 15, y: Math.max(lockedTop, bounds.y) - bounds.y + initial.height / 2 } });
    const sampling = upper.evaluate(async element => {
      const button = element.querySelector<HTMLButtonElement>('.limr-sidebar-card-heading')!;
      button.click();
      const frames = [];
      for (let i = 0; i < 35; i++) {
        await new Promise<void>(resolve => requestAnimationFrame(() => { setTimeout(resolve, 0); }));
        const rect = element.getBoundingClientRect(), next = element.nextElementSibling!.getBoundingClientRect();
        frames.push({ top: rect.top, bottom: rect.bottom, height: rect.height, gap: next.top - rect.bottom, hovered: element.matches(':hover'), overflow: rect.bottom - element.parentElement!.getBoundingClientRect().bottom });
      }
      return frames;
    });
    if (leaveDuringCollapse) { await page.waitForTimeout(80); await page.mouse.move(10, 10); }
    const frames = await sampling;
    expect(frames.some(frame => frame.height > initial.height + 5 && frame.height < expanded.height - 5)).toBe(true);
    expect(Math.max(...frames.map(frame => frame.overflow))).toBeLessThan(1);
    expect(Math.min(...frames.map(frame => frame.gap))).toBeGreaterThanOrEqual(13);
    // Switching from the lower expansion can lock this card above its resting
    // position. Preserve that actual hit area until the pointer leaves.
    expect(frames.at(-1)!.top).toBeCloseTo(leaveDuringCollapse ? initial.y : lockedTop, 0);
    if (!leaveDuringCollapse) expect(frames.every(frame => frame.hovered)).toBe(true);
    await upper.locator('.limr-sidebar-card-heading').click();
    await settled();
  }
});

for (const width of [1800, 1380]) test(`footer expansion keeps the bottom fade off throughout layout at viewport width ${width}`, async ({ page }) => {
  await paper(page, '可解释性的基础积木');
  await page.setViewportSize({ width, height: 1000 });
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  const rail = page.locator('.limr-sidebar');
  const card = rail.locator('.limr-sidebar-card').last();
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect.poll(() => rail.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect.poll(() => rail.evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1000);
  const { frames, fadeChanges } = await card.evaluate(async element => {
    const rail = element.parentElement!;
    const button = element.querySelector<HTMLButtonElement>('.limr-sidebar-card-heading')!;
    const frames = [];
    // A mask can turn on and back off inside one rendering frame. Sampling
    // only after paint misses that churn and the resulting layer invalidation.
    let fadeChanges = 0;
    const observer = new MutationObserver(records => { fadeChanges += records.length; });
    observer.observe(rail, { attributes: true, attributeFilter: ['data-overflow-bottom'] });
    for (let i = 0; i < 100; i++) {
      if ([0, 28, 56, 61, 66].includes(i)) button.click();
      await new Promise<void>(resolve => requestAnimationFrame(() => { setTimeout(resolve, 0); }));
      const bottom = Math.min(innerHeight, rail.getBoundingClientRect().bottom);
      const overflow = Math.max(...[...rail.children].map(card => card.getBoundingClientRect().bottom - bottom));
      frames.push({ frame: i, overflow, faded: rail.hasAttribute('data-overflow-bottom') });
    }
    fadeChanges += observer.takeRecords().length;
    observer.disconnect();
    return { frames, fadeChanges };
  });
  expect(Math.max(...frames.map(frame => frame.overflow))).toBeLessThanOrEqual(.5);
  expect(frames.filter(frame => frame.faded)).toEqual([]);
  expect(fadeChanges).toBe(0);
});

test('sidebar and prose fade only at clipped top and bottom edges, including a nested scroll root', async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/?fixture=sidebar&nested');
  const rail = page.locator('.limr-sidebar').first();
  await expect(rail).toHaveAttribute('data-overflow-bottom', '');
  await expect.poll(() => rail.evaluate(element => getComputedStyle(element).maskImage)).toContain('linear-gradient');
  await page.locator('.limr-reader').first().locator('.limr-reader-content .limr-mark').last().hover();
  await expect(rail).toHaveAttribute('data-overflow-top', '');
  await page.getByRole('button', { name: 'Toggle long document', exact: true }).click();
  const root = page.locator('#sidebar-scroll-root'), content = page.locator('.limr-reader-content').first();
  await expect(content).toHaveAttribute('data-overflow-bottom', '');
  await root.evaluate(element => { element.scrollTop = 350; });
  await expect(content).toHaveAttribute('data-overflow-top', '');
  await expect(content).toHaveAttribute('data-overflow-bottom', '');
  await expect.poll(() => content.evaluate(element => getComputedStyle(element).maskImage)).toContain('linear-gradient');
  const bounds = await content.evaluate(element => ({ top: parseFloat(element.style.getPropertyValue('--limr-fade-start')), bottom: parseFloat(element.style.getPropertyValue('--limr-fade-end')) }));
  expect(bounds.bottom - bounds.top).toBeCloseTo(await root.evaluate(element => element.clientHeight), 0);
  await root.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect(content).not.toHaveAttribute('data-overflow-bottom');
  await page.emulateMedia({ media: 'print' });
  await expect(content).toHaveCSS('mask-image', 'none');
});

for (const nested of [false, true]) test(`prose fades follow the first painted scroll frame in ${nested ? 'a nested viewport' : 'the window'}`, async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto(`/?fixture=sidebar${nested ? '&nested' : ''}`);
  await page.getByRole('button', { name: 'Toggle long document', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  const content = page.locator('.limr-reader-content').first();
  await expect(content).toHaveAttribute('data-overflow-bottom', '');
  const frames = await content.evaluate(async element => {
    const root = document.querySelector<HTMLElement>('#sidebar-scroll-root');
    const frames = [];
    for (const top of [200, 240, 280, 400, 800, 760, 720, 0, 20, 40, 0]) {
      (root ?? window).scrollTo({ top, behavior: 'instant' });
      await new Promise<void>(resolve => requestAnimationFrame(() => { setTimeout(resolve, 0); }));
      const box = element.getBoundingClientRect(), rootBox = root?.getBoundingClientRect();
      const start = Math.max(box.top, rootBox ? rootBox.top + root!.clientTop : 0);
      const end = Math.min(box.bottom, rootBox ? rootBox.top + root!.clientTop + root!.clientHeight : innerHeight);
      const style = (element as HTMLElement).style;
      const css = getComputedStyle(element);
      const article = element.querySelector('.limr-prose')!.getBoundingClientRect();
      frames.push({
        drift: Math.max(Math.abs(box.top + parseFloat(style.getPropertyValue('--limr-fade-start')) - start), Math.abs(box.top + parseFloat(style.getPropertyValue('--limr-fade-end')) - end)),
        topMatches: element.hasAttribute('data-overflow-top') === (article.top < start - .5),
        bottomMatches: element.hasAttribute('data-overflow-bottom') === (article.bottom > end + .5),
        both: element.hasAttribute('data-overflow-top') && element.hasAttribute('data-overflow-bottom'),
        mask: css.maskImage,
      });
    }
    return frames;
  });
  expect(Math.max(...frames.map(frame => frame.drift))).toBeLessThan(1);
  expect(frames.every(frame => frame.topMatches && frame.bottomMatches)).toBe(true);
  expect(new Set(frames.filter(frame => frame.both).map(frame => frame.mask)).size).toBe(1);
});

test('translation dropdown shares menu motion and hover styling and closes with keyboard focus restored', async ({ page }) => {
  await page.goto('/#/playground');
  const trigger = page.getByRole('button', { name: '全局翻译展示模式', exact: true });
  await trigger.click();
  const menu = page.locator('#demo-translation-menu');
  await expect(menu).toHaveAttribute('data-open', 'true');
  const option = menu.getByRole('button', { name: '对照', exact: true });
  await option.hover();
  await expect(option.locator('.limr-underline')).toHaveCSS('background-size', '100% 1px');
  await option.click();
  await expect(trigger).toContainText('对照');
  await expect(trigger).toBeFocused();
  await trigger.click(); await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(trigger).toBeFocused();
  await page.setViewportSize({ width: 390, height: 850 });
  await trigger.click();
  const bounds = (await menu.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0); expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
});
