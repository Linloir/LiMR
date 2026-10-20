# Built-in syntax

React defaults install gfm, math, code-highlight, mermaid, callout, definition, question, extras, video, figures, citation, translations, inline-highlights, footnotes, and source-annotations. Core createDocument defaults to basic CommonMark. These references describe LiMR 1.3.15; verify the host installs the required modules.

- Standard Markdown: headings, emphasis, lists, links, images, fenced/inline code, blockquotes. GFM adds adaptive tables (alignment via delimiter colons, escape literal pipes even in inline code), tasks, strikethrough, autolinks, and named footnote parsing; the default footnotes module presents notes as comment markers and sidebar/floating cards instead of superscripts/endnotes.
- Math uses $…$ and $$ fences; import math.css. KaTeX retains legal outer-operator breaks. An indivisible segment wider than its container scrolls locally in standard/justified prose and headings as well as KP. Do not insert arbitrary breaks into fractions/groups or rewrite the LaTeX to fit.
- Code uses fenced languages or literal ::code / ::code-highlight. Highlighting is lazy; unsupported or over-limit code remains readable. Long code defaults to folded, with wrap/copy/fold controls; use parameters.codeBlock for defaults and line numbers. See integration.md for source-line thresholds and bounded browser state.
- Mermaid uses mermaid code fences or a paired ::mermaid component. Open streaming diagrams show loading; completed diagrams render on the client and fade in. One shared toolbar copies the diagram body, zooms, and switches source/image views. Drag to pan; arrow keys and wheel scroll, Shift+wheel scrolls horizontally. Selection is atomic in both views, and selection-toolbar/native copying retains the entire original fence/component. Override --limr-mermaid-max-height and --limr-mermaid-scrollbar through CSS.
- Obsidian callouts use > [!type] Title. Types: note, abstract, info, todo, tip, success, question, warning, failure, danger, bug, example, quote; common Obsidian aliases work. A + suffix starts expanded, - starts collapsed. Blockquotes and callouts can nest. ::callout{type="tip" title="Title" fold="-"} is the component form.
- ==highlight== creates a blue source highlight that is read-only unless source editing is enabled; its toolbar offers copy plus a localized hint. Override --limr-inline-highlight or replace inlineHighlights({ color }). Named [^id] definitions and inline ^[Markdown content] create footnote cards. ==highlight==[^id] and ==highlight==^[note] attach the footnote to the highlight. Removing footnotes() restores GFM superscripts/endnotes.
- <definition title="Term"> supports Markdown body. <title> and <content> child tags support richer content.
- <question> supports question-content, question-hint, question-answer, question-sel-grp and question-sel. Use string attributes multi="true" and answer="[0,2]"; indices start at zero. This is an exercise, not an AI annotation.
- <extras> contains <extra title="Title" url="https://example.com" desc="Description" />.
- <citation id="a" title="Source" url="https://example.com" description="Markdown body" summary="Short preview" /> defines data; <ref id="a" /> or <ref ids='["a","b"]' /> inserts a marker. The cite-id, cite-from-ids, and desc attribute aliases are supported. Standard [^footnote] syntax is a separate feature.
- <figure src="/a.png" alt="A" caption="Caption" /> works alone or inside <figures columns="2">. Use figcaption children for Markdown. Limits: min-width/min-height 220/120, max-width/max-height 560/480; none/false removes maxima. Columns/rows, responsive, and gap control grouping. Media-local copy buttons copy image URLs or group Markdown; selection copying follows the selected atomic source range, including Markdown image syntax when present.
- Standalone `<img src="media/limr-icon.png" alt="LiMR" width="96" />` uses the single-figure view with preview, URL copy, atomic source selection and annotations. Numeric/px width and height cap display size while preserving aspect ratio and container bounds. In prose or an existing figure it stays in that layout. The host resolves relative URLs; arbitrary HTML is not passed through.
- <video src="/clip.mp4" provider="native" /> and <md-video url="…" /> support native, YouTube, and Bilibili. loading defaults to visible (200px proximity), not click. Use loading="click" to defer until interaction. Remote playback is not guaranteed by local iframe tests.
- <translations default="both"> contains <origin> and <translation>. Modes: origin/translation/both; both shows translation first. It displays supplied content, not an automatic translation service. Global parameters.translationMode overrides local mode; onTranslationModeChange accepts switch requests.

  Native selections default to staying within the starting origin/translation region; multiple paragraphs inside that region still select together. An outside drag stops before entering the translation block, even when it passes the entire block. Crossing from inside shows a toolbar hint; an outside drag shows it only when released inside a translation block. Existing and explicitly added annotations can still span boundaries. See [integration.md](integration.md#translation-selection) for the opt-out parameter.

Use static string/boolean attributes, never JavaScript expressions or spread props. Separate block tags and Markdown with blank lines. Only registered tags execute React renderers. Unknown tags show the full original text; unknown directives under standard() render children without their outer marker. Streaming defers partial headers and inline delimiters; recognized unclosed components carry incomplete and use module-owned loading/progressive rendering. Finish with streaming=false to apply final Markdown interpretation.

Every registered tag also supports its matching directive, including child tags and citation/ref. Paired ::name{key="value"} and a closing :: support nested Markdown components; ::: containers and single-colon inline directives are supported. Code/math/Mermaid directive bodies are literal. An unpaired two-colon line in a finalized document is a leaf directive. Component directives support scalar attributes and nesting; CoMark YAML properties, named slots, and frontmatter are not part of this syntax.

Tasks use diamond checks sized from the font, and callouts use small labels without leading icons. `standard()` includes generic source parsing/serialization. `onSourceChange` enables default task toggles and source highlight edits; type modules own annotation cards/actions, and the host or integration module owns file I/O.

## Named annotation ranges

Use an opening `::%%limr%%{<#id}` and closing `::%%limr%%{>#id}` boundary, plus a complete definition block:

```md
Read ::%%limr%%{<#passage}this **important** passage::%%limr%%{>#passage}.

:::limr-annotation{#note ranges="passage" type="footnote"}
The note body supports Markdown.
:::
```

The definition's ID identifies the annotation; ranges names one or more selection IDs separated by spaces or commas. Omitted ranges defaults to the annotation ID, and omitted type defaults to footnote. Extra scalar attributes become annotation data. type="highlight" accepts color, style="background|underline|dotted|wavy", and hidden="true". Multiple definitions with different IDs can share a range; one definition can reference several ranges. The last definition of the same annotation ID is effective, and the last highlight definition for an identical range determines its appearance.

Boundary IDs match `[A-Za-z0-9][A-Za-z0-9_.:-]*`. Distinct IDs support nested and crossing selections. Sequential pairs may reuse an ID; unmatched boundaries, an orphan close, or a second opening before the first closes leave every boundary of that ID literal. Adjacent opening and closing boundaries create a point annotation without a text highlight.

Only a real, fully closed `:::limr-annotation` container authorizes its referenced boundaries. The closing fence must have at least as many colons as the opening fence. Definitions may appear before or after the range, including in list or blockquote containers. Examples inside fenced/inline code, literal component bodies, footnote definitions, or unregistered HTML/JSX do not authorize boundaries. Boundaries inside an annotation definition's own body are not interpreted as range syntax.

The range can cross emphasis, links, paragraphs and other ranges, surround a code block, or select text inside inline/fenced code. For example, this code boundary pair is authorized by a definition outside the fence:

````md
```ts
const value = ::%%limr%%{<#call}readCache()::%%limr%%{>#call};
```

:::limr-annotation{#call-note ranges="call" type="footnote"}
Read the cached value.
:::
````

Code fences do not shield matching boundary tokens from a real definition elsewhere. To display a token literally, escape its first colon: `\::%%limr%%{<#example}`. An odd number of immediately preceding backslashes prevents activation, including in code. A fenced example containing both boundaries and their definition remains literal unless a real definition outside the example also references those IDs. Ordinary `==highlight==`, standard footnotes, and citations are independent features.
