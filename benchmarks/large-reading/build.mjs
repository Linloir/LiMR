import { build } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const decoder = require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] });
const root = resolve(process.env.LIMR_LARGE_SNAPSHOT ?? '.', 'benchmarks/large-reading');
await build({ configFile: false, root, plugins: [react()], resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: decoder }] }, build: { outDir: resolve(process.env.LIMR_LARGE_BUILD ?? '/tmp/limr-large-reading-dist'), emptyOutDir: true, reportCompressedSize: false } });
