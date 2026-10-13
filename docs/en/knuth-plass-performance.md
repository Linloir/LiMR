# Knuth–Plass performance report

[Documentation](README.md) · [简体中文](../zh-CN/knuth-plass-performance.md)

Measured on **2026-10-14 (Asia/Shanghai)**. LiMR **1.0.1**, react-markdown **10.1.0**, Markstream React **2.0.19**, React/React DOM **19.3.0**, Node **v20.19.5**, Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

KP is the optional `typography="knuth-plass"` paragraph layout mode. This report separates the pure solver, browser layout and interaction correctness. Standard, CSS justify and KP are measured as three current typography modes.

## Algorithm and execution path

The implementation uses box/glue/penalty, four fitness classes, TeX integer badness, adjacent-line and hyphen demerits, and active nodes to find a minimum-demerit path. It tries pretolerance, tolerance and emergency passes with default thresholds 100/200 and emergencyStretch=16px. Indivisible overfull content remains visible. `prepareKnuthPlass` retains width/stretch/shrink prefix sums and breakpoint helpers; a new width still invokes solving rather than returning a cached answer.

Browser work additionally includes Unicode line breaking, Knuth–Liang en-US hyphenation, font measurement, line DOM/spacing writes, selection and highlight geometry. Near-viewport paragraphs are queued with batched reads/writes; typeset nodes survive scrolling. The scheduler checks an approximately 6ms budget between jobs; it cannot interrupt one costly paragraph. Active-list size depends on input, widths, looseness and passes, so the measured scaling is not a worst-case complexity proof.

[Solver source](https://github.com/Linloir/LiMR/blob/main/src/core/knuth-plass.ts) · [Browser integration](https://github.com/Linloir/LiMR/blob/main/src/react/knuth-plass-layout.ts) · [Independent exhaustive correctness tests](https://github.com/Linloir/LiMR/blob/main/tests/knuth-plass.test.ts).

## Pure algorithm: scaling and re-solving

Deterministic synthetic pixel-width inputs, three warmups and 15 cyclic samples per operation. Small inputs are batched and normalized per call to reduce timer noise; batch sizes and raw values are in JSON. Input creation, hyphenation and glyph measurement are excluded. “Prepare + solve” includes prefix-array preparation and solving only; “Prepared solve” retains arrays but still runs the solver. Values are ms, median / P95 / max; with 15 samples, nearest-rank P95 equals the maximum.

| Scenario | Words / items / lines | Prepare + solve | Prepared solve | 12-width total | pass |
| --- | --- | --- | --- | --- | --- |
| words-50 | 50 / 102 / 4 | 0.010 / 0.125 / 0.125 | 0.007 / 0.095 / 0.095 | 0.083 / 0.266 / 0.266 | pretolerance |
| words-200 | 200 / 402 / 14 | 0.076 / 0.191 / 0.191 | 0.064 / 0.083 / 0.083 | 0.614 / 0.856 / 0.856 | pretolerance |
| words-1000 | 1000 / 2002 / 70 | 0.676 / 0.790 / 0.790 | 0.633 / 0.947 / 0.947 | 4.842 / 6.527 / 6.527 | pretolerance |
| words-5000 | 5000 / 10002 / 349 | 3.673 / 4.118 / 4.118 | 3.452 / 4.146 / 4.146 | 26.830 / 29.383 / 29.383 | pretolerance |
| words-10000 | 10000 / 20002 / 698 | 7.479 / 8.371 / 8.371 | 6.721 / 10.462 / 10.462 | 54.282 / 70.513 / 70.513 | pretolerance |
| narrow | 1000 / 2002 / 191 | 0.132 / 0.170 / 0.170 | 0.111 / 0.156 / 0.156 | 4.694 / 5.156 / 5.156 | emergency |
| discretionary-hyphens | 1000 / 4002 / 146 | 2.177 / 2.719 / 2.719 | 2.069 / 2.690 / 2.690 | 20.573 / 23.961 / 23.961 | tolerance |
| varying-line-width | 1000 / 2002 / 71 | 1.509 / 1.736 / 1.736 | 1.439 / 1.605 / 1.605 | 6.317 / 7.265 / 7.265 | emergency |
| looseness | 200 / 402 / 24 | 0.138 / 0.159 / 0.159 | 0.116 / 0.135 / 0.135 | 1.412 / 1.477 / 1.477 | emergency |
| emergency-stretch | 3 / 8 / 2 | 0.010 / 0.011 / 0.011 | 0.007 / 0.011 / 0.011 | 0.041 / 0.049 / 0.049 | emergency |
| overfull-atomic | 1 / 4 / 1 | 0.001 / 0.002 / 0.002 | 0.001 / 0.001 / 0.001 | 0.012 / 0.026 / 0.026 | emergency |

The 12-width operation covers 240–680px in 40px steps and includes complete-path checks; it is not one browser resize. Cases cover narrow columns, discretionary hyphens, varying line widths, looseness, emergency stretch and overfull atomic content. Each checks increasing breaks, terminal coverage and finite demerits; direct and prepared results must agree. Separate unit tests exhaustively enumerate partitions of 64 nine-word paragraphs and check minimum cost, hyphens and forced breaks.

## Real browser: full paper reading

Input: scikit-learn, 23,713 UTF-16 characters; SHA-256 `f7408f07175f81df3c86b256c03fce1e4dc4b11ba8661780d3735df5a1bed197`.

Production Playground retains Reader TOC, sidebar and plugins. Standard, justify and KP each run three fresh pages at 1380×1000 and 390×1000 (18 total). The paper and fonts load first. KP activation includes menu/protocol and lazy module loading, whereas standard only waits for stability; activation is not a fair mount-time algorithm comparison. Each page performs three 120-step down/up sweeps; the first encounters new paragraphs and the other two revisit cached layout.

| Viewport / mode | Passed | Activation stable ms | First sweep P95 / max | Revisit P95 / max | >50ms frames |
| --- | --- | --- | --- | --- | --- |
| 1380 / standard | 3/3 | 83.10 | 17.10 / 22.80 | 17.00 / 23.10 | 0 / 1080 |
| 1380 / justify | 3/3 | 1023.30 | 19.00 / 24.10 | 18.90 / 23.10 | 0 / 1080 |
| 1380 / knuth-plass | 3/3 | 263.50 | 20.10 / 29.00 | 19.60 / 29.90 | 0 / 1080 |
| 390 / standard | 3/3 | 76.80 | 17.10 / 19.00 | 17.00 / 36.90 | 0 / 1080 |
| 390 / justify | 3/3 | 1007.30 | 17.00 / 17.90 | 17.00 / 29.90 | 0 / 1080 |
| 390 / knuth-plass | 3/3 | 228.60 | 17.10 / 17.80 | 17.00 / 17.40 | 0 / 1080 |

Scroll frames are pooled by viewport/mode (1,080 per group), measured from scrollTo to the next rAF callback, not completed paint. Raw sequences retain every frame above 50ms.

### Viewport changes and stable layout

Each page visits widths 1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200 and 1380px, recording actual paragraph widths. Each change measures next rAF and four consecutive stable visible-layout frames. Settling includes protocol and the detection delay; it is not pure solver time.

| Initial viewport / mode | rAF P50 / P95 / max ms | Stable P50 / P95 / max ms | Paragraph width px |
| --- | --- | --- | --- |
| 1380 / standard | 29.50 / 49.60 / 50.10 | 115.00 / 118.00 / 118.80 | 350–900 |
| 1380 / justify | 30.70 / 49.10 / 50.80 | 114.90 / 117.00 / 117.30 | 350–900 |
| 1380 / knuth-plass | 40.60 / 64.10 / 66.50 | 114.80 / 133.10 / 133.40 | 350–900 |
| 390 / standard | 31.50 / 66.20 / 68.80 | 115.70 / 132.70 / 133.30 | 350–900 |
| 390 / justify | 31.10 / 70.00 / 81.80 | 115.70 / 133.80 / 149.10 | 350–900 |
| 390 / knuth-plass | 48.50 / 87.60 / 108.30 | 116.50 / 165.80 / 198.60 | 350–900 |

### Main thread, memory and correctness

| Initial viewport / mode | Scroll TaskDuration ms | Final heap MiB | DOM | Text / native range / cache retained |
| --- | --- | --- | --- | --- |
| 1380 / standard | 1376.51 | 10.42 | 726 | 3/3 / 3/3 / N/A |
| 1380 / justify | 2480.23 | 10.98 | 726 | 3/3 / 3/3 / N/A |
| 1380 / knuth-plass | 2840.47 | 16.15 | 1679 | 3/3 / 3/3 / 3/3 |
| 390 / standard | 1132.12 | 10.29 | 726 | 3/3 / 3/3 / N/A |
| 390 / justify | 770.76 | 9.04 | 726 | 3/3 / 3/3 / N/A |
| 390 / knuth-plass | 1103.83 | 14.33 | 2080 | 3/3 / 3/3 / 3/3 |

Heap/DOM are sampled after scrolling and resizing, at final 390px and after explicit GC. Checks cover first-paragraph text, native Range across resize, cached first-paragraph nodes after scrolling, visible stale markers and horizontal overflow; failures remain in raw data. Browser regressions additionally verify mixed Chinese/English, inline code/math, copying, highlight geometry and font-size changes.

Browser acceptance: **18/18**.

## Interpretation and limits

For the 10,000-word synthetic paragraph, median preparation + solving is **7.479ms**, and solving with preparation retained is **6.721ms**. Pooled desktop paper scrolling P95 is **17.00ms** for standard and **19.70ms** for KP. KP has higher DOM and main-thread costs; resizing adds the overhead shown above.

The microbenchmark describes cost for the measured inputs and paths; perceived delay also depends on fonts, paragraph count, DOM and scheduling. Long paragraphs and changing widths can add KP work; cached scrolling does not imply free typography. Standard is the default for minimal typesetting work; evaluate KP using real content, narrow columns and target devices when paragraph optimization is needed. Browser glyph measurements do not promise pixel-identical TeX PDFs. This run does not cover every language dictionary, pathological negative widths, arbitrary looseness or physical low-end phones, and does not compare execution speed with native TeX.

## Reproduction and raw data

```sh
pnpm bench:kp
pnpm build:playground
pnpm preview:playground --port 4174
# In another terminal, after the build has finished
pnpm bench:layout
```

[kp-algorithm.json](../../benchmarks/results/kp-algorithm.json) · [kp-browser.json](../../benchmarks/results/kp-browser.json) · [All benchmark instructions](../../benchmarks/README.md) · [Renderer comparison](performance.md).
