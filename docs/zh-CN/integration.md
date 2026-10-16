# 项目集成

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/integration) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/integration.md)

## 选择组件

用 `Reader` 获取完整阅读体验；用 `Markdown` 渲染独立正文；自己设计布局时让一个 `DocumentProvider` 管理一个主 `Markdown` 及其目录、卡片和工具栏。Provider 内再次传入 `source` 的 Markdown 会创建独立文档，不再共享父文档状态。

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

新增时，普通 `addAnnotation(annotation)` 仍写入 annotations；模块调用 `addAnnotation(annotation, { target: 'source' })` 选择原文存储。默认 highlightSelection 动作在原文可编辑时主动选择 source，否则创建外部高亮。修改/删除已有 annotation 根据其来源选择通路；侧栏、浮层和工具栏共用这些命令。类型模块管理编辑 UI 与草稿，提交时调用 updateAnnotation；源内数据经过默认或自定义的 sourceEditing.annotations 序列化，再触发 onSourceChange，外部数据则触发 onAnnotationsChange。原文事务被同步接受后，LiMR 立即更新内部文档；受控外部标注则等待宿主回传新的 annotations 数组后更新展示。

[内联笔记插件](../../examples/inline-notes.tsx)是 Playground 示例，**不在 standard() 中**。它仅提供标注类型、卡片和添加/修改动作，复用默认序列化器；[阅读笔记示例](../../examples/notes.tsx)提供 type="question" 的提问卡片。Playground 的「允许修改 Markdown」开关控制 onSourceChange；开启后，高亮、任务以及已安装模块的源内编辑同步到编辑框。类型模块的安装与编辑权限彼此独立，常规笔记仍保存为外部 annotations。

默认序列化器在首次修改样式时，将普通 `==高亮==` 转换为命名范围；删除最后一条注释会移除该范围的标记，保留正文。checkbox 只替换方括号内的字符，保留列表、缩进和换行。源内正文编辑器在离开编辑状态时提交，调整窗口造成侧栏/浮层切换会保留草稿。

公开的 editSourceAnnotations 序列化工具用成对 ID 边界保存文本、跨段、代码和零长度选区，支持嵌套、交错以及多条注释复用同一范围。格式标记可以在选区内开始或结束；切开实体、转义序列或 Unicode 代理对的边界仍会拒绝，不会改坏原文。添加定义前须闭合文末的代码/HTML 块；需要其他存储格式时由模块提供序列化处理器。已有普通 Markdown 脚注/引用继续按各自模块的编辑能力处理，不会被隐式转成另一种语法。源内定义与外部受控 annotations 可以并存，但应使用不同 ID；已存在的外部数据仍通过 onAnnotationsChange 更新。

流式输出期间禁用原文编辑。异步模块应记录 document.revision，在提交 editSource 时传入该 revision，避免把旧偏移写入新文本。更新完毕后从新的快照读取位置，不缓存 Annotation.source 中的旧坐标。完整接口见[API](api.md)和[扩展开发](extensions.md#模块写回原文)。

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

从真实插件包导入工厂，在模块外或 useMemo 中创建稳定 plugins 数组，再传给 Reader。CSS 需要按插件说明显式导入；主题通过 appearance 选择，不是通过 plugins 传入。具体安装与本地 tgz 流程见[插件模块包](plugin-packages.md)。

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
