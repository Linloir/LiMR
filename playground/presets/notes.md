# 在文字旁，留下想法

一本书真正属于你，是从写下第一个想法开始的。选中这段话中的 **重要内容**，给它一点颜色，或添上一条旁注。写下来的不必是一段完整的评论，也可以只是一个问题、一个例子，或者一句想在日后重新理解的话。

## 先看见范围

普通脚注在这里留下一个位置[^阅读线索]，不会把整个段落涂成高亮。把鼠标移到角标，可以看到脚注的名称和内容。

==这一小段有明确范围==[^片段说明]，脚注只关联这段文字。==直接把解释写在句子里==^[内联脚注也支持 **Markdown**、`代码` 和 [链接](https://spec.commonmark.org/)。]，适合不想在文末查找定义的短补充。

一个独立的来源角标<ref id="commonmark" />同样只标记当前位置。<ref id="commonmark">只有明确包裹的文字，才会在查看引用时轻轻显色。</ref>

[^阅读线索]: **阅读线索** 是这条脚注的原始标签。保存书名、章节和链接，下一次回来时就有路可循。

[^片段说明]: 脚注紧接在 `==…==` 后面时，关联的是这段高亮；普通脚注只关联角标位置。

<citation id="commonmark" title="CommonMark Specification" url="https://spec.commonmark.org/" summary="Markdown 的语法与参考示例。" description="同一条引用定义可以在正文多个位置使用；引用范围由每个 **ref** 自己决定。" />

## 一段文字，几种想法

阅读时可以先==保留稳定内容，只更新正在变化的部分==[^%%limr:main%%]，再给同一段话留下一条笔记和一个问题。这里的文字范围、黄色高亮、笔记与提问都保存在这份 Markdown 中。

[^%%limr:main%%]: 普通 Markdown 预览器也能读到的备用说明。LiMR 使用后面的标注定义，这条兜底脚注可以省略。

:::limr-annotation{#main-highlight ranges="main" type="highlight" style="background" color="#E5C07B" hidden="false"}
:::

:::limr-annotation{#main-note ranges="main" type="footnote" title="先复述，再验证"}
我的理解是：已经确定的内容可以复用，但 **新定义会影响旧内容** 时，仍然需要重新检查。

- 先确认输入有没有改变。
- 再确认影响是否越过了当前片段。
:::

:::limr-annotation{#main-question ranges="main" type="question"}
为什么这里需要先检查缓存？如果引用定义出现在文章末尾，前面的解释会不会改变？
:::

## 把两处线索连起来

第一处写着==一个事实只保留一个权威来源==[^%%limr:one%%]。另一处强调==界面根据同一份事实推导状态==[^%%limr:two%%]。一条笔记可以同时连接这两个范围。

:::limr-annotation{#shared-note ranges="one two" type="footnote" title="同一条笔记，两处入口"}
这两句话都在讨论减少重复状态。修改这条笔记时，两处入口会显示相同的内容。
:::

:::limr-annotation{#shared-highlight ranges="one,two" type="highlight" style="underline" color="#81B29A"}
:::

稍后再次遇到==保留稳定内容，只更新正在变化的部分==[^%%limr:main%%]时，也能回到刚才的笔记。相同的范围 ID 可以在文中多次出现。

## 可以隐藏颜色，也可以修订判断

==颜色暂时隐去，想法仍然保留==[^%%limr:hidden%%]。查看角标时，仍然能找到这条笔记。

:::limr-annotation{#hidden-highlight ranges="hidden" type="highlight" color="#C08FA3" style="wavy" hidden="true"}
:::

:::limr-annotation{#hidden-note ranges="hidden" type="footnote"}
高亮的隐藏状态不会删除笔记，也不会删掉它在源码里的范围。
:::

这处==最后采用的解释==[^%%limr:revision%%]展示了覆盖规则：同一个标注 ID 以后面的定义为准；同一范围有多个高亮时，也只采用最后一个。

:::limr-annotation{#old-color ranges="revision" type="highlight" color="#E5C07B"}
:::

:::limr-annotation{#new-color ranges="revision" type="highlight" color="#6B9BD2" style="dotted"}
:::

:::limr-annotation{#revised-note ranges="revision" type="footnote"}
最初只记录了结论。
:::

:::limr-annotation{#revised-note ranges="revision" type="footnote"}
后来补上了成立的条件。页面只显示这个更新后的版本。
:::

## 同一种标注，几种写法

==HTML 组件形式==[^%%limr:html%%]和==双冒号兼容形式==[^%%limr:fallback%%]，可以与前面的三冒号定义写在同一篇文章里。它们都不依赖传统的脚注定义。

<limr-annotation id="html-note" ranges="html" type="footnote" title="HTML 形式">

属性保持为字符串，正文可以写 **Markdown**。

</limr-annotation>

::limr-annotation{#fallback-note ranges="fallback" type="question"}
这条定义使用双冒号开始和结束，能否像三冒号定义一样被读取？
::

如果只是想在句子之间留下一个问题，也可以放在这里[^%%limr:point%%]，不必选择一整段文字。

:::limr-annotation{#point-question ranges="point" type="question"}
这是一个零长度的位置标注。它保留角标，不扩大为段落范围。
:::

## 试着把变化写回文章

打开顶部菜单中的「允许修改 Markdown」开关，再选中一段文字使用「添加内联笔记」，或者修改已有的源码标注、点击下面的任务。展开编辑器，可以同时看到对应 Markdown 的变化；完成后可以从「加载」菜单下载这份文档。

==把这条笔记放进原文==[^%%limr:plugin-note%%]使用 Playground 单独提供的内联笔记模块。它与普通的外部旁注并存，关闭「允许修改 Markdown」后仍然可以阅读。

:::limr-annotation{#plugin-note ranges="plugin-note" type="inline-note"}
这是内联笔记模块的内容。可以从当前角标进入查看，也可以选中关联文字，再使用「修改内联笔记」。
:::

- [x] 看过普通脚注的名称与零长度范围。
- [ ] 给同一片段添加一条笔记和一个问题。
- [ ] 修改一条源码标注，确认正文定义同步变化。
- [ ] 隐藏再显示高亮，确认笔记仍然保留。
- [ ] 勾选一个任务，再检查编辑器里的 `[ ]` / `[x]`。

> [!tip]+ 给未来的自己留一点上下文
> 写清楚“我为什么在这里停下”，往往比增加一种颜色更有用。
>
> > 普通注释、定义与提示块使用相近的小标题和正文节奏。
> >
> > > [!question]- 重新阅读时再打开
> > > 什么样的新证据，会让我改变今天的判断？

阅读模式下，源码标注仍然可以查看和复制。是否允许写回由当前模式与模块决定；普通阅读不需要修改原文。
