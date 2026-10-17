# 加载与内存性能

[文档目录](README.md) · [English](../en/loading-performance.md)

本报告测量完整输入通过 `AsyncReader`、真实 Worker 和默认阅读功能的加载、内存及交互。加载模式决定正文何时可以开始显示；默认 Worker 的解析策略、完整源文档和索引不会因为渐进显示而省略。

LiMR **1.3.0** · React **19.3.0** · Chromium **156.0.8078.4** · Node **v20.19.5**. 13th Gen Intel(R) Core(TM) i7-13700; 24 逻辑核; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

## 50/75 MiB 横向比较

相同完整输入，LiMR **1.3.0**、react-markdown **10.1.0**、Markstream **2.0.19**，四类输入各运行三个全新浏览器进程，共 36 次。共同语法包含 Markdown/GFM、代码、公式和本地图片，不把 LiMR 独有的翻译/批注语法放进横向排名。保留各自默认动画、延迟渲染与窗口化策略。

| 共同输入 | UTF-8 MiB | UTF-16 | 完整单元数 |
| --- | --- | --- | --- |
| prose-50 | 50.00 | 17,533,763 | 42765 |
| prose-75 | 75.00 | 26,300,383 | 64147 |
| rich-50 | 50.00 | 52,429,758 | 15913 |
| rich-75 | 75.00 | 78,643,854 | 23849 |

`prose` 为中文段落；`rich` 每节使用独立编号、代码与公式，另含格式化正文、表格、任务列表、引用与本地图。所有输入保留完整最后一节和结尾校验标记。共同输入由仓库脚本确定性生成，不依赖外部论文文件。

| 集成 | 实际配置 |
| --- | --- |
| LiMR | AsyncReader 默认 blocking + 标准 Worker；默认模块、目录、侧栏和动画；自动正文窗口 |
| react-markdown | ReactMarkdown + remark-gfm + remark-math + rehype-katex + async Shiki; full DOM |
| Markstream | MarkdownRender content + final=true; default virtualization/batching/lazy rendering/effects; package CSS + KaTeX + stream-diffs |

这是各组件公开接口的应用接入比较，各自承担的 DOM 与 UI 工作并不相同。没有给对比库补写 Worker 或窗口系统，也没有禁用 LiMR 的默认阅读功能。字体/样式沿用各自集成；正文实际宽度在原始数据中记录。统一 1440×1000 视口，文件预先取得为 Blob；首屏计时包含解码、解析、渲染、字体就绪及两帧，要求开头标题与段落在视口可见。只出现空壳或末尾内容不算首屏可读；若滚动位置为顶部、结尾已挂载而开头持续缺失 5 秒，也记录首次阅读失败。

| 输入 / 渲染器 | 完整阅读验收 | 首屏可读 s | 已观测峰值 RSS MiB | 首屏后 5s RSS MiB |
| --- | --- | --- | --- | --- |
| prose-50 / LiMR | 3/3 | 1.46 [1.45–1.47] | 441.87 [439.55–443.57] | 425.18 [422.77–427.09] |
| prose-50 / react-markdown | 3/3 | 5.08 [5.05–5.09] | 993.66 [993.25–995.06] | 968.64 [967.20–968.88] |
| prose-50 / Markstream | 0/3; 首/中/尾内容未通过 | — | 1579.10 [1576.41–1580.67] | — |
| prose-75 / LiMR | 3/3 | 2.13 [2.08–2.20] | 553.30 [496.80–575.27] | 470.78 [416.94–470.89] |
| prose-75 / react-markdown | 3/3 | 7.53 [7.50–7.54] | 1265.51 [1264.45–1269.10] | 1245.77 [1244.30–1246.06] |
| prose-75 / Markstream | 0/3; 首/中/尾内容未通过 | — | 2327.94 [2320.22–2383.15] | — |
| rich-50 / LiMR | 3/3 | 19.28 [19.19–19.45] | 1318.04 [1315.74–1322.91] | 1255.48 [1014.33–1255.66] |
| rich-50 / react-markdown | 0/3; 6 GiB RSS 保护中止 | — | 6151.55 [6144.35–6152.21] | — |
| rich-50 / Markstream | 0/3; 6 GiB RSS 保护中止 | — | 6147.41 [6144.66–6151.62] | — |
| rich-75 / LiMR | 3/3 | 29.76 [29.33–30.10] | 1726.36 [1690.46–1747.95] | 1236.96 [1225.28–1243.86] |
| rich-75 / react-markdown | 0/3; 180s 超时 | — | 4650.24 [4366.29–5580.74] | — |
| rich-75 / Markstream | 0/3; 6 GiB RSS 保护中止 | — | 6147.68 [6146.42–6149.86] | — |

表格为三次运行的中位数 [最小–最大]。首屏、空闲内存和下面的滚动数值仅统计通过内容与环境检查的运行；失败原始样本完整保留。每次统一限制 180 秒与 6 GiB Renderer RSS，保护中止的已观测峰值只是停止点，不是成功渲染的完整峰值，不能据此宣称更省内存。未能显示开头的可响应页面会在 170 秒报告失败；完全阻塞时由外部超时保护结束。该保护是本测试预算，不是库的理论大小上限。

| 输入 / 渲染器 | 常速 P95 ms | 快速 P95 ms | 首屏 DOM 元素 |
| --- | --- | --- | --- |
| prose-50 / LiMR | 16.90 | 16.80 | 88.00 |
| prose-50 / react-markdown | 16.90 | 16.90 | 42770.00 |
| prose-50 / Markstream | — | — | — |
| prose-75 / LiMR | 17.00 | 17.00 | 88.00 |
| prose-75 / react-markdown | 16.90 | 16.90 | 64152.00 |
| prose-75 / Markstream | — | — | — |
| rich-50 / LiMR | 17.10 | 17.30 | 383.00 |
| rich-50 / react-markdown | — | — | — |
| rich-50 / Markstream | — | — | — |
| rich-75 / LiMR | 17.30 | 17.20 | 383.00 |
| rich-75 / react-markdown | — | — | — |
| rich-75 / Markstream | — | — | — |

阅读检查访问开头、中部、结尾与开头，要求正文覆盖视口、开头标记正确、末尾标记可见。LiMR 使用公开 source 导航跨越压缩滚动范围，其他集成使用原生滚动条比例；跳转耗时不做横向排名。常速/快速各采 60 帧。RSS 无强制 GC，包含 Worker 与原生分配；rAF 不代表物理显示延迟。完整原始数据包含 GPU/浏览器身份、每次结果、错误、帧与采样轨迹。

横向矩阵环境：**headless**；GPU renderer 为 `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver-5.0.0)`，compositing 为 `disabled_software`。

[large-comparison.json](../../benchmarks/results/large-comparison.json)

## 输入与测试边界

每个加载组合使用三个全新浏览器进程，1440×1000 CSS 视口。正文、目录、折叠侧栏、动画、代码高亮、公式、图片与自动 DOM 窗口均保留；没有通过关闭功能降低成本。输入文件先取得为 Blob，计时从交给组件开始，包含 UTF-8 解码、Worker 解析和索引、结果传输与接收、React 正文挂载，不含磁盘/网络获取和样本生成。

| 样本 | UTF-8 MiB | UTF-16 | 完整单元数 |
| --- | --- | --- | --- |
| prose-50 | 50.00 | 17,533,776 | 42765 |
| prose-75 | 75.00 | 26,300,396 | 64147 |
| papers-50 | 50.20 | 42,038,406 | 85 |
| papers-75 | 75.00 | 62,810,262 | 127 |
| unique-rich-10 | 10.00 | 10,319,582 | 20778 |

`prose` 是中文纯段落；`papers` 反复拼接 Transformer 与 GPT 综述的完整双语标注文档，保留表格、数学、代码、图片和重复定义 ID，达到目标体积后不截断最后一份论文；它不是独立撰写的 50/75 MiB 文档。`unique-rich` 是 10 MiB 确定性合成内容，每节有独立编号、引用定义和脚注，覆盖去重收益较小的情况。原始 JSON 保存字节数、UTF-16 长度、单元数、内容哈希和所有计数；论文正文与媒体来自本地语料，不随仓库分发。

## 从输入到可阅读正文

单位秒，中位数 [最小–最大]。预览必须有当前 provisional engine 的可见标题和段落，再经过一帧；完整可读要求完整 engine 的相同可见性检查、字体就绪及下一帧。DOM/帧代理不等同于像素实际呈现，也不是 FCP/LCP。`blocking` 不提供预览；最终就绪时进度才到 100%。

| 场景 | 预览可读 s | 完整就绪 s | 完整正文可见 s | 验收 |
| --- | --- | --- | --- | --- |
| prose-50 / blocking | — | 1.42 [1.41–1.47] | 1.42 [1.41–1.47] | 3/3 |
| prose-75 / progressive | 0.20 [0.19–0.20] | 2.07 [2.07–2.07] | 2.07 [2.07–2.07] | 3/3 |
| papers-50 / blocking | — | 29.17 [28.95–29.25] | 29.22 [29.00–29.30] | 3/3 |
| papers-50 / progressive | 0.38 [0.37–0.39] | 29.87 [29.82–29.87] | 29.88 [29.83–29.88] | 3/3 |
| papers-75 / blocking | — | 44.36 [44.27–44.37] | 44.42 [44.33–44.43] | 3/3 |
| papers-75 / progressive | 0.42 [0.42–0.42] | 45.25 [44.99–46.48] | 45.26 [45.00–46.49] | 3/3 |
| unique-rich-10 / blocking | — | 19.97 [19.85–20.00] | 20.01 [19.88–20.02] | 3/3 |
| prose-50 / blocking / KP | — | 1.42 [1.41–1.44] | 1.42 [1.41–1.44] | 3/3 |

## 内存：进程、堆和缓冲区

MiB，中位数 [最小–最大]。外部每 25ms 读取 Linux `/proc`，峰值覆盖加载、空闲及后续阅读探测；空闲值在完整正文可见后等待 5 秒取得，不强制 GC。Renderer RSS 包括主线程与 Worker、引擎空间及原生分配，并不等于 JS 活对象大小；采样峰值可能漏过更短的尖峰。主 isolate 堆和 backing storage 另由 CDP 读取，不含独立 Worker 的 JS 堆，不能与 RSS 相加。

| 场景 | 峰值 Renderer RSS | 5s 空闲 RSS | 主线程 JS 堆 | 主线程 backing storage |
| --- | --- | --- | --- | --- |
| prose-50 / blocking | 442.75 [437.82–461.67] | 362.75 [353.64–413.52] | 101.96 | 2.18 |
| prose-75 / progressive | 553.48 [518.52–567.97] | 499.65 [417.87–523.17] | 201.86 | 1.84 |
| papers-50 / blocking | 1884.86 [1868.18–2097.52] | 1463.27 [1460.33–1723.99] | 322.42 | 219.60 |
| papers-50 / progressive | 2187.26 [2175.41–2192.09] | 1815.26 [1804.27–1818.84] | 335.08 | 219.23 |
| papers-75 / blocking | 2772.08 [2740.62–2788.71] | 2331.38 [2291.91–2351.94] | 471.92 | 327.24 |
| papers-75 / progressive | 2676.22 [2664.49–2785.95] | 2206.43 [2070.26–2406.17] | 507.84 | 326.62 |
| unique-rich-10 / blocking | 1045.50 [1041.70–1107.69] | 1024.71 [1016.38–1058.02] | 269.56 | 165.10 |
| prose-50 / blocking / KP | 452.03 [432.09–470.94] | 368.22 [365.21–437.53] | 117.61 | 2.23 |

这些结果没有 2 GiB 的硬性上限。完整源文本、AST 和全局索引仍随文档复杂度增长；分页打包和字符串/形状去重减少传输重叠，并没有把公开快照改成按需解压的磁盘存储。DOM 窗口减少挂载成本，不会把整个语法树从内存移走。单个巨大列表、表格、围栏或自定义语法还可能超出窗口化/有界解析条件。

## 加载后的长文阅读

每个大文档完成后跳至顶部、25%、50%、75%、结尾和顶部，验证视口中有正文、结尾标记可见且无水平溢出。随后分别执行 60 帧常速与 60 帧快速滚动；数值为各次运行 rAF 间隔 P95 的中位数，不是完整文档每一处内容的覆盖率或输入延迟。

| 场景 | 常速 P95 ms | 快速 P95 ms | 首屏 DOM 元素 |
| --- | --- | --- | --- |
| prose-50 / blocking | 16.90 | 16.80 | 96 |
| prose-75 / progressive | 17.00 | 16.90 | 96 |
| papers-50 / blocking | 20.40 | 41.00 | 1145 |
| papers-50 / progressive | 19.70 | 31.70 | 1328 |
| papers-75 / blocking | 27.20 | 61.00 | 1145 |
| papers-75 / progressive | 26.00 | 45.30 | 1328 |
| unique-rich-10 / blocking | 17.20 | 29.30 | 642 |
| prose-50 / blocking / KP | 16.90 | 16.80 | 122 |

## 完整论文与交互矩阵

另使用两个完整原始论文、三种排版、两种侧栏折叠方式，各三个独立页面，共 36 次 AsyncReader 阅读。Worker 与自动窗口化开启，保留默认功能；每页测试 480px/s 阅读、快速滚动、120 次全文跳转、静止及滚动中切换译文、两次变宽。下表按论文与排版合并两种侧栏，共六次运行；值为每次运行 P95 的中位数。

| 论文 / 排版 | 内容验收 | 环境核实 | 常速 P95 ms | 快速 P95 ms | 跳转 P95 ms |
| --- | --- | --- | --- | --- | --- |
| Transformer / standard | 6/6 | 6/6 | 17.50 | 25.20 | 40.20 |
| Transformer / justify | 6/6 | 6/6 | 17.60 | 26.30 | 37.40 |
| Transformer / knuth-plass | 6/6 | 6/6 | 17.60 | 30.10 | 47.40 |
| GPT survey / standard | 6/6 | 6/6 | 17.50 | 22.50 | 37.70 |
| GPT survey / justify | 6/6 | 6/6 | 17.50 | 22.80 | 36.60 |
| GPT survey / knuth-plass | 6/6 | 6/6 | 17.50 | 26.70 | 51.00 |

大输入运行在 **headless**；完整论文矩阵运行在 **headed**。两组不合并计时。实际 GPU renderer 分别为 `ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero) (0x0000C0DE)), SwiftShader driver-5.0.0)` 与 `ANGLE (Microsoft Corporation, D3D12 (Intel(R) UHD Graphics 770), OpenGL 4.1 (Core Profile) Mesa 23.2.1-1ubuntu3.1~22.04.4)`；compositing 状态分别为 `disabled_software`、`enabled`。窗口模式本身不代表硬件加速。

## 复现与原始数据

下列命令串行运行基础比较矩阵、大输入加载与完整论文阅读，并校验源代码、测试代码、Playground、示例插件、锁文件及版本哈希一致后生成报告和首页指标。完整论文阶段默认使用 headed Chromium，需要可用图形会话；设置 `BENCH_BROWSER_MODE=headless` 可单独生成明确标注的 headless 数据。不要同时运行构建或其他测试。

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
BENCH_READING_SOURCE_DIR=/path/to/test-reading pnpm bench --extended
# Regenerate only, after all matching results exist:
BENCH_EXTENDED=1 pnpm bench:report
```

[loading.json](../../benchmarks/results/loading.json) · [reading.json](../../benchmarks/results/reading.json) · [测试说明](../../benchmarks/README.md) · [加载 API 与限制](large-documents.md) · [渲染与流式性能](performance.md).
