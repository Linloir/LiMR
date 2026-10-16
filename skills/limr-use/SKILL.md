---
name: limr-use
description: Integrate @linloir/limr into React applications, author its supported Markdown, configure streaming, annotations, locales and themes, or import existing LiMR plugins. Use for LiMR consumers; new reusable plugin packages belong to limr-plugin-development.
---

# Use LiMR

Deliver a working integration using LiMR 1.2.1. Inspect the host's package.json and public declarations to confirm the required APIs are installed.

- Read [integration.md](references/integration.md) for components, styles, state, streaming, and installed plugin imports.
- Read [syntax.md](references/syntax.md) when authoring or converting content. Preserve original source and do not invent tag/attribute support.

Choose Reader for the complete UI, Markdown for body-only rendering, or one DocumentProvider with one primary Markdown for a custom layout. Inside a provider, omit Markdown.source to share the document.

Append third-party factories through a stable plugins array. extensions replaces the entire list; use standard() and replaceExtension() to change defaults. Verify package existence and public exports before suggesting an npm install. Repository @limr-example packages are unpublished examples.

Persist controlled annotations immutably and pass each accepted onAnnotationsChange array back through the annotations prop. Only a synchronous false return rejects a change; other return values, including Promises, are ignored. Unknown annotation types remain in storage without markers, cards or type-specific interactions; registering their module restores the UI. Preserve the complete annotations array when saving. Use original UTF-16 ranges, stable document IDs, and quotes; avoid DOM-derived offsets.

Create editable drafts with addAnnotation(annotation, { edit: true }). After an accepted updateAnnotation, call commitAnnotationEdit(id). For explicit cancel or an untouched empty draft leaving the editor, call cancelAnnotationEdit(id) and retain the draft/editor if it returns false. The runtime tracks which annotation and highlights were created by that operation; existing records and independently used highlights survive cancellation.

Use locale={chinese} or english for built-in labels. locale does not translate source. Plugins use the public useLocale() hook and locale.language, and AnnotationType.label may resolve from the locale.

For streaming, pass the accumulated source and finalize with streaming=false. Transport, authentication, storage, and stopping generation belong to the app. No AI provider is installed by this skill.

Follow the existing project layout and stylesheet conventions. Validate a real rendered page, relevant interactions, and type/build checks. When changing portals or responsive layouts, inspect desktop and narrow containers. Report what was verified locally and what still needs the host environment; do not publish or deploy unless requested.
