import { setTimeout as delay } from 'node:timers/promises';

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GH_TOKEN;
const commit = process.env.LIMR_PAGES_COMMIT;
const source = process.env.GITHUB_SHA;
if (!repository || !token || !commit || !source) throw new Error('Missing Pages workflow environment');
const endpoint = `${process.env.GITHUB_API_URL ?? 'https://api.github.com'}/repos/${repository}/pages`;
async function request(path = '', method = 'GET') {
  const response = await fetch(endpoint + path, { method, headers: {
    Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
  } });
  if (!response.ok) throw new Error(`Pages ${method} ${path || '/'} failed (${response.status}): ${await response.text()}`);
  return response.json();
}
const site = await request();
if (site.build_type === 'workflow' || site.source?.branch !== 'pages' || site.source?.path !== '/') {
  throw new Error('This workflow publishes the pages branch. Set Pages source to Deploy from a branch: pages / (root).');
}
await request('/builds', 'POST');
let complete = false;
for (let attempt = 0; attempt < 60; attempt++) {
  const build = await request('/builds/latest');
  if (build.commit === commit && build.status === 'errored') throw new Error(build.error?.message || 'Pages build failed');
  if (build.commit === commit && build.status === 'built') { complete = true; break; }
  await delay(10000);
}
if (!complete) throw new Error(`Timed out waiting for Pages commit ${commit}`);
for (let attempt = 0; attempt < 30; attempt++) {
  const url = new URL('build-info.json', site.html_url.endsWith('/') ? site.html_url : site.html_url + '/');
  url.searchParams.set('verify', `${commit}-${Date.now()}`);
  const response = await fetch(url);
  if (response.ok) {
    const info = await response.json();
    if (info.sourceCommit === source && !info.sourceDirty) {
      console.log(`Verified Playground ${info.version}: ${site.html_url} (source ${source}, pages ${commit})`);
      process.exit(0);
    }
  }
  await delay(10000);
}
throw new Error(`Pages built ${commit}, but the live build-info.json did not match source ${source}`);
