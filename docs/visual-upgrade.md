# Visual and extension refinement

This checklist records the requested acceptance scope. An item is complete only
after its implementation and relevant browser/package evidence are recorded.

- [x] Third-party pnpm plugins add to defaults with a small public API; a real
  separate package consumer verifies syntax, actions and annotation content.
- [x] CSS packages override the default skin, including portals and multiple
  readers. Document stable tokens, layers, selectors and packaging.
- [x] Local Maple Mono NF CN with ligatures, CJK/Nerd/multilingual glyphs, small
  on-demand font subsets, swap fallback, versioned cacheable URLs and licenses.
- [x] Rounded copy/check icons: frosted math button, transparent code button,
  background hover/press and nonlinear success/reset; code header/body same
  font, both themes. Hover/press translation was removed after review.
- [x] Compact symmetric block spacing, question type label, animated diamond
  choices, multiline underline, color feedback, single submit/retry, expandable
  hint/answer sections with animated result and answer reveal.
- [x] Reusable nonlinear multiline underline on TOC, extras, options and links.
- [x] Nonlinear TOC/sidebar alignment, card expansion/collapse; reduced motion.
- [x] Anchored overlay enter/exit and continuous preview-to-expanded transition,
  animated content reveal, no remount/repeated request, focus/viewport handling.
- [x] Square centered markers with independent hover/press animations.
- [x] Unified line geometry for selection and highlights: text, partial inline
  code, atomic inline/display math, partial fenced code with inline markers,
  special blocks. Marker paint only when text on both sides is spanned; preserve
  marker background/motion. No adjacent-code-line overlap.
- [x] Mobile selection visual parity where browser APIs permit; document native
  handles/platform limitations with evidence rather than removing accessibility.
- [x] Playground common navigation and plugin styling, live two-column editor
  and bidirectional source-aware scroll matching, responsive narrow layout.
- [x] Unit/browser/package tests, visual evidence in light/dark/mobile, updated
  performance checks for long documents and streams without unbounded repaint.

Additional review requirements:

- [x] Continuous drag regression: publish and paint during the gesture; measure
  an 878k-character document, select-all/scroll, and 1,000 tokenized code lines.
  The three browser regressions passed with one worker on 2026-10-12.
- [x] All annotation buttons use the same fixed slot at 80% of the previous
  citation size; active state must not persistently enlarge plugin markers;
  oversized SVG/image/nested plugin content stays inside the slot.
- [x] Whole collapsed sidebar card is clickable, localized expand/collapse text
  and hover/state motion, balanced bottom spacing in nested Markdown.
- [x] Standard blockquotes use a Note/注释 title and special-block background.
- [x] Definition/extras have more bottom breathing room; question disclosures
  sit farther below submit, with symmetric collapsed/expanded bottom spacing.
- [x] Original pointed diamond paths and center-fill animation, now 15px;
  first-line center alignment; empty space beside choices has no hover effect.
- [x] Math/code copy buttons never translate on hover/press; code button is
  smaller with visually balanced header insets.
- [x] Atomic formula selection/highlights retain the painted surface's corners.

Initial refinement validation on 2026-10-12:

- `pnpm check`: TypeScript, 40 unit/SSR tests and library build passed.
- `pnpm test:browser`: 23 Chromium tests passed, including continuous long
  document/code drag, select-all/scroll, formula corners, adversarial plugin
  icon sizes, question/sidebar controls, copy transitions, footnote selection,
  overlay continuity, mobile viewport and bidirectional editor scrolling.
- `pnpm test:package`: actual LiMR, syntax/action/annotation plugin and CSS
  package tarballs install and work in independent React 18.3.1 and React 19
  applications, including TypeScript, SSR, portals and theme isolation. Core
  also imports when React imports are deliberately denied.
- Production browser, selection and Node measurements are retained in
  `benchmarks/results/`; see [performance.md](performance.md) for measured
  budgets, slower cases and limits. Do not infer equal selection-processing
  cost or a long-document SSR advantage from the browser frame statistics.
- Inspected production screenshots are saved locally in `artifacts/visual/`:
  `light.png`, `dark.png`, `question-collapsed.png`, `question-expanded.png`,
  `sidebar-expanded.png`, `markers.png`, `math-selected.png`,
  `math-highlighted.png`, `mobile.png` and `mobile-overlay.png`.
  `evidence.json` records measured 15px diamonds, six equal 14.71875px marker
  buttons, 4px formula selection corners, code themes and font requests.

Physical iOS/Android selection handles and finger dragging were not tested.
The mobile evidence covers Chromium touch emulation and programmatic Selection
API geometry; platform controls remain native. Font cache headers belong to the
host application; see [styles.md](styles.md). Plugin slots contain oversized
elements but cannot repair an incorrectly centered intrinsic SVG drawing.

Narrow-overlay follow-up on 2026-10-12:

- The final card bounds and text width stay stable during a clip reveal. The
  horizontal origin follows the current marker; vertical reveal follows the
  resolved top/bottom placement. Positioning no longer measures animated widths
  or heights, and a changed marker cannot reuse the previous positioning result.
  Preview height is capped to available space on the resolved side; this cap is
  released when switching to the expanded dialog.
- Native scrollbars are hidden. A 3px overlaid thumb appears only while scrolling,
  fades after 800ms of inactivity, supports dragging, and stays hidden throughout
  card motion. It never reserves text width.
- `pnpm check` passed (40 tests, TypeScript and build). The 16 tests in
  `motion-playground.spec.ts` and `reader.spec.ts` passed, including motion frame
  geometry, right/bottom edge placement, rapid reference changes, interrupted
  exit/reopening, scrollbar behavior, touch viewport, focus restoration and
  annotation request reuse.

References reviewed: the previous renderer's Extras/Question/Citation styles,
selection and highlight hooks, the web app's QuestionnaireView multiline
gradient underline and diamond control, and UniDevice's rounded copy control. The new
implementation keeps LiMR independent of those applications.

Module-controlled cards and follow-up refinements on 2026-10-12:

- Annotation modules opt into anchored content-height expansion or a centered
  size such as 80dvh. Citation stays a pinnable preview; conversation and reading
  plugin examples opt into their own expansion. Sidebar content-click collapse
  is also opt-in; Citation items instead underline and follow their links.
- Preview reveal/content animations sample their live frame on each direction
  change, including repeated interruption. Retained overlays remeasure on reopening;
  Floating UI's closed positioning state otherwise stranded the retained card.
  Exit completion, rather than a fixed unmount timer, releases the subtree.
  The painted shell connects preview and expanded bounds independently of text
  and controls. Direct opening measures the module's preview first; closing
  returns to that preview geometry while fading out. Preview entry/exit both
  take 560ms, and preview/dialog transformations both take 480ms.
- Modules own the full floating UI through `overlay.Card`, optionally reusing
  `AnnotationCard`. Centered dialogs use the page viewport and module-specified
  widths. Initial focus lands on the dialog container, with visible focus cues
  retained for keyboard navigation. Mobile TOC toggles animate continuously.
- Sidebar hover applies across the whole card and survives header collapse.
  Close controls have background feedback. Attribute titles support source
  selection/highlights. Question correct diamonds are filled green; the submit
  label is shorter. Nested definition formula backgrounds have stronger contrast.
- Citation spacing now follows the supplied screenshots: the preview item gap
  is 6px smaller and trailing space 2px smaller; collapsed sidebar trailing
  space grows 2px. Expanded sidebar heading space shrinks 2px, separator spacing
  moves 2px from above to below, and trailing space shrinks 3px. The final
  Markdown paragraph no longer overrides these gaps through margin collapse.
- Video providers mount near the viewport, normalize watch/short/embed and BV/av
  links, retain click-loading as an option, and share the math copy primitive.
  YouTube uses the previous renderer's youtube.com/embed address with origin
  referrer information. In the local real-network comparison, dQw4w9WgXcQ failed
  with an auth player error even in the previous renderer's bare iframe setup;
  M7lc1UVf-VE loaded its player. This is not evidence that the user's specific
  video now plays. Automated provider tests intercept network responses.
- Validation: TypeScript, all 50 unit/SSR cases, and all 33 browser cases passed.
  After the final animation fix, the 20 motion/reader cases were rerun; the other
  13 cases include video, visual selection and the three selection performance
  checks. React 18.3.1 and React 19 tarball consumers passed types, SSR and browser
  plugin/theme checks. The local tarball and production demo were rebuilt.
- Production screenshots inspected: question-refined.png,
  definition-math-refined-light.png, definition-math-refined-dark.png,
  citation-overlay-refined.png, video-provider-refined.png in artifacts/visual/.
  refinement-evidence.json records the compact retry button, filled correct
  diamond, nested formula colors and the real official YouTube player's loaded
  title/isPlayable state. Loading that player does not prove the reported Rick
  Astley video plays in the user's browser.
