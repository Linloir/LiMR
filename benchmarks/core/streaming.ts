import { performance } from 'node:perf_hooks';
import { createDocument } from '../../src/core';
import { standard, gfm } from '../../src/extensions';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm as gfmSyntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { fixture } from '../shared/fixture';
import { environment, hash, saveResult } from '../shared/environment';
import { stats, order } from '../shared/stats';

const metadata = await environment();
const results = [];
for (const scenario of [
  { name: 'gfm', source: fixture(80), modules: 'gfm', chunkSize: 256 },
  { name: 'standard', source: fixture(80), modules: 'standard', chunkSize: 256 },
  { name: 'growing-code', source: '```ts\n' + 'const value = "preserve selection";\n'.repeat(1200) + '```', modules: 'standard', chunkSize: 128 },
  { name: 'long-paragraph', source: 'One long paragraph with ordinary readable words. '.repeat(160), modules: 'standard', chunkSize: 128 },
]) {
  const run = (engine: string) => {
    const extensions = scenario.modules === 'gfm' ? [gfm()] : standard();
    const document = engine === 'limr' ? createDocument('', { streaming: true, extensions }) : undefined;
    const times = [], start = performance.now();
    for (let at = 0; at < scenario.source.length; at += scenario.chunkSize) {
      const before = performance.now();
      if (document) document.append(scenario.source.slice(at, at + scenario.chunkSize));
      else fromMarkdown(scenario.source.slice(0, at + scenario.chunkSize), { extensions: [gfmSyntax()], mdastExtensions: gfmFromMarkdown() });
      times.push(performance.now() - before);
    }
    const beforeFinish = performance.now(); document?.finish();
    const finishMs = performance.now() - beforeFinish, totalMs = performance.now() - start;
    return { totalMs, append: stats(times), finishMs };
  };
  const engines = scenario.modules === 'gfm' ? ['limr', 'mdast-full-prefix'] : ['limr'];
  const samples: Record<string, ReturnType<typeof run>[]> = Object.fromEntries(engines.map(name => [name, []]));
  for (const name of engines) run(name);
  for (let trial = 0; trial < 5; trial++) for (const name of order(engines, trial)) samples[name].push(run(name));
  const result = { scenario: scenario.name, characters: scenario.source.length, chunkSize: scenario.chunkSize, sourceSHA256: hash(scenario.source),
    measurements: Object.fromEntries(engines.map(name => [name, { total: stats(samples[name].map(s => s.totalMs)), samples: samples[name] }])) };
  results.push(result); console.log(JSON.stringify({ scenario: result.scenario, totals: Object.fromEntries(engines.map(name => [name, result.measurements[name].total.medianMs])) }));
}
await saveResult('streaming', { environment: metadata, methodology: 'Current core append and finalization, five warmed trials. GFM full-prefix mdast parsing is an algorithm baseline, not react-markdown or Markstream rendering. UTF-16 characters; no React, DOM, highlighting or network.', results });
