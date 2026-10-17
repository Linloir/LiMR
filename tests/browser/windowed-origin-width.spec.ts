import { expect, test } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

test.use({ viewport: { width: 1440, height: 1000 } });

test('header origin and width changes preserve the same source glyph', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const evidence: any = { test: { id: info.testId, project: info.project.name, retry: info.retry, workerIndex: info.workerIndex }, errors, stage: 'setup' };
  try {
    await page.goto('/large-reader.html');
    await page.evaluate(() => {
      document.documentElement.style.overflowAnchor = 'none';
      document.body.style.overflowAnchor = 'none';
      const root = document.getElementById('root')!;
      root.style.width = '1000px'; root.style.maxWidth = 'none';
      const header = document.createElement('header'); header.id = 'fixed-fixture-header';
      header.style.cssText = 'height:64px;overflow-anchor:none';
      header.textContent = 'Reader toolbar'; root.before(header);
      const phrase = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。';
      const source = Array.from({ length: 500 }, (_, index) => `Paragraph ${index}. ${phrase.repeat(12)}\n\n`).join('');
      (window as any).reading.render({ source, typography: 'standard', sidebar: false, toc: false });
    });
    await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
    await page.evaluate(async () => { await document.fonts.ready; const { api } = (window as any).reading;
      const source = api.document.getSnapshot().source.indexOf('Paragraph 250.') + 250;
      api.restoreReadingPosition({ source, offset: 24 });
    });
    await page.waitForTimeout(150);
    expect(errors).toEqual([]);
    evidence.stage = 'before-change';
    evidence.change = await page.evaluate(() => {
      const audit = (window as any).reading, target = audit.api.getReadingPosition();
      if (!target) throw new Error('No initial reading position');
      const host = document.querySelector('[data-limr-windowed]') as HTMLElement;
      const sample = () => ({ physical: scrollY, origin: host.getBoundingClientRect().top + scrollY,
        width: host.clientWidth, glyph: audit.positionRect(target), height: host.getBoundingClientRect().height,
        source: target.source, text: audit.api.document.getSnapshot().source.slice(target.source, target.source + 2) });
      const before = sample();
      document.getElementById('fixed-fixture-header')!.style.height = '160px';
      document.getElementById('root')!.style.width = '650px';
      const immediate = sample();
      return { target, before, immediate, workerStarts: audit.workerStarts, capability: audit.capability, worker: audit.state.capabilities.worker };
    });
    expect(evidence.change.worker).toBe(true);
    expect(Number.isFinite(evidence.change.target.source)).toBe(true);
    expect(Number.isFinite(evidence.change.target.offset)).toBe(true);
    expect(Number.isFinite(evidence.change.before.glyph)).toBe(true);
    expect(Math.abs(evidence.change.before.glyph - evidence.change.target.offset)).toBeLessThanOrEqual(2);
    expect(evidence.change.before.width).toBeGreaterThan(0);
    expect(evidence.change.immediate.width).toBeGreaterThan(0);
    expect(evidence.change.before.height).toBeLessThan(8_000_000);
    expect(evidence.change.immediate.physical).toBe(evidence.change.before.physical);
    expect(evidence.change.immediate.origin - evidence.change.before.origin).toBe(96);
    expect(evidence.change.immediate.width).not.toBe(evidence.change.before.width);
    evidence.setupValid = true;
    evidence.stage = 'original-150ms-glyph';
    await page.waitForTimeout(150);
    evidence.at150 = await page.evaluate(target => { const audit = (window as any).reading;
      return { glyph: audit.positionRect(target), physical: scrollY,
        origin: document.querySelector('[data-limr-windowed]')!.getBoundingClientRect().top + scrollY,
        actual: audit.api.getReadingPosition(), source: target.source,
        text: audit.api.document.getSnapshot().source.slice(target.source, target.source + 2) };
    }, evidence.change.target);
    expect(errors).toEqual([]);
    expect(evidence.at150.text).toBe(evidence.change.before.text);
    expect(Number.isFinite(evidence.at150.glyph)).toBe(true);
    evidence.drift = evidence.at150.glyph - evidence.change.target.offset;
    expect(Math.abs(evidence.drift)).toBeLessThanOrEqual(2);
    evidence.stage = 'passed';
  } finally {
    await writeFile(info.outputPath('origin-width.json'), JSON.stringify(evidence, null, 2));
  }
});
