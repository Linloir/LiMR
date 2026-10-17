import { test, expect } from './async-reader-continuity-support';
import type { Page } from '@playwright/test';

// Preserve the geometry and timeout of the original production regression.
test.use({ viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure' });
test.setTimeout(45_000);

async function serveActualVideo(page:Page){
  // Produce real decodable bytes before opening the product fixture; do not
  // replace the rendered video's src/srcObject or fake its playback state.
  const bytes=await page.evaluate(async()=>{
    const canvas=document.createElement('canvas');canvas.width=240;canvas.height=160;
    const context=canvas.getContext('2d')!,stream=canvas.captureStream(20),chunks:BlobPart[]=[];
    const type='video/webm;codecs=vp8';if(!MediaRecorder.isTypeSupported(type))throw new Error('Real VP8 fixture not supported');
    const recorder=new MediaRecorder(stream,{mimeType:type});recorder.ondataavailable=event=>chunks.push(event.data);
    const done=new Promise<void>(resolve=>{recorder.onstop=()=>resolve();});recorder.start();
    let tick=0;const timer=setInterval(()=>{context.fillStyle=`hsl(${tick++*12} 65% 45%)`;context.fillRect(0,0,240,160);},50);
    await new Promise(resolve=>setTimeout(resolve,1500));recorder.stop();await done;clearInterval(timer);stream.getTracks().forEach(track=>track.stop());
    const blob=new Blob(chunks,{type});if(blob.size<500)throw new Error('No real media bytes recorded');return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  await page.route('**/prototype-media.webm',route=>route.fulfill({contentType:'video/webm',body:Buffer.from(bytes)}));
}

// Hold only the real Worker final delivery while the prefix remains interactive.
for(const [first,end]of [['full','windowed'],['windowed','full-giant'],['windowed','windowed'],['full','full-explicit']]){
  test(`same connected media host ${first} -> ${end}`,async({page})=>{
    await serveActualVideo(page);
    let iframeRequests=0;
    await page.route('https://www.youtube.com/embed/**',route=>{iframeRequests++;return route.fulfill({contentType:'text/html',body:`<!doctype html><script>window.instance=crypto.randomUUID();window.ticks=0;setInterval(()=>ticks++,25)</script><p>Real iframe document</p>`});});
    await page.goto(`/async-reader-continuity.html?first=${first}&end=${end}`);
    await page.waitForFunction(()=>{const a=(window as any).__stableHost;return a?.runtime&&!a.full&&a.workers.at(-1)?.held;});
    await expect(page.locator('iframe')).toHaveCount(1);expect(iframeRequests).toBe(1);
    await page.locator('#play-video').click();
    await page.waitForFunction(()=>{const video=document.querySelector('video')!;return !video.paused&&video.readyState>=2&&video.currentTime>.1;});
    const frame=page.frames().find(frame=>frame.url().includes('youtube.com/embed/'))!;
    const childBefore=await frame.evaluate(()=>({instance:(window as any).instance,ticks:(window as any).ticks}));
    await page.evaluate(()=>{const api=(window as any).__stableHost;api.beforeVideo=document.querySelector('video');api.beforeFrame=document.querySelector('iframe');api.beforeSlot=api.beforeFrame.closest('[data-stable-slot]');api.beforeHost=api.beforeSlot.parentElement;api.beforeArticle=api.beforeFrame.closest('article');api.initialTime=api.beforeVideo.currentTime;api.initialSource=api.beforeVideo.currentSrc;api.removals=[];api.mediaEvents=[];for(const name of ['emptied','loadstart','abort'])api.beforeVideo.addEventListener(name,()=>api.mediaEvents.push(name));api.observer=new MutationObserver(records=>{for(const record of records)for(const node of record.removedNodes)if(node===api.beforeFrame||node===api.beforeVideo||node.contains?.(api.beforeFrame)||node.contains?.(api.beforeVideo))api.removals.push(node.nodeName);});api.observer.observe(document.body,{subtree:true,childList:true});api.complete();});
    await page.waitForFunction(()=>(window as any).__stableHost.full);
    await page.waitForTimeout(400);
    const after=await page.evaluate(()=>{const api=(window as any).__stableHost,v=document.querySelector('video'),f=document.querySelector('iframe');api.observer.disconnect();return{sameVideo:v===api.beforeVideo,sameFrame:f===api.beforeFrame,sameSlot:f?.closest('[data-stable-slot]')===api.beforeSlot,sameParent:api.beforeSlot.parentElement===api.beforeHost,sameArticle:f?.closest('article')===api.beforeArticle,connected:v?.isConnected&&f?.isConnected,source:v?.currentSrc===api.initialSource,time:v?.currentTime,initialTime:api.initialTime,paused:v?.paused,ready:v?.readyState,removed:api.removals,events:api.mediaEvents,capability:api.capability,independent:api.engines.before!==api.engines.after&&api.engines.before.getSnapshot()!==api.engines.after.getSnapshot()};});
    expect(after.independent).toBe(true);expect(after.sameVideo&&after.sameFrame&&after.sameSlot&&after.sameParent&&after.sameArticle&&after.connected).toBe(true);
    expect(after.removed).toEqual([]);expect(after.events).toEqual([]);expect(after.source).toBe(true);expect(after.paused).toBe(false);expect(after.ready).toBeGreaterThanOrEqual(2);expect(after.time).not.toBe(after.initialTime);
    const childAfter=await frame.evaluate(()=>({instance:(window as any).instance,ticks:(window as any).ticks}));expect(childAfter.instance).toBe(childBefore.instance);expect(childAfter.ticks).toBeGreaterThan(childBefore.ticks);expect(iframeRequests).toBe(1);
    expect(after.capability.enabled).toBe(end==='windowed');if(end==='full-giant'||end==='full-unknown')expect(after.capability.reason).toBeTruthy();
  });
}

for(const [first,end]of [['full','windowed'],['windowed','full-giant'],['windowed','windowed'],['full','full-explicit']]) test(`same source image ${first} -> ${end} keeps the exact open dialog, zoom, scroll and focus target`,async({page})=>{
  await serveActualVideo(page);
  await page.route('https://www.youtube.com/embed/**',route=>route.fulfill({contentType:'text/html',body:'<p>Provider</p>'}));
  await page.goto(`/async-reader-continuity.html?first=${first}&end=${end}`);await page.waitForFunction(()=>{const a=(window as any).__stableHost;return a?.runtime&&!a.full&&a.workers.at(-1)?.held;});
  const image=page.getByRole('button',{name:'Preview image: First owner',exact:true});await image.click();
  await page.evaluate(()=>{const a=(window as any).__stableHost;a.imageOwners=[document.querySelector('img[alt="First owner"]'),document.querySelector('img[alt="Duplicate URL distinct owner"]')];if(!a.imageOwners.every(Boolean)||a.imageOwners[0]===a.imageOwners[1])throw new Error('Distinct source owners missing');});
  await page.locator('.limr-image-preview-size').click();
  await page.evaluate(()=>{const api=(window as any).__stableHost;api.dialog=document.querySelector('dialog');api.stage=document.querySelector('.limr-image-preview-stage');api.trigger=document.querySelector('img[alt="First owner"]');api.closeCount=0;api.imageRemovals=[];api.imageObserver=new MutationObserver(records=>{for(const record of records)for(const node of record.removedNodes)if(node===api.trigger||node===api.dialog||node.contains?.(api.trigger)||node.contains?.(api.dialog))api.imageRemovals.push(node.nodeName);});api.imageObserver.observe(document.body,{subtree:true,childList:true});api.dialog.addEventListener('close',()=>api.closeCount++);api.stage.scrollTo(80,120);api.stageOffset={left:api.stage.scrollLeft,top:api.stage.scrollTop};api.focus=document.activeElement;api.complete();});
  await page.waitForFunction(()=>(window as any).__stableHost.full);await page.waitForTimeout(200);
  const kept=await page.evaluate(()=>{const a=(window as any).__stableHost;a.imageObserver.disconnect();return{removed:a.imageRemovals,dialog:document.querySelector('dialog')===a.dialog,stage:document.querySelector('.limr-image-preview-stage')===a.stage,trigger:document.querySelector('img[alt="First owner"]')===a.trigger,open:a.dialog.open,original:a.stage.hasAttribute('data-original'),offset:{left:a.stage.scrollLeft,top:a.stage.scrollTop},before:a.stageOffset,focus:document.activeElement===a.focus,closed:a.closeCount,owners:document.querySelector('img[alt="First owner"]')===a.imageOwners[0]&&document.querySelector('img[alt="Duplicate URL distinct owner"]')===a.imageOwners[1]};});
  expect(kept.dialog&&kept.stage&&kept.trigger&&kept.open&&kept.original&&kept.focus&&kept.owners).toBe(true);expect(kept.before.left).toBeGreaterThan(0);expect(kept.before.top).toBeGreaterThan(0);expect(kept.offset).toEqual(kept.before);expect(kept.closed).toBe(0);expect(kept.removed).toEqual([]);
  await page.keyboard.press('Escape');await expect(image).toBeFocused();
});

// Preserve the same clone/dialog requirement on the actual AsyncReader path.
// No expected-failure exemption; full rendering is delivered by the real Worker.
test('[first-table] real Worker table clone preserves injected-empty annotation provenance',async({page},testInfo)=>{
  await page.goto('/async-reader-continuity.html?case=table&first=full&end=windowed');
  await page.waitForFunction(()=>{const a=(window as any).__stableHost;return a?.runtime&&!a.full&&a.workers.at(-1)?.held;});
  expect(await page.evaluate(()=>(window as any).__stableHost.scopeReceipt)).toMatchObject({admitted:true,complete:false,privateEmpty:true,publicUndefined:true});
  const table=page.locator('.limr-table-layout');await expect(table).toHaveAttribute('data-table-ready','true');
  const markers=table.getByRole('button',{name:'Full cell content',exact:true});expect(await markers.count()).toBeGreaterThan(0);
  await markers.first().click();const card=page.locator('.limr-annotation-overlay'),clone=card.locator('.limr-table-full-content'),image=clone.getByAltText('Clone owner',{exact:true});
  await expect(card).toBeVisible();await expect(image).toHaveAttribute('role','button');await image.click();
  const dialog=page.locator('.limr-image-preview');await expect(dialog).toBeVisible();
  await dialog.getByRole('button',{name:'Actual size',exact:true}).click();
  await page.evaluate(()=>{const a=(window as any).__stableHost;a.tableNegative={setupComplete:true,table:document.querySelector('.limr-table-layout'),clone:document.querySelector('.limr-table-full-content'),image:document.querySelector('.limr-table-full-content img[alt="Clone owner"]'),dialog:document.querySelector('.limr-image-preview'),stage:document.querySelector('.limr-image-preview-stage'),focus:document.activeElement,removed:[],closed:0};const n=a.tableNegative;n.stage.scrollTo(80,120);n.offset={left:n.stage.scrollLeft,top:n.stage.scrollTop};n.dialog.addEventListener('close',()=>n.closed++);n.observer=new MutationObserver(records=>{for(const record of records)for(const node of record.removedNodes)if(node===n.clone||node===n.dialog||node.contains?.(n.clone)||node.contains?.(n.dialog))n.removed.push(node.nodeName);});n.observer.observe(document.body,{subtree:true,childList:true});a.complete();});
  await page.waitForFunction(()=>(window as any).__stableHost.full);await page.waitForTimeout(400);
  const result=await page.evaluate(()=>{const a=(window as any).__stableHost,n=a.tableNegative;n.observer.disconnect();return{setupComplete:n.setupComplete,independent:a.engines.before!==a.engines.after,sameTable:document.querySelector('.limr-table-layout')===n.table,sameClone:document.querySelector('.limr-table-full-content')===n.clone,sameImage:document.querySelector('.limr-table-full-content img[alt="Clone owner"]')===n.image,sameDialog:document.querySelector('.limr-image-preview')===n.dialog,connected:n.clone.isConnected&&n.image.isConnected&&n.dialog.isConnected,open:n.dialog.open,original:n.stage.hasAttribute('data-original'),offset:{left:n.stage.scrollLeft,top:n.stage.scrollTop},beforeOffset:n.offset,sameFocus:document.activeElement===n.focus,closed:n.closed,removed:n.removed,scope:a.scopeReceipt,complete:a.state.complete,worker:a.state.capabilities.worker};});
  await testInfo.attach('table-clone-continuity.json',{body:Buffer.from(JSON.stringify(result,null,2)),contentType:'application/json'});
  expect(result.setupComplete&&result.independent&&result.complete&&result.worker).toBe(true);expect(result.sameTable).toBe(true);expect(result.scope).toMatchObject({admitted:true,complete:true,privateEmpty:false,publicUndefined:true});
  expect(result.beforeOffset.left).toBeGreaterThan(0);expect(result.beforeOffset.top).toBeGreaterThan(0);
  // Keep the real requirement. Never use test.fail()/skip(), close/reopen the
  // preview, replace this with a plain image, or reapply old-runtime actions.
  expect(result.sameClone&&result.sameImage&&result.sameDialog&&result.connected&&result.open&&result.original&&result.sameFocus).toBe(true);
  expect(result.closed).toBe(0);expect(result.removed).toEqual([]);expect(result.offset).toEqual(result.beforeOffset);
});
