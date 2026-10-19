import { expect, test } from '@playwright/test';
import { sidebarCorpus } from '../../benchmarks/sidebar/corpus';

for (const collapse of [false, true]) test(`large windowed sidebar preserves geometry and distant anchors (folding ${collapse})`, async ({ page }) => {
  test.setTimeout(60_000);
  const corpus = sidebarCorpus(5), errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/large-reader.html');
  await page.evaluate(({ source, collapse }) => (window as any).reading.render({ source, sidebar: true, sidebarCollapse: collapse, automaticWindowing: true }), { source: corpus.source, collapse });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 30_000 }).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  for (const section of [0, Math.floor(corpus.starts.length / 2), corpus.starts.length - 1]) {
    await page.mouse.click(2, 2);
    await page.locator('.limr-reader-toc a').filter({ hasText: new RegExp(`^Section ${section}$`) }).click();
    const reference = page.locator('.limr-reader-content strong').filter({ hasText: `Shared reference ${section}` });
    await expect(reference).toBeInViewport();
    await page.waitForTimeout(650);
    await expect(page.locator('.limr-reader-content > article')).not.toHaveAttribute('data-source-navigation');
    const cards = page.locator('.limr-sidebar-card'), count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(4); expect(count).toBeLessThan(40);
    expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
    const geometry = () => cards.evaluateAll(elements => {
      return elements.map(element => ({ id: (element as HTMLElement).dataset.occurrence!, top: element.getBoundingClientRect().top }));
    });
    const target = cards.filter({ hasText: `Note ${section}-2.` }), before = await geometry();
    for (const index of [2, 1, 0, 2]) {
      const hovered = cards.filter({ hasText: `Note ${section}-${index}.` }), box = (await hovered.boundingBox())!;
      // Native pointer movement must not scroll the page as a locator's
      // scroll-into-view convenience could mask the window-origin regression.
      await page.mouse.move(box.x + 30, box.y + 25);
      await expect(hovered).toHaveAttribute('data-active', 'true');
      await expect.poll(() => reference.evaluate(element => {
        const range = document.createRange(); range.selectNodeContents(element);
        return Math.abs(range.getBoundingClientRect().top - document.querySelector('.limr-sidebar-card[data-active="true"]')!.getBoundingClientRect().top);
      })).toBeLessThan(1);
      await page.waitForTimeout(250);
      const after = await geometry();
      expect(Math.max(...after.map(card => Math.abs(card.top - before.find(old => old.id === card.id)!.top)))).toBeLessThan(1);
    }
    await target.locator('.limr-sidebar-card-heading').click();
    await expect(target).toHaveAttribute('data-expanded', 'true');
    await page.mouse.move(2, 2); await page.waitForTimeout(550);
    const pinnedTop = (await target.boundingBox())!.y;
    await cards.filter({ hasText: `Note ${section}-1.` }).hover(); await page.mouse.move(2, 2);
    await expect.poll(async () => Math.abs((await target.boundingBox())!.y - pinnedTop)).toBeLessThan(1);
    const id = await target.getAttribute('data-occurrence'), marker = page.locator(`.limr-reader-content [data-limr-anchor="${id}"]`);
    const markerBox = (await marker.boundingBox())!;
    await page.mouse.move(markerBox.x + markerBox.width / 2, markerBox.y + markerBox.height / 2);
    const drift = await marker.evaluate(async element => {
      const top = element.getBoundingClientRect().top, scroll = scrollY, frames = [];
      for (let frame = 0; frame < 35; frame++) {
        await new Promise(requestAnimationFrame);
        frames.push(Math.max(Math.abs(element.getBoundingClientRect().top - top), Math.abs(scrollY - scroll)));
      }
      return Math.max(...frames);
    });
    expect(drift).toBeLessThan(1);
    await page.mouse.move(2, 2);
    await expect(page.locator(`[data-paint="reference-${id}"]`).first()).toHaveCSS('opacity', '1');
    if (section === Math.floor(corpus.starts.length / 2)) {
      await page.mouse.click(2, 2);
      await page.evaluate(start => (window as any).reading.api.scrollToSource({ start, end: start + 1 }), corpus.starts[section]);
      await page.waitForTimeout(650);
      const stack = await geometry(), first = cards.filter({ hasText: `Note ${section}-0.` }), box = (await first.boundingBox())!;
      await page.mouse.move(box.x + 30, box.y + 25);
      await expect(first).toHaveAttribute('data-active', 'true');
      let distance = 0;
      for (let index = 1; index <= 2; index++) {
        const step = stack[index].top - stack[index - 1].top; distance += step;
        await page.mouse.wheel(0, step);
        await expect(cards.filter({ hasText: `Note ${section}-${index}.` })).toHaveAttribute('data-active', 'true');
        await expect.poll(() => reference.evaluate(element => {
          const range = document.createRange(); range.selectNodeContents(element);
          return Math.abs(range.getBoundingClientRect().top - document.querySelector('.limr-sidebar-card[data-active="true"]')!.getBoundingClientRect().top);
        })).toBeLessThan(1);
        const scrolled = await geometry();
        expect(Math.max(...scrolled.map(card => Math.abs(card.top + distance - stack.find(old => old.id === card.id)!.top)))).toBeLessThan(1.5);
      }
    }
  }
  // Keep a focused source alive outside the active window, then release it.
  const activeId = await page.evaluate(() => (window as any).reading.runtime.interaction.get().active);
  await page.evaluate(() => (window as any).reading.api.scrollToSource({ start: 0, end: 1 }));
  await expect(page.getByRole('heading', { name: 'Section 0', exact: true })).toBeInViewport();
  await expect(page.locator('.limr-sidebar-card').filter({ hasText: 'Note 0-0.' })).toBeInViewport();
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  await expect(page.locator(`.limr-sidebar-card[data-occurrence="${activeId}"]`)).toHaveAttribute('data-expanded', 'true');
  await page.mouse.click(2, 2);
  await expect(page.locator(`.limr-sidebar-card[data-occurrence="${activeId}"]`)).toHaveCount(0);
  await page.locator('.limr-reader-toc a').filter({ hasText: 'Final chapter' }).click();
  await expect(page.getByText('SIDEBAR-COMPLETE-BOOK-END')).toBeInViewport();
  expect(errors).toEqual([]);
});

test('a dense folding plan survives leaving and returning to a large document window', async ({ page }) => {
  test.setTimeout(60_000);
  const corpus = sidebarCorpus(5);
  const extra = Array.from({ length: 76 }, (_, index) => `:::limr-annotation{#dense-${index} ranges="r0" type="footnote"}\nDense note ${index}. ${'A detailed explanation. '.repeat(8)}\n:::\n\n`).join('');
  const source = corpus.source.replace('# Section 1\n', extra + '# Section 1\n');
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('/large-reader.html');
  await page.evaluate(source => (window as any).reading.render({ source, sidebar: true, sidebarCollapse: true, automaticWindowing: true }), source);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 30_000 }).toBe('ready');
  const rail = page.locator('.limr-sidebar');
  for (let visit = 0; visit < 2; visit++) {
    await expect(rail.locator('.limr-sidebar-card')).toHaveCount(80);
    await expect.poll(() => rail.locator('[data-folded]').count()).toBeGreaterThan(60);
    await expect(rail).not.toHaveAttribute('data-moving');
    const target = rail.locator('.limr-sidebar-card').filter({ hasText: 'Dense note 75.' });
    const id = await target.getAttribute('data-occurrence');
    await page.locator(`.limr-reader-content [data-limr-anchor="${id}"]`).hover();
    await expect(rail).not.toHaveAttribute('data-moving');
    await expect(target).not.toHaveAttribute('inert');
    await target.hover();
    const before = (await target.boundingBox())!.y;
    await page.waitForTimeout(600);
    expect(Math.abs((await target.boundingBox())!.y - before)).toBeLessThan(1);
    await target.locator('.limr-sidebar-card-heading').click();
    await expect(target).toHaveAttribute('data-expanded', 'true');
    await page.mouse.click(2, 2);
    await page.locator('.limr-reader-toc a').filter({ hasText: /^Section 39$/ }).click();
    await expect(rail.locator('.limr-sidebar-card')).toHaveCount(4);
    expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
    await page.locator('.limr-reader-toc a').filter({ hasText: /^Section 0$/ }).click();
  }
});
