/** Bounded LRU for expensive pure computations. Instances define cache isolation. */
export class LruCache<K, V> {
  private entries = new Map<K, V>();
  constructor(readonly capacity = 128) { if (capacity < 1) throw new Error('Cache capacity must be positive'); }
  get size() { return this.entries.size; }
  get(key: K): V | undefined {
    if (!this.entries.has(key)) return undefined;
    const value = this.entries.get(key)!; this.entries.delete(key); this.entries.set(key, value); return value;
  }
  set(key: K, value: V): void {
    this.entries.delete(key); this.entries.set(key, value);
    while (this.entries.size > this.capacity) this.entries.delete(this.entries.keys().next().value!);
  }
  delete(key: K) { this.entries.delete(key); }
  clear() { this.entries.clear(); }
}

export class ResourceCache<T = unknown> {
  private values: LruCache<string, T>;
  private pending = new Map<string, { promise: Promise<T>; controller: AbortController; consumers: number }>();
  constructor(capacity = 128) { this.values = new LruCache(capacity); }
  acquire(key: string, loader: (signal: AbortSignal) => Promise<T>): { promise: Promise<T>; release: () => void } {
    const cached = this.values.get(key);
    if (cached !== undefined) return { promise: Promise.resolve(cached), release() {} };
    let entry = this.pending.get(key);
    if (!entry) {
      const controller = new AbortController();
      const promise = Promise.resolve().then(() => loader(controller.signal)).then(value => {
        if (!controller.signal.aborted) this.values.set(key, value);
        return value;
      }).finally(() => { if (this.pending.get(key)?.controller === controller) this.pending.delete(key); });
      entry = { promise, controller, consumers: 0 };
      this.pending.set(key, entry);
    }
    entry.consumers++;
    let released = false;
    return { promise: entry.promise, release: () => {
      if (released) return; released = true;
      // A preview becoming a dialog (or a StrictMode effect replay) can hand
      // the same request to another consumer within the current commit.
      if (--entry!.consumers === 0) queueMicrotask(() => {
        if (entry!.consumers === 0 && this.pending.get(key) === entry) { this.pending.delete(key); entry!.controller.abort(); }
      });
    } };
  }
  invalidate(key?: string) {
    if (key !== undefined) { this.values.delete(key); this.pending.get(key)?.controller.abort(); this.pending.delete(key); }
    else { this.values.clear(); for (const entry of this.pending.values()) entry.controller.abort(); this.pending.clear(); }
  }
}
