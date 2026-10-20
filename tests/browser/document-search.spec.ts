import { expect, test } from '@playwright/test';

test('search expands from the right without moving its contents, and reverses on close', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Search motion\n\nVisible content.', virtualization: false }));
  await page.getByRole('heading', { name: 'Search motion' }).click();
  await page.keyboard.press('Control+f');
  const panel = page.locator('.limr-document-search'), body = panel.locator('.limr-search-body');
  await expect(panel).toHaveAttribute('data-open');
  const samples = await panel.evaluate(async element => {
    const frames: { width: number; input: number; right: number; opacity: number }[] = [];
    for (let i = 0; i < 24; i++) {
      await new Promise(requestAnimationFrame);
      const box = element.getBoundingClientRect(), input = element.querySelector('input')!.getBoundingClientRect();
      frames.push({ width: box.width, input: input.x, right: box.right, opacity: Number(getComputedStyle(element.querySelector('.limr-search-body')!).opacity) });
    }
    return frames;
  });
  expect(samples.some(frame => frame.width > 0 && frame.width < samples.at(-1)!.width - 1)).toBe(true);
  expect(Math.max(...samples.map(frame => frame.input)) - Math.min(...samples.map(frame => frame.input))).toBeLessThan(1);
  expect(Math.max(...samples.map(frame => frame.right)) - Math.min(...samples.map(frame => frame.right))).toBeLessThan(1);
  await expect(body).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(panel).not.toHaveAttribute('data-open');
  await expect(panel).toHaveAttribute('inert');
  await expect(panel).toHaveCount(0);
  await page.keyboard.press('Control+f');
  await expect(panel.locator('input')).toBeFocused();
  await panel.locator('input').fill('content');
  await expect(panel.locator('.limr-search-count')).toHaveText('1/1');
  await expect(panel).not.toHaveAttribute('data-loading');
});
