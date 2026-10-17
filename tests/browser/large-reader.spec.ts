import { test, expect } from '@playwright/test';
test('a complete document stays searchable and navigable with bounded mounted blocks', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ mib: 2 }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  const complete = await page.evaluate(() => (window as any).reading.state.document.getSnapshot().source);
  expect(complete).toContain('THE-END-OF-THE-COMPLETE-BOOK');
  await page.locator('.limr-reader-toc a').filter({ hasText: 'Final chapter' }).click();
  await expect(page.getByText('THE-END-OF-THE-COMPLETE-BOOK')).toBeInViewport();
  await page.keyboard.press('Control+f');
  await page.getByRole('textbox', { name: 'Search document' }).fill('THE-END-OF-THE-COMPLETE-BOOK');
  await expect(page.getByRole('search').getByRole('status')).toHaveText('1/1');
  await page.keyboard.press('Escape');
  await page.getByText('THE-END-OF-THE-COMPLETE-BOOK').click();
  await page.keyboard.press('Control+a');
  const selected = await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source.length);
  const copied = await page.evaluate(() => {
    const event = new ClipboardEvent('copy', { bubbles: true, cancelable: true, clipboardData: new DataTransfer() });
    document.dispatchEvent(event); return event.clipboardData!.getData('text/plain');
  });
  expect(copied).toBe(complete.replace(/^# /gm, '').trimEnd());
  expect(copied).not.toContain('# Final');
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  expect(errors).toEqual([]);
});

test('translation choices survive leaving and returning to a virtual window', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '<translations>\n<origin>\n\nOriginal passage.\n\n</origin>\n<translation>\n\n翻译正文。\n\n</translation>\n</translations>\n\n' + 'A long middle paragraph for windowed reading.\n\n'.repeat(2000) + '# Finish\n\nFinal paragraph.' }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.locator('[data-translation-switch]').click();
  await expect(page.locator('.limr-translations')).toHaveAttribute('data-mode', 'translation');
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); (window as any).reading.api.scrollToSource({ start: 80_000, end: 80_010 }); });
  await expect(page.locator('.limr-translations')).toHaveCount(0);
  await page.evaluate(() => (window as any).reading.api.scrollToSource({ start: 0, end: 1 }));
  await expect(page.locator('.limr-translations')).toHaveAttribute('data-mode', 'translation');
});

for (const typography of ['standard', 'knuth-plass'] as const) test(`50 MiB ${typography}: complete loading and distant reading stay bounded`, async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(typography => (window as any).reading.render({ mib: 50, typography }), typography);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 30_000 }).toBe('ready');
  await expect(page.locator('[data-limr-windowed]')).toBeVisible();
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  await page.locator('.limr-reader-toc a').filter({ hasText: 'Final chapter' }).click();
  await expect(page.getByText('THE-END-OF-THE-COMPLETE-BOOK')).toBeInViewport();
  await page.evaluate(() => { (document.activeElement as HTMLElement)?.blur(); const api = (window as any).reading.api; api.scrollToSource({ start: Math.floor(api.document.getSnapshot().source.length / 2), end: Math.floor(api.document.getSnapshot().source.length / 2) + 1 }); });
  await page.waitForTimeout(100);
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  const mounted = await page.locator('[data-limr-block]').allTextContents();
  expect(mounted.some(text => text.includes('夕阳'))).toBe(true);
  const bookmark = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  expect(bookmark.source).toBeGreaterThan(1_000_000);
  await page.setViewportSize({ width: 980, height: 900 });
  await page.waitForTimeout(80);
  await page.evaluate(position => (window as any).reading.api.restoreReadingPosition(position), bookmark);
  await expect.poll(() => page.evaluate(position => Math.abs((window as any).reading.positionRect(position) - position.offset), bookmark)).toBeLessThan(2);
  expect(errors).toEqual([]);
});


test('logical selection respects other readers and page focus', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '# Main\n\n**Visible** text.\n\n[unused]: /hidden-definition' }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.getByText('Visible text.').click(); await page.keyboard.press('Control+a');
  expect(await page.evaluate(() => { const event = new ClipboardEvent('copy', { cancelable: true, clipboardData: new DataTransfer() }); document.dispatchEvent(event); return event.clipboardData!.getData('text/plain'); })).toBe('Main\n\nVisible text.');
  await page.evaluate(() => { const p = document.createElement('p'); p.id = 'outside'; p.textContent = 'Outside selected text'; document.body.append(p); const range = document.createRange(); range.selectNodeContents(p); const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range); });
  expect(await page.evaluate(() => { const event = new ClipboardEvent('copy', { cancelable: true, clipboardData: new DataTransfer() }); document.dispatchEvent(event); return event.defaultPrevented; })).toBe(false);
  await page.evaluate(() => { getSelection()!.removeAllRanges(); const button = document.createElement('button'); button.textContent = 'Outside focus'; document.body.append(button); button.focus(); });
  expect(await page.evaluate(() => { const event = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, bubbles: true, cancelable: true }); document.activeElement!.dispatchEvent(event); return event.defaultPrevented; })).toBe(false);
  await page.evaluate(() => (window as any).reading.addSecond());
  await page.locator('#secondary-reader').getByText('Separate visible text.').click(); await page.keyboard.press('Control+a');
  expect(await page.evaluate(() => { const event = new ClipboardEvent('copy', { cancelable: true, clipboardData: new DataTransfer() }); document.dispatchEvent(event); return event.clipboardData!.getData('text/plain'); })).toBe('Secondary reader\n\nSeparate visible text.');
});

test('cross-window native endpoints stay mounted without materializing the middle', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: Array.from({ length: 2500 }, (_, i) => `Paragraph ${i}. **Visible** words in the middle of the document.\n\n`).join('') }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const p = document.querySelector('p[data-limr-block],[data-limr-block] p')!, walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); const first = walker.nextNode()!; (window as any).selectedStart = first; const range = document.createRange(); range.setStart(first, 0); range.setEnd(first, 4); const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range); });
  await page.waitForTimeout(50);
  await page.evaluate(() => { const api = (window as any).reading.api, offset = api.document.getSnapshot().source.indexOf('Paragraph 1800.'); api.scrollToSource({ start: offset, end: offset + 1 }); });
  await page.waitForTimeout(100);
  await page.evaluate(() => { const p = [...document.querySelectorAll('[data-limr-document] p')].find(p => p.textContent?.startsWith('Paragraph 1800.'))!, walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT); let last: Node | null = null; for (let node = walker.nextNode(); node; node = walker.nextNode()) last = node; const range = document.createRange(); range.setStart((window as any).selectedStart, 0); range.setEnd(last!, last!.textContent!.length); const selection = getSelection()!; selection.removeAllRanges(); selection.addRange(range); });
  await page.waitForTimeout(100);
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
  const copied = await page.evaluate(() => { const event = new ClipboardEvent('copy', { cancelable: true, clipboardData: new DataTransfer() }); document.dispatchEvent(event); return event.clipboardData!.getData('text/plain'); });
  expect(copied).toContain('Paragraph 1000. Visible words'); expect(copied).toContain('Paragraph 1800. Visible words'); expect(copied).not.toContain('**');
});

test('print preparation is complete, asynchronous, cancellable and does not replace the reader', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ readOnly: true, source: Array.from({ length: 300 }, (_, i) => `Print paragraph ${i}.\n\n`).join('') }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const result = await page.evaluate(async () => { let ticks = 0; const timer = setInterval(() => ticks++, 0); const prepared = await (window as any).reading.api.preparePrint(); clearInterval(timer); const result = { blocks: prepared.blocks, ticks, complete: document.querySelector('.limr-print-document')!.textContent!.includes('Print paragraph 299.'), invisible: getComputedStyle(document.querySelector('.limr-print-document')!).visibility, mounted: document.querySelector('[data-limr-windowed]')!.querySelectorAll('[data-limr-block]').length }; prepared.dispose(); return result; });
  expect(result.blocks).toBe(300); expect(result.complete).toBe(true); expect(result.invisible).toBe('hidden'); expect(result.ticks).toBeGreaterThan(2); expect(result.mounted).toBeLessThan(120);
  expect(await page.evaluate(async () => { const controller = new AbortController(); try { await (window as any).reading.api.preparePrint({ signal: controller.signal, onProgress: ({ loaded }: { loaded: number }) => { if (loaded >= 24) controller.abort(); } }); return false; } catch (error) { return (error as Error).name === 'AbortError' && !document.querySelector('.limr-print-document'); } })).toBe(true);
});

test('progressive completion keeps the source reading anchor and disables prefix edits', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ mib: 75, mode: 'progressive', plugins: (window as any).reading.prefixActionPlugins, onSourceChange: () => { throw new Error('Prefix must be read only'); } }));
  await expect.poll(() => page.evaluate(() => !!(window as any).reading.state?.document && !(window as any).reading.state.complete), { timeout: 15_000, intervals: [20] }).toBe(true);
  expect(await page.evaluate(() => (window as any).reading.api.canEditSource())).toBe(false);
  expect(await page.evaluate(async () => { const api = (window as any).reading.api; try { await api.preparePrint(); return ''; } catch (error) { return !api.isDocumentComplete() && (error as Error).message; } })).toContain('complete document');
  expect(await page.evaluate(() => { try { (window as any).reading.api.addAnnotation({ id: 'forbidden', type: 'highlight', range: { start: 0, end: 2 } }); return ''; } catch (error) { return (error as Error).message; } })).toContain('read-only');
  await page.evaluate(() => { const p = document.querySelector('p[data-limr-block],[data-limr-block] p')!, range = document.createRange(); range.selectNodeContents(p); getSelection()!.removeAllRanges(); getSelection()!.addRange(range); });
  await expect(page.getByRole('button', { name: 'Read action', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Write note', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copy', exact: true })).toBeVisible();
  await page.evaluate(() => (window as any).reading.api.scrollToSource({ start: 20_000, end: 20_001 }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 30_000 }).toBe('ready');
  const top = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>('[data-limr-windowed] [data-limr-block]')].find(element => { const box = element.getBoundingClientRect(); return box.bottom > 50 && box.top < innerHeight; })?.dataset.sourceStart);
  expect(Number(top)).toBeGreaterThan(15_000); expect(Number(top)).toBeLessThan(24_000);
  expect(await page.evaluate(() => (window as any).reading.api.canEditSource())).toBe(true);
  expect(await page.evaluate(() => (window as any).reading.api.isDocumentComplete())).toBe(true);
});

for (const virtualization of [false, true]) test(`a provisional view refuses partial printing and explains the loading requirement (windowed=${virtualization})`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(virtualization => (window as any).reading.render({ virtualization, provisional: true, source: '# Provisional content\n\nLoaded prefix.' }), virtualization);
  await expect(page.getByRole('heading', { name: 'Provisional content' })).toBeVisible();
  await page.getByText('Loaded prefix.', { exact: true }).click();
  await page.keyboard.press('Control+p');
  await expect(page.getByRole('status')).toHaveText('Finish loading the complete document before printing.Close');
  expect(await page.locator('.limr-print-document').count()).toBe(0);
  expect(await page.evaluate(() => (window as any).reading.api.isDocumentComplete())).toBe(false);
  await page.emulateMedia({ media: 'print' });
  await expect(page.getByRole('heading', { name: 'Provisional content' })).not.toBeVisible();
  await expect(page.locator('.limr-provisional-print-notice')).toBeVisible();
});

test('window measurements preserve the outer page before the first heading', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => {
    const intro = document.createElement('div'); intro.id = 'before-reader'; intro.style.height = '320px'; intro.textContent = 'Outer page introduction'; document.body.prepend(intro);
    window.scrollTo(0, 0);
    (window as any).reading.render({ source: '# First complete heading\n\n' + 'A paragraph with enough reading content.\n\n'.repeat(1000) });
  });
  await expect(page.getByRole('heading', { name: 'First complete heading', exact: true })).toBeVisible();
  await page.waitForTimeout(80);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect((await page.getByRole('heading', { name: 'First complete heading', exact: true }).boundingBox())!.y).toBeGreaterThan(320);
  const bookmark = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.evaluate(position => (window as any).reading.api.restoreReadingPosition(position), bookmark);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 100));
  await page.setViewportSize({ width: 980, height: 800 });
  await page.waitForTimeout(80);
  expect(await page.evaluate(() => scrollY)).toBe(100);
});

for (const virtualization of [false, true]) for (const typography of ['standard', 'knuth-plass'] as const) test(`reading positions restore wrapped source after width changes (${virtualization ? 'windowed' : 'ordinary'}, ${typography})`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/large-reader.html');
  await page.evaluate(options => (window as any).reading.render({ ...options, sidebar: false, toc: false, source: Array.from({ length: 80 }, (_, index) => `Paragraph ${index}. ${'A soft wrapped line with **visible markup** and words. '.repeat(35)}\n\n`).join('') }), { virtualization, typography });
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const api = (window as any).reading.api; api.restoreReadingPosition({ source: api.document.getSnapshot().source.indexOf('Paragraph 35.') + 800, offset: 18 }); });
  await page.waitForTimeout(100);
  const bookmark = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  expect(bookmark.source).toBeGreaterThan(40_000);
  if (!virtualization) expect(await page.evaluate(() => {
    const original = Element.prototype.getBoundingClientRect; let reads = 0;
    Element.prototype.getBoundingClientRect = function () { if (this.hasAttribute('data-limr-block')) reads++; return original.call(this); };
    try { (window as any).reading.api.getReadingPosition(); return reads; } finally { Element.prototype.getBoundingClientRect = original; }
  })).toBeLessThan(12);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.setViewportSize({ width: 920, height: 1000 });
  await page.waitForTimeout(100);
  await page.evaluate(position => (window as any).reading.api.restoreReadingPosition(position), bookmark);
  await expect.poll(() => page.evaluate(position => Math.abs((window as any).reading.positionRect(position) - position.offset), bookmark)).toBeLessThan(2);
});

for (const blob of [false, true]) test(`async controlled lifecycle preserves edits (${blob ? 'Blob' : 'string'})`, async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(blob => (window as any).reading.lifecycle({ blob, echo: !blob }), blob);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const start = await page.evaluate(() => { const audit = (window as any).reading; audit.originalEngine = audit.api.document; const source = audit.api.document.getSnapshot().source; audit.api.editSource([{ range: { start: 0, end: source.length }, text: '# Edited\n\nAccepted newest source.' }]); audit.beforeReadyEvents = audit.readyEvents; return audit.workerStarts; });
  await expect(page.getByRole('heading', { name: 'Edited', exact: true })).toBeVisible();
  await page.waitForTimeout(60);
  expect(await page.evaluate(() => (window as any).reading.workerStarts)).toBe(start);
  expect(await page.evaluate(() => (window as any).reading.readyEvents)).toBe(await page.evaluate(() => (window as any).reading.beforeReadyEvents));
  expect(await page.evaluate(() => (window as any).reading.api.document === (window as any).reading.originalEngine)).toBe(true);
  await page.evaluate(() => (window as any).reading.addViewPlugin()); await page.waitForTimeout(60);
  expect(await page.evaluate(() => (window as any).reading.workerStarts)).toBe(start);
  expect(await page.evaluate(() => (window as any).reading.readyEvents)).toBe(await page.evaluate(() => (window as any).reading.beforeReadyEvents));
  expect(await page.evaluate(() => (window as any).reading.api.document === (window as any).reading.originalEngine)).toBe(true);
  await page.evaluate(() => (window as any).reading.reconfigureSyntax());
  await expect.poll(() => page.evaluate(() => (window as any).reading.workerStarts)).toBe(start + 1);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  expect(await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source)).toBe('# Edited\n\nAccepted newest source.');
});

test('a cancelled replacement input cannot revive the previous edited document on reconfiguration', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.lifecycle({ blob: true, echo: false }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => { const audit = (window as any).reading, source = audit.api.document.getSnapshot().source; audit.api.editSource([{ range: { start: 0, end: source.length }, text: '# Old edited book\n\nPrevious file.' }]); audit.replaceInput(new Blob(['# Replacement book\n\n', 'Replacement paragraph text.\n\n'.repeat(150000)])); });
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('cancelled');
  await page.evaluate(() => (window as any).reading.changeMode());
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status), { timeout: 15000 }).toBe('ready');
  expect(await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source.startsWith('# Replacement book'))).toBe(true);
});

test('legacy footnotes navigate through the global index without mounting all definitions', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.legacyNotes('Reference[^note].\n\n' + 'Other paragraph.\n\n'.repeat(2000) + '[^note]: Final footnote content.'));
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.getByRole('link', { name: 'Footnote 1' }).click();
  await expect(page.getByText('Final footnote content.', { exact: true })).toBeVisible();
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
});

test('visited media retains its DOM outside the reading window without covering visible content', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.render({ source: '<video src="/clip.mp4" loading="click" title="Kept media" />\n\n' + Array.from({ length: 2000 }, (_, index) => `Paragraph ${index}.\n\n`).join('') }));
  await expect(page.locator('.limr-video')).toBeVisible();
  await page.evaluate(() => { (window as any).keptMedia = document.querySelector('.limr-video'); const audit = (window as any).reading, start = audit.api.document.getSnapshot().source.indexOf('Paragraph 1500.'); audit.api.scrollToSource({ start, end: start + 1 }); });
  await expect(page.getByText('Paragraph 1500.', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => { const node = (window as any).keptMedia; return node.isConnected && node === document.querySelector('.limr-video') && !!node.closest('[data-window-parked]') && node.getBoundingClientRect().bottom < 0; })).toBe(true);
  expect(await page.evaluate(() => {
    const slot = (window as any).keptMedia.closest('[data-window-slot]') as HTMLElement;
    return Math.abs(slot.getBoundingClientRect().width - document.querySelector('[data-limr-windowed]')!.getBoundingClientRect().width);
  })).toBeLessThanOrEqual(1);
  await page.evaluate(() => (window as any).reading.api.scrollToSource({ start: 0, end: 1 }));
  await expect(page.locator('.limr-video')).toBeVisible();
  expect(await page.evaluate(() => (window as any).keptMedia === document.querySelector('.limr-video'))).toBe(true);
});

for (const typography of ['standard', 'knuth-plass'] as const) test(`new ${typography} windows keep mixed-height blocks contiguous during scrolling and resizing`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route('**/varying-height-*.svg', async route => { const index = Number(/height-(\d+)/.exec(route.request().url())![1]); await route.fulfill({ contentType: 'image/svg+xml', body: `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="${100 + index % 5 * 100}"><rect width="400" height="100%" fill="#abc" /></svg>` }); });
  await page.goto('/large-reader.html');
  await page.evaluate(typography => {
    const source = Array.from({ length: 80 }, (_, index) => `## Section ${index}\n\n${'Mixed height paragraph with readable text. '.repeat(index % 5 * 5 + 2)}\n\n\`\`\`text\n${'Code line\n'.repeat(index % 9 + 2)}\`\`\`\n\n| Name | Value |\n| --- | --- |\n${'| Content | Wrapped table content with a longer explanation. |\n'.repeat(index % 4 + 2)}\n\n![Variable image ${index}](/varying-height-${index}.svg)\n\n`).join('');
    (window as any).reading.render({ source, typography });
  }, typography);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const gaps = await page.evaluate(async () => {
    const failures: unknown[] = [];
    for (let frame = 0; frame < 90; frame++) {
      // Sample again in a task after rAF. This is not proof of physical paint
      // or a guaranteed post-observer phase; normal flow must stay contiguous
      // regardless of where Chromium delivers the pending observer callback.
      await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
      const slots = [...document.querySelectorAll<HTMLElement>('[data-window-slot]:not([data-window-parked])')].map(node => ({ index: node.dataset.windowSlot, rect: node.getBoundingClientRect() })).filter(item => item.rect.bottom > 0 && item.rect.top < innerHeight).sort((a, b) => a.rect.top - b.rect.top);
      for (let index = 1; index < slots.length; index++) { const gap = slots[index].rect.top - slots[index - 1].rect.bottom; if (Math.abs(gap) > 2) failures.push({ frame, from: slots[index - 1].index, to: slots[index].index, gap }); }
      window.scrollBy(0, 180);
      if (frame === 45) document.getElementById('root')!.style.maxWidth = '960px';
    }
    return failures;
  });
  expect(gaps).toEqual([]); expect(errors).toEqual([]);
  expect(await page.locator('[data-limr-block]').count()).toBeLessThan(120);
});
