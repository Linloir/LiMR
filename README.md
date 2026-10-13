# LiMR

[![npm version](https://img.shields.io/npm/v/@linloir/limr.svg)](https://www.npmjs.com/package/@linloir/limr)

**简体中文** · [English](README.en.md)

**Linloir’s limr Is a Markdown Renderer.** 面向长文阅读和流式输出的 React Markdown 渲染器。正文、目录、引用卡片、选区和高亮共享文档状态，也可以拆开组合到自己的界面中。

[在线 Playground](https://linloir.github.io/LiMR/) · [中文文档](docs/zh-CN/README.md) · [English docs](docs/en/README.md) · [AI Skills](docs/zh-CN/ai-skills.md)

## 安装与使用

```sh
npm install @linloir/limr
# 或 pnpm add @linloir/limr
```

```tsx
import { Reader, chinese } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = '# 开始阅读\n\n支持 **Markdown** 与 $E = mc^2$。';

export default function Article() {
  return <Reader source={source} locale={chinese} />;
}
```

需要 React / React DOM **18.3 或 19**、Node.js **20+** 和支持 ESM 的构建工具。交互功能面向现代浏览器；支持 Node SSR。默认界面语言为英文，中文界面传入 `chinese`。`math.css` 在使用公式时引入。

只显示正文，或显示持续生成的回答：

```tsx
import { Markdown } from '@linloir/limr';

export function Answer({ text, generating }: { text: string; generating: boolean }) {
  return <Markdown source={text} streaming={generating} followOutput />;
}
```

`source` 是累计的完整字符串，生成结束时把 `streaming` 设为 `false`。`followOutput` 默认关闭；开启后在读者向上滚动时暂停跟随。`Markdown` 不自带目录、侧栏或选区工具栏。

## 支持什么

| 场景 | 能力 |
| --- | --- |
| 文档阅读 | CommonMark、GFM 表格/任务列表/脚注、数学公式、Shiki 代码高亮 |
| 富内容 | 图片与图组、图注、视频、释义、练习题、拓展阅读、引用、原文/译文/对照 |
| 阅读交互 | 响应式目录、桌面标注侧栏、窄屏浮层、复制、四种高亮样式 |
| 应用集成 | 受控标注、原始 UTF-16 坐标、多个独立阅读器、内部滚动容器、SSR |
| 扩展 | 自定义语法、React 渲染组件、标注类型、选区动作、参数与 CSS 主题包 |

默认内容标注类型是 `citation`；`highlight` 是内置持久高亮。笔记、提问和聊天标注由应用插件提供，`question()` 则是默认的练习题正文模块。完整写法见[语法手册](docs/zh-CN/syntax.md)。

```markdown
<definition title="定义">

在特殊区块中继续使用 **Markdown**。

</definition>

这段内容有参考来源<ref id="paper" />。

<citation id="paper" title="参考资料" url="https://example.com/paper" summary="简短摘要" />
```

## 组合与扩展

`Reader` 提供完整布局；自定义布局可用 `DocumentProvider` 组合 `Markdown`、`TableOfContents`、`AnnotationSidebar`、`AnnotationOverlay` 和 `SelectionToolbar`。详见[项目集成](docs/zh-CN/integration.md)。

```tsx
import { Reader, defineBlock } from '@linloir/limr';

const plugins = [defineBlock({
  name: 'notice',
  component: ({ children }) => <aside className="notice">{children}</aside>,
})];

export function Notice() {
  return <Reader source={'<notice>\n\n**自定义内容**\n\n</notice>'} plugins={plugins} />;
}
```

`plugins` 追加到默认扩展；`extensions` 替换整个扩展列表，`extensions={[]}` 使用基础 CommonMark。同名扩展使用 `replaceExtension()` 显式替换。配置应保持引用稳定。

插件可以拥有完整卡片 UI（`overlay.Card`）、侧栏摘要（`sidebar.Preview`）、异步加载和选区操作。使用 [AI 插件开发 Skill](skills/limr-plugin-development/SKILL.md) 或[独立插件包指南](docs/zh-CN/plugin-packages.md)创建可安装的包，再通过 `plugins` 引入。仓库提供[笔记](examples/notes.tsx)、[流式助手](examples/assistant.tsx)、[独立插件](examples/packages/reading-tools/index.js)和 [CSS 主题](examples/packages/paper-theme/index.css)示例；`@limr-example/*` 是未发布的本地示例包。

## AI Skills

| Skill | 用途 |
| --- | --- |
| [limr-use](skills/limr-use/SKILL.md) | 指导 AI 在项目中接入 LiMR、编写内容、配置交互和引入已有插件 |
| [limr-plugin-development](skills/limr-plugin-development/SKILL.md) | 指导 AI 开发独立模块包，附带 TypeScript / ESM / CSS 模板及验证步骤 |

Skills 随 npm 包分发，也可以从仓库下载。复制完整目录即可保留引用文件和模板；[下载、安装与调用说明](docs/zh-CN/ai-skills.md)包含 Codex 项目级与用户级配置。

## 样式与运行方式

- `styles.css` 包含默认浅色/深色样式和本地 Maple 代码字体；`styles/base.css` 提供相同样式但不加载 Maple。字体资产仍包含在 npm 包中。两者选一即可。
- `appearance` 为 CSS 主题提供作用域，也会传播到 portal 中的工具栏和浮层。正文中文字体由应用或系统提供。
- 代码高亮和公式按需加载。视频默认接近视口时加载，可以配置为点击加载；远程媒体仍可能访问其来源站点。
- 保留全文 DOM，支持浏览器查找、原生选择与打印。流式追加复用稳定区块，结束时完整解析；并非所有编辑都能局部解析。
- 未注册的 HTML 显示为原文，Markdown 中的 JavaScript 表达式不执行。自定义组件负责自己的数据和远程请求。

详见[样式与字体](docs/zh-CN/styles.md)、[API](docs/zh-CN/api.md)和[性能与限制](docs/zh-CN/performance.md)。

## 本地开发

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:docs
pnpm exec playwright install chromium
pnpm test:browser
```

本地开发需要 Python 3 生成 Skill 下载归档。标题栏可切换 Docs / Playground，Docs 由 LiMR 渲染，可切换语言。

本地 Playground 位于 `http://127.0.0.1:4173`。纯解析场景使用 `@linloir/limr/core`，不依赖 React/DOM；其他入口为 `@linloir/limr/react` 和 `@linloir/limr/extensions`。

[MIT License](LICENSE). Developed with Codex.
