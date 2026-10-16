import { expect, test, type Locator, type Page } from '@playwright/test';

const shared = 'Before ::%%limr%%{<#r}**selected words**::%%limr%%{>#r} after.\n\n:::limr-annotation{#first ranges="r" type="inline-note"}\nFirst note.\n:::\n\n:::limr-annotation{#second ranges="r" type="footnote"}\nSecond note.\n:::\n\n:::limr-annotation{#paint ranges="r" type="highlight"}\n:::';

async function select(page: Page) {
  const target = page.locator('.limr-reader-content strong').first();
  await target.scrollIntoViewIfNeeded();
  await target.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect(page.getByRole('toolbar')).toBeInViewport();
}

async function stream(page: Page, source: string, editable = true) {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(input => window.limrStream(input), { source, editable, streaming: false, sidebar: true });
}

async function aligned(actions: Locator) {
  await expect(actions).toHaveCSS('justify-content', 'flex-end');
  const gap = await actions.evaluate(element => element.getBoundingClientRect().right - element.querySelector('button:last-child')!.getBoundingClientRect().right);
  expect(gap).toBeGreaterThanOrEqual(0);
  expect(gap).toBeLessThan(4);
}

for (const width of [560, 1460]) {
  test(`source note actions align right and delete only one shared annotation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await stream(page, shared);
    await page.locator('.limr-reader-content').getByRole('button', { name: 'Inline note', exact: true }).click();
    const first = page.locator('.limr-source-annotation-body').filter({ hasText: 'First note.' });
    await expect(first.getByRole('button', { name: 'Edit', exact: true })).toBeVisible();
    await aligned(first.locator('.limr-annotation-actions'));
    await first.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('#stream-source')).not.toContainText('First note.');
    await expect(page.locator('#stream-source')).toContainText('Second note.');
    await expect(page.locator('#stream-source')).toContainText('type="highlight"');
    await page.locator('.limr-reader-content').getByRole('button', { name: 'Footnotes', exact: true }).click();
    const second = page.locator('.limr-source-annotation-body').filter({ hasText: 'Second note.' });
    await aligned(second.locator('.limr-annotation-actions'));
    await second.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('#stream-source')).not.toContainText('Second note.');
    await expect(page.locator('#stream-source')).toContainText('type="highlight"');
    await expect(page.locator('.limr-reader-content .limr-mark')).toHaveCount(0);
    await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(1);
  });

  test(`canceling new inline notes removes only newly created highlights at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const plain = 'Before **selected words** after.';
    await stream(page, plain);
    await select(page);
    await page.getByRole('toolbar').getByRole('button', { name: 'Add inline note', exact: true }).click();
    const editor = page.getByRole('textbox', { name: 'Annotation Markdown' });
    await expect(editor).toBeVisible();
    await expect(page.getByRole('toolbar')).toHaveCount(0);
    await editor.fill('Discard this draft.');
    await aligned(page.locator('.limr-annotation-editor .limr-annotation-actions'));
    await page.locator('.limr-annotation-editor').getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(editor).toHaveCount(0);
    await expect.poll(async () => (await page.locator('#stream-source').textContent())?.trim()).toBe(plain);
    await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(0);

    await select(page);
    await page.getByRole('toolbar').getByRole('button', { name: 'Add inline note', exact: true }).click();
    await expect(editor).toBeFocused();
    await expect(page.getByRole('toolbar')).toHaveCount(0);
    await page.locator('.limr-reader-content p').first().click({ position: { x: 5, y: 5 } });
    await expect(editor).toHaveCount(0);
    await expect.poll(async () => (await page.locator('#stream-source').textContent())?.trim()).toBe(plain);
    await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(0);

    await stream(page, 'Before ==**selected words**== after.');
    await select(page);
    await page.getByRole('toolbar').getByRole('button', { name: 'Add inline note', exact: true }).click();
    await editor.fill('Discard this second draft.');
    await editor.press('Escape');
    await expect(editor).toHaveCount(0);
    await expect(page.locator('#stream-source')).not.toContainText('type="inline-note"');
    await expect(page.locator('.limr-highlight-layer [data-paint]:not([data-reference])')).toHaveCount(1);
  });

  test(`ordinary note modules align actions, cancel new notes, and keep saved notes on cancel at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/#/playground');
    const output = page.locator('.demo-context-line output');
    for (const [index, label] of ['旁注', '笔记', '提问', '脚注'].entries()) {
      await select(page);
      await page.getByRole('toolbar').getByRole('button', { name: label, exact: true }).click();
      const surface = page.locator(width < 800 ? '.limr-annotation-overlay' : '.limr-sidebar-card[data-expanded]');
      let editor = surface.getByRole('textbox', { name: `${label}内容`, exact: true });
      await expect(editor).toBeVisible();
      await expect(page.getByRole('toolbar')).toHaveCount(0);
      await editor.fill('取消新建');
      await surface.getByRole('button', { name: '取消', exact: true }).click();
      await expect(editor).toHaveCount(0);
      await expect(output).toContainText(`${index ? 1 : 0} 处高亮 · 0 条注释`);
      await select(page);
      await page.getByRole('toolbar').getByRole('button', { name: label, exact: true }).click();
      await expect(editor).toBeFocused();
      await expect(page.getByRole('toolbar')).toHaveCount(0);
      await page.locator('.limr-reader-content p').first().click({ position: { x: 5, y: 5 } });
      await expect(editor).toHaveCount(0);
      await expect(output).toContainText(`${index ? 1 : 0} 处高亮 · 0 条注释`);
      await select(page);
      await page.getByRole('toolbar').getByRole('button', { name: label, exact: true }).click();
      editor = surface.getByRole('textbox', { name: `${label}内容`, exact: true });
      await editor.fill(`保留${label}`);
      await surface.getByRole('button', { name: '提交', exact: true }).click();
      await aligned(surface.locator('.demo-note-content > .limr-annotation-actions'));
      await surface.getByRole('button', { name: '修改', exact: true }).click();
      await editor.fill('丢弃这次修改');
      await surface.getByRole('button', { name: '取消', exact: true }).click();
      await expect(surface).toContainText(`保留${label}`);
      await expect(surface).not.toContainText('丢弃这次修改');
      await surface.getByRole('button', { name: '删除', exact: true }).click();
      await expect(output).toContainText('1 处高亮 · 0 条注释');
    }
  });
}

test('read-only authored annotations expose no deletion action', async ({ page }) => {
  await page.setViewportSize({ width: 1460, height: 950 });
  await stream(page, shared, false);
  await page.locator('.limr-reader-content').getByRole('button', { name: 'Inline note', exact: true }).click();
  await expect(page.locator('.limr-source-annotation-body').first()).toBeVisible();
  await expect(page.locator('.limr-source-annotation-body .limr-annotation-actions')).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(shared);
});

test('assistant annotations expose a right-aligned single deletion action', async ({ page }) => {
  await page.setViewportSize({ width: 560, height: 950 });
  await page.goto('/?fixture=assistant-test');
  await select(page);
  await page.getByRole('toolbar').getByRole('button', { name: '询问助手', exact: true }).click();
  await expect(page.locator('#adapter-status')).toHaveText('已完成');
  const card = page.locator('.limr-annotation-overlay');
  await aligned(card.locator('.limr-annotation-actions'));
  await card.getByRole('button', { name: '删除', exact: true }).click();
  await expect(page.locator('.limr-reader-content .limr-mark')).toHaveCount(0);
  await expect(card).toHaveCount(0);
});

test('external citations can be deleted while authored citations remain read-only', async ({ page }) => {
  await page.setViewportSize({ width: 1460, height: 950 });
  await page.goto('/?fixture=sidebar&citations');
  const paragraph = page.locator('.limr-reader-content p').filter({ hasText: 'A selected passage with a ranged citation.' });
  await paragraph.scrollIntoViewIfNeeded();
  await paragraph.locator('.limr-mark').click();
  const external = page.locator('.limr-citation-content').filter({ hasText: 'Ranged citation' });
  await aligned(external.locator('.limr-annotation-actions'));
  await external.getByRole('button', { name: '删除', exact: true }).click();
  await expect(paragraph.locator('.limr-mark')).toHaveCount(0);
  const authored = page.locator('.limr-reader-content .limr-mark').first();
  await authored.scrollIntoViewIfNeeded(); await authored.click();
  const readonly = page.locator('.limr-citation-content').filter({ hasText: 'Single citation' });
  await expect(readonly).toBeVisible();
  await expect(readonly.locator('.limr-annotation-actions')).toHaveCount(0);
});
