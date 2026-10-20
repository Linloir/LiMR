# Large code interactions

Run from a repository checkout with development dependencies installed:

```sh
node benchmarks/code-blocks/run.mjs
```

This freezes `src` before making a production Vite build and serves it on a local ephemeral port. It runs three fresh Chromium pages per case, rotating case order: a 1,000,010-character line, 50,000 ordinary source lines, and the same 50,000 lines with numbers. Fonts are warmed before measurement. No CPU or network throttle is applied.

`BENCH_CODE_SOURCE=/path/to/checkout` tests another source tree against this same harness and installed dependency graph. `BENCH_CODE_TRIALS` defaults to 3; `BENCH_CODE_OUTPUT` defaults to `artifacts/benchmarks/code-blocks.json`. Run baseline and candidate serially without another browser suite competing for CPU.

The JSON records forced mount layout, click dispatch, two-rAF presentation time, worst frame interval, frames over 50ms, animation height samples, text completeness, DOM count and page errors. Two rAF callbacks are a presentation proxy, not physical input-to-photon latency. Compare medians across independent pages; three runs describe this machine and are not a statistical significance test.

The million-character case disables default folding so the wrap action measures expanded code in every version. Multi-line cases use default folding and run expand, wrap and collapse. In 1.3.9, expanded height is bounded to 40 rows; 1.3.8 and 1.3.10 use full height. The 1.3.10 default follows document scrolling while retaining deferred code layout. This compares actual default behavior, including each version's viewport policy.

The browser regressions in `tests/browser/code-large.spec.ts` separately verify:

- Native selection and copy across deferred groups, including Unicode and literal entities.
- Native find, source highlights and complete print text/line numbers.
- Actual window eviction and fold/wrap restoration in page and nested scroll roots, using both full height and an explicit 40-row limit, including a 50 MiB book with 50,000 code lines.
- Scrolling away during animation, stable book navigation, and revealing a distant line inside an unmounted folded code block.

Full source text remains in the DOM and memory. Distant source-line wrappers are removed and re-created; browser containment skips distant text layout. Selecting all text or printing it still requires complete work. These results do not certify another browser, physical device, or host webview.

`tests/browser/code-scrollbars.spec.ts` additionally enables classic, layout-occupying scrollbars and checks complete row heights for short, folded, expanded and wrapped code, plus the absence of vertical scrollbar space during full-height expansion.

[1.3.8 baseline](../results/code-blocks-1.3.8.json) · [1.3.9 results](../results/code-blocks-1.3.9.json) · [1.3.10 results](../results/code-blocks-1.3.10.json)

## 2026-10-20 results

Linux, Intel Core i7-13700, Chromium 156.0.8078.4, Node 20.19.5, 900×900 viewport. The following are three-trial medians in milliseconds, measured serially with frozen production builds and the same installed dependencies.

| Case / operation | 1.3.8 | 1.3.9 | 1.3.10 |
| --- | ---: | ---: | ---: |
| Million-character line: enable wrapping | 316.5 | 12.9 | 13.8 |
| 50,000 source lines: expand | 633.0 | 9.0 | 9.6 |
| 50,000 source lines: wrap | 701.9 | 30.8 | 31.6 |
| 50,000 numbered lines: expand | 1,465.7 | 15.1 | 12.1 |
| 50,000 numbered lines: wrap | 2,334.4 | 31.7 | 31.5 |
| 50,000 numbered lines: collapse | 1,903.9 | 30.3 | 31.4 |

In 1.3.9, numbered-block mount presentation fell from 5,872.8ms to 315.7ms, and its descendant element count from 100,019 to 1,718 (64 decorated source lines at rest). Initial presentation of the million-character line remains about 350ms: retaining full text still costs work even when later interaction is cheap. All candidate action runs had zero frame intervals over 50ms; expand/collapse sampled 19 distinct heights instead of one immediate jump. Every run retained exact text and reported no page errors. These are local measurements, not guarantees for every device.

With the 1.3.10 full-height default, numbered-block mount presentation is 315.6ms and the same 1,718 elements remain after collapse. Expansion reaches the full 1,189,844px content height; the million-character wrapped line reaches 301,887px. The nine runs retain complete text, report no page errors and have no action frame intervals over 50ms. Expansion/collapse samples 23 distinct heights. The existing selection, printing and memory limits still apply.
