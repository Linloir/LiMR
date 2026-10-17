import { test, expect } from '@playwright/test';

for (const scenario of ['resize', 'hidden', 'custom'] as const) test(`loading shell preserves the first reader layout after ${scenario}`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/large-reader.html');
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/worker*', async route => { await gate; await route.continue(); });
  try {
    await page.evaluate(scenario => {
      const root = document.getElementById('root')!;
      if (scenario === 'hidden') root.style.display = 'none';
      const style = document.createElement('style');
      style.textContent = '.loading-width-test{width:calc(100% - 80px);max-width:1080px}'; document.head.append(style);
      (window as any).reading.render({ source: '# The first title remains visible\n\n' + 'A complete paragraph in the reading window.\n\n'.repeat(100),
        className: scenario === 'custom' ? 'loading-width-test' : undefined,
        style: scenario === 'custom' ? { width: '75%', maxWidth: '1020px' } : undefined });
      (window as any).loadingLayoutFrames = [];
      const sample = () => {
        const reader = document.querySelector('.limr-reader:not([aria-hidden])'), heading = reader?.querySelector('h1');
        if (heading?.textContent === 'The first title remains visible') {
          const box = heading.getBoundingClientRect();
          (window as any).loadingLayoutFrames.push({ width: (reader as HTMLElement).clientWidth, sidebar: reader!.hasAttribute('data-sidebar'),
            toc: reader!.hasAttribute('data-toc'), scroll: scrollY, titleTop: box.top, titleBottom: box.bottom });
        }
        if ((window as any).loadingLayoutFrames.length < 5) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    }, scenario);
    await expect(page.locator('.limr-async-reader > .limr-reader[aria-hidden]')).toHaveCount(1);
    if (scenario === 'resize') await page.setViewportSize({ width: 980, height: 1000 });
    if (scenario === 'hidden') await page.evaluate(() => { document.getElementById('root')!.style.display = ''; });
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    const shellWidth = await page.locator('.limr-async-reader > .limr-reader[aria-hidden]').evaluate(element => element.clientWidth);
    expect(shellWidth).toBeGreaterThan(0);
    release();
    await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
    await expect.poll(() => page.evaluate(() => (window as any).loadingLayoutFrames.length)).toBe(5);
    const frames = await page.evaluate(() => (window as any).loadingLayoutFrames as { width: number; sidebar: boolean; toc: boolean; scroll: number; titleTop: number; titleBottom: number }[]);
    for (const frame of frames) {
      expect(frame.width).toBe(shellWidth); expect(frame.sidebar).toBe(shellWidth >= 1120); expect(frame.toc).toBe(shellWidth >= 800);
      expect(frame.scroll).toBe(0); expect(frame.titleTop).toBeGreaterThanOrEqual(0); expect(frame.titleBottom).toBeLessThan(1000);
    }
    await expect(page.locator('.limr-reader[aria-hidden]')).toHaveCount(0);
    expect(errors).toEqual([]);
  } finally { release(); }
});
