import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const katexDirectory = dirname(require.resolve('katex/package.json'));
await mkdir('dist', { recursive: true });
await cp('src/styles.css', 'dist/styles.css');
await cp('src/image-preview.css', 'dist/image-preview.css');
await cp('src/table.css', 'dist/table.css');
await cp('src/document-loading.css', 'dist/document-loading.css');
let base = (await readFile('src/styles.css', 'utf8')).replace('@import "./fonts/maple.css";', '');
for (const module of ['image-preview', 'table', 'document-loading']) {
  base = base.replace(`@import "./${module}.css";`, await readFile(`src/${module}.css`, 'utf8'));
}
await writeFile('dist/base.css', base);
await cp(join(katexDirectory, 'dist/katex.min.css'), 'dist/math.css');
await cp(join(katexDirectory, 'dist/fonts'), 'dist/fonts', { recursive: true });
await cp('src/fonts', 'dist/fonts', { recursive: true });
await writeFile('dist/THIRD_PARTY_LICENSES.txt', `KaTeX\n${await readFile(join(katexDirectory, 'LICENSE'), 'utf8')}\nMaple Mono NF CN v7.9 (local web subsets)\n${await readFile('src/fonts/LICENSE.txt', 'utf8')}\nmdast-util-from-markdown compiler adapter\n${await readFile('src/core/micromark/LICENSE.md', 'utf8')}`);
