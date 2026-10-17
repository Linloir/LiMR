import { expect, test } from '@playwright/test';

const longBody = () => Array.from({ length: 700 }, (_, index) => `Paragraph ${index}. ${'A quiet place for words. '.repeat(6)}`).join('\n\n');

test('Playground loads a local long document through its worker with default plugins and can replace it', async ({ page }) => {
  const workers: string[] = [];
  const errors: string[] = [];
  page.on('worker', worker => workers.push(worker.url()));
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/#/playground');
  const paragraphs = Array.from({ length: 700 }, (_, index) => `Paragraph ${index}. Reading a long document keeps notes and text available. ${'A quiet place for words. '.repeat(4)}`).join('\n\n');
  const source = `# Loaded book\n\n${paragraphs}\n\n# Last chapter\n\nThe complete ending.`;
  await page.locator('input[type=file]').setInputFiles({ name: 'book.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  expect(workers.length).toBeGreaterThan(0);
  expect(await page.locator('[data-limr-windowed] [data-limr-block]').count()).toBeLessThan(100);
  await page.getByRole('link', { name: 'Last chapter', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Last chapter' })).toBeInViewport();
  await expect(page.getByText('The complete ending.', { exact: true })).toBeVisible();

  await page.locator('.demo-document-controls > button').click();
  const editor = page.getByRole('textbox', { name: 'Markdown source' });
  await expect(editor).toHaveValue(source);
  const offset = source.indexOf('Paragraph 350.');
  const line = source.slice(0, offset).split('\n').length - 1;
  await editor.evaluate((element, line) => { element.scrollTop = line * parseFloat(getComputedStyle(element).lineHeight); }, line);
  await expect.poll(() => page.locator('.demo-preview-scroll').evaluate(root => {
    const top = root.getBoundingClientRect().top;
    const block = [...root.querySelectorAll<HTMLElement>('[data-window-slot]:not([data-window-parked]) > [data-limr-block]')].find(element => element.getBoundingClientRect().bottom > top + 25);
    return block?.textContent?.match(/^Paragraph (\d+)\./)?.[1];
  })).toBe('350');

  await page.locator('input[type=file]').setInputFiles({ name: 'short.md', mimeType: 'text/markdown', buffer: Buffer.from('# Short replacement\n\nCurrent text.') });
  await expect(page.getByRole('heading', { name: 'Short replacement' })).toBeVisible();
  await expect(page.locator('[data-limr-windowed]')).toHaveCount(0);
  await expect(page.getByText('The complete ending.', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('accepted source edits survive leaving and returning to a loaded book', async ({ page }) => {
  await page.goto('/#/playground');
  const source = '# Editable book\n\n- [ ] Retain this task\n\n' + longBody();
  await page.locator('input[type=file]').setInputFiles({ name: 'editable.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  await expect(page.getByRole('heading', { name: 'Editable book' })).toBeVisible();
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  await page.getByRole('button', { name: '插件', exact: true }).click();
  await page.getByRole('checkbox', { name: '允许修改 Markdown', exact: true }).check();
  await page.getByRole('button', { name: '插件', exact: true }).click();
  await page.locator('.limr-reader-content input[type=checkbox]').check();
  await expect(page.locator('.limr-reader-content input[type=checkbox]')).toBeChecked();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('link', { name: 'Playground', exact: true }).click();
  await expect(page.locator('.limr-reader-content input[type=checkbox]')).toBeChecked();
  await page.locator('.demo-document-controls > button').click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(source.replace('- [ ]', '- [x]'));
});

test('a late small-file read cannot overwrite a newer book', async ({ page }) => {
  await page.goto('/#/playground');
  await page.evaluate(() => {
    const original = File.prototype.text;
    File.prototype.text = function () {
      return this.name === 'slow.md' ? new Promise(resolve => { (window as any).finishOldFile = () => resolve('# Stale file'); }) : original.call(this);
    };
  });
  await page.locator('input[type=file]').setInputFiles({ name: 'slow.md', mimeType: 'text/markdown', buffer: Buffer.from('# Stale file') });
  await page.waitForFunction(() => typeof (window as any).finishOldFile === 'function');
  await page.locator('input[type=file]').setInputFiles({ name: 'new.md', mimeType: 'text/markdown', buffer: Buffer.from('# Newest book\n\n' + longBody()) });
  await expect(page.getByRole('heading', { name: 'Newest book' })).toBeVisible();
  await page.evaluate(async () => { (window as any).finishOldFile(); await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
  await expect(page.getByRole('heading', { name: 'Newest book' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Stale file' })).toHaveCount(0);
});

test('editor scroll can reach a hard line and a soft line inside virtual blocks', async ({ page }) => {
  await page.goto('/#/playground');
  const code = Array.from({ length: 180 }, (_, index) => `line ${String(index).padStart(3, '0')}: readable code`).join('\n');
  const source = '# Scroll within blocks\n\n```text\n' + code + '\n```\n\n' + longBody();
  await page.locator('input[type=file]').setInputFiles({ name: 'scroll.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Scroll within blocks' })).toBeVisible();
  await page.locator('.demo-document-controls > button').click();
  const editor = page.getByRole('textbox', { name: 'Markdown source' });
  const line = source.slice(0, source.indexOf('line 120:')).split('\n').length - 1;
  await editor.evaluate((element, line) => { element.scrollTop = line * parseFloat(getComputedStyle(element).lineHeight); }, line);
  await expect.poll(() => page.locator('.demo-preview-scroll').evaluate(root => {
    const code = root.querySelector('pre code'); if (!code) return null;
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const text = walker.currentNode as Text, at = text.data.indexOf('line 120:'); if (at < 0) continue;
      const range = document.createRange(); range.setStart(text, at); range.setEnd(text, at + 1);
      return Math.abs(range.getBoundingClientRect().top - root.getBoundingClientRect().top - 24);
    }
    return null;
  })).toBeLessThan(5);

  const wrapped = '# Wrapped paragraph\n\n' + 'Long paragraphs have many visual lines. '.repeat(500) + '\n\n' + longBody();
  await editor.fill(wrapped);
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  await page.getByRole('button', { name: '自动换行', exact: true }).click();
  await editor.evaluate(element => { element.scrollTop = 500; });
  await expect.poll(() => page.locator('.demo-preview-scroll').evaluate(root => root.scrollTop)).toBeGreaterThan(200);
  await expect.poll(() => page.locator('.demo-preview-scroll').evaluate(root => {
    const paragraph = root.querySelector('[data-window-slot="1"] p');
    return paragraph ? root.getBoundingClientRect().top - paragraph.getBoundingClientRect().top : 0;
  })).toBeGreaterThan(200);
});
