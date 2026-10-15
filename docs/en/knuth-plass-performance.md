# Knuth–Plass typography performance

[Documentation](README.md) · [简体中文](../zh-CN/knuth-plass-performance.md)

LiMR’s `typography="knuth-plass"` provides paragraph-level optimization of line breaks, spacing and hyphenation while retaining native text selection, copying and highlights. This page covers solver throughput and full-paper reading on desktop, narrow viewports and changing widths.

A 10,000-word synthetic paragraph takes a median **8.184ms** to prepare and solve, or **7.647ms** with preparation retained. KP’s pooled scrolling rAF P95 for the full paper is **19.40ms** on desktop and **17.20ms** in the narrow viewport. Browser acceptance passes **18/18** across all three modes.

## Solver throughput and width reuse

The solver represents content as boxes, glue and penalties. Active nodes find a minimum-demerit path across the paragraph, accounting for line fitness, adjacent-line differences and hyphens. `prepareKnuthPlass` retains width/stretch/shrink prefix sums and breakpoint helpers for solving the same paragraph at different widths.

Inputs use deterministic synthetic pixel widths, with 3 warmups and 15 samples per operation. Small inputs are batched and normalized per call. Values below are ms: median / P95 / maximum. “Prepare” means building solver prefix data; input creation, hyphenation and glyph measurement are separate integration work.

| Scenario | Words / items / lines | Prepare + solve | Prepared solve | 12-width total | Pass |
| --- | --- | --- | --- | --- | --- |
| words-50 | 50 / 102 / 4 | 0.011 / 0.130 / 0.130 | 0.008 / 0.124 / 0.124 | 0.102 / 0.669 / 0.669 | pretolerance |
| words-200 | 200 / 402 / 14 | 0.064 / 0.328 / 0.328 | 0.055 / 0.071 / 0.071 | 0.518 / 0.590 / 0.590 | pretolerance |
| words-1000 | 1000 / 2002 / 70 | 0.665 / 1.550 / 1.550 | 0.621 / 0.677 / 0.677 | 4.971 / 6.376 / 6.376 | pretolerance |
| words-5000 | 5000 / 10002 / 349 | 4.253 / 6.874 / 6.874 | 3.854 / 12.317 / 12.317 | 32.124 / 93.977 / 93.977 | pretolerance |
| words-10000 | 10000 / 20002 / 698 | 8.184 / 9.788 / 9.788 | 7.647 / 11.113 / 11.113 | 60.342 / 67.868 / 67.868 | pretolerance |
| narrow | 1000 / 2002 / 191 | 0.149 / 0.254 / 0.254 | 0.102 / 0.171 / 0.171 | 4.907 / 5.394 / 5.394 | emergency |
| discretionary-hyphens | 1000 / 4002 / 146 | 2.248 / 2.744 / 2.744 | 2.094 / 2.327 / 2.327 | 21.375 / 22.056 / 22.056 | tolerance |
| varying-line-width | 1000 / 2002 / 71 | 1.538 / 1.689 / 1.689 | 1.511 / 1.727 / 1.727 | 6.248 / 7.128 / 7.128 | emergency |
| looseness | 200 / 402 / 24 | 0.137 / 0.178 / 0.178 | 0.114 / 0.173 / 0.173 | 1.436 / 1.829 / 1.829 | emergency |
| emergency-stretch | 3 / 8 / 2 | 0.008 / 0.011 / 0.011 | 0.007 / 0.023 / 0.023 | 0.033 / 0.054 / 0.054 | emergency |
| overfull-atomic | 1 / 4 / 1 | 0.001 / 0.001 / 0.001 | 0.001 / 0.001 / 0.001 | 0.011 / 0.022 / 0.022 | emergency |

The 12-width operation spans 240–680px in 40px steps and reports the total for solving and path checks. Cases include narrow columns, hyphens, varying line widths, looseness, emergency stretch and indivisible objects. Checks verify ordered breaks, complete coverage, finite demerits and agreement between direct and prepared solving.

## Desktop and narrow-viewport reading

The browser scenario uses the complete scikit-learn paper (23,713 UTF-16 code units) in the production Playground, retaining the Reader TOC, sidebar and plugins. Standard, CSS justify and KP each run in 1380×1000 and 390×1000 Chromium viewports, with 3 fresh pages per group.

KP schedules paragraphs as they approach the viewport, batches font measurements and layout writes, and retains typeset nodes for revisiting. Each page performs three 120-step down/up sweeps: the first reaches new paragraphs, and the next two revisit existing layout.

| Viewport / mode | Passed | First sweep rAF P95 / max ms | Revisit rAF P95 / max ms | >50ms frames |
| --- | --- | --- | --- | --- |
| 1380 / standard | 3/3 | 17.20 / 18.10 | 17.20 / 19.00 | 0 / 1080 |
| 1380 / justify | 3/3 | 19.20 / 23.70 | 19.10 / 32.30 | 0 / 1080 |
| 1380 / knuth-plass | 3/3 | 19.70 / 25.90 | 19.20 / 27.00 | 0 / 1080 |
| 390 / standard | 3/3 | 17.40 / 18.50 | 17.30 / 19.10 | 0 / 1080 |
| 390 / justify | 3/3 | 17.10 / 18.10 | 17.10 / 17.70 | 0 / 1080 |
| 390 / knuth-plass | 3/3 | 17.20 / 18.10 | 17.10 / 18.20 | 0 / 1080 |

Scroll statistics pool 1,080 frames per viewport/mode group. rAF measures scrollTo to the next animation-frame callback. Pure solver timings appear in the preceding table.

## Responsive layout across changing widths

Each page visits viewport widths of 1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200 and 1380px, recording actual paragraph widths. rAF measures the first callback; settling requires four consecutive matching visible-layout frames and includes browser-protocol and detection waits.

| Initial viewport / mode | rAF P50 / P95 / max ms | Settled P50 / P95 / max ms | Paragraph width px |
| --- | --- | --- | --- |
| 1380 / standard | 30.60 / 50.00 / 60.20 | 115.00 / 117.60 / 131.70 | 350–900 |
| 1380 / justify | 30.80 / 47.70 / 48.80 | 115.20 / 117.00 / 117.40 | 350–900 |
| 1380 / knuth-plass | 41.00 / 60.80 / 68.60 | 115.30 / 135.20 / 149.00 | 350–900 |
| 390 / standard | 30.90 / 57.10 / 67.00 | 115.30 / 117.40 / 135.10 | 350–900 |
| 390 / justify | 31.40 / 61.40 / 75.60 | 115.60 / 134.00 / 149.50 | 350–900 |
| 390 / knuth-plass | 50.70 / 93.60 / 108.70 | 116.00 / 183.20 / 216.00 | 350–900 |

## Interaction integrity and resource use

Layout checks cover source text, native selections across width changes, retained KP nodes after revisiting, settled visible paragraphs and horizontal overflow. Browser regression tests also cover mixed Chinese/English, inline code and math, copying, highlight geometry and font-size changes.

| Initial viewport / mode | Scroll main thread ms | Final JS heap MiB | DOM | Text / native range / cache retained |
| --- | --- | --- | --- | --- |
| 1380 / standard | 1443.87 | 10.73 | 726 | 3/3 / 3/3 / N/A |
| 1380 / justify | 2323.62 | 11.28 | 726 | 3/3 / 3/3 / N/A |
| 1380 / knuth-plass | 2625.42 | 16.48 | 1679 | 3/3 / 3/3 / 3/3 |
| 390 / standard | 1084.11 | 11.05 | 726 | 3/3 / 3/3 / N/A |
| 390 / justify | 715.83 | 10.91 | 726 | 3/3 / 3/3 / N/A |
| 390 / knuth-plass | 1042.43 | 16.17 | 2071 | 3/3 / 3/3 / 3/3 |

Main-thread values are medians across pages of cumulative TaskDuration for all three sweeps. JS heap and DOM are sampled after scrolling and resizing, at a 390px viewport and after explicit GC; resource values are medians across pages.

## Environment and reproduction

LiMR **1.1.0** · React **19.3.0** · Node **v20.19.5** · Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

Measurements run sequentially against a local production build without CPU or network throttling. Narrow-screen results use Chromium viewport simulation. P95 uses nearest-rank calculation; with 15 algorithm samples, P95 equals the maximum.

```sh
pnpm bench:kp
pnpm build:playground
pnpm preview:playground --port 4174
# Once the preview server is ready, run in another terminal
pnpm bench:layout
```

[kp-algorithm.json](../../benchmarks/results/kp-algorithm.json) · [kp-browser.json](../../benchmarks/results/kp-browser.json) · [Benchmark methodology](../../benchmarks/README.md) · [Rendering performance](performance.md).
