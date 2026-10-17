import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 900 });
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

test('wide survey tables allocate readable remarks and keep header height bounded', async ({ page }) => {
  const headers = ['Ref.', 'Education', 'Industry', 'Agriculture', 'Healthcare', 'Transport', 'E-Commerce', 'Entertainment', 'Lifestyle', 'Gaming', 'Marketing', 'Finance', 'Big Data', 'AI', 'Cloud Computing', 'Edge Computing', '5G and Beyond', 'HCI', 'Remarks'];
  const remarks = 'Presents the evolution of GPT models, GPT architecture and its detailed working, key enabling technologies, significant advancements of GPT models and their potential benefits in real-life applications, GPT projects, lessons learnt, open challenges and future research directions.';
  const source = `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n` + Array.from({ length: 4 }, (_, i) => `| ${[String(i + 1), ...Array.from({ length: 17 }, () => '✓'), remarks].join(' | ')} |`).join('\n');
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  const measured = await table.evaluate(element => {
    const table = element.querySelector('table')!, last = table.tBodies[0].rows[0].cells[18];
    const headers = [...table.tHead!.rows[0].cells].map(cell => {
      const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, window = cell.querySelector('.limr-table-cell-window')!;
      return window.getBoundingClientRect().height / parseFloat(getComputedStyle(content).lineHeight);
    });
    return { width: last.getBoundingClientRect().width, height: last.getBoundingClientRect().height, short: table.tBodies[0].rows[0].cells[2].getBoundingClientRect().width, headers, scroll: element.scrollWidth > element.clientWidth };
  });
  expect(measured.scroll).toBe(true);
  expect(measured.width).toBeGreaterThan(220);
  expect(measured.width).toBeGreaterThan(measured.short * 2);
  expect(measured.height).toBeLessThan(350);
  expect(Math.max(...measured.headers)).toBeLessThanOrEqual(3.05);
});

test('ordinary tables wrap within the viewport and exact source selection survives resizing', async ({ page }) => {
  const source = '| Name | Description |\n| --- | --- |\n| Alpha | Keep **selected words** and 中文内容 together while this short paragraph wraps. |\n| Beta | Compact content. |';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  for (const width of [1100, 540]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => table.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  }
  await table.locator('strong').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe('selected words');
});

test('truncated headers expose full rich content, copy source and expand the original cell', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const long = 'ExtraordinaryHeader'.repeat(25);
  const source = `| **${long}** | Value |\n| --- | --- |\n| short | 1 |`;
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  const marker = table.getByRole('button', { name: 'Full cell content', exact: true }).first();
  await marker.click();
  const preview = page.locator('.limr-annotation-overlay');
  await expect(preview.locator('strong')).toHaveText(long);
  await preview.getByRole('button', { name: 'Copy Markdown' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(`**${long}**`);
  await page.keyboard.press('Escape');
  await expect(preview).toHaveCount(0);
  await marker.click();
  await preview.getByRole('button', { name: 'Expand in table' }).click();
  await expect(table.locator('th').first()).toHaveAttribute('data-cell-expanded', 'true');
  await expect(table.locator('th').first().locator('strong')).toHaveText(long);
  await table.getByRole('button', { name: 'Collapse', exact: true }).click();
  await expect(marker).toBeVisible();
});

test('dense body rows have no fixed line cap and printing restores clipped content', async ({ page }) => {
  const content = 'Dense material continues with meaningful text. '.repeat(45);
  await page.evaluate(source => window.limrStream({ source, streaming: false }), `| First | Second |\n| --- | --- |\n| ${content} | ${content} |`);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  const lines = await table.locator('tbody td').first().evaluate(cell => {
    const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!;
    return cell.querySelector('.limr-table-cell-window')!.getBoundingClientRect().height / parseFloat(getComputedStyle(content).lineHeight);
  });
  expect(lines).toBeGreaterThan(8);
  await page.emulateMedia({ media: 'print' });
  await expect(table.locator('.limr-table-cell-window').first()).toHaveCSS('max-height', 'none');
});

test('sparse, single-column, citation and wide tables fill their container with source markers intact', async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 1000 });
  const remarks = 'A detailed discussion of language models, their architectures and practical applications. '.repeat(4);
  const cases = [
    '| Item | A | Longer label | C | Extra | F | Notes |\n| --- | --- | --- | --- | --- | --- | --- |\n| Alpha | ✓ | ✓ | ✓ | ✓ | ✓ | X |',
    '| One |\n| --- |\n| Short content |',
    `| Reference | Remarks |\n| --- | --- |\n| <ref id="four">[4]</ref> | ${remarks} |\n| <ref id="five">[5]</ref> | ${remarks} |\n\n<citation id="four" title="Reference four" />\n\n<citation id="five" title="Reference five" />`,
    `| ${Array.from({ length: 18 }, (_, i) => i === 0 ? 'Ref.' : `Field ${i}`).concat('Remarks').join(' | ')} |\n| ${Array.from({ length: 19 }, () => '---').join(' | ')} |\n| ${['<ref id="four">[4]</ref>', ...Array.from({ length: 17 }, () => '✓'), remarks].join(' | ')} |\n\n<citation id="four" title="Reference four" />`,
  ];
  for (const [index, source] of cases.entries()) {
    await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
    const table = page.locator('.limr-table-layout');
    for (const width of [500, 760, 1100]) {
      await page.locator('.limr-reader').evaluate((reader, width) => {
        const host = reader.parentElement!; host.style.maxWidth = 'none'; host.style.width = `${width + 48}px`; host.style.marginInline = '0';
        (reader as HTMLElement).style.setProperty('--limr-content-width', 'none');
      }, width);
      await expect(table).toHaveAttribute('data-table-ready', 'true');
      await expect.poll(() => table.evaluate(element => element.clientWidth)).toBe(width);
      await expect.poll(async () => table.evaluate(element => element.querySelector('table')!.getBoundingClientRect().width - element.clientWidth)).toBeGreaterThanOrEqual(-1);
      if (index < 3) await expect.poll(async () => table.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
      if (index >= 2) {
        const cell = table.locator('tbody td').first(), marker = cell.locator('[data-limr-anchor]');
        await expect(marker).toBeVisible();
        await expect(cell.locator('.limr-table-cell-window')).not.toHaveAttribute('data-truncated', 'true');
        const geometry = await marker.evaluate(marker => {
          const bounds = marker.getBoundingClientRect(), window = marker.closest('td')!.querySelector('.limr-table-cell-window')!.getBoundingClientRect();
          return { inside: bounds.left >= window.left - 1 && bounds.right <= window.right + 1 && bounds.top >= window.top - 1 && bounds.bottom <= window.bottom + 1, inert: marker.hasAttribute('inert') };
        });
        expect(geometry).toEqual({ inside: true, inert: false });
      }
    }
    if (index === 2) {
      await table.locator('tbody td').first().locator('[data-limr-anchor]').click();
      await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
      await page.keyboard.press('Escape');
    }
  }
});

test('short compounds and rare phrases stay complete and visible glyphs never enter the suffix track', async ({ page }) => {
  const phrase = 'Our Survey Paper', huge = 'ExtraordinaryHeader'.repeat(25);
  const source = `| Ref. | E-Commerce | **${huge}** |\n| --- | --- | --- |\n| [4] | ✓ | Compact |\n| [5] | ✓ | Compact |\n| [6] | ✓ | Compact |\n| ${phrase} | ✓ | Compact |`;
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  const compound = table.locator('th').nth(1), short = table.locator('tbody tr').last().locator('td').first();
  for (const width of [420, 760, 1100]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(compound.locator('.limr-table-cell-window')).not.toHaveAttribute('data-truncated', 'true');
    await expect(short.locator('.limr-table-cell-window')).not.toHaveAttribute('data-truncated', 'true');
    const result = await table.evaluate(host => {
      let crossed = 0, inspected = 0;
      for (const cell of host.querySelectorAll('th,td')) {
        const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, window = cell.querySelector('.limr-table-cell-window')!, bounds = content.getBoundingClientRect(), visible = window.getBoundingClientRect();
        const suffix = cell.querySelector('.limr-table-cell-reveal')?.getBoundingClientRect();
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
          const text = walker.currentNode as Text;
          if (text.parentElement?.closest('[data-limr-ignore]')) continue;
          let offset = 0;
          for (const character of text.data) {
            const range = document.createRange(); range.setStart(text, offset); offset += character.length; range.setEnd(text, offset);
            const rect = range.getBoundingClientRect();
            if (rect.bottom > visible.bottom + 1 || rect.top < visible.top - 1 || !character.trim()) continue;
            inspected++;
            if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1 || suffix && rect.right > suffix.left + 1) crossed++;
          }
        }
      }
      const compound = host.querySelectorAll('th')[1].querySelector<HTMLElement>('.limr-table-cell-content')!;
      const phrase = [...host.querySelectorAll('tbody tr')].at(-1)!.querySelector<HTMLElement>('.limr-table-cell-content')!;
      return { crossed, inspected, compoundLines: compound.clientHeight / parseFloat(getComputedStyle(compound).lineHeight), phraseLines: phrase.clientHeight / parseFloat(getComputedStyle(phrase).lineHeight) };
    });
    expect(result.inspected).toBeGreaterThan(25);
    expect(result.crossed).toBe(0);
    expect(result.compoundLines).toBeLessThan(1.1);
    expect(result.phraseLines).toBeLessThan(2.1);
  }
});

test('complete italic glyphs keep their ink beyond tight advance widths and citation markers remain intact', async ({ page }, testInfo) => {
  await page.addStyleTag({ content: '.limr-table-cell-content em { font: italic 32px serif; }' });
  const source = '| Glyph | Reference |\n| --- | --- |\n| *f* | <ref id="four">[4]</ref> |\n| *j* | <ref id="four">[4]</ref> |\n| *é* | <ref id="four">[4]</ref> |\n\n<citation id="four" title="Reference four" />';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  await page.evaluate(() => document.fonts.ready);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await expect(table.locator('[data-truncated]')).toHaveCount(0);
  let knownOverhangs = 0, observedClips = 0;
  for (const cell of await table.locator('tbody td:first-child').all()) {
    const window = cell.locator('.limr-table-cell-window');
    await expect(window).toHaveCSS('overflow-x', 'visible');
    // Tighten just the paint window to the actual advance width. This isolates
    // glyph overhang from the optimizer and proves pixels, not only Range boxes.
    const overhang = await window.evaluate(window => {
      const glyph = window.querySelector('em')!, canvas = document.createElement('canvas').getContext('2d')!;
      canvas.font = getComputedStyle(glyph).font;
      const metrics = canvas.measureText(glyph.textContent!);
      (window as HTMLElement).style.width = `${Math.ceil(metrics.width)}px`;
      return metrics.actualBoundingBoxRight > Math.ceil(metrics.width) + .25 || metrics.actualBoundingBoxLeft > .25;
    });
    const actual = await cell.screenshot({ animations: 'disabled', caret: 'hide' });
    await window.evaluate(window => { (window as HTMLElement).style.overflow = 'visible'; });
    const unclipped = await cell.screenshot({ animations: 'disabled', caret: 'hide' });
    expect(actual.equals(unclipped)).toBe(true);
    if (overhang) {
      knownOverhangs++;
      await window.evaluate(window => { (window as HTMLElement).style.overflow = 'hidden'; });
      const clipped = await cell.screenshot({ animations: 'disabled', caret: 'hide' });
      if (!clipped.equals(unclipped)) observedClips++;
    }
    await window.evaluate(window => { (window as HTMLElement).style.removeProperty('overflow'); });
  }
  expect(knownOverhangs).toBeGreaterThan(0);
  // A fractional font bounding box can extend beyond the advance without
  // producing a nontransparent pixel there at this device scale. Require an
  // actual clipped control image, while all three default images must match
  // their unclipped baselines above.
  expect(observedClips).toBeGreaterThan(0);
  for (const marker of await table.locator('tbody td:nth-child(2) [data-limr-anchor]').all()) {
    expect(await marker.evaluate(marker => {
      const rect = marker.getBoundingClientRect(), bounds = marker.closest('td')!.querySelector('.limr-table-cell-window')!.getBoundingClientRect();
      return !marker.closest('[inert]') && rect.left >= bounds.left - 1 && rect.right <= bounds.right + 1;
    })).toBe(true);
  }
  await testInfo.attach('unclipped-italic-ink-and-citations', { body: await table.screenshot(), contentType: 'image/png' });
});

test('cell overflow shares native annotation sidebar and overlay without writing annotations into source', async ({ page }) => {
  const long = 'ExtraordinaryHeader'.repeat(25), source = `| **${long}** | Value |\n| --- | --- |\n| short | 1 |`;
  await page.setViewportSize({ width: 1600, height: 1000 });
  await page.evaluate(source => window.limrStream({ source, streaming: false, sidebar: true, sidebarCollapse: true, editable: true }), source);
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  const marker = table.getByRole('button', { name: 'Full cell content', exact: true }).first();
  await marker.click();
  const card = page.locator('.limr-sidebar-card[data-type="table-cell-overflow"]');
  await expect(card).toHaveCount(1);
  await expect(card).toHaveAttribute('data-expanded', 'true');
  await expect(card.locator('.limr-table-full-content strong')).toHaveText(long);
  await expect(page.locator('.limr-annotation-overlay')).toHaveCount(0);
  await expect(page.locator('#stream-source')).toHaveText(source);
  await page.evaluate(() => {
    // The fixture exposes its actual provider instance in both development
    // and production; no module URL or second runtime is involved.
    const runtime = window.limrStreamRuntime;
    if (!runtime) throw new Error('The fixture did not expose its ReaderRuntime');
    const original = runtime.setViewAnnotations;
    (window as Window & { tableViewPublications?: number }).tableViewPublications = 0;
    runtime.setViewAnnotations = function (...args) {
      (window as unknown as Window & { tableViewPublications: number }).tableViewPublications++;
      return Reflect.apply(original, this, args);
    };
  });
  for (const width of [1500, 1450, 1600]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect.poll(() => table.evaluate(element => Math.abs(element.querySelector('table')!.getBoundingClientRect().width - element.clientWidth))).toBeLessThanOrEqual(1);
  }
  expect(await page.evaluate(() => (window as unknown as Window & { tableViewPublications: number }).tableViewPublications)).toBe(0);
  await page.setViewportSize({ width: 700, height: 900 });
  await expect(page.locator('.limr-reader')).not.toHaveAttribute('data-sidebar', 'true');
  await expect(page.locator('.limr-annotation-overlay[data-type="table-cell-overflow"]')).toBeVisible();
  await expect(table.locator('[data-limr-anchor]')).toHaveCount(1);
  await expect(page.locator('#stream-source')).toHaveText(source);
  await page.evaluate(() => window.limrStream({ source: 'Replacement document', streaming: false, sidebar: true }));
  await expect(page.locator('[data-type="table-cell-overflow"]')).toHaveCount(0);
});

test('a table revealed by a translation switch receives its measured layout', async ({ page }) => {
  const source = '<translations>\n\n<origin>\n\nOriginal paragraph.\n\n</origin>\n\n<translation>\n\n| 文献 | 评述 |\n| --- | --- |\n| [4] | 翻译表格里的完整说明。 |\n\n</translation>\n\n</translations>';
  await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
  await page.locator('[data-translation-switch]').click();
  const table = page.locator('.limr-table-layout');
  await expect(table).toHaveAttribute('data-table-ready', 'true');
  await expect.poll(() => table.evaluate(element => Math.abs(element.querySelector('table')!.getBoundingClientRect().width - element.clientWidth))).toBeLessThanOrEqual(1);
  await expect(table.locator('[data-truncated]')).toHaveCount(0);
});
