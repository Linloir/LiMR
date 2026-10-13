# 样式与交互外观

`limr/styles.css` 提供默认 classic 样式和代码字体。所有默认规则位于 `@layer limr`；应用或样式包的普通 CSS 可以直接覆盖，无须提高选择器优先级。`appearance="paper"` 会传播到正文、目录、侧栏、选区工具栏和 portal 浮层，适合同页存在多个阅读器的场景。

```tsx
import 'limr/styles.css';
import '@your-scope/limr-theme-paper';
<Reader source={markdown} appearance="paper" theme="dark" />
```

主题包可只包含 CSS，并将 `exports["."]` 指向该文件、`sideEffects` 设为 `["**/*.css"]`。用 `[data-limr-appearance='paper']` 包裹 token 和规则，不依赖 `.limr-reader` 作为 portal 的祖先。自定义组件使用稳定的 `.limr-*` 类，状态由 `data-active`、`data-expanded`、`data-open`、`data-status` 等属性表示。

| CSS 变量 | 用途 |
| --- | --- |
| `--limr-font-text`, `--limr-font-code` | 正文与代码字体栈 |
| `--limr-font-size`, `--limr-line-height` | 正文字号和行高 |
| `--limr-font-features` | 正文 OpenType 特性，默认 `'palt' 1`，使中文字体的弯引号等标点采用比例宽度；`normal` 可恢复字体原有宽度 |
| `--limr-emphasis-spacing` | 斜体末尾的光学留白，默认 `.08em`；不改变左侧间距 |
| `--limr-list-item-gap` | 列表项和嵌套层级前后的统一间距，默认 `.375rem` |
| `--limr-text`, `--limr-heading`, `--limr-secondary`, `--limr-muted` | 文本层次 |
| `--limr-background`, `--limr-surface`, `--limr-border` | 背景与边框 |
| `--limr-link`, `--limr-accent`, `--limr-selection` | 链接、激活与选区颜色 |
| `--limr-code-bg`, `--limr-code-header`, `--limr-inline-code` | 两种主题下的代码颜色 |
| `--limr-mark-size` | 角标方形边长，默认 `.92em`，统一使用正文基准字号 |
| `--limr-motion-fast`, `--limr-motion`, `--limr-motion-slow`, `--limr-ease` | 动画时长与曲线 |
| `--limr-overlay-duration` | 悬浮预览展开/收回共用时长（560ms）；兼容旧变量 `--limr-overlay-enter-duration` |
| `--limr-overlay-morph-duration`, `--limr-overlay-ease` | 预览与大卡片变换时长（480ms），浮层曲线（`cubic-bezier(.22,1,.36,1)`） |
| `--limr-video-width`, `--limr-definition-math-bg` | 视频最大宽度与释义块内公式背景 |
| `--limr-content-width`, `--limr-reader-width`, `--limr-sticky-top` | 布局上限及吸顶位置 |
| `--limr-toc-width`, `--limr-sidebar-width`, `--limr-column-gap` | 三栏宽度与间隔；默认侧栏随容器增宽 |
| `--limr-reader-min-height`, `--limr-reader-bottom-space` | 短正文的最小高度与视口底部预留空间；默认自动填充并预留 24px |
| `--limr-annotation-color`, `--limr-annotation-border`, `--limr-annotation-title`, `--limr-annotation-text`, `--limr-annotation-excerpt` | 模块通过 `color` / `sidebar` 配置提供的卡片局部色值 |
| `--limr-sidebar-padding-block` | 通用侧栏卡片顶部留白，默认 `.65rem`；底部额外补足 `2px`，Citation 使用独立规则 |
| `--limr-sidebar-padding-inline` | 关联区与内容区共用的水平留白，默认 `10px`；标题、预览、正文的文字起点一致 |
| `--limr-sidebar-reference-gap` | 灰色关联区与下方内容区之间的分隔，默认 `1px` |
| `--limr-toolbar-background`, `--limr-toolbar-border`, `--limr-toolbar-shadow`, `--limr-toolbar-radius` | 工具栏浮层背景、边框、阴影、圆角（默认 `6px`） |
| `--limr-toolbar-font-size`, `--limr-tool-icon-size`, `--limr-toolbar-accent` | 工具栏文字（默认 `.75rem`）、图标（`18px`）、选择框颜色（沿用 `--limr-accent`） |
| `--limr-toolbar-panel-width`, `--limr-toolbar-panel-max-height` | 展开内容宽度（默认 `246px`，不含内边距）与高度上限（默认 `260px`） |
| `--limr-toolbar-panel-height`, `--limr-toolbar-available-height` | 骨架测量得到的面板高度上限与所选方向空间；插件可读取，不应覆盖 |

系统 `prefers-reduced-motion: reduce` 会关闭位移、展开与滚动动画。工具栏文字按钮使用 `.limr-underline` 从左向右展开下划线，不添加悬浮背景；复制成功原位淡出淡入为绿色“已复制”，2.4 秒后恢复。代码块内的图标复制按钮保留独立的背景与图标过渡。默认 `>` 引用块使用“注释 / Note”标题；可用 `components.blockquote` 完全替换其外观。它与插件注册的注记角注类型相互独立。

宽屏参考 infilearn 的正文尺度：阅读器默认最大 `1800px`，正文最大 `900px`，目录和注释栏随容器宽度渐增，列间距默认 `36px`。容器不足 `1120px` 时仍切换为注释浮层，不依赖浏览器窗口宽度。宿主可用上述变量覆盖尺寸。

同步注释侧栏由所在网格行决定高度，并使用 size/layout containment 与 `overflow: clip` 隔离内部位移。短正文自动补足可用阅读高度，注释数量不会撑大页面。悬浮角标驱动侧栏，悬浮卡片则锁定卡片命中区域并平滑移动正文；正文容器裁切位移，不改变页面滚动范围。不要把所有卡片底部的最大值赋给外层 `height` / `min-height`，也不要给这个同步列表添加 `overflow: auto`。卡片正文的长内容滚动与列表定位相互独立。

模块颜色、边距、`sidebar.Preview` 和 Citation 单条/多条补偿的约定见[扩展指南](extensions.md)。可以通过 `.limr-sidebar-card[data-type='assistant']` 定位模块；默认卡片的有色装饰条、背景和 padding 在它的 `.limr-sidebar-card-body` 上，灰色关联区是独立的 `.limr-sidebar-reference`，两者之间留出分隔。`.limr-sidebar-preview` 使用模块配置的预览颜色和行数，展开后隐藏。浮层使用 `.limr-annotation-overlay[data-type='assistant']`，无需依赖阅读器作为 portal 的祖先。

悬浮预览先按最终位置和尺寸排版，再从角标横坐标对应的位置裁切展开，内容不会随动画反复换行。预览在角标上方时从底部展开，在下方时从顶部展开；切换角标会等待新角标的定位结果。视口较矮时，预览高度受对应方向的剩余空间限制。允许展开的模块从预览的位置和尺寸放大至目标布局，关闭时缩回预览位置和尺寸并淡出；触摸、工具栏直接打开也采用同一几何起点。

动画从实时画面重新取样，移开、重入和快速展开/收起均可中途反转。悬浮预览进入和退出共用 560ms，内容和外壳同时结束；鼠标移开后的跨越间隙宽限为 90ms，明确关闭时立即开始动画。组件在退场完成后才卸载，保留请求与组件状态。外壳背景与阴影由 `.limr-overlay-surface` 绘制并独立变形，`.limr-overlay-card` 内的文字、按钮与输入框不缩放。打开时聚焦对话框容器，不自动高亮“收起”按钮，Tab 导航仍保留焦点提示。

窄屏目录使用整行 hover 背景和圆角折线箭头，内容高度、透明度、位移和箭头旋转连续过渡。内容持续挂载、隐藏时 inert，快速点击直接从当前帧反转，没有延迟卸载定时器。

角标的鼠标命中区域保持固定，hover/按下缩放只作用于内部图形，避免边缘反复触发进入/离开。侧栏展开/收起使用纯文字和下划线渐变，仅悬浮“展开 / 收起”文字或键盘聚焦时触发；切换展开状态时保留卡片 hover。提问选项菱形按第一行文字基线对齐，公布答案时正确选项填充绿色；扩展阅读标题使用正文标题色，副标题字号更小、间距更紧凑。

浮层隐藏原生滚动条，使用不占内容宽度的 3px 覆盖式滚动条（`.limr-overlay-scroll-thumb`）。展开/收起动画期间不显示；实际滚动时淡入，停止 800ms 后淡出，支持拖动滑块。滚轮、触摸和键盘滚动仍由原生滚动容器处理。

## 字体资源和缓存

爱丽丝样例中的撇号是 Unicode 弯引号 `’`（U+2019），不是全角 ASCII 撇号。默认启用字体的比例标点特性以缩小其宽度，不替换源文本，因此复制、选区和 annotation 偏移保持一致。样式包可覆盖 `--limr-font-features`，或通过 `--limr-font-text` 换用自己的字体；特性是否可用取决于字体。代码仍使用独立的等宽字体特性。

两端对齐由渲染器的 `justify` 属性控制，默认关闭。开启时段落和列表使用 `text-align: justify`，末行和显式换行前的行保持起始侧对齐，标题、代码块及表格保持原有排版。选区与高亮使用排版后的实际文字位置测量，包含斜体末尾留白。

默认代码字体来自 [Maple Mono v7.9 的 NF CN 版本](https://github.com/subframe7536/maple-font/releases/tag/v7.9)，保留原版连字、中文、日文、Nerd 图标及原版支持的其他字形。不能把“多语言”理解为所有文字均有字形；缺失字符仍使用系统回退。四个字重/样式文件切分为 unicode-range WOFF2 子集，浏览器只按实际字符请求所需子集，`font-display: swap` 使代码先用系统等宽字体显示。Latin/Greek/Cyrillic 常规子集约 47 KB；完整字体资产约 31 MB，不会在页面初始全部下载。

`src/fonts/manifest.json` 记录来源、原始包摘要、字形覆盖和各文件大小，OFL 许可证随包分发。子集字体使用新名称 `LiMR Maple Mono NF CN`。`scripts/subset-fonts.py` 可从官方 unhinted ZIP 重建资源。WOFF2 文件名包含版本与内容摘要，构建工具可进一步生成哈希资源 URL。

组件无法设置服务器的 HTTP 缓存头。生产部署应对带内容哈希的字体资源返回 `Cache-Control: public, max-age=31536000, immutable`；浏览器是否复用仍取决于 URL、缓存头和用户缓存状态，不应由组件重复 fetch 字体。

本地生产预览的中英混排/希腊/西里尔/Nerd 图标夹具实际请求 4 个 Maple 子集，共 341,440 字节；刷新后没有重新传输字体正文。这是该夹具和预览服务器的观测结果，不能代替宿主应用的缓存配置。

完全使用自己的字体时：

```tsx
import 'limr/styles/base.css'; // 默认排版/交互样式，不引入 Maple
// 可单独 import 'limr/fonts.css'，或载入应用自己的字体。
```

## 选区、高亮与移动端

浏览器仍管理原生文本范围、键盘选择、复制与辅助技术；覆盖层统一文本、行内代码、公式及角标的选中高度，不用替换正文或铺设透明文字副本。覆盖层只绘制视口中的片段，并在字体、内容、尺寸和滚动变化后重新计算。全文 DOM 保留，浏览器搜索和打印不受虚拟列表影响。

代码可部分选中；公式按整体选中，块公式继承背景边界与圆角。角标仅在两侧都有文本且范围跨过两侧文本时着色，按钮本身的背景和交互独立。自定义原子组件可给内部实际背景元素添加 `data-limr-selection-surface`，指定覆盖边界和圆角。

移动视口、触摸点击浮层和 Selection API 的程序化选择有浏览器回归检查。iOS/Android 的系统拖动手柄、放大镜和原生菜单并不能通过网页 CSS 一致接管；保留这些平台控件，不伪装成已在真机上实现了完全自定义触摸选区。实体设备的手指拖动仍需单独验收。


工具栏外层 `.limr-selection-toolbar` 只负责定位，`.limr-toolbar-surface` 与各 `.limr-toolbar-item` 分别执行非线性位移和延后淡入。上方工具栏从下向上浮入，下方工具栏从上向下浮入；组件按序延迟 22ms，淡入再稍晚开始。`prefers-reduced-motion` 关闭这些移动和延迟。工具栏优先位于选区下方，为展开内容预留同一份空间预算；展开后按钮行保持靠近选区，面板向外生长。分隔线覆盖整个工具栏宽度，面板内容居左并受宽度约束。

`.limr-tool-icon` 默认 18px，可用 `--limr-tool-icon-size` 覆盖。图标槽约束 SVG、图片及嵌套包装的大小和溢出。文字行高为 1.5，以 1px 底部留白校正视觉中心；内置图标在自身 viewBox 内校正，不对整行施加额外位移。自绘整个 action 的 `render` 槽位需自己复用图标槽或提供等价约束。

面板由骨架的 `OverlayScrollArea` 负责滚动：内容不足预算时自然收缩，溢出时使用 3px 覆盖式滚动条，不挤占内容布局。插件通常不需要设置高度或再提供滚动条；复杂模块可读取上述可用高度变量。外部样式包示例见 [`paper-theme/index.css`](../examples/packages/paper-theme/index.css)。

持久高亮使用 `.limr-highlight-layer`，在各段落、代码或公式背景上方、文字下方绘制；临时选区保留独立的 `.limr-paint-layer`。两个层都只维护视口内的几何，且不拦截指针。高亮悬浮通过正文的坐标命中判断，按叠放顺序选择一个高亮，应用 `data-hovered` / `data-active` 到该高亮的全部可见片段。悬浮侧栏条目、角标或激活 annotation 时，其他片段添加 `data-muted` 暂时隐藏；离开后恢复原本的可见性。打印时隐藏绘制层，恢复语义 mark 的原生装饰。
