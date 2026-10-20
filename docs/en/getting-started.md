# Getting started

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/getting-started) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/getting-started.md)

## Install

```sh
npm install @linloir/limr
```

The host needs React / React DOM 18.3 or 19 and Node.js 20+. Use an ESM-capable build tool such as Vite and import CSS explicitly.

## Render your first article

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const source = `# LiMR

Read **Markdown**, $E=mc^2$, and this reference<ref id="guide" />.

| Feature | Description |
| --- | --- |
| Tables | Adaptive column widths and full-content previews |
| Code | Folding, wrapping and optional line numbers |

<citation id="guide" title="Guide" url="https://example.com/guide" />`;

export function Article() {
  return <Reader source={source} documentId="first-article" theme="auto" />;
}
```

Wide readers show contents, body and an annotation sidebar. Below `sidebarBreakpoint` (1120px by default), annotations use overlay cards; narrow-screen contents are collapsible. `standard()` already enables math, code, figures, citations, Mermaid, callouts, highlights, footnotes and bilingual content.

**The table above already uses adaptive layout**: columns and rows respond to content and available width, with annotation previews for clipped cells. This works independently of paragraph typography. Long code blocks start folded and offer per-block expansion, wrapping and copying. See the [syntax manual](syntax.md) for content forms and [table layout](table-layout.md) for policies.

For optional regex/case-sensitive reading search, add `search` to Reader or AsyncReader. Search is disabled by default; Playground’s **Search** button lets you try it while retaining native browser Ctrl/Cmd+F. See [reading search](search.md) for an independent component, custom controls and highlighting.

## Choose an entry point

| Input / scenario | Use |
| --- | --- |
| Ordinary article already available as text | `Reader source={source}` |
| Complete large file, Blob, UTF-8 bytes or long string | `AsyncReader input={input}` + Worker; see below |
| Chat stream or generated answer | `Markdown` or `Reader`, accumulated source, streaming=true while generating and false at completion |
| Short embedded excerpt | `Markdown source={source}`; interactive=false for static content |
| Custom contents/body/annotation layout | One `DocumentProvider` with `<Markdown />` and other views |

`Markdown` mounts no toolbar automatically. Omit source on a provider's primary Markdown to share its document. Passing source to Reader/Markdown does not automatically parse in a Worker; choose AsyncReader for complete large files.

## Load large documents

This Vite-style example lets a user select a file. Keep the input and Worker factory stable instead of recreating them during progress updates.

```tsx
import { useState } from 'react';
import { AsyncReader } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

const loading = {
  mode: 'blocking' as const,
  worker: () => new Worker(new URL('./limr-worker.ts', import.meta.url), {
    type: 'module',
  }),
  fallback: 'error' as const,
};

export function FileReader() {
  const [file, setFile] = useState<File | null>(null);
  return <>
    <input type="file" accept=".md,.markdown,text/markdown"
      onChange={event => setFile(event.target.files?.[0] ?? null)} />
    {file && <AsyncReader input={file} loading={loading} />}
  </>;
}
```

Create `limr-worker.ts` beside the component:

```ts
import '@linloir/limr/worker';
```

The built-in loading card provides overall progress, cancellation and retry. `blocking` waits for complete parsing and indexing; `progressive` can show a read-only, incomplete preview earlier. Both can use a Worker and ultimately retain complete source and AST. The example chooses `fallback: 'error'` to report an unavailable Worker explicitly; the default permits main-thread fallback.

AsyncReader chooses body windowing by document size to reduce offscreen DOM. This does not mean parsing only the screen or memory independent of file size. For a host progress bar, use `onLoadStateChange(state, controls)` with `loadingFallback={null}`. The host owns bundling, CSP and Worker URLs. See [large documents](large-documents.md) for progress, windowing fallback, bookmarks, printing and custom Worker contracts.

## Adjust reading policies

Use parameters for common presentation settings without replacing the default renderer:

```tsx
import { Reader } from '@linloir/limr';

export function ConfiguredReader({ source }: { source: string }) {
  return <Reader source={source}
    parameters={{
      tableLayout: { maxColumnWidth: 720 },
      codeBlock: {
        autoCollapse: true, collapseAfterLines: 20, collapsedLines: 8,
        wrap: false, lineNumbers: true,
      },
    }} />;
}
```

| Need | Configuration / behavior |
| --- | --- |
| Ordinary or dense tables | Omit tableLayout for adaptive layout and full-content previews |
| Browser-native table dimensions | `tableLayout: false`; retain GFM and horizontal scrolling, skip measurement and derived previews |
| A custom table algorithm | `tableLayout: { algorithm }`; retain measurements, caches and previews; see the [contract](table-layout.md) |
| Start long code expanded | `codeBlock.autoCollapse: false`; manual folding stays available |
| Wrap code by default | `codeBlock.wrap: true`; defaults to false, every block can toggle it |
| Explicitly limit expanded code height | `codeBlock.maxExpandedLines: 40`; the default `false` fully expands with document scrolling |
| Show code line numbers | `codeBlock.lineNumbers: true`; defaults to false, numbers stay out of selection/copy |
| Optimize paragraph breaks / use browser justification | `typography="knuth-plass"` / `"justify"`; default is `"standard"` |

Code exceeding 20 source lines (or wrapped visual rows) starts folded to 8 rows, with hidden/total counts in an animated footer. Expanded code follows the page without an inner vertical scrollbar; huge blocks retain deferred segment layout, so one giant fence does not turn off book windowing. Fold/wrap choices belong to the current reader, with up to 256 modified blocks cached across offscreen unmounts; Markdown stays unchanged and printing expands content. Indivisible oversized inline formulas scroll locally. See [code controls](syntax.md#code-block-controls) for parameter/plugin precedence. Table layout, paragraph typography and code options are independent.

## Choose styles and persistence

| Import | Includes |
| --- | --- |
| `@linloir/limr/styles.css` | Default theme, layout, interactions and Maple code fonts |
| `@linloir/limr/styles/base.css` | The same styling without Maple font imports |
| `@linloir/limr/fonts.css` | Maple only, normally combined with base.css |
| `@linloir/limr/math.css` | KaTeX styles and local formula fonts |

Choose styles.css or base.css; add math.css for formulas. Body fonts come from the host/system; Playground's Noto Serif SC is not loaded by the library. Themes use `appearance` and CSS that also reaches portals; see [styles and fonts](styles.md).

The reader does not save files automatically. Use `annotations/onAnnotationsChange` for external annotation data. Provide `onSourceChange` to enable task toggles, source highlights and module edits; accept memory changes synchronously, then queue persistence in the host. Use stable document identity and a new React key when changing files. See [integration](integration.md) for copyable persistence, streaming, scroll-container and SSR examples.

## Next steps

- Author content: [syntax manual](syntax.md), from CommonMark to images, translations and source annotations.
- Choose an integration: [application integration](integration.md), [large documents](large-documents.md), [tables](table-layout.md).
- Customize: [extension development](extensions.md) explains when to use parameters, CSS, components or plugins and includes the packaging workflow.
- Use AI assistance: [AI Skills](ai-skills.md); limr-use for consumers and limr-plugin-development for plugin authors.
