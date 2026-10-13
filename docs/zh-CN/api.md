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
| streaming | false |
| documentId | 自动生成；显式值应稳定且页面内唯一 |
| extensions | standard()，完整扩展清单 |
| plugins | 追加到默认或显式清单 |
| parameters | 文档级模块参数覆盖 |
| components | 按 AST 类型/特殊标签覆盖 NodeRenderer |
| annotationTypes | 按 type 追加/覆盖标注呈现 |
| annotations | 不传则内部管理；传入则受控 |
| onAnnotationsChange | 下一份外部标注数组，包含 highlight；受控编辑必须回传 |
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
| Reader | toc=true、sidebar=true、fillHeight=true、sidebarBreakpoint=1120、actions、followOutput=false、className/style |
| Markdown | interactive=true、followOutput=false、className/style |
| DocumentProvider | children；为下方组件提供上下文 |
| TableOfContents | title、maxDepth=6、followActive=true、topInset=24、updateHash=false、className/style |
| AnnotationSidebar | sync='document' / 'none'、gap=14、positioner=alignSidebar、renderCard、className/style |
| AnnotationOverlay | disabled=false、portalRoot、previewWidth=340、maxHeight='80dvh' |
| SelectionToolbar | actions、portalRoot、maxPanelHeight=260、render、className/style |
| AnnotationCard | AnnotationOverlayCardProps 加必填 title 和可选 bodyLabel |
| AnnotationContent | annotationId、presentation、expanded=true、enabled=true |
| AnnotationGroup | occurrence、presentation、expanded=true、enabled=true |
| AnnotationMarkdown | MarkdownProps，source 必填；默认 interactive=false |
| InlineMarker | label 必填，color、children 和 button 属性/ref |
| ToolIcon | name 与 SVG 属性；如 note、copy、highlight、comment、zoom-in、zoom-out、source、image |

除独立 Markdown 和 Reader 外，共享组件/hooks 应位于 Provider 内。AnnotationCard 是浮层内容模板，不负责自建 portal。sidebar.renderCard 接收 `{ occurrence, active, activate }`；toolbar.render 接收 `{ context, actions, run }`。

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

DocumentSnapshot 包含 id、revision、source、streaming、blocks、headings、definitions、footnotes、footnoteOrder、annotations、occurrences、diagnostics、metrics。这里 annotations 是**源内解析得到的数据**；外部受控数据使用 useAnnotations，不要混淆两个集合。

其他核心导出包括 walk、textContent、rangeOf、intersects、safeUrl、mapText、selectionFromRange、replaceExtension、resolveAnnotationAnchors、annotationReferenceRange、sameRange、defaultHighlight、LruCache、ResourceCache。ResourceCache.acquire 返回 promise/release；invalidate 可按 key 或全部失效。

`inlineHighlights({ color?, component? })` 与 `footnotes(annotationTypeOptions?)` 都在 `standard()` 中。`HighlightData.readOnly` 限制默认高亮工具栏为复制与提示；`AnnotationOccurrence.referenceRange` 可将角标的源位置与它引用的文字范围分开。

核心还导出 `knuthPlass(items, lengths, options?)`、`prepareKnuthPlass(items)`、`texBadness` 及对应类型。准备后的函数可按不同宽度求解同一段落，复用前缀和。
