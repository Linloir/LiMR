import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const decoder = require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] });
await build({ configFile: false, root: resolve('benchmarks/large-comparison'), plugins: [react()], logLevel: 'warn', resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: decoder }] },
  build: { outDir: resolve('artifacts/benchmarks/large-comparison/site'), emptyOutDir: true, target: 'esnext', reportCompressedSize: false } });
