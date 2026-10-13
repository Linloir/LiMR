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

[^stream-note]: 高亮来自 Markdown 源码，所以工具栏只提供复制。脚注与普通标注共用角标、侧栏和窄屏卡片。

> [!tip]+ 嵌套阅读提示
> 文本逐步出现时，只对新增部分淡入。
>
> > 普通注释也可以继续嵌套。
> >
> > > [!example]- 展开看一看
> > > 折叠状态会在后续文本抵达时保留。
