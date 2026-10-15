import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream); });

test('hint and answer animate on their very first expansion, including after a completed close', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ streaming: false, source: '<question><question-content>A question.</question-content><question-hint>A useful hint.<br />More detail.</question-hint><question-answer>A full answer with explanation.</question-answer></question>' }));
  await page.evaluate(() => document.fonts.ready);
  for (const index of [0, 1, 0]) {
    const disclosure = page.locator('.limr-disclosure').nth(index);
    const result = await disclosure.evaluate(async element => {
      const panel = element.querySelector('.limr-collapse')!;
      const initial = panel.getBoundingClientRect().height;
      (element.querySelector('summary') as HTMLElement).click();
      await new Promise(resolve => setTimeout(resolve, 60));
      const animated = panel.getAnimations().some(animation => animation instanceof CSSTransition && animation.transitionProperty === 'grid-template-rows');
      const middle = panel.getBoundingClientRect().height;
      await new Promise(resolve => setTimeout(resolve, 450));
      return { initial, middle, final: panel.getBoundingClientRect().height, animated };
    });
    expect(result.initial).toBe(0); expect(result.animated).toBe(true);
    expect(result.middle).toBeGreaterThan(0); expect(result.middle).toBeLessThan(result.final);
    await disclosure.locator('summary').click();
    await expect(disclosure.locator('.limr-collapse')).toHaveAttribute('inert', '');
    await page.waitForTimeout(500);
  }
});

test('embedded blue highlights hover and open a copy-only toolbar with an unwrapped hint', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.evaluate(() => window.limrStream({ source: 'Before ==blue **bold** &amp; 😀== after.', streaming: false, chinese: true }));
  const mark = page.locator('article > p mark').first(), paint = page.locator('.limr-paint-background').first();
  await expect(paint).toBeVisible();
  await mark.hover(); await expect(paint).toHaveAttribute('data-hovered');
  await mark.click();
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toHaveAttribute('data-readonly', 'true');
  await expect(toolbar.getByRole('button')).toHaveCount(1);
  const hint = toolbar.locator('.limr-toolbar-readonly-hint');
  await expect(hint).toHaveText('Markdown 内嵌高亮，不支持编辑');
  await expect(hint).toHaveCSS('white-space', 'nowrap'); await expect(hint).toHaveCSS('text-align', 'start');
  await toolbar.getByRole('button', { name: '复制', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('blue bold & 😀');
  const before = await paint.evaluate(element => getComputedStyle(element).backgroundColor);
  await page.addStyleTag({ content: '.limr-reader { --limr-inline-highlight: #E57373; }' });
  await expect.poll(() => paint.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(before);
  await page.setViewportSize({ width: 390, height: 800 });
  await mark.click();
  const box = (await toolbar.boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0); expect(box.x + box.width).toBeLessThanOrEqual(390);
});

for (const width of [1460, 560]) test(`named and inline footnotes use comment markers and ${width > 1120 ? 'sidebar' : 'overlay'} cards`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 });
  await page.evaluate(() => window.limrStream({ source: 'Before ==named **highlight**==[^n] and ==inline==^[An **inline** footnote]. Plain[^n].\n\n[^n]: Named **footnote**.\n\n    Second paragraph.', streaming: false, sidebar: true, chinese: true }));
  const article = page.locator('.limr-reader-content > article');
  await expect(article.locator('sup,.limr-footnotes')).toHaveCount(0);
  const markers = article.getByRole('button', { name: '脚注', exact: true });
  await expect(markers).toHaveCount(3); await expect(markers.first().locator('svg')).toHaveCount(1);
  await markers.first().click();
  const card = width > 1120 ? page.locator('.limr-sidebar-card[data-type="footnote"]').first() : page.locator('.limr-overlay-positioner');
  await expect(card).toContainText('脚注'); await expect(card).toContainText('Second paragraph.');
  if (width > 1120) await expect(card.locator('.limr-footnote-title')).toHaveText('n');
  else await expect(card.locator('.limr-overlay-header')).toContainText('脚注 · n');
  await expect(card.locator('strong').first()).toHaveText('footnote');
  if (width > 1120) await expect(card.locator('.limr-sidebar-excerpt')).toHaveText('named highlight');
  await markers.nth(1).click();
  const inline = width > 1120 ? page.locator('.limr-sidebar-card[data-type="footnote"]').nth(1) : page.locator('.limr-overlay-positioner');
  await expect(inline).toContainText('An inline footnote');
  if (width > 1120) await expect(inline.locator('.limr-sidebar-excerpt')).toHaveText('inline');
});

test('standalone footnotes and self-closing refs keep zero-length hover ranges', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'Before[^named] with a citation<ref id="c" /> after.\n\n[^named]: Named body\n\n<citation id="c" title="Source" />', streaming: false }));
  const article = page.locator('.limr-reader-content > article');
  const markers = article.locator('.limr-mark');
  await expect(markers).toHaveCount(2);
  for (const marker of await markers.all()) {
    await marker.hover(); await marker.click();
    await expect(article.locator('.limr-paint-rect[data-reference]')).toHaveCount(0);
  }
});

test('reserved ranges render independent note/question markers with one winning highlight and no fallback body', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'Before ==named **range**==[^%%limr:r1%%] after.\n\n[^%%limr:r1%%]: Ordinary fallback body\n\n:::limr-annotation{#h1 ranges="r1" type="highlight" color="#E5C07B"}\n:::\n\n:::limr-annotation{#h2 ranges="r1" type="highlight" color="#81B29A"}\n:::\n\n:::limr-annotation{#n1 ranges="r1" type="footnote"}\nStored **note**.\n:::\n\n:::limr-annotation{#q1 ranges="r1" type="question"}\nWhy cache?\n:::', streaming: false, sidebar: true }));
  const article = page.locator('.limr-reader-content > article');
  await expect(article).not.toContainText('%%limr');
  await expect(article).not.toContainText('Ordinary fallback body');
  await expect(article.locator('.limr-mark')).toHaveCount(2);
  await expect(article.locator('.limr-mark-count')).toHaveCount(0);
  await expect(article.locator('[data-paint="h1"]')).toHaveCount(0);
  await expect(article.locator('[data-paint="h2"]').first()).toHaveCSS('--limr-highlight', '#81B29A');
  await article.locator('.limr-mark').first().click();
  const card = page.locator('.limr-sidebar-card,.limr-overlay-positioner').filter({ hasText: 'Stored note.' });
  await expect(card).not.toContainText('Why cache?');
  await article.locator('.limr-mark').nth(1).click();
  await expect(page.locator('.limr-sidebar-card[data-expanded],.limr-overlay-positioner')).toContainText('Why cache?');
  await article.locator('.limr-mark').first().click();
  await expect(card.locator('strong')).toHaveText('note');
});

test('streaming highlight text selection survives closing delimiters and a following footnote', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: '==selected words', effect: false }));
  const mark = page.locator('article > p mark');
  await mark.evaluate(element => {
    const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, 8);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  for (const source of ['==selected words=', '==selected words==', '==selected words==^[', '==selected words==^[a note]']) {
    await page.evaluate(source => window.limrStream({ source, effect: false }), source);
    expect(await page.evaluate(() => getSelection()?.toString())).toBe('selected');
  }
  await page.evaluate(() => window.limrStream({ source: '==selected words==^[a note]', effect: false, streaming: false }));
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('selected');
  await expect(page.locator('article > p')).not.toContainText('==');
});

test('shortening selected streaming text keeps native endpoints valid', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.evaluate(() => window.limrStream({ source: '==selected words', effect: false }));
  await page.locator('article > p mark').evaluate(element => {
    const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT).nextNode()!;
    getSelection()!.setBaseAndExtent(text, 0, text, 12);
  });
  await page.evaluate(() => window.limrStream({ source: '==sel', effect: false }));
  await expect(page.locator('article > p mark')).toHaveText('sel');
  expect(await page.evaluate(() => {
    const selection = getSelection()!;
    return [selection.anchorNode, selection.focusNode].every(node => node?.isConnected)
      && selection.anchorOffset <= (selection.anchorNode!.textContent?.length ?? 0)
      && selection.focusOffset <= (selection.focusNode!.textContent?.length ?? 0);
  })).toBe(true);
  expect(errors).toEqual([]);
});

test('KP keeps authored highlights and footnote anchors through resize and mode changes', async ({ page }) => {
  const source = ('Some ==standalone== and ==highlighted **words**==^[A footnote] with rich typography. ').repeat(12);
  await page.evaluate(source => window.limrStream({ source, typography: 'knuth-plass', streaming: false }), source);
  const paragraph = page.locator('.limr-reader-content > article > p');
  await expect(paragraph).toHaveAttribute('data-limr-kp');
  await expect.poll(() => paragraph.locator('.limr-paint-background:not([data-reference])').count()).toBeGreaterThan(10);
  for (const width of [620, 700, 690]) {
    await page.setViewportSize({ width, height: 950 });
    await expect.poll(() => paragraph.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(5);
  }
  await paragraph.locator('mark').first().click();
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-readonly', 'true');
  await page.evaluate(source => window.limrStream({ source, typography: 'standard', streaming: false }), source);
  await expect(paragraph).not.toHaveAttribute('data-limr-kp');
  await expect(paragraph.getByRole('button', { name: 'Footnotes', exact: true })).toHaveCount(12);
});
