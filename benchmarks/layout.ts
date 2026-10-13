import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const browser = await chromium.launch();
const results = [];
const summary = (values: number[]) => {
  const sorted = [...values].sort((a, b) => a - b);
  return { medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.floor(sorted.length * .95)], maxMs: sorted.at(-1), longFrames: values.filter(value => value > 50).length, samples: values };
};
for (let trial = 0; trial < 3; trial++) for (const mode of trial % 2 ? ['knuth-plass', 'standard'] : ['standard', 'knuth-plass']) {
  const page = await browser.newPage({ viewport: { width: 1380, height: 1000 } });
  await page.goto(process.env.BENCH_URL ?? 'http://127.0.0.1:4174/LiMR/');
  await page.getByRole('button', { name: '加载', exact: true }).click();
  await page.getByRole('button', { name: 'scikit-learn 论文', exact: false }).click();
  if (mode === 'knuth-plass') {
    await page.getByRole('button', { name: '排版模式', exact: true }).click();
    await page.getByRole('button', { name: 'Knuth–Plass', exact: true }).click();
    await page.locator('article > p').first().waitFor();
    await page.waitForFunction(() => !!document.querySelector('[data-limr-kp]'));
  }
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const scroll = await page.evaluate(async () => {
    const sweeps = [];
    for (let pass = 0; pass < 3; pass++) {
      const frames: number[] = [], height = document.documentElement.scrollHeight - innerHeight;
      for (let step = 0; step < 120; step++) {
        scrollTo(0, (step < 60 ? step / 60 : (120 - step) / 60) * height);
        const start = performance.now(); await new Promise(requestAnimationFrame); frames.push(performance.now() - start);
      }
      sweeps.push(frames);
    }
    scrollTo(0, 0);
    return sweeps;
  });
  const resize = [];
  for (let step = 0; step < 32; step++) {
    const before = await page.evaluate(() => performance.now());
    await page.setViewportSize({ width: 1100 + (step < 16 ? step : 32 - step) * 20, height: 1000 });
    const after = await page.evaluate(async () => { await new Promise(requestAnimationFrame); return performance.now(); });
    resize.push(after - before);
  }
  await page.waitForTimeout(300);
  const result = { mode, trial, scroll: scroll.map(summary), resize: summary(resize), nodes: await page.locator('*').count() };
  results.push(result);
  console.log(JSON.stringify({ mode, trial, scroll: result.scroll.map(({ samples: _, ...s }) => s), resize: { ...result.resize, samples: undefined } }));
  await page.close();
}
await mkdir('benchmarks/results', { recursive: true });
await writeFile('benchmarks/results/layout.json', JSON.stringify({ date: new Date().toISOString(), browser: await browser.version(), measurement: 'Production Playground with the scikit-learn paper, full TOC/sidebar/highlights, fonts ready. Three fresh pages per mode in alternating order. Three 120-frame down/up sweeps (first sweep includes first-visibility layout). Each frame measures scrollTo through the next rAF; resize measures viewport update through the next rAF including protocol overhead, 32 widths across 1100–1420px. No CPU throttling. Current modes, not a historical baseline.', results }, null, 2) + '\n');
await browser.close();
