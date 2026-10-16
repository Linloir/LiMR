import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { afterEach, describe, expect, it } from 'vitest';

const run = promisify(execFile);
const servers: ReturnType<typeof createServer>[] = [];
afterEach(async () => { await Promise.all(servers.splice(0).map(server => new Promise<void>(resolve => server.close(() => resolve())))); });

async function fixture(options: { branch?: string; status?: string } = {}) {
  const requests: string[] = [];
  let origin: string;
  const server = createServer((request, response) => {
    const path = new URL(request.url!, origin).pathname;
    requests.push(`${request.method} ${path}`);
    response.setHeader('Content-Type', 'application/json');
    if (path.startsWith('/repos/') && request.headers.authorization !== 'Bearer local-test-token') {
      response.writeHead(401).end('{}'); return;
    }
    const data = path === '/repos/example/LiMR/pages' ? { source: { branch: options.branch ?? 'pages', path: '/' }, build_type: 'legacy', html_url: `${origin}/site/` }
      : path.endsWith('/builds/latest') ? { commit: 'pages-commit', status: options.status ?? 'built', error: { message: 'Build rejected' } }
      : path.endsWith('/builds') ? { status: 'queued' }
      : path === '/site/build-info.json' ? { sourceCommit: 'source-commit', sourceDirty: false, version: '1.2.1' } : null;
    response.writeHead(data ? 200 : 404).end(JSON.stringify(data));
  });
  servers.push(server);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  return { requests, execute: () => run(process.execPath, ['scripts/request-pages-build.mjs'], { env: {
    ...process.env, GITHUB_REPOSITORY: 'example/LiMR', GITHUB_API_URL: origin,
    GH_TOKEN: 'local-test-token', LIMR_PAGES_COMMIT: 'pages-commit', GITHUB_SHA: 'source-commit',
  } }) };
}

describe('Pages branch deployment verification', () => {
  it('explicitly starts the build, checks its commit, then verifies the public source revision', async () => {
    const { execute, requests } = await fixture();
    expect((await execute()).stdout).toContain('Verified Playground 1.2.1');
    expect(requests).toEqual(['GET /repos/example/LiMR/pages', 'POST /repos/example/LiMR/pages/builds', 'GET /repos/example/LiMR/pages/builds/latest', 'GET /site/build-info.json']);
  });
  it('refuses to publish using a different configured branch', async () => {
    const { execute, requests } = await fixture({ branch: 'main' });
    await expect(execute()).rejects.toThrow('Set Pages source');
    expect(requests).toEqual(['GET /repos/example/LiMR/pages']);
  });
  it('reports a failed build without claiming the live site was deployed', async () => {
    const { execute, requests } = await fixture({ status: 'errored' });
    await expect(execute()).rejects.toThrow('Build rejected');
    expect(requests.some(request => request.includes('/site/'))).toBe(false);
  });
});
