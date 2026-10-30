/// <reference path="../vendor.d.ts" />
import LineBreaker from 'linebreak';
import { LruCache } from '../core/cache';
import type { TableCellMetrics, TableToken } from '../core/table-layout';

interface DocumentMeasurements {
  widths: LruCache<string, number>;
  canvas?: CanvasRenderingContext2D | null;
  generation: number;
}
// Font family/style strings do not identify loaded font bytes. Keep both the
// canvas realm and its width cache with the owning Document. A font lifecycle
// listener survives table unmounts; the WeakMap creates no global document root.
const documentMeasurements = new WeakMap<Document, DocumentMeasurements>();
function measurementsFor(document: Document): DocumentMeasurements {
  let state = documentMeasurements.get(document);
  if (!state) {
    const created: DocumentMeasurements = { widths: new LruCache<string, number>(8192), generation: 0 };
    documentMeasurements.set(document, created);
    const invalidate = () => { created.widths.clear(); created.canvas = undefined; created.generation++; };
    document.fonts?.addEventListener('loading', invalidate);
    document.fonts?.addEventListener('loadingdone', invalidate);
    document.fonts?.addEventListener('loadingerror', invalidate);
    state = created;
  }
  return state;
}
const styleFor = (element: Element) => element.ownerDocument.defaultView?.getComputedStyle(element) ?? getComputedStyle(element);
const isElement = (node: Node): node is Element => node.nodeType === 1;
let graphemes: Intl.Segmenter | undefined;
interface Run { start: number; end: number; text: string; font: string; spacing: number; atomicWidth?: number; scrollable?: boolean }
export interface TableMeasurement { rows: TableCellMetrics[][]; fontSize: number; padding: number; fontKey: string }
export function tableFontKey(element: HTMLElement, overflowMarker?: HTMLElement | null): string {
  const css = styleFor(element);
  const markerStyle = overflowMarker && styleFor(overflowMarker);
  return [css.fontFamily, css.fontSize, css.fontWeight, css.fontStyle, css.letterSpacing, css.lineHeight,
    overflowMarker?.getBoundingClientRect().width, markerStyle?.marginLeft, markerStyle?.marginRight, measurementsFor(element.ownerDocument).generation].join('|');
}

/** scrollWidth includes italic/math ink past the logical inline box. Only
 * suspect cells need a fragment walk; preserve atomic math and local scrollers
 * instead of inspecting KaTeX's hidden MathML or its overflowing descendants. */
export function tableCellOverflowsHorizontally(content: HTMLElement): boolean {
  if (content.scrollWidth <= content.clientWidth + 1) return false;
  const bounds = content.getBoundingClientRect(), range = content.ownerDocument.createRange();
  const outside = (rects: DOMRectList) => [...rects].some(rect => rect.width > 0 && (rect.left < bounds.left - 1 || rect.right > bounds.right + 1));
  const visit = (node: Node): boolean => {
    if (node.nodeType === 3) { range.selectNodeContents(node); return outside(range.getClientRects()); }
    if (!isElement(node)) return false;
    const marker = node.matches('.limr-mark-wrap');
    if (node.hasAttribute('hidden') || node.matches('.limr-collapse[inert]') || node.hasAttribute('data-limr-ignore') && !marker) return false;
    const css = styleFor(node);
    if (css.display === 'none' || css.position === 'absolute' || css.position === 'fixed') return false;
    if (marker || node.matches('[data-limr-atomic],img,svg') || ['auto', 'scroll', 'hidden', 'clip'].includes(css.overflowX)) return outside(node.getClientRects());
    return [...node.childNodes].some(visit);
  };
  return [...content.childNodes].some(visit);
}

/** Read each styled run once. No DOM mutation, cloning or Range-per-word reads.
 * Width changes reuse these intrinsic measurements; only content/fonts/media
 * invalidate them. Very long cells keep an estimated tail beyond the budget. */
export function measureTable(element: HTMLTableElement, overflowMarker?: HTMLElement | null): TableMeasurement {
  const style = styleFor(element), fontSize = parseFloat(style.fontSize) || 16;
  const styles = new Map<Element, { font: string; spacing: number; leading: number; trailing: number; display: string; position: string }>();
  let remaining = 160_000, wrapMeasurementBudget = 768;
  const markerStyle = overflowMarker && styleFor(overflowMarker);
  const markerWidth = overflowMarker && markerStyle
    ? overflowMarker.getBoundingClientRect().width + (parseFloat(markerStyle.marginLeft) || 0) + (parseFloat(markerStyle.marginRight) || 0)
    : fontSize * 1.16;
  const state = measurementsFor(element.ownerDocument), widths = state.widths;
  if (state.canvas === undefined) state.canvas = element.ownerDocument.createElement('canvas').getContext('2d');
  const canvas = state.canvas;
  const fontFor = (node: Element) => {
    let saved = styles.get(node);
    if (!saved) {
      const css = styleFor(node);
      const inline = css.display === 'inline' || css.display === 'inline-block';
      const pixels = (value: string) => parseFloat(value) || 0;
      saved = { font: css.font || `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`, spacing: pixels(css.letterSpacing), display: css.display, position: css.position,
        leading: inline ? pixels(css.paddingLeft) + pixels(css.borderLeftWidth) + pixels(css.marginLeft) : 0,
        trailing: inline ? pixels(css.paddingRight) + pixels(css.borderRightWidth) + pixels(css.marginRight) : 0 };
      styles.set(node, saved);
    }
    return saved;
  };
  const widthOf = (text: string, font: string, spacing: number) => {
    const key = `${font}|${spacing}|${text}`;
    const cacheable = text.length <= 512;
    const known = cacheable ? widths.get(key) : undefined; if (known !== undefined) return known;
    if (canvas) canvas.font = font;
    const width = (canvas?.measureText(text).width ?? text.length * fontSize * .55) + Array.from(text).length * spacing;
    if (cacheable) widths.set(key, width); return width;
  };
  const rows = [...element.rows].map(row => [...row.cells].map(cell => {
    const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!;
    const css = styleFor(content), lineHeight = parseFloat(css.lineHeight) || fontSize * 1.5;
    const runs: Run[] = []; let text = '', omitted = 0;
    const budget = Math.max(256, Math.min(12_000, remaining));
    const visit = (node: Node) => {
      let trailing = 0;
      if (isElement(node)) {
        const style = fontFor(node);
        if (node.hasAttribute('hidden') || node.matches('.limr-collapse[inert]') || style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') return;
        // Markers are excluded from copied source, but occupy real inline
        // space. The word joiner preserves the same preceding-word attachment
        // as InlineMarker/AnnotationMark CSS. Other ignored UI stays ignored.
        if (node.matches('.limr-mark-wrap')) {
          const marker = node.querySelector<HTMLElement>('.limr-mark');
          if (marker) {
            const css = styleFor(marker);
            const width = marker.getBoundingClientRect().width + (parseFloat(css.marginLeft) || 0) + (parseFloat(css.marginRight) || 0);
            runs.push({ start: text.length, end: text.length + 2, text: '\u2060\ufffc', ...fontFor(node), atomicWidth: width });
            text += '\u2060\ufffc';
          }
          return;
        }
        if (node.hasAttribute('data-limr-ignore')) return;
        if (node.tagName === 'BR') { runs.push({ start: text.length, end: text.length + 1, text: '\n', ...fontFor(node) }); text += '\n'; return; }
        // KaTeX's bases already encode legal operator/allowbreak/nobreak
        // boundaries. The enclosing inline box instead reports its *current*
        // wrapped width, which is neither intrinsic nor stable across resize.
        const math = node.matches('[data-limr-atomic="inline"]') ? node.querySelector(':scope > .limr-math-inline > .katex > .katex-html') : null;
        if (math?.children.length && [...math.children].every(child => child.matches('.katex-base,.katex-newline'))) {
          for (const child of math.children) {
            const newline = child.classList.contains('katex-newline'), value = newline ? '\n' : '\ufffc';
            runs.push({ start: text.length, end: text.length + 1, text: value, ...fontFor(child),
              ...!newline && { atomicWidth: Math.max(child.getBoundingClientRect().width, child.scrollWidth), scrollable: true } });
            text += value;
          }
          return;
        }
        if (node.hasAttribute('data-limr-atomic')) {
          const surface = node.querySelector<HTMLElement>('[data-limr-selection-surface],img') ?? node as HTMLElement;
          const width = Math.max(surface.getBoundingClientRect().width, surface.scrollWidth || 0);
          runs.push({ start: text.length, end: text.length + 1, text: '\ufffc', ...fontFor(node), atomicWidth: width }); text += '\ufffc'; return;
        }
        if (style.leading) { runs.push({ start: text.length, end: text.length + 2, text: '\ufffc\u2060', ...style, atomicWidth: style.leading }); text += '\ufffc\u2060'; }
        trailing = style.trailing;
      }
      if (node.nodeType === 3) {
        const value = (node.textContent ?? '').replace(/[\t\r\n ]+/g, ' ');
        const included = value.slice(0, Math.max(0, budget - text.length));
        omitted += value.length - included.length;
        if (included) { runs.push({ start: text.length, end: text.length + included.length, text: included, ...fontFor(node.parentElement!) }); text += included; }
      } else {
        node.childNodes.forEach(visit);
        if (trailing && isElement(node)) { runs.push({ start: text.length, end: text.length + 2, text: '\u2060\ufffc', ...fontFor(node), atomicWidth: trailing }); text += '\u2060\ufffc'; }
      }
    };
    visit(content); remaining -= text.length;
    // Protect modest hyphenated labels such as E-Commerce using their rendered
    // width, not source length. Break analysis can use a nonbreaking hyphen
    // without altering the actual DOM, source string or canvas glyph widths.
    const breakText = text.replace(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu, (compound, offset: number) => {
      let width = 0;
      for (const run of runs) {
        const start = Math.max(offset, run.start), stop = Math.min(offset + compound.length, run.end);
        if (start < stop) width += widthOf(text.slice(start, stop), run.font, run.spacing);
      }
      return width <= fontSize * 14 ? compound.replace(/-/g, '\u2011') : compound;
    });
    const tokens: TableToken[] = [], breaker = new LineBreaker(breakText);
    let from = 0, runIndex = 0, naturalWidth = 0, minTruncatedWidth = 0;
    const emergencyWrapWidths: number[] = [];
    for (let next = breaker.nextBreak(); next; next = breaker.nextBreak()) {
      const end = next.position, piece = text.slice(from, end), trimmed = piece.replace(/\s+$/, ''), bodyEnd = from + trimmed.length;
      let width = 0, space = 0, scrollableWidth = 0;
      while (runIndex < runs.length && runs[runIndex].end <= from) runIndex++;
      for (let at = runIndex; at < runs.length && runs[at].start < end; at++) {
        const run = runs[at], start = Math.max(from, run.start), stop = Math.min(end, run.end);
        if (run.atomicWidth !== undefined) {
          width += run.atomicWidth;
          if (run.scrollable) scrollableWidth += run.atomicWidth;
        }
        else {
          if (start < Math.min(stop, bodyEnd)) width += widthOf(text.slice(start, Math.min(stop, bodyEnd)), run.font, run.spacing);
          if (stop > Math.max(start, bodyEnd)) space += widthOf(' ', run.font, run.spacing);
        }
      }
      if (width > fontSize * 14) {
        if (scrollableWidth) minTruncatedWidth = Math.max(minTruncatedWidth, Math.min(scrollableWidth, fontSize * 8));
        // Preserve a recognizable prefix of an otherwise unbounded token:
        // eight Latin graphemes or four full-width CJK graphemes, measured in
        // their actual styled runs. Only these exceptional tokens need the
        // extra lower bound; short words/references keep their existing floors.
        let prefixEnd = from, units = 0;
        const segments = typeof Intl.Segmenter === 'function'
          ? (graphemes ??= new Intl.Segmenter(undefined, { granularity: 'grapheme' })).segment(trimmed)
          : Array.from(trimmed, segment => ({ segment }));
        for (const { segment } of segments) {
          prefixEnd += segment.length;
          if (/[^\s\u2060\ufffc]/u.test(segment)) units += /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(segment) ? 2 : 1;
          if (units >= 8) break;
        }
        if (units) {
          let prefixWidth = 0;
          for (let at = runIndex; at < runs.length && runs[at].start < prefixEnd; at++) {
            const run = runs[at], start = Math.max(from, run.start), stop = Math.min(prefixEnd, run.end);
            prefixWidth += run.scrollable ? Math.min(run.atomicWidth!, fontSize * 8)
              : run.atomicWidth ?? widthOf(text.slice(start, stop), run.font, run.spacing);
          }
          const style = fontFor(content);
          minTruncatedWidth = Math.max(minTruncatedWidth, prefixWidth + widthOf('…', style.font, style.spacing) + markerWidth);
        }
      }
      // This optional near-fit refinement has a separate table-wide budget.
      // Only complete, single-token headers qualify. Reject huge/atomic tokens before segmentation. 41em is the largest
      // profile content cap plus the permitted 1em snap, independent of the
      // viewport; cached intrinsic measurements therefore survive resize.
      if (cell.tagName === 'TH' && omitted === 0 && from === 0 && bodyEnd === text.trimEnd().length && width > fontSize * 14 && width <= fontSize * 3 * 41 && trimmed.length <= 384 && wrapMeasurementBudget > 0 && typeof Intl.Segmenter === 'function') {
        const tokenRuns = runs.slice(runIndex).filter(run => run.start < bodyEnd);
        if (!tokenRuns.some(run => run.atomicWidth !== undefined)) {
          const ends: number[] = []; let end = from;
          for (const { segment } of (graphemes ??= new Intl.Segmenter(undefined, { granularity: 'grapheme' })).segment(trimmed)) {
            end += segment.length; ends.push(end);
            if (ends.length > 96) break;
          }
          if (ends.length > 1 && ends.length <= Math.min(96, wrapMeasurementBudget)) {
            wrapMeasurementBudget -= ends.length;
            const advances = [0]; let at = 0, completed = 0, monotone = true;
            for (const end of ends) {
              while (at < tokenRuns.length && tokenRuns[at].end <= end) {
                const run = tokenRuns[at++]; completed += widthOf(text.slice(Math.max(from, run.start), run.end), run.font, run.spacing);
              }
              const run = tokenRuns[at];
              const advance = completed + (run ? widthOf(text.slice(Math.max(from, run.start), end), run.font, run.spacing) : 0);
              if (advance < advances[advances.length - 1]) { monotone = false; break; }
              advances.push(advance);
            }
            // Unusual shaping can make prefix advances non-monotone. Skip the
            // refinement rather than manufacture a wrapping threshold.
            if (monotone) emergencyWrapWidths.push(...balancedWrapWidths(advances));
          }
        }
      }
      if (width || next.required) tokens.push({ width, space, required: next.required && end < text.length,
        ...scrollableWidth > 0 && { minWidth: Math.max(0, width - scrollableWidth) } });
      naturalWidth += width + space; from = end;
    }
    const extraWidth = omitted * (text.length ? naturalWidth / text.length : fontSize * .55);
    return { tokens, naturalWidth: naturalWidth + extraWidth, minWidth: Math.max(0, ...tokens.map(token => token.minWidth ?? token.width)), lineHeight, extraWidth, minTruncatedWidth, emergencyWrapWidths };
  }));
  const first = element.rows[0]?.cells[0], cellStyle = first && styleFor(first);
  const padding = cellStyle ? parseFloat(cellStyle.paddingLeft) + parseFloat(cellStyle.paddingRight) : fontSize * 1.25;
  return { rows, fontSize, padding, fontKey: tableFontKey(element, overflowMarker) };
}

/** At most 96 measured grapheme advances and ten linear feasibility passes per
 * line count. A total-width average misses odd counts and mixed-width glyphs. */
function balancedWrapWidths(advances: readonly number[]): number[] {
  const total = advances[advances.length - 1];
  const widest = advances.slice(1).reduce((width, advance, i) => Math.max(width, advance - advances[i]), 0);
  return [2, 3].map(target => {
    let low = Math.max(widest, total / target), high = total;
    for (let step = 0; step < 10 && high - low > .05; step++) {
      const width = (low + high) / 2; let lines = 1, start = 0;
      for (let i = 1; i < advances.length; i++) {
        if (advances[i] - advances[start] > width) { lines++; start = i - 1; }
      }
      if (lines <= target) high = width; else low = width;
    }
    return high;
  });
}
