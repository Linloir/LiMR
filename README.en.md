# LiMR

[![package version](https://img.shields.io/badge/version-1.0.1-blue.svg)](package.json)

[简体中文](README.md) · **English**

**Linloir’s limr Is a Markdown Renderer.** A React Markdown renderer for long documents and streaming output. Body text, navigation, reference cards, selections, and highlights share one document state, and can also be composed into your own interface.

[Live Playground](https://linloir.github.io/LiMR/) · [English docs](docs/en/README.md) · [中文文档](docs/zh-CN/README.md) · [AI Skills](docs/en/ai-skills.md)

## Install and use

```sh
npm install @linloir/limr
# or pnpm add @linloir/limr
```

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = '# Start reading\n\nSupports **Markdown** and $E = mc^2$.';

export default function Article() {
  return <Reader source={source} />;
}
```

Requires React / React DOM **18.3 or 19**, Node.js **20+**, and an ESM-capable build tool. Interactive features target modern browsers; Node SSR is supported. UI labels default to English; pass the exported `chinese` locale for Chinese labels. Import `math.css` when using formulas.

Render just the body, or a growing response:

```tsx
import { Markdown } from '@linloir/limr';

export function Answer({ text, generating }: { text: string; generating: boolean }) {
  return <Markdown source={text} streaming={generating} followOutput />;
}
```

`source` is the complete accumulated string. Set `streaming` to `false` when generation ends. `followOutput` is off by default and pauses when the reader scrolls up. `Markdown` does not include navigation, a sidebar, or a selection toolbar.

## Capabilities

| Scenario | Features |
| --- | --- |
| Reading | CommonMark, GFM tables/tasks, math, Shiki code highlighting, Mermaid diagrams |
| Rich content | Images, figure groups, captions, video, definitions, exercises, nested quotes and Obsidian callouts, citations, original/translated/parallel text |
| Interaction | Responsive contents, annotation sidebar/overlays, complete atomic copying, four highlight styles, `==highlights==` and footnote cards |
| Layout and streaming | Standard, Knuth–Plass, justified; incomplete-syntax states, increment fades, stable selections |
| Integration | Controlled annotations, original UTF-16 offsets, isolated readers, nested scroll containers, SSR |
| Extensions | Custom syntax, conditional renderer replacement, annotation types, selection actions, streaming effects, parameters, CSS theme packages |

Defaults include `citation` and Markdown footnote cards. `highlight` supports editable application annotations; `==text==` creates read-only source highlights. `[^id]` and `^[body]` use comment markers with sidebar/overlay cards, including immediately after highlights. Notes, questions, and chat annotations belong to application plugins; `question()` renders exercises. See the [syntax reference](docs/en/syntax.md).

```markdown
<definition title="Definition">

Use **Markdown** inside custom blocks.

</definition>

This passage has a source<ref id="paper" />.

<citation id="paper" title="Reference" url="https://example.com/paper" summary="Short summary" />
```

Default modules also support `::` directives: for example, `::definition{title="Definition"}` followed by its body and a standalone closing `::`. Tags and `:::` containers remain supported. Mermaid accepts `mermaid` code fences or `::mermaid`; diagram mode supports zoom, drag panning, and keyboard/wheel navigation.

## Typography and streaming

`typography` accepts `standard` (default), `knuth-plass`, or `justify`. KP uses TeX's box/glue/penalty paragraph optimization and Knuth–Liang English hyphenation, caches measurements and prepared breakpoints, and retains typeset nodes while scrolling. Browser font measurements do not guarantee pixel-identical TeX PDF output. The [performance report](docs/en/performance.md) includes Scikit Learn scroll/resize comparisons and measurement boundaries.

Streaming defers incomplete syntax markers. Default modules can show loading states, while code and math display usable intermediate content. New text and special blocks fade in through opacity; existing controls and selections stay stable. Plugins can customize `streaming.Loading` and `streaming.effect`; hosts can override the animation with `streamEffect` or disable it with `false`.

Formulas and diagrams select as atomic units. Selection-toolbar copying retains their complete original source and delimiters, including both `$` signs around inline math. A single block anchors its toolbar below it; copy feedback and button width use nonlinear transitions. See [annotations and selection](docs/en/annotations.md) and [styles](docs/en/styles.md).

## Composition and extensions

`Reader` provides a complete layout. Use `DocumentProvider` with `Markdown`, `TableOfContents`, `AnnotationSidebar`, `AnnotationOverlay`, and `SelectionToolbar` for your own layout. See [application integration](docs/en/integration.md).

```tsx
import { Reader, defineBlock } from '@linloir/limr';

const plugins = [defineBlock({
  name: 'notice',
  component: ({ children }) => <aside className="notice">{children}</aside>,
})];

export function Notice() {
  return <Reader source={'<notice>\n\n**Custom content**\n\n</notice>'} plugins={plugins} />;
}
```

`plugins` appends to the defaults. `extensions` replaces the entire list; `extensions={[]}` uses basic CommonMark. Replace a named extension explicitly with `replaceExtension()`. Keep configuration references stable.

To replace only a content renderer, use `rendererOverrides` with `type`, `component`, and `when` to restrict by language, ancestors, or streaming state. Host rules take precedence. This scopes rendering rules; it is not a security sandbox for third-party code.

Plugins can own the complete card UI (`overlay.Card`), collapsed sidebar summary (`sidebar.Preview`), async loading, and selection actions. Use the [plugin development Skill](skills/limr-plugin-development/SKILL.md) or [package guide](docs/en/plugin-packages.md) to build an installable extension and add it through `plugins`. Examples cover [notes](examples/notes.tsx), a [streaming assistant](examples/assistant.tsx), a [standalone plugin](examples/packages/reading-tools/index.js), and a [CSS theme](examples/packages/paper-theme/index.css). The `@limr-example/*` packages are unpublished local examples.

## AI Skills

| Skill | Purpose |
| --- | --- |
| [limr-use](skills/limr-use/SKILL.md) | Integrate LiMR, author content, configure interaction, and install existing plugins |
| [limr-plugin-development](skills/limr-plugin-development/SKILL.md) | Build standalone module packages with a TypeScript / ESM / CSS starter and validation guidance |

Skills ship in the npm package and can also be downloaded from this repository. Copy the entire skill directory to keep references and templates together. See [download, installation, and invocation](docs/en/ai-skills.md) for Codex project and user scopes.

## Styles and runtime

- `styles.css` includes light/dark styling and local Maple code fonts. `styles/base.css` provides the same styling without loading Maple. Font assets remain in the npm download. Choose one stylesheet.
- `appearance` scopes CSS themes across the reader and portalled controls. Applications or system fonts supply body typography.
- Code highlighting, math, Mermaid, and KP load on demand. Mermaid draws on the client; unclosed streamed diagrams show loading first. Video loads near the viewport by default, with a click-to-load option. Remote media may contact its source site.
- The full DOM remains available for browser search, native selection, and printing. Appends and eligible finalization reuse stable prefixes; definition changes, middle edits, or document-scoped transforms can still require a full parse.
- Unregistered HTML is displayed as text. Markdown-supplied JavaScript expressions are never executed. Custom renderers own their data and remote requests.

See [styles and fonts](docs/en/styles.md), [API](docs/en/api.md), and [performance and limits](docs/en/performance.md).

## Local development

```sh
pnpm install
pnpm dev
pnpm check
pnpm test:docs
pnpm exec playwright install chromium
pnpm test:browser
```

Local development uses Python 3 to generate downloadable Skill archives. The header switches between Playground and LiMR-rendered, bilingual Docs.

Refreshing the Playground restores the default document and standard typography, without automatically restoring the previous document or edits. Save explicitly stores a draft; use Load saved text to reopen it. Language preference is retained separately. The typography dropdown offers all three modes; the streaming demo adds up to five UTF-16 units every 90ms.

The local Playground runs at `http://127.0.0.1:4173`. Use `@linloir/limr/core` for parsing without React/DOM. Other entry points are `@linloir/limr/react` and `@linloir/limr/extensions`.

## Build and publish Pages

`main` contains source; `pages` contains only generated files. GitHub Pages uses **Deploy from a branch → pages → /(root)**. Pushing `main` does not automatically build the site.

```sh
pnpm test:docs
pnpm build:playground
pnpm preview:playground --port 4174
# http://127.0.0.1:4174/LiMR/
```

The output is `demo-dist/`, including `.nojekyll`, bilingual Docs, examples, and updated Skill ZIPs. After verification, sync that directory into a separate `pages` worktree, commit, and push both source and artifact branches. Change the build/preview `--base` when deploying under another repository name. README and docs describe repository source; check your installed npm version's exports/types, or use `pnpm pack` to consume the current source.

[MIT License](LICENSE). Developed with Codex.
