/** Nearest-rank quantiles. Keep chronological samples so outliers are auditable. */
export function quantile(values: readonly number[], fraction: number) {
  if (!values.length) throw new Error('Cannot summarize an empty sample');
  return [...values].sort((a, b) => a - b)[Math.max(0, Math.ceil(values.length * fraction) - 1)];
}
export function stats(samples: number[]) {
  return { count: samples.length, medianMs: quantile(samples, .5), p95Ms: quantile(samples, .95), minMs: Math.min(...samples), maxMs: Math.max(...samples), samples };
}
export function order<T>(values: readonly T[], trial: number): T[] {
  const offset = trial % values.length;
  const rotated = [...values.slice(offset), ...values.slice(0, offset)];
  return Math.floor(trial / values.length) % 2 ? rotated.reverse() : rotated;
}
