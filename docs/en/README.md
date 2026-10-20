# English documentation

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/README) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/README.md)

LiMR brings Markdown parsing, reading layout, selection and annotations into one reader. Built-in capabilities include Worker loading and windowed reading for large documents, adaptive tables, formulas, code folding/wrapping/line numbers, image previews and bilingual content. These belong to the core library; hosts connect files, services and persistence.

## Start with your scenario

| I want to… | Start here | Go deeper |
| --- | --- | --- |
| Render my first React article | [Getting started](getting-started.md) | [Integration and module configuration](integration.md) |
| Open large files, show progress, restore position | [Quick-start large-file example](getting-started.md#load-large-documents) | [Loading, windows and printing](large-documents.md) |
| Search reading text, including unmounted content | [Reading search](search.md) | [Custom UI and commands](search.md#replace-the-interface), [styles](styles.md#search-styles) |
| Read dense or very wide tables | [Quick-start reading policies](getting-started.md#adjust-reading-policies) | [Adaptive tables, full content and native mode](table-layout.md) |
| Author math, code, images, citations or translations | [Syntax manual](syntax.md) | [Annotations and selection](annotations.md) |
| Integrate chat streams, editors or local files | [Scenario guide](integration.md#choose-a-component) | [Source editing](integration.md#source-editing-and-local-files) |
| Customize rendering or develop a plugin | [Choose an extension interface](extensions.md#choose-an-interface) | [Themes](styles.md), [packaging](extensions.md#package-and-integrate) |
| Have an AI integrate LiMR or write plugins | [AI Skills](ai-skills.md) | Choose limr-use or limr-plugin-development |

## Follow the implementation path

1. **Start and author**: [Getting started](getting-started.md) provides working entry points. The [syntax manual](syntax.md) owns the module catalog, content forms, attributes and interaction boundaries.
2. **Integrate**: [Application integration](integration.md) explains components and configuration. [Large documents](large-documents.md), [tables](table-layout.md) and [annotations](annotations.md) develop each capability.
3. **Extend**: [Extension development](extensions.md) connects the smallest public interface to package validation. [Styles](styles.md) covers CSS, fonts, typography and portal themes.
4. **Reference and verify**: [API](api.md), [architecture](architecture.md), [renderer performance](performance.md), [loading and memory](loading-performance.md), [KP performance](knuth-plass-performance.md). Measurements describe their tested workloads, not fixed limits for all inputs.

Module configuration is consolidated into integration, and plugin packaging into extension development; earlier pages retain compatibility links. Both languages share this structure. Packaged documentation matches its release; check installed declarations when using an older version.

Playground drafts, import/export and simulated assistant responses belong to the example app. Refresh opens the default article; explicitly saved drafts can be loaded manually, and locale persists separately. Switching Docs/Playground retains edits during the current session.

[Back to project](../../README.en.md) · [Live Playground](https://linloir.github.io/LiMR/)
