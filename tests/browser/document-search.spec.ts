import { expect, test } from '@playwright/test';

test('search expands from the right without moving its contents, and reverses on close', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Search motion\n\nVisible content.', virtualization: false }));
  await page.getByRole('heading', { name: 'Search motion' }).click();
  await page.keyboard.press('Control+f');
  const panel = page.locator('.limr-document-search'), body = panel.locator('.limr-search-body');
  await expect(panel).toHaveAttribute('data-open');
  const samples = await panel.evaluate(async element => {
    const frames: { width: number; input: number; right: number; opacity: number }[] = [];
    for (let i = 0; i < 24; i++) {
      await new Promise(requestAnimationFrame);
      const box = element.getBoundingClientRect(), input = element.querySelector('input')!.getBoundingClientRect();
      frames.push({ width: box.width, input: input.x, right: box.right, opacity: Number(getComputedStyle(element.querySelector('.limr-search-body')!).opacity) });
    }
    return frames;
  });
  expect(samples.some(frame => frame.width > 0 && frame.width < samples.at(-1)!.width - 1)).toBe(true);
  expect(Math.max(...samples.map(frame => frame.input)) - Math.min(...samples.map(frame => frame.input))).toBeLessThan(1);
  expect(Math.max(...samples.map(frame => frame.right)) - Math.min(...samples.map(frame => frame.right))).toBeLessThan(1);
  await expect(body).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(panel).not.toHaveAttribute('data-open');
  await expect(panel).toHaveAttribute('inert');
  await expect(panel).toHaveCount(0);
  await page.keyboard.press('Control+f');
  await expect(panel.locator('input')).toBeFocused();
  await panel.locator('input').fill('content');
  await expect(panel.locator('.limr-search-count')).toHaveText('1/1');
  await expect(panel).not.toHaveAttribute('data-loading');
});

test('regex and case icons, errors, and a timed-out expression recover without blocking input', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Search options\n\nID-42 id-07 [literal].\n\n' + 'a'.repeat(200) + '!', virtualization: false }));
  await page.getByRole('heading', { name: 'Search options' }).click();
  await page.keyboard.press('Control+f');
  const panel = page.locator('.limr-document-search'), input = panel.locator('input'), count = panel.locator('.limr-search-count');
  await input.fill('ID-\\d+');
  await expect(count).toHaveText('0/0');
  await panel.getByRole('button', { name: 'Use regular expression' }).click();
  await expect(count).toHaveText('1/2');
  await panel.getByRole('button', { name: 'Match case' }).click();
  await expect(count).toHaveText('1/1');
  await input.fill('[');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
  await expect(panel.getByRole('alert')).toBeVisible();
  await input.fill('(a+)+$');
  await expect(panel.getByRole('alert')).toContainText('timed out');
  await input.fill('ID-\\d+');
  await expect(count).toHaveText('1/1');
  await expect(input).toHaveAttribute('aria-invalid', 'false');
});

test('loading expands one icon slot, stays at least one second and preserves content geometry', async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        if (!String(url).startsWith('blob:')) return;
        const add = this.addEventListener.bind(this), remove = this.removeEventListener.bind(this);
        const listeners = new Map<any, any>();
        this.addEventListener = ((type: string, listener: any) => {
          const wrapper = type === 'message' ? (event: MessageEvent) => event.data.ready ? listener(event) : setTimeout(() => listener(event), 440) : listener;
          listeners.set(listener, wrapper); add(type as 'message', wrapper);
        }) as Worker['addEventListener'];
        this.removeEventListener = ((type: string, listener: any) => remove(type as 'message', listeners.get(listener) ?? listener)) as Worker['removeEventListener'];
      }
    };
  });
  await page.goto('/large-reader.html');
  await page.getByRole('heading', { name: 'Start', exact: true }).click();
  await page.keyboard.press('Control+f');
  const panel = page.locator('.limr-document-search');
  await expect(panel.locator('.limr-search-body')).toHaveCSS('opacity', '1');
  const initial = await panel.evaluate(element => {
    const trace: { at: number; visible: boolean }[] = [];
    (window as any).searchLoadingTrace = trace;
    new MutationObserver(() => trace.push({ at: performance.now(), visible: element.hasAttribute('data-loading') })).observe(element, { attributes: true, attributeFilter: ['data-loading'] });
    return { width: element.getBoundingClientRect().width, input: element.querySelector('input')!.getBoundingClientRect().x };
  });
  await panel.locator('input').fill('Small');
  await expect(panel).toHaveAttribute('data-loading');
  await expect(panel).toHaveAttribute('aria-busy', 'false');
  await expect(panel).toHaveAttribute('data-loading');
  const expanded = await panel.evaluate(element => ({ width: element.getBoundingClientRect().width, input: element.querySelector('input')!.getBoundingClientRect().x }));
  expect(expanded.width - initial.width).toBeGreaterThan(25);
  expect(Math.abs(expanded.input - initial.input)).toBeLessThan(1);
  await expect(panel).not.toHaveAttribute('data-loading');
  const trace = await page.evaluate(() => (window as any).searchLoadingTrace);
  expect(trace.at(-1).at - trace[0].at).toBeGreaterThanOrEqual(995);
});

test('native find remains the default, while Playground exposes an explicit search entry', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Native find\n\nDefault browser behavior.', search: false }));
  await page.getByRole('heading', { name: 'Native find' }).click();
  expect(await page.evaluate(() => {
    const event = new KeyboardEvent('keydown', { key: 'f', ctrlKey: true, bubbles: true, cancelable: true });
    window.dispatchEvent(event); return event.defaultPrevented;
  })).toBe(false);
  await expect(page.locator('.limr-document-search')).toHaveCount(0);
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '搜索', exact: true }).click();
  await expect(page.locator('.limr-document-search input')).toBeFocused();
});
