import { test, expect } from './async-reader-continuity-support';

// Preserve the geometry and timeout of the original production regression.
test.use({ viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' });
test.setTimeout(45_000);

for(const [first,end] of [['full','full-explicit'],['windowed','full-giant'],['full','full-unknown']]) test(`full strategy keeps ordinary selection and printing: ${end}`, async({page},testInfo)=>{
  await page.goto(`/async-reader-continuity.html?case=table&first=${first}&end=${end}`);
  await page.waitForFunction(()=>{const a=(window as any).__stableHost;return a?.runtime&&!a.full&&a.workers.at(-1)?.held;});
  await page.evaluate(()=>(window as any).__stableHost.complete());
  await page.waitForFunction(()=>(window as any).__stableHost.full);
  await page.locator('.limr-prose p').first().click();
  await page.keyboard.press('Control+a');
  const before=await page.evaluate(()=>{const a=(window as any).__stableHost,content=a.runtime.content as HTMLElement;return{capability:a.capability,viewport:a.runtime.documentViewport,virtualSelection:a.runtime.virtualSelection,selected:window.getSelection()?.toString().length,windowClasses:content.querySelectorAll('.limr-document-window').length,windowSlots:content.querySelectorAll('[data-window-slot],[data-window-parked],[data-limr-windowed]').length,warnings:content.querySelectorAll('.limr-print-unprepared,.limr-print-progress').length,stableHost:content.querySelectorAll('[data-stable-block-host]').length};});
  expect(before.capability.enabled).toBe(false);if(end!=='full-explicit')expect(before.capability.reason).toBeTruthy();if(end==='full-unknown')await expect(page.locator('[data-private-opaque-code]')).toHaveText('Opaque plugin code remains readable.');
  expect(before.viewport).toBeNull();expect(before.virtualSelection).toBe(false);expect(before.selected).toBeGreaterThan(0);expect(before.windowClasses).toBe(0);expect(before.windowSlots).toBe(0);expect(before.warnings).toBe(0);expect(before.stableHost).toBe(1);
  await page.keyboard.press('ArrowRight');
  await page.emulateMedia({media:'print'});
  const printed=await page.evaluate(()=>{const a=(window as any).__stableHost,content=a.runtime.content as HTMLElement,heading=content.querySelector('h1')!,paragraph=content.querySelector('p')!;return{heading:heading.getBoundingClientRect().height,paragraph:paragraph.getBoundingClientRect().height,text:heading.textContent,provisional:document.querySelectorAll('[data-limr-provisional],.limr-provisional-print-notice').length,warning:document.querySelectorAll('.limr-print-unprepared').length};});
  expect(Number.isFinite(printed.heading)&&printed.heading>0).toBe(true);expect(Number.isFinite(printed.paragraph)&&printed.paragraph>0).toBe(true);expect(printed.text).toContain('Table handoff');expect(printed.provisional).toBe(0);expect(printed.warning).toBe(0);
  await testInfo.attach('full-strategy-behavior.json',{body:Buffer.from(JSON.stringify({before,printed},null,2)),contentType:'application/json'});
  await page.emulateMedia({media:'screen'});
});
