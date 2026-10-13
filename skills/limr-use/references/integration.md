# Consumer contract

## Minimal integration

```tsx
import { Reader, chinese } from '@linloir/limr';
import '@linloir/limr/styles.css';
import '@linloir/limr/math.css';

export function Article({ source }: { source: string }) {
  return <Reader source={source} locale={chinese} theme="auto" />;
}
```

React/React DOM 18.3 or 19, Node 20+, ESM. Choose styles.css or styles/base.css; the latter avoids browser requests for Maple but leaves fonts in the installed package. math.css is separate. CSS themes are imported separately and selected with appearance; that scope reaches portals.

Markdown is body-only, with no automatic toolbar. A composed DocumentProvider contains one primary <Markdown /> plus TableOfContents, AnnotationSidebar or AnnotationOverlay, and SelectionToolbar. A Markdown with source creates another document. Synchronized body/sidebar share one scroll container and unscaled coordinates; the host/grid supplies sidebar height. Use sync="none" for a separately scrolling annotation list.

## State and commands

Reader supports annotations/onAnnotationsChange. Supplying annotations makes it controlled; updates require a callback and a new array. Store data per article and supply a stable documentId. Changing Reader.key resets its internal state, not host state.

Annotation is { id, type, data?, range?, anchors? }. Anchors are { range, documentId?, revision?, quote?, id? }. All offsets use the unmodified source's UTF-16 indices with an exclusive end. A quote relocates only when it matches uniquely; ambiguous or mismatched anchors can be omitted.

Selection exposes text, quality, settled, and raw/syntax/blocks (each with ranges and sourceText). Preserve all selected ranges and quote each original slice. Syntax absorbs adjacent standard delimiters, not unselected words or custom outer tags. Code can be selected partially; math/images are atomic.

useLiMR() exposes addAnnotation, updateAnnotation, removeAnnotation, removeAnnotationsAt, editAnnotation, activateAnnotation, clearSelection, invalidateAnnotation, and the engine. data updates replace the entire data object. addAnnotation normally adds a shared persistent highlight; highlight:false disables that. highlight:'hover' types skip automatic persistent highlights unless an explicit appearance is supplied. highlight annotations need no plugin and support background/underline/dotted/wavy plus hidden.

## Streaming and resources

Pass the complete accumulated text to source and set streaming=false at completion. followOutput is opt-in and pauses after upward scrolling. Keep extensions/plugins stable; full-document transforms, changed definitions, middle edits, and finalization require complete parsing.

SSR renders code text without client Shiki. Await preloadMath() before synchronous SSR when complete formula HTML is needed. Framework client boundaries still apply to interactive components. Annotation loaders start when content is shown on the client; Preview only uses local data. Do not infer physical-device acceptance from Chromium mobile emulation.

## Importing a plugin

Read the actual installed package exports/peer dependencies. Import its factory, create a stable array, pass plugins, and import its CSS if required. Plugins add to defaults; extensions replaces them. Duplicate extension/tag/directive names throw. Parameter overrides belong in parameters and do not reparse source.

Missing plugin annotations retain data but show generic markers/unavailable cards. The Playground's plugin switches disable action entries while leaving renderers installed. If an application wants to hide unsupported types, merge untouched hidden records back into persistence on edits.

Use docs shipped under node_modules/@linloir/limr/docs when available. Public source: https://github.com/Linloir/LiMR . Do not rely on internal src/dist imports.
