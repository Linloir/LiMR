import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown, codeHighlight, type MarkdownNode, type RendererParameters } from '../src';
import { CodeViewCache, exceedsCodeLines } from '../src/extensions/code-view-state';
import { literalLines } from '../src/react/literal-lines';

const value = Array.from({ length: 24 }, (_, index) => `line ${index + 1}`).join('\n');
const source = '```text\n' + value + '\n```';
const render = (parameters?: RendererParameters) => renderToStaticMarkup(<Markdown source={source} parameters={parameters} />);

describe('code block configuration', () => {
  it('folds long blocks by default, while short blocks have no fold control', () => {
    expect(render()).toContain('data-collapsed="true"');
    expect(render()).not.toContain('data-wrap="true"');
    expect(render()).not.toContain('data-line-numbers="true"');
    expect(renderToStaticMarkup(<Markdown source={'```\nshort\n```'} />)).not.toContain('limr-code-fold');
    expect(exceedsCodeLines('one\ntwo', 2)).toBe(false);
    expect(exceedsCodeLines('one\ntwo\nthree', 2)).toBe(true);
  });
  it('takes host parameters before plugin defaults and factory options', () => {
    const plugins = [{ name: 'code-preferences', parameters: { codeBlock: { autoCollapse: false, wrap: true, lineNumbers: true } } }];
    const html = renderToStaticMarkup(<Markdown source={source} plugins={plugins} />);
    expect(html).not.toContain('data-collapsed="true"');
    expect(html).toContain('data-wrap="true"');
    expect(html).toContain('data-line-numbers="true"');
    expect(html.match(/class="limr-code-line"/g)).toHaveLength(24);
    expect(renderToStaticMarkup(<Markdown source={source} plugins={plugins} parameters={{ codeBlock: { autoCollapse: true } }} />)).toContain('data-collapsed="true"');
    const extensions = [codeHighlight({ autoCollapse: false, wrap: true, collapseAfterLines: 3 })];
    expect(renderToStaticMarkup(<Markdown source={source} extensions={extensions} />)).not.toContain('data-collapsed="true"');
    expect(renderToStaticMarkup(<Markdown source={source} extensions={extensions} parameters={{ codeBlock: { autoCollapse: true } }} />)).toContain('data-collapsed="true"');
  });
  it('sanitizes line thresholds and clamps the preview to the fold threshold', () => {
    expect(render({ codeBlock: { collapseAfterLines: 24 } })).not.toContain('limr-code-fold');
    expect(render({ codeBlock: { collapseAfterLines: 4, collapsedLines: 12 } })).toContain('--limr-code-preview-lines:4');
    expect(render({ codeBlock: { collapseAfterLines: NaN, collapsedLines: -1 } })).toContain('--limr-code-preview-lines:8');
  });
});

describe('code view cache', () => {
  it('stores only modified blocks, evicts the least recently used, and isolates readers', () => {
    const cache = new CodeViewCache(2), other = new CodeViewCache(2);
    const a: MarkdownNode = { type: 'code', value: 'same' }, b = { ...a }, c = { ...a };
    cache.set(a, {}); expect(cache.size).toBe(0);
    cache.set(a, { collapsed: false, wrap: true }); cache.set(b, { wrap: false });
    expect(cache.get(a)).toEqual({ collapsed: false, wrap: true });
    cache.set(c, { collapsed: true });
    expect(cache.size).toBe(2); expect(cache.get(b)).toBeUndefined();
    expect(cache.get(a)).toEqual({ collapsed: false, wrap: true });
    expect(other.get(a)).toBeUndefined();
    expect(cache.get({ ...a })).toBeUndefined();
  });
  it('keeps the fixed default bound under many interactions', () => {
    const cache = new CodeViewCache();
    for (let index = 0; index < 10_000; index++) cache.set({ type: 'code' }, { wrap: true });
    expect(cache.size).toBe(256);
  });
});

it('splits styled tokens at source newlines without losing blank lines, Unicode or offsets', () => {
  const value = 'a😀\n\nb\n';
  const style = { color: 'red' };
  const lines = literalLines(value, [{ content: 'a😀\n', offset: 0, style }, { content: '\nb\n', offset: 4 }]);
  expect(lines.map(line => line.map(token => token.content).join(''))).toEqual(['a😀\n', '\n', 'b\n', '']);
  expect(lines.flat().map(token => token.offset)).toEqual([0, 4, 5]);
  expect(lines[0][0].style).toBe(style);
  expect(lines.flat().map(token => value.slice(token.offset, token.offset + token.content.length)).join('')).toBe(value);
});
