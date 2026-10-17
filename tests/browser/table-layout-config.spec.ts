import { expect, test, type Page } from '@playwright/test';
import type { TableLayoutAlgorithm } from '../../src';

async function settled(page: Page) {
  await page.evaluate(async () => { await document.fonts.ready; for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame); });
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(() => document.fonts.ready);
});

test('native mode skips table measurement and observers while preserving rich source selection', async ({ page }) => {
  const source = `| ${'Long heading '.repeat(45)} | Reference |\n| --- | ---: |\n| **selected words** | <ref id="p">[1]</ref> |\n\n<citation id="p" title="Paper" />`;
  await page.evaluate(source => {
    const audit = (window as any).tableConfigAudit = { measures: 0, observed: 0 };
    const measure = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function (text) { audit.measures++; return measure.call(this, text); };
    const observe = ResizeObserver.prototype.observe;
    ResizeObserver.prototype.observe = function (element, options) {
      if (element.matches('.limr-table-scroll,.limr-table-marker-measure *')) audit.observed++;
      return observe.call(this, element, options);
    };
    window.limrStream({ source, streaming: false, parameters: { tableLayout: false } });
  }, source);
  const table = page.locator('[data-table-layout="native"]');
  await expect(table.locator('table')).toHaveCSS('table-layout', 'auto');
  await expect(table.locator('colgroup,.limr-table-cell-reveal,.limr-table-marker-measure')).toHaveCount(0);
  await expect(table.locator('th').first()).toHaveCSS('max-height', 'none');
  await settled(page);
  expect(await page.evaluate(() => (window as any).tableConfigAudit)).toEqual({ measures: 0, observed: 0 });
  await table.locator('strong').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe('selected words');
  await table.locator('[data-limr-anchor]').click();
  await expect(page.locator('.limr-annotation-overlay')).toContainText('Paper');
  await page.emulateMedia({ media: 'print' });
  await expect(table.locator('th').first()).toHaveCSS('max-height', 'none');
});

test('switching off removes active overflow views and switching back lays out the current width without reparsing', async ({ page }) => {
  const source = `| ${'ExtraordinaryHeader'.repeat(25)} | Value |\n| --- | --- |\n| body | 1 |`;
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await table.getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
  await page.evaluate(source => {
    (window as any).tableSnapshot = window.limrStreamRuntime!.document.getSnapshot();
    window.limrStream({ source, streaming: false, parameters: { tableLayout: false } });
  }, source);
  await expect(page.locator('[data-table-layout="native"]')).toHaveCount(1);
  await expect(page.locator('[data-type="table-cell-overflow"]')).toHaveCount(0);
  expect(await page.evaluate(() => [...window.limrStreamRuntime!.decorations.get().annotations.values()].filter(item => item.type === 'table-cell-overflow').length)).toBe(0);
  expect(await page.evaluate(() => window.limrStreamRuntime!.document.getSnapshot() === (window as any).tableSnapshot)).toBe(true);
  await page.setViewportSize({ width: 540, height: 900 });
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await expect(table.getByRole('button', { name: 'Full cell content', exact: true }).first()).toBeVisible();
  expect(await table.evaluate(host => Math.abs(host.querySelector('table')!.getBoundingClientRect().width - host.clientWidth))).toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => window.limrStreamRuntime!.document.getSnapshot() === (window as any).tableSnapshot)).toBe(true);
});

test('plugin planners receive measured cells, retain width caching and yield to host parameters', async ({ page }) => {
  const source = `| ${'Custom header '.repeat(20)} | Value |\n| --- | --- |\n| body | 1 |`;
  await page.locator('main').first().evaluate(host => { host.style.maxWidth = 'none'; host.style.width = '780px'; });
  await page.evaluate(source => {
    const audit = (window as any).tableConfigAudit = { calls: 0, widths: [] as number[], measured: false };
    const algorithm: TableLayoutAlgorithm = input => {
      audit.calls++; audit.widths.push(input.availableWidth);
      audit.measured = input.rows.length === 2 && input.rows[0][0].naturalWidth > 100 && input.options!.fontSize! > 0 && input.options!.cellPadding! > 0;
      return { widths: [160, input.availableWidth - 160], contentWidths: [160, input.availableWidth - 160], heights: input.rows.map(row => Math.max(...row.map(cell => cell.lineHeight)) * 5), clipped: input.rows.map(row => row.map(() => true)), scroll: false, width: input.availableWidth, cost: 0, evaluations: 0 };
    };
    const plugins = (window as any).tablePlugins = [{ name: 'custom-table-layout', parameters: { tableLayout: { algorithm } } }];
    window.limrStream({ source, streaming: false, plugins });
  }, source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await settled(page);
  await expect(table.locator('col').first()).toHaveCSS('width', '160px');
  expect(await page.evaluate(() => (window as any).tableConfigAudit.measured)).toBe(true);
  const height = await table.locator('th .limr-table-cell-window').first().evaluate(element => element.clientHeight / parseFloat(getComputedStyle(element.firstElementChild!).lineHeight));
  expect(height).toBeGreaterThan(4.8);
  const before = await page.evaluate(() => (window as any).tableConfigAudit.calls);
  await page.locator('main').first().evaluate(host => { host.style.width = '600px'; });
  await expect.poll(() => page.evaluate(() => (window as any).tableConfigAudit.calls)).toBe(before + 1);
  await page.locator('main').first().evaluate(host => { host.style.width = '780px'; });
  await settled(page);
  expect(await page.evaluate(() => (window as any).tableConfigAudit.calls)).toBe(before + 1);
  await page.evaluate(source => {
    const previous = (window as any).tablePlugins[0].parameters.tableLayout.algorithm as TableLayoutAlgorithm;
    const algorithm: TableLayoutAlgorithm = input => {
      const plan = previous(input), widths = [120, input.availableWidth - 120];
      return { ...plan, widths, contentWidths: widths };
    };
    window.limrStream({ source, streaming: false, plugins: (window as any).tablePlugins, parameters: { tableLayout: { algorithm } } });
  }, source);
  await expect(table.locator('col').first()).toHaveCSS('width', '120px');
  await settled(page);
  const afterReplacement = await page.evaluate(() => (window as any).tableConfigAudit.calls);
  expect(afterReplacement).toBeGreaterThan(before + 1);
  await page.evaluate(source => window.limrStream({ source, streaming: false, plugins: (window as any).tablePlugins, parameters: { tableLayout: false } }), source);
  await expect(page.locator('[data-table-layout="native"]')).toHaveCount(1);
  await page.evaluate(source => window.limrStream({ source, streaming: false, plugins: (window as any).tablePlugins, parameters: { tableLayout: {} } }), source);
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await settled(page);
  expect(await page.evaluate(() => (window as any).tableConfigAudit.calls)).toBe(afterReplacement);
  await expect(table.locator('col').first()).not.toHaveCSS('width', '160px');
});
