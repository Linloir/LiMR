# 扩展指南

语法、节点渲染、角注和选区操作遵循同一套公开接口。`standard()` 只是默认模块列表，没有第二套内部专用模块接口。

## 独立语法模块

`defineBlock({name, component, tags?, directives?, selection?})` 同时注册标签和指令适配器：

```tsx
const warning = defineBlock({
  name: 'warning',
  component: ({ children, pending }) => <aside aria-busy={pending}>{children}</aside>,
});
```

```markdown
<warning>

**Markdown** 内容。

</warning>

:::warning
也可以用指令语法。
:::
```

组件接收 `node`（含 attributes/children/原文 position）、`children`、`source`、`pending` 和 `renderChildren(nodes)`。后者直接渲染已解析子树，不需要重新解析字符串。按需渲染答案/提示时可保留对应节点，以原始坐标交还给 `renderChildren`。

需要行内标签、全新 token 或 AST 改写时用 `defineExtension()`：

```tsx
const badge = defineExtension({
  name: 'badge', tags: ['badge'], display: 'inline', scope: 'local',
  components: { badge: ({ children }) => <span className="badge">{children}</span> },
});
```

`micromark` 接收 micromark syntax extensions 数组，`mdast` 接收 mdast from-markdown extensions 数组。`transform(root, {source, streaming, documentId})` 可以把自定义 AST 节点变换为新的节点类型，再通过 `components[nodeType]` 渲染。保留原始 position，不修改原始 source。没有 position 的生成内容无法提供精确选区映射。

`transform` 默认为全文语义。声明 `scope: 'local'` 的承诺是：已有完整顶层区块的输出不依赖其后的区块，不依赖正在变化的全文上下文；输入末尾重新解析就能保持语义正确。编号、跨段关系等插件应保留默认全文模式。内置 Markdown 引用/脚注定义有单独的全文失效机制。未闭合标签会使用原文回退，完成后重试，结束后总会完整解析。

扩展 name、tag、directive 冲突会抛错。用 `replaceExtension(existing, replacement)` 按 name 替换；组件覆盖可直接放 `components`，角注覆盖可直接放 `annotationTypes`。不做隐式的 parser 覆盖。

## 默认模块

| 工厂 / name | 能力和配置 |
| --- | --- |
| `gfm()` / `gfm` | 表格、任务列表、删除线、自动链接、标准脚注 |
| `math({macros?, strict?})` / `math` | `$...$`、`$$...$$`，KaTeX，不信任执行性命令 |
| `codeHighlight({languages?, lightTheme?, darkTheme?, eager?, maxLength?})` / `code-highlight` | Shiki；默认靠近视口加载，超过 100,000 字符保留纯代码 |
| `definition({component?})` / `definition` | `<definition>`，title 属性或 `<title>`，可选 `<content>` |
| `question({component?})` / `question` | 问题正文、提示、答案、选择题 |
| `extras({component?})` / `extras` | `<extras><extra title="..." url="..." desc="..." /></extras>` |
| `video({component?, resolveUrl?})` / `video` | `<video>` / `<md-video>`，native / youtube / bilibili |
| `figures()` / `figures` | `<figure>` / `<figcaption>` |
| `citation(annotationTypeOverrides?)` / `citation` | `<ref>` / `<citation>`，citation 角注类型 |

问题的子标签为 `question-content`、`question-hint`、`question-answer`、`question-sel-grp` 和 `question-sel`。选择组用 `answer="[0,2]"` 配置从 0 开始的正确选项编号，`multi="true"` 开启多选。它们是内容组件，不包含提问/聊天角注或服务连接。

视频使用 `url` 或 `src`，provider 默认 native；嵌入式播放器明确配置 `provider="youtube"` 等。不会在点击前请求第三方播放器。未知标签不执行 HTML；组件对自己的远程请求和 URL 处理负责。

## 角注类型

```tsx
const glossary = defineAnnotation<{ title: string; body: string }>({
  type: 'glossary', label: '术语', icon: '◎', color: '#548b74',
  Content: ({ data, presentation }) => <div>
    <strong>{data?.title}</strong>
    <AnnotationMarkdown source={data?.body ?? ''} />
  </div>,
});
```

注册类型与放置角注是独立操作。类型定义 icon、可选 Marker 组件、内容组件和可选的数据加载器；数据通过 annotations、文档命令或自定义语法 transform 生成。

`Content` 接收 `annotation`、`data`、`presentation`（preview/expanded/sidebar）、`expanded`、`loading`、`error`、`retry`。可以按展示模式显示摘要或完整 UI。`load(annotation, {signal})` 只在需要展示内容时调用，必须遵守 signal；同一注释在侧栏和浮层之间共享请求和结果。更换不可变 annotation 对象会换资源标识；显式 `invalidateAnnotation(id)` 或 `retry()` 可重新加载。缓存按阅读器隔离，结果采用有限 LRU；不会把一个应用用户的数据共享给另一阅读器。

自定义语法可以生成 `annotationDefinition` 节点，其 `annotation` 字段为完整数据；生成 `annotationReference` 节点，其 `annotationIds` 为引用的 ID 数组，position 对应角标位置。也可以完全不添加语法，直接给用户选中的范围添加外部 annotation。

## 助手插件的协作方式

[assistant.tsx](../examples/assistant.tsx) 是完整、经过浏览器验证的例子：

1. 插件在 `actions` 注册选区菜单入口。
2. 动作从选区创建一个具有原始范围和 quote 的自定义 annotation。
3. 用 `activateAnnotation(id)` 打开卡片，清空菜单选区。
4. 应用 adapter 产生 `AsyncIterable<string>`；每个片段调用 `updateAnnotation()`。
5. 自定义 Content 使用 `AnnotationMarkdown streaming` 渲染回答。
6. Reader 卸载时中止请求，动作不再更新已卸载的文档。

示例只从 `limr` 的公共入口导入，可以复制到应用中使用。真实 Codex 集成可以实现同一个 adapter，也可以自行实现更复杂的组件、对话状态、输入框和动作。LiMR 不把助手的传输、认证、问题/答案 schema 写入内核。

插件任务的取消信号来自动作的生命周期上下文。若业务还需要“停止生成”、重试、切换会话等控制，可由插件自己的 AbortController 与 context.signal 联动。角标保留哪个历史回答、是否保存、如何鉴权，也由应用决定。
