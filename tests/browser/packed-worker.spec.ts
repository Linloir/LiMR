import { expect, test } from '@playwright/test';

for (const mode of ['blocking', 'progressive'] as const) test(`packed Worker results retain references and complete reading (${mode})`, async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    (window as any).packedAudit = [];
    window.Worker = class extends NativeWorker {
      record = { packed: 0, pages: 0, terminated: false };
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options); (window as any).packedAudit.push(this.record);
        this.addEventListener('message', event => {
          if (event.data.type !== 'snapshot-packed') return;
          this.record.packed++;
          this.record.pages = event.data.packed.records.length + event.data.packed.strings.length;
        });
      }
      terminate() { this.record.terminated = true; super.terminate(); }
    };
  });
  await page.goto('/large-reader.html');
  await expect.poll(() => page.evaluate(() => (window as any).reading.state?.status)).toBe('ready');
  await page.evaluate(mode => {
    const unit = '## Chapter\n\nA [global reference][target] and a footnote [^note]. ' + 'Complete text with **formatting**. '.repeat(8) + '\n\n';
    const source = unit.repeat(4000) + '\n## Final packed chapter\n\nPACKED-DOCUMENT-END\n\n[target]: /packed-target\n\n[^note]: Complete footnote.\n';
    const audit = (window as any).reading;
    audit.expectedPackedSource = source;
    audit.render({ source, mode, toc: false, sidebar: false });
  }, mode);
  await expect.poll(() => page.evaluate(() => {
    const audit = (window as any).reading;
    return audit.state?.status === 'ready' && audit.state.document?.getSnapshot().source === audit.expectedPackedSource;
  }), { timeout: 30000 }).toBe(true);
  await expect.poll(() => page.evaluate(() => {
    const audit = (window as any).reading;
    return audit.api?.document === audit.state.document;
  })).toBe(true);
  const result = await page.evaluate(() => {
    const audit = (window as any).reading, snapshot = audit.api.document.getSnapshot();
    return {
      sourceExact: snapshot.source === audit.expectedPackedSource,
      definitionAlias: snapshot.definitions.get('target') === snapshot.blocks.find((block: any) => block.node.type === 'definition')?.node,
      footnoteAlias: snapshot.footnotes.get('note') === snapshot.blocks.find((block: any) => block.node.type === 'footnoteDefinition')?.node,
      diagnostics: snapshot.diagnostics, complete: audit.api.isDocumentComplete(),
      transport: (window as any).packedAudit.at(-1),
    };
  });
  expect(result).toMatchObject({ sourceExact: true, definitionAlias: true, footnoteAlias: true, diagnostics: [], complete: true, transport: { packed: 1, terminated: true } });
  expect(result.transport.pages).toBeGreaterThan(1);
  await expect(page.locator('[data-limr-windowed]')).toHaveCount(1);
  await page.evaluate(() => {
    const audit = (window as any).reading, start = audit.expectedPackedSource.indexOf('PACKED-DOCUMENT-END');
    audit.api.scrollToSource({ start, end: start + 19 });
  });
  await expect(page.getByText('PACKED-DOCUMENT-END', { exact: true })).toBeInViewport();
  expect(errors).toEqual([]);
});
