# Default syntax

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/syntax) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/syntax.md)

**Modules** are configuration objects that add capabilities such as formulas, videos, or citations. A factory is called in application code to return an object; the module name is its `name` property, used for replacement and removal; tags and directives are the syntax written in Markdown. See [built-in modules](modules.md) for concepts and configuration.

The ten modules below ship with `@linloir/limr`. `Reader`, standalone `Markdown`, and `DocumentProvider` enable all of them through `standard()` by default; core-only `createDocument()` starts with CommonMark. The following sections include source and rendered examples, using LiMR itself.

## Module catalog

| Factory (application code) | Module name (name) | Capability | Registered tags / directives |
| --- | --- | --- | --- |
| `gfm()` | `gfm` | Tables, strikethrough, tasks, autolinks, standard footnotes | None |
| `math()` | `math` | Inline and display math | `$…$`, `$$…$$` |
| `codeHighlight()` | `code-highlight` | Shiki fenced-code highlighting | Standard code fences |
| `definition()` | `definition` | Definitions | Tags: definition, title, content; directive: definition |
| `question()` | `question` | Exercises and answers | question and child tags below; directive: question |
| `extras()` | `extras` | Further reading | Tags: extras, extra; directive: extras |
| `video()` | `video` | Native video, YouTube, Bilibili | Tags: video, md-video; directive: video |
| `figures()` | `figures` | Figure groups and captions | Tags: figures, figure, figcaption, caption, img; directives: figures, figure, figcaption |
| `citation()` | `citation` | Reference definitions and markers | Tags: citation, ref; no directives |
| `translations()` | `translations` | Original, translated, and parallel text | Tags and directives: translations, origin, translation |

These are registered static tags in Markdown, not an arbitrary MDX/HTML execution environment. Use string attributes such as `multi="true"` and `answer="[0,2]"`. Do not use `answer={[0,2]}`, event functions, or spread attributes. Unregistered HTML is displayed as text; expressions are not executed and may produce diagnostics. Keep blank lines between block tags and their Markdown content.

## CommonMark and GFM

````markdown
# Heading

**Bold**, *italic*, ~~deleted~~, [link](https://example.com), `inline code`.

> A blockquote, labelled Note by the default renderer.

- A list item
- [x] Complete
- [ ] Pending

| Name | Description |
| --- | --- |
| LiMR | Markdown renderer |

```typescript
const value = 42;
```

A standard footnote[^note].

[^note]: Content at the end of the document.
````

Rendered result (interactive where applicable):

#### Example heading

**Bold**, *italic*, ~~deleted~~, [link](https://example.com), `inline code`.

> A blockquote, labelled Note by the default renderer.

- A list item
- [x] Complete
- [ ] Pending

| Name | Description |
| --- | --- |
| LiMR | Markdown renderer |

```typescript
const value = 42;
```

A standard footnote[^syntax-note].

[^syntax-note]: Content at the end of the document.

Standard `[^note]` footnotes appear at the end; `<ref>` opens an annotation card. Ordinary Markdown supports `![Description](/image.png)`. Raw HTML is not passed through to the DOM. Register an extension or override `components` to customize rendering.

## Math and code

```markdown
Inline: $E = mc^2$.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
```

Rendered result (interactive where applicable):

Inline: $E = mc^2$.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$

Import `@linloir/limr/math.css`. Configure formulas with `math({ macros, strict })`. Fenced language names select Shiki highlighting. Highlighting loads near the viewport; streaming code waits for a 180ms pause. Code over the default 100,000-character limit, unsupported languages, and languages outside the configured list retain readable source. Configure `codeHighlight({ languages, lightTheme, darkTheme, eager, maxLength })`.

## Definitions

```markdown
<definition title="Entropy">

A measure of uncertainty: $H(X)$.

</definition>
```

Rendered result (interactive where applicable):

<definition title="Entropy">

A measure of uncertainty: $H(X)$.

</definition>

Use child tags for rich titles and an explicit body:

```markdown
<definition>

<title>**Entropy** / 熵</title>

<content>

The body supports Markdown.

</content>

</definition>
```

The `title` attribute is text. Child tags support rich content. The directive form is `:::definition{title="Entropy"}`, closed by `:::`.

## Exercises

```markdown
<question title="Which numbers are even?">

<question-content>Select all correct options.</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>Consider divisibility by 2.</question-hint>

<question-answer>2 and 4 are even.</question-answer>

</question>
```

Rendered result (interactive where applicable):

<question title="Which numbers are even?">

<question-content>Select all correct options.</question-content>

<question-sel-grp multi="true" answer="[0,2]">

<question-sel>2</question-sel>

<question-sel>3</question-sel>

<question-sel>4</question-sel>

</question-sel-grp>

<question-hint>Consider divisibility by 2.</question-hint>

<question-answer>2 and 4 are even.</question-answer>

</question>

Answer indices are **zero-based**. `multi` is off by default. `answer` is a string containing a JSON array or a single index. Attributes on the selection group take precedence over question attributes. Hints and answers expand independently; configured answers enable submission, scoring, and retry. This module neither connects to AI nor creates question annotations.

## Further reading

```markdown
<extras>

<extra title="Read more" url="https://example.com/article" desc="Background material." />

</extras>
```

Rendered result (interactive where applicable):

<extras>

<extra title="Built-in modules" url="https://linloir.github.io/LiMR/#/docs/en/modules" desc="Background material." />

</extras>

`extra` uses `title`, `url`, and `desc`. Links pass through the built-in URL filter.

## Citation cards

```markdown
One source<ref id="a" />, or several<ref ids='["a","b"]' />.

<ref id="a">Referenced **text**</ref>

<citation id="a" title="Source A" url="https://example.com/a" description="Full **Markdown** description." summary="Short collapsed summary." />

<citation cite-id="b" title="Source B" url="https://example.com/b" desc="Legacy attribute name." />
```

Rendered result (interactive where applicable):

One source<ref id="a" />, or several<ref ids='["a","b"]' />.

<ref id="a">Referenced **text**</ref>

<citation id="a" title="Source A" url="https://example.com/a" description="Full **Markdown** description." summary="Short collapsed summary." />

<citation cite-id="b" title="Source B" url="https://example.com/b" desc="Legacy attribute name." />

Citation IDs use `cite-id`, then `id`. Descriptions use `desc`, then `description`. References use `cite-from-ids`, `ids`, then `id`, accepting JSON arrays or comma-separated strings. Definitions do not occupy body space, and multiple markers can reference one definition.

Citations do not expand into large cards by default; clicking pins the preview. Collapsed summaries fall back through `summary → description → safe URL → title`, with Markdown stripped. Card content uses description, then summary. Hovering or activating a reference temporarily highlights its nearest text block (paragraph, heading, list item, or table cell), without saving a highlight. External range annotations use their bound range. See [annotations and selection](annotations.md).

## Images, figures, and captions

```markdown
<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="/figures/a.png" alt="Experiment A" caption="(a) Experiment A" />

<figure id="experiment-b">

![Experiment B](/figures/b.png)

<figcaption>**(b)** A Markdown caption.</figcaption>

</figure>

<figcaption>Figure 1 · Two experiments.</figcaption>

</figures>
```

Rendered result (interactive where applicable):

<figures columns="2" min-width="220" max-width="560" max-height="480">

<figure src="../assets/source.svg" alt="Experiment A" caption="(a) Experiment A" />

<figure id="experiment-b">

![Experiment B](../assets/rendered.svg)

<figcaption>**(b)** A Markdown caption.</figcaption>

</figure>

<figcaption>Figure 1 · Two experiments.</figcaption>

</figures>

A figure can stand alone. Supply an image through `src` / `url`, nested Markdown, or `<img src="…" alt="…" />`. Use one image per figure and figures for groups. Captions can use an attribute or figcaption / caption child tags; use children for rich text. `id` provides an in-page link target.

| Attribute | Default | Meaning |
| --- | --- | --- |
| `min-width` / `min-height` | 220 / 120 | Determines when another column fits; narrow containers take priority |
| `max-width` / `max-height` | 560 / 480 | Image bounds preserving aspect ratio; none / false removes a bound |
| `columns` / `cols` | Automatic | Requested columns, capped at 24 |
| `rows` | Automatic | Derives columns from image count when columns are omitted |
| `responsive` | true | Reduces explicit columns when space is insufficient; false keeps them |
| `gap` | 16 | Group gap in pixels |

Dimensions accept nonnegative numbers or px. Figures inherit group limits and can override them. Factory options use camelCase, such as `figures({ maxHeight: 360, maxWidth: false })`. Images retain their aspect ratio, and captions are not cropped. A single figure copies the image URL; a group copies Markdown source. Neither copies image bytes.

Directive example:

```markdown
:::figures{columns="2"}
::figure{src="/a.png" caption="A"}
::figure{src="/b.png" caption="B"}
:::
```

## Video

```markdown
<video src="/demo.mp4" provider="native" title="Demo" />

<md-video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />

<video url="https://www.bilibili.com/video/BV1xx411c7mD/?p=2" />
```

`url` takes precedence over `src`. `provider` defaults to auto and also accepts native, youtube, and bilibili. YouTube supports watch, short, embed, shorts, and live URLs with start times. Bilibili supports BV/av IDs and parts. Other attributes are title and loading.

**The default is `loading="visible"`**: the player mounts within 200px of the viewport without autoplay. click waits for a click; eager mounts immediately. Set a module default with `video({ loading: 'click' })`. Actual playback depends on the platform, network, and embedding permissions; local iframe tests do not guarantee remote playback. Use `video({ resolveUrl })` for a custom provider.

Click-to-load example (no player is created before clicking):

<video url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" title="Video example" />

## Translations

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

Rendered result (interactive where applicable):

<translations default="both">

<origin>

Original **Markdown**.

</origin>

<translation>

翻译后的 **Markdown**。

</translation>

</translations>

`default` accepts origin, translation, or both, defaulting to origin unless overridden by the factory's defaultMode. The marker cycles through these modes. Parallel mode shows the translation first. During streaming, an available side is shown while the other is missing. This module does not translate content automatically.

Global `parameters.translationMode` overrides individual blocks. Pass onTranslationModeChange to accept marker requests; without a callback, a global mode is locked. Setting it to undefined restores local choices. See [application integration](integration.md).

## Selection and replacement

Persistent highlights are annotations; there is no built-in `==highlight==` syntax. Register plugins for custom tags. Not every child tag has a corresponding directive. See [extension development](extensions.md) to select or replace default modules.
