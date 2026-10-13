import { expect, test, type Locator, type Page } from '@playwright/test';

const reader = (page: Page) => page.locator('.limr-reader').first();
const lastAnswer = (page: Page) => reader(page).getByRole('button', { name: '询问助手', exact: true }).last();
async function alignedCard(page: Page, marker: Locator) {
  const id = await marker.getAttribute('data-limr-anchor');
  const card = reader(page).locator(`[data-occurrence="${id}"]`);
  // Fixture assistants bind “重要内容”; embedded citations only have a marker.
  const ranged = await card.getAttribute('data-type') === 'assistant';
  await expect.poll(async () => {
    const top = ranged ? await reader(page).locator('.limr-reader-content strong').first().evaluate(element => {
      const range = document.createRange(); range.selectNodeContents(element); return range.getClientRects()[0].top;
    }) : (await marker.boundingBox())!.y;
    return Math.abs((await card.boundingBox())!.y - top);
  }).toBeLessThan(1);
  return card;
}
async function pageGeometry(page: Page) {
  return page.evaluate(() => ({ height: document.documentElement.scrollHeight, top: scrollY, reader: document.querySelector('.limr-reader')!.getBoundingClientRect().height }));
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/?fixture=sidebar');
  await page.evaluate(() => document.fonts.ready);
});

test('sidebar toggle underline responds only to its text or keyboard focus', async ({ page }) => {
  await lastAnswer(page).hover();
  const card = await alignedCard(page, lastAnswer(page));
  const heading = card.locator('.limr-sidebar-card-heading');
  const toggle = card.locator('.limr-sidebar-toggle');
  const underline = toggle.locator('.limr-underline');
  await card.locator('.limr-sidebar-reference').hover();
  await expect(underline).toHaveCSS('background-size', '0% 1px');
  await heading.hover({ position: { x: 8, y: 10 } });
  await expect(underline).toHaveCSS('background-size', '0% 1px');
  await toggle.hover();
  await expect(underline).toHaveCSS('background-size', '100% 1px');
  await card.locator('.limr-sidebar-reference').hover();
  await expect(underline).toHaveCSS('background-size', '0% 1px');
  await page.keyboard.press('Tab');
  await heading.focus();
  await expect(underline).toHaveCSS('background-size', '100% 1px');
});

test('dense notes stay inside a short document through hover, toggles, additions and streaming', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const before = await pageGeometry(page);
  const marker = lastAnswer(page);
  await marker.hover();
  let card = await alignedCard(page, marker);
  await expect(card).toHaveAttribute('data-active', 'true');
  const frames = await page.evaluate(async () => {
    const button = document.querySelectorAll<HTMLButtonElement>('.limr-reader-content .limr-mark')[11];
    button.click();
    const samples = [];
    for (let i = 0; i < 40; i++) {
      await new Promise(requestAnimationFrame);
      samples.push({ height: document.documentElement.scrollHeight, top: scrollY, reader: document.querySelector('.limr-reader')!.getBoundingClientRect().height });
    }
    return samples;
  });
  expect(frames.every(frame => JSON.stringify(frame) === JSON.stringify(before))).toBe(true);
  await alignedCard(page, marker);
  await page.getByRole('button', { name: 'Add annotation', exact: true }).click();
  await lastAnswer(page).click();
  card = await alignedCard(page, lastAnswer(page));
  expect(await pageGeometry(page)).toEqual(before);
  await page.getByRole('button', { name: 'Stream answer', exact: true }).click();
  await lastAnswer(page).click();
  card = await alignedCard(page, lastAnswer(page));
  const body = card.locator('.limr-sidebar-card-content');
  await expect.poll(() => body.evaluate(element => element.scrollHeight - element.clientHeight)).toBeGreaterThan(500);
  expect((await card.boundingBox())!.y + (await card.boundingBox())!.height).toBeLessThanOrEqual((await reader(page).boundingBox())!.y + before.reader + 1);
  expect(await pageGeometry(page)).toEqual(before);
  await expect(reader(page).locator('.limr-sidebar')).toHaveCSS('overflow-y', 'clip');
  await expect(body).toHaveCSS('scrollbar-width', 'none');
  // The rail itself cannot scroll, including via DOM focus/scroll requests.
  expect(await reader(page).locator('.limr-sidebar').evaluate(element => { element.scrollTop = 200; return element.scrollTop; })).toBe(0);
  await card.getByRole('button').hover();
  await page.mouse.wheel(0, 180);
  await expect.poll(() => reader(page).locator('.limr-sidebar').evaluate(element => element.scrollTop)).toBe(0);
  expect(errors).toEqual([]);
});

test('marker collapse preserves hover, and blank space clears the marker and card together', async ({ page }) => {
  const marker = lastAnswer(page);
  await marker.click();
  const card = await alignedCard(page, marker);
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await marker.click();
  await expect(marker).toHaveAttribute('aria-expanded', 'false');
  await expect(card).not.toHaveAttribute('data-expanded');
  await expect(card).toHaveAttribute('data-active', 'true');
  await expect(marker).toHaveAttribute('data-active', 'true');
  await marker.click();
  await page.mouse.click(12, 700);
  await expect(reader(page).locator('.limr-sidebar-card[data-active],.limr-mark[data-active]')).toHaveCount(0);
  await marker.click();
  await alignedCard(page, marker);
  await expect.poll(() => card.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  const blank = await reader(page).locator('.limr-sidebar').evaluate(element => {
    const bounds = element.getBoundingClientRect(), x = bounds.left + 4;
    for (let y = bounds.top + 2; y < bounds.bottom; y += 2) if (document.elementFromPoint(x, y) === element) return { x, y };
    throw new Error('Expected blank space between sidebar cards');
  });
  await page.mouse.click(blank.x, blank.y);
  await expect(reader(page).locator('.limr-sidebar-card[data-active],.limr-mark[data-active]')).toHaveCount(0);
  await marker.focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(card).not.toHaveAttribute('data-expanded');
  await expect(marker).toBeFocused();
});

test('single and grouped citations keep separate bottom spacing and assistant uses the common inset', async ({ page }) => {
  const citations = reader(page).locator('.limr-reader-content .limr-mark[aria-label="Citation"]');
  const insets: number[] = [];
  for (let i = 0; i < 2; i++) {
    await citations.nth(i).click();
    const card = await alignedCard(page, citations.nth(i));
    await expect(card.locator('.limr-annotation-entry')).toHaveCount(i + 1);
    const body = card.locator('.limr-sidebar-card-body');
    insets.push(await body.evaluate(element => parseFloat(getComputedStyle(element).paddingBottom)));
    expect(await body.evaluate(element => parseFloat(getComputedStyle(element).paddingTop))).toBeCloseTo(9.6, 1);
  }
  expect(insets[1]).toBeCloseTo(16 + 9.6 - 3, 1);
  expect(insets[1] - insets[0]).toBeCloseTo(2, 1);
  await lastAnswer(page).click();
  const answer = await alignedCard(page, lastAnswer(page));
  const insetsAnswer = await answer.locator('.limr-sidebar-card-body').evaluate(element => { const css = getComputedStyle(element); return { top: parseFloat(css.paddingTop), bottom: parseFloat(css.paddingBottom) }; });
  expect(insetsAnswer.bottom - insetsAnswer.top).toBeCloseTo(2, 1);
  await expect(answer.locator('.limr-sidebar-card-heading')).toHaveCSS('color', 'rgb(139, 92, 246)');
  await expect(answer.locator('.limr-sidebar-card-body')).toHaveCSS('border-inline-start-color', 'rgb(139, 92, 246)');
});

test('module title, accent, body, excerpt and rich inline colors remain independent in both themes', async ({ page }) => {
  const palette = page.locator('.limr-reader').last();
  for (let i = 0; i < 2; i++) {
    const marker = palette.locator('.limr-mark');
    const card = palette.locator('.limr-sidebar-card');
    await expect(card.locator('.limr-sidebar-excerpt')).toHaveCSS('color', 'rgb(79, 70, 229)');
    await expect(card.locator('.limr-sidebar-card-body')).toHaveCSS('border-inline-start-color', 'rgb(147, 51, 234)');
    await marker.click();
    await expect(marker).toHaveCSS('color', 'rgb(217, 119, 6)');
    await expect(card.locator('.limr-sidebar-card-body')).toHaveCSS('border-inline-start-color', 'rgb(37, 99, 235)');
    await expect(card.locator('.limr-sidebar-card-heading')).toHaveCSS('color', 'rgb(5, 150, 105)');
    await expect(card.locator('.limr-annotation-entry p')).toHaveCSS('color', 'rgb(190, 24, 93)');
    await expect(card.getByText('Inline color', { exact: true })).toHaveCSS('color', 'rgb(3, 105, 161)');
    await page.getByRole('button', { name: 'Theme', exact: true }).click();
  }
});

test('short readers fill available height and sidebar hover moves the document without moving its hit area', async ({ page }) => {
  const canvas = reader(page), rail = canvas.locator('.limr-sidebar');
  const initial = await pageGeometry(page);
  const bounds = (await canvas.boundingBox())!;
  expect(bounds.y + bounds.height).toBeCloseTo(976, 0);
  expect((await rail.boundingBox())!.height).toBeCloseTo(bounds.height, 0);
  const card = canvas.locator('.limr-sidebar-card').nth(2);
  await expect.poll(() => card.evaluate(element => element.getAnimations().filter(animation => animation.playState === 'running').length)).toBe(0);
  const id = await card.getAttribute('data-occurrence');
  const marker = canvas.locator(`[data-limr-anchor="${id}"]`);
  const cardTop = (await card.boundingBox())!.y, markerTop = (await marker.boundingBox())!.y;
  expect(cardTop - markerTop).toBeGreaterThan(80);
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect(card).toHaveAttribute('data-locked', 'true');
  const frames = await card.evaluate(async element => {
    const samples = [];
    for (let i = 0; i < 40; i++) {
      await new Promise(requestAnimationFrame);
      samples.push({ top: element.getBoundingClientRect().top, active: element.hasAttribute('data-active'), height: document.documentElement.scrollHeight, scroll: scrollY });
    }
    return samples;
  });
  expect(Math.max(...frames.map(frame => frame.top)) - Math.min(...frames.map(frame => frame.top))).toBeLessThan(1);
  expect(frames[0].top).toBeCloseTo(cardTop, 0);
  expect(frames.every(frame => frame.active)).toBe(true);
  expect(new Set(frames.map(frame => frame.height))).toEqual(new Set([initial.height]));
  expect(new Set(frames.map(frame => frame.scroll))).toEqual(new Set([initial.top]));
  await alignedCard(page, marker);
  await card.getByRole('button').click();
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await alignedCard(page, marker);
  expect((await card.boundingBox())!.y).toBeCloseTo(cardTop, 0);
  await card.getByRole('button').click();
  await expect(card).toHaveAttribute('data-active', 'true');
  await page.mouse.click(12, 700);
  await expect.poll(async () => (await marker.boundingBox())!.y).toBeCloseTo(markerTop, 0);
  expect(await pageGeometry(page)).toEqual(initial);
});

test('reference strips show rendered anchored text above the title in collapsed and expanded cards', async ({ page }) => {
  const card = reader(page).locator('.limr-sidebar-card').first();
  const reference = card.locator('.limr-sidebar-reference');
  await expect(reference).toHaveText('重要内容');
  await expect(reference).toHaveAttribute('title', '重要内容');
  await expect(card.locator('.limr-sidebar-card-body')).toHaveCSS('border-inline-start-color', 'rgb(139, 92, 246)');
  expect((await reference.boundingBox())!.y).toBeLessThan((await card.locator('.limr-sidebar-card-heading').boundingBox())!.y);
  await card.getByRole('button').click();
  await expect(reference).toHaveText('重要内容');
  const citation = reader(page).locator('.limr-reader-content .limr-mark[aria-label="Citation"]').first();
  await citation.click();
  const citationCard = await alignedCard(page, citation);
  await expect(citationCard.locator('.limr-sidebar-reference')).toHaveText('单条引用与多条引用。');
});

test('reference, title, preview and expanded content share an inset across themes and text directions', async ({ page }) => {
  const card = reader(page).locator('.limr-sidebar-card').first();
  for (const direction of ['ltr', 'rtl']) {
    await reader(page).evaluate((element, direction) => {
      element.setAttribute('dir', direction);
      if (direction === 'rtl') (element as HTMLElement).style.setProperty('--limr-sidebar-padding-inline', '22px');
    }, direction);
    const geometry = await card.evaluate(element => {
      const bounds = (selector: string) => element.querySelector(selector)!.getBoundingClientRect();
      const reference = bounds('.limr-sidebar-reference'), body = bounds('.limr-sidebar-card-body');
      const selectors = ['.limr-sidebar-excerpt', '.limr-sidebar-card-heading', '.limr-sidebar-preview'];
      return { gap: body.top - reference.bottom, starts: selectors.map(selector => getComputedStyle(element).direction === 'rtl' ? bounds(selector).right : bounds(selector).left) };
    });
    expect(geometry.gap).toBeCloseTo(1, 1);
    expect(Math.max(...geometry.starts) - Math.min(...geometry.starts)).toBeLessThan(.1);
    await card.getByRole('button').click();
    await expect(card.locator('.limr-sidebar-preview-panel')).toHaveAttribute('aria-hidden', 'true');
    const contentStart = await card.locator('.limr-annotation-entry p').first().evaluate(element => getComputedStyle(element).direction === 'rtl' ? element.getBoundingClientRect().right : element.getBoundingClientRect().left);
    expect(contentStart).toBeCloseTo(geometry.starts[0], 1);
    await card.getByRole('button').click();
    await expect(card.locator('.limr-sidebar-preview')).toBeVisible();
    await page.getByRole('button', { name: 'Theme', exact: true }).click();
  }
});

test('module previews support line limits, inline colors, disabling and null without empty spacing', async ({ page }) => {
  const palette = page.locator('.limr-reader').last(), card = palette.locator('.limr-sidebar-card');
  const preview = card.locator('.limr-sidebar-preview');
  await expect(preview).toContainText('Module preview');
  await expect(preview).toHaveCSS('-webkit-line-clamp', '3');
  await expect(preview).toHaveCSS('color', 'rgb(15, 118, 110)');
  await expect(preview.getByText('Inline preview', { exact: true })).toHaveCSS('color', 'rgb(180, 83, 9)');
  const full = (await card.boundingBox())!.height;
  const previewHeight = await preview.evaluate(element => ({ height: element.clientHeight, line: parseFloat(getComputedStyle(element).lineHeight) }));
  expect(previewHeight.height).toBeCloseTo(previewHeight.line * 3, 0);
  await page.getByRole('button', { name: 'Toggle preview', exact: true }).click();
  await expect(preview).toHaveCount(0);
  const disabled = (await card.boundingBox())!.height;
  expect(full - disabled).toBeGreaterThan(50);
  await page.getByRole('button', { name: 'Toggle preview', exact: true }).click();
  await expect(preview).toBeEmpty();
  expect((await card.boundingBox())!.height).toBeCloseTo(disabled, 1);
});

test('assistant questions survive answer streaming and citations provide readable summary or URL previews', async ({ page }) => {
  await page.goto('/?fixture=sidebar&previews');
  const assistant = reader(page).locator('.limr-sidebar-card').first();
  await expect(assistant.locator('.limr-sidebar-preview')).toHaveText('问题 1：请解释这段内容，并给出一个具体的例子。');
  await expect(assistant.locator('.limr-sidebar-preview')).toHaveCSS('-webkit-line-clamp', '2');
  await page.getByRole('button', { name: 'Stream answer', exact: true }).click();
  await expect(assistant.locator('.limr-sidebar-preview')).toHaveText('问题 1：请解释这段内容，并给出一个具体的例子。');
  const markers = reader(page).locator('.limr-reader-content .limr-mark[aria-label="Citation"]');
  const expected = ['Markdown 的语法与参考示例。支持 富文本 描述。', '第一条引用的描述。 · Markdown 的语法与参考示例。支持 富文本 描述。', '简短摘要 & 示例', 'https://example.com/reference', 'Title fallback'];
  for (let i = 0; i < expected.length; i++) {
    await markers.nth(i).hover();
    const card = await alignedCard(page, markers.nth(i));
    await expect(card.locator('.limr-sidebar-preview')).toHaveText(expected[i]);
    await expect(card.locator('.limr-sidebar-preview span')).toHaveAttribute('title', expected[i]);
  }
});

test('available height follows a nested scroll viewport and its resize, independently of annotation count', async ({ page }) => {
  await page.goto('/?fixture=sidebar&nested');
  const root = page.locator('#sidebar-scroll-root');
  const rail = reader(page).locator('.limr-sidebar');
  await expect.poll(() => rail.evaluate(element => element.clientHeight)).toBe(494);
  await page.getByRole('button', { name: 'Add annotation', exact: true }).click();
  await expect.poll(() => root.evaluate(element => element.scrollHeight - element.clientHeight)).toBe(0);
  await root.evaluate(element => { (element as HTMLElement).style.height = '400px'; });
  await expect.poll(() => rail.evaluate(element => element.clientHeight)).toBe(374);
  await lastAnswer(page).click();
  await alignedCard(page, lastAnswer(page));
  expect(await root.evaluate(element => element.scrollTop)).toBe(0);
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test('wide columns grow without changing container breakpoints, and body scroll keeps the active anchor aligned', async ({ page }) => {
  const widths = () => reader(page).evaluate(element => Object.fromEntries(['.limr-reader-content', '.limr-reader-toc', '.limr-sidebar'].map(selector => [selector, element.querySelector(selector)!.getBoundingClientRect().width])));
  const wide = await widths();
  expect(wide['.limr-reader-content']).toBe(900);
  expect(wide['.limr-reader-toc']).toBeGreaterThan(240);
  expect(wide['.limr-sidebar']).toBeGreaterThan(400);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const normal = await widths();
  for (const key of Object.keys(wide)) expect(wide[key]).toBeGreaterThan(normal[key]);
  await page.getByRole('button', { name: 'Toggle long document', exact: true }).click();
  const marker = reader(page).locator('.limr-reader-content .limr-mark').last();
  await marker.click();
  await alignedCard(page, marker);
  await page.mouse.move(10, 10);
  await page.mouse.wheel(0, -100);
  await alignedCard(page, marker);
  await page.setViewportSize({ width: 900, height: 850 });
  await expect(reader(page).locator('.limr-sidebar')).toHaveCount(0);
  await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
});

test('collapsing a hovered card returns later cards without moving the pointer', async ({ page }) => {
  const cards = reader(page).locator('.limr-sidebar-card');
  const card = cards.nth(1), following = cards.nth(2);
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect.poll(() => card.evaluate(element => element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running').length)).toBe(0);
  const initial = (await following.boundingBox())!.y;
  await card.locator('.limr-sidebar-card-heading').click();
  await expect.poll(async () => (await following.boundingBox())!.y).toBeGreaterThan(initial + 30);
  await card.locator('.limr-sidebar-card-heading').click();
  await expect(card).toHaveAttribute('data-active', 'true');
  await expect.poll(async () => (await following.boundingBox())!.y).toBeCloseTo(initial, 0);
});
