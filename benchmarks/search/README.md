# Reading-search benchmark

Run from the repository root, with other benchmarks and browser tests stopped:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
node benchmarks/search/run.mjs
```

The runner builds the production large-reader fixture, starts its own local server and Chromium, and generates exact 50/75 MiB UTF-8 inputs (52,428,800 / 78,643,200 bytes). The CJK prose fixture repeats paragraphs with three unique search markers near the beginning, middle and end. It uses a real loading Worker, standard typography and windowed body rendering; sidebar/TOC are disabled. It is a controlled text-search workload, not a diverse real-document corpus or a memory benchmark.

Measurements separate initial loading, nearby regex search (`SearchMarker-\d{3}`), explicit Next scans to distant markers, cached Previous, and literal search near the end. Search timing includes the input debounce and browser automation round trips, ending when the expected count and active highlight are visible. The runner observes main-thread tasks over 50 ms, records mounted blocks, checks browser errors and verifies unchanged source. Empty long-task arrays mean no such task was observed during these operations; they are not a zero-cost claim.

Outputs under `artifacts/search-benchmark/` include result.json, production bundle fingerprints and screenshots. The checked-in [1.3.11 sample](../results/search-1.3.11.json) records one trial per size on an i7-13700/Linux machine. It is a local headless Chromium result, not a percentile distribution, physical display-latency measurement, or VS Code/Cursor acceptance. Run the browser regression suite separately for dense hits, invalid/backtracking regex, case toggles, loading timing, UI composition and themes:

```sh
pnpm test:browser tests/browser/document-search.spec.ts tests/browser/large-reader.spec.ts
```

This focused suite is separate from `pnpm bench` and does not replace its broader default-feature reading and memory matrix. Search semantics and known single-block limits are documented in [English](../../docs/en/search.md) and [中文](../../docs/zh-CN/search.md).
