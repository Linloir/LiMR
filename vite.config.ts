import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: [{ find: /^limr$/, replacement: fileURLToPath(new URL('./src/index.ts', import.meta.url)) }] },
  root: 'playground',
  server: { port: 4173, strictPort: true, fs: { allow: ['..'] } },
  build: { outDir: '../demo-dist', emptyOutDir: true },
});
