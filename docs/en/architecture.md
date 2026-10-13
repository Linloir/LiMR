# Architecture and behavior

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/architecture) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/architecture.md)

## Three public layers

1. core owns original source, AST, blocks, headings, embedded references, diagnostics, and selection coordinates, without a React/DOM runtime dependency.
2. React connects document, interaction, layout, external annotations, and resource state to views.
3. extensions implements defaults through the same public contract available to applications; modules can be appended, replaced, or removed.

Docs navigation and Playground persistence/loading/language menus belong to the demo application, not the LiMR core.

## Append parsing

Streaming reparses from the unstable final top-level block, reusing stable prefixes, line indexes, and node semantic indexes. Growing code fences can use a literal fast path. Finalization can also reparse only the tail rather than always parsing the whole document. Late Markdown reference/footnote definitions, middle edits, document-scoped transforms, or extension changes can still require a full parse. Long paragraphs, lists, and complex unclosed tags retain tail-parsing costs.

`incomplete` identifies an unclosed node; `pending` describes its growing top-level block. Modules can render progressively or provide `streaming.Loading`. Incomplete headers and inline syntax markers are deferred. Increment animations affect new content; temporary wrappers merge after animation completion once native selection leaves them. Streaming code retains existing text nodes, and final highlighting waits while its text is selected.

Public source always retains the original input. Internally, the parser inserts markers for two-colon components and incomplete syntax, then maps positions back through sparse offsets. These internal markers never enter copied text, annotations, or persisted data. Custom transforms must preserve original UTF-16 positions and honor locality. Embedded references and application annotations enter separately and merge in the React layer.

## Typography and source mapping

Standard mode uses browser layout by default. KP loads on the client: preparation caches glyph measurements, hyphenation, legal breakpoints, and prefix sums; solving runs TeX paragraph dynamic programming. Stable paragraphs near the viewport take priority and retain their DOM offscreen. Width changes reuse preparation and text containers. Selected paragraphs keep their native Range and defer layout until selection clears. Original source offsets and annotations remain unchanged; see [styles](styles.md) and [KP performance](knuth-plass-performance.md).

Atomic selection text serializes complete original source; surrounding ordinary text retains its rendered spelling and explicit line breaks. Mapped attributes, children, and nested atoms follow the enclosing plugin block’s atomic selection contract.

## State and resources

Update configuration immutably and keep static references stable. Scrolling and parameter updates do not require parsing. A provider manages one primary body; document state and annotation requests are isolated between providers.

Annotation loading uses bounded per-reader caching; releasing consumers can cancel unused requests. Pure Shiki token results use a bounded module-level cache, separate from user annotation data. Mermaid uses bounded result caching and serializes global initialization with rendering so readers using different themes cannot interfere. The library supplies no model service, authentication, database, or automatic persistence.

## Fallback behavior

Unknown HTML/custom tags remain inert source text. In the default configuration, unknown directives render their children. Unknown annotation types retain data and show generic markers/unavailable content rather than silently disappearing. Syntax recovery, transform diagnostics, and client renderer boundaries have distinct scopes; see [extensions](extensions.md).

## Validation boundaries

The repository includes parser/offset/SSR unit tests, real Chromium interaction regressions, and separate React 18/19 npm-consumer checks. Intercepted media, mobile viewport simulation, and performance fixtures are not proof of remote playback, physical-device acceptance, or universal performance.
