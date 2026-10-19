/// <reference path="../vendor.d.ts" />
import LineBreaker from 'linebreak';
import Hypher from 'hypher';
import patterns from 'hyphenation.en-us';
import { prepareKnuthPlass, type KnuthPlassOptions, type LineItem, type ParagraphLayout } from '../core/knuth-plass';
import { LruCache } from '../core/cache';
import type { ReaderRuntime } from './runtime';
import { measurementRange } from './source-geometry';
import { finishTypographyLayout, observeTypographyLayout, queueTypographyLayout } from './typography-layout-state';

const hypher = new Hypher(patterns), wordWidths = new LruCache<string, number>(8192), hyphens = new LruCache<string, readonly string[]>(2048);
const plans = new LruCache<string, ParagraphLayout>(256), graphemes = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
let canvas: CanvasRenderingContext2D | null;
interface Segment { node: Text | Element; start: number; end: number; text: string; code?: Element; codeStart?: boolean; codeEnd?: boolean; math?: boolean; penalty?: number }
interface Anchor { node: Text | Element; start: number; end: number; before?: boolean; existingBreak?: boolean; wordSpacing?: number; letterSpacing?: number }
type Item = LineItem & { anchor?: Anchor };
interface MathLimit { element: HTMLElement; width: number }
interface Preparation { items: Item[]; signature: string; layout: ReturnType<typeof prepareKnuthPlass>; styles: Map<Element, string>; atomics: { element: Element; width: number; item: number; math?: boolean }[]; hasCode: boolean; splitCode: boolean }
interface Job { prepared?: Preparation; plan?: ParagraphLayout; appliedItems?: Item[]; update?: Application['update']; reflow?: Application['reflow']; element: HTMLElement; runtime: ReaderRuntime; options: KnuthPlassOptions; visible: boolean; dirty: boolean; undo?: (changed?: ReadonlySet<Node>) => void; width?: number; measuredWidth?: number; settledWidth?: number; font?: string; observer: MutationObserver; disposed: boolean }
const jobs = new Map<HTMLElement, Job>(), queue = new Set<Job>();
let frame = 0, resize: ResizeObserver | undefined, intersection: IntersectionObserver | undefined;
let listening = false;

function selected(element: HTMLElement) {
  const selection = element.ownerDocument.getSelection();
  return !!selection?.rangeCount && !selection.isCollapsed && selection.getRangeAt(0).intersectsNode(element);
}
function defer(job: Job) {
  const state = selected(job.element) ? 'wrap' : 'clip';
  if (job.element.dataset.limrKpStale !== state) job.element.dataset.limrKpStale = state;
}
function enqueue(job: Job) {
  if (job.disposed) return;
  job.dirty = true;
  if (!job.visible) return;
  queueTypographyLayout(job.runtime, job.element, true);
  queue.add(job);
  if (!frame) frame = requestAnimationFrame(flush);
}
function observe(job: Job) { job.observer.observe(job.element, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden'] }); }
function restore(job: Job, changed?: ReadonlySet<Node>) {
  job.observer.disconnect(); job.undo?.(changed); job.undo = undefined; job.update = undefined; job.reflow = undefined; job.plan = undefined; job.appliedItems = undefined;
}
function flush() {
  frame = 0;
  const end = performance.now() + 6, writes: (() => void)[] = [];
  for (const job of queue) {
    queue.delete(job);
    if (job.disposed || !job.visible || selected(job.element)) { queueTypographyLayout(job.runtime, job.element, false); continue; }
    const animations = job.element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running' && animation.effect?.getTiming().iterations !== Infinity);
    if (animations.length) { void Promise.allSettled(animations.map(animation => animation.finished)).then(() => enqueue(job)); continue; }
    const apply = prepare(job);
    writes.push(() => {
      if (job.disposed) return;
      const wasPending = job.dirty || job.settledWidth !== job.measuredWidth;
      apply?.(); job.element.removeAttribute('data-limr-kp-stale'); job.settledWidth = job.measuredWidth; job.dirty = false; queueTypographyLayout(job.runtime, job.element, false); observe(job); if (apply || wasPending) finishTypographyLayout(job.runtime);
    });
    if (performance.now() >= end) break;
  }
  // Batch reads before writes so paragraph measurements share a layout pass.
  for (const write of writes) write();
  if (queue.size) frame = requestAnimationFrame(flush);
}
function initialize() {
  if (listening) return;
  listening = true;
  resize = new ResizeObserver(entries => {
    const narrower: Job[] = [];
    for (const entry of entries) {
      const job = jobs.get(entry.target as HTMLElement);
      if (job) {
        const font = fontKey(getComputedStyle(job.element));
        if (job.undo && entry.contentRect.width < (job.width ?? entry.contentRect.width) && (!job.visible || selected(job.element))) narrower.push(job);
        if (job.width !== entry.contentRect.width || font !== job.font) { job.width = entry.contentRect.width; job.font = font; enqueue(job); }
      }
    }
    // Keep cached/offscreen DOM and active native ranges intact on shrink. Clip
    // only stale horizontal paint offscreen; rewrapping every cached paragraph
    // would duplicate native layout before its exact plan is needed. Selected
    // paragraphs may wrap without changing their live Range's text nodes.
    // Visible unselected jobs already have priority in the next frame: avoid a
    // second native-wrap layout immediately before applying their exact plan.
    // Write after all font reads to avoid repeatedly flushing styles in the loop.
    for (const job of narrower) defer(job);
  });
  intersection = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const job = jobs.get(entry.target as HTMLElement);
      if (!job) continue;
      job.visible = entry.isIntersecting;
      if (!job.visible) queueTypographyLayout(job.runtime, job.element, false);
      if (job.visible && (job.dirty || !job.undo)) enqueue(job);
      // Earlier paragraphs can change height before this job runs, moving it
      // out of the queue's visible region after ResizeObserver saw it inside.
      else if (!job.visible && job.dirty && job.undo) defer(job);
    }
  }, { rootMargin: '600px' });
  document.addEventListener('selectionchange', selectionChanged);
  document.fonts.addEventListener('loadingdone', fontsChanged);
}
function selectionChanged() { for (const job of jobs.values()) if ((job.dirty || !job.undo) && !selected(job.element)) enqueue(job); }
function fontsChanged() { wordWidths.clear(); plans.clear(); for (const job of jobs.values()) { job.prepared = undefined; enqueue(job); } }

/** Registers stable paragraphs only. Original nodes are restored before React
 * commits an update, keeping source bindings, controls and React ownership. */
export function typeset(root: HTMLElement, runtime: ReaderRuntime, options: KnuthPlassOptions = {}): () => void {
  initialize();
  const elements = [root, ...root.querySelectorAll<HTMLElement>('p,.limr-paragraph,li')].filter(element => element.matches('p,.limr-paragraph,li') && !element.closest('pre,[data-limr-ignore]') && !element.querySelector('p,ul,ol,blockquote,aside,[data-limr-atomic="block"]'));
  const owned: Job[] = [];
  for (const element of elements) {
    if (jobs.has(element)) continue;
    const job: Job = { element, runtime, options, visible: false, dirty: true, disposed: false, observer: new MutationObserver(records => {
      // Highlight paint is out of flow and does not change typography. Including
      // it creates a reflow -> paint -> reflow loop, especially while scrolling.
      const relevant = records.filter(record => {
        const target = record.target instanceof Element ? record.target : record.target.parentElement;
        if (target?.closest('.limr-highlight-layer,.limr-paint-layer')) return false;
        return record.type !== 'childList' || ![...record.addedNodes, ...record.removedNodes].every(node => node instanceof Element && node.matches('.limr-highlight-layer,.limr-paint-layer'));
      });
      if (!relevant.length) return;
      job.prepared = undefined;
      restore(job, new Set(relevant.filter(record => record.type === 'characterData').map(record => record.target)));
      observe(job); enqueue(job);
    }) };
    observeTypographyLayout(element, () => {
      // Active native selections intentionally keep their current DOM/native
      // wrapping. No typesetting is scheduled until the selection is released.
      if (job.disposed || selected(element)) return false;
      if (job.dirty || job.settledWidth === undefined) return true;
      const style = getComputedStyle(element);
      return Math.abs(job.settledWidth - (element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight))) > .5;
    });
    // The first IntersectionObserver delivery decides whether this new job is
    // visible. Until then it can still affect an already requested neighbour.
    queueTypographyLayout(runtime, element, true);
    owned.push(job); jobs.set(element, job); resize!.observe(element); intersection!.observe(element); observe(job);
  }
  return () => {
    for (const job of owned) { job.disposed = true; observeTypographyLayout(job.element); queueTypographyLayout(job.runtime, job.element, false); queue.delete(job); restore(job); resize!.unobserve(job.element); intersection!.unobserve(job.element); jobs.delete(job.element); }
    if (!jobs.size) {
      resize?.disconnect(); intersection?.disconnect(); cancelAnimationFrame(frame); frame = 0;
      document.removeEventListener('selectionchange', selectionChanged); document.fonts.removeEventListener('loadingdone', fontsChanged); listening = false;
    }
  };
}

function collect(element: HTMLElement): Segment[] {
  const segments: Segment[] = []; let offset = 0;
  function visit(node: Node, code?: Element) {
    if (node instanceof Text) {
      const text = node.data; if (text) { segments.push({ node, start: offset, end: offset + text.length, text, code }); offset += text.length; }
    } else if (node instanceof Element) {
      const style = getComputedStyle(node);
      if (node.hasAttribute('hidden') || node.matches('.limr-highlight-layer,.limr-paint-layer') || style.display === 'none' || style.position === 'absolute' || style.position === 'fixed') return;
      // KaTeX has already resolved TeX's outer-level operators, grouping and
      // explicit allowbreak/nobreak. Keep its indivisible bases and MathML intact.
      const math = node.matches('[data-limr-atomic="inline"]') ? node.querySelector(':scope > .limr-math-inline > .katex > .katex-html') : null;
      if (math?.children.length && [...math.children].every(child => child.matches('.katex-base,.katex-newline'))) {
        for (const child of math.children) {
          const newline = child.classList.contains('katex-newline');
          const operator = [...child.children].filter(child => !child.matches('.katex-strut,.mspace')).at(-1);
          // Plain TeX's relation/binary-operation penalties prefer prose breaks.
          const penalty = child.querySelector(':scope > .allowbreak') ? 0 : operator?.classList.contains('mrel') ? 500 : 700;
          segments.push({ node: child, start: offset, end: ++offset, text: newline ? '\u2028' : '\ufffc', math: true, penalty: child.nextElementSibling?.classList.contains('katex-base') ? penalty : undefined });
        }
      } else if (node.tagName === 'CODE' && !node.matches('[data-limr-atomic],[data-limr-ignore]')) {
        const start = segments.length;
        node.childNodes.forEach(child => visit(child, node));
        const content = segments.slice(start).filter(segment => segment.code === node);
        if (content.length) { content[0].codeStart = true; content.at(-1)!.codeEnd = true; }
      } else if (node.tagName === 'BR' || node.matches('[data-limr-atomic], [data-limr-ignore], img, svg, button, input')) {
        segments.push({ node, start: offset, end: ++offset, text: node.tagName === 'BR' ? '\u2028' : '\ufffc' });
      } else node.childNodes.forEach(child => visit(child, code));
    }
  }
  element.childNodes.forEach(child => visit(child));
  return segments;
}
function fontKey(style: CSSStyleDeclaration) {
  // The font shorthand may be empty with explicit kerning/variant settings.
  return [style.fontFamily, style.fontSize, style.fontWeight, style.fontStyle, style.fontStretch, style.fontVariantLigatures, style.fontFeatureSettings, style.fontVariationSettings, style.letterSpacing, style.wordSpacing, style.textTransform, style.fontKerning, style.getPropertyValue('text-spacing-trim')].join('|');
}
function itemize(element: HTMLElement, options: KnuthPlassOptions, splitCode = false): Preparation | undefined {
  const segments = collect(element), text = segments.map(segment => segment.text).join('');
  const segmentStarts = new Map(segments.map(segment => [segment.start, segment]));
  if (!text.trim()) return;
  const breaks = new Map<number, { required?: boolean; hyphen?: boolean; automatic?: boolean }>();
  const breaker = new LineBreaker(text);
  for (let next = breaker.nextBreak(); next; next = breaker.nextBreak()) if (next.position < text.length) breaks.set(next.position, { required: next.required });
  let wordSegment = 0;
  if (options.hyphenate !== false) for (const word of text.matchAll(/[a-zA-Z]{5,}/g)) {
    while (segments[wordSegment].end <= word.index!) wordSegment++;
    let until = wordSegment;
    while (segments[until].end < word.index! + word[0].length) until++;
    if (segments.slice(wordSegment, until + 1).some(segment => segment.code)) continue;
    let pieces = options.hyphenate ? options.hyphenate(word[0]) : hyphens.get(word[0]);
    if (!pieces) { pieces = hypher.hyphenate(word[0]); hyphens.set(word[0], pieces); }
    if (pieces.join('') !== word[0]) continue;
    let at = word.index!;
    for (const piece of pieces.slice(0, -1)) { at += piece.length; if (!breaks.has(at)) breaks.set(at, { hyphen: true, automatic: true }); }
  }
  const atomics: Preparation['atomics'] = [], styles = new Map<Element, string>();
  const items: Item[] = [], styleCache = new Map<Element, { key: string; space: number; hyphen: number; em: number; wordSpacing: number; letterSpacing: number }>();
  const range = measurementRange(element.ownerDocument);
  function metrics(parent: Element) {
    let found = styleCache.get(parent); if (found) return found;
    const style = getComputedStyle(parent), font = style.font || `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    canvas ??= document.createElement('canvas').getContext('2d');
    canvas!.font = font;
    const spacing = parseFloat(style.letterSpacing) || 0;
    const wordSpacing = parseFloat(style.wordSpacing) || 0;
    found = { key: fontKey(style), space: canvas!.measureText(' ').width + spacing + wordSpacing, hyphen: canvas!.measureText('-').width + spacing, em: parseFloat(style.fontSize), wordSpacing, letterSpacing: spacing };
    styleCache.set(parent, found); return found;
  }
  function measure(node: Text, from: number, to: number, key: string) {
    const text = node.data.slice(from, to), cacheKey = `${key}\0${text}`;
    const cached = wordWidths.get(cacheKey); if (cached !== undefined) return cached;
    range.setStart(node, from); range.setEnd(node, to);
    const measured = [...range.getClientRects()].reduce((sum, rect) => sum + rect.width, 0);
    wordWidths.set(cacheKey, measured); return measured;
  }
  for (const segment of segments) {
    const { node } = segment;
    if (!(node instanceof Text)) {
      if (segment.text === '\u2028') items.push({ type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true }, { type: 'penalty', width: 0, penalty: -10000, anchor: { node, start: 0, end: 0, existingBreak: true } });
      else {
        // A wrapping inline's bounding box is a union, not its natural advance.
        const width = [...node.getClientRects()].reduce((sum, rect) => sum + rect.width, 0);
        atomics.push({ element: node, width, item: items.length, math: segment.math }); items.push({ type: 'box', width });
        if (segment.math) styles.set(node, fontKey(getComputedStyle(node)));
        const next = segmentStarts.get(segment.end);
        if (segment.penalty !== undefined || breaks.has(segment.end) && !/[ \t\r\n\f\u2028]/.test(text[segment.end] ?? '') && !(next?.node instanceof Element && next.node.hasAttribute('data-limr-ignore'))) {
          items.push({ type: 'penalty', width: 0, penalty: segment.penalty ?? 0, anchor: { node, start: 0, end: 0 } });
        }
      }
      continue;
    }
    const style = metrics(node.parentElement!);
    const codeStyle = segment.code ? getComputedStyle(segment.code) : undefined;
    if (segment.codeStart && codeStyle) items.push({ type: 'box', width: (parseFloat(codeStyle.paddingLeft) || 0) + (parseFloat(codeStyle.borderLeftWidth) || 0) });
    const points = new Set([0, segment.text.length]);
    if (segment.code && splitCode) {
      // Code is never linguistically hyphenated. Only chosen breaks produce DOM;
      // identifiers may split at grapheme boundaries without inserting text.
      for (const { index, segment: value } of graphemes.segment(segment.text)) points.add(index + value.length);
    } else for (const at of breaks.keys()) if (at > segment.start && at <= segment.end) points.add(at - segment.start);
    for (const space of segment.text.matchAll(/[ \t\r\n\f]+/g)) { points.add(space.index!); points.add(space.index! + space[0].length); }
    const sorted = [...points].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      const start = sorted[i - 1], end = sorted[i], value = segment.text.slice(start, end);
      const anchor = { node, start, end, wordSpacing: style.wordSpacing, letterSpacing: style.letterSpacing };
      if (/^[ \t\r\n\f]+$/.test(value)) {
        const preceding = items.at(-1);
        const space = preceding?.type === 'glue' ? 0 : style.space;
        items.push({ type: 'glue', width: space, stretch: segment.code ? 0 : space / 2, shrink: segment.code ? 0 : space / 3, anchor });
      } else {
        items.push({ type: 'box', width: measure(node, start, end, style.key) });
        const point = segment.start + end, opportunity = breaks.get(point);
        // An annotation marker belongs to the preceding word/atomic object.
        const next = segmentStarts.get(point);
        if (segment.code) {
          if ((end < segment.text.length || !segment.codeEnd) && !/[ \t\r\n\f]/.test(text[point] ?? '') && !(next?.node instanceof Element && next.node.hasAttribute('data-limr-ignore'))) items.push({ type: 'penalty', width: 0, penalty: opportunity && !opportunity.hyphen ? 100 : 1000, automatic: !opportunity || opportunity.hyphen, anchor: { node, start: end, end } });
        } else if (opportunity && !(next?.node instanceof Element && next.node.hasAttribute('data-limr-ignore'))) {
          const at = { node, start: end, end, letterSpacing: style.letterSpacing };
          if (opportunity.hyphen) items.push({ type: 'penalty', width: style.hyphen, penalty: options.hyphenPenalty ?? 50, flagged: true, automatic: opportunity.automatic, anchor: at });
          else if (opportunity.required) items.push({ type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true }, { type: 'penalty', width: 0, penalty: -10000, anchor: at });
          else if (!/[ \t\r\n\f]/.test(text[point] ?? '')) items.push({ type: 'glue', width: 0, stretch: style.em * .15, shrink: 0, anchor: at });
        }
      }
    }
    if (segment.codeEnd && codeStyle) {
      items.push({ type: 'box', width: (parseFloat(codeStyle.paddingRight) || 0) + (parseFloat(codeStyle.borderRightWidth) || 0) });
      const next = segmentStarts.get(segment.end);
      if (breaks.has(segment.end) && !/[ \t\r\n\f]/.test(text[segment.end] ?? '') && !(next?.node instanceof Element && next.node.hasAttribute('data-limr-ignore'))) items.push({ type: 'penalty', width: 0, penalty: 0, anchor: { node: segment.code!, start: 0, end: 0 } });
    }
  }
  items.push({ type: 'penalty', width: 0, penalty: 10000 }, { type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true }, { type: 'penalty', width: 0, penalty: -10000 });
  for (const [element, style] of styleCache) styles.set(element, style.key);
  return { items, atomics, layout: prepareKnuthPlass(items), styles, hasCode: segments.some(segment => segment.code), splitCode, signature: JSON.stringify([options, items.map(({ anchor: _anchor, ...item }) => item), atomics.filter(atomic => atomic.math).map(atomic => atomic.item)]) };
}
function prepare(job: Job): (() => void) | undefined {
  const { element, options } = job, base = getComputedStyle(element);
  const width = element.clientWidth - parseFloat(base.paddingLeft) - parseFloat(base.paddingRight);
  if (width <= 0) return;
  job.measuredWidth = width;
  if (job.prepared && ([...job.prepared.styles].some(([element, key]) => !element.isConnected || fontKey(getComputedStyle(element)) !== key) || job.prepared.atomics.some(({ element, width }) => Math.abs([...element.getClientRects()].reduce((sum, rect) => sum + rect.width, 0) - (element instanceof HTMLElement && element.hasAttribute('data-limr-kp-scroll') ? Math.min(width, parseFloat(element.style.maxWidth)) : width)) > .1))) job.prepared = undefined;
  if (!job.prepared) { restore(job); job.prepared = itemize(element, options); }
  const prepared = job.prepared; if (!prepared) return;
  let items = prepared.items;
  const indent = (parseFloat(base.textIndent) || 0) * (base.textIndent.endsWith('%') ? width / 100 : 1);
  const lengths = indent ? [width - indent, width] : width;
  const limits: MathLimit[] = [];
  const fitted = new Map<number, Item[]>();
  for (const atomic of prepared.atomics) if (atomic.math && atomic.element instanceof HTMLElement) {
    // An indivisible fraction/group wider than a whole line gets its own scroll
    // surface. Reserve inseparable trailing punctuation and the first-line indent.
    let tail = 0;
    for (let i = atomic.item + 1; i < items.length && items[i].type === 'box'; i++) tail += items[i].width;
    const limit = Math.max(1, width - Math.max(0, indent) - tail);
    if (atomic.width > limit) {
      limits.push({ element: atomic.element, width: limit });
      const before: Item[] = items.slice(0, atomic.item).some(item => item.type === 'box' && item.width > 0) ? [
        { type: 'glue', width: 0, stretch: 1, shrink: 0, infinite: true },
        { type: 'penalty', width: 0, penalty: -10000, anchor: { node: atomic.element, start: 0, end: 0, before: true } },
      ] : [];
      fitted.set(atomic.item, [...before, { ...items[atomic.item], width: limit }]);
    }
  }
  if (fitted.size) items = items.flatMap((item, i) => fitted.get(i) ?? [item]);
  // Browser prose contains non-breaking controls and mixed font runs. Allow a
  // TeX emergency stretch of three em before its artificial overfull fallback;
  // it influences break scoring only, never the visible glue calculation.
  const emergencyStretch = options.emergencyStretch ?? parseFloat(base.fontSize) * 3;
  const signature = `${width}:${indent}:${emergencyStretch}:${prepared.signature}`;
  let plan = plans.get(signature);
  if (!plan) { plan = (fitted.size ? prepareKnuthPlass(items) : prepared.layout)(lengths, { ...options, emergencyStretch }); plans.set(signature, plan); }
  if (!plan.lines.length) return;
  // Keep ordinary code tokens cheap and intact. Only a genuinely overfull plan
  // needs the extra grapheme-level discretionary breaks, cached for later resizes.
  if (prepared.hasCode && !prepared.splitCode && plan.lines.some((line, index) => {
    let advance = items[line.index].type === 'penalty' ? items[line.index].width : 0;
    for (let i = line.start; i < line.index; i++) {
      const item = items[i];
      if (item.type === 'box') advance += item.width;
      else if (item.type === 'glue') advance += Math.max(0, item.width + line.ratio * (line.ratio < 0 ? item.shrink : item.stretch));
    }
    return advance > width - (index === 0 ? indent : 0) + .5;
  })) {
    restore(job); job.prepared = itemize(element, options, true); return prepare(job);
  }
  if (job.settledWidth === width && job.plan?.lines.length === plan.lines.length && job.plan.lines.every((line, index) => line.index === plan!.lines[index].index && line.ratio === plan!.lines[index].ratio)) return;
  if (job.update && job.appliedItems === items && job.plan?.lines.length === plan.lines.length && job.plan.lines.every((line, index) => line.index === plan!.lines[index].index)) {
    // A width change often changes glue without changing any break. Keep text,
    // ranges and paint bindings in place and only update the actual glue widths.
    return () => { job.observer.disconnect(); job.update!(plan!, limits); job.plan = plan; };
  }
  return () => {
    job.observer.disconnect();
    // Scroll constraints can insert forced boundaries, changing the item array.
    const applied = job.reflow ? job.reflow(plan!, limits, items) : apply(element, items, plan!, limits);
    job.undo = applied.undo; job.update = applied.update; job.reflow = applied.reflow; job.plan = plan; job.appliedItems = items;
  };
}

interface Insertion { start: number; end: number; width?: number; spacing?: number; letterSpacing?: number; measure?: (plan: ParagraphLayout) => number; break?: boolean; hyphen?: boolean }
interface Original { node: Text; value: string; shell: HTMLSpanElement }
interface Application { undo: (changed?: ReadonlySet<Node>) => void; update: (plan: ParagraphLayout, limits: MathLimit[]) => void; reflow: (plan: ParagraphLayout, limits: MathLimit[], items: Item[]) => Application }
function apply(element: HTMLElement, items: Item[], plan: ParagraphLayout, limits: MathLimit[], previous: Original[] = []): Application {
  const saved = new Map(previous.map(original => [original.node, original]));
  const insertions = new Map<Text, Insertion[]>();
  const patches: ((plan: ParagraphLayout) => void)[] = [];
  const breaks: HTMLElement[] = [];
  let restoreLimits: (() => void)[] = [];
  const constrain = (limits: MathLimit[]) => {
    for (const restore of restoreLimits) restore();
    restoreLimits = limits.map(({ element, width }) => {
      const value = element.style.getPropertyValue('max-width'), priority = element.style.getPropertyPriority('max-width'), hadStyle = element.hasAttribute('style');
      element.dataset.limrKpScroll = ''; element.style.maxWidth = `${width}px`;
      return () => { delete element.dataset.limrKpScroll; if (value) element.style.setProperty('max-width', value, priority); else element.style.removeProperty('max-width'); if (!hadStyle && !element.style.cssText) element.removeAttribute('style'); };
    });
  };
  constrain(limits);
  const add = (anchor: Anchor | undefined, insertion: Omit<Insertion, 'start' | 'end'>) => {
    if (anchor?.node instanceof Text) insertions.set(anchor.node, [...insertions.get(anchor.node) ?? [], { start: anchor.start, end: anchor.end, ...insertion }]);
    else if (anchor?.node instanceof Element && insertion.break) {
      const br = document.createElement('br'); br.dataset.limrIgnore = 'true'; if (anchor.before) anchor.node.before(br); else anchor.node.after(br); breaks.push(br);
    }
  };
  let line = 0;
  for (let i = 0; i < items.length; i++) {
    while (line < plan.lines.length - 1 && i > plan.lines[line].index) line++;
    const current = plan.lines[line], item = items[i], last = line === plan.lines.length - 1;
    if (item.type === 'glue' && item.anchor) {
      const boundary = i <= current.start || i === current.index;
      const lineIndex = line;
      const measure = (next: ParagraphLayout) => {
        const ratio = next.lines[lineIndex].ratio;
        return boundary ? 0 : Math.max(0, item.width + ratio * (ratio < 0 ? item.shrink : item.stretch));
      };
      const width = measure(plan);
      const spacing = !boundary && item.width > 0 && item.anchor.end > item.anchor.start ? (item.anchor.wordSpacing ?? 0) + width - item.width : undefined;
      if (width || item.anchor.end !== item.anchor.start || i === current.index || item.stretch) add(item.anchor, { width, spacing, letterSpacing: item.anchor.letterSpacing, measure: spacing === undefined ? measure : next => (item.anchor!.wordSpacing ?? 0) + measure(next) - item.width, break: !last && i === current.index });
    } else if (item.type === 'penalty' && i === current.index && !last && !item.anchor?.existingBreak) add(item.anchor, { break: true, hyphen: !!item.width });
  }
  const originals: Original[] = [];
  for (const [node, changes] of insertions) {
    const old = saved.get(node), value = old?.value ?? node.data, fragment = document.createDocumentFragment();
    let at = 0, group: Insertion[] = [];
    const flush = (end: number) => {
      const regular = group.find(change => change.spacing !== undefined), spacing = regular?.spacing;
      const append = (end: number) => {
        if (end <= at) return;
        const text = document.createTextNode(value.slice(at, end));
        // One word-spacing run per line has exactly the same TeX glue widths as
        // a span per space. It greatly reduces DOM, range and paint work without
        // changing the computed breaks, shaping or original source characters.
        if (spacing !== undefined && /\s/.test(text.data)) {
          const run = document.createElement('span'); run.dataset.limrKpRun = ''; run.style.wordSpacing = `${spacing}px`; run.append(text); fragment.append(run);
          patches.push(next => { run.style.wordSpacing = `${regular!.measure!(next)}px`; });
        } else fragment.append(text);
        at = end;
      };
      for (let index = 0; index < group.length; index++) {
        const change = group[index];
        if (change.spacing !== undefined && change.spacing === spacing) continue;
        // A CJK run has an equal TeX glue after each individual ideograph.
        // CSS letter spacing represents those same gaps without a DOM element
        // for every boundary. Only complete single-codepoint ideographs qualify;
        // punctuation, combined clusters, mixed-script shaping and real spaces
        // keep the original glue representation.
        if (change.width !== undefined && change.start === change.end && !change.break && !change.hyphen) {
          const begin = change.start - 1;
          if (begin >= at && /^[\u3400-\u9fff\u3041-\u3096\u30a1-\u30fa\uac00-\ud7a3]$/u.test(value.slice(begin, change.start))) {
            let last = index;
            while (last + 1 < group.length) {
              const next = group[last + 1];
              if (next.spacing !== undefined || next.width !== change.width || next.letterSpacing !== change.letterSpacing || next.start !== next.end || next.break || next.hyphen || next.start !== group[last].end + 1 || !/^[\u3400-\u9fff\u3041-\u3096\u30a1-\u30fa\uac00-\ud7a3]$/u.test(value.slice(group[last].end, next.start))) break;
              last++;
            }
            if (last > index) {
              append(begin);
              const run = document.createElement('span'); run.dataset.limrKpCjk = '';
              run.style.letterSpacing = `${(change.letterSpacing ?? 0) + change.width}px`;
              run.textContent = value.slice(begin, group[last].end); fragment.append(run);
              if (change.measure) patches.push(next => { run.style.letterSpacing = `${(change.letterSpacing ?? 0) + change.measure!(next)}px`; });
              at = group[last].end; index = last; continue;
            }
          }
        }
        append(change.start);
        if (change.width !== undefined) {
          const glue = document.createElement('span'); glue.className = 'limr-kp-glue'; glue.style.width = `${change.width}px`; glue.textContent = value.slice(change.start, change.end); fragment.append(glue);
          if (change.measure) patches.push(next => { glue.style.width = `${change.measure!(next)}px`; });
        }
        if (change.hyphen) { const hyphen = document.createElement('span'); hyphen.className = 'limr-kp-hyphen'; hyphen.dataset.limrIgnore = 'true'; hyphen.setAttribute('aria-hidden', 'true'); fragment.append(hyphen); }
        if (change.break) { const br = document.createElement('br'); br.dataset.limrIgnore = 'true'; fragment.append(br); }
        at = change.end;
      }
      append(end); group = [];
    };
    for (const change of changes.sort((a, b) => a.start - b.start)) { group.push(change); if (change.break) flush(change.end); }
    flush(value.length);
    const shell = old?.shell ?? document.createElement('span'); shell.dataset.limrKpText = '';
    shell.replaceChildren(fragment);
    // Keep React's original Text node at its exact parent/index for restoration.
    // One disposable root per original text also makes resize restoration one
    // subtree removal, not hundreds of live-Range updates for individual nodes.
    if (!old) { node.data = ''; node.after(shell); }
    originals.push({ node, value, shell }); saved.delete(node);
  }
  for (const { node, value, shell } of saved.values()) { node.data = value; shell.remove(); }
  element.dataset.limrKp = plan.pass;
  element.dataset.limrKpLines = String(plan.lines.length);
  const undo = (changed?: ReadonlySet<Node>) => {
    const selection = element.ownerDocument.getSelection();
    const position = (node: Node | null, offset: number) => {
      if (!node || !element.contains(node)) return;
      const range = measurementRange(element.ownerDocument); range.selectNodeContents(element); range.setEnd(node, offset); return range.toString().length;
    };
    const anchor = selection?.anchorNode, focus = selection?.focusNode, anchorOffset = selection?.anchorOffset ?? 0, focusOffset = selection?.focusOffset ?? 0;
    const from = position(anchor ?? null, anchorOffset), to = position(focus ?? null, focusOffset);
    for (const br of breaks) br.remove();
    constrain([]);
    for (const { node, value, shell } of originals) { if (!changed?.has(node)) node.data = value; shell.remove(); }
    delete element.dataset.limrKp; delete element.dataset.limrKpLines; delete element.dataset.limrKpStale;
    if (selection && (from !== undefined || to !== undefined)) {
      const locate = (offset: number): [Node, number] => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT); let tail: Text | undefined;
        for (let text = walker.nextNode() as Text | null; text; text = walker.nextNode() as Text | null) { tail = text; if (offset <= text.length) return [text, offset]; offset -= text.length; }
        return tail ? [tail, tail.length] : [element, 0];
      };
      const start = from === undefined ? [anchor!, anchorOffset] as const : locate(from), end = to === undefined ? [focus!, focusOffset] as const : locate(to);
      if (start[0]?.isConnected && end[0]?.isConnected) selection.setBaseAndExtent(start[0], start[1], end[0], end[1]);
    }
  };
  return { undo, update(next, limits) { constrain(limits); for (const patch of patches) patch(next); element.dataset.limrKp = next.pass; }, reflow(next, limits, items) { for (const br of breaks) br.remove(); constrain([]); return apply(element, items, next, limits, originals); } };
}
