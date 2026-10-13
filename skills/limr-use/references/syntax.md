# Built-in syntax

React defaults install gfm, math, code-highlight, definition, question, extras, video, figures, citation, and translations. Core createDocument defaults to basic CommonMark.

- Standard Markdown: headings, emphasis, lists, links, images, fenced/inline code, blockquotes. GFM adds tables, tasks, strikethrough, autolinks, and document-end footnotes.
- Math uses $…$ and $$ fences; import math.css.
- <definition title="Term"> supports Markdown body. <title> and <content> child tags support richer content.
- <question> supports question-content, question-hint, question-answer, question-sel-grp and question-sel. Use string attributes multi="true" and answer="[0,2]"; indices start at zero. This is an exercise, not an AI annotation.
- <extras> contains <extra title="Title" url="https://example.com" desc="Description" />.
- <citation id="a" title="Source" url="https://example.com" description="Markdown body" summary="Short preview" /> defines data; <ref id="a" /> or <ref ids='["a","b"]' /> inserts a marker. Legacy cite-id, cite-from-ids, and desc work. Standard [^footnote] syntax is a separate feature.
- <figure src="/a.png" alt="A" caption="Caption" /> works alone or inside <figures columns="2">. Use figcaption children for Markdown. Limits: min-width/min-height 220/120, max-width/max-height 560/480; none/false removes maxima. Columns/rows, responsive, and gap control grouping. Images copy URLs, groups copy Markdown.
- <video src="/clip.mp4" provider="native" /> and <md-video url="…" /> support native, YouTube, and Bilibili. loading defaults to visible (200px proximity), not click. Use loading="click" to defer until interaction. Remote playback is not guaranteed by local iframe tests.
- <translations default="both"> contains <origin> and <translation>. Modes: origin/translation/both; both shows translation first. It displays supplied content, not an automatic translation service. Global parameters.translationMode overrides local mode; onTranslationModeChange accepts switch requests.

Use static string/boolean attributes, never JavaScript expressions or spread props. Separate block tags and Markdown with blank lines. Only registered tags execute React renderers. Unknown tags show the full original text; unknown directives under standard() render children without their outer marker. Incomplete JSX falls back and retries during streaming.

Directives are registered separately: definition/question/extras/video have their main directive; figures has figures/figure/figcaption; translations has translations/origin/translation. Citation/ref do not register directives. Do not invent directives for every child tag. There is no built-in ==highlight== syntax.
