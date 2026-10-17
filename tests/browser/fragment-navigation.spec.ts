import { test, expect } from '@playwright/test';

for (const virtualization of [false, true]) test(`plain/reference heading fragments retain document scope with a resource base (windowed=${virtualization})`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(virtualization => (window as any).reading.render({ documentId: 'fragment-contract', virtualization, source: '# Start\n\n[Plain](#target) [Reference][destination] [Full ID](#fragment-contract-target) [Duplicate Unicode](#%E4%B8%AD%E6%96%87-1)\n\n' + 'Middle reading paragraph.\n\n'.repeat(800) + '## Target\n\n[Return](#start)\n\n## 中文\n\nFirst Unicode heading.\n\n## 中文\n\nSecond Unicode heading.\n\n[destination]: #target' }), virtualization);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const base = document.createElement('base'); base.href = 'https://resources.invalid/assets/'; document.head.append(base); });
  if (virtualization) await expect(page.getByRole('heading', { name: 'Target', exact: true })).toHaveCount(0);
  for (const label of ['Plain', 'Reference', 'Full ID']) {
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Target', exact: true })).toBeInViewport();
    await page.getByRole('link', { name: 'Return', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Start', exact: true })).toBeInViewport();
  }
  await page.getByRole('link', { name: 'Duplicate Unicode', exact: true }).focus();
  await page.keyboard.press('Enter');
  const duplicate = page.locator('[id="fragment-contract-中文-1"]');
  await expect(duplicate).toBeInViewport(); await expect(duplicate).toBeFocused();
  expect(errors).toEqual([]);
});

test('legacy footnote and return fragments reveal unmounted targets with a resource base', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.legacyNotes('Reference[^note].\n\n' + 'Other paragraph.\n\n'.repeat(2000) + '[^note]: Final footnote content. [Back](#fragment-contract-fnref-9)', { documentId: 'fragment-contract' }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const base = document.createElement('base'); base.href = 'https://resources.invalid/assets/'; document.head.append(base); });
  await page.getByRole('link', { name: 'Footnote 1' }).click();
  await expect(page.getByText('Final footnote content.', { exact: false })).toBeInViewport();
  await page.getByRole('link', { name: 'Back', exact: true }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('link', { name: 'Footnote 1' })).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Footnote 1' })).toBeFocused();
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
});

test('fragment handling preserves modified clicks, malformed escapes and external URLs', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ documentId: 'fragment-contract', source: '[Jump](#target)\n\n' + 'Middle paragraph.\n\n'.repeat(500) + '# Target' }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const prevented = await page.evaluate(() => {
    const link = document.querySelector<HTMLAnchorElement>('[data-limr-document] a')!;
    const dispatch = (href: string, modified = false) => {
      link.setAttribute('href', href); let handled = false;
      document.addEventListener('click', event => { handled = event.defaultPrevented; event.preventDefault(); }, { once: true });
      link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, detail: 1, ctrlKey: modified }));
      return handled;
    };
    return [dispatch('#target', true), dispatch('#%ZZ'), dispatch('https://outside.invalid/#target'), dispatch(`${location.href.split('#')[0]}#target`)];
  });
  expect(prevented).toEqual([false, false, false, true]);
  await expect(page.getByRole('heading', { name: 'Target', exact: true })).toBeInViewport();
});

test('an exact mounted ID wins over a namespaced heading alias', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ documentId: 'fragment-contract', virtualization: false, source: '[Jump](#target)\n\n# Target\n\n' + 'Middle paragraph.\n\n'.repeat(80) }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const target = document.createElement('div'); target.id = 'target'; target.textContent = 'Exact custom target'; document.querySelector('[data-limr-document]')!.append(target); });
  await page.getByRole('link', { name: 'Jump', exact: true }).click();
  await expect(page.getByText('Exact custom target', { exact: true })).toBeInViewport();
  await expect(page.getByRole('heading', { name: 'Target', exact: true })).not.toBeInViewport();
});
