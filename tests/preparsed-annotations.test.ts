import { describe, expect, it } from 'vitest';
import { createDocument, type ParseContext } from '../src/core';
import { standard } from '../src/extensions';
import { createParser } from '../src/core/parser';
import { rememberPreparsed, takePreparsed } from '../src/core/preparsed';
import { fromMarkdownSource } from '../src/core/markdown-input';
import { lineStarts } from '../src/core/tree';
import { parserGraphFingerprint } from '../benchmarks/core/parser-graph';

// Foreign grammar hooks deliberately bypass raw-tree reuse. Compare complete
// semantic snapshots, including original UTF-16 positions and hidden syntax.
const compare = (source: string, streaming = false) => {
  const extensions = standard();
  const optimized = createDocument(source, { id: 'cache-parity', extensions, streaming }).getSnapshot();
  const ordinary = createDocument(source, { id: 'cache-parity', extensions: [...extensions, { name: 'foreign-grammar', micromark: [{}] }], streaming }).getSnapshot();
  expect(optimized).toEqual(ordinary);
  expect(parserGraphFingerprint(optimized)).toEqual(parserGraphFingerprint(ordinary));
};
const definition = '\n\n:::limr-annotation{id="note" type="footnote"}\nA **complete** note.\n:::\n';

describe('annotation grammar preparse reuse', () => {
  it('preserves cross-block ranges, nested formatting and reference definitions', () => {
    compare('::%%limr%%{<#note}First **paragraph**.\n\n- Second [link][target].\n- 中文 😀\n\nLast.::%%limr%%{>#note}' + definition + '\n[target]: https://example.test/\n');
  });
  it('keeps unauthorized and escaped boundaries literal', () => {
    compare('::%%limr%%{<#note}Valid::%%limr%%{>#note}\n\n::%%limr%%{<#missing}Not removed::%%limr%%{>#missing}\n\\::%%limr%%{<#note}' + definition);
  });
  it('does not authorize definitions inside code or unknown JSX', () => {
    compare('::%%limr%%{<#note}Literal::%%limr%%{>#note}\n\n```md' + definition + '\n```');
    compare('::%%limr%%{<#note}Literal::%%limr%%{>#note}\n\n<unknown>' + definition + '\n</unknown>');
  });
  it('preserves complete and incomplete streaming pairs', () => {
    compare('::%%limr%%{<#note}Streaming text::%%limr%%{>#note}' + definition, true);
    compare('::%%limr%%{<#note}Streaming text::%%limr%%{>#note}' + definition.slice(0, -4), true);
  });
  it('releases a mismatched full discovery tree while its parse context remains live', () => {
    const extensions = standard(), source = 'Retain an unauthorized boundary literally.';
    const context: ParseContext = { source, streaming: false, documentId: 'full-miss' };
    const discoveryInput = 'Different candidate omissions.', tree = fromMarkdownSource(discoveryInput);
    rememberPreparsed(context, discoveryInput, tree, extensions);
    const parsed = createParser(extensions)(source, 0, context, lineStarts(source));
    expect(parsed.nodes).toEqual(fromMarkdownSource(source).children);
    // The context is deliberately still strongly reachable. This checks cache
    // lifetime without depending on GC timing or platform-specific heap sizes.
    expect(takePreparsed(context, discoveryInput, extensions)).toBeUndefined();
  });
  it.each([0, 18])('releases an unusable foreign-grammar discovery tree at offset %i', offset => {
    const extensions = [...standard(), { name: 'foreign-grammar', micromark: [{}] }];
    const source = 'First paragraph.\n\nLast paragraph.';
    const context: ParseContext = { source, streaming: false, documentId: 'foreign-miss' };
    rememberPreparsed(context, source, fromMarkdownSource(source), extensions);
    createParser(extensions)(source.slice(offset), offset, context, lineStarts(source));
    expect(takePreparsed(context, source, extensions)).toBeUndefined();
  });
  it('retains a suffix miss for the same context full-input retry', () => {
    const extensions = standard(), source = 'First paragraph.\n\nLast paragraph.';
    const context: ParseContext = { source, streaming: false, documentId: 'suffix-retry' };
    const tree = fromMarkdownSource(source), first = tree.children![0], parse = createParser(extensions);
    rememberPreparsed(context, source, tree, extensions);
    const offset = source.indexOf('Last');
    parse(source.slice(offset), offset, context, lineStarts(source), '[reference]: /target');
    const retried = parse(source, 0, context, lineStarts(source));
    expect(retried.nodes[0]).toBe(first);
    expect(takePreparsed(context, source, extensions)).toBeUndefined();
  });
  it('keeps incremental definition-triggered full retries identical with annotation preprocessing', () => {
    const source = '::%%limr%%{<#note}Marked **words**.::%%limr%%{>#note}\n\n[late]\n\nTail.' + definition;
    const extensions = standard();
    const optimized = createDocument(source, { id: 'incremental-cache', extensions, streaming: true });
    const ordinary = createDocument(source, { id: 'incremental-cache', extensions: [...extensions, { name: 'foreign-grammar', micromark: [{}] }], streaming: true });
    const next = '\n\n[late]: /resolved\n';
    expect(optimized.append(next)).toEqual(ordinary.append(next));
    expect(optimized.getSnapshot().metrics).toMatchObject({ reason: 'definitions', fullParse: true });
  });
});
