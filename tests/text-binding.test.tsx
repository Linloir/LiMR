import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createDocument, type MarkdownNode } from '../src/core';
import { Markdown } from '../src/react';
import { compactTextNodes } from '../src/react/text-binding';

const paragraph = (source: string) => createDocument(source).getSnapshot().blocks[0].node;

describe('compact native inline code', () => {
  it('keeps literal code in DOM order with adjacent prose and nested formats', () => {
    const source = 'Before **`literal &amp; \\*`** after.';
    const node = paragraph(source);
    expect(compactTextNodes(node, {})?.map(leaf => [leaf.type, leaf.value])).toEqual([
      ['text', 'Before '], ['inlineCode', 'literal &amp; \\*'], ['text', ' after.'],
    ]);
    const html = renderToStaticMarkup(<Markdown source={source} extensions={[]} />);
    expect(html).toContain('>literal &amp;amp; \\*</code>');
    expect(html).not.toContain('data-limr-text');
  });

  it('preserves CommonMark code whitespace without adding a binding span', () => {
    const html = renderToStaticMarkup(<Markdown source={'Before `` a`b `` and `two\r\nlines` after.'} extensions={[]} />);
    expect(html).toContain('>a`b</code>');
    expect(html).toContain('>two lines</code>');
    expect(html).not.toContain('data-limr-text');
  });

  it('retains independent source bindings for an inlineCode component or renderer override', () => {
    const node = paragraph('Before `code` after.');
    const component = () => <code>Custom</code>;
    expect(compactTextNodes(node, { inlineCode: component })).toBeNull();
    expect(compactTextNodes(node, {}, new Map([['inlineCode', []]]))).toBeNull();
    const html = renderToStaticMarkup(<Markdown source="Before `code` after." extensions={[]} components={{ inlineCode: ({ renderValue }) => <code data-custom>{renderValue()}</code> }} />);
    expect(html).toContain('data-custom');
    expect(html.match(/data-limr-text/g)).toHaveLength(3);
  });

  it('leaves an explicitly atomic code node to its enclosing atomic binding', () => {
    const node = paragraph('Before `code` after.');
    const code = node.children!.find(child => child.type === 'inlineCode')!;
    code.selection = 'atomic';
    expect(compactTextNodes(node, {})?.map(leaf => leaf.value)).toEqual(['Before ', ' after.']);
    const markAtomic = { name: 'atomic-code', transform: (root: MarkdownNode) => {
      const visit = (node: MarkdownNode) => { if (node.type === 'inlineCode') node.selection = 'atomic'; node.children?.forEach(visit); };
      visit(root);
    } };
    const html = renderToStaticMarkup(<Markdown source="Before `code` after." extensions={[markAtomic]} />);
    expect(html).toContain('data-limr-atomic="inline"');
    expect(html).toContain('>code</code>');
  });

  it('retains the same stream text entrance host for completed inline code', () => {
    const html = renderToStaticMarkup(<Markdown source="Before `code` after." extensions={[]} streaming />);
    expect(html).toMatch(/<code[^>]*><span data-limr-stream-text="">code<\/span><\/code>/);
    expect(html).not.toContain('data-limr-text');
  });
});
