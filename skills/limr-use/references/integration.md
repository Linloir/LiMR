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

Annotation is { id, type, data?, range?, anchors?, source? }. source contains parsed module/ranges/rangeIds metadata; do not persist its offsets across revisions. Anchors are { range, documentId?, revision?, quote?, id? }. All offsets use the unmodified source's UTF-16 indices with an exclusive end. A quote relocates only when it matches uniquely; ambiguous or mismatched anchors can be omitted.

Selection exposes text, quality, settled, and raw/syntax/blocks (each with ranges and sourceText). Preserve all selected ranges and quote each original slice. Syntax absorbs adjacent standard delimiters, not unselected words or custom outer tags. Code can be selected partially; math/images/Mermaid and selection:atomic widgets select as a whole. Toolbar/native copying serializes each atom's complete original source, including $ delimiters, fences, or custom tags; surrounding ordinary text remains rendered text. A single atomic block anchors its toolbar below the block. Block-local copy buttons may deliberately copy only code, a URL, or another module-specific value.

useLiMR() exposes addAnnotation, updateAnnotation, removeAnnotation, removeAnnotationsAt, editAnnotation, activateAnnotation, clearSelection, invalidateAnnotation, and the engine. data updates replace the entire data object. addAnnotation normally adds a shared persistent highlight; highlight:false disables that. highlight:'hover' types skip automatic persistent highlights unless an explicit appearance is supplied. highlight annotations need no plugin and support background/underline/dotted/wavy plus hidden.

## Streaming and resources

Pass the complete accumulated text to source and set streaming=false at completion. followOutput is opt-in and pauses after upward scrolling. Keep extensions/plugins stable. Appends and eligible finalization reuse stable prefixes; full-document transforms, changed definitions, and middle edits may require complete parsing. Growing code fences have a literal fast path.

New text and special blocks fade in without a background tint. streamEffect overrides animation keyframes/timing/className; false disables it. Extensions can provide streaming.effect and streaming.Loading. Incomplete code/math may render progressively while Mermaid waits for closure. Existing control state and selected text are retained; honor reduced motion in custom components.

typography defaults to standard; choose justify for browser justification or knuth-plass for TeX paragraph optimization with English Knuth–Liang hyphenation. The client adapter caches preparation, retains offscreen DOM, and protects active selections on width changes. knuthPlass configures tolerances, penalties, emergencyStretch, looseness, and hyphenate. Browser font shaping is not pixel-identical to TeX PDF; compare workloads using the repository performance report rather than promising universal timing parity.

SSR renders code text without client Shiki and a loading view for Mermaid; KP begins with standard layout and runs on the client. Await preloadMath() before synchronous SSR when complete formula HTML is needed. Framework client boundaries still apply to interactive components. Annotation loaders start when content is shown on the client; Preview only uses local data. Do not infer physical-device acceptance from Chromium mobile emulation.

## Importing a plugin

Read the actual installed package exports/peer dependencies. Import its factory, create a stable array, pass plugins, and import its CSS if required. Plugins add to defaults; extensions replaces them. Duplicate extension/tag/directive names throw. Parameter overrides belong in parameters and do not reparse source.

rendererOverrides replaces views without changing syntax: each rule has type, component, and optional when(node,{pending,incomplete,ancestors}). Last matching rules win; host rules override extension rules. This restricts where a renderer applies, not what third-party JavaScript can execute.

Missing plugin annotations retain data without markers, cards or type-specific interactions; reinstalling the type restores them. Playground switches install/uninstall complete modules, including renderers. Persist the complete annotations array: selection actions and removeAnnotationsAt preserve unsupported records, while explicit updateAnnotation/removeAnnotation can still manage them by ID.

Use docs shipped under node_modules/@linloir/limr/docs when available. Public source: https://github.com/Linloir/LiMR . Do not rely on internal src/dist imports.

The Playground always refreshes to its default document and standard typography. Edits are stored only through explicit Save, then opened manually from the saved-draft menu; locale preference persists separately. Reader itself supplies no persistence.

## Source editing (1.1.0+)

Provide `onSourceChange(next, { document, edits })` to opt into original Markdown edits; return false to decline, otherwise echo source and queue file saves in the host. Do not return the write Promise. `useLiMR()`/action contexts expose canEditSource(), canEditAnnotation(id), and editSource(edits,{revision?}). SourceEdit is {range,text}; validate against the same UTF-16 revision, with no overlaps. Streaming disables editing. Default sourceAnnotations parses named ranges/definitions and supplies the generic editSourceAnnotations serializer. onSourceChange alone enables default task toggles and source highlight editing; the default highlightSelection action chooses source when enabled. Type modules own cards and dedicated actions: Playground inlineNotes supplies its type/action, and readingNotes supplies question cards. addAnnotation itself defaults to external storage; target: source explicitly chooses source serialization, and existing annotations retain their origin on update. Paired ID boundaries support cross-block/code/nested/crossing ranges; split entities, escapes and surrogate pairs reject without changing source. Existing external annotations retain onAnnotationsChange persistence.
