import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/browser',
  // Interaction latency is a regression gate; concurrent renderers would make
  // its frame budget a measure of test contention instead of reader behavior.
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4173', headless: true, screenshot: 'only-on-failure' },
  webServer: { command: 'pnpm dev', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
