# Annotations and selection

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/annotations) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/annotations.md)

## Data model

Annotation stores data, AnnotationType registers presentation/loading, and AnnotationOccurrence describes one location. One annotation can have multiple anchors; one citation marker can refer to several annotations.

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
| updateAnnotation(id, partial) | Shallowly merges fields; data is replaced as a whole, so retain needed fields |
| removeAnnotation(id) | Removes that annotation, preserving other annotations and shared highlights |
| removeAnnotationsAt(ranges) | Removes annotations/highlights at exact matching fragments, retaining other anchors |
| editAnnotation(id / null) | Changes shared editing state; setting an ID also activates its card |
| activateAnnotation(id / null) | Opens the annotation's first occurrence, or accepts an explicit occurrence ID |

addAnnotation accepts highlight: false to suppress automatic persistent highlighting, explicit HighlightData to choose its style, and edit: true to enter editing. Types configured with highlight: 'hover' do not add persistent highlights by default, but an explicit appearance still creates one. Default toolbar actions are palette, add/hide highlight, copy, and delete. actions replaces built-in actions; plugin actions are still merged in.

## Citation hover highlights

Citations default to highlight: 'hover'. Hovering a marker or sidebar item, or activating a reference, paints the referenced text with an 18% tint of the type's color behind the text. Clicking pins the highlight after the pointer leaves; it disappears once the reference is neither active nor hovered. Active and hovered references to the same paragraph do not stack their tints. This feedback never updates annotations or saved hidden settings. Embedded refs use their nearest paragraph, heading, list item, or table cell. External references use their own range; the first line anchors sidebar alignment.

Sidebar alignment translates the prose without changing the page's scroll range. Paint updates throughout that animation and on completion or cancellation, so text entering from outside the viewport receives the current hover or active feedback.

Disable it with replaceExtension(standard(), citation({ highlight: false })). Other types can opt into highlight: 'hover'.

## Missing plugins

The current implementation **does not silently ignore unknown annotation types**. It retains data/ranges and may show a generic dot marker. Without Content, the card shows the localized unavailable label and type name. A missing citation definition may also show unavailable content. Install the matching plugin, or let the application decide which annotations to hide temporarily.

If filtering unsupported types, retain the full persisted array and merge hidden data back when accepting edits, so disabling a plugin cannot discard data. Playground plugin checkboxes currently toggle action entries while retaining card renderers; they do not simulate uninstalling a plugin.

## Cards and async resources

Modules register Content for annotation content, overlay.Card for the whole floating card interior, and sidebar.Preview for a local collapsed summary. AnnotationMarkdown reuses Markdown configuration with an isolated selection scope.

load(annotation, { signal }) runs when content is displayed, sharing requests and a bounded cache within one reader. Separate readers are isolated. Preview never invokes load. Content receives data, loading, error, retry, editing, presentation, and expanded; the module renders loading/error UI. Refresh with useLiMR().invalidateAnnotation(id).

Action signals abort when the reader is disposed, not when the menu closes. Preserve question fields when replacing data with streamed answers. Stopping generation, retries, authentication, conversation state, and storage belong to the application adapter. See the [assistant example](../../examples/assistant.tsx) and [extension development](extensions.md).
