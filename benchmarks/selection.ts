import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { dragSelection } from './selection-probe';

const browser = await chromium.launch();
const results = [];
try {
  for (const scenario of [{ kind: 'prose', sections: 2000 }, { kind: 'code', sections: 1000 }]) {
    for (const renderer of scenario.kind === 'code' ? ['limr'] : ['limr', 'react-markdown']) {
      const samples = [];
      for (let trial = 0; trial < 3; trial++) {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        await page.goto(`${process.env.BENCH_URL ?? 'http://127.0.0.1:4174'}/?fixture=selection-bench&sections=${scenario.sections}&kind=${scenario.kind}&renderer=${renderer}`);
        await page.locator('.limr-prose > p, .limr-prose pre').first().waitFor();
        if (scenario.kind === 'code') await page.locator('.shiki').waitFor();
        samples.push(await dragSelection(page, scenario.kind === 'code' ? '.limr-prose pre' : undefined));
        await page.close();
      }
      const median = samples.slice().sort((a, b) => a.elapsedMs - b.elapsedMs)[1];
      const result = { ...scenario, renderer, median, samples };
      results.push(result); console.log(JSON.stringify({ ...scenario, renderer, ...median }));
    }
  }
  await mkdir('benchmarks/results', { recursive: true });
  await writeFile('benchmarks/results/selection.json', JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), measurement: 'Production browser, 90 real continuous pointer moves. Native selectionchange-to-overlay-mutation latency; updates and paints measured BEFORE pointerup. 3 isolated font-ready trials; median by gesture duration. Native baseline has no custom overlay metric. This is not hardware input latency or a real touch-device measurement.', results }, null, 2) + '\n');
} finally { await browser.close(); }
