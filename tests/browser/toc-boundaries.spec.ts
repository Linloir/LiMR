import { expect, test, type Page } from '@playwright/test';

async function axios(page: Page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: 'Axios README', exact: false }).click();
  await page.evaluate(() => document.fonts.ready);
}

test('playground TOC stays pinned through the article end and footer without changing page height', async ({ page }) => {
  await axios(page);
  const toc = page.locator('.limr-reader-toc .limr-toc'), title = toc.locator('.limr-toc-title'), list = toc.locator('.limr-toc-scroll');
  await expect.poll(async () => (await toc.boundingBox())!.y + (await toc.boundingBox())!.height).toBeLessThanOrEqual(877);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  // Axios has one very long code section near its final headings. Halfway
  // through the article can legitimately put its TOC at the bottom; choose a
  // heading whose settled TOC position has overflow on both sides instead.
  const middle = await list.evaluate(element => {
    const target = (element.scrollHeight - element.clientHeight) / 2;
    return [...element.querySelectorAll<HTMLElement>('a[data-heading]')].map(link => ({
      id: link.dataset.heading!, top: link.getBoundingClientRect().top - element.getBoundingClientRect().top + element.scrollTop - 24,
    })).sort((a, b) => Math.abs(a.top - target) - Math.abs(b.top - target))[0];
  });
  await page.evaluate(id => scrollTo(0, document.getElementById(id)!.getBoundingClientRect().top + scrollY - 24), middle.id);
  await expect(toc.locator(`a[data-heading="${middle.id}"]`)).toHaveAttribute('aria-current', 'location');
  await expect.poll(() => list.evaluate(element => element.scrollTop)).toBeCloseTo(middle.top, 0);
  await expect.poll(async () => (await toc.boundingBox())!.y).toBeCloseTo(24, 0);
  await expect(list).toHaveAttribute('data-overflow-top', '');
  await expect(list).toHaveAttribute('data-overflow-bottom', '');
  const before = (await title.boundingBox())!;
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await expect(toc.locator('a').last()).toHaveAttribute('aria-current', 'location');
  await expect.poll(async () => (await title.boundingBox())!.y).toBeCloseTo(before.y, 0);
  await expect.poll(() => list.evaluate(element => element.scrollHeight - element.clientHeight - element.scrollTop)).toBeLessThan(2);
  await expect(list).toHaveAttribute('data-overflow-top', '');
  await expect(list).not.toHaveAttribute('data-overflow-bottom');
  await expect(title).toBeInViewport();
  await expect(toc.locator('a').last()).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
});

test('TOC scroll fades follow both edges independently while the title and page stay still', async ({ page }) => {
  await axios(page);
  const toc = page.locator('.limr-reader-toc .limr-toc'), list = toc.locator('.limr-toc-scroll'), title = toc.locator('.limr-toc-title');
  await expect(list).not.toHaveAttribute('data-overflow-top');
  await expect(list).toHaveAttribute('data-overflow-bottom', '');
  const before = (await title.boundingBox())!;
  await list.hover(); await page.mouse.wheel(0, 240);
  await expect(list).toHaveAttribute('data-overflow-top', '');
  await expect(list).toHaveAttribute('data-overflow-bottom', '');
  await expect.poll(() => list.evaluate(element => getComputedStyle(element).maskImage)).toContain('linear-gradient');
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect((await title.boundingBox())!.y).toBeCloseTo(before.y, 0);
  await expect(title).toHaveCSS('mask-image', 'none');
  await list.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect(list).not.toHaveAttribute('data-overflow-bottom');
  await list.evaluate(element => { element.scrollTop = 0; });
  await expect(list).not.toHaveAttribute('data-overflow-top');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '前赤壁赋', exact: false }).click();
  await expect(list).not.toHaveAttribute('data-overflow-top');
  await expect(list).not.toHaveAttribute('data-overflow-bottom');
  await expect(list).toHaveCSS('mask-image', 'none');
});

test('Reader pins and sizes its TOC inside a nested scroll root, including footer and resize', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?fixture=scroll&reader');
  const root = page.locator('#scroll-root'), toc = root.locator('.limr-reader-toc .limr-toc');
  await root.evaluate(element => { element.insertAdjacentHTML('beforeend', '<footer style="height:180px">Footer</footer>'); element.scrollTop = 1000; });
  const expectedTop = await root.evaluate(element => element.getBoundingClientRect().top + element.clientTop + 24);
  await expect.poll(async () => (await toc.boundingBox())!.y).toBeCloseTo(expectedTop, 0);
  const height = await root.evaluate(element => element.scrollHeight);
  await root.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect.poll(async () => (await toc.boundingBox())!.y).toBeCloseTo(expectedTop, 0);
  await expect.poll(() => toc.evaluate(element => element.getBoundingClientRect().bottom - element.closest('#scroll-root')!.getBoundingClientRect().bottom)).toBeLessThan(-23);
  await expect(toc.locator('a').last()).toBeInViewport();
  expect(await root.evaluate(element => element.scrollHeight)).toBe(height);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await root.evaluate(element => { (element as HTMLElement).style.height = '360px'; (element.querySelector('.limr-reader') as HTMLElement).style.setProperty('--limr-sticky-top', '40px'); });
  await expect.poll(async () => (await toc.boundingBox())!.y).toBeCloseTo(expectedTop + 16, 0);
  await expect.poll(() => toc.evaluate(element => element.getBoundingClientRect().bottom - element.closest('#scroll-root')!.getBoundingClientRect().bottom)).toBeLessThan(-23);
});

test('a Reader that leaves the scroll viewport hides its TOC until it returns', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/?fixture=scroll&reader');
  const root = page.locator('#scroll-root'), rail = root.locator('.limr-reader-toc');
  await root.evaluate(element => { element.insertAdjacentHTML('beforeend', '<section style="height:900px">Following content</section>'); element.scrollTop = element.scrollHeight; });
  await expect(rail).toHaveAttribute('inert', '');
  await expect(rail).toBeHidden();
  await root.evaluate(element => { element.scrollTop = 1000; });
  await expect(rail).not.toHaveAttribute('inert');
  await expect(rail.locator('.limr-toc-title')).toBeVisible();
});

test('mobile contents uses the same scroll fades inside its expanded panel', async ({ page }) => {
  await axios(page);
  await page.setViewportSize({ width: 600, height: 800 });
  const mobile = page.locator('.limr-reader-mobile-toc'), list = mobile.locator('.limr-toc-scroll');
  await mobile.getByRole('button', { name: '目录', exact: true }).click();
  await expect.poll(() => list.evaluate(element => element.clientHeight)).toBeGreaterThan(200);
  await expect(list).toHaveAttribute('data-overflow-bottom', '');
  await list.evaluate(element => { element.scrollTop = 200; });
  await expect(list).toHaveAttribute('data-overflow-top', '');
  await expect(list).toHaveAttribute('data-overflow-bottom', '');
  await expect.poll(() => list.evaluate(element => getComputedStyle(element).maskImage)).toContain('linear-gradient');
});
