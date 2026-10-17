/** pnpm build && node --expose-gc benchmarks/core/large-document.mjs 50 blocking */
import { Worker, parentPort, isMainThread } from 'node:worker_threads';
import { performance } from 'node:perf_hooks';
import { writeFile } from 'node:fs/promises';
import { createDocumentSession } from '../../dist/core/index.js';
import { standard } from '../../dist/extensions/index.js';
import { createDocumentWorkerHandler, standardWorkerRegistry } from '../../dist/worker-api.js';

if (!isMainThread) {
  const handle = createDocumentWorkerHandler(standardWorkerRegistry);
  parentPort.on('message', request => {
    const started = performance.now();
    void handle(request, response => {
      if (response.type === 'snapshot') parentPort.postMessage({ benchmark: { complete: response.complete, elapsed: performance.now() - started, heapUsed: process.memoryUsage().heapUsed, sourceLength: response.snapshot.source.length, blocks: response.snapshot.blocks.length } });
      if (response.type === 'snapshot-end') parentPort.postMessage({ benchmark: { complete: true, elapsed: performance.now() - started, heapUsed: process.memoryUsage().heapUsed, packetized: true } });
      parentPort.postMessage(response);
    });
  });
} else {
  const size = Number(process.argv[2] ?? 50), mode = process.argv[3] ?? 'blocking';
  const phrase = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。风吹过树梢，院子里的孩子停下脚步，听见远方传来悠长的钟声。';
  const unit = new TextEncoder().encode(`${phrase.repeat(6)}\n\n`), input = new Uint8Array(size * 1024 * 1024);
  for (let at = 0; at < input.length; at += unit.length) input.set(unit.subarray(0, Math.min(unit.length, input.length - at)), at);
  const workerStats = [], receiveStats = []; let worker, peakRss = process.memoryUsage().rss;
  const session = createDocumentSession({ id: 'novel', mode, extensions: standard(), worker: () => {
    worker = new Worker(new URL(import.meta.url));
    return { postMessage: (message, transfer) => worker.postMessage(message, transfer), terminate: () => { void worker.terminate(); },
      addEventListener(type, listener) { if (type === 'message') worker.on('message', value => { if (value.benchmark) workerStats.push(value.benchmark); else { const began = performance.now(); listener({ data: value }); const duration = performance.now() - began; if (duration > 10 || value.type === 'snapshot-end') receiveStats.push({ type: value.type, duration }); } }); else worker.on('error', error => listener({ message: error.message })); }, removeEventListener() {} };
  } });
  const phases = {}, started = performance.now(); let prefixAt, completeAt, lastTick = started, maxTick = 0, maxTickAt = 0, maxTickPhase = '', ticks = 0;
  session.subscribe(() => { const state = session.getSnapshot(); phases[state.phase] ??= performance.now() - started; if (state.document && !state.complete) prefixAt ??= performance.now() - started; peakRss = Math.max(peakRss, process.memoryUsage().rss); });
  const timer = setInterval(() => { const now = performance.now(); if (now - lastTick > maxTick) { maxTick = now - lastTick; maxTickAt = now - started; maxTickPhase = session.getSnapshot().phase; } lastTick = now; ticks++; peakRss = Math.max(peakRss, process.memoryUsage().rss); }, 16);
  const document = await session.load(input); completeAt = performance.now() - started;
  await new Promise(resolve => setTimeout(resolve, 32)); clearInterval(timer);
  const snapshot = document.getSnapshot();
  global.gc?.();
  const result = { inputMiB: size, mode, elapsedMs: completeAt, prefixMs: prefixAt, phasesMs: phases, blocks: snapshot.blocks.length, sourceUTF16: snapshot.source.length, checkpoints: session.getSnapshot().sourceIndex.checkpoints.length, workerStats, receiveStats, maxMainTickMs: maxTick, maxMainTickAtMs: maxTickAt, maxMainTickPhase: maxTickPhase, mainTicks: ticks, peakProcessRssMiB: peakRss / 1048576, finalMainHeapMiB: process.memoryUsage().heapUsed / 1048576, fullParse: snapshot.metrics.fullParse, first: snapshot.blocks[0].node.type, lastSourceEnd: snapshot.blocks.at(-1).range.end };
  console.log(JSON.stringify(result, null, 2));
  await writeFile(`/tmp/limr-large-${size}-${mode}.json`, JSON.stringify(result, null, 2)); session.dispose();
}
