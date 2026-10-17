/** Variable-height block offsets, independent of the browser's scroll limits.
 * Measurements change one prefix tree entry instead of rescanning the book. */
export class BlockHeightIndex {
  private readonly heights: Float64Array;
  private readonly tree: Float64Array;
  readonly length: number;

  constructor(heights: ArrayLike<number>) {
    this.length = heights.length;
    this.heights = Float64Array.from(heights, height => Math.max(0, Number.isFinite(height) ? height : 0));
    this.tree = new Float64Array(this.length + 1);
    for (let i = 1; i <= this.length; i++) {
      this.tree[i] += this.heights[i - 1];
      const parent = i + (i & -i);
      if (parent <= this.length) this.tree[parent] += this.tree[i];
    }
  }

  height(index: number): number { return this.heights[index] ?? 0; }
  /** Top of a block, or the total height for index === length. */
  offset(index: number): number {
    let sum = 0;
    for (let i = Math.min(this.length, Math.max(0, Math.floor(index))); i > 0; i -= i & -i) sum += this.tree[i];
    return sum;
  }
  get total(): number { return this.offset(this.length); }
  set(index: number, height: number): number {
    if (!Number.isInteger(index) || index < 0 || index >= this.length || !Number.isFinite(height) || height < 0) return 0;
    const delta = height - this.heights[index];
    if (!delta) return 0;
    this.heights[index] = height;
    for (let i = index + 1; i <= this.length; i += i & -i) this.tree[i] += delta;
    return delta;
  }
  /** Block containing an offset; zero-height entries are skipped. */
  at(offset: number): number {
    if (!this.length) return 0;
    const target = Math.max(0, offset);
    let index = 0, sum = 0, step = 1;
    while (step * 2 <= this.length) step *= 2;
    for (; step; step = Math.floor(step / 2)) {
      const next = index + step;
      if (next <= this.length && sum + this.tree[next] <= target) { index = next; sum += this.tree[next]; }
    }
    return Math.min(index, this.length - 1);
  }
}

/** Keep all CSS dimensions below engine limits. Native thumb seeks map across
 * the full book; wheel/key deltas can instead be applied to logical offsets. */
export function readingScrollGeometry(total: number, viewport: number, limit = 8_000_000) {
  const height = Math.min(Math.max(viewport, total), Math.max(viewport, limit));
  const logicalMax = Math.max(0, total - viewport), physicalMax = Math.max(0, height - viewport);
  const scale = physicalMax ? logicalMax / physicalMax : 1;
  return {
    height, logicalMax, physicalMax, scale,
    toLogical: (offset: number) => Math.min(logicalMax, Math.max(0, offset) * scale),
    toPhysical: (offset: number) => scale ? Math.min(physicalMax, Math.max(0, offset) / scale) : 0,
  };
}
