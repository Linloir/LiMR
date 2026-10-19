import { fromMarkdownSource as fromMarkdown } from './markdown-input';
import { mdxJsx } from 'micromark-extension-mdx-jsx';
import { mdxJsxFromMarkdown } from 'mdast-util-mdx-jsx';
import { registeredDirectives } from './registered-directives';
import { directiveFromMarkdown } from 'mdast-util-directive';
import { lineStarts, sourcePoint, walk } from './tree';
import { concealIncomplete, prepareSource } from './streaming';
import { hasTableLocalSyntax, incrementalTable } from './incremental-table';
import { syntaxForSource } from './source-syntax';
import { parseInBatches } from './batched-parse';
import { createOmissionLookup, omitSource } from './source-omissions';
import { discardPreparsed, takeOmittedSource, takePreparsed } from './preparsed';
import type { Diagnostic, MarkdownNode, ParseContext, SourcePosition, SyntaxExtension } from './types';

export function validateExtensions(extensions: readonly SyntaxExtension[]): void {
  const names = new Set<string>();
  const tags = new Set<string>();
  const directives = new Set<string>();
  const owners = new Map<string, SyntaxExtension>();
  for (const extension of extensions) {
    if (names.has(extension.name)) throw new Error(`Duplicate LiMR extension: ${extension.name}. Use replaceExtension() to replace it explicitly.`);
    names.add(extension.name);
    for (const [items, known, kind] of [[extension.tags, tags, 'tag'], [extension.directives, directives, 'directive']] as const) {
      for (const name of items ?? []) {
        if (known.has(name)) throw new Error(`Duplicate LiMR ${kind}: ${name}`);
        known.add(name);
      }
    }
    for (const name of [...extension.tags ?? [], ...extension.directives ?? []]) {
      if (owners.has(name) && owners.get(name) !== extension) throw new Error(`Duplicate LiMR component syntax: ${name}`);
      owners.set(name, extension);
    }
  }
}

export function createParser(extensions: readonly SyntaxExtension[]) {
  validateExtensions(extensions);
  const tagDefinitions = new Map(extensions.flatMap(ext => (ext.tags ?? []).map(name => [name, ext] as const)));
  const directiveDefinitions = new Map(extensions.flatMap(ext => [...new Set([...ext.tags ?? [], ...ext.directives ?? []])].map(name => [name, ext] as const)));
  const names = new Set(directiveDefinitions.keys()), tags = new Set(tagDefinitions.keys());
  const literals = new Set([...directiveDefinitions].filter(([, definition]) => definition.literal).map(([name]) => name));
  const syntax = extensions.flatMap(ext => [...ext.micromark ?? []]);
  const mdast = extensions.flatMap(ext => [...ext.mdast ?? []]);
  const plainSyntax = [...syntax], plainMdast = [...mdast];
  const registeredSyntax = [...syntax, ...mdast];
  let tableLocal = hasTableLocalSyntax(registeredSyntax);
  if (directiveDefinitions.size) { syntax.push(registeredDirectives(names)); mdast.push(directiveFromMarkdown()); }
  // CommonMark's HTML blocks otherwise swallow same-line native tag names such
  // as <figcaption>**caption**</figcaption> before the JSX adapter can see them.
  // Unknown JSX remains inert through the whitelist below; recovery keeps HTML.
  const jsxSyntax = tagDefinitions.size ? [...syntax, { disable: { null: ['htmlFlow', 'htmlText'] } }, mdxJsx()] : syntax;
  const jsxMdast = tagDefinitions.size ? [...mdast, mdxJsxFromMarkdown()] : mdast;
  const plainJsxSyntax = [...plainSyntax, { disable: { null: ['htmlFlow', 'htmlText'] } }, mdxJsx()];
  const plainJsxMdast = [...plainMdast, mdxJsxFromMarkdown()];
  let literalCache: { fragment: string; offset: number; node: MarkdownNode; fence: string; content: number } | undefined;
  const parseTable = incrementalTable();

  return (fragment: string, offset: number, context: ParseContext, lines: readonly number[], environment = '') => {
    const originalFragment = fragment;
    const omissions = context.sourceOmissions ?? [];
    const omitted = (offset === 0 && fragment === context.source ? takeOmittedSource(context, fragment, omissions) : undefined)
      ?? omitSource(fragment, omissions, offset);
    fragment = omitted.value;
    // Config objects can be changed in place after the session was created.
    // Once foreign behavior appears, discard all builtin-only fast paths.
    tableLocal &&= hasTableLocalSyntax(registeredSyntax);
    // Definitions are a parsing environment, never part of the stored source.
    // A known prefix offset is removed from EVERY node position below.
    // A neutral paragraph closes footnote containers. Without it, an indented
    // suffix can be consumed as part of a synthetic footnote definition.
    const prefix = environment ? `${environment}\n\nlimr-definition-boundary\n\n` : '';
    const cached = literalCache;
    const canAppendLiteral = originalFragment === fragment && tableLocal && context.streaming && cached && !prefix && cached.offset === offset && fragment.startsWith(cached.fragment)
      && !new RegExp(`(?:^|[\\r\\n]) {0,3}${cached.fence[0]}{${cached.fence.length},}[ \\t]*(?=[\\r\\n]|$)`).test(fragment.slice(Math.max(cached.content, cached.fragment.lastIndexOf('\n') + 1, cached.fragment.lastIndexOf('\r') + 1)));
    const prepared = canAppendLiteral
      ? { value: fragment, original: (at: number) => at, incomplete: new Set([0]), recoveryOffset: 0, hidden: undefined }
      : prepareSource(fragment, names, tags, context.streaming, literals);
    const input = prefix + prepared.value;
    // Ordinary prose need not install component tokenizers on every append.
    // Colon-prefixed names and '<' are required even for partial constructs.
    const hasDirectives = directiveDefinitions.size > 0 && /:[a-zA-Z]/.test(input);
    const hasJsx = tagDefinitions.size > 0 && input.includes('<');
    const activeSyntax = hasDirectives ? syntax : plainSyntax, activeMdast = hasDirectives ? mdast : plainMdast;
    // Foreign compiler hooks can observe token boundaries even when the final
    // AST is identical. Prune impossible built-in attempts only with the known
    // shipped tokenizer/compiler combination.
    const forSource = (extensions: typeof syntax, value: string) => tableLocal ? extensions.map(extension => syntaxForSource(extension, value)) : extensions;
    const mappedOffset = (at: number, edge: 'start' | 'end' = 'start') => offset + omitted.original(prepared.original(Math.max(0, at - prefix.length)), edge);
    const mappedLines = lines.length ? lines : lineStarts(context.source);
    const diagnostics: Diagnostic[] = [];
    let attributeLines: readonly number[] | undefined;
    const attributePoint = (at: number) => sourcePoint(at, lines.length ? lines : attributeLines ??= lineStarts(context.source));
    let recoveryOffset = prepared.recoveryOffset === undefined ? undefined : offset + omitted.original(prepared.recoveryOffset, 'end');
    const canBatch = tableLocal && !prefix && prepared.value === fragment && !hasJsx && !hasDirectives;
    const parse = (value: string) => {
      const preparsed = tableLocal ? takePreparsed(context, value, extensions) : undefined;
      if (preparsed) return preparsed;
      // A suffix miss may still be reused by the same update's full retry when
      // definitions change. A full-input miss or foreign grammar cannot reuse
      // this discovery tree; release it before allocating the replacement.
      if (!tableLocal || (offset === 0 && !prefix)) discardPreparsed(context);
      return fromMarkdown(value, {
        extensions: forSource(hasJsx ? hasDirectives ? jsxSyntax : plainJsxSyntax : activeSyntax, value),
        mdastExtensions: hasJsx ? hasDirectives ? jsxMdast : plainJsxMdast : activeMdast,
      }, tableLocal, tableLocal && value === input ? loaded => context.onProgress?.({ phase: 'parse', loaded, total: value.length }) : undefined) as unknown as MarkdownNode;
    };
    let root: MarkdownNode;
    try {
      root = canAppendLiteral ? { type: 'root', children: [{ ...cached.node,
        value: fragment.slice(cached.content).replace(/(?:\r\n|\r|\n)$/, ''),
        position: { start: { offset: 0, line: 1, column: 1 }, end: { offset: fragment.length, line: 0, column: 0 } },
      }] } : parseTable(input, offset, context.streaming, canBatch, value => parseInBatches(value, canBatch, parse, { onProgress: context.onProgress }));
    } catch (error) {
      // Incomplete JSX is common during streaming. Preserve readable Markdown,
      // treat HTML as inert source and retry the final block on the next append.
      root = fromMarkdown(input, { extensions: forSource(activeSyntax, input), mdastExtensions: activeMdast }, tableLocal) as unknown as MarkdownNode;
      recoveryOffset = offset;
      diagnostics.push({ message: error instanceof Error ? error.message : String(error), offset });
    }
    root.children = root.children?.filter(node => (node.position?.start.offset ?? 0) >= prefix.length);
    const only = root.children?.length === 1 ? root.children[0] : undefined;
    const fence = !prefix && only?.type === 'code' && prepared.incomplete.has(0) && /^(`{3,}|~{3,})[^\r\n]*(?:\r\n|\r|\n)/.exec(fragment);
    literalCache = originalFragment === fragment && tableLocal && fence ? { fragment, offset, node: { ...only! }, fence: fence[1], content: fence[0].length } : undefined;
    const omissionsWithin = createOmissionLookup(context.sourceOmissions);
    if (offset || prefix.length || tagDefinitions.size || directiveDefinitions.size || context.streaming || originalFragment !== fragment) walk(root, node => {
      const incomplete = node.position && prepared.incomplete.has(prepared.original(Math.max(0, node.position.start.offset - prefix.length)));
      if (node.position && (offset || prefix.length || prepared.value !== fragment || originalFragment !== fragment || canAppendLiteral)) {
        const start = mappedOffset(node.position.start.offset);
        const end = Math.max(start, mappedOffset(node.position.end.offset, 'end'));
        node.position = { start: sourcePoint(start, mappedLines), end: sourcePoint(end, mappedLines) };
      }
      if (incomplete) node.incomplete = true;
      if (node.position && originalFragment !== fragment) {
        const inside = omissionsWithin(node.position.start.offset, node.position.end.offset);
        if (inside?.length) node.sourceOmissions = inside;
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
              const start = mappedOffset(attr.position.start.offset);
              const end = mappedOffset(attr.position.end.offset, 'end');
              const raw = context.source.slice(start, end), opening = raw.search(/["']/);
              if (opening >= 0) {
                const valueStart = start + opening + 1, valueEnd = end - 1;
                const omissions = omissionsWithin(valueStart, valueEnd);
                attributeNodes[attr.name] = { type: 'text', value: attr.value, verbatimEscapes: true,
                  ...(omissions?.length ? { sourceOmissions: omissions } : {}), position: { start: attributePoint(valueStart), end: attributePoint(valueEnd) } };
              }
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
              const valueStart = valueEnd - valueLength;
              const omissions = omissionsWithin(valueStart, valueEnd);
              attributeNodes[name] = { type: 'text', value, ...(omissions?.length ? { sourceOmissions: omissions } : {}),
                position: { start: attributePoint(valueStart), end: attributePoint(valueEnd) } };
            }
            if (Object.keys(attributeNodes).length) node.attributeNodes = attributeNodes;
          }
          node.inline = node.type === 'textDirective';
          node.type = 'component';
          node.selection = definition.selection ?? 'content';
        }
      }
    });
    if (prepared.hidden) {
      const start = offset + omitted.original(prepared.hidden.start, 'end');
      // A withheld inline header can still belong to the preceding paragraph.
      // Retry that host too instead of retaining a prematurely split block.
      recoveryOffset = Math.min(recoveryOffset ?? start, root.children?.at(-1)?.position?.start.offset ?? start);
      root.children?.push({ type: prepared.hidden.name ? 'component' : 'streamPending', name: prepared.hidden.name, incomplete: true,
        position: { start: sourcePoint(start, mappedLines), end: sourcePoint(offset + originalFragment.length, mappedLines) }, children: [], attributes: {} });
    }
    if (context.streaming) concealIncomplete(root, context.source, mappedLines);
    if (offset || prefix.length || originalFragment !== fragment) root.position = { start: sourcePoint(offset, mappedLines), end: sourcePoint(offset + originalFragment.length, mappedLines) };
    for (const extension of extensions) {
      try { extension.transform?.(root, context); }
      catch (error) { diagnostics.push({ message: error instanceof Error ? error.message : String(error), extension: extension.name }); }
    }
    return { nodes: root.children ?? [], diagnostics, recoveryOffset };
  };
}
