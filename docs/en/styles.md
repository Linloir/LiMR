# Styles and fonts

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/styles) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/styles.md)

## Base styles and themes

Default rules live in @layer limr, so ordinary host CSS can override them. Choose styles.css (with Maple) or styles/base.css (without loading Maple), and add math.css for formulas.

```tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles/base.css';
import './paper.css';

export function Paper({ source }: { source: string }) {
  return <Reader source={source} appearance="paper" theme="auto" />;
}
```

Example paper.css:

```css
[data-limr-appearance='paper'] {
  --limr-font-text: Georgia, 'Noto Serif SC', serif;
  --limr-content-width: 820px;
  --limr-accent: #8b6548;
}
[data-limr-appearance='paper'][data-limr-theme='dark'] {
  --limr-accent: #d1ab84;
}
```

appearance propagates to portalled controls. Do not rely only on .limr-reader ancestry. theme: auto selects built-in colors with the system preference; custom dark overrides for auto also need a prefers-color-scheme media rule. See the standalone [paper-theme](../../examples/packages/paper-theme/index.css) example.

## Common variables

| Variable | Purpose |
| --- | --- |
| --limr-font-text / --limr-font-code | Body / code fonts |
| --limr-font-size / --limr-line-height | Base typography |
| --limr-font-features | Defaults to 'palt' 1 for proportional punctuation where supported |
| --limr-emphasis-spacing / --limr-list-item-gap | Trailing emphasis / list spacing |
| --limr-text / --limr-heading / --limr-secondary / --limr-muted | Text hierarchy |
| --limr-background / --limr-surface / --limr-border | Backgrounds and borders |
| --limr-link / --limr-accent / --limr-selection | Links, active state, selection |
| --limr-content-width / --limr-reader-width | Body / overall width; default 900px / 1800px |
| --limr-toc-width / --limr-sidebar-width / --limr-column-gap | Side column widths and gaps |
| --limr-sticky-top | Sticky offset |
| --limr-reader-bottom-space / --limr-reader-min-height | Short-document height and bottom space |
| --limr-sidebar-padding-inline / --limr-sidebar-reference-gap | Shared padding (10px) and reference separation (1px) |
| --limr-overlay-duration / --limr-overlay-morph-duration | Enter/exit (560ms), preview/expanded morph (480ms) |
| --limr-overlay-z / --limr-toolbar-z | Floating control stacking |
| --limr-overflow-fade-size | Overflow fade, default 24px; 0px disables |
| --limr-toolbar-panel-max-height | Maximum toolbar panel height |
| --limr-tool-icon-size / --limr-mark-size | Toolbar icons / inline markers |

--limr-toolbar-available-height, --limr-toolbar-panel-height, and --limr-toc-available-height are runtime measurements, not theme inputs. AnnotationType.sidebar usually supplies local card colors; see [extensions](extensions.md).

## Fonts and package size

Local WOFF2 subsets of Maple Mono NF CN v7.9 ship in the package under the derivative name LiMR Maple Mono NF CN, with the OFL license. unicode-range and font-display: swap limit runtime requests, but the complete font assets still occupy about 31MB. base.css avoids browser loading, not npm installation size.

Body text does not automatically load Chinese fonts. Use system fallbacks, self-hosted fonts, or a host-chosen service. The Playground's Noto Serif SC belongs to the demo. No font should be assumed to cover every script.

Default font/math styles do not require a third-party CDN. Hosts can apply long-lived immutable caching to hashed font URLs; the library cannot set server HTTP headers. Remote image/video/plugin requests depend on content and host configuration.

## Layout and interaction conventions

The reading region determines synchronized sidebar height; do not size the page to all cards combined. Modules own content while the shared layout owns references, summaries, and card shells. Avoid duplicate padding or empty-paragraph compensation. Expanded cards animate from preview geometry; reduced-motion preferences disable motion.

Dense footer references borrow spare space above them at rest. Hovered or active items take alignment priority, allowing neighboring items to clip at the edges. Marker hover can compress the optional summary to leave room for the reference and heading. Expanded content is bounded by the visible reading region and scrolls within its card. Packed sidebar items still align the prose on hover. Deactivation smoothly restores the resting layout using current card heights, `--limr-motion-slow`, and `--limr-ease`, preserving gaps and page height.

Selection retains native browser ranges and keyboard behavior. Paint layers calculate visible fragments only. Code allows partial highlights, math is atomic, and image highlights use borders. Printing hides paint layers while keeping document content. Mobile automation does not certify native iOS/Android handles or physical-device behavior.

## CSS-only themes

Export CSS, include it in files, and mark sideEffects as ["**/*.css"]. A theme does not need React or parser runtime dependencies. Scope rules to an appearance name and check light, dark, auto, portals, and two differently themed readers on the same page.

Expanded toolbar panels use the full available toolbar width. The action row and available viewport determine its width; expanded content does not contribute intrinsic width or enlarge the toolbar. Highlight options use intrinsic text widths and wrap as whole items, aligned to the start. Multiline underlines need an inner inline span rather than a direct flex child.
