# Renderer performance report

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

LiMR combines rich Markdown, streaming output and interactive annotations with responsive updates and reading. The measurements below cover full-document mounting, incremental streaming, and reading with default modules and animations enabled.

## Performance at a glance

- **About 1.07 seconds to mount a long document**: all 877,782 UTF-16 characters rendered.
- **Lowest cumulative synchronous time in 3/4 streaming scenarios**: compared with react-markdown and Markstream on identical mixed-content, code, table and paragraph inputs.
- **4.0ms rich-stream update P95**: default modules, animations, styles and fonts remain enabled.
- **9/9 desktop, long-document and narrow-screen reading checks passed**: covering initial content, scrolling and document seeks.

## Streaming output

Content arrives in chunks of 256 UTF-16 characters, measuring the update cost of continuously generated Markdown. Each scenario uses identical input and neutral styling. Values are median [min–max] across five independent pages, in ms: cumulative synchronous commit time including React updates and layout.

| Content / characters | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Mixed content / 34,860 | 293.70 [287.70–303.00] | 1724.50 [1701.90–1756.80] | 299.80 [294.60–311.70] |
| Code block / 34,488 | 162.60 [148.30–199.00] | 323.90 [301.40–329.20] | 218.10 [171.50–232.40] |
| Table / 30,922 | 1440.40 [1426.30–1457.90] | 1699.50 [1690.20–1719.70] | 628.60 [622.70–655.80] |
| Long paragraph / 32,500 | 791.10 [785.90–795.20] | 1370.20 [1339.10–1400.70] | 913.70 [892.80–930.20] |

### Per-update responsiveness

The table shows the median of five per-run update P95s, in ms. Synchronous commit timing excludes the frame waits between updates and asynchronous resource loading.

| Content | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Mixed content | 3.50 | 22.50 | 3.30 |
| Code block | 1.90 | 4.00 | 2.60 |
| Table | 21.00 | 24.70 | 8.20 |
| Long paragraph | 10.30 | 19.10 | 12.80 |

## Long-document mounting and resource use

From short articles to approximately 878,000 characters, full-document mounting retains the complete article DOM for native browser selection and document navigation. Values are mount-time median [min–max] across five independent pages, in ms.

| Document / characters | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Short document / 8,700 | 21.00 [19.30–21.20] | 17.30 [16.60–18.10] | 15.40 [14.70–16.50] |
| Medium document / 87,381 | 117.10 [113.40–119.90] | 106.10 [104.50–107.10] | 91.40 [90.50–96.50] |
| Long document / 877,782 | 1070.50 [1036.00–1083.60] | 1095.60 [1085.50–1130.10] | 733.00 [722.50–753.30] |

Retained JS heap and article DOM for the same long document:

| Renderer | Incremental JS heap MiB | Article elements |
| --- | --- | --- |
| LiMR | 76.87 | 76014 |
| react-markdown | 13.09 | 36001 |
| Markstream | 126.33 | 152001 |

JS heap is the post-GC increment over a warmed empty page; DOM counts cover article elements.

## Reading with rich features enabled

Rich streaming combines TypeScript, Python, JSON, formulas, tables, tasks and local images. LiMR retains its default modules, animations, styles and fonts. Each renderer runs on three resource-warmed pages, with section and rich-content validation.

| Renderer | Content checks | Cumulative commit time ms | Update P95 ms |
| --- | --- | --- | --- |
| LiMR | 3/3 | 188.90 | 4.00 |
| react-markdown | 3/3 | 1122.20 | 17.10 |
| Markstream | 3/3 | 202.50 | 3.30 |

LiMR reading scenarios cover a 1440×900 desktop viewport and a 390×900 narrow viewport. The long document contains 240 sections, 240 code blocks, 480 formulas and 30 local images. Each scenario uses three cold browser contexts, scrolling in both directions and seeking to the middle, end and top.

| LiMR reading scenario | Content checks | First readable content ms | Scroll frame interval P95 ms |
| --- | --- | --- | --- |
| Desktop reading | 3/3 | 261.70 | 16.70 |
| Long desktop document | 3/3 | 1565.30 | 33.30 |
| Narrow-screen reading | 3/3 | 258.40 | 16.80 |

First readable content is confirmed by DOM checks and two rAF callbacks, timed from navigation. Scroll P95 measures rAF intervals. Narrow screens are simulated with a Chromium viewport.

For complete-input worker loading, progressive previews, 50/75 MiB peak and idle memory, and real-paper interactions, see [Loading and memory performance](loading-performance.md). Those end-to-end pipeline measurements are separate from synchronous commit timings above.

## Interactive selection and annotations

LiMR updates its highlight overlay while selections are dragged through 2,000 prose sections or 1,000 lines of code. Each scenario performs continuous pointer movement on three font-ready pages.

| LiMR scenario | Frame interval P95 ms | Overlay update P95 ms |
| --- | --- | --- |
| Prose selection | 50.00 | 63.70 |
| Code selection | 16.80 | 20.50 |

Overlay updates are timed from selectionchange to DOM mutation. For paragraph typography and its measurements, see the [Knuth–Plass performance report](knuth-plass-performance.md).

## Methodology and reproduction

LiMR **1.3.0** · React **19.3.0** · Node **v20.19.5** · Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

react-markdown **10.1.0** · Markstream React **2.0.19**.

Production builds run in Chromium on the same machine, without CPU or network throttling. Versions are pinned by the lockfile. Tables use nearest-rank quantiles and medians of independent runs unless stated otherwise. Three to five trials describe performance on these inputs.

| Profile | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Full DOM and controlled streaming | Markdown + gfm; interactive=false; streamEffect=false | remark-gfm | Virtualization, batching, deferred rendering and effects off; native pre |
| Rich content | Default modules, effects, styles and font | remark-gfm + remark-math + rehype-katex + async Shiki | Default MarkdownRender; stream-diffs and KaTeX |

Controlled scenarios share neutral CSS. Rich scenarios use each integration’s styles, fonts and loading strategy. Structure and text are validated outside timing. Raw data includes per-run timings, resources and configuration.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm bench
```

Raw data: [renderers.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/renderers.json) · [selection.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/selection.json). [Benchmark guide and individual commands](https://github.com/Linloir/LiMR/blob/main/benchmarks/README.md).
