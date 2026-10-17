import { expect, test } from '@playwright/test';

const source = `# Numbered references

98. First reference with a deliberately long title that wraps within the reading column.
99. Second reference.
100. Third reference.
101. Fourth reference.

## High starting numbers

9998. High starting number.
9999. Another entry.
10000. Crossing a digit boundary.

## Nested references

1. Parent list.

   998. Nested reference with a long title that also wraps.
   999. Nested reference.
   1000. Nested reference.
2. Next parent.

## Large counters

999999999. Maximum Markdown start.
100000000. Following number uses the native list counter.

## Mixed tasks

98. [ ] Task with a counter.
99. Ordinary entry in the same list.
100. Last ordinary entry.
`;

for (const width of [1600, 390]) test(`ordered markers stay inside the reading column at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/#/playground');
  await page.locator('input[type=file]').setInputFiles({ name: 'references.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  const article = page.locator('.limr-reader-content > article');
  await expect(article.locator('ol')).toHaveCount(6);
  await page.evaluate(() => document.fonts.ready);
  for (const direction of ['ltr', 'rtl']) {
    const measurements = await article.evaluate((article, direction) => {
      // Larger reader fonts expose the fixed-rem gutter regression as well.
      (article as HTMLElement).style.fontSize = '26px';
      article.setAttribute('dir', direction);
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d')!;
      return [...article.querySelectorAll('ol')].flatMap(list => [...list.children].map((item, index) => {
        if (item.classList.contains('limr-task-item')) return null;
        const marker = getComputedStyle(item, '::marker'), rect = item.getBoundingClientRect(), parent = list.getBoundingClientRect();
        context.font = `${marker.fontWeight} ${marker.fontSize} ${marker.fontFamily}`;
        const markerWidth = context.measureText(`${list.start + index}. `).width;
        const gutter = direction === 'rtl' ? parent.right - rect.right : rect.left - parent.left;
        return { number: list.start + index, gutter, markerWidth };
      })).filter(value => value !== null);
    }, direction);
    for (const item of measurements) expect(item.gutter, `marker ${item.number} (${direction})`).toBeGreaterThanOrEqual(item.markerWidth);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
