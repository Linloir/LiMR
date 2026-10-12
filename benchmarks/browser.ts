import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true });
const results = [];
for (const scenario of [{ sections: 200 }, { sections: 2000 }, { sections: 80, stream: true }]) {
  const trials = { limr: [], 'react-markdown': [] } as Record<'limr' | 'react-markdown', Awaited<ReturnType<Window['limrBenchmark']>>[]>;
  for (let i = 0; i < 3; i++) {
    const order = i % 2 ? ['react-markdown', 'limr'] as const : ['limr', 'react-markdown'] as const;
    for (const renderer of order) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(`${process.env.BENCH_URL ?? 'http://127.0.0.1:4174'}/?fixture=bench`);
      await page.waitForFunction(() => typeof window.limrBenchmark === 'function');
      await page.evaluate(renderer => window.limrBenchmark({ renderer, sections: 20 }), renderer);
      await page.evaluate(() => document.fonts.ready);
      trials[renderer].push(await page.evaluate(options => window.limrBenchmark(options), { ...scenario, renderer }));
      await page.close();
    }
  }
  for (const renderer of ['limr', 'react-markdown'] as const) {
    const samples = trials[renderer];
    samples.sort((a, b) => a.totalMs - b.totalMs);
    const result = { ...scenario, renderer, median: samples[1], samples };
    results.push(result); console.log(JSON.stringify({ ...scenario, renderer, ...samples[1] }));
  }
}
await mkdir('benchmarks/results', { recursive: true });
await writeFile('benchmarks/results/browser.json', JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), measurement: 'Synchronous React update plus forced layout, production Vite build. Each trial has an isolated page, font-ready warmup and alternating renderer order. Streaming updates spaced by one animation frame; idle frame time excluded.', results }, null, 2) + '\n');
await browser.close();
