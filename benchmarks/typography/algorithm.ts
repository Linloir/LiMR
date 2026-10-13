import { performance } from 'node:perf_hooks';
import assert from 'node:assert/strict';
import { knuthPlass, prepareKnuthPlass, type KnuthPlassOptions, type LineItem, type ParagraphLayout } from '../../src/core/knuth-plass';
import { environment, hash, saveResult } from '../shared/environment';
import { stats, order } from '../shared/stats';

const metadata = await environment();
const end: LineItem[] = [{ type: 'penalty', width: 0, penalty: 10000 }, { type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true }, { type: 'penalty', width: 0, penalty: -10000 }];
function fixture(words: number, hyphens = false): LineItem[] {
  return [...Array.from({ length: words }, (_, i): LineItem[] => [
    ...(i ? [{ type: 'glue', width: 5, stretch: 3, shrink: 2 } as LineItem] : []),
    ...hyphens ? [{ type: 'box', width: 10 + i % 12 }, { type: 'penalty', width: 4, penalty: 50, flagged: true, automatic: true }, { type: 'box', width: 14 + (i * 7) % 25 }] as LineItem[] : [{ type: 'box', width: 18 + (i * 17) % 43 } as LineItem],
  ]).flat(), ...end];
}
const cases = [
  ...[50, 200, 1000, 5000, 10000].map(words => ({ name: `words-${words}`, words, items: fixture(words), width: 640 as number | number[], options: {} as KnuthPlassOptions })),
  { name: 'narrow', words: 1000, items: fixture(1000), width: 240, options: {} },
  { name: 'discretionary-hyphens', words: 1000, items: fixture(1000, true), width: 320, options: {} },
  { name: 'varying-line-width', words: 1000, items: fixture(1000), width: [240, 400, 640], options: {} },
  { name: 'looseness', words: 200, items: fixture(200), width: 400, options: { looseness: 1 } },
  { name: 'emergency-stretch', words: 3, items: [...[{ type: 'box', width: 40 }, { type: 'glue', width: 5, stretch: 3, shrink: 2 }, { type: 'box', width: 40 }, { type: 'glue', width: 5, stretch: 3, shrink: 2 }, { type: 'box', width: 40 }] as LineItem[], ...end], width: 100, options: { pretolerance: 0, tolerance: 0, emergencyStretch: 100 } },
  { name: 'overfull-atomic', words: 1, items: [{ type: 'box', width: 900 } as LineItem, ...end], width: 240, options: {} },
];
const results = [];
for (const scenario of cases) {
  const prepared = prepareKnuthPlass(scenario.items);
  const expected = knuthPlass(scenario.items, scenario.width, scenario.options);
  const valid = (layout: ParagraphLayout) => {
    assert.ok(Number.isFinite(layout.demerits));
    assert.equal(layout.lines.at(-1)?.index, scenario.items.length - 1);
    assert.ok(layout.lines.every((line, i) => !i || line.index > layout.lines[i - 1].index));
  };
  valid(expected); assert.deepEqual(prepared(scenario.width, scenario.options), expected);
  const runs = { 'prepare-and-solve': () => knuthPlass(scenario.items, scenario.width, scenario.options),
    'prepared-solve': () => prepared(scenario.width, scenario.options),
    'responsive-12-widths': () => { let result = expected; for (let step = 0; step < 12; step++) { result = prepared(240 + step * 40, scenario.options); valid(result); } return result; } };
  const names = Object.keys(runs) as (keyof typeof runs)[];
  const samples: Record<string, number[]> = Object.fromEntries(names.map(name => [name, []]));
  // Repeated calls are batched to avoid sub-millisecond timer noise. Per-call
  // samples include every solve (no memoized plan); only prefix sums are reused.
  const batch = scenario.words <= 200 ? 30 : scenario.words <= 1000 ? 5 : 1;
  for (const name of names) for (let i = 0; i < 3; i++) runs[name]();
  for (let trial = 0; trial < 15; trial++) for (const name of order(names, trial)) {
    const start = performance.now(); let result = expected;
    for (let i = 0; i < batch; i++) result = runs[name]();
    samples[name].push((performance.now() - start) / batch);
    valid(result);
  }
  const result = { scenario: scenario.name, words: scenario.words, items: scenario.items.length, inputSHA256: hash(JSON.stringify(scenario)), width: scenario.width, options: scenario.options,
    lines: expected.lines.length, pass: expected.pass, demerits: expected.demerits, valid: true, batch,
    measurements: Object.fromEntries(names.map(name => [name, stats(samples[name])])) };
  results.push(result); console.log(JSON.stringify({ scenario: result.scenario, items: result.items, pass: result.pass, medianMs: result.measurements['prepare-and-solve'].medianMs }));
}
await saveResult('kp-algorithm', { environment: metadata, methodology: 'Synthetic deterministic box/glue/penalty inputs in CSS pixel units; 3 warmups, 15 cyclic trials per operation; batch-normalized raw samples. prepared-solve reuses prefix sums, not cached plans; responsive operation totals 12 width solves (includes end-path checks). Excludes browser itemization, font measurement, Unicode line breaking, English hyphenation and DOM writes. Correctness: complete monotonic paths, finite demerits and direct/prepared equality; independent exhaustive oracle is in tests/knuth-plass.test.ts.', results });
