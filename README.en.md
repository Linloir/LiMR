# LiMR

[![package version](https://img.shields.io/badge/version-1.3.4-blue.svg)](package.json)

[简体中文](README.md) · **English**

**Linloir’s limr Is a Markdown Renderer.** 

LiMR is a React Markdown renderer designed for long-form reading and streaming output, offering an elegant, out-of-the-box appearance alongside extensive customization capabilities. The core package supports a wide range of custom syntax blocks, footnotes, side notes, and a built-in toolbar; it also features streaming content appending and Knuth-Plass fast typesetting, while allowing for functional expansion through modular plugins.

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

## Complete files and loading progress

`AsyncReader` accepts a complete `input` (string, UTF-8 Uint8Array, Blob/File) and a host-owned Worker factory. Choose `loading.mode: 'blocking'` to wait for the complete document, or `'progressive'` for an early read-only preview followed by the full document. Use `loadingFallback={null}` and `onLoadStateChange(state, controls)` to connect one `overallProgress` value, cancellation and retry to your own toolbar or native UI. Loading mode and body DOM windows are configured separately.

See [large-document integration](docs/en/large-documents.md) and [loading and memory performance](docs/en/loading-performance.md): complete 50/75 MiB inputs, complex content, real-paper interactions and peak/idle memory, with default features and explicit measurement boundaries.

## Capabilities

| Scenario | Features |
| --- | --- |
| Reading | CommonMark, GFM tables/tasks, math, Shiki code highlighting, Mermaid diagrams |
| Rich content | Images, figure groups, captions, video, definitions, exercises, nested quotes and Obsidian callouts, citations, original/translated/parallel text |
| Interaction | Responsive contents, annotation sidebar/overlays, complete atomic copying, four highlight styles, `==highlights==` and footnote cards |
| Layout and streaming | Standard, Knuth–Plass, justified; incomplete-syntax states, increment fades, stable selections |
| Integration | Controlled annotations, original UTF-16 offsets, isolated readers, nested scroll containers, SSR |
| Extensions | Custom syntax, conditional renderer replacement, annotation types, selection actions, streaming effects, parameters, CSS theme packages |

Defaults include citations, Markdown footnotes, and embedded annotations using `::%%limr%%{<#id}text::%%limr%%{>#id}` with `:::limr-annotation`. A range can share multiple registered annotation types and one highlight; standalone references bind only to their marker position. `standard()` includes generic parsing and serialization. Supplying `onSourceChange` enables default toolbar highlights and task toggles to update Markdown; the host or integration module saves the file. Ordinary `addAnnotation` stays external, while modules choose source storage with `target: 'source'`. Modules own types, cards and dedicated actions. Playground inline notes and question annotations are example plugins; `question()` is the separate exercise module. See [syntax](docs/en/syntax.md) and [local file integration](docs/en/integration.md#source-editing-and-local-files).

```markdown
Here is ::%%limr%%{<#passage}some **text worth explaining**::%%limr%%{>#passage}.

:::limr-annotation{#note ranges="passage" type="footnote"}
The annotation body also supports **Markdown**.
:::
```

Opening and closing boundaries use the same range ID and activate only when a complete annotation definition references that ID. Ranges can cross formatting and paragraphs or occur inside code; nested or crossing ranges use distinct IDs. Definition blocks shown inside code examples do not activate boundaries.

```markdown
<definition title="Definition">

Use **Markdown** inside custom blocks.

</definition>

This passage has a source<ref id="paper" />.

<citation id="paper" title="Reference" url="https://example.com/paper" summary="Short summary" />
```

Default body components support matching tags, `:::` containers and paired `::` directives: for example, `::definition{title="Definition"}` followed by its body and a standalone closing `::`. Mermaid accepts `mermaid` code fences or `::mermaid`; diagram mode supports zoom, drag panning, and keyboard/wheel navigation.

## Typography and streaming

Tables use the built-in adaptive layout by default. Since 1.3.1, `parameters={{ tableLayout: false }}` selects native browser layout, while `tableLayout: { algorithm }` lets a host or plugin replace the planner. The default algorithm, measurement and caches are preserved. See [table layout](docs/en/table-layout.md).

`typography` accepts `standard` (default), `knuth-plass`, or `justify`. KP uses TeX's box/glue/penalty paragraph optimization and Knuth–Liang English hyphenation, caches measurements and prepared breakpoints, and retains typeset nodes while scrolling. Browser font measurements do not guarantee pixel-identical TeX PDF output. The [KP performance report](docs/en/knuth-plass-performance.md) covers solving, Scikit Learn scrolling/resizing and measurement boundaries; the [renderer report](docs/en/performance.md) compares react-markdown and Markstream.

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

`main` contains source; `pages` contains only generated files. Keep GitHub Pages set to **Deploy from a branch → pages → /(root)**. Pushing `main` runs [Deploy Playground](https://github.com/Linloir/LiMR/blob/main/.github/workflows/playground.yml): it checks source and documentation, builds the site, updates `pages`, explicitly requests a Pages build, and verifies the live source revision. It also supports manual runs from Actions and uses the repository's `GITHUB_TOKEN`, with no extra deployment key.

```sh
pnpm test:docs
pnpm build:playground
pnpm preview:playground --port 4174
# http://127.0.0.1:4174/LiMR/
```

The output is `demo-dist/`, including `.nojekyll`, bilingual Docs, examples, current-version Skill ZIPs, `build-info.json`, and `SHA256SUMS`. For local deployment, verify the output, sync it into a separate `pages` worktree, and push that branch. Change the build/preview `--base` when deploying under another repository name. README and docs describe repository source; check your installed npm version's exports/types, or use `pnpm pack` to consume the current source.

[MIT License](LICENSE). Developed with Codex.
