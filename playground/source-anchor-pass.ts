import { createSourceRangeLookup } from '../src/react/source-geometry';
import type { ReaderRuntime, SourceBinding } from '../src/react/runtime';
import type { SourceRange } from '../src/core';

const sourceRange = (start: number, end = start + 1): SourceRange => ({ start, end });
const box = (rect: DOMRect) => [rect.x, rect.y, rect.width, rect.height, rect.top, rect.right, rect.bottom, rect.left];
function check(value: unknown, message: string): asserts value { if (!value) throw new Error(message); }
function binding(start: number, end: number, resolve = (offset: number) => start + offset): SourceBinding {
  return { range: sourceRange(start, end), atomic: false, resolve };
}

class Fixture {
  root = document.createElement('article');
  blocks = new Map<string, HTMLElement>();
  bindings = new WeakMap<Node, SourceBinding>();
  snapshot = { source: 'x'.repeat(1200), blocks: [] as Array<{ id: string; range: SourceRange }> };
  prepare?: () => void;
  prepared = false;
  runtime: ReaderRuntime;
  lookup: ReturnType<typeof createSourceRangeLookup>;
  assertions = 0;
  private owned = new Set<HTMLElement>();
  constructor(top = 40) {
    this.root.dataset.limrDocument = 'source-anchor-pass';
    this.root.style.cssText = `position:absolute;top:${top}px;left:20px;width:600px;font:16px/24px monospace;white-space:pre-wrap`;
    document.body.append(this.root); this.owned.add(this.root);
    this.runtime = {
      content: this.root, blocks: this.blocks, bindings: this.bindings,
      document: { getSnapshot: () => this.snapshot },
      prepareTextBindings: () => { this.prepared = true; this.prepare?.(); },
    } as unknown as ReaderRuntime;
    this.lookup = createSourceRangeLookup(this.runtime);
  }
  block(id = 'block', start = 0, end = 1000) {
    const node = document.createElement('p'); node.dataset.limrBlock = id; node.style.margin = '0';
    this.root.append(node); this.owned.add(node); this.blocks.set(id, node); this.snapshot.blocks.push({ id, range: sourceRange(start, end) }); return node;
  }
  span(parent: HTMLElement, value: string, start: number, end = start + value.length) {
    const node = document.createElement('span'); node.textContent = value; parent.append(node); this.bindings.set(node, binding(start, end)); return node;
  }
  text(source: SourceRange, node: Text, start: number, end: number, expected: string) {
    const native = document.createRange(); native.setStart(node, start); native.setEnd(node, end);
    check(native.toString() === expected, `Fixture glyph must be ${JSON.stringify(expected)}`);
    const expectedRect = native.getBoundingClientRect(); check(expectedRect.width && expectedRect.height, 'Expected glyph must have native ink');
    const actual = this.lookup.startRect(source);
    check(actual && JSON.stringify(box(actual)) === JSON.stringify(box(expectedRect)), `Source ${source.start}:${source.end} must locate ${JSON.stringify(expected)}: ${JSON.stringify(actual && box(actual))} versus ${JSON.stringify(box(expectedRect))}`);
    this.assertions++;
  }
  surface(source: SourceRange, node: HTMLElement) {
    const expected = node.getBoundingClientRect(), actual = this.lookup.startRect(source);
    check(expected.width && expected.height, 'Expected atomic surface must have native geometry');
    check(actual && JSON.stringify(box(actual)) === JSON.stringify(box(expected)), 'Source must locate the explicit atomic selection surface'); this.assertions++;
  }
  absent(source: SourceRange) { check(this.lookup.startRect(source) === null, `Source ${source.start}:${source.end} must have no visible ink`); this.assertions++; }
  replaceContent() {
    const next = this.root.cloneNode(false) as HTMLElement; this.root.replaceWith(next); this.root = next; this.owned.add(next);
    this.runtime.content = next; this.blocks.clear(); this.snapshot = { ...this.snapshot, blocks: [] }; return next;
  }
  dispose() { this.lookup.dispose(); for (const node of this.owned) node.remove(); }
}

type Group = 'source-order' | 'mutations' | 'resolvers-and-coverage' | 'lifecycle' | 'isolation';
function run(group: Group) {
  const NativeObserver = window.MutationObserver;
  const observations: Array<{ target: Node; active: boolean }> = [];
  class Observed extends NativeObserver {
    private records: Array<{ target: Node; active: boolean }> = [];
    override observe(target: Node, options?: MutationObserverInit) { const record = { target, active: true }; observations.push(record); this.records.push(record); super.observe(target, options); }
    override disconnect() { for (const record of this.records) record.active = false; super.disconnect(); }
  }
  window.MutationObserver = Observed;
  const fixtures: Fixture[] = [];
  const create = (top?: number) => { const fixture = new Fixture(top); fixtures.push(fixture); return fixture; };
  const afterPass = () => {
    for (const f of fixtures) check(observations.filter(o => o.active && o.target === f.root).length <= 1, 'A completed pass must not retain extra DOM observers');
  };
  const throwsSame = (callback: () => unknown, sentinel: Error) => {
    let caught: unknown; try { callback(); } catch (error) { caught = error; }
    check(caught === sentinel, 'The original callback exception must propagate unchanged'); afterPass();
  };
  try {
    const f = create(), parent = f.block();
    if (group === 'source-order') {
      parent.dataset.limrDocument = 'block-root-is-allowed';
      const pruned = f.span(parent, '', 200, 210), unreachable = f.span(pruned, 'WRONG', 20, 25);
      f.bindings.set(unreachable, binding(20, 25, () => { throw new Error('A disjoint parent binding must prune this resolver'); }));
      const hidden = f.span(parent, 'hidden', 20, 28); hidden.hidden = true;
      const letters = f.span(parent, '🪶&A', 20, 28), offsets = [20, 20, 22, 27, 28];
      f.bindings.set(letters, binding(20, 28, offset => { check(f.prepared, 'prepare must precede text resolver traversal'); return offsets[offset]; }));
      const split = f.span(parent, '', 100, 106); split.append('ab');
      const em = document.createElement('em'); em.textContent = 'cd'; split.append(em, 'ef');
      const atom = f.span(parent, 'atomic', 400, 410); atom.dataset.limrAtomic = 'inline'; atom.dataset.limrIgnore = ''; atom.dataset.sourceStart = '400'; atom.dataset.sourceEnd = '410';
      const nested = f.span(parent, 'nested', 500, 506); nested.dataset.limrDocument = 'other';
      f.lookup.withPass(() => {
        f.text(sourceRange(20, 22), letters.firstChild as Text, 0, 2, '🪶');
        f.text(sourceRange(22, 27), letters.firstChild as Text, 2, 3, '&');
        f.text(sourceRange(104, 105), split.lastChild as Text, 0, 1, 'e');
        f.bindings.set(em.firstChild!, binding(300, 302)); f.absent(sourceRange(300, 302));
        f.bindings.get(split)!.range = sourceRange(100, 400); f.text(sourceRange(301, 302), em.firstChild as Text, 1, 2, 'd');
        f.surface(sourceRange(400, 401), atom); atom.dataset.limrMarker = 'm'; f.absent(sourceRange(401, 402));
        delete atom.dataset.limrMarker; delete atom.dataset.limrAtomic; f.absent(sourceRange(402, 403));
        f.absent(sourceRange(500, 506)); parent.inert = true; f.absent(sourceRange(27, 28));
      });
    } else if (group === 'mutations') {
      const target = f.span(parent, 'Alpha', 20, 25);
      f.lookup.withPass(() => {
        f.absent(sourceRange(700, 701)); target.dataset.limrIgnore = ''; f.absent(sourceRange(20, 25));
        delete target.dataset.limrIgnore; target.inert = true; f.absent(sourceRange(20, 26)); target.inert = false;
        target.replaceChildren(document.createTextNode('Bravo')); f.bindings.set(target, binding(40, 45)); f.text(sourceRange(40, 45), target.firstChild as Text, 0, 1, 'B');
        f.prepare = () => { f.prepare = undefined; target.dataset.limrIgnore = ''; }; f.absent(sourceRange(40, 46));
        f.prepare = () => { f.prepare = undefined; delete target.dataset.limrIgnore; target.textContent = 'Cider'; f.bindings.set(target, binding(60, 65)); };
        // The target node is replaced by prepare; compare afterward with an independent native range.
        const prepared = f.lookup.startRect(sourceRange(60, 65)); check(prepared, 'prepare must install visible source text');
        f.text(sourceRange(60, 65), target.firstChild as Text, 0, 1, 'C');
        (target.firstChild as Text).data = 'Delta'; f.text(sourceRange(60, 65), target.firstChild as Text, 0, 1, 'D');
        const fallback = f.span(parent, 'Echo', 60, 65); target.dataset.limrIgnore = ''; target.className = 'invalidate-existing-ink';
        f.text(sourceRange(60, 65), fallback.firstChild as Text, 0, 1, 'E');
        fallback.dataset.limrAtomic = 'block'; fallback.dataset.sourceStart = '80'; fallback.dataset.sourceEnd = '85'; f.surface(sourceRange(80, 81), fallback);
        const replacement = fallback.cloneNode(true) as HTMLElement; delete replacement.dataset.limrAtomic; replacement.textContent = 'Foxtrot'; fallback.replaceWith(replacement);
        f.bindings.set(replacement, binding(90, 97)); f.text(sourceRange(90, 97), replacement.firstChild as Text, 0, 1, 'F');
      });
    } else if (group === 'resolvers-and-coverage') {
      const earlier = f.span(parent, 'Before', 0, 1000); earlier.hidden = true;
      const target = f.span(parent, 'Alpha', 20, 25), fallback = f.span(parent, 'Zulu', 20, 25);
      f.lookup.withPass(() => {
        f.absent(sourceRange(700, 701));
        let mutate = true; f.bindings.set(earlier, binding(0, 1000, offset => { if (mutate) { mutate = false; target.inert = true; } return offset; }));
        f.text(sourceRange(20, 25), fallback.firstChild as Text, 0, 1, 'Z');
        target.inert = false; f.absent(sourceRange(701, 702));
        // hidden is established BEFORE warming. Only a live binding changes now.
        f.bindings.set(earlier, binding(0, 1000, offset => { if (offset > 0 && offset < 6) target.dataset.limrIgnore = ''; return offset; }));
        f.text(sourceRange(0, 40), fallback.firstChild as Text, 0, 1, 'Z');
        earlier.remove(); fallback.remove(); delete target.dataset.limrIgnore;
        f.bindings.set(target, binding(40, 45)); f.text(sourceRange(40, 45), target.firstChild as Text, 0, 1, 'A');
        const current = f.bindings.get(target)!; current.range = sourceRange(70, 75); f.absent(sourceRange(40, 46));
        current.resolve = offset => 70 + offset; f.text(sourceRange(70, 75), target.firstChild as Text, 0, 1, 'A');
        f.bindings.set(target.firstChild!, binding(72, 77)); f.text(sourceRange(73, 74), target.firstChild as Text, 1, 2, 'l');
        f.bindings.delete(target); f.text(sourceRange(74, 75), target.firstChild as Text, 2, 3, 'p');
      }); afterPass();
      const outside = create(200), outsideBlock = outside.block(), outsideText = outside.span(outsideBlock, 'Outside', 20, 27);
      document.body.append(outsideBlock); // Outside before either observer starts.
      outside.lookup.withPass(() => {
        outside.absent(sourceRange(700, 701)); outsideText.dataset.limrIgnore = ''; outside.absent(sourceRange(20, 25));
        delete outsideText.dataset.limrIgnore; outside.root.append(outsideBlock); outside.text(sourceRange(20, 26), outsideText.firstChild as Text, 0, 1, 'O');
        outside.prepare = () => { outside.prepare = undefined; document.body.append(outsideBlock); };
        outside.absent(sourceRange(701, 702)); outsideText.dataset.limrIgnore = ''; outside.absent(sourceRange(20, 27));
      });
    } else if (group === 'lifecycle') {
      const target = f.span(parent, 'Alpha', 20, 25);
      f.lookup.withPass(() => {
        f.absent(sourceRange(700, 701));
        f.lookup.withPass(() => { f.absent(sourceRange(701, 702)); target.dataset.limrIgnore = ''; }); f.absent(sourceRange(20, 25));
        delete target.dataset.limrIgnore; const sentinel = new Error('nested');
        try { f.lookup.withPass(() => { f.absent(sourceRange(702, 703)); throw sentinel; }); } catch (error) { check(error === sentinel, 'Nested error identity'); }
        f.text(sourceRange(20, 26), target.firstChild as Text, 0, 1, 'A');
      }); afterPass();
      const earlier = f.span(parent, 'Before', 0, 1000); earlier.hidden = true; parent.prepend(earlier);
      f.lookup.withPass(() => {
        let entered = false;
        f.bindings.set(earlier, binding(0, 1000, offset => {
          if (!entered) { entered = true; f.lookup.withPass(() => f.text(sourceRange(20, 27), target.firstChild as Text, 0, 1, 'A')); target.dataset.limrIgnore = ''; }
          return offset;
        })); f.absent(sourceRange(20, 28));
      }); afterPass(); earlier.remove(); delete target.dataset.limrIgnore;
      for (const phase of ['prepare', 'resolver'] as const) {
        const sentinel = new Error(phase);
        if (phase === 'prepare') f.prepare = () => { throw sentinel; };
        else f.bindings.set(target, binding(20, 25, () => { throw sentinel; }));
        throwsSame(() => f.lookup.withPass(() => f.lookup.startRect(sourceRange(20, phase === 'prepare' ? 29 : 30))), sentinel);
        f.prepare = undefined; f.bindings.set(target, binding(20, 25));
      }
      parent.prepend(earlier);
      f.lookup.withPass(() => {
        let disposed = false; f.bindings.set(earlier, binding(0, 1000, offset => { if (!disposed) { disposed = true; f.lookup.dispose(); target.dataset.limrIgnore = ''; } return offset; }));
        f.absent(sourceRange(20, 31)); earlier.remove(); delete target.dataset.limrIgnore; f.text(sourceRange(20, 32), target.firstChild as Text, 0, 1, 'A');
      }); afterPass();
      for (const value of [Promise.resolve(1), { then() { throw new Error('A thenable must not be invoked'); } }]) {
        let error: unknown; try { f.lookup.withPass(() => { f.text(sourceRange(20, 33), target.firstChild as Text, 0, 1, 'A'); return value; }); } catch (caught) { error = caught; }
        check(error instanceof TypeError && /synchronous/.test(error.message), 'An async pass must be rejected synchronously'); afterPass();
      }
      const sentinel = new Error('then getter'), value = Object.defineProperty({}, 'then', { get() { throw sentinel; } });
      throwsSame(() => f.lookup.withPass(() => { f.text(sourceRange(20, 34), target.firstChild as Text, 0, 1, 'A'); return value; }), sentinel);
      f.text(sourceRange(20, 35), target.firstChild as Text, 0, 1, 'A');
    } else if (group === 'isolation') {
      const first = f.span(parent, 'Alpha', 20, 25), other = create(240), second = other.span(other.block(), 'Bravo', 20, 25);
      f.lookup.withPass(() => {
        f.text(sourceRange(20, 25), first.firstChild as Text, 0, 1, 'A');
        other.lookup.withPass(() => { other.text(sourceRange(20, 25), second.firstChild as Text, 0, 1, 'B'); second.inert = true; other.absent(sourceRange(20, 26)); });
        f.text(sourceRange(20, 26), first.firstChild as Text, 0, 1, 'A');
        f.snapshot = { ...f.snapshot }; f.text(sourceRange(20, 25), first.firstChild as Text, 0, 1, 'A');
        parent.style.transform = 'translate(15px, 20px)'; f.text(sourceRange(20, 25), first.firstChild as Text, 0, 1, 'A');
        f.replaceContent(); const changed = f.span(f.block(), 'Changed', 20, 27); f.text(sourceRange(20, 25), changed.firstChild as Text, 0, 1, 'C');
      });
    } else throw new Error('Unknown fixture group: ' + group);
    afterPass();
    const assertions = fixtures.reduce((total, fixture) => total + fixture.assertions, 0);
    check(assertions > 0, 'Every fixture group must assert native source geometry');
    return { ok: true, group, assertions };
  } finally {
    for (const fixture of fixtures) fixture.dispose(); window.MutationObserver = NativeObserver;
    check(!observations.some(record => record.active), 'Disposal must release every observed fixture');
  }
}

Object.assign(window, { sourceAnchorPass: { run } });
