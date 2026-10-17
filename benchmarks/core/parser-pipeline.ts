/** Fresh-process parse/index measurement for explicitly supplied documents.
 * node --expose-gc --import tsx benchmarks/core/parser-pipeline.ts --help
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { register } from 'node:module';
import { cpus, platform, release } from 'node:os';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import type { DocumentOptions } from '../../src/core/types';
import { parserGraphFingerprint } from './parser-graph';

const { values, positionals } = parseArgs({ allowPositionals: true, options: {
  target: { type: 'string' }, output: { type: 'string' }, upstream: { type: 'boolean' },
  'no-fingerprint': { type: 'boolean' }, help: { type: 'boolean', short: 'h' },
} });
if (values.help) {
  console.log(`Usage: node --expose-gc --import tsx benchmarks/core/parser-pipeline.ts [options] document.md [...]

  --target MiB        Repeat complete input units until at least this UTF-8 size
  --output file.json  Save the result (also printed to stdout)
  --upstream          Replace only the bounded adapter with upstream fromMarkdown
  --no-fingerprint    Skip the full ordered graph hash for large memory probes

Without --target, the supplied files are joined once with two newlines.
Run candidates and upstream baselines in separate processes, serially.
RSS and final retained heap are captured before graph hashing. JSON progress
markers go to stderr; stdout contains only the final JSON result.`);
} else {
  if (!positionals.length) throw new Error('Provide at least one Markdown file; see --help');
  const targetMiB = values.target === undefined ? undefined : Number(values.target);
  if (targetMiB !== undefined && (!Number.isFinite(targetMiB) || targetMiB <= 0)) {
    throw new Error('--target must be a positive number of MiB');
  }
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
  async function sourceHash(directory: string): Promise<string> {
    const entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
    const parts = await Promise.all(entries.map(async entry => {
      const path = resolve(directory, entry.name);
      return `${entry.name}:${entry.isDirectory() ? await sourceHash(path) : hash(await readFile(path))}`;
    }));
    return hash(parts.join('\n'));
  }
  const metadata = { date: new Date().toISOString(), node: process.version, execArgv: process.execArgv,
    platform: `${platform()} ${release()}`, cpu: cpus()[0]?.model,
    revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sourceSHA256: await sourceHash(resolve(root, 'src')),
    lockSHA256: hash(await readFile(resolve(root, 'pnpm-lock.yaml'))),
    harnessSHA256: hash((await Promise.all(['parser-pipeline.ts', 'parser-pipeline-loader.mjs', 'parser-graph.ts'].map(name => readFile(new URL(name, import.meta.url))))).map(value => hash(value)).join('\n')),
  };
  if (values.upstream) register('./parser-pipeline-loader.mjs', import.meta.url);
  // Dynamic imports ensure the upstream loader takes effect before any engine
  // module is instantiated. Production code and installed packages stay intact.
  const { DocumentEngine } = await import('../../src/core/engine');
  const { standard } = await import('../../src/extensions/standard');
  const paths = positionals.map(path => resolve(path));
  const unit = (await Promise.all(paths.map(path => readFile(path, 'utf8')))).join('\n\n');
  const unitBytes = Buffer.byteLength(unit);
  if (targetMiB !== undefined && !unitBytes) throw new Error('Cannot repeat an empty corpus to a nonzero target');
  const copies = targetMiB === undefined ? 1 : Math.ceil(targetMiB * 1048576 / unitBytes);
  const source = Array(copies).fill(unit).join('\n\n');
  const sourceIdentity = { paths, bytes: Buffer.byteLength(source), utf16: source.length, copies, sha256: hash(source) };
  const variant = values.upstream ? 'upstream' : 'optimized';
  const phases: object[] = [];
  global.gc?.();
  const before = process.memoryUsage(), started = performance.now();
  console.error(JSON.stringify({ event: 'start', variant, targetMiB, sourceIdentity, before }));
  const onProgress: NonNullable<DocumentOptions['onProgress']> = progress => {
    phases.push({ ...progress, elapsedMs: performance.now() - started, memory: process.memoryUsage() });
  };
  const document = new DocumentEngine(source, { id: 'memory-probe', extensions: standard(), onProgress });
  const parseIndexMs = performance.now() - started;
  const after = process.memoryUsage(), peakRssKiB = process.resourceUsage().maxRSS;
  global.gc?.();
  const retained = process.memoryUsage(), snapshot = document.getSnapshot();
  const baselineAdapterCalls = (globalThis as { __limrPipelineBaselineCalls?: number }).__limrPipelineBaselineCalls ?? 0;
  if (values.upstream && baselineAdapterCalls === 0) throw new Error('Upstream loader did not intercept a parser call');
  const counts = { blocks: snapshot.blocks.length, annotations: snapshot.annotations.length, headings: snapshot.headings.length,
    definitions: snapshot.definitions.size, footnotes: snapshot.footnotes.size, diagnostics: snapshot.diagnostics.length,
    lastEnd: snapshot.blocks.at(-1)?.range.end };
  console.error(JSON.stringify({ event: 'parseCompleted', variant, parseIndexMs, peakRssKiB, retained, sourceIdentity, ...counts }));
  const fingerprintEnabled = !values['no-fingerprint'];
  const graph = fingerprintEnabled ? parserGraphFingerprint(snapshot) : null;
  const result = { metadata, variant, targetMiB, baselineAdapterCalls, sourceIdentity,
    parseIndexMs, before, after, retained, peakRssKiB, phases, measuredBeforeFingerprint: true,
    forcedGCAfterTiming: !!global.gc, fingerprintEnabled, graph, ...counts, diagnosticDetails: snapshot.diagnostics };
  if (values.output) {
    const output = resolve(values.output);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  }
  console.log(JSON.stringify(result));
}
