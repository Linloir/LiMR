# Architecture and behavior

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/architecture) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/architecture.md)

## Three public layers

1. core owns original source, AST, blocks, headings, embedded references, diagnostics, and selection coordinates, without a React/DOM runtime dependency.
2. React connects document, interaction, layout, external annotations, and resource state to views.
3. extensions implements defaults through the same public contract available to applications; modules can be appended, replaced, or removed.

Docs navigation and Playground persistence/loading/language menus belong to the demo application, not the LiMR core.

## Complete-input loading pipeline

`DocumentSession` owns input reading/decoding, parsing, indexing, transport, cancellation and the final document state; React's `AsyncReader` connects it to Reader. State is independent of UI, so hosts can render their own progress. Blocking waits for the final snapshot; progressive may offer an explicitly incomplete read-only preview. Document completeness and full DOM mounting are separate properties.

Verified unmodified built-in syntax uses two-pass bounded parsing: Markdown grammar first identifies safe root boundaries and global definitions; each window then builds its AST and releases temporary token/event workspace before document transforms run once on the merged tree. Lists, fences, HTML, directives and math are never split at arbitrary byte positions. Annotation discovery and body parsing reuse a matching tree/compact mapping and shared line indexes. Foreign or modified parser hooks retain the complete path.

Large complex snapshots use negotiated paged TypedArray transport with deduplicated strings/object shapes, shared references, Maps/Sets and original positions. The default worker is terminated after delivery and before cooperative main-thread reconstruction, reducing overlapping graphs. Eligible independent prose uses a separate block-packet path. These are internal representations: public source/AST/snapshot contracts remain intact, without arbitrary parallel plugin parsing or a fixed memory ceiling.

Body and long-TOC windows, annotation interval indexes and lazy sidebar excerpts reduce reading-time mounting and lookup work. The full tree remains resident; a single indivisible block, custom syntax, retained media or full printing can still be costly. See [large documents](large-documents.md) for capability/fallback contracts and [loading and memory performance](loading-performance.md) for reproducible data.

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

Unknown HTML/custom tags remain inert source text. In the default configuration, unknown directives render their children. Unknown annotation types retain data without markers, cards, or type-specific interactions; registering their module restores presentation. Removing a syntax module reparses the unchanged source with the remaining modules. Syntax recovery, transform diagnostics, and client renderer boundaries have distinct scopes; see [extensions](extensions.md).

## Validation boundaries

The repository includes parser/offset/SSR unit tests, real Chromium interaction regressions, and separate React 18/19 npm-consumer checks. Intercepted media, mobile viewport simulation, and performance fixtures are not proof of remote playback, physical-device acceptance, or universal performance.

## Source editing capability

Parsing and rendering never implicitly rewrite input. The sourceAnnotations module in standard resolves named ranges and definitions into ordinary Annotation objects and supplies the generic editSourceAnnotations serializer; modules register types, cards and dedicated actions. Supplying onSourceChange allows default tasks/highlights and module actions to submit atomic edits against one revision through editSource. Core validates coordinates and overlaps, default or custom handlers serialize formats, and the host or integration module owns acceptance, file persistence and undo. Source annotations share the sidebar, overlay and toolbar; external annotation persistence stays separate without another editor wrapper.
