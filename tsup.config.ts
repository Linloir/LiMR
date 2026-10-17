import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts', 'src/core/index.ts', 'src/react/index.ts', 'src/extensions/index.ts', 'src/worker-api.ts'],
    format: ['esm'], target: 'es2022', splitting: true, sourcemap: true, clean: false, dts: true,
    external: ['react', 'react-dom', 'react/jsx-runtime'],
  },
  {
    // A ready-to-run worker must not inherit the host bundler's browser-only
    // dependency exports (some entity decoders require document at import).
    entry: { worker: 'src/worker.ts' }, format: ['esm'], target: 'es2022', platform: 'browser',
    splitting: false, sourcemap: true, clean: false, dts: true, noExternal: [/.*/],
    esbuildOptions(options) { options.conditions = ['worker', 'module', 'import']; },
  },
]);
