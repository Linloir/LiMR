import { expect, test } from '@playwright/test';

for (const width of [390, 560]) test(`mobile note cards stay anchored and assistant morphs from a measured in-viewport preview at ${width}px`, async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const source = '# 手机阅读\n\n笔记文字。\n\n脚注文字。\n\n提问文字。\n\n助手文字。';
  const types = ['reading-note', 'reader-footnote', 'reader-question', 'assistant'];
  const words = ['笔记文字', '脚注文字', '提问文字', '助手文字'];
  const annotations = types.map((type, index) => ({ id: `mobile-${index}`, type, range: { start: source.indexOf(words[index]), end: source.indexOf(words[index]) + 4 },
    data: { text: type === 'assistant' ? '助手回答的正文。'.repeat(50) : '普通内容，用于检查移动卡片的实际定位和出现动画。', status: 'complete' },
  }));
  await page.addInitScript(({ source, annotations }) => {
    localStorage.setItem('limr-playground-document', JSON.stringify({ version: 2, source, annotations }));
    (window as any).mobileCardFrames = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (this.closest('.limr-annotation-overlay')) { animation.pause(); animation.currentTime = 0; }
      if (this.classList.contains('limr-annotation-overlay')) (window as any).mobileCardFrames.push({ frames, host: this.parentElement!.getBoundingClientRect().toJSON() });
      return animation;
    };
  }, { source, annotations });
  await page.goto('/');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: '加载已保存文本' }).click();
  await page.evaluate(() => document.fonts.ready);
  const card = page.locator('.limr-annotation-overlay');
  const close = async () => {
    await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await page.keyboard.press('Escape');
    await card.evaluate(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
    await expect(card).toHaveCount(0);
    await page.evaluate(() => { (window as any).mobileCardFrames = []; });
  };
  // Revisit earlier types after the large assistant card; a reused positioning
  // calculation must not inherit that card's identity, width or height.
  for (const index of [0, 1, 2, 3, 0, 3]) {
    const marker = page.locator('.limr-reader-content .limr-mark').nth(index);
    const scrollBefore = await page.evaluate(() => scrollY);
    await marker.tap();
    await expect(card).toHaveAttribute('data-type', types[index]);
    await expect(card).toHaveAttribute('data-motion', index === 3 ? 'morphing' : 'opening');
    const measured = await card.evaluate(async element => {
      const host = element.parentElement!, shell = element.querySelector('.limr-overlay-surface')!;
      const firstHost = host.getBoundingClientRect().toJSON(), firstShell = shell.getBoundingClientRect().toJSON();
      const frames = [];
      for (let frame = 0; frame < 5; frame++) {
        await new Promise(requestAnimationFrame);
        frames.push(host.getBoundingClientRect().toJSON());
      }
      return { firstHost, firstShell, frames, entry: (window as any).mobileCardFrames[0] };
    });
    const anchor = (await marker.boundingBox())!;
    for (const rect of [measured.firstHost, measured.firstShell, ...measured.frames]) {
      expect(rect.left).toBeGreaterThanOrEqual(11.5); expect(rect.right).toBeLessThanOrEqual(width - 11.5);
      expect(rect.top).toBeGreaterThanOrEqual(11.5); expect(rect.bottom).toBeLessThanOrEqual(832.5);
    }
    for (const rect of measured.frames) for (const key of ['x', 'y', 'width', 'height'] as const) expect(rect[key]).toBeCloseTo(measured.firstHost[key], 0);
    expect(await page.evaluate(() => scrollY)).toBe(scrollBefore);
    if (index !== 3) {
      await expect(page.locator('.limr-annotation-expanded')).toHaveCount(0);
      await expect(card.getByRole('button', { name: '展开', exact: true })).toHaveCount(0);
      const inset = measured.entry.frames[0].clipPath.match(/inset\(([^)]+) round/)[1].split(' ').map(parseFloat);
      const originX = measured.entry.host.left + measured.entry.host.width * inset[3] / 100;
      expect(originX).toBeCloseTo(anchor.x + anchor.width / 2, 0);
    } else {
      const start = measured.firstShell;
      expect(Math.min(Math.abs(start.top - (anchor.y + anchor.height)), Math.abs(start.bottom - anchor.y))).toBeCloseTo(8, 0);
      expect(measured.firstHost.height).toBeCloseTo(844 * .8, 0);
      expect(measured.firstHost.x + measured.firstHost.width / 2).toBeCloseTo(width / 2, 0);
      expect(measured.firstHost.y + measured.firstHost.height / 2).toBeCloseTo(422, 0);
      const samples = await card.evaluate(element => [0, .25, .75, 1].map(progress => {
        for (const animation of element.getAnimations({ subtree: true })) {
          const timing = animation.effect!.getTiming(); animation.currentTime = (Number(timing.duration) + Number(timing.delay)) * progress;
        }
        return element.querySelector('.limr-overlay-surface')!.getBoundingClientRect().toJSON();
      }));
      for (const rect of samples) {
        expect(rect.left).toBeGreaterThanOrEqual(11.5); expect(rect.right).toBeLessThanOrEqual(width - 11.5);
        expect(rect.top).toBeGreaterThanOrEqual(11.5); expect(rect.bottom).toBeLessThanOrEqual(832.5);
      }
      for (const key of ['x', 'y', 'width', 'height'] as const) expect(samples.at(-1)![key]).toBeCloseTo(measured.firstHost[key], 0);
    }
    await close();
  }
  await context.close();
});
