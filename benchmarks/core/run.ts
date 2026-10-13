import { performance } from 'node:perf_hooks';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import Markstream from 'markstream-react';
import remarkGfm from 'remark-gfm';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm as gfmSyntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { createDocument } from '../../src/core';
import { gfm } from '../../src/extensions/gfm';
import { Markdown } from '../../src/react/Markdown';
import { fixture } from '../shared/fixture';
import { environment, hash, saveResult } from '../shared/environment';
import { stats, order } from '../shared/stats';
import { fullDOMOptions } from '../renderers/options';

const metadata = await environment();
const extensions = [gfm()];
const parserOptions = { extensions: [gfmSyntax()], mdastExtensions: gfmFromMarkdown() };
const results = [];
for (const sections of [20, 200, 2000]) {
  const source = fixture(sections);
  const runs = {
    'limr-core': () => createDocument(source, { extensions }),
    'mdast-gfm': () => fromMarkdown(source, parserOptions),
    'limr-ssr': () => renderToStaticMarkup(createElement(Markdown, { source, extensions, interactive: false, documentId: 'bench' })),
    'react-markdown-ssr': () => renderToStaticMarkup(createElement(ReactMarkdown, { children: source, remarkPlugins: [remarkGfm] })),
    'markstream-ssr': () => renderToStaticMarkup(createElement(Markstream, { content: source, final: true, ...fullDOMOptions })),
  };
  const names = Object.keys(runs) as (keyof typeof runs)[];
  const samples = Object.fromEntries(names.map(name => [name, [] as number[]]));
  const validity: Record<string, boolean> = {};
  for (const name of names) runs[name]();
  for (let trial = 0; trial < 5; trial++) for (const name of order(names, trial)) {
    const start = performance.now(), output = runs[name]();
    samples[name].push(performance.now() - start);
    // Validate outside timing. SSR that emits a virtualized prefix is not a
    // complete-document result, regardless of how quickly it returns.
    if (typeof output === 'string') validity[name] = (validity[name] ?? true) && output.includes(`Section ${sections}`)
      && (output.match(/<h2(?:\s|>)/g) ?? []).length === sections && (output.match(/<table(?:\s|>)/g) ?? []).length === sections;
  }
  const result = { scenario: 'static-gfm', sections, characters: source.length, sourceSHA256: hash(source), validity,
    measurements: Object.fromEntries(names.map(name => [name, stats(samples[name])])) };
  results.push(result); console.log(JSON.stringify(result));
}
await saveResult('core', { environment: metadata, methodology: 'Production Node. GFM only; no highlighting, math, styles, hydration or browser layout. One warmup, five cyclic/reversed trials per case, raw samples retained. Markstream uses explicit full-DOM options. SSR counts and tail text checked outside timing; parser timings are not renderer timings.', results });
