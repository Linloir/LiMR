# LiMR benchmarks

Reproducible production measurements of the **current source and lockfile**. Reports are generated from the checked-in raw samples. Run these commands from a repository checkout; the npm package includes reports and data for inspection.

| Directory | Responsibility |
| --- | --- |
| `core/` | Node parsing, SSR, incremental append and finalization |
| `renderers/` | One production browser harness; LiMR, react-markdown and Markstream adapters |
| `typography/` | Pure Knuth–Plass solver and full Playground scroll/resize measurements |
| `interaction/` | Real pointer selection and overlay latency probe, shared with browser regressions |
| `reading/` | Complete local papers with default features, workers, sidebars, translations, scrolling and resizing |
| `large-reading/` | Shared production AsyncReader browser fixture and focused diagnostic runner |
| `large-comparison/` | 50/75 MiB shared-syntax LiMR/react-markdown/Markstream comparison, including guarded failures |
| `loading/` | Complete 50/75 MiB inputs, 10 MiB unique complex content, real Worker/Reader and external RSS sampling |
| `search/` | [Opt-in reading search](search/README.md): 50/75 MiB nearby regex, continued scans and cached navigation |
| `shared/` | Deterministic GFM fixture, environment fingerprints and statistics |
| `results/` | Latest complete matrix, optional mount repeat, and separately labelled historical investigation |
| `run.ts` | Serial orchestration, builds and automatic preview-server cleanup |
| `report.ts` | Validates the result matrix and generates both languages of the Docs reports |

## Run everything

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm bench
# Includes local papers, headed reading and full large-input loading:
BENCH_READING_SOURCE_DIR=/path/to/test-reading pnpm bench --extended
```

`pnpm bench` uses production React, runs suites **serially**, builds the independent comparison page in a child process that exits before measurement, serves it on port 4175 and serves Playground on an automatically assigned free port. Do not run another benchmark, build or test concurrently. Headless desktop Chromium and a narrow viewport are not physical mobile devices. This is a local workstation measurement, not an isolated lab or a universal performance guarantee.

After an interrupted run, `pnpm bench --from=layout` resumes at the layout stage (also accepts `core`, `streaming`, `kp`, `renderers`, `selection`, `report`). The final report checks the result matrix and rejects mixed source, benchmark, Playground, example-plugin, package or lockfile versions. Only resume when earlier result files belong to the intended run. Extended runs add `loading`, `large-comparison` and `reading` before `report`; resume with `pnpm bench --extended --from=loading` or `--from=reading`. The report also compares fingerprints with the current checkout. Documentation and generated result files are excluded from the measured source hashes; benchmark guides are part of the harness hash, so finalize them before measuring.

## Individual suites

| Command | Output | Server |
| --- | --- | --- |
| `pnpm bench:core` | `results/core.json` | none |
| `pnpm bench:streaming` | `results/streaming.json` | none |
| `pnpm bench:renderers` | `results/renderers.json` | builds and manages 4175 |
| `pnpm bench:kp` | `results/kp-algorithm.json` | none |
| `pnpm bench:layout` | `results/kp-browser.json` | production Playground at `BENCH_URL` |
| `pnpm bench:selection` | `results/selection.json` | production Playground at `BENCH_URL` |
| `pnpm bench:large-comparison` | `results/large-comparison.json` | production bundle on an automatic free port |
| `pnpm bench:loading` | `results/loading.json` | production bundle on an automatic free port |
| `pnpm bench:reading` | `artifacts/benchmarks/reading.json` | frozen production snapshot on an automatic free port |
| `pnpm bench:report` | four performance pages and `results/home-performance.json` | none; requires complete base results |
| `BENCH_EXTENDED=1 pnpm bench:report` | six performance pages plus Home metrics | none; requires the complete matching extended matrix |

For individual layout/selection runs, first run `pnpm build:playground`, then `pnpm preview:playground --port 4174` in another terminal. Both use `http://127.0.0.1:4174/LiMR/` by default; set `BENCH_URL` for another preview address.

Renderer debugging supports `BENCH_SUITE=full|streaming|reading`, `BENCH_FILTER=static-small`, `BENCH_READING_CASE=rich-medium|rich-large|rich-mobile`, `BENCH_TRIALS`, `BENCH_READING_TRIALS`, `BENCH_RICH_SECTIONS`, and `BENCH_OUTPUT=artifacts/benchmarks/debug.json`. Use a separate output for partial runs. `BENCH_NO_BUILD=1` may reuse an unchanged comparison build; rebuild after any harness/source change. The report generator rejects incomplete result matrices.

## Local papers and large documents

For an independent parser/index measurement with your own Markdown files, run each variant in a fresh process:

```sh
node --expose-gc --import tsx benchmarks/core/parser-pipeline.ts --target 5 --output artifacts/parser-candidate.json paper.md appendix.md
node --expose-gc --import tsx benchmarks/core/parser-pipeline.ts --target 5 --upstream --output artifacts/parser-upstream.json paper.md appendix.md
node --expose-gc --import tsx benchmarks/core/parser-pipeline.ts --target 50 --no-fingerprint --output artifacts/parser-large.json paper.md appendix.md
```

`--target` repeats complete input units to at least the requested UTF-8 MiB; omit it to parse the files once. The upstream arm replaces only the bounded parser adapter while preserving LiMR's surrounding normalization and indexing. Run variants serially with matching Node/V8 options. Results include source/code hashes, counts, timing, peak RSS, and retained heap after GC. `process.resourceUsage().maxRSS` may inherit a launch-process high-water floor on some systems; externally sample the measured process when establishing absolute peak-memory comparisons. The full graph fingerprint checks property order, source positions, and shared-node identities, and runs after memory measurements. Use `--no-fingerprint` for large probes to avoid its additional graph traversal memory. These direct-engine measurements exclude Worker transfer and browser rendering; repeated papers are not uniquely authored large documents. JSON progress markers go to stderr and the final result to stdout.

`bench:reading` reads `1706.03762v7.limr.md` and `2305.10435v2.zh-CN.limr.md` from `../test-reading` by default, including their relative image assets. Use `BENCH_READING_SOURCE_DIR` and comma-separated `BENCH_READING_DOCUMENTS` for another local corpus. The source files are not distributed in this repository.

```sh
# Complete papers, standard/justify/KP, both sidebar layouts, three trials.
BENCH_READING_RENDERERS=reader,async pnpm bench:reading
# A smaller diagnostic run; this is not a complete acceptance matrix.
BENCH_READING_RENDERERS=async BENCH_READING_MODES=knuth-plass BENCH_READING_COLLAPSE=true BENCH_READING_TRIALS=1 BENCH_OUTPUT=artifacts/benchmarks/reading-diagnostic.json pnpm bench:reading
# Real 50 MiB blocking and 75 MiB progressive inputs, including reader windows.
LIMR_LARGE_CASES=novels node benchmarks/large-reading/run.mjs
# Headed/default-GPU evidence, kept separately from legacy headless output.
BENCH_BROWSER_MODE=headed BENCH_READING_RENDERERS=async pnpm bench:reading
BENCH_BROWSER_MODE=headed LIMR_LARGE_CASES=novels node benchmarks/large-reading/run.mjs
```

The `reader` arm preserves the synchronous full-document API; `async` uses a real parser worker with main-thread fallback disabled and automatic DOM windows. Optional `BENCH_READING_LOADING=progressive` and `BENCH_READING_VIRTUALIZATION=true|false` diagnose those paths explicitly. `BENCH_READING_SIDEBAR=true,false` compares both sidebar states at equal body width unless `BENCH_READING_RESERVE_SIDEBAR=0` is set.

These suites retain default modules and animations. Ordinary reading, fast scrolling, whole-document seeks, visible paragraph translation changes, translation changes during scrolling, and resizing are separate probes. They record resource errors, worker capability, viewport coverage and source fingerprints alongside raw frames; a low frame time with missing content is not a successful sample. Resize settling includes an observation window and is reported separately from maximum frame duration. rAF intervals are scheduling measurements, not physical input-to-photon latency. Large-document fixture generation is recorded separately from loading a supplied file. The extended public matrix writes `results/reading.json`; standalone diagnostic runs keep their separate output path. Default-feature measurements are reported separately from controlled full-DOM comparisons.

The `reading`, `loading`, `large-comparison` and diagnostic `large-reading` suites accept `BENCH_BROWSER_MODE=headless|headed` (default `headless`) and optional absolute `BENCH_BROWSER_EXECUTABLE`. The default preserves the prior Playwright launch route; an explicit same full binary is required when isolating headless/headed policy from binary differences. Neither option adds a GPU/backend override or changes the existing CSS viewport, actions or timing boundaries. The independent public renderer/layout/selection matrix retains its existing launch settings.

These browser suites record actual GPU/command-line/window/page evidence outside timing, together with per-case `browserEnvironment.performanceEnvironmentVerified` and reasons for unavailable/inconsistent evidence. Headed does not imply hardware GPU; actual feature status and backend decide that classification. Hidden pages or GPU environment changes cannot silently qualify for performance acceptance. Binary metadata is collected once before the cases, with Linux procfs identity when available. No trace or periodic GPU sampler is enabled. Existing reports without these observations remain historical data with an unobserved GPU environment and must not be pooled with new headed evidence.

Legacy headless output paths are unchanged. Headed defaults add `-headed` to the JSON filename; `BENCH_OUTPUT` overrides either mode in these suites. The large-document source snapshot now also includes its browser-environment helper. See [the reading harness](reading/README.md) for explicit same-binary commands and observation limits. A complete desktop-reading acceptance matrix needs verified headed/default-GPU evidence in addition to any headless CI results; neither environment is assumed universally faster.

For a CPU profile and a Chrome timeline (including layout and GC), use an independent diagnostic run:

```sh
BENCH_PROFILE=1 BENCH_SUITE=full BENCH_FILTER=static-large BENCH_TRIALS=3 BENCH_OUTPUT=artifacts/benchmarks/mount-profile.json pnpm bench:renderers
```

This enables source maps and writes each sample's `.cpuprofile` and `.trace.json` beneath `artifacts/benchmarks/renderers/`. Import them into Chromium DevTools Performance. Profiling adds overhead; these samples are rejected by the report generator and must not replace the normal matrix. Full-DOM samples also record host load and the `os.freemem()` reading immediately before and after the measurement. These observations and timings from a historical stall without its trace cannot establish its cause by themselves.

Ordinary full-DOM runs additionally record Linux `/proc` pressure/reclaim counters, renderer process and main-thread CPU ticks, faults and RSS before/after the complete page run. These snapshots are outside commit timing and include the trailing rAFs and adjacent CDP metrics, rather than only one synchronous layout. Process CPU includes worker threads; `mainThread` does not. Use the recorded `clockTicksPerSecond` to convert CPU ticks. Host counters apply to the whole machine; increases do not identify the responsible process. Missing OS fields remain null. `os.freemem()` can reflect available memory on Linux; use the separate procfs `MemFree` and `MemAvailable` fields rather than treating it as physically free pages. Node RSS/heap snapshots around production build and reference SSR document their memory footprint. No periodic sampler or timeline is enabled for ordinary rankings, and all libraries share the same isolated build process. A same-source A–B–A diagnosis established about 2 GiB of removable controller memory; the restored in-process arm did not reproduce the earlier tail, so isolation is a measurement-resource improvement rather than a demonstrated fix for historical layout stalls.

## Cross-renderer large inputs

`pnpm bench:large-comparison` tests LiMR, react-markdown and Markstream on identical complete 50/75 MiB prose and shared-syntax rich corpora, three fresh browser processes each (36 runs). Rich inputs contain uniquely numbered code/math, tables, tasks, quotes and local images. There is no LiMR-only annotation/translation syntax in this comparison. The generator records exact byte/UTF-16 sizes, complete units and source hashes, keeping final units and a tail sentinel.

LiMR uses AsyncReader with its real standard Worker, default blocking mode, modules, TOC/sidebar, animation and automatic DOM windows. ReactMarkdown uses remark-gfm, remark-math, rehype-katex and async Shiki; Markstream uses default MarkdownRender, package CSS, KaTeX and stream-diffs. The peers do not receive a custom worker/windowing layer; their default lazy/batching/effect settings remain intact. This is a public-API integration comparison, not identical parser work or DOM counts. Styles/fonts remain those of each integration; actual widths are recorded.

Prefetched Blob acquisition is outside timing; decoding, parsing, rendering, fonts and two rAFs precede visible opening heading/paragraph acceptance. Head/tail content and viewport coverage are validated after seeks; an empty initial viewport never qualifies as a fast render. If the end is already mounted at scroll position zero while the opening remains missing for five seconds, initial reading fails even if later seeks can display content. LiMR uses source navigation for its compressed range, peers native scrollbar fractions; seek timings are not ranked. Report successful first readability, 5-second idle RSS and steady/fast frames separately from external observed peaks. Every trial shares a 180s/6 GiB renderer guard. Timeouts, crashes, guard stops and incomplete content stay in the raw matrix; guarded peaks are stopping observations, not successful memory bounds. No forced GC or reduced feature profile is used.

```sh
BENCH_LARGE_COMPARISON_FILTER=rich-50/limr BENCH_LARGE_COMPARISON_TRIALS=1 BENCH_OUTPUT=artifacts/benchmarks/large-comparison-probe.json pnpm bench:large-comparison
```

For harness smoke checks only, `BENCH_LARGE_COMPARISON_SIZES=1` chooses smaller corpora and `BENCH_LARGE_COMPARISON_TIMEOUT_MS=15000` shortens the external guard. These outputs are explicitly partial and rejected by the public report.

## Complete-input loading and memory

`pnpm bench --extended` measures eight combinations, three fresh browser processes each: 50 MiB Chinese prose in standard and KP; 75 MiB prose in progressive standard mode; complete repeated papers at 50/75 MiB in blocking and progressive modes; and 10 MiB of unique synthetic sections with independent reference/footnote IDs, tables, code, math and lists. The generator keeps complete units, records actual UTF-8/UTF-16 sizes and hashes, and never presents repeated papers as a uniquely authored large book. Paper assets must be available beside the two input files named above.

Loading timing begins after the file is fetched as a Blob. It includes decoding, parsing, indexing, transport/adoption and React content; source generation and disk/network fetch are excluded. A preview requires visible heading/paragraph geometry from the provisional engine and a subsequent frame. Complete content requires the full engine, font readiness and another frame. These are observable DOM/frame milestones, not physical paint. All default features remain enabled with automatic windowing; a final sentinel and six source seeks check complete input and visible output. The two scroll rates are separate probes.

Renderer-process RSS is externally sampled from Linux procfs every 25 ms in the same trial. Peak covers loading, five-second idle and reading; idle RSS and main-isolate JS heap/backing storage are taken before reading probes, with no forced GC. RSS includes Worker/native/engine allocations; JS heap is not total process memory. Short peaks between samples may be missed. No 2 GiB acceptance limit applies; a 6 GiB emergency guard and a 180-second load timeout bound a failed run. Full source/AST memory is not bounded by DOM window size. `loading.json` retains chronological samples, loaded bundle hashes, corpus identities, progress history, content checks and observed GPU/browser metadata.

The extended reading stage uses AsyncReader, two complete original papers, all three typography modes and both folding settings, with three pages per combination (36 runs). It defaults to headed Chromium; a working graphical session is required. Loading defaults to headless. Set `BENCH_BROWSER_MODE` explicitly to choose one mode for both. GPU/backend and visibility are observed; timings from differing modes/backends are reported separately. A failed environment check is retained and cannot establish desktop acceptance.

```sh
# Targeted loading diagnostic; keep it outside the complete public matrix.
BENCH_LOADING_FILTER=papers-50/progressive BENCH_LOADING_TRIALS=1 BENCH_OUTPUT=artifacts/benchmarks/loading-probe.json pnpm bench:loading
# Only reproduce the public paper matrix:
BENCH_BROWSER_MODE=headed BENCH_READING_RENDERERS=async BENCH_OUTPUT=benchmarks/results/reading.json pnpm bench:reading
```

## Measurement contract

Large code folding, wrapping and bounded rendering have a separate [production benchmark](code-blocks/README.md). Its browser regressions also combine giant code with virtual books, nested scrollers, state restoration, source navigation and complete selection/print.

- **Controlled full DOM:** same GFM and neutral CSS, native code, explicit removal of deferred rendering/virtualization/animation from this profile only; five fresh pages per renderer/case, two small warmups. LiMR passes `streamEffect={false}` because CSS `animation:none` does not disable its Web Animations API effects. Synchronous commits include forced layout. A separate CDP task metric captures asynchronous work. Every final DOM is checked against react-markdown + remark-gfm, including exact fenced code.
- **Rich reading:** default LiMR/Markstream behavior and styles; react-markdown explicitly integrates GFM, math, KaTeX and async Shiki. Three cold contexts per renderer at 24/240 sections on desktop and 24 sections at 390px. Check visible code/math/images, content at middle/end/top, final marker, errors, frames, long tasks, layout shifts, transfers and post-GC heap. Failed reading is recorded and excluded from usability rankings.
- **Rich streaming:** eight heterogeneous sections, 256 UTF-16 characters per update, defaults intact, three warmed resource contexts per renderer. Includes a final nonstreaming commit and checks stable output.
- **KP:** synthetic solver inputs separate from browser glyph measurement/DOM work. The real paper runs standard, CSS justify and KP at desktop/narrow widths, three times each. Raw scroll/resize frames, settled layout, native selection and cache checks are retained.
- **Statistics:** nearest-rank quantiles. Tables use the median of independent trial metrics, unless explicitly pooling frames. Min/max expose variability; three/five trials are descriptive, not significance tests. JS heap is not process RSS; rAF is not physical input-to-photon latency; navigation readiness is not FCP/LCP.

Source, harness, Playground, example-plugin and lockfile SHA-256 values, parent revision, versions, machine, load and timestamp are stored in each result. `src` is fingerprinted independently so a documentation-only commit does not appear to change the measured implementation. Playground and its example plugins are fingerprinted too because layout and selection measurements run through those integration fixtures; generated skill-download archives are excluded because the tests do not load them. Temporary builds and diagnostic screenshots live in ignored `artifacts/benchmarks/`.

An optional independent-process check of long-document mounts reuses the comparison build:

```sh
BENCH_NO_BUILD=1 BENCH_SUITE=full BENCH_FILTER=static-large BENCH_TRIALS=3 BENCH_OUTPUT=benchmarks/results/mount-repeat.json pnpm bench:renderers
pnpm bench:report
```

This independent check remains in the raw results for analysis. Run it after the serial suite has finished. The public reports summarize current rendering and typography capabilities; measurement timestamps, historical investigations and optimization experiments stay in the raw data. `pnpm bench:report` validates the complete primary matrix and generates both reports in Chinese and English without rerunning measurements. `BENCH_EXTENDED=1` additionally validates 24 LiMR loading runs, 36 cross-renderer large-input trials and 36 full-paper reading runs, then generates the bilingual loading/memory report. Home imports compact metrics generated from the same samples; do not manually copy benchmark numbers into the page.

[中文渲染器报告](../docs/zh-CN/performance.md) · [English renderer report](../docs/en/performance.md) · [中文 KP 报告](../docs/zh-CN/knuth-plass-performance.md) · [English KP report](../docs/en/knuth-plass-performance.md)

[中文加载与内存报告](../docs/zh-CN/loading-performance.md) · [English loading and memory report](../docs/en/loading-performance.md)
