import { performance } from 'node:perf_hooks';
import { cpus, platform, release } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm as gfmSyntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { createDocument } from '../src/core';
import { gfm } from '../src/extensions/gfm';
import { Markdown } from '../src/react/Markdown';
import { fixture } from './fixture';

const extensions = [gfm()];
const parserOptions = { extensions: [gfmSyntax()], mdastExtensions: gfmFromMarkdown() };
function measure(run: () => unknown, samples = 5) {
  run();
  const values = Array.from({ length: samples }, () => { const start = performance.now(); run(); return performance.now() - start; }).sort((a, b) => a - b);
  return { medianMs: +values[Math.floor(values.length / 2)].toFixed(2), minMs: +values[0].toFixed(2), maxMs: +values.at(-1)!.toFixed(2) };
}
const results: Record<string, unknown>[] = [];
for (const count of [200, 2000]) {
  const source = fixture(count);
  const result = {
    scenario: 'static-gfm', characters: source.length, sections: count,
    core: measure(() => createDocument(source, { extensions })),
    mdast: measure(() => fromMarkdown(source, parserOptions)),
    limrSSR: measure(() => renderToStaticMarkup(createElement(Markdown, { source, extensions, interactive: false, documentId: 'bench' })), 3),
    reactMarkdownSSR: measure(() => renderToStaticMarkup(createElement(ReactMarkdown, { children: source, remarkPlugins: [remarkGfm] })), 3),
  };
  results.push(result); console.log(JSON.stringify(result));
}
const source = fixture(80), chunkSize = 256;
const streaming = {
  scenario: 'streaming-gfm', characters: source.length, chunkSize, updates: Math.ceil(source.length / chunkSize),
  incremental: measure(() => {
    const doc = createDocument('', { extensions, streaming: true });
    for (let i = 0; i < source.length; i += chunkSize) doc.append(source.slice(i, i + chunkSize));
    doc.finish();
  }, 3),
  fullParse: measure(() => { for (let i = chunkSize; i < source.length + chunkSize; i += chunkSize) fromMarkdown(source.slice(0, i), parserOptions); }, 3),
};
results.push(streaming); console.log(JSON.stringify(streaming));
await mkdir('benchmarks/results', { recursive: true });
await writeFile('benchmarks/results/node.json', JSON.stringify({ date: new Date().toISOString(), node: process.version, mode: process.env.NODE_ENV ?? 'development', platform: `${platform()} ${release()}`, cpu: cpus()[0].model, results }, null, 2) + '\n');
