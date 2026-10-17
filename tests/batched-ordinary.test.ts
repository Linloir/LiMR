import { describe, expect, it } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { gfm as rawGfm } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import { math as rawMath } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import { createDocument, walk, type DocumentProgress, type MarkdownNode, type SyntaxExtension } from '../src/core';
import { isIndependentProse, parseInBatches } from '../src/core/batched-parse';
import { standard } from '../src/extensions/standard';

const compact = { minimum: 0, target: 1 };
const options = { extensions: [rawGfm(), rawMath()], mdastExtensions: [...gfmFromMarkdown(), mathFromMarkdown()] };
const parse = (source: string) => fromMarkdown(source, options) as unknown as MarkdownNode;
const eols = [{ name: 'LF', value: '\n' }, { name: 'CRLF', value: '\r\n' }, { name: 'CR', value: '\r' }];
const collect = (root: MarkdownNode) => { const nodes: MarkdownNode[] = []; walk(root, node => { nodes.push(node); }); return nodes; };

// These deliberately fail the old independent-prose proof and contain no ATX
// headings. Each successful split therefore exercises the new ASCII boundary.
const boundaryPairs = [
  ['- first\n\n- second\n\n  continuation', 'Alpha donations ($1 to $5,000).'],
  ['> quote\nlazy continuation\n>\n> - nested', 'Alpha *open emphasis and **nested strong.'],
  ['    indented code\n\n\tstill code', 'Alpha setext title\n------------------'],
  ['Name | Value\n--- | ---:\none | two', 'Alpha | Other\n--- | ---\nnew | row'],
  ['- [ ] pending\n- [x] complete', 'Alpha paragraph\n    indented continuation'],
  ['``unclosed code and [open label', 'Alpha text with $a\nb$ and a final hard break  \ntail'],
];

describe('bounded parsing at ordinary ASCII boundaries', () => {
  it.each(eols)('preserves full trees, positions, list spread and exact slices with $name', ({ value: eol }) => {
    for (const [index, [left, right]] of boundaryPairs.entries()) {
      const source = `${left}\n \t\n${right}\n\nOmega tail\n\n`.replaceAll('\n', eol);
      expect(isIndependentProse(source)).toBe(false);
      expect(/^ {0,3}#{1,6}(?:[ \t]|$)/m.test(source)).toBe(false);
      const calls: string[] = [];
      const actual = parseInBatches(source, true, value => { calls.push(value); return parse(value); }, compact);
      expect(actual, `pair ${index}`).toStrictEqual(parse(source));
      expect(calls.length).toBeGreaterThan(1);
      expect(calls.join('')).toBe(source);
      expect(calls.slice(1).every(chunk => /^[A-Za-z]/.test(chunk))).toBe(true);
      if (index === 0) expect(collect(actual).some(node => node.type === 'list' && node.spread === true)).toBe(true);
      if (index === 3) expect(collect(actual).filter(node => node.type === 'table')).toHaveLength(2);
    }
  });

  it.each(eols)('uses real inline math but keeps closed and unclosed flow math on one parse with $name', ({ value: eol }) => {
    const inlineCases = [
      { source: '- item\n\nAlpha $a\nb$.\n\nOmega', values: ['a b'] },
      { source: '- item\n\nAlpha $unclosed\n\nBeta closes$', values: [] },
      { source: '- item\n\nAlpha \\$escaped price and $x$.\n\nOmega', values: ['x'] },
    ];
    for (const row of inlineCases) {
      const source = row.source.replaceAll('\n', eol), calls: string[] = [];
      const actual = parseInBatches(source, true, value => { calls.push(value); return parse(value); }, compact);
      expect(actual).toStrictEqual(parse(source));
      expect(calls.length).toBeGreaterThan(1);
      expect(calls.join('')).toBe(source);
      const nodes = collect(actual);
      // A similarly misconfigured oracle cannot make missing math support pass.
      expect(nodes.filter(node => node.type === 'inlineMath').map(node => String(node.value).replace(/\r\n|\r|\n/g, ' '))).toEqual(row.values);
      expect(nodes.some(node => node.type === 'math')).toBe(false);
    }
    for (const row of [
      { source: '$$\na+b\n\nAlpha still inside flow\n$$\n\nOmega', type: 'math' },
      { source: '$$\nUnclosed flow\n\nAlpha still inside flow', type: 'math' },
      { source: 'Alpha $$x$$\n\nBeta', type: 'inlineMath' },
    ]) {
      const source = row.source.replaceAll('\n', eol), calls: string[] = [];
      const actual = parseInBatches(source, true, value => { calls.push(value); return parse(value); }, compact);
      expect(calls).toEqual([source]);
      expect(actual).toStrictEqual(parse(source));
      expect(collect(actual).some(node => node.type === row.type)).toBe(true);
    }
  });

  it('uses ordinary batches in the real standard DocumentEngine while transforms observe the complete root once', () => {
    const source = Array.from({ length: 96 }, (_, index) => `- item ${index}\n  continuation\n\nAlpha ${index} ${'Words retain exact source positions and $x + y$. '.repeat(24)}\n\n    code ${index}\n\n`).join('');
    expect(source.length).toBeGreaterThan(64 * 1024);
    expect(isIndependentProse(source)).toBe(false);
    expect(/^ {0,3}#{1,6}(?:[ \t]|$)/m.test(source)).toBe(false);
    // Preserve the shipped tokenizer/compiler functions. Only these shallow
    // unregistered configuration roots disable builtin-only canBatch; there is
    // no parser mock, replacement grammar, or changed complete-tree transform.
    const fullSyntax = standard().map(extension => extension.name === 'gfm' ? {
      ...extension,
      micromark: extension.micromark?.map(syntax => ({ ...syntax })),
      mdast: extension.mdast?.map(compiler => ({ ...compiler })),
    } : extension);
    const runs = [standard(), fullSyntax].map(extensions => {
      const roots: MarkdownNode[] = [], progress: DocumentProgress[] = [];
      const observer: SyntaxExtension = { name: 'whole-ordinary-root-observer', transform(root) { roots.push(structuredClone(root)); } };
      const snapshot = createDocument(source, { id: 'ordinary-batch', extensions: [...extensions, observer], onProgress: value => progress.push(value) }).getSnapshot();
      return { snapshot, roots, parseProgress: progress.filter(value => value.phase === 'parse') };
    });
    const [actual, expected] = runs;
    expect(actual.snapshot).toStrictEqual(expected.snapshot);
    expect(graph(actual.snapshot)).toBe(graph(expected.snapshot));
    expect(actual.snapshot.source).toBe(source);
    expect(actual.snapshot.diagnostics).toEqual([]);
    expect(actual.roots).toHaveLength(1);
    expect(expected.roots).toHaveLength(1);
    expect(actual.roots).toStrictEqual(expected.roots);
    expect(actual.roots[0].children).toHaveLength(actual.snapshot.blocks.length);
    expect(collect(actual.roots[0]).some(node => node.type === 'inlineMath')).toBe(true);
    expect(actual.parseProgress.length).toBeGreaterThan(2);
    expect(actual.parseProgress[0].loaded).toBe(0);
    expect(actual.parseProgress.at(-1)?.loaded).toBe(source.length);
    expect(expected.parseProgress.map(value => value.loaded)).toEqual([0]);
  });
});

// Include ordered own keys, Maps and graph references in the full snapshot
// oracle; deep value equality alone would not catch an accidental alias change.
function graph(root: unknown): string {
  const seen = new Map<object, number>();
  const visit = (value: any): any => {
    if (value === null || typeof value !== 'object') return [typeof value, value];
    const prior = seen.get(value); if (prior !== undefined) return ['ref', prior];
    const id = seen.size; seen.set(value, id);
    if (value instanceof Map) return ['map', id, [...value].map(([key, item]) => [visit(key), visit(item)])];
    if (value instanceof Set) return ['set', id, [...value].map(visit)];
    if (Array.isArray(value)) return ['array', id, value.length, Object.keys(value).map(key => [key, visit((value as any)[key])])];
    return ['object', id, Object.keys(value).map(key => [key, visit(value[key])])];
  };
  return JSON.stringify(visit(root));
}
