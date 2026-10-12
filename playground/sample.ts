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
`;
