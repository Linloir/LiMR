import type { fromMarkdown } from 'mdast-util-from-markdown';
type Root = ReturnType<typeof fromMarkdown>;
import type { Options } from 'mdast-util-from-markdown';
import type { Event } from 'micromark-util-types';
export function createMarkdownCompiler(options?: Options, reuseContext?: boolean): {
  compile(events: Event[]): Root;
  transform(root: Root): Root;
};
