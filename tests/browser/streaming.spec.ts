import { expect, test, type Page } from '@playwright/test';

const send = (page: Page, source: string, streaming = true, custom = false) => page.evaluate(input => window.limrStream(input), { source, streaming, custom });
test.beforeEach(async ({ page }) => { await page.goto('/?fixture=streaming'); await page.waitForFunction(() => !!window.limrStream); });

test('native code selection and source mapping survive appends, pauses and final highlighting', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const source = '```js\nconst selected = "keep this";\nconsole.log(selected);';
  await send(page, source);
  await page.locator('.limr-code-block code').evaluate(code => {
    const text = document.createTreeWalker(code, NodeFilter.SHOW_TEXT).nextNode()!;
    const range = document.createRange(); range.setStart(text, 6); range.setEnd(text, 14);
    getSelection()!.removeAllRanges(); getSelection()!.addRange(range);
    (window as any).selectedTextNode = text;
  });
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe('selected');
  let current = source;
  for (const chunk of ['\n', '// still ', 'arriving', '\nconst next = 2;', '\n`', '`', '`']) {
    current += chunk;
    await send(page, current);
    await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe('selected');
  }
  // Use actual append-only prefixes in the hot path, then settle the same block.
  const next = current;
  await send(page, next, false);
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => getSelection()?.toString())).toBe('selected');
  expect(await page.evaluate(() => getSelection()?.anchorNode === (window as any).selectedTextNode)).toBe(true);
  await expect.poll(async () => JSON.parse(await page.locator('#stream-selection').textContent() || 'null')?.raw.sourceText).toBe('selected');
  await page.keyboard.press('Control+c');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('selected');
  await page.evaluate(() => getSelection()?.removeAllRanges());
  await expect(page.locator('.limr-code-block .shiki')).toBeVisible();
});

test('module state stays mounted while its JSX and double-colon content grows', async ({ page }) => {
  for (const [open, close] of [['::counter\n', '\n::'], ['<counter>\n\n', '\n\n</counter>']]) {
    await send(page, '');
    await send(page, open + 'First');
    await page.getByRole('button', { name: 'Count 0' }).click();
    await send(page, open + 'First paragraph\n\nSecond');
    await expect(page.getByRole('button', { name: 'Count 1' })).toBeVisible();
    await send(page, open + 'First paragraph\n\nSecond' + close, false);
    await expect(page.getByRole('button', { name: 'Count 1' })).toBeVisible();
  }
});

test('partial syntax shows a compact stable ring and closed modules render normally', async ({ page }) => {
  await send(page, '::question{title="Half');
  const ring = page.locator('.limr-loading');
  await expect(ring).toBeVisible();
  await expect(page.locator('article')).not.toContainText('::question');
  const motion = await ring.evaluate(ring => {
    const svg = ring.querySelector('svg')!, orbit = ring.querySelector<SVGGElement>('g')!;
    const animation = orbit.getAnimations()[0];
    animation.pause();
    const centers = [0, 220, 650, 1050, 1549].map(time => {
      animation.currentTime = time;
      const center = new DOMPoint(16, 16).matrixTransform(orbit.getScreenCTM()!);
      return { x: center.x, y: center.y };
    });
    return { centers, width: svg.getBoundingClientRect().width, easing: getComputedStyle(orbit).animationTimingFunction };
  });
  expect(motion.width).toBe(22);
  expect(motion.easing).not.toBe('linear');
  expect(Math.max(...motion.centers.map(point => point.y)) - Math.min(...motion.centers.map(point => point.y))).toBeLessThan(.01);
  await send(page, '::question{title="Complete"}\nPrompt\n::', false);
  await expect(ring).toHaveCount(0);
  await expect(page.locator('.limr-question')).toContainText('Prompt');
});

test('only new increments animate, plugins can replace the effect, and reduced motion is respected', async ({ page }) => {
  await send(page, 'Earlier');
  await send(page, 'Earlier newly added', true, true);
  const addition = page.locator('.custom-increment');
  await expect(addition).toHaveText(' newly added');
  expect(await addition.evaluate(span => span.getAnimations()[0].effect!.getTiming().duration)).toBe(1200);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await send(page, 'Earlier newly added without motion', true, true);
  await expect(page.locator('article')).toContainText('without motion');
  await expect(page.locator('.custom-increment')).toHaveCount(1);
  await expect(page.locator('.custom-increment')).toHaveCount(0, { timeout: 2500 });
});

test('legacy native paragraph optimization remains opt-in', async ({ page }) => {
  const source = '# A heading with several words that benefits from balanced wrapping\n\n' + 'Readable paragraphs should avoid an isolated last word while preserving selection. '.repeat(6);
  await page.evaluate(source => window.limrStream({ source, typography: 'pretty' }), source);
  const paragraph = page.locator('article > p');
  await expect(paragraph).toHaveCSS('text-wrap-style', 'stable');
  await page.evaluate(source => window.limrStream({ source, typography: 'pretty', streaming: false }), source);
  await expect(paragraph).toHaveCSS('text-wrap-style', 'pretty');
  await expect(page.locator('h1')).toHaveCSS('text-wrap-style', 'balance');
  expect(await paragraph.textContent()).toBe(source.split('\n\n')[1].trimEnd());
});

test('animation nodes remain bounded during a continuous stream', async ({ page }) => {
  const result = await page.evaluate(async () => {
    let source = '```text\nStart';
    window.limrStream({ source });
    for (let index = 0; index < 90; index++) {
      source += `\nLine ${index}`;
      window.limrStream({ source });
      await new Promise(requestAnimationFrame);
    }
    return { count: document.querySelectorAll('[data-limr-increment]').length, text: document.querySelector('code')?.textContent, expected: source.slice(8) };
  });
  expect(result.text).toBe(result.expected);
  expect(result.count).toBeLessThan(45);
  await expect(page.locator('[data-limr-increment]')).toHaveCount(0);
});
