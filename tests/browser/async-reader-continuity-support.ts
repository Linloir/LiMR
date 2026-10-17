import { test as base, expect } from '@playwright/test';

// The normal Playwright/Vite server serves source modules. Frozen asset hashes
// belong to the separate production experiment, not this durable DOM test.
export const test = base.extend<{ audit: void }>({
  audit: [async ({ page, browser }, use, testInfo) => {
    const errors: string[] = [];
    const resources: Array<{ url: string; status: number; type: string }> = [];
    const workers: string[] = [];
    page.on('worker', worker => workers.push(worker.url()));
    page.on('pageerror', error => errors.push(error.stack ?? String(error)));
    page.on('console', message => {
      if (message.type() === 'error') errors.push('console: ' + message.text());
    });
    page.on('response', response => resources.push({
      url: response.url(), status: response.status(), type: response.request().resourceType(),
    }));

    await use();

    const protocol = await page.evaluate(() => {
      const api = (window as any).__stableHost;
      return api ? {
        complete: api.full,
        worker: api.state?.capabilities.worker,
        sourceExact: api.commands?.document.getSnapshot().source === api.expectedSource,
        independent: api.engines.before !== api.engines.after,
        workerCount: api.workers.length,
        prefixes: api.workers.flatMap((worker: any) => worker.messages.filter((message: any) =>
          message.type === 'snapshot' && message.complete === false)),
        finals: api.workers.filter((worker: any) => worker.released).length,
      } : null;
    });
    const origin = new URL(page.url()).origin;
    // Match the actual Worker observed by Playwright, not only the fixture's
    // Worker factory counter. Vite may add a source-worker query string or /@fs.
    const workerIdentity = workers.length > 0 && workers.length === protocol?.workerCount && workers.every(url => {
      const parsed = new URL(url);
      return parsed.origin === origin && parsed.pathname.endsWith('/src/worker.ts');
    });
    const localResponses = resources.filter(resource => new URL(resource.url).origin === origin);
    const checks = {
      workerIdentity,
      realProgressiveProtocol: !!protocol && protocol.complete && protocol.worker && protocol.sourceExact &&
        protocol.independent && protocol.prefixes.length > 0 && protocol.finals > 0,
      noPageOrConsoleErrors: errors.length === 0,
      executedPageRequestedJS: localResponses.some(resource => resource.type === 'script'),
      noFailedLocalResponses: localResponses.length > 0 && localResponses.every(resource => resource.status < 400),
    };
    await testInfo.attach('runtime-protocol.json', {
      body: Buffer.from(JSON.stringify({ browserVersion: browser.version(), checks, resources, errors, workers, protocol }, null, 2)),
      contentType: 'application/json',
    });
    expect(checks.workerIdentity).toBe(true);
    expect(checks.realProgressiveProtocol).toBe(true);
    expect(checks.noPageOrConsoleErrors, errors.join('\n')).toBe(true);
    expect(checks.executedPageRequestedJS).toBe(true);
    expect(checks.noFailedLocalResponses, JSON.stringify(localResponses)).toBe(true);
  }, { auto: true }],
});

export { expect };
