# 扩展开发

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/extensions) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/extensions.md)

第一次接触模块时，先阅读[内置模块](integration.md#模块与配置)：那里解释模块对象、创建函数、模块名、Markdown 标签，以及 `extensions` 和 `plugins` 的区别。

## 选择接口

| 需求 | 接口 |
| --- | --- |
| 一个带 Markdown 正文的新区块 | defineBlock |
| 一种独立标注类型 | defineAnnotation |
| 组合语法、标注、动作和参数 | defineExtension / RendererExtension |
| 改写已有节点外观或只替换满足条件的节点 | components / rendererOverrides |
| 关闭或替换表格布局计算 | parameters.tableLayout：false 或 { algorithm }，见[表格布局](table-layout.md) |
| 代码块折叠、换行和行号默认值 | parameters.codeBlock / codeHighlight(options)，见[代码块控制](syntax.md#代码块控制) |
| 可复用搜索界面或搜索主题 | DocumentSearch / useDocumentSearch + Reader.search，见[阅读搜索](search.md) |
| 新的解析规则 | micromark + mdast 扩展，必要时 transform |
| 仅修改视觉 | CSS 主题包 + appearance |

所有接口从 `@linloir/limr` 公开导出。第三方包不要导入 src、dist 内部路径或 useRuntime 等未公开接口。完整独立模板见[插件模块包](extensions.md#打包与接入)。

推荐顺序：先检查已有参数与 CSS 变量，再选择 components / rendererOverrides 改视图；只有需要新内容形式、共享业务卡片或动作时才写插件。把可复用能力导出为工厂，宿主保留文件、服务和状态持久化。一个仅提供 `parameters.codeBlock` 的插件也使用 RendererExtension，既不需要新增解析器，也不需要 Worker 注册。

## 追加、删除与替换默认模块

```tsx
import { Reader, standard, replaceExtension, video, defineBlock } from '@linloir/limr';

const extensions = replaceExtension(standard(), video({ loading: 'click' }));
const plugins = [defineBlock({
  name: 'reading-tip',
  component: ({ children }) => <aside className="reading-tip">{children}</aside>,
})];

export function Article({ source }: { source: string }) {
  return <Reader source={source} extensions={extensions} plugins={plugins} />;
}
```

只移除模块可 filter 它的 name。扩展名、注册标签名和指令名各自必须唯一，重复会报错；不要用 plugins 再追加一份 citation 或 video。`replaceExtension` 替换同名项，不存在时追加。保留配置引用，避免流式渲染期间反复重建解析器。

## 自定义正文区块

```tsx
import { defineBlock } from '@linloir/limr';

export const notice = defineBlock({
  name: 'notice',
  component: ({ children, renderAttribute }) => <aside className="notice">
    <header>{renderAttribute('title')}</header>
    {children}
  </aside>,
});
```

支持 `<notice title="提示">…</notice>`、配对的 `::notice{title="提示"}` / `::`，以及 `:::` 容器。name 默认同时成为标签名和指令名，可通过 tags / directives 自定义。defineBlock 默认 display: block、selection: content、scope: local。

| NodeRendererProps | 用法 |
| --- | --- |
| node | 当前 AST 节点和静态属性 |
| children | 已经渲染好的子树；优先复用 |
| source | **当前节点**对应的源码片段，不是全文 |
| pending | 所属尾块是否仍在流式生成 |
| incomplete | 当前语法节点是否尚未闭合 |
| renderChildren(nodes, { trailing? }) | 重排已有子树，可在末尾注入纯操作角标 |
| renderValue(tokens?, { lines?, chunked? }) | 渲染字面量及高亮 token，保留原文选择和标注插入 |
| renderAttribute(name) | 显示属性文本并保留原文坐标 |

不要把 children 转字符串再解析，也不要仅输出 node.value 导致源码映射丢失。无法逐字对应的图表/媒体用 selection: atomic；需要指定可视边界时使用 data-limr-selection-surface。纯操作角标可以使用公开 InlineMarker，不必建立 Annotation。

内置代码块的折叠、换行和行号优先使用 `parameters.codeBlock`，无需重写渲染器；见[代码块控制](syntax.md#代码块控制)。自定义代码渲染器可用 `renderValue(tokens, { lines: true })` 输出保留源码映射的逐行容器；容器保留真实换行，行号由 CSS 绘制，不进入复制文本。超大字面量可另传 `{ chunked: true }`：保留源码文字 DOM，延迟屏外排版与逐行装饰。自定义渲染器仍负责容器、控件与窗口化契约；替换组件不会继承内置巨型代码的能力证明。

## 标注卡片由插件拥有

```tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon, useLiMR, useLocale,
  type AnnotationContentProps } from '@linloir/limr';

function NoteContent({ annotation, data, loading, error, retry }: AnnotationContentProps<{ text: string }>) {
  const commands = useLiMR(), locale = useLocale();
  return <>
    {loading ? <p>Loading…</p> : error ? <button onClick={retry}>Retry</button>
      : <AnnotationMarkdown source={data?.text ?? ''} />}
    {commands.canEditAnnotation(annotation.id) && <div className="limr-annotation-actions">
      <button type="button" className="limr-annotation-delete" onClick={() => commands.removeAnnotation(annotation.id)}>
        <ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span>
      </button>
    </div>}
  </>;
}

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: NoteContent,
  sidebar: {
    Preview: ({ data }) => data?.text ? <span>{data.text}</span> : null,
    previewLines: 2,
  },
  overlay: {
    Card: props => <AnnotationCard {...props} title="Note" />,
    previewWidth: 320,
    expand: { placement: 'center', width: 640, maxHeight: '80dvh' },
  },
});
```

Content 处理 presentation（preview / expanded / sidebar）、editing、data 和资源状态。overlay.Card 拥有标题、正文和操作，可复用 AnnotationCard 或完全自绘；children 是共享加载状态的内容。LiMR 管理定位、portal、焦点、动画和退出生命周期。不要用通用标题覆盖插件自己的语义。

expand 必须显式配置；默认不展开。placement 支持 anchor / center，尺寸为像素或 CSS 长度，也可按 annotation 返回策略。sidebar.Preview 只读本地 data；不要在摘要触发网络请求。Preview: false 或返回 null 隐藏摘要。同一 occurrence 的首个类型负责卡片外观和分组摘要，可通过 annotations 获取组内数据。

sidebar 支持 previewLines、previewColor、color、borderColor、titleColor、textColor、excerptColor 和 collapseOnContentClick。内容根节点无需重复添加卡片 padding；复用共享 `--limr-sidebar-padding-inline`，处理内部段落间距即可。

## 选区动作

```tsx
import { defineExtension, ToolIcon } from '@linloir/limr';

export const savePassage = defineExtension({
  name: 'example:save-passage',
  actions: [{
    id: 'example:save-passage', label: 'Save passage', icon: <ToolIcon name="note" />,
    visible: ({ selection }) => selection.settled && selection.quality !== 'unmapped',
    run(context) {
      const id = `example-note-${crypto.randomUUID()}`;
      context.addAnnotation({
        id, type: 'example:note', data: { text: context.selection.text },
        anchors: context.selection.syntax.ranges.map(range => ({
          range, documentId: context.document.id,
          quote: context.document.source.slice(range.start, range.end),
        })),
      });
      context.activateAnnotation(id);
      context.clearSelection();
    },
  }],
});
```

与上面的 note 扩展一起安装。SelectionAction 必须有 id、label、icon，可提供 visible、disabled、run、onHover、renderExpanded 或 render。面板操作通过 context.run 使用工具栏的 busy/error 处理。上下文包含选区、完整文档快照、同片段 annotations/highlight、locale、取消信号与命令。动作 ID 冲突时后者覆盖；宿主显式 actions 的同 ID 项最终优先。

## 模块写回原文

模块无需引入第二套编辑组件或文件 API。`useLiMR()` 和选区动作 context 都能调用 `editSource([{ range, text }], { revision })`；先用 `canEditSource()` 检查宿主是否启用能力。坐标为当前原文 UTF-16 偏移，整个事务都相对同一个 revision，校验完成后才会调用宿主的 onSourceChange。默认任务渲染器使用这一能力，仅修改勾选字符。

标注继续使用 addAnnotation / updateAnnotation / removeAnnotation / removeAnnotationsAt。普通 addAnnotation 保存外部数据；`{ target: 'source' }` 选择原文，默认高亮动作会在可编辑时选择该目标。standard 中的 sourceAnnotations 已提供通用序列化器；需要自定义格式时，模块可通过 `RendererExtension.sourceEditing.annotations(change, document)` 覆盖这些命令的序列化。change 为 `{ added, updated: [{ previous, annotation }], removed }`；返回一组 SourceEdit 原子处理整次命令，undefined 表示交给较早注册的处理器。后注册插件可覆盖较早注册的序列化器；处理器应为纯函数，不自行写文件或调用回调。读取 previous.source 可以定位原有定义，包括重复 ID 的全部定义，避免删除后旧定义重新出现。

默认公开序列化器 editSourceAnnotations 写入成对的 `::%%limr%%{<#id}` / `::%%limr%%{>#id}` 边界与 `:::limr-annotation` 定义，支持 `{ body: string, ...标量属性 }`，内嵌 highlight 使用 color/style/hidden；仅提供这种数据的类型插件无需重复安装序列化器。sourceAnnotations 不注册特定内容类型或提问卡片。自定义复杂数据应提供自己的处理器；内置处理器会拒绝无法无损表达的数据。编辑 UI 仍由类型的 Content 负责，可用 canEditAnnotation(id) 判断可编辑性、editAnnotation(id) 共享编辑状态；updateAnnotation 接受保存的数据后调用 commitAnnotationEdit(id)。显式取消调用 cancelAnnotationEdit(id)：新建注释及本次同时创建的高亮会被移除，已有或被其他注释共用的高亮保留。取消修改已有注释时保留已保存内容，插件先恢复或丢弃自己的草稿。updateAnnotation 或 cancelAnnotationEdit 返回 false 表示宿主拒绝修改，应保留草稿和编辑状态。已有外部 annotations 不会因开启 source 编辑而被迁移。

公开组件 `AnnotationEditor` 提供无边框、随内容和宽度自动增高的受控输入，以及取消/提交按钮。调用者管理 value、草稿、保存和撤销，通过 onChange/onSubmit/onCancel 接收操作；可选 onBlur 只在焦点离开整个编辑器容器时触发，切到内部按钮不会触发。配套笔记编辑器会在空白新草稿失焦时取消创建，包括尚未输入就点击外部。取消会删除新建标注及本次同时创建、没有其他引用的高亮，已有或共享高亮保留。源内正文编辑器在失焦时保存其他草稿修改；普通阅读笔记将其保留到提交。当前标注处于编辑状态时隐藏选区工具栏。Escape 取消，Ctrl/Cmd+Enter 提交，输入法组字期间不拦截这些按键。普通阅读笔记示例与源内正文编辑器共同复用此 UI，各自保留状态和持久化策略；组件本身不保存标注或访问文件。插件操作区统一使用靠右的 limr-annotation-actions 容器，在 canEditAnnotation(id) 允许修改时提供单条删除。源内编辑器、阅读笔记、助手和引用模块均保留这一能力边界；没有源码序列化器的原文格式仍为只读。

原文编辑可否进行与文件是否保存成功是两件事；宿主同步接受修改并负责保存队列、撤销、错误与冲突 UI。详见[本地文件集成](integration.md#原文编辑与本地文件)。

## 参数

```tsx
import { defineExtension, useRendererParameter } from '@linloir/limr';

declare module '@linloir/limr' {
  interface RendererParameters { exampleDetail?: 'short' | 'full' }
}

export const glossary = defineExtension({
  name: 'example:glossary', tags: ['glossary'], scope: 'local',
  parameters: { exampleDetail: 'short' },
  components: {
    glossary: ({ children }) => <aside data-detail={useRendererParameter('exampleDetail')}>
      {children}
    </aside>,
  },
});
```

宿主传 `parameters={{ exampleDetail: 'full' }}` 覆盖默认值。参数变更只更新视图，不解析源文；相同参数后注册默认值优先。独立包需要让声明合并出现在导出的 .d.ts 中。

## 解析与流式约束

SyntaxExtension 支持 micromark、mdast、tags、directives、display、selection、literal、preprocess、transform 和 scope。transform 默认全文作用域；仅依赖当前局部子树、不会回写前文或读取全局文档语义时才声明 scope: local。context.source 仍是原始全文，position 必须保持原始 UTF-16 坐标。插件不要先用正则替换 source 再解析。

`preprocess(context, extensions)` 在 Markdown 分词前返回需要省略的源码区间；每个区间使用原始全文的 UTF-16 坐标，必须位于文档内且互不重叠。引擎负责省略与坐标还原，并通过 `context.sourceOmissions`、`node.sourceOmissions` 保留映射信息。`sourceAnnotations()` 用它解析跨段和代码中的成对边界。省略区间发生变化会触发全文重解析；只有在确实需要跨越 Markdown 语法边界时才使用此接口。

未知特殊标签安全显示整段原文，内部 Markdown 也作为原文显示。默认配置的未知指令则渲染内部 Markdown，丢弃指令外层标记；未安装任何指令扩展时按基础 Markdown 解析。移除模块后，使用剩余语法能力重新解析未改写的原文。未注册标注类型保留数据，但不显示角标、卡片或编辑界面；重新安装模块后恢复。选区操作和持久化行为见[标注与选区](annotations.md#缺少插件时)。已注册的未闭合标签和容器携带 node.incomplete，之后追加继续恢复；半截头部暂缓显示或交由模块展示 loading；无效 JSX 仍可能回退并记录 diagnostics；结束必须 finish 或 streaming=false。扩展 transform 的异常记录为 diagnostic；客户端渲染边界可回退源码，但 React 错误边界不负责捕获服务端渲染异常。

验证应覆盖标签/指令、中文与 emoji、源坐标、流式结束与一次性解析等价、SSR，以及新增交互的浏览器行为。独立分发还需验证真实打包消费，见[插件模块包](extensions.md#打包与接入)。

## 插件本地化

1.0.0 起，组件可用 useLocale() 读取合并后的 locale，以 locale.language 选择自己的文案。AnnotationType.label 接受字符串或 `(locale) => string`；选区动作使用 context.locale。Citation 默认标题随语言切换为 Citation / 引用。保持插件实例稳定即可更新文案，无需重写源文；用户保存的笔记不会被翻译。

## 流式中间态与增量动画

`pending` 表示顶层块还在增长；`incomplete` 表示当前语法节点尚未闭合。注册的标签自动支持组件指令写法。`defineBlock` 可提供 `streaming.Loading`，不提供时由原组件渐进渲染，并通过 `incomplete` 判断状态。后续内容到来时保持组件身份和内部状态。

默认的定义、题目、拓展阅读、视频、图片和 callout 指令使用小圆环等待完整内容；Mermaid 等待闭合后异步绘图；代码、公式、GFM 和翻译模块直接展示可用中间态。callout 的引用块写法可在头部完整后渐进展示正文。未闭合的引用定义不会提前注册不完整数据。第三方模块完全拥有自己的中间态样式。

```tsx
import { defineBlock, defineExtension } from '@linloir/limr';

export const chart = defineBlock({
  name: 'chart',
  component: ({ children }) => <section>{children}</section>,
  streaming: { Loading: () => <span role="status">正在准备图表…</span> },
});
export const streamMotion = defineExtension({
  name: 'example:stream-motion',
  streaming: {
    effect: {
      className: 'my-stream-increment',
      keyframes: [{ opacity: 0.25 }, { opacity: 1 }],
      timing: { duration: 320, easing: 'ease-out' },
    },
  },
});
```

后注册的 `streaming.effect` 优先，阅读器的 `streamEffect` 拥有最终覆盖权，`false` 关闭效果。关键帧和时间选项使用 Web Animations API；减少动态效果的系统偏好会阻止新动画。默认动画仅改变新增文字和特殊块的透明度，不添加背景色；文字动画结束后在原生选区离开时合并临时包装节点。使用 `children`、`renderChildren` 和 `renderValue` 可保留这些行为；插件自行替换 DOM 时，需要自行维护选区和动画。

`SyntaxExtension.literal` 让指令正文保持字面量，避免内部代码被解释为 Markdown 或 JSX。模块可读取原始 `source` 或变换组件节点；它不会执行属性表达式、YAML 或 JavaScript。

## 按条件替换渲染组件

模块可通过 `rendererOverrides` 限制替换的节点类型、语言、祖先或流式状态；规则只作用于使用该模块的 Reader。后注册且满足条件的规则优先；宿主 Reader 的规则优先于模块和 `components` 映射。未匹配的节点继续使用原组件。

```tsx
import { defineExtension, type NodeRenderer } from '@linloir/limr';

const JavaScriptCode: NodeRenderer = ({ renderValue }) => <pre>{renderValue()}</pre>;
export const customCode = defineExtension({
  name: 'example:javascript-code',
  rendererOverrides: [{
    type: 'code',
    when: (node, context) => node.lang === 'js' && !context.incomplete,
    component: JavaScriptCode,
  }],
});
```

`when` 也能读取 `pending` 和 `ancestors`。显式替换组件拥有自己的中间态渲染，仍处于 LiMR 的源范围、原子选择和异常边界之内。使用 `renderValue`、`renderAttribute`、`renderChildren` 维持精确映射。这里的限制是渲染规则作用域，不是对第三方 JavaScript 的安全沙箱。

## Worker 与窗口化视图

语法与视图是两项独立能力。纯组件、标注类型和动作可留在宿主；带解析钩子的自定义语法需要在宿主与 Worker 以同一个版本化 ID 注册，并校验可结构化克隆的配置。未注册的语法按 `fallback` 精确回退或报错，不会为了提速丢弃插件。`scope: 'local'` 本身不代表可独立分包或安全提前预览；额外的 `independentProseExtensions`、`provisionalPreviewExtensions` 均要求 Worker 作者证明对应语义。

自定义渲染器可通过 `virtualization: { copyText, searchText?, keepAlive? }` 声明窗口化的选区/搜索投影与 DOM 保留要求；契约属于实际匹配的 renderer override。优先使用 `useNodeState` 保留离屏状态，只有不透明编辑器或媒体才需要 keepAlive。显示内容由外部状态改变时调用 `invalidatePresentation()` 更新目录和搜索。未知视图或不可拆的大块会明确回退，宿主通过 `onVirtualizationChange` 观察。

渐进加载的预览通过 `readOnly` 阻止写入，`provisional` 则阻止要求完整文档的操作；动作仅在确实不修改文档时声明 `readOnly: true`。使用公开导航与打印命令，不要依赖全部 DOM 已经存在。Worker 示例、进度 API、条件与限制见[大文档](large-documents.md)。

## 打包与接入

一个插件包导出返回 RendererExtension 的工厂，消费者安装后通过 plugins 追加。插件可同时提供语法、标注、动作和参数，CSS 独立导出。它不需要修改 LiMR 源码。

### 可复制模板

完整模板位于 [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md)，包含 TypeScript 源码、类型构建、CSS、package.json 和 tsup 配置。它演示 reading-tip 区块、example:note 卡片和保存选区动作。

安装 LiMR 后，在应用目录执行：

```sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
```

源码仓库中的对应路径为 skills/limr-plugin-development/assets/plugin-template。替换模板的 @example 包名、扩展名、类型名和动作 ID，再实现业务数据与 UI；模板的 private: true 用于防止示例名被误发布，不影响本地打包。

### 包契约

| 字段 | 要求 |
| --- | --- |
| type | module |
| exports["."] | import 指向 ESM，types 指向 .d.ts |
| exports["./styles.css"] | 插件需要 CSS 时显式导出 |
| files | 包含构建输出与使用说明 |
| sideEffects | CSS 使用 ["**/*.css"]，避免被构建工具移除 |
| peerDependencies | @linloir/limr、react；直接依赖 react-dom API 时再声明 react-dom |
| 构建 external | LiMR、React、react/jsx-runtime，以及使用到的 React DOM 入口 |

LiMR 或 React 的第二份内置副本会破坏上下文/Hook 共享。不要打包宿主依赖，不要深度导入 LiMR 内部文件。参数声明合并必须随导出的类型分发。

### 在应用中引入

下方 @example 包来自模板，并未发布到 npm。先安装本地打出的归档；生成文件名以 npm pack 输出为准：

```sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
```

```tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: '阅读笔记' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
```

真实第三方包使用它的包名和 peer 版本约束。改写已存在的默认模块使用 extensions + replaceExtension，不要重复注册同一标签。字体、公式样式、持久化和应用服务仍由宿主配置。

### 验证可分发性

本地类型检查通过后，还需把真实 tgz 安装到独立消费者中：检查公开导入、SSR、CSS 资源、默认模块仍可用和新增交互。支持 React 18/19 的包应分别验证两种宿主。语法插件检查流式结束与一次性解析等价；交互插件检查桌面侧栏、窄屏浮层、键盘、异步取消和两种主题。

LiMR 仓库的 [reading-tools](../../examples/packages/reading-tools/index.js) 和 [paper-theme](../../examples/packages/paper-theme/index.css) 是另一组可打包示例。AI 可使用[插件开发 Skill](ai-skills.md)，其中的模板可独立复制，引用文件无需依赖本仓库路径。

### 加载与大文档兼容性

依赖 1.3.0 加载控制或窗口化能力的插件应在 peerDependencies 声明对应最低版本，并在真实包消费者中验证 Worker、provisional/readOnly、复制/搜索和离屏状态。保留旧 API 的简单示例可继续使用其兼容版本范围。CSS 主题也应检查图片预览 portal 的浅色/深色工具栏和等宽按钮。扩展契约见[Worker 与窗口化视图](extensions.md#worker-与窗口化视图)，接入示例见[大文档](large-documents.md)。

原有代码控制与 `renderValue` 逐行参数要求 LiMR >=1.3.8；`maxExpandedLines`、`foldedCode` 与 `chunked` 要求 >=1.3.9。只使用旧 API 时可保留较低 peer 版本；发布前以实际打包版本验证源码选区、行号复制、逐块覆盖和窗口化状态。
