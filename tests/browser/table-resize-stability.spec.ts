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

for (const sidebarCollapse of [false, true]) test(`continuous resizing preserves confirmed ${sidebarCollapse ? 'adaptive' : 'aligned'} overflow cards and scroll state`, async ({ page }, testInfo) => {
  // Its width fits, but its genuine vertical extent exceeds the header cap.
  // A width/line-count prediction alone calls this cell complete.
  const tall = String.raw`\dfrac{1}{\dfrac{1}{\dfrac{1}{\dfrac{1}{\dfrac{1}{x}}}}}`;
  await page.evaluate(({ source, sidebarCollapse }) => window.limrStream({ source, streaming: false, sidebar: true, sidebarCollapse }),
    { source: `| $${tall}$ | Value |\n| --- | --- |\n| short | 1 |`, sidebarCollapse });
  const table = page.locator('.limr-table-layout'), card = page.locator('.limr-sidebar-card[data-type="table-cell-overflow"]');
  await expect(table.locator('.katex')).toHaveCount(1); await settle(page);
  await table.getByRole('button', { name: 'Full cell content', exact: true }).click();
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await table.evaluate(host => { host.style.width = '700px'; }); await settle(page);
  const audit = await table.evaluate(async host => {
    const runtime = window.limrStreamRuntime!, original = runtime.setViewAnnotations;
    const card = document.querySelector('.limr-sidebar-card[data-type="table-cell-overflow"]')!;
    const originalContent = card.querySelector('.limr-table-full-content');
    let publications = 0, removedCards = 0, ghostFrames = 0, missingFrames = 0;
    runtime.setViewAnnotations = function (...args) { publications++; return Reflect.apply(original, this, args); };
    const observer = new MutationObserver(records => {
      for (const record of records) for (const node of record.removedNodes) {
        if (node === card || node instanceof Element && node.contains(card)) removedCards++;
      }
    });
    observer.observe(document.body, { subtree: true, childList: true });
    try {
      for (let i = 0; i < 60; i++) {
        await new Promise<void>(resolve => requestAnimationFrame(() => {
          // Read the changed container before the next cached plan commits.
          host.style.width = `${700 - Math.sin(Math.PI * i / 59) * 160}px`;
          const overflow = getComputedStyle(host).overflowX;
          if (!host.hasAttribute('data-table-scroll') && ['auto', 'scroll'].includes(overflow) && host.scrollWidth > host.clientWidth + 1) ghostFrames++;
          if (!card.isConnected || card.getAttribute('data-expanded') !== 'true') missingFrames++;
          resolve();
        }));
      }
      for (let i = 0; i < 6; i++) await new Promise(requestAnimationFrame);
      return { publications, removedCards, ghostFrames, missingFrames,
        sameCard: document.querySelector('.limr-sidebar-card[data-type="table-cell-overflow"]') === card,
        sameContent: card.querySelector('.limr-table-full-content') === originalContent };
    } finally { observer.disconnect(); runtime.setViewAnnotations = original; }
  });
  await testInfo.attach('resize-card-lifetime', { body: JSON.stringify(audit), contentType: 'application/json' });
  expect(audit).toEqual({ publications: 0, removedCards: 0, ghostFrames: 0, missingFrames: 0, sameCard: true, sameContent: true });
  for (let i = 0; i < 2; i++) {
    await card.getByRole('button', { name: 'Expand in table', exact: true }).click();
    await expect(card).toHaveCount(0);
    const collapse = table.getByRole('button', { name: 'Collapse', exact: true });
    await expect(collapse).toBeVisible(); await collapse.click();
    // No resize or source update is allowed to rescue the registration.
    await expect(card).toHaveCount(1);
    await expect(table.getByRole('button', { name: 'Full cell content', exact: true })).toBeVisible();
    await table.getByRole('button', { name: 'Full cell content', exact: true }).click();
    await expect(card).toHaveAttribute('data-expanded', 'true');
  }
});
