# 默认语法

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/syntax) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/syntax.md)

**模块**是为 LiMR 增加一组能力的配置对象，例如公式、视频或引用。下面的“创建函数”在应用代码中调用，返回模块对象；“模块名”是对象的 `name` 字段，用于替换和移除；“标签 / 指令”才是写在 Markdown 正文中的语法。完整概念和配置方式见[内置模块](modules.md)。

`@linloir/limr` 随包提供以下十个模块。`Reader`、独立 `Markdown` 和 `DocumentProvider` 默认通过 `standard()` 全部启用；纯核心 `createDocument()` 默认只有 CommonMark。下面每节给出源码和实际效果，交互示例由 LiMR 自己渲染。

## 模块清单

| 创建函数（应用代码） | 模块名（name） | 默认能力 | 注册的特殊标签 / 指令 |
| --- | --- | --- | --- |
| `gfm()` | `gfm` | 表格、删除线、任务列表、自动链接、标准脚注 | 无 |
| `math()` | `math` | 行内与块级公式 | `$…$`、`$$…$$` |
| `codeHighlight()` | `code-highlight` | Shiki 围栏代码高亮 | 标准代码围栏 |
| `definition()` | `definition` | 释义 | 标签 `definition`、`title`、`content`；指令 `definition` |
| `question()` | `question` | 练习题与答案 | 标签 `question` 及下文子标签；指令 `question` |
| `extras()` | `extras` | 拓展阅读 | 标签 `extras`、`extra`；指令 `extras` |
| `video()` | `video` | 原生视频、YouTube、Bilibili | 标签 `video`、`md-video`；指令 `video` |
| `figures()` | `figures` | 图组与图注 | 标签 `figures`、`figure`、`figcaption`、`caption`、`img`；指令 `figures`、`figure`、`figcaption` |
| `citation()` | `citation` | 引用定义与角标 | 标签 `citation`、`ref`；不注册指令 |
| `translations()` | `translations` | 原文、译文与对照 | 标签及指令 `translations`、`origin`、`translation` |

这些是 Markdown 中允许的静态标签，不是任意 MDX/HTML 执行环境。使用字符串属性，如 `multi="true"`、`answer="[0,2]"`；不要使用 `answer={[0,2]}`、事件函数或展开属性。未注册 HTML 按文本显示；表达式不执行并可能产生诊断。嵌套块的标签和正文之间保留空行。

## CommonMark 与 GFM

````markdown
# 标题

**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、`行内代码`。

> 引用块，默认界面标题为 Note / 注释。

- 普通列表
- [x] 已完成
- [ ] 未完成

| 名称 | 说明 |
| --- | --- |
| LiMR | Markdown renderer |

```typescript
const value = 42;
```

标准脚注[^note]。

[^note]: 出现在文末的脚注内容。
````

实际效果（可交互）：

#### 标题示例

**粗体**、*斜体*、~~删除线~~、[链接](https://example.com)、`行内代码`。

> 引用块，默认界面标题为 Note / 注释。

- 普通列表
- [x] 已完成
- [ ] 未完成

| 名称 | 说明 |
| --- | --- |
| LiMR | Markdown renderer |

```typescript
const value = 42;
```

标准脚注[^syntax-note]。

[^syntax-note]: 出现在文末的脚注内容。

标准 `[^note]` 是文末脚注，`<ref>` 是标注卡片，两者不同。图片 `![说明](/image.png)` 由普通 Markdown 支持。原始 HTML 不透传到 DOM；需要自定义外观时注册扩展或覆盖 `components`。

## 公式与代码

```markdown
行内公式：$E = mc^2$。

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

实际效果（可交互）：

行内公式：$E = mc^2$。

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

公式需要导入 `@linloir/limr/math.css`；支持通过 `math({ macros, strict })` 配置。代码围栏语言用于 Shiki 高亮。默认接近视口才加载高亮，流式代码暂停更新 180ms 后尝试高亮；超过默认 100,000 字符、未支持或未在允许列表中的语言保留可读源码。`codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })` 可配置。

## 释义

```markdown
<definition title="熵">

表示不确定性的量：$H(X)$。

</definition>
```

实际效果（可交互）：

<definition title="熵">

表示不确定性的量：$H(X)$。

</definition>

富文本标题和指定正文可以使用子标签：

```markdown
<definition>

<title>**Entropy** / 熵</title>

<content>

正文支持 Markdown。

</content>

</definition>
```

`title` 属性按文字渲染；富文本用子标签。也可以写 `:::definition{title="熵"}`，以 `:::` 结束。

## 练习题

```markdown
<question title="哪些是偶数？">

<question-content>请选择所有正确选项。</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>考虑能否被 2 整除。</question-hint>

<question-answer>2 和 4 是偶数。</question-answer>

</question>
```

实际效果（可交互）：

<question title="哪些是偶数？">

<question-content>请选择所有正确选项。</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>考虑能否被 2 整除。</question-hint>

<question-answer>2 和 4 是偶数。</question-answer>

</question>

答案索引从 **0** 开始。`multi` 默认关闭；`answer` 可以是 JSON 数组或单个索引的字符串。属性优先读取选择组，其次读取 `question`。提示和答案可以单独展开，有答案索引时支持提交、判分和重试。它不连接 AI，也不创建问答标注。

## 拓展阅读

```markdown
<extras>

<extra title="继续阅读" url="https://example.com/article" desc="背景和补充材料。" />

</extras>
```

实际效果（可交互）：

<extras>

<extra title="内置模块" url="https://linloir.github.io/LiMR/#/docs/zh-CN/modules" desc="背景和补充材料。" />

</extras>

`extra` 使用 `title`、`url`、`desc`。链接经过内置 URL 过滤。

## 引用卡片

```markdown
一个来源<ref id="a" />，或一组来源<ref ids='["a","b"]' />。

<ref id="a">带引用的 **原文**</ref>

<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />

<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />
```

实际效果（可交互）：

一个来源<ref id="a" />，或一组来源<ref ids='["a","b"]' />。

<ref id="a">带引用的 **原文**</ref>

<citation id="a" title="资料 A" url="https://example.com/a" description="完整的 **Markdown** 说明。" summary="收起时的简短摘要。" />

<citation cite-id="b" title="资料 B" url="https://example.com/b" desc="兼容属性名。" />

`citation` 的 ID 读取 `cite-id`，其次 `id`；说明读取 `desc`，其次 `description`。`ref` 读取 `cite-from-ids`、`ids`、`id`，支持 JSON 数组或逗号分隔字符串。定义本身不占正文位置，同一个定义可以被多个角标引用。

Citation 默认不提供展开大卡片，点击固定预览；摘要按 `summary → description → 安全 URL → title` 回退，去掉 Markdown 标记。正文显示 `description`，没有时显示 `summary`。悬浮或激活时临时高亮引用所在的最近文本块（段落、标题、列表项或表格单元格），不写入已保存高亮；外部范围标注使用绑定范围。配置与存储见[标注与选区](annotations.md)。

## 图片、图组与图注

```markdown
<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="/figures/a.png" alt="实验 A" caption="(a) 实验 A" />

<figure id="experiment-b">

![实验 B](/figures/b.png)

<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>

</figure>

<figcaption>图 1 · 两个实验。</figcaption>

</figures>
```

实际效果（可交互）：

<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="../assets/source.svg" alt="实验 A" caption="(a) 实验 A" />

<figure id="experiment-b">

![实验 B](../assets/rendered.svg)

<figcaption>**(b)** 支持 Markdown 的图注。</figcaption>

</figure>

<figcaption>图 1 · 两个实验。</figcaption>

</figures>

`figure` 可独立使用。图片可以来自 `src` / `url` 属性、内部 Markdown 图片或 `<img src="…" alt="…" />`。每个 figure 放一张图；多张图用 figures。图注可用 `caption` 属性或 `figcaption` / `caption` 子标签，富文本使用子标签。`id` 可作为页内链接目标。

| 属性 | 默认值 | 说明 |
| --- | --- | --- |
| `min-width` / `min-height` | 220 / 120 | 决定何时增加列，窄容器优先适应宽度 |
| `max-width` / `max-height` | 560 / 480 | 保持比例的图片上限；`none` / `false` 取消上限 |
| `columns` / `cols` | 自动 | 指定列数，最多 24 |
| `rows` | 自动 | 未指定列数时由图数推导列数 |
| `responsive` | true | 容器不足时降低显式列数；false 保留列数 |
| `gap` | 16 | 图组间距，像素 |

尺寸接受非负数字或 `px`。图组限制由子图继承，子图可以覆盖。对应工厂参数为驼峰命名，例如 `figures({ maxHeight: 360, maxWidth: false })`。图片不变形、不裁切图注。单图复制按钮复制图片 URL；图组复制按钮复制 Markdown 源码，不下载图片二进制。

指令示例：

```markdown
:::figures{columns="2"}
::figure{src="/a.png" caption="A"}
::figure{src="/b.png" caption="B"}
:::
```

## 视频

```markdown
<video src="/demo.mp4" provider="native" title="演示" />

<md-video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />

<video url="https://www.bilibili.com/video/BV1xx411c7mD/?p=2" />
```

`url` 优先于 `src`；`provider` 默认 `auto`，还可以是 `native`、`youtube`、`bilibili`。YouTube 支持 watch、短链接、embed、shorts、live 和起始时间；Bilibili 支持 BV/av 与分 P。支持 `title` 和 `loading`。

**默认 `loading="visible"`**：在视口附近 200px 挂载播放器，不自动播放。`click` 等待点击，`eager` 立即挂载。可以用 `video({ loading: 'click' })` 设置模块默认值。平台、网络和嵌入权限仍会影响真实播放；不能把本地 iframe 测试当作远程播放保证。自定义平台通过 `video({ resolveUrl })` 接入。

点击加载的视频示例（点击前不创建播放器）：

<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="视频示例" />

## 分段译文

```markdown
<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>
```

实际效果（可交互）：

<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>

`default` 为 `origin`、`translation` 或 `both`，未指定时默认 `origin`（可用工厂 `defaultMode` 改写）。角标依次切换原文、译文、对照；对照时译文在前。流式输入只有一侧时先显示已有内容。模块不提供自动翻译服务。

全局 `parameters.translationMode` 覆盖各块；传 `onTranslationModeChange` 接受角标发出的更改请求，否则全局模式锁定。设回 `undefined` 恢复各块的本地选择。见[项目集成](integration.md)。

## 选择与替换

默认高亮存为 annotation，没有 `==高亮==` 内置语法。自定义标签需注册插件；不是所有子标签都有同名指令。使用完整清单配置或替换默认模块，见[扩展开发](extensions.md)。
