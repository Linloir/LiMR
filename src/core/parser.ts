import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { directive } from 'micromark-extension-directive';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { lineStarts, sourcePoint, walk } from './tree';
import type { Diagnostic, MarkdownNode, ParseContext, SourcePosition, SyntaxExtension } from './types';

export function validateExtensions(extensions: readonly SyntaxExtension[]): void {
  const names = new Set<string>();
  const tags = new Set<string>();
  const directives = new Set<string>();
  for (const extension of extensions) {
    if (names.has(extension.name)) throw new Error(`Duplicate LiMR extension: ${extension.name}. Use replaceExtension() to replace it explicitly.`);
    names.add(extension.name);
    for (const [items, known, kind] of [[extension.tags, tags, 'tag'], [extension.directives, directives, 'directive']] as const) {
      for (const name of items ?? []) {
        if (known.has(name)) throw new Error(`Duplicate LiMR ${kind}: ${name}`);
        known.add(name);
      }
    }
  }
}

export function createParser(extensions: readonly SyntaxExtension[]) {
  validateExtensions(extensions);
  const tagDefinitions = new Map(extensions.flatMap(ext => (ext.tags ?? []).map(name => [name, ext] as const)));
  const directiveDefinitions = new Map(extensions.flatMap(ext => (ext.directives ?? []).map(name => [name, ext] as const)));
  const syntax = extensions.flatMap(ext => [...ext.micromark ?? []]);
  const mdast = extensions.flatMap(ext => [...ext.mdast ?? []]);
  if (directiveDefinitions.size) { syntax.push(directive()); mdast.push(directiveFromMarkdown()); }
  const jsxSyntax = tagDefinitions.size ? [...syntax, mdxJsx()] : syntax;
  const jsxMdast = tagDefinitions.size ? [...mdast, mdxJsxFromMarkdown()] : mdast;

  return (fragment: string, offset: number, context: ParseContext, lines: readonly number[], environment = '') => {
    // Definitions are a parsing environment, never part of the stored source.
    // A known prefix offset is removed from EVERY node position below.
    // A neutral paragraph closes footnote containers. Without it, an indented
    // suffix can be consumed as part of a synthetic footnote definition.
    const prefix = environment ? `${environment}\n\nlimr-definition-boundary\n\n` : '';
    const input = prefix + fragment;
    const diagnostics: Diagnostic[] = [];
    let attributeLines: readonly number[] | undefined;
    const attributePoint = (at: number) => sourcePoint(at, lines.length ? lines : attributeLines ??= lineStarts(context.source));
    let recoveryOffset: number | undefined;
    let root: MarkdownNode;
    try {
      root = fromMarkdown(input, { extensions: jsxSyntax, mdastExtensions: jsxMdast }) as unknown as MarkdownNode;
    } catch (error) {
      // Incomplete JSX is common during streaming. Preserve readable Markdown,
      // treat HTML as inert source and retry the final block on the next append.
      root = fromMarkdown(input, { extensions: syntax, mdastExtensions: mdast }) as unknown as MarkdownNode;
      recoveryOffset = offset;
      diagnostics.push({ message: error instanceof Error ? error.message : String(error), offset });
    }
    root.children = root.children?.filter(node => (node.position?.start.offset ?? 0) >= prefix.length);
    if (offset || prefix.length || tagDefinitions.size || directiveDefinitions.size) walk(root, node => {
      if (node.position && (offset || prefix.length)) {
        const start = Math.max(0, node.position.start.offset - prefix.length + offset);
        const end = Math.max(start, node.position.end.offset - prefix.length + offset);
        node.position = { start: sourcePoint(start, lines), end: sourcePoint(end, lines) };
      }
      if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
        const definition = tagDefinitions.get(node.name ?? '');
        const rawAttributes = node.attributes as unknown as { type: string; name: string; value: unknown; position?: SourcePosition }[];
        const attributes: Record<string, string | boolean | number> = {};
        const attributeNodes: Record<string, MarkdownNode> = {};
        for (const attr of rawAttributes ?? []) {
          if (attr.type === 'mdxJsxAttribute' && (typeof attr.value === 'string' || attr.value === null)) {
            attributes[attr.name] = attr.value ?? true;
            if (definition && typeof attr.value === 'string' && attr.position) {
              const start = attr.position.start.offset - prefix.length + offset;
              const end = attr.position.end.offset - prefix.length + offset;
              const raw = context.source.slice(start, end), opening = raw.search(/["']/);
              if (opening >= 0) attributeNodes[attr.name] = { type: 'text', value: attr.value, verbatimEscapes: true, position: { start: attributePoint(start + opening + 1), end: attributePoint(end - 1) } };
            }
          }
          else diagnostics.push({ message: 'JSX expressions are not executed. Use string attributes or pass data from React.', offset: node.position?.start.offset });
        }
        node.inline = definition?.display === 'block' ? false : definition?.display === 'inline' ? true : node.type === 'mdxJsxTextElement';
        node.type = definition ? 'component' : 'html';
        node.attributes = attributes;
        if (Object.keys(attributeNodes).length) node.attributeNodes = attributeNodes;
        node.selection = definition?.selection ?? 'content';
        if (!definition && node.position) {
          node.value = context.source.slice(node.position.start.offset, node.position.end.offset);
          node.children = undefined;
        }
      } else if (node.type === 'containerDirective' || node.type === 'leafDirective' || node.type === 'textDirective') {
        const definition = directiveDefinitions.get(node.name ?? '');
        if (definition) {
          // Directive attributes have no mdast positions. Scan only their header,
          // respecting quoted values instead of searching the rendered title.
          const start = node.position?.start.offset ?? 0;
          const end = context.source.indexOf('\n', start);
          const header = context.source.slice(start, end < 0 ? context.source.length : end);
          const brace = header.indexOf('{');
          if (brace >= 0) {
            const attributeNodes: Record<string, MarkdownNode> = {};
            const expression = /([^\s{}=]+)\s*=\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^\s}]+))/g;
            const raw = header.slice(brace + 1);
            for (const match of raw.matchAll(expression)) {
              const name = match[1], value = node.attributes?.[name];
              if (typeof value !== 'string') continue;
              const quoted = match[2] !== undefined || match[3] !== undefined;
              const valueLength = (match[2] ?? match[3] ?? match[4]).length;
              const valueEnd = start + brace + 1 + match.index! + match[0].length - (quoted ? 1 : 0);
              attributeNodes[name] = { type: 'text', value, position: { start: attributePoint(valueEnd - valueLength), end: attributePoint(valueEnd) } };
            }
            if (Object.keys(attributeNodes).length) node.attributeNodes = attributeNodes;
          }
          node.inline = node.type === 'textDirective';
          node.type = 'component';
          node.selection = definition.selection ?? 'content';
        }
      }
    });
    if (offset || prefix.length) root.position = { start: sourcePoint(offset, lines), end: sourcePoint(offset + fragment.length, lines) };
    for (const extension of extensions) {
      try { extension.transform?.(root, context); }
      catch (error) { diagnostics.push({ message: error instanceof Error ? error.message : String(error), extension: extension.name }); }
    }
    return { nodes: root.children ?? [], diagnostics, recoveryOffset };
  };
}
