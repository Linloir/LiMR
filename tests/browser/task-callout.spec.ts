import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

test('task diamonds follow the text ink and baseline across line heights and list nesting', async ({ page }) => {
  await page.evaluate(() => window.limrStream({
    source: '- [ ] HIGHLIGHT the task\n- [x] Completed task\n  - [ ] Nested task\n\n1. [ ] Loose task\n\n2. [x] Another loose task\n\n- [ ] 阅读中文任务',
    streaming: false,
  }));
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('checkbox')).toHaveCount(6);
  for (const checkbox of await page.getByRole('checkbox').all()) await expect(checkbox).toBeDisabled();
  for (const [fontSize, lineHeight] of [[16, 1.2], [16, 2.4], [24, 1.8]]) {
    await page.locator('.limr-prose').evaluate((article, values) => {
      (article as HTMLElement).style.setProperty('--limr-font-size', `${values[0]}px`);
      (article as HTMLElement).style.setProperty('--limr-line-height', String(values[1]));
    }, [fontSize, lineHeight]);
    const metrics = await page.locator('.limr-task-item').evaluateAll(items => items.map(item => {
      const control = item.querySelector(':scope > .limr-task-control')!;
      const diamond = control.querySelector('svg')!.getBoundingClientRect();
      const textHost = item.querySelector(':scope > p') ?? item;
      const baseline = document.createElement('span');
      baseline.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      textHost.insertBefore(baseline, textHost === item ? control.nextSibling : textHost.firstChild);
      const baselineY = baseline.getBoundingClientRect().top;
      baseline.remove();
      const style = getComputedStyle(item);
      const canvas = document.createElement('canvas').getContext('2d')!;
      canvas.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const ink = canvas.measureText(control.hasAttribute('data-ideographic') ? '阅读中文任务' : 'H');
      return { height: diamond.height, bottom: diamond.bottom, left: diamond.left, listLeft: item.parentElement!.getBoundingClientRect().left, inkBottom: baselineY + ink.actualBoundingBoxDescent, inkHeight: ink.actualBoundingBoxAscent + ink.actualBoundingBoxDescent, lineHeight: parseFloat(style.lineHeight) };
    }));
    for (const metric of metrics) {
      expect(Math.abs(metric.height - metric.inkHeight)).toBeLessThan(1.1);
      expect(Math.abs(metric.bottom - metric.inkBottom)).toBeLessThan(1.1);
      expect(metric.height).toBeLessThan(metric.lineHeight * .9);
      expect(metric.left).toBeGreaterThanOrEqual(metric.listLeft - .5);
    }
  }
});

test('callouts share note label and body typography while retaining folding', async ({ page }) => {
  await page.evaluate(() => window.limrStream({
    source: '> An ordinary note.\n\n> [!tip]+ A **rich** title\n> A callout body.\n\n::definition\nA definition body.\n::\n\n::question\nA question body.\n::',
    streaming: false,
  }));
  const callout = page.locator('.limr-callout');
  await expect(callout.locator(':scope > .limr-card-label > svg')).toHaveCount(0);
  await expect(callout.locator('.limr-card-label strong')).toHaveText('rich');
  const typography = await page.locator('.limr-card-label').evaluateAll(labels => labels.map(label => {
    const css = getComputedStyle(label);
    return { font: css.fontSize, weight: css.fontWeight, spacing: css.letterSpacing, color: css.color, lineHeight: css.lineHeight };
  }));
  expect(typography).toHaveLength(4);
  for (const label of typography.slice(1)) expect(label).toEqual(typography[0]);
  const bodies = await page.locator('.limr-note .limr-block-content > p').evaluateAll(paragraphs => paragraphs.map(paragraph => {
    const css = getComputedStyle(paragraph);
    return { font: css.fontSize, lineHeight: css.lineHeight, margin: css.margin, color: css.color };
  }));
  expect(bodies).toHaveLength(2);
  expect(bodies[1]).toEqual(bodies[0]);
  const topPadding = await callout.evaluate(element => getComputedStyle(element).paddingTop);
  await callout.getByRole('button', { name: 'Collapse callout', exact: true }).click();
  await expect.poll(async () => (await callout.locator('.limr-collapse').boundingBox())!.height).toBe(0);
  await expect(callout).toHaveCSS('padding-top', topPadding);
  await expect.poll(() => callout.evaluate(element => {
    const outer = element.getBoundingClientRect(), title = element.querySelector('.limr-callout-title')!.getBoundingClientRect();
    return Math.abs(title.top - outer.top - (outer.bottom - title.bottom));
  })).toBeLessThan(.5);
  await callout.getByRole('button', { name: 'Expand callout', exact: true }).click();
  await expect(callout.locator('.limr-block-content')).toBeVisible();
});

test('editable task controls change only the source marker and disable while streaming', async ({ page }) => {
  const source = '- [ ] Pending **task**\r\n- [X] Complete task\r\n  - [ ] Nested task\r\n\r\n> 3. [ ] Quoted task\r\n\r\n-\r\n  [\t] Continued task\r\n';
  await page.evaluate(source => window.limrStream({ source, streaming: false, editable: true }), source);
  const checkboxes = page.getByRole('checkbox');
  await expect(checkboxes).toHaveCount(5);
  await checkboxes.nth(0).check();
  await expect(page.locator('#stream-source')).toHaveText(source.replace('- [ ] Pending', '- [x] Pending'));
  await checkboxes.nth(1).uncheck();
  await checkboxes.nth(2).check();
  await checkboxes.nth(3).check();
  await checkboxes.nth(4).check();
  const edited = source.replace('- [ ] Pending', '- [x] Pending').replace('- [X]', '- [ ]').replace('  - [ ]', '  - [x]').replace('3. [ ]', '3. [x]').replace('[\t]', '[x]');
  expect(await page.locator('#stream-source').textContent()).toBe(edited);
  await page.evaluate(source => window.limrStream({ source, streaming: true, editable: true }), edited);
  for (const checkbox of await checkboxes.all()) await expect(checkbox).toBeDisabled();
  expect(await page.locator('#stream-source').textContent()).toBe(edited);
});

test('editable task text and diamonds share per-line hover in both states without affecting nested tasks', async ({ page }) => {
  const source = '- [ ] A long **selected** task with [a link](https://example.com) and `inline code` that wraps across several lines of readable text.\n  - [x] Nested completed task\n  - [ ] Nested pending task\n\n- [x] Completed task\n\n  A second paragraph stays dark.\n\n- [ ] Loose pending task\n\n  Another paragraph remains part of the same task.';
  await page.setViewportSize({ width: 760, height: 1000 });
  await page.evaluate(source => window.limrStream({ source, streaming: false, editable: true }), source);
  await page.locator('.limr-prose').evaluate(element => { (element as HTMLElement).style.maxWidth = '320px'; });
  await page.evaluate(() => document.fonts.ready);
  const first = page.locator('.limr-task-item').first(), text = first.locator(':scope > p > .limr-task-text');
  const nestedDone = first.locator('.limr-task-item[data-checked] .limr-task-text');
  const nestedPending = first.locator('.limr-task-item:not([data-checked]) .limr-task-text');
  await page.mouse.move(0, 0);
  const muted = await text.evaluate(element => getComputedStyle(element).color);
  const checked = await nestedDone.evaluate(element => getComputedStyle(element).color);
  expect(muted).not.toBe(checked);
  await expect(text).toHaveCSS('background-size', '0% 1px');
  const motion = await text.evaluate(element => {
    const css = getComputedStyle(element);
    return { lines: element.getClientRects().length, decoration: css.boxDecorationBreak, duration: css.transitionDuration, properties: css.transitionProperty };
  });
  expect(motion.lines).toBeGreaterThan(1);
  expect(motion.decoration).toBe('clone');
  expect(motion.properties).toContain('background-size');
  expect(motion.duration).toContain('0.36s');
  await expect(text).toHaveCSS('cursor', 'pointer');
  await text.hover({ position: { x: 12, y: 10 } });
  await expect(text).toHaveCSS('background-size', '100% 1px');
  await expect(text).toHaveCSS('color', checked);
  await expect(nestedPending).toHaveCSS('color', muted);
  await expect(nestedDone).toHaveCSS('background-size', '0% 1px');
  await nestedPending.hover();
  await expect(text).toHaveCSS('background-size', '0% 1px');
  await expect(text).toHaveCSS('color', muted);
  await expect(nestedPending).toHaveCSS('background-size', '100% 1px');
  await expect(text.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  await expect(text.locator('code')).toHaveText('inline code');
  await text.locator('strong').evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange')); document.dispatchEvent(new Event('pointerup'));
  });
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.syntax.sourceText).toBe('**selected**');
  await page.keyboard.press('Escape');
  await page.evaluate(() => getSelection()!.removeAllRanges());
  await first.locator(':scope > .limr-task-control input').check();
  await expect(first).toHaveAttribute('data-checked', 'true');
  await text.hover({ position: { x: 12, y: 10 } });
  await expect(text).toHaveCSS('color', checked);
  await expect(text).toHaveCSS('background-size', '100% 1px');
  await page.mouse.move(0, 0);
  await expect(text).toHaveCSS('background-size', '0% 1px');
  await first.locator(':scope > .limr-task-control').hover();
  await expect(text).toHaveCSS('background-size', '100% 1px');
  await expect(nestedDone).toHaveCSS('background-size', '0% 1px');
  await expect(nestedPending).toHaveCSS('background-size', '0% 1px');
  await expect(page.locator('.limr-prose > ul > .limr-task-item[data-checked]').nth(1).locator(':scope > p')).toHaveCount(2);
});

test('read-only and streaming tasks have no hover or click affordance, including after disabling editing', async ({ page }) => {
  const source = '- [ ] Pending **task**\n- [x] Completed task';
  for (const editable of [false, true]) {
    await page.evaluate(source => window.limrStream({ source, streaming: false, editable: true }), source);
    await page.locator('.limr-task-text').first().hover();
    await expect(page.locator('.limr-task-text').first()).toHaveCSS('background-size', '100% 1px');
    await page.evaluate(({ source, editable }) => window.limrStream({ source, streaming: editable, editable }), { source, editable });
    for (const item of await page.locator('.limr-task-item').all()) {
      const text = item.locator('.limr-task-text'), input = item.getByRole('checkbox');
      await expect(input).toBeDisabled();
      const color = await text.evaluate(element => getComputedStyle(element).color);
      for (const target of [text, item.locator('.limr-task-control')]) {
        await target.hover();
        await expect(text).toHaveCSS('color', color);
        await expect(text).toHaveCSS('background-image', 'none');
        await expect(text).toHaveCSS('transition-duration', '0s');
        await expect(target).toHaveCSS('cursor', 'text');
        const box = (await target.boundingBox())!;
        await page.mouse.click(box.x + 2, box.y + 2);
        await expect(page.locator('#stream-source')).toHaveText(source);
      }
      await expect(input).toHaveCSS('cursor', 'text');
      await expect(item.locator('.limr-diamond-fill')).toHaveCSS('transition-duration', '0s');
    }
  }
});

test('each task paragraph and its diamond toggle only that task and preserve diamond animation', async ({ page }) => {
  const source = '- [ ] First **task** line  \n  A hard-broken continuation.\n\n  A second paragraph belongs to the same task.\n\n  - [ ] Nested task\n\n- [x] A completed task';
  await page.setViewportSize({ width: 760, height: 1000 });
  await page.evaluate(source => window.limrStream({ source, streaming: false, editable: true }), source);
  await page.locator('.limr-prose').evaluate(element => { (element as HTMLElement).style.maxWidth = '280px'; });
  const first = page.locator('.limr-task-item').first(), paragraphs = first.locator(':scope > p > .limr-task-text');
  const control = first.locator(':scope > .limr-task-control'), input = control.getByRole('checkbox');
  await expect(paragraphs).toHaveCount(2);
  await page.mouse.move(0, 0);
  const muted = await paragraphs.first().evaluate(element => getComputedStyle(element).color);
  const dark = await page.locator('.limr-task-item').last().locator('.limr-task-text').evaluate(element => getComputedStyle(element).color);
  await control.hover();
  for (const paragraph of await paragraphs.all()) {
    await expect(paragraph).toHaveCSS('background-size', '100% 1px');
    await expect(paragraph).toHaveCSS('color', dark);
  }
  await page.mouse.move(0, 0);
  await expect(paragraphs.first()).toHaveCSS('background-size', '0% 1px');
  await paragraphs.nth(1).hover({ position: { x: 5, y: 8 } });
  for (const paragraph of await paragraphs.all()) await expect(paragraph).toHaveCSS('background-size', '100% 1px');
  const fill = control.locator('.limr-diamond-fill');
  await fill.evaluate(element => {
    element.addEventListener('transitionrun', event => { if ((event as TransitionEvent).propertyName === 'transform') element.setAttribute('data-transition-ran', 'true'); });
  });
  await paragraphs.nth(1).click({ position: { x: 5, y: 8 } });
  await expect(input).toBeChecked();
  await expect(page.locator('#stream-source')).toHaveText(source.replace('- [ ] First', '- [x] First'));
  await expect(fill).toHaveAttribute('data-transition-ran', 'true');
  await expect(fill).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await paragraphs.first().locator('strong').click();
  await expect(input).not.toBeChecked();
  await expect(page.locator('#stream-source')).toHaveText(source);
  await expect(fill).toHaveCSS('transform', 'matrix(0, 0, 0, 0, 0, 0)');
  await page.mouse.move(0, 0);
  for (const paragraph of await paragraphs.all()) {
    await expect(paragraph).toHaveCSS('background-size', '0% 1px');
    await expect(paragraph).toHaveCSS('color', muted);
  }
  await control.click();
  await expect(input).toBeChecked();
  await input.focus();
  await input.press('Space');
  await expect(input).not.toBeChecked();
  await expect(page.locator('#stream-source')).toHaveText(source);
  await first.locator('.limr-task-item .limr-task-text').click();
  await expect(input).not.toBeChecked();
  await expect(page.locator('#stream-source')).toHaveText(source.replace('- [ ] Nested', '- [x] Nested'));
});

for (const editable of [false, true]) test(`task text remains selectable without toggling when editable=${editable}`, async ({ page }) => {
  const source = '- [ ] Select **these task words** without changing the task.\n- [x] Another task';
  await page.evaluate(({ source, editable }) => window.limrStream({ source, editable, streaming: false }), { source, editable });
  const word = page.locator('.limr-task-text strong');
  const box = (await word.boundingBox())!;
  await page.mouse.move(box.x, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width, box.y + box.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe('these task words');
  await expect(page.locator('#stream-source')).toHaveText(source);
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.syntax.sourceText).toBe('**these task words**');
});
