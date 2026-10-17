import { fromMarkdown, type Options } from 'mdast-util-from-markdown';
import { lineStarts, sourcePoint, walk } from './tree';
import type { MarkdownNode } from './types';

/** Micromark consumes a leading BOM without counting it in offsets. Restore
 * original UTF-16 coordinates before preprocessors/transforms observe a tree. */
export function fromMarkdownSource(source: string, options?: Options): MarkdownNode {
  const root = fromMarkdown(source, options) as unknown as MarkdownNode;
  if (source.charCodeAt(0) !== 0xfeff) return root;
  const lines = lineStarts(source);
  const point = (position: {offset:number; line:number; column:number}) => sourcePoint(position.offset + 1, lines);
  const shift = (value: unknown) => {
    if (!value || typeof value !== 'object') return;
    const item = value as {position?: MarkdownNode['position']; attributes?: unknown[]};
    if (item.position) item.position = { start: point(item.position.start), end: point(item.position.end) };
    // JSX attribute positions are not Markdown children, but their values are
    // independently source mapped by the component adapter.
    if (Array.isArray(item.attributes)) for (const attribute of item.attributes) shift(attribute);
  };
  walk(root, shift);
  if (root.position) root.position.start = sourcePoint(0, lines);
  return root;
}
