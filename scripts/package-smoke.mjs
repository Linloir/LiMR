import { cp, mkdtemp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const temporary = await mkdtemp(join(tmpdir(), 'limr-package-'));
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
run('pnpm', ['pack', '--pack-destination', temporary], process.cwd());
const archive = (await readdir(temporary)).find(name => name.endsWith('.tgz'));
if (!archive) throw new Error('Package archive was not created');
for (const version of ['18.3.1', '19']) {
  const directory = join(temporary, `react-${version}`);
  await mkdir(directory);
  await writeFile(join(directory, 'package.json'), JSON.stringify({ name: 'limr-consumer-smoke', private: true, type: 'module', dependencies: { limr: `file:${join(temporary, archive)}`, react: version, 'react-dom': version }, devDependencies: { typescript: '^5.9.3', '@types/react': version.startsWith('18') ? '^18.3.0' : '^19.0.0', '@types/react-dom': version.startsWith('18') ? '^18.3.0' : '^19.0.0' } }));
  run('pnpm', ['install', '--ignore-scripts'], directory);
  await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: false, target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', jsx: 'react-jsx', noEmit: true }, include: ['consumer.tsx'] }));
  await writeFile(join(directory, 'consumer.tsx'), `
import { Reader, standard, defineAnnotation, AnnotationMarkdown, type SelectionAction } from 'limr';
import { createDocument } from 'limr/core';
const extension = defineAnnotation<{text: string}>({ type: 'custom', label: 'Custom', Content: ({data}) => <AnnotationMarkdown source={data?.text ?? ''} streaming /> });
const actions: SelectionAction[] = [{ id: 'ask', label: 'Ask', run(context) { context.addAnnotation({id:'a', type:'custom', range:context.selection.raw.ranges[0]}); context.activateAnnotation('a'); } }];
const app = <Reader source="# hello" extensions={[...standard(), extension]} actions={actions} />;
createDocument('Core').getSnapshot();
`);
  run('pnpm', ['exec', 'tsc'], directory);
  await writeFile(join(directory, 'smoke.mjs'), `
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Markdown, Reader, preloadMath } from 'limr';
import { standard } from 'limr/extensions';
await preloadMath();
const html = renderToString(createElement(Reader, { source: '# Packed package\\n\\n$x^2$\\n\\nText<ref id="p" />.\\n\\n<citation id="p" title="Paper" />', documentId: 'packed', extensions: standard() }));
if (!html.includes('packed-packed-package') || !html.includes('katex-mathml')) throw new Error('SSR output is incomplete');
if (!renderToString(createElement(Markdown, {source:'**bold**'})).includes('<strong>')) throw new Error('Standalone Markdown failed');
const cssPath = fileURLToPath(import.meta.resolve('limr/math.css'));
const css = await readFile(cssPath, 'utf8');
for (const match of css.matchAll(/url\\(([^)]+)\\)/g)) await access(resolve(dirname(cssPath), match[1].replace(/['"]/g, '')));
await access(fileURLToPath(import.meta.resolve('limr/styles.css')));
console.log('SSR, extension entry and local math assets passed');
`);
  console.log(`React ${version}: ${run('node', ['smoke.mjs'], directory).trim()}; TypeScript passed`);
  await writeFile(join(directory, 'deny-react.mjs'), `export function resolve(specifier, context, next) { if (/^react(?:-dom)?(?:$|\\/)/.test(specifier)) throw new Error('React imported by core'); return next(specifier, context); }`);
  run('node', ['--loader', './deny-react.mjs', '--input-type=module', '-e', `import {createDocument} from 'limr/core'; if (createDocument('# Core').getSnapshot().headings.length !== 1) throw Error('Core failed');`], directory);
  console.log(`React ${version}: core imports without React/DOM`);
}
await mkdir('artifacts', { recursive: true });
await cp(join(temporary, archive), join('artifacts', archive));
console.log(`Packed package: ${join(process.cwd(), 'artifacts', archive)}`);
