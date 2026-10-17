import { expect, test, type Page } from '@playwright/test';

const paired = (types: string[]) => 'Before ::%%limr%%{<#r}**selected words**::%%limr%%{>#r} after.\n\n'
  + types.map((type, index) => `:::limr-annotation{#a${index} ranges="r" type="${type}"}\n${type === 'highlight' ? '' : `Note ${index}.`}\n:::`).join('\n\n');

async function stream(page: Page, source: string, editable = true, sidebarCollapse = false) {
  await page.setViewportSize({ width: 1500, height: 950 });
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(input => window.limrStream(input), { source, editable, streaming: false, sidebar: true, sidebarCollapse });
  await page.evaluate(() => document.fonts.ready);
}

async function select(page: Page, index = 0) {
  await page.locator('.limr-reader-content strong').nth(index).evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

for (const editable of [false, true]) for (const source of [
  'Before **selected words**[^note] after.\n\n[^note]: Ordinary footnote.',
  'Before ==**selected words**==[^note] after.\n\n[^note]: Ordinary footnote.',
  'Before == **selected words**=[^note] after.\n\n[^note]: Ordinary footnote.',
]) test(`legacy footnote markers have no delete action (editing ${editable}, ${source.slice(7, 35)})`, async ({ page }) => {
  await stream(page, source, editable);
  await page.locator('.limr-reader-content .limr-mark').click();
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Delete', exact: true })).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(source);
});

for (const types of [['inline-note'], ['highlight'], ['inline-note', 'highlight']]) {
  test(`read-only source ${types.join('+')} has no deletion or highlight mutation`, async ({ page }) => {
    const source = paired(types);
    await stream(page, source, false);
    if (types.includes('inline-note')) await page.locator('.limr-reader-content .limr-mark').click();
    else await page.locator('.limr-reader-content strong').click();
    const toolbar = page.getByRole('toolbar');
    await expect(toolbar).toBeVisible();
    await expect(toolbar.getByRole('button', { name: 'Delete', exact: true })).toHaveCount(0);
    await expect(toolbar.getByRole('button', { name: 'Hide highlight', exact: true })).toHaveCount(0);
    await expect(page.locator('#stream-source')).toHaveText(source);
  });
}

for (const kind of ['paired', 'inline', 'external']) test(`a standalone ${kind} highlight offers deletion without hiding`, async ({ page }) => {
  const source = kind === 'paired' ? paired(['highlight']) : kind === 'inline' ? 'Before ==**selected words**== after.' : 'Before **selected words** after.';
  await stream(page, source);
  if (kind === 'external') await page.evaluate(() => {
    const runtime = window.limrStreamRuntime!, source = runtime.document.getSnapshot().source;
    const start = source.indexOf('selected words');
    runtime.commands.addAnnotation({ id: 'external', type: 'highlight', range: { start, end: start + 14 } });
  });
  await page.locator('.limr-reader-content strong').click();
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Hide highlight', exact: true })).toHaveCount(0);
  await toolbar.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(0);
  await expect(page.locator('.limr-reader-content strong')).toHaveText('selected words');
});

test('selecting a standalone highlight excludes a previously activated note on different text', async ({ page }) => {
  await stream(page, paired(['inline-note']) + '\n\nAnother ==**standalone highlight**==.');
  await page.locator('.limr-reader-content .limr-mark').click();
  await select(page, 1);
  const toolbar = page.getByRole('toolbar');
  await expect(toolbar.getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
  await expect(toolbar.getByRole('button', { name: 'Hide highlight', exact: true })).toHaveCount(0);
  await toolbar.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('#stream-source')).toContainText('Note 0.');
  await expect(page.locator('#stream-source')).not.toContainText('==');
});

test('a shared highlight can be hidden while retaining its note and restored through its marker', async ({ page }) => {
  await stream(page, paired(['inline-note', 'highlight']));
  const marker = page.locator('.limr-reader-content .limr-mark');
  await marker.click();
  await page.getByRole('toolbar').getByRole('button', { name: 'Hide highlight', exact: true }).click();
  await expect(page.locator('#stream-source')).toContainText('hidden="true"');
  await expect(page.locator('#stream-source')).toContainText('Note 0.');
  await page.mouse.click(2, 2); await marker.click();
  await page.getByRole('toolbar').getByRole('button', { name: 'Show highlight', exact: true }).click();
  await expect(page.locator('#stream-source')).toContainText('hidden="false"');
});

test('disabling source editing removes deletion from an already open toolbar', async ({ page }) => {
  const source = paired(['inline-note', 'highlight']);
  await stream(page, source);
  await page.locator('.limr-reader-content .limr-mark').click();
  await expect(page.getByRole('toolbar').getByRole('button', { name: 'Delete', exact: true })).toBeVisible();
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true, editable: false }), source);
  await expect(page.getByRole('toolbar').getByRole('button', { name: 'Delete', exact: true })).toHaveCount(0);
  await expect(page.getByRole('toolbar').getByRole('button', { name: 'Hide highlight', exact: true })).toHaveCount(0);
  await expect(page.locator('.limr-source-annotation-body .limr-annotation-actions')).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(source);
});

test('TOC navigation uses the final prose position when leaving an activated sidebar card', async ({ page }) => {
  const source = '# Annotations\n\n' + paired(Array(6).fill('inline-note')) + '\n\n'
    + Array.from({ length: 12 }, (_, i) => `## Section ${i + 1}\n\n${'Reading paragraph. '.repeat(60)}`).join('\n\n');
  await stream(page, source);
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true, toc: true, editable: true }), source);
  const card = page.locator('.limr-sidebar-card').nth(1);
  await card.locator('.limr-sidebar-card-heading').click();
  await expect.poll(() => page.evaluate(() => window.limrStreamRuntime!.getContentOffset())).toBeGreaterThan(30);
  const link = page.locator('.limr-reader-toc').getByRole('link', { name: 'Section 5', exact: true });
  await link.click();
  const heading = page.locator('.limr-reader-content').getByRole('heading', { name: 'Section 5', exact: true });
  await expect(page.locator('.limr-reader-content > article')).toHaveCSS('translate', 'none');
  await expect.poll(() => heading.evaluate(element => element.getBoundingClientRect().top)).toBeCloseTo(24, 0);
  await expect(link).toHaveAttribute('aria-current', 'location');
});

for (const collapse of [false, true]) test(`sidebar hover and activation align the source without moving the page (collapse ${collapse})`, async ({ page }) => {
  await stream(page, '# Annotations\n\n' + paired(Array(6).fill('inline-note')) + '\n\n' + 'Further reading. '.repeat(300), true, collapse);
  const rail = page.locator('.limr-sidebar');
  const card = rail.locator('.limr-sidebar-card').nth(1);
  const referenceTop = () => page.locator('.limr-reader-content strong').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element); return range.getClientRects()[0].top;
  });
  await expect(card).toBeInViewport();
  await expect(rail).not.toHaveAttribute('data-moving');
  const original = await referenceTop();
  const geometry = () => page.evaluate(() => ({ height: document.documentElement.scrollHeight, top: scrollY }));
  const before = await geometry();
  expect((await card.boundingBox())!.y - original).toBeGreaterThan(30);
  await card.locator('.limr-sidebar-card-heading').hover();
  await expect.poll(async () => Math.abs((await card.boundingBox())!.y - await referenceTop())).toBeLessThan(1);
  expect(await geometry()).toEqual(before);
  await page.mouse.move(2, 2);
  await expect.poll(referenceTop).toBeCloseTo(original, 0);
  await card.locator('.limr-sidebar-card-heading').focus();
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await expect.poll(async () => Math.abs((await card.boundingBox())!.y - await referenceTop())).toBeLessThan(1);
  await page.locator('.limr-reader-content strong').evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await expect.poll(async () => Math.abs((await card.boundingBox())!.y - await referenceTop())).toBeLessThan(1);
  await page.keyboard.press('Escape'); await page.mouse.move(2, 2);
  await expect.poll(referenceTop).toBeCloseTo(original, 0);
  expect(await geometry()).toEqual(before);
});

for (const windowed of [false, true]) test(`TOC accepts headings slightly below its navigation line (windowed ${windowed})`, async ({ page }) => {
  await page.setViewportSize({ width: 1500, height: 950 });
  if (windowed) {
    await page.goto('/large-reader.html');
    await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 60 }, (_, i) => `## Section ${i + 1}\n\n${'Reading paragraph. '.repeat(60)}`).join('\n\n') }));
    await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  } else await page.goto('/?fixture=scroll&reader');
  await page.evaluate(() => document.fonts.ready);
  const toc = page.locator('.limr-reader-toc'), link = toc.getByRole('link', { name: 'Section 10', exact: true });
  await link.click();
  await expect(link).toHaveAttribute('aria-current', 'location');
  const heading = page.locator('.limr-reader-content').getByRole('heading', { name: 'Section 10', exact: true });
  // Leave the destination 12px below the requested inset, with ample scroll room.
  await heading.evaluate(element => {
    const root = document.querySelector<HTMLElement>('#scroll-root');
    const top = root ? root.getBoundingClientRect().top + root.clientTop : 0;
    const current = root ? root.scrollTop : scrollY;
    (root ?? window).scrollTo({ top: current + element.getBoundingClientRect().top - top - 36, behavior: 'instant' });
  });
  await expect.poll(() => heading.evaluate(element => {
    const root = document.querySelector<HTMLElement>('#scroll-root');
    return element.getBoundingClientRect().top - (root ? root.getBoundingClientRect().top + root.clientTop : 0);
  })).toBeCloseTo(36, 0);
  await expect(link).toHaveAttribute('aria-current', 'location');
  await heading.evaluate(() => {
    const root = document.querySelector<HTMLElement>('#scroll-root');
    (root ?? window).scrollBy({ top: -100, behavior: 'instant' });
  });
  await expect(toc.getByRole('link', { name: 'Section 9', exact: true })).toHaveAttribute('aria-current', 'location');
});
