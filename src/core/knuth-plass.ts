/** TeX82's paragraph model (tex.web, sections 815–873): boxes, glue,
 * discretionary penalties, four fitness classes and a minimum-demerit path.
 * Widths are converted to scaled units for TeX's integer badness calculation. */
export type LineItem = { type: 'box'; width: number }
  | { type: 'glue'; width: number; stretch: number; shrink: number; infinite?: boolean }
  | { type: 'penalty'; width: number; penalty: number; flagged?: boolean; automatic?: boolean };
export interface KnuthPlassOptions {
  pretolerance?: number;
  tolerance?: number;
  linePenalty?: number;
  hyphenPenalty?: number;
  adjacentDemerits?: number;
  doubleHyphenDemerits?: number;
  finalHyphenDemerits?: number;
  /** Extra stretch in CSS pixels in the emergency pass, as in TeX. */
  emergencyStretch?: number;
  looseness?: number;
  /** Default: Knuth–Liang en-US patterns. Return pieces that join to the word. */
  hyphenate?: false | ((word: string) => readonly string[]);
}
export interface LineBreak { index: number; start: number; ratio: number; fitness: number }
export interface ParagraphLayout { lines: LineBreak[]; demerits: number; pass: 'pretolerance' | 'tolerance' | 'emergency' | 'final' }
const scale = 65536;
/** The integer approximation used by TeX, including its saturation at 10000. */
export function texBadness(amount: number, available: number): number {
  const t = Math.round(Math.abs(amount) * scale), s = Math.round(available * scale);
  if (!t) return 0;
  if (s <= 0) return 10000;
  const r = t <= 7230584 ? Math.floor(t * 297 / s) : s >= 1663497 ? Math.floor(t / Math.floor(s / 297)) : t;
  return r > 1290 ? 10000 : Math.floor((r * r * r + 131072) / 262144);
}
interface Active { at: number; start: number; line: number; fitness: number; flagged: boolean; demerits: number; ratio: number; previous?: Active }

/** Prefix sums and safe active-node pruning remove repeated line scans. With
 * constant line lengths and zero looseness, equal fitness is an exact shared
 * state: future cost is independent of line count. No beam or word limit. */
export function knuthPlass(items: readonly LineItem[], lengths: number | readonly number[], options: KnuthPlassOptions = {}): ParagraphLayout {
  return prepareKnuthPlass(items)(lengths, options);
}

/** Retains width/stretch prefix sums across responsive layouts of the same text. */
export function prepareKnuthPlass(items: readonly LineItem[]): (lengths: number | readonly number[], options?: KnuthPlassOptions) => ParagraphLayout {
  const n = items.length;
  const widths = new Float64Array(n + 1), stretches = new Float64Array(n + 1), shrinks = new Float64Array(n + 1), infinite = new Uint32Array(n + 1);
  const next = new Uint32Array(n + 1); next[n] = n;
  let monotonic = true;
  for (let i = 0; i < n; i++) {
    const item = items[i];
    widths[i + 1] = widths[i] + (item.type === 'penalty' ? 0 : item.width);
    stretches[i + 1] = stretches[i] + (item.type === 'glue' ? item.stretch : 0);
    shrinks[i + 1] = shrinks[i] + (item.type === 'glue' ? item.shrink : 0);
    infinite[i + 1] = infinite[i] + (item.type === 'glue' && item.infinite ? 1 : 0);
    if (item.width < 0 || item.type === 'glue' && (item.shrink < 0 || item.stretch < 0 || item.width < item.shrink)) monotonic = false;
  }
  for (let i = n - 1; i >= 0; i--) next[i] = items[i].type === 'box' || items[i].type === 'penalty' && (items[i] as Extract<LineItem, { type: 'penalty' }>).penalty >= 10000 ? i : next[i + 1];
  return (lengths, options = {}) => {
    if (!n) return { lines: [], demerits: 0, pass: 'pretolerance' };
    const varying = typeof lengths !== 'number', looseness = options.looseness ?? 0;
    const lineWidth = (line: number) => typeof lengths === 'number' ? lengths : lengths[Math.min(line, lengths.length - 1)];
    const linePenalty = options.linePenalty ?? 10, adjacent = options.adjacentDemerits ?? 10000;
    const pass = (threshold: number, hyphens: boolean, emergency: number, final: boolean): Active | undefined => {
      let active: Active[] = [{ at: -1, start: next[0], line: 0, fitness: 1, flagged: false, demerits: 0, ratio: 0 }];
      for (let b = 0; b < n; b++) {
        const item = items[b];
        if (!(item.type === 'glue' && b > 0 && items[b - 1].type === 'box') && !(item.type === 'penalty' && item.penalty < 10000 && (hyphens || !item.automatic))) continue;
        const forced = item.type === 'penalty' && item.penalty <= -10000;
        const best = new Map<number, Active>(), survivors: Active[] = [];
        let fallback: Active | undefined;
        for (const a of active) {
          const start = Math.min(a.start, b), natural = widths[b] - widths[start] + (item.type === 'penalty' ? item.width : 0);
          const shrink = shrinks[b] - shrinks[start], stretch = stretches[b] - stretches[start] + emergency;
          const difference = lineWidth(a.line) - natural;
          const fil = infinite[b] > infinite[start];
          const badness = difference < -shrink ? 10001 : difference > 0 && fil ? 0 : texBadness(difference, difference > 0 ? stretch : shrink);
          const fitness = difference < 0 ? badness > 12 ? 0 : 1 : badness > 99 ? 3 : badness > 12 ? 2 : 1;
          const penalty = item.type === 'penalty' ? item.penalty : 0;
          const flagged = item.type === 'penalty' && !!item.flagged;
          let cost = Math.min(10000, Math.abs(linePenalty + badness)) ** 2;
          if (penalty >= 0) cost += penalty * penalty;
          else if (penalty > -10000) cost -= penalty * penalty;
          if (a.flagged && b === n - 1) cost += options.finalHyphenDemerits ?? 5000;
          else if (a.flagged && flagged) cost += options.doubleHyphenDemerits ?? 10000;
          if (Math.abs(fitness - a.fitness) > 1) cost += adjacent;
          const outputRatio = difference === 0 || difference > 0 && fil ? 0 : difference / (difference > 0 ? stretches[b] - stretches[start] : shrink);
          const candidate: Active = { at: b, start: next[Math.min(n, b + 1)], line: a.line + 1, fitness, flagged, demerits: a.demerits + cost, ratio: Number.isFinite(outputRatio) ? Math.max(-1, outputRatio) : 0, previous: a };
          if (badness <= threshold) {
            const key = (looseness ? candidate.line : varying ? Math.min(candidate.line, lengths.length - 1) : 0) * 4 + fitness;
            if (!best.has(key) || best.get(key)!.demerits > candidate.demerits) best.set(key, candidate);
          }
          if (!fallback || candidate.demerits < fallback.demerits) fallback = candidate;
          // Exclude this penalty's optional width: a later break may omit it.
          if (!forced && (!monotonic || widths[b] - widths[start] - shrink <= lineWidth(a.line))) survivors.push(a);
        }
        if (final && !best.size && !survivors.length && fallback) {
          // TeX's final pass preserves an otherwise impossible paragraph with an
          // artificial break; an indivisible overfull box stays visible.
          fallback.demerits = fallback.previous!.demerits;
          best.set(fallback.fitness, fallback);
        }
        active = [...survivors, ...best.values()];
        if (!active.length) return;
      }
      const endings = active.filter(a => a.at === n - 1);
      const best = endings.reduce<Active | undefined>((best, a) => !best || a.demerits < best.demerits ? a : best, undefined);
      if (!best || !looseness) return best;
      const desired = best.line + looseness;
      const chosen = endings.reduce((chosen, a) => Math.abs(a.line - desired) < Math.abs(chosen.line - desired) || Math.abs(a.line - desired) === Math.abs(chosen.line - desired) && a.demerits < chosen.demerits ? a : chosen, best);
      return final || chosen.line === desired ? chosen : undefined;
    };
    const emergency = options.emergencyStretch ?? 16;
    const passes = [
      { name: 'pretolerance', threshold: options.pretolerance ?? 100, hyphens: false, emergency: 0, final: false },
      { name: 'tolerance', threshold: options.tolerance ?? 200, hyphens: true, emergency: 0, final: emergency <= 0 },
      { name: 'emergency', threshold: options.tolerance ?? 200, hyphens: true, emergency, final: true },
    ] as const;
    for (const attempt of passes) {
      if (attempt.threshold < 0 || attempt.name === 'emergency' && !attempt.emergency) continue;
      const result = pass(Math.min(10000, attempt.threshold), attempt.hyphens, attempt.emergency, attempt.final);
      if (!result) continue;
      const lines: LineBreak[] = [];
      for (let at = result; at.previous; at = at.previous) lines.push({ index: at.at, start: at.previous.start, ratio: at.ratio, fitness: at.fitness });
      return { lines: lines.reverse(), demerits: result.demerits, pass: attempt.name };
    }
    return { lines: [], demerits: Infinity, pass: 'final' };
  };
}
