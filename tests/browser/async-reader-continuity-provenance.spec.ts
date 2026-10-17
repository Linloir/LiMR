import { test, expect } from './async-reader-continuity-support';

// Preserve the geometry and timeout of the original production regression.
test.use({ viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' });
test.setTimeout(45_000);

// An external array is never treated as the AsyncReader-owned provisional []
// merely because it is empty. Deliver final while the parent input changes;
// do not manually mutate either runtime or the private scope registry.
test('public empty annotations to undefined does not inherit the old table view', async ({ page }, testInfo) => {
  await page.goto('/async-reader-continuity.html?case=table&first=full&end=windowed');
  await page.waitForFunction(() => { const a=(window as any).__stableHost; return a?.runtime&&!a.full&&a.workers.at(-1)?.held; });
  await page.evaluate(() => (window as any).__stableHost.setAnnotations(Object.freeze([])));
  await page.waitForFunction(() => { const a=(window as any).__stableHost; return Array.isArray(a.runtime.configuration.get().annotations)&&a.readScopeReceipt().privateEmpty===false; });
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready', 'true');
  await page.locator('.limr-table-layout').getByRole('button', { name: 'Full cell content', exact: true }).first().click();
  await expect(page.locator('.limr-annotation-overlay')).toBeVisible();
  await page.evaluate(() => { const a=(window as any).__stableHost; a.rejectedClone=document.querySelector('.limr-table-full-content'); a.setAnnotations(undefined); a.complete(); });
  await page.waitForFunction(() => (window as any).__stableHost.full);
  const result=await page.evaluate(() => { const a=(window as any).__stableHost; return { oldCloneConnected:a.rejectedClone.isConnected, active:a.runtime.interaction.get().active, annotationsUndefined:a.runtime.configuration.get().annotations===undefined, oldDisposed:a.prefixRuntime.signal.aborted }; });
  await testInfo.attach('public-annotations-rejection.json', { body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json' });
  expect(result).toEqual({oldCloneConnected:false,active:null,annotationsUndefined:true,oldDisposed:true});
});

test('a new request cannot reuse the prior request table dialog', async ({ page }, testInfo) => {
  await page.goto('/async-reader-continuity.html?case=table&first=full&end=windowed');
  await page.waitForFunction(() => { const a=(window as any).__stableHost; return a?.runtime&&!a.full&&a.workers.at(-1)?.held; });
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready','true');
  await page.locator('.limr-table-layout').getByRole('button',{name:'Full cell content',exact:true}).first().click();
  await page.locator('.limr-table-full-content').getByAltText('Clone owner',{exact:true}).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.evaluate(() => {const a=(window as any).__stableHost;a.oldDialog=document.querySelector('dialog');a.oldWorker=a.workers[0];a.expectedSource='# Replacement request\n\n'+('Different source paragraph. '.repeat(80)+'\n\n').repeat(100);a.replaceInput(a.expectedSource);});
  await page.waitForFunction(() => {const a=(window as any).__stableHost;return a.workers.length===2&&a.workers[1].held&&!a.full;});
  await page.evaluate(() => (window as any).__stableHost.complete());
  await page.waitForFunction(() => (window as any).__stableHost.full);
  const result=await page.evaluate(() => {const a=(window as any).__stableHost;return{oldTerminated:a.oldWorker.terminated,staleRelease:a.oldWorker.release(),dialogConnected:a.oldDialog.isConnected,dialogs:document.querySelectorAll('dialog').length,oldDiscarded:a.oldWorker.discardedFinal};});
  await testInfo.attach('new-request-rejection.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result).toEqual({oldTerminated:true,staleRelease:false,dialogConnected:false,dialogs:0,oldDiscarded:true});
});

test('late reference interpretation refuses the same-raw table lease', async ({ page }, testInfo) => {
  await page.goto('/async-reader-continuity.html?case=table&first=full&end=windowed&late-reference=1');
  await page.waitForFunction(() => { const a=(window as any).__stableHost;return a?.runtime&&!a.full&&a.workers.at(-1)?.held; });
  await expect(page.locator('.limr-table-layout')).toHaveAttribute('data-table-ready','true');
  await page.locator('.limr-table-layout').getByRole('button',{name:'Full cell content',exact:true}).first().click();
  await page.locator('.limr-table-full-content').getByAltText('Clone owner',{exact:true}).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.evaluate(() => {const a=(window as any).__stableHost;a.changedTable=document.querySelector('.limr-table-layout');a.changedClone=document.querySelector('.limr-table-full-content');a.changedDialog=document.querySelector('dialog');a.complete();});
  await page.waitForFunction(() => (window as any).__stableHost.full);
  await expect(page.locator('.limr-table-layout a[href="https://example.test/new-meaning"]')).toHaveCount(1);
  const result=await page.evaluate(() => {const a=(window as any).__stableHost;return{sameTable:a.changedTable===document.querySelector('.limr-table-layout'),cloneConnected:a.changedClone.isConnected,dialogConnected:a.changedDialog.isConnected,active:a.runtime.interaction.get().active};});
  await testInfo.attach('changed-interpretation-rejection.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result).toEqual({sameTable:false,cloneConnected:false,dialogConnected:false,active:null});
});
