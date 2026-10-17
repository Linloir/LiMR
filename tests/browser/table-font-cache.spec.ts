import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

// A fresh family and URL prevent the reader's ordinary Maple face/cache from
// satisfying this request before the test releases the real font bytes.
const family = 'LiMRDelayedTableFont';
const fontURL = '/table-font-delayed-maple.woff2';
const font = readFileSync(new URL('../../src/fonts/maple-7.9-regular-latin-59c752ba1d.woff2', import.meta.url));
const source = '| MMMMMMMM | illillill | Asset |\n| --- | --- | --- |\n| <ref id="three">[3]</ref> | Compact | Short |\n\n<citation id="three" title="Actual reference" />';

async function settled(page: Page) {
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.evaluate(async () => { for (let i = 0; i < 4; i++) await new Promise(requestAnimationFrame); });
}

async function snapshot(page: Page) {
  return page.evaluate(() => {
    const audit = (window as any).tableFontAudit, table = document.querySelector('table')!;
    const headers = [...table.tHead!.rows[0].cells].map(cell => {
      const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, window = content.parentElement!;
      const text = content.textContent!, css = getComputedStyle(content), canvas = document.createElement('canvas').getContext('2d')!;
      canvas.font = css.font;
      // Call the saved native method directly: independent oracle reads must
      // not look like a fresh measurement by the actual renderer.
      const fresh = audit.native.call(canvas, text).width;
      const observed = audit.calls.filter((call: any) => call.text === text).at(-1);
      const range = document.createRange(); range.selectNodeContents(content);
      const bounds = content.getBoundingClientRect(), walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
      let glyphs = 0, crossed = 0;
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let i = 0; i < node.textContent!.length; i++) {
          const glyph = document.createRange(); glyph.setStart(node, i); glyph.setEnd(node, i + 1);
          const rect = glyph.getBoundingClientRect();
          if (rect.width) { glyphs++; if (rect.left < bounds.left - .5 || rect.right > bounds.right + .5) crossed++; }
        }
      }
      return { text, font: css.font, fresh, observed: observed?.width, range: range.getBoundingClientRect().width, glyphs, crossed, truncated: window.hasAttribute('data-truncated') };
    });
    const marker = table.querySelector<HTMLElement>('tbody .limr-mark')!, bounds = marker.getBoundingClientRect();
    const cellWindow = marker.closest('td')!.querySelector('.limr-table-cell-window')!.getBoundingClientRect();
    return { headers, calls: audit.calls.length, events: [...audit.events], fontStatus: document.fonts.status,
      columns: [...table.querySelectorAll('col')].map(col => (col as HTMLElement).style.width),
      available: table.closest('.limr-table-layout')!.clientWidth, tableWidth: table.getBoundingClientRect().width,
      marker: { count: table.querySelectorAll('tbody .limr-mark').length, inert: !!marker.closest('[inert]'), width: bounds.width,
        inside: bounds.left >= cellWindow.left - .5 && bounds.right <= cellWindow.right + .5 && bounds.top >= cellWindow.top - .5 && bounds.bottom <= cellWindow.bottom + .5 } };
  });
}

for (const unmount of [false, true]) test(`table font widths refresh ${unmount ? 'after every table was unmounted during loading' : 'when the real delayed face finishes loading'}`, async ({ page }, testInfo) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/large-reader.html');
  await page.waitForFunction(() => (window as any).reading?.state?.status === 'ready');
  await page.evaluate(() => document.fonts.ready);
  let release!: () => void;
  const pending = new Promise<void>(resolve => { release = resolve; });
  await page.route(`**${fontURL}`, async route => { await pending; await route.fulfill({ contentType: 'font/woff2', body: font }); });
  const requested = page.waitForRequest(`**${fontURL}`);
  try {
    await page.evaluate(({ family, fontURL, source }) => {
      const audit = (window as any).tableFontAudit = { calls: [] as any[], events: [] as string[], native: CanvasRenderingContext2D.prototype.measureText };
      CanvasRenderingContext2D.prototype.measureText = function (text: string) {
        const result = audit.native.call(this, text);
        if (this.font.includes(family)) audit.calls.push({ text, font: this.font, width: result.width });
        return result;
      };
      for (const event of ['loading', 'loadingdone', 'loadingerror']) document.fonts.addEventListener(event, () => audit.events.push(event));
      document.fonts.add(new FontFace(family, `url('${fontURL}')`, { display: 'swap' }));
      const style = document.createElement('style');
      style.textContent = `.limr-reader table { font:32px/48px ${family},serif } .limr-reader th { font-weight:400 } .limr-table-cell-content { line-height:48px }`;
      document.head.append(style);
      document.getElementById('root')!.style.cssText = 'width:808px;max-width:none;box-sizing:border-box;padding:24px;margin:0';
      (window as any).reading.render({ source, toc: false, sidebar: false, virtualization: false, style: { '--limr-content-width': 'none' } });
    }, { family, fontURL, source });
    await requested; await settled(page);
    const before = await snapshot(page);
    expect(before.fontStatus).toBe('loading');
    expect(before.headers).toHaveLength(3);
    for (const header of before.headers) expect(Math.abs(header.observed! - header.fresh)).toBeLessThan(.25);
    if (unmount) {
      await page.evaluate(family => {
        void document.fonts.load(`32px ${family}`, 'MMMMMMMM illillill');
        (window as any).reading.render({ source: 'No table is mounted while its font finishes loading.', toc: false, sidebar: false, virtualization: false });
      }, family);
      await expect(page.locator('table')).toHaveCount(0);
    }
    release();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => (window as any).tableFontAudit.events.includes('loadingdone'));
    if (unmount) await page.evaluate(source => (window as any).reading.render({ source, toc: false, sidebar: false, virtualization: false, style: { '--limr-content-width': 'none' } }), source);
    await settled(page);
    const after = await snapshot(page);
    await testInfo.attach('delayed-font-widths', { body: JSON.stringify({ unmount, before, after }), contentType: 'application/json' });
    expect(after.fontStatus).toBe('loaded');
    expect(after.headers.map(header => header.font)).toEqual(before.headers.map(header => header.font));
    // Both directions must actually occur; a completed request alone is not a
    // valid font substitution fixture, nor evidence that stale widths changed.
    expect(before.headers[0].fresh - after.headers[0].fresh).toBeGreaterThan(1);
    expect(after.headers[1].fresh - before.headers[1].fresh).toBeGreaterThan(1);
    expect(after.calls).toBeGreaterThan(before.calls);
    expect(after.columns).not.toEqual(before.columns);
    expect(after.tableWidth).toBeGreaterThanOrEqual(after.available - 1);
    for (const header of after.headers) {
      expect(header.observed).toBeDefined();
      expect(Math.abs(header.observed! - header.fresh)).toBeLessThan(.25);
      expect(Math.abs(header.range - header.fresh)).toBeLessThan(.25);
      expect(header.glyphs).toBe(header.text.length);
      expect(header.crossed).toBe(0);
      expect(header.truncated).toBe(false);
    }
    expect(after.marker.count).toBeGreaterThan(0); expect(after.marker.width).toBeGreaterThan(0);
    expect(after.marker.inside).toBe(true); expect(after.marker.inert).toBe(false);
    // This is the same document/font key, so ordinary geometry changes reuse
    // the refreshed intrinsic widths instead of repeatedly measuring tokens.
    for (const width of [650, 900, 760]) {
      await page.locator('#root').evaluate((root, width) => { root.style.width = `${width + 48}px`; }, width);
      await expect.poll(() => page.locator('.limr-table-layout').evaluate(table => table.clientWidth)).toBe(width);
      await settled(page); expect((await snapshot(page)).calls).toBe(after.calls);
    }
    expect(errors).toEqual([]);
  } finally { release(); }
});
