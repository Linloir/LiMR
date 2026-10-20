import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

async function load(page: Page, source: string, collapse: boolean) {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(({ source, collapse }) => window.limrStream({ source, streaming: false, sidebar: true, sidebarCollapse: collapse }), { source, collapse });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.limr-sidebar')).not.toHaveAttribute('data-moving');
  await expect.poll(() => page.locator('.limr-reader').evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
}
const positions = (page: Page) => page.locator('.limr-sidebar').evaluate(rail => {
  const top = rail.getBoundingClientRect().top;
  return [...rail.querySelectorAll<HTMLElement>('.limr-sidebar-card')].map(card => ({ id: card.dataset.occurrence!, top: card.getBoundingClientRect().top - top, height: card.getBoundingClientRect().height }));
});

async function settled(page: Page) {
  await expect(page.locator('.limr-sidebar')).not.toHaveAttribute('data-moving');
  await expect.poll(() => page.locator('.limr-reader').evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
}
const samplePositions = (page: Page, count = 50) => page.locator('.limr-sidebar').evaluate(async (rail, count) => {
  const samples: number[][] = [];
  for (let frame = 0; frame < count; frame++) {
    await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    const top = rail.getBoundingClientRect().top;
    samples.push([...rail.querySelectorAll('.limr-sidebar-card')].map(card => card.getBoundingClientRect().top - top));
  }
  return samples;
}, count);

async function expectPinnedHoverStable(page: Page, id: string) {
  const card = page.locator(`.limr-sidebar-card[data-occurrence="${id}"]`);
  await card.scrollIntoViewIfNeeded();
  await settled(page);
  const before = await card.evaluate(element => ({
    cardTop: element.getBoundingClientRect().top,
    proseTop: document.querySelector('.limr-reader-content .limr-prose')!.getBoundingClientRect().top,
    scroll: scrollY,
  }));
  // Use actual pointer coordinates: locator hover retries can hide a card
  // repeatedly moving out from under a stationary pointer at its bottom edge.
  for (const edge of [false, true]) {
    const box = (await card.boundingBox())!;
    const x = box.x + box.width / 2, y = box.y + (edge ? box.height - 2 : box.height / 2);
    expect(y).toBeGreaterThan(0);
    expect(y).toBeLessThan(page.viewportSize()!.height);
    await page.mouse.move(x, y);
    const frames = await card.evaluate(async (element, point) => {
      const frames = [];
      for (let index = 0; index < 45; index++) {
        await new Promise(requestAnimationFrame);
        frames.push({
          cardTop: element.getBoundingClientRect().top,
          proseTop: document.querySelector('.limr-reader-content .limr-prose')!.getBoundingClientRect().top,
          scroll: scrollY,
          hit: document.elementFromPoint(point.x, point.y)?.closest('.limr-sidebar-card') === element,
        });
      }
      return frames;
    }, { x, y });
    expect(Math.max(...frames.map(frame => Math.abs(frame.cardTop - before.cardTop)))).toBeLessThan(1);
    expect(Math.max(...frames.map(frame => Math.abs(frame.proseTop - before.proseTop)))).toBeLessThan(1);
    expect(frames.every(frame => frame.scroll === before.scroll && frame.hit)).toBe(true);
    await expect(card).toHaveAttribute('data-expanded', 'true');
    await page.mouse.move(2, 2);
    await settled(page);
    expect((await card.boundingBox())!.y).toBeCloseTo(before.cardTop, 0);
  }
}

for (const collapse of [false, true]) {
  test(`reentering a pinned card after another card preserves its pointer area and prose (folding ${collapse})`, async ({ page }) => {
    await load(page, readFileSync('playground/presets/notes.md', 'utf8'), collapse);
    const index = collapse ? 3 : 5, card = page.locator('.limr-sidebar-card').nth(index);
    const id = (await card.getAttribute('data-occurrence'))!;
    await card.locator('.limr-sidebar-card-heading').click();
    await page.mouse.move(2, 2); await settled(page);
    await page.locator('.limr-sidebar-card').nth(index - 1).hover();
    await page.mouse.move(2, 2); await settled(page);
    await expectPinnedHoverStable(page, id);
  });

  test(`hovering the active marker preserves every pinned sidebar item (folding ${collapse})`, async ({ page }) => {
    await load(page, readFileSync('playground/presets/notes.md', 'utf8'), collapse);
    const card = page.locator('.limr-sidebar-card').nth(1), id = await card.getAttribute('data-occurrence');
    await card.locator('.limr-sidebar-card-heading').click(); await page.mouse.move(2, 2); await settled(page);
    const before = await positions(page), marker = page.locator(`.limr-reader-content [data-limr-anchor="${id}"]`);
    const box = (await marker.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const frames = await samplePositions(page);
    expect(Math.max(...frames.flatMap(frame => frame.map((top, index) => Math.abs(top - before[index].top))))).toBeLessThan(1);
    await page.mouse.move(2, 2);
    const returned = await samplePositions(page);
    expect(Math.max(...returned.flatMap(frame => frame.map((top, index) => Math.abs(top - before[index].top))))).toBeLessThan(1);
  });

  test(`leaving another marker animates back to the pinned sidebar layout (folding ${collapse})`, async ({ page }) => {
    await load(page, readFileSync('playground/presets/notes.md', 'utf8'), collapse);
    const card = page.locator('.limr-sidebar-card').nth(1);
    await card.locator('.limr-sidebar-card-heading').click(); await page.mouse.move(2, 2); await settled(page);
    const pinned = await positions(page), marker = page.locator('.limr-reader-content .limr-mark').nth(4);
    await marker.hover(); await settled(page);
    const hovered = await positions(page);
    expect(Math.max(...hovered.map((card, index) => Math.abs(card.top - pinned[index].top)))).toBeGreaterThan(30);
    const sampling = samplePositions(page);
    await page.mouse.move(2, 2);
    const frames = await sampling;
    await expect.poll(async () => Math.max(...(await positions(page)).map((card, index) => Math.abs(card.top - pinned[index].top)))).toBeLessThan(1);
    for (let index = 0; index < pinned.length; index++) {
      const distance = Math.abs(hovered[index].top - pinned[index].top);
      if (distance < 20) continue;
      const intermediate = frames.filter(frame => Math.abs(frame[index] - hovered[index].top) > 2 && Math.abs(frame[index] - pinned[index].top) > 2);
      expect(intermediate.length, `card ${index} returns through intermediate positions`).toBeGreaterThan(3);
      const steps = [hovered[index].top, ...frames.map(frame => frame[index])];
      expect(Math.max(...steps.slice(1).map((top, at) => Math.abs(top - steps[at]))), `card ${index} does not snap back`).toBeLessThan(distance * .55);
    }
  });
}

test('a saved Playground note stays still when its active card is hovered again', async ({ page }) => {
  await page.setViewportSize({ width: 1881, height: 971 });
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: /做一点笔记/ }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => scrollTo(0, 400));
  const paragraph = page.locator('.limr-reader-content p').filter({ hasText: '展示了覆盖规则' });
  await paragraph.evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), text = '义为准；同一范围有多个高亮';
    while (walker.nextNode()) {
      const node = walker.currentNode, start = node.textContent!.indexOf(text);
      if (start < 0) continue;
      const range = document.createRange(); range.setStart(node, start); range.setEnd(node, start + text.length);
      getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
      return;
    }
    throw new Error('The note passage was not found');
  });
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  const card = page.locator('.limr-sidebar-card[data-type="reading-note"]');
  await card.getByRole('textbox', { name: '笔记内容', exact: true }).fill('234');
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await page.mouse.click(2, 2); await settled(page);
  await card.locator('.limr-sidebar-card-heading').click();
  await page.mouse.move(2, 2); await settled(page);
  await page.locator('.limr-sidebar-card').filter({ hasText: '后来补上了成立的条件' }).hover();
  await page.mouse.move(2, 2); await settled(page);
  await expectPinnedHoverStable(page, (await card.getAttribute('data-occurrence'))!);
});

test('entering a partially visible card cannot freeze a folding window during its return', async ({ page }) => {
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), true);
  const rail = page.locator('.limr-sidebar');
  await rail.evaluate(element => element.style.setProperty('--limr-motion-slow', '900ms'));
  const before = await positions(page), marker = page.locator('.limr-reader-content .limr-mark').nth(8);
  await marker.hover(); await settled(page);
  await page.mouse.move(2, 2);
  await expect(rail).toHaveAttribute('data-moving', 'true');
  const partial = await rail.evaluate(async rail => {
    for (let frame = 0; frame < 35; frame++) {
      await new Promise(requestAnimationFrame);
      for (const card of rail.querySelectorAll<HTMLElement>('.limr-sidebar-card:not([inert])')) {
        const box = card.getBoundingClientRect(), clip = card.closest('.limr-sidebar-cluster-list')!.getBoundingClientRect();
        const top = Math.max(box.top, clip.top, 0), bottom = Math.min(box.bottom, clip.bottom, innerHeight);
        const fraction = (bottom - top) / box.height;
        if (fraction < .2 || fraction > .8) continue;
        const x = box.left + 35, y = (top + bottom) / 2;
        if (document.elementFromPoint(x, y)?.closest('.limr-sidebar-card') === card) return { x, y };
      }
    }
    return null;
  });
  expect(partial).not.toBeNull();
  await page.mouse.move(partial!.x, partial!.y);
  await settled(page);
  await expect.poll(async () => Math.max(...(await positions(page)).map((card, index) => Math.abs(card.top - before[index].top)))).toBeLessThan(1);
  // After the return, normal pointer interaction still works.
  await page.mouse.move(2, 2); await rail.locator('.limr-sidebar-card').first().hover();
  await expect(rail.locator('.limr-sidebar-card').first()).toHaveAttribute('data-active', 'true');
});

test('a marker can hand off hover to its card before the folding reveal finishes', async ({ page }) => {
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), true);
  const rail = page.locator('.limr-sidebar');
  await rail.evaluate(element => element.style.setProperty('--limr-motion-slow', '900ms'));
  const marker = page.locator('.limr-reader-content .limr-mark').nth(8), id = await marker.getAttribute('data-limr-anchor');
  const card = rail.locator(`[data-occurrence="${id}"]`);
  await marker.hover(); await expect(rail).toHaveAttribute('data-moving', 'true');
  const point = await card.evaluate(async card => {
    for (let frame = 0; frame < 40; frame++) {
      await new Promise(requestAnimationFrame);
      const box = card.getBoundingClientRect(), clip = card.closest('.limr-sidebar-cluster-list')!.getBoundingClientRect();
      if (box.top < Math.max(0, clip.top) || box.bottom > Math.min(innerHeight, clip.bottom)) continue;
      const x = box.left + 35, y = box.top + box.height / 2;
      if (document.elementFromPoint(x, y)?.closest('.limr-sidebar-card') === card) return { x, y };
    }
    return null;
  });
  expect(point).not.toBeNull(); await expect(rail).toHaveAttribute('data-moving', 'true');
  await page.mouse.move(point!.x, point!.y);
  await expect.poll(() => page.evaluate(() => window.limrStreamRuntime!.interaction.get().hoverSource)).toBe('sidebar');
  const before = (await card.boundingBox())!.y;
  await settled(page);
  await expect(card).toHaveAttribute('data-active', 'true');
  expect((await card.boundingBox())!.y).toBeCloseTo(before, 0);
});

test('hover resumes on the fully visible card under the pointer after a folding return', async ({ page }) => {
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), true);
  const rail = page.locator('.limr-sidebar'), first = rail.locator('.limr-sidebar-card').first();
  await rail.evaluate(element => element.style.setProperty('--limr-motion-slow', '900ms'));
  const before = await positions(page), box = (await first.boundingBox())!, id = await first.getAttribute('data-occurrence');
  await page.locator('.limr-reader-content .limr-mark').nth(8).hover(); await settled(page);
  await page.mouse.move(2, 2); await expect(rail).toHaveAttribute('data-moving', 'true');
  await page.mouse.move(box.x + 35, box.y + box.height / 2);
  await settled(page);
  // No extra pointer movement should be needed once the resting card is visible.
  await expect.poll(() => page.evaluate(() => {
    const { hovered, hoverSource } = window.limrStreamRuntime!.interaction.get();
    return { hovered, hoverSource };
  })).toEqual({ hovered: id, hoverSource: 'sidebar' });
  expect(Math.max(...(await positions(page)).map((card, index) => Math.abs(card.top - before[index].top)))).toBeLessThan(1);
});

test('reduced motion restores a folded pin without retaining the hover deferral', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), true);
  const rail = page.locator('.limr-sidebar'), card = rail.locator('.limr-sidebar-card').nth(1);
  await card.locator('.limr-sidebar-card-heading').click(); await page.mouse.move(2, 2); await settled(page);
  const pinned = await positions(page);
  await page.locator('.limr-reader-content .limr-mark').nth(4).hover();
  await page.mouse.move(2, 2); await settled(page);
  await expect.poll(async () => Math.max(...(await positions(page)).map((card, index) => Math.abs(card.top - pinned[index].top)))).toBeLessThan(1);
  await expect(rail).not.toHaveAttribute('data-returning');
  await rail.locator('.limr-sidebar-card').first().hover();
  await expect(rail.locator('.limr-sidebar-card').first()).toHaveAttribute('data-active', 'true');
});

for (const collapse of [false, true]) test(`a sidebar pin stays highlighted and stationary when entering prose markers (folding ${collapse})`, async ({ page }) => {
  const source = '# Reading\n\nBefore ::%%limr%%{<#r}**shared reference**::%%limr%%{>#r} after.\n\n'
    + Array.from({ length: 6 }, (_, i) => `:::limr-annotation{#n${i} ranges="r" type="footnote"}\nNote ${i}.\n:::`).join('\n\n')
    + '\n\n' + 'Further reading. '.repeat(800);
  await load(page, source, collapse);
  const card = page.locator('.limr-sidebar-card').nth(2), id = await card.getAttribute('data-occurrence');
  const marker = page.locator(`.limr-reader-content [data-limr-anchor="${id}"]`);
  await card.locator('.limr-sidebar-card-heading').click();
  await page.mouse.move(2, 2);
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await expect.poll(() => page.evaluate(() => window.limrStreamRuntime!.getContentOffset())).toBeGreaterThan(50);
  await page.waitForTimeout(650);
  const before = await marker.boundingBox(), scroll = await page.evaluate(() => scrollY);
  // Move the real pointer without locator auto-scrolling or stability retries.
  // Both the active marker and another marker must leave the prose in place.
  for (const target of [marker, page.locator('.limr-reader-content .limr-mark').first()]) {
    const box = (await target.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const samples = await marker.evaluate(async element => {
      const frames = [];
      for (let index = 0; index < 60; index++) {
        await new Promise(requestAnimationFrame);
        frames.push({ top: element.getBoundingClientRect().top, scroll: scrollY });
      }
      return frames;
    });
    expect(Math.max(...samples.map(frame => Math.abs(frame.top - before!.y)))).toBeLessThan(1);
    expect(samples.every(frame => frame.scroll === scroll)).toBe(true);
    const hoveredId = await target.getAttribute('data-limr-anchor');
    await expect.poll(() => page.locator('.limr-reader-content strong').evaluate((element, id) => {
      const range = document.createRange(); range.selectNodeContents(element);
      return Math.abs(range.getBoundingClientRect().top - document.querySelector(`[data-occurrence="${id}"]`)!.getBoundingClientRect().top);
    }, hoveredId)).toBeLessThan(1);
    await page.mouse.move(2, 2);
  }
  const paint = page.locator(`[data-paint="reference-${id}"]`);
  await expect(paint.first()).toHaveCSS('opacity', '1');
  await page.mouse.click(2, 2);
  await expect.poll(() => paint.evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '0'))).toBe(true);
  expect(await page.locator('#stream-source').textContent()).toBe(source);
});

for (const collapse of [false, true]) test(`hover and activation preserve the existing sidebar stack (folding ${collapse})`, async ({ page }) => {
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), collapse);
  const index = collapse ? 3 : 5, card = page.locator('.limr-sidebar-card').nth(index);
  const before = await positions(page);
  await card.hover();
  await expect.poll(() => page.evaluate(() => window.limrStreamRuntime!.getContentOffset())).not.toBe(0);
  await page.waitForTimeout(550);
  const hovered = await positions(page);
  expect(Math.max(...hovered.map((card, i) => Math.abs(card.top - before[i].top)))).toBeLessThan(1);
  await card.locator('.limr-sidebar-card-heading').click();
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await page.waitForTimeout(650);
  const expanded = await positions(page);
  expect(expanded[index].top).toBeCloseTo(hovered[index].top, 0);
  for (let i = 1; i <= index; i++) {
    const gap = expanded[i].top - expanded[i - 1].top - expanded[i - 1].height;
    expect(gap).toBeCloseTo(hovered[i].top - hovered[i - 1].top - hovered[i - 1].height, 0);
  }
  await page.locator('.limr-sidebar-card').nth(index - 1).hover();
  await page.mouse.move(2, 2);
  await expect.poll(async () => Math.max(...(await positions(page)).map((card, i) => Math.abs(card.top - expanded[i].top)))).toBeLessThan(1);
  await page.mouse.click(2, 2);
  await expect.poll(async () => Math.max(...(await positions(page)).map((card, i) => Math.abs(card.top - before[i].top)))).toBeLessThan(1);
});

for (const collapse of [false, true]) test(`wheel retargets prose to successive cards without moving their layout (folding ${collapse})`, async ({ page }) => {
  const source = '# Reading\n\nBefore ::%%limr%%{<#r}**shared reference**::%%limr%%{>#r} after.\n\n'
    + Array.from({ length: 10 }, (_, i) => `:::limr-annotation{#n${i} ranges="r" type="footnote"}\nNote ${i}.\n:::`).join('\n\n')
    + '\n\n' + 'Further reading. '.repeat(800);
  await load(page, source, collapse);
  const cards = page.locator('.limr-sidebar-card'), first = cards.first();
  const before = await positions(page), initialHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const box = (await first.boundingBox())!;
  await page.mouse.move(box.x + 50, box.y + box.height / 2);
  for (let i = 0; i < 3; i++) {
    const sampling = page.locator('.limr-sidebar').evaluate(async rail => {
      const frames: number[][] = [];
      for (let i = 0; i < 35; i++) {
        await new Promise(requestAnimationFrame);
        const top = rail.getBoundingClientRect().top;
        frames.push([...rail.querySelectorAll('.limr-sidebar-card')].map(card => card.getBoundingClientRect().top - top));
      }
      return frames;
    });
    if (i) await page.mouse.wheel(0, before[i].top - before[i - 1].top);
    await expect(cards.nth(i)).toHaveAttribute('data-active', 'true');
    await expect.poll(() => page.locator('.limr-reader-content strong').evaluate((element, index) => {
      const range = document.createRange(); range.selectNodeContents(element);
      return Math.abs(range.getBoundingClientRect().top - document.querySelectorAll('.limr-sidebar-card')[index].getBoundingClientRect().top);
    }, i)).toBeLessThan(1);
    const after = await positions(page);
    expect(Math.max(...after.map((card, j) => Math.abs(card.top - before[j].top)))).toBeLessThan(1);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(initialHeight);
    const frames = await sampling;
    expect(Math.max(...frames.flatMap(frame => frame.map((top, j) => Math.abs(top - before[j].top))))).toBeLessThan(1);
  }
});

test('moving between cards retains a marker-revealed folding window', async ({ page }) => {
  await load(page, readFileSync('playground/presets/notes.md', 'utf8'), true);
  const marker = page.locator('.limr-reader-content .limr-mark').nth(8);
  await marker.hover();
  await expect(page.locator('.limr-sidebar')).not.toHaveAttribute('data-moving');
  const id = await marker.getAttribute('data-limr-anchor');
  const card = page.locator(`.limr-sidebar-card[data-occurrence="${id}"]`);
  await card.hover();
  const before = await positions(page);
  const next = card.locator('xpath=following-sibling::*[1]');
  await expect(next).not.toHaveAttribute('inert');
  await next.hover(); await page.waitForTimeout(700);
  const after = await positions(page);
  expect(Math.max(...after.map((card, i) => Math.abs(card.top - before[i].top)))).toBeLessThan(1);
});
