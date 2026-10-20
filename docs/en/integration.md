# Application integration

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/integration) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/integration.md)

## Choose a component

| Scenario | Recommended entry | Host responsibility |
| --- | --- | --- |
| Articles, papers, knowledge bases | `Reader` | Supply source and document identity; choose theme and persistence |
| Complete large files or local previews | `AsyncReader` + Worker | Obtain files, supply the Worker URL, handle cancellation/failure and save edits |
| Chat messages and generated answers | `Markdown` or `Reader` + `streaming` | Accumulate text and set false at completion; own transport and stopping generation |
| Editor panels or custom layouts | `DocumentProvider` + one primary `Markdown` | Compose navigation, toolbar, sidebar/overlay; supply the actual scroll container |
| Parsing or server data processing | `createDocument` from the core entry | Configure syntax explicitly; no React or DOM dependency |

Start with the working [quick start](getting-started.md), then choose modules and presentation below. Large-document windows, adaptive tables and code folding address different costs: body DOM count, individual table layout and individual code presentation. They do not replace one another.

Use `Reader` for the complete experience and `Markdown` for standalone content. For a custom layout, one DocumentProvider manages one primary Markdown plus its navigation, cards, and toolbar. Passing source to Markdown inside a provider creates an independent document instead of sharing the parent state.

Reading search is an optional UI component, separate from syntax modules. Enable `Reader search`, supply `search={<YourSearch />}`, or compose `DocumentSearch` / `useDocumentSearch` inside DocumentProvider. Do not add it to `plugins` or `extensions`. [Reading search](search.md) explains controller ownership, placement, host commands and the separate search Worker.

## Modules and configuration

### What is a module?

LiMR's base parser understands CommonMark: headings, paragraphs, lists, links, images, and code fences. A **module** is a configuration object that adds capabilities, such as formulas, video rendering, or citation cards. Its public TypeScript type is `RendererExtension`, so the API also calls it an extension.

A module can combine parsing rules, React components, annotation types, toolbar actions, and default parameters. It need not include all of them. For example, `math` adds formula syntax and rendering, `code-highlight` colors existing code fences, and `citation` provides both reference syntax and annotation cards.

A **plugin** usually means a module added by your application or supplied by a third-party package. It uses the same interface as built-in modules. An npm package distributes code and can export several modules. Passing a module to `plugins` appends it to the existing configuration.

### Functions, module names, and tag names

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

The complete built-in catalog and copyable content forms live in the [syntax manual](syntax.md#module-catalog). Default readers already include math, code highlighting, figures, citations, translations, Mermaid, callouts, footnotes and source annotations. Playground reading notes, margin notes and the simulated assistant are example plugins, not default capabilities.

### Choosing a configuration

You do not need to call `standard()` when the defaults suffice. For customization, distinguish three operations:

| Goal | Configuration | Result |
| --- | --- | --- |
| Add your own capability | `plugins={[myPlugin]}` | Keep default modules and append your plugin object |
| Keep only selected capabilities | `extensions={[gfm(), math()]}` | Replace the complete default module list; CommonMark remains available |
| Configure a built-in module | `extensions={replaceExtension(standard(), video({ loading: 'click' }))}` | Replace video by module `name`, preserving the other modules |

To remove one module, filter the array: `standard().filter(module => module.name !== 'video')`. Use `extensions={[]}` when extension syntax is unnecessary.

Do not append `plugins={[video()]}` while the default video module is present: duplicate module names, tags, or directives throw. Without the corresponding module, unknown tags render as text, unknown directives may retain only their inner Markdown, and unknown annotation data is retained without markers, cards or interactions until its type is registered again. See [architecture and behavior](architecture.md) for the precise boundaries.

## Complete files and external progress

Use `AsyncReader input={file}` with a host-owned Worker factory for large complete inputs. `loading={{ mode: 'blocking' }}` waits for the full document; `progressive` can show a read-only preview sooner. Both ultimately parse and index the complete input. This is a separate entry point from the growing-source streaming example below.

LiMR supplies the default loading card. Pass `loadingFallback={null}` and connect `onLoadStateChange(state, controls)` to a toolbar, native VS Code progress or a status item using `state.overallProgress`, errors and `controls.cancel/retry`. Playground uses the same interface for one progress bar across both modes. Across a process bridge, send serializable state and route cancel/retry messages back to the session owner rather than sending functions or the engine.

Keep input objects and Worker factories stable so progress updates do not recreate the document. Snapshots retain complete source; windowed DOM does not mean parsing only the screen. See [large documents](large-documents.md) for working examples and plugin contracts, and [loading and memory performance](loading-performance.md) for measurements.

## Streaming content

```tsx
import { Markdown } from '@linloir/limr';

export function StreamingAnswer({ answer, generating }: {
  answer: string;
  generating: boolean;
}) {
  return <Markdown source={answer} streaming={generating} followOutput />;
}
```

The application owns transport and appends each chunk to the complete answer. Do not pass only the newest chunk as source. The final update must set streaming to false to finalize syntax and semantics. Finalization can reuse stable prefixes; definition changes and other global dependencies may still require a full parse. followOutput follows only while the reader remains near the bottom. The core engine supports append(chunk) / finish(); React props take the accumulated string.

New text and special blocks fade through opacity by default, without replaying the entrance when a paragraph finishes. Use `streamEffect={false}` to disable it or supply `className`, `keyframes`, and `timing`; reduced-motion preferences take precedence. Unclosed modules can show loading states while code/math render progressively. Reuse `children`, `renderChildren`, and `renderValue` to preserve controls and selections. See [extensions](extensions.md).

## Paragraph typography

```tsx
import { useState } from 'react';
import { Reader, type TypographyMode } from '@linloir/limr';

export function TypographyReader({ source }: { source: string }) {
  const [mode, setMode] = useState<TypographyMode>('standard');
  return <>
    <select aria-label="Typography" value={mode}
      onChange={event => setMode(event.target.value as TypographyMode)}>
      <option value="standard">Standard</option>
      <option value="knuth-plass">Knuth–Plass</option>
      <option value="justify">Justified</option>
    </select>
    <Reader source={source} typography={mode} />
  </>;
}
```

`standard` is the default; `justify` uses browser justification; `knuth-plass` enables the paragraph optimizer. `knuthPlass` configures TeX parameters and hyphenation. Streaming tails participate in KP once stable. See [styles](styles.md) and [performance](performance.md) for behavior and measurement boundaries.

## Nested scroll containers

```tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function ScrollPanel({ source }: { source: string }) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  return <div ref={setScrollRoot} style={{ height: '80vh', overflowY: 'auto' }}>
    <Reader source={source} scrollRoot={scrollRoot} scrollOffset={32} />
  </div>;
}
```

Window scrolling needs no scrollRoot. Set scrollOffset for a fixed header and --limr-sticky-top for sticky navigation. Give Reader a new React key when switching to an independent document, plus a stable documentId unique on the page, to recreate task and interaction state.

## Custom composition

This is a fixed desktop layout. Prefer Reader for responsive sidebar switching, collapsible contents, and automatic height. With your own breakpoints, decide when to mount the sidebar or overlay.

```tsx
import { DocumentProvider, Markdown, TableOfContents, AnnotationSidebar,
  SelectionToolbar } from '@linloir/limr';

export function DesktopReader({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <div style={{ display: 'grid', gridTemplateColumns: '180px minmax(0, 1fr) 280px', gap: 24 }}>
      <TableOfContents style={{ position: 'sticky', top: 24, alignSelf: 'start', maxHeight: '80vh' }} />
      <main className="limr-reader-content" style={{ minHeight: '70vh', overflow: 'clip' }}>
        <Markdown />
      </main>
      <AnnotationSidebar />
    </div>
    <SelectionToolbar />
  </DocumentProvider>;
}
```

Keep body and synchronized sidebar in the same scroll container and unscaled coordinate system. A grid row or the host supplies sidebar height. Do not grow the page to the total card height or add a separate scroll container to the synchronized list. Long card bodies can scroll independently. For a drawer or ordinary list, use AnnotationSidebar with sync="none" and let the host constrain height and overflow.

For an overlay layout, mount Markdown, AnnotationOverlay, and SelectionToolbar under the same provider. The two floating components accept portalRoot; Reader does not expose that prop directly, so compose components when it is needed.

## Controlled data and document switching

```tsx
import { useState } from 'react';
import { Reader, type Annotation } from '@linloir/limr';

export function SavedArticle({ id, source }: { id: string; source: string }) {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  return <Reader key={id} documentId={id} source={source}
    annotations={annotations} onAnnotationsChange={setAnnotations} />;
}
```

This illustrates state for one article. In an application, load/store annotations by article ID and replace the array on navigation; a React key does not clear host state. Omit annotations for internal state. When annotations is supplied, editing without onAnnotationsChange throws. With a handler installed, pass the new array back to update the controlled UI. Do not mutate arrays or data in place. See [annotations and selection](annotations.md) for persistence and relocation rules.

## Source editing and local files

The default reader leaves source unchanged; external annotations continue through onAnnotationsChange. `standard()` already includes generic source annotation parsing and serialization. A local Markdown preview supplies onSourceChange to enable task toggles and source highlight editing in the default toolbar, without another writing plugin:

```tsx
import { useState } from 'react';
import { Reader } from '@linloir/limr';

export function LocalMarkdown({ initialSource, queueSave }: {
  initialSource: string;
  queueSave: (source: string) => void;
}) {
  const [source, setSource] = useState(initialSource);
  return <Reader source={source} onSourceChange={next => {
    setSource(next);
    queueSave(next);
  }} />;
}
```

The host's queueSave owns ordered writes, debouncing, disk conflicts and failure UI. The callback synchronously returns void/true to accept the in-memory edit; false or a thrown error leaves the document unchanged. Do not return the file-write Promise. A failed save does not roll back memory automatically: keep dirty state and retry in the host. The second callback argument contains the pre-edit document for undo and version checks. LiMR does not access the filesystem.

Ordinary `addAnnotation` writes external data; `{ target: 'source' }` chooses Markdown storage. With source editing enabled, the default highlight action writes source. Updates and deletion follow the record's origin; type plugins still own cards and editors. See [annotations and selection](annotations.md) and [modules writing source](extensions.md#modules-writing-source) for coordinates, rejected writes, draft cancellation and serialization.

[Inline notes](../../examples/inline-notes.tsx) and [reading notes](../../examples/notes.tsx) are application plugin examples. Source editing is disabled during streaming and provisional previews. Retain revision for asynchronous work and reread coordinates after edits.

## Global translation mode

```tsx
import { useState } from 'react';
import { Reader, type TranslationMode } from '@linloir/limr';

export function BilingualArticle({ source }: { source: string }) {
  const [mode, setMode] = useState<TranslationMode | undefined>();
  return <Reader source={source}
    parameters={{ translationMode: mode, onTranslationModeChange: setMode }} />;
}
```

Parameters update views without reparsing. Other plugins can register parameters as described in [extension development](extensions.md).

`parameters.translationSelectionBoundary` defaults to `true`. It constrains native selections at original/translated region boundaries and shows a toolbar hint according to where the drag ends. It is independent of display mode and does not restrict existing annotations or ranges passed to `addAnnotation` or `updateAnnotation`. Multiple ordinary paragraphs within one language region remain selectable together. Explicitly disable it to restore the previous selection behavior:

```tsx
<Reader source={source} parameters={{ translationSelectionBoundary: false }} />
```

Customize the hint with `locale.translationSelectionHint`; both built-in locales provide default text.

## SSR and client boundaries

Place interactive components inside your framework's client component boundary (for example, 'use client' where required) and let the framework arrange SSR/hydration. Avoid window/document at module initialization. Keep initial source, documentId, and configuration consistent between server and client.

Synchronous SSR falls back to formula source until math is loaded. To include complete KaTeX output in the first HTML, preload it on the server:

```tsx
import { renderToString } from 'react-dom/server';
import { Markdown, preloadMath } from '@linloir/limr';

export async function renderArticle(source: string) {
  await preloadMath();
  return renderToString(<Markdown source={source} documentId="server-article" />);
}
```

React streaming SSR can also handle Suspense. Shiki adds highlighting on the client; SSR already includes code text. Mermaid emits a loading state on the server and fades in after client rendering. KP measures fonts and typesets on the client; SSR retains ordinary text layout. Annotation load requests start when a card is shown on the client. Put preloaded data in annotation.data if needed. The host must still serve CSS and fonts.

## Existing plugins and themes

Import a factory from a real plugin package and create a stable plugins array outside rendering or with useMemo. Import plugin CSS explicitly as documented by its author. Themes are selected with appearance, not passed through plugins. See [plugin packages](extensions.md#package-and-integrate) for installation and local tgz consumption.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Missing layout or malformed formulas | Import styles or base, plus math.css |
| Default modules disappear after adding a plugin | Use plugins to append, rather than replacing extensions |
| Annotation edits do not persist | Return a new array from the controlled callback |
| Body and navigation disagree | A Markdown source prop may have created a second provider |
| Nested scrolling targets the wrong place | Pass the actual scrolling DOM element as scrollRoot |
| Portal colors differ from the reader | Scope CSS by data-limr-appearance |
| Streaming repeatedly reparses everything | Keep extensions/plugins stable and check document-scoped transforms |

Echoing a source prop never emits onSourceChange; only edit commands emit it. Identical source reuses the current snapshot without reparsing, so a file watcher echo does not cause recursive updates.
