# Knuth–Plass typography performance

[Documentation](README.md) · [简体中文](../zh-CN/knuth-plass-performance.md)

LiMR’s `typography="knuth-plass"` provides paragraph-level optimization of line breaks, spacing and hyphenation while retaining native text selection, copying and highlights. This page covers solver throughput and full-paper reading on desktop, narrow viewports and changing widths.

A 10,000-word synthetic paragraph takes a median **6.826ms** to prepare and solve, or **6.722ms** with preparation retained. KP’s pooled scrolling rAF P95 for the full paper is **17.00ms** on desktop and **17.10ms** in the narrow viewport. Browser acceptance passes **18/18** across all three modes.

## Solver throughput and width reuse

The solver represents content as boxes, glue and penalties. Active nodes find a minimum-demerit path across the paragraph, accounting for line fitness, adjacent-line differences and hyphens. `prepareKnuthPlass` retains width/stretch/shrink prefix sums and breakpoint helpers for solving the same paragraph at different widths.

Inputs use deterministic synthetic pixel widths, with 3 warmups and 15 samples per operation. Small inputs are batched and normalized per call. Values below are ms: median / P95 / maximum. “Prepare” means building solver prefix data; input creation, hyphenation and glyph measurement are separate integration work.

| Scenario | Words / items / lines | Prepare + solve | Prepared solve | 12-width total | Pass |
| --- | --- | --- | --- | --- | --- |
| words-50 | 50 / 102 / 4 | 0.009 / 0.142 / 0.142 | 0.007 / 0.101 / 0.101 | 0.079 / 0.508 / 0.508 | pretolerance |
| words-200 | 200 / 402 / 14 | 0.058 / 0.272 / 0.272 | 0.050 / 0.061 / 0.061 | 0.488 / 0.557 / 0.557 | pretolerance |
| words-1000 | 1000 / 2002 / 70 | 0.608 / 1.241 / 1.241 | 0.567 / 1.006 / 1.006 | 4.516 / 7.066 / 7.066 | pretolerance |
| words-5000 | 5000 / 10002 / 349 | 3.375 / 4.206 / 4.206 | 3.162 / 4.118 / 4.118 | 25.822 / 28.718 / 28.718 | pretolerance |
| words-10000 | 10000 / 20002 / 698 | 6.826 / 7.670 / 7.670 | 6.722 / 7.491 / 7.491 | 52.182 / 56.220 / 56.220 | pretolerance |
| narrow | 1000 / 2002 / 191 | 0.123 / 0.210 / 0.210 | 0.092 / 0.158 / 0.158 | 4.419 / 4.644 / 4.644 | emergency |
| discretionary-hyphens | 1000 / 4002 / 146 | 2.111 / 2.295 / 2.295 | 1.935 / 2.144 / 2.144 | 19.831 / 20.481 / 20.481 | tolerance |
| varying-line-width | 1000 / 2002 / 71 | 1.424 / 1.504 / 1.504 | 1.385 / 1.438 / 1.438 | 5.574 / 5.975 / 5.975 | emergency |
| looseness | 200 / 402 / 24 | 0.127 / 0.143 / 0.143 | 0.113 / 0.125 / 0.125 | 1.318 / 1.489 / 1.489 | emergency |
| emergency-stretch | 3 / 8 / 2 | 0.008 / 0.010 / 0.010 | 0.007 / 0.016 / 0.016 | 0.033 / 0.054 / 0.054 | emergency |
| overfull-atomic | 1 / 4 / 1 | 0.001 / 0.002 / 0.002 | 0.001 / 0.002 / 0.002 | 0.012 / 0.019 / 0.019 | emergency |

The 12-width operation spans 240–680px in 40px steps and reports the total for solving and path checks. Cases include narrow columns, hyphens, varying line widths, looseness, emergency stretch and indivisible objects. Checks verify ordered breaks, complete coverage, finite demerits and agreement between direct and prepared solving.

## Desktop and narrow-viewport reading

The browser scenario uses the complete scikit-learn paper (23,713 UTF-16 code units) in the production Playground, retaining the Reader TOC, sidebar and plugins. Standard, CSS justify and KP each run in 1380×1000 and 390×1000 Chromium viewports, with 3 fresh pages per group.

KP schedules paragraphs as they approach the viewport, batches font measurements and layout writes, and retains typeset nodes for revisiting. Each page performs three 120-step down/up sweeps: the first reaches new paragraphs, and the next two revisit existing layout.

| Viewport / mode | Passed | First sweep rAF P95 / max ms | Revisit rAF P95 / max ms | >50ms frames |
| --- | --- | --- | --- | --- |
| 1380 / standard | 3/3 | 17.00 / 17.40 | 17.00 / 18.80 | 0 / 1080 |
| 1380 / justify | 3/3 | 16.90 / 17.90 | 17.00 / 19.40 | 0 / 1080 |
| 1380 / knuth-plass | 3/3 | 17.00 / 20.90 | 17.00 / 18.00 | 0 / 1080 |
| 390 / standard | 3/3 | 17.30 / 18.50 | 17.10 / 17.50 | 0 / 1080 |
| 390 / justify | 3/3 | 17.10 / 17.90 | 17.10 / 17.70 | 0 / 1080 |
| 390 / knuth-plass | 3/3 | 17.10 / 18.00 | 17.10 / 17.60 | 0 / 1080 |

Scroll statistics pool 1,080 frames per viewport/mode group. rAF measures scrollTo to the next animation-frame callback. Pure solver timings appear in the preceding table.

## Responsive layout across changing widths

Each page visits viewport widths of 1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200 and 1380px, recording actual paragraph widths. rAF measures the first callback; settling requires four consecutive matching visible-layout frames and includes browser-protocol and detection waits.

| Initial viewport / mode | rAF P50 / P95 / max ms | Settled P50 / P95 / max ms | Paragraph width px |
| --- | --- | --- | --- |
| 1380 / standard | 28.10 / 54.20 / 54.60 | 112.80 / 132.80 / 133.50 | 350–900 |
| 1380 / justify | 28.40 / 54.00 / 55.50 | 113.50 / 129.30 / 132.90 | 350–900 |
| 1380 / knuth-plass | 40.80 / 62.60 / 63.70 | 114.90 / 146.50 / 151.60 | 350–900 |
| 390 / standard | 29.80 / 74.80 / 87.80 | 114.40 / 162.80 / 166.20 | 350–900 |
| 390 / justify | 29.80 / 77.70 / 79.20 | 115.10 / 164.40 / 167.00 | 350–900 |
| 390 / knuth-plass | 47.00 / 90.00 / 94.00 | 117.40 / 180.20 / 198.10 | 350–900 |

## Interaction integrity and resource use

Layout checks cover source text, native selections across width changes, retained KP nodes after revisiting, settled visible paragraphs and horizontal overflow. Browser regression tests also cover mixed Chinese/English, inline code and math, copying, highlight geometry and font-size changes.

| Initial viewport / mode | Scroll main thread ms | Final JS heap MiB | DOM | Text / native range / cache retained |
| --- | --- | --- | --- | --- |
| 1380 / standard | 1026.27 | 12.58 | 867 | 3/3 / 3/3 / N/A |
| 1380 / justify | 1011.56 | 13.12 | 867 | 3/3 / 3/3 / N/A |
| 1380 / knuth-plass | 1225.45 | 18.49 | 1758 | 3/3 / 3/3 / 3/3 |
| 390 / standard | 816.00 | 11.03 | 867 | 3/3 / 3/3 / N/A |
| 390 / justify | 816.59 | 13.03 | 867 | 3/3 / 3/3 / N/A |
| 390 / knuth-plass | 1038.42 | 16.71 | 2174 | 3/3 / 3/3 / 3/3 |

Main-thread values are medians across pages of cumulative TaskDuration for all three sweeps. JS heap and DOM are sampled after scrolling and resizing, at a 390px viewport and after explicit GC; resource values are medians across pages.

## Environment and reproduction

LiMR **1.3.0** · React **19.3.0** · Node **v20.19.5** · Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

Measurements run sequentially against a local production build without CPU or network throttling. Narrow-screen results use Chromium viewport simulation. P95 uses nearest-rank calculation; with 15 algorithm samples, P95 equals the maximum.

```sh
pnpm bench:kp
pnpm build:playground
pnpm preview:playground --port 4174
# Once the preview server is ready, run in another terminal
pnpm bench:layout
```

[kp-algorithm.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/kp-algorithm.json) · [kp-browser.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/kp-browser.json) · [Benchmark methodology](https://github.com/Linloir/LiMR/blob/main/benchmarks/README.md) · [Rendering performance](performance.md).
