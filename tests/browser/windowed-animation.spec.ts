import { expect, test } from '@playwright/test';

for (const typography of ['standard', 'knuth-plass'] as const) test(`${typography} window animations keep adjacent blocks together without ResizeObserver feedback`, async ({ page }, testInfo) => {
  await page.addInitScript(() => {
    (window as any).windowErrors = [];
    // Observe the real browser event; never preventDefault or suppress errors.
    window.addEventListener('error', event => (window as any).windowErrors.push(event.message));
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/large-reader.html');
  await page.evaluate(typography => {
    const source = '# Animated window\n\n<translations>\n<origin>\n\n' + 'Original words with a different paragraph height. '.repeat(28)
      + '\n\n</origin>\n<translation>\n\n' + '翻译正文保留不同的行数与实际高度。'.repeat(15)
      + '\n\n</translation>\n</translations>\n\n' + Array.from({ length: 350 }, (_, index) => `Following paragraph ${index}.\n\n`).join('');
    (window as any).reading.render({ source, typography, sidebar: true });
  }, typography);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  const audit = await page.evaluate(async () => {
    const samples: { phase: string; gap: number; cycle: number }[] = [];
    const reversals: { before: string; after: string }[] = [];
    const geometry = (phase: string, cycle: number) => {
      const slots = [...document.querySelectorAll<HTMLElement>('[data-window-slot]:not([data-window-parked])')].map(node => ({ index: Number(node.dataset.windowSlot), rect: node.getBoundingClientRect() }));
      for (let index = 1; index < slots.length; index++) {
        const before = slots[index - 1], after = slots[index];
        if (after.index === before.index + 1 && before.rect.bottom > 0 && after.rect.top < innerHeight) samples.push({ phase, cycle, gap: after.rect.top - before.rect.bottom });
      }
    };
    for (let cycle = 0; cycle < 4; cycle++) {
      const button = [...document.querySelectorAll<HTMLButtonElement>('[data-translation-switch]')].find(button => !button.closest('[inert]'))!;
      button.click();
      const start = performance.now(); let frame = 0, reversed = false;
      while (performance.now() - start < 650) {
        await new Promise(requestAnimationFrame);
        // rAF samples describe pre-RO geometry, not physical paint. Native flow
        // should preserve adjacency even at this earlier phase.
        geometry('raf-before-ro', cycle);
        await new Promise(resolve => setTimeout(resolve, 0));
        // A timer is a second sampling point, not a guaranteed post-RO or
        // painted frame: Chromium may run it before this turn's observer.
        geometry('timer-after-raf', cycle);
        if (cycle === 3 && !reversed && performance.now() - start >= 100) {
          reversed = true;
          const block = document.querySelector<HTMLElement>('.limr-translations')!;
          const before = block.dataset.mode!;
          // Mode changes may move the trailing marker to a different branch.
          block.querySelector<HTMLButtonElement>('[data-translation-switch]:not([inert] *)')!.click(); window.scrollBy(0, 12);
          await new Promise(requestAnimationFrame);
          reversals.push({ before, after: block.dataset.mode! });
        }
        if (cycle > 0 && frame++ % 5 === 0) window.scrollBy(0, 8);
        if (cycle === 1 && frame === 7) document.getElementById('root')!.style.maxWidth = '980px';
        if (cycle === 2 && frame === 7) document.getElementById('root')!.style.maxWidth = '1440px';
      }
      window.scrollTo(0, 0);
    }
    return { samples, reversals };
  });
  const { samples, reversals } = audit;
  await testInfo.attach('animation-phase-geometry', { body: JSON.stringify(samples), contentType: 'application/json' });
  expect(samples.length).toBeGreaterThan(50);
  expect(reversals).toHaveLength(1);
  expect(reversals[0].after).not.toBe(reversals[0].before);
  expect.soft(samples.filter(sample => Math.abs(sample.gap) > 1)).toEqual([]);
  expect.soft(await page.evaluate(() => (window as any).windowErrors)).toEqual([]);
});

test('collapsing the last window clamps the bottom without losing its source anchor', async ({ page }) => {
  await page.addInitScript(() => { (window as any).windowErrors = []; window.addEventListener('error', event => (window as any).windowErrors.push(event.message)); });
  await page.goto('/large-reader.html');
  await page.evaluate(() => {
    const source = Array.from({ length: 500 }, (_, index) => `Paragraph ${index}.\n\n`).join('')
      + '<translations default="both">\n<origin>\n\n' + 'Original bottom paragraph. '.repeat(30) + '\n\n</origin>\n<translation>\n\n短译文。\n\n</translation>\n</translations>\n\nFinal visible sentence.';
    (window as any).reading.render({ source });
  });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const audit = (window as any).reading, source = audit.api.document.getSnapshot().source; audit.api.scrollToSource({ start: source.length - 10, end: source.length - 1 }); });
  await expect(page.getByText('Final visible sentence.', { exact: true })).toBeInViewport();
  const result = await page.evaluate(async () => {
    window.scrollTo(0, document.documentElement.scrollHeight);
    const modes: string[] = [];
    for (let index = 0; index < 3; index++) {
      document.querySelector<HTMLButtonElement>('[data-translation-switch]:not([inert] *)')!.click();
      await new Promise(resolve => setTimeout(resolve, 600));
      modes.push(document.querySelector<HTMLElement>('.limr-translations')!.dataset.mode!);
    }
    const api = (window as any).reading.api;
    return { modes, position: api.getReadingPosition(), maximum: document.documentElement.scrollHeight - innerHeight, top: scrollY, errors: (window as any).windowErrors };
  });
  expect(result.modes).toEqual(['origin', 'translation', 'both']);
  expect(result.top).toBeLessThanOrEqual(result.maximum + 1);
  expect(result.position.source).toBeGreaterThan(7000);
  await expect(page.getByText('Final visible sentence.', { exact: true })).toBeInViewport();
  expect(result.errors).toEqual([]);
});
