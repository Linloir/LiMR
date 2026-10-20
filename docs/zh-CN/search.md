# 阅读搜索

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/search) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/search.md)

LiMR 1.3.11 提供可选的阅读搜索，支持字面文本、正则、区分大小写、源码定位和持续可见的命中高亮。搜索对象是阅读文字，包括尚未挂载的块；不会修改 Markdown、原生选区或持久化标注。

## 启用和体验

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';

export function Article({ source }: { source: string }) {
  return <Reader source={source} search />;
}
```

`Reader.search` 和 `AsyncReader.search` 默认为 `false`。传入 `true` 挂载默认组件，传入 React 节点则替换界面。默认组件在所属阅读器拥有交互焦点时处理 Ctrl/Cmd+F 和 F3；在搜索输入框中，Enter 跳到下一个，Shift+Enter 跳到上一个，Escape 关闭。没有启用搜索组件时保留浏览器搜索；浏览器搜索只能看到已挂载的 DOM。

在 Playground 点击工具栏的**搜索**按钮体验。Aa 切换大小写敏感，`.*` 切换正则。Playground 使用 `shortcuts={false}` 保留浏览器 Ctrl/Cmd+F；搜索框内部的 Enter 和 Escape 仍然有效。渐进加载文档须在完整加载后才能搜索。

## 脱离 Reader 独立组合

搜索是 React 界面能力，不是语法扩展，无需加入 `plugins` 或替换 `standard()`。

```tsx
import { DocumentProvider, Markdown, DocumentSearch, useDocumentSearch } from '@linloir/limr';
import '@linloir/limr/styles.css';

function SearchToolbar() {
  const controller = useDocumentSearch({ shortcuts: false });
  return <header>
    <button onClick={controller.show}>搜索</button>
    <DocumentSearch controller={controller} placement="inline" className="article-search" />
  </header>;
}
export function Article({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <SearchToolbar />
    <Markdown />
  </DocumentProvider>;
}
```

每个 Provider 挂载一个搜索控制器和一个主 Markdown。省略 `Markdown.source` 才会共享 Provider 的文档。也可把 `<SearchToolbar />` 传给 `Reader.search`。通过 React portal 可以把工具栏放到其他 DOM 容器并保留上下文，但需要给目标容器同时提供阅读器的 CSS 主题变量。

包根入口和 `/react` 导出 `DocumentSearchProps`、`UseDocumentSearchOptions`。

| 选项 | 默认值 | 含义 |
| --- | --- | --- |
| `shortcuts` | DocumentSearch 为 true，Hook 为 false | 处理所属阅读器的 Ctrl/Cmd+F 和 F3 |
| `defaultOpen` | false | 初始打开状态，不是受控属性 |
| `worker` | Blob Worker 工厂 | 稳定工厂，每个搜索会话创建新的 `SearchWorkerPort` |
| `controller` | 由 DocumentSearch 创建 | 复用 Hook 控制器，避免创建第二个 |
| `placement` | `"floating"` | `"inline"` 参与普通布局；floating 默认固定在右上角 |
| `className`、`style` | — | 默认组件的样式入口 |

传入 `controller` 时，请在 Hook 上配置 `shortcuts`、`defaultOpen` 和 `worker`；组件上的同名选项不会重新配置已有控制器。

## 完全替换界面

使用公开的 `DocumentSearchController` 构建自己的控件，扫描、取消、定位和高亮仍由 Hook 负责。

```tsx
import { useEffect, useRef } from 'react';
import { Reader, useDocumentSearch } from '@linloir/limr';

function CustomSearch() {
  const search = useDocumentSearch({ shortcuts: true });
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (search.open) input.current?.focus({ preventScroll: true });
  }, [search.open, search.focusRequest]);
  if (!search.open) return <button onClick={search.show}>搜索</button>;
  return <div role="search" aria-busy={search.busy}
    data-limr-selection-ui="true" data-limr-ignore="true"
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); search.close(); }
      if (event.key === 'Enter') { event.preventDefault(); event.shiftKey ? search.previous() : search.next(); }
    }}>
    <input ref={input} aria-label="搜索文档" value={search.query}
      aria-invalid={!!search.error} onChange={event => search.setQuery(event.target.value)} />
    <button aria-pressed={search.caseSensitive} onClick={() => search.setCaseSensitive(!search.caseSensitive)}>Aa</button>
    <button aria-pressed={search.regex} onClick={() => search.setRegex(!search.regex)}>.*</button>
    <span role="status">{search.current + 1}/{search.matches.length}{search.partial ? '+' : ''}</span>
    <button disabled={search.busy} onClick={search.previous}>上一个</button>
    <button disabled={search.busy} onClick={search.next}>下一个</button>
    <button onClick={search.close}>关闭</button>
    {search.loading && <span role="status">正在搜索…</span>}
    {search.error && <span role="alert">{search.error}</span>}
  </div>;
}
export function Article({ source }: { source: string }) {
  return <Reader source={source} search={<CustomSearch />} />;
}
```

自定义界面负责输入框聚焦、Escape/Enter、标签、禁用状态和动画。Hook 的 `shortcuts` 只处理 Ctrl/Cmd+F 和 F3。请把控件放在正文之外，或使用示例中的选区界面标记。

| 控制器成员 | 含义 |
| --- | --- |
| `open`、`show()`、`close()` | 打开并请求聚焦，或关闭；关闭取消待处理工作并清除搜索高亮 |
| `query`、`setQuery(string)` | 搜索内容，初始为空，输入防抖 90 ms |
| `regex`、`setRegex(boolean)` | 初始为 false；输入表达式本身，不带 `/…/flags` 分隔符 |
| `caseSensitive`、`setCaseSensitive(boolean)` | 初始为 false |
| `matches` | 只读 `SourceRange[]`，使用原始源码 UTF-16 偏移；自定义合成文字可能退回块范围 |
| `current` | 从 0 开始的当前命中下标，无结果时为 -1 |
| `partial` | 仍有未扫描文字，或达到 100,000 条结果上限 |
| `next()`、`previous()` | 导航并按需继续扫描；正在处理时不会排队保存新的导航请求 |
| `busy` | 正在扫描或导航，不包含输入防抖阶段 |
| `loading` | 延迟视觉状态：180 ms 后出现，出现后至少保留 1 s，busy 结束后也可能暂时为 true |
| `error` | 错误消息或 null；更换查询或选项会重新尝试 |
| `focusRequest` | 递增的聚焦请求，重复唤起已打开的搜索时也会改变 |

## 宿主快捷键

宿主命令使用 `useLiMR().find()`（默认打开），或 `.find('open' | 'next' | 'previous' | 'close')`。在同一个 Provider 内、控制器挂载后调用；此命令不会自动挂载界面，也不为未来的订阅者保存命令。渐进预览期间忽略打开命令。关闭时调用导航命令会打开搜索；结果准备好后可以继续导航。

`shortcuts` 从 LiMR 1.3.11 起就是核心公开参数。如果 VS Code 等宿主已经接管快捷键并通过 `find()` 转发命令，直接配置核心组件：

```tsx
import { DocumentSearch, Reader } from '@linloir/limr';

export function HostedArticle({ source }: { source: string }) {
  return <Reader source={source} search={<DocumentSearch shortcuts={false} />} />;
}
```

这会关闭核心对 Ctrl/Cmd+F、F3/Shift+F3 的监听，搜索按钮、公开 `find()` 命令和输入框内部的 Enter/Shift+Enter/Escape 仍正常工作。只保留一个快捷键处理方：VS Code Webview 即使收到 `defaultPrevented` 的事件也可能转发给宿主，同时启用两边的监听会让一次 F3 跳转两次。传入外部 `controller` 时，应在创建它的 `useDocumentSearch({ shortcuts: false })` 上配置。无需复制搜索实现或注入私有事件。

## Worker 与 CSP

搜索和文档加载使用不同的 Worker 协议。不要把 AsyncReader 的解析 Worker 传给 `DocumentSearch.worker`。默认搜索创建自包含 Blob Worker，无需网络导入；宿主应允许相应 Worker 来源，或提供静态 Worker。

例如，在构建时生成静态文件：

```js
import { mkdir, writeFile } from 'node:fs/promises';
import { searchWorkerSource } from '@linloir/limr/core';

await mkdir('public', { recursive: true });
await writeFile('public/limr-search-worker.js', searchWorkerSource);
```

然后用应用实际提供的 URL 配置稳定工厂：

```tsx
import { DocumentSearch, Reader } from '@linloir/limr';

const searchWorker = () => new Worker('/limr-search-worker.js');
export function Article({ source }: { source: string }) {
  return <Reader source={source} search={<DocumentSearch worker={searchWorker} />} />;
}
```

包根入口和 `/core` 导出 `SearchWorkerPort`，包含 `postMessage`、message/error 监听的注册与移除、`terminate`。每次工厂调用都返回新的端口，LiMR 负责终止它。升级 LiMR 后重新生成静态资源。SSR 不执行搜索 Worker；浏览器 Worker 失败会报告错误，不会回退到主线程执行任意正则。

## 匹配、限制与样式

正则采用 JavaScript Unicode 和多行语义，大小写由 Aa 控制。忽略零宽结果，每批正则执行超过 750 ms 会中断。表达式在阅读块内部匹配，不跨块拼接。超过 4 Mi UTF-16 单元的文档首次扫描阅读位置附近约 256 Ki 单元；手动上一个/下一个按需延伸搜索区间。计数带 `+` 表示结果不完整，单个不可拆的大块可能超出附近预算。投影、取消和边界见[大文档](large-documents.md#阅读搜索与复制)。

默认框体向左展开并淡入，内部内容保持最终位置并被框体裁切。Loading 在左侧增加一个图标位置，复用圆环动画；延迟显示和最短持续时间避免闪烁。输入焦点和选中选项不额外添加边框，按钮与计数使用柔和主题颜色，选中态使用标题色与次要色。减少动态效果设置会禁用运动。类名和 CSS 变量见[搜索样式](styles.md#搜索样式)。

[50/75 MiB 基准](../../benchmarks/search/README.md)在生产浏览器构建中记录附近搜索、继续扫描、缓存导航和主线程任务；它不替代安装后的 VS Code/Cursor 验收。`searchDocument()` 仍是对 Markdown 源码进行异步字面搜索的独立 API，不启用此阅读界面或正则能力。
