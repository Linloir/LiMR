# Getting started

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/getting-started) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/getting-started.md)

## Install

```sh
npm install @linloir/limr
```

The host needs React and React DOM 18.3 or 19. LiMR is ESM and requires Node.js 20+. Use an ESM-capable build tool such as Vite. The application must import CSS explicitly.

## Complete reader

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = `# LiMR

Supports **emphasis**, tables, code, and $x^2$.

## References

Read this passage<ref id="guide" />.

<citation id="guide" title="Guide" url="https://example.com/guide" />`;

export function Article() {
  return <Reader source={source} theme="auto" />;
}
```

Wide containers show contents, body, and annotations. Below `sidebarBreakpoint` (1120px by default), annotations use an overlay. Contents become a collapsible list on narrow screens.

## Body only

```tsx
import { Markdown } from '@linloir/limr';
import '@linloir/limr/styles/base.css';

export function Excerpt() {
  return <Markdown source="Some **Markdown**." />;
}
```

Standalone `Markdown` retains parsing and selection support but does not mount a toolbar. Set `interactive={false}` to disable selection tracking for static content. Inside a `DocumentProvider`, use `<Markdown />` without `source` to share its document.

## Choose styles

| Import | Includes |
| --- | --- |
| `@linloir/limr/styles.css` | Default theme, layout, interaction, and Maple code fonts |
| `@linloir/limr/styles/base.css` | The same styling without importing Maple font CSS |
| `@linloir/limr/fonts.css` | Maple fonts only, for separate use with base.css |
| `@linloir/limr/math.css` | KaTeX styles and local math fonts |

Choose either styles.css or styles/base.css. Selecting base does not remove font files from the npm download. Body fonts come from the host or system; the Playground's Noto Serif SC is not automatically loaded by the library.

## Next steps

- Read [default syntax](syntax.md) to distinguish built-in content modules from application annotation plugins.
- Read [application integration](integration.md) for streaming, scroll containers, and SSR.
- Install the [limr-use Skill](ai-skills.md) for AI-assisted integration.
