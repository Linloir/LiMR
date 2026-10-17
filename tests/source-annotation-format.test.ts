import { describe, expect, it } from 'vitest';
import { annotationBody, annotationContinuationPrefix } from '../src/extensions/source-annotation-format';

describe('source annotation container prefixes', () => {
  it.each(['\n', '\r\n', '\r'])('preserves nested quote/list indentation with %j newlines', newline => {
    const header = '> 12. :::limr-annotation{id="note"}';
    const body = '>     First **line**.' + newline + '>     Second line.';
    const source = 'Earlier paragraph.' + newline + header + newline + body + newline + '>     :::';
    const start = source.indexOf(':::limr-annotation'), bodyStart = source.indexOf('First');
    expect(annotationContinuationPrefix(source, start)).toBe('>     ');
    expect(annotationBody(source, { start, end: source.length }, { start: bodyStart, end: bodyStart + body.length - 6 }))
      .toBe('First **line**.' + newline + 'Second line.');
  });

  it('handles a definition at offset zero and a first-line list prefix', () => {
    expect(annotationContinuationPrefix(':::limr-annotation\nBody\n:::', 0)).toBe('');
    expect(annotationContinuationPrefix('12. :::limr-annotation\nBody', 4)).toBe('    ');
    expect(annotationContinuationPrefix('', 0)).toBe('');
  });

  it('preserves the previous prefix contract at every UTF-16 boundary with mixed newlines', () => {
    const source = '\nFirst 😀\r\n> - note\r> 23) another\n\t* last\r\n';
    for (let start = 0; start <= source.length; start++) {
      const line = Math.max(source.lastIndexOf('\n', start - 1), source.lastIndexOf('\r', start - 1)) + 1;
      const expected = source.slice(line, start).replace(/(?:[*+-]|\d+[.)])(?=[ \t])/g, marker => ' '.repeat(marker.length));
      expect(annotationContinuationPrefix(source, start), `offset ${start}`).toBe(expected);
    }
  });
});
