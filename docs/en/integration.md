# Application integration

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/integration) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/integration.md)

## Choose a component

Use `Reader` for the complete experience and `Markdown` for standalone content. For a custom layout, one DocumentProvider manages one primary Markdown plus its navigation, cards, and toolbar. Passing source to Markdown inside a provider creates an independent document instead of sharing the parent state.

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

Ordinary `addAnnotation(annotation)` still writes external annotations. A module calls `addAnnotation(annotation, { target: 'source' })` to choose source storage. The default highlightSelection action chooses source when editing is enabled, and external storage otherwise. Updates/deletion follow the existing annotation's origin. Sidebar, overlay and toolbar share these commands. Type modules own editor UI and drafts, save through updateAnnotation, and call commitAnnotationEdit after an accepted save; source data uses the default or custom sourceEditing.annotations serializer and onSourceChange, while external data uses onAnnotationsChange. After a source transaction is synchronously accepted, LiMR immediately updates its internal document; controlled external annotations update their presentation when the host passes back the new annotations array.

The [inline notes plugin](../../examples/inline-notes.tsx) is a Playground example, **not part of standard()**. It provides its annotation type, card and add/edit/delete controls, reusing the default serializer. The [reading notes example](../../examples/notes.tsx) provides type="question" cards. Playground’s “allow Markdown edits” switch controls onSourceChange; when enabled, highlights, tasks and installed modules’ source edits update the editor. Type-module installation and editing permission are independent; ordinary notes remain external annotations.

The default serializer converts an ordinary `==highlight==` into a named range on its first appearance edit. Deleting its final annotation unwraps the range while preserving text. Task toggles replace only the marker character, keeping list syntax, indentation and line endings. Source body editors save changed content when leaving edit mode and preserve drafts across responsive sidebar/overlay changes. An empty new draft instead calls cancelAnnotationEdit when focus leaves, removing the new annotation and its otherwise unused temporary highlights. The ordinary reading-note example also cancels empty new drafts on outside clicks, while retaining nonempty drafts until submission. Existing annotations and previously saved or shared highlights remain. The active editor hides the selection toolbar; writable cards provide a right-aligned single-annotation Delete action.

The public editSourceAnnotations serializer writes `::%%limr%%{<#id}` / `::%%limr%%{>#id}` boundaries and `:::limr-annotation` definitions for text, cross-paragraph ranges, code and zero-length positions. Ranges may nest or cross, and multiple annotations can reuse an exact range. Formatting can start or end inside the selection. Boundaries that split an entity, escape or Unicode surrogate pair are rejected without changing source. Close trailing code/HTML blocks before appending definitions. Modules can supply another serializer for other formats. Existing ordinary Markdown footnotes/citations retain their own module's editing behavior and are not implicitly converted. Source definitions and controlled external annotations can coexist with distinct IDs; existing external annotations still use onAnnotationsChange.

Source editing is disabled during streaming. Async modules should retain document.revision and pass it to editSource to avoid applying stale offsets. Read coordinates from the next snapshot after edits; do not cache Annotation.source coordinates across revisions. See [API](api.md) and [extension development](extensions.md#modules-writing-source).

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

Import a factory from a real plugin package and create a stable plugins array outside rendering or with useMemo. Import plugin CSS explicitly as documented by its author. Themes are selected with appearance, not passed through plugins. See [plugin packages](plugin-packages.md) for installation and local tgz consumption.

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
