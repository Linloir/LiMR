# 内置模块

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/modules) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/modules.md)

## 模块是什么

LiMR 的基础解析器认识 CommonMark：标题、段落、列表、链接、图片和代码围栏等。**模块**是在这个基础上增加一组能力的配置对象，例如识别公式、渲染视频、显示引用卡片。开发时这个对象的公开类型叫 `RendererExtension`，所以 API 中也称它为“扩展”。

模块可以同时包含语法规则、React 渲染组件、标注类型、工具栏动作和默认参数；并非每个模块都必须有这些部分。例如 `math` 增加公式语法和渲染，`code-highlight` 为现有代码围栏添加高亮，`citation` 同时提供引用语法和标注卡片。

**插件**通常指应用自行添加的模块，或第三方包提供的模块。它与内置模块使用相同的接口；npm 包只是分发代码的方式，一个包可以导出多个模块。把模块放进 `plugins` 后，就会追加到已有配置中。

## 函数、模块名和标签名的区别

以视频为例：

```tsx
import { Reader, standard, replaceExtension, video } from '@linloir/limr';

const videoModule = video({ loading: 'click' });
// videoModule.name === 'video'
const extensions = replaceExtension(standard(), videoModule);

export function Article() {
  return <Reader extensions={extensions} source={'<video src="/lesson.mp4" />'} />;
}
```

| 写法 | 在哪里使用 | 含义 |
| --- | --- | --- |
| `video` / `video(...)` | 应用的 JavaScript / TypeScript | 导入的函数 / 调用这个函数，创建一个模块配置对象 |
| `videoModule` | 应用代码 | 自己给对象起的变量名，可以改成其他名字 |
| `'video'` | 模块对象的 `name` 字段 | LiMR 区分、替换和移除模块时使用的稳定标识 |
| `<video … />` / `<md-video … />` | Markdown 正文 | 模块注册的两种标签，触发同一个视频渲染器 |
| `::video{…}` | Markdown 正文 | 模块注册的指令写法，也可以使用 `:::video` 容器 |

这些名称不要求一致。例如创建代码高亮模块的函数是 `codeHighlight()`，对象的模块名却是 `'code-highlight'`，正文只需要普通代码围栏，不需要 `<code-highlight>` 标签。不要把 `video()` 或字符串 `'video'` 直接写进 Markdown 来启用模块，也不要把字符串放进 `plugins`；传入的是函数返回的对象。

`video({ loading: 'click' })` 的参数设置这个 Reader 中视频模块的默认行为；正文的 `<video loading="eager" … />` 则可以覆盖某一个视频的设置。不同模块支持不同参数，见[默认语法](syntax.md)。

## 随 LiMR 提供的默认模块

这些模块都随 `@linloir/limr` 安装，不需要分别安装 npm 包。`standard()` 返回下面的模块对象数组，使用各自的默认配置。

| 创建模块的函数 | 对象的 `name` | 增加的能力与正文写法 |
| --- | --- | --- |
| `gfm()` | `gfm` | 表格、`~~删除线~~`、任务列表、自动链接、`[^id]` 脚注解析 |
| `math()` | `math` | `$…$` 行内公式、`$$…$$` 块级公式，需要额外导入 math.css |
| `codeHighlight()` | `code-highlight` | 使用 Shiki 为带语言标记的代码围栏着色 |
| `definition()` | `definition` | `<definition>` 释义卡片，可带标题与 Markdown 正文 |
| `question()` | `question` | `<question>` 练习题，选项、提示、答案与本地判分 |
| `extras()` | `extras` | `<extras>` / `<extra>` 拓展阅读链接 |
| `video()` | `video` | `<video>` / `<md-video>` 原生视频、YouTube、Bilibili 嵌入 |
| `figures()` | `figures` | `<figures>` / `<figure>` 响应式图组、单图和图注 |
| `citation()` | `citation` | `<citation>` 定义来源，`<ref>` 插入引用角标和卡片 |
| `translations()` | `translations` | `<translations>` 包含原文与译文，切换原文、译文、对照 |
| `mermaid()` | `mermaid` | Mermaid 围栏 / `::mermaid`，图像、源码、缩放和复制 |
| `callout()` | `callout` | Obsidian callout 类型、别名和嵌套注释 / `::callout` |
| `inlineHighlights()` | `inline-highlights` | `==文字==` 和 `::highlight`，默认蓝色高亮；启用原文编辑前只读 |
| `footnotes()` | `footnotes` | `[^id]`、`^[正文]`，评论角标与脚注卡片；`::footnote` / `::footnote-ref` |
| `sourceAnnotations()` | `source-annotations` | `[^%%limr:id%%]` 命名范围、`limr-annotation` 定义与通用序列化；类型和卡片由模块注册 |

所有函数都可以从 `@linloir/limr` 或 `@linloir/limr/extensions` 导入。`standard()` 是便捷组合函数，自身不是额外的模块；它的返回值是数组。

`Reader`、独立使用的 `Markdown`、`DocumentProvider` 在未传 `extensions` 时自动使用 `standard()`，因此最初的 `<Reader source={source} />` 就支持这些能力。共享 Provider 内的组件使用 Provider 的配置。纯核心 `createDocument()` 默认只启用 CommonMark；需要时显式传入扩展，它不负责显示 React UI。

高亮、复制、删除选区标注是工具栏自带动作。`==文字==`、Markdown 脚注和命名范围标注由默认模块识别。提供 `onSourceChange` 后，默认任务勾选和源码高亮可编辑；默认高亮动作也会把新增高亮存入原文。`sourceAnnotations()` 提供通用序列化，不绑定特定内容类型；常规 addAnnotation 仍更新外部 annotations，模块可用 target: source 选择原文。Playground 的内联笔记、旁注、阅读笔记和模拟 AI 问答来自示例插件，**没有自动装进每个 Reader**。type="question" 的提问卡片由阅读笔记示例注册，与 `question()` 的正文练习题不同。

Playground 的普通阅读笔记在窄屏保持锚点附近的小卡片，直接在卡片内编辑；模拟助手仍可展开。这是示例模块各自的 overlay 策略，库的 `overlay.expand` 仍支持锚点展开或居中展开。

## 按需要组合

默认配置足够时不必写 `standard()`。需要定制时，记住这三个操作：

| 目的 | 写法 | 结果 |
| --- | --- | --- |
| 加自己的功能 | `plugins={[myPlugin]}` | 保留默认模块，追加插件对象 |
| 只保留指定能力 | `extensions={[gfm(), math()]}` | 替换完整默认模块清单；CommonMark 仍可用 |
| 调整一个内置模块 | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | 按模块 `name` 替换视频，保留其他模块 |

移除一个模块也可以过滤数组：`standard().filter(module => module.name !== 'video')`。不需要扩展语法时传 `extensions={[]}`。

不要通过 `plugins={[video()]}` 再次追加已默认存在的视频模块：重复模块名、标签或指令会报错。模块没有启用时，未知标签按文本显示；未知指令可能仅留下内部 Markdown；已有的未知标注数据继续保留，但不显示专用角标、卡片或交互；重新注册类型后恢复显示。完整边界见[架构与行为](architecture.md)。

接下来可以直接试读[语法示例](syntax.md)，或参考[扩展开发](extensions.md)创建模块、[插件模块包](plugin-packages.md)打包分发。
