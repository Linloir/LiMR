/** Benchmark-only comparison: retain the production engine and normalization,
 * replacing only its bounded adapter with the pinned upstream parser. */
export async function load(url, context, nextLoad) {
  const result = await nextLoad(url, context);
  if (!new URL(url).pathname.endsWith('/src/core/bounded-markdown.ts')) return result;
  if (!String(result.source).includes('fromMarkdownBounded')) {
    throw new Error('Unexpected parser entrypoint; refusing benchmark substitution');
  }
  return {
    ...result,
    source: `import { fromMarkdown } from "mdast-util-from-markdown";
export function fromMarkdownBounded(source, options) {
  globalThis.__limrPipelineBaselineCalls = (globalThis.__limrPipelineBaselineCalls ?? 0) + 1;
  return fromMarkdown(source, options);
}`,
  };
}
