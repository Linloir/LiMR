# Annotations and selection

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/annotations) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/annotations.md)

## Data model

Annotation stores data, AnnotationType registers presentation/loading, and AnnotationOccurrence describes one location. One annotation can have multiple anchors; each content annotation at a shared location has its own marker, sidebar item, and narrow-screen card.

```ts
import type { Annotation } from '@linloir/limr';

export const annotations: readonly Annotation[] = [{
  id: 'paper-reference',
  type: 'citation',
  data: { title: 'Paper', url: 'https://example.com/paper' },
  anchors: [{
    range: { start: 0, end: 4 },
    documentId: 'article',
    quote: 'LiMR',
  }],
}, {
  id: 'highlight-1',
  type: 'highlight',
  range: { start: 0, end: 4 },
  data: { color: '#F2C744', style: 'background' },
}];
```

The example requires source to begin with LiMR and documentId to be article. range is shorthand for one anchor; anchors takes precedence. All ranges address the **unmodified input**, using UTF-16 offsets with an exclusive end, not UTF-8 bytes or Unicode code points.

Persist source, a stable documentId, annotation ID/type/data/anchors, and your application document version when needed. anchor.revision belongs to the current engine session, not a cross-session identity. If quote no longer matches the range, relocation succeeds only for one unique match in the source. Missing/ambiguous matches or a mismatched documentId skip that anchor. Without quote, a mismatched revision also skips it. This is not automatic position transformation for collaborative editing.

## Three selection forms

| Field | Meaning |
| --- | --- |
| text | Readable selected text; settled atomic content uses its complete original source |
| raw | Mapped original ranges and source |
| syntax | Absorbs adjacent standard Markdown delimiters at each edge, without selecting extra words or outer custom tags |
| blocks | Ranges and source for touched blocks |
| quality | exact, atomic, or unmapped |
| settled | False while a pointer selection is changing |
| documentId / revision | Owning document snapshot |

Each result has ranges and sourceText. Notes usually use syntax.ranges. Store document.source.slice(start, end) as quote for **every range**. Code supports partial selection; math and images are atomic. Do not infer offsets from DOM textContent lengths: entities, escapes, and emoji make those coordinates differ.

The default selection toolbar and browser copy serialize atomic content as a whole, retaining its original delimiters (`$…$`, `$$…$$`, image syntax, Mermaid fences/directives, or plugin block tags). Surrounding ordinary text keeps its rendered spelling and explicit line breaks. This also applies when reopening an existing highlight. A plugin's `selection: 'atomic'` covers its mapped attributes, children, and nested atoms; block-local copy buttons may offer their own specialized format.

## Highlights and commands

highlight needs no extra AnnotationType. Its data supports color, style (background / underline / dotted / wavy), and hidden. Deleting content annotations differs from hiding their highlight.

| Command | Behavior |
| --- | --- |
| addAnnotation(annotation, options?) | Adds/replaces an ID; ordinary content annotations also get a shared persistent highlight by default |
| updateAnnotation(id, partial) | Shallowly merges fields while preserving the original id and source metadata; data is replaced as a whole, so retain needed fields |
| removeAnnotation(id) | Removes that annotation, preserving other annotations and shared highlights |
| removeAnnotationsAt(ranges) | Removes supported annotations/highlights at exact matching fragments, retaining other anchors and unregistered types |
| editAnnotation(id / null) | Changes shared editing state; setting an ID also activates its card |
| activateAnnotation(id / null) | Opens the annotation's first occurrence, or accepts an explicit occurrence ID |

addAnnotation accepts highlight: false to suppress automatic persistent highlighting, explicit HighlightData to choose its style, and edit: true to enter editing. Types configured with highlight: 'hover' do not add persistent highlights by default, but an explicit appearance still creates one. Default toolbar actions are palette, add/hide highlight, copy, and delete. actions replaces built-in actions; plugin actions are still merged in.

## Citation hover highlights

Citations default to highlight: 'hover'. Hovering a marker or sidebar item, or activating a reference, paints the referenced text with an 18% tint of the type's color behind the text. Clicking pins the highlight after the pointer leaves; it disappears once the reference is neither active nor hovered. Active and hovered references to the same explicit range do not stack their tints. This feedback never updates annotations or saved hidden settings. A scoped `<ref>text</ref>` uses its enclosed text. A self-closing `<ref />` or standalone named footnote uses a zero-length range at the marker and paints no paragraph. Footnotes directly after `==text==` use that explicit text range. External references use their own range; the first line anchors sidebar alignment.

Clicking or hovering a marker aligns its sidebar item. Sidebar hover leaves the prose and page scroll range unchanged. Paint updates as the page scrolls, preserving feedback for the current hovered or active reference.

Disable it with replaceExtension(standard(), citation({ highlight: false })). Other types can opt into highlight: 'hover'.

## Missing plugins

Only registered annotation types create markers, cards, hover feedback, and editing controls. Uninstalling a plugin removes these interfaces and clears its active interactions. A mixed reference keeps its registered entries. Unknown types remain in the original annotation data and source definitions; reinstalling their module restores their presentation. A registered type without Content, or a missing citation definition with the citation module installed, can still show the localized unavailable message.

Keep the complete `annotations` array when persisting changes. Selection toolbar contexts and `removeAnnotationsAt` operate on supported types, so deleting a visible highlight does not delete a hidden note on the same range. Explicit `updateAnnotation(id, ...)` and `removeAnnotation(id)` can still manage stored data by ID. Playground plugin switches install and uninstall whole modules, including their renderers. The Markdown permission switch remains separate from installation.

## Cards and async resources

Modules register Content for annotation content, overlay.Card for the whole floating card interior, and sidebar.Preview for a local collapsed summary. AnnotationMarkdown reuses Markdown configuration with an isolated selection scope.

load(annotation, { signal }) runs when content is displayed, sharing requests and a bounded cache within one reader. Separate readers are isolated. Preview never invokes load. Content receives data, loading, error, retry, editing, presentation, and expanded; the module renders loading/error UI. Refresh with useLiMR().invalidateAnnotation(id).

Action signals abort when the reader is disposed, not when the menu closes. Preserve question fields when replacing data with streamed answers. Stopping generation, retries, authentication, conversation state, and storage belong to the application adapter. See the [assistant example](../../examples/assistant.tsx) and [extension development](extensions.md).


## Source-authored ranges

The default `sourceAnnotations()` module resolves `::%%limr%%{<#r1}text::%%limr%%{>#r1}` together with `:::limr-annotation` definitions. See [syntax](syntax.md#annotations-stored-in-markdown) for the complete grammar and precedence rules. Definitions become ordinary `Annotation` values with resolved `anchors`; each content annotation receives an independent marker at each named range. The parsed snapshot retains the source reference group; runtime occurrences link to that source location through markerId.

`DocumentSnapshot.annotationRanges` maps each case-sensitive range ID to its occurrences. Each `SourceAnnotationRange` contains `range` (the content between boundaries), `openingRange` (the start token), `markerRange` (the end token), and `syntaxRange` (the complete pair including content). All use original UTF-16 source coordinates. Adjacent boundary tokens give a zero-length `range`. Removing one range deletes only its two tokens, preserving nested or crossing ranges.

`Annotation.source` identifies the owning module, its defining syntax `ranges`, and optional named `rangeIds`. Duplicate IDs retain all their definition spans while exposing only the final value, so a source editor can delete or rewrite an annotation without revealing an older definition. Plain `==text==` highlights identify `inline-highlights` as their source owner; named definitions identify `source-annotations`. Source metadata belongs to the current parsed document and should be regenerated after source changes.

Source annotations are read-only by default. `standard()` provides generic parsing and serialization; supplying `onSourceChange` enables default highlights and tasks to update Markdown without another writing plugin, database or editor component. Annotation types own cards and editor UI; Playground inline notes and questions are registered by example plugins. Modules choose source with target: source, while ordinary addAnnotation remains external; the default highlight action chooses source when editing is enabled. Updates/deletion follow existing annotations’ origins, and external data continues through `annotations` and `onAnnotationsChange`. See [application integration](integration.md) and [extension development](extensions.md) for the mutation API.

## Dense sidebars

Enable automatic folding with `<Reader sidebarCollapse />` or `<AnnotationSidebar collapseOverflow />`; both default to false. Playground enables it by default and provides a global “旁注折叠” (sidebar folding) dropdown with “开启” (on) and “关闭” (off) options in the toolbar that remains effective across articles. A custom positioner applies when automatic folding is disabled.

The layout compares displacement and folding penalties, preserving complete items whenever mild displacement is sufficient. Only crowded consecutive regions form foldable groups, independently of paragraph boundaries; a single item is never folded on its own. The region span is bounded, and a refinement pass releases cards when space permits. A collapsed window exposes roughly two thirds of its last visible card, with a fade covering at least half of that card to indicate further content. Groups have no expand button and do not capture wheel or touch scrolling.

Clicking or hovering a marker aligns its card by moving the group and translating its contents on one animation clock, keeping each card in its original list. Entering a hovered card preserves its position; leaving returns to the original top position. Clicking pins the active card until it is closed or dismissed, including after temporarily hovering another marker. Sidebar hover never moves the body text. Cached geometry and transforms support interrupted reversals and reduced-motion preferences without increasing page height or adding empty trailing space. Fades stay on the clipping window and shrink with the actual overflow, so fully revealed cards are no longer dimmed.

Point annotations show readable context before their marker in the gray reference strip, fitted to its width with ellipses on both ends. The actual highlight and toolbar ranges remain zero-length. Clicking a highlight opens the selection toolbar; in sidebar mode, clicking a marker also provides the toolbar for its range. Opening or pinning a floating card dismisses the previous toolbar and clears the body-text selection so the toolbar cannot cover the card. Actions remain subject to plugin capabilities and source-editing permissions.

For inline ranges written as `==text==` followed by a footnote or named annotation, only an explicit, visible highlight definition supplies persistent paint. Missing or hidden definitions produce hover-only feedback, using the highlight color when supplied and otherwise the default inline highlight color. A visible highlight never receives a second hover background. Standalone `==text==` remains a persistent inline highlight.
