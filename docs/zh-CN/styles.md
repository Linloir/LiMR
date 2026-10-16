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
| --limr-font-features | 正文默认 normal，保留中文全角标点；可显式设置 'palt' 1 启用比例标点 |
| --limr-punctuation-spacing | 默认 space-all，保留连续中文标点的全角空白 |
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
| --limr-mermaid-max-height | 图表视口最大高度；默认 min(70vh, 36rem) |
| --limr-mermaid-scrollbar | 图表细滚动条颜色；默认 #87837866 |

runtime 测量的 --limr-toolbar-available-height、--limr-toolbar-panel-height、--limr-toc-available-height 是布局输出，不应由主题覆盖。sidebar 的局部颜色通常由 AnnotationType.sidebar 配置提供，见[扩展开发](extensions.md)。

## 字体和资源体积

Maple Mono NF CN v7.9 的本地 WOFF2 子集随包分发，衍生字体名为 LiMR Maple Mono NF CN，OFL 许可证随资源提供。unicode-range 和 font-display: swap 限制运行时按需请求，但完整字体资产仍约 31MB，base.css 只避免浏览器加载，不减少 npm 安装体积。

正文不自动加载中文字体；可使用系统回退、自托管或宿主选定的字体服务。Playground 的 Noto Serif SC 是演示项目依赖。不要假定任何字体覆盖所有文字。

默认字体/公式样式不依赖外部 CDN。带哈希的字体资源可由宿主设置长期 immutable 缓存；库无法替服务器设置 HTTP 缓存头。远程图片、视频和插件请求由内容和宿主决定。

## 布局与交互约定

同步侧栏的高度由阅读区域决定，不能用所有卡片总高撑大页面。模块只控制自己的内容，骨架负责灰色关联区、摘要与卡片外壳；避免重复 padding 或空段落补偿。大卡片从预览位置过渡，减少动态效果设置会关闭动画。

密集的文末引用在静止时向上借用空余空间。悬浮或激活时优先对齐当前条目，允许邻项在边缘裁切；角标悬浮时可压缩可选摘要，为关联区和标题留出空间。展开内容受可见阅读区域高度限制，并可在卡片内滚动。侧栏悬浮不移动正文，只有角标交互触发旁注对齐。取消激活后按当前卡片高度平滑回位，使用 `--limr-motion-slow` 和 `--limr-ease`，保持卡片间距与页面高度。

选区保留原生浏览器范围与键盘行为，绘制层只计算可见片段。代码支持局部高亮，公式整体选择，图片高亮使用边框。单个整块选区的工具栏定位在块下方。打印隐藏绘制层并保留正文。移动端自动化检查不等于 iOS/Android 原生拖动手柄和真机验收。

窄屏目录按钮的文字与下方分隔线左对齐，箭头紧跟标题并保留 `.5rem` 间距。悬浮和键盘聚焦时，文字下方显示下划线动画，按钮背景保持透明。

选区工具栏的复制反馈使用淡入淡出与轻微缩放。按钮文字宽度随当前状态增长或收缩，均通过 `--limr-ease` 非线性过渡；减少动态效果设置会关闭这些过渡。

Mermaid 图像支持拖拽平移、触摸和触控板滚动、方向键、Page Up/Down、Home/End，以及 Shift＋滚轮横向移动；单击或 Enter 整块选择，拖动不会选中内部文字。缩放仅改变有限高度视口内的内容。共享磨砂工具栏在悬浮或获得焦点时显示，触屏常显；按钮只做背景淡入，不缩放。源码模式保留正常顶部内边距。主题和插件可在 Reader 或图表块上覆盖最大高度与滚动条变量。

## 仅 CSS 的独立主题

包可导出 CSS，files 包含 CSS，sideEffects 为 `["**/*.css"]`；不需要 React 或解析器运行时依赖。规则用独立 appearance 名隔离，覆盖浅色、深色、auto 和 portal，并在同页两个不同主题 Reader 中检查。

工具栏的展开面板、提示与错误消息使用操作按钮行的全部可用宽度，保留各自的内边距与外边距。宽度由当前操作按钮行与可用视口决定，这些内容不参与工具栏的固有宽度计算，不会反向撑大工具栏；长文本和连续长字符串在可用宽度内换行。高亮样式按钮按文字自然宽度排列，空间不足时整项换行并左对齐。多行下划线需要保持内部 span 为 inline，不把它直接作为 flex 子项。

## 段落排版与流式效果

`typography="standard"` 为默认模式；`justify` 使用浏览器两端对齐；`knuth-plass` 使用 TeX 的 box/glue/penalty 动态规划：四种适配类别、整数 badness、独立平方惩罚、连续与末行断词惩罚，以及 pretolerance、tolerance、emergency 多轮求解。整段求最优解，不使用 beam search 或段落长度截断。默认英文断词采用 Knuth–Liang 模式，Unicode 断行规则同时处理中文标点。字形由浏览器测量，因此不承诺与 TeX PDF 逐像素相同。

`knuthPlass` 可配置 `pretolerance`、`tolerance`、`linePenalty`、`hyphenPenalty`、`adjacentDemerits`、`doubleHyphenDemerits`、`finalHyphenDemerits`、`emergencyStretch`（CSS 像素）、`looseness` 和 `hyphenate`（`false` 或返回单词分段的函数）。核心段落参数沿用 TeX 常用默认值，额外提供 16px 应急伸展量；浏览器适配器默认按字号换算为 3em，仅参与断行评估，可用 `knuthPlass.emergencyStretch` 显式覆盖。`pretty` / `normal` 保留为可选的旧版 CSS 模式。

KP 按需加载，对视口附近的稳定段落排版；离开视口后保留 DOM，宽度变化时复用测量结果与前缀和，更新前保护原生选区。窗口缩小时，屏外缓存行暂时裁切横向溢出，进入视口后完成精确排版；仍被选中的段落暂时允许换行并保留原生选区。流式尾段稳定后再排版，不改变源码、标注位置或复制内容。滚动和缩放对照见[KP 算法性能报告](knuth-plass-performance.md)，算法依据见 [TeX 源码](https://github.com/TeX-Live/texlive-source/blob/trunk/texk/web2c/tex.web)。测量准备与断行分离的设计也参考了 [Typst 的增量排版实现](https://github.com/typst/typst/tree/main/crates/typst-layout/src/inline)。

默认 loading 使用固定 32×32 viewBox、22px 显示尺寸、粗轨道和伸缩弧线；旋转、增长、收缩均为非线性缓动，围绕固定圆心运动，颜色跟随 `--limr-secondary`。新增文字与特殊块只做透明度淡入，不增加背景色，段落结束时不再次播放出现动画。插件可用 `streaming.effect` 替换共享动画，Reader 可用 `streamEffect` 单独覆盖。

源码高亮的默认蓝色由 `--limr-inline-highlight` 控制，也可通过 `inlineHighlights({ color })` 替换模块。默认只读工具栏的说明可用 `locale.inlineHighlightHint` 本地化。

任务列表使用与问答选项一致的菱形勾选框。标记按字体的拉丁大写高度或 CJK 字面高度定尺寸并对齐首行，不随 line-height 增高；原生 checkbox 保留键盘与无障碍语义。未勾选正文颜色较淡，勾选后加深；未勾选项悬浮时加深，并复用问答选项逐行从左向右出现的下划线。默认不可修改；提供 onSourceChange 后，默认任务渲染器允许点击并更新原文，无需额外插件。

Callout 使用与注释、释义、提问一致的小字号标签和正文排版，不显示前置类型图标；可折叠 callout 仅保留折叠箭头。
