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
