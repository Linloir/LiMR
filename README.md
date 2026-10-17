# LiMR

[![package version](https://img.shields.io/badge/version-1.3.3-blue.svg)](package.json)

**简体中文** · [English](README.en.md)

**Linloir’s limr Is a Markdown Renderer.** 

LiMR 是一个面向长文阅读和流式输出的 React Markdown 渲染器，提供开箱即用的优雅外观和丰富的自定义扩展能力。基础包支持丰富的自定义语法块、角标、侧栏旁注和自带的工具栏，并且支持流式追加、Knuth-Plass 快速排版等功能，并且可以通过编写模块插件的形式扩展渲染器的能力。

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

## 完整文件与加载进度

`AsyncReader` 接收完整 `input`（string、UTF-8 Uint8Array、Blob/File），配合宿主 Worker 工厂加载大文档。`loading.mode` 可选等待完整文档的 `blocking` 或提前阅读只读预览的 `progressive`；完整文档就绪后自动交接。使用 `loadingFallback={null}` 和 `onLoadStateChange(state, controls)`，即可把单一 `overallProgress`、取消和重试接入自己的工具栏或原生 UI。加载方式与正文 DOM 窗口分别配置。

详见[大文档接入](docs/zh-CN/large-documents.md)和[加载与内存性能](docs/zh-CN/loading-performance.md)：报告覆盖完整 50/75 MiB 输入、复杂内容、真实论文交互及峰值/空闲内存，保留默认功能并说明测量边界。

## 支持什么

| 场景 | 能力 |
| --- | --- |
| 文档阅读 | CommonMark、GFM 表格/任务列表、数学公式、Shiki 代码高亮、Mermaid 图表 |
| 富内容 | 图片与图组、图注、视频、释义、练习题、嵌套注释与 Obsidian callout、引用、原文/译文/对照 |
| 阅读交互 | 响应式目录、标注侧栏/窄屏浮层、完整原子内容复制、四种高亮样式、`==高亮==` 与脚注卡片 |
| 排版与流式 | 标准、Knuth–Plass、两端对齐；未闭合语法中间态、增量淡入和稳定选区 |
| 应用集成 | 受控标注、原始 UTF-16 坐标、多个独立阅读器、内部滚动容器、SSR |
| 扩展 | 自定义语法、按条件替换渲染组件、标注类型、选区动作、流式效果、参数与 CSS 主题包 |

默认模块包括引用、Markdown 脚注，以及 `::%%limr%%{<#id}文字::%%limr%%{>#id}` 与 `:::limr-annotation` 组成的内嵌标注。一个范围可绑定多条已注册类型的标注和一个高亮；独立引用只关联角标所在位置。`standard()` 提供通用解析与写回能力；显式传入 `onSourceChange` 后，默认工具栏高亮和任务勾选即可修改 Markdown，文件保存由宿主或接入模块负责。普通 `addAnnotation` 仍保存外部数据，模块通过 `target: 'source'` 选择原文存储。标注类型、卡片和专用动作由模块提供；Playground 的内联笔记与提问是示例插件，`question()` 则是练习题正文模块。见[语法手册](docs/zh-CN/syntax.md)和[本地文件集成](docs/zh-CN/integration.md#原文编辑与本地文件)。

```markdown
这里有::%%limr%%{<#passage}一段 **需要解释的文字**::%%limr%%{>#passage}。

:::limr-annotation{#note ranges="passage" type="footnote"}
这条标注的正文也支持 **Markdown**。
:::
```

开始和结束边界使用相同的范围 ID；只有完整的标注定义引用该 ID 时，边界才生效。范围可以跨格式、跨段落，也可以位于代码中；嵌套或交错的范围使用不同 ID。代码示例中的定义块不会激活边界。

```markdown
<definition title="定义">

在特殊区块中继续使用 **Markdown**。

</definition>

这段内容有参考来源<ref id="paper" />。

<citation id="paper" title="参考资料" url="https://example.com/paper" summary="简短摘要" />
```

默认正文组件支持对应的标签、`:::` 容器和成对 `::` 指令：例如 `::definition{title="定义"}` 与独立一行的 `::` 包围正文。Mermaid 使用 `mermaid` 代码围栏或 `::mermaid`，图像模式支持缩放、拖拽平移和键盘/滚轮移动。

## 排版与流式行为

表格默认使用内置自适应布局。1.3.1 起，`parameters={{ tableLayout: false }}` 可切换为浏览器原生布局，`tableLayout: { algorithm }` 可由宿主或插件替换布局计算函数；默认算法、测量与缓存保持不变。见[表格布局](docs/zh-CN/table-layout.md)。

`typography` 支持 `standard`（默认）、`knuth-plass`、`justify`。KP 使用 TeX 的 box/glue/penalty 段落优化和 Knuth–Liang 英文断词，缓存测量及断行准备结果，滚动保留已排版节点。浏览器字体测量与 TeX PDF 不保证逐像素相同；[KP 算法性能报告](docs/zh-CN/knuth-plass-performance.md)包含求解器、Scikit Learn 滚动/窗口变化与测量边界；[渲染器性能报告](docs/zh-CN/performance.md)对比 react-markdown 和 Markstream。

流式输出暂缓不完整的语法标记；默认模块可显示 loading，代码和公式可直接展示可用中间态。新增文字和特殊块只做透明度淡入，既有控件和选区保持稳定。插件可通过 `streaming.Loading`、`streaming.effect` 自定义行为，宿主可用 `streamEffect` 覆盖动画或设为 `false`。

公式、图表等原子内容按整体选择，选区工具栏复制保留原始源码和分隔符（包括行内公式两侧的 `$`）。单个块的工具栏位于块下方；复制反馈与按钮宽度使用非线性过渡。详见[标注与选区](docs/zh-CN/annotations.md)和[样式](docs/zh-CN/styles.md)。

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

只替换某类内容的呈现时，可用 `rendererOverrides` 的 `type`、`component` 和 `when`，按语言、祖先或流式状态限定范围；宿主规则优先。它是渲染范围约束，不是第三方代码安全沙箱。

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
- 代码高亮、公式、Mermaid 和 KP 按需加载。Mermaid 在客户端绘图，未闭合的流式图表先显示 loading。视频默认接近视口时加载，可以配置为点击加载；远程媒体仍可能访问其来源站点。
- 保留全文 DOM，支持浏览器查找、原生选择与打印。流式追加和可局部处理的收尾复用稳定前缀；定义变化、中间编辑或全文 transform 仍可能触发全文解析。
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

Playground 刷新后回到默认文档与标准排版，不自动恢复上次打开的文档或编辑。编辑后的“保存”写入本地草稿，可从“加载已保存文本”手动打开；语言偏好独立保留。排版菜单提供三种模式，流式演示每 90ms 增加最多 5 个 UTF-16 单元。

本地 Playground 位于 `http://127.0.0.1:4173`。纯解析场景使用 `@linloir/limr/core`，不依赖 React/DOM；其他入口为 `@linloir/limr/react` 和 `@linloir/limr/extensions`。

## 构建与发布 Pages

`main` 保存源码；`pages` 只保存构建产物。GitHub Pages 保持 **Deploy from a branch → pages → /(root)**。推送 `main` 会运行 [Deploy Playground](https://github.com/Linloir/LiMR/blob/main/.github/workflows/playground.yml)：检查源码与文档、构建站点、更新 `pages`，并显式请求 Pages 构建及核验线上源码版本；也可在 Actions 中手动运行。使用仓库自带的 `GITHUB_TOKEN`，无需额外部署密钥。

```sh
pnpm test:docs
pnpm build:playground
pnpm preview:playground --port 4174
# http://127.0.0.1:4174/LiMR/
```

构建输出 `demo-dist/`，包含 `.nojekyll`、双语 Docs、示例、当前版本的 Skill ZIP、`build-info.json` 和 `SHA256SUMS`。需要本地部署时，验证后将该目录内容同步到独立的 `pages` 工作树并推送。部署其他仓库名时需修改构建/预览的 `--base`。README 和文档以仓库实现为准；核对 npm 安装版本的导出和类型，必要时用 `pnpm pack` 消费当前源码。

[MIT License](LICENSE). Developed with Codex.
