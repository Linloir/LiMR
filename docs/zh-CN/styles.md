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
| --limr-annotation-label-size | 标题、展开/收起及操作文字的共同字号；浮层默认 .8rem，侧栏默认 .8125rem，操作图标随文字缩放 |
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

窄屏目录按钮的文字与下方分隔线左对齐。悬浮和键盘聚焦时，文字下方显示下划线动画，按钮背景保持透明。

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

## 图片预览与序号列表

`Image` / `ImagePreview` 从原图位置以非线性 hero 动画展开到居中适应的视图，背景遮罩同步变暗。下方工具栏使用主题背景的 90% 不透明度与背景模糊，适配浅色、深色和 appearance；按钮为相同的 42×42px 正方形，SVG 统一 24×24px，间距一致。适应/原图/铺满在一个按钮内切换图标，与复制成功的对号共用状态过渡；放大、缩小、复制和关闭沿用相同尺寸。悬浮背景和按压反馈尊重 reduced-motion。

如需覆盖样式，应保持整个按钮槽位与图标盒子等大，不要对最后几个按钮单独增加 padding 或分隔空白。关闭时返回原触发点焦点，Escape 和键盘操作保留；复制的是像素，需浏览器剪贴板能力及可读取的图片来源。详见 [API](api.md)。

有序列表按起始序号、条目数量及显式序号计算标记所需的左侧空间，支持多位数字与嵌套；宿主样式应保留这部分内边距，避免固定窄 gutter 或祖先裁切重新遮挡数字。

## 搜索样式

可选的 `DocumentSearch` 接受 `className` 和 `style`；`placement="inline"` 参与宿主工具栏布局，floating 默认固定在右上角。导入正常的 LiMR 样式即可，规则位于 `limr` 层，普通未分层应用 CSS 可以覆盖。

```css
.article-search {
  --limr-search-width: min(30rem, calc(100vw - 4rem));
  --limr-search-accent: var(--limr-secondary);
  border-radius: 12px;
}
.article-search .limr-search-count {
  color: var(--limr-muted);
}
.article-reader {
  --limr-search-match: #d9ae403d;
  --limr-search-match-border: #b38b2466;
  --limr-search-current: #e99b3e80;
  --limr-search-current-border: #b67524;
}
```

将 `article-search` 放在 DocumentSearch 上，将 `article-reader` 放在 Reader 或 Markdown 的公共 DOM 祖先上。高亮变量必须传到正文，只在搜索框上设置无法改变其他位置的文字高亮。Portal 保留 React 上下文，但目标容器仍需主题 CSS。

可用选择器包括 `.limr-document-search`、`.limr-search-field`、`.limr-search-count`、`.limr-search-loading`、`.limr-search-error`、`.limr-search-regex`、`.limr-search-previous`、`.limr-search-next` 和 `.limr-search-close`。用 `[aria-pressed="true"]` 表示选中选项，用 `[data-open]` / `[data-loading]` 区分框体状态。默认选中态无边框，使用标题色与次要色；计数和静态图标使用柔和文字色。输入框不额外添加聚焦轮廓，请保留按钮的键盘焦点提示。

搜索 loading 圆环默认使用与导航控件相同的柔和文字色和更细的描边。可通过 `--limr-search-accent` 单独覆盖圆环颜色。

默认框体从右向左展示固定位置的内容，框体本身淡入，内容略晚淡入。Loading 在左侧扩展 2rem 空间，18px 圆环缩放、淡入淡出，输入框保持位置。定制动画时保留内部宽度、右对齐和裁切；使用 `--limr-search-width`，不要只覆盖框体展开宽度。保留减少动态效果规则。组件/控制器接口和延迟时序见[阅读搜索](search.md)。

## 代码块与溢出样式

代码折叠、换行和行号是视图参数：用 `parameters.codeBlock` 控制行为，见[代码块控制](syntax.md#代码块控制)。不要靠隐藏行号 DOM 或覆盖 pre 的 overflow 来代替参数，否则容易让显示状态与按钮失配。折叠状态和换行状态不写入 Markdown。

`.limr-code-actions` 内依次为 `.limr-code-wrap`、`.limr-code-copy`、可折叠时出现的 `.limr-code-fold`。三者复用圆角按钮、描边和 hover/按压动效；折叠箭头旋转，换行按钮用 aria-pressed 表示状态。头部上/右内边距相等；自定义主题应保留等尺寸点击区域、键盘焦点和 reduced-motion 规则。局部样式仍以 `[data-limr-appearance]` 约束。

数字行号由 `.limr-code-line::before` 绘制，换行后的续行仍属于同一个源码行。打印样式展开折叠的完整代码。普通行内公式的不可拆分片段超宽时获得局部横滚；不要把 `.limr-math-inline` 一律强制成 nowrap 或固定宽度。图像的 width/height 也受容器和 figure 限值约束，避免使用全局 img 宽度覆盖这些限制。

`.limr-code-footer` 与标题栏共用 `--limr-code-header` 和 `--limr-muted`。底栏容器设置与标题标签相同的 .7rem 字号，宿主重置按钮字体时仍可继承小字号；常规根字号下高度为 24px，并复用 `.limr-underline` 的悬停/聚焦文字颜色与下划线动画。

`.limr-code-body pre` 管理 max-height 过渡，由 `--limr-motion` / `--limr-ease` 控制时序。默认展开不显示竖向滚动条，主动传入正数 maxExpandedLines 才启用块内滚动。实测的 `--limr-code-full-height` 和 `--limr-code-scrollbar-height` 是内部值，会为占据布局空间的横向滚动条额外预留高度，保留完整可见行数。高度策略应使用 maxExpandedLines。`.limr-code-chunk` / `.limr-code-part` 承载延迟排版文字，应保留其 containment 与源码换行边界。打印 CSS 取消高度和 containment 限制并隐藏底栏。
