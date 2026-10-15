import { expect, test, type Page } from '@playwright/test';

async function edit(page: Page, source?: string) {
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  const editor = page.getByRole('textbox', { name: 'Markdown source' });
  if (source !== undefined) await editor.fill(source);
  await page.evaluate(() => document.fonts.ready);
  return editor;
}
async function selectWords(page: Page) {
  await page.locator('.limr-reader-content strong').first().evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeVisible();
}

test('editor divider animates, drags within bounds and supports keyboard resizing', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await edit(page);
  const separator = page.getByRole('separator', { name: '调整编辑器宽度' });
  const handle = separator.locator('span'), pane = page.locator('.demo-editor-pane');
  const initial = (await pane.boundingBox())!.width;
  await page.mouse.move(0, 0);
  await expect(handle).toHaveCSS('height', '42px');
  await separator.hover();
  await expect(handle).toHaveCSS('height', '58px');
  const box = (await separator.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(handle).toHaveCSS('height', '72px');
  await page.mouse.move(box.x + box.width / 2 + 150, box.y + box.height / 2, { steps: 6 });
  expect((await pane.boundingBox())!.width - initial).toBeCloseTo(150, 0);
  await page.mouse.up();
  await expect(page.locator('.demo-workbench')).not.toHaveAttribute('data-resizing');
  await separator.press('Home');
  expect((await pane.boundingBox())!.width).toBeCloseTo(240, 0);
  await separator.press('End');
  expect((await page.locator('.demo-preview-pane').boundingBox())!.width).toBeCloseTo(320, 0);
  await separator.press('Enter');
  expect((await pane.boundingBox())!.width).toBeCloseTo(initial, 0);
  await separator.press('ArrowRight');
  expect(Number(await separator.getAttribute('aria-valuenow'))).toBe(52);
  await testInfo.attach('editor-divider', { body: await page.screenshot(), contentType: 'image/png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(separator).toBeHidden();
  expect((await pane.boundingBox())!.y + (await pane.boundingBox())!.height).toBeLessThanOrEqual((await page.locator('.demo-preview-pane').boundingBox())!.y + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('soft wrapping keeps both scroll directions aligned after a width change', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const source = Array.from({ length: 12 }, (_, i) => `## Section ${i}\n\n${'中文与 English wrapped text stay aligned. '.repeat(18)}\n\nAnother paragraph.\n`).join('\n');
  const editor = await edit(page, source);
  const wrap = page.getByRole('button', { name: '自动换行', exact: true });
  await expect(wrap).toHaveAttribute('aria-pressed', 'false');
  expect(await editor.evaluate(element => element.scrollWidth - element.clientWidth)).toBeGreaterThan(500);
  await wrap.click();
  await page.getByRole('separator', { name: '调整编辑器宽度' }).press('Home');
  await expect(wrap).toHaveAttribute('aria-pressed', 'true');
  expect(await editor.inputValue()).toBe(source);
  await expect.poll(() => editor.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThan(2);
  await expect.poll(() => editor.evaluate(element => Math.abs(document.querySelector('[data-editor-measure]')!.getBoundingClientRect().height - element.scrollHeight))).toBeLessThan(2);
  const sourceTop = (section: number) => page.evaluate(offset => {
    const mirror = document.querySelector('[data-editor-measure]')!, text = mirror.firstChild!;
    const first = document.createRange(); first.setStart(text, 0); first.setEnd(text, 1);
    const target = document.createRange(); target.setStart(text, offset); target.setEnd(text, offset + 1);
    return target.getBoundingClientRect().top - first.getBoundingClientRect().top;
  }, source.indexOf(`## Section ${section}`));
  await editor.dispatchEvent('pointerdown');
  await editor.evaluate((element, top) => { element.scrollTop = top; }, await sourceTop(4));
  const heading = page.locator('.demo-preview-scroll h2').nth(4);
  await expect.poll(() => heading.evaluate(element => Math.abs(element.getBoundingClientRect().top - element.closest('.demo-preview-scroll')!.getBoundingClientRect().top))).toBeLessThan(3);
  await page.locator('.demo-preview-scroll').dispatchEvent('pointerdown');
  await page.locator('.demo-preview-scroll h2').nth(8).evaluate(element => {
    const pane = element.closest('.demo-preview-scroll')!;
    pane.scrollTop += element.getBoundingClientRect().top - pane.getBoundingClientRect().top;
  });
  const expected = await sourceTop(8);
  await expect.poll(() => editor.evaluate(element => element.scrollTop)).toBeCloseTo(expected, 0);
  // Choose an anchor which also fits above the unwrapped editor's scroll end.
  // Near the bottom, the existing sync intentionally interpolates to both
  // panes' maximum scroll positions rather than clipping later anchors.
  await page.locator('.demo-preview-scroll').dispatchEvent('pointerdown');
  await heading.evaluate(element => {
    const pane = element.closest('.demo-preview-scroll')!;
    pane.scrollTop += element.getBoundingClientRect().top - pane.getBoundingClientRect().top;
  });
  await expect.poll(() => editor.evaluate(element => element.scrollTop)).toBeCloseTo(await sourceTop(4), 0);
  await wrap.click();
  const plainTop = (source.slice(0, source.indexOf('## Section 4')).split('\n').length - 1) * 22;
  await expect.poll(() => editor.evaluate(element => element.scrollTop)).toBeCloseTo(plainTop, 0);
  expect(await editor.inputValue()).toBe(source);
});

test('editor loads local Maple Chinese glyphs and uses an explicit sans fallback', async ({ page }) => {
  const text = '中文字体编辑器宽度自动换行渲染旁注支持修改并保存笔记高亮标记';
  const editor = await edit(page, text);
  const font = await editor.evaluate(element => getComputedStyle(element).fontFamily);
  expect(font).toContain('LiMR Maple Mono NF CN');
  expect(font).toContain('Noto Sans CJK SC');
  expect(font).toContain('sans-serif');
  expect(font).not.toContain('Serif');
  await editor.evaluate((element, text) => {
    const probe = document.createElement('span'); probe.dataset.fontProbe = '';
    probe.style.cssText = 'position:fixed;left:-10000px';
    const css = getComputedStyle(element);
    for (const property of ['font-family', 'font-size', 'font-weight', 'font-style']) probe.style.setProperty(property, css.getPropertyValue(property));
    probe.textContent = text;
    document.body.append(probe);
  }, text);
  await page.evaluate(() => document.fonts.ready);
  const session = await page.context().newCDPSession(page);
  await session.send('DOM.enable'); await session.send('CSS.enable');
  const { root } = await session.send('DOM.getDocument');
  const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '[data-font-probe]' });
  const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
  expect(fonts.length).toBeGreaterThan(0);
  expect(fonts.every(font => font.isCustomFont && font.familyName.includes('LiMR Maple Mono NF CN')), JSON.stringify(fonts)).toBe(true);
  await page.locator('[data-font-probe]').evaluate(element => element.remove());
});

test('the Markdown switch enables inline notes while ordinary notes stay external', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  const source = '# Notes\n\nBefore **selected words** after.\n\n- [ ] A task';
  const editor = await edit(page, source);
  const task = page.getByRole('checkbox', { name: 'Task', exact: true });
  await expect(task).toBeDisabled();
  await selectWords(page);
  await expect(page.getByRole('toolbar').getByRole('button', { name: '添加内联笔记', exact: true })).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: '插件', exact: true }).click();
  const switcher = page.getByRole('checkbox', { name: '允许修改 Markdown', exact: true });
  await expect(switcher).not.toBeChecked();
  await switcher.check(); await page.keyboard.press('Escape');
  await expect(task).toBeEnabled(); await task.check();
  const checkedSource = source.replace('[ ]', '[x]');
  await expect(page.locator('.demo-editor')).toHaveValue(checkedSource);
  await selectWords(page);
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  const ordinary = page.getByRole('textbox', { name: '笔记内容', exact: true });
  await ordinary.fill('Externally saved note'); await ordinary.press('ControlOrMeta+Enter');
  await expect(page.locator('.demo-editor')).toHaveValue(checkedSource);
  await page.getByRole('dialog', { name: '笔记', exact: true }).getByRole('button', { name: '关闭', exact: true }).click();
  await selectWords(page);
  await page.getByRole('toolbar').getByRole('button', { name: '添加内联笔记', exact: true }).click();
  const inline = page.getByRole('textbox', { name: '注释 Markdown', exact: true });
  await inline.fill('Saved inside Markdown'); await inline.press('ControlOrMeta+Enter');
  const next = await page.locator('.demo-editor').inputValue();
  expect(next).toContain('[^%%limr:'); expect(next).toContain('type="inline-note"'); expect(next).toContain('Saved inside Markdown');
  expect(next).not.toContain('Externally saved note');
});

test('rapid scrolling keeps responding while previous synchronized scroll echoes are pending', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const source = Array.from({ length: 12 }, (_, i) => `## Section ${i}\n\n${'中文与 English wrapped text stay aligned. '.repeat(18)}\n\nAnother paragraph.\n`).join('\n');
  const editor = await edit(page, source);
  await page.getByRole('button', { name: '自动换行', exact: true }).click();
  await page.getByRole('separator', { name: '调整编辑器宽度' }).press('Home');
  await expect.poll(() => editor.evaluate(element => Math.abs(document.querySelector('[data-editor-measure]')!.getBoundingClientRect().height - element.scrollHeight))).toBeLessThan(2);
  const result = await page.evaluate(async source => {
    const editor = document.querySelector<HTMLTextAreaElement>('.demo-editor')!;
    const preview = document.querySelector<HTMLElement>('.demo-preview-scroll')!;
    const text = document.querySelector('[data-editor-measure]')!.firstChild!;
    const glyphTop = (offset: number) => {
      const range = document.createRange(); range.setStart(text, offset); range.setEnd(text, offset + 1);
      return range.getBoundingClientRect().top;
    };
    const points = [...preview.querySelectorAll('h2')].map((heading, index) => ({
      source: glyphTop(source.indexOf(`## Section ${index}`)) - glyphTop(0),
      rendered: heading.getBoundingClientRect().top - preview.getBoundingClientRect().top + preview.scrollTop,
    }));
    const steps = [['preview', 8], ['preview', 4], ['editor', 7], ['editor', 3], ['preview', 6], ['editor', 2]] as const;
    const results: { origin: string; section: number; expected: number; actual: number }[] = [];
    for (const [side, section] of [...steps, ...steps]) {
      const fromEditor = side === 'editor', origin = fromEditor ? editor : preview, target = fromEditor ? preview : editor;
      const point = points[section], expected = fromEditor ? point.rendered : point.source;
      origin.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse' }));
      origin.scrollTop = fromEditor ? point.source : point.rendered;
      // Start the next gesture as soon as the destination changes: its native
      // scroll echo may still be queued. No 100 ms debounce wait hides the race.
      for (let frame = 0; frame < 60 && Math.abs(target.scrollTop - expected) >= 1; frame++) await new Promise(requestAnimationFrame);
      results.push({ origin: side, section, expected, actual: target.scrollTop });
      if (Math.abs(target.scrollTop - expected) >= 1) break;
    }
    return results;
  }, source);
  expect(result).toHaveLength(12);
  for (const step of result) expect(Math.abs(step.actual - step.expected), JSON.stringify(step)).toBeLessThan(1);
});
