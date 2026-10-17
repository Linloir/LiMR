import { test, expect } from './async-reader-continuity-support';

// Preserve the geometry and timeout of the original production regression.
test.use({ viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' });
test.setTimeout(45_000);

// The existing same-parent assertions now run on real Worker completion.
// Neither independent-engine fixture nor source-summary equality grants reuse.
for (const surface of ['aligned', 'adaptive']) test(`same ${surface} parent retains the table clone and latest runtime action`, async ({ page }, testInfo) => {
  await page.goto(`/async-reader-continuity.html?case=table&first=full&end=windowed&surface=${surface}`);
  await page.waitForFunction(() => { const a=(window as any).__stableHost; return a?.runtime&&!a.full&&a.workers.at(-1)?.held; });
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.locator('.limr-table-layout').getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  const clone = page.locator('.limr-table-full-content');
  await expect(clone).toHaveCount(1); await expect(clone).toBeVisible();
  await clone.getByAltText('Clone owner', { exact: true }).click();
  await page.locator('.limr-image-preview').getByRole('button', { name: 'Actual size', exact: true }).click();
  await page.evaluate(() => {
    const a = (window as any).__stableHost, old = a.runtime;
    const source = document.querySelector('.limr-table-layout'), clone = document.querySelector('.limr-table-full-content')!, image = clone.querySelector('img')!;
    const dialog = document.querySelector<HTMLDialogElement>('dialog')!, stage = document.querySelector<HTMLElement>('.limr-image-preview-stage')!;
    const card = clone.closest('.limr-sidebar-card') ?? clone.closest('[data-occurrence]');
    if (!card) throw new Error('Require a real sidebar card parent before handoff');
    const cluster = clone.closest('.limr-sidebar-cluster');
    stage.scrollTo(80, 120);
    const value = a.tableView = { old, source, clone, image, dialog, stage, card, cluster, focus: document.activeElement, offset: [stage.scrollLeft, stage.scrollTop], removed: [] as string[], close: 0, oldActions: 0 };
    for (const name of ['activate', 'hover'] as const) { const original = old[name].bind(old); old[name] = (...args: unknown[]) => { value.oldActions++; return original(...args); }; }
    dialog.addEventListener('close', () => value.close++);
    a.tableViewObserver = new MutationObserver(records => { for (const row of records) for (const node of row.removedNodes) if (node === clone || node === dialog || (node as Element).contains?.(clone) || (node as Element).contains?.(dialog)) value.removed.push(node.nodeName); });
    a.tableViewObserver.observe(document.body, { childList: true, subtree: true });
    a.complete();
  });
  await page.waitForFunction(() => (window as any).__stableHost.full);
  await page.waitForTimeout(400);
  const kept = await page.evaluate(() => {
    const a = (window as any).__stableHost, b = a.tableView; a.tableViewObserver.disconnect();
    const clone = document.querySelector('.limr-table-full-content');
    return { independent: b.old !== a.runtime, oldDisposed: b.old.signal.aborted, sameTable: document.querySelector('.limr-table-layout') === b.source,
      sameClone: clone === b.clone, sameImage: clone?.querySelector('img') === b.image, sameDialog: document.querySelector('dialog') === b.dialog,
      sameCard: (clone?.closest('.limr-sidebar-card') ?? clone?.closest('[data-occurrence]')) === b.card,
      sameCluster: clone?.closest('.limr-sidebar-cluster') === b.cluster, clusterPresent: !!b.cluster,
      connected: b.clone.isConnected && b.dialog.isConnected, open: b.dialog.open, original: b.stage.hasAttribute('data-original'),
      focus: document.activeElement === b.focus, offset: [b.stage.scrollLeft, b.stage.scrollTop], before: b.offset, close: b.close, removed: b.removed };
  });
  await testInfo.attach('table-parent-continuity.json', { body: Buffer.from(JSON.stringify(kept, null, 2)), contentType: 'application/json' });
  expect(kept.independent && kept.oldDisposed && kept.sameTable && kept.sameClone && kept.sameImage && kept.sameDialog && kept.sameCard && kept.sameCluster).toBe(true);
  if (surface === 'adaptive') expect(kept.clusterPresent).toBe(true);
  expect(kept.connected && kept.open && kept.original && kept.focus).toBe(true);
  expect(kept.before[0]).toBeGreaterThan(0); expect(kept.before[1]).toBeGreaterThan(0);
  expect(kept.offset).toEqual(kept.before); expect(kept.close).toBe(0); expect(kept.removed).toEqual([]);
  await page.keyboard.press('Escape'); await expect(clone.getByAltText('Clone owner', { exact: true })).toBeFocused();
  // Closing the dialog and expanding use the current context/data action. The
  // old shared Store may legitimately be shared; old runtime commands may not.
  await page.evaluate(() => { const a = (window as any).__stableHost; a.tableView.oldActions = 0; a.beforeExpandPresentation = a.runtime.presentation.get(); });
  await page.getByRole('button', { name: 'Expand in table', exact: true }).click();
  const action = await page.evaluate(() => { const a = (window as any).__stableHost; return { oldActions: a.tableView.oldActions, presentationChanged: a.runtime.presentation.get() > a.beforeExpandPresentation, active: a.runtime.interaction.get().active }; });
  expect(action.oldActions).toBe(0); expect(action.presentationChanged).toBe(true); expect(action.active).toBeNull();
});

test('last real prefix close remains closed after completion', async ({ page }) => {
  await page.goto('/async-reader-continuity.html?case=table&first=full&end=windowed');
  await page.waitForFunction(() => { const a=(window as any).__stableHost; return a?.runtime&&!a.full&&a.workers.at(-1)?.held; });
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.locator('.limr-table-layout').getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.evaluate(() => { const a = (window as any).__stableHost; if (a.runtime.interaction.get().active !== null) throw new Error('Prefix pin was not actually closed'); a.complete(); });
  await page.waitForFunction(() => (window as any).__stableHost.full); await page.waitForTimeout(400);
  expect(await page.evaluate(() => (window as any).__stableHost.runtime.interaction.get().active)).toBeNull();
  await expect(page.locator('.limr-annotation-overlay')).not.toBeVisible();
});
