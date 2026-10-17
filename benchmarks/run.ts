import { spawn } from 'node:child_process';
import { preview } from 'vite';

// Serialize all measured work. Every entry uses the current lockfile/source.
async function run(script: string, overrides: Record<string, string> = {}) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['run', script], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production', ...overrides } });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}
const extended = process.argv.includes('--extended');
if (extended) process.env.BENCH_EXTENDED = '1';
const stages = ['core', 'streaming', 'kp', 'renderers', 'layout', 'selection', ...(extended ? ['loading', 'large-comparison', 'reading'] : []), 'report'];
const from = process.argv.find(arg => arg.startsWith('--from='))?.slice(7) ?? 'core';
const start = stages.indexOf(from);
if (start < 0) throw new Error(`Unknown stage ${from}; choose ${stages.join(', ')}`);
for (const stage of stages.slice(start, 4)) await run(`bench:${stage}`);
if (start <= 5) {
  await run('build:playground');
  const server = await preview({ base: '/LiMR/', preview: { host: '127.0.0.1', port: 0 } });
  process.env.BENCH_URL = server.resolvedUrls!.local[0];
  console.log(`Playground benchmark server: ${process.env.BENCH_URL}`);
  try {
    if (start <= 4) await run('bench:layout');
    await run('bench:selection');
  } finally {
    await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()));
  }
}
if (extended) {
  if (start <= 6) await run('bench:loading');
  if (start <= 7) await run('bench:large-comparison');
  if (start <= 8) await run('bench:reading', { BENCH_READING_RENDERERS: 'async', BENCH_BROWSER_MODE: process.env.BENCH_BROWSER_MODE ?? 'headed', BENCH_OUTPUT: 'benchmarks/results/reading.json' });
}
await run('bench:report');
