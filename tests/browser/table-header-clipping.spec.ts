import { expect, test, type Page } from '@playwright/test';

async function render(page: Page, label: string, columns = 19, maxColumnWidth?: number) {
  await page.goto('/large-reader.html');
  await page.waitForFunction(() => (window as any).reading?.state?.status === 'ready');
  const headers = columns === 1 ? [label] : [label, 'E-Commerce', ...Array.from({ length: columns - 2 }, (_, i) => `F${i}`)];
  const source = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n| ${headers.map(() => '✓').join(' | ')} |`;
  await page.evaluate(({ source, maxColumnWidth }) => {
    document.getElementById('root')!.style.cssText = 'width:548px;max-width:none;padding:24px;box-sizing:border-box;margin:0';
    (window as any).reading.render({ source, toc: false, sidebar: false, virtualization: false, parameters: maxColumnWidth ? { tableLayout: { maxColumnWidth } } : undefined, style: { '--limr-content-width': 'none' } });
  }, { source, maxColumnWidth });
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await page.evaluate(() => document.fonts.ready);
  return table;
}
async function measured(page: Page) {
  return page.locator('th').first().evaluate(cell => {
    const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, window = cell.querySelector<HTMLElement>('.limr-table-cell-window')!, bounds = content.getBoundingClientRect(), visible = window.getBoundingClientRect();
    const lines = new Map<number, number>(); let crossed = 0;
    const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
    const segments = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (text.parentElement?.closest('[data-limr-ignore]')) continue;
      for (const { index, segment } of segments.segment(text.textContent ?? '')) {
        const range = document.createRange(); range.setStart(text, index); range.setEnd(text, index + segment.length);
        const r = range.getBoundingClientRect();
        if (!r.width || !r.height || r.bottom > visible.bottom + 1 || r.top < visible.top - 1) continue;
        if (r.left < bounds.left - 1 || r.right > bounds.right + 1) crossed++;
        else { const line = Math.round(r.top * 2) / 2; lines.set(line, (lines.get(line) ?? 0) + 1); }
      }
    }
    return { cut: window.dataset.truncated === 'true', width: content.clientWidth, track: cell.getBoundingClientRect().width, scroll: content.scrollWidth, lines: content.clientHeight / parseFloat(getComputedStyle(content).lineHeight), crossed, visibleCharacters: [...lines.values()], markers: cell.querySelectorAll('.limr-table-cell-reveal').length };
  });
}
for (const { name, label, lineCount } of [
  { name: 'W8', label: 'W'.repeat(8), lineCount: 1 },
  { name: 'W25', label: 'W'.repeat(25), lineCount: 2 },
  { name: 'W26', label: 'W'.repeat(26), lineCount: 2 },
  { name: 'W80', label: 'W'.repeat(80), lineCount: undefined },
  { name: 'mixed-width Latin', label: 'Wi'.repeat(20) + 'W', lineCount: 2 },
]) test(`header ${name} remains stable across resize and has readable content`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 900, height: 900 }); const table = await render(page, label);
  for (const width of [500, 760, 500]) {
    await page.locator('#root').evaluate((root, width) => { root.style.width = `${width + 48}px`; }, width);
    await expect.poll(() => table.evaluate(table => table.clientWidth)).toBe(width);
    await expect.poll(async () => (await measured(page)).cut).toBe(name === 'W80');
    await expect.poll(async () => (await measured(page)).crossed).toBe(0);
    const value = await measured(page);
    expect(value.markers).toBe(name === 'W80' ? 1 : 0); expect(value.lines).toBeLessThanOrEqual(3.05);
    expect(value.visibleCharacters.length).toBeGreaterThan(0);
    if (name === 'W80') { expect(value.width).toBeGreaterThan(90); expect(value.visibleCharacters[0]).toBeGreaterThanOrEqual(6); }
    else {
      expect(value.scroll).toBeLessThanOrEqual(value.width + 1);
      expect(value.visibleCharacters).toHaveLength(lineCount!);
      expect(value.visibleCharacters.reduce((sum, count) => sum + count, 0)).toBe([...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(label)].length);
      expect(value.visibleCharacters.at(-1)).toBeGreaterThanOrEqual(2);
    }
    const stable = await table.evaluate(async table => {
      const states = []; for (let i = 0; i < 8; i++) { await new Promise(requestAnimationFrame); states.push(table.querySelector('th .limr-table-cell-window')!.getAttribute('data-truncated')); } return states;
    });
    expect(new Set(stable).size).toBe(1);
    await testInfo.attach(`geometry-${width}`, { body: JSON.stringify(value), contentType: 'application/json' });
  }
  await testInfo.attach(`header-${name}`, { body: await table.screenshot(), contentType: 'image/png' });
});

test('an explicit maximum remains a hard limit for a near-fitting long header', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 }); await render(page, 'W'.repeat(25), 19, 215);
  const value = await measured(page);
  expect(value.track).toBeLessThanOrEqual(215.1);
  expect(value.visibleCharacters.length).toBeGreaterThan(0);
  expect(value.crossed).toBe(0);
});

test('a header fitting three full-width lines does not inherit a suffix that would force a fourth', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 }); const table = await render(page, 'W'.repeat(93), 1);
  await expect.poll(async () => (await measured(page)).markers).toBe(0);
  const value = await measured(page); expect(value.visibleCharacters).toHaveLength(3); expect(value.lines).toBeLessThanOrEqual(3.05); expect(value.crossed).toBe(0);
  const counterfactual = await table.locator('th').evaluate(cell => {
    const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, css = getComputedStyle(content), marker = cell.closest('.limr-table-layout')!.querySelector<HTMLElement>('.limr-table-marker-measure button')!, markerCSS = getComputedStyle(marker);
    const canvas = document.createElement('canvas').getContext('2d')!; canvas.font = css.font;
    const suffix = canvas.measureText('…').width + marker.getBoundingClientRect().width + parseFloat(markerCSS.marginLeft) + parseFloat(markerCSS.marginRight);
    const before = content.style.width; content.style.width = `${content.clientWidth - suffix}px`;
    const lines = content.scrollHeight / parseFloat(css.lineHeight); content.style.width = before; return lines;
  });
  expect(counterfactual).toBeGreaterThan(3.9);
  await expect(table.locator('th .limr-table-cell-reveal')).toHaveCount(0);
});
