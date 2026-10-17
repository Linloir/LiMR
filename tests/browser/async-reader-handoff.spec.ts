import { expect, test } from '@playwright/test';

for (const options of [
  { typography: 'standard', automaticWindowing: true, elementScroll: true, virtualization: undefined },
  { typography: 'knuth-plass', automaticWindowing: true, elementScroll: false, virtualization: undefined },
  { typography: 'standard', automaticWindowing: false, elementScroll: true, virtualization: undefined },
  { typography: 'standard', automaticWindowing: false, elementScroll: true, virtualization: false },
] as const) test(`progressive handoff preserves the visible character (${options.typography}, auto=${options.automaticWindowing}, element=${options.elementScroll}, virtualization=${options.virtualization})`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(options => {
    let scrollRoot: HTMLElement | undefined;
    if (options.elementScroll) {
      scrollRoot = document.createElement('div'); scrollRoot.id = 'handoff-scroll';
      scrollRoot.style.cssText = 'height:680px;overflow:auto;margin-top:28px';
      document.body.append(scrollRoot); scrollRoot.append(document.getElementById('root')!);
    }
    (window as any).reading.render({ mib: 2, mode: 'progressive', holdCompletion: true,
      typography: options.typography, automaticWindowing: options.automaticWindowing, virtualization: options.virtualization, scrollRoot, toc: false, sidebar: false });
  }, options);
  await expect.poll(() => page.evaluate(() => (window as any).reading.completionQueued)).toBe(true);
  await expect(page.locator('.limr-document-loading[data-provisional]')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.locator('[data-limr-windowed]').count()).toBe(options.automaticWindowing || options.virtualization === false ? 0 : 1);
  await page.evaluate(() => (document.getElementById('handoff-scroll') ?? window).scrollTo({ top: 720, behavior: 'instant' }));
  await expect.poll(() => page.evaluate(() => (window as any).reading.api.getReadingPosition()?.source ?? 0)).toBeGreaterThan(300);
  await page.waitForTimeout(100);
  const before = await page.evaluate(() => (window as any).reading.api.getReadingPosition());
  expect(before.source).toBeGreaterThan(300);
  const frames = await page.evaluate(async position => {
    const audit = (window as any).reading, frames: Array<{ complete: boolean; distance: number | null }> = [];
    audit.releaseCompletion();
    for (let index = 0; index < 12; index++) {
      await new Promise(requestAnimationFrame);
      const top = document.getElementById('handoff-scroll')?.getBoundingClientRect().top ?? 0;
      const actual = audit.positionRect(position);
      frames.push({ complete: audit.api.isDocumentComplete(), distance: actual === undefined ? null : actual - top - position.offset });
    }
    return frames;
  }, before);
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  const complete = frames.filter(frame => frame.complete);
  expect(complete.length).toBeGreaterThan(5);
  for (const frame of complete) { expect(frame.distance).not.toBeNull(); expect(Math.abs(frame.distance!)).toBeLessThan(2); }
  await expect(page.locator('[data-limr-windowed]')).toHaveCount(options.virtualization === false ? 0 : 1);
  await expect(page.locator('.limr-document-loading')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).reading.api.document.getSnapshot().source.endsWith('THE-END-OF-THE-COMPLETE-BOOK\n'))).toBe(true);
  expect(errors).toEqual([]);
});

test('completing a reader below the viewport preserves the outer page position', async ({ page }) => {
  await page.goto('/large-reader.html');
  await page.evaluate(() => {
    const intro = document.createElement('div'); intro.style.height = '1200px'; intro.textContent = 'Outer page'; document.body.prepend(intro);
    (window as any).reading.render({ mib: 2, mode: 'progressive', holdCompletion: true, automaticWindowing: true, toc: false, sidebar: false });
  });
  await expect.poll(() => page.evaluate(() => (window as any).reading.completionQueued)).toBe(true);
  await page.evaluate(() => (window as any).reading.releaseCompletion());
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  expect(await page.evaluate(() => scrollY)).toBe(0);
});


test('progress preserves Reader configuration while changed props and children still apply', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.goto('/large-reader.html');
  await page.evaluate(() => (window as any).reading.progressRegression());
  await expect.poll(() => page.evaluate(() => (window as any).reading.progressRegressionState.completionQueued)).toBe(true);
  await expect(page.locator('.limr-document-loading[data-provisional]')).toBeVisible();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const starts = await page.evaluate(() => {
    const audit = (window as any).reading, check = audit.progressRegressionState;
    check.runtime = audit.runtime; check.configuration = audit.runtime.configuration.get();
    check.paragraph = audit.runtime.content.querySelector('p');
    return audit.workerStarts;
  });
  for (let i = 0; i < 3; i++) {
    const step = await page.evaluate(() => {
      const check = (window as any).reading.progressRegressionState;
      const before = check.history.length, message = check.releaseOne(); return { before, message };
    });
    expect(step.message.type).toBe('progress');
    await expect.poll(() => page.evaluate(() => (window as any).reading.progressRegressionState.history.length)).toBe(step.before + 1);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    expect(await page.evaluate(() => {
      const audit = (window as any).reading, check = audit.progressRegressionState;
      return { sameRuntime: audit.runtime === check.runtime, sameConfiguration: audit.runtime.configuration.get() === check.configuration,
        sameParagraph: check.paragraph.isConnected && audit.runtime.content.querySelector('p') === check.paragraph,
        callback: check.history.at(-1), progress: document.querySelector<HTMLProgressElement>('.limr-document-loading progress')!.value };
    })).toEqual({ sameRuntime: true, sameConfiguration: true, sameParagraph: true,
      callback: { status: 'loading', phase: step.message.progress.phase, loaded: step.message.progress.loaded, total: step.message.progress.total, complete: false, observer: 0 },
      progress: .1 + .75 * Math.min(1, step.message.progress.loaded / step.message.progress.total) });
  }
  await page.getByRole('button', { name: 'Update reader props', exact: true }).click();
  await expect(page.getByTestId('progress-reader-child')).toHaveText('Updated Reader child');
  await expect.poll(() => page.evaluate(() => (window as any).reading.runtime.configuration.get().theme)).toBe('dark');
  expect(await page.evaluate(() => (window as any).reading.runtime.configuration.get().annotations.map((annotation: { id: string }) => annotation.id))).toEqual(['progress-highlight']);
  const before = await page.evaluate(() => { const check = (window as any).reading.progressRegressionState; const count = check.history.length; const next = check.releaseOne(); if (next.type !== 'progress') throw new Error('Expected actual progress'); return count; });
  await expect.poll(() => page.evaluate(() => (window as any).reading.progressRegressionState.history.length)).toBe(before + 1);
  expect(await page.evaluate(() => (window as any).reading.progressRegressionState.history.at(-1).observer)).toBe(1);
  expect(await page.evaluate(() => (window as any).reading.workerStarts)).toBe(starts);
  await page.evaluate(() => (window as any).reading.progressRegressionState.releaseAll());
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await expect(page.getByTestId('progress-reader-child')).toBeAttached();
  expect(await page.evaluate(() => {
    const audit = (window as any).reading, check = audit.progressRegressionState;
    return { exactSnapshot: audit.api.document.getSnapshot() === check.finalSnapshot,
      exactSource: audit.api.document.getSnapshot().source === check.source, complete: audit.api.isDocumentComplete(), observer: check.history.at(-1).observer };
  })).toEqual({ exactSnapshot: true, exactSource: true, complete: true, observer: 1 });
  expect(errors).toEqual([]);
});
