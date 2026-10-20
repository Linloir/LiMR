# 快速开始

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/getting-started) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/getting-started.md)

## 安装

```sh
npm install @linloir/limr
```

宿主需要 React / React DOM 18.3 或 19、Node.js 20+，使用 Vite 等支持 ESM 的构建工具。CSS 由应用显式导入。

## 显示第一篇文章

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = `# LiMR

Read **Markdown**, $E=mc^2$, and this reference<ref id="guide" />.

| Feature | Description |
| --- | --- |
| Tables | Adaptive column widths and full-content previews |
| Code | Folding, wrapping and optional line numbers |

<citation id="guide" title="Guide" url="https://example.com/guide" />`;

export function Article() {
  return <Reader source={source} documentId="first-article" theme="auto" />;
}
```

宽屏默认显示目录、正文和标注侧栏；容器宽度低于 `sidebarBreakpoint`（默认 1120px）时，标注转为浮层卡片。窄屏目录可以折叠。`standard()` 默认模块已启用：公式、代码、图组、引用、Mermaid、Callout、高亮、脚注、双语内容均可直接写入源码。

**第一篇文章中的表格已经使用自适应布局**：列宽和行高按内容与容器宽度分配，必要时通过标注入口查看完整单元格；它独立于段落排版算法。长代码块默认折叠，可单独展开、换行和复制。完整写法见[语法手册](syntax.md)，表格策略见[表格布局](table-layout.md)。

## 选择适合的入口

| 输入 / 场景 | 使用方式 |
| --- | --- |
| 已经拿到字符串的普通文章 | `Reader source={source}` |
| 完整的大文件、Blob、UTF-8 字节或长字符串 | `AsyncReader input={input}` + Worker，见下一节 |
| 聊天流、逐步生成的回答 | `Markdown` 或 `Reader`，传累计 source，生成时 streaming=true，结束时 false |
| 页面里的短片段 | `Markdown source={source}`；只需静态内容时设 interactive=false |
| 自定义目录、正文和标注布局 | 一个 `DocumentProvider` 中组合 `<Markdown />` 与其他视图 |

`Markdown` 不自动挂载工具栏。Provider 内的主 Markdown 应省略 source 才会共享文档。Reader/Markdown 的 `source` 字符串入口不会自动在 Worker 中解析；完整大文件使用 AsyncReader。

## 加载大文档

以下是 Vite 风格的文件选择示例。让文件和 Worker 工厂保持稳定，不要在进度更新时重新创建它们。

```tsx
import { useState } from 'react';
import { AsyncReader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const loading = {
  mode: 'blocking' as const,
  worker: () => new Worker(new URL('./limr-worker.ts', import.meta.url), {
    type: 'module',
  }),
  fallback: 'error' as const,
};

export function FileReader() {
  const [file, setFile] = useState<File | null>(null);
  return <>
    <input type="file" accept=".md,.markdown,text/markdown"
      onChange={event => setFile(event.target.files?.[0] ?? null)} />
    {file && <AsyncReader input={file} loading={loading} />}
  </>;
}
```

在组件旁创建 `limr-worker.ts`：

```ts
import '@linloir/limr/worker';
```

这个例子使用内置加载卡片，提供总体进度、取消和重试。`blocking` 等完整解析和索引后展示；`progressive` 可以更早展示只读且不完整的预览。两种模式都可用 Worker，最终都保留完整源码和 AST。示例用 `fallback: 'error'` 显式报告 Worker 不可用；省略时默认可回退到主线程。

AsyncReader 按文档规模自动选择窗口化正文，减少屏幕外 DOM；它不意味着只解析当前屏幕，也不会让内存与文件大小无关。宿主有自己的进度条时，用 `onLoadStateChange(state, controls)` 和 `loadingFallback={null}`。构建工具、CSP 和 Worker 地址由宿主负责。完整的进度、窗口化回退、书签、打印和自定义 Worker 契约见[大文档](large-documents.md)。

## 调整阅读策略

常用显示选项通过参数设置，不必替换默认渲染器：

```tsx
import { Reader } from '@linloir/limr';

export function ConfiguredReader({ source }: { source: string }) {
  return <Reader source={source}
    parameters={{
      tableLayout: { maxColumnWidth: 720 },
      codeBlock: {
        autoCollapse: true, collapseAfterLines: 20, collapsedLines: 8,
        wrap: false, lineNumbers: true,
      },
    }} />;
}
```

| 需求 | 配置 / 默认行为 |
| --- | --- |
| 普通或密集表格 | 不设 tableLayout，保留内置自适应布局和完整内容入口 |
| 希望由浏览器决定表格宽高 | `tableLayout: false`；保留表格语法和横向滚动，关闭测量与溢出预览 |
| 自定义表格算法 | `tableLayout: { algorithm }`，保留测量、缓存和预览，见[算法契约](table-layout.md) |
| 长代码默认展开 | `codeBlock.autoCollapse: false`；长块仍保留手动折叠按钮 |
| 代码默认自动换行 | `codeBlock.wrap: true`；默认 false，每块均可切换 |
| 主动限制展开代码的高度 | `codeBlock.maxExpandedLines: 40`；默认 `false` 完整展开并跟随文档滚动 |
| 显示代码行号 | `codeBlock.lineNumbers: true`；默认 false，行号不进入选区或复制 |
| 论文段落优化 / 浏览器两端对齐 | `typography="knuth-plass"` / `"justify"`；默认 `"standard"` |

代码超过 20 行源码或换行后的可见行时，默认折叠至 8 行，底栏显示折叠行数与总行数并配合展开/收起动画。展开后跟随页面滚动，不出现内部竖向滚动条；巨型代码仍采用分段延迟排版，单个大代码块不会关闭整篇书的窗口化。用户的折叠和换行选择仅保存在当前阅读器，最多缓存 256 个已修改的块，支持离屏卸载后恢复，不写 Markdown；打印展开完整内容。超宽且不可拆分的行内公式局部滚动。参数和插件默认值的优先级见[代码块控制](syntax.md#代码块控制)；表格、段落排版和代码选项彼此独立。

## 选样式与保存方式

| 导入 | 内容 |
| --- | --- |
| `@linloir/limr/styles.css` | 默认主题、布局、交互和 Maple 代码字体 |
| `@linloir/limr/styles/base.css` | 相同基础样式，不导入 Maple 字体 |
| `@linloir/limr/fonts.css` | 单独导入 Maple，通常与 base.css 配合 |
| `@linloir/limr/math.css` | KaTeX 样式和本地公式字体 |

styles.css 与 base.css 二选一，使用公式时额外导入 math.css。正文字体来自宿主/系统；Playground 的 Noto Serif SC 不会被库自动加载。主题使用 `appearance` 与作用于 portal 的 CSS，见[样式与字体](styles.md)。

阅读器不会自动保存文件。外部标注由 `annotations/onAnnotationsChange` 管理；要允许任务勾选、源码高亮和模块编辑，提供 `onSourceChange` 并同步接受内存编辑，再由宿主排队保存。文件切换使用稳定文档 ID 和新的 React key。可复制的持久化、流式、滚动容器和 SSR 示例见[项目集成](integration.md)。

## 下一步

- 编写内容：[语法手册](syntax.md)，从 CommonMark 到图片、译文和源码标注。
- 选择接入方案：[项目集成](integration.md)、[大文档](large-documents.md)、[表格布局](table-layout.md)。
- 二次开发：[扩展开发](extensions.md)说明何时用参数、CSS、组件或插件，并包含完整打包流程。
- AI 协助：[AI Skills](ai-skills.md)，消费者使用 limr-use，插件作者使用 limr-plugin-development。
