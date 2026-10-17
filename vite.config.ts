import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
const require = createRequire(import.meta.url);
// Use the package's DOM-free default decoder in source-level worker fixtures.
const entityDecoder = require.resolve('decode-named-character-reference', { paths: [dirname(require.resolve('micromark-util-decode-string'))] });

export default defineConfig({
  plugins: [react()],
  resolve: { alias: [{ find: /^decode-named-character-reference$/, replacement: entityDecoder }, { find: /^@linloir\/limr$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) }] },
  root: 'playground',
  server: { port: 4173, strictPort: true, fs: { allow: ['..'] } },
  build: { outDir: '../demo-dist', emptyOutDir: true },
});
