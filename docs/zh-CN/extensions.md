# 扩展开发

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/extensions) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/extensions.md)

第一次接触模块时，先阅读[内置模块](modules.md)：那里解释模块对象、创建函数、模块名、Markdown 标签，以及 `extensions` 和 `plugins` 的区别。

## 选择接口

| 需求 | 接口 |
| --- | --- |
| 一个带 Markdown 正文的新区块 | defineBlock |
| 一种独立标注类型 | defineAnnotation |
| 组合语法、标注、动作和参数 | defineExtension / RendererExtension |
| 改写某种已有节点的外观 | components |
| 新的解析规则 | micromark + mdast 扩展，必要时 transform |
| 仅修改视觉 | CSS 主题包 + appearance |

所有接口从 `@linloir/limr` 公开导出。第三方包不要导入 src、dist 内部路径或 useRuntime 等未公开接口。完整独立模板见[插件模块包](plugin-packages.md)。

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

支持 `<notice title="提示">…</notice>` 和 `:::notice{title="提示"}`。name 默认同时成为标签名和指令名，可通过 tags / directives 自定义。defineBlock 默认 display: block、selection: content、scope: local。

| NodeRendererProps | 用法 |
| --- | --- |
| node | 当前 AST 节点和静态属性 |
| children | 已经渲染好的子树；优先复用 |
| source | **当前节点**对应的源码片段，不是全文 |
| pending | 所属尾块是否仍在流式生成 |
| renderChildren(nodes, { trailing? }) | 重排已有子树，可在末尾注入纯操作角标 |
| renderValue(tokens?) | 渲染字面量及高亮 token，保留原文选择和标注插入 |
| renderAttribute(name) | 显示属性文本并保留原文坐标 |

不要把 children 转字符串再解析，也不要仅输出 node.value 导致源码映射丢失。无法逐字对应的图表/媒体用 selection: atomic；需要指定可视边界时使用 data-limr-selection-surface。纯操作角标可以使用公开 InlineMarker，不必建立 Annotation。

## 标注卡片由插件拥有

```tsx
import { AnnotationCard, AnnotationMarkdown, defineAnnotation, ToolIcon } from '@linloir/limr';

export const note = defineAnnotation<{ text: string }>({
  type: 'example:note',
  label: 'Note',
  icon: <ToolIcon name="note" />,
  color: '#6B9BD2',
  Content: ({ data, loading, error, retry }) => loading ? <p>Loading…</p>
    : error ? <button onClick={retry}>Retry</button>
    : <AnnotationMarkdown source={data?.text ?? ''} />,
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

SyntaxExtension 支持 micromark、mdast、tags、directives、display、selection、transform 和 scope。transform 默认全文作用域；仅依赖当前局部子树、不会回写前文或读取全局文档语义时才声明 scope: local。context.source 仍是原始全文，position 必须保持原始 UTF-16 坐标。不要先用正则替换 source 再解析。

未知特殊标签安全显示整段原文，内部 Markdown 也作为原文显示。默认配置的未知指令则渲染内部 Markdown，丢弃指令外层标记；未安装任何指令扩展时按基础 Markdown 解析。不完整标签会回退并记录 diagnostics，之后追加再尝试恢复；结束必须 finish 或 streaming=false。扩展 transform 的异常记录为 diagnostic；客户端渲染边界可回退源码，但 React 错误边界不负责捕获服务端渲染异常。

验证应覆盖标签/指令、中文与 emoji、源坐标、流式结束与一次性解析等价、SSR，以及新增交互的浏览器行为。独立分发还需验证真实打包消费，见[插件模块包](plugin-packages.md)。

## 插件本地化

1.0.0 起，组件可用 useLocale() 读取合并后的 locale，以 locale.language 选择自己的文案。AnnotationType.label 接受字符串或 `(locale) => string`；选区动作使用 context.locale。Citation 默认标题随语言切换为 Citation / 引用。保持插件实例稳定即可更新文案，无需重写源文；用户保存的笔记不会被翻译。
