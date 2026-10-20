# 项目集成

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/integration) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/integration.md)

## 选择组件

| 场景 | 推荐入口 | 宿主负责什么 |
| --- | --- | --- |
| 文章、论文、知识库阅读 | `Reader` | 提供源码与文档 ID，选择主题和持久化方式 |
| 完整的大文件或本地文件预览 | `AsyncReader` + Worker | 获取文件、提供 Worker URL、处理取消/失败和编辑保存 |
| 聊天消息、流式回答 | `Markdown` 或 `Reader` + `streaming` | 累积生成文本，结束时设为 false；传输和停止生成由应用负责 |
| 现有编辑器或复杂布局 | `DocumentProvider` + 一个主 `Markdown` | 组合导航、工具栏、侧栏/浮层，传入实际滚动容器 |
| 只解析、SSR 数据处理 | `createDocument`，从 core 入口导入 | 显式配置语法扩展；不依赖 React 或 DOM |

先完成[快速开始](getting-started.md)中的可运行接入，再按下方选择模块与显示策略。大文档默认窗口化、表格自适应布局、代码块折叠是三种不同能力：分别控制正文 DOM 数量、单表布局和单块展示，不会相互替代。

用 `Reader` 获取完整阅读体验；用 `Markdown` 渲染独立正文；自己设计布局时让一个 `DocumentProvider` 管理一个主 `Markdown` 及其目录、卡片和工具栏。Provider 内再次传入 `source` 的 Markdown 会创建独立文档，不再共享父文档状态。

阅读搜索是可选的界面组件，与语法模块分开。使用 `Reader search`、传入 `search={<YourSearch />}`，或在 DocumentProvider 内独立组合 `DocumentSearch` / `useDocumentSearch`，无需加入 `plugins` 或 `extensions`。[阅读搜索](search.md)说明控制器归属、布局、宿主命令与独立搜索 Worker。

## 模块与配置

### 模块是什么

LiMR 的基础解析器认识 CommonMark：标题、段落、列表、链接、图片和代码围栏等。**模块**是在这个基础上增加一组能力的配置对象，例如识别公式、渲染视频、显示引用卡片。开发时这个对象的公开类型叫 `RendererExtension`，所以 API 中也称它为“扩展”。

模块可以同时包含语法规则、React 渲染组件、标注类型、工具栏动作和默认参数；并非每个模块都必须有这些部分。例如 `math` 增加公式语法和渲染，`code-highlight` 为现有代码围栏添加高亮，`citation` 同时提供引用语法和标注卡片。

**插件**通常指应用自行添加的模块，或第三方包提供的模块。它与内置模块使用相同的接口；npm 包只是分发代码的方式，一个包可以导出多个模块。把模块放进 `plugins` 后，就会追加到已有配置中。

### 函数、模块名和标签名的区别

以视频为例：

```tsx
import { Reader, standard, replaceExtension, video } from '@linloir/limr';

const videoModule = video({ loading: 'click' });
// videoModule.name === 'video'
const extensions = replaceExtension(standard(), videoModule);

export function Article() {
  return <Reader extensions={extensions} source={'<video src="/lesson.mp4" />'} />;
}
```

| 写法 | 在哪里使用 | 含义 |
| --- | --- | --- |
| `video` / `video(...)` | 应用的 JavaScript / TypeScript | 导入的函数 / 调用这个函数，创建一个模块配置对象 |
| `videoModule` | 应用代码 | 自己给对象起的变量名，可以改成其他名字 |
| `'video'` | 模块对象的 `name` 字段 | LiMR 区分、替换和移除模块时使用的稳定标识 |
| `<video … />` / `<md-video … />` | Markdown 正文 | 模块注册的两种标签，触发同一个视频渲染器 |
| `::video{…}` | Markdown 正文 | 模块注册的指令写法，也可以使用 `:::video` 容器 |

这些名称不要求一致。例如创建代码高亮模块的函数是 `codeHighlight()`，对象的模块名却是 `'code-highlight'`，正文只需要普通代码围栏，不需要 `<code-highlight>` 标签。不要把 `video()` 或字符串 `'video'` 直接写进 Markdown 来启用模块，也不要把字符串放进 `plugins`；传入的是函数返回的对象。

`video({ loading: 'click' })` 的参数设置这个 Reader 中视频模块的默认行为；正文的 `<video loading="eager" … />` 则可以覆盖某一个视频的设置。不同模块支持不同参数，见[默认语法](syntax.md)。

默认模块的完整清单和可复制写法统一维护在[语法手册](syntax.md#模块清单)。默认 Reader 已包含公式、代码高亮、图组、引用、译文、Mermaid、Callout、脚注和源码标注；无需逐个安装。Playground 的阅读笔记、旁注和模拟助手属于示例插件，并非默认能力。

### 按需要组合

默认配置足够时不必写 `standard()`。需要定制时，记住这三个操作：

| 目的 | 写法 | 结果 |
| --- | --- | --- |
| 加自己的功能 | `plugins={[myPlugin]}` | 保留默认模块，追加插件对象 |
| 只保留指定能力 | `extensions={[gfm(), math()]}` | 替换完整默认模块清单；CommonMark 仍可用 |
| 调整一个内置模块 | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | 按模块 `name` 替换视频，保留其他模块 |

移除一个模块也可以过滤数组：`standard().filter(module => module.name !== 'video')`。不需要扩展语法时传 `extensions={[]}`。

不要通过 `plugins={[video()]}` 再次追加已默认存在的视频模块：重复模块名、标签或指令会报错。模块没有启用时，未知标签按文本显示；未知指令可能仅留下内部 Markdown；已有的未知标注数据继续保留，但不显示专用角标、卡片或交互；重新注册类型后恢复显示。完整边界见[架构与行为](architecture.md)。

## 完整文件加载与外部进度

文件或完整文本较大时，用 `AsyncReader input={file}` 配合宿主提供的 Worker 工厂。`loading={{ mode: 'blocking' }}` 等完整文档就绪后显示，`progressive` 可提前显示只读预览；两者最终都完成完整解析与索引。这与下面不断增长 source 的流式生成是不同入口。

加载卡片默认由 LiMR 提供。传 `loadingFallback={null}` 后，通过 `onLoadStateChange(state, controls)` 把 `state.overallProgress`、错误和 `controls.cancel/retry` 接到自己的工具栏、VS Code 原生进度或状态栏。Playground 使用同一接口，在两种加载模式中共用一个进度条。宿主跨进程传递可序列化状态，并把取消/重试消息路由回会话所有者，不要传递 engine 或函数。

保持输入对象与 Worker 工厂稳定，避免进度更新反复重建文档。源文档仍完整保存在快照中，DOM 按需挂载不等于仅解析当前屏幕；细节、可运行示例和插件约定见[大文档](large-documents.md)，实际加载与资源数据见[加载与内存性能](loading-performance.md)。

## 流式内容

```tsx
import { Markdown } from '@linloir/limr';

export function StreamingAnswer({ answer, generating }: {
  answer: string;
  generating: boolean;
}) {
  return <Markdown source={answer} streaming={generating} followOutput />;
}
```

应用负责传输层，把每个片段追加到完整 `answer`；不要只把最后一个片段传给 source。最后一次更新必须传 `streaming={false}`，完成尾部语法与语义校正。收尾可以复用稳定前缀；引用定义变化等情况仍可能触发全文解析。followOutput 只在仍靠近底部时跟随，不会强行拉回正在阅读上文的用户。纯核心支持 `append(chunk)` / `finish()`，React props 使用累计字符串。

默认新增文字和特殊块使用透明度淡入，段落结束时不重播动画。`streamEffect={false}` 可关闭，传入 `className`、`keyframes` 和 `timing` 可自定义；系统的减少动态效果偏好优先。未闭合模块可显示 loading，代码/公式渐进显示；复用 `children`、`renderChildren`、`renderValue` 有助于保留控件状态与选区。插件接口见[扩展开发](extensions.md)。

## 段落排版

```tsx
import { useState } from 'react';
import { Reader, type TypographyMode } from '@linloir/limr';

export function TypographyReader({ source }: { source: string }) {
  const [mode, setMode] = useState<TypographyMode>('standard');
  return <>
    <select aria-label="排版模式" value={mode}
      onChange={event => setMode(event.target.value as TypographyMode)}>
      <option value="standard">标准</option>
      <option value="knuth-plass">Knuth–Plass</option>
      <option value="justify">两端对齐</option>
    </select>
    <Reader source={source} typography={mode} />
  </>;
}
```

`standard` 为默认值；`justify` 使用浏览器两端对齐；`knuth-plass` 启用真正的段落优化算法。`knuthPlass` 可调整 TeX 参数与断词；流式尾段稳定后再参与 KP 排版。详细行为及性能边界见[样式](styles.md)和[性能](performance.md)。

## 内部滚动容器

```tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function ScrollPanel({ source }: { source: string }) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setScrollRoot} style={{ height: '80vh', overflowY: 'auto' }}>
    <Reader source={source} scrollRoot={scrollRoot} scrollOffset={32} />
  </div>;
}
```

窗口滚动无需指定 scrollRoot。固定顶栏通过 scrollOffset 留出距离；目录布局可用 `--limr-sticky-top` 调整。切换整篇独立文档时，给 Reader 新的 React key，并提供稳定、页面内唯一的 documentId，以重新建立任务与交互状态。

## 自定义组合

下面是固定三栏的桌面组合。窄屏响应式切换、目录折叠和自动高度优先使用 Reader；需要自己的断点策略时，由应用决定挂载 sidebar 还是 overlay。

```tsx
import { DocumentProvider, Markdown, TableOfContents, AnnotationSidebar,
  SelectionToolbar } from '@linloir/limr';

export function DesktopReader({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr) 280px', gap: 24 }}>
      <TableOfContents style={{ position: 'sticky', top: 24, alignSelf: 'start', maxHeight: '80vh' }} />
      <main className="limr-reader-content" style={{ minHeight: '70vh', overflow: 'clip' }}>
        <Markdown />
      </main>
      <AnnotationSidebar />
    </div>
    <SelectionToolbar />
  </DocumentProvider>;
}
```

正文与同步侧栏应处于同一滚动容器、同一未缩放坐标系；侧栏由网格行或宿主给定高度，不按所有卡片总高度撑大页面，也不要给同步列表增加独立滚动。卡片内的长内容可以自行滚动。抽屉等普通列表用 `<AnnotationSidebar sync="none" />`，宿主提供高度与 overflow。

浮层组合是在同一个 Provider 中放置 `<Markdown />`、`<AnnotationOverlay />`、`<SelectionToolbar />`。两个浮层组件支持 portalRoot，Reader 的组合 props 不直接暴露 portalRoot；需要定制时拆开组合。

## 受控数据与文档切换

```tsx
import { useState } from 'react';
import { Reader, type Annotation } from '@linloir/limr';

export function SavedArticle({ id, source }: { id: string; source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader key={id} documentId={id} source={source}
    annotations={annotations} onAnnotationsChange={setAnnotations} />;
}
```

该片段展示单篇文章的状态。真实应用按文章 ID 加载/保存 annotations，并在切换文章时更换这一数组；React key 不会自动清空宿主状态。不传 annotations 时使用组件内部状态；传入 annotations 时，缺少 onAnnotationsChange 会使编辑操作报错。提供回调后，还需回传新的数组才能刷新受控界面。不可原地修改数组或 data。持久化范围与迁移规则见[标注与选区](annotations.md)。

## 原文编辑与本地文件

浏览模式默认不修改 source；外部 annotations 继续通过 onAnnotationsChange 管理。`standard()` 已包含通用源码标注解析与序列化。需要本地 Markdown 预览与编辑时，给同一个 Reader 提供 onSourceChange，即可启用任务勾选和默认工具栏的源码高亮编辑，无需另装写回插件：

```tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function LocalMarkdown({ initialSource, queueSave }: {
  initialSource: string;
  queueSave: (source: string) => void;
}) {
  const [source, setSource] = useState(initialSource);
  return <Reader source={source} onSourceChange={next => {
    setSource(next);
    queueSave(next);
  }} />;
}
```

宿主的 queueSave 负责按顺序保存、合并频繁写入、处理磁盘冲突和失败提示。回调同步返回 void/true 表示接受内存修改，返回 false 或抛错则不更新文档；不要返回文件写入的 Promise。保存失败不等于已经回滚内存，宿主应保留未保存状态并重试。事务第二参数的 document 是修改前快照，可用于撤销栈和文件版本检查。组件不访问文件系统。

新增时，普通 `addAnnotation` 默认写外部标注；`{ target: 'source' }` 选择 Markdown 存储。启用原文编辑后，默认高亮动作写入源码；更新和删除遵循标注原来的存储位置。类型插件仍负责卡片和编辑器。源码坐标、拒绝写入、草稿取消和序列化规则见[标注与选区](annotations.md)及[模块修改原文](extensions.md#模块写回原文)。

[行内笔记](../../examples/inline-notes.tsx)与[阅读笔记](../../examples/notes.tsx)是可参考的应用插件。源码编辑在流式和不完整预览期间关闭；异步操作保留 revision，编辑后重新读取坐标。

## 全局译文模式

```tsx
import { useState } from 'react';
import { Reader, type TranslationMode } from '@linloir/limr';

export function BilingualArticle({ source }: { source: string }) {
  const [mode, setMode] = useState<TranslationMode | undefined>();
  return <Reader source={source}
    parameters={{ translationMode: mode, onTranslationModeChange: setMode }} />;
}
```

参数仅影响视图，不触发重解析。其他插件也可以注册自己的参数，见[扩展开发](extensions.md)。

`parameters.translationSelectionBoundary` 默认 `true`，限制浏览器选区跨过原文、译文区域边界，并按拖选结束的位置显示工具栏提示。它独立于展示模式，不限制已有标注、`addAnnotation` 或 `updateAnnotation` 的范围。同一语言区域内部仍可跨普通段落选择。需要恢复原有选区行为时显式关闭：

```tsx
<Reader source={source} parameters={{ translationSelectionBoundary: false }} />
```

提示可通过 `locale.translationSelectionHint` 自定义；内置中英文 locale 均提供默认文案。

## SSR 与客户端边界

交互组件放在宿主框架的客户端组件边界内（例如需要时在文件顶部使用 `'use client'`），由框架安排 SSR 和 hydration。不要在模块初始化时访问 window/document；保持服务端与客户端的 source、documentId 和初始配置一致。

同步 SSR 中，未加载公式输出源码回退。需要首次 HTML 包含完整 KaTeX 内容时，在服务器渲染前调用：

```tsx
import { renderToString } from 'react-dom/server';
import { Markdown, preloadMath } from '@linloir/limr';

export async function renderArticle(source: string) {
  await preloadMath();
  return renderToString(<Markdown source={source} documentId="server-article" />);
}
```

也可以使用 React 流式 SSR 处理 Suspense。Shiki 在客户端补充高亮，SSR HTML 仍包含代码文本。Mermaid 在服务器输出 loading，客户端完成绘图后淡入；KP 在客户端测量字体并排版，SSR 保留普通文本布局。`load` 标注请求在客户端显示卡片时发起；如需服务端已有内容，可预先放进 annotation.data。宿主仍需把 CSS 和字体资源放到页面能访问的位置。

## 已有插件与主题

从真实插件包导入工厂，在模块外或 useMemo 中创建稳定 plugins 数组，再传给 Reader。CSS 需要按插件说明显式导入；主题通过 appearance 选择，不是通过 plugins 传入。具体安装与本地 tgz 流程见[插件模块包](extensions.md#打包与接入)。

## 常见问题

| 现象 | 检查 |
| --- | --- |
| 布局没有样式 / 公式错位 | 是否导入 styles 或 base，以及 math.css |
| 加入插件后默认模块消失 | 是否把追加插件误传给 extensions |
| 编辑标注后数据不更新 | 是否在受控回调中回传新数组 |
| 正文、目录不同步 | Markdown 是否意外带 source 创建了第二个 Provider |
| 内部滚动定位错误 | scrollRoot 是否是真正滚动的 DOM 元素 |
| 浮层主题不一致 | 是否使用 data-limr-appearance 作用域覆盖 portal |
| 流式渲染反复全文解析 | 是否每次 render 重建 extensions/plugins，或存在全文 transform |

宿主回传 source 不会触发 onSourceChange，只有编辑命令会触发该回调。回传字符串与内部快照一致时直接复用快照，不重复解析；文件监听器读回相同内容也不会产生递归刷新。
