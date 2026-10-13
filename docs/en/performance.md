# Performance and limits

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/performance) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

The first sections retain the repository's **2026-10-12 historical measurements** for comparison. The **2026-10-13** section below records this optimization's measurements. Neither set is a performance guarantee.

Environment: Intel Core i7-13700, WSL2/Linux, Node 20.19.5, Chromium 156.0.8078.4, React 19 production. Baseline: react-markdown 10.1.0 + remark-gfm 4.0.1.

## Browser

Both render equivalent GFM with the same typography, body only, excluding Reader navigation/sidebar. Values are medians of three isolated pages after warmup and font readiness, alternating renderer order. Timing includes synchronous React commits and forced layout, excluding network, asynchronous heavy resources, and idle frame time.

| Scenario | LiMR | react-markdown |
| --- | ---: | ---: |
| 87,381 characters, 200 sections, initial mount | 126.1 ms | 134.0 ms |
| 877,782 characters, 2,000 sections, initial mount | 1,345.4 ms | 1,437.6 ms |
| 34,860 characters, 138 streaming commits, total synchronous time | 306.1 ms | 1,864.1 ms |
| Same stream, per-commit P95 | 2.9 ms | 23.7 ms |

The final full parse is included. P95 does not mean every frame stays below 16ms. Raw data: [browser.json](../../benchmarks/results/browser.json).

## Selection and SSR

Historical long-document selection paint latency P95 was 25.2–28.5ms; code was 18.9–19.4ms. This measures selectionchange to paint-layer updates, not hardware input-to-display latency. The same automated drag took 3.23s in LiMR and 1.52s in the baseline; similar rAF intervals do not imply identical processing cost. Data: [selection.json](../../benchmarks/results/selection.json).

| Node scenario | LiMR | Baseline |
| --- | ---: | ---: |
| 87,381 characters, SSR | 123.85 ms | 135.80 ms |
| 877,782 characters, SSR | 5,508.29 ms | 2,720.70 ms |
| 34,860 characters, 137 core appends/finalization | 164.04 ms | 2,673.74 ms |

Large-document SSR varied substantially: LiMR samples were 2.64–9.10s and baseline 2.70–5.03s. These results show no SSR advantage. The append baseline reparses the entire prefix each time. Data: [node.json](../../benchmarks/results/node.json).

## Practical limits

Keeping the full DOM supports search, selection, and printing, but initial long-document rendering still costs time. Incremental parsing reuses stable prefixes; long tail blocks, document-scoped transforms, definition changes, middle edits, and finalization can remain expensive. Keep extensions/plugins stable and limit highlighting languages/length when appropriate.

The historical measurements above exclude full Reader layouts; the newer KP comparison below includes one complete Reader workload. Neither set covers large formula collections, Shiki cold starts, arbitrary dense annotations/plugins, or physical mobile devices. Installed font size also differs from browser transfers; see [styles and fonts](styles.md).

## Reproduce in the repository

```sh
NODE_ENV=production pnpm bench
pnpm exec vite build
pnpm exec vite preview --host 127.0.0.1 --port 4174
# In another terminal:
pnpm bench:browser
pnpm bench:selection
```

Avoid concurrent builds/benchmarks. Scripts write benchmarks/results. Reevaluate using your hardware, content, and built version rather than treating historical numbers as current-package acceptance.

## 2026-10-13: streaming and layout measurements

This compares the working implementation with pre-change commit `ebab991` in one process, using the same dependencies, UTF-16 input and chunk boundaries. Five warmed trials alternate order; values are the sample with median total time. Core append and finalization only: React, layout, async highlighting and network are excluded. Environment and raw samples: [streaming.json](../../benchmarks/results/streaming.json).

| Scenario | Characters | Before total | After total |
| --- | ---: | ---: | ---: |
| GFM | 34,860 | 139.22ms | 89.07ms |
| Default modules | 34,860 | 141.40ms | 94.63ms |
| Growing code fence | 43,209 | 1335.87ms | 29.05ms |
| Single long paragraph | 7,840 | 72.43ms | 74.32ms |

Changes include incremental line indexes, cached semantic facts for retained nodes, local finalization, an append path for growing code fences, and lazy code character maps. Complex growing paragraphs still need reparsing. Differences for a single long paragraph are small and subject to runtime variance; these results do not establish equal improvements for all content.

Run `pnpm bench:streaming` to measure the current core. For the alternating comparison, set `LIMR_BENCH_BASELINE` to a separate untouched checkout of `ebab991`, with the same dependencies available there. The script writes `benchmarks/results/streaming.json`; it does not recreate the historical hardware or timings.

Production Chromium 156, including synchronous React commits, forced layout, default typography and increment animations: a 34,860-character stream with default modules had **3.9ms P95**, 7.3ms maximum; a 43,211-character code stream had **2.6ms P95**, 12.4ms maximum. Three isolated font-ready pages per scenario, 256-character chunks; idle rAF time and async highlighting excluded. No old-browser-implementation comparison was made, and this is not physical-device input-to-display latency. Data: [streaming-browser.json](../../benchmarks/results/streaming-browser.json).

KP has a separate production benchmark using the complete scikit-learn Playground, including its TOC, sidebar and annotations. Three fresh pages per mode run three downward/upward sweeps each, then 32 viewport changes across 1100–1420px. The first sweep includes newly visible paragraphs; later sweeps reuse their typesetting. The table pools 1,080 scroll samples and 96 resize samples per mode, without CPU throttling.

| Measurement | Standard | Knuth–Plass |
| --- | ---: | ---: |
| Scroll median / P95 / maximum | 16.6 / 17.0 / 18.5ms | 16.6 / 19.8 / 46.5ms |
| Resize median / P95 / maximum | 11.2 / 24.1 / 31.9ms | 17.7 / 41.6 / 49.9ms |
| Scroll samples over 50ms | 0 / 1,080 | 0 / 1,080 |
| Resize samples over 50ms | 0 / 96 | 0 / 96 |

Source anchor lookup prunes unrelated source bindings and stops at the first visible character, avoiding a full KP DOM traversal for every sidebar item.

Scroll timings span `scrollTo` through the next rAF; resize timings include the viewport update, protocol overhead and the next rAF. KP still costs more during resizing, but this run did not reproduce the earlier long stalls. These are local Chromium measurements, not physical-device input latency or a guarantee for arbitrary plugins. Raw samples and exact boundaries: [layout.json](../../benchmarks/results/layout.json).

```sh
pnpm build:playground
pnpm preview:playground --port 4174
# In another terminal, with no concurrent build or test:
pnpm exec tsx benchmarks/layout.ts
BENCH_URL=http://127.0.0.1:4174/LiMR pnpm exec tsx benchmarks/streaming-browser.ts
```

Preparation caches font measurements, hyphenation, legal breakpoints and prefix sums independently of line width. Rendering uses a word-spacing run per line instead of an element per space. Width changes patch glue in place when the breaks match, or reuse text containers when they change. A shared synchronous measurement Range avoids retaining thousands of live ranges across DOM mutations. Highlight geometry is cached in paragraph coordinates, adjacent KP paint fragments merge into lines, and paint writes do not force a layout per rectangle. Viewport-mask coordinates do not inherit into the article. Scrolling retains typeset nodes and does not rerun the paragraph solver.
