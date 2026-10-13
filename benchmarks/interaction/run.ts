import { chromium } from '@playwright/test';
import { environment, saveResult } from '../shared/environment';
import { dragSelection } from './selection-probe';

const metadata = await environment();
const baseURL = (process.env.BENCH_URL ?? 'http://127.0.0.1:4174/LiMR').replace(/\/$/, '');
const browser = await chromium.launch();
const results = [];
try {
  for (const scenario of [{ kind: 'prose', sections: 2000 }, { kind: 'code', sections: 1000 }]) {
    for (const renderer of scenario.kind === 'code' ? ['limr'] : ['limr', 'react-markdown']) {
      const samples = [];
      for (let trial = 0; trial < 3; trial++) {
        const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
        await page.goto(`${baseURL}/?fixture=selection-bench&sections=${scenario.sections}&kind=${scenario.kind}&renderer=${renderer}`);
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
  await saveResult('selection', { environment: { ...metadata, browser: browser.version() }, measurement: 'Production browser, 90 real continuous pointer moves. Native selectionchange-to-overlay-mutation latency; updates and paints measured BEFORE pointerup. 3 isolated font-ready trials; median by gesture duration. Native baseline has no custom overlay metric. This is not hardware input latency or a real touch-device measurement.', results });
} finally { await browser.close(); }
