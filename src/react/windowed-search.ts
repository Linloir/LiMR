import { rangeOf, type DocumentSearchOptions, type MarkdownNode, type SourceRange, type TextMapping } from '../core';
import { throwIfAborted, yieldTask } from '../core/source-input';
import type { ReaderRuntime } from './runtime';
import { windowedReadingText } from './windowed-copy';

/** Search the complete visible reading projection, including unmounted blocks.
 * A phrase crossing Markdown styling is found; if it has no contiguous source
 * spelling, its block is the navigation range. Cross-block phrases are not
 * currently joined, and opaque diagrams require a renderer search adapter. */
export async function searchWindowedDocument(runtime: ReaderRuntime, query: string, options: DocumentSearchOptions = {}): Promise<SourceRange[]> {
  if (!query) return [];
  throwIfAborted(options.signal);
  const snapshot = runtime.document.getSnapshot(), configuration = runtime.configuration.get(), presentation = runtime.presentation.get();
  const limit = Math.max(1, options.limit ?? 1000);
  const check = () => {
    throwIfAborted(options.signal);
    if (runtime.document.getSnapshot() !== snapshot || runtime.configuration.get() !== configuration || runtime.presentation.get() !== presentation) {
      const error = new Error('The document presentation changed during search.'); error.name = 'AbortError'; throw error;
    }
  };
  const pattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags = options.caseSensitive ? 'gu' : 'giu';
  const expression = new RegExp(pattern, flags), rawExpression = new RegExp(pattern, flags);
  const comparison = new RegExp(`^(?:${pattern})$`, flags.replace('g', ''));
  const entries = snapshot.blocks.filter(block => !['definition', 'footnoteDefinition', 'annotationDefinition', 'streamPending'].includes(block.node.type)).map(block => block.node);
  snapshot.footnoteOrder.forEach(id => { const node = snapshot.footnotes.get(id); if (node) entries.push(node); });
  const results: SourceRange[] = [];
  let bytes = 0, progress = 0, since = performance.now();
  const checkpoint = async () => {
    check();
    if (bytes >= 65_536 || performance.now() - since >= 4) {
      options.onProgress?.(Math.min(snapshot.source.length, progress));
      await yieldTask(); check(); bytes = 0; since = performance.now();
    }
  };
  for (const node of entries) {
    check();
    const span = rangeOf(node), cache = new WeakMap<MarkdownNode, TextMapping>(), fragments: SourceRange[] = [];
    const text = windowedReadingText(runtime, [span], cache, fragments), raw = snapshot.source.slice(span.start, span.end);
    bytes += span.end - span.start; progress += span.end - span.start;
    expression.lastIndex = 0;
    // Plain paragraphs need neither a second scan nor boundary maps. Other
    // blocks verify source candidates against the same visibility projection,
    // so a hidden translation with the same spelling cannot steal the anchor.
    let rawMatches: SourceRange[] | undefined, rawIndex = 0;
    for (let match = expression.exec(text); match; match = expression.exec(text)) {
      let result: SourceRange;
      if (raw === text) result = { start: span.start + match.index, end: span.start + match.index + match[0].length };
      else {
        if (!rawMatches) {
          const candidates: { range: SourceRange; order: number }[] = []; rawExpression.lastIndex = 0;
          const sourceFragments = fragments.map((span, order) => ({ span, order })).sort((a, b) => a.span.start - b.span.start);
          const orderOf = (range: SourceRange) => {
            let low = 0, high = sourceFragments.length;
            while (low < high) { const middle = (low + high) >>> 1; if (sourceFragments[middle].span.end <= range.start) low = middle + 1; else high = middle; }
            return sourceFragments[low]?.order ?? Infinity;
          };
          let checked = 0;
          for (let candidate = rawExpression.exec(raw); candidate; candidate = rawExpression.exec(raw)) {
            const range = { start: span.start + candidate.index, end: span.start + candidate.index + candidate[0].length };
            const visible = windowedReadingText(runtime, [range], cache);
            if (comparison.test(visible)) candidates.push({ range, order: orderOf(range) });
            if (++checked % 64 === 0) await checkpoint();
          }
          rawMatches = candidates.sort((a, b) => a.order - b.order || a.range.start - b.range.start).map(item => item.range);
          // A block may mix an inline-styled occurrence (no contiguous source
          // spelling) with an ordinary occurrence. Positional pairing would
          // incorrectly assign the latter's source range to the former. Keep
          // the explicit block fallback when the mapping is not one-to-one.
          const counter = new RegExp(pattern, flags); let visibleCount = 0;
          while (counter.exec(text)) {
            visibleCount++;
            if (visibleCount > rawMatches.length) break;
            if (visibleCount % 64 === 0) await checkpoint();
          }
          if (visibleCount !== rawMatches.length) rawMatches = [];
        }
        result = rawMatches[rawIndex++] ?? span;
      }
      results.push(result);
      if (results.length >= limit) return results;
      if (results.length % 64 === 0) await checkpoint();
    }
    await checkpoint();
  }
  check(); options.onProgress?.(snapshot.source.length); check(); return results;
}
