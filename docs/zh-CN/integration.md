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

应用负责传输层，把每个片段追加到完整 `answer`；不要只把最后一个片段传给 source。最后一次更新必须传 `streaming={false}`，触发完整语义校正。followOutput 只在仍靠近底部时跟随，不会强行拉回正在阅读上文的用户。纯核心支持 `append(chunk)` / `finish()`，React props 使用累计字符串。

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

该片段展示单篇文章的状态。真实应用按文章 ID 加载/保存 annotations，并在切换文章时更换这一数组；React key 不会自动清空宿主状态。不传 annotations 时使用组件内部状态；传入后必须通过回调接收并回传编辑，否则编辑操作会报错。不可原地修改数组或 data。持久化范围与迁移规则见[标注与选区](annotations.md)。

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

也可以使用 React 流式 SSR 处理 Suspense。Shiki 在客户端补充高亮，SSR HTML 仍包含代码文本。`load` 标注请求在客户端显示卡片时发起；如需服务端已有内容，可预先放进 annotation.data。宿主仍需把 CSS 和字体资源放到页面能访问的位置。

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
