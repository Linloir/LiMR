# English documentation

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/README) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/README.md)

These pages describe the current repository implementation, including the new streaming, typography, and module capabilities. Check installed exports and types when consuming an npm release. Chinese is the default documentation language; every English page has a matching Chinese page.

| What you want to do | Read |
| --- | --- |
| Install and render a first document | [Getting started](getting-started.md) |
| Understand modules, included capabilities, and configuration | [Built-in modules](modules.md) |
| Write Markdown, Mermaid, callouts, highlights, footnotes, and two-colon components | [Default syntax](syntax.md) |
| Integrate React, typography modes, streaming, custom layouts, or SSR | [Application integration](integration.md) |
| Persist selections, highlights, citations, and annotations; understand atomic copying | [Annotations and selection](annotations.md) |
| Add syntax, cards, actions, streaming effects, or conditional renderers | [Extension development](extensions.md) |
| Build a standalone npm plugin and import it into an app | [Plugin packages](plugin-packages.md) |
| Customize themes, fonts, KP layout, animation, and diagrams | [Styles and fonts](styles.md) |
| Look up component props, hooks, and core APIs | [API reference](api.md) |
| Understand parsing, state, and resource boundaries | [Architecture and behavior](architecture.md) |
| Understand measurements and validation boundaries | [Performance and limits](performance.md) |
| Have an AI use LiMR or develop plugins | [AI Skills](ai-skills.md) |

Start with `Reader`, split components when a custom layout is needed, and add plugins for application features. Local persistence, import/export, and simulated assistant responses in the Playground belong to the demo application, not to Reader itself.

Playground uses standard typography by default; its menu also offers Knuth–Plass and justification, and the streaming demo runs at a slower pace. Refresh opens the default document without restoring the previous article or edits. Explicitly saved drafts can be loaded manually; locale preference persists separately. Docs links open the selected page directly, and switching between Docs and Playground preserves edits during the current session.

[Back to README](../../README.en.md) · [Live Playground](https://linloir.github.io/LiMR/)
