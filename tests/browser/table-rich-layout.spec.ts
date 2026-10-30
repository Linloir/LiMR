import { expect, test, type Page } from '@playwright/test';
import type { TableLayoutAlgorithm } from '../../src/core/table-layout';

async function settled(page: Page) {
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.evaluate(async () => { await document.fonts.ready; for (let i = 0; i < 5; i++) await new Promise(requestAnimationFrame); });
}
async function resize(page: Page, width: number) {
  await page.locator('.limr-reader').evaluate((reader, width) => {
    const host = reader.parentElement!;
    host.style.maxWidth = 'none'; host.style.width = `${width + 48}px`; host.style.marginInline = '0';
    (reader as HTMLElement).style.setProperty('--limr-content-width', 'none');
  }, width);
  await settled(page);
}
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 1000 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
});

test('short tall math and inline annotations stay complete regardless of source length', async ({ page }) => {
  const math = String.raw`\underbrace{\frac{a+b}{c+d}}_{\text{description}}`;
  const source = `| Formula | Notes |\n| --- | --- |\n| $${math}$ | compact^[${'A long **inline annotation**. '.repeat(80)}] |\n| $\\frac{x}{y}$ | <ref id="r">[4]</ref> |\n\n<citation id="r" title="Reference" />`;
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table.locator('.katex')).toHaveCount(2);
  for (const width of [360, 720, 400]) {
    await resize(page, width);
    await expect(table.locator('[data-truncated]')).toHaveCount(0);
    for (const marker of await table.locator('tbody .limr-mark').all()) {
      expect(await marker.evaluate(marker => {
        const box = marker.getBoundingClientRect(), window = marker.closest('td')!.querySelector('.limr-table-cell-window')!.getBoundingClientRect();
        return !marker.closest('[inert]') && box.left >= window.left - 1 && box.right <= window.right + 1;
      })).toBe(true);
    }
  }
  await table.getByRole('button', { name: 'Footnotes', exact: true }).click();
  await expect(page.locator('.limr-annotation-overlay')).toContainText('A long inline annotation.');
});

test('math measurement preserves rendered operator boundaries and intrinsic widths across wrapping', async ({ page }) => {
  const formula = Array.from({ length: 24 }, (_, i) => `a_{${i}}`).join(' + ');
  await page.evaluate(source => {
    const algorithm: TableLayoutAlgorithm = input => {
      (window as any).richTableMetrics = input.rows;
      const widths = input.rows[0].map(() => input.availableWidth / input.rows[0].length);
      return { widths, contentWidths: widths, heights: input.rows.map(() => 400), clipped: input.rows.map(row => row.map(() => false)), width: input.availableWidth, scroll: false, cost: 0, evaluations: 0 };
    };
    window.limrStream({ source, streaming: false, parameters: { tableLayout: { algorithm } } });
  }, `| Expression | Note |\n| --- | --- |\n| $${formula}$ | short |`);
  await expect(page.locator('tbody .katex')).toHaveCount(1);
  await resize(page, 700);
  const before = await page.evaluate(() => {
    const bases = [...document.querySelectorAll<HTMLElement>('tbody .katex-base')];
    return { metrics: (window as any).richTableMetrics[1][0], intrinsic: bases.reduce((sum, base) => sum + Math.max(base.getBoundingClientRect().width, base.scrollWidth), 0), count: bases.length };
  });
  expect(before.count).toBe(24);
  expect(before.metrics.tokens).toHaveLength(before.count);
  expect(before.metrics.naturalWidth).toBeCloseTo(before.intrinsic, 1);
  expect(before.metrics.minWidth).toBe(0);
  for (const width of [320, 600, 700]) {
    await resize(page, width);
    expect(await page.evaluate(() => (window as any).richTableMetrics[1][0])).toEqual(before.metrics);
    await expect(page.locator('tbody [data-truncated]')).toHaveCount(0);
  }
});

for (const typography of ['standard', 'justify', 'knuth-plass'] as const) test(`very long indivisible math stays accessible in a capped table with ${typography}`, async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const formula = String.raw`\underbrace{${'abcdefgh'.repeat(40)}}_{\text{long formula}}`;
  const source = `| Formula |\n| --- |\n| $${formula}$ |`;
  await page.evaluate(({ source, typography }) => window.limrStream({ source, typography, streaming: false, parameters: { tableLayout: { maxColumnWidth: 180 } } }), { source, typography });
  const table = page.locator('.limr-table-layout'), scroll = table.locator('[data-limr-math-scroll]');
  await expect(scroll).toHaveCount(1);
  for (const width of [300, 760, 340]) {
    await resize(page, width);
    await expect(table.locator('[data-truncated]')).toHaveCount(0);
    const geometry = await scroll.evaluate(element => {
      element.scrollLeft = element.scrollWidth;
      const content = element.closest('.limr-table-cell-content')!;
      return { travel: element.scrollLeft, inside: element.getBoundingClientRect().right <= content.getBoundingClientRect().right + 1,
        overflow: content.scrollWidth - content.clientWidth, width: element.getBoundingClientRect().width };
    });
    expect(geometry.travel).toBeGreaterThan(1500); expect(geometry.inside).toBe(true);
    expect(geometry.overflow).toBeLessThanOrEqual(1); expect(geometry.width).toBeLessThan(180);
    expect(await table.evaluate(host => host.scrollWidth - host.clientWidth)).toBe(0);
  }
  await table.locator('tbody [data-limr-atomic]').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range); document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(`$${formula}$`);
  await page.keyboard.press('ControlOrMeta+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`$${formula}$`);
});
