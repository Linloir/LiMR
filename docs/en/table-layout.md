# Table layout

[Documentation](README.md) · [简体中文](../zh-CN/table-layout.md)

LiMR computes table tracks in the core, measures rendered content in the React adapter, and uses the ordinary annotation UI for overflow. The same component serves the Playground and VS Code. Table layout does not depend on paragraph alignment or KP typography.

## Constraints and measurement

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
