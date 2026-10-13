export interface FigureLimits {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
export const defaultFigureLimits: Readonly<FigureLimits> = { minWidth: 220, maxWidth: 560, minHeight: 120, maxHeight: 480 };
export interface FigureMeasure { ratio: number; limits: FigureLimits }

/** Preserve aspect ratio. Upper limits win if an author's minima conflict. */
export function figureWidths({ ratio, limits }: FigureMeasure) {
  const maximum = Math.min(limits.maxWidth, limits.maxHeight * ratio);
  return { maximum, minimum: Math.min(maximum, Math.max(limits.minWidth, limits.minHeight * ratio)) };
}

/** Add a column only after the existing columns reach their upper bounds and
 * another readable image fits. Manual grids can instead shrink to fit. */
export function figureColumns(width: number, items: readonly FigureMeasure[], gap: number, requested?: number, responsive = true): number {
  if (!items.length || width <= 0) return 1;
  const bounds = items.map(figureWidths);
  const fits = (count: number) => {
    const slot = (width - (count - 1) * gap) / count;
    return bounds.every(item => slot >= item.minimum);
  };
  if (requested) {
    let count = Math.max(1, Math.min(24, Math.floor(requested)));
    if (responsive) while (count > 1 && !fits(count)) count--;
    return count;
  }
  const maximum = Math.max(...bounds.map(item => item.maximum));
  const minimum = Math.max(...bounds.map(item => item.minimum));
  let count = 1;
  while (count < items.length && count < 24 && width >= count * maximum + count * gap + minimum && fits(count + 1)) count++;
  return count;
}

export function dimension(value: unknown, fallback: number, optional = false): number {
  if (optional && (value === false || value === 'false' || value === 'none')) return Infinity;
  if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+(?:\.\d+)?(?:px)?$/.test(value))) return fallback;
  const number = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}
export function figureLimits(attributes: Record<string, unknown> = {}, defaults = defaultFigureLimits): FigureLimits {
  return {
    minWidth: dimension(attributes['min-width'], defaults.minWidth), maxWidth: dimension(attributes['max-width'], defaults.maxWidth, true),
    minHeight: dimension(attributes['min-height'], defaults.minHeight), maxHeight: dimension(attributes['max-height'], defaults.maxHeight, true),
  };
}
