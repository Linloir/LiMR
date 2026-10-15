import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { InlineConfig } from 'vite';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const rendererConfig: InlineConfig = {
  configFile: false, root: resolve(root, 'benchmarks/renderers'), plugins: [react()], logLevel: 'warn',
  build: {
    outDir: resolve(root, 'artifacts/benchmarks/renderers-dist'), emptyOutDir: true, target: 'esnext',
    sourcemap: process.env.BENCH_PROFILE === '1', reportCompressedSize: false,
    rollupOptions: { onwarn(warning, warn) { if (warning.code !== 'INVALID_ANNOTATION') warn(warning); } },
  },
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
};
