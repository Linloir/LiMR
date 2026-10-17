import { expect, it } from 'vitest';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { fromMarkdownBounded } from '../src/core/bounded-markdown';
import { pipelineOptions } from './fixtures/markdown-pipeline';

it('preserves whole-document inline syntax error precedence over an earlier JSX compiler error', () => {
  const source = '<one>\n\n</two>\n\nok\n\ntext <foo a={bad\n';
  const outcome = (parse: () => unknown) => {
    try { parse(); throw new Error('Expected invalid JSX to throw'); }
    catch (error) { const value = error as Error & { line?: number; column?: number; ruleId?: string; place?: unknown }; return { name: value.name, message: value.message, line: value.line, column: value.column, ruleId: value.ruleId, place: value.place }; }
  };
  const expected = outcome(() => fromMarkdown(source, pipelineOptions('components')));
  expect(expected.message).toContain('Unexpected end of file in expression');
  expect(outcome(() => fromMarkdownBounded(source, pipelineOptions('components'), { enabled: true, targetSize: 1 }))).toStrictEqual(expected);
});

it('propagates progress callback errors without retrying syntax or calling the callback again', () => {
  let calls = 0; const failure = new Error('caller cancelled');
  expect(() => fromMarkdownBounded('First.\n\nSecond.\n', undefined, {
    enabled: true, targetSize: 1, onProgress() { calls++; throw failure; },
  })).toThrow(failure);
  expect(calls).toBe(1);
});
