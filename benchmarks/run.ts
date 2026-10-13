import { spawn } from 'node:child_process';
import { preview } from 'vite';

// Serialize all measured work. Every entry uses the current lockfile/source.
async function run(script: string) {
  await new Promise<void>((resolve, reject) => {
    const child = spawn('pnpm', ['run', script], { stdio: 'inherit', env: { ...process.env, NODE_ENV: 'production' } });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`)));
  });
}
const stages = ['core', 'streaming', 'kp', 'renderers', 'layout', 'selection', 'report'];
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
await run('bench:report');
