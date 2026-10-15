# LiMR benchmarks

Reproducible production measurements of the **current source and lockfile**. Reports are generated from the checked-in raw samples. Run these commands from a repository checkout; the npm package includes reports and data for inspection.

| Directory | Responsibility |
| --- | --- |
| `core/` | Node parsing, SSR, incremental append and finalization |
| `renderers/` | One production browser harness; LiMR, react-markdown and Markstream adapters |
| `typography/` | Pure Knuth–Plass solver and full Playground scroll/resize measurements |
| `interaction/` | Real pointer selection and overlay latency probe, shared with browser regressions |
| `shared/` | Deterministic GFM fixture, environment fingerprints and statistics |
| `results/` | Latest complete matrix, optional mount repeat, and separately labelled historical investigation |
| `run.ts` | Serial orchestration, builds and automatic preview-server cleanup |
| `report.ts` | Validates the result matrix and generates both languages of the Docs reports |

## Run everything

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm bench
```

`pnpm bench` uses production React, runs suites **serially**, builds the independent comparison page in a child process that exits before measurement, serves it on port 4175 and serves Playground on an automatically assigned free port. Do not run another benchmark, build or test concurrently. Headless desktop Chromium and a narrow viewport are not physical mobile devices. This is a local workstation measurement, not an isolated lab or a universal performance guarantee.

After an interrupted run, `pnpm bench --from=layout` resumes at the layout stage (also accepts `core`, `streaming`, `kp`, `renderers`, `selection`, `report`). The final report checks the result matrix and rejects mixed source, benchmark, Playground, example-plugin, package or lockfile versions. Only resume when earlier result files belong to the intended run.

## Individual suites

| Command | Output | Server |
| --- | --- | --- |
| `pnpm bench:core` | `results/core.json` | none |
| `pnpm bench:streaming` | `results/streaming.json` | none |
| `pnpm bench:renderers` | `results/renderers.json` | builds and manages 4175 |
| `pnpm bench:kp` | `results/kp-algorithm.json` | none |
| `pnpm bench:layout` | `results/kp-browser.json` | production Playground at `BENCH_URL` |
| `pnpm bench:selection` | `results/selection.json` | production Playground at `BENCH_URL` |
| `pnpm bench:report` | bilingual performance reports | none; requires complete results |

For individual layout/selection runs, first run `pnpm build:playground`, then `pnpm preview:playground --port 4174` in another terminal. Both use `http://127.0.0.1:4174/LiMR/` by default; set `BENCH_URL` for another preview address.

Renderer debugging supports `BENCH_SUITE=full|streaming|reading`, `BENCH_FILTER=static-small`, `BENCH_READING_CASE=rich-medium|rich-large|rich-mobile`, `BENCH_TRIALS`, `BENCH_READING_TRIALS`, `BENCH_RICH_SECTIONS`, and `BENCH_OUTPUT=artifacts/benchmarks/debug.json`. Use a separate output for partial runs. `BENCH_NO_BUILD=1` may reuse an unchanged comparison build; rebuild after any harness/source change. The report generator rejects incomplete result matrices.

For a CPU profile and a Chrome timeline (including layout and GC), use an independent diagnostic run:

```sh
BENCH_PROFILE=1 BENCH_SUITE=full BENCH_FILTER=static-large BENCH_TRIALS=3 BENCH_OUTPUT=artifacts/benchmarks/mount-profile.json pnpm bench:renderers
```

This enables source maps and writes each sample's `.cpuprofile` and `.trace.json` beneath `artifacts/benchmarks/renderers/`. Import them into Chromium DevTools Performance. Profiling adds overhead; these samples are rejected by the report generator and must not replace the normal matrix. Full-DOM samples also record host load and the `os.freemem()` reading immediately before and after the measurement. These observations and timings from a historical stall without its trace cannot establish its cause by themselves.

Ordinary full-DOM runs additionally record Linux `/proc` pressure/reclaim counters, renderer process and main-thread CPU ticks, faults and RSS before/after the complete page run. These snapshots are outside commit timing and include the trailing rAFs and adjacent CDP metrics, rather than only one synchronous layout. Process CPU includes worker threads; `mainThread` does not. Use the recorded `clockTicksPerSecond` to convert CPU ticks. Host counters apply to the whole machine; increases do not identify the responsible process. Missing OS fields remain null. `os.freemem()` can reflect available memory on Linux; use the separate procfs `MemFree` and `MemAvailable` fields rather than treating it as physically free pages. Node RSS/heap snapshots around production build and reference SSR document their memory footprint. No periodic sampler or timeline is enabled for ordinary rankings, and all libraries share the same isolated build process. A same-source A–B–A diagnosis established about 2 GiB of removable controller memory; the restored in-process arm did not reproduce the earlier tail, so isolation is a measurement-resource improvement rather than a demonstrated fix for historical layout stalls.

## Measurement contract

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

This independent check remains in the raw results for analysis. Run it after the serial suite has finished. The public reports summarize current rendering and typography capabilities; measurement timestamps, historical investigations and optimization experiments stay in the raw data. `pnpm bench:report` validates the complete primary matrix and generates both reports in Chinese and English without rerunning measurements.

[中文渲染器报告](../docs/zh-CN/performance.md) · [English renderer report](../docs/en/performance.md) · [中文 KP 报告](../docs/zh-CN/knuth-plass-performance.md) · [English KP report](../docs/en/knuth-plass-performance.md)
