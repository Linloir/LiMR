# Reading search (LiMR 1.3.11)

Use this reference when enabling search, moving it into a toolbar, replacing its controls, or connecting host find commands. Check installed declarations first.

## Choose the public entry

- Reader/AsyncReader default `search=false`. Use `search={true}` for the built-in component or `search={<YourSearch />}` for a replacement.
- `DocumentSearch` and `useDocumentSearch` compose inside DocumentProvider independently of Reader. Use one controller and one primary `<Markdown />` per provider; omit Markdown.source.
- Search is a React UI capability, not a RendererExtension or syntax module. Do not add it to plugins or register it with a parsing Worker.
- A shared controller goes into `<DocumentSearch controller={search} placement="inline" />`. Floating is the default. React portals retain context, but a different DOM destination needs the appropriate CSS theme variables.

```tsx
import { Reader, DocumentSearch, useDocumentSearch } from '@linloir/limr';

function SearchToolbar() {
  const search = useDocumentSearch({ shortcuts: false });
  return <header>
    <button onClick={search.show}>Search</button>
    <DocumentSearch controller={search} placement="inline" />
  </header>;
}
export function Article({ source }: { source: string }) {
  return <Reader source={source} search={<SearchToolbar />} />;
}
```

The hook accepts `shortcuts=false`, `defaultOpen=false`, and a stable `worker` factory. An owned DocumentSearch defaults shortcuts to true. If controller is supplied, set these options on its hook, not on DocumentSearch. defaultOpen is initial state, not a controlled prop.

## Replacing controls and host commands

`DocumentSearchController` exposes open/show/close; query/setQuery; regex/setRegex; caseSensitive/setCaseSensitive; matches/current/partial/error; busy/loading; next/previous; focusRequest. Initial regex and caseSensitive are false, query is empty, and current is -1. Matches use original UTF-16 source offsets; do not reinterpret them as rendered string indices.

The hook retains scanning, navigation and transient highlight painting. Custom controls own labels, focus, Escape/Enter/Shift+Enter, disabled states and motion. Watch open and focusRequest to focus an input when an already-open search is invoked again. Use aria-pressed for toggles, a status for counts and role=alert for errors; keep controls out of body text or mark their root data-limr-selection-ui=true and data-limr-ignore=true.

`useLiMR().find()` opens the mounted controller; open/next/previous/close are explicit commands. Use the same provider and wait for the controller to mount; commands are not queued. Navigation while busy is ignored. Opening a provisional document is ignored. Default component shortcuts cover reader-owned Ctrl/Cmd+F and F3, plus input Enter/Shift+Enter/Escape. Hook shortcuts cover only Ctrl/Cmd+F and F3. Playground uses a Search button and shortcuts=false to preserve browser find.

Use busy for current work and loading for a visual indicator: loading starts after 180 ms of work and remains for at least 1 s, even after busy becomes false. The built-in view adds a left-hand ring slot with nonlinear width/scale/opacity transitions. Closing search cancels work and clears paint; it never changes saved annotations or source.

## Matching and worker boundaries

Inputs are literal by default; regex takes the pattern without slash delimiters or suffix flags. Regex uses Unicode and multiline matching with optional case sensitivity. Zero-width matches are skipped, and matches do not span reading blocks. Source-only `searchDocument()` is a separate asynchronous literal API.

Above 4 Mi UTF-16 units, initial scanning covers roughly 256 Ki units near the reader. Previous/Next extends the interval. A + count is incomplete, including the 100,000-hit cap; do not describe it as a full-document count. A giant indivisible block can exceed the nearby budget. Hidden translations/definitions are excluded; folded code and unmounted reading blocks remain searchable. Custom synthetic text can fall back to block navigation.

Regex runs in a disposable Worker with a 750 ms per-batch deadline. Query/source/presentation changes, close and unmount cancel obsolete work. Invalid patterns, timeouts and worker errors are reported; no arbitrary regex fallback runs on the main thread.

Default Blob Workers need matching host CSP. For a static worker, save the exported `searchWorkerSource` from @linloir/limr/core as a build asset, then pass `worker: () => new Worker(actualURL)`. Keep the factory stable and return a new port per session; LiMR terminates it. The exported SearchWorkerPort contract has postMessage, message/error listener add/remove, and terminate. Do not reuse the AsyncReader parsing Worker: the protocols differ.

## Styling and validation

Use className/style, `.limr-document-search`, `.limr-search-field`, `.limr-search-count`, `.limr-search-loading`, `.limr-search-error`, and `.limr-search-previous/next/regex/close`. `--limr-search-width` goes on the search component; `--limr-search-accent` colors the ring. `--limr-search-match`, `--limr-search-match-border`, `--limr-search-current`, and `--limr-search-current-border` must reach the reading surface. The default muted controls and borderless pressed state inherit page colors. Import styles.css (or styles/base.css), keep fixed inner geometry/clipping when changing motion, and preserve reduced-motion support.

Verify search on the installed package: visible/current highlights while the input is focused, regex and case changes, error recovery, navigation into unmounted blocks, cancellation, native find when disabled, and independent composition when claimed. Large-document timings are machine- and corpus-specific; browser benchmarks do not prove installed VS Code/Cursor behavior.
