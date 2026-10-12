import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/core/index.ts', 'src/react/index.ts', 'src/extensions/index.ts'],
  format: ['esm'],
  target: 'es2022',
  splitting: true,
  sourcemap: true,
  clean: true,
  dts: true,
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
