import { expect, test, type Locator, type Page } from '@playwright/test';

async function select(target: Locator, glyph = false) {
  await target.evaluate((element, glyph) => {
    const range = document.createRange();
    if (glyph) {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, { acceptNode: node => node.textContent?.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
      const node = walker.nextNode()!;
      range.setStart(node, 0); range.setEnd(node, 1);
    } else range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  }, glyph);
}

async function copy(page: Page, expected: string) {
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toBeVisible();
  await toolbar.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
}

test.beforeEach(async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

test('one selected inline formula glyph copies the full delimited source, including an existing highlight', async ({ page }) => {
  const formula = '$\\frac{a+b}{c^2}$';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), `Before ${formula} after.`);
  const math = page.locator('.limr-atomic .katex-html');
  await expect(math).toBeVisible();
  await select(math, true);
  await expect.poll(() => page.locator('#stream-selection').textContent().then(value => JSON.parse(value || 'null')?.text)).toBe(formula);
  await page.keyboard.press('ControlOrMeta+C');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(formula);
  await page.evaluate(() => navigator.clipboard.writeText(''));
  await copy(page, formula);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await math.click();
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-highlight');
  await page.evaluate(() => navigator.clipboard.writeText(''));
  await copy(page, formula);
});

for (const [name, source, target] of [
  ['display math', '$$\nx^2 + y^2 = z^2\n$$', '.katex-html'],
  ['math directive', '::math\nx^2 + y^2 = z^2\n::', '.katex-html'],
  ['Markdown image', '![Feature](/papers/feature-channel.png "Caption")', '.limr-atomic-image'],
  ['image tag', '<img src="/papers/feature-channel.png" alt="Feature" />', '.limr-atomic-image'],
  ['video title', '<video src="/clip.mp4" loading="click" title="A video" />', '.limr-video-title'],
  ['plugin attribute', '<atomic-card title="Card title">\n\n**Body** with $x$.\n\n</atomic-card>', '[data-atomic-card] header'],
  ['plugin body', '::atomic-card{title="Card title"}\n**Body** with $x$.\n::', '[data-atomic-card] strong'],
  ['nested plugin formula', '::atomic-card{title="Card title"}\n**Body** with $x$.\n::', '[data-atomic-card] .katex-html'],
] as const) test(`${name} copies the entire atomic source`, async ({ page }) => {
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const content = page.locator(target);
  await expect(content).toBeVisible();
  await select(content, !target.includes('image'));
  await expect.poll(() => page.locator('#stream-selection').textContent().then(value => JSON.parse(value || 'null')?.raw.sourceText)).toBe(source);
  await copy(page, source);
});

test('image references copy the full reference token and no unrelated definition', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: '![Feature][diagram]\n\n[diagram]: /papers/feature-channel.png "Caption"', streaming: false }));
  await select(page.locator('.limr-atomic-image'));
  await copy(page, '![Feature][diagram]');
});

test('mixed selections preserve readable surrounding text and original formula delimiters', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'Before **bold &amp; clear** $x^2$ and $y$ after.', streaming: false }));
  await expect(page.locator('.katex')).toHaveCount(2);
  await select(page.locator('.limr-prose > p'));
  await copy(page, 'Before bold & clear $x^2$ and $y$ after.');
});

test('mixed selections keep explicit line breaks around formulas', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'First $x$.  \nSecond $y$.\n\nThird **paragraph**.', streaming: false }));
  await expect(page.locator('.katex')).toHaveCount(2);
  await select(page.locator('.limr-prose').first());
  await copy(page, 'First $x$.\nSecond $y$.\n\nThird paragraph.');
});

test('Mermaid directives copy delimiters in both diagram and source mode', async ({ page }) => {
  const source = '::mermaid\nflowchart LR\nA-->B\n::';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const block = page.locator('.limr-mermaid-block');
  await expect(block).toHaveAttribute('data-mermaid-state', 'ready', { timeout: 20000 });
  await block.locator('.limr-mermaid-viewport').focus();
  await page.keyboard.press('Enter');
  await copy(page, source);
  await page.keyboard.press('Escape');
  await block.getByRole('button', { name: 'Show source', exact: true }).click();
  await select(block.locator('code'), true);
  await copy(page, source);
});
