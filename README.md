# LiMR

**Linloir’s limr Is a Markdown Renderer.**

一个可以独立使用，也可以组合成完整阅读界面的 React Markdown 渲染包。正文、目录、角注和选区使用同一份文档状态，面向长文阅读和 AI 流式输出。

## 使用

```sh
pnpm add @linloir/limr
```

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css'; // 使用公式时导入；字体随包提供

<Reader source={markdown} />
```

需要 React 18.3 / 19、现代浏览器和支持 ESM 的构建工具。npm 包名为 `@linloir/limr`；源码可用 `pnpm pack` 构建并生成本地安装包。

只显示正文：

```tsx
import { Markdown } from '@linloir/limr';

<Markdown source={markdown} />
// source 是持续增长的完整字符串；生成结束时设为 false。
<Markdown source={answer} streaming={generating} followOutput />
```

`followOutput` 默认关闭。开启后只在用户保持在底部附近时跟随输出。用户向上阅读时暂停跟随。

## 组件

| 组件 | 职责 |
| --- | --- |
| `Markdown` | 正文、原文坐标、标题和选区信息；不包含工具菜单 |
| `DocumentProvider` | 给组合组件提供同一份文档和交互状态 |
| `Reader` | 开箱即用的响应式组合，窄屏自动使用角注浮层 |
| `TableOfContents` | 固定标题、自动换行、隐藏滚动条、跟随 active 项 |
| `AnnotationSidebar` | 与正文角标对齐的卡片、避让、独立列表或自定义定位 |
| `AnnotationOverlay` | 鼠标预览、点击/触摸展开、键盘退出和焦点恢复 |
| `SelectionToolbar` | 独立的选区操作和自定义 UI 槽位 |
| `AnnotationMarkdown` | 在卡片内复用渲染能力，隔离文档和选区作用域 |

例如，在自己的三栏布局里组合：

```tsx
<DocumentProvider source={markdown}>
  <div className="reading-columns">
    <TableOfContents />
    <Markdown />
    <AnnotationSidebar />
  </div>
  <AnnotationOverlay />
  <SelectionToolbar actions={actions} />
</DocumentProvider>
```

`reading-columns` 的样式由应用提供。对齐侧栏和正文应位于**同一个滚动容器**，侧栏保持正常文档流中的相对定位。窗口滚动无需配置；内部滚动容器用 `scrollRoot={element}` 指定。常规布局直接用 `Reader` 即可。详见 [组合和布局约定](docs/api.md#布局和定位)。

## 默认能力与扩展

默认包含 GFM、公式、代码高亮、响应式图片/图组与图注、视频、释义、问题正文区块、拓展阅读、ref 引用和分段译文。每一种特殊语法都是使用公开接口实现的独立模块。`translations` 支持原文、译文与对照，可通过 `parameters.translationMode` 统一控制；[图组与译文语法](docs/extensions.md#图片与论文图组)包含完整示例。

**默认角注只有 citation/ref；高亮单独提供。** 提问、注记、聊天等应用角注由插件注册。`question()` 是问题正文区块，与问答角注无关。

```tsx
import { standard, defineBlock, replaceExtension, codeHighlight } from '@linloir/limr';

const extensions = [
  ...replaceExtension(standard(), codeHighlight({ languages: ['typescript', 'python'] })),
  defineBlock({
    name: 'notice',
    component: ({ children }) => <aside className="notice">{children}</aside>,
  }),
];

<Reader source={'<notice>\n\n**自定义内容**\n\n</notice>'} extensions={extensions} />
```

同一模块也支持 `:::notice` 指令语法。`extensions` 是完整的扩展列表；传入 `[]` 得到基础 CommonMark。可以用 `.filter()` 移除默认模块，或 `replaceExtension()` 替换同名模块。保持配置引用稳定，例如在模块外定义或使用 `useMemo`。

安装第三方扩展时，用 `plugins` **追加**到默认模块；样式包通过 CSS 导入和 `appearance` 选择：

```tsx
import { readingTools } from '@limr-example/reading-tools';
import '@linloir/limr/styles.css';
import '@limr-example/paper-theme';

const plugins = [readingTools()];
<Reader source={markdown} plugins={plugins} appearance="paper" />
```

这里的两个 `@limr-example` 包是仓库内的可打包示例，尚未发布。实际社区包可以使用同样的结构。见 [扩展打包](docs/extensions.md#作为独立包分发) 和 [样式指南](docs/styles.md)。

常用标签：

```markdown
<definition title="定义">

支持 **Markdown** 的内容。

</definition>

引用一段文字<ref id="paper" />。

<citation id="paper" title="论文" url="https://example.com" description="支持 **富文本** 描述。" />
```

也支持 `cite-id`、`cite-from-ids`、`desc` 等原有属性。未知 HTML 按原文显示，标签中的 JavaScript 表达式不执行。更多模块和 parser 接口见 [扩展指南](docs/extensions.md)。

## 高亮、选区和应用插件

```tsx
import { Reader, copyText, highlightPalette, highlightSelection, deleteAnnotations, chinese } from '@linloir/limr';

const actions = [
  highlightPalette(),
  highlightSelection(),
  copyText({ label: '复制文字' }),
  copyText({ label: '复制 Markdown', format: 'syntax' }),
  deleteAnnotations(),
];

<Reader source={markdown} locale={chinese} actions={actions} />
```

工具菜单默认提供色块、高亮、复制和删除。悬浮左侧色块可调整颜色与样式，添加高亮直接生效；同一文本片段可以同时拥有高亮、旁注、提问等多个 annotation。高亮统一存为 `type: 'highlight'` 的 annotation，通过 `annotations` / `onAnnotationsChange` 管理。右侧删除操作移除该片段关联的所有 annotation，隐藏高亮则保留注释。上面的 `actions` 可替换默认列表。

选区同时提供 `raw`、`syntax`、`blocks` 三种结果，所有范围都指向**未经改写的原始输入**，使用 UTF-16 偏移、右端不包含。`quality` 区分精确映射、公式等原子节点和无法精确映射的内容。默认高亮和脚注使用 `syntax`，仅吸附选区两端紧邻的标准 Markdown 标记，不扩大未选中的文字，也不吸附特殊块的外层标签。行内及围栏代码支持部分选择、高亮与角标；公式保持整体选择。

插件可以在一个 `defineExtension()` 中提供 `actions`、`annotationTypes` 和语法模块。动作拿到选区、文档、`addAnnotation` / `updateAnnotation` / `activateAnnotation` 等命令和取消信号。卡片可以使用任意 React 组件，也可以用 `AnnotationMarkdown` 持续渲染 Markdown 回答。

[助手插件](examples/assistant.tsx) 和 [旁注编辑插件](examples/notes.tsx) 演示了这条路径。运行 `pnpm dev` 后即可在同一 playground 页面选中文字，使用问答、旁注、笔记、提问和脚注；新注释会直接进入桌面侧栏或手机卡片的编辑态。顶部“编辑／保存”切换写作与阅读，返回阅读时保存文本与注释到浏览器。“加载”包含全部预设、已保存文本与文件导入导出，“插件”下拉菜单支持多选。预设包含 Express / Axios README、文学作品及 scikit-learn 原论文的 Markdown 转写，来源与许可随文本保留。流式演示始终使用当前文本，主题切换独立保留。问答示例使用本地模拟传输；实际 Codex 连接、认证、会话管理由应用适配器实现，LiMR 不预设服务端协议。

## 渲染与资源

- 流式追加会重新解析尚未稳定的末尾区块，复用前面的区块；后到的引用定义会触发完整语义校正。结束时进行最终完整解析。
- 自定义 transform 默认按全文处理。只有声明 `scope: 'local'` 且满足局部性约定的模块才参与尾部增量解析。
- 代码高亮接近视口时加载 Shiki、所需语言和主题；流式代码暂停更新后才重新高亮。公式按需加载 KaTeX。视频点击播放前不请求播放器。
- 角注数据在卡片显示时才加载，同一阅读器内请求复用、取消和有限缓存；不同阅读器资源隔离。
- 不注入第三方 CDN。默认样式附带本地 Maple Mono NF CN 代码字体，按字形范围加载 WOFF2 子集，加载前使用系统等宽字体。正文衬线字体使用应用/系统回退，Playground 自行提供 Noto Serif SC。可使用不带字体的 `@linloir/limr/styles/base.css`。缓存和覆盖方式见 [样式指南](docs/styles.md)。
- 默认保留完整 DOM，支持原生查找、选择和打印；不使用会破坏这些行为的默认虚拟列表。

SSR 支持 Node 环境。`renderToString` 中未加载的公式先输出源码回退；如需首次 HTML 包含完整公式，先 `await preloadMath()`，或者使用 React 流式 SSR。Shiki 高亮在客户端补充，代码文本会直接出现在 SSR HTML 中。使用 Next.js 等区分服务端/客户端组件的框架时，在应用的客户端边界内导入这些交互组件。

[性能测量](docs/performance.md) 包含数据、等价功能配置和限制。数据针对固定硬件和夹具，不代表所有 Markdown、插件或设备。

## 开发

[在线 Playground](https://linloir.github.io/LiMR/)

```sh
pnpm install
pnpm dev
pnpm check
pnpm exec playwright install chromium
pnpm test:browser
NODE_ENV=production pnpm bench
```

### npm 发布

`pnpm test:package` 会构建并打包当前版本，在独立的 React 18/19 项目中验证类型、SSR、浏览器交互及样式资源，然后将通过验证的安装包保存到 `artifacts/`。

```sh
pnpm check
pnpm test:package
npm login --auth-type=web --registry=https://registry.npmjs.org
npm publish ./artifacts/linloir-limr-0.1.0.tgz --access public --registry=https://registry.npmjs.org
```

发布账号需要拥有 `@linloir` scope 的权限并完成 npm 要求的双重认证。后续发布先更新 `package.json` 的版本，再重新打包，并将命令中的文件名替换为新版本。

### GitHub Pages 预览

`main` 保存源码，独立的 `pages` 分支保存 Playground 构建后的静态产物，通过 SSH 推送到 GitHub。`pages` 分支由构建生成，无需手工合并源码。预览地址为 <https://linloir.github.io/LiMR/>。

首次部署在仓库 **Settings → Pages → Build and deployment** 中设置 **Source: Deploy from a branch**、**Branch: pages**、目录 **/(root)**，然后保存。后续推送 `pages` 分支会更新站点。

本地检查与线上相同的 `/LiMR/` 路径：

```sh
pnpm build:playground
pnpm preview:playground
# 打开 http://127.0.0.1:4173/LiMR/
```

构建输出为 `demo-dist/`，包含跳过 Jekyll 处理的 `.nojekyll` 文件。更新预览时，重新构建并将该目录的内容提交、推送到 `pages` 分支。`pnpm dev` 仍使用本地根路径。部署到其他仓库名时，需要同步修改两个 Playground 脚本中的 `--base`。

其他入口：`@linloir/limr/core`（无 React/DOM 运行时依赖）、`@linloir/limr/react`、`@linloir/limr/extensions`。详细 props、hooks、受控状态和主题配置见 [API 指南](docs/api.md)。

MIT License.

Developed with Codex.
