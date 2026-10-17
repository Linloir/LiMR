# API 参考

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/api) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/api.md)

## 导出入口

| 入口 | 内容 |
| --- | --- |
| @linloir/limr | 全部公开 core、React 和扩展接口 |
| @linloir/limr/core | 无 React/DOM 的文档引擎、选区计算、树工具、缓存、数据类型 |
| @linloir/limr/react | 组件、hooks、locale、React 类型 |
| @linloir/limr/extensions | 模块工厂、扩展定义、选区动作、AnnotationMarkdown |
| styles.css / styles/base.css / fonts.css / math.css | 公开样式资源，前面加包名 |
| @linloir/limr/package.json | 包元数据 |

以下是使用入口；精确 TypeScript 签名随包导出，插件应以已安装版本的声明为准。

## 共享文档配置

Reader、Markdown 与 DocumentProvider 接受：

| 属性 | 默认 / 说明 |
| --- | --- |
| source | 空字符串，原始 Markdown |
| document | 可选现有 DocumentEngine，优先于 source/streaming，使用已恢复的快照时不再解析 |
| streaming | false |
| documentId | 自动生成；显式值应稳定且页面内唯一 |
| extensions | standard()，完整扩展清单 |
| plugins | 追加到默认或显式清单 |
| parameters | 文档级模块参数覆盖 |
| components | 按 AST 类型/特殊标签覆盖 NodeRenderer |
| annotationTypes | 按 type 追加/覆盖标注呈现 |
| annotations | 不传则内部管理；传入则受控 |
| onAnnotationsChange | 下一份外部标注数组，包含 highlight；受控编辑必须通过 props 回传已接受的数组。仅同步返回 `false` 拒绝修改；其他返回值忽略 |
| onSourceChange | 可选 `(source, { document, edits }) => boolean \| void`；显式启用原文编辑，返回 false 拒绝事务 |
| theme | light，可选 dark / auto |
| appearance | classic，传播到 portal 的样式作用域 |
| locale | english，可传 chinese 或 Partial&lt;LiMRLocale&gt; |
| justify | false，段落/列表两端对齐 |
| typography | standard（默认）、knuth-plass 或 justify；保留旧 CSS 模式 pretty / normal |
| knuthPlass | TeX 段落参数，见[样式](styles.md) |
| rendererOverrides | 按顺序匹配的渲染规则：type、component 和可选 when 条件，仅作用于当前 Reader |
| streamEffect | 覆盖流式增量动画；false 关闭 |
| scrollRoot | null / 未指定表示窗口 |
| scrollOffset | 24px |
| onDocumentChange | 文档更新后的 DocumentSnapshot |
| onSelectionChange | SelectionSnapshot 或 null |
| onAnnotationClick | 激活的 AnnotationOccurrence |
| onAnnotationHover | occurrence 或 null |
| onHighlightClick / onHighlightHover | 高亮 Annotation；hover 离开为 null |

默认 locale 是 english，Partial 未指定键回退到英文。locale 影响采用 LiMRLocale 的内置控件，不翻译正文；第三方插件通过 useLocale 自行提供文案。当前部分辅助文字（例如公式 Copy LaTeX、译文切换提示）仍是模块固定文案。Playground 的界面语言按钮可试用中文/英文切换，选择会独立保存到浏览器。

## 组件

| 组件 | 额外属性及默认值 |
| --- | --- |
| Reader | toc=true、sidebar=true、sidebarCollapse=false、fillHeight=true、sidebarBreakpoint=1120、actions、followOutput=false、className/style |
| AsyncReader | Reader 配置加 input、loading、loadingFallback（null 使用宿主 UI）、onLoadStateChange(state, controls)，见[大文档](large-documents.md) |
| Markdown | interactive=true、followOutput=false、className/style |
| DocumentProvider | children；为下方组件提供上下文 |
| TableOfContents | title、maxDepth=6、followActive=true、topInset=24、updateHash=false、className/style |
| AnnotationSidebar | sync='document' / 'none'、collapseOverflow=false、gap=14、positioner=alignSidebar、renderCard、className/style |
| AnnotationOverlay | disabled=false、portalRoot、previewWidth=340、maxHeight='80dvh' |
| SelectionToolbar | actions、portalRoot、maxPanelHeight=260、render、className/style |
| AnnotationCard | AnnotationOverlayCardProps 加必填 title 和可选 bodyLabel |
| AnnotationEditor | value/onChange、onSubmit/onCancel、label 必填；onBlur、placeholder、submitLabel、cancelLabel 可选；submitDisabled=false、autoFocus=true |
| AnnotationContent | annotationId、presentation、expanded=true、enabled=true |
| AnnotationGroup | occurrence、presentation、expanded=true、enabled=true |
| AnnotationMarkdown | MarkdownProps，source 必填；默认 interactive=false |
| InlineMarker | label 必填，color、children 和 button 属性/ref |
| Image | 原生图片 props/ref；preview=true、loading='lazy'、decoding='async'；已加载图片可打开共享预览 |
| ImagePreview | 受控 image/onClose；image 包含 src、width、height，可选 alt/来源 element；可选 locale/theme/appearance/className/style |
| MarkdownTable | 绑定原文的 node/renderChildren 适配组件，默认渲染器自动使用，见[表格布局](table-layout.md) |
| ToolIcon | name 与 SVG 属性；如 note、copy、highlight、comment、zoom-in、zoom-out、source、image |

共享文档组件/hooks 应位于 Provider 内，独立 Markdown 和 Reader 会建立自己的文档。AnnotationEditor 是受控 UI，可独立使用；AnnotationCard 是浮层内容模板，不负责自建 portal。sidebar.renderCard 接收 `{ occurrence, active, activate }`；toolbar.render 接收 `{ context, actions, run }`。

`Reader` 和 `AsyncReader` 也接受 `children`，位于同一文档 Provider 内、阅读布局之后。宿主适配组件可在其中调用 `useLiMR()`，通过 `scrollToSource(range)` 定位任意原文位置，包括长文中尚未挂载的段落。宿主编辑器的滚动同步仍由宿主负责。

逐段翻译偏好可通过 `parameters.translationModeForNode(node, document)` 和 `onTranslationBlockModeChange(node, mode, document)` 提供。解析函数优先于 `translationMode`；返回 `undefined` 时恢复全局、本地和源码默认值。可见段落、复制、搜索及全文目录共同使用它，包括尚未挂载的内容。角标点击优先交给逐段回调，再考虑全局回调或本地状态；已解析出的逐段模式若没有回调则锁定。`TranslationBlock` 也支持组件级 `mode`/`onModeChange`；若该状态需要参与窗口阅读，应使用上述参数接口。偏好变化时替换解析函数，不要静默修改其闭包数据。

自定义窗口渲染器收到 `VirtualizedTextContext`：`source` 是完整节点源码，`children` 是已按选区和展示状态过滤的子节点文字，惰性 `value` getter 返回选中的解码后叶节点内容。代码保留字面空白和实体。代码主题适配器可使用 `copyText: (_node, { value }) => value`，无需重新实现源码映射，也不会在局部选择时复制整块代码。

`Image` 和 `ImagePreview` 也可独立于 Reader 使用。预览从原图位置动画展开，背景变暗，底部提供适配主题的操作栏：切换适应窗口／原始大小／铺满窗口、缩放、复制图片像素和关闭。超出窗口的图片支持拖动和滚动；Escape 关闭后返回原焦点，并尊重系统的减少动态效果偏好。复制像素需要浏览器剪贴板权限，以及同源或允许 CORS 读取的图片；失败会在复制按钮中提示。本地或受保护图片的 URL 由宿主解析后传入，核心组件不负责文件系统查找。

`SidebarPositioner` 接收 `{ id, anchorTop, height }[]` 与 `{ activeId, gap, height?, prioritizeActive? }`，返回 ID 到 top 的映射。anchorTop 是关联文本首行的位置；prioritizeActive 区分悬浮/激活条目与随阅读位置选择的条目。默认 alignSidebar 在静止时收拢文末卡片，交互时优先保留当前条目的对齐。

## Hooks

| Hook | 返回 |
| --- | --- |
| useDocument() | 完整快照 |
| useDocumentSelector(select) | 选中值；返回值引用不变时不重渲染 |
| useLocale() | 当前合并后的 locale；内置 language 为 en / zh-CN，供插件选择自己的词典 |
| useSelection() | 选区或 null |
| useAnnotation(id) | 数据或 undefined |
| useAnnotations() | annotations Map 与 occurrences 数组，含源内引用及外部数据 |
| useAnnotationState() | active / hovered occurrence ID 与 activate / hover |
| useAnchor(occurrenceId) | element、视口 rect、contentRect，未挂载时为 null |
| useRendererParameter(name) | 宿主参数覆盖或最后注册的默认值 |
| useLiMR() | 文档引擎、命令、signal、clearSelection、scrollToHeading、scrollToAnnotation、invalidateAnnotation |

`useLiMR()` 与动作上下文提供 `updateAnnotation(id, partial): boolean`、`commitAnnotationEdit(id?): void` 和 `cancelAnnotationEdit(id?): boolean`。仅在 update 被接受后调用 commit，它结束编辑而不重复写入数据。cancel 删除尚未确认的新建标注及没有其他引用的临时高亮，保留已有标注和共享高亮。插件取消前将草稿还原到已保存的内容；宿主拒绝取消时恢复未完成草稿并保持编辑。配套笔记编辑器也会在点击外部时取消空白新草稿；当前编辑器激活时隐藏选区工具栏。

不要将 useRuntime、useTheme 当作公开 API。useLocale、locale.language 和可本地化的标注 label 从 1.0.0 起提供。命令语义见[标注与选区](annotations.md)，渲染和动作契约见[扩展开发](extensions.md)。

## 核心引擎

```ts
import { createDocument, selectionFromRange } from '@linloir/limr/core';

const engine = createDocument('# Hello\n\nText', { id: 'core-doc', streaming: true });
engine.append('\n\nMore text.');
const document = engine.finish();
const selection = selectionFromRange(document, { start: 9, end: 13 });
console.log(document.headings, selection.syntax.sourceText);
```

createDocument(source?, { id?, extensions?, streaming? }) 返回 DocumentEngine。getSnapshot() 读取；subscribe(listener) 返回取消订阅函数；update(source, { streaming? }) 替换完整输入；append(chunk) 追加并设流式；finish() 收尾；setExtensions(list) 切换解析配置。

核心默认 extensions=[]。纯核心使用带 micromark/mdast 的 SyntaxExtension；从 React 扩展入口导入 standard 不再是严格的无 React 依赖路径。

DocumentSnapshot 包含 id、revision、source、streaming、blocks、headings、definitions、footnotes、footnoteOrder、annotations、annotationRanges、occurrences、diagnostics、metrics。这里 annotations 是**源内解析得到的数据**；外部受控数据使用 useAnnotations，不要混淆两个集合。annotationRanges 将命名范围 ID 映射到 SourceAnnotationRange 数组（range、openingRange、syntaxRange、markerRange 均为原文 UTF-16 坐标）。

其他核心导出包括 walk、textContent、rangeOf、intersects、safeUrl、mapText、selectionFromRange、replaceExtension、resolveAnnotationAnchors、annotationReferenceRange、sameRange、defaultHighlight、LruCache、ResourceCache。ResourceCache.acquire 返回 promise/release；invalidate 可按 key 或全部失效。

`inlineHighlights({ color?, component? })`、`footnotes(annotationTypeOptions?)`、`sourceAnnotations()` 都在 `standard()` 中。命名源内标注使用成对的 `::%%limr%%{<#id}` / `::%%limr%%{>#id}` 边界与完整的 `:::limr-annotation` 定义块，详见[语法文档](syntax.md#保存在-markdown-中的标注)。`HighlightData.readOnly` 默认限制源内高亮工具栏为复制与提示；启用原文编辑且模块支持写回时可编辑。`AnnotationOccurrence.referenceRange` 将角标源位置与引用范围分开；独立引用的 referenceRange 为角标起点的零长度范围。

`useLiMR()` 与动作 context 提供 `canEditSource()`、`canEditAnnotation(id)`、`editSource(edits, { revision? })`。`SourceEdit` 为 `{ range: { start, end }, text }`，同一批次全部相对修改前原文；越界、重叠和过期 revision 会抛错。`editSource` 原子接受后立即更新文档，宿主回传新的 source；返回 false 表示宿主拒绝。`applySourceEdits(source, edits)` 是对应的纯核心函数。流式生成期间拒绝编辑。

`addAnnotation(annotation, { target: 'source' })` 明确选择原文写回；target 默认为 annotations。`standard()` 的 sourceAnnotations 已安装公开的 `editSourceAnnotations` 通用序列化器。提供 onSourceChange 后，默认任务框可修改，默认 highlightSelection 动作新建高亮时选择 source；普通 addAnnotation 不改变默认存储目标。类型、卡片和专用动作仍由模块提供。`TaskCheckbox` 是默认禁用的菱形 UI 组件，可接收 checked、disabled、onChange、label、ideographic；默认 Markdown 渲染器负责根据编辑能力启用它。

`RendererExtension.sourceEditing.annotations(change, document)` 返回 `SourceEdit[]` 或 undefined；change 包含 added、updated（previous/annotation）、removed。后注册的处理器优先，undefined 委托前一个。源内 `Annotation.source` 包含 module、全部重复定义的 ranges，以及可选 rangeIds；这些是解析结果，不应跨 revision 持久化。详见[原文编辑集成](integration.md#原文编辑与本地文件)和[模块写回](extensions.md#模块写回原文)。

核心还导出 `knuthPlass(items, lengths, options?)`、`prepareKnuthPlass(items)`、`texBadness` 及对应类型。准备后的函数可按不同宽度求解同一段落，复用前缀和。
