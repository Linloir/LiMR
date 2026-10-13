# 快速开始

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/getting-started) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/getting-started.md)

## 安装

```sh
npm install @linloir/limr
```

宿主项目需要 React 和 React DOM 18.3 或 19。包是 ESM，Node.js 要求 20+；支持 Vite 等 ESM 构建工具。CSS 必须由应用显式导入。

## 完整阅读器

```tsx
import { Reader, chinese } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = `# LiMR

正文支持 **强调**、表格、代码和 $x^2$。

## 参考来源

阅读这段话<ref id="guide" />。

<citation id="guide" title="Guide" url="https://example.com/guide" />`;

export function Article() {
  return <Reader source={source} locale={chinese} theme="auto" />;
}
```

宽屏提供目录、正文和侧栏；容器宽度小于 `sidebarBreakpoint`（默认 1120px）时标注改用浮层。目录在窄屏以可折叠列表展示。

## 只需要正文

```tsx
import { Markdown } from '@linloir/limr';
import '@linloir/limr/styles/base.css';

export function Excerpt() {
  return <Markdown source="一段 **Markdown**。" />;
}
```

`Markdown` 可以独立使用，保留解析和选区能力，但不自动挂载工具栏。静态内容可设 `interactive={false}` 关闭选区监听。已经有 `DocumentProvider` 时，用不带 `source` 的 `<Markdown />` 共享文档。

## 选用样式

| 导入 | 内容 |
| --- | --- |
| `@linloir/limr/styles.css` | 默认主题、布局、交互和 Maple 代码字体 |
| `@linloir/limr/styles/base.css` | 相同样式，不引入 Maple 字体 CSS |
| `@linloir/limr/fonts.css` | 只引入 Maple，可与 base.css 分开使用 |
| `@linloir/limr/math.css` | KaTeX 样式与本地公式字体 |

`styles.css` 与 `styles/base.css` 选一个。选择 base 不会减少 npm 安装时包含的字体文件。中文正文使用宿主/系统字体，Playground 的 Noto Serif SC 并非组件默认加载项。

## 下一步

- 查看[默认语法](syntax.md)，区分内置正文模块与应用标注插件。
- 查看[项目集成](integration.md)，接入流式输出、滚动容器和 SSR。
- 需要 AI 协助接入时安装 [limr-use Skill](ai-skills.md)。
