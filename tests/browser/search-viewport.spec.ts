import { expect, test, type Page } from '@playwright/test';

const source = '# Search position\n\n' + Array.from({ length: 400 }, (_, i) =>
  `Paragraph ${i}. Reading words keep their place. ${[20, 150, 280, 380].includes(i) ? 'needle' : ''}\n\n`).join('');

async function scrollToParagraph(page: Page, paragraph: number) {
  await page.evaluate(start => (window as any).reading.api.scrollToSource({ start, end: start + 12 }), source.indexOf(`Paragraph ${paragraph}.`));
  const text = page.locator('.limr-reader-content p').filter({ hasText: `Paragraph ${paragraph}.` });
  await expect(text).toBeInViewport();
  // Source reveal settles across virtual block measurement and motion frames.
  await expect.poll(async () => page.evaluate(async () => {
    const runtime = (window as any).reading.runtime, before = runtime.getScrollTop();
    await new Promise(resolve => setTimeout(resolve, 100));
    return Math.abs(runtime.getScrollTop() - before);
  })).toBeLessThan(1);
}

for (const virtualization of [false, true]) for (const nested of [false, true]) test(`typing preserves the reading position and navigation starts nearby (virtual=${virtualization}, nested=${nested})`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(({ source, virtualization, nested }) => {
    let scrollRoot: HTMLElement | undefined;
    if (nested) {
      scrollRoot = document.createElement('div');
      scrollRoot.style.cssText = 'height:420px;overflow:auto;margin-top:90px';
      document.body.append(scrollRoot); scrollRoot.append(document.getElementById('root')!);
    }
    (window as any).reading.render({ source, virtualization, scrollRoot });
  }, { source, virtualization, nested });
  await expect(page.getByRole('heading', { name: 'Search position', exact: true })).toBeVisible();
  await scrollToParagraph(page, 200);
  await page.evaluate(() => (window as any).reading.api.find());
  const input = page.locator('.limr-document-search input'), count = page.locator('.limr-search-count');
  const position = () => page.evaluate(() => (window as any).reading.runtime.getScrollTop());
  const initial = await position();
  for (const [query, expected] of [['needle', '?/4'], ['needle invalid', '0/0'], ['needle', '?/4'], ['', '0/0'], ['needle', '?/4']]) {
    await input.fill(query);
    await expect(count).toHaveText(expected);
    expect(Math.abs(await position() - initial)).toBeLessThan(1);
    await expect(page.locator('[data-search-current]')).toHaveCount(0);
  }
  await page.keyboard.press('Enter');
  await expect(count).toHaveText('3/4');
  await expect(page.locator('[data-search-current]')).toBeInViewport();
  await scrollToParagraph(page, 200);
  await input.fill('reset query');
  await expect(count).toHaveText('0/0');
  await input.fill('needle');
  await expect(count).toHaveText('?/4');
  await page.keyboard.press('Shift+Enter');
  await expect(count).toHaveText('2/4');
  await expect(page.locator('[data-search-current]')).toBeInViewport();
  // A new query selects a visible result without moving it to the top.
  await scrollToParagraph(page, 278);
  await input.fill('reset query');
  await expect(count).toHaveText('0/0');
  const visiblePosition = await position();
  await input.fill('needle');
  await expect(count).toHaveText('3/4');
  await expect(page.locator('[data-search-current]')).toBeInViewport();
  expect(Math.abs(await position() - visiblePosition)).toBeLessThan(1);
});
