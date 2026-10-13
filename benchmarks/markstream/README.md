# LiMR 与 Markstream 性能比较

测量日期：**2026-10-13**。这是一组本地浏览器实测，不引用其他项目宣传页的性能倍数。

**结论：Markstream 在长代码块、长表格的追加处理上更快；LiMR 在完整 GFM 长文中占用更少的 JS 堆内存。本次默认功能长文浏览，LiMR 正常完成，Markstream 2.0.19 的默认虚拟化出现可见内容空白，不能把它的低滚动开销判为体验优势。**

## 环境与证据

- LiMR：本地 `@linloir/limr` 1.0.0，提交 `a4c9eb36c6ae36636ff37d5fcb5feb290c02fa55`；`src` 无差异。比较的是该源码快照，不是另一个已发布包。
- Markstream：npm `markstream-react` 2.0.19，`stream-markdown-parser` 1.2.20，`markstream-core` 2.0.19。
- React / React DOM 19.3.0，Chromium 156.0.8078.4，Node 20.19.5，Intel i7-13700，WSL2/Linux，1440 × 900，Vite production build。
- 默认功能测试安装 `stream-diffs` 0.0.2（锁定的传递依赖 `@pierre/diffs` 1.5.2）、KaTeX 0.19.0；LiMR 使用 Shiki 4.5.0。完整版本与输入 SHA-256 在原始 JSON 中。
- 未限速 CPU / 网络；资源由本机服务器提供。每个样本使用独立浏览器上下文，渲染器顺序交替。测试串行运行。

原始数据：

- [主测试：76 个样本](../results/markstream.json)：7 个正文场景 × 2 个渲染器 × 5 次，加上默认长文 2 × 3 次。
- [代码块排版对齐复测：10 个样本](../results/markstream-code.json)：覆盖两者原生 `<pre>` 的不同内联字号、行高，并严格核对代码内部空白。两者最终高度都是 12,600 px。下表代码行使用这组数据，取代主测试中的代码行。
- [新浏览器复核：2 个样本](../results/markstream-reading-repeat.json)：独立启动浏览器，再运行一次默认长文测试。

正式测试及复核合计 88 个样本。前期调试样本不参与统计。下面每个指标分别取样本中位数，不将不同指标拼成一个真实样本，也不将 P95 当作所有更新的上限。

## 默认功能下浏览超长文档

这组更接近用户实际浏览：**不关闭代码高亮、公式、选择交互、默认动画、虚拟化或其他默认插件**，使用各自正式 CSS。LiMR 使用完整字体样式，Markstream 使用官方 CSS。正文容器宽 900 px，通过普通 React `root.render()` 挂载，没有强制同步提交。

双方接收同一份 **831,559 字符、240 节**的技术文档，包括：

- 240 个 TypeScript / Python / JSON 代码块，内容随章节变化，避免重复内容缓存掩盖开销。
- 240 个块级公式和 240 个行内公式，表达式随章节变化。
- 240 张表格，每张 12 行数据，以及引用、任务列表、嵌套列表、链接和格式化段落。
- 30 个图片节点，复用一个本地 SVG。该场景覆盖图片布局与懒加载，不代表 30 张独立大图的下载和解码成本。

浏览过程：等待首屏特殊块就绪，执行 5 秒向下、2 秒向上的实际浏览器滚轮手势，然后依次跳到文档中部、末尾和顶部。记录可见内容、占位块、代码高亮、公式、尾部标记、帧间隔、长任务和 JS 堆。滚动阶段不做 DOM 全量扫描或 GC。

| 指标 | LiMR 默认配置 | Markstream 默认配置 |
| --- | ---: | --- |
| 首屏可读时间，自导航开始 | **1,400.7 ms** | 未通过：观察到的首帧已空白 |
| 首帧之后，首屏代码/公式稳定等待 | **1,444.0 ms** | 等待 15 秒仍未通过可见性校验 |
| 7 秒连续滚动，rAF 间隔 P95 | **16.8 ms** | 16.7 ms，但视口空白，此值不能用于判优 |
| 滚动区间最大帧间隔，中位数 | **33.4 ms** | 16.8 ms，同样不能用于判优 |
| 滚动阶段超过 50 ms 的长任务 | **三轮均为 0** | 三轮均为 0，但未正常显示内容 |
| 中部 / 末尾 / 返回顶部 | **全部可读** | 中部、返回顶部空白；末尾可读 |
| 浏览验收 | **3 / 3 通过** | **0 / 3 通过** |

首屏可读是挂载后的 DOM/动画帧观察值，不是浏览器 FCP / LCP。稳定等待还包括约 300 ms 的连续稳定判定窗。rAF 是调度间隔代理，不是实体屏幕 FPS 或 INP。

LiMR 首屏阶段仍有明显阻塞：每轮最长主线程长任务为 **592 / 635 / 634 ms**。因此“后续滚动平稳”不等于“首次打开没有卡顿”。首屏稳定后的 JS 堆中位数约 **42.1 MiB**，完成浏览后约 **45.9 MiB**；这是 GC 后 JS 堆，不是整个浏览器的内存峰值。

新浏览器复核中，LiMR 首屏为 **1,241.2 ms**，随后稳定等待 **1,341.8 ms**；Markstream 再次出现同样的空白。该复核不计入上表三次中位数。

### Markstream 空白的具体边界

本次普通文档页面中，`scrollY` 仍为 0 时，已挂载的章节范围变成 **221–240**，前面是巨大的 `node-spacer`。中部等待 8 秒、返回顶部等待 8 秒后，视口内正文元素数量仍为 0；跳到末尾可以看到结束标记。控制台没有报错。额外限制渲染器容器高度并启用容器滚动的诊断也复现了跳转后的空白。

源码与现象一致：默认 `maxLiveNodes` 为 320，节点可见性回调以 `max(previous, index)` 推进焦点，观察根来自渲染器自身容器。这里是**版本 2.0.19、该页面结构与输入**的失败，不推断所有 Markstream 版本或集成方式都如此。[对应版本 NodeRenderer 源码](https://github.com/Simon-He95/markstream-vue/blob/markstream-react%402.0.19/packages/markstream-react/src/components/NodeRenderer.tsx)，[可见性观察实现](https://github.com/Simon-He95/markstream-vue/blob/markstream-react%402.0.19/packages/markstream-react/src/context/viewportPriority.tsx)。

报告保留这些失败样本。默认配置的 Markstream JS 堆、CPU 和节点数对应不完整的浏览内容，不能与 LiMR 全文直接进行资源效率排名。运行器生成的截图位于 `artifacts/markstream/`，可检查 `markstream-initial.png`、`markstream-seek-0.5.png` 和 `markstream-seek-0.png`。

## 对齐功能后的完整正文测试

这组解释解析、React 提交和布局的基础成本。双方使用 GFM、原生代码文本、相同字体/字号/行高和排版规则。LiMR 配置 `extensions={[gfm()]}`、`interactive={false}`；Markstream 关闭虚拟化、分批/延迟渲染、平滑输出和淡入动画，并使用 `renderCodeBlocksAsPre`。完整配置见 [options.ts](options.ts)。这组设置只用于本节，未用于上面的默认功能测试。

每次测试前进行两次小文档预热。流式输入每次追加 256 个 UTF-16 字符，每次更新间隔一个 rAF，最后另做一次结束提交，包含 LiMR 的完整收尾解析。计时包括 `flushSync` 内的解析、React 提交和强制布局，排除网络加载和帧间空闲。全部正文样本通过标题、段落、列表、表格和代码的独立 `react-markdown` + `remark-gfm` DOM 内容校验。

| 场景 | 字符数 / 提交数 | LiMR 同步耗时 | Markstream 同步耗时 |
| --- | ---: | ---: | ---: |
| 短文首次挂载 | 8,700 / 1 | 20.9 ms | **16.8 ms** |
| 中篇首次挂载 | 87,381 / 1 | 119.0 ms | **109.4 ms** |
| 长文首次挂载 | 877,782 / 1 | 1,248.6 ms | **962.6 ms** |
| 混合内容流式累计 | 34,860 / 139 | **301.4 ms** | 306.5 ms |
| 单个长代码块流式累计 | 34,488 / 137 | 351.6 ms | **188.8 ms** |
| 单张长表格流式累计 | 30,922 / 123 | 1,746.0 ms | **717.7 ms** |
| 单个长段落流式累计 | 32,500 / 129 | 1,505.3 ms | **1,091.2 ms** |

混合流式的同步差异约 1.7%，宜视为接近。长代码块和长表格的同步耗时优势约为 1.86 倍和 2.43 倍。Markstream 长文首次挂载有一次 2,296.5 ms 的较慢样本，五次范围 **917.1–2,296.5 ms**；LiMR 为 **1,244.7–1,390.6 ms**。中位数优势不是尾延迟保证。

| 流式场景 | LiMR 单次提交 P95 | Markstream 单次提交 P95 | LiMR 总主线程时间 | Markstream 总主线程时间 |
| --- | ---: | ---: | ---: | ---: |
| 混合内容 | 2.9 ms | 3.2 ms | **457.5 ms** | 586.9 ms |
| 长代码块 | 4.3 ms | **2.3 ms** | 505.4 ms | **330.8 ms** |
| 长表格 | 25.1 ms | **8.8 ms** | 1,925.5 ms | **1,091.1 ms** |
| 长段落 | 20.5 ms | **16.0 ms** | 1,655.0 ms | **1,590.9 ms** |

总主线程时间使用 CDP `TaskDuration` 差值，还覆盖同步计时区间之外的浏览器工作和少量基准调度开销。长段落在这个口径下只差约 **4%**，不能把同步提交的差距直接当作整体 CPU 差距。混合流式中 LiMR 的收尾提交中位数为 **36.6 ms**，Markstream 为 **13.5 ms**；低 P95 会隐藏这次较慢收尾。

### 内存与 DOM

以下是完整正文场景，使用同页预热并卸载后的 GC 堆作为基线，再减去渲染后 GC 堆；不是进程 RSS 或分配峰值。

| 场景 | LiMR 新增 JS 堆 | Markstream 新增 JS 堆 | LiMR / Markstream 正文元素数 |
| --- | ---: | ---: | ---: |
| 87,381 字符完整长文 | **4.28 MiB** | 13.05 MiB | 4,002 / 15,201 |
| 877,782 字符完整长文 | **40.84 MiB** | 126.34 MiB | 40,002 / 152,001 |
| 长代码块流式完成 | 2.29 MiB | **1.10 MiB** | 5 / 5 |
| 长表格流式完成 | **3.42 MiB** | 10.64 MiB | 2,410 / 7,992 |

在本组 GFM 长文中，LiMR 的保留 JS 堆约为 Markstream 的三分之一，同时生成更少的包装元素。代码块是反例，不能概括成 LiMR 在所有输入上都更省内存。

## 对 LiMR 的含义

1. **当前大文档阅读可以用，但首屏仍值得优化。** 83 万字符的默认文档首屏约 1.40 秒，随后重资源继续加载；需要将首次打开的长任务与后续滚动分别看待。
2. **长尾块增量处理是明确短板。** LiMR 的稳定前缀复用对混合内容有效，但单个大代码块、表格或段落持续增长时，核心仍从最后一个块的起点重新解析。优先研究长尾块的更细粒度复用。[本地核心实现](../../src/core/engine.ts)
3. **结束提交也需要关注。** 混合流式的全文收尾比平时更新慢，不能只优化 P95。[本地 React 渲染实现](../../src/react/render.tsx)
4. **保留阅读能力是资源策略的约束。** LiMR 的全文 DOM 支持浏览器搜索、选择和打印。引入虚拟化前，应同时验收跳转、反向滚动、选区、可访问性和打印，而不只比较 DOM 数量。

本报告没有对 SSR、移动设备、密集标注、完整 Reader 目录/侧栏、第三方插件、Mermaid / D2 / Infographic 或公网资源加载做性能结论。LiMR 的问答、定义、标注和翻译等专有块未作为共同输入；Markstream 的独有图表能力也未折算成相同功能。共有特殊块的默认功能测试与 GFM 基础测试应分开解读。[Markstream 官方 React 用法与可选依赖](https://markstream.simonhe.me/guide/react-quick-start)

## 复现

```sh
pnpm install --frozen-lockfile
NODE_ENV=production pnpm bench:markstream
```

脚本自动构建独立生产页面，在 `127.0.0.1:4175` 临时启动预览服务，串行执行测试，逐样本保存 `benchmarks/results/markstream.json`，完成后关闭浏览器与服务。不需要占用 Playground 的 4173 端口。

```sh
# 只测默认功能下的实际阅读，三轮
NODE_ENV=production BENCH_SUITE=reading pnpm bench:markstream

# 只测对齐功能的正文，五轮
NODE_ENV=production BENCH_SUITE=full pnpm bench:markstream

# 指定样本数量、输入规模、结果文件
NODE_ENV=production BENCH_SUITE=reading BENCH_READING_TRIALS=1 \
  BENCH_RICH_SECTIONS=240 BENCH_OUTPUT=artifacts/my-reading.json pnpm bench:markstream
```

`BENCH_TRIALS` 控制基础场景次数，`BENCH_FILTER` 可筛选基础场景名；`BENCH_NO_BUILD=1` 仅适用于源码、样式和依赖均未变化的已构建版本。报告表格是本次固定快照，不会随重跑自动改写；重跑应查看新 JSON。固定脚本、浏览器与依赖版本，避免同时构建或运行其他性能测试。
