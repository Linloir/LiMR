# 标注与选区

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/annotations) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/annotations.md)

## 数据模型

`Annotation` 是数据，`AnnotationType` 是插件注册的呈现和加载逻辑，`AnnotationOccurrence` 是一次出现位置。一个标注可以通过 anchors 出现在多处；同一位置的每条内容标注各有一个独立角标、侧栏条目和窄屏浮层。

```ts
import type { Annotation } from '@linloir/limr';

export const annotations: readonly Annotation[] = [{
  id: 'paper-reference',
  type: 'citation',
  data: { title: 'Paper', url: 'https://example.com/paper' },
  anchors: [{
    range: { start: 0, end: 4 },
    documentId: 'article',
    quote: 'LiMR',
  }],
}, {
  id: 'highlight-1',
  type: 'highlight',
  range: { start: 0, end: 4 },
  data: { color: '#F2C744', style: 'background' },
}];
```

这个示例要求 source 的前四个 UTF-16 单元为 `LiMR`，documentId 为 article。range 是单次锚点的简写；传 anchors 后以 anchors 为准。范围均指向**未经改写的输入**，采用 UTF-16、右端不包含，不是 UTF-8 字节或 Unicode 码点。

持久化时保存原始 source、稳定 documentId、annotation.id、type、data、anchors，并在有需要时记录应用文档版本。anchor.revision 对应当前引擎修订号，不是跨会话持久 ID。quote 与原范围不符时，只在全文有唯一匹配时迁移；无匹配、多个匹配或 documentId 不一致会跳过该锚点。没有 quote 且 revision 不匹配的锚点也会跳过。这不是协同编辑的自动位置转换系统。

## 三种选区

| 字段 | 含义 |
| --- | --- |
| `text` | 可读的选中文本；选区稳定后，原子内容使用完整原始源码 |
| `raw` | 映射得到的原始范围和源码 |
| `syntax` | 仅吸收两端紧邻的标准 Markdown 标记，不扩选未选文字或特殊块外层标签 |
| `blocks` | 选区触及的块范围与源码 |
| `quality` | exact、atomic 或 unmapped |
| `settled` | 指针仍在拖选时为 false |
| `documentId` / `revision` | 选区所属文档快照 |

每种结果包含 ranges 和 sourceText。一般笔记使用 syntax.ranges，并为**每个范围**保存 `document.source.slice(start, end)` 作为 quote。代码支持部分选择；公式和图片作为原子内容。不要用 DOM textContent 长度倒推原文范围，实体、转义和 emoji 会让两者不同。

默认选区工具栏与浏览器复制会完整序列化原子内容，保留原来的 `$…$`、`$$…$$`、图片语法、Mermaid 围栏／指令及插件块标签；周围普通文字保留渲染后的文本与显式换行。重新点击已有高亮后复制也遵循这一规则。插件的 `selection: 'atomic'` 覆盖其映射属性、子内容及嵌套原子块；模块内部的复制按钮可以提供专用格式。

## 高亮和命令

`highlight` 不需要安装额外的 AnnotationType，data 支持 color、style（background / underline / dotted / wavy）、hidden。删除内容标注与隐藏高亮是不同操作。

| 命令 | 行为 |
| --- | --- |
| `addAnnotation(annotation, options?)` | 添加/替换同 ID 数据；普通内容标注默认同时补充共享高亮 |
| `updateAnnotation(id, partial)` | 浅合并标注字段，但保持原 id 与 source 来源元数据不变；data 是整体替换，更新时保留需要的字段。返回持久化是否接受修改 |
| `removeAnnotation(id)` | 移除这一条标注，其他标注和共享高亮保留 |
| `removeAnnotationsAt(ranges)` | 移除精确匹配片段上当前支持的标注及高亮；保留其他位置的锚点和未注册类型 |
| `editAnnotation(id / null)` | 切换共享编辑状态；设置 ID 时也激活卡片；`null` 确认当前新建并关闭编辑 |
| `commitAnnotationEdit(id?)` | 保存成功后确认编辑并关闭编辑器；省略 ID 时使用当前编辑项 |
| `cancelAnnotationEdit(id?)` | 取消编辑；删除尚未确认的新建标注及没有其他引用的自动高亮。持久化拒绝删除时返回 `false` |
| `activateAnnotation(id / null)` | 激活标注的首个 occurrence，也接受 occurrence ID |

`addAnnotation` 的 `{ highlight: false }` 关闭自动持久高亮，显式 HighlightData 指定样式；`{ edit: true }` 进入编辑。类型配置 `highlight: 'hover'` 时默认不创建持久高亮，但显式传入高亮样式仍可创建。默认选区工具栏为调色板、添加/隐藏高亮、复制、删除；actions 覆盖内置列表，插件动作仍会合并进去。

保存成功后使用 `commitAnnotationEdit`，取消时使用 `cancelAnnotationEdit`。取消已有标注的编辑会保留已保存内容和高亮；插件自行还原草稿。Playground 编辑器在新建笔记仍为空时，失焦也按取消处理。共享高亮和原有高亮保留。当前标注处于编辑状态时隐藏选区工具栏。

## Citation 的临时高亮

Citation 默认 `highlight: 'hover'`。角标或侧栏条目悬浮、或引用处于 activate 状态时，用类型 color 的 18% 底色高亮关联文本。底色绘制在文字下方；点击激活后，移开鼠标仍保留，取消激活且不再悬浮后才隐藏。同一个明确范围的激活与悬浮引用不会叠加加深颜色。该效果不更新 annotations，也不改变已保存高亮的 hidden 设置。带范围的 `<ref>文本</ref>` 使用所包裹的文本；自闭合 `<ref />` 和独立命名脚注的范围是角标位置上的零长度，不绘制段落高亮。紧邻 `==文本==` 的脚注使用这段明确的文本范围。外部范围引用使用自身范围，并以该范围首行对齐侧栏。

点击或悬浮角标会对齐侧栏条目，侧栏悬浮不会移动正文，也不改变页面滚动范围。绘制层随页面滚动更新可见片段，保留当前悬浮或激活引用的高亮状态。

使用 `replaceExtension(standard(), citation({ highlight: false }))` 关闭该效果。其他类型也可显式启用 highlight: 'hover'。

## 缺少插件时

只有已注册的标注类型才创建角标、卡片、悬浮反馈和编辑控件。卸载插件会移除这些界面并清理相关激活状态；混合引用仍保留其中已注册的条目。未知类型保留在原始标注数据和源码定义中，重新安装模块后恢复展示。已注册类型缺少 Content，或 citation 模块已安装但引用定义缺失时，仍可显示本地化的不可用提示。

持久化时保留完整的 `annotations` 数组。选区工具栏上下文和 `removeAnnotationsAt` 只处理当前支持的类型，因此删除可见高亮不会误删同范围隐藏的笔记。显式 `updateAnnotation(id, ...)` 和 `removeAnnotation(id)` 仍可按 ID 管理保存的数据。Playground 的插件开关安装或卸载完整模块，包括其渲染器；修改 Markdown 的权限开关与插件安装相互独立。

## 卡片与异步资源

卡片 UI 由模块注册：Content 渲染内容，overlay.Card 负责完整浮层内部，sidebar.Preview 负责收起时的本地摘要。`AnnotationMarkdown` 在隔离选区作用域内复用 Markdown 配置。

`load(annotation, { signal })` 在内容显示时才调用，同一阅读器内复用请求和有限缓存，不在不同 Reader 间共享。Preview 不调用 load。Content 接收 data、loading、error、retry、editing、presentation、expanded；处理加载和错误 UI 是模块的职责。可通过 useLiMR().invalidateAnnotation(id) 刷新。

动作的 signal 在阅读器销毁时取消，关闭菜单不会取消动作。调用 updateAnnotation 更新流式答案时同时保留问题字段；“停止生成”、重试、认证、会话和保存由应用 adapter 管理。参考[助手示例](../../examples/assistant.tsx)和[扩展开发](extensions.md)。


## 源码中的命名范围

默认 `sourceAnnotations()` 模块将 `::%%limr%%{<#r1}文本::%%limr%%{>#r1}` 与 `:::limr-annotation` 定义关联。[语法文档](syntax.md#保存在-markdown-中的标注)列出了完整写法和覆盖规则。定义会生成普通 `Annotation` 及解析好的 `anchors`，同一命名范围的每条内容标注生成独立角标。解析快照仍记录源码中的引用组，运行时 occurrence 以 markerId 关联该源码位置。

`DocumentSnapshot.annotationRanges` 将区分大小写的范围 ID 映射到各个出现位置。每个 `SourceAnnotationRange` 包含 `range`（两端之间的内容）、`openingRange`（开始标记）、`markerRange`（结束标记）和 `syntaxRange`（包含正文的完整标记对）。它们都是未改写源码的 UTF-16 坐标。两端紧邻时 `range` 长度为零。删除某个范围时只移除它自己的两个标记，保留嵌套或交错的其他范围。

`Annotation.source` 记录负责该语法的模块、定义源码 `ranges` 和可选的命名 `rangeIds`。重复 ID 只暴露最后一份数据，但保留所有定义跨度，供源码编辑器更新或删除时一并处理，避免旧定义重新生效。普通 `==文本==` 高亮的所属模块为 `inline-highlights`，命名定义为 `source-annotations`。这些元数据属于当前解析结果，原文变化后应重新生成。

源码标注默认只读。`standard()` 提供通用解析与序列化；显式提供 `onSourceChange` 后，默认高亮与任务可更新 Markdown，无需额外写回插件、数据库或编辑器组件。标注类型负责卡片与编辑 UI，Playground 的内联笔记和提问由示例插件注册。模块新增时使用 target: source 选择原文，普通 addAnnotation 仍存外部数据；默认高亮动作在原文可编辑时主动选择 source。已有标注的更新/删除遵循其来源，外部数据继续使用 `annotations` 与 `onAnnotationsChange`。修改 API 详见[项目集成](integration.md)和[扩展开发](extensions.md)。

## 密集侧栏

通过 `<Reader sidebarCollapse />` 或 `<AnnotationSidebar collapseOverflow />` 开启自动折叠；两者默认关闭。Playground 工具栏提供全局「旁注折叠」下拉选项（开启 / 关闭），默认开启，切换文章后继续生效。自定义 positioner 用于未开启自动折叠的布局。

布局比较相邻条目的位移代价与折叠代价，优先保留完整条目，允许轻度避让；只有连续区域足够拥挤时才形成可折叠组，不受段落边界限制，也不单独折叠一条。折叠区域的跨度有上限，布局稳定后还会尝试释放条目，减少不必要的折叠。收起高度让最后一个条目露出约三分之二，渐隐覆盖至少半个条目，提示剩余内容；分组没有展开按钮，也不接管滚轮或触摸滚动。

点击或悬浮角标时，分组位置与内容位移使用同一动画对齐目标卡片，卡片始终留在原列表中。仅悬浮时，鼠标移入对应卡片会维持位置，离开后回到原来的顶部位置；点击激活后固定位置，直到关闭或取消激活。临时悬浮其他角标后，会回到激活项。侧栏悬浮不会移动正文。动画使用缓存的几何信息和 transform，支持反向打断和减少动态效果设置，不增加页面高度或产生尾部空白。渐隐固定在裁剪窗口边缘，并随真实溢出距离减小，完整进入可见区的条目不再淡出。

零长度标注的灰色引用栏显示角标前的可读上下文，按栏宽截取并在两端加省略号；这不会扩大高亮或工具栏的实际范围。点击高亮会打开选区工具栏。点击角标会同时打开对应侧栏条目或悬浮卡片，以及该范围的工具栏；公式、代码、Mermaid 和自定义原子块也遵循此行为。工具栏避让卡片；短屏下卡片正文和工具栏展开面板在可用空间内滚动。仅悬浮预览时清除原来的正文选区。当前标注处于编辑状态时隐藏工具栏。动作仍遵循插件能力与源码编辑权限。

对于普通脚注关联的 `==文本==` 或成对 ID 边界声明的命名范围，仅显式且未隐藏的 highlight 定义提供常驻高亮。没有定义或 hidden=true 时只在悬浮时显色，优先采用 highlight 的 color，再使用默认内联高亮色。已有可见高亮的范围不会再叠加悬浮底色。单独的 `==文本==` 仍是常驻内联高亮。
