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
| --limr-font-features | Defaults to normal, preserving full-width Chinese punctuation; opt into 'palt' 1 for proportional spacing |
| --limr-punctuation-spacing | Defaults to space-all, preserving full-width spacing between CJK punctuation |
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
| --limr-mermaid-max-height | Diagram viewport maximum height; default min(70vh, 36rem) |
| --limr-mermaid-scrollbar | Thin diagram scrollbar color; default #87837866 |

--limr-toolbar-available-height, --limr-toolbar-panel-height, and --limr-toc-available-height are runtime measurements, not theme inputs. AnnotationType.sidebar usually supplies local card colors; see [extensions](extensions.md).

## Fonts and package size

Local WOFF2 subsets of Maple Mono NF CN v7.9 ship in the package under the derivative name LiMR Maple Mono NF CN, with the OFL license. unicode-range and font-display: swap limit runtime requests, but the complete font assets still occupy about 31MB. base.css avoids browser loading, not npm installation size.

Body text does not automatically load Chinese fonts. Use system fallbacks, self-hosted fonts, or a host-chosen service. The Playground's Noto Serif SC belongs to the demo. No font should be assumed to cover every script.

Default font/math styles do not require a third-party CDN. Hosts can apply long-lived immutable caching to hashed font URLs; the library cannot set server HTTP headers. Remote image/video/plugin requests depend on content and host configuration.

## Layout and interaction conventions

The reading region determines synchronized sidebar height; do not size the page to all cards combined. Modules own content while the shared layout owns references, summaries, and card shells. Avoid duplicate padding or empty-paragraph compensation. Expanded cards animate from preview geometry; reduced-motion preferences disable motion.

Dense footer references borrow spare space above them at rest. Hovered or active items take alignment priority, allowing neighboring items to clip at the edges. Marker hover can compress the optional summary to leave room for the reference and heading. Expanded content is bounded by the visible reading region and scrolls within its card. Sidebar hover leaves the prose fixed; marker interaction triggers card alignment. Deactivation smoothly restores the resting layout using current card heights, `--limr-motion-slow`, and `--limr-ease`, preserving gaps and page height.

Selection retains native browser ranges and keyboard behavior. Paint layers calculate visible fragments only. Code allows partial highlights, math is atomic, and image highlights use borders. A single atomic block anchors its toolbar below the block. Printing hides paint layers while keeping document content. Mobile automation does not certify native iOS/Android handles or physical-device behavior.

The narrow-screen contents toggle aligns its text with the left edge of the divider. Hover and keyboard focus animate an underline beneath the text; the button background stays transparent.

Selection-toolbar copy feedback crossfades with a small scale change. Its label width grows and shrinks to the active face with nonlinear easing through `--limr-ease`; reduced-motion preferences remove these transitions.

Mermaid diagrams support drag panning, native touch/trackpad scrolling, arrow keys, Page Up/Down, Home/End, and Shift+wheel for horizontal movement. Click or Enter selects the whole block; dragging never selects its internal labels. Zoom scrolls inside the bounded viewport. The shared glass toolbar appears on hover/focus (always on touch screens); button feedback fades its background without scaling. Source mode keeps ordinary top padding. Themes and plugins can override the diagram height and scrollbar variables on the Reader or block.

## CSS-only themes

Export CSS, include it in files, and mark sideEffects as ["**/*.css"]. A theme does not need React or parser runtime dependencies. Scope rules to an appearance name and check light, dark, auto, portals, and two differently themed readers on the same page.

Expanded toolbar panels, hints and error messages fill the action row's available width, retaining their own padding and margins. The action row and available viewport determine the toolbar width; these contents do not contribute intrinsic width or enlarge it. Long text and unbroken strings wrap within that space. Highlight options use intrinsic text widths and wrap as whole items, aligned to the start. Multiline underlines need an inner inline span rather than a direct flex child.

## Paragraph layout and streaming

`typography="standard"` is the default. `justify` uses browser justification. `knuth-plass` uses TeX's box/glue/penalty dynamic program: four fitness classes, integer badness, squared penalties, consecutive/final hyphen demerits, pretolerance, tolerance and emergency passes. It optimizes the whole paragraph without a beam or paragraph-length cutoff. Default English hyphenation uses Knuth–Liang patterns; Unicode break opportunities also support Chinese punctuation. Browser font shaping remains authoritative, so this does not promise pixel-identical TeX PDF output.

`knuthPlass` accepts `pretolerance`, `tolerance`, `linePenalty`, `hyphenPenalty`, `adjacentDemerits`, `doubleHyphenDemerits`, `finalHyphenDemerits`, `emergencyStretch` (CSS pixels), `looseness`, and `hyphenate` (`false` or a function returning the word's parts). Core defaults follow TeX's usual paragraph parameters, with 16px of emergency stretch. The browser adapter instead derives 3em from the font size for break scoring only; an explicit `knuthPlass.emergencyStretch` overrides it. `pretty` and `normal` remain optional legacy CSS modes.

KP loads lazily and typesets stable paragraphs near the viewport. It retains their DOM when they leave the viewport, reuses measured items and prefix sums for width changes, and preserves native selections before updating text. During shrink, offscreen cached lines clip horizontal overflow until their queued exact layout is ready; an actively selected paragraph temporarily wraps while keeping its native range. Active streaming tails use normal wrapping until stable. Layout never changes original source text, annotations or copy output. See [KP performance](knuth-plass-performance.md) for measured scroll/resize comparisons and [TeX's source](https://github.com/TeX-Live/texlive-source/blob/trunk/texk/web2c/tex.web) for the underlying paragraph model. The separation of preparation and layout also follows the incremental approach used by [Typst](https://github.com/typst/typst/tree/main/crates/typst-layout/src/inline).

Default loading rings use a fixed 32×32 view box, 22px display size, a thick track and an animated arc. Rotation and arc growth/shrink use nonlinear easing around one fixed center; color follows `--limr-secondary`. Streaming text and blocks fade from transparent to opaque, without a background tint or a second paragraph-completion entrance. Plugins can replace the shared effect through `streaming.effect`, and each Reader can override it through `streamEffect`.

Source-authored highlight blue is controlled by `--limr-inline-highlight`, or replace the module using `inlineHighlights({ color })`. Localize the read-only toolbar hint with `locale.inlineHighlightHint`.

Task lists use the same diamond check as question choices. The marker uses font cap height for Latin text or ideographic height for CJK and aligns with the first line, independently of line-height. A native checkbox retains keyboard and accessibility semantics. Unchecked text is lighter and checked text is darker; hovering an unchecked item darkens its text and reveals the same line-by-line, left-to-right underline as question choices. Tasks are read-only by default; supplying onSourceChange enables the default task renderer to update source without another plugin.

Callouts share the small label and body typography of notes, definitions and questions, without a leading type icon. Foldable callouts retain their toggle chevron.
