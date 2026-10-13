---
name: limr-use
description: Integrate @linloir/limr into React applications, author its supported Markdown, configure streaming, annotations, locales and themes, or import existing LiMR plugins. Use for LiMR consumers; new reusable plugin packages belong to limr-plugin-development.
---

# Use LiMR

Deliver a working integration using the host application's installed LiMR API. These references cover the 1.0.0 contract; inspect package.json and exported declarations before assuming a newer or older version behaves identically.

- Read [integration.md](references/integration.md) for components, styles, state, streaming, and installed plugin imports.
- Read [syntax.md](references/syntax.md) when authoring or converting content. Preserve original source and do not invent tag/attribute support.

Choose Reader for the complete UI, Markdown for body-only rendering, or one DocumentProvider with one primary Markdown for a custom layout. Inside a provider, omit Markdown.source to share the document.

Append third-party factories through a stable plugins array. extensions replaces the entire list; use standard() and replaceExtension() to change defaults. Verify package existence and public exports before suggesting an npm install. Repository @limr-example packages are unpublished examples.

Persist controlled annotations immutably and return every onAnnotationsChange value. Keep unknown types in storage even if the host filters them from a view. Unknown annotation types currently show generic/unavailable UI, not silent omission. Use original UTF-16 ranges, stable document IDs, and quotes; avoid DOM-derived offsets.

Use locale={chinese} or english for built-in labels. locale does not translate source. In 1.0.0, plugins can use the public useLocale() hook and locale.language, and AnnotationType.label may resolve from the locale. Confirm these exports before using them against 0.1.0.

For streaming, pass the accumulated source and finalize with streaming=false. Transport, authentication, storage, and stopping generation belong to the app. No AI provider is installed by this skill.

Follow the existing project layout and stylesheet conventions. Validate a real rendered page, relevant interactions, and type/build checks. When changing portals or responsive layouts, inspect desktop and narrow containers. Report what was verified locally and what still needs the host environment; do not publish or deploy unless requested.
