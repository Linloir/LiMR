import { expect, test, type Page, type Locator } from '@playwright/test';

const definition = (id: string, range: string, type = 'footnote') => `:::limr-annotation{#${id} ranges="${range}" type="${type}"}\n${type === 'highlight' ? '' : `Note ${id}`}\n:::`;
const open = (id: string) => `::%%limr%%{<#${id}}`;
const close = (id: string) => `::%%limr%%{>#${id}}`;
const output = async (page: Page) => JSON.parse(await page.locator('#stream-selection').textContent() || 'null');
async function selectText(locator: Locator, selected: string) {
  await locator.evaluate((element, selected) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, { acceptNode: node => node.parentElement?.closest('[data-limr-ignore]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes: Text[] = []; let content = '';
    for (let node = walker.nextNode(); node; node = walker.nextNode()) { nodes.push(node as Text); content += node.textContent; }
    const start = content.indexOf(selected); if (start < 0) throw Error(`Cannot select ${selected}: ${content}`);
    const point = (offset: number) => { for (const node of nodes) { if (offset <= node.length) return { node, offset }; offset -= node.length; } throw Error('Invalid offset'); };
    const a = point(start), b = point(start + selected.length), range = document.createRange();
    range.setStart(a.node, a.offset); range.setEnd(b.node, b.offset);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range); document.dispatchEvent(new Event('selectionchange'));
  }, selected);
}

test.beforeEach(async ({ page }) => { await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream); });

for (const width of [560, 1460]) test(`paired ranges cross paragraphs and emphasis at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 950 });
  const source = `${open('a')}First **bold ${open('b')}overlap**.\n\nNext paragraph${close('a')} ends here${close('b')}.\n\n${definition('note-a', 'a')}\n\n${definition('note-b', 'b')}\n\n${definition('paint', 'b', 'highlight')}`;
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true }), source);
  const article = page.locator('.limr-reader-content > article');
  await expect(article.locator(':scope > p')).toHaveCount(2);
  await expect(article.locator('strong')).toHaveText('bold overlap');
  await expect(article).not.toContainText('%%limr');
  await expect(article.locator('.limr-mark')).toHaveCount(2);
  await expect(article.locator('.limr-paint-background').first()).toBeVisible();
  await selectText(article.locator('strong'), 'overlap');
  await expect.poll(async () => (await output(page))?.raw.sourceText).toBe('overlap');
  expect((await output(page)).quality).toBe('exact');
  await page.keyboard.press('Escape');
  await article.locator('.limr-mark').first().click();
  await expect(page.locator('.limr-sidebar-card[data-expanded], .limr-overlay-positioner')).toContainText('Note note-a');
  await article.locator('.limr-mark').nth(1).click();
  await expect(page.locator('.limr-sidebar-card[data-expanded], .limr-overlay-positioner')).toContainText('Note note-b');
});

for (const typography of ['normal', 'knuth-plass'] as const) test(`code boundaries keep source selection and markers with ${typography} rendering`, async ({ page }) => {
  const source = `Before \`pre ${open('inline')}selected${close('inline')} post\`.\n\n\`\`\`ts\nconst value = ${open('code')}readCache()${close('code')};\n\`\`\`\n\n${definition('inline-note', 'inline')}\n\n${definition('code-note', 'code')}\n\n${definition('paint', 'code', 'highlight')}`;
  await page.evaluate(({ source, typography }) => window.limrStream({ source, typography, streaming: false }), { source, typography });
  const article = page.locator('.limr-reader-content > article');
  await expect(article).not.toContainText('%%limr');
  const code = article.locator('pre code');
  await expect(code).toContainText('const value = readCache();');
  await expect(article.locator('.limr-mark')).toHaveCount(2);
  for (const [locator, text] of [[article.locator('.limr-inline-code'), 'selected'], [code, 'readCache()']] as const) {
    await selectText(locator, text);
    await expect.poll(async () => (await output(page))?.raw.sourceText).toBe(text);
    expect((await output(page)).quality).toBe('exact');
  }
  await page.keyboard.press('Escape');
  await code.locator('.limr-mark').click();
  await expect(page.locator('.limr-overlay-positioner')).toContainText('Note code-note');
});

test('examples remain literal without a real definition and zero-length pairs stay before text', async ({ page }) => {
  const syntax = `${open('example')}word${close('example')}`;
  const source = `${syntax}\n\n\`\`\`markdown\n${definition('example', 'example')}\n\`\`\`\n\n${open('point')}${close('point')}After.\n\n${definition('point-note', 'point')}`;
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const article = page.locator('.limr-reader-content > article');
  await expect(article.locator('p').first()).toHaveText(syntax);
  await expect(article.locator('.limr-mark')).toHaveCount(1);
  const point = article.locator('p').last();
  const positions = await point.evaluate(element => {
    const marker = element.querySelector('.limr-mark')!.getBoundingClientRect();
    const text = [...element.querySelectorAll('[data-limr-text]')].find(item => item.textContent?.includes('After'))!;
    return { marker: marker.x, text: text.getBoundingClientRect().x };
  });
  expect(positions.marker).toBeLessThanOrEqual(positions.text);
});

test('adding a source annotation across paragraphs preserves Markdown when deleted', async ({ page }) => {
  const original = 'Before **first phrase**.\n\nSecond *last phrase* after.';
  await page.evaluate(source => window.limrStream({ source, editable: true, streaming: false }), original);
  const article = page.locator('.limr-reader-content > article');
  await article.evaluate(element => {
    const start = element.querySelector('strong')!.firstChild!, end = element.querySelector('em')!.firstChild!;
    const range = document.createRange(); range.setStart(start, 0); range.setEnd(end, end.textContent!.length);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range); document.dispatchEvent(new Event('selectionchange'));
  });
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(page.locator('#stream-source')).toContainText('::%%limr%%{<#');
  await expect(article.locator(':scope > p')).toHaveCount(2);
  await expect(article.locator('strong')).toHaveText('first phrase');
  await expect(article.locator('em')).toHaveText('last phrase');
  await article.locator('strong').click();
  await page.getByRole('toolbar').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect.poll(async () => (await page.locator('#stream-source').textContent())?.trim()).toBe(original);
});
