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

The application owns transport and appends each chunk to the complete answer. Do not pass only the newest chunk as source. The final update must set streaming to false to complete semantic correction. followOutput follows only while the reader remains near the bottom. The core engine supports append(chunk) / finish(); React props take the accumulated string.

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

This illustrates state for one article. In an application, load/store annotations by article ID and replace the array on navigation; a React key does not clear host state. Omit annotations for internal state. When supplied, accept edits through onAnnotationsChange and pass the new array back, or editing throws. Do not mutate arrays or data in place. See [annotations and selection](annotations.md) for persistence and relocation rules.

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

React streaming SSR can also handle Suspense. Shiki adds highlighting on the client; SSR already includes code text. Annotation load requests start when a card is shown on the client. Put preloaded data in annotation.data if needed. The host must still serve CSS and fonts.

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
