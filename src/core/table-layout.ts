/** Browser-independent, bounded table layout. Width candidates represent changes
 * in wrapping; row heights are selected by the cost of empty space imposed on
 * neighbouring cells, rather than a fixed number of body lines. */
export interface TableToken { width: number; space?: number; required?: boolean }
export interface TableCellMetrics {
  tokens: readonly TableToken[];
  naturalWidth: number;
  minWidth: number;
  lineHeight: number;
  /** Approximate extra lines for deliberately bounded measurement of huge cells. */
  extraWidth?: number;
  /** Measured readable prefix plus ellipsis/marker for unusually long tokens. */
  minTruncatedWidth?: number;
  /** Bounded measured emergency-wrap thresholds for exceptional header tokens. */
  emergencyWrapWidths?: readonly number[];
}
export interface TableLayoutOptions {
  /** Absolute protection limit in CSS pixels; the content profile usually uses less. */
  maxColumnWidth?: number;
  /** Optional protection limit in CSS pixels, never a fixed body line count. */
  maxRowHeight?: number;
  cellPadding?: number;
  fontSize?: number;
}
export interface TableLayoutInput {
  rows: readonly (readonly TableCellMetrics[])[];
  availableWidth: number;
  options?: TableLayoutOptions;
}
export interface TableLayoutPlan {
  widths: number[];
  /** Text windows can be narrower than tracks when a very wide viewport must
   * be filled without exceeding the configured maximum readable line length. */
  contentWidths: number[];
  /** Content heights, excluding padding. The built-in planner caps headers at three lines. */
  heights: number[];
  clipped: boolean[][];
  scroll: boolean;
  width: number;
  cost: number;
  evaluations: number;
}
/** Synchronous, pure planner over measured cells. Inputs are borrowed/read-only;
 * return a complete plan with one width per column and one height per row. */
export type TableLayoutAlgorithm = (input: TableLayoutInput) => TableLayoutPlan;

const finite = (value: number | undefined, fallback: number) => value !== undefined && Number.isFinite(value) && value > 0 ? value : fallback;
const quantile = (values: readonly number[], fraction: number) => values.length ? [...values].sort((a, b) => a - b)[Math.floor((values.length - 1) * fraction)] : 0;

/** Native word wrapping with indivisible tokens. A long URL/formula overflows
 * horizontally rather than being split into single letters. */
export function tableCellLines(cell: TableCellMetrics, width: number): number {
  if (!cell.tokens.length && !cell.extraWidth) return 1;
  let lines = 1, used = 0, gap = 0;
  for (const token of cell.tokens) {
    const amount = Math.max(0, token.width);
    if (used && used + gap + amount > width + .1) { lines++; used = 0; }
    used += (used ? gap : 0) + amount;
    gap = token.space ?? 0;
    if (token.required) { lines++; used = 0; gap = 0; }
  }
  return lines + Math.ceil((cell.extraWidth ?? 0) / Math.max(1, width));
}

interface RowPlan { height: number; cost: number; clipped: boolean[] }
function rowPlan(cells: readonly TableCellMetrics[], widths: readonly number[], padding: number, em: number, header: boolean, cap: number, lines: typeof tableCellLines = tableCellLines): RowPlan {
  const contentWidths = widths.map(width => Math.max(1, width - padding));
  const demands = cells.map((cell, i) => lines(cell, contentWidths[i]) * cell.lineHeight);
  const full = Math.max(em, ...demands);
  const limit = header ? Math.max(em, ...cells.map(cell => cell.lineHeight * 3)) : cap;
  const maximum = Math.min(full, limit);
  const protectedHeight = Math.min(maximum, Math.max(0, ...demands.filter((demand, i) => demand <= cells[i].lineHeight * 2 + .1 && cells[i].naturalWidth <= em * 18)));
  const candidates = new Set<number>([maximum]);
  if (!header) {
    const stops = [...new Set(demands.filter(value => value > 0 && value <= maximum))].sort((a, b) => a - b);
    for (let i = 0; i < Math.min(12, stops.length); i++) candidates.add(stops[Math.floor(i * (stops.length - 1) / Math.max(1, Math.min(12, stops.length) - 1))]);
    if (protectedHeight > 0) candidates.add(protectedHeight);
    // Geometric candidates retain meaningful context for isolated outliers;
    // dense rows keep their full height because every shortened cell has a cost.
    const unit = Math.max(em, ...cells.map(cell => cell.lineHeight));
    for (let step = 0; step < 10 && unit < maximum; step++) {
      const height = unit * (maximum / unit) ** (step / 10);
      candidates.add(Math.min(maximum, Math.ceil(height / unit) * unit));
    }
  }
  let best: RowPlan | undefined;
  for (const height of candidates) {
    if (height + .1 < protectedHeight) continue;
    // A modest vertical reading cost rewards using available width even when
    // every cell is equally dense and therefore creates no neighbour whitespace.
    let cost = .8 * height / em;
    const clipped = cells.map((cell, i) => {
      const demand = demands[i], shown = Math.min(demand, height), width = contentWidths[i];
      const hidden = Math.max(0, demand - height) / cell.lineHeight;
      const visible = Math.max(1, shown / cell.lineHeight);
      // This is the empty area a tall cell imposes on every shorter neighbour.
      cost += width / em * Math.max(0, height - demand) / em;
      // Column expansion also imposes horizontal whitespace on short peers.
      // Normal ragged line endings in a wrapped paragraph are not an external
      // cost imposed on another cell. Charge the excess track width of short
      // peers instead; otherwise a few pixels of normal wrap slack can defeat
      // a substantial reduction in every dense cell's height.
      cost += .14 * Math.max(0, width - cell.naturalWidth) * shown / (em * em);
      // Losing context is progressively more expensive when almost no context
      // remains. There is no global 6/8-line threshold.
      if (hidden) cost += (header ? 12 : 2.8) * width / em * (2 + hidden / Math.sqrt(visible));
      const overflow = cell.minWidth > width + .5;
      if (overflow) cost += (header ? 8 : 5) * Math.min(30, (cell.minWidth - width) / em);
      return hidden > .01 || overflow;
    });
    if (header) cost += cells.reduce((sum, cell, i) => sum + Math.min(3, lines(cell, contentWidths[i])) - 1, 0) * 2.5;
    if (!best || cost < best.cost - .001 || Math.abs(cost - best.cost) < .001 && height > best.height) best = { height, cost, clipped };
  }
  return best!;
}

function sampleRows(rows: readonly (readonly TableCellMetrics[])[]): number[] {
  if (rows.length <= 40) return rows.map((_, i) => i);
  const selected = new Set([0, rows.length - 1]);
  // Even coverage plus the largest cells catches distant outliers without
  // making resize optimization proportional to an enormous table's row count.
  for (let i = 1; i < 25; i++) selected.add(Math.floor(i * (rows.length - 1) / 25));
  rows.map((row, index) => ({ index, size: row.reduce((sum, cell) => sum + cell.naturalWidth, 0) }))
    .sort((a, b) => b.size - a.size).slice(0, 14).forEach(item => selected.add(item.index));
  return [...selected].sort((a, b) => a - b);
}

function fillTracks(widths: number[], weights: readonly number[], available: number, protection: number) {
  let remaining = available - widths.reduce((sum, width) => sum + width, 0);
  let active = widths.map((_, i) => i).filter(i => widths[i] < protection);
  while (remaining > .0001 && active.length) {
    const weight = active.reduce((sum, i) => sum + weights[i], 0);
    const saturated = active.filter(i => remaining * weights[i] / weight >= protection - widths[i]);
    if (!saturated.length) {
      for (const i of active) widths[i] += remaining * weights[i] / weight;
      remaining = 0;
    } else {
      for (const i of saturated) { remaining -= protection - widths[i]; widths[i] = protection; }
      active = active.filter(i => !saturated.includes(i));
    }
  }
  if (remaining > .0001) {
    const weight = weights.reduce((sum, value) => sum + value, 0);
    widths.forEach((_, i) => { widths[i] += remaining * weights[i] / weight; });
  }
}

function readabilityFloor(cell: TableCellMetrics, em: number, maximum: number) {
  // A single ordinary word or short reference is never sacrificed because
  // most other rows in its column contain only a checkmark. Truly long URLs,
  // formulas and prose still use the adaptive protection/truncation policy.
  const normal = cell.tokens.reduce((width, token) => token.width <= em * 14 ? Math.max(width, token.width) : width, 0);
  let floor = Math.min(maximum, Math.max(normal, cell.minTruncatedWidth ?? 0));
  if (cell.naturalWidth <= em * 18 && cell.minWidth <= maximum) {
    let low = Math.max(floor, cell.minWidth), high = Math.min(maximum, cell.naturalWidth);
    for (let step = 0; step < 9 && high - low > .25; step++) {
      const middle = (low + high) / 2;
      if (tableCellLines(cell, middle) <= 2) high = middle; else low = middle;
    }
    floor = Math.max(floor, high);
  }
  return floor;
}

/** At most 40 sampled rows, 18 candidates/column and bounded coordinate passes.
 * The result is deterministic and approximate, not an unbounded optimal solver. */
export function layoutTable({ rows, availableWidth, options = {} }: TableLayoutInput): TableLayoutPlan {
  const count = rows.reduce((maximum, row) => Math.max(maximum, row.length), 0);
  if (!count) return { widths: [], contentWidths: [], heights: [], clipped: [], scroll: false, width: 0, cost: 0, evaluations: 0 };
  const em = finite(options.fontSize, 16), padding = finite(options.cellPadding, em * 1.25);
  const available = finite(availableWidth, 640);
  // Wide reading panes can use modestly longer lines; an explicit application
  // limit stays exact. This avoids forcing a near-fitting sentence onto a new
  // line solely because the default was tuned for a narrow article column.
  const protection = finite(options.maxColumnWidth, Math.max(em * 48, Math.min(em * 64, available)));
  const rowCap = finite(options.maxRowHeight, Infinity);
  const samples = sampleRows(rows);
  // Opening horizontal travel has a one-time cost, so modest wrapping wins.
  // Once scrolling is necessary, additional useful width is much cheaper.
  const horizontalCost = (width: number) => width > available + .5 ? Math.max(8, available / em * .2) + (width - available) / em * (.1 + samples.length * .02) : 0;
  const columns = Array.from({ length: count }, (_, column) => {
    const body = rows.slice(1).flatMap(row => row[column] ? [row[column]] : []);
    const typical = quantile(body.map(cell => cell.naturalWidth), .6);
    const density = typical / (typical + em * 12);
    // Many substantial cells support a wider column; a lone long cell among
    // tiny values does not get to widen every peer to the protection limit.
    let maximum = Math.max(em * 2 + padding, Math.min(protection, em * (11 + 29 * density) + padding));
    const header = rows[0]?.[column];
    // A profile cap just below an actual grapheme boundary can create a lone
    // final letter. Snap only a nearby measured 2/3-line threshold upward;
    // normal columns and explicit protection limits retain their old bounds.
    const nearby = header?.emergencyWrapWidths?.filter(width => width + padding > maximum && width + padding <= maximum + em)
      .map(width => Math.ceil((width + padding) * 2) / 2).filter(width => width <= protection);
    if (nearby?.length) maximum = Math.min(...nearby);
    const readable = [header, ...body].reduce((floor, cell) => cell ? Math.max(floor, readabilityFloor(cell, em, maximum - padding)) : floor, 0);
    const minimum = Math.min(maximum, Math.max(em * 2.25, readable) + padding);
    const candidates = new Set([minimum, maximum]);
    for (let i = 1; i < 10; i++) candidates.add(minimum + (maximum - minimum) * i / 10);
    for (const cell of [header, ...body.filter((_, i) => i % Math.max(1, Math.floor(body.length / 6)) === 0).slice(0, 6)]) {
      if (!cell) continue;
      for (const lines of [1, 2, 3]) candidates.add(Math.max(minimum, Math.min(maximum, cell.naturalWidth / lines + padding)));
    }
    for (const width of header?.emergencyWrapWidths ?? []) {
      const rounded = Math.ceil((width + padding) * 2) / 2;
      if (rounded >= minimum && rounded <= maximum) candidates.add(rounded);
    }
    const sorted = [...candidates].map(value => Math.max(Math.ceil(minimum * 2) / 2, Math.round(value * 2) / 2)).sort((a, b) => a - b);
    const unique = [...new Set(sorted)];
    const kept = unique.length <= 18 ? unique : unique.filter((_, i) => i === 0 || i === unique.length - 1 || Math.floor(i * 16 / unique.length) !== Math.floor((i - 1) * 16 / unique.length));
    return { minimum: kept[0], maximum: kept.at(-1)!, candidates: kept,
      weight: Math.sqrt(Math.max(em, Math.min(protection, Math.max(typical, header?.naturalWidth ?? 0)))) };
  });
  const minimumSum = columns.reduce((sum, column) => sum + column.minimum, 0);
  const scroll = minimumSum > available + .5;
  const budget = scroll ? columns.reduce((sum, column) => sum + column.maximum, 0) : available;
  const widths = columns.map(column => column.minimum);
  let evaluations = 0;
  const evaluationLimit = count > 48 ? 96 : 768;
  const wrapping = new WeakMap<TableCellMetrics, Map<number, number>>();
  const lines: typeof tableCellLines = (cell, width) => {
    let cache = wrapping.get(cell);
    if (!cache) { cache = new Map(); wrapping.set(cell, cache); }
    const saved = cache.get(width); if (saved !== undefined) return saved;
    const result = tableCellLines(cell, width); cache.set(width, result); return result;
  };
  const score = (values: readonly number[]) => {
    if (evaluations >= evaluationLimit) return Infinity;
    evaluations++;
    const width = values.reduce((sum, value) => sum + value, 0);
    // Horizontal travel is a cost even after scrolling becomes unavoidable.
    let cost = horizontalCost(width);
    for (const index of samples) cost += rowPlan(rows[index], values, padding, em, index === 0, rowCap, lines).cost;
    return cost;
  };
  let best = score(widths);
  // Greedy improvement is useful here because increasing a prose column can
  // reduce the height (and blank area) of every row at once. Pair exchanges
  // below repair the allocation when the available width is already occupied.
  const passes = count <= 48 ? 3 : 1;
  for (let pass = 0; pass < passes; pass++) {
    let changed = false;
    for (let column = 0; column < count; column++) {
      const before = widths[column], total = widths.reduce((sum, value) => sum + value, 0);
      let chosen = before;
      for (const candidate of columns[column].candidates) {
        if (candidate === before || total - before + candidate > budget + .01) continue;
        widths[column] = candidate;
        const cost = score(widths);
        if (cost < best - .01) { best = cost; chosen = candidate; changed = true; }
      }
      widths[column] = chosen;
    }
    if (!changed) break;
  }
  if (!scroll && count <= 32) for (let round = 0; round < 2; round++) {
    let changed = false;
    // Each recipient tries at most two donors: the columns with most spare
    // width. This bounds exchanges without a quadratic width-product search.
    for (let recipient = 0; recipient < count; recipient++) {
      const next = columns[recipient].candidates.find(value => value > widths[recipient] + .5);
      if (!next) continue;
      const total = widths.reduce((sum, value) => sum + value, 0), needed = Math.max(0, total + next - widths[recipient] - budget);
      const donors = widths.map((width, index) => ({ index, spare: width - columns[index].minimum })).filter(item => item.index !== recipient && item.spare >= needed).sort((a, b) => b.spare - a.spare).slice(0, 2);
      for (const { index: donor } of donors) {
        const oldRecipient = widths[recipient], oldDonor = widths[donor];
        const reduced = [...columns[donor].candidates].reverse().find(value => value <= oldDonor - needed + .01);
        if (reduced === undefined) continue;
        widths[recipient] = next; widths[donor] = reduced;
        const cost = score(widths);
        if (cost < best - .01) { best = cost; changed = true; break; }
        widths[recipient] = oldRecipient; widths[donor] = oldDonor;
      }
    }
    if (!changed) break;
  }
  if (!scroll) {
    let remaining = available - widths.reduce((sum, width) => sum + width, 0);
    // Filling the reader width is a hard constraint. Spend free space first on
    // measurable wrapping/overflow improvements, even when their empty-space
    // cost made the unconstrained optimizer prefer a narrower table.
    let trials = 0;
    while (remaining > .01 && trials < 256 && count <= 48) {
      let winner: { column: number; width: number; benefit: number } | undefined;
      for (let column = 0; column < count && trials < 256; column++) {
        const before = Math.max(1, widths[column] - padding);
        const candidates = new Set([...columns[column].candidates, Math.min(protection, widths[column] + remaining)]);
        for (const width of candidates) {
          const extra = width - widths[column];
          if (extra <= .01 || extra > remaining + .01) continue;
          if (trials++ >= 256) break;
          const after = Math.max(1, width - padding);
          let gain = 0;
          for (const row of samples) {
            const cell = rows[row][column]; if (!cell) continue;
            gain += (row === 0 ? 3 : 1) * (lines(cell, before) - lines(cell, after));
            gain += (row === 0 ? 16 : 8) * (Math.max(0, cell.minWidth - before) - Math.max(0, cell.minWidth - after)) / em;
          }
          const benefit = gain / extra;
          if (gain > .001 && (!winner || benefit > winner.benefit)) winner = { column, width, benefit };
        }
      }
      if (!winner) break;
      remaining -= winner.width - widths[winner.column]; widths[winner.column] = winner.width;
    }
    // Water-fill by the content profile, not by equal browser-distributed
    // columns. In one/two-column tables a capped prose window must not force
    // all remaining track space into its short reference neighbour. Larger
    // tables keep capped tracks while their combined capacity can fill it.
    const weights = columns.map(column => column.weight);
    const trackProtection = count <= 2 ? Infinity : protection;
    fillTracks(widths, weights, available, trackProtection);
    // Coordinate search is ordered. A second content-weighted seed avoids
    // starving later, equally dense columns after the hard width floor fills
    // the last few pixels. Compare using the same row/column external costs.
    const balanced = columns.map(column => column.minimum);
    fillTracks(balanced, weights, available, trackProtection);
    if (score(balanced.map(width => Math.min(width, protection))) < score(widths.map(width => Math.min(width, protection)))) widths.splice(0, widths.length, ...balanced);
    // Fitting minimum widths does not imply a readable dense table. Compare
    // four bounded wider alternatives together: widening just one dense cell
    // cannot lower a row whose other dense cells still determine its height.
    const dense = samples.some(index => index > 0 && rows[index].filter((cell, column) => lines(cell, Math.max(1, widths[column] - padding)) * cell.lineHeight > available * .75).length >= Math.ceil(rows[index].length * .6));
    let preferred = [...widths], preferredCost = score(widths);
    if (dense) for (const factor of [1.25, 1.5, 2, Infinity]) {
      const candidate = widths.map((width, i) => Math.max(width, Math.min(columns[i].maximum, width * factor)));
      if (candidate.reduce((sum, width) => sum + width, 0) <= available + .5) continue;
      const cost = score(candidate);
      if (cost < preferredCost - .01) { preferred = candidate; preferredCost = cost; }
    }
    widths.splice(0, widths.length, ...preferred);
  }
  const contentWidths = widths.map(width => Math.min(width, protection));
  const result = rows.map((row, i) => rowPlan(row, contentWidths, padding, em, i === 0, rowCap, lines));
  const width = widths.reduce((sum, value) => sum + value, 0);
  const cost = samples.reduce((sum, index) => sum + result[index].cost, 0) + horizontalCost(width);
  return { widths, contentWidths, heights: result.map(row => row.height), clipped: result.map(row => row.clipped), width, scroll: width > available + .5, cost, evaluations };
}
