# API 与组合约定

## 文档配置

`Markdown`、`Reader` 和 `DocumentProvider` 接受以下文档配置。独立 `Markdown source={...}` 创建自己的作用域；放在 Provider 中时用 `<Markdown />` 复用它的文档，每个 Provider 放一个主正文。

| 属性 | 默认值 / 含义 |
| --- | --- |
| `source` | `''`，未经预处理的 Markdown 字符串 |
| `streaming` | `false`，追加模式下允许复用稳定区块 |
| `documentId` | 自动生成且与 SSR hydration 一致；显式传入时应在页面内唯一 |
| `extensions` | `standard()`，完整扩展列表 |
| `plugins` | 追加到默认模块或显式 extensions 的第三方扩展 |
| `appearance` | `classic`；CSS 样式包作用域，包含 portal 浮层 |
| `components` | 覆盖 AST 节点类型或特殊标签名对应的组件 |
| `annotationTypes` | 追加或覆盖同 type 的角注显示定义 |
| `annotations` / `highlights` | 外部控制的角注和高亮数组；不传时由命令维护内部状态 |
| `onAnnotationsChange` / `onHighlightsChange` | 受控模式下接收下一份数组，应用负责回传 |
| `theme` | `light`；也可以是 `dark` / `auto` |
| `locale` | `english`；可以传 `chinese` 或部分文字覆盖 |
| `scrollRoot` | 窗口；传入内部滚动容器 DOM 节点可切换 |
| `scrollOffset` | `24`，标题定位时留出的顶部距离 |
| `onSelectionChange` | 接收三种选区结果或 `null` |
| `onAnnotationClick` / `onAnnotationHover` | 接收 occurrence；hover 离开时为 `null` |
| `onDocumentChange` | 输入或扩展变更后接收新快照 |

数组、扩展和数据对象按不可变数据使用。发生变更时传新对象，静态配置保持引用稳定。更换整篇独立文档时可以给 Provider/Reader 换一个 React `key`，从而清除上篇文章的局部交互和任务。

`Reader` 额外接受 `toc`、`sidebar`、`fillHeight`（均默认 true）、`sidebarBreakpoint`（默认 1120，按容器宽度判断）、`actions`、`followOutput`、`className`、`style`。`fillHeight` 让短正文补足当前位置到滚动视口底部的可用高度，默认预留 24px；可通过 `--limr-reader-bottom-space` 为页脚留位，或用 `--limr-reader-min-height` 覆盖最小高度。内嵌小卡片可设 `fillHeight={false}`。计算使用滚动坐标中的固定起点，普通滚动不会改变最小高度。`Markdown` 额外接受 `interactive`（默认 true，控制选区监听）、`followOutput` 和样式属性。

## 布局和定位

默认组合约定：目录、正文和侧栏在同一个滚动容器内。正文与阅读区域最小高度共同决定布局，同步侧栏拉伸至所在网格行的高度，卡片在内部绝对定位并裁切溢出，不参与父组件高度计算。保持侧栏和正文处于同一个未缩放的 CSS 坐标系，不额外添加独立滚动或 transform。自定义组合应像下面一样使用同一行的 grid，并给正文提供裁切容器；非 grid 布局需要由宿主给侧栏明确高度。ResizeObserver、图片加载、字体加载及容器变化会重新测量几何；普通滚动使用缓存的标题位置。

```tsx
const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);

<div ref={setScrollRoot} style={{ height: '80vh', overflowY: 'auto' }}>
  <DocumentProvider source={source} scrollRoot={scrollRoot}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0,1fr) 260px', gap: 24, alignItems: 'start' }}>
      <TableOfContents style={{ position: 'sticky', top: 0, maxHeight: '75vh' }} />
      <main className="limr-reader-content" style={{ alignSelf: 'stretch', overflow: 'clip' }}><Markdown /></main>
      <AnnotationSidebar />
    </div>
    <SelectionToolbar actions={actions} />
  </DocumentProvider>
</div>
```

同步侧栏没有独立滚动条，也不接受滚轮、触摸或聚焦引起的列表滚动。悬浮正文角标时移动侧栏；悬浮侧栏卡片时锁住当前卡片与相邻条目位置，让正文平滑位移至关联位置。正文位移不改变布局高度，测量锚点时扣除动画中的实时位移，避免位置反馈循环。展开/收起保留交互来源与 hover；点击空白处清除卡片与角标的激活状态并恢复正文位置，Esc 收起并把焦点还给角标。长回答的正文仍可在卡片内滚动，隐藏原生滚动条，卡片高度受侧栏剩余空间限制。

在独立抽屉等场景使用 `<AnnotationSidebar sync="none" />`。它保留正常列表流，不读取正文的对齐位置，也展示没有锚点的角注，宿主自行约束高度与滚动。`positioner(items, {activeId, gap})` 可以替换同步侧栏的对齐算法；items 含 occurrence ID、相对侧栏的角标顶部和卡片高度，返回 ID 到顶部距离的 Map。默认优先对齐 hover/激活角标；无激活条目时跟随正文当前阅读位置。前面的卡片允许返回负位置并在侧栏内裁切，不会为了保留前面条目而挤走当前卡片；卡片顺序和间隔仍然保留。

`renderCard({occurrence, active, activate})` 替换侧栏卡片外壳；单个角注的内容通常通过 `AnnotationType.Content` 替换。需要完全自主的布局时，用 `useAnchor(occurrenceId)` 获得实时角标元素、视口矩形和正文矩形，再自行放置组件。

`AnnotationOverlay` 接受 `disabled`、`portalRoot`、`previewWidth`（340）和 `maxHeight`（`80dvh`，模块未指定展开上限时使用）。浮层默认通过 portal 放入 body。模块通过 `overlay.Card` 渲染完整卡片，通过 `overlay.previewWidth` 和 `overlay.expand` 声明预览宽度、展开能力及布局；LiMR 管理挂载、位置、焦点和动画。预览贴近角标，展开可以原地增高或在整个页面的可视区域居中。默认 Citation 不展开，点击会固定预览。模块可配置尺寸或按 annotation 动态返回策略，详见[扩展指南](extensions.md)。所有模式均支持触摸、Esc、外部点击关闭和焦点恢复，居中模式另有遮罩与焦点约束。打开时焦点落到对话框容器，Tab 再进入模块提供的控件。高 z-index 宿主可覆盖 `--limr-overlay-z` / `--limr-toolbar-z`。

`AnnotationCard` 是模块可选用的默认卡片布局，接收 `AnnotationOverlayCardProps` 以及必填的 `title: ReactNode`、可选的 `bodyLabel`。它提供标题栏、展开/收起/关闭按钮和滚动区域；模块也可以完全自行渲染这些部分。旧模块只提供 `Content` 时仍可使用兼容布局，其标题来自类型的 `label`。

`TableOfContents` 接受 `title`、`maxDepth`、`followActive`、`topInset`（12）、`updateHash`（false）和样式属性。独立使用时给它或父容器设定可用高度。标题位于滚动区之外；手动滚动目录会短暂暂停自动跟随；页面底部将最后一个标题视为 active。

`Reader` 的窄屏目录使用整行按钮，右侧箭头随展开状态旋转。目录内容持续挂载，展开/收起从当前高度连续过渡，快速点击可随时反转；隐藏内容不可获得焦点。

## 角注数据与命令

```tsx
const [annotations, setAnnotations] = useState<Annotation[]>([
  {
    id: 'paper',
    type: 'citation',
    data: { title: '论文', url: 'https://example.com', description: '**摘要**' },
    anchors: [{ range: { start: 10, end: 18 }, quote: original.slice(10, 18) }],
  },
]);

<Reader source={original} annotations={annotations} onAnnotationsChange={setAnnotations} />
```

一个 annotation 可包含多个 anchors；一个嵌入式 `<ref ids="a,b" />` occurrence 可显示多个 annotation。单个锚点可以用 `range` 简写。范围采用 UTF-16 偏移、右端不包含。可加 `documentId` / `revision` 验证所属文档和版本。持久化时推荐保存 `quote`：原范围失配时只接受唯一的同文匹配，歧义或找不到时不猜测位置。LiMR 不负责协同编辑中的锚点变换；复杂编辑场景由应用更新范围。

`useLiMR()` 提供：

- `addAnnotation(annotation)`、`updateAnnotation(id, patch)`、`removeAnnotation(id)`。
- `activateAnnotation(annotationIdOrOccurrenceId)`、`scrollToAnnotation(occurrenceId)`。
- `addHighlight(highlight)`、`removeHighlight(id)`、`clearSelection()`。
- `scrollToHeading(headingId)`、`invalidateAnnotation(id)`。
- `document`：底层 `DocumentEngine`，可读取/订阅快照；`signal` 随阅读器卸载而取消。

高亮格式：`{id, range, style?, color?}`。style 支持 `background`、`underline`、`dotted`、`wavy`，默认背景色。高亮是基于当前原文坐标的装饰；应用替换或编辑原文时需同时维护其范围。角注和高亮都是 React 渲染的节点，不在渲染后拆分或修改 React 管理的 DOM。

## 选区和动作

`useSelection()` 与 `onSelectionChange` 返回同一结构：

| 字段 | 意义 |
| --- | --- |
| `text` | 浏览器选中的可见文本 |
| `raw` | 映射到原始输入的范围与原文 |
| `syntax` | 补全与选区交叠的强调、链接、代码、公式或自定义原子语法 |
| `blocks` | 所在的完整段落、标题、列表项等区块，可含多个范围 |
| `quality` | `exact`、`atomic` 或 `unmapped` |
| `settled` | 拖动调整选区时为 false |
| `documentId` / `revision` | 选区对应的文档版本 |

公式、图片属于原子节点，结果覆盖整个语法节点，并标为 `atomic`。行内代码及围栏代码提供字面量源码映射，支持部分选择；它们的 `syntax` 结果仍补全整个语法。自定义组件应渲染提供的 `children` / `renderChildren` / `renderValue` 来保留正文映射，或声明原子选择。生成的 UI 文字不应冒充原文；可加 `data-limr-ignore` 排除按钮和标签。

`SelectionAction` 含 `id`、`label`、`icon?`、`visible?`、`disabled?`、`run?`、`render?`。`run(context)` 支持 async；错误在菜单中显示。context 包含三种选区、当时的文档快照、文档命令和 `signal`。这个 signal 的生命期是阅读器，关闭菜单不会中止已开始的请求，卸载会取消。

`render(context)` 提供单项自定义槽位，例如输入框；`SelectionToolbar render={...}` 可以替换整个工具条。显式 actions 会按 ID 覆盖插件提供的同名动作。`Markdown` 不挂载菜单，需要应用自行提供 `SelectionToolbar`；`Reader` 已组合它。

## 状态 hooks 和 core

`useDocument()` 获取源文档快照；`useAnnotation(id)` 和 `useAnnotations()` 获取合并了源文档、外部数据和插件新增内容的角注数据，后者返回 annotations Map 与 occurrences 数组；`useDocumentSelector(select)` 只订阅选择出的值；`useAnnotationState()` 获取 active/hovered occurrence 和修改方法；`useAnchor(id)` 获取定位信息。频繁变化的布局、滚动、选区和文档使用不同订阅通道。

```ts
import { createDocument, selectionFromRange } from 'limr/core';

const engine = createDocument('', { streaming: true });
const unsubscribe = engine.subscribe(() => consume(engine.getSnapshot()));
engine.append('# Heading\n\n');
engine.append('Content');
engine.finish();
unsubscribe();
```

core 默认仅 CommonMark，不依赖 React、DOM 或浏览器全局。需要 GFM 等能力时传入对应的语法扩展。`setExtensions()` 会重新解析全文。`metrics` 提供本次重新解析的字符数、复用区块数和原因；它不是总 CPU 开销的计量器。

## 样式与服务端

常用 CSS 变量：`--limr-font-text`、`--limr-font-code`、`--limr-font-size`、`--limr-line-height`、`--limr-text`、`--limr-heading`、`--limr-background`、`--limr-accent`、`--limr-content-width`、`--limr-reader-width`、`--limr-sticky-top`。

样式放在 `@layer limr`，应用的普通 CSS 可以覆盖它。`appearance` 传播样式包的作用域到各组件和 portal。默认 `styles.css` 附带本地 Maple Mono NF CN 子集；`styles/base.css` 不导入字体。Playground 的 Noto Serif SC 是演示依赖。缓存、主题包和交互样式见[样式指南](styles.md)。

服务端和客户端使用相同 source、extensions、documentId 和首次 streaming 值。不要把随后客户端已有的数据提前只传给其中一端。同步 SSR 的公式可用 `await preloadMath()` 预加载；代码始终有可读的源码回退。自动 documentId 使用 React useId，多根 hydration 可使用 React identifierPrefix 或显式唯一 ID。
