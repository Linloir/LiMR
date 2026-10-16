import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const definition = (id: string, type = 'footnote', extra = '', body = `${id} body`) => `:::limr-annotation{#${id} ranges="r" type="${type}" ${extra}}\n${body}\n:::`;
async function load(page: Page, source: string, sidebarCollapse = true) {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(({ source, sidebarCollapse }) => window.limrStream({ source, streaming: false, sidebar: true, sidebarCollapse, chinese: true }), { source, sidebarCollapse });
  await page.evaluate(() => document.fonts.ready);
}
const article = (page: Page) => page.locator('.limr-reader-content > article');
async function cardFor(page: Page, index: number) {
  const id = await article(page).locator('.limr-mark[data-limr-anchor]').nth(index).getAttribute('data-limr-anchor');
  return page.locator(`.limr-sidebar-card[data-occurrence="${id}"]`);
}

test('zero-length excerpts resize to the available width without changing marker selection', async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 1000 });
  await load(page, '# Context\n\n很长的前文' + '这是角标前面的文字，'.repeat(12) + '普通脚注在这里留下一个位置[^note]。\n\n[^note]: A note', false);
  const marker = article(page).locator('.limr-mark[data-limr-anchor]');
  const card = await cardFor(page, 0), excerpt = card.locator('.limr-sidebar-excerpt');
  const wide = await excerpt.innerText();
  expect(wide).toMatch(/^….+普通脚注在这里留下一个位置…$/);
  await page.locator('.limr-reader').evaluate(element => (element as HTMLElement).style.setProperty('--limr-sidebar-width', '180px'));
  await expect.poll(async () => (await excerpt.innerText()).length).toBeLessThan(wide.length);
  expect(await excerpt.innerText()).toMatch(/^….+位置…$/);
  expect(await excerpt.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  await marker.click(); await expect(page.getByRole('toolbar')).toBeVisible();
  await expect(article(page).locator('.limr-paint-rect[data-reference]')).toHaveCount(0);
});

for (const width of [1500, 560]) for (const mode of ['absent', 'hidden', 'visible']) test(`independent markers and toolbar with ${mode} highlight at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await load(page, `# Markers\n\nBefore ::%%limr%%{<#r}shared **words**::%%limr%%{>#r} after.\n\n${definition('note')}\n\n${definition('question', 'question')}`
    + (mode === 'absent' ? '' : `\n\n${definition('paint', 'highlight', `color="#C08FA3" hidden="${mode === 'hidden'}"`, '')}`), false);
  const markers = article(page).locator('.limr-mark[data-limr-anchor]');
  await expect(markers).toHaveCount(2); await expect(article(page).locator('.limr-mark-count')).toHaveCount(0);
  const transient = article(page).locator('.limr-paint-rect[data-reference]');
  const visiblePaint = () => article(page).locator('.limr-paint-rect').evaluateAll(elements => elements.filter(element => Number(getComputedStyle(element).opacity) > .05).map(element => ({ id: (element as HTMLElement).dataset.paint, color: (element as HTMLElement).style.getPropertyValue('--limr-highlight') })));
  for (let index = 0; index < 2; index++) {
    await markers.nth(index).hover();
    if (mode === 'visible') await expect(transient).toHaveCount(0);
    else {
      await expect.poll(async () => new Set((await visiblePaint()).map(item => item.id)).size).toBe(1);
      expect((await visiblePaint())[0].color).toBe(mode === 'hidden' ? '#C08FA3' : 'var(--limr-inline-highlight, #6B9BD2)');
    }
    if (width < 1120) {
      const overlay = page.locator('.limr-overlay-positioner');
      await expect(overlay).toContainText(index ? 'question body' : 'note body');
      await expect(overlay).not.toContainText(index ? 'note body' : 'question body');
    }
    await markers.nth(index).click();
    if (width < 1120) {
      await expect(page.locator('.limr-annotation-overlay')).toHaveAttribute('data-pinned', 'true');
      await expect(page.getByRole('toolbar')).toHaveCount(0);
    } else {
      await expect(page.getByRole('toolbar')).toBeVisible();
      if (mode === 'absent') await expect(page.getByRole('toolbar')).not.toHaveAttribute('data-highlight');
      else await expect(page.getByRole('toolbar')).toHaveAttribute('data-highlight', 'paint');
    }
    await page.keyboard.press('Escape'); await page.mouse.move(5, 5);
  }
  if (mode === 'visible') {
    await article(page).locator('mark').first().click();
    await expect(page.getByRole('toolbar')).toBeVisible();
  } else await expect.poll(async () => (await visiblePaint()).length).toBe(0);
});

test('dense ranges align from markers, return after leaving, and never scroll prose or empty space', async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 1000 });
  const refs = Array.from({ length: 12 }, (_, i) => `[^a${i}]`).join('');
  const source = `# Dense\n\nParagraph A has many notes${refs}.\n\n${'A little breathing room. '.repeat(35)}\n\nParagraph B[^b].\n\n${'More reading. '.repeat(25)}\n\nParagraph C[^c].\n\n` + Array.from({ length: 12 }, (_, i) => `[^a${i}]: Note ${i}. ${'A long explanation. '.repeat(15)}`).join('\n\n') + '\n\n[^b]: B note.\n\n[^c]: C note.';
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await load(page, source);
  const rail = page.locator('.limr-sidebar'), groups = rail.locator('.limr-sidebar-cluster');
  await expect.poll(() => rail.locator('[data-folded]').count()).toBeGreaterThanOrEqual(2);
  await expect(rail.locator('.limr-sidebar-fold')).toHaveCount(0);
  const markers = article(page).locator('.limr-mark[data-limr-anchor]');
  const marker = markers.nth(10), card = await cardFor(page, 10);
  const group = card.locator('xpath=ancestor::section[contains(@class,"limr-sidebar-cluster")]'), window = group.locator('.limr-sidebar-cluster-list');
  await expect(window).toHaveCSS('overflow', 'clip');
  await expect(window).toHaveAttribute('data-overflow-bottom', '');
  await expect(rail).not.toHaveAttribute('data-moving');
  const cut = await window.evaluate(element => {
    const box = element.getBoundingClientRect(), cards = [...element.querySelectorAll('.limr-sidebar-card')].map(card => card.getBoundingClientRect());
    const partial = cards.find(card => card.top < box.bottom && card.bottom > box.bottom)!;
    return { fraction: (box.bottom - partial.top) / partial.height, fade: parseFloat(getComputedStyle(element).getPropertyValue('--limr-fade-bottom')), height: partial.height };
  });
  expect(cut.fraction).toBeGreaterThanOrEqual(.5); expect(cut.fraction).toBeLessThan(.85);
  expect(cut.fade).toBeGreaterThanOrEqual(cut.height * .5 - 1);
  const original = await group.evaluate(element => (element.querySelector('.limr-sidebar-cluster-items') as HTMLElement).style.transform);
  const before = await article(page).boundingBox(), scroll = await page.evaluate(() => ({ top: scrollY, height: document.documentElement.scrollHeight }));
  const sampling = rail.evaluate(async rail => {
    const groups = [...rail.querySelectorAll<HTMLElement>('.limr-sidebar-cluster')];
    const contents = groups.map(group => group.querySelector<HTMLElement>('.limr-sidebar-cluster-items')!);
    const cards = groups.flatMap(group => [...group.querySelectorAll('.limr-sidebar-card')]);
    const parents = cards.map(card => card.parentElement);
    const frames = [];
    for (let i = 0; i < 65; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const boxes = groups.map(group => group.getBoundingClientRect());
      frames.push({ gap: Math.min(...boxes.slice(1).map((box, index) => box.top - boxes[index].bottom)),
        blank: Math.max(...contents.map(content => content.parentElement!.getBoundingClientRect().bottom - content.getBoundingClientRect().bottom)),
        excessFade: Math.max(...contents.map(content => parseFloat(getComputedStyle(content.parentElement!).getPropertyValue('--limr-fade-bottom')) - Math.max(0, content.getBoundingClientRect().bottom - content.parentElement!.getBoundingClientRect().bottom))),
        sameNodes: cards.every((card, index) => card.isConnected && card.parentElement === parents[index]),
        offsets: contents.map(content => new DOMMatrixReadOnly(getComputedStyle(content).transform).m42),
        boxes: boxes.map((box, index) => ({ top: box.top, height: box.height, style: groups[index].style.cssText, window: (groups[index].firstElementChild as HTMLElement).style.height })) });
    }
    return frames;
  });
  await marker.hover(); await page.waitForTimeout(80);
  await markers.nth(4).hover(); await page.waitForTimeout(80);
  await marker.hover();
  const frames = await sampling;
  expect(frames.every(frame => frame.sameNodes)).toBe(true);
  expect(Math.min(...frames.map(frame => frame.gap)), JSON.stringify(frames.filter(frame => frame.gap < 13).slice(0, 3))).toBeGreaterThanOrEqual(13);
  expect(Math.max(...frames.map(frame => frame.blank))).toBeLessThan(1);
  expect(Math.max(...frames.map(frame => frame.excessFade))).toBeLessThan(1);
  expect(frames.some(frame => frame.offsets.some(offset => offset < -10))).toBe(true);
  await expect(card).not.toHaveAttribute('data-folded');
  await expect.poll(async () => Math.abs((await card.boundingBox())!.y - (await marker.boundingBox())!.y)).toBeLessThan(1);
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect(rail).not.toHaveAttribute('data-moving');
  expect(await article(page).boundingBox()).toEqual(before);
  await page.mouse.move(5, 5);
  await expect.poll(() => group.locator('.limr-sidebar-cluster-items').evaluate(element => (element as HTMLElement).style.transform)).toBe(original);
  await marker.click(); await expect(page.getByRole('toolbar')).toBeVisible();
  await expect(rail).not.toHaveAttribute('data-moving');
  const pinned = await group.locator('.limr-sidebar-cluster-items').evaluate(element => (element as HTMLElement).style.transform);
  await card.locator('.limr-sidebar-card-heading').hover(); await page.mouse.move(5, 5);
  await page.waitForTimeout(650);
  expect(await group.locator('.limr-sidebar-cluster-items').evaluate(element => (element as HTMLElement).style.transform)).toBe(pinned);
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await markers.nth(4).hover(); await page.mouse.move(5, 5);
  await expect.poll(() => group.locator('.limr-sidebar-cluster-items').evaluate(element => (element as HTMLElement).style.transform)).toBe(pinned);
  await page.mouse.click(5, 5);
  await expect.poll(() => group.locator('.limr-sidebar-cluster-items').evaluate(element => (element as HTMLElement).style.transform)).toBe(original);
  expect(await page.evaluate(() => ({ top: scrollY, height: document.documentElement.scrollHeight }))).toEqual(scroll);
  expect(await article(page).boundingBox()).toEqual(before); expect(errors).toEqual([]);
});

for (const name of ['notes', 'scikit-learn-paper']) test(`${name} preset supports folding, hover alignment and resizing`, async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 1100 });
  await load(page, readFileSync(`playground/presets/${name}.md`, 'utf8'));
  await expect.poll(() => page.locator('.limr-sidebar-cluster[data-collapsible]').count()).toBeGreaterThan(0);
  await expect(page.locator('.limr-sidebar-fold')).toHaveCount(0);
  const markers = article(page).locator('.limr-mark[data-limr-anchor]');
  for (const index of [0, Math.floor(await markers.count() / 2), await markers.count() - 1]) {
    await markers.nth(index).scrollIntoViewIfNeeded(); await markers.nth(index).hover();
    const card = await cardFor(page, index);
    await expect(card).not.toHaveAttribute('data-folded');
    await expect(card).toHaveAttribute('data-active', 'true');
  }
  await page.setViewportSize({ width: 600, height: 900 });
  await markers.last().hover(); await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
  await expect(page.locator('.limr-sidebar')).toHaveCount(0);
});

test('Playground has a global automatic sidebar folding switch across documents', async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 1100 });
  await page.goto('/#/playground');
  const toggle = page.getByRole('button', { name: '旁注折叠', exact: true }), menu = page.locator('#demo-sidebar-collapse-menu');
  await expect(toggle).toContainText('开启');
  await expect(page.locator('.limr-sidebar')).toHaveAttribute('data-collapse-overflow', 'true');
  await toggle.click(); await menu.getByRole('button', { name: '关闭', exact: true }).click(); await expect(page.locator('.limr-sidebar')).not.toHaveAttribute('data-collapse-overflow');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
  await expect(toggle).toContainText('关闭');
  await expect(page.locator('.limr-sidebar')).not.toHaveAttribute('data-collapse-overflow');
  await toggle.click(); await menu.getByRole('button', { name: '开启', exact: true }).click(); await expect(page.locator('.limr-sidebar')).toHaveAttribute('data-collapse-overflow', 'true');
});

test('wheel over a revealed card scrolls only the page without hover feedback jumps', async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 1000 });
  await load(page, readFileSync('playground/presets/scikit-learn-paper.md', 'utf8'));
  const rail = page.locator('.limr-sidebar'), group = rail.locator('.limr-sidebar-cluster[data-collapsible]').first();
  const card = group.locator('.limr-sidebar-card').last(), id = await card.getAttribute('data-occurrence');
  const marker = article(page).locator(`[data-limr-anchor="${id}"]`);
  await marker.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await marker.hover(); await expect(rail).not.toHaveAttribute('data-moving');
  await card.locator('.limr-sidebar-card-heading').hover();
  const initial = await page.evaluate(() => ({ top: scrollY, height: document.documentElement.scrollHeight }));
  const sampling = page.evaluate(async () => {
    const frames = [];
    for (let i = 0; i < 45; i++) {
      await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
      frames.push({ top: scrollY, height: document.documentElement.scrollHeight,
        translate: getComputedStyle(document.querySelector('.limr-reader-content > article')!).translate,
        scrolls: [...document.querySelectorAll('.limr-sidebar-cluster-list')].map(element => element.scrollTop) });
    }
    return frames;
  });
  await page.mouse.wheel(0, 240);
  const frames = await sampling;
  expect(frames.at(-1)!.top).toBeGreaterThan(initial.top);
  expect(frames.at(-1)!.top - initial.top).toBeLessThanOrEqual(241);
  expect(frames.every(frame => frame.height === initial.height && frame.translate === 'none' && frame.scrolls.every(top => top === 0))).toBe(true);
  expect(frames.slice(1).every((frame, index) => frame.top >= frames[index].top - 1)).toBe(true);
});
