import { expect, test, type Locator, type Page } from '@playwright/test';

async function select(target: Locator) {
  await target.evaluate(element => {
    const range = document.createRange(); range.selectNodeContents(element);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    document.dispatchEvent(new Event('selectionchange'));
  });
}
const selection = async (page: Page) => JSON.parse(await page.getByTestId('media-selection').textContent() ?? 'null');
async function note(page: Page) {
  await page.getByRole('toolbar').getByRole('button', { name: '笔记', exact: true }).click();
  await page.getByRole('textbox', { name: '笔记内容' }).fill('A media note');
  await page.getByRole('button', { name: '提交', exact: true }).click();
  await page.mouse.click(3, 3);
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto('/?fixture=media-annotations');
  await page.evaluate(() => document.fonts.ready);
  await expect.poll(() => page.locator('#first-panel img').evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test('mixed aspect ratios share image centers and caption rows, with the group copy inside balanced padding', async ({ page }) => {
  const geometry = await page.locator('#annotation-grid').evaluate(group => {
    const box = group.getBoundingClientRect(), copy = group.querySelector('.limr-figures-copy')!.getBoundingClientRect();
    const css = getComputedStyle(group);
    return { box: box.toJSON(), copy: copy.toJSON(), padding: [css.paddingTop, css.paddingBottom, css.paddingLeft, css.paddingRight], panels: [...group.querySelectorAll('.limr-figure')].map(figure => ({ image: figure.querySelector('img')!.getBoundingClientRect().toJSON(), caption: figure.querySelector('figcaption')!.getBoundingClientRect().toJSON() })), align: [...group.querySelectorAll('figcaption')].map(caption => getComputedStyle(caption).textAlign) };
  });
  expect(geometry.panels[0].image.top + geometry.panels[0].image.height / 2).toBeCloseTo(geometry.panels[1].image.top + geometry.panels[1].image.height / 2, 0);
  expect(geometry.panels[0].caption.top).toBeCloseTo(geometry.panels[1].caption.top, 0);
  expect(geometry.align.every(value => value === 'center')).toBe(true);
  expect(new Set(geometry.padding).size).toBe(1);
  expect(geometry.copy.top).toBeGreaterThan(geometry.box.top);
  expect(geometry.copy.right).toBeLessThan(geometry.box.right);
  expect(geometry.copy.bottom).toBeLessThanOrEqual(geometry.box.top + parseFloat(geometry.padding[0]) + 1);
});

test('selection advances through each image and caption in reading order', async ({ page }) => {
  const ends = ['#first-panel .limr-atomic-image', '#first-panel figcaption', '#second-panel .limr-atomic-image', '#second-panel figcaption', '#annotation-grid > figcaption'];
  for (let index = 0; index < ends.length; index++) {
    await page.locator(ends[index]).evaluate(end => {
      const first = document.querySelector('#first-panel .limr-atomic-image')!;
      const range = document.createRange(); range.setStartBefore(first); range.setEndAfter(end);
      getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
      document.dispatchEvent(new Event('selectionchange'));
    });
    await expect(page.locator('.limr-paint-selection[data-media="image"]')).toHaveCount(index < 2 ? 1 : 2);
    await expect.poll(async () => (await selection(page)).raw.sourceText.includes('First panel caption.')).toBe(index >= 1);
    await expect.poll(async () => (await selection(page)).raw.sourceText.includes('Second **panel caption**.')).toBe(index >= 3);
    await expect.poll(async () => (await selection(page)).raw.sourceText.includes('Overall **group caption**.')).toBe(index >= 4);
    const captured = (await selection(page)).raw.sourceText;
    expect(captured).toContain('/papers/feature-channel.png');
    expect(captured.includes('First panel caption.')).toBe(index >= 1);
    expect(captured.includes('Wide panel')).toBe(index >= 2);
    expect(captured.includes('Second **panel caption**.')).toBe(index >= 3);
    expect(captured.includes('Overall **group caption**.')).toBe(index >= 4);
  }
});

test('captions select independently and reordered attributes retain their rendered order', async ({ page }) => {
  for (const caption of ['#first-panel figcaption', '#second-panel figcaption', '#annotation-grid > figcaption']) {
    await select(page.locator(caption));
    await expect(page.locator('.limr-paint-selection[data-media="image"]')).toHaveCount(0);
    await expect(page.locator('.limr-paint-selection').first()).toBeVisible();
    expect((await selection(page)).raw.sourceText).not.toContain('/papers/');
  }
  await select(page.locator('#attribute-order'));
  await expect(page.locator('.limr-paint-selection[data-media="image"]')).toHaveCount(1);
  expect((await selection(page)).raw.sourceText).toBe('/papers/feature-neuron.png\n\nCaption before source.');
});

test('image highlights trace the image and image notes stay over its corner without a separate background', async ({ page }) => {
  const image = page.locator('#first-panel img'), atomic = page.locator('#first-panel .limr-atomic-image');
  const before = (await image.boundingBox())!;
  await select(atomic);
  await expect(page.locator('.limr-paint-selection[data-media="image"]')).toHaveCount(1);
  const paint = (await page.locator('.limr-paint-selection[data-media="image"]').boundingBox())!;
  expect(paint).toEqual(before);
  await note(page);
  const marker = atomic.locator('.limr-mark'), corner = atomic.locator('.limr-corner-marks');
  await expect(marker).toBeVisible();
  await expect(corner).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  const appearance = await marker.evaluate(element => ({ color: getComputedStyle(element).backgroundColor, bounds: element.getBoundingClientRect().toJSON() }));
  expect(appearance.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(appearance.bounds.right).toBeLessThanOrEqual(before.x + before.width);
  expect(appearance.bounds.bottom).toBeLessThanOrEqual(before.y + before.height);
  expect(appearance.bounds.bottom).toBeGreaterThan(before.y + before.height - 12);
  await expect(page.locator('#first-panel figcaption .limr-mark')).toHaveCount(0);
  await expect(atomic.locator('.limr-paint-background')).toHaveCSS('border-top-width', '3px');
  await expect(atomic.locator('.limr-paint-background')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  expect(await image.boundingBox()).toEqual(before);
  await select(page.locator('#first-panel figcaption')); await note(page);
  await expect(page.locator('#first-panel figcaption .limr-mark')).toHaveCount(1);
  await select(page.locator('#annotation-grid > figcaption')); await note(page);
  await expect(page.locator('#annotation-grid > figcaption .limr-mark')).toHaveCount(1);
});

test('math notes overlay the original block without adding height or a vertical scrollbar', async ({ page }) => {
  const math = page.locator('.limr-math-display');
  await expect(math.locator('.katex')).toBeVisible();
  await math.scrollIntoViewIfNeeded();
  const height = (await math.boundingBox())!.height;
  await select(math); await note(page);
  const atomic = math.locator('xpath=ancestor::*[@data-limr-atomic][1]');
  await expect(atomic.locator('.limr-corner-marks .limr-mark')).toBeVisible();
  expect((await math.boundingBox())!.height).toBeCloseTo(height, 1);
  const geometry = await math.evaluate(element => ({ client: element.clientHeight, scroll: element.scrollHeight, bounds: element.getBoundingClientRect().toJSON() }));
  expect(geometry.scroll).toBeLessThanOrEqual(geometry.client + 1);
  const marker = (await atomic.locator('.limr-mark').boundingBox())!;
  expect(marker.y + marker.height).toBeLessThanOrEqual(geometry.bounds.bottom);
  expect(marker.y + marker.height).toBeGreaterThan(geometry.bounds.bottom - 12);
});

test('line-ending markers wrap together with preceding Chinese and English text', async ({ page }) => {
  for (const count of [1, 5]) {
    await page.getByRole('spinbutton', { name: 'Marker count' }).fill(String(count));
    for (const width of [247, 269, 303, 337]) {
      await page.getByRole('spinbutton', { name: 'Reader width' }).fill(String(width));
      const readings = await page.locator('.limr-prose p:has(> [data-limr-text] .limr-mark), .limr-translation-text:has([data-translation-switch])').evaluateAll(paragraphs => paragraphs.filter(p => !p.closest('[inert]')).map(p => {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, { acceptNode: node => node.parentElement?.closest('[data-limr-ignore]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
        let node: Node | null, last: Node | undefined;
        while ((node = walker.nextNode())) if (node.textContent?.trim()) last = node;
        const range = document.createRange(); range.setStart(last!, last!.textContent!.length - 1); range.setEnd(last!, last!.textContent!.length);
        const text = range.getBoundingClientRect();
        return { text: text.toJSON(), markers: [...p.querySelectorAll('.limr-mark')].map(marker => marker.getBoundingClientRect().toJSON()) };
      }));
      expect(readings.length).toBeGreaterThanOrEqual(3);
      for (const reading of readings) for (const marker of reading.markers) {
        expect(marker.top).toBeLessThan(reading.text.bottom);
        expect(marker.bottom).toBeGreaterThan(reading.text.top);
      }
    }
  }
});
