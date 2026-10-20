import { rangeOf, type MarkdownNode, type SourceRange } from '../core';
import { SearchMatcher, type SearchPatternOptions } from '../core/search-worker';
import { throwIfAborted, yieldTask } from '../core/source-input';
import type { ReaderRuntime } from './runtime';
import { windowedReadingProjection, type ReadingProjection } from './windowed-copy';

const hidden = new Set(['definition', 'footnoteDefinition', 'annotationDefinition', 'streamPending']);
const batchSize = 128 * 1024, nearbySize = 256 * 1024, resultLimit = 100_000;
export interface ReadingSearchMatch { range: SourceRange; block: number; offset: number }

/** A contiguous scanned interval in reading order. Large books start near the
 * reader; explicit navigation extends this interval. Projection caches are
 * released after each batch, and results contain only source coordinates. */
export class ReadingSearch {
  readonly matches: ReadingSearchMatch[] = [];
  private readonly snapshot;
  private readonly configuration;
  private readonly presentation;
  private readonly entries: MarkdownNode[];
  private readonly matcher: SearchMatcher;
  private low = 0;
  private high = 0;
  limited = false;
  scanned = 0;
  constructor(private runtime: ReaderRuntime, query: string, private options: SearchPatternOptions = {}) {
    this.snapshot = runtime.document.getSnapshot();
    this.configuration = runtime.configuration.get();
    this.presentation = runtime.presentation.get();
    this.entries = this.snapshot.blocks.map(block => block.node);
    this.snapshot.footnoteOrder.forEach(id => { const node = this.snapshot.footnotes.get(id); if (node) this.entries.push(node); });
    this.matcher = new SearchMatcher(query, options);
  }
  get partial() { return this.limited || this.low > 0 || this.high < this.entries.length; }
  get large() { return this.snapshot.source.length > 4 * 1024 * 1024; }
  dispose() { this.matcher.dispose(); }
  private check() {
    throwIfAborted(this.options.signal);
    if (this.runtime.document.getSnapshot() !== this.snapshot || this.runtime.configuration.get() !== this.configuration || this.runtime.presentation.get() !== this.presentation)
      throw Object.assign(new Error('Document presentation changed during search.'), { name: 'AbortError' });
  }
  async initialize(source = 0) {
    if (this.large) {
      let low = 0, high = this.snapshot.blocks.length;
      while (low < high) { const mid = (low + high) >>> 1; if (this.snapshot.blocks[mid].range.end <= source) low = mid + 1; else high = mid; }
      this.low = this.high = Math.min(low, Math.max(0, this.entries.length - 1));
    }
    const start = this.scanned;
    do { await this.batch(1); } while (!this.limited && this.high < this.entries.length && (!this.large || this.scanned - start < nearbySize));
  }
  private async batch(direction: number) {
    this.check();
    const projections: { block: number; projection: ReadingProjection }[] = [];
    let size = 0, since = performance.now();
    while (direction > 0 ? this.high < this.entries.length : this.low > 0) {
      const block = direction > 0 ? this.high++ : --this.low, node = this.entries[block];
      if (!hidden.has(node.type) || block >= this.snapshot.blocks.length) {
        const projection = windowedReadingProjection(this.runtime, rangeOf(node));
        projections.push({ block, projection }); size += rangeOf(node).end - rangeOf(node).start;
      }
      if (performance.now() - since > 4) { await yieldTask(); this.check(); since = performance.now(); }
      if (size >= batchSize) break;
    }
    // Backward batches still preserve visual order within each block.
    if (direction < 0) projections.reverse();
    const result = await this.matcher.scan(projections.map(item => item.projection.text), resultLimit - this.matches.length);
    this.check();
    const found = projections.flatMap((item, index) => result.matches[index].map(range => ({ block: item.block, offset: range.start, range: item.projection.resolve(range) })));
    if (direction > 0) for (const match of found) this.matches.push(match);
    else this.matches.splice(0, 0, ...found);
    this.limited = result.limited; this.scanned += size;
    await yieldTask(); this.check();
  }
  async move(current: number, direction: number, source?: number): Promise<number> {
    this.check();
    if (current < 0 && source !== undefined) {
      // A source coordinate alone is not reading order (e.g. bilingual text).
      // Resolve its position within the block's visible projection first.
      let low = 0, high = this.snapshot.blocks.length;
      while (low < high) { const mid = (low + high) >>> 1; if (this.snapshot.blocks[mid].range.end <= source) low = mid + 1; else high = mid; }
      let block = Math.min(low, Math.max(0, this.entries.length - 1));
      if (this.entries[block]?.type === 'footnoteDefinition') {
        const note = this.entries.indexOf(this.entries[block], this.snapshot.blocks.length);
        if (note >= 0) block = note;
      }
      // The reader may have scrolled since this query was initialized. Cover
      // the new anchor before selecting an already scanned but farther match.
      while (!this.limited && block < this.low) await this.batch(-1);
      while (!this.limited && block >= this.high && this.high < this.entries.length) await this.batch(1);
      const offset = this.entries[block] ? windowedReadingProjection(this.runtime, rangeOf(this.entries[block])).offsetAt(source) : 0;
      const after = (match: ReadingSearchMatch) => match.block > block || match.block === block && match.offset >= offset;
      if (direction > 0) {
        const next = this.matches.findIndex(after);
        if (next >= 0) return next;
        current = this.matches.length - 1;
      } else {
        for (let index = this.matches.length - 1; index >= 0; index--) if (!after(this.matches[index])) return index;
        current = 0;
      }
    }
    const next = current + direction;
    if (next >= 0 && next < this.matches.length) return next;
    const selected = this.matches[current];
    while (!this.limited && (direction > 0 ? this.high < this.entries.length : this.low > 0)) {
      const before = this.matches.length;
      await this.batch(direction);
      if (this.matches.length > before) return direction > 0 ? before : this.matches.length - before - 1;
    }
    // At the document edge, finish the opposite unknown interval before wrap.
    // Never claim the first local result is the first result of the whole book.
    while (!this.limited && (direction > 0 ? this.low > 0 : this.high < this.entries.length)) await this.batch(-direction);
    if (!this.matches.length) return -1;
    if (selected && !this.matches.includes(selected)) return -1;
    return direction > 0 ? 0 : this.matches.length - 1;
  }
}
