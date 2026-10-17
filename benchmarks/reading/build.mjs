import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const entityDecoder = require.resolve('decode-named-character-reference', {
  paths: [dirname(require.resolve('micromark-util-decode-string'))],
});
const directory = process.env.BENCH_READING_SNAPSHOT
  ? resolve(process.env.BENCH_READING_SNAPSHOT, 'benchmarks/reading') : dirname(fileURLToPath(import.meta.url));
await build({ configFile: false, root: directory, plugins: [react()],
  resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: entityDecoder }] },
  worker: { format: 'es' }, build: {
  outDir: process.env.BENCH_READING_BUILD ?? resolve(directory, '../../artifacts/benchmarks/reading-dist'),
  emptyOutDir: true, reportCompressedSize: false, sourcemap: process.env.BENCH_READING_SOURCEMAP === '1',
} });
