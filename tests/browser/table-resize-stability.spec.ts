import { expect, test, type Page } from '@playwright/test';

const numericalTable = '| 采样数 $n$ | 近似积分 $T_n$ | 绝对误差 |\n| ---: | ---: | ---: |\n| 10 | 0.33500000 | 0.00166667 |\n| 20 | 0.33375000 | 0.00041667 |\n| 100 | 0.33335000 | 0.00001667 |\n| 200 | 0.33333750 | 0.00000417 |';

async function settle(page: Page) {
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.evaluate(async () => { await document.fonts.ready; for (let i = 0; i < 5; i++) await new Promise(requestAnimationFrame); });
}
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1700, height: 1100 });
  await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream);
});

test('right-aligned short math does not turn italic ink into a cell preview', async ({ page }) => {
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true }), numericalTable);
  const table = page.locator('.limr-table-layout');
  await expect(table.locator('.katex')).toHaveCount(2); await settle(page);
  for (const width of [700, 600, 500, 400, 600, 700]) {
    await table.evaluate((host, width) => { host.style.width = `${width}px`; }, width); await settle(page);
    await expect(table.locator('[data-truncated],.limr-table-cell-reveal')).toHaveCount(0);
    await expect(page.locator('[data-type="table-cell-overflow"]')).toHaveCount(0);
    const math = await table.locator('th').nth(1).evaluate(cell => {
      const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, formula = content.querySelector('[data-limr-atomic]')!;
      return { right: formula.getBoundingClientRect().right, limit: content.getBoundingClientRect().right, text: cell.textContent };
    });
    expect(math.right).toBeLessThanOrEqual(math.limit + .1);
    expect(math.text).toContain('近似积分');
  }
});
