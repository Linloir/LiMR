import { expect, test } from '@playwright/test';

for (const nested of [false, true]) test(`source navigation at a book end settles with following content (${nested ? 'nested' : 'page'})`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(nested => {
    const root = document.getElementById('root')!;
    let scrollRoot: HTMLDivElement | undefined;
    if (nested) {
      scrollRoot = document.createElement('div'); scrollRoot.id = 'book-scroller'; scrollRoot.style.cssText = 'height:600px;overflow:auto';
      root.before(scrollRoot); scrollRoot.append(root);
    }
    const footer = document.createElement('footer'); footer.style.height = '350px';
    footer.innerHTML = '<button id="following-control">Following reader control</button>'; root.after(footer);
    (window as any).reading.render({ source: Array.from({ length: 200 }, (_, index) => `Paragraph ${index}.\n\n`).join('') + 'BOOK-END.', scrollRoot, sidebar: false, toc: false });
  }, nested);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => {
    const { api } = (window as any).reading, start = api.document.getSnapshot().source.indexOf('BOOK-END.');
    api.scrollToSource({ start, end: start + 1 });
  });
  await expect(page.getByText('BOOK-END.', { exact: true })).toBeInViewport();
  await expect.poll(() => page.evaluate(async nested => {
    const samples: number[] = [];
    for (let i = 0; i < 8; i++) {
      await new Promise(requestAnimationFrame);
      samples.push(nested ? document.getElementById('book-scroller')!.scrollTop : scrollY);
    }
    return Math.max(...samples) - Math.min(...samples);
  }, nested)).toBeLessThan(2);
  await page.locator('#following-control').click();
});

for (const nested of [false, true]) test(`a single native end seek survives final-window measurement (${nested ? 'nested' : 'page'})`, async ({ page }) => {
  await page.addInitScript(() => { (window as any).bottomErrors = []; window.addEventListener('error', event => (window as any).bottomErrors.push(event.message)); });
  await page.goto('/large-reader.html');
  await page.evaluate(nested => {
    const style = document.createElement('style'); style.id = 'tail-heights';
    style.textContent = '.limr-reader p { min-height: 120px; }'; document.head.append(style);
    let scrollRoot: HTMLElement | undefined;
    if (nested) {
      scrollRoot = document.createElement('div'); scrollRoot.id = 'book-scroller'; scrollRoot.style.cssText = 'height:600px;overflow:auto';
      const root = document.getElementById('root')!; root.before(scrollRoot); scrollRoot.append(root);
    }
    (window as any).reading.render({ source: Array.from({ length: 800 }, (_, index) => `Paragraph ${index}.\n\n`).join('') + 'COMPLETE-BOOK-END.', scrollRoot, sidebar: false, toc: false });
  }, nested);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(nested => {
    const scroller = nested ? document.getElementById('book-scroller')! : document.scrollingElement!;
    // Exactly one native seek. Repeated test scrolling would conceal a missed
    // end intent when measuring the destination increases the estimated height.
    scroller.scrollTop = scroller.scrollHeight - (nested ? scroller.clientHeight : innerHeight);
  }, nested);
  await expect(page.getByText('COMPLETE-BOOK-END.', { exact: true })).toBeInViewport();
  const remaining = () => page.evaluate(nested => {
    const scroller = nested ? document.getElementById('book-scroller')! : document.scrollingElement!;
    return scroller.scrollHeight - (nested ? scroller.clientHeight : innerHeight) - scroller.scrollTop;
  }, nested);
  await expect.poll(remaining).toBeLessThan(2);
  // Decoded content or a changed reading width may alter the final window
  // after the native thumb has already reached the end.
  await page.evaluate(() => { document.getElementById('tail-heights')!.textContent = '.limr-reader p { min-height: 170px; }'; });
  await page.waitForTimeout(100);
  await expect.poll(remaining).toBeLessThan(2);
  await expect(page.getByText('COMPLETE-BOOK-END.', { exact: true })).toBeInViewport();
  await page.evaluate(() => { document.getElementById('tail-heights')!.textContent = '.limr-reader p { min-height: 100px; }'; });
  await page.waitForTimeout(100);
  await expect.poll(remaining).toBeLessThan(2);
  expect(await page.evaluate(() => (window as any).bottomErrors)).toEqual([]);
});

test('a newer upward scroll and explicit source reveal take priority over end correction', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => {
    const style = document.createElement('style'); style.textContent = '.limr-reader p { min-height: 120px; }'; document.head.append(style);
    (window as any).reading.render({ source: Array.from({ length: 800 }, (_, index) => `Paragraph ${index}.\n\n`).join('') + 'COMPLETE-BOOK-END.', sidebar: false, toc: false });
  });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise(requestAnimationFrame);
    window.scrollBy(0, -400);
  });
  await page.waitForTimeout(120);
  const position = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  expect(position).not.toBeNull();
  expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight - scrollY)).toBeGreaterThan(200);
  await page.waitForTimeout(120);
  expect(await page.evaluate(source => (window as any).reading.api.getReadingPosition().source, position.source)).toBe(position.source);
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    const audit = (window as any).reading, source = audit.api.document.getSnapshot().source.indexOf('Paragraph 400.');
    audit.api.scrollToSource({ start: source, end: source + 1 });
  });
  await expect(page.getByText('Paragraph 400.', { exact: true })).toBeInViewport();
  await page.waitForTimeout(120);
  await expect(page.getByText('Paragraph 400.', { exact: true })).toBeInViewport();
});
