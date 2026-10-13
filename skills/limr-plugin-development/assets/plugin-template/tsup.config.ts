import { cp } from 'node:fs/promises';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'], format: ['esm'], target: 'es2022', dts: true, clean: true,
  external: ['@linloir/limr', 'react', 'react/jsx-runtime', 'react-dom'],
  onSuccess: async () => { await cp('src/styles.css', 'dist/styles.css'); },
});
