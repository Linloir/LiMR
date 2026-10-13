# 标注与选区

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/annotations) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/annotations.md)

## 数据模型

`Annotation` 是数据，`AnnotationType` 是插件注册的呈现和加载逻辑，`AnnotationOccurrence` 是一次出现位置。一个标注可以通过 anchors 出现在多处；一个引用角标可以关联多条标注。

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
| `text` | 可读的选中文本 |
| `raw` | 映射得到的原始范围和源码 |
| `syntax` | 仅吸收两端紧邻的标准 Markdown 标记，不扩选未选文字或特殊块外层标签 |
| `blocks` | 选区触及的块范围与源码 |
| `quality` | exact、atomic 或 unmapped |
| `settled` | 指针仍在拖选时为 false |
| `documentId` / `revision` | 选区所属文档快照 |

每种结果包含 ranges 和 sourceText。一般笔记使用 syntax.ranges，并为**每个范围**保存 `document.source.slice(start, end)` 作为 quote。代码支持部分选择；公式和图片作为原子内容。不要用 DOM textContent 长度倒推原文范围，实体、转义和 emoji 会让两者不同。

## 高亮和命令

`highlight` 不需要安装额外的 AnnotationType，data 支持 color、style（background / underline / dotted / wavy）、hidden。删除内容标注与隐藏高亮是不同操作。

| 命令 | 行为 |
| --- | --- |
| `addAnnotation(annotation, options?)` | 添加/替换同 ID 数据；普通内容标注默认同时补充共享高亮 |
| `updateAnnotation(id, partial)` | 浅合并标注字段；data 是整体替换，更新时保留需要的字段 |
| `removeAnnotation(id)` | 移除这一条标注，其他标注和共享高亮保留 |
| `removeAnnotationsAt(ranges)` | 移除精确匹配片段上的标注及高亮；保留它们其他位置的锚点 |
| `editAnnotation(id / null)` | 切换共享编辑状态；设置 ID 时也激活卡片 |
| `activateAnnotation(id / null)` | 激活标注的首个 occurrence，也接受 occurrence ID |

`addAnnotation` 的 `{ highlight: false }` 关闭自动持久高亮，显式 HighlightData 指定样式；`{ edit: true }` 进入编辑。类型配置 `highlight: 'hover'` 时默认不创建持久高亮，但显式传入高亮样式仍可创建。默认选区工具栏为调色板、添加/隐藏高亮、复制、删除；actions 覆盖内置列表，插件动作仍会合并进去。

## Citation 的临时高亮

Citation 默认 `highlight: 'hover'`。角标或侧栏条目悬浮、或引用处于 activate 状态时，用类型 color 的 18% 底色高亮关联文本。底色绘制在文字下方；点击激活后，移开鼠标仍保留，取消激活且不再悬浮后才隐藏。同一段落的激活与悬浮引用不会叠加加深颜色。该效果不更新 annotations，也不改变已保存高亮的 hidden 设置。嵌入 ref 使用最近的段落、标题、列表项或表格单元格；外部范围引用使用自身范围，并以该范围首行对齐侧栏。

侧栏联动使用正文位移动画，不改变页面滚动范围。绘制层在动画过程中及结束、取消时更新可见片段，因此从视口外移入的文本也会同步获得当前悬浮或激活高亮。

使用 `replaceExtension(standard(), citation({ highlight: false }))` 关闭该效果。其他类型也可显式启用 highlight: 'hover'。

## 缺少插件时

当前实现**不会静默忽略未知 annotation 类型**。数据和范围仍保留，可能显示通用圆点角标；没有 Content 时卡片显示本地化的“不可用”及类型名称。缺失 citation 定义也可能显示不可用提示。要保证呈现，应安装对应插件，或由应用决定暂时隐藏哪些标注。

若应用过滤不支持的类型，保留完整的持久化原始数组，并在写回时合并仍隐藏的数据，避免卸载插件导致数据丢失。Playground 的插件勾选目前只启用/关闭动作入口，仍保留卡片渲染器，因此不会模拟完整卸载插件。

## 卡片与异步资源

卡片 UI 由模块注册：Content 渲染内容，overlay.Card 负责完整浮层内部，sidebar.Preview 负责收起时的本地摘要。`AnnotationMarkdown` 在隔离选区作用域内复用 Markdown 配置。

`load(annotation, { signal })` 在内容显示时才调用，同一阅读器内复用请求和有限缓存，不在不同 Reader 间共享。Preview 不调用 load。Content 接收 data、loading、error、retry、editing、presentation、expanded；处理加载和错误 UI 是模块的职责。可通过 useLiMR().invalidateAnnotation(id) 刷新。

动作的 signal 在阅读器销毁时取消，关闭菜单不会取消动作。调用 updateAnnotation 更新流式答案时同时保留问题字段；“停止生成”、重试、认证、会话和保存由应用 adapter 管理。参考[助手示例](../../examples/assistant.tsx)和[扩展开发](extensions.md)。
