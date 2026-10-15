import { cpus, platform, release, totalmem, freemem, loadavg } from 'node:os';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const hash = (source: string | Buffer) => createHash('sha256').update(source).digest('hex');
async function treeHash(directory: string): Promise<string> {
  const entries = await readdir(resolve(root, directory), { withFileTypes: true });
  const contents = await Promise.all(entries.sort((a, b) => a.name.localeCompare(b.name)).filter(e => e.name !== 'results' && `${directory}/${e.name}` !== 'playground/public/downloads').map(async e => {
    const path = `${directory}/${e.name}`;
    return `${path}:${e.isDirectory() ? await treeHash(path) : hash(await readFile(resolve(root, path)))}`;
  }));
  return hash(contents.join('\n'));
}
export async function packageVersion(name: string): Promise<string> {
  let path = dirname(fileURLToPath(import.meta.resolve(name)));
  for (;;) {
    try { const data = JSON.parse(await readFile(resolve(path, 'package.json'), 'utf8')); if (data.name === name) return data.version; } catch { /* parent package */ }
    const parent = dirname(path); if (parent === path) throw new Error(`No package.json for ${name}`); path = parent;
  }
}
export async function environment() {
  return {
    date: new Date().toISOString(), timezone: 'Asia/Shanghai', node: process.version, mode: process.env.NODE_ENV,
    platform: `${platform()} ${release()}`, cpu: cpus()[0].model, logicalCPUs: cpus().length, memoryBytes: totalmem(), freeMemoryBytes: freemem(), loadAverage: loadavg(),
    revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    sourceSHA256: await treeHash('src'), harnessSHA256: await treeHash('benchmarks'), playgroundSHA256: await treeHash('playground'), examplesSHA256: await treeHash('examples'), lockSHA256: hash(await readFile(resolve(root, 'pnpm-lock.yaml'))),
    versions: Object.fromEntries(await Promise.all(['react', 'react-dom', 'react-markdown', 'remark-gfm', 'remark-math', 'rehype-katex', 'markstream-react', 'stream-diffs', 'katex', 'shiki'].map(async name => [name, await packageVersion(name)]))),
    liMR: JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')).version,
    cpuThrottle: 1, network: 'Local production preview; no network or CPU throttling',
  };
}
export async function saveResult(name: string, data: unknown) {
  const output = resolve(root, process.env.BENCH_OUTPUT ?? `benchmarks/results/${name}.json`);
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(data, null, 2) + '\n');
}
