import { expect, test, type Locator, type Page } from '@playwright/test';

const code = '{"command":"stop","expected_instance_id":"4aa1ae2e-1184-425f-a337-123456789abc"}';
const socket = 'The Unix socket is mode `0600` and accepts one JSON request per connection. Protocol version 4 exposes a random per-process `instance_id` plus only `{"command":"status"}` and an instance-fenced `' + code + '`. The guardian never observes failures from other idb commands and contains no recovery or signal policy.';
const formula = 'a_1 + a_2 + a_3 + a_4 + a_5 + a_6 + a_7 + a_8 + a_9 + a_{10} = b_1 + b_2 + b_3 + b_4 + b_5 + b_6 + b_7 + b_8';

async function load(page: Page, source: string) {
  await page.goto('/?fixture=streaming');
  await page.waitForFunction(() => !!window.limrStream);
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'knuth-plass' }), source);
  await page.evaluate(() => document.fonts.ready);
  const paragraph = page.locator('article > p');
  await expect(paragraph).toHaveAttribute('data-limr-kp');
  return paragraph;
}

async function bounded(paragraph: Locator) {
  await expect(paragraph).not.toHaveAttribute('data-limr-kp-stale');
  await expect.poll(() => paragraph.evaluate(p => {
    const right = p.getBoundingClientRect().right, walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    let overflow = p.scrollWidth - p.clientWidth;
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.parentElement?.closest('.katex-mathml,.limr-kp-glue,[data-limr-kp-scroll]')) continue;
      const range = document.createRange(); range.selectNodeContents(node);
      for (const rect of range.getClientRects()) overflow = Math.max(overflow, rect.right - right);
    }
    return overflow;
  })).toBeLessThan(2);
}

for (const width of [1000, 720, 390]) test(`KP wraps boundary inline code without hyphens at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  const paragraph = await load(page, socket), long = paragraph.locator('code').last();
  await bounded(paragraph);
  await expect(long).toHaveText(code);
  if (width < 1000) await expect(long.locator('br').first()).toBeAttached();
  await expect(paragraph.locator('code .limr-kp-hyphen')).toHaveCount(0);
  const decoration = await long.evaluate(code => [...code.getClientRects()].map(rect => rect.right - code.closest('p')!.getBoundingClientRect().right));
  expect(Math.max(...decoration)).toBeLessThan(2);
});

test('KP code breaks preserve graphemes, source copying, native selection and restoration', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 520, height: 1000 });
  const value = 'expected_instance_identifier_' + 'e\u0301👨‍👩‍👧‍👦_=>_'.repeat(16);
  const source = 'Before `' + value + '` after.';
  const paragraph = await load(page, source), inline = paragraph.locator('code');
  await bounded(paragraph);
  const splits = await inline.evaluate(code => {
    const text = code.textContent!, valid = new Set([0, ...[...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text)].map(part => part.index + part.segment.length)]);
    let offset = 0;
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT), splits: number[] = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node instanceof Text) offset += node.length;
      else if (node instanceof HTMLBRElement) splits.push(offset);
    }
    return { count: splits.length, valid: splits.every(offset => valid.has(offset)) };
  });
  expect(splits.count).toBeGreaterThan(2); expect(splits.valid).toBe(true);
  await expect(inline.locator('.limr-kp-hyphen')).toHaveCount(0);
  await inline.evaluate(code => {
    const range = document.createRange(); range.selectNodeContents(code);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe(value);
  await page.setViewportSize({ width: 390, height: 1000 });
  expect(await page.evaluate(() => getSelection()?.toString())).toBe(value);
  await page.keyboard.press('Control+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await bounded(paragraph);
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'standard' }), source);
  await expect(paragraph).not.toHaveAttribute('data-limr-kp');
  await expect(inline).toHaveText(value);
  await expect(inline.locator('br,[data-limr-kp-text]')).toHaveCount(0);
});

test('KP integrates KaTeX operator breaks and keeps the original formula and source selection', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const source = `An inline calculation appears near the boundary $${formula}$ followed by more text.`;
  const paragraph = await load(page, source);
  await expect(paragraph.locator('.katex')).toHaveCount(1);
  const original = await paragraph.locator('.katex-html > .katex-base').evaluateAll(nodes => nodes.map(node => node.outerHTML));
  for (const width of [1000, 390, 720]) {
    await page.setViewportSize({ width, height: 1000 });
    await bounded(paragraph);
    await expect(paragraph.locator('.katex-html > br').first()).toBeAttached();
    expect(await paragraph.locator('.katex-html > .katex-base').evaluateAll(nodes => nodes.map(node => node.outerHTML))).toEqual(original);
    await expect(paragraph.locator('.katex-base br,.katex-mathml br,[data-limr-kp-scroll]')).toHaveCount(0);
  }
  await paragraph.locator('[data-limr-atomic]').evaluate(math => {
    const range = document.createRange(); range.selectNodeContents(math);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  await expect.poll(() => page.locator('#stream-selection').textContent().then(text => JSON.parse(text || '{}')?.raw?.sourceText)).toBe(`$${formula}$`);
  const fragments = await paragraph.locator('[data-limr-atomic]').evaluate(math => [...math.getClientRects()].filter(rect => rect.width && rect.height).length);
  await expect(page.locator('.limr-paint-selection')).toHaveCount(fragments);
  const paint = await page.locator('.limr-paint-selection').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, top: node.getBoundingClientRect().top })));
  expect(new Set(paint.map(rect => rect.top)).size).toBe(fragments);
  expect(paint.every(rect => rect.width < 672)).toBe(true);
  await page.keyboard.press('Control+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(`$${formula}$`);
  await page.getByRole('button', { name: 'Add highlight', exact: true }).click();
  await expect(paragraph.locator('.limr-paint-background')).toHaveCount(fragments);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'standard' }), source);
  await expect(paragraph.locator('.katex-html > br')).toHaveCount(0);
  expect(await paragraph.locator('.katex-html > .katex-base').evaluateAll(nodes => nodes.map(node => node.outerHTML))).toEqual(original);
});

test('KP respects math grouping, nobreak, allowbreak and explicit newlines', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  const math = String.raw`{a+b+c}+d+\nobreak e=f\allowbreak g+h+i+j+k+l+m+n+o+p+q+r+s+t+u+v+w+x+y+z\newline \frac{x+y}{z}+\sqrt{x+y}`;
  const paragraph = await load(page, `Some text $${math}$ and more text.`);
  await expect(paragraph.locator('.katex')).toHaveCount(1);
  await bounded(paragraph);
  await expect(paragraph.locator('.katex-html > br').first()).toBeAttached();
  await expect(paragraph.locator('.katex-html > .katex-newline')).toHaveCount(1);
  await expect(paragraph.locator('.katex-base br')).toHaveCount(0);
  const groups = await paragraph.locator('.katex-html > .katex-base').allTextContents();
  expect(groups.some(text => text.includes('a+b+c'))).toBe(true);
  expect(groups.some(text => text.includes('d+e='))).toBe(true);
  const explicit = await paragraph.locator('.katex-newline').evaluate(newline => ({ before: newline.previousElementSibling!.getBoundingClientRect().top, after: newline.nextElementSibling!.getBoundingClientRect().top }));
  expect(explicit.after).toBeGreaterThan(explicit.before);
});

test('KP confines an oversized indivisible formula to a scroll surface and removes it on grow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 1000 });
  const math = String.raw`\frac{abcdefghijklmnopqrstuvwx}{12345678901234567890123456789012345678901234567890}`;
  const source = `Prefix $${math}$. Suffix.`;
  const paragraph = await load(page, source);
  const scroll = paragraph.locator('[data-limr-kp-scroll]');
  await expect(scroll).toHaveCount(1);
  await bounded(paragraph);
  expect(await scroll.evaluate(node => node.scrollWidth - node.clientWidth)).toBeGreaterThan(10);
  expect(await scroll.evaluate(node => { node.scrollLeft = node.scrollWidth; return node.scrollLeft; })).toBeGreaterThan(10);
  await expect(scroll.locator('br')).toHaveCount(0);
  await page.setViewportSize({ width: 1000, height: 1000 });
  await expect(scroll).toHaveCount(0);
  await bounded(paragraph);
  await page.setViewportSize({ width: 390, height: 1000 });
  await expect(scroll).toHaveCount(1);
  await bounded(paragraph);
  await paragraph.locator('[data-limr-atomic]').evaluate(math => {
    const range = document.createRange(); range.selectNodeContents(math);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
  });
  const selected = await page.evaluate(() => getSelection()?.toString());
  await page.setViewportSize({ width: 320, height: 1000 });
  await expect(paragraph).toHaveAttribute('data-limr-kp-stale', 'wrap');
  expect(await page.evaluate(() => getSelection()?.toString())).toBe(selected);
  await expect.poll(() => paragraph.evaluate(p => p.scrollWidth - p.clientWidth)).toBeLessThan(2);
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await bounded(paragraph);
  await page.evaluate(source => window.limrStream({ source, streaming: false, typography: 'standard' }), source);
  await expect(scroll).toHaveCount(0);
  await expect(paragraph.locator('.katex-html > br')).toHaveCount(0);
  await expect(paragraph.locator('.katex-base')).not.toHaveAttribute('style', /max-width/);
});
