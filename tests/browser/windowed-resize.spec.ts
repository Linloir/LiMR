import { expect, test } from '@playwright/test';

for (const nested of [false, true]) for (const typography of ['standard', 'knuth-plass'] as const) {
  test(`automatic width changes preserve the reading character (${nested ? 'nested' : 'page'}, ${typography})`, async ({ page }) => {
    await page.goto('/large-reader.html');
    await page.evaluate(({ nested, typography }) => {
      const root = document.getElementById('root')!; root.style.width = '1000px'; root.style.maxWidth = 'none';
      let scrollRoot: HTMLElement | undefined;
      if (nested) {
        scrollRoot = document.createElement('div'); scrollRoot.id = 'book-scroller'; scrollRoot.style.cssText = 'height:600px;overflow:auto';
        root.before(scrollRoot); scrollRoot.append(root);
      }
      const phrase = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。';
      const source = Array.from({ length: 500 }, (_, index) => `Paragraph ${index}. ${phrase.repeat(12)}\n\n`).join('');
      (window as any).reading.render({ source, scrollRoot, typography, sidebar: false, toc: false });
    }, { nested, typography });
    await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
    await page.evaluate(() => {
      const { api } = (window as any).reading, source = api.document.getSnapshot().source.indexOf('Paragraph 250.') + 250;
      api.scrollToSource({ start: source, end: source + 1 });
    });
    await page.waitForTimeout(150);
    for (const width of [650, 1100, 760]) {
      const anchor = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
      expect(anchor).not.toBeNull();
      // No restore API is called by the test: this is the automatic width path.
      await page.evaluate(width => { document.getElementById('root')!.style.width = `${width}px`; }, width);
      await page.waitForTimeout(150);
      const drift = await page.evaluate(({ source, offset }) => {
        const audit = (window as any).reading;
        return Math.abs(audit.positionRect({ source }) - audit.runtime.getViewportTop() - offset);
      }, anchor);
      expect(drift).toBeLessThan(2);
    }
  });
}

test('automatic resize preserves a character when a book crosses the physical scroll cap', async ({ page }) => {
  test.setTimeout(45_000);
  await page.goto('/large-reader.html');
  await page.evaluate(() => {
    const root = document.getElementById('root')!; root.style.width = '1200px'; root.style.maxWidth = 'none';
    (window as any).reading.render({ mib: 50, sidebar: false, toc: false });
  });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 30_000 }).toBe('ready');
  await page.evaluate(() => {
    const { api } = (window as any).reading, source = Math.floor(api.document.getSnapshot().source.length / 2);
    api.scrollToSource({ start: source, end: source + 1 });
  });
  await page.waitForTimeout(150);
  const anchor = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  expect(anchor).not.toBeNull();
  await page.evaluate(() => { document.getElementById('root')!.style.width = '460px'; });
  await page.waitForTimeout(180);
  expect(await page.locator('[data-limr-windowed]').evaluate(element => element.getBoundingClientRect().height)).toBe(8_000_000);
  expect(await page.evaluate(({ source, offset }) => Math.abs((window as any).reading.positionRect({ source }) - offset), anchor)).toBeLessThan(2);
  const narrowed = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  await page.evaluate(() => { document.getElementById('root')!.style.width = '1200px'; });
  await page.waitForTimeout(180);
  expect(await page.evaluate(({ source, offset }) => Math.abs((window as any).reading.positionRect({ source }) - offset), narrowed)).toBeLessThan(2);
});

test('a wheel gesture supersedes a pending source restoration', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 800 }, (_, index) => `Paragraph ${index}. ${'Wrapped reading text. '.repeat(30)}\n\n`).join(''), sidebar: false, toc: false }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const position = await page.evaluate(() => {
    const audit = (window as any).reading, source = audit.api.document.getSnapshot().source.indexOf('Paragraph 400.');
    audit.api.scrollToSource({ start: source, end: source + 1 });
    // Dispatch before the destination commit. The synthetic event does not
    // scroll a native scroller, so apply its intended movement explicitly.
    document.querySelector('[data-limr-windowed]')!.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: -300 }));
    window.scrollBy(0, -300);
    return scrollY;
  });
  await page.waitForTimeout(180);
  // Window estimates may be corrected, but the deferred source request must
  // not snap back to the paragraph's original requested 24px offset.
  const destination = await page.getByText(/^Paragraph 400\./).boundingBox();
  expect(position).toBeGreaterThan(0);
  expect(destination).not.toBeNull();
  expect(destination!.y).toBeGreaterThan(150);
});

test('a distant source reveal waits for lazy typography initialization', async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/knuth-plass-layout-*.js', async route => { await held; await route.continue(); });
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ typography: 'knuth-plass', source: Array.from({ length: 500 }, (_, index) => `Paragraph ${index}. ${'Wrapped reading text with varied line breaks. '.repeat(30)}\n\n`).join(''), sidebar: false, toc: false }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const anchor = await page.evaluate(() => {
    const audit = (window as any).reading, source = audit.api.document.getSnapshot().source.indexOf('Paragraph 400.') + 550;
    const position = { source, offset: 18 }; audit.api.restoreReadingPosition(position); return position;
  });
  await expect(page.getByText(/^Paragraph 400\./)).toBeAttached();
  release();
  await expect(page.locator('p[data-limr-kp]').filter({ hasText: /^Paragraph 400\./ })).toBeAttached();
  await expect.poll(() => page.evaluate(position => Math.abs((window as any).reading.positionRect(position) - position.offset), anchor)).toBeLessThan(2);
});

test('unreachable source offsets at the book edges stop refining', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 100 }, (_, index) => `Paragraph ${index}.\n\n`).join(''), sidebar: false, toc: false }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  for (const end of [false, true]) {
    await page.evaluate(end => {
      const audit = (window as any).reading;
      audit.api.restoreReadingPosition({ source: end ? audit.api.document.getSnapshot().source.length - 4 : 0, offset: end ? 24 : 300 });
    }, end);
    await page.waitForTimeout(150);
    const before = await page.evaluate(() => (window as any).reading.runtime.layout.get());
    await page.waitForTimeout(120);
    expect(await page.evaluate(() => (window as any).reading.runtime.layout.get()) - before).toBeLessThan(3);
  }
});
