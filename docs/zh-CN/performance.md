# 渲染器性能报告

[文档目录](README.md) · [English](../en/performance.md)

本轮测试日期 **2026-10-14 (Asia/Shanghai)**. LiMR **1.0.1**, react-markdown **10.1.0**, Markstream React **2.0.19**, React/React DOM **19.3.0**, Node **v20.19.5**, Chromium **156.0.8078.4**. 13th Gen Intel(R) Core(TM) i7-13700; 24 逻辑核; 31.2 GiB; linux 6.18.40.1-microsoft-standard-WSL2.

本文对应本轮实际执行的测试结果。使用锁文件内依赖，没有升级竞争库。测试串行执行，无 CPU/网络降速；本机仍有编辑器等常驻进程，因此结果是共享工作站上的描述性测量。窄屏是 Chromium 视口模拟，不是实体手机。每组环境、负载、源码与锁文件 SHA-256 和全部样本均在原始 JSON 中。

## 本轮结论

87.8 万字符的受控全文挂载中，Markstream 的中位时间最短（814.60ms）。下表同时给出范围、内存、DOM、流式更新及默认阅读验收；单项最快不能推导为所有场景最快。

混合流式累计同步时间：**LiMR 288.60ms / react-markdown 1919.80ms / Markstream 335.20ms**；长代码流式：**LiMR 153.80ms / react-markdown 287.20ms / Markstream 181.10ms**。它们与下方长表格、单长段落的结果不同，说明稳定前缀复用带来的收益取决于内容结构。

| 默认阅读场景 | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| rich-medium | 3/3 通过 | 3/3 通过 | 0/3 通过 |
| rich-large | 3/3 通过 | 3/3 通过 | 0/3 通过 |
| rich-mobile | 3/3 通过 | 3/3 通过 | 2/3 通过 |

验收失败的帧率、内存或首屏耗时不能作为可用阅读体验的优势。KP 是可选排版模式，默认比较使用 standard；其完整报告独立列于 [KP 算法性能报告](knuth-plass-performance.md)。

## 配置与公平性

LiMR 使用本仓库 `src` 经 Vite 生产编译的代码；两套对照使用 pnpm 锁定的 npm 包。这不是线上网站或已发布 npm 制品的远端测量。

| 配置 | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| 受控全文 | Markdown + gfm, interactive=false | remark-gfm | maxLiveNodes=0; batch/defer/viewportPriority/smooth/typewriter/fade=false; native pre |
| 默认丰富阅读 / 流式 | 默认 Markdown、模块、动画、样式和字体 | remark-gfm + remark-math + rehype-katex + async Shiki | 默认 MarkdownRender、虚拟化、动画、样式；安装 stream-diffs 和 KaTeX |

react-markdown 的丰富配置是显式的集成方案，不是其裸默认配置。代码高亮使用 Shiki 的 github-light/github-dark，数学使用 KaTeX。各库默认 CSS/字体和延迟策略不同，所以丰富阅读比较的是实际集成体验；受控全文才使用相同中性 CSS。依赖配置依据 [react-markdown 官方说明](https://github.com/remarkjs/react-markdown)和 [Markstream React 官方说明](https://markstream.simonhe.me/frameworks/react)，实际版本以本轮 JSON 为准。

## 全文挂载与流式更新

五次独立页面，两个小输入预热，循环并反转渲染器顺序；表内为中位数 [最小–最大]，单位 ms。流式按 256 个 UTF-16 字符追加，每次等待一个 rAF，最后一次非流式提交计入。同步时间包含 React flushSync 和强制布局，不含帧间空闲与异步重资源；原始数据另外记录主线程 TaskDuration、布局时间、长任务和 rAF。

| 场景 / 字符数 | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| static-small / 8,700 | 21.30 [20.30–179.90] | 19.10 [17.80–21.20] | 17.20 [15.20–18.10] |
| static-medium / 87,381 | 154.50 [111.40–288.00] | 126.90 [108.50–817.60] | 102.10 [91.00–208.80] |
| static-large / 877,782 | 1269.40 [1236.60–78177.90] | 1203.80 [1169.10–1309.70] | 814.60 [802.30–832.30] |
| stream-mixed / 34,860 | 288.60 [276.90–606.90] | 1919.80 [1871.50–3178.80] | 335.20 [305.60–470.10] |
| stream-code / 34,488 | 153.80 [144.00–157.20] | 287.20 [281.40–290.80] | 181.10 [179.70–184.10] |
| stream-table / 30,922 | 1897.40 [1863.50–1964.90] | 1921.50 [1878.90–1958.30] | 746.60 [677.00–777.50] |
| stream-paragraph / 32,500 | 1874.40 [1846.30–1910.50] | 1533.10 [1519.40–1573.70] | 1077.40 [1014.50–1120.50] |

本轮出现以下超过组内中位数五倍的长停顿，全部保留在统计与原始数据中。仅凭这些计时不能判定是输入、浏览器调度、系统负载还是其他原因；中位数不能表达这些尾部风险。

| 场景 / 库 / 轮次 | 同步 ms | TaskDuration ms | LayoutDuration ms |
| --- | --- | --- | --- |
| static-small / LiMR / 1 | 179.90 | 183.06 | 1.27 |
| static-medium / react-markdown / 3 | 817.60 | 830.32 | 468.28 |
| static-large / LiMR / 1 | 78177.90 | 78282.65 | 25387.26 |

针对大文档长停顿，另启 Node 与 Chromium 进程，复用同一生产构建，完成每库三次独立页面复核。它不替换上面的五次正式样本，也不能单独证明长停顿的原因。以下为复核的中位数 [最小–最大] ms。

| LiMR | react-markdown | Markstream |
| --- | --- | --- |
| 1224.40 [1172.60–1357.70] | 1146.40 [1096.70–1264.90] | 770.50 [763.70–882.90] |

[mount-repeat.json](../../benchmarks/results/mount-repeat.json).


### 流式单次提交 P95 / 最差提交

| 场景 | LiMR | react-markdown | Markstream |
| --- | --- | --- | --- |
| stream-mixed | 3.10 / 175.50 | 24.80 / 183.10 | 3.70 / 45.40 |
| stream-code | 1.50 / 9.60 | 3.50 / 8.20 | 2.10 / 3.10 |
| stream-table | 26.70 / 48.20 | 27.80 / 57.70 | 10.00 / 19.80 |
| stream-paragraph | 26.10 / 49.30 | 20.80 / 77.20 | 15.60 / 31.90 |

P95 是每轮内所有提交的第 95 百分位，再取五轮中位；最差提交取全部样本的最大值。它不等于端到端帧时间，也不保证每帧小于 16.7ms。全部全文样本均在计时之外核对标题、段落、列表、表格与代码文本。

### 保留堆内存与 DOM

| 场景 | LiMR MiB / DOM | react-markdown MiB / DOM | Markstream MiB / DOM |
| --- | --- | --- | --- |
| static-small | 0.71 / 402 | 0.21 / 361 | 1.55 / 1521 |
| static-medium | 5.95 / 4002 | 1.43 / 3601 | 13.05 / 15201 |
| static-large | 57.05 / 40002 | 13.09 / 36001 | 126.34 / 152001 |
| stream-mixed | 5.85 / 2977 | 1.54 / 1441 | 8.76 / 6289 |
| stream-code | 1.73 / 29 | 0.67 / 3 | 1.10 / 5 |
| stream-table | 7.18 / 4221 | 1.67 / 2408 | 10.64 / 7992 |
| stream-paragraph | 10.39 / 5009 | 1.66 / 1502 | 14.38 / 9699 |

堆为显式 GC 后相对于预热空页面的增量，不是浏览器进程 RSS；DOM 只统计正文元素。

### 主线程任务 / 布局时间

| 场景 | LiMR ms | react-markdown ms | Markstream ms |
| --- | --- | --- | --- |
| static-small | 23.91 / 1.27 | 21.61 / 1.25 | 21.05 / 1.55 |
| static-medium | 164.13 / 11.23 | 137.34 / 11.51 | 238.41 / 17.42 |
| static-large | 1342.15 / 119.70 | 1302.33 / 120.16 | 997.84 / 180.15 |
| stream-mixed | 766.79 / 78.51 | 2032.55 / 43.29 | 627.35 / 74.59 |
| stream-code | 531.90 / 214.23 | 414.00 / 85.37 | 315.13 / 88.47 |
| stream-table | 2496.14 / 229.53 | 2072.59 / 91.51 | 1133.45 / 163.51 |
| stream-paragraph | 2955.66 / 457.27 | 1653.38 / 97.43 | 1571.53 / 345.92 |

以上为 CDP TaskDuration / LayoutDuration 增量的中位数，布局已包含在主线程任务内，不能再次相加。

## 保留默认功能的丰富流式输出

八节独特的 TypeScript/Python/JSON、公式、表格、任务列表和本地图片；每库三次资源预热页面。最后检查八个章节、结束标记与可见特殊块就绪。同步提交与 CDP 主线程成本分开列出，后者包含异步工作及稳定检测。

| 渲染器 | 通过 | 同步总计 ms | P95 ms | TaskDuration ms |
| --- | --- | --- | --- | --- |
| LiMR | 3/3 | 190.70 [190.30–194.40] | 4.10 | 631.33 |
| react-markdown | 3/3 | 1257.10 [1253.60–1272.40] | 20.30 | 1624.60 |
| Markstream | 3/3 | 216.80 [211.00–220.00] | 3.40 | 699.46 |

## 默认阅读：冷启动、滚动、跳转

rich-medium 与 rich-mobile 为 24 节，rich-large 为 240 节（831,559 字符、240 个代码块、480 个公式、30 张本地图片）。桌面 1440×900，窄屏 390×900。每库每种情况三个冷浏览器上下文，导航开始后记录首个非空正文帧与可见内容稳定时间。首屏是 DOM + 两次 rAF 代理，稳定检测需要多次一致快照；二者均不是 FCP/LCP。

| 场景 / 库 | 通过 | 首屏 ms | 稳定 ms | 滚动 P95 / 最大 ms | 最终堆 MiB |
| --- | --- | --- | --- | --- | --- |
| rich-medium / LiMR | 3/3 | 225.00 | 786.80 | 16.70 / 16.80 | 13.66 |
| rich-medium / react-markdown | 3/3 | 218.20 | 733.70 | 16.70 / 16.80 | 8.82 |
| rich-medium / Markstream | 0/3 | 170.20 | 815.60 | 16.70 / 33.30 | 15.47 |
| rich-large / LiMR | 3/3 | 1240.00 | 2576.50 | 16.80 / 33.40 | 44.93 |
| rich-large / react-markdown | 3/3 | 1350.80 | 3244.10 | 16.70 / 16.80 | 26.13 |
| rich-large / Markstream | 0/3 | — | 未稳定 | 16.70 / 16.80 | 32.94 |
| rich-mobile / LiMR | 3/3 | 235.10 | 748.50 | 16.70 / 16.80 | 13.64 |
| rich-mobile / react-markdown | 3/3 | 232.20 | 755.70 | 16.70 / 16.80 | 8.69 |
| rich-mobile / Markstream | 2/3 | 225.20 | 1029.60 | 16.70 / 83.30 | 23.94 |

滚动为合成鼠标滚轮，向下 15,000px、向上 6,000px，约七秒；之后跳到全文中部、末尾、顶部。rAF 采集阶段避开全 DOM 快照和 GC。各库文档高度不同，同一像素距离不代表相同章节。堆是浏览完毕后的整个页面 JS 堆（含已加载高亮等资源），不能与上表的增量堆直接相减。

| 场景 / 库 | 中部 / 末尾 / 顶部稳定 ms | 本地传输 MiB | 滚动长任务数 |
| --- | --- | --- | --- |
| rich-medium / LiMR | 293.30 / 296.80 / 296.10 | 0.75 | 0 |
| rich-medium / react-markdown | 292.60 / 296.60 / 295.00 | 0.57 | 0 |
| rich-medium / Markstream | 失败 / 失败 / 292.70 | 0.65 | 0 |
| rich-large / LiMR | 403.50 / 315.90 / 312.60 | 0.75 | 0 |
| rich-large / react-markdown | 514.10 / 492.60 / 502.80 | 0.57 | 0 |
| rich-large / Markstream | 失败 / 292.40 / 失败 | 0.65 | 0 |
| rich-mobile / LiMR | 292.90 / 295.80 / 293.20 | 0.75 | 0 |
| rich-mobile / react-markdown | 296.00 / 294.50 / 296.10 | 0.57 | 0 |
| rich-mobile / Markstream | 失败 / 失败 / 292.50 | 0.65 | 0 |

失败样本: 7/27. 逐例原因如下；这些结果仅适用于当前锁定版本、输入和集成，不泛化到其他版本。

| 场景 / 库 / 轮次 | 首屏空白 | 未稳定的跳转 | 末尾可见 | 错误 |
| --- | --- | --- | --- | --- |
| rich-medium / Markstream / 1 | false | 0.5, 1 | false | — |
| rich-medium / Markstream / 2 | false | 0.5, 1 | false | — |
| rich-medium / Markstream / 3 | false | 0.5, 1 | false | — |
| rich-large / Markstream / 1 | true | 0.5, 0 | true | — |
| rich-large / Markstream / 2 | true | 0.5, 0 | true | — |
| rich-large / Markstream / 3 | true | 0.5, 0 | true | — |
| rich-mobile / Markstream / 3 | false | 0.5, 1 | false | — |

本轮 rich-medium 第一轮、中部跳转后的实际视口（截图在计时之外）：

**LiMR**

![LiMR](../assets/performance/limr-midpoint.png)

**Markstream**

![Markstream](../assets/performance/markstream-midpoint.png)


## Node 解析、SSR 与增量核心

同一 Node 进程，一次预热、五次交错采样；SSR 仅 GFM，关闭 Markstream 虚拟化，三库核对章节/表格数量和尾部文本。SSR 不包括水合、DOM 布局和异步高亮。单位 ms，中位数 [最小–最大]。

| 字符数 | LiMR SSR | react-markdown SSR | Markstream SSR | LiMR core | mdast GFM |
| --- | --- | --- | --- | --- | --- |
| 8700 | 12.21 [9.71–15.98] | 10.49 [9.32–11.50] | 6.59 [5.63–9.52] | 9.00 [7.65–22.12] | 8.18 [7.16–9.02] |
| 87381 | 129.56 [103.87–163.08] | 107.19 [99.07–131.58] | 36.46 [29.57–45.33] | 108.16 [89.62–131.83] | 91.17 [86.75–109.49] |
| 877782 | 2508.88 [2452.30–2523.55] | 2602.54 [2510.09–2721.59] | 378.83 [351.91–419.03] | 2395.18 [2291.81–2511.85] | 2354.28 [2207.04–2513.62] |

| 核心追加场景 | 字符 / 块大小 | 总计 ms | 追加 P95 ms | 收尾 ms | 完整前缀重解析 ms |
| --- | --- | --- | --- | --- | --- |
| gfm | 34860 / 256 | 93.24 [81.57–113.77] | 1.26 | 0.35 | 2648.03 |
| standard | 34860 / 256 | 90.97 [80.23–106.23] | 1.38 | 0.32 | — |
| growing-code | 43209 / 128 | 40.89 [28.69–41.15] | 0.13 | 7.38 | — |
| long-paragraph | 7840 / 128 | 79.96 [76.07–92.02] | 2.33 | 2.35 | — |

完整前缀重解析是 mdast 算法基线，不是 react-markdown 或 Markstream 的完整渲染耗时；不会用它冒充两者的浏览器性能。

## 连续拖选交互

| 场景 / 库 | 手势 ms | rAF P95 ms | 覆盖层 P95 ms | 拖动中绘制次数 |
| --- | --- | --- | --- | --- |
| prose / LiMR | 3619.00 | 16.80 | 5.20 | 82 |
| prose / react-markdown | 1521.20 | 16.80 | N/A | N/A |
| code / LiMR | 1533.40 | 16.70 | 19.60 | 48 |

每种情况三个独立字体就绪页面，90 次连续鼠标移动，在松开前读取结果。长文 2,000 节，代码 1,000 行。覆盖层指标为 selectionchange 到 DOM 变更，不是实际屏幕绘制或硬件延迟；react-markdown 只有原生选区，没有 LiMR 覆盖层，因此该项不比较。Markstream 未纳入此 LiMR 专属交互套件。

## 复现、数据与边界

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm bench
```

原始数据: [renderers.json](../../benchmarks/results/renderers.json) · [core.json](../../benchmarks/results/core.json) · [streaming.json](../../benchmarks/results/streaming.json) · [selection.json](../../benchmarks/results/selection.json). [目录与单项命令](../../benchmarks/README.md).

表格由 `benchmarks/report.ts` 从本轮 JSON 生成，采用最近秩分位数，三/五轮样本只做描述性统计，没有显著性检验。默认阅读失败会原样呈现；完整矩阵缺失则拒绝生成报告。源码哈希 `8a09189f783dc1888446e0f0c96b2059db30142a6a545e769777ce0325fee4a1`.

未覆盖：真实手机、其他浏览器、慢网络、服务端并发、压缩包体积、任意第三方插件/密集标注、外部视频、所有 Mermaid 图类型。保留完整 DOM 的实现仍需支付长文初次挂载成本；增量解析对持续增长的复杂单块、中间编辑和全局定义更新仍可能昂贵。不要把这些输入上的倍率当成普遍保证。
