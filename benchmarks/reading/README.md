# Long-document reading

This independent production harness runs the two real LiMR papers with default renderer features and animations. It covers standard, CSS justify and Knuth–Plass typography with both aligned and automatically folded sidebars. It does not update the public benchmark reports.

```sh
BENCH_READING_SOURCE_DIR=/path/to/test-reading NODE_ENV=production pnpm exec tsx benchmarks/reading/run.mjs
```

Keep the Markdown files and their relative image directories together. The defaults are `1706.03762v7.limr.md` and `2305.10435v2.zh-CN.limr.md`, with three fresh pages per combination in rotated order. Build and measurements run serially; do not run other builds, tests or benchmarks concurrently. Inputs are copied to a frozen snapshot before a separate build process runs and exits. Workspace edits after that copy cannot affect the browser run.

Results and the build go under ignored `artifacts/benchmarks/`. Options:

- `BENCH_READING_DOCUMENTS`: comma-separated filenames in the source directory.
- `BENCH_READING_MODES`: `standard,justify,knuth-plass` or a subset.
- `BENCH_READING_RENDERERS`: defaults to `reader`; use `reader,async` to compare the ordinary reader with worker loading and automatic windowing. Both retain all default modules.
- `BENCH_READING_LOADING`: `blocking` (default) or `progressive` for the async reader. Loading-state history, worker capabilities and actual worker URLs are retained; a main-thread fallback is forbidden in this fixture. Reading probes begin after the complete document is ready.
- `BENCH_READING_VIRTUALIZATION`: omit to retain each reader's default, or explicitly set `true`/`false` for a diagnostic comparison. Mounted window slots are recorded.
- `BENCH_READING_COLLAPSE`: `true,false` or one value; both retain the sidebar.
- `BENCH_READING_SIDEBAR`: defaults to `true`; use `true,false` for diagnostic comparisons. The disabled case runs once per document/typography/trial, because folding is irrelevant without a sidebar.
- `BENCH_READING_RESERVE_SIDEBAR`: defaults to `1`, reserving an empty sidebar column in disabled-sidebars comparisons. This preserves article width at both tested viewport sizes; actual widths are recorded. Set `0` to measure the natural layout without that reservation. Disabled features are diagnostic cases, not acceptance cases.
- `BENCH_READING_TRIALS`: number of fresh pages per combination.
- `BENCH_OUTPUT`: a separate raw JSON output path.
- `BENCH_BROWSER_MODE`: `headless` (default, preserving the Playwright-default launch route) or `headed`. No fallback changes a failed headed launch into headless.
- `BENCH_BROWSER_EXECUTABLE`: optional absolute browser path. For a controlled headed/headless comparison, explicitly select the same full Chromium executable in both runs; implicit Playwright launches may choose different binaries.
- `BENCH_READING_BUILD`: build directory; `BENCH_NO_BUILD=1` reuses it only when its source, harness and lockfile hashes still match.
- `BENCH_READING_SOURCEMAP=1`: emit source maps for separate CPU-profile attribution runs. Profiled timings should not be mixed into the unprofiled acceptance samples.

The scroll scenarios answer different questions: **steady reading** advances 480 pixels per second for three seconds; **fast scrolling** advances 120 pixels per animation frame; **whole-document seeks** repeatedly jump across the entire article. Report these independently. Seek results do not describe normal wheel reading.

Each page also performs three passage-translation switches at rest, three while scrolling at 480 pixels per second, and two resizes. Translation probes require a button inside the actual viewport, excluding offscreen overscan slots, and retain its rectangle, DOM mode commit delay and animation frame intervals. Documents without translation switches record that scenario as absent.

Raw chronological frame samples, long tasks, resource failures, source/document SHA-256 values, browser version and environment are retained. Visibility probes check whether source blocks cover the viewport. Windowed documents additionally record gaps and overlaps between adjacent visible slots, with a one-pixel tolerance; a nonempty text sample alone does not prove correct placement. Image load status is recorded separately. Resize completion requires visible paragraph geometry and KP markers to remain stable for 150 ms without a visible stale paragraph. This is an observable stability proxy, not an internal queue-drain assertion. Frame timing and DOM commit timing do not prove physical input-to-photon latency, and DOM coverage does not prove rasterized content. Offscreen lazy images may remain unloaded. The raw snapshot and build manifest remain beside the output build for inspection.

Browser metadata is collected outside every measured interval: requested mode/executable, actual command line, Playwright/browser versions, real GPU devices/backend/feature status before and after each case, actual window/CSS viewport/reader geometry and visibility changes. Binary hashes are collected once before the cases; Linux additionally verifies the browser PID/executable/start time through procfs. Other systems explicitly retain the absence of that OS verification. There are no added GPU flags, focus/window mutations, periodic GPU polling or performance traces.

Each case has a separate `browserEnvironment.performanceEnvironmentVerified` and `issues` list. Missing observations, hidden headed pages, viewport disagreement or a changed GPU environment do not become successful environment evidence merely because the document/functionality checks completed. Software and hardware GPU status are observed categories: headed mode alone does not prove hardware acceleration. Retain failed or unverified cases, but exclude them from an acceptance claim that requires the missing environment. A headed/default-GPU acceptance matrix must include actual compatible GPU observations, not only an environment variable.

The legacy headless output stays `artifacts/benchmarks/reading.json`; a headed run defaults to `reading-headed.json`. `BENCH_OUTPUT` explicitly overrides either. Keep modes, actual binary/backend and geometry separate when comparing results. Older reports without these fields have unobserved GPU environments; their historical headless timings cannot be retrospectively labelled hardware or pooled with new headed results.

```sh
BENCH_BROWSER_MODE=headed BENCH_READING_RENDERERS=async pnpm bench:reading
# Optional controlled same-binary pair; keep separate output files.
BENCH_BROWSER_MODE=headless BENCH_BROWSER_EXECUTABLE=/absolute/path/to/chrome BENCH_OUTPUT=artifacts/benchmarks/reading-full-headless.json pnpm bench:reading
BENCH_BROWSER_MODE=headed BENCH_BROWSER_EXECUTABLE=/absolute/path/to/chrome BENCH_OUTPUT=artifacts/benchmarks/reading-full-headed.json pnpm bench:reading
```
