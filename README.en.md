# LiMR

[![npm version](https://img.shields.io/npm/v/@linloir/limr.svg)](https://www.npmjs.com/package/@linloir/limr)

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
| Reading | CommonMark, GFM tables/tasks/footnotes, math, Shiki code highlighting |
| Rich content | Images, figure groups, captions, video, definitions, exercises, further reading, citations, original/translated/parallel text |
| Interaction | Responsive contents, desktop annotation sidebar, narrow-screen overlays, copying, four highlight styles |
| Integration | Controlled annotations, original UTF-16 offsets, isolated readers, nested scroll containers, SSR |
| Extensions | Custom syntax, React renderers, annotation types, selection actions, parameters, CSS theme packages |

The default content annotation type is `citation`; `highlight` provides persistent highlighting. Notes, questions, and chat annotations belong to application plugins. The default `question()` extension renders exercises in the document. See the [syntax reference](docs/en/syntax.md).

```markdown
<definition title="Definition">

Use **Markdown** inside custom blocks.

</definition>

This passage has a source<ref id="paper" />.

<citation id="paper" title="Reference" url="https://example.com/paper" summary="Short summary" />
```

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
- Code highlighting and math load on demand. Video loads near the viewport by default, with a click-to-load option. Remote media may contact its source site.
- The full DOM remains available for browser search, native selection, and printing. Streaming appends reuse stable blocks and finish with a full parse; not every edit is incremental.
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

The local Playground runs at `http://127.0.0.1:4173`. Use `@linloir/limr/core` for parsing without React/DOM. Other entry points are `@linloir/limr/react` and `@linloir/limr/extensions`.

[MIT License](LICENSE). Developed with Codex.
