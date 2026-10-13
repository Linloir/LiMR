import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    (window as any).entrances = [];
    Element.prototype.animate = function (frames, timing) {
      (window as any).entrances.push({ className: this.className, frames, text: this.textContent });
      return original.call(this, frames, timing);
    };
  });
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

test('Mermaid waits for closure, fades in and keeps a single toolbar and atomic selection', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const body = 'flowchart LR\n  A[Start] --> B[Ready]';
  const open = '```mermaid\n' + body;
  await page.evaluate(source => window.limrStream({ source }), open);
  const block = page.locator('.limr-mermaid-block');
  await expect(block).toHaveAttribute('data-mermaid-state', 'loading');
  await expect(block.locator('.limr-loading')).toBeVisible();
  await expect(block.locator('.limr-mermaid-canvas')).toHaveCount(0);
  const source = open + '\n```';
  await page.evaluate(source => window.limrStream({ source }), source);
  await expect(block).toHaveAttribute('data-mermaid-state', 'ready', { timeout: 20000 });
  await expect(block.locator('.limr-mermaid-canvas svg')).toBeVisible();
  await expect(block.locator('.limr-block-tools')).toHaveCount(1);
  await expect(block.locator('.limr-block-tools button')).toHaveCount(4);
  expect(await page.evaluate(() => (window as any).entrances.some((event: any) => event.className === 'limr-mermaid-viewport' && event.frames[0].opacity === 0))).toBe(true);
  await block.getByRole('button', { name: 'Copy Mermaid source', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(body);
  const canvas = block.locator('.limr-mermaid-canvas');
  const initial = (await canvas.boundingBox())!.width;
  await block.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect.poll(async () => (await canvas.boundingBox())!.width).toBeGreaterThan(initial * 1.2);
  await block.getByRole('button', { name: 'Zoom out', exact: true }).click();
  await expect.poll(async () => Math.abs((await canvas.boundingBox())!.width - initial)).toBeLessThan(1);
  await block.getByRole('button', { name: 'Show source', exact: true }).click();
  await expect(block.locator('.limr-mermaid-source')).toHaveText(body);
  await block.getByRole('button', { name: 'Show diagram', exact: true }).click();
  await block.locator('.limr-mermaid-display').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.locator('#stream-selection').textContent().then(value => JSON.parse(value || 'null')?.raw.sourceText)).toBe(source);
  const before = await block.boundingBox();
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-placement', 'bottom');
  await expect.poll(async () => (await page.getByRole('toolbar').boundingBox())!.y - before!.y - before!.height).toBeCloseTo(10, 0);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(page.locator('.limr-paint-background[data-atomic]')).toHaveCount(1);
  expect((await block.boundingBox())!.height).toBeCloseTo(before!.height, 1);
});

test('a bounded diagram pans without selecting labels and supports wheel and keyboard navigation', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 800, height: 900 });
  const body = 'sequenceDiagram\nparticipant A as Browser\nparticipant B as Account Service\nparticipant C as Storage\n' + Array.from({ length: 12 }, (_, index) => `A->>C: Request ${index}\nC-->>B: Response ${index}`).join('\n');
  const source = '```mermaid\n' + body + '\n```';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const block = page.locator('.limr-mermaid-block'), viewport = block.getByRole('region', { name: 'Diagram viewport' });
  await expect(block).toHaveAttribute('data-mermaid-state', 'ready', { timeout: 20000 });
  await block.evaluate(element => (element as HTMLElement).style.setProperty('--limr-mermaid-max-height', '260px'));
  await expect(viewport).toHaveCSS('max-height', '260px');
  const height = (await block.boundingBox())!.height;
  await block.getByRole('button', { name: 'Zoom in', exact: true }).click({ clickCount: 4 });
  await expect.poll(() => viewport.evaluate(element => element.scrollWidth / element.clientWidth)).toBeGreaterThan(1.8);
  expect((await block.boundingBox())!.height).toBeCloseTo(height, 1);
  await expect(viewport).toHaveCSS('scrollbar-width', 'thin');
  await expect(viewport.locator('.limr-mermaid-canvas')).toHaveCSS('user-select', 'none');
  const box = (await viewport.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 150); await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 100, box.y + 65, { steps: 8 }); await page.mouse.up();
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThanOrEqual(95);
  await expect.poll(() => viewport.evaluate(element => element.scrollTop)).toBeGreaterThanOrEqual(80);
  expect(await page.evaluate(() => getSelection()?.isCollapsed)).toBe(true);
  await expect(page.getByRole('toolbar')).toHaveCount(0);
  await viewport.focus();
  const left = await viewport.evaluate(element => element.scrollLeft);
  await page.keyboard.press('ArrowRight');
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(left + 40);
  const top = await viewport.evaluate(element => element.scrollTop);
  await page.keyboard.press('ArrowDown');
  await expect.poll(() => viewport.evaluate(element => element.scrollTop)).toBeGreaterThan(top + 40);
  const afterKey = await viewport.evaluate(element => element.scrollLeft);
  await page.keyboard.down('Shift'); await page.mouse.wheel(0, 100); await page.keyboard.up('Shift');
  await expect.poll(() => viewport.evaluate(element => element.scrollLeft)).toBeGreaterThan(afterKey + 90);
  await page.mouse.wheel(0, 100);
  await expect.poll(() => viewport.evaluate(element => element.scrollTop)).toBeGreaterThan(top + 100);
  await page.keyboard.press('Home');
  await expect.poll(() => viewport.evaluate(element => element.scrollTop + element.scrollLeft)).toBe(0);
  await page.keyboard.press('Enter');
  await expect.poll(() => page.locator('#stream-selection').textContent().then(value => JSON.parse(value || 'null')?.raw.sourceText)).toBe(source);
  await page.keyboard.press('Control+c');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await page.getByRole('toolbar').getByRole('button', { name: 'Copy', exact: true }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-placement', 'bottom');
  await expect.poll(async () => (await page.getByRole('toolbar').boundingBox())!.y - (await block.boundingBox())!.y - height).toBeCloseTo(10, 0);
  await page.getByRole('toolbar').getByRole('button', { name: 'Add highlight', exact: true }).click();
  await viewport.click({ position: { x: 120, y: 100 } });
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-highlight');
  await expect(page.getByRole('toolbar')).toHaveAttribute('data-placement', 'bottom');
});

test('diagram controls fade their backgrounds without scaling and source starts near the top', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: '```mermaid\nflowchart LR\nA-->B\n```', streaming: false }));
  const block = page.locator('.limr-mermaid-block');
  await expect(block).toHaveAttribute('data-mermaid-state', 'ready', { timeout: 20000 });
  const tools = block.locator('.limr-block-tools');
  await page.mouse.move(0, 0); await expect(tools).toHaveCSS('opacity', '0');
  const sourceButton = tools.getByRole('button', { name: 'Show source', exact: true });
  await sourceButton.hover(); await expect(tools).toHaveCSS('opacity', '1');
  await expect(sourceButton).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sourceButton.locator('svg')).toHaveCSS('transform', 'none');
  await page.mouse.down(); await expect(sourceButton.locator('svg')).toHaveCSS('transform', 'none'); await page.mouse.up();
  const source = block.locator('.limr-mermaid-source');
  await expect(source).toBeVisible();
  const offset = await source.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element.querySelector('code')!);
    return range.getBoundingClientRect().top - element.closest('.limr-mermaid-block')!.getBoundingClientRect().top;
  });
  expect(offset).toBeLessThan(24);
  await page.locator('main').first().click({ position: { x: 4, y: 4 } });
  await expect(tools).toHaveCSS('opacity', '0');
});

test('nested quotes and callouts retain their content and collapse state while streaming', async ({ page }) => {
  const source = '> [!warning]- **Careful**\n> Outer text.\n>\n> > [!tip] Nested\n> > Inner text.\n> >\n> > > A nested ordinary quote.';
  await page.evaluate(source => window.limrStream({ source }), source);
  const outer = page.locator('aside[data-callout="warning"]');
  await expect(outer.locator(':scope > .limr-collapse')).toHaveAttribute('inert');
  expect((await outer.locator(':scope > .limr-collapse').boundingBox())!.height).toBe(0);
  await outer.getByRole('button', { name: 'Expand callout', exact: true }).click();
  await expect(outer.locator('aside[data-callout="tip"]')).toBeVisible();
  await expect(outer.locator('blockquote p')).toHaveText('A nested ordinary quote.');
  await page.evaluate(source => window.limrStream({ source }), source + '\n>\n> More text.');
  await expect(outer.getByRole('button', { name: 'Collapse callout', exact: true })).toBeVisible();
  await expect(outer).toContainText('More text.');
});

test('streaming text uses opacity only and finishing a paragraph never replays its entrance', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'Existing text' }));
  await page.waitForTimeout(460);
  await page.evaluate(() => { (window as any).entrances = []; window.limrStream({ source: 'Existing text with **emphasis' }); });
  await page.evaluate(() => window.limrStream({ source: 'Existing text with **emphasis**\n\n' }));
  const count = await page.evaluate(() => (window as any).entrances.length);
  await page.evaluate(() => window.limrStream({ source: 'Existing text with **emphasis**\n\n', streaming: false }));
  expect(await page.evaluate(() => (window as any).entrances.length)).toBe(count);
  const animations = await page.evaluate(() => (window as any).entrances);
  expect(animations.length).toBeGreaterThan(0);
  expect(animations.every((event: any) => event.frames.every((frame: any) => Object.keys(frame).every(key => key === 'opacity')))).toBe(true);
  expect(animations.every((event: any) => !event.text?.startsWith('Existing text'))).toBe(true);
  await expect(page.locator('.limr-stream-increment').first()).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('code and math blocks get a single entrance while their contents keep growing', async ({ page }) => {
  for (const [open, close, selector] of [['```js\nconst a = 1', '\n```', '.limr-code-block'], ['$$\nx^2', '\n$$', '.limr-math-block']]) {
    await page.evaluate(() => window.limrStream({ source: '' }));
    await page.evaluate(source => window.limrStream({ source }), open);
    await expect(page.locator(selector).locator('xpath=ancestor-or-self::*[@data-limr-entrance]')).toHaveCount(1);
    const before = await page.evaluate(() => (window as any).entrances.filter((event: any) => String(event.className).includes('limr-atomic') || String(event.className).includes('limr-code-block')).length);
    await page.evaluate(source => window.limrStream({ source }), open + close);
    expect(await page.evaluate(() => (window as any).entrances.filter((event: any) => String(event.className).includes('limr-atomic') || String(event.className).includes('limr-code-block')).length)).toBe(before);
  }
});
