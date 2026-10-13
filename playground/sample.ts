export const sample = `# 阅读，从容一点

LiMR 将正文、目录、引用和选区连接在一起。这里的 **重要内容** 可以被选中、复制或高亮；界面会保留你正在阅读的位置。

## 排版与细节

有些内容值得慢慢读。清晰的段落、适度的留白和安静的色彩，让注意力留在文字本身。支持中文、English、emoji 🌱 与行内代码 \`const reader = createDocument(source)\`。

> 阅读不仅是获取信息，也是将不同想法联系起来的过程。

<ref cite-from-ids='["commonmark"]'>标准化的 Markdown 语法，让同一份内容可以在不同应用间流动。</ref>

<citation cite-id="commonmark" title="CommonMark Specification" url="https://spec.commonmark.org/" desc="Markdown 的语法与参考示例。支持 **富文本** 描述。" />

### 表格与列表

| 能力 | 默认支持 | 可以替换 |
| :--- | :---: | :---: |
| 引用角注 | ✓ | ✓ |
| 自定义语法 | ✓ | ✓ |
| 高亮与选区 | ✓ | ✓ |

- [x] 原始 Markdown 坐标
- [x] 长文与流式输出
- [ ] 留出新的想法

## 公式与代码

行内公式 $E = mc^2$ 与独立公式使用相同的渲染能力：

$$
\\int_0^1 x^2 \\, dx = \\frac{1}{3}
$$

\`\`\`typescript
import { Reader, standard, defineBlock } from 'limr';

const extensions = [
  ...standard(),
  defineBlock({ name: 'notice', component: Notice }),
];
\`\`\`

## 自定义区块

<definition title="渐进式渲染">

<content>

复用已经稳定的区块，更新仍在生成的尾部；当新的引用定义影响前文时，重新处理相关内容。

</content>

</definition>

<question title="哪个部分负责显示正文？">

<question-content>请选择一个组件。</question-content>

<question-sel-grp answer="[0]">

<question-sel>Markdown</question-sel>
<question-sel>TableOfContents</question-sel>

</question-sel-grp>

<question-hint>它也可以独立使用。</question-hint>
<question-answer>**Markdown** 负责正文显示，其余组件按需订阅文档状态。</question-answer>

</question>

<extras>

<extra title="阅读 CommonMark" url="https://spec.commonmark.org/" desc="了解 Markdown 的基础语法。" />

</extras>

## 更远的地方

一个可扩展的阅读器，应该允许应用决定它的用途。菜单动作可以由插件提供，卡片可以是参考资料，也可以是属于你的交互工具。[^design]

[^design]: 插件的内容同样可以使用 LiMR 渲染，并拥有独立的目录和选区作用域。

## 留在同一段文字上的几种想法

读到一个值得停留的句子，不一定要立即决定它属于哪一种笔记。可以先留下一点颜色，再补一个问题；也可以直接写旁注，让它成为以后重新阅读的入口。旁注、笔记、提问与脚注能够同时关联同一片段，各自保存不同的内容。

把鼠标停在工具栏左侧的色块上，可以选择颜色和高亮样式。底色适合提醒，下划线适合强调，点线和波浪线则可以留给仍然开放的问题。已有笔记的片段可以暂时隐藏高亮，文字旁的想法依然保留。

## 从句子到段落

短句能快速传递意思，长段落则给思考留下回旋的空间。阅读界面需要同时容纳这两种节奏：标题提供方向，段落承担推理，引用与脚注让读者能够离开主线，再回到刚才的位置。

当一段话同时包含事实、解释与判断时，可以分别选中它们，留下不同的批注。这不只是分类练习，也是在检验自己是否理解了作者真正说过什么，以及哪些内容是自己补充的推断。

> 有时，理解的进步不是多记住了一句话，而是终于能够把两个原本混在一起的问题分开。

## 让笔记可以继续生长

点击工具栏中的旁注或笔记，会直接打开编辑器。在较宽的窗口中，它与正文并排显示；在手机上，它成为一张可以展开的卡片。写完后保存，再次打开仍然能够修改。

一条笔记可以记录结论，也可以记录结论变化的过程。今天写下的解释，明天可能需要增加一个条件。比起不断创建重复的条目，回到原来的文本旁修订理解，往往更容易看见自己的思考如何发生变化。

## 换一篇文章，继续阅读

顶部的“加载”菜单里提供了更长的练习文本、开源项目的 README、文学作品与论文。代码文档适合检验列表和配置项，小说适合连续阅读，论文适合在论述与表格之间切换。同一个阅读器，可以为这些不同的文本保留一致的操作习惯。

点击“编辑”修改文章，再点击同一位置的“保存”返回阅读，文本就会保存在当前浏览器中。阅读时新增或修改的批注也会自动保存。下一次回来，可以继续从上一次留下的问题开始。
`;
