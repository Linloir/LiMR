# LiMR implementation and acceptance

The agreed scope is a standalone React Markdown package preserving the original
renderer's reading style and capabilities while making syntax,
annotation types, selection actions, layout and resource loading extensible.
Long-document reading and streaming output are equal first-release requirements.
All original special syntax modules belong to LiMR's default extensions, with
individual imports, replacement and opt-out. There is no platform-specific preset.
Default annotations are reference citations only; highlighting is a core capability.
Question/note/chat annotations belong to application plugins. Question content
blocks remain a default syntax extension. Plugins can contribute menu actions,
annotation types and streaming content updates through document commands.

## Required deliverables

- DOM-free document engine, original UTF-16 offsets, immutable document snapshots,
  stable blocks, incremental append with reference dependency invalidation.
- CommonMark/GFM, math, highlighting, images, figures, videos, questions,
  definitions, extra reading, citations; each special capability is an extension.
- Public parser and component extension APIs; replace/disable built-ins; no
  execution of Markdown-supplied JavaScript or unregistered HTML.
- Markdown, DocumentProvider, Reader, TableOfContents, AnnotationSidebar,
  AnnotationOverlay, SelectionToolbar; standalone and composed use.
- Generic annotation types, occurrence anchors, custom icons/content, recursive
  Markdown with isolated document scopes and shared configuration/resources.
- Raw, syntax-complete and block selections; extensible atomic selection behavior;
  versioned selection snapshots and programmable highlights.
- Scroll-root convention, sidebar collision handling and custom positioning;
  wrapping/fixed-title/hidden-scrollbar TOC with active-item following.
- Pointer previews, touch/click expansion, content-column sizing, viewport and
  keyboard accommodation, focus/keyboard behavior and configurable portals.
- Bounded caches, deduplicated/cancellable optional data loaders, no implicit CDN
  font/style requests; local math assets and optional self-hosted font guidance.
- Classic light/dark theme, SSR/multiple documents, streaming incomplete syntax,
  final equivalence and opt-in follow-output without fighting user scrolling.
- Package exports/types/assets; examples and API/extension documentation.
- Core/SSR tests, real-browser interaction/layout tests, pack/consumer smoke,
  visual review and reproducible static/streaming performance measurements.

## Decisions

Use mdast/micromark for standards-compatible parsing. Share the parsed document
across all views. Roll back the final top-level block on append; maintain a
definition environment for suffix parsing; invalidate previous nodes when
document-wide definitions change. Unknown whole-document transforms fall back
to a full parse. Never claim arbitrary plugins are incrementally safe.

The public core has no React or DOM runtime dependency. React renderers own
their DOM, including marks. Layout reads, selection and document changes use
separate subscription channels. Source offsets always refer to the original
input, including legacy tag syntax.

Do not claim performance parity until the measurements cover equivalent
features. Virtualization is optional future work unless a verified implementation
preserves selection/search/printing; the default reading mode retains document
semantics.

## Verification completed

- `pnpm check`: strict TypeScript checking, 32 core/resource/runtime/SSR tests,
  ESM declaration build and copied local math assets.
- `pnpm test:browser`: 11 Chromium tests covering desktop rendering, three
  selection variants, highlights, TOC follow/clamping, shared internal scroll
  roots, sidebar alignment, pointer and touch cards, reduced visual viewport,
  plugin streaming/cancellation, multiple documents, SSR hydration, resource
  handoff/cache invalidation and decoded native-text source mapping.
- `pnpm test:package`: install the actual tarball in isolated React 18.3 and
  React 19 consumers; check public TypeScript declarations, SSR, extension
  imports and every math font URL. Verify the core entry with a loader that
  rejects React imports. The resulting archive is copied to `artifacts/`.
- Production Node and isolated-browser benchmarks are reproducible; complete
  measurements and limitations are in `docs/performance.md`.
- Desktop, content-block and mobile plugin screenshots are in `docs/screenshots/`.
  The playground explicitly supplies its own local demo font; package CSS does
  not fetch a body/code font.

The assistant example uses a local simulated adapter. Real service connections
and authentication belong to the consuming application. No remote publication,
real mobile-device acceptance or arbitrary-plugin performance claim is included.
