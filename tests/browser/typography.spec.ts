import { expect, test, type Locator, type Page } from '@playwright/test';

async function loadSource(page: Page, source: string) {
  await page.goto('/');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill(source);
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
}

async function selectContents(element: Locator) {
  await element.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
}

async function paintLines(paint: Locator) {
  const rects = await paint.evaluateAll(elements => elements.map(element => {
    const { left, right, top, height } = element.getBoundingClientRect(); return { left, right, top, height };
  }));
  expect(rects.length).toBeGreaterThan(2);
  const lines: typeof rects[] = [];
  for (const rect of rects.sort((a, b) => a.top - b.top || a.left - b.left)) {
    const line = lines.find(line => Math.abs(line[0].top - rect.top) < 1);
    if (line) line.push(rect); else lines.push([rect]);
  }
  for (const line of lines) {
    expect(Math.max(...line.map(rect => rect.top)) - Math.min(...line.map(rect => rect.top))).toBeLessThan(.5);
    expect(Math.max(...line.map(rect => rect.height)) - Math.min(...line.map(rect => rect.height))).toBeLessThan(.5);
    line.sort((a, b) => a.left - b.left);
    let edge = line[0].right;
    for (const rect of line.slice(1)) {
      expect(rect.left - edge, 'inline paint must not have gaps').toBeLessThan(.6);
      edge = Math.max(edge, rect.right);
    }
  }
  const boxes = lines.map(line => ({ top: line[0].top, height: line[0].height, left: Math.min(...line.map(rect => rect.left)), right: Math.max(...line.map(rect => rect.right)) }));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].top).toBeGreaterThanOrEqual(boxes[i - 1].top + boxes[i - 1].height);
  return boxes;
}

test('proportional punctuation, italic spacing and nested list rhythm are themeable without source changes', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  const text = 'I’ll do _that_ in a hurry.';
  const tight = '- First item\n- Second item\n  - Nested A\n  - Nested B\n- Third item';
  const loose = '1. First item\n\n2. Second item\n\n   - Nested A\n\n   - Nested B\n\n3. Third item';
  await loadSource(page, `${text}\n\n${tight}\n\n${loose}`);
  const article = page.locator('.limr-reader-content > article');
  const punctuationWidth = () => article.locator('p').first().evaluate(p => {
    const text = document.createTreeWalker(p, NodeFilter.SHOW_TEXT).nextNode()!;
    const start = text.textContent!.indexOf('’'), range = document.createRange();
    range.setStart(text, start); range.setEnd(text, start + 1);
    return range.getBoundingClientRect().width;
  });
  const narrow = await punctuationWidth();
  const spacing = await article.locator('em').evaluate(em => {
    const css = getComputedStyle(em); return { left: parseFloat(css.paddingLeft), right: parseFloat(css.paddingRight), font: parseFloat(css.fontSize) };
  });
  expect(spacing.left).toBe(0);
  expect(spacing.right / spacing.font).toBeCloseTo(.08, 2);
  for (const list of await article.locator(':scope > ul,:scope > ol').all()) {
    const tops = await list.locator('li').evaluateAll(items => items.map(item => {
      const text = document.createTreeWalker(item, NodeFilter.SHOW_TEXT).nextNode()!;
      const range = document.createRange(); range.selectNodeContents(text); return range.getBoundingClientRect().top;
    }));
    expect(tops).toHaveLength(5);
    const gaps = tops.slice(1).map((top, index) => top - tops[index]);
    expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(.1);
  }
  await selectContents(article.locator('p').first());
  await expect.poll(() => page.locator('#selection-data').textContent().then(value => JSON.parse(value || '{}').raw?.sourceText)).toBe(text);
  await paintLines(page.locator('.limr-paint-selection'));
  await page.addStyleTag({ content: ".limr-prose { --limr-font-features: normal; --limr-emphasis-spacing: .2em; --limr-list-item-gap: 10px; }" });
  expect(await punctuationWidth()).toBeGreaterThan(narrow * 1.5);
  await expect(article.locator('em')).toHaveCSS('padding-right', `${spacing.font * .2}px`);
  await expect(article.locator('ul ul')).toHaveCSS('margin-top', '10px');
  await expect(article.locator('p').first()).toHaveText('I’ll do that in a hurry.');
});

for (const width of [1440, 390]) test(`justified selection and persistent highlights remain continuous at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1200 });
  const prose = ('I’ll read the _small label_ and **look carefully** at the bottle, then try `one more word` and [read on](https://example.com). 爱丽丝还想知道，这个房间里会发生什么奇妙的事情。 ').repeat(3).trim();
  await loadSource(page, `# Typography\n\n${prose}\n\n\`\`\`text\nIndented code stays left aligned.\n\`\`\``);
  const article = page.locator('.limr-reader-content > article'), paragraph = article.locator(':scope > p').first();
  const toggle = page.getByRole('button', { name: '两端对齐', exact: true });
  await expect(article).toHaveAttribute('data-limr-justify', 'false');
  await toggle.click();
  await expect(article).toHaveAttribute('data-limr-justify', 'true');
  await expect(article.locator('h1')).toHaveCSS('text-align', 'start');
  await expect(article.locator('pre')).toHaveCSS('text-align', 'start');
  await selectContents(paragraph);
  await expect(page.getByRole('toolbar')).toBeVisible();
  await expect.poll(() => page.locator('.limr-paint-selection').count()).toBeGreaterThan(5);
  await expect.poll(() => page.locator('#selection-data').textContent().then(value => JSON.parse(value || '{}').raw?.sourceText)).toBe(prose);
  const justified = await paintLines(page.locator('.limr-paint-selection'));
  const box = (await paragraph.boundingBox())!;
  expect(justified.length).toBeGreaterThan(2);
  for (const line of justified.slice(0, -1)) {
    expect(line.left).toBeCloseTo(box.x, 0);
    expect(line.right).toBeCloseTo(box.x + box.width, 0);
  }
  expect(justified.at(-1)!.left).toBeCloseTo(box.x, 0);
  expect(justified.at(-1)!.right).toBeLessThan(box.x + box.width - 5);
  await page.getByRole('toolbar').getByRole('button', { name: '添加高亮', exact: true }).click();
  await expect(page.locator('.limr-paint-selection')).toHaveCount(0);
  const highlights = page.locator('.limr-paint-background');
  await expect.poll(() => highlights.count()).toBeGreaterThan(5);
  expect(await paintLines(highlights)).toEqual(justified);
  await toggle.click();
  await expect(article).toHaveAttribute('data-limr-justify', 'false');
  await expect.poll(() => highlights.evaluateAll(items => Math.max(...items.filter(item => Math.abs(item.getBoundingClientRect().top - items[0].getBoundingClientRect().top) < 1).map(item => item.getBoundingClientRect().right)))).toBeLessThan(box.x + box.width - 1);
  await paintLines(highlights);
  await toggle.click();
  await expect.poll(async () => (await paintLines(highlights))[0].right).toBeCloseTo(box.x + box.width, 0);
});

test('a multiline annotation aligns its sidebar to the range start through hover, editing and reflow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1050 });
  const prefix = 'Some words before the selected passage. '.repeat(5);
  await loadSource(page, `# Sidebar alignment\n\n${prefix}_Begin &amp; keep reading this curious story._ ${'More words across several lines. '.repeat(6)}\n\n${'A second paragraph belongs to the same note. '.repeat(4)}`);
  const article = page.locator('.limr-reader-content > article');
  await article.evaluate(article => {
    const first = document.createTreeWalker(article.querySelector('em')!, NodeFilter.SHOW_TEXT).nextNode()!;
    const last = article.querySelectorAll(':scope > p')[1];
    const range = document.createRange(); range.selectNodeContents(last); range.setStart(first, 6);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  const card = page.locator('.limr-sidebar-card[data-type="reading-note"]');
  const input = card.getByRole('textbox', { name: '笔记内容' });
  await expect(input).toBeFocused();
  await input.fill('Anchored at the beginning.');
  const startTop = () => article.locator('em mark').first().evaluate(mark => {
    const text = document.createTreeWalker(mark, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, 1); return range.getBoundingClientRect().top;
  });
  const aligned = () => expect.poll(async () => Math.abs((await card.boundingBox())!.y - await startTop())).toBeLessThan(1);
  await aligned();
  const marker = article.locator('.limr-mark');
  expect((await marker.boundingBox())!.y - await startTop()).toBeGreaterThan(100);
  await card.getByRole('button', { name: '提交', exact: true }).click();
  await marker.hover(); await aligned();
  await card.locator('.limr-sidebar-toggle').click(); await aligned();
  await card.locator('.limr-sidebar-toggle').click(); await aligned();
  await page.getByRole('button', { name: '两端对齐', exact: true }).click();
  await marker.hover(); await aligned();
  await page.setViewportSize({ width: 1280, height: 1050 });
  await marker.hover(); await aligned();
});
