import { describe, expect, it } from 'vitest';
import { fromMarkdown, type Options } from 'mdast-util-from-markdown';
import { fromMarkdownBounded } from '../src/core/bounded-markdown';
import { parserGraphFingerprint } from '../benchmarks/core/parser-graph';
import { markdownPipelineCases, mixedPipelineSource, pipelineOptions, type MarkdownDialect } from './fixtures/markdown-pipeline';

function outcome(parse: () => unknown): { tree?: unknown; error?: object } {
  try { return { tree: parse() }; }
  catch (error) {
    const item = error as Error & { line?: number; column?: number; ruleId?: string; source?: string; place?: unknown };
    return { error: { name: item.name, message: item.message, line: item.line, column: item.column, ruleId: item.ruleId, source: item.source, place: item.place } };
  }
}
function compare(source: string, dialect: MarkdownDialect, targetSize: number, label: string): void {
  const expected = outcome(() => fromMarkdown(source, pipelineOptions(dialect)));
  const actual = outcome(() => fromMarkdownBounded(source, pipelineOptions(dialect), { enabled: true, targetSize }));
  expect(actual, label).toStrictEqual(expected);
  // Deep equality alone does not detect accidental node cloning, altered
  // alias topology or changed own-key order in compiler-created nodes.
  expect(parserGraphFingerprint(actual), `${label}: ordered graph`).toStrictEqual(parserGraphFingerprint(expected));
}

describe('bounded Markdown grammar and compiler parity', () => {
  it.each(markdownPipelineCases)('retains complete trees and errors: $name', ({ name, source, dialect }) => {
    for (const grammar of dialect ? [dialect] : ['commonmark', 'gfm'] as const) {
      for (const newline of ['\n', '\r\n', '\r']) for (const bom of ['', '\uFEFF']) {
        const text = bom + source.replace(/\r\n|\r|\n/g, newline);
        compare(text, grammar, 1, `${name}, ${grammar}, ${JSON.stringify(newline)}, BOM=${!!bom}`);
        const wrapped = bom + `Preamble 中文 😀.\n\n${source}\n\n## Trailing heading\n\nAfter the example.\n`.replace(/\r\n|\r|\n/g, newline);
        compare(wrapped, grammar, 64, `${name} within surrounding blocks, ${grammar}, ${JSON.stringify(newline)}, BOM=${!!bom}`);
      }
    }
  });

  it('preserves deterministic mixed corpora across independent window targets', () => {
    for (const seed of [1, 17, 42]) {
      const source = mixedPipelineSource(seed, 45);
      for (const targetSize of [1, 127, 1024, 8192]) compare(source, 'gfm', targetSize, `seed ${seed}, target ${targetSize}`);
    }
  }, 20000);

  it('keeps UTF-16 and CRLF positions when preprocessing input chunks split a character pair', () => {
    const prefix = '# First\n\nLong paragraph: ';
    for (const edge of ['\r\n', '😀', '\r', '\uFEFF', '\u0000']) {
      const source = prefix.padEnd(65535, 'x') + edge + '\n\n## Following\n\n[late], 中文 😀.\n\n[late]: /target\n';
      compare(source, 'gfm', 512, `preprocessor 64KiB edge ${JSON.stringify(edge)}`);
    }
  });

  it('retains references and footnotes even when all definitions occur after earlier windows', () => {
    const middle = Array.from({ length: 80 }, (_, index) => `Paragraph ${index} [target] and [^note].\n\n> Lazy quoted [target]\ncontinuation [^note].\n`).join('\n');
    const source = '[target] [^note]\n\n' + middle + '\n[target]: /first "First wins"\n\n[target]: /last "Ignored"\n\n[^note]: The **final** definition.\n';
    compare(source, 'gfm', 128, 'forward definitions spanning many windows');
  });

  it('actually divides repeated complete JSX/directive blocks into bounded workspaces', () => {
    const unit = markdownPipelineCases.find(item => item.name === 'nested JSX and lazy Markdown containers')!.source
      + '\n:::limr-annotation{id="note" type="footnote"}\nA **note** with [target].\n:::\n\n';
    const source = Array.from({ length: 90 }, (_, index) => `## Section ${index}\n\n${unit}`).join('\n') + '\n[target]: /resolved\n';
    const progress: number[] = [];
    const actual = fromMarkdownBounded(source, pipelineOptions('components'), { enabled: true, targetSize: 1024, onProgress: value => progress.push(value) });
    expect(parserGraphFingerprint(actual)).toStrictEqual(parserGraphFingerprint(fromMarkdown(source, pipelineOptions('components'))));
    expect(progress.length).toBeGreaterThan(10);
    expect(progress.at(-1)).toBe(source.length);
    expect(progress.every((value, index) => value >= (progress[index - 1] ?? 0) && value <= source.length)).toBe(true);
  });

  it('applies document transforms once to the fully merged root', () => {
    const source = mixedPipelineSource(42, 24), calls: number[][] = [[], []];
    const options = (index: number): Options => {
      const result = pipelineOptions('gfm');
      result.mdastExtensions = [...result.mdastExtensions ?? [], { transforms: [root => {
        calls[index].push(root.children.length);
        Object.assign(root, { data: { completeChildren: root.children.length } });
        return { ...root, children: [...root.children].reverse() };
      }] }];
      return result;
    };
    const expected = fromMarkdown(source, options(0));
    const actual = fromMarkdownBounded(source, options(1), { enabled: true, targetSize: 64 });
    expect(calls[0]).toHaveLength(1); expect(calls[1]).toStrictEqual(calls[0]);
    expect(actual).toStrictEqual(expected);
    expect(parserGraphFingerprint(actual)).toStrictEqual(parserGraphFingerprint(expected));
  });

  it('defaults to upstream behavior for unknown hooks without an explicit eligibility opt-in', () => {
    const source = mixedPipelineSource(7, 8), logs: string[][] = [[], []];
    const options = (index: number): Options => {
      const result = pipelineOptions('gfm');
      result.mdastExtensions = [...result.mdastExtensions ?? [], { enter: { paragraph(token) {
        logs[index].push(`${token.start.offset}:${token.end.offset}:${this.sliceSerialize(token)}`);
        this.enter({ type: 'paragraph', children: [] }, token);
      } }, transforms: [root => { logs[index].push(`complete:${root.children.length}`); }] }];
      return result;
    };
    const expected = fromMarkdown(source, options(0));
    const actual = fromMarkdownBounded(source, options(1), { targetSize: 1 });
    expect(logs[1]).toStrictEqual(logs[0]);
    expect(logs[1].filter(value => value.startsWith('complete:'))).toHaveLength(1);
    expect(parserGraphFingerprint(actual)).toStrictEqual(parserGraphFingerprint(expected));
  });
});
