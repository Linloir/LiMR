# Built-in modules

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/modules) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/modules.md)

## What is a module?

LiMR's base parser understands CommonMark: headings, paragraphs, lists, links, images, and code fences. A **module** is a configuration object that adds capabilities, such as formulas, video rendering, or citation cards. Its public TypeScript type is `RendererExtension`, so the API also calls it an extension.

A module can combine parsing rules, React components, annotation types, toolbar actions, and default parameters. It need not include all of them. For example, `math` adds formula syntax and rendering, `code-highlight` colors existing code fences, and `citation` provides both reference syntax and annotation cards.

A **plugin** usually means a module added by your application or supplied by a third-party package. It uses the same interface as built-in modules. An npm package distributes code and can export several modules. Passing a module to `plugins` appends it to the existing configuration.

## Functions, module names, and tag names

Consider video:

```tsx
import { Reader, standard, replaceExtension, video } from '@linloir/limr';

const videoModule = video({ loading: 'click' });
// videoModule.name === 'video'
const extensions = replaceExtension(standard(), videoModule);

export function Article() {
  return <Reader extensions={extensions} source={'<video src="/lesson.mp4" />'} />;
}
```

| Form | Where it belongs | Meaning |
| --- | --- | --- |
| `video` / `video(...)` | Application JavaScript / TypeScript | The imported function / a call that creates a module configuration object |
| `videoModule` | Application code | Your variable name for that object; you can rename it |
| `'video'` | The module object's `name` property | A stable identifier used to distinguish, replace, and remove modules |
| `<video … />` / `<md-video … />` | Markdown content | Two tags registered by the module, using the same video renderer |
| `::video{…}` | Markdown content | A registered directive; a `:::video` container also works |

The names need not match. The code-highlighting factory is `codeHighlight()`, its module name is `'code-highlight'`, and its content uses ordinary code fences without a `<code-highlight>` tag. Writing `video()` or the string `'video'` inside Markdown does not enable a module. Pass the returned object to `plugins`, not a string.

`video({ loading: 'click' })` sets module defaults for that Reader. A `<video loading="eager" … />` tag overrides the setting for one video. Available options vary by module; see [default syntax](syntax.md).

## Ten default modules included with LiMR

These modules ship in `@linloir/limr`; they do not require ten separate npm installations. `standard()` returns an array containing the following ten module objects, each with its default settings.

| Factory function | Object's `name` | Capability and content syntax |
| --- | --- | --- |
| `gfm()` | `gfm` | Tables, `~~strikethrough~~`, tasks, autolinks, `[^id]` endnotes |
| `math()` | `math` | `$…$` inline and `$$…$$` display math; also import math.css |
| `codeHighlight()` | `code-highlight` | Shiki colors for code fences with a language identifier |
| `definition()` | `definition` | `<definition>` cards with a title and Markdown body |
| `question()` | `question` | `<question>` exercises with choices, hints, answers, and local scoring |
| `extras()` | `extras` | `<extras>` / `<extra>` further-reading links |
| `video()` | `video` | `<video>` / `<md-video>` native video, YouTube, and Bilibili embeds |
| `figures()` | `figures` | `<figures>` / `<figure>` responsive groups, single figures, and captions |
| `citation()` | `citation` | `<citation>` source definitions and `<ref>` markers with cards |
| `translations()` | `translations` | `<translations>` original, translated, and parallel views |

Import these functions from `@linloir/limr` or `@linloir/limr/extensions`. `standard()` is a convenience function returning an array, not an eleventh module.

`Reader`, standalone `Markdown`, and `DocumentProvider` automatically use `standard()` when `extensions` is omitted. Your first `<Reader source={source} />` therefore supports these capabilities. Components inside a shared Provider inherit its configuration. Core-only `createDocument()` starts with CommonMark; extensions must be explicit, and it does not display React UI.

Highlight, copy, and annotation deletion are built-in toolbar actions. Highlights are saved as annotation data, not a separate Markdown tag. The Playground's margin notes, reading notes, questions, footnote annotations, and simulated assistant come from example plugins and **are not automatically installed in every Reader**. The `question()` exercise module is also separate from question annotations.

## Choosing a configuration

You do not need to call `standard()` when the defaults suffice. For customization, distinguish three operations:

| Goal | Configuration | Result |
| --- | --- | --- |
| Add your own capability | `plugins={[myPlugin]}` | Keep default modules and append your plugin object |
| Keep only selected capabilities | `extensions={[gfm(), math()]}` | Replace the complete default module list; CommonMark remains available |
| Configure a built-in module | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | Replace video by module `name`, preserving the other modules |

To remove one module, filter the array: `standard().filter(module => module.name !== 'video')`. Use `extensions={[]}` when extension syntax is unnecessary.

Do not append `plugins={[video()]}` while the default video module is present: duplicate module names, tags, or directives throw. Without the corresponding module, unknown tags render as text, unknown directives may retain only their inner Markdown, and unknown annotation data remains with generic fallback UI. See [architecture and behavior](architecture.md) for the precise boundaries.

Next, try the [syntax examples](syntax.md), create modules with [extension development](extensions.md), or distribute them using [plugin packages](plugin-packages.md).
