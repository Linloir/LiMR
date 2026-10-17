import { expect, it } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { fromMarkdownBounded } from '../src/core/bounded-markdown';
import { pipelineOptions } from './fixtures/markdown-pipeline';

it('reports both grammar passes on one monotonic progress scale', () => {
  const source = Array.from({ length: 50 }, (_, index) => `Paragraph ${index} [later].\n\n`).join('') + '[later]: /destination\n';
  const progress: number[] = [];
  const actual = fromMarkdownBounded(source, undefined, { enabled: true, targetSize: 64, onProgress: offset => progress.push(offset) });
  expect(actual).toStrictEqual(fromMarkdown(source));
  expect(progress.length).toBeGreaterThan(4);
  expect(progress.some(offset => offset > 0 && offset < source.length / 2)).toBe(true);
  expect(progress).toContain(Math.floor(source.length / 2));
  expect(progress.some(offset => offset > source.length / 2 && offset < source.length)).toBe(true);
  expect(progress.at(-1)).toBe(source.length);
  expect(progress.every((offset, index) => offset >= 0 && offset <= source.length && (index === 0 || offset >= progress[index - 1]))).toBe(true);
});

it.each(['fence', 'component'] as const)('preserves an indivisible large %s rather than treating the target as a syntax boundary', kind => {
  const content = Array.from({ length: 100 }, (_, index) => `Paragraph ${index}.\n\n`).join('');
  const source = kind === 'fence' ? `~~~markdown\n${content}~~~\n` : `<callout>\n\n${content}</callout>\n`;
  const options = pipelineOptions(kind === 'fence' ? 'gfm' : 'components');
  const progress: number[] = [];
  const actual = fromMarkdownBounded(source, options, { enabled: true, targetSize: 32, onProgress: offset => progress.push(offset) });
  expect(actual).toStrictEqual(fromMarkdown(source, options));
  expect(progress).toStrictEqual([Math.floor(source.length / 2), source.length]);
});
