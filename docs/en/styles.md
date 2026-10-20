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
| --limr-annotation-label-size | Shared title, disclosure and action text size: .8rem on overlays, .8125rem in sidebars; action icons scale with the text |
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

## Image previews and ordered lists

`Image` / `ImagePreview` uses nonlinear hero motion from the original image to a centered fitting view while the backdrop dims. The bottom toolbar combines a 90%-opaque theme background with backdrop blur, respecting light/dark appearance. Buttons share 42×42px square slots, 24×24px SVG boxes and equal gaps. Fit/actual/fill cycle in one button, sharing the same state transition as copy-to-check feedback; zoom in, zoom out, copy and close use identical dimensions. Hover and press feedback honor reduced motion.

When overriding styles, keep button slots and icon boxes uniform; avoid extra padding or separators around the final buttons. Closing restores trigger focus; Escape and keyboard behavior remain available. Copying uses image pixels and requires clipboard capability and a readable image origin. See [API](api.md).

Ordered lists reserve marker space from their start, item count and explicit ordinals, including multiple digits and nested lists. Host CSS should preserve that inset rather than imposing a narrow gutter or an ancestor clip that hides the numbers again.

## Search styles

The optional `DocumentSearch` accepts `className` and `style`; `placement="inline"` participates in a host toolbar, while floating placement defaults to the top right. Import the normal LiMR stylesheet. Its rules live in the `limr` layer, so ordinary unlayered application CSS can override them.

```css
.article-search {
  --limr-search-width: min(30rem, calc(100vw - 4rem));
  --limr-search-accent: var(--limr-secondary);
  border-radius: 12px;
}
.article-search .limr-search-count {
  color: var(--limr-muted);
}
.article-reader {
  --limr-search-match: #d9ae403d;
  --limr-search-match-border: #b38b2466;
  --limr-search-current: #e99b3e80;
  --limr-search-current-border: #b67524;
}
```

Apply `article-search` to DocumentSearch and `article-reader` to Reader or the shared DOM ancestor of Markdown. Highlight variables must reach the reading surface; setting them only on the search box cannot color text elsewhere. Portals retain React context but need theme CSS on their destination.

Available selectors include `.limr-document-search`, `.limr-search-field`, `.limr-search-count`, `.limr-search-loading`, `.limr-search-error`, `.limr-search-regex`, `.limr-search-previous`, `.limr-search-next`, and `.limr-search-close`. Use `[aria-pressed="true"]` for selected options and `[data-open]` / `[data-loading]` for frame state. The default selected state is borderless and uses heading/secondary colors; counts and resting icons use muted text. The input has no added focus outline; keep keyboard button focus visible.

The search loading ring uses the same muted color as its navigation controls and a lighter stroke. Override `--limr-search-accent` to give only this ring a custom color.

The default frame reveals fixed-position contents from right to left, with its own opacity transition and delayed content fade. Loading expands a 2rem slot on the left; its 18px ring scales/fades in and out without shifting the input. Preserve inner width/right alignment and clipping if changing motion. Use `--limr-search-width` instead of setting the frame's open width alone, and preserve the reduced-motion override. Component/controller APIs and delay timing are in [reading search](search.md).

## Code and overflow styling

Use `parameters.codeBlock` to control folding, wrapping and line numbers; see [code controls](syntax.md#code-block-controls). Hiding gutter DOM or overriding pre overflow can leave buttons out of sync with presentation. Fold/wrap state never changes Markdown.

Inside `.limr-code-actions`, controls are `.limr-code-wrap`, `.limr-code-copy` and, for long blocks, `.limr-code-fold`. They share rounded buttons, strokes and hover/press motion. The fold arrow rotates; wrapping uses aria-pressed. Header top/right padding is equal. Custom themes should retain equal hit areas, keyboard focus and reduced-motion rules, scoped by `[data-limr-appearance]`.

`.limr-code-line::before` draws numbers; wrapped continuations belong to their original source line. Print styles expand complete code. Indivisible oversized inline formulas scroll locally; avoid forcing all `.limr-math-inline` elements to nowrap or a fixed width. Image width/height also obey container and figure bounds, so avoid global img widths that override these limits.

The `.limr-code-footer` shares `--limr-code-header` and `--limr-muted` with the title bar. Its container defines the same .7rem font size as the header label, so a host button font reset still inherits the small type. The footer is 24px tall at normal root size and reuses `.limr-underline` for animated hover/focus color and underline.

`.limr-code-body pre` owns the max-height transition, timed by `--limr-motion` / `--limr-ease`. Expanded code has no vertical scrollbar by default; an explicit positive maxExpandedLines enables local scrolling. Its measured `--limr-code-full-height` and `--limr-code-scrollbar-height` are internal; classic horizontal scrollbars receive extra space to preserve the visible row count. Use maxExpandedLines for height policy. `.limr-code-chunk` / `.limr-code-part` contain deferred text layout, so retain their containment and logical newline boundaries. Print CSS removes the height cap and containment and hides the footer.
