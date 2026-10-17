# Loading and memory performance

[Documentation](README.md) · [简体中文](../zh-CN/loading-performance.md)

This report measures complete inputs through `AsyncReader`, a real worker and default reading features. Loading mode controls when reading can begin; progressive display does not omit parsing, full source storage or global indexes.

LiMR **1.3.0** · React **19.3.0** · Chromium **156.0.8078.4** · Node **v20.19.5**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

## 50/75 MiB renderer comparison

Identical complete inputs are tested with LiMR **1.3.0**, react-markdown **10.1.0** and Markstream **2.0.19**. Four inputs each use three fresh browser processes per renderer, for 36 trials. Shared syntax covers Markdown/GFM, code, math and local images; LiMR-only translation/annotation syntax is excluded from comparative claims. Default animations, deferred rendering and windowing policies remain enabled.

| Shared input | UTF-8 MiB | UTF-16 | Complete units |
| --- | --- | --- | --- |
| prose-50 | 50.00 | 17,533,763 | 42765 |
| prose-75 | 75.00 | 26,300,383 | 64147 |
| rich-50 | 50.00 | 52,429,758 | 15913 |
| rich-75 | 75.00 | 78,643,854 | 23849 |

`prose` contains Chinese paragraphs. Each `rich` section has distinct IDs, code and formulas plus formatted prose, tables, tasks, quotes and local diagrams. All inputs retain complete final units and a tail sentinel. These shared corpora are generated deterministically by the repository script without external paper files.

| Integration | Configuration |
| --- | --- |
| LiMR | AsyncReader default blocking + standard worker; default modules, TOC, sidebar and motion; automatic body windows |
| react-markdown | ReactMarkdown + remark-gfm + remark-math + rehype-katex + async Shiki; full DOM |
| Markstream | MarkdownRender content + final=true; default virtualization/batching/lazy rendering/effects; package CSS + KaTeX + stream-diffs |

This compares application integrations through public APIs; DOM/UI work differs. No custom worker/windowing layer is added to peers and no default LiMR reading features are disabled. Each integration retains its styles/fonts, and actual body widths are recorded. All use 1440×1000 viewports with a prefetched Blob. First readability includes decoding, parsing, rendering, fonts and two frames, requiring the opening heading and paragraph to be visible; a shell or only the document end does not qualify. A mounted document end at scroll position zero with the opening still absent for five seconds also fails initial reading.

| Input / renderer | Reading checks | First readable s | Observed peak RSS MiB | RSS after 5s MiB |
| --- | --- | --- | --- | --- |
| prose-50 / LiMR | 3/3 | 1.46 [1.45–1.47] | 441.87 [439.55–443.57] | 425.18 [422.77–427.09] |
| prose-50 / react-markdown | 3/3 | 5.08 [5.05–5.09] | 993.66 [993.25–995.06] | 968.64 [967.20–968.88] |
| prose-50 / Markstream | 0/3; Content checks failed | — | 1579.10 [1576.41–1580.67] | — |
| prose-75 / LiMR | 3/3 | 2.13 [2.08–2.20] | 553.30 [496.80–575.27] | 470.78 [416.94–470.89] |
| prose-75 / react-markdown | 3/3 | 7.53 [7.50–7.54] | 1265.51 [1264.45–1269.10] | 1245.77 [1244.30–1246.06] |
| prose-75 / Markstream | 0/3; Content checks failed | — | 2327.94 [2320.22–2383.15] | — |
| rich-50 / LiMR | 3/3 | 19.28 [19.19–19.45] | 1318.04 [1315.74–1322.91] | 1255.48 [1014.33–1255.66] |
| rich-50 / react-markdown | 0/3; 6 GiB RSS guard | — | 6151.55 [6144.35–6152.21] | — |
| rich-50 / Markstream | 0/3; 6 GiB RSS guard | — | 6147.41 [6144.66–6151.62] | — |
| rich-75 / LiMR | 3/3 | 29.76 [29.33–30.10] | 1726.36 [1690.46–1747.95] | 1236.96 [1225.28–1243.86] |
| rich-75 / react-markdown | 0/3; 180s timeout | — | 4650.24 [4366.29–5580.74] | — |
| rich-75 / Markstream | 0/3; 6 GiB RSS guard | — | 6147.68 [6146.42–6149.86] | — |

Values are median [min–max] across three trials. Readability, idle memory and scrolling below include only runs passing content/environment checks; failed raw samples remain available. Every trial has the same 180-second and 6 GiB renderer-RSS guards. Observed peaks from interrupted runs are stopping points, not successful full-render peaks, and cannot establish lower memory cost. A responsive page without readable opening content fails at 170 seconds; an externally blocked page reaches the outer timeout. These guards are benchmark budgets, not theoretical library limits.

| Input / renderer | Steady P95 ms | Fast P95 ms | Initial DOM elements |
| --- | --- | --- | --- |
| prose-50 / LiMR | 16.90 | 16.80 | 88.00 |
| prose-50 / react-markdown | 16.90 | 16.90 | 42770.00 |
| prose-50 / Markstream | — | — | — |
| prose-75 / LiMR | 17.00 | 17.00 | 88.00 |
| prose-75 / react-markdown | 16.90 | 16.90 | 64152.00 |
| prose-75 / Markstream | — | — | — |
| rich-50 / LiMR | 17.10 | 17.30 | 383.00 |
| rich-50 / react-markdown | — | — | — |
| rich-50 / Markstream | — | — | — |
| rich-75 / LiMR | 17.30 | 17.20 | 383.00 |
| rich-75 / react-markdown | — | — | — |
| rich-75 / Markstream | — | — | — |

Reading checks visit the start, middle, end and start, requiring viewport content, the correct opening marker and visible tail sentinel. LiMR uses public source navigation across its compressed scroll range; peers use native scrollbar fractions, so seek timings are not ranked. Steady/fast scrolling each samples 60 frames. RSS includes workers/native allocations without forced GC; rAF is not physical display latency. Raw data includes GPU/browser identity, outcomes, errors, frames and sampling traces.

Comparison environment: **headless**; GPU renderer `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver-5.0.0)`, compositing `disabled_software`.

[large-comparison.json](../../benchmarks/results/large-comparison.json)

## Inputs and boundaries

Each loading combination uses three fresh browser processes at a 1440×1000 CSS viewport. Body, TOC, folded sidebar, animations, highlighting, math, images and automatic DOM windows stay enabled. The file is fetched as a Blob before timing; timing starts when it is passed to the component and includes UTF-8 decoding, worker parsing/indexing, transport/adoption and React mounting. Disk/network acquisition and corpus construction are excluded.

| Corpus | UTF-8 MiB | UTF-16 | Complete units |
| --- | --- | --- | --- |
| prose-50 | 50.00 | 17,533,776 | 42765 |
| prose-75 | 75.00 | 26,300,396 | 64147 |
| papers-50 | 50.20 | 42,038,406 | 85 |
| papers-75 | 75.00 | 62,810,262 | 127 |
| unique-rich-10 | 10.00 | 10,319,582 | 20778 |

`prose` consists of Chinese paragraphs. `papers` repeats the complete annotated Transformer and GPT survey documents, retaining tables, math, code, images and repeated definition IDs; the final paper is never truncated at the size target. It is not a uniquely authored 50/75 MiB document. `unique-rich` is 10 MiB of deterministic synthetic content with distinct section IDs, reference definitions and footnotes, testing a less deduplicable graph. Raw JSON retains byte/UTF-16 counts, units, hashes and structural counts. Paper text and media come from a local corpus and are not distributed with the repository.

## From input to readable content

Seconds, median [min–max]. Preview requires visible heading and paragraph from the current provisional engine followed by another frame. Complete readability requires the full engine, the same visibility checks, font readiness and another frame. DOM/frame proxies do not measure physical presentation or FCP/LCP. Blocking mode has no preview; progress reaches 100% only when the complete snapshot is ready.

| Case | Preview readable s | Complete ready s | Complete visible s | Checks |
| --- | --- | --- | --- | --- |
| prose-50 / blocking | — | 1.42 [1.41–1.47] | 1.42 [1.41–1.47] | 3/3 |
| prose-75 / progressive | 0.20 [0.19–0.20] | 2.07 [2.07–2.07] | 2.07 [2.07–2.07] | 3/3 |
| papers-50 / blocking | — | 29.17 [28.95–29.25] | 29.22 [29.00–29.30] | 3/3 |
| papers-50 / progressive | 0.38 [0.37–0.39] | 29.87 [29.82–29.87] | 29.88 [29.83–29.88] | 3/3 |
| papers-75 / blocking | — | 44.36 [44.27–44.37] | 44.42 [44.33–44.43] | 3/3 |
| papers-75 / progressive | 0.42 [0.42–0.42] | 45.25 [44.99–46.48] | 45.26 [45.00–46.49] | 3/3 |
| unique-rich-10 / blocking | — | 19.97 [19.85–20.00] | 20.01 [19.88–20.02] | 3/3 |
| prose-50 / blocking / KP | — | 1.42 [1.41–1.44] | 1.42 [1.41–1.44] | 3/3 |

## Memory: process, heap and buffers

MiB, median [min–max]. Linux `/proc` is sampled externally every 25ms across loading, idle and subsequent reading probes. Idle values follow five seconds after complete visible content; there is no forced GC. Renderer RSS includes main/worker threads, engine spaces and native allocations, rather than only live JS objects; sampling can miss shorter peaks. Main-isolate heap and backing storage are separately observed through CDP, exclude a separate worker heap and must not be added to RSS.

| Case | Peak renderer RSS | 5s idle RSS | Main JS heap | Main backing storage |
| --- | --- | --- | --- | --- |
| prose-50 / blocking | 442.75 [437.82–461.67] | 362.75 [353.64–413.52] | 101.96 | 2.18 |
| prose-75 / progressive | 553.48 [518.52–567.97] | 499.65 [417.87–523.17] | 201.86 | 1.84 |
| papers-50 / blocking | 1884.86 [1868.18–2097.52] | 1463.27 [1460.33–1723.99] | 322.42 | 219.60 |
| papers-50 / progressive | 2187.26 [2175.41–2192.09] | 1815.26 [1804.27–1818.84] | 335.08 | 219.23 |
| papers-75 / blocking | 2772.08 [2740.62–2788.71] | 2331.38 [2291.91–2351.94] | 471.92 | 327.24 |
| papers-75 / progressive | 2676.22 [2664.49–2785.95] | 2206.43 [2070.26–2406.17] | 507.84 | 326.62 |
| unique-rich-10 / blocking | 1045.50 [1041.70–1107.69] | 1024.71 [1016.38–1058.02] | 269.56 | 165.10 |
| prose-50 / blocking / KP | 452.03 [432.09–470.94] | 368.22 [365.21–437.53] | 117.61 | 2.23 |

There is no hard 2 GiB bound. Complete source, AST and indexes still grow with document complexity. Paged transport and string/shape deduplication reduce transfer overlap; the public snapshot is not an on-demand compressed disk store. DOM windows reduce mounting costs without removing the full syntax tree from memory. A single enormous list, table, fence or custom syntax can also exceed the windowing/bounded-parsing conditions.

## Reading after loading

After each large load, source seeks visit the top, 25%, 50%, 75%, end and top, checking visible body content, the final sentinel and horizontal overflow. Then 60 steady and 60 fast scroll frames are recorded. Values are medians of per-run rAF interval P95s, not exhaustive document coverage or input latency.

| Case | Steady P95 ms | Fast P95 ms | Initial DOM elements |
| --- | --- | --- | --- |
| prose-50 / blocking | 16.90 | 16.80 | 96 |
| prose-75 / progressive | 17.00 | 16.90 | 96 |
| papers-50 / blocking | 20.40 | 41.00 | 1145 |
| papers-50 / progressive | 19.70 | 31.70 | 1328 |
| papers-75 / blocking | 27.20 | 61.00 | 1145 |
| papers-75 / progressive | 26.00 | 45.30 | 1328 |
| unique-rich-10 / blocking | 17.20 | 29.30 | 642 |
| prose-50 / blocking / KP | 16.90 | 16.80 | 122 |

## Complete papers and interaction matrix

A separate 36-run AsyncReader matrix uses two complete original papers, three typography modes and two sidebar-folding settings, with three fresh pages per combination. Real workers, automatic windowing and default features stay enabled. Each page tests 480px/s reading, fast scrolling, 120 full-document seeks, translation switches at rest and during scrolling, and two resizes. Rows pool the two sidebar configurations into six runs per paper/typography; values are medians of per-run P95s.

| Paper / typography | Content checks | Environment verified | Steady P95 ms | Fast P95 ms | Seek P95 ms |
| --- | --- | --- | --- | --- | --- |
| Transformer / standard | 6/6 | 6/6 | 17.50 | 25.20 | 40.20 |
| Transformer / justify | 6/6 | 6/6 | 17.60 | 26.30 | 37.40 |
| Transformer / knuth-plass | 6/6 | 6/6 | 17.60 | 30.10 | 47.40 |
| GPT survey / standard | 6/6 | 6/6 | 17.50 | 22.50 | 37.70 |
| GPT survey / justify | 6/6 | 6/6 | 17.50 | 22.80 | 36.60 |
| GPT survey / knuth-plass | 6/6 | 6/6 | 17.50 | 26.70 | 51.00 |

Large inputs run **headless**; the paper matrix runs **headed**. Their timings are not pooled. Observed GPU renderers are `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver-5.0.0)` and `ANGLE (Microsoft Corporation, D3D12 (Intel(R) UHD Graphics 770), OpenGL 4.1 (Core Profile) Mesa 23.2.1-1ubuntu3.1~22.04.4)`, with compositing status `disabled_software` and `enabled`. Window mode does not itself establish hardware acceleration.

## Reproduction and raw data

The following command serially runs the comparison matrix, large-input loading and full-paper reading, then checks source, harness, Playground, example-plugin, lockfile and version fingerprints before generating reports and Home metrics. The paper stage defaults to headed Chromium and requires a graphical session; `BENCH_BROWSER_MODE=headless` can explicitly generate headless evidence instead. Do not run builds or other tests concurrently.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
BENCH_READING_SOURCE_DIR=/path/to/test-reading pnpm bench --extended
# Regenerate only, after all matching results exist:
BENCH_EXTENDED=1 pnpm bench:report
```

[loading.json](../../benchmarks/results/loading.json) · [reading.json](../../benchmarks/results/reading.json) · [Benchmark guide](../../benchmarks/README.md) · [Loading API and limits](large-documents.md) · [Rendering and streaming](performance.md).
