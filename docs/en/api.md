# API reference

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/api) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/api.md)

## Entry points

| Entry | Contents |
| --- | --- |
| @linloir/limr | All public core, React, and extension APIs |
| @linloir/limr/core | DOM/React-free engine, selection calculations, tree helpers, caches, data types |
| @linloir/limr/react | Components, hooks, locales, React types |
| @linloir/limr/extensions | Module factories, definitions, selection actions, AnnotationMarkdown |
| styles.css / styles/base.css / fonts.css / math.css | Public styles, prefixed by the package name |
| @linloir/limr/package.json | Package metadata |

This is an API guide. Exact TypeScript declarations ship with the package; plugins should use the installed version's declarations.

## Shared document configuration

Reader, Markdown, and DocumentProvider accept:

| Prop | Default / meaning |
| --- | --- |
| source | Empty string; original Markdown |
| document | Optional existing DocumentEngine; takes precedence over source/streaming and avoids reparsing a hydrated snapshot |
| streaming | false |
| documentId | Generated; explicit values should be stable and unique on the page |
| extensions | standard(); the complete extension list |
| plugins | Appended to the default or explicit list |
| parameters | Document-wide module parameter overrides |
| components | NodeRenderer overrides by AST type/custom tag |
| annotationTypes | Add/override presentation by type |
| annotations | Internal state if omitted; controlled if supplied |
| onAnnotationsChange | Next external annotation array, including highlights; controlled edits must return the accepted array through props. Only a synchronous `false` declines a change; other return values are ignored |
| onSourceChange | Optional `(source, { document, edits }) => boolean \| void`; explicitly enables source editing; return false to decline a transaction |
| theme | light, dark, or auto |
| appearance | classic; CSS scope propagated to portals |
| locale | english; accepts chinese or Partial&lt;LiMRLocale&gt; |
| justify | false; justify prose/list text |
| typography | standard (default), knuth-plass, or justify; legacy CSS modes pretty / normal remain available |
| knuthPlass | TeX paragraph parameters; see [styles](styles.md) |
| rendererOverrides | Ordered, reader-scoped rules with type, component and optional when predicate |
| streamEffect | Increment animation override; false disables |
| scrollRoot | null/omitted means window |
| scrollOffset | 24px |
| onDocumentChange | DocumentSnapshot after updates |
| onSelectionChange | SelectionSnapshot or null |
| onAnnotationClick | Activated AnnotationOccurrence |
| onAnnotationHover | Occurrence or null |
| onHighlightClick / onHighlightHover | Highlight Annotation; hover exit is null |

The default locale is english. Missing partial keys fall back to English. locale affects built-in controls that use LiMRLocale, not document text or third-party copy. Some auxiliary labels (for example Copy LaTeX and translation switch hints) are currently fixed by their modules. The Playground reader-language control demonstrates Chinese/English switching and saves that preference separately in browser storage.

## Components

| Component | Extra props and defaults |
| --- | --- |
| Reader | toc=true, sidebar=true, sidebarCollapse=false, fillHeight=true, sidebarBreakpoint=1120, actions, followOutput=false, className/style |
| AsyncReader | Reader configuration plus input, loading, loadingFallback (or null for host UI), and onLoadStateChange(state, controls); see [large documents](large-documents.md) |
| Markdown | interactive=true, followOutput=false, className/style |
| DocumentProvider | children; supplies context to composed views |
| TableOfContents | title, maxDepth=6, followActive=true, topInset=24, updateHash=false, className/style |
| AnnotationSidebar | sync='document' / 'none', collapseOverflow=false, gap=14, positioner=alignSidebar, renderCard, className/style |
| AnnotationOverlay | disabled=false, portalRoot, previewWidth=340, maxHeight='80dvh' |
| SelectionToolbar | actions, portalRoot, maxPanelHeight=260, render, className/style |
| AnnotationCard | AnnotationOverlayCardProps plus required title and optional bodyLabel |
| AnnotationEditor | Required value/onChange, onSubmit/onCancel and label; optional onBlur, placeholder, submitLabel, cancelLabel; submitDisabled=false, autoFocus=true |
| AnnotationContent | annotationId, presentation, expanded=true, enabled=true |
| AnnotationGroup | occurrence, presentation, expanded=true, enabled=true |
| AnnotationMarkdown | MarkdownProps with required source; interactive=false by default |
| InlineMarker | Required label, color, children, button props/ref |
| Image | Native image props/ref; preview=true, loading='lazy', decoding='async'; loaded images open the shared preview |
| ImagePreview | Controlled image/onClose; image supplies src, width, height, optional alt/originating element; optional locale/theme/appearance/className/style |
| MarkdownTable | Source-bound node/renderChildren adapter; the default renderer uses it automatically; see [table layout](table-layout.md) |
| ToolIcon | name and SVG props; e.g. note, copy, highlight, comment, zoom-in, zoom-out, source, image |

Shared document views/hooks require a provider; standalone Markdown and Reader create their own documents. AnnotationEditor is controlled UI and can be used independently. AnnotationCard is an interior template, not its own portal. sidebar.renderCard receives occurrence/active/activate; toolbar.render receives context/actions/run.

`Reader` and `AsyncReader` also accept `children` inside their document provider, after the reading layout. A host integration can consume `useLiMR()` there and use `scrollToSource(range)` to reveal any source position, including an unmounted paragraph in a large document. Host editor synchronization stays outside the renderer.

Translation preferences can be supplied through `parameters.translationModeForNode(node, document)` and `onTranslationBlockModeChange(node, mode, document)`. The resolver takes priority over `translationMode`; returning `undefined` restores global/local/source defaults. It is shared by the visible block, copy, search, and the global TOC, including unmounted content. The callback handles a marker click before the global callback or local state. A resolved per-block mode without a callback is locked. `TranslationBlock` also accepts `mode`/`onModeChange` for a controlled component; use the parameter resolver when its state must be visible to windowed reading. Replace the resolver when preferences change, rather than mutating closed-over data silently.

Custom virtualized renderers receive `VirtualizedTextContext`: `source` is the complete node source, `children` is the selected visible descendant text, and the lazy `value` getter is the selected decoded leaf value. Literal code retains whitespace and entities. A code theme adapter can use `copyText: (_node, { value }) => value` without reimplementing source mapping or copying an entire block for a partial selection.

`Image` and `ImagePreview` also work outside a reader. The preview animates from the originating image into a dimmed viewport, with a theme-aware bottom toolbar for fit/actual/fill modes, zoom, copying image pixels, and closing. Oversized images support dragging and scrolling; Escape closes the preview and restores focus. Reduced-motion preferences disable the transitions. Pixel copying requires browser clipboard permission and a same-origin or CORS-readable image; failures are reported on the copy button. Hosts resolve local or protected image URLs before passing them to these components; the core performs no filesystem lookup.

`SidebarPositioner` receives `{ id, anchorTop, height }[]` and `{ activeId, gap, height?, prioritizeActive? }`, returning a map of IDs to top positions. anchorTop is the first line of referenced text; prioritizeActive distinguishes hovered or active items from the item selected by reading position. The default alignSidebar packs footer cards at rest and prioritizes the current item during interaction.

## Hooks

| Hook | Result |
| --- | --- |
| useDocument() | Complete snapshot |
| useDocumentSelector(select) | Selected value; unchanged references avoid rerenders |
| useLocale() | Merged locale; built-in language is en / zh-CN for plugin dictionaries |
| useSelection() | Selection or null |
| useAnnotation(id) | Annotation or undefined |
| useAnnotations() | Annotations Map and occurrences, combining embedded and external data |
| useAnnotationState() | Active/hovered occurrence IDs plus activate/hover |
| useAnchor(occurrenceId) | Element, viewport rect, contentRect; null until mounted |
| useRendererParameter(name) | Host override or last registered default |
| useLiMR() | Engine, commands, signal, clearSelection, scrollToHeading, scrollToAnnotation, invalidateAnnotation |

`useLiMR()` and action contexts expose `updateAnnotation(id, partial): boolean`, `commitAnnotationEdit(id?): void` and `cancelAnnotationEdit(id?): boolean`. Call commit only after the update is accepted; it finishes editing without writing data again. Cancel removes an uncommitted creation and its otherwise unused temporary highlights, while preserving existing annotations and shared highlights. Plugins reset their draft to saved content before canceling, restoring the unfinished draft and editor if the host declines cancellation. The supplied note editors also cancel empty new drafts on outside clicks; the active editor hides its selection toolbar.

useRuntime and useTheme are not public APIs. useLocale, locale.language, and localized annotation labels are available from 1.0.0. See [annotations](annotations.md) for commands and [extensions](extensions.md) for renderer/action contracts.

## Core engine

```ts
import { createDocument, selectionFromRange } from '@linloir/limr/core';

const engine = createDocument('# Hello\n\nText', { id: 'core-doc', streaming: true });
engine.append('\n\nMore text.');
const document = engine.finish();
const selection = selectionFromRange(document, { start: 9, end: 13 });
console.log(document.headings, selection.syntax.sourceText);
```

createDocument(source?, { id?, extensions?, streaming? }) returns DocumentEngine. Read with getSnapshot(); subscribe(listener) returns an unsubscribe function. update(source, { streaming? }) replaces the complete input, append(chunk) appends in streaming mode, finish() finalizes, and setExtensions(list) changes parsing configuration.

Core defaults to extensions=[]. Use SyntaxExtension with micromark/mdast for a strictly React-free parser; importing standard from the React extension entry introduces React dependencies.

DocumentSnapshot contains id, revision, source, streaming, blocks, headings, definitions, footnotes, footnoteOrder, annotations, annotationRanges, occurrences, diagnostics, and metrics. Its annotations are **parsed from source**. Use useAnnotations for merged external data. annotationRanges maps named IDs to SourceAnnotationRange arrays (range, openingRange, syntaxRange and markerRange use original UTF-16 source coordinates).

Other core exports include walk, textContent, rangeOf, intersects, safeUrl, mapText, selectionFromRange, replaceExtension, resolveAnnotationAnchors, annotationReferenceRange, sameRange, defaultHighlight, LruCache, and ResourceCache. ResourceCache.acquire returns promise/release; invalidate clears a key or everything.

`inlineHighlights({ color?, component? })`, `footnotes(annotationTypeOptions?)` and `sourceAnnotations()` are included in `standard()`. Named source annotations use paired `::%%limr%%{<#id}` / `::%%limr%%{>#id}` boundaries and complete `:::limr-annotation` definition blocks; see [syntax](syntax.md#annotations-stored-in-markdown). `HighlightData.readOnly` defaults to a copy-only toolbar; source editing makes supported authored highlights editable. `AnnotationOccurrence.referenceRange` separates the marker location from its referenced text. Standalone references have a zero-length referenceRange at their marker start.

`useLiMR()` and action contexts expose `canEditSource()`, `canEditAnnotation(id)` and `editSource(edits, { revision? })`. A `SourceEdit` is `{ range: { start, end }, text }`; all edits address the same original source. Invalid, overlapping or stale-revision edits throw. Accepted edits update the document atomically and immediately; the host echoes the new source. A false result means the host declined. `applySourceEdits(source, edits)` is the equivalent pure core utility. Editing is unavailable during streaming.

`addAnnotation(annotation, { target: 'source' })` explicitly chooses source storage; target defaults to annotations. The sourceAnnotations module in `standard()` installs the public `editSourceAnnotations` generic serializer. Supplying onSourceChange enables default task toggles and makes the default highlightSelection action choose source for new highlights; ordinary addAnnotation keeps its default storage target. Modules still own types, cards and dedicated actions. `TaskCheckbox` is a disabled-by-default diamond UI primitive with checked, disabled, onChange, label and ideographic props; the default Markdown renderer enables it according to editing capability.

`RendererExtension.sourceEditing.annotations(change, document)` returns `SourceEdit[]` or undefined. change contains added, updated (previous/annotation) and removed. Later handlers take precedence; undefined delegates to the previous handler. Parsed `Annotation.source` contains module, ranges for every duplicate definition, and optional rangeIds; do not persist these coordinates across revisions. See [source integration](integration.md#source-editing-and-local-files) and [module serialization](extensions.md#modules-writing-source).

Core also exports `knuthPlass(items, lengths, options?)`, `prepareKnuthPlass(items)`, `texBadness`, and their types. The prepared function reuses prefix sums when solving the same paragraph at multiple widths.
