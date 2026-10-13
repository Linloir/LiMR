# 样式与字体

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/styles) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/styles.md)

## 基础样式和主题

默认 CSS 在 `@layer limr` 中，宿主普通 CSS 可覆盖。选择 styles.css（带 Maple）或 styles/base.css（不加载 Maple）；公式另加 math.css。

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles/base.css';
import './paper.css';

export function Paper({ source }: { source: string }) {
  return <Reader source={source} appearance="paper" theme="auto" />;
}
```

paper.css 示例：

```css
[data-limr-appearance='paper'] {
  --limr-font-text: Georgia, 'Noto Serif SC', serif;
  --limr-content-width: 820px;
  --limr-accent: #8b6548;
}
[data-limr-appearance='paper'][data-limr-theme='dark'] {
  --limr-accent: #d1ab84;
}
```

appearance 会传给 portal 中的浮层/工具栏；不要只用 `.limr-reader .your-selector` 匹配这些元素。theme: auto 通过系统偏好选择内置主题；自定义 auto 深色覆盖还需对应 prefers-color-scheme 媒体规则。独立 CSS 包示例见 [paper-theme](../../examples/packages/paper-theme/index.css)。

## 常用变量

| 变量 | 用途 |
| --- | --- |
| --limr-font-text / --limr-font-code | 正文 / 代码字体 |
| --limr-font-size / --limr-line-height | 基础排版 |
| --limr-font-features | 正文默认 'palt' 1，字体支持时采用比例标点 |
| --limr-emphasis-spacing / --limr-list-item-gap | 斜体末尾 / 列表间距 |
| --limr-text / --limr-heading / --limr-secondary / --limr-muted | 文字层次 |
| --limr-background / --limr-surface / --limr-border | 背景和边框 |
| --limr-link / --limr-accent / --limr-selection | 链接、激活、选区 |
| --limr-content-width / --limr-reader-width | 正文 / 总宽，默认 900px / 1800px |
| --limr-toc-width / --limr-sidebar-width / --limr-column-gap | 侧栏宽度与列间隔 |
| --limr-sticky-top | 吸顶偏移 |
| --limr-reader-bottom-space / --limr-reader-min-height | 短正文高度与底部预留 |
| --limr-sidebar-padding-inline / --limr-sidebar-reference-gap | 侧栏内容统一留白（10px）和关联区间隔（1px） |
| --limr-overlay-duration / --limr-overlay-morph-duration | 浮层进退（560ms）和预览/展开转换（480ms） |
| --limr-overlay-z / --limr-toolbar-z | 浮层层级 |
| --limr-overflow-fade-size | 溢出渐隐，默认 24px，0px 关闭 |
| --limr-toolbar-panel-max-height | 工具栏面板高度上限 |
| --limr-tool-icon-size / --limr-mark-size | 工具图标 / 正文角标尺寸 |

runtime 测量的 --limr-toolbar-available-height、--limr-toolbar-panel-height、--limr-toc-available-height 是布局输出，不应由主题覆盖。sidebar 的局部颜色通常由 AnnotationType.sidebar 配置提供，见[扩展开发](extensions.md)。

## 字体和资源体积

Maple Mono NF CN v7.9 的本地 WOFF2 子集随包分发，衍生字体名为 LiMR Maple Mono NF CN，OFL 许可证随资源提供。unicode-range 和 font-display: swap 限制运行时按需请求，但完整字体资产仍约 31MB，base.css 只避免浏览器加载，不减少 npm 安装体积。

正文不自动加载中文字体；可使用系统回退、自托管或宿主选定的字体服务。Playground 的 Noto Serif SC 是演示项目依赖。不要假定任何字体覆盖所有文字。

默认字体/公式样式不依赖外部 CDN。带哈希的字体资源可由宿主设置长期 immutable 缓存；库无法替服务器设置 HTTP 缓存头。远程图片、视频和插件请求由内容和宿主决定。

## 布局与交互约定

同步侧栏的高度由阅读区域决定，不能用所有卡片总高撑大页面。模块只控制自己的内容，骨架负责灰色关联区、摘要与卡片外壳；避免重复 padding 或空段落补偿。大卡片从预览位置过渡，减少动态效果设置会关闭动画。

密集的文末引用在静止时向上借用空余空间。悬浮或激活时优先对齐当前条目，允许邻项在边缘裁切；角标悬浮时可压缩可选摘要，为关联区和标题留出空间。展开内容受可见阅读区域高度限制，并可在卡片内滚动。侧栏条目即使被向上收拢，也会反向对齐正文。取消激活后按当前卡片高度平滑回位，使用 `--limr-motion-slow` 和 `--limr-ease`，保持卡片间距与页面高度。

选区保留原生浏览器范围与键盘行为，绘制层只计算可见片段。代码支持局部高亮，公式整体选择，图片高亮使用边框。打印隐藏绘制层并保留正文。移动端自动化检查不等于 iOS/Android 原生拖动手柄和真机验收。

## 仅 CSS 的独立主题

包可导出 CSS，files 包含 CSS，sideEffects 为 `["**/*.css"]`；不需要 React 或解析器运行时依赖。规则用独立 appearance 名隔离，覆盖浅色、深色、auto 和 portal，并在同页两个不同主题 Reader 中检查。

展开工具栏面板使用工具栏的全部可用宽度。宽度由当前操作按钮行与可用视口决定，展开内容不参与工具栏的固有宽度计算，不会反向撑大工具栏。高亮样式按钮按文字自然宽度排列，空间不足时整项换行并左对齐。多行下划线需要保持内部 span 为 inline，不把它直接作为 flex 子项。
