import { expect, test, type Locator } from '@playwright/test';

async function select(target: Locator, value?: string) {
  await target.evaluate((element, value) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const texts: Text[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node as Text);
    const content = texts.map(node => node.data).join('');
    const start = value === undefined ? 0 : content.indexOf(value), end = value === undefined ? content.length : start + value.length;
    if (start < 0 || !texts.length) throw new Error('Missing selected text');
    const point = (offset: number, end: boolean) => {
      let at = 0;
      for (const node of texts) {
        if (offset < at + node.length || end && offset === at + node.length) return { node, offset: offset - at };
        at += node.length;
      }
      return { node: texts.at(-1)!, offset: texts.at(-1)!.length };
    };
    const from = point(start, false), until = point(end, true), range = document.createRange();
    range.setStart(from.node, from.offset); range.setEnd(until.node, until.offset);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  }, value);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
});

test('compact literal code preserves raw and syntax ranges across escapes, Unicode and line endings', async ({ page }) => {
  for (const [code, value, raw] of [
    ['`literal &amp; \\* 😀`', 'literal &amp; \\* 😀', 'literal &amp; \\* 😀'],
    ['`` a`b ``', 'a`b', 'a`b'],
    ['`two\r\nlines`', 'two lines', 'two\r\nlines'],
    ['`\r\nvalue\r\n`', 'value', 'value'],
    ['`  `', '  ', '  '],
  ]) {
    const source = `Before **${code}** after.`;
    await page.evaluate(source => window.limrStream({ source, streaming: false }), source);
    const codeElement = page.locator('article code');
    await expect(codeElement).toHaveText(value);
    await expect(codeElement.locator('[data-limr-text]')).toHaveCount(0);
    await select(codeElement);
    await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(raw);
    const selection = JSON.parse(await page.locator('#stream-selection').textContent() || 'null');
    expect(selection.quality).toBe('exact');
    expect(selection.syntax.sourceText).toBe(`**${code}**`);
    await select(page.locator('article > p'));
    await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe(source);
  }
});

test('completed inline code retains native selection and only its entrance animates during later appends', async ({ page }) => {
  await page.evaluate(() => window.limrStream({ source: 'Before ', custom: true }));
  await page.evaluate(() => window.limrStream({ source: 'Before `selected code`', custom: true }));
  const code = page.locator('article code');
  await expect(code.locator('[data-limr-stream-text]')).toHaveCount(1);
  await expect(code.locator('[data-limr-text]')).toHaveCount(0);
  const initial = await code.evaluate(code => {
    const host = code.querySelector('[data-limr-stream-text]')!;
    const animation = host.getAnimations()[0];
    if (!animation) throw new Error('Inline code did not retain its entrance animation');
    animation.pause(); animation.currentTime = 0;
    (window as any).__compactCodeHost = host;
    (window as any).__compactCodeAnimation = animation;
    return animation.effect!.getTiming().duration;
  });
  expect(initial).toBe(1200);
  await select(code, 'selected');
  const source = 'Before `selected code` after more words.\n\nNext paragraph.';
  for (const suffix of [' after', ' after more words.', ' after more words.\n\nNext paragraph.']) {
    await page.evaluate(source => window.limrStream({ source, custom: true }), `Before \`selected code\`${suffix}`);
    expect(await page.evaluate(() => getSelection()?.toString())).toBe('selected');
    await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe('selected');
    expect(await code.evaluate(code => code.querySelector('[data-limr-stream-text]') === (window as any).__compactCodeHost)).toBe(true);
    expect(await code.evaluate(code => code.querySelector('[data-limr-stream-text]')!.getAnimations()[0] === (window as any).__compactCodeAnimation)).toBe(true);
  }
  await page.evaluate(source => window.limrStream({ source, custom: true, streaming: false }), source);
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('selected');
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe('selected');
  await page.evaluate(() => (window as any).__compactCodeAnimation.finish());
});
