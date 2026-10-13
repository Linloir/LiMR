# 扩展指南

语法、节点渲染、角注和选区操作遵循同一套公开接口。`standard()` 只是默认模块列表，没有第二套内部专用模块接口。

## 独立语法模块

`defineBlock({name, component, tags?, directives?, selection?})` 同时注册标签和指令适配器：

```tsx
const warning = defineBlock({
  name: 'warning',
  component: ({ children, pending }) => <aside aria-busy={pending}>{children}</aside>,
});
```

```markdown
<warning>

**Markdown** 内容。

</warning>

:::warning
也可以用指令语法。
:::
```

组件接收 `node`（含 attributes/children/原文 position）、`children`、`source`、`pending` 和 `renderChildren(nodes)`。后者直接渲染已解析子树，不需要重新解析字符串。按需渲染答案/提示时可保留对应节点，以原始坐标交还给 `renderChildren`。字面量节点（如 code/inlineCode）使用 `renderValue(tokens?)` 保留源码映射和装饰；token 只需提供正文 `content`、相对 node.value 的 UTF-16 `offset` 和可选 `style`。

属性中的可见文字使用 `renderAttribute('title')`：内置 JSX/指令适配器保留属性值的原文位置（不含引号），因此标题同样支持部分选择、高亮和角注，实体解码后仍能回到原始坐标。直接输出 `node.attributes.title` 则只会得到普通文字。自定义解析器可提供 `node.attributeNodes[name]`（带 `value` / `position` 的文本节点）接入同一链路。

需要行内标签、全新 token 或 AST 改写时用 `defineExtension()`：

```tsx
const badge = defineExtension({
  name: 'badge', tags: ['badge'], display: 'inline', scope: 'local',
  components: { badge: ({ children }) => <span className="badge">{children}</span> },
});
```

`micromark` 接收 micromark syntax extensions 数组，`mdast` 接收 mdast from-markdown extensions 数组。`transform(root, {source, streaming, documentId})` 可以把自定义 AST 节点变换为新的节点类型，再通过 `components[nodeType]` 渲染。保留原始 position，不修改原始 source。没有 position 的生成内容无法提供精确选区映射。

`transform` 默认为全文语义。声明 `scope: 'local'` 的承诺是：已有完整顶层区块的输出不依赖其后的区块，不依赖正在变化的全文上下文；输入末尾重新解析就能保持语义正确。编号、跨段关系等插件应保留默认全文模式。内置 Markdown 引用/脚注定义有单独的全文失效机制。未闭合标签会使用原文回退，完成后重试，结束后总会完整解析。

扩展 name、tag、directive 冲突会抛错。用 `replaceExtension(existing, replacement)` 按 name 替换；组件覆盖可直接放 `components`，角注覆盖可直接放 `annotationTypes`。不做隐式的 parser 覆盖。

## 默认模块

| 工厂 / name | 能力和配置 |
| --- | --- |
| `gfm()` / `gfm` | 表格、任务列表、删除线、自动链接、标准脚注 |
| `math({macros?, strict?})` / `math` | `$...$`、`$$...$$`，KaTeX，不信任执行性命令 |
| `codeHighlight({languages?, lightTheme?, darkTheme?, eager?, maxLength?})` / `code-highlight` | Shiki；默认靠近视口加载，超过 100,000 字符保留纯代码 |
| `definition({component?})` / `definition` | `<definition>`，title 属性或 `<title>`，可选 `<content>` |
| `question({component?})` / `question` | 问题正文、提示、答案、选择题 |
| `extras({component?})` / `extras` | `<extras><extra title="..." url="..." desc="..." /></extras>` |
| `video({component?, resolveUrl?, loading?})` / `video` | `<video>` / `<md-video>`，自动识别 native / youtube / bilibili |
| `figures(options?)` / `figures` | `<figures>` 响应式图组、`<figure>` 单图、图注与图片复制 |
| `citation(annotationTypeOverrides?)` / `citation` | `<ref>` / `<citation>`，citation 角注类型 |
| `translations({defaultMode?})` / `translations` | `<translations>`、`<origin>`、`<translation>`；原文、译文、对照与段末切换角标 |

问题的子标签为 `question-content`、`question-hint`、`question-answer`、`question-sel-grp` 和 `question-sel`。选择组用 `answer="[0,2]"` 配置从 0 开始的正确选项编号，`multi="true"` 开启多选。它们是内容组件，不包含提问/聊天角注或服务连接。

视频使用 `url` 或 `src`，默认从 URL 识别平台，也可显式指定 `provider="youtube"`、`"bilibili"`、`"native"`。支持 YouTube watch/短链接/embed/shorts/live 地址及起始时间、Bilibili BV/av 地址及分 P。播放器靠近视口 200px 时才挂载真实 iframe/原生 video，不自动播放；可用 `video({ loading: 'click' })` 或单个标签的 `loading="click"` 改成点击后加载，`"eager"` 则立即加载。视频居中、默认最大宽 560px，16:9；右上角复用公式复制按钮，复制原始 Markdown。

YouTube 使用标准 `youtube.com/embed` 地址，iframe 的 `referrerPolicy="strict-origin-when-cross-origin"` 保留来源站点。播放器的来源要求见 [YouTube 官方文档](https://developers.google.com/youtube/iframe_api_reference#Events)（缺少来源身份可能报 153）。远程平台仍决定视频能否嵌入；本地回归使用请求拦截验证 URL、加载时机和 iframe 参数，不代替真实播放验收。未知标签不执行 HTML；自定义组件对自己的远程请求和 URL 处理负责。

## 图片与论文图组

```markdown
<figures columns="2" rows="2" min-width="220" min-height="120" max-width="560" max-height="480">

<figure src="/paper/a.png" alt="实验 A" caption="(a) 实验 A" />

<figure>

![实验 B](/paper/b.png)

<figcaption>**(b)** 实验 B，支持 Markdown 图注。</figcaption>

</figure>

<figcaption>图 1 · 两个实验的比较。</figcaption>

</figures>
```

`figure` 可以独立使用，支持 `src` / `url` 属性，或内部的 Markdown 图片、图片引用及 `<img src="..." alt="..." />`。每个 `figure` 放一张图，多图使用 `figures`；图注可用 `caption` 属性、`<figcaption>` 或 `<caption>`。`id` 可以作为普通 Markdown 页内链接的目标。属性文字保留源文坐标；富文本图注仍可选择、高亮和加角注。也支持 `:::figures`、`:::figure`、`:::figcaption` 指令，单图可写作 `::figure{src="/image.png" caption="图注"}`。

图片在各网格行中垂直居中，图注居中对齐。选择按“图片、该图图注、下一张图片、该图图注、总图注”的阅读顺序进行；属性顺序不同也不会把未选中的图注混进选区。图片高亮描绘实际图片的边框（或所选的下划线样式），图注仍按文字高亮。图片角标叠在图片右下角，保留按钮主题底色；图注角标跟随文字。复制按钮位于外框内部。

| 属性 | 默认值 | 行为 |
| --- | --- | --- |
| `min-width` / `min-height` | `220` / `120` | 图片可读尺寸下限，用于决定是否增加列；窄于下限时优先适应容器 |
| `max-width` / `max-height` | `560` / `480` | 图片尺寸上限，保持比例、不裁切；`none` 或 `false` 取消对应上限 |
| `columns`（或 `cols`） | 自动 | 指定列数，上限 24 |
| `rows` | 自动 | 单独指定时按图数推导列数；同时指定行列时预留行，超出内容继续排入新行 |
| `responsive` | `true` | 显式列数无法满足可读尺寸时逐步减列；`false` 保留列数，允许小图 |
| `gap` | `16` | 图组间距，像素 |

尺寸接受非负数字或 `px`，模块工厂对应驼峰参数，例如 `figures({ maxHeight: 360, maxWidth: false })`。`figures` 的尺寸限制由内部 `figure` 继承，单图属性可覆盖。最小高度也保留媒体区域的留白；长宽比使上下限无法同时满足时，最大尺寸及容器宽度优先，图片不会变形。

自动布局从一列开始，结合图片加载后的真实比例：当前列达到可用最大宽度后，还有空间容纳另一张达到最小宽、高的图，才增加一列。最大高度同样会限制可用宽度。明确关闭全部尺寸上限时，自动布局保持一列；需要多列可设置 `columns` / `rows`。这里的上限约束图片，不裁切较长的图注。

单图按钮复制 **图片 URL**，沿用 infilearn 的行为；相对 URL 保留原来的相对形式。图组按钮复制完整的 **Markdown 源码**。复制不读取图片二进制，也不要求图片服务器允许跨域读取；浏览器拒绝剪贴板写入时会显示失败提示。

## 分段译文与全局参数

```markdown
<translations default="origin">

<origin>

Original **Markdown**. It can include lists, images and citations.

</origin>

<translation>

翻译后的 **Markdown**，同样可以包含列表、图片和引用。

</translation>

</translations>
```

`default` 接受 `origin`、`translation`、`both`，默认 `origin`。对照时先显示译文，再显示原文。角标位于最后一段显示内容的末尾，用圆角线条的原文页、译文页、并排页图标表示状态，悬浮提示及无障碍名称说明当前状态和下一步操作，依次切换“原 → 译 → 对照 → 原”。内容高度和透明度共同过渡，支持中途反向切换与减少动态效果偏好；隐藏内容保持挂载并设置 `inert`，其角注不会生成同步侧栏卡片。流式生成期间只有一侧内容时，先显示已到达的内容。

这是 `translations()` 模块通过公共 `InlineMarker` 和 `renderChildren(nodes, { trailing })` 注入的操作，不生成 `Annotation`，不打开浮层或侧栏。`InlineMarker` 也可用于插件自己的纯操作角标；最后一个节点是段落时 `trailing` 放在段内，其余块类型放在块后。

```tsx
const [mode, setMode] = useState<TranslationMode | undefined>();

<Reader
  source={source}
  parameters={{ translationMode: mode, onTranslationModeChange: setMode }}
/>
```

`translationMode` 覆盖各块的 `default` 和本地选择；设回 `undefined` 后恢复各块原来的本地选择。传入 `onTranslationModeChange` 时，角标会请求修改全局模式；只有全局值而没有回调时，角标只显示当前模式，不允许局部绕过外部控制。不同阅读器的参数相互隔离。

插件参数是通用能力，不需要修改 LiMR 内核：

```tsx
import { useRendererParameter, type RendererExtension } from '@linloir/limr';

declare module '@linloir/limr' {
  interface RendererParameters { glossaryDetail?: 'short' | 'full' }
}

const glossary: RendererExtension = {
  name: 'glossary', tags: ['glossary'],
  parameters: { glossaryDetail: 'short' },
  components: {
    glossary: ({ children }) => {
      const detail = useRendererParameter('glossaryDetail');
      return <aside data-detail={detail}>{children}</aside>;
    },
  },
};

<Markdown source={source} plugins={[glossary]} parameters={{ glossaryDetail: 'full' }} />
```

模块在 `RendererExtension.parameters` 注册默认值；宿主通过 `Reader`、`Markdown` 或 `DocumentProvider` 的 `parameters` 覆盖。后注册模块可以覆盖同名默认值。hook 仅订阅所请求的值，参数变化不会重新解析 Markdown，卡片中的 `AnnotationMarkdown` 也继承宿主参数。

## 角注类型

```tsx
const glossary = defineAnnotation<{ title: string; body: string }>({
  type: 'glossary', label: '术语', icon: '◎', color: '#548b74',
  Content: ({ data, presentation }) => <div>
    <strong>{data?.title}</strong>
    <AnnotationMarkdown source={data?.body ?? ''} />
  </div>,
});
```

注册类型与放置角注是独立操作。类型定义 icon、可选 Marker 组件、内容组件和可选的数据加载器；数据通过 annotations、文档命令或自定义语法 transform 生成。

`icon` / `Marker` 只负责图形；按钮、点击、悬浮、可访问标签和大小由 LiMR 管理。推荐带方形 `viewBox`、`currentColor` 的 SVG，图形在 viewBox 中居中，不需要写外层按钮、sup 或尺寸。图标槽会限制超大 SVG/图片、嵌套组件的尺寸与溢出，统一普通和插件角标的尺寸，并重置装饰性 HTML 包裹层的字体基线。复杂自定义图形仍应在自己的 viewBox 内留出边界；槽位不能修复 SVG 内部画偏或留白不对称。可通过 `--limr-mark-size` 修改整套角标尺寸。

`Content` 接收 `annotation`、`data`、`presentation`（preview/expanded/sidebar）、`expanded`、`editing`、`loading`、`error`、`retry`。可以按展示模式显示摘要或完整 UI；`editing` 来自 `editAnnotation(id)` 或 `addAnnotation(annotation, { edit: true })`。`load(annotation, {signal})` 只在需要展示内容时调用，必须遵守 signal；同一注释在侧栏和浮层之间共享请求和结果。更换不可变 annotation 对象会换资源标识；显式 `invalidateAnnotation(id)` 或 `retry()` 可重新加载。缓存按阅读器隔离，结果采用有限 LRU；不会把一个应用用户的数据共享给另一阅读器。

`color` 同时作为角标、默认侧栏标题/装饰条/淡色背景及公共浮层标题的主题色，未激活的装饰条也保留主题色。`sidebar.color`、`borderColor`、`titleColor`、`textColor`、`excerptColor`、`previewColor` 可分别覆盖侧栏主题色、未激活装饰条、标题、正文、关联文本和标题下的预览；不指定正文颜色时沿用阅读器正文色，支持 CSS 颜色和变量。`Content` 和 `Preview` 可以给局部元素单独设置颜色，不会被骨架强制覆盖。多条注释共用一张卡片时，首条注释决定卡片主题，各条目的内部富文本仍由模块控制。

默认侧栏卡片顶部始终显示灰色的关联文本区（`.limr-sidebar-reference`），单行省略，完整文本放在 `title` 中。选区角注展示关联范围的可读文本，去掉 Markdown 标记并解码实体；嵌入式 `<ref>` 展示所在段落。它由 LiMR 根据 occurrence 生成，展开后仍保留，模块无需在 Content 内重复渲染。页面级 `renderCard` 接管时可自行选择是否提供关联区域。

收起时，标题下面的摘要由模块的 `sidebar.Preview` 组件渲染。它接收 `AnnotationSidebarPreviewProps<T>`：`annotation`、`data`（本地 `annotation.data`）、`occurrence`、同组的 `annotations` 和上方的 `referenceText`。同组首条注释的模块负责整组预览，可以自行合并摘要或显示数量。默认最多两行，`sidebar.previewLines` 可设置正整数行数；展开后预览收起，改为显示完整 `Content`。设 `Preview: false` 或组件返回 `null` 可关闭预览，不留下空白间距。未配置预览的模块保持只显示标题。

预览不会触发 `load`，也不需要挂载完整内容。远程模块应随本地注释携带摘要字段；摘要更新后预览跟随 `updateAnnotation()` 更新。建议使用简短文字或轻量富文本，不要在 Preview 里启动完整会话或远程加载。返回链接、按钮时，它们保留自身交互，其余预览区域点击展开卡片。

```tsx
defineAnnotation<{ question: string; answer: string }>({
  type: 'assistant', label: '询问助手', color: '#8b5cf6',
  Content: ({ data }) => <AnnotationMarkdown source={data?.answer ?? ''} />,
  sidebar: {
    Preview: ({ data }) => data?.question ? <span title={data.question}>{data.question}</span> : null,
    previewLines: 2,
    textColor: 'var(--limr-text, #1a1a1a)',
    previewColor: 'var(--limr-secondary, #7b756e)',
  },
});
```

Citation 的默认预览依次使用 `summary`、`description`、安全 URL、标题；摘要和描述去掉 Markdown 标记并解码实体，同组引用按顺序拼接。`summary` 可通过注释 data 或 `<citation summary="简短摘要" ... />` 提供；有 description 时，展开显示完整 description。`citation({ sidebar: { Preview: MyPreview, previewLines: 3 } })` 可替换展示，`Preview: false` 可关闭。只覆盖颜色或行数会保留默认预览。

**模块内容边距约定：** 默认卡片由灰色关联区和 `.limr-sidebar-card-body` 两块组成，中间保留 `1px` 分隔（`--limr-sidebar-reference-gap`）。两区共享 `--limr-sidebar-padding-inline`，默认 `10px`，关联文本、标题、预览和展开正文的文字起点必须对齐；不要在模块根节点再加水平 padding、margin 或 text-indent。修改横向留白应调整共享变量，不要分别改两区。逻辑方向属性保证 RTL 使用同一约定。

骨架负责标题到预览/正文的间隔；通用内容区底部比顶部多 2px，补足文字基线带来的视觉差异。模块只负责内部段落间距，不要再给 `Content` 或 `Preview` 根节点添加卡片 padding 或用于补偿底部的空段落。骨架清除内容根节点首尾 margin；自定义包裹层中的段落边距由模块处理，Markdown 内容推荐使用 `AnnotationMarkdown`，它会清除末段 margin，包含 source-binding 包裹层和绘制层的情况。不同字体的视觉留白仍需按实际字形检查。

Citation 保留专用间距：多条目的底部补偿及条目间隔不受通用骨架的 2px 调整影响；单条目展开时底部比多条目少 2px。请分别验证带描述/不带描述、单条/多条、普通文本/Markdown、加载中/流式回答和浅色/深色，不要通过统一增减所有卡片的底部 padding 修正某一种内容。

模块通过 `overlay.Card` 接管悬浮和展开卡片的全部内部 UI，包括标题、正文、操作和底栏。`AnnotationOverlayCardProps<T>` 提供 `annotation`、`occurrence`、`presentation`、`expanded`、`pinned`、`canExpand`、`expand()`、`collapse()`、`close()`，以及已经接入各条目 `Content` 和缓存的 `children`。LiMR 只保留浮层定位、挂载、动画和焦点管理。自定义正文可用 `data-limr-card-body` 标记淡入区域。

可以选用公共布局组件，标题仍由模块决定：

```tsx
import { AnnotationCard, type AnnotationOverlayCardProps } from '@linloir/limr';

function ConversationCard(props: AnnotationOverlayCardProps) {
  return <AnnotationCard {...props} title="询问助手" />;
}
```

不需要默认布局时直接返回自己的 header、正文和操作按钮即可。`Card` 使用同一个组件处理两种 presentation，避免切换时丢失输入状态。兼容旧的仅 `Content` 定义时，默认布局以类型 `label` 作为标题。

浮层是否允许展开、展开的布局由角注模块声明，默认不展开。点击没有展开能力的角标会固定预览，触屏也可滚动阅读、点击关闭；Citation 默认采用此行为。

```tsx
defineAnnotation({
  type: 'conversation', label: '对话', Content: Conversation,
  overlay: { Card: ConversationCard, expand: { placement: 'center', width: 680, height: '80dvh' } },
  sidebar: { collapseOnContentClick: false },
});

defineAnnotation({
  type: 'detail', label: '详细说明', Content: Detail,
  overlay: { expand: { placement: 'anchor' } },
  sidebar: { collapseOnContentClick: true },
});
```

`overlay.expand` 可以是 `false`、`AnnotationExpansion`，也可以是 `(annotation) => false | AnnotationExpansion`，按数据选择。`placement: 'anchor'` 保持预览靠近角标的一侧边缘，在原地按内容增高；`'center'` 在整个页面的 visual viewport 居中，不受正文列宽或内部滚动容器限制。可设 `width`、`height`、`maxHeight`（数字为 px，字符串为 CSS 长度）；省略 height 时按内容高度，省略 width 时 anchor 保持预览宽度、center 使用 640px。`overlay.previewWidth` 可单独设置预览宽度。尺寸始终受可视区域限制，包括移动键盘。

展开从脚注预览的位置和尺寸放大，关闭缩回该位置和尺寸并淡出；触摸和工具栏直接打开时会先隐式测量实际预览。外壳独立变形，文字和控件保持正常比例。展开、收起复用同一组件与请求，模块可根据 `presentation` 改变内容；关闭动画可被重新打开打断，完成后才卸载。

`sidebar.collapseOnContentClick` 默认 false，Citation 也保持 false。Citation 条目悬浮时显示下划线，有 URL 时点击标题或说明可以跳转；标题栏负责展开/收起。自定义模块启用该选项后，展开卡片的普通文字/空白区域可点击收起，链接、按钮、输入框、选中文本和 `[data-limr-card-interactive]` 区域保留自身交互。模块仍可用 `useLiMR().activateAnnotation(null)` 自行关闭。多个角注共用一个角标时，首个角注决定浮层 Card 和布局，`children` 保留所有条目各自的 Content；侧栏仅在所有角注类型均启用后才允许点击内容收起；页面级 `renderCard` 可完全替换侧栏卡片行为。

自定义语法可以生成 `annotationDefinition` 节点，其 `annotation` 字段为完整数据；生成 `annotationReference` 节点，其 `annotationIds` 为引用的 ID 数组，position 对应角标位置。也可以完全不添加语法，直接给用户选中的范围添加外部 annotation。

## 工具栏插件与展开面板

工具栏默认包含高亮和复制。插件将 `SelectionAction` 放入 `actions` 即可追加入口；`icon` 是必填字段，推荐 `currentColor`、圆润线端和方形 viewBox。LiMR 将 SVG、图片或嵌套图形限制到统一的图标槽中；内部图形的留白和视觉重量仍需由插件作者控制。内置的 `ToolIcon` 提供同一设计语言的常用图形。

```tsx
import { ToolIcon, defineExtension, type ToolbarActionContext } from '@linloir/limr';

function Settings({ context }: { context: ToolbarActionContext }) {
  return <button disabled={context.busy} onClick={() => void context.run(current => {
    current.addAnnotation({
      id: crypto.randomUUID(), type: 'my-note',
      range: current.selection.syntax.ranges[0], data: { text: current.selection.text },
    });
    current.clearSelection();
  })}>保存选中文本</button>;
}

const noteTool = defineExtension({
  name: 'note-tool',
  actions: [{
    id: 'note-tool:add', label: '记一笔', icon: <ToolIcon name="note" />,
    run: context => context.expand(),
    renderExpanded: context => <Settings context={context} />,
  }],
  // 另行注册 my-note 的 annotationTypes，定义卡片内容。
});
```

`renderExpanded` 自动接入悬浮展开、键盘入口、尺寸约束与选区保留；触屏点击动作本身展开。可选 `onHover(context)` 接入自定义悬浮行为。`context.annotations` 是当前片段绑定的所有 annotation，`context.highlight` 是其中的高亮 annotation；`label(context)` / `icon(context)` 可以随状态改变。展开内容的操作使用 `context.run(operation)` 统一处理忙碌与异常。完整自绘 `render` 槽位的控件与可访问性由模块自行管理。

面板的最大可用高度由 LiMR 决定，通过 `--limr-toolbar-panel-height` 暴露；默认上限 260px，样式包可设置 `--limr-toolbar-panel-max-height`。插件使用自然高度和响应式宽度，骨架在实际溢出时提供不占内容宽度的细滚动条，无需插件重复处理滚动。第三方皮肤可覆盖工具栏的颜色、圆角、字体与面板宽高，详见[样式指南](styles.md)。

[notes.tsx](../examples/notes.tsx) 将旁注、笔记、提问和脚注拆成四个直接操作，使用 `addAnnotation(..., { edit: true })` 创建带原文 quote 的锚点、共享高亮并进入编辑。宽屏在侧栏编辑，窄屏直接打开卡片；草稿存入 annotation data，跨布局切换仍然保留。编辑框透明无边框、随内容增高，支持 Markdown 换行及 Ctrl/Cmd+Enter 提交。修改、删除、取消和提交采用右对齐的图标文字按钮，复用 `.limr-underline`。Playground 的模块样式在 `playground/playground.css` 的 `.demo-note-*` 中，移植时可替换为应用自己的样式。插件的卡片内容与业务状态由插件负责，骨架只管理定位、激活、编辑状态和滚动。

## 助手插件的协作方式

[assistant.tsx](../examples/assistant.tsx) 是完整、经过浏览器验证的例子：

1. 插件在 `actions` 注册选区菜单入口。
2. 动作从选区创建一个具有原始范围和 quote 的自定义 annotation。
3. 用 `activateAnnotation(id)` 打开卡片，清空菜单选区。
4. 应用 adapter 产生 `AsyncIterable<string>`；每个片段调用 `updateAnnotation()`。
5. 自定义 Content 使用 `AnnotationMarkdown streaming` 渲染回答。
6. Reader 卸载时中止请求，动作不再更新已卸载的文档。

示例支持 `prompt(selection)` 生成首个问题，保存到 `data.question` 并传给 `adapter.answer({ selection, question, signal })`。`sidebar.Preview` 显示这个问题，流式回答只更新答案，不覆盖问题；中文页面可配置 `prompt: selection => \`请解释「${selection.text}」。\``。接入已有对话时，应用也可提供自己的 Preview 展示首条用户消息。

示例只从 `@linloir/limr` 的公共入口导入，可以复制到应用中使用。真实 Codex 集成可以实现同一个 adapter，也可以自行实现更复杂的组件、对话状态、输入框和动作。LiMR 不把助手的传输、认证、问题/答案 schema 写入内核。

插件任务的取消信号来自动作的生命周期上下文。若业务还需要“停止生成”、重试、切换会话等控制，可由插件自己的 AbortController 与 context.signal 联动。角标保留哪个历史回答、是否保存、如何鉴权，也由应用决定。

## 作为独立包分发

插件导出一个返回 `RendererExtension` 的工厂，消费者通过 `plugins={[yourPlugin(options)]}` 添加即可。`plugins` 会追加到 `extensions`（未指定时为 `standard()`），无须消费者重复列出默认模块。以 `@linloir/limr` 和 `react` 为 peerDependencies，导出 ESM 和类型声明；不要把另一份 React 或 LiMR 打包进插件。

[`examples/packages/reading-tools`](../examples/packages/reading-tools) 演示一个同时提供语法、角注内容和选区动作的独立包，[`paper-theme`](../examples/packages/paper-theme) 是独立 CSS 包。`pnpm test:package` 会先打包，再在仓库外安装这些包与 LiMR，验证 React 18/19 的类型、SSR、浏览器交互和 portal 样式。示例包名未发布到 npm；发布自己的包时替换 name、version，并移除 private。

仅样式包无需 React 或解析器依赖。使用 `appearance` 属性选择作用域，使多个阅读器和浮层使用正确主题；详见[样式指南](styles.md)。
