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
  await expect(panel.locator('input')).toHaveCSS('outline-style', 'none');
  for (const name of ['Previous result', 'Next result']) {
    const centered = await panel.getByRole('button', { name }).evaluate(element => {
      const button = element.getBoundingClientRect(), svg = element.querySelector('svg')!, path = svg.querySelector('path')!;
      const shape = path.getBBox(), point = new DOMPoint(shape.x + shape.width / 2, shape.y + shape.height / 2).matrixTransform(path.getScreenCTM()!);
      return { x: Math.abs(point.x - button.left - button.width / 2), y: Math.abs(point.y - button.top - button.height / 2) };
    });
    expect(centered.x).toBeLessThan(.1); expect(centered.y).toBeLessThan(.1);
  }
});

test('dense matches inside a tall code block only paint the visible text', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Dense search\n\n```text\n' + ('needle alpha '.repeat(10) + '\n').repeat(3000) + '```', parameters: { codeBlock: { autoCollapse: false } } }));
  await page.getByRole('heading', { name: 'Dense search' }).click();
  await page.keyboard.press('Control+f');
  await page.locator('.limr-document-search input').fill('needle');
  await expect(page.locator('.limr-search-count')).toHaveText('1/30000', { timeout: 20_000 });
  await expect(page.locator('[data-search-current]').first()).toBeVisible();
  expect(await page.locator('[data-search]').count()).toBeLessThan(1500);
  await page.evaluate(() => {
    const audit = (window as any).reading, source = audit.runtime.document.getSnapshot().source;
    audit.api.scrollToSource({ start: source.lastIndexOf('needle'), end: source.lastIndexOf('needle') + 6 });
  });
  await expect.poll(() => page.locator('[data-search]').count()).toBeGreaterThan(0);
  expect(await page.locator('[data-search]').count()).toBeLessThan(1500);
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

test('a standalone search composes with Markdown and can replace its entire UI', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.composeSearch());
  const panel = page.locator('.custom-search-slot');
  await expect(panel).toHaveCSS('position', 'relative');
  await expect(panel).toHaveCSS('--limr-search-accent', 'rgb(120, 40, 170)');
  await panel.locator('input').fill('needle');
  await expect(panel.locator('.limr-search-count')).toHaveText('1/2');
  await page.getByRole('button', { name: 'Replace search UI' }).click();
  await expect(page.locator('.limr-document-search')).toHaveCount(0);
  await expect(page.getByRole('textbox', { name: 'Custom query' })).toHaveValue('needle');
  await page.getByRole('button', { name: 'Custom next' }).click();
  await expect(page.locator('[data-custom-count]')).toHaveText('2/2');
  await expect(page.locator('[data-search-current]')).toBeVisible();
});

test('host-owned shortcuts navigate once through the public find API', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.hostSearch());
  await page.getByRole('heading', { name: 'Host search' }).click();
  const dispatchKey = (key: string, modifiers: { ctrlKey?: boolean; shiftKey?: boolean } = {}) => page.evaluate(({ key, modifiers }) => {
    const event = new KeyboardEvent('keydown', { key, ...modifiers, bubbles: true, cancelable: true });
    document.activeElement!.dispatchEvent(event);
    return event.defaultPrevented;
  }, { key, modifiers });
  expect(await dispatchKey('f', { ctrlKey: true })).toBe(false);
  await expect(page.locator('.limr-document-search')).toHaveCount(0);
  await page.evaluate(() => (window as any).reading.api.find('open'));
  const input = page.locator('.limr-document-search input'), count = page.locator('.limr-search-count');
  await expect(input).toBeFocused();
  await input.fill('needle');
  await expect(count).toHaveText('1/3');
  expect(await dispatchKey('F3')).toBe(false);
  await page.evaluate(() => (window as any).reading.api.find('next'));
  await expect(count).toHaveText('2/3');
  expect(await dispatchKey('F3', { shiftKey: true })).toBe(false);
  await page.evaluate(() => (window as any).reading.api.find('previous'));
  await expect(count).toHaveText('1/3');
  // The component's own input keys remain available with host shortcuts off.
  await page.keyboard.press('Enter');
  await expect(count).toHaveText('2/3');
  await page.keyboard.press('Shift+Enter');
  await expect(count).toHaveText('1/3');
  await page.keyboard.press('Escape');
  await expect(page.locator('.limr-document-search')).toHaveCount(0);
  await expect(page.locator('[data-search]')).toHaveCount(0);
});

for (const typography of ['standard', 'knuth-plass']) test(`search paints active and other results independently of focus in ${typography}`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(typography => (window as any).reading.render({ source: '# Search highlights\n\n丰富的**内容**表达，内容可搜索。\n\n**foo**bar and foobar &amp; decoded.\n\n' + 'Other prose.\n\n'.repeat(80) + 'Final 内容.', typography, theme: 'dark', virtualization: false }), typography);
  await page.getByRole('heading', { name: 'Search highlights' }).click();
  await page.keyboard.press('Control+f');
  const panel = page.locator('.limr-document-search'), input = panel.locator('input'), current = page.locator('[data-search-current]');
  await input.fill('内容');
  await expect(panel.locator('.limr-search-count')).toHaveText('1/3');
  await expect(current).toBeVisible();
  await expect(input).toBeFocused();
  expect(await current.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await page.keyboard.press('Enter');
  await expect(panel.locator('.limr-search-count')).toHaveText('2/3');
  await expect(current).toBeVisible();
  const second = await current.boundingBox();
  await page.keyboard.press('Enter');
  await expect(panel.locator('.limr-search-count')).toHaveText('3/3');
  await expect(current).toBeInViewport();
  await input.fill('foobar');
  await expect(panel.locator('.limr-search-count')).toHaveText('?/2');
  await page.keyboard.press('Shift+Enter');
  await expect(panel.locator('.limr-search-count')).toHaveText('2/2');
  await expect(current.first()).toBeInViewport();
  expect(second?.width).toBeGreaterThan(10);
  expect(await current.evaluateAll(elements => elements.reduce((sum, element) => sum + element.getBoundingClientRect().width, 0))).toBeLessThan(150);
  const source = await page.evaluate(() => (window as any).reading.runtime.document.getSnapshot().source);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-search]')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).reading.runtime.document.getSnapshot().source)).toBe(source);
});
