# Architecture and behavior

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/architecture) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/architecture.md)

## Three public layers

1. core owns original source, AST, blocks, headings, embedded references, diagnostics, and selection coordinates, without a React/DOM runtime dependency.
2. React connects document, interaction, layout, external annotations, and resource state to views.
3. extensions implements defaults through the same public contract available to applications; modules can be appended, replaced, or removed.

Docs navigation and Playground persistence/loading/language menus belong to the demo application, not the LiMR core.

## Append parsing

Streaming reparses from the unstable final top-level block and reuses earlier stable blocks. Late Markdown reference/footnote definitions may change earlier semantics and trigger full correction. Middle edits, document-scoped transforms, extension changes, and finalization also reparse fully. Long lists, code fences, or unclosed tags can still make tail reparsing expensive.

Source is not rewritten before parsing, and public coordinates preserve UTF-16 offsets. Custom transforms must preserve positions and honor locality. Embedded references and application annotations enter separately and merge in the React layer.

## State and resources

Update configuration immutably and keep static references stable. Scrolling and parameter updates do not require parsing. A provider manages one primary body; document state and annotation requests are isolated between providers.

Annotation loading uses bounded per-reader caching; releasing consumers can cancel unused requests. Pure Shiki token results use a bounded module-level cache, separate from user annotation data. The library supplies no model service, authentication, database, or automatic persistence.

## Fallback behavior

Unknown HTML/custom tags remain inert source text. In the default configuration, unknown directives render their children. Unknown annotation types retain data and show generic markers/unavailable content rather than silently disappearing. Syntax recovery, transform diagnostics, and client renderer boundaries have distinct scopes; see [extensions](extensions.md).

## Validation boundaries

The repository includes parser/offset/SSR unit tests, real Chromium interaction regressions, and separate React 18/19 npm-consumer checks. Intercepted media, mobile viewport simulation, and performance fixtures are not proof of remote playback, physical-device acceptance, or universal performance.
