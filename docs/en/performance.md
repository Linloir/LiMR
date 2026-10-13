# Performance and limits

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/performance) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/performance.md)

These are the repository's **2026-10-12 historical measurements**, retained for comparison. They were not rerun for this documentation/Playground update and are not guarantees.

Environment: Intel Core i7-13700, WSL2/Linux, Node 20.19.5, Chromium 156.0.8078.4, React 19 production. Baseline: react-markdown 10.1.0 + remark-gfm 4.0.1.

## Browser

Both render equivalent GFM with the same typography, body only, excluding Reader navigation/sidebar. Values are medians of three isolated pages after warmup and font readiness, alternating renderer order. Timing includes synchronous React commits and forced layout, excluding network, asynchronous heavy resources, and idle frame time.

| Scenario | LiMR | react-markdown |
| --- | ---: | ---: |
| 87,381 characters, 200 sections, initial mount | 126.1 ms | 134.0 ms |
| 877,782 characters, 2,000 sections, initial mount | 1,345.4 ms | 1,437.6 ms |
| 34,860 characters, 138 streaming commits, total synchronous time | 306.1 ms | 1,864.1 ms |
| Same stream, per-commit P95 | 2.9 ms | 23.7 ms |

The final full parse is included. P95 does not mean every frame stays below 16ms. Raw data: [browser.json](../../benchmarks/results/browser.json).

## Selection and SSR

Historical long-document selection paint latency P95 was 25.2–28.5ms; code was 18.9–19.4ms. This measures selectionchange to paint-layer updates, not hardware input-to-display latency. The same automated drag took 3.23s in LiMR and 1.52s in the baseline; similar rAF intervals do not imply identical processing cost. Data: [selection.json](../../benchmarks/results/selection.json).

| Node scenario | LiMR | Baseline |
| --- | ---: | ---: |
| 87,381 characters, SSR | 123.85 ms | 135.80 ms |
| 877,782 characters, SSR | 5,508.29 ms | 2,720.70 ms |
| 34,860 characters, 137 core appends/finalization | 164.04 ms | 2,673.74 ms |

Large-document SSR varied substantially: LiMR samples were 2.64–9.10s and baseline 2.70–5.03s. These results show no SSR advantage. The append baseline reparses the entire prefix each time. Data: [node.json](../../benchmarks/results/node.json).

## Practical limits

Keeping the full DOM supports search, selection, and printing, but initial long-document rendering still costs time. Incremental parsing reuses stable prefixes; long tail blocks, document-scoped transforms, definition changes, middle edits, and finalization can remain expensive. Keep extensions/plugins stable and limit highlighting languages/length when appropriate.

The measurements do not cover large formula collections, Shiki cold starts, dense annotations, third-party plugins, full Reader layouts, or physical mobile devices. Installed font size also differs from browser transfers; see [styles and fonts](styles.md).

## Reproduce in the repository

```sh
NODE_ENV=production pnpm bench
pnpm exec vite build
pnpm exec vite preview --host 127.0.0.1 --port 4174
# In another terminal:
pnpm bench:browser
pnpm bench:selection
```

Avoid concurrent builds/benchmarks. Scripts write benchmarks/results. Reevaluate using your hardware, content, and built version rather than treating historical numbers as current-package acceptance.
