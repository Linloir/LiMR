# Public plugin contract

## Syntax and rendering

RendererExtension extends SyntaxExtension with components, annotationTypes, actions, and parameters. SyntaxExtension has name, micromark, mdast, tags, directives, transform(root, context), display, selection, and scope. Extension/tag/directive names are validated independently.

defineBlock({ name, component, tags?, directives?, selection? }) registers a block with default tag/directive [name], content selection, and local scope. defineAnnotation<T>(type) returns an extension named annotation:<type>. defineExtension returns the supplied RendererExtension.

NodeRendererProps contains node, children, pending, source (node slice), renderChildren(nodes, {trailing?}), renderValue(tokens?), and renderAttribute(name). Do not reparse children or replace the original source. Token offsets and node positions are UTF-16. Use atomic selection for widgets without character correspondence. A custom visual boundary can use data-limr-selection-surface. InlineMarker inserts action-only markers; it is not an annotation.

Unknown tags are inert literal source, unknown directives under standard() render child Markdown, and malformed JSX can fall back with diagnostics. A document-scoped transform disables tail-only parsing. Declaring local means no dependence on prior/future blocks and no mutation of retained prefixes.

## Annotation UI

AnnotationType<T> has type, label, optional icon/color/highlight, Content, Marker, overlay, sidebar, and load. highlight:'hover' paints temporary referenced-text feedback and suppresses the automatic persistent highlight unless explicitly requested. In 1.0.0 label can be a string or (locale: LiMRLocale) => string; stable factory instances can switch names without reparsing.

Content receives annotation, data, loading, error, retry, presentation ('preview'|'expanded'|'sidebar'), expanded, and editing. It renders the resource/loading/error/editor states. AnnotationMarkdown renders nested Markdown with an isolated selection scope.

overlay.Card receives annotation, occurrence, presentation, expanded, pinned, canExpand, expand, collapse, close, and children. It owns the full interior; children contains shared Content. AnnotationCard is an optional layout requiring title. Expansion is opt-in: {placement:'anchor'|'center',width?,height?,maxHeight?}, false, or an annotation resolver. previewWidth is independent. Preserve keyboard-accessible controls when drawing a custom card.

sidebar.Preview receives local annotation/data, occurrence, all annotations in the group, and referenceText. It must not trigger load. Return null or set Preview:false to omit it. previewLines defaults to 2. Color fields include previewColor, color, borderColor, titleColor, textColor, excerptColor. collapseOnContentClick defaults to false. The first annotation type owns grouped preview/presentation. Do not duplicate shell padding; use shared CSS variables.

load(annotation,{signal}) returns Promise<T> on visible content. The reader deduplicates requests and cancels when unused. Data changes/invalidation refresh resources. Do not put credentials in source, Markdown, or shipped templates. Implement service adapters in the host.

## Selection actions and storage

SelectionAction requires id, label, icon, and may provide run/visible/disabled/onHover/renderExpanded/render. label can resolve from ActionContext; icon can resolve from context. Custom panel operations use ToolbarActionContext.run for shared busy/error state. Expanded panels inherit the current action-row width; they cannot enlarge the toolbar. Use min-width: 0 and wrapping layouts for controls, with left-aligned whole-item wrapping.

ActionContext includes selection, document, annotations, highlight, locale, clearSelection, signal, and document commands. The signal aborts on reader disposal, not menu close. selection.raw/syntax/blocks contain ranges and sourceText; quality is exact/atomic/unmapped, settled is false during adjustment. Keep all selected ranges and use original source slices as quote, not rendered text.

Commands: addAnnotation(annotation,{highlight?,edit?}), updateAnnotation(id,partial), removeAnnotation(id), removeAnnotationsAt(ranges), editAnnotation(id|null), activateAnnotation(id|null). Updates shallow-merge annotation fields and replace data. Preserve immutable data and fields such as the initial question during answer streaming. Controlled hosts must return onAnnotationsChange results.

Unknown types still produce generic/unavailable UI. Never delete hidden records to simulate plugin uninstallation. A plugin-only action should not create data for a type it fails to register.

## Parameters, locales, and styles

Augment RendererParameters through declare module '@linloir/limr', register defaults in extension.parameters, and read useRendererParameter. Host parameters override defaults without reparsing. Export augmentation in .d.ts.

On 1.0.0 useLocale() exposes the merged locale. language is an optional BCP-47-style tag, with en and zh-CN in built-ins. Use it to select plugin-owned dictionaries, with a sensible fallback. Existing string labels remain valid. Plugins are responsible for translating their own editor buttons, placeholders, summaries, prompts, and status text; do not translate saved data.

CSS is explicitly imported. For themes use [data-limr-appearance='your-theme']; reader ancestor selectors miss portals. Keep annotation IDs and CSS names unique. Use the provided .limr-underline on an inline span inside a layout wrapper: a direct flex child becomes a block and cannot paint an underline per text line. Labels that must remain on one line need intrinsic-width buttons; allow button groups to wrap on narrow screens.

## Consumer verification

Build ESM and .d.ts, pack, install into a temporary React consumer without source aliases, and exercise exported CSS. Test supported React versions rather than claiming compatibility from one host. Check final streaming vs one-shot parse equivalence for syntax changes, source offsets for entities/emoji, and actual browser states for card/toolbar/portal behavior. Test loader cancellation and isolation if adding remote data. No real network service is required by the starter.
