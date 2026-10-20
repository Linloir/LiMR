import { expect, it } from 'vitest';
import { literalChunks, literalParts, literalTokensBetween } from '../src/react/literal-chunks';

it('partitions at source newlines, preserving trailing blank lines and exact offsets', () => {
  for (const value of ['', 'one\n', 'x\n'.repeat(128), 'x'.repeat(9000) + '\n\nlast', 'short\n' + 'y'.repeat(9000) + '\nlast']) {
    const chunks = literalChunks(value);
    expect(chunks.map(chunk => value.slice(chunk.start, chunk.end)).join('')).toBe(value);
    expect(chunks.reduce((sum, chunk) => sum + chunk.lines, 0)).toBe(value.split('\n').length);
    for (const chunk of chunks.slice(1)) {
      expect(value[chunk.start - 1]).toBe('\n');
      expect(chunk.line).toBe(value.slice(0, chunk.start).split('\n').length);
    }
  }
});

it('splits pathological lines only between graphemes and preserves crossing syntax tokens', () => {
  const value = 'x'.repeat(4094) + '👨‍👩‍👧‍👦e\u0301中文'.repeat(1200);
  const parts = literalParts(value, 0, value.length);
  const boundaries = new Set([...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(value)].map(part => part.index));
  expect(parts.map(part => value.slice(part.start, part.end)).join('')).toBe(value);
  for (const part of parts) expect(boundaries.has(part.start)).toBe(true);
  const style = { color: 'red' };
  const tokens = [{ content: value.slice(0, 5000), offset: 0, style }, { content: value.slice(5000), offset: 5000 }];
  const sliced = parts.flatMap(part => literalTokensBetween(value, tokens, part.start, part.end));
  expect(sliced.map(token => token.content).join('')).toBe(value);
  expect(sliced[1].style).toBe(style);
  for (const token of sliced) expect(value.slice(token.offset, token.offset + token.content.length)).toBe(token.content);
});
