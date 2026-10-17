import { readFile, readdir, stat, mkdtemp, writeFile, symlink, rm } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import ts from 'typescript';

const root = resolve(import.meta.dirname, '..');
async function files(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).filter(entry => !['node_modules', 'dist'].includes(entry.name)).map(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : path.endsWith('.md') ? [path] : [];
  }))).flat();
}
const markdownFiles = [join(root, 'README.md'), join(root, 'README.en.md'), ...await files(join(root, 'docs')), ...await files(join(root, 'skills')), ...await files(join(root, 'benchmarks'))];
const failures = [];
const snippets = [];
let links = 0;
for (const file of markdownFiles) {
  const tree = fromMarkdown(await readFile(file, 'utf8'), { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] });
  const visit = async node => {
    if (['link', 'image', 'definition'].includes(node.type) && node.url && !/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(node.url)) {
      links++;
      const path = resolve(dirname(file), decodeURIComponent(node.url.split(/[?#]/)[0]));
      try { await stat(path); }
      catch { failures.push(`${relative(root, file)}:${node.position.start.line}: missing ${node.url}`); }
    }
    if (node.type === 'code' && /^(?:tsx?|typescript)$/.test(node.lang ?? '') && !node.value.includes('@example/') && /\bimport\b/.test(node.value)) {
      snippets.push({ source: relative(root, file), line: node.position.start.line, code: node.value });
    }
    for (const child of node.children ?? []) await visit(child);
  };
  await visit(tree);
}
const zh = (await readdir(join(root, 'docs/zh-CN'))).filter(file => file.endsWith('.md')).sort();
const en = (await readdir(join(root, 'docs/en'))).filter(file => file.endsWith('.md')).sort();
if (JSON.stringify(zh) !== JSON.stringify(en)) failures.push('Chinese and English document sets differ');

const temporary = await mkdtemp(join(tmpdir(), 'limr-docs-check-'));
try {
  await symlink(join(root, 'node_modules'), join(temporary, 'node_modules'), 'junction');
  const paths = [];
  for (const [index, snippet] of snippets.entries()) {
    const path = join(temporary, `example-${index}.tsx`);
    await writeFile(path, `${snippet.code}\nexport {};\n`);
    paths.push(path);
  }
  const program = ts.createProgram(paths, {
    noEmit: true, strict: true, skipLibCheck: true, esModuleInterop: true,
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX,
    paths: {
      '@linloir/limr': [join(root, 'src/index.ts')],
      '@linloir/limr/core': [join(root, 'src/core/index.ts')],
      '@linloir/limr/react': [join(root, 'src/react/index.ts')],
      '@linloir/limr/extensions': [join(root, 'src/extensions/index.ts')],
      '@linloir/limr/worker': [join(root, 'src/worker.ts')],
      '@linloir/limr/worker-api': [join(root, 'src/worker-api.ts')],
    },
  });
  for (const diagnostic of ts.getPreEmitDiagnostics(program)) {
    const index = diagnostic.file ? paths.indexOf(diagnostic.file.fileName) : -1;
    const snippet = snippets[index];
    const at = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
    failures.push(`${snippet ? `${snippet.source}:${snippet.line + (at?.line ?? 0) + 1}` : diagnostic.file?.fileName ?? 'TypeScript'}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
  }
} finally { await rm(temporary, { recursive: true, force: true }); }
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`${markdownFiles.length} Markdown files; ${links} local links; ${zh.length} bilingual page pairs; ${snippets.length} TypeScript examples passed.`);
