import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { fixture } from './fixture';

const browser = await chromium.launch({ headless: true });
const results = [];
for (const [scenario, source] of [
  ['standard', fixture(80)],
  ['growing-code', '```text\n' + 'const value = "preserve selection";\n'.repeat(1200) + '```'],
]) {
  const samples = [];
  for (let trial = 0; trial < 3; trial++) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(`${process.env.BENCH_URL ?? 'http://127.0.0.1:4174'}/?fixture=streaming`);
    await page.waitForFunction(() => typeof window.limrStream === 'function');
    await page.evaluate(() => window.limrStream({ source: 'Warmup **text** and `code`.', streaming: false }));
    await page.evaluate(() => document.fonts.ready);
    samples.push(await page.evaluate(async source => {
      window.limrStream({ source: '', streaming: true });
      const times = [];
      for (let at = 256; at < source.length + 256; at += 256) {
        const start = performance.now();
        window.limrStream({ source: source.slice(0, at), streaming: at < source.length });
        document.querySelector('article')!.getBoundingClientRect();
        times.push(performance.now() - start);
        await new Promise(requestAnimationFrame);
      }
      const sorted = [...times].sort((a, b) => a - b);
      return { updates: times.length, totalMs: times.reduce((a, b) => a + b), p95Ms: sorted[Math.floor(sorted.length * .95)], maxMs: sorted.at(-1)!, elements: document.querySelectorAll('article *').length };
    }, source));
    await page.close();
  }
  const result = { scenario, characters: source.length, chunkSize: 256, median: [...samples].sort((a, b) => a.totalMs - b.totalMs)[1], samples };
  results.push(result); console.log(JSON.stringify(result));
}
await mkdir('benchmarks/results', { recursive: true });
await writeFile('benchmarks/results/streaming-browser.json', JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), measurement: 'Production Vite/React, default modules, typography and increment animations; Reader without TOC/sidebar. Three isolated warmed pages per scenario. React synchronous commit plus forced layout; idle rAF time, network and async highlighting excluded. Current implementation only.', results }, null, 2) + '\n');
await browser.close();
