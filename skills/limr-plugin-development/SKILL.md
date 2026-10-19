---
name: limr-plugin-development
description: Develop, package, and integrate new @linloir/limr extension modules with custom syntax, annotation cards, selection actions, parameters, or CSS themes. Use for reusable LiMR plugin packages; ordinary application integration belongs to limr-use.
---

# Develop a LiMR plugin

Deliver the requested extension as a package plus a working host import using LiMR 1.3.7. Inspect the installed version and public declarations before choosing APIs.

Read [the contract](references/contract.md) for source mapping, native selection boundaries, annotation presentation, actions, resources, and localization. Start from [plugin-template](assets/plugin-template/README.md) when a standalone TypeScript/ESM package is useful. Copy the complete template to the requested project destination, rename its example package and IDs, and remove capabilities not needed by the task. Do not edit the installed skill as the project implementation.

Choose the smallest public contract: defineBlock for a block; defineAnnotation for a type; defineExtension to combine capabilities. Keep React/LiMR as peers and build externals, export declarations, and expose CSS separately with sideEffects. Import no renderer internals and bundle no second React or LiMR runtime.

For table planning, use parameters.tableLayout with false or { algorithm } and the public TableLayoutAlgorithm contract; do not replace GFM syntax merely to change layout. Read the contract's table section for caching and host precedence.

Preserve original source positions. Reuse children/renderChildren, renderValue, and renderAttribute. Store every selected range with documentId and its original quote. A transform defaults to document scope; scope:local is valid only for subtree-local, prefix-independent work.

Let the module own card meaning and controls through Content, overlay.Card, and sidebar.Preview. Reuse AnnotationCard and AnnotationMarkdown where suitable. LiMR owns shared positioning, portals, focus, and motion. Preview must not fetch; long tasks honor context.signal. The application owns services and credentials.

Start an editable creation with addAnnotation(annotation, { edit: true }); save with an accepted updateAnnotation followed by commitAnnotationEdit(id). Explicit cancel and an empty draft leaving the editor use cancelAnnotationEdit(id), preserving draft/editor on rejection. The runtime tracks creation ownership and preserves existing or independently used highlights. Expose single-annotation deletion through canEditAnnotation(id), removeAnnotation(id), and the shared operation-row classes.

Support host localization when requested: use useLocale() in components, locale.language for plugin dictionaries, label(locale) for annotation names, and context.locale in actions. Preserve stored user text across language changes. Declare the required LiMR APIs in peerDependencies.

Integrate with a stable plugins array and explicit CSS imports. Use extensions + replaceExtension for default replacements; duplicate names/tags/directives are errors. Do not silently discard persisted unknown annotations.

For large-document hosts, declare public virtualization text/state contracts for custom views, keep syntax registration separate from view plugins, and respect provisional/readOnly state. Register custom worker syntax by versioned ID on both sides; never assume scope:local alone proves safe independent parsing or transfer. See the contract reference.

Validate the built package in an independent consumer, not just a source alias. Check TypeScript, SSR, retained built-ins, syntax/source mapping/finalized streaming where relevant, and desktop/mobile card interactions for UI features. Exercise supported React major versions and both languages/themes when claimed. Report the package path and verified limits. Publishing remains a separate user action unless explicitly requested.
