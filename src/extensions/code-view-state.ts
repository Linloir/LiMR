import { LruCache } from '../core/cache';
import type { MarkdownNode } from '../core';

export interface CodeViewState { collapsed?: boolean; wrap?: boolean }

/** Only user choices enter the LRU. Weak node IDs avoid retaining source trees
 * (or huge code strings) when edits replace them. Readers own separate caches. */
export class CodeViewCache {
  private ids = new WeakMap<MarkdownNode, number>();
  private values: LruCache<number, CodeViewState>;
  private nextId = 0;
  constructor(capacity = 256) { this.values = new LruCache(capacity); }
  get size() { return this.values.size; }
  get(node: MarkdownNode): CodeViewState | undefined {
    const id = this.ids.get(node);
    return id === undefined ? undefined : this.values.get(id);
  }
  set(node: MarkdownNode, state: CodeViewState): void {
    if (state.collapsed === undefined && state.wrap === undefined) return;
    let id = this.ids.get(node);
    if (id === undefined) { id = ++this.nextId; this.ids.set(node, id); }
    this.values.set(id, state);
  }
}

/** Stop at the threshold; very large plain fences need no full line array. */
export function exceedsCodeLines(code: string, limit: number): boolean {
  let at = -1;
  for (let lines = 0; lines < limit; lines++) {
    at = code.indexOf('\n', at + 1);
    if (at < 0) return false;
  }
  return true;
}
