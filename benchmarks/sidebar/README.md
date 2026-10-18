# Sidebar regression comparison

Run the two production builds serially on the same machine:

```sh
NODE_ENV=production pnpm exec tsx benchmarks/sidebar/run.mjs
```

The default baseline is the 1.3.3 commit `1b3d4d961dc72ed3bda734802108ea4a09ae88e4`.
The current working source is copied before building. Both use the same fixture,
installed dependencies, default reader features, automatic windowing and a real
Worker in blocking mode. Default inputs are complete synthetic 5 and 50 MiB books
with uniquely numbered sections and four notes per section. Repeated prose is
not representative of every real document.

Each folding setting has three trials per build with alternating version order.
Each trial records complete loading, first/middle/last section hover and pinned
return geometry, repeated pointer changes, steady scrolling at 480 px/s, fast
scrolling at 120 px/frame, final-sentinel visibility, mounted blocks/cards and
browser errors. CDP records layout, style and script work; rAF and long tasks are
kept separately. Intervals use successive rAF timestamps, excluding the initial
callback. rAF does not measure physical presentation latency. Browser
binary, GPU/backend, visibility, source, bundle and corpus identities are saved.

Outputs, frozen sources and builds are under
`artifacts/benchmarks/sidebar-1.3.4/`. `results.json` is written after every trial,
including partial results on failure. Source and corpus sizes are actual bytes,
not just the requested MiB. Run without competing builds or browser suites.

Overrides: `BENCH_SIDEBAR_BASELINE`, `BENCH_SIDEBAR_SIZES` (comma-separated MiB),
`BENCH_SIDEBAR_TRIALS`, `BENCH_SIDEBAR_OUTPUT`, and the shared
`BENCH_BROWSER_MODE` / `BENCH_BROWSER_EXECUTABLE` options. Use a fresh output
directory if the baseline changes. These diagnostics are independent of the
public cross-renderer benchmark rankings.

`BENCH_SIDEBAR_REUSE=1` reuses the frozen builds in an existing output directory
after checking source, dependency lock, fixture and bundle identities. It starts
new trials and replaces that directory's `results.json`; archive results first
if they must be retained.

`tests/browser/sidebar-windowing.spec.ts` is the assertion-based regression:
it also checks TOC jumps, native pointer motion without scroll-into-view,
kept-alive active cards and releasing offscreen source DOM.
