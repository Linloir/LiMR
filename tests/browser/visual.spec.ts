import { expect, test, type Page } from '@playwright/test';

async function ready(page: Page) {
  await expect(page.locator('.limr-reader-content .katex')).toHaveCount(3);
  await page.evaluate(() => document.fonts.ready);
}
async function selectContents(page: Page, selector: string) {
  await page.locator(selector).first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
}

test('plugin marker slots contain oversized SVG, images, nested icons and custom markers', async ({ page }) => {
  await page.goto('/?fixture=markers');
  await expect(page.locator('.limr-mark')).toHaveCount(6);
  const sizes = await page.locator('.limr-mark').evaluateAll(elements => elements.map(element => {
    const button = element.getBoundingClientRect(), slot = element.querySelector('.limr-mark-icon')!.getBoundingClientRect();
    const glyph = element.querySelector('svg,img')?.getBoundingClientRect();
    return { width: button.width, height: button.height, centerX: (button.left + button.right - slot.left - slot.right) / 2, centerY: (button.top + button.bottom - slot.top - slot.bottom) / 2, contained: !glyph || glyph.width > 0 && glyph.height > 0 && glyph.left >= slot.left - .1 && glyph.right <= slot.right + .1 && glyph.top >= slot.top - .1 && glyph.bottom <= slot.bottom + .1 };
  }));
  for (const size of sizes) {
    expect(size.width).toBeCloseTo(18.4 * .8, 1);
    expect(size.height).toBe(size.width);
    expect(Math.abs(size.centerX)).toBeLessThan(.1);
    expect(Math.abs(size.centerY)).toBeLessThan(.1);
    expect(size.contained).toBe(true);
  }
  await page.getByRole('button', { name: 'Large SVG', exact: true }).click();
  await page.mouse.move(0, 0);
  await expect.poll(() => page.locator('.limr-mark[aria-label="Large SVG"]').evaluate(e => e.getBoundingClientRect().width)).toBeCloseTo(sizes[0].width, 1);
});

test('mixed inline selections share line geometry; markers require text on both sides', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/?fixture=visual'); await ready(page);
  await selectContents(page, '.limr-reader-content > article > p');
  await expect(page.locator('.limr-paint-selection[data-marker]')).toHaveCount(1);
  const rects = await page.locator('.limr-reader-content > article > .limr-paint-layer > .limr-paint-selection').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().toJSON()));
  expect(rects.length).toBeGreaterThan(5);
  expect(Math.max(...rects.map(rect => rect.top)) - Math.min(...rects.map(rect => rect.top))).toBeLessThan(.5);
  expect(Math.max(...rects.map(rect => rect.height)) - Math.min(...rects.map(rect => rect.height))).toBeLessThan(.5);
  const marker = page.locator('.limr-mark').first();
  const background = await marker.evaluate(e => getComputedStyle(e).backgroundColor);
  expect(background).not.toBe('rgba(0, 0, 0, 0)');
  await page.getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect(page.locator('.limr-paint-background[data-marker]:not([data-reference])')).toHaveCount(1);
  await expect(page.locator('.limr-paint-selection')).toHaveCount(0);
  await page.locator('.limr-reader-content > article > p code').evaluate(code => {
    const text = document.createTreeWalker(code, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange(); range.setStart(text, 2); range.setEnd(text, 5);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.locator('#selection-data').textContent().then(text => JSON.parse(text || '{}').raw?.sourceText)).toBe('lin');
  const partial = await page.locator('.limr-paint-selection').boundingBox(), code = await page.locator('.limr-reader-content > article > p code').boundingBox();
  expect(partial!.width).toBeLessThan(code!.width / 2);
});

test('formula selection and persistent highlight retain the formula surface and corner radius', async ({ page }) => {
  await page.goto('/?fixture=visual'); await ready(page);
  await page.locator('.limr-math-display').scrollIntoViewIfNeeded();
  await selectContents(page, '.limr-math-display');
  const paint = page.locator('.limr-reader-content > article > .limr-paint-layer > [data-atomic]');
  await expect(paint).toHaveCount(1);
  const expected = await page.locator('.limr-math-display').evaluate(e => ({ rect: e.getBoundingClientRect().toJSON(), radius: getComputedStyle(e).borderRadius }));
  await expect(paint).toHaveCSS('border-radius', expected.radius);
  let actual = (await paint.boundingBox())!;
  expect(Math.abs(actual.x - expected.rect.x) + Math.abs(actual.y - expected.rect.y)).toBeLessThan(1);
  expect(actual.width).toBeCloseTo(expected.rect.width, 1);
  expect(actual.height).toBeCloseTo(expected.rect.height, 1);
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-placement', 'bottom');
  await expect.poll(async () => (await page.getByRole('toolbar').boundingBox())!.y - expected.rect.bottom).toBeCloseTo(10, 0);
  await page.getByRole('button', { name: '添加高亮', exact: true }).click();
  const highlight = page.locator('.limr-highlight-layer > [data-atomic]:not([data-reference])');
  await expect(highlight).toHaveClass(/limr-paint-background/);
  await expect(highlight).toHaveCSS('border-radius', expected.radius);
  await expect(highlight.locator('..')).toHaveCSS('z-index', '-1');
});

test('tokenized code maps partial selection and paints code markers without line overlap', async ({ page }) => {
  await page.goto('/?fixture=visual'); await ready(page);
  await expect(page.locator('.shiki')).toBeAttached();
  await selectContents(page, '.limr-code-block pre');
  await expect(page.locator('.limr-paint-selection[data-marker]')).toHaveCount(1);
  const geometry = await page.locator('.limr-paint-selection').evaluateAll(elements => elements.map(e => e.getBoundingClientRect().toJSON()));
  const lines = [...new Set(geometry.map(rect => rect.top))].sort((a, b) => a - b);
  expect(lines.length).toBe(3);
  for (let i = 1; i < lines.length; i++) expect(lines[i] - lines[i - 1]).toBeGreaterThanOrEqual(Math.max(...geometry.filter(rect => rect.top === lines[i - 1]).map(rect => rect.height)));
  await page.locator('.limr-code-block code').evaluate(code => {
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT); let text: Node | null;
    while ((text = walker.nextNode())) if (text.textContent === 'total') {
      const range = document.createRange(); range.setStart(text, 1); range.setEnd(text, 4);
      getSelection()!.removeAllRanges(); getSelection()!.addRange(range); break;
    }
  });
  await expect.poll(() => page.locator('#selection-data').textContent().then(text => JSON.parse(text || '{}').raw?.sourceText)).toBe('ota');
  await expect(page.locator('.limr-paint-selection[data-marker]')).toHaveCount(0);
});

test('question, sidebar and copy interactions keep the refined layout', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/?fixture=visual'); await ready(page);
  await expect(page.locator('.limr-note .limr-card-label')).toHaveText('注释');
  const card = page.locator('.limr-sidebar-card').first();
  await card.click({ position: { x: 15, y: 35 } });
  await expect(card.getByRole('button')).toContainText('收起');
  await expect(card.locator('.limr-annotation-markdown')).toContainText('Third paragraph.');
  await card.getByRole('button').click();
  await expect(card.getByRole('button')).toContainText('展开');
  const question = page.locator('.limr-question'); await question.scrollIntoViewIfNeeded();
  await expect(question.locator('.limr-choice-diamond').first()).toHaveCSS('width', '14px');
  const label = question.locator('label').first(), text = label.locator('[data-limr-text]').first();
  const bounds = (await label.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width + 50, bounds.y + bounds.height / 2);
  await expect(text).toHaveCSS('background-size', '0% 1px');
  await text.hover(); await expect(text).toHaveCSS('background-size', '100% 1px');
  await label.click(); await question.getByRole('button', { name: '提交' }).click();
  await expect(question.getByRole('status')).toHaveText('回答正确');
  await expect(question.locator('.limr-disclosure').last()).toHaveAttribute('data-expanded', 'true');
  await question.getByRole('button', { name: '重试' }).click();
  await expect(question.locator('input:checked')).toHaveCount(0);
  for (const selector of ['.limr-code-copy', '.limr-math-copy']) {
    const button = page.locator(selector); await button.scrollIntoViewIfNeeded(); await button.hover();
    await expect(button).toHaveCSS('transform', 'none');
    await page.mouse.down(); await expect(button).toHaveCSS('transform', 'none'); await page.mouse.up();
    await expect(button).toHaveAttribute('data-status', 'copied');
    await expect(button).toHaveAttribute('data-status', 'idle', { timeout: 3500 });
  }
});

test('optional traditional endnote selections and highlights follow rendered reference order', async ({ page }) => {
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(() => window.limrStream({ source: 'Read B[^b] before A[^a].\n\n[^a]: First definition.\n\n[^b]: Second definition with `literal code`.', streaming: false, legacyFootnotes: true, chinese: true }));
  await expect(page.locator('.limr-footnotes > ol > li').first()).toContainText('Second definition');
  await selectContents(page, '.limr-footnotes code');
  await expect.poll(() => page.locator('#stream-selection').textContent().then(text => JSON.parse(text || '{}')?.raw?.sourceText)).toBe('literal code');
  await expect(page.locator('.limr-paint-selection')).not.toHaveCount(0);
  await page.getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect(page.locator('.limr-footnotes mark')).toHaveText('literal code');
  await expect(page.locator('.limr-paint-background')).not.toHaveCount(0);
});

test('attribute titles select exact source and retain highlights, including entities and repeated text', async ({ page }) => {
  await page.goto('/#/playground'); await page.getByRole('button', { name: '编辑', exact: true }).click();
  const source = 'Repeated title\n\n<definition title="Repeated &amp; 😀 \\* title"><content>Repeated title body.</content></definition>\n\n<question title="正确 &amp; 解释" answer="[0]"><question-sel>A</question-sel><question-sel>B</question-sel></question>\n\n:::definition{title="指令 &amp; 标题"}\n\nContent\n\n:::';
  await page.getByRole('textbox', { name: 'Markdown source' }).fill(source);
  for (const [selector, raw, text] of [
    ['.limr-definition-title', 'Repeated &amp; 😀 \\* title', 'Repeated & 😀 \\* title'],
    ['.limr-question-title', '正确 &amp; 解释', '正确 & 解释'],
    ['.limr-definition-title:has-text("指令")', '指令 &amp; 标题', '指令 & 标题'],
  ]) {
    await page.locator(selector).first().scrollIntoViewIfNeeded();
    await selectContents(page, selector);
    await expect.poll(() => page.locator('#selection-data').textContent().then(value => JSON.parse(value || '{}').raw?.sourceText)).toBe(raw);
    expect(JSON.parse(await page.locator('#selection-data').textContent() || '{}').quality).toBe('exact');
    await page.getByRole('button', { name: '添加高亮', exact: true }).click();
    await expect(page.locator(selector).first().locator('mark')).toHaveText(text);
  }
});

test('answer feedback fills correct diamonds and keeps optical baselines and compact reading subtitles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.goto('/?fixture=visual'); await ready(page);
  const question = page.locator('.limr-question'); await question.scrollIntoViewIfNeeded();
  await question.locator('label').nth(1).click();
  await question.getByRole('button', { name: '提交' }).click();
  const correct = question.locator('label[data-result="correct"]');
  const incorrect = question.locator('label[data-result="incorrect"]');
  await expect(correct.locator('.limr-choice-diamond')).toHaveAttribute('data-checked', 'true');
  await expect(incorrect.locator('.limr-choice-diamond')).toHaveAttribute('data-checked', 'true');
  await expect(correct.locator('.limr-diamond-outline')).toHaveCSS('stroke', 'rgb(100, 137, 87)');
  await expect(correct.locator('.limr-diamond-fill')).toHaveCSS('fill', 'rgb(100, 137, 87)');
  // The option glyph follows the first text baseline, rather than centering on
  // the full (tall) line box. Measure ink using the same loaded font as the DOM.
  const alignment = await correct.evaluate(label => {
    const text = label.querySelector('.limr-choice-text')!, glyph = label.querySelector('svg')!.getBoundingClientRect();
    const style = getComputedStyle(text);
    const canvas = document.createElement('canvas').getContext('2d')!;
    // OpenType feature settings make the computed font shorthand empty in
    // Chromium; measure the actual face instead of the canvas default 10px.
    canvas.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metric = canvas.measureText(text.textContent!);
    const probe = document.createElement('span'); probe.style.cssText = 'display:inline-block;width:0;height:0;'; text.append(probe);
    const baseline = probe.getBoundingClientRect().top; probe.remove();
    return { glyphTop: glyph.top + glyph.height / 12, inkTop: baseline - metric.actualBoundingBoxAscent, glyphBottom: glyph.bottom - glyph.height / 12, baseline };
  });
  expect(alignment.glyphTop).toBeGreaterThanOrEqual(alignment.inkTop - 1.5);
  expect(Math.abs(alignment.glyphBottom - alignment.baseline)).toBeLessThan(2);
  await question.getByRole('button', { name: '重试' }).click();
  await expect(question.locator('.limr-choice-diamond[data-checked]')).toHaveCount(0);
  const extra = page.locator('.limr-extra-link');
  const style = await extra.evaluate(element => ({ color: getComputedStyle(element).color, font: getComputedStyle(element).fontSize, subtitle: getComputedStyle(element.querySelector('p')!).fontSize, gap: getComputedStyle(element.querySelector('p')!).marginTop }));
  expect(style.color).toBe('rgb(61, 58, 54)');
  expect(parseFloat(style.subtitle) / parseFloat(style.font)).toBeCloseTo(.8125, 2);
  expect(parseFloat(style.gap)).toBe(2);
});

test('marker edge hover has a stationary hit area and does not oscillate', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 850 });
  await page.goto('/?fixture=visual'); await ready(page);
  const marker = page.locator('.limr-mark').first();
  await marker.evaluate(element => {
    element.dataset.enters = '0'; element.dataset.leaves = '0';
    element.addEventListener('pointerenter', () => { element.dataset.enters = String(Number(element.dataset.enters) + 1); });
    element.addEventListener('pointerleave', () => { element.dataset.leaves = String(Number(element.dataset.leaves) + 1); });
  });
  const bounds = (await marker.boundingBox())!;
  for (const point of [[Math.ceil(bounds.x) + .6, bounds.y + bounds.height / 2], [bounds.x + bounds.width / 2, Math.floor(bounds.y + bounds.height) - .6]]) {
    await page.mouse.move(0, 0); await page.mouse.move(point[0], point[1]);
    await page.waitForTimeout(650);
    await expect(marker).toHaveCSS('transform', 'none');
    const rect = (await marker.boundingBox())!;
    expect(rect).toEqual(bounds);
  }
  await expect(marker).toHaveAttribute('data-enters', '2');
  await expect(marker).toHaveAttribute('data-leaves', '1');
  await expect(page.locator('.limr-annotation-preview')).toHaveAttribute('data-state', 'open');
});
