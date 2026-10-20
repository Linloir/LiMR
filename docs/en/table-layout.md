# Table layout

[Documentation](README.md) · [简体中文](../zh-CN/table-layout.md)

LiMR computes table tracks in the core, measures rendered content in the React adapter, and uses the ordinary annotation UI for overflow. The same component serves the Playground and VS Code. Table layout does not depend on paragraph alignment or KP typography.

## Choose a reading policy first

Default Reader / AsyncReader already include adaptive tables. The planner allocates column widths and row heights from actual fonts and content, reducing empty space caused by one very long cell. An annotation marker after `…` reveals clipped content, which can also expand in its original cell. Markdown source remains complete.

| Scenario | Recommended setting | Behavior |
| --- | --- | --- |
| Papers, comparison tables, mixed short/long content | Keep default tableLayout | Adaptive dimensions, horizontal scrolling when needed and full-content previews |
| Prefer browser-native dimensions without preview cards | `tableLayout: false` | Native table layout and scrolling, without measurement, clipping or derived previews |
| Adjust only width/height protection limits | `{ maxColumnWidth, maxRowHeight }` | Keep the planner and change explicit limits |
| Use another column/row policy | `{ algorithm }` | Replace calculation while reusing measurement, caching and previews |
| Change DOM or measurement entirely | `rendererOverrides` | Implement the custom view contract; see [extensions](extensions.md) |

Table policy is independent of typography, code wrapping and document windows. One huge table can still create substantial DOM; document windowing does not virtualize its rows. See the [quick start](getting-started.md#adjust-reading-policies) for integration. Algorithm details follow the usage sections below.

## Overflow, source and configuration

Truncation is decided at the full content width with the suffix temporarily excluded. Emergency wrapping stays the same before and after that decision, so an existing marker cannot create or sustain its own overflow.

Clipped content retains its original source-bound DOM. A separate suffix track reserves space for `…` immediately followed by an ordinary annotation marker; no painted white overlay covers glyphs. Complete cells keep overflow visible so italic and accented glyph ink can extend past its measured advance width. The marker registers a view-only annotation in one batch per table. Wide readers use the existing sidebar and narrow readers use the existing overlay/card. Full content can be read there, copied as Markdown, or expanded in the original cell. The visual preview carries no duplicate source anchors, and derived annotations are neither editable source annotations nor exported Markdown.

```tsx
<Reader
  source={markdown}
  parameters={{ tableLayout: { maxColumnWidth: 720 } }}
/>
```

`maxColumnWidth` is in CSS pixels and protects the content window; a track may exceed it when needed to fill the reader. `maxRowHeight` is an optional explicit protection limit in pixels; omit it for content-dependent row heights. `fontSize` and `cellPadding` can override adapter measurements for custom integrations. Custom renderers with changing fonts or media must expose normal DOM changes/load events; very large individual cells have a measured prefix and an estimated tail.

Regression coverage includes sparse, single-column, reference/prose and 19-column tables at 500, 760 and 1100 pixels; rare phrases, compound headers, long-token wrap boundaries and nonempty per-line glyph counts, real reference markers, glyph/suffix separation, rich previews, source selection, hidden translation panels, dense rows, print styles and stable view-annotation registration. Browser tests and actual article screenshots complement the pure optimizer tests; neither establishes a universal appearance or performance guarantee for arbitrary custom cell renderers.

## Disable or replace the planner (1.3.1)

This capability belongs to the default table renderer; no separate layout module is required. Omit `parameters.tableLayout` or pass `{}` to retain the 1.3.0 `layoutTable` algorithm, measurement and bounded caches. Existing numeric options remain compatible.

```tsx
import { Reader } from '@linloir/limr';

export function NativeTables({ source }: { source: string }) {
  return <Reader source={source} parameters={{ tableLayout: false }} />;
}
```

`false` retains GFM tables, alignment, rich content, source selection and source annotations, using native browser table layout and horizontal scrolling. It mounts no LiMR table measurement, layout observers, fixed tracks, height clipping or derived overflow previews. Switching modes remounts the table view and releases old overflow annotations; DOM focus and selections need not survive that switch. Parameter changes do not reparse source. `Reader`, `AsyncReader`, `Markdown` and `DocumentProvider` all accept this parameter.

Replace the planner through `algorithm`, or register its configuration as an ordinary module parameter:

```tsx
import { Reader, defineExtension, layoutTable, type TableLayoutAlgorithm } from '@linloir/limr';

const compactLayout: TableLayoutAlgorithm = input => layoutTable({
  ...input,
  options: { ...input.options, maxColumnWidth: 560 },
});
const plugins = [defineExtension({
  name: 'compact-table-layout',
  parameters: { tableLayout: { algorithm: compactLayout } },
})];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
```

A planner may implement its own algorithm without calling `layoutTable`. It synchronously receives `TableLayoutInput` on the browser main thread: measured `rows`, `availableWidth` in CSS pixels, and `options` including measured font size and horizontal padding. Inputs belong to the cache and must be treated as read-only. Return a complete `TableLayoutPlan`:

- `widths` and `contentWidths`: one positive number per column, both including horizontal padding; content windows may be narrower than tracks.
- `heights`: content height per row, excluding padding; `clipped` matches the cell matrix and marks cells requiring height limits. Custom header heights are honored; body height limits apply only to cells marked for clipping.
- `width` is the sum of track widths; `scroll` indicates horizontal scrolling; `cost` and `evaluations` are numeric diagnostics and may be zero when unused.

Custom planners reuse measurement, cached width plans, actual DOM overflow checks and full-content previews. Keep function and configuration references stable; replace the configuration when its state changes to invalidate the cache. Planners must be synchronous and side-effect-free and return valid plans; errors are not silently replaced with default plans. SSR does not call measured planners. `layoutTable` and its algorithm types are also available from `@linloir/limr/core`; the React entry exports `TableLayoutConfig`.

Priority is per-table `MarkdownTable.options` > host `parameters.tableLayout` > the last extension supplying the parameter > the built-in default. Values replace the entire configuration rather than merging fields: a host `{}` restores the built-in algorithm, `false` disables it, and omission inherits plugins. Plugins may also register `tableLayout: false`. These are view parameters: keep GFM parsing and do not send planner functions to workers. To replace measurement and the entire table DOM, use existing `rendererOverrides`; see [extension development](extensions.md).

The default path adds no per-cell validation, measurements, observers or scoring passes. It selects the native or measured view at the table boundary and calls the selected planner on existing cache misses. Plugin authors own their custom algorithm's performance.

## Default constraints and measurement

The table fills at least the available body width. Track widths are explicit; spare space first goes to measurable reductions in wrapping or overflow, then to a content-weighted allocation. A single column can therefore fill a wide page while its text window retains a readable maximum line length.

Measurements use the rendered font, weight, letter spacing, inline padding and actual annotation-marker geometry. Markdown syntax length is not a width estimate. A short reference and its marker form an indivisible unit. Ordinary words and modest hyphenated labels such as `E-Commerce` establish a minimum readable width; short phrases are protected when two lines suffice. Header height is limited to three lines. There is no default body line-count limit.

Glyph-width caches belong to their owning `Document`. Font loading, completion and failure invalidate them, including when all tables are unmounted during loading. Ordinary width changes still reuse font measurements. This relies on font lifecycle events; synchronous font-set or CSSOM changes that emit no such event are not detected automatically.

For an exceptionally long token, the readable lower bound includes a prefix measured from eight Latin graphemes or four CJK graphemes, plus the ellipsis and actual overflow-marker width. This bound still obeys the configured protection limit; an outlier cannot collapse to a one-pixel text track beside its suffix.

Break opportunities start with [Unicode line-breaking rules](https://www.unicode.org/reports/tr14/), with local protection for short compounds and marker attachment. The original source and DOM spelling remain unchanged. Actual DOM overflow is checked after layout because font shaping, embedded content and browser line boxes can differ from estimates.

## Objective and bounded search

Let `w[j]` be a content width, `d[i,j]` its full wrapped height, `H[i]` a candidate row height, `n[i,j]` the natural single-line width, and `e` the font size. The approximate score combines:

- Row whitespace: `Σ w[j] × max(0, H[i] − d[i,j]) / e²`. A lone tall cell pays for the empty area it imposes on shorter peers.
- Column whitespace: `0.14 × Σ max(0, w[j] − n[i,j]) × min(H[i], d[i,j]) / e²`. Widening a column pays for additional blank space in its short cells. Ordinary ragged endings in wrapped prose are excluded.
- Lost context: hidden lines divided by the square root of visible lines, with a fixed activation cost per clipped cell. Headers pay a stronger penalty; complete short cells needing at most two lines cannot be shortened by the row optimizer.
- Vertical reading cost, extra header lines, indivisible-token overflow, and horizontal travel.

Horizontal travel has a one-time opening cost and a smaller marginal cost per additional pixel. Thus ordinary tables prefer wrapping, while a table that already scrolls can widen a dense column enough to reduce excessive height. If most cells in a row remain very tall, four joint widening candidates are considered; changing just one column would not reduce that row's height.

Column upper candidates adapt to the content distribution: a prose-heavy column can grow more than one containing mostly checkmarks and one outlier. The configured protection limit still bounds text windows. The default protection grows from `48em` to at most `64em` for wide panes; it is a boundary, not a target width. An explicit application limit remains exact. Row-height candidates derive from actual cell demands and geometric intermediate heights, not fixed six- or eight-line thresholds.

A complete, single long-token header also receives a bounded near-fit check. Measured grapheme advances estimate two- and three-line thresholds; when a threshold is at most `1em` above the adaptive maximum, the maximum may snap upward to half-pixel precision without exceeding explicit protection. This avoids a lone final letter caused by a cap just below a real wrap boundary. The check examines at most 96 graphemes per token and 768 per table, with ten feasibility passes per line count. Atomic, partially measured, very long or non-monotone shaping inputs skip this optional refinement.

The optimizer uses up to 40 representative rows, 18 width candidates per column, three coordinate passes, and two bounded width-exchange rounds. It compares a content-balanced full-width seed and uses at most 768 score evaluations (96 above 48 columns), plus at most 256 spare-width trials. Each row has at most 24 height candidates. Intrinsic profiling and final row decisions still inspect the table; this does **not** make a million-cell table constant-time or virtualize its DOM. Selected-row scores cache wrapping at each tested width. Width plans and short glyph-run measurements have bounded caches.

This is a deterministic heuristic over candidate widths and row heights, not Knuth–Plass paragraph dynamic programming or a proof of a global optimum. [CSS 2 automatic table layout](https://www.w3.org/TR/CSS22/tables.html#auto-table-layout) and the [CSS Tables draft width-distribution model](https://drafts.csswg.org/css-tables-3/#width-distribution-algorithm) provide useful intrinsic-sizing concepts; LiMR additionally optimizes row/column whitespace, readable short tokens, and explicit overflow previews. The latter specification is a draft, not a claimed browser-conformance target.
