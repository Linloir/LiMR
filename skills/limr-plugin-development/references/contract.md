# Public plugin contract

## Syntax and rendering

RendererExtension extends SyntaxExtension with components, rendererOverrides, streaming, annotationTypes, actions, parameters, and sourceEditing. SyntaxExtension has name, micromark, mdast, tags, directives, preprocess(context, extensions), transform(root, context), display, selection, scope, and literal. Extension/tag/directive names are validated independently; registered tags also accept matching component directives. Use public package exports.

defineBlock({ name, component, tags?, directives?, selection?, streaming? }) registers a block with default tag/directive [name], content selection, and local scope. Paired ::name components and ::: containers support nesting. defineAnnotation<T>(type) returns an extension named annotation:<type>. defineExtension returns the supplied RendererExtension.

NodeRendererProps contains node, children, pending, incomplete, source (node slice), renderChildren(nodes, {trailing?}), renderValue(tokens?), and renderAttribute(name). pending describes a growing top-level block; incomplete identifies this particular open node. Do not reparse children or replace the original source. Token offsets and node positions are UTF-16. Use atomic selection for widgets without character correspondence. A custom visual boundary can use data-limr-selection-surface. InlineMarker inserts action-only markers; it is not an annotation.

preprocess returns source spans to omit before Markdown tokenization; its offsets still address the unmodified input. The parser maps nodes back to the original source and records sourceOmissions on affected nodes, including attribute nodes. Prefer shared renderValue/renderAttribute mapping. Custom mapText calls must pass the node's omissions; guessing positions from a raw slice can misplace selections around hidden annotation boundaries. Changing omitted spans invalidates affected parse reuse.

streaming.Loading renders a module-owned intermediate view; omit it to render progressive content using incomplete. streaming.effect supplies className, keyframes, and timing for new text/blocks. The last configured extension effect wins; Reader.streamEffect overrides it and false disables it. Default motion uses opacity alone and respects reduced motion. Reuse children/renderValue/renderChildren to retain text selection and control identity. literal keeps directive bodies from being interpreted as Markdown/JSX; parse original source without changing its public offsets.

rendererOverrides rules contain type, component, and optional when(node,{pending,incomplete,ancestors}). The last matching rule wins, with host rules taking final precedence over extensions and components. Explicit replacements own intermediate rendering and keep LiMR's mapping/error boundaries. These are scoped matching rules, not a sandbox for third-party code.

Unknown tags are inert literal source, unknown directives under standard() render child Markdown, and malformed JSX can fall back with diagnostics. A document-scoped transform disables tail-only parsing. Declaring local means no dependence on prior/future blocks and no mutation of retained prefixes.

## Annotation UI

AnnotationType<T> has type, label, optional icon/color/highlight, Content, Marker, overlay, sidebar, and load. highlight:'hover' paints temporary referenced-text feedback and suppresses the automatic persistent highlight unless explicitly requested. label can be a string or (locale: LiMRLocale) => string; stable factory instances can switch names without reparsing.

Content receives annotation, data, loading, error, retry, presentation ('preview'|'expanded'|'sidebar'), expanded, and editing. It renders the resource/loading/error/editor states. AnnotationMarkdown renders nested Markdown with an isolated selection scope.

AnnotationEditor is controlled borderless UI with automatic height, value/onChange, onSubmit/onCancel, label and optional onBlur. The caller owns drafts and persistence. Start a new editable record with a unique ID and addAnnotation(annotation, { edit: true }). After an accepted updateAnnotation, call commitAnnotationEdit(id). On explicit cancellation, reset the plugin draft to its saved value before cancelAnnotationEdit(id), then restore the discarded draft if cancellation fails. updateAnnotation and cancelAnnotationEdit return false when persistence declines; keep the editor and draft in that case.

Creation ownership is recorded by the runtime, not inferred from body text. Cancelling a new record removes it and only highlights generated for that creation that have no remaining use. Existing highlights and highlights used by other annotations survive; saving a shared owner makes its highlight persistent. Cancelling an existing record closes its editor without undoing persisted data, so the module must restore its own draft. The rules apply to source, controlled, and uncontrolled annotations.

onBlur runs only when focus leaves the entire editor, including its action buttons; AnnotationEditor itself does not save or cancel data. An empty draft with no saved content should take the cancel path on blur or when its card becomes inactive. Calling cancelAnnotationEdit is safe for an existing empty record because it does not delete that record. Supplied external note editors preserve nonempty drafts on dismissal; source note editors save accepted nonempty drafts. A module that stores a draft in annotation.data must restore the saved data before cancelling and keep the original draft if that update or cancellation is refused.

overlay.Card receives annotation, occurrence, presentation, expanded, pinned, canExpand, expand, collapse, close, and children. It owns the full interior; children contains shared Content. AnnotationCard is an optional layout requiring title. Expansion is opt-in: {placement:'anchor'|'center',width?,height?,maxHeight?}, false, or an annotation resolver. previewWidth is independent. Preserve keyboard-accessible controls when drawing a custom card.

sidebar.Preview receives local annotation/data, occurrence, all annotations in the group, and referenceText. It must not trigger load. Return null or set Preview:false to omit it. previewLines defaults to 2. Color fields include previewColor, color, borderColor, titleColor, textColor, excerptColor. collapseOnContentClick defaults to false. The first annotation type owns grouped preview/presentation. Do not duplicate shell padding; use shared CSS variables.

load(annotation,{signal}) returns Promise<T> on visible content. The reader deduplicates requests and cancels when unused. Data changes/invalidation refresh resources. Do not put credentials in source, Markdown, or shipped templates. Implement service adapters in the host.

## Selection actions and storage

SelectionAction requires id, label, icon, and may provide run/visible/disabled/onHover/renderExpanded/render. label can resolve from ActionContext; icon can resolve from context. Custom panel operations use ToolbarActionContext.run for shared busy/error state. Expanded panels inherit the current action-row width; they cannot enlarge the toolbar. Use min-width: 0 and wrapping layouts for controls, with left-aligned whole-item wrapping.

ActionContext includes selection, document, annotations, highlight, locale, clearSelection, signal, and document commands. The signal aborts on reader disposal, not menu close. selection.raw/syntax/blocks contain ranges and sourceText; quality is exact/atomic/unmapped, settled is false during adjustment. Keep all selected ranges and use original source slices as quote, not rendered text.

For atomic widgets, selection.text and default/native copy preserve the entire original range, including delimiters, mapped attributes, and nested content. Outermost atomic ownership takes precedence. Ordinary text adjacent to an atom keeps rendered spelling. Partial code selections remain supported. A single atomic block anchors the toolbar below the block; custom block-local copy actions define their own copied value. Default copy feedback measures changing button width and uses eased width/opacity/scale transitions with reduced-motion support.

Commands: canEditSource(), canEditAnnotation(id), editSource(edits,{revision?}), addAnnotation(annotation,{highlight?,edit?,target?}), updateAnnotation(id,partial), removeAnnotation(id), removeAnnotationsAt(ranges), editAnnotation(id|null), commitAnnotationEdit(id?), cancelAnnotationEdit(id?), activateAnnotation(id|null). Updates shallow-merge annotation fields and replace data. commitAnnotationEdit and cancelAnnotationEdit default to the current editor; supplying an ID prevents a departing card from closing another card's editor. editAnnotation(null) closes and commits the current edit. Preserve immutable data and fields such as the initial question during answer streaming.

Controlled hosts accept onAnnotationsChange by passing the complete new array back through annotations. Its public callback signature returns void and accepts expression or async notification callbacks. Only a synchronous false return rejects the mutation; other results, including Promises and their resolved values, are ignored. A rejected or delayed host write must be handled in the host's persistence UI; async false cannot retroactively cancel a command.

Plugin Content owns its operation row: use limr-annotation-actions for right alignment and provide single deletion when canEditAnnotation(id) allows it. removeAnnotation(id) removes that one record; removeAnnotationsAt(ranges) acts on all supported records bound to the exact selected fragments, preserving their other anchors. Use limr-annotation-delete for the shared delete hover color; do not hide deletion in application CSS. A clicked marker supplies its reference range to the toolbar alongside its card. Editing the active annotation suppresses those marker actions.

Unknown types retain their data without markers, cards or type-specific interactions. Uninstalling a plugin removes its UI; registering the type restores it. Selection actions and removeAnnotationsAt only target supported types, preserving hidden records. Persist the complete annotations array. A registered type without Content can still show unavailable UI; a plugin-only action should not create data for a type it fails to register.

## Parameters, locales, and styles

Augment RendererParameters through declare module '@linloir/limr', register defaults in extension.parameters, and read useRendererParameter. Host parameters override defaults without reparsing. Export augmentation in .d.ts.

useLocale() exposes the merged locale. language is an optional BCP-47-style tag, with en and zh-CN in built-ins. Use it to select plugin-owned dictionaries, with a sensible fallback. String labels are supported. Plugins are responsible for translating their own editor buttons, placeholders, summaries, prompts, and status text; do not translate saved data.

CSS is explicitly imported. For themes use [data-limr-appearance='your-theme']; reader ancestor selectors miss portals. Keep annotation IDs and CSS names unique. Use the provided .limr-underline on an inline span inside a layout wrapper: a direct flex child becomes a block and cannot paint an underline per text line. Labels that must remain on one line need intrinsic-width buttons; allow button groups to wrap on narrow screens.

## Consumer verification

Build ESM and .d.ts, pack, install into a temporary React consumer without source aliases, and exercise exported CSS. Test supported React versions rather than claiming compatibility from one host. Check final streaming vs one-shot parse equivalence for syntax changes, source offsets for entities/emoji, and actual browser states for card/toolbar/portal behavior. Test loader cancellation and isolation if adding remote data. No real network service is required by the starter.

## Source writing

Source modification is an opt-in host capability (`onSourceChange`). Modules use canEditSource()/canEditAnnotation(id), shared annotation commands, or atomic editSource([{range,text}],{revision}). `RendererExtension.sourceEditing.annotations(change, document)` owns serialization of added/updated/removed records into SourceEdit[]; later handlers take priority and undefined delegates. Keep the handler pure; host owns file I/O, conflicts and undo. Annotation.source identifies module, all duplicate definition ranges and optional named rangeIds. The sourceAnnotations module in standard installs the public editSourceAnnotations serializer for Markdown body and scalar attributes, without owning a content type. Type/card/action plugins reuse it; only complex custom formats need another serializer. onSourceChange enables default tasks and source highlights, and the default highlightSelection action chooses source when enabled; ordinary addAnnotation still defaults to external data unless target: source is explicit. Coordinates always belong to the pre-edit snapshot and must be reread after edits. No source editing during streaming.

Named ranges use explicit paired IDs and a complete definition:

```md
::%%limr%%{<#range}Selected **content**::%%limr%%{>#range}

:::limr-annotation{#note ranges="range" type="footnote"}
Markdown note body.
:::
```

The annotation ID and range ID are independent; ranges accepts space/comma-separated IDs and defaults to the annotation ID. Boundary IDs match `[A-Za-z0-9][A-Za-z0-9_.:-]*`. Distinct IDs may nest or cross formatting, paragraphs and code. Sequential pairs may reuse one ID; any unmatched or ambiguous ordering leaves that ID's boundaries literal. A zero-length pair creates a point annotation. The last definition of an annotation ID determines its active ranges. Only real closed :::limr-annotation containers authorize boundaries: apparent definitions inside code, literal components, footnote definitions or unknown HTML/JSX do not. Boundaries inside annotation definition bodies are inert.

Boundaries inside code can activate when a real definition elsewhere references their ID. Escape the first colon to keep a token literal, including in code: `\::%%limr%%{<#range}`. The generic writer rejects boundaries inside entities, escapes, surrogate/CRLF pairs, active boundary tokens or hidden definitions, and immediately after an odd run of backslashes. A range may span intervening definition blocks when both boundaries are outside them. Close a trailing literal block before appending a definition. Generic data serialization supports a Markdown body string and scalar attributes; id, ranges and type are reserved. onSourceChange returns boolean | void synchronously; queue file I/O separately and echo accepted source through the host prop.
