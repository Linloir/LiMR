import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const output = new URL('../demo-dist/', import.meta.url);
const hash = value => createHash('sha256').update(value).digest('hex');
const version = JSON.parse(await readFile(new URL('package.json', root), 'utf8')).version;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const info = {
  version,
  sourceCommit: git('rev-parse', 'HEAD'),
  sourceDirty: !!git('status', '--porcelain', '--untracked-files=normal'),
  builtAt: new Date().toISOString(),
  lockfileSHA256: hash(await readFile(new URL('pnpm-lock.yaml', root))),
  ...(process.env.GITHUB_RUN_ID ? { workflowRun: `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}` } : {}),
};
await writeFile(new URL('build-info.json', output), JSON.stringify(info, null, 2) + '\n');
await writeFile(new URL('.nojekyll', output), '');
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(entry => entry.isDirectory() ? files(join(directory, entry.name)) : entry.isFile() ? [join(directory, entry.name)] : []));
  return paths.flat();
}
const directory = fileURLToPath(output);
const paths = (await files(directory)).filter(path => relative(directory, path) !== 'SHA256SUMS').sort();
const checksums = await Promise.all(paths.map(async path => `${hash(await readFile(path))}  ${relative(directory, path).split('\\').join('/')}`));
await writeFile(new URL('SHA256SUMS', output), checksums.join('\n') + '\n');
console.log(`Playground ${version}: ${paths.length} checksums, source ${info.sourceCommit}${info.sourceDirty ? ' (working tree changes)' : ''}`);
