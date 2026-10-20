# Reading search

> Reading note: this page uses LiMR syntax and interactive examples. Visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/search) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/search.md)

LiMR has provided optional reading search since 1.3.11 with literal/regular-expression matching, case sensitivity, source navigation and persistent visual highlights. It searches the reading text, including unmounted blocks. It does not edit Markdown, native selections or saved annotations.

## Enable and try it

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';

export function Article({ source }: { source: string }) {
  return <Reader source={source} search />;
}
```

`Reader.search` and `AsyncReader.search` default to `false`. Passing `true` mounts the default component; passing a React node replaces it. The default component handles Ctrl/Cmd+F and F3 while its reader owns the interaction. Its input supports Enter for next, Shift+Enter for previous and Escape to close. A disabled search component leaves browser find available; browser find only sees mounted DOM.

In Playground, use the **Search** toolbar button. Aa toggles case sensitivity; `.*` toggles regex. Playground sets `shortcuts={false}` to retain browser Ctrl/Cmd+F; Enter and Escape still work inside the search component. Search waits until a progressive document is complete.

## Compose without Reader

Search is a React UI capability, not a syntax extension. It needs neither a `plugins` entry nor a `standard()` replacement.

```tsx
import { DocumentProvider, Markdown, DocumentSearch, useDocumentSearch } from '@linloir/limr';
import '@linloir/limr/styles.css';

function SearchToolbar() {
  const controller = useDocumentSearch({ shortcuts: false });
  return <header>
    <button onClick={controller.show}>Search</button>
    <DocumentSearch controller={controller} placement="inline" className="article-search" />
  </header>;
}
export function Article({ source }: { source: string }) {
  return <DocumentProvider source={source}>
    <SearchToolbar />
    <Markdown />
  </DocumentProvider>;
}
```

Mount one search controller and one primary Markdown per provider. Omit `Markdown.source` to share the provider's document. You can also pass `<SearchToolbar />` as `Reader.search`. A React portal can move that toolbar into another DOM container while preserving context; apply the reader's CSS theme variables to that container too.

`DocumentSearchProps` and `UseDocumentSearchOptions` are exported from the package root and `/react`.

| Option | Default | Meaning |
| --- | --- | --- |
| `shortcuts` | `true` on DocumentSearch; `false` on the hook | Handle reader-owned Ctrl/Cmd+F and F3 |
| `defaultOpen` | `false` | Initial open state, not a controlled prop |
| `worker` | Blob Worker factory | Stable factory returning a fresh `SearchWorkerPort` per search session |
| `controller` | Created by DocumentSearch | Reuse a hook's controller instead of creating another one |
| `placement` | `"floating"` | `"inline"` participates in normal layout; floating anchors at the top right |
| `className`, `style` | — | Standard component styling |

When passing `controller`, configure `shortcuts`, `defaultOpen` and `worker` on the hook. Those component options do not reconfigure an existing controller.

## Replace the interface

Use the exported `DocumentSearchController` to build your own controls. Scanning, cancellation, navigation and highlight painting remain in the hook.

```tsx
import { useEffect, useRef } from 'react';
import { Reader, useDocumentSearch } from '@linloir/limr';

function CustomSearch() {
  const search = useDocumentSearch({ shortcuts: true });
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (search.open) input.current?.focus({ preventScroll: true });
  }, [search.open, search.focusRequest]);
  if (!search.open) return <button onClick={search.show}>Search</button>;
  return <div role="search" aria-busy={search.busy}
    data-limr-selection-ui="true" data-limr-ignore="true"
    onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); search.close(); }
      if (event.key === 'Enter') { event.preventDefault(); event.shiftKey ? search.previous() : search.next(); }
    }}>
    <input ref={input} aria-label="Search document" value={search.query}
      aria-invalid={!!search.error} onChange={event => search.setQuery(event.target.value)} />
    <button aria-pressed={search.caseSensitive} onClick={() => search.setCaseSensitive(!search.caseSensitive)}>Aa</button>
    <button aria-pressed={search.regex} onClick={() => search.setRegex(!search.regex)}>.*</button>
    <span role="status">{search.current + 1}/{search.matches.length}{search.partial ? '+' : ''}</span>
    <button disabled={search.busy} onClick={search.previous}>Previous</button>
    <button disabled={search.busy} onClick={search.next}>Next</button>
    <button onClick={search.close}>Close</button>
    {search.loading && <span role="status">Searching…</span>}
    {search.error && <span role="alert">{search.error}</span>}
  </div>;
}
export function Article({ source }: { source: string }) {
  return <Reader source={source} search={<CustomSearch />} />;
}
```

Custom interfaces own input focus, Escape/Enter behavior, labels, disabled states and motion. The hook's `shortcuts` option handles only Ctrl/Cmd+F and F3. Keep controls outside the reading text, or use the selection UI markers shown above.

| Controller member | Meaning |
| --- | --- |
| `open`, `show()`, `close()` | Open/focus or close; close cancels pending work and clears search paint |
| `query`, `setQuery(string)` | Pattern text; initially empty, debounced by 90 ms |
| `regex`, `setRegex(boolean)` | Initially false; input is the pattern itself, without `/…/flags` delimiters |
| `caseSensitive`, `setCaseSensitive(boolean)` | Initially false |
| `matches` | Readonly `SourceRange[]`, original UTF-16 source offsets; synthetic custom text may resolve to a block range |
| `current` | Zero-based match index, or `-1` when there is no current result |
| `partial` | Some text remains unscanned or the 100,000-result limit was reached |
| `next()`, `previous()` | Navigate, scanning further on demand; pending requests are not queued |
| `busy` | Active scanning/navigation work, excluding the input debounce |
| `loading` | Delayed visual state: starts after 180 ms, then remains for at least 1 s even if busy becomes false |
| `error` | Error message or null; changing the query/options starts a new attempt |
| `focusRequest` | Incrementing focus request, including when an already open search is invoked again |

## Host keybindings

Host commands use `useLiMR().find()` (open by default), or `.find('open' | 'next' | 'previous' | 'close')`. Call it within the same provider after the search controller mounts; it does not mount a component or persist commands for later subscribers. An open command during a provisional preview is ignored. Calling a navigation command while closed opens search; navigation resumes once results are available.

`shortcuts` has been a public core option since LiMR 1.3.11. When a host such as VS Code owns keybindings and forwards commands through `find()`, configure the core component directly:

```tsx
import { DocumentSearch, Reader } from '@linloir/limr';

export function HostedArticle({ source }: { source: string }) {
  return <Reader source={source} search={<DocumentSearch shortcuts={false} />} />;
}
```

This disables core's Ctrl/Cmd+F and F3/Shift+F3 listeners. Search buttons, public `find()` commands and the input's Enter/Shift+Enter/Escape keys still work. Keep one owner for the shortcuts: VS Code webviews may forward even `defaultPrevented` events to the host, so enabling both listeners can navigate twice for one F3 press. When supplying an external `controller`, configure its `useDocumentSearch({ shortcuts: false })` instead. No copied search implementation or private events are needed.

## Worker and CSP integration

Search uses a separate Worker protocol from document loading. Do not pass an AsyncReader parsing Worker to `DocumentSearch.worker`. Default search creates a self-contained Blob Worker without network imports. The host must permit its worker source or supply a static worker.

For example, generate a file at build time:

```js
import { mkdir, writeFile } from 'node:fs/promises';
import { searchWorkerSource } from '@linloir/limr/core';

await mkdir('public', { recursive: true });
await writeFile('public/limr-search-worker.js', searchWorkerSource);
```

Then configure a stable factory with the URL served by your application:

```tsx
import { DocumentSearch, Reader } from '@linloir/limr';

const searchWorker = () => new Worker('/limr-search-worker.js');
export function Article({ source }: { source: string }) {
  return <Reader source={source} search={<DocumentSearch worker={searchWorker} />} />;
}
```

`SearchWorkerPort` is exported from the package root and `/core`. It provides `postMessage`, message/error listener registration/removal and `terminate`. Create a new port each time the factory runs; LiMR owns termination. Regenerate the static asset when upgrading LiMR. SSR does not run a search Worker. Browser worker failure is reported rather than executing arbitrary regex on the main thread.

## Matching, limits and styling

Regex uses JavaScript Unicode and multiline behavior, with case folding controlled by Aa. Zero-width results are skipped; regex execution is interrupted after 750 ms per batch. The pattern applies within reading blocks, not across blocks. For documents above 4 Mi UTF-16 units, the first scan covers roughly 256 Ki units near the reading position; explicit previous/next extends the searched interval. A `+` count is incomplete. Large indivisible blocks can exceed this budget. See [large documents](large-documents.md#reading-search-and-copy) for source projection, cancellation and limits.

The built-in frame clips fixed-position contents while expanding leftward and fading in. Loading adds one slot on the left and uses the shared animated ring; its delayed minimum display time avoids flicker. Input focus and selected toggles have no added border. Buttons and counts use muted theme colors; active toggles use heading/secondary colors. Reduced-motion settings disable movement. See [search styles](styles.md#search-styles) for class names and CSS variables.

The [50/75 MiB benchmark](../../benchmarks/search/README.md) records nearby search, continued scanning, cached navigation and main-thread tasks in a production browser build. It is separate from installed VS Code/Cursor acceptance. `searchDocument()` remains a asynchronous literal search of Markdown source; it does not enable this reading UI or its regex behavior.
