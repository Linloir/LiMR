import { performance } from 'node:perf_hooks';
import { cpus } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createDocument } from '../src/core';
import { standard, gfm } from '../src/extensions';
import { fixture } from './fixture';

// Supply an untouched source tree to compare both implementations in one
// process, using identical fixtures, dependencies and alternating trial order.
const baselinePath = process.env.LIMR_BENCH_BASELINE;
const baseline = baselinePath ? {
  ...await import(pathToFileURL(resolve(baselinePath, 'src/core/index.ts')).href),
  ...await import(pathToFileURL(resolve(baselinePath, 'src/extensions/index.ts')).href),
} as { createDocument: typeof createDocument; standard: typeof standard; gfm: typeof gfm } : undefined;
const engines = { current: { createDocument, standard, gfm }, ...baseline ? { baseline } : {} };
const scenarios = [
  { name: 'gfm', source: fixture(80), modules: 'gfm', chunkSize: 256 },
  { name: 'standard', source: fixture(80), modules: 'standard', chunkSize: 256 },
  { name: 'growing-code', source: '```ts\n' + 'const value = "preserve selection";\n'.repeat(1200) + '```', modules: 'standard', chunkSize: 128 },
  { name: 'long-paragraph', source: 'One long paragraph with ordinary readable words. '.repeat(160), modules: 'standard', chunkSize: 128 },
];
const results = [];
for (const scenario of scenarios) {
  const samples: Record<string, { totalMs: number; p95Ms: number; maxMs: number; finishMs: number }[]> = {};
  const run = (name: keyof typeof engines) => {
    const engine = engines[name]!;
    const document = engine.createDocument('', { streaming: true, extensions: scenario.modules === 'gfm' ? [engine.gfm()] : engine.standard() });
    const times: number[] = [], start = performance.now();
    for (let at = 0; at < scenario.source.length; at += scenario.chunkSize) {
      const before = performance.now();
      document.append(scenario.source.slice(at, at + scenario.chunkSize));
      times.push(performance.now() - before);
    }
    const beforeFinish = performance.now(); document.finish();
    const finishMs = performance.now() - beforeFinish, totalMs = performance.now() - start;
    times.sort((a, b) => a - b);
    return { totalMs, p95Ms: times[Math.floor(times.length * .95)], maxMs: times.at(-1)!, finishMs };
  };
  const names = Object.keys(engines) as (keyof typeof engines)[];
  for (const name of names) run(name);
  for (let trial = 0; trial < 5; trial++) for (const name of trial % 2 ? [...names].reverse() : names) (samples[name] ??= []).push(run(name));
  const result = { scenario: scenario.name, characters: scenario.source.length, chunkSize: scenario.chunkSize,
    measurements: Object.fromEntries(Object.entries(samples).map(([name, samples]) => [name, { median: [...samples].sort((a, b) => a.totalMs - b.totalMs)[2], samples }])) };
  results.push(result); console.log(JSON.stringify(result));
}
await mkdir('benchmarks/results', { recursive: true });
await writeFile('benchmarks/results/streaming.json', JSON.stringify({ date: new Date().toISOString(), node: process.version, cpu: cpus()[0].model,
  baseline: baselinePath ? execFileSync('git', ['rev-parse', 'HEAD'], { cwd: baselinePath, encoding: 'utf8' }).trim() : undefined,
  measurement: 'Core append plus finalization. Five alternating warmed trials; median by total time. Same dependencies, UTF-16 input and chunk boundaries. Rendering, layout, syntax highlighting and network are excluded.', results }, null, 2) + '\n');
