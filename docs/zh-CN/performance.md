# 性能与限制

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/performance) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/performance.md)

以下保留仓库 **2026-10-12** 的历史基准，便于对照。它们不是本次文档/Playground 更新后重新测得的数据，也不是性能保证。

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

这些数据不覆盖大型公式集、Shiki 冷启动、密集标注、第三方插件、完整 Reader 布局或实体移动设备。字体安装体积与浏览器请求量也不同，见[样式与字体](styles.md)。

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
