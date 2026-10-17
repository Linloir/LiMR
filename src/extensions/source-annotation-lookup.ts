import type { MarkdownNode, SourceRange } from '../core/types';

const eligible = (node: MarkdownNode) => !['annotationDefinition', 'definition', 'footnoteDefinition'].includes(node.type);
const startOf = (node: MarkdownNode) => node.position?.start.offset ?? 0;
const endOf = (node: MarkdownNode) => node.position?.end.offset ?? 0;

/** Preserve first-overlapping and reverse-preceding host order. Normal Markdown
 * siblings have monotonic source starts and ends; arbitrary transformed trees
 * retain the original linear searches. Position expansion can invalidate the
 * index, in which case the remaining queries also use those searches. */
export function createAnnotationHostLookup(nodes: readonly MarkdownNode[]) {
  const hosts = nodes.filter(eligible);
  let ordered = hosts.every((node, index) => Number.isFinite(startOf(node)) && Number.isFinite(endOf(node)) && endOf(node) >= startOf(node)
    && (!index || startOf(node) >= startOf(hosts[index - 1]) && endOf(node) >= endOf(hosts[index - 1])));
  let selected = -1;
  const lowerBound = (offset: number) => {
    let lo = 0, hi = hosts.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (endOf(hosts[mid]) < offset) lo = mid + 1; else hi = mid; }
    return lo;
  };
  return {
    find(start: number, end: number): MarkdownNode | undefined {
      if (!ordered) return nodes.find(node => eligible(node) && startOf(node) <= end && endOf(node) >= start);
      selected = lowerBound(start);
      const node = hosts[selected];
      return node && startOf(node) <= end ? node : undefined;
    },
    *preceding(start: number): Generator<MarkdownNode> {
      if (!ordered) {
        for (let index = nodes.length - 1; index >= 0; index--) if (eligible(nodes[index]) && endOf(nodes[index]) < start) yield nodes[index];
      } else {
        for (let index = lowerBound(start) - 1; index >= 0; index--) { selected = index; yield hosts[index]; }
      }
    },
    changed(node: MarkdownNode): void {
      if (!ordered) return;
      if (hosts[selected] !== node) selected = hosts.indexOf(node);
      const previous = hosts[selected - 1], next = hosts[selected + 1];
      ordered = hosts[selected] === node && Number.isFinite(startOf(node)) && Number.isFinite(endOf(node)) && endOf(node) >= startOf(node)
        && (!previous || startOf(previous) <= startOf(node) && endOf(previous) <= endOf(node))
        && (!next || startOf(next) >= startOf(node) && endOf(next) >= endOf(node));
    },
  };
}

/** Containment is an interval query: among declarations beginning before the
 * marker, one must end after it. Prefix maxima preserve nested/overlapping
 * declarations without scanning all definitions for each marker. */
export function createDefinitionContainment(ranges: readonly SourceRange[]) {
  if (!ranges.every(range => Number.isFinite(range.start) && Number.isFinite(range.end))) {
    return (start: number, end: number) => ranges.some(range => start >= range.start && end <= range.end);
  }
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const ends = new Float64Array(sorted.length);
  let maximum = -Infinity;
  for (let index = 0; index < sorted.length; index++) ends[index] = maximum = Math.max(maximum, sorted[index].end);
  return (start: number, end: number) => {
    let lo = 0, hi = sorted.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (sorted[mid].start <= start) lo = mid + 1; else hi = mid; }
    return lo > 0 && end <= ends[lo - 1];
  };
}
