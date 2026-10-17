export interface CollapsibleSidebarItem { id: string; anchorTop: number; height: number }
export interface SidebarClusterPlan {
  id: string;
  items: readonly CollapsibleSidebarItem[];
  anchorTop: number;
  height: number;
  folded: boolean;
  hidden: number;
}
interface Box { id: string; anchorTop: number; height: number; weight?: number }

/** Candidate scores need positions, not a Map and a fresh object for every
 * regression pool. Reuse the numeric workspace throughout a folding search. */
function packingWorkspace(capacity: number) {
  return { offsets: new Float64Array(capacity), positions: new Float64Array(capacity),
    starts: new Uint32Array(capacity), ends: new Uint32Array(capacity), totals: new Float64Array(capacity), weights: new Float64Array(capacity) };
}
function pack(items: readonly Box[], gap: number, height: number, workspace: ReturnType<typeof packingWorkspace>, focusedId?: string) {
  const { offsets, positions, starts, ends, totals, weights } = workspace;
  let offset = 0, size = 0, focused = -1;
  for (let index = 0; index < items.length; index++) {
    const item = items[index], weight = item.weight ?? 1;
    offsets[index] = offset; offset += item.height + gap;
    if (focused < 0 && item.id === focusedId) focused = index;
    starts[size] = ends[size] = index; totals[size] = (item.anchorTop - offsets[index]) * weight; weights[size] = weight; size++;
    while (size > 1 && totals[size - 2] / weights[size - 2] > totals[size - 1] / weights[size - 1]) {
      ends[size - 2] = ends[size - 1]; totals[size - 2] += totals[size - 1]; weights[size - 2] += weights[size - 1]; size--;
    }
  }
  const room = Math.max(0, height - Math.max(0, offset - gap));
  const minimum = focused >= 0 ? -offsets[focused] : 0;
  const maximum = focused >= 0 ? Math.max(minimum, height - items[focused].height - offsets[focused]) : room;
  for (let pool = 0; pool < size; pool++) {
    const origin = Math.max(minimum, Math.min(maximum, totals[pool] / weights[pool]));
    for (let index = starts[pool]; index <= ends[pool]; index++) positions[index] = origin + offsets[index];
  }
  return positions;
}

/** Weighted isotonic regression minimizes squared displacement while keeping
 * every neighboring box separated. Mild collisions can share the displacement. */
export function fitSidebarBoxes(items: readonly Box[], gap: number, height: number, focusedId?: string): Map<string, number> {
  const positions = pack(items, gap, height, packingWorkspace(items.length), focusedId);
  return new Map(items.map((item, index) => [item.id, positions[index]]));
}

const packedHeight = (items: readonly CollapsibleSidebarItem[], gap: number) => items.reduce((sum, item) => sum + item.height, Math.max(0, items.length - 1) * gap);
const hiddenCount = (items: readonly CollapsibleSidebarItem[], height: number, gap: number) => {
  let bottom = 0, hidden = 0;
  for (const item of items) { bottom += item.height; if (bottom > height + .5) hidden++; bottom += gap; }
  return hidden;
};

/** Leave a substantial partial card at the edge, never a gap or a nearly
 * complete card whose clipping would be indistinguishable from an empty rail. */
export function foldWindowHeight(items: readonly { height: number }[], preferred: number, gap: number): number {
  let top = 0, closest = preferred, distance = Infinity;
  items.slice(0, -1).forEach(item => {
    const height = top + item.height * .68, delta = Math.abs(height - preferred);
    if (delta < distance) { closest = height; distance = delta; }
    top += item.height + gap;
  });
  return closest;
}

/** Folding has an explicit cost. Keep all cards whenever modest displacement
 * is cheaper. Only dense consecutive ranges whose savings outweigh that cost
 * become a clipped group; paragraph boundaries are deliberately irrelevant. */
export function planSidebarCollapse(items: readonly CollapsibleSidebarItem[], railHeight: number, maxHeight = 420, gap = 14): SidebarClusterPlan[] {
  const steps = planSidebarCollapseSteps(items, railHeight, maxHeight, gap);
  for (;;) { const next = steps.next(); if (next.done) return next.value; }
}

/** Same deterministic search, with checkpoints between complete candidates.
 * Readers can keep positioning the last plan while computing a replacement
 * within a frame budget; synchronous consumers retain the identical result. */
export function* planSidebarCollapseSteps(items: readonly CollapsibleSidebarItem[], railHeight: number, maxHeight = 420, gap = 14): Generator<void, SidebarClusterPlan[]> {
  let groups: SidebarClusterPlan[] = items.map(item => ({ id: item.id, items: [item], anchorTop: item.anchorTop, height: item.height, folded: false, hidden: 0 }));
  const workspace = packingWorkspace(items.length);
  const foldingCost = (group: SidebarClusterPlan) => group.folded ? 18 + group.hidden * 24 + (packedHeight(group.items, gap) - group.height) / 50 : 0;
  const positionCost = (group: SidebarClusterPlan, top: number) => {
    const displacement = Math.abs(top - group.anchorTop), overflow = Math.max(0, top + group.height - railHeight);
    return (displacement / 48) ** 2 + (Math.max(0, displacement - 72) / 24) ** 2 + (overflow / 16) ** 2;
  };
  const score = (values: SidebarClusterPlan[]) => {
    const positions = pack(values, gap, railHeight, workspace);
    let total = 0;
    for (let index = 0; index < values.length; index++) total = total + positionCost(values[index], positions[index]) + foldingCost(values[index]);
    return total;
  };
  for (let round = 0; round < items.length; round++) {
    const currentScore = score(groups);
    if (currentScore < 66) break; // Even the smallest fold costs more than this.
    const positions = fitSidebarBoxes(groups, gap, railHeight);
    const candidates: { start: number; end: number; group: SidebarClusterPlan; priority: number }[] = [];
    let bestScore = currentScore, best: SidebarClusterPlan[] | undefined;
    for (let start = 0; start < groups.length; start++) {
      const members: CollapsibleSidebarItem[] = [];
      let pressure = 0;
      for (let end = start; end < Math.min(groups.length, start + 18); end++) {
        if (end > start && groups[end].anchorTop - groups[end - 1].items.at(-1)!.anchorTop > Math.max(240, groups[end - 1].items.at(-1)!.height + gap + 96)) break;
        members.push(...groups[end].items);
        pressure += positionCost(groups[end], positions.get(groups[end].id)!) + foldingCost(groups[end]);
        if (members.length < 3 || start === end) continue;
        const total = packedHeight(members, gap);
        const span = members.at(-1)!.anchorTop - members[0].anchorTop;
        if (span > maxHeight) break;
        // Try generous windows first. The loss penalty favors retaining as much
        // readable content as possible, including a partially visible last card.
        const preferred = Math.max(members[0].height + 28, Math.min(maxHeight, span + members[0].height * .65));
        for (const height of new Set([foldWindowHeight(members, Math.min(total, maxHeight), gap), foldWindowHeight(members, Math.min(total, preferred), gap)])) {
          const hidden = hiddenCount(members, height, gap);
          if (hidden < 2 || total - height < 48) continue;
          const group = { id: members[0].id, items: [...members], anchorTop: members[0].anchorTop, height, folded: true, hidden };
          candidates.push({ start, end, group, priority: pressure - foldingCost(group) });
        }
      }
      yield;
    }
    // Bound global packing evaluations on long bibliographies. Ranking is only
    // a shortlist: every accepted fold still reduces the full layout penalty.
    candidates.sort((a, b) => b.priority - a.priority);
    for (const { start, end, group } of candidates.slice(0, 64)) {
      const candidate = [...groups.slice(0, start), group, ...groups.slice(end + 1)];
      const cost = score(candidate);
      if (cost < bestScore - .5) { bestScore = cost; best = candidate; }
      yield;
    }
    if (!best) break;
    groups = best;
  }
  // Greedy pressure relief can initially hide more than the settled layout
  // needs. Release edge cards again whenever the full penalty permits it.
  for (let round = 0; round < items.length; round++) {
    let bestScore = score(groups), best: SidebarClusterPlan[] | undefined;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      if (!group.folded) continue;
      const singleton = (item: CollapsibleSidebarItem): SidebarClusterPlan => ({ id: item.id, items: [item], anchorTop: item.anchorTop, height: item.height, folded: false, hidden: 0 });
      const replacements = [group.items.map(singleton)];
      for (const first of [true, false]) {
        const remaining = first ? group.items.slice(1) : group.items.slice(0, -1), height = foldWindowHeight(remaining, group.height, gap), hidden = hiddenCount(remaining, height, gap);
        if (remaining.length < 3 || hidden < 2) continue;
        const rest = { ...group, id: remaining[0].id, anchorTop: remaining[0].anchorTop, items: remaining, height, hidden };
        replacements.push(first ? [singleton(group.items[0]), rest] : [rest, singleton(group.items.at(-1)!)]);
      }
      for (const replacement of replacements) {
        const candidate = [...groups.slice(0, index), ...replacement, ...groups.slice(index + 1)], cost = score(candidate);
        if (cost < bestScore - .5) { bestScore = cost; best = candidate; }
        yield;
      }
    }
    if (!best) break;
    groups = best;
  }
  return groups;
}

/** Preserve the current groups during a geometry transition. New or removed
 * references remain independently addressable while the exact search runs. */
export function reanchorSidebarPlan(plan: readonly SidebarClusterPlan[], items: readonly CollapsibleSidebarItem[], maxHeight: number, gap: number): SidebarClusterPlan[] {
  const remaining = new Map(items.map(item => [item.id, item])), groups: SidebarClusterPlan[] = [];
  const singleton = (item: CollapsibleSidebarItem): SidebarClusterPlan => ({ id: item.id, items: [item], anchorTop: item.anchorTop, height: item.height, folded: false, hidden: 0 });
  for (const previous of plan) {
    const members = previous.items.flatMap(item => { const current = remaining.get(item.id); remaining.delete(item.id); return current ? [current] : []; });
    if (!members.length) continue;
    if (!previous.folded || members.length < 3) { groups.push(...members.map(singleton)); continue; }
    const height = foldWindowHeight(members, Math.min(previous.height, maxHeight), gap);
    groups.push({ id: members[0].id, items: members, anchorTop: members[0].anchorTop, height, folded: true, hidden: hiddenCount(members, height, gap) });
  }
  groups.push(...[...remaining.values()].map(singleton));
  return groups.sort((a, b) => a.anchorTop - b.anchorTop);
}
