# Reusable search interfaces (LiMR 1.3.12)

Export a React component for a search UI package; a RendererExtension is unnecessary unless the package also adds syntax or rendering contracts. Applications install the component through Reader.search or place it beside Markdown in the same DocumentProvider. Set a LiMR peer dependency of at least 1.3.11 when using these exports, keep React/LiMR external, and export declarations/CSS normally.

Use DocumentSearch to retain the built-in layout, or useDocumentSearch to own all markup while retaining worker scanning, cancellation, navigation and highlights. Do not import internal search files, inject private runtime events, rebuild source maps from DOM, or create a second controller for the same document. A component receiving a DocumentSearchController should not call the hook again.

```tsx
import { DocumentSearch, useDocumentSearch } from '@linloir/limr';

export function SearchToolbar() {
  const search = useDocumentSearch({ shortcuts: false });
  return <header className="plugin-search-toolbar">
    <button onClick={search.show}>Search</button>
    <DocumentSearch controller={search} placement="inline" className="plugin-search" />
  </header>;
}
```

Consumer: `<Reader source={source} search={<SearchToolbar />} />`. Search defaults false in Reader/AsyncReader. The default DocumentSearch owns shortcuts=true; the hook defaults false. Configure shortcuts/defaultOpen/worker on the hook when passing its controller. A portal retains React context, but its target needs reader theme variables.

When the consuming host already forwards native find commands, configure the owned core component with `shortcuts={false}`, or configure a shared hook controller with `shortcuts: false`. This option is public since 1.3.11. Keep one shortcut owner: VS Code can forward defaultPrevented events and otherwise navigate twice on F3. Preserve default input Enter/Shift+Enter/Escape behavior and verify one result step per native F3/Shift+F3. Do not copy core search or add a second controller to solve host routing.

For a complete replacement, bind query/setQuery, regex/setRegex, caseSensitive/setCaseSensitive; display current + 1 over matches.length, with + for partial. current=-1 means no current result. Use busy for work and loading for the delayed indicator (180 ms delay, >=1 s display). Handle error messages, focusRequest, keyboard/focus restoration and reduced motion. The hook handles reader-owned Ctrl/Cmd+F and F3 only when shortcuts=true; custom markup supplies Enter/Shift+Enter/Escape and accessible labels. Place controls outside reading text or mark them data-limr-selection-ui and data-limr-ignore. Native host commands call useLiMR().find(open/next/previous/close) after mounting; they are not buffered.

Keep loading/Worker boundaries intact: the stable factory creates a fresh SearchWorkerPort, and core terminates it. This is a different protocol from AsyncReader's parser Worker. Exported searchWorkerSource may be written to a static asset for CSP; no user regex may fall back onto the main thread. Regex is Unicode/multiline, ignores zero-width matches, works within blocks and has a 750 ms per-batch deadline. Large documents scan nearby first; + also covers the 100,000-result cap. Do not promise a complete result count or cross-block regex. Complete read-only documents can search; provisional loading previews cannot.

CSS-only packages can override `.limr-document-search`, its field/count/loading/error/button classes, `--limr-search-width` and `--limr-search-accent`. Match colors belong on the reading surface: `--limr-search-match`, `--limr-search-match-border`, `--limr-search-current`, `--limr-search-current-border`. Default selected toggles are borderless and follow heading/secondary colors. Prefer theme variables and scoped CSS to DOM mutation. Preserve equal button hit areas, clipping of final-position contents and keyboard button focus.

Custom rendered content still uses virtualization.copyText/searchText contracts and original source positions. When external view state changes the projection, call invalidatePresentation. Synthetic text without an exact mapping may navigate/highlight its block.

Validate a real packaged consumer with the exported UI: custom placement, replacement controls, focused-input highlights, cancellation/error recovery, theme/motion, and windowed navigation. The source-level benchmark is not installed-host acceptance.
