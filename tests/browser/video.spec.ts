import { expect, test } from '@playwright/test';

test('video mounts the real provider near the viewport, supports click loading and shares math copying', async ({ page, context }) => {
  const requests: { url: string; referer?: string }[] = [];
  for (const pattern of ['https://www.youtube.com/embed/**', 'https://player.bilibili.com/**']) await page.route(pattern, async route => {
    requests.push({ url: route.request().url(), referer: route.request().headers().referer });
    await route.fulfill({ contentType: 'text/html', body: '<body style="background:#20242c;color:white">Provider fixture</body>' });
  });
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.goto('/?fixture=video');
  const videos = page.locator('.limr-video'), first = videos.first();
  await expect(first.locator('iframe')).toHaveAttribute('src', 'https://www.youtube.com/embed/M7lc1UVf-VE');
  await expect(first.locator('iframe')).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  await expect.poll(() => requests.length).toBe(1);
  expect(requests[0].referer).toBe('http://127.0.0.1:4173/');
  const dimensions = await first.locator('.limr-video-frame').boundingBox();
  expect(dimensions!.width).toBeLessThanOrEqual(560);
  expect(dimensions!.width / dimensions!.height).toBeCloseTo(16 / 9, 2);
  const copy = first.getByRole('button', { name: '复制', exact: true });
  await first.hover(); await expect(copy).toHaveCSS('opacity', '1'); await copy.click();
  await expect(first.getByRole('button', { name: '已复制' })).toHaveAttribute('data-variant', 'glass');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('<md-video provider="youtube" url="https://www.youtube.com/watch?v=M7lc1UVf-VE" title="YouTube video" />');
  await videos.nth(1).scrollIntoViewIfNeeded();
  await expect(videos.nth(1).locator('iframe')).toHaveAttribute('src', /player\.bilibili\.com\/player.html\?.*page=2/);
  await expect.poll(() => requests.length).toBe(2);
  await videos.last().scrollIntoViewIfNeeded();
  await expect(videos.last().locator('iframe')).toHaveCount(0);
  await videos.last().getByRole('button', { name: '播放视频' }).click();
  await expect(videos.last().locator('iframe')).toHaveCount(1);
  await expect.poll(() => requests.length).toBe(3);
});
