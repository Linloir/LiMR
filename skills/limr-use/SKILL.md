---
name: limr-use
description: Integrate @linloir/limr into React applications, author its supported Markdown, configure large-document workers, adaptive tables, optional reading search, code folding/wrapping/line numbers, host progress, streaming, annotations, locales and themes, or import existing LiMR plugins. Use for LiMR consumers; new reusable plugin packages belong to limr-plugin-development.
---

# Use LiMR

Deliver a working integration using LiMR 1.3.14. Inspect the host's package.json and public declarations to confirm the required APIs are installed.

- Read [integration.md](references/integration.md) for components, styles, state, streaming, adaptive table layout and code controls, translation selection settings, and installed plugin imports.
- Read [loading.md](references/loading.md) for AsyncReader, host-owned progress/cancel/retry, large documents, worker integration, reading windows and image previews.
- Read [search.md](references/search.md) for optional regex/case search, independent or replaced UI, styles, host find commands and search Worker/CSP.
- Read [syntax.md](references/syntax.md) when authoring or converting content. Preserve original source and do not invent tag/attribute support.

Start with the input scenario, then choose existing presentation parameters before writing a custom renderer.

Choose AsyncReader for complete files with asynchronous loading; choose Reader for the complete UI with already available text, Markdown for body-only rendering, or one DocumentProvider with one primary Markdown for a custom layout. Inside a provider, omit Markdown.source to share the document.

Use `parameters.tableLayout` for adaptive/native/custom table policy, and `parameters.codeBlock` for code defaults. Long code starts folded by default; wrapping and line numbers default off. Per-block choices are temporary browser view state, not source edits. Read the reference for precedence, cache limits and minimum versions.

Append third-party factories through a stable plugins array. extensions replaces the entire list; use standard() and replaceExtension() to change defaults. Verify package existence and public exports before suggesting an npm install. Repository @limr-example packages are unpublished examples.

Persist controlled annotations immutably and pass each accepted onAnnotationsChange array back through the annotations prop. Only a synchronous false return rejects a change; other return values, including Promises, are ignored. Unknown annotation types remain in storage without markers, cards or type-specific interactions; registering their module restores the UI. Preserve the complete annotations array when saving. Use original UTF-16 ranges, stable document IDs, and quotes; avoid DOM-derived offsets.

Create editable drafts with addAnnotation(annotation, { edit: true }). After an accepted updateAnnotation, call commitAnnotationEdit(id). For explicit cancel or an untouched empty draft leaving the editor, call cancelAnnotationEdit(id) and retain the draft/editor if it returns false. The runtime tracks which annotation and highlights were created by that operation; existing records and independently used highlights survive cancellation.

Use locale={chinese} or english for built-in labels. locale does not translate source. Plugins use the public useLocale() hook and locale.language, and AnnotationType.label may resolve from the locale.

For complete files, choose blocking or progressive presentation and consume the session progress API; do not treat a provisional prefix as editable or complete. For streaming, pass the accumulated source and finalize with streaming=false. Transport, authentication, storage, and stopping generation belong to the app. No AI provider is installed by this skill.

Follow the existing project layout and stylesheet conventions. Validate a real rendered page, relevant interactions, and type/build checks. When changing portals or responsive layouts, inspect desktop and narrow containers. Report what was verified locally and what still needs the host environment; do not publish or deploy unless requested.
