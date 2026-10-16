# 逐字抵达

文字可以一边抵达，一边被阅读。点击上方「流式演示」，在代码还没写完时，试着选中已经出现的文字并复制。

## 等一个完整的想法

::definition{title="渐进呈现"}
普通文字和代码可以逐步展开。需要完整信息的组件，先用一个小圆环等待，再呈现自己的内容。格式符号和半截标签留在幕后。
::

## 留住已经选中的内容

::code{lang="typescript"}
const message = "这句话可以在后续内容抵达时复制";

async function read(stream: AsyncIterable<string>) {
  let source = "";
  for await (const chunk of stream) {
    source += chunk;
    console.log(source);
  }
  return source;
}
::

## 公式也能逐渐成形

::math
\int_0^1 x^2\,\mathrm{d}x = \frac{1}{3}
::

## 保留阅读的节奏

Typography is a sequence of small decisions. Choosing a line break means considering the words that follow, the rhythm of the paragraph, and the space between phrases. A stable stream keeps earlier lines in place while new words arrive; a completed paragraph can take a little more care with its final shape.

::question{title="哪些内容适合渐进呈现？"}
::question-content
代码尚未完成时，已经出现的内容仍然可以阅读和复制。
::
::question-hint
留意已经显示的部分是否保持了相同的位置和选区。
::
::question-answer
可以阅读的中间态持续显示，需要完整数据的模块等待闭合。第三方模块可以自己选择。
::
::

## 等待图表完成

::mermaid
flowchart LR
  A[流式输入] --> B[等待完整语法]
  B --> C[淡入图表]
  C --> D[复制或缩放]
::

## 在段落里留下线索

这段 ==淡蓝色高亮== 可以点击复制。另一段 ==带有脚注的高亮==[^stream-note] 将解释放在侧边；也可以使用 ==内联写法==^[脚注正文支持 **Markdown**，窄屏时会出现在悬浮卡片中。]。

[^stream-note]: 默认阅读模式下，源码高亮的工具栏只提供复制。演示结束后开启「允许修改 Markdown」，可以修改源码高亮，也能选中文字，添加保存回原文的高亮与内联笔记。脚注与普通标注共用角标、侧栏和窄屏卡片。

> [!tip]+ 嵌套阅读提示
> 文本逐步出现时，只对新增部分淡入。
>
> > 普通注释也可以继续嵌套。
> >
> > > [!example]- 展开看一看
> > > 折叠状态会在后续文本抵达时保留。

## 定义可以晚一点抵达

先读到::%%limr%%{<#stable-prefix}已经稳定的内容不必重新生成::%%limr%%{>#stable-prefix}，后面才出现它的笔记和问题。观察角标如何在完整定义抵达后与这段文字关联；不完整的标注头部和正文不会混入文章。

:::limr-annotation{#stable-highlight ranges="stable-prefix" type="highlight" style="underline" color="#81B29A"}
:::

:::limr-annotation{#stable-note ranges="stable-prefix" type="footnote" title="记住稳定边界"}
流式输出可以复用稳定前缀，同时保留当前选区。新的引用定义出现时，仍然需要检查它是否改变了之前的解释。
:::

::limr-annotation{#stable-question ranges="stable-prefix" type="question"}
对于持续增长的表格，哪些行已经确定，哪些行还需要重新解析？
::

## 从一行长成一张表

| 内容 | 已经完成的部分 | 正在变化的部分 |
| --- | --- | --- |
| 普通文章 | 前面的段落 | 最后的段落 |
| 长代码 | 已经到达的字符 | 新追加的字符 |
| 表格 | 已经闭合的完整行 | 末行与新增行 |
| 源码标注 | 已完成的范围和定义 | 尚未闭合的定义 |

- [x] 在输入期间尝试选择和复制。
- [ ] 等演示结束后，再修改任务与源码标注。

流式演示中任务与源码修改暂停，结束后再进行编辑，避免生成中的文本与写回同时争用同一份原文。
