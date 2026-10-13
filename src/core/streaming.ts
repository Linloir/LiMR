import type { MarkdownNode } from './types';
import { sourcePoint, walk } from './tree';
import { decodeString } from 'micromark-util-decode-string';

interface Edit { at: number; insert: string; order?: number }
interface Region { start: number; end: number }
interface Container { start: number; marker: number; size: number; depth: number; close?: number; end?: number; leaf?: boolean; content?: number; prefix?: string }
export interface PreparedSource {
  value: string;
  original: (offset: number) => number;
  incomplete: ReadonlySet<number>;
  recoveryOffset?: number;
  hidden?: { start: number; name?: string };
}

/** Only parser input is adapted. All public offsets still address the original
 * string. Insertions use a sparse map, not one allocation per source character. */
function insertions(source: string, edits: Edit[]) {
  edits.sort((a, b) => a.at - b.at || (a.order ?? 0) - (b.order ?? 0));
  const parts: string[] = [], points: { from: number; to: number; at: number; delta: number }[] = [];
  let at = 0, delta = 0;
  for (const edit of edits) {
    parts.push(source.slice(at, edit.at), edit.insert);
    points.push({ from: edit.at + delta, to: edit.at + delta + edit.insert.length, at: edit.at, delta: delta + edit.insert.length });
    at = edit.at; delta += edit.insert.length;
  }
  parts.push(source.slice(at));
  return {
    value: parts.join(''),
    original(offset: number) {
      let lo = 0, hi = points.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (points[mid].from <= offset) lo = mid + 1; else hi = mid; }
      const point = points[lo - 1];
      return Math.min(source.length, point ? offset < point.to ? point.at : offset - point.delta : offset);
    },
  };
}

/** Adapt CoMark's two-colon containers to the existing directive tokenizer.
 * Paired containers may nest with the same fence length. Unpaired two-colon
 * lines in a finished document retain the legacy leaf-directive meaning. */
export function prepareSource(source: string, names: ReadonlySet<string>, tags: ReadonlySet<string>, streaming: boolean, literals: ReadonlySet<string> = new Set()): PreparedSource {
  if ((!streaming && (!names.size || !source.includes('::'))) || !/[<:`~$]/.test(source)) return { value: source, original: at => at, incomplete: new Set() };
  const edits: Edit[] = [], protectedRegions: Region[] = [];
  const incomplete = new Set<number>();
  const containers: Container[] = [], stack: Container[] = [];
  let fence: { start: number; marker: string; size: number } | undefined;
  let hidden: PreparedSource['hidden'];
  let literal: Container | undefined;
  let maxDepth = 0;
  // Lists and block quotes keep their prefixes; inserted colons never move the
  // AST out of its Markdown parent. Indented code remains literal.
  const lines = /[^\r\n]*(?:\r\n|\r|\n|$)/g;
  for (const match of source.matchAll(lines)) {
    if (!match[0]) continue;
    const line = match[0].replace(/[\r\n]+$/, ''), at = match.index!;
    const prefix = /^(?: {0,3}>[ \t]?)*(?: {0,3}(?:[-+*]|\d+[.)])[ \t]+)? {0,3}/.exec(line)![0];
    const body = line.slice(prefix.length), start = at + prefix.length;
    if (literal && !/^:{2,}[ \t]*$/.test(body)) continue;
    if (literal) { protectedRegions.push({ start: literal.content!, end: at }); literal = undefined; }
    if (fence) {
      if (new RegExp(`^${fence.marker}{${fence.size},}[ \\t]*$`).test(body)) {
        protectedRegions.push({ start: fence.start, end: at + match[0].length }); fence = undefined;
      }
      continue;
    }
    const openingFence = /^(`{3,}|~{3,}|\${2,})(.*)$/.exec(body);
    if (openingFence && !(openingFence[1][0] === '`' && openingFence[2].includes('`'))) {
      fence = { start, marker: openingFence[1][0] === '$' ? '\\$' : openingFence[1][0], size: openingFence[1].length };
      if (streaming && !/[\r\n]$/.test(match[0])) hidden = { start };
      continue;
    }
    // Four-space code is never component syntax.
    if (/^[ \t]/.test(body)) { protectedRegions.push({ start: at, end: at + match[0].length }); continue; }
    const open = /^(:{2,})([a-zA-Z][\w-]*)(.*)$/.exec(body);
    if (open && names.has(open[2])) {
      const rest = open[3].trim();
      const validHeader = /^(?:\[(?:\\.|[^\]])*\])?(?:\{(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^{}"'])*\})?$/.test(rest);
      if (!validHeader) {
        if (streaming && at + match[0].length === source.length) hidden = { start, name: open[2] };
        continue;
      }
      const item: Container = { start, marker: start, size: open[1].length, depth: stack.length };
      containers.push(item); stack.push(item); maxDepth = Math.max(maxDepth, item.depth);
      if (literals.has(open[2]) && /[\r\n]$/.test(match[0])) { item.content = at + match[0].length; item.prefix = prefix.replace(/[-+*]|\d+[.)]/g, value => ' '.repeat(value.length)); literal = item; }
      continue;
    }
    const closing = /^(:{2,})[ \t]*$/.exec(body);
    if (closing && stack.length) {
      if (closing[1].length > 2) {
        let ancestor = -1;
        for (let index = stack.length - 1; index >= 0; index--) if (stack[index].size > 2 && stack[index].size <= closing[1].length) { ancestor = index; break; }
        if (ancestor >= 0) for (const leaf of stack.splice(ancestor + 1)) leaf.leaf = true;
      }
      const item = stack[stack.length - 1];
      if (closing[1].length >= item.size) { item.close = start; item.end = at + line.length; stack.pop(); }
    } else if (streaming && /^::[\w-]*$/.test(body) && at + match[0].length === source.length) hidden = { start };
  }
  if (fence) {
    protectedRegions.push({ start: fence.start, end: source.length });
    if (streaming) incomplete.add(fence.start);
  }
  if (literal) protectedRegions.push({ start: literal.content!, end: source.length });
  const active = containers.filter(item => !item.leaf && (item.close !== undefined || streaming));
  // The outer fence must be longer than its children for mdast directives.
  // Existing standalone ::: syntax is left byte-for-byte intact.
  const hasDouble = active.some(item => item.size === 2);
  const maxSize = Math.max(3, ...active.map(value => value.size));
  if (hasDouble) for (const item of active) {
    const width = maxSize + maxDepth - item.depth;
    if (width > item.size) edits.push({ at: item.marker, insert: ':'.repeat(width - item.size) });
    if (item.close !== undefined) {
      const size = /^:+/.exec(source.slice(item.close))![0].length;
      if (width > size) edits.push({ at: item.close, insert: ':'.repeat(width - size) });
    }
  }
  for (const item of active) if (item.content !== undefined) {
    const payload = source.slice(item.content, item.close ?? source.length);
    const fence = '~'.repeat(Math.max(3, ...[...payload.matchAll(/~+/g)].map(match => match[0].length + 1)));
    edits.push({ at: item.content, insert: `${item.prefix}${fence}\n`, order: -2 });
    if (item.close !== undefined) edits.push({ at: item.close, insert: `${fence}\n${item.prefix}`, order: -1 });
  }
  if (streaming) for (const item of stack) incomplete.add(item.start);

  // Balance registered JSX in parser input only. A half header is withheld;
  // complete open tags retain their identity and can show a module-owned state.
  const openTags: { name: string; start: number; block: boolean }[] = [];
  if (streaming && tags.size && source.includes('<')) {
    let region = 0, codeTicks = 0, codeStart = 0;
    for (let i = 0; i < (hidden?.start ?? source.length); i++) {
      while (protectedRegions[region] && protectedRegions[region].end <= i) region++;
      if (protectedRegions[region]?.start <= i) { i = protectedRegions[region].end - 1; continue; }
      if (source[i] === '\\') { i++; continue; }
      if (!codeTicks && names.has('math') && source[i] === '$') {
        const size = /^\$+/.exec(source.slice(i))![0].length;
        const close = source.indexOf('$'.repeat(size), i + size);
        if (close < 0) { hidden = { start: i }; break; }
        i = close + size - 1;
        continue;
      }
      if (source[i] === '`') {
        const size = /^`+/.exec(source.slice(i))![0].length;
        if (!codeTicks) { codeTicks = size; codeStart = i; } else if (codeTicks === size) codeTicks = 0;
        i += size - 1; continue;
      }
      if (codeTicks || source[i] !== '<') continue;
      const head = /^<(\/?)([a-zA-Z][\w-]*)/.exec(source.slice(i));
      if (!head) {
        if (/^<\/?$/.test(source.slice(i))) hidden = { start: i };
        continue;
      }
      const name = head[2];
      if (!tags.has(name)) {
        if ([...tags].some(tag => tag.startsWith(name)) && i + head[0].length === source.length) hidden = { start: i };
        continue;
      }
      let end = i + head[0].length, quote = '';
      for (; end < source.length; end++) {
        const char = source[end];
        if (quote) { if (char === quote) quote = ''; }
        else if (char === '"' || char === "'") quote = char;
        else if (char === '>') break;
      }
      if (end === source.length) { hidden = { start: i, name: head[1] ? undefined : name }; break; }
      if (head[1]) { if (openTags.at(-1)?.name === name) openTags.pop(); }
      else if (source[end - 1] !== '/') openTags.push({ name, start: i, block: /^(?: {0,3}> ?)*\s*$/.test(source.slice(source.lastIndexOf('\n', i - 1) + 1, i)) && /^[ \t]*(?:\r?\n|$)/.test(source.slice(end + 1)) });
      i = end;
    }
    if (codeTicks) hidden = { start: Math.min(codeStart, hidden?.start ?? source.length) };
  }
  for (const tag of openTags) incomplete.add(tag.start);
  const cutoff = hidden?.start ?? source.length;
  const mapped = insertions(source.slice(0, cutoff), edits.filter(edit => edit.at < cutoff));
  const suffix = openTags.reverse().map(tag => `${tag.block ? '\n\n' : ''}</${tag.name}>`).join('');
  return { ...mapped, value: mapped.value + suffix, incomplete, hidden,
    recoveryOffset: incomplete.size || hidden ? Math.min(...incomplete, hidden?.start ?? Infinity) : undefined };
}

/** Incomplete inline punctuation must not flash as literal Markdown. Complete
 * syntax already has its own AST node, so this only examines trailing text. */
export function concealIncomplete(root: MarkdownNode, source: string, lines: readonly number[]) {
  const tail = root.children?.at(-1);
  if (tail?.type === 'paragraph' && tail.position) {
    const raw = source.slice(tail.position.start.offset);
    if (/^ {0,3}\|[^\r\n]*(?:(?:\r\n|\r|\n)[|:\- \t]*)?$/.test(raw)) { tail.children = []; return; }
  }
  let cutoff = source.length;
  walk(root.children?.at(-1) ?? root, node => {
    if (node.type !== 'text' || !node.position) return;
    const { start, end } = node.position;
    const raw = source.slice(start.offset);
    for (const candidate of raw.slice(0, end.offset - start.offset).matchAll(/[!\[`*_~\$&^]/g)) {
      const at = candidate.index!;
      let escapes = 0;
      for (let before = at - 1; before >= 0 && raw[before] === '\\'; before--) escapes++;
      if (escapes % 2) continue;
      if (raw[at] === '_' && /[\p{L}\p{N}]/u.test(raw[at - 1] ?? '') && /[\p{L}\p{N}]/u.test(raw[at + 1] ?? '')) continue;
      const tail = raw.slice(at).trimEnd();
      if (/^(?:\^\[[^\]]*$|!?(?:\[[^\]]*$|\[[^\]]*\]\([^)]*$)|`+[^`]*$|\*{1,3}(?:\S[^*]*)?$|_{1,3}(?:\S[^_]*)?$|~{1,2}(?:\S[^~]*)?$|\$[^$]*$|&(?:#x?[\da-f]*|[a-z]*)$)/i.test(tail)) { cutoff = Math.min(cutoff, start.offset + at); break; }
    }
  });
  if (cutoff === source.length) return;
  walk(root, node => {
    if (node.children) node.children = node.children.filter(child => (child.position?.start.offset ?? 0) < cutoff);
    if (node.type !== 'text' || !node.position || node.position.end.offset <= cutoff) return;
    node.value = decodeString(source.slice(node.position.start.offset, cutoff));
    node.position = { start: node.position.start, end: sourcePoint(cutoff, lines) };
  });
}
