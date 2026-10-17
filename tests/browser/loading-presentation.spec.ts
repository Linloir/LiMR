import { expect, test } from '@playwright/test';

// Hold real worker results so both presentation modes can be inspected before
// completion, without relying on machine speed or replacing parser behavior.
for (const mode of ['blocking', 'progressive'] as const) test(`Playground owns one continuous progress bar in ${mode} mode`, async ({ page }) => {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        const nativeListen = this.addEventListener.bind(this), queue: (() => void)[] = [];
        const gate = (window as any).loadingGate = { complete: false, flush: () => { while (queue.length) queue.shift()!(); }, finish: () => {} };
        this.addEventListener = ((type: string, listener: EventListener, options?: AddEventListenerOptions) => {
          if (type !== 'message') { nativeListen(type, listener, options); return; }
          nativeListen('message', event => {
            const message = event as MessageEvent;
            if (message.data.type === 'snapshot' && message.data.complete) {
              gate.complete = true;
              gate.finish = () => listener.call(this, event);
            } else queue.push(() => listener.call(this, event));
          }, options);
        }) as Worker['addEventListener'];
      }
    };
  });
  await page.goto('/#/playground');
  if (mode === 'progressive') {
    await page.getByRole('button', { name: '加载', exact: true }).click();
    await page.getByRole('button', { name: /边加载边阅读/ }).click();
  }
  const source = '# Shared loading bar\n\n' + 'Readable paragraphs remain available while the complete document is prepared. '.repeat(8).concat('\n\n').repeat(400);
  await page.locator('input[type=file]').setInputFiles({ name: 'loading.md', mimeType: 'text/markdown', buffer: Buffer.from(source) });
  const bar = page.getByRole('progressbar', { name: '文档加载进度' });
  await expect(bar).toHaveAttribute('aria-valuenow', '0');
  await bar.evaluate(element => { (window as any).originalLoadingBar = element; });
  await expect.poll(() => page.evaluate(() => (window as any).loadingGate.complete)).toBe(true);
  await page.evaluate(() => (window as any).loadingGate.flush());
  await expect(bar).toHaveAttribute('aria-valuenow', '95');
  await expect(page.getByRole('progressbar')).toHaveCount(1);
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  expect(await bar.evaluate(element => element === (window as any).originalLoadingBar)).toBe(true);
  await expect(page.getByRole('heading', { name: 'Shared loading bar' })).toHaveCount(mode === 'progressive' ? 1 : 0);
  await page.getByRole('button', { name: '取消加载', exact: true }).click();
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await expect(page.getByText('已取消加载', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '重新加载', exact: true }).click();
  await expect(bar).toHaveAttribute('aria-valuenow', '0');
  await expect.poll(() => page.evaluate(() => (window as any).loadingGate.complete)).toBe(true);
  await page.evaluate(() => { (window as any).loadingGate.flush(); (window as any).loadingGate.finish(); });
  await expect(page.getByRole('heading', { name: 'Shared loading bar' })).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveCount(0);
  await expect(page.locator('.demo-load-status')).toHaveCount(0);
});

test('AsyncReader exposes host actions while preserving the fallback retry argument', async ({ page }) => {
  await page.goto('/large-reader.html');
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(() => (window as any).reading.render({ source: '# Host-owned UI', holdCompletion: true,
    loadingFallback: (_state: unknown, retry: () => void, controls: { retry: () => void; cancel: () => void }) => {
      (window as any).fallbackControls = controls; (window as any).legacyRetry = retry; return null;
    },
  }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.completionQueued)).toBe(true);
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).fallbackControls === (window as any).reading.controls && (window as any).legacyRetry === (window as any).reading.controls.retry)).toBe(true);
  await page.evaluate(() => (window as any).reading.controls.cancel());
  await expect.poll(() => page.evaluate(() => (window as any).reading.state.status)).toBe('cancelled');
  const starts = await page.evaluate(() => (window as any).reading.workerStarts);
  await page.evaluate(() => (window as any).legacyRetry());
  await expect.poll(() => page.evaluate(() => (window as any).reading.workerStarts)).toBe(starts + 1);
  await expect.poll(() => page.evaluate(() => (window as any).reading.completionQueued)).toBe(true);
  await page.evaluate(() => (window as any).reading.releaseCompletion());
  await expect(page.getByRole('heading', { name: 'Host-owned UI' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as any).reading.state.overallProgress)).toBe(1);
});
