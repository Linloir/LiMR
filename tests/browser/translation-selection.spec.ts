import { expect, test, type Locator, type Page } from '@playwright/test';

const hint = '翻译块不支持选区跨过原文或译文的段落边界。';
const readSelection = async (page: Page) => JSON.parse(await page.getByTestId('translation-selection').textContent() ?? 'null');
const region = (page: Page, language: string, block = 0) => page.locator('.limr-translations').nth(block).locator(`[data-language="${language}"]`);

async function point(locator: Locator, offset = 4) {
  return locator.evaluate((element, offset) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, { acceptNode: node =>
      node.parentElement?.closest('[data-limr-ignore],[inert]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let node = walker.nextNode();
    while (node && offset >= node.textContent!.length) { offset -= node.textContent!.length; node = walker.nextNode(); }
    if (!node) throw new Error('Missing selectable text');
    const range = document.createRange(); range.setStart(node, offset); range.setEnd(node, offset + 1);
    const rect = range.getBoundingClientRect();
    return { x: rect.left + .5, y: rect.top + rect.height / 2 };
  }, offset);
}
async function drag(page: Page, from: Locator, to: Locator, start = 4, end = 10) {
  const a = await point(from, start), b = await point(to, end);
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 12 }); await page.mouse.up();
  await expect(page.getByRole('toolbar')).toBeVisible();
}
async function load(page: Page, query = '') {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto(`/?fixture=translation-selection${query}`);
  await page.evaluate(() => document.fonts.ready);
}

for (const [from, to, block] of [
  ['translation', 'origin', 0], ['origin', 'translation', 0],
  ['translation', 'translation', 1], ['origin', 'origin', 1],
] as const) test(`dragging ${from} to ${to} in block ${block + 1} stops at the starting language boundary`, async ({ page }) => {
  await load(page);
  await drag(page, region(page, from).locator('p').first(), region(page, to, block).locator('p').first());
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  const captured = await readSelection(page);
  expect(captured.quality).toBe('exact');
  expect(captured.raw.sourceText).not.toMatch(/<\/?(?:translations?|origin)>/);
  expect(captured.text).not.toMatch(from === 'translation' ? /original|English/ : /中文|译文/);
  expect(await page.evaluate(() => getSelection()!.toString())).toBe(captured.text);
  await expect(page.locator('.limr-paint-selection').first()).toBeVisible();
  const paint = await page.locator('.limr-paint-selection').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
  const bounds = (await region(page, from).boundingBox())!;
  expect(paint.every(rect => rect.top >= bounds.y - 1 && rect.bottom <= bounds.y + bounds.height + 1)).toBe(true);
});

for (const backward of [false, true]) test(`outside ${backward ? 'backward' : 'forward'} drags stop before entering a translation and show a release hint`, async ({ page }) => {
  await load(page);
  const outside = page.locator('.limr-prose > p').nth(backward ? 3 : 0);
  await drag(page, outside, region(page, backward ? 'origin' : 'translation', backward ? 1 : 0).locator('p').first(), 15);
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  const captured = await readSelection(page);
  expect(captured.raw.sourceText).not.toMatch(/translations|origin>|中文/);
  expect(captured.raw.sourceText).toContain(backward ? 'After the translation' : 'before the boundary.');
  expect(captured.text).toBe(await page.evaluate(() => getSelection()!.toString()));
});

for (const backward of [false, true]) test(`dragging past the entire translation ${backward ? 'backward' : 'forward'} keeps the boundary but omits the hint`, async ({ page }) => {
  await load(page);
  const outside = page.locator('.limr-prose > p');
  await drag(page, outside.nth(backward ? 3 : 0), outside.nth(backward ? 0 : 3), 15);
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  const captured = await readSelection(page);
  expect(captured.raw.sourceText).not.toMatch(/translations|origin>|中文/);
  expect(captured.raw.sourceText).toContain(backward ? 'After the translation' : 'before the boundary.');
});

test('release position controls the hint even when the clamped native range does not change', async ({ page }) => {
  await load(page);
  const before = page.locator('.limr-prose > p').first(), after = page.locator('.limr-prose > p').last();
  const a = await point(before), inside = await point(region(page, 'translation').locator('p').first()), beyond = await point(after);
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  await page.mouse.move(inside.x, inside.y, { steps: 10 });
  await expect.poll(async () => (await readSelection(page))?.settled).toBe(false);
  const clamped = (await readSelection(page)).raw.sourceText;
  await page.mouse.move(beyond.x, beyond.y, { steps: 10 });
  await page.mouse.move(inside.x, inside.y, { steps: 10 }); await page.mouse.up();
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  expect((await readSelection(page)).raw.sourceText).toBe(clamped);
});

test('dragging back into the original region clears the hint and allows a smaller selection', async ({ page }) => {
  await load(page);
  const translated = region(page, 'translation').locator('p').first();
  const a = await point(translated, 2), b = await point(region(page, 'origin').locator('p')), c = await point(translated, 8);
  await page.mouse.move(a.x, a.y); await page.mouse.down();
  await page.mouse.move(b.x, b.y, { steps: 10 });
  await expect.poll(async () => (await readSelection(page))?.settled).toBe(false);
  await page.mouse.move(c.x, c.y, { steps: 10 }); await page.mouse.up();
  await expect(page.getByRole('toolbar')).toBeVisible();
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  expect((await readSelection(page)).text.length).toBeLessThan(10);
});

test('ordinary paragraphs and paragraphs within the same language region still select together without hints', async ({ page }) => {
  await load(page);
  await drag(page, page.locator('.limr-prose > p').nth(0), page.locator('.limr-prose > p').nth(1));
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  expect((await readSelection(page)).raw.sourceText).toContain('\n\n');
  await page.keyboard.press('Escape');
  await drag(page, region(page, 'translation').locator('p').first(), region(page, 'translation').locator('p').last());
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  expect((await readSelection(page)).raw.sourceText).toContain('\n\n');
});

test('keyboard extension obeys the same boundary and retains its hint through selectionchange', async ({ page }) => {
  await load(page, '&english');
  await region(page, 'translation').locator('p').last().evaluate(element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const text = walker.nextNode()!;
    getSelection()!.setBaseAndExtent(text, text.textContent!.length - 5, text, text.textContent!.length - 2);
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
  await page.keyboard.press('ControlOrMeta+Shift+ArrowDown');
  await page.keyboard.press('ControlOrMeta+Shift+ArrowDown');
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText('Selections cannot cross translation paragraph boundaries.');
  expect((await readSelection(page)).raw.sourceText).not.toContain('origin');
  await page.evaluate(() => document.dispatchEvent(new Event('selectionchange')));
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText('Selections cannot cross translation paragraph boundaries.');
});

test('hidden panels and Knuth–Plass text retain source-accurate constrained selections', async ({ page }) => {
  await load(page, '&kp');
  await page.getByRole('combobox', { name: 'Translation mode' }).selectOption('origin');
  await expect(region(page, 'translation').locator('xpath=../..')).toHaveAttribute('inert', '');
  await expect.poll(() => region(page, 'translation').locator('xpath=../..').evaluate(element => element.getBoundingClientRect().height)).toBeLessThan(1);
  await drag(page, region(page, 'origin').locator('p'), region(page, 'origin', 1).locator('p'));
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  expect((await readSelection(page)).raw.sourceText).toBe('t original paragraph has **mapped English words**.');
});

test('the boundary defaults on, can be disabled, and can be enabled again without changing content', async ({ page }) => {
  await load(page);
  const setting = page.getByRole('checkbox', { name: 'Translation selection boundary' });
  await expect(setting).toBeChecked();
  const before = await page.locator('.limr-prose').textContent();
  await setting.uncheck();
  await drag(page, region(page, 'translation', 1).locator('p'), region(page, 'origin', 1).locator('p'));
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  expect((await readSelection(page)).raw.sourceText).toContain('</translation>');
  expect(await page.evaluate(() => getSelection()!.toString())).toContain('Second');
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await setting.check();
  await drag(page, region(page, 'translation', 1).locator('p'), region(page, 'origin', 1).locator('p'));
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  expect((await readSelection(page)).raw.sourceText).not.toContain('</translation>');
  expect(await page.locator('.limr-prose').textContent()).toBe(before);
});

for (const existing of [true, false]) test(`${existing ? 'existing' : 'explicitly added'} cross-boundary annotations remain intact and reopen without a selection hint`, async ({ page }) => {
  await load(page, existing ? '&annotated' : '');
  if (!existing) await page.getByRole('button', { name: 'Add crossing annotation' }).click();
  const original = JSON.parse(await page.getByTestId('translation-annotations').textContent() ?? '[]');
  expect(original).toHaveLength(1);
  const origin = region(page, 'origin').locator('strong');
  await origin.click();
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-highlight', 'cross-translation');
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await drag(page, region(page, 'translation').locator('p').first(), origin);
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveText(hint);
  await page.keyboard.press('Escape'); await page.keyboard.press('Escape');
  await expect(page.getByRole('toolbar')).toHaveCount(0);
  await origin.click();
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-highlight', 'cross-translation');
  await expect(page.getByRole('toolbar').getByRole('status')).toHaveCount(0);
  expect(JSON.parse(await page.getByTestId('translation-annotations').textContent() ?? '[]')).toEqual(original);
});
