# 性能与限制

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/performance) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/performance.md)

前几节保留仓库 **2026-10-12** 的历史基准，便于对照。文末 **2026-10-13** 一节记录本次优化实测。两组数据都不是性能保证。

环境：Intel Core i7-13700、WSL2/Linux、Node 20.19.5、Chromium 156.0.8078.4、React 19 production。对照为 react-markdown 10.1.0 + remark-gfm 4.0.1。

## 浏览器

双方渲染同一份 GFM，使用相同排版，只比较正文，不含 Reader 目录/侧栏。每组取三个独立页面样本的中位数，预热并等待字体，交替测量；计时包括同步 React 提交和强制布局，不包括网络、异步重资源和帧间空闲时间。

| 场景 | LiMR | react-markdown |
| --- | ---: | ---: |
| 87,381 字符，200 节，首次挂载 | 126.1 ms | 134.0 ms |
| 877,782 字符，2,000 节，首次挂载 | 1,345.4 ms | 1,437.6 ms |
| 34,860 字符，138 次流式提交，累计同步时间 | 306.1 ms | 1,864.1 ms |
| 同一流式场景，单次提交 P95 | 2.9 ms | 23.7 ms |

最后一次完整解析包含在统计中；P95 不代表每帧都低于 16ms。原始数据：[browser.json](../../benchmarks/results/browser.json)。

## 选区与 SSR

历史长文拖选绘制延迟 P95 为 25.2–28.5ms，代码为 18.9–19.4ms。这是 selectionchange 到覆盖层变更的延迟，不是硬件输入到屏幕的延迟。同一自动化拖动手势总耗时 LiMR 3.23s，对照 1.52s；不能因为 rAF 接近就声称成本相同。数据：[selection.json](../../benchmarks/results/selection.json)。

| Node 场景 | LiMR | 对照 |
| --- | ---: | ---: |
| 87,381 字符，SSR | 123.85 ms | 135.80 ms |
| 877,782 字符，SSR | 5,508.29 ms | 2,720.70 ms |
| 34,860 字符，137 次核心追加及收尾 | 164.04 ms | 2,673.74 ms |

大文档 SSR 波动明显，LiMR 的样本为 2.64–9.10s，对照为 2.70–5.03s；这组数据不显示 SSR 优势。核心追加对照每次重新解析完整前缀。数据：[node.json](../../benchmarks/results/node.json)。

## 使用限制

保留全部 DOM 支持搜索、选择和打印，因此首次完整长文渲染仍有成本。增量解析复用稳定前缀；长尾块、全文 transform、定义变化、中间编辑和收尾仍可昂贵。保持 extensions/plugins 引用稳定，按需要限制高亮语言和长度。

上面的历史测量未覆盖完整 Reader 布局；下方新增的 KP 对照包含一个完整 Reader 场景。两组数据都未覆盖大量公式、Shiki 冷启动、任意密集标注或插件组合、实体移动设备。字体安装体积与浏览器请求量也不同，见[样式与字体](styles.md)。

## 在仓库复现

```sh
NODE_ENV=production pnpm bench
pnpm exec vite build
pnpm exec vite preview --host 127.0.0.1 --port 4174
# 在另一个终端执行：
pnpm bench:browser
pnpm bench:selection
```

运行时避免同时构建或跑其他基准；脚本写入 benchmarks/results。每次使用自己的硬件、内容和已构建版本重新判断，不把历史测量当作最新包验收结果。

## 2026-10-13：流式与排版优化实测

以下为本次工作区实现与修改前提交 `ebab991` 的同进程对比，使用同一依赖、原始 UTF-16 输入、分块大小和五次交错顺序采样，按总耗时取中位样本。数据只包含核心追加和收尾，不包含 React、浏览器布局、异步高亮或网络。机器和运行时见 [streaming.json](../../benchmarks/results/streaming.json)。

| 场景 | 字符数 | 修改前总耗时 | 修改后总耗时 |
| --- | ---: | ---: | ---: |
| GFM | 34,860 | 139.22ms | 89.07ms |
| 默认模块 | 34,860 | 141.40ms | 94.63ms |
| 增长的代码围栏 | 43,209 | 1335.87ms | 29.05ms |
| 单个长段落 | 7,840 | 72.43ms | 74.32ms |

优化包含：追加时增量维护行号、缓存已完成节点的语义索引、局部收尾、持续增长代码的词法快速路径，以及按需创建代码字符映射。仍在增长的复杂段落要重新解析；单个长段落的差异较小且受运行波动影响，不能据此声称所有内容都同比加速。

运行 `pnpm bench:streaming` 测量当前核心。需要交错对照时，将 `LIMR_BENCH_BASELINE` 指向未修改的 `ebab991` 独立检出目录，并确保那里可访问相同依赖。脚本写入 `benchmarks/results/streaming.json`；复跑不意味着能复现历史硬件与耗时。

生产 Chromium 156 的完整同步更新（React 提交加布局、默认排版和增量动画）中，默认模块的 34,860 字符流式文档 P95 为 **3.9ms**、最大 7.3ms；43,211 字符代码 P95 为 **2.6ms**、最大 12.4ms。每种场景三次隔离页面采样、字体预热、256 字符一块，rAF 等待和异步高亮不计入。这里没有浏览器旧版本对照，也不代表物理设备上的端到端帧率。原始数据：[streaming-browser.json](../../benchmarks/results/streaming-browser.json)。

KP 提供独立生产基准：在完整 scikit-learn Playground 中保留目录、侧栏和标注，每种模式使用三个独立页面，各进行三轮向下/向上滚动，再进行 32 次 1100–1420px 的窗口宽度变化。第一轮包含新进入视口的段落排版，后续轮次复用结果。以下合并每种模式的 1,080 个滚动样本和 96 个缩放样本，没有 CPU 降速。

| 测量 | 标准模式 | Knuth–Plass |
| --- | ---: | ---: |
| 滚动中位数 / P95 / 最大值 | 16.6 / 17.0 / 18.5ms | 16.6 / 19.8 / 46.5ms |
| 缩放中位数 / P95 / 最大值 | 11.2 / 24.1 / 31.9ms | 17.7 / 41.6 / 49.9ms |
| 超过 50ms 的滚动样本 | 0 / 1,080 | 0 / 1,080 |
| 超过 50ms 的缩放样本 | 0 / 96 | 0 / 96 |

侧栏起点定位按源码范围跳过无关绑定，找到首个可见字符即停止，不再为每条批注遍历全部 KP 行节点。

滚动计时从 `scrollTo` 到下一次 rAF；缩放计时包含窗口宽度更新、协议开销和下一次 rAF。KP 在缩放时仍有额外成本，但本轮未复现此前的长时间卡顿。这是本机 Chromium 的结果，不代表物理设备输入延迟或任意插件下的性能保证。原始样本和精确测量边界见 [layout.json](../../benchmarks/results/layout.json)。

```sh
pnpm build:playground
pnpm preview:playground --port 4174
# 在另一个终端执行，避免同时构建或测试：
pnpm exec tsx benchmarks/layout.ts
BENCH_URL=http://127.0.0.1:4174/LiMR pnpm exec tsx benchmarks/streaming-browser.ts
```

准备阶段将字形测量、断词、合法断点与前缀和独立于行宽缓存。渲染使用每行的词间距片段，减少逐空格 DOM；宽度变化时，断点不变则原位调整间距，断点变化则复用文本容器。同步测量共用一个 Range，避免后续 DOM 修改维护大量尚未回收的活动 Range。高亮几何缓存为段落局部坐标，KP 的相邻绘制片段按行合并，集中读写避免每个矩形强制布局。视口蒙层坐标不向正文继承。滚动保留已排版节点，不重复求解段落。
