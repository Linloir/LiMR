# Renderer performance report

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

LiMR combines rich Markdown, streaming output and interactive annotations with responsive updates and reading. The measurements below cover full-document mounting, incremental streaming, and reading with default modules and animations enabled.

## Performance at a glance

- **About 0.93 seconds to mount a long document**: all 877,782 UTF-16 characters rendered.
- **Lowest cumulative synchronous time in 4/4 streaming scenarios**: compared with react-markdown and Markstream on identical mixed-content, code, table and paragraph inputs.
- **4.4ms rich-stream update P95**: default modules, animations, styles and fonts remain enabled.
- **9/9 desktop, long-document and narrow-screen reading checks passed**: covering initial content, scrolling and document seeks.

## Streaming output

Content arrives in chunks of 256 UTF-16 characters, measuring the update cost of continuously generated Markdown. Each scenario uses identical input and neutral styling. Values are median [min–max] across five independent pages, in ms: cumulative synchronous commit time including React updates and layout.

| Content / characters | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Mixed content / 34,860 | 263.10 [258.30–298.30] | 2016.00 [1956.50–2171.80] | 320.70 [314.20–347.70] |
| Code block / 34,488 | 141.00 [139.20–145.00] | 295.10 [286.40–296.20] | 188.40 [183.40–190.20] |
| Table / 30,922 | 437.40 [422.30–456.00] | 1985.60 [1971.40–2028.80] | 791.70 [713.40–820.40] |
| Long paragraph / 32,500 | 965.90 [961.10–983.90] | 1535.40 [1498.90–1566.90] | 1115.80 [1067.20–1152.00] |

### Per-update responsiveness

The table shows the median of five per-run update P95s, in ms. Synchronous commit timing excludes the frame waits between updates and asynchronous resource loading.

| Content | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Mixed content | 3.00 | 25.50 | 3.50 |
| Code block | 1.50 | 3.50 | 2.20 |
| Table | 5.40 | 29.40 | 11.10 |
| Long paragraph | 13.30 | 21.60 | 17.20 |

## Long-document mounting and resource use

From short articles to approximately 878,000 characters, full-document mounting retains the complete article DOM for native browser selection and document navigation. Values are mount-time median [min–max] across five independent pages, in ms.

| Document / characters | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| Short document / 8,700 | 19.50 [18.90–20.00] | 20.70 [19.60–27.50] | 17.20 [16.50–20.50] |
| Medium document / 87,381 | 111.80 [102.40–126.10] | 124.70 [116.90–140.10] | 104.80 [101.30–110.70] |
| Long document / 877,782 | 933.30 [872.50–1014.90] | 1301.20 [1262.40–1346.80] | 880.30 [848.60–956.00] |

Retained JS heap and article DOM for the same long document:

| Renderer | Incremental JS heap MiB | Article elements |
| --- | --- | --- |
| LiMR | 54.50 | 38002 |
| react-markdown | 13.09 | 36001 |
| Markstream | 126.34 | 152001 |

JS heap is the post-GC increment over a warmed empty page; DOM counts cover article elements.

## Reading with rich features enabled

Rich streaming combines TypeScript, Python, JSON, formulas, tables, tasks and local images. LiMR retains its default modules, animations, styles and fonts. Each renderer runs on three resource-warmed pages, with section and rich-content validation.

| Renderer | Content checks | Cumulative commit time ms | Update P95 ms |
| --- | --- | --- | --- |
| LiMR | 3/3 | 210.20 | 4.40 |
| react-markdown | 3/3 | 1285.00 | 20.30 |
| Markstream | 3/3 | 232.30 | 3.60 |

LiMR reading scenarios cover a 1440×900 desktop viewport and a 390×900 narrow viewport. The long document contains 240 sections, 240 code blocks, 480 formulas and 30 local images. Each scenario uses three cold browser contexts, scrolling in both directions and seeking to the middle, end and top.

| LiMR reading scenario | Content checks | First readable content ms | Scroll frame interval P95 ms |
| --- | --- | --- | --- |
| Desktop reading | 3/3 | 258.30 | 16.80 |
| Long desktop document | 3/3 | 1232.50 | 16.80 |
| Narrow-screen reading | 3/3 | 243.80 | 16.70 |

First readable content is confirmed by DOM checks and two rAF callbacks, timed from navigation. Scroll P95 measures rAF intervals. Narrow screens are simulated with a Chromium viewport.

## Interactive selection and annotations

LiMR updates its highlight overlay while selections are dragged through 2,000 prose sections or 1,000 lines of code. Each scenario performs continuous pointer movement on three font-ready pages.

| LiMR scenario | Frame interval P95 ms | Overlay update P95 ms |
| --- | --- | --- |
| Prose selection | 33.40 | 28.90 |
| Code selection | 16.80 | 19.30 |

Overlay updates are timed from selectionchange to DOM mutation. For paragraph typography and its measurements, see the [Knuth–Plass performance report](knuth-plass-performance.md).

## Methodology and reproduction

LiMR **1.1.0** · React **19.3.0** · Node **v20.19.5** · Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 logical CPUs; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

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

Raw data: [renderers.json](../../benchmarks/results/renderers.json) · [selection.json](../../benchmarks/results/selection.json). [Benchmark guide and individual commands](../../benchmarks/README.md).
