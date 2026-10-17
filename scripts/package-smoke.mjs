import { cp, mkdtemp, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';

const temporary = await mkdtemp(join(tmpdir(), 'limr-package-'));
function run(command, args, cwd, environment = {}) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_ENV: 'development', ...environment } });
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
run('pnpm', ['pack', '--pack-destination', temporary], process.cwd());
const archive = (await readdir(temporary)).find(name => name.endsWith('.tgz'));
if (!archive) throw new Error('Package archive was not created');
const contents = new Set(run('tar', ['-tzf', join(temporary, archive)], process.cwd()).trim().split('\n'));
for (const path of ['README.md', 'README.en.md', 'docs/zh-CN/modules.md', 'docs/en/modules.md', 'docs/assets/source.svg',
  'dist/worker.js', 'dist/worker.d.ts', 'dist/worker-api.js', 'dist/worker-api.d.ts', 'docs/en/large-documents.md', 'docs/zh-CN/large-documents.md',
  'docs/zh-CN/performance.md', 'docs/en/performance.md', 'docs/zh-CN/knuth-plass-performance.md', 'docs/en/knuth-plass-performance.md',
  'docs/assets/performance/limr-midpoint.png', 'docs/assets/performance/markstream-midpoint.png', 'benchmarks/README.md', 'benchmarks/results/renderers.json',
  'skills/limr-use/SKILL.md', 'skills/limr-plugin-development/SKILL.md', 'skills/limr-plugin-development/assets/plugin-template/package.json']) {
  if (!contents.has(`package/${path}`)) throw new Error(`Missing package resource: ${path}`);
}
// Build the distributed template from the archive, independent of repository aliases.
const unpacked = join(temporary, 'unpacked'); await mkdir(unpacked);
run('tar', ['-xzf', join(temporary, archive), '-C', unpacked], process.cwd());
const template = join(unpacked, 'package/skills/limr-plugin-development/assets/plugin-template');
const templatePackage = JSON.parse(await readFile(join(template, 'package.json'), 'utf8'));
templatePackage.devDependencies = { ...templatePackage.devDependencies, '@linloir/limr': `file:${join(temporary, archive)}`, react: '^19', 'react-dom': '^19' };
await writeFile(join(template, 'package.json'), JSON.stringify(templatePackage));
run('pnpm', ['install', '--ignore-scripts'], template);
run('pnpm', ['typecheck'], template);
const templateOutput = join(temporary, 'template'); await mkdir(templateOutput);
run('pnpm', ['pack', '--pack-destination', templateOutput], template);
const templateArchive = (await readdir(templateOutput)).find(name => name.endsWith('.tgz'));
if (!templateArchive) throw new Error('Skill plugin template did not produce an archive');
const plugins = {};
plugins[templatePackage.name] = `file:${join(templateOutput, templateArchive)}`;
for (const [directory, name] of [['reading-tools', '@limr-example/reading-tools'], ['paper-theme', '@limr-example/paper-theme']]) {
  const destination = join(temporary, directory); await mkdir(destination);
  run('pnpm', ['pack', '--pack-destination', destination], join(process.cwd(), 'examples/packages', directory));
  plugins[name] = `file:${join(destination, (await readdir(destination)).find(name => name.endsWith('.tgz')))}`;
}
for (const version of ['18.3.1', '19']) {
  const directory = join(temporary, `react-${version}`);
  await mkdir(directory);
  await writeFile(join(directory, 'package.json'), JSON.stringify({ name: 'limr-consumer-smoke', private: true, type: 'module', dependencies: { '@linloir/limr': `file:${join(temporary, archive)}`, react: version, 'react-dom': version, ...plugins }, devDependencies: { vite: '^7.3.7', typescript: '^5.9.3', '@types/react': version.startsWith('18') ? '^18.3.0' : '^19.0.0', '@types/react-dom': version.startsWith('18') ? '^18.3.0' : '^19.0.0' } }));
  run('pnpm', ['install', '--ignore-scripts'], directory);
  for (const example of ['inline-notes']) {
    await cp(join(process.cwd(), 'examples', `${example}.tsx`), join(directory, `${example}.tsx`));
  }
  await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, skipLibCheck: false, target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext', jsx: 'react-jsx', noEmit: true }, include: ['consumer.tsx'] }));
  await writeFile(join(directory, 'consumer.tsx'), `
import { AsyncReader, Reader, Markdown, DocumentProvider, standard, defineAnnotation, AnnotationCard, AnnotationMarkdown, ToolIcon, InlineMarker, useLiMR, useLocale, useRendererParameter, type RendererExtension, type SelectionAction, type ReadingPosition } from '@linloir/limr';
import { createDocument, prepareKnuthPlass } from '@linloir/limr/core';
import { createDocumentWorkerHandler, standardWorkerRegistry, type DocumentWorkerRequest } from '@linloir/limr/worker-api';
import { readingTools } from '@limr-example/reading-tools';
import { readingTools as templateTools } from '@example/limr-reading-tools';
import { inlineNotes } from './inline-notes.js';
const localFileApp = <Reader source="Editable" plugins={[inlineNotes()]} onSourceChange={(source, change) => { const revision: number = change.document.revision; return source.length > revision; }} />;
const templateApp = <Reader source="Template" plugins={[templateTools()]} />;
const localized = defineAnnotation({ type: 'localized', label: locale => locale.citation ?? 'Citation', overlay: { Card: props => <AnnotationCard {...props} title={useLocale().citation} /> } });
const extension = defineAnnotation<{text: string}>({ type: 'custom', label: 'Custom', overlay: { Card: props => <AnnotationCard {...props} title={props.annotation.data?.text ?? 'Custom card'} />, expand: { placement: 'center', width: 640 } }, Content: ({data}) => <AnnotationMarkdown source={data?.text ?? ''} streaming /> });
const actions: SelectionAction[] = [{ id: 'ask', label: 'Ask', icon: <ToolIcon name="note" />, run(context) { context.addAnnotation({id:'a', type:'custom', range:context.selection.raw.ranges[0]}, {edit:true}); }, renderExpanded: context => <button onClick={() => void context.run(current => { if (current.highlight) current.updateAnnotation(current.highlight.id, {data: {...current.highlight.data, style: 'wavy'}}); })}>Change style</button> }];
const app = <Reader source="# hello" extensions={[...standard(), extension]} plugins={[readingTools()]} appearance="paper" actions={actions} justify />;
declare module '@linloir/limr' { interface RendererParameters { consumerDensity?: number } }
const parameterPlugin: RendererExtension = { name: 'consumer-parameters', parameters: { consumerDensity: 2 }, components: { parameter: () => <InlineMarker label="Density">{useRendererParameter('consumerDensity')}</InlineMarker> } };
const standalone = <Markdown source="Text" justify plugins={[parameterPlugin]} parameters={{ consumerDensity: 3, translationMode: 'both', onTranslationModeChange: mode => { const checked: 'origin' | 'translation' | 'both' = mode; } }} />;
const shared = <DocumentProvider source="Text" justify><Markdown justify={false} /></DocumentProvider>;
function ReaderIntegration() { const api = useLiMR(); const position: ReadingPosition | null = api.getReadingPosition(); return <button disabled={!api.isDocumentComplete()} onClick={() => position ? api.restoreReadingPosition(position) : api.scrollToSource({ start: 10, end: 20 })}>Jump</button>; }
const asynchronous = <AsyncReader input={new Blob(['A book'])} loading={{ mode: 'blocking', worker: () => new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }) }}><ReaderIntegration /></AsyncReader>;
const layoutApp = <Reader source="==Marked==" typography="knuth-plass" knuthPlass={{ tolerance: 200, hyphenate: word => [word] }} streamEffect={{ keyframes: [{ opacity: 0 }, { opacity: 1 }] }} rendererOverrides={[{ type: 'code', when: (node, context) => node.lang === 'js' && !context.incomplete, component: ({ renderValue }) => <pre>{renderValue()}</pre> }]} />;
prepareKnuthPlass([{ type: 'box', width: 10 }, { type: 'penalty', width: 0, penalty: -10000 }])(400);
createDocument('Core').getSnapshot();
const workerHandler = createDocumentWorkerHandler(standardWorkerRegistry);
const acceptsWorkerRequest: Parameters<typeof workerHandler>[0] = {} as DocumentWorkerRequest;
`);
  run('pnpm', ['exec', 'tsc'], directory);
  await writeFile(join(directory, 'smoke.mjs'), `
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Markdown, Reader, preloadMath } from '@linloir/limr';
import { standard } from '@linloir/limr/extensions';
import { createDocument } from '@linloir/limr/core';
await preloadMath();
const paired = '::%%limr%%{<#range}First **bold**\\n\\nSecond text::%%limr%%{>#range}\\n\\n:::limr-annotation{#note ranges="range" type="footnote"}\\nA packed note\\n:::';
const pairedDocument = createDocument(paired, { extensions: standard() }).getSnapshot();
if (pairedDocument.annotationRanges.size !== 1 || !pairedDocument.annotationRanges.get('range')[0].openingRange) throw new Error('Packed paired annotation parser failed');
const pairedHtml = renderToString(createElement(Markdown, { source: paired }));
if (pairedHtml.includes('%%limr') || !pairedHtml.includes('data-limr-marker')) throw new Error('Packed paired annotation rendering failed');
const html = renderToString(createElement(Reader, { source: '# Packed package\\n\\n$x^2$\\n\\nText<ref id="p" />.\\n\\n<citation id="p" title="Paper" />', documentId: 'packed', extensions: standard(), justify: true }));
if (!html.includes('packed-packed-package') || !html.includes('katex-mathml') || !html.includes('data-limr-justify="true"')) throw new Error('SSR output is incomplete');
if (!renderToString(createElement(Markdown, {source:'**bold**'})).includes('<strong>')) throw new Error('Standalone Markdown failed');
const cssPath = fileURLToPath(import.meta.resolve('@linloir/limr/math.css'));
const css = await readFile(cssPath, 'utf8');
for (const match of css.matchAll(/url\\(([^)]+)\\)/g)) await access(resolve(dirname(cssPath), match[1].replace(/['"]/g, '')));
await access(fileURLToPath(import.meta.resolve('@linloir/limr/styles.css')));
const fontPath = fileURLToPath(import.meta.resolve('@linloir/limr/fonts.css'));
const fonts = await readFile(fontPath, 'utf8');
for (const match of fonts.matchAll(/url\\(([^)]+)\\)/g)) await access(resolve(dirname(fontPath), match[1].replace(/['"]/g, '')));
const base = await readFile(fileURLToPath(import.meta.resolve('@linloir/limr/styles/base.css')), 'utf8');
if (base.includes('@import')) throw new Error('Font-free stylesheet unexpectedly imports assets');
await access(fileURLToPath(import.meta.resolve('@limr-example/paper-theme')));
console.log('SSR, extension entry and local math/Maple assets passed');
`);
  console.log(`React ${version}: ${run('node', ['smoke.mjs'], directory).trim()}; TypeScript passed`);
  await writeFile(join(directory, 'deny-react.mjs'), `export function resolve(specifier, context, next) { if (/^react(?:-dom)?(?:$|\\/)/.test(specifier)) throw new Error('React imported by core'); return next(specifier, context); }`);
  run('node', ['--loader', './deny-react.mjs', '--input-type=module', '-e', `import {createDocument} from '@linloir/limr/core'; if (createDocument('# Core').getSnapshot().headings.length !== 1) throw Error('Core failed');`], directory);
  run('node', ['--loader', './deny-react.mjs', '--input-type=module', '-e', `globalThis.addEventListener = () => { throw Error('worker-api installed a listener'); }; globalThis.postMessage = () => { throw Error('worker-api posted a message'); }; const api = await import('@linloir/limr/worker-api'); if (typeof api.createDocumentWorkerHandler !== 'function' || !Object.keys(api.standardWorkerRegistry).length) throw Error('Worker API exports missing');`], directory);
  console.log(`React ${version}: core imports without React/DOM`);
  // This side-effect import is deliberately bundled in production: the worker
  // entry must register its listener rather than being removed by tree shaking.
  await writeFile(join(directory, 'worker.js'), "import '@linloir/limr/worker';\n");
  await writeFile(join(directory, 'index.html'), '<!doctype html><html><meta charset="utf-8"><div id="root"></div><script type="module" src="/browser.js"></script></html>');
  await writeFile(join(directory, 'browser.js'), `
import { createElement as h, Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { AsyncReader, Reader, chinese, useLiMR } from '@linloir/limr';
import { readingTools } from '@limr-example/reading-tools';
import { readingTools as templateTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';
import '@limr-example/paper-theme';
import '@example/limr-reading-tools/styles.css';
const plugins = [readingTools()];
const workerSource = '# Worker &amp; reader\\n\\n' + Array.from({ length: 200 }, (_, index) => 'Loaded paragraph ' + index + '.').join('\\n\\n');
function WorkerIntegration() {
  const reader = useLiMR();
  return h('button', { onClick: () => { const start = workerSource.indexOf('Loaded paragraph 199.'); reader.scrollToSource({ start, end: start + 1 }); } }, 'Read the loaded ending');
}
createRoot(document.getElementById('root')).render(h(Fragment, null,
  h(Reader, { source: '# Package consumer\\n\\nChoose **this passage** with $x^2$.\\n\\n<reading-tip>\\n\\nA plugin **tip**.\\n\\n</reading-tip>', plugins, appearance: 'paper', toc: false, sidebar: false }),
  h(Reader, { source: 'Independent classic reader.', toc: false, sidebar: false }),
  h(Reader, { documentId: 'template', source: 'A **template passage**.\\n\\n<reading-tip title="Template">\\n\\nA template tip.\\n\\n</reading-tip>', plugins: [templateTools()], locale: chinese, toc: false, sidebar: false }),
  h(Reader, { documentId: 'modules', source: '> [!tip] Tip\\n> Built in.\\n\\n==Standalone== and ==Marked==[^n]\\n\\n[^n]: Packed footnote.\\n\\n::mermaid\\nflowchart LR\\nA-->B\\n::', typography: 'knuth-plass', locale: chinese, toc: false, sidebar: false }),
  h(AsyncReader, { documentId: 'worker', input: workerSource, loading: { fallback: 'error', worker: () => new Worker(new URL('./worker.js', import.meta.url), { type: 'module' }) }, onLoadStateChange: state => { window.workerState = state; }, toc: false, sidebar: false }, h(WorkerIntegration))
));
`);
  // Build and serve actual installed tarballs, never repository aliases or HMR.
  run('pnpm', ['exec', 'vite', 'build'], directory, { NODE_ENV: 'production' });
  const server = spawn(process.execPath, [join(directory, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '0'], { cwd: directory, stdio: ['ignore', 'pipe', 'pipe'] });
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
    await page.waitForFunction(() => ['ready', 'error'].includes(window.workerState?.status));
    const workerError = await page.evaluate(() => window.workerState.error?.message);
    if (workerError) throw new Error(`Packed worker failed: ${workerError}`);
    expect(await page.evaluate(() => window.workerState.capabilities.worker)).toBe(true);
    expect(await page.evaluate(() => ({ complete: window.workerState.complete, blocks: window.workerState.document.getSnapshot().blocks.length, ending: window.workerState.document.getSnapshot().source.endsWith('Loaded paragraph 199.') }))).toEqual({ complete: true, blocks: 201, ending: true });
    await expect(page.locator('[data-limr-document="worker"] [data-limr-windowed]')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Worker & reader' })).toHaveCount(1);
    expect(await page.locator('[data-limr-document="worker"] [data-limr-block]').count()).toBeLessThan(100);
    await expect(page.locator('.reading-tip')).toContainText('A plugin tip.');
    await expect(page.locator('.katex')).toHaveCount(1);
    await expect(page.locator('.limr-reader[data-limr-appearance="paper"]')).toHaveCSS('background-color', 'rgb(252, 250, 244)');
    await expect(page.locator('.limr-reader[data-limr-appearance="classic"]').first()).not.toHaveCSS('background-color', 'rgb(252, 250, 244)');
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
    await page.keyboard.press('Escape');
    await expect(page.locator('.example-reading-tip')).toContainText('A template tip.');
    await expect(page.locator('.example-reading-tip')).toHaveCSS('border-left-style', 'solid');
    await page.locator('.limr-reader-content strong').filter({ hasText: 'template passage' }).evaluate(element => {
      const range = document.createRange(); range.selectNodeContents(element);
      getSelection().removeAllRanges(); getSelection().addRange(range);
    });
    await page.getByRole('button', { name: '阅读笔记', exact: true }).click();
    await expect(page.locator('.limr-annotation-expanded')).toContainText('阅读笔记');
    await expect(page.locator('.limr-annotation-expanded')).toContainText('template passage');
    await page.keyboard.press('Escape');
    const modules = page.locator('[data-limr-document="modules"]');
    await modules.scrollIntoViewIfNeeded();
    await expect(modules.locator('.limr-callout')).toContainText('Built in.');
    await expect(modules.locator('[data-mermaid-state="ready"] .limr-mermaid-canvas > svg')).toHaveCount(1, { timeout: 20000 });
    await expect(modules.locator('p').first()).toHaveAttribute('data-limr-kp');
    await modules.getByRole('button', { name: '脚注', exact: true }).click();
    await expect(page.getByRole('dialog', { name: '脚注', exact: true })).toContainText('Packed footnote.');
    await page.keyboard.press('Escape');
    await modules.locator('mark').first().click();
    await expect(page.getByRole('toolbar')).toHaveAttribute('data-readonly', 'true');
    await expect(page.getByRole('toolbar').getByRole('button')).toHaveCount(1);
    await page.getByRole('button', { name: 'Read the loaded ending' }).click();
    await expect(page.locator('[data-limr-document="worker"]').getByText('Loaded paragraph 199.', { exact: true })).toBeInViewport();
    if (errors.length) throw new Error(errors.join('\n'));
    console.log(`React ${version}: packed plugins, scoped CSS, skill template, KP, Mermaid, callout, highlight and footnote modules passed in Chromium`);
  } finally { await browser?.close(); server.kill('SIGTERM'); }
}
await mkdir('artifacts', { recursive: true });
await cp(join(temporary, archive), join('artifacts', archive));
console.log(`Packed package: ${join(process.cwd(), 'artifacts', archive)}`);
