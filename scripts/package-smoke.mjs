import { cp, mkdtemp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';

const temporary = await mkdtemp(join(tmpdir(), 'limr-package-'));
function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development' } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
run('pnpm', ['pack', '--pack-destination', temporary], process.cwd());
const archive = (await readdir(temporary)).find(name => name.endsWith('.tgz'));
if (!archive) throw new Error('Package archive was not created');
const plugins = {};
for (const [directory, name] of [['reading-tools', '@limr-example/reading-tools'], ['paper-theme', '@limr-example/paper-theme']]) {
  const destination = join(temporary, directory); await mkdir(destination);
  run('pnpm', ['pack', '--pack-destination', destination], join(process.cwd(), 'examples/packages', directory));
  plugins[name] = `file:${join(destination, (await readdir(destination)).find(name => name.endsWith('.tgz')))}`;
}
for (const version of ['18.3.1', '19']) {
  const directory = join(temporary, `react-${version}`);
  await mkdir(directory);
  await writeFile(join(directory, 'package.json'), JSON.stringify({ name: 'limr-consumer-smoke', private: true, type: 'module', dependencies: { limr: `file:${join(temporary, archive)}`, react: version, 'react-dom': version, ...plugins }, devDependencies: { vite: '^7.3.7', typescript: '^5.9.3', '@types/react': version.startsWith('18') ? '^18.3.0' : '^19.0.0', '@types/react-dom': version.startsWith('18') ? '^18.3.0' : '^19.0.0' } }));
  run('pnpm', ['install', '--ignore-scripts'], directory);
  await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: false, target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', jsx: 'react-jsx', noEmit: true }, include: ['consumer.tsx'] }));
  await writeFile(join(directory, 'consumer.tsx'), `
import { Reader, standard, defineAnnotation, AnnotationCard, AnnotationMarkdown, type SelectionAction } from 'limr';
import { createDocument } from 'limr/core';
import { readingTools } from '@limr-example/reading-tools';
const extension = defineAnnotation<{text: string}>({ type: 'custom', label: 'Custom', overlay: { Card: props => <AnnotationCard {...props} title={props.annotation.data?.text ?? 'Custom card'} />, expand: { placement: 'center', width: 640 } }, Content: ({data}) => <AnnotationMarkdown source={data?.text ?? ''} streaming /> });
const actions: SelectionAction[] = [{ id: 'ask', label: 'Ask', run(context) { context.addAnnotation({id:'a', type:'custom', range:context.selection.raw.ranges[0]}); context.activateAnnotation('a'); } }];
const app = <Reader source="# hello" extensions={[...standard(), extension]} plugins={[readingTools()]} appearance="paper" actions={actions} />;
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
const fontPath = fileURLToPath(import.meta.resolve('limr/fonts.css'));
const fonts = await readFile(fontPath, 'utf8');
for (const match of fonts.matchAll(/url\\(([^)]+)\\)/g)) await access(resolve(dirname(fontPath), match[1].replace(/['"]/g, '')));
const base = await readFile(fileURLToPath(import.meta.resolve('limr/styles/base.css')), 'utf8');
if (base.includes('@import')) throw new Error('Font-free stylesheet unexpectedly imports assets');
await access(fileURLToPath(import.meta.resolve('@limr-example/paper-theme')));
console.log('SSR, extension entry and local math/Maple assets passed');
`);
  console.log(`React ${version}: ${run('node', ['smoke.mjs'], directory).trim()}; TypeScript passed`);
  await writeFile(join(directory, 'deny-react.mjs'), `export function resolve(specifier, context, next) { if (/^react(?:-dom)?(?:$|\\/)/.test(specifier)) throw new Error('React imported by core'); return next(specifier, context); }`);
  run('node', ['--loader', './deny-react.mjs', '--input-type=module', '-e', `import {createDocument} from 'limr/core'; if (createDocument('# Core').getSnapshot().headings.length !== 1) throw Error('Core failed');`], directory);
  console.log(`React ${version}: core imports without React/DOM`);
  await writeFile(join(directory, 'index.html'), '<!doctype html><html><meta charset="utf-8"><div id="root"></div><script type="module" src="/browser.js"></script></html>');
  await writeFile(join(directory, 'browser.js'), `
import { createElement as h, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { Reader } from 'limr';
import { readingTools } from '@limr-example/reading-tools';
import 'limr/styles.css';
import 'limr/math.css';
import '@limr-example/paper-theme';
const plugins = [readingTools()];
createRoot(document.getElementById('root')).render(h(Fragment, null,
  h(Reader, { source: '# Package consumer\\n\\nChoose **this passage** with $x^2$.\\n\\n<reading-tip>\\n\\nA plugin **tip**.\\n\\n</reading-tip>', plugins, appearance: 'paper', toc: false, sidebar: false }),
  h(Reader, { source: 'Independent classic reader.', toc: false, sidebar: false })
));
`);
  // Serve the actual installed tarballs, never an alias back into the repo.
  const server = spawn(process.execPath, [join(directory, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '0'], { cwd: directory, stdio: ['ignore', 'pipe', 'pipe'] });
  let url;
  const listening = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Consumer server did not start')), 20000);
    server.stdout.on('data', chunk => { const match = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/); if (match) { url = match[0]; clearTimeout(timeout); resolve(); } });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Consumer server exited: ${code}`)); });
  });
  let browser;
  try {
    await listening;
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(url);
    await expect(page.locator('.reading-tip')).toContainText('A plugin tip.');
    await expect(page.locator('.katex')).toHaveCount(1);
    await expect(page.locator('.limr-reader[data-limr-appearance="paper"]')).toHaveCSS('background-color', 'rgb(252, 250, 244)');
    await expect(page.locator('.limr-reader[data-limr-appearance="classic"]')).not.toHaveCSS('background-color', 'rgb(252, 250, 244)');
    await page.locator('.limr-reader strong').first().evaluate(element => {
      const range = document.createRange(); range.selectNodeContents(element);
      getSelection().removeAllRanges(); getSelection().addRange(range);
    });
    await page.getByRole('button', { name: 'Save passage', exact: true }).click();
    await expect(page.locator('.limr-annotation-expanded')).toContainText('Saved passage');
    await expect(page.locator('.limr-annotation-expanded')).toContainText('this passage');
    await expect(page.locator('.limr-annotation-expanded')).toHaveAttribute('data-limr-appearance', 'paper');
    await expect(page.locator('.limr-annotation-expanded .limr-overlay-surface')).toHaveCSS('background-color', 'rgb(252, 250, 244)');
    await expect(page.locator('.limr-selection-toolbar')).toHaveCount(0);
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`React ${version}: packed syntax/action/annotation plugin and scoped CSS package passed in Chromium`);
  } finally { await browser?.close(); server.kill('SIGTERM'); }
}
await mkdir('artifacts', { recursive: true });
await cp(join(temporary, archive), join('artifacts', archive));
console.log(`Packed package: ${join(process.cwd(), 'artifacts', archive)}`);
