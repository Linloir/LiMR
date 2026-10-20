import { expect, test, type Page } from '@playwright/test';

async function openHome(page: Page) {
  await page.goto('/#/home');
  await expect(page.locator('main.home')).toBeVisible();
}

async function setEnglish(page: Page) {
  await page.getByRole('button', { name: '界面语言 / Reader language' }).click();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('main.home')).toHaveAttribute('lang', 'en');
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

for (const entry of ['/', '/#/']) {
  test(`the default entry ${entry} opens Home and preserves explicit Playground navigation`, async ({ page }) => {
    await page.goto(entry);
    const home = page.locator('main.home');
    const navigation = page.getByRole('navigation', { name: '页面 / Pages' });
    const homeLink = navigation.getByRole('link', { name: 'Home', exact: true });
    const playgroundLink = navigation.getByRole('link', { name: 'Playground', exact: true });
    await expect(home).toBeVisible();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
    await expect(playgroundLink).not.toHaveAttribute('aria-current');
    await expect(page.locator('.demo-commandbar')).toHaveCount(0);
    await page.reload();
    await expect(home).toBeVisible();
    await playgroundLink.click();
    await expect(page).toHaveURL(/#\/playground$/);
    await expect(page.getByRole('button', { name: '编辑', exact: true })).toBeVisible();
    await expect(playgroundLink).toHaveAttribute('aria-current', 'page');
    await page.goBack();
    await expect(home).toBeVisible();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
    await page.goForward();
    await expect(page.getByRole('button', { name: '编辑', exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: '编辑', exact: true })).toBeVisible();
    await expect(home).toHaveCount(0);
    await page.locator('.demo-brand').click();
    await expect(home).toBeVisible();
    await expect(homeLink).toHaveAttribute('aria-current', 'page');
  });
}

test('Home navigation preserves an unsaved Playground draft and editor state', async ({ page }) => {
  const draft = '# A thought to keep\n\nAn **unsaved** paragraph with $x^2$.';
  await page.goto('/#/playground');
  await page.getByRole('button', { name: '编辑', exact: true }).click();
  await page.getByRole('textbox', { name: 'Markdown source' }).fill(draft);
  const navigation = page.getByRole('navigation', { name: '页面 / Pages' });
  await navigation.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL(/#\/home$/);
  await expect(navigation.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('main.home h1')).toContainText('阅读体验');
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveCount(0);
  await page.getByRole('link', { name: '进入 Playground', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Markdown source' })).toHaveValue(draft);
  await expect(navigation.getByRole('link', { name: 'Playground', exact: true })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('button', { name: '保存', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'A thought to keep' })).toBeVisible();
});

test('rendering examples provide real highlight paint, an interactive footnote, KaTeX, and Shiki', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await openHome(page);
  const demo = page.locator('.home-render-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.limr-paint-background').first()).toBeVisible();
  await demo.locator('.limr-mark').click();
  await expect(page.locator('.limr-annotation-overlay')).toContainText('这是一个真正的 LiMR 脚注');
  await page.keyboard.press('Escape');
  await demo.getByRole('button', { name: '公式', exact: true }).click();
  await expect(demo.locator('.katex')).toHaveCount(2);
  await expect(demo.locator('.katex-display')).toBeVisible();
  await expect(demo.getByRole('button', { name: '公式', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await demo.getByRole('button', { name: '代码', exact: true }).click();
  await expect(demo.locator('pre.shiki')).toContainText("import { Reader } from '@linloir/limr'");
  await expect(demo.locator('.limr-code-copy')).toBeVisible();
  await demo.getByRole('button', { name: '文章', exact: true }).click();
  await expect(demo.locator('.limr-mark')).toBeVisible();
  expect(errors).toEqual([]);
});

test('Knuth–Plass changes the actual paragraph layout and responds to keyboard width adjustment', async ({ page }) => {
  await openHome(page);
  const demo = page.locator('.home-typography-demo');
  await demo.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const paragraph = demo.locator('.limr-prose > p').first();
  await expect(paragraph).toHaveAttribute('data-limr-kp');
  const original = await paragraph.textContent();
  const paper = demo.locator('.home-typography-page');
  const wide = (await paper.boundingBox())!.width;
  const wideLines = Number(await paragraph.getAttribute('data-limr-kp-lines'));
  const slider = demo.getByRole('slider', { name: '调整纸张宽度' });
  await slider.focus();
  await page.keyboard.press('Home');
  await expect(slider).toHaveValue('64');
  await expect(demo.locator('output')).toHaveText('64%');
  await expect.poll(async () => (await paper.boundingBox())!.width).toBeLessThan(wide * .7);
  await expect.poll(async () => Number(await paragraph.getAttribute('data-limr-kp-lines'))).toBeGreaterThan(wideLines);
  await expect(paragraph).toHaveText(original!);
  await demo.getByRole('button', { name: '标准', exact: true }).click();
  await expect(paragraph).not.toHaveAttribute('data-limr-kp');
  await expect(paragraph).toHaveText(original!);
  await demo.getByRole('button', { name: 'Knuth–Plass', exact: true }).click();
  await expect(paragraph).toHaveAttribute('data-limr-kp');
});

test('stream playback pauses, resumes, replays, and finishes with rendered math and code', async ({ page }) => {
  await openHome(page);
  const demo = page.locator('.home-stream-demo');
  await demo.scrollIntoViewIfNeeded();
  const progress = demo.getByRole('progressbar');
  const cursor = async () => Number(await progress.getAttribute('aria-valuenow'));
  await expect(progress).toHaveAttribute('aria-valuenow', '0');
  await demo.getByRole('button', { name: '播放', exact: true }).click();
  await expect.poll(cursor).toBeGreaterThan(30);
  await demo.getByRole('button', { name: '暂停', exact: true }).click();
  const paused = await cursor();
  const text = await demo.locator('.limr-prose').textContent();
  await expect(demo.locator('.home-demo-toolbar').getByRole('status')).toHaveText('已暂停');
  // Wait longer than several source intervals to prove that pause stops output.
  await page.waitForTimeout(200);
  expect(await cursor()).toBe(paused);
  await expect(demo.locator('.limr-prose')).toHaveText(text!);
  await demo.getByRole('button', { name: '继续', exact: true }).click();
  await expect.poll(cursor).toBeGreaterThan(paused);
  await demo.getByRole('button', { name: '重播', exact: true }).click();
  await expect.poll(cursor).toBeLessThan(paused);
  await expect(demo.locator('.home-demo-toolbar').getByRole('status')).toHaveText('正在生成');
  await expect(demo.locator('.home-demo-toolbar').getByRole('status')).toHaveText('已完成', { timeout: 12000 });
  expect(await cursor()).toBe(Number(await progress.getAttribute('aria-valuemax')));
  await expect(demo.locator('.katex')).toBeVisible();
  await expect(demo.locator('pre.shiki')).toContainText('<Markdown source={text} streaming={loading} />');
  await demo.getByRole('button', { name: '重播', exact: true }).click();
  await expect(demo.getByRole('button', { name: '暂停', exact: true })).toBeVisible();
});

test('quick start offers working package-manager commands and copies the exact install and app code', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await openHome(page);
  await page.getByRole('button', { name: '快速开始', exact: true }).click();
  const install = page.locator('.home-install');
  await expect(page.getByRole('link', { name: '阅读完整接入指南', exact: true })).toBeFocused();
  for (const [manager, command] of [
    ['npm', 'npm install @linloir/limr'],
    ['pnpm', 'pnpm add @linloir/limr'],
    ['yarn', 'yarn add @linloir/limr'],
  ]) {
    await install.getByRole('button', { name: manager, exact: true }).click();
    await expect(install.locator('.home-install-command code')).toHaveText(command);
    await install.getByRole('button', { name: '复制代码', exact: true }).click();
    await expect(install.getByRole('status')).toHaveText('已复制');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(command);
  }
  await page.locator('.home-start-code > .home-code-heading').getByRole('button', { name: '复制代码', exact: true }).click();
  const app = await page.evaluate(() => navigator.clipboard.readText());
  expect(app).toContain("import '@linloir/limr/styles.css';");
  expect(app).toContain("import '@linloir/limr/math.css';");
  expect(app).toContain('<Reader source={source} locale={chinese} />');
  expect(app).not.toMatch(/^\d+import/m);
  await page.getByRole('link', { name: '阅读完整接入指南', exact: true }).click();
  await expect(page).toHaveURL(/#\/docs\/zh-CN\/getting-started$/);
});

test('extension tabs support keyboard navigation and link to the selected API guide', async ({ page }) => {
  await openHome(page);
  const tabs = page.getByRole('tablist', { name: '扩展能力' });
  await tabs.getByRole('tab', { name: /语法扩展/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: /旁注扩展/ })).toBeFocused();
  await expect(page.getByRole('tabpanel')).toContainText('defineAnnotation');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText('--limr-font-text');
  await page.keyboard.press('End');
  await expect(tabs.getByRole('tab', { name: /插件能力/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('tabpanel')).toContainText('defineExtension');
  await expect(page.getByRole('tabpanel').getByRole('link', { name: '探索开发接口' })).toHaveAttribute('href', '#/docs/zh-CN/plugin-packages');
  await page.keyboard.press('Home');
  await expect(tabs.getByRole('tab', { name: /语法扩展/ })).toBeFocused();
});

test('language and theme controls update the homepage and real renderer demos', async ({ page }) => {
  await openHome(page);
  await setEnglish(page);
  await expect(page.locator('main.home h1')).toContainText('wonderful.');
  const render = page.locator('.home-render-demo');
  await expect(render.getByRole('button', { name: 'Article', exact: true })).toBeVisible();
  await expect(render.locator('.limr-prose')).toContainText('Good ideas deserve a little space.');
  await page.getByRole('button', { name: 'Dark', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(render.locator('.limr-prose')).toHaveAttribute('data-limr-theme', 'dark');
  const dark = await page.locator('main.home').evaluate(element => getComputedStyle(element).color);
  await page.getByRole('button', { name: 'Light', exact: true }).click();
  await expect(render.locator('.limr-prose')).toHaveAttribute('data-limr-theme', 'light');
  expect(await page.locator('main.home').evaluate(element => getComputedStyle(element).color)).not.toBe(dark);
  await page.reload();
  await expect(page.locator('main.home')).toHaveAttribute('lang', 'en');
  await page.getByRole('button', { name: '界面语言 / Reader language' }).click();
  await page.getByRole('button', { name: '中文', exact: true }).click();
  await expect(page.locator('main.home')).toHaveAttribute('lang', 'zh-CN');
  await expect(render.getByRole('button', { name: '文章', exact: true })).toBeVisible();
});

for (const width of [320, 390, 1440]) for (const language of ['zh-CN', 'en']) {
  test(`homepage keeps ${language} content and controls within a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    await openHome(page);
    if (language === 'en') await setEnglish(page);
    for (const section of await page.locator('.home-hero, .home-section, .home-performance, .home-footer').all()) {
      await section.scrollIntoViewIfNeeded();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
    const render = page.locator('.home-render-demo');
    await render.getByRole('button', { name: language === 'en' ? 'Code' : '代码', exact: true }).click();
    await expect(render.locator('pre.shiki')).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    const controlBounds = await page.locator('.home-demo-toolbar button, .home-width-control input, .home-manager-tabs button').evaluateAll(elements => elements.map(element => {
      const { left, right } = element.getBoundingClientRect();
      return { left, right };
    }));
    expect(controlBounds.every(bounds => bounds.left >= -1 && bounds.right <= width + 1)).toBe(true);
  });
}

test('reduced motion removes decorative animation and leaves streaming under explicit control', async ({ page }) => {
  await openHome(page);
  await expect(page.locator('.home-hero-copy')).toHaveCSS('animation-name', 'none');
  const paper = page.locator('.home-paper-stack');
  const transform = await paper.evaluate(element => getComputedStyle(element).transform);
  await page.locator('.home-art').hover({ position: { x: 20, y: 20 } });
  expect(await paper.evaluate(element => getComputedStyle(element).transform)).toBe(transform);
  const demo = page.locator('.home-stream-demo');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.home-demo-toolbar').getByRole('status')).toHaveText('准备就绪');
  await page.waitForTimeout(200);
  await expect(demo.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await demo.getByRole('button', { name: '播放', exact: true }).click();
  await expect.poll(() => demo.getByRole('progressbar').getAttribute('aria-valuenow')).not.toBe('0');
});

test('streaming begins when its demo enters the viewport with normal motion enabled', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openHome(page);
  const demo = page.locator('.home-stream-demo');
  await expect(demo.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  await demo.scrollIntoViewIfNeeded();
  await expect(demo.locator('.home-demo-toolbar').getByRole('status')).toHaveText('正在生成');
  await expect.poll(() => demo.getByRole('progressbar').getAttribute('aria-valuenow')).not.toBe('0');
});
