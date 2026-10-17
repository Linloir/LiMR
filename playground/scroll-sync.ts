import { useEffect, useRef, type RefObject } from 'react';

export interface ScrollSyncReader { scrollToSource(range: { start: number; end: number }): void }

/** Piecewise mapping between source lines and rendered top-level blocks. */
export function useScrollSync(editor: HTMLTextAreaElement | null, preview: HTMLElement | null, source: string, wrap = false, reader?: RefObject<ScrollSyncReader | null>) {
  const previous = useRef<{ editor: HTMLTextAreaElement | null; wrap: boolean } | null>(null);
  useEffect(() => {
    if (!editor || !preview) return;
    let restoreFromPreview = previous.current?.editor === editor && previous.current.wrap !== wrap;
    previous.current = { editor, wrap };
    const starts = [0];
    for (let at = 0; at < source.length; at++) {
      if (source[at] === '\r') { if (source[at + 1] === '\n') at++; starts.push(at + 1); }
      else if (source[at] === '\n') starts.push(at + 1);
    }
    const lineAt = (offset: number) => { let lo = 0, hi = starts.length; while (lo < hi) { const mid = (lo + hi) >>> 1; if (starts[mid] <= offset) lo = mid + 1; else hi = mid; } return Math.max(0, lo - 1); };
    // A native textarea has no public line geometry. One hidden text node uses
    // its exact font/content width so soft wraps, CJK and tabs share its layout.
    const mirror = wrap ? document.createElement('div') : null;
    if (mirror) {
      mirror.setAttribute('aria-hidden', 'true'); mirror.dataset.editorMeasure = '';
      mirror.style.cssText = 'position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none;box-sizing:border-box;white-space:pre-wrap;overflow-wrap:break-word;';
      mirror.textContent = source + '\u200b'; document.body.append(mirror);
      editor.scrollLeft = 0;
    }
    let points: { source: number; rendered: number }[] = [];
    let sourcePosition = (position: number) => starts[Math.min(starts.length - 1, Math.max(0, Math.floor(position / 24)))];
    let previewOwnedByEditor = false;
    // Ignore only the scroll position this synchronizer actually wrote. A time
    // window can discard a real user scroll, or let a delayed programmatic echo
    // through when pointerdown clears it before that echo is dispatched.
    const echoes = new WeakMap<HTMLElement, number>();
    let frame = 0, measureFrame = 0;
    const setScroll = (target: HTMLElement, position: number) => {
      target.scrollTop = position;
      // Read back the clamped/rounded native value, including scrollbar changes.
      echoes.set(target, target.scrollTop);
    };
    const measure = () => {
      const style = getComputedStyle(editor);
      // `font` can serialize as an empty string when ligatures or other font
      // longhands are non-default. Copy each metric instead of that shorthand.
      if (mirror) for (const property of ['font-family', 'font-size', 'font-weight', 'font-style', 'font-stretch', 'line-height', 'font-kerning', 'font-feature-settings', 'font-variation-settings', 'font-variant-ligatures', 'letter-spacing', 'word-spacing', 'tab-size', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'direction']) mirror.style.setProperty(property, style.getPropertyValue(property));
      if (mirror) mirror.style.width = `${editor.clientWidth}px`;
      const top = preview.getBoundingClientRect().top;
      const lineHeight = parseFloat(style.lineHeight);
      const first = mirror ? document.createRange() : null;
      if (first && mirror) { first.setStart(mirror.firstChild!, 0); first.setEnd(mirror.firstChild!, 1); }
      const firstGlyphTop = first?.getBoundingClientRect().top ?? 0;
      const glyphTop = (offset: number) => {
        const range = document.createRange();
        range.setStart(mirror!.firstChild!, offset); range.setEnd(mirror!.firstChild!, offset + 1);
        return range.getBoundingClientRect().top - firstGlyphTop;
      };
      const sourceTop = (offset: number) => {
        const line = lineAt(offset);
        if (!mirror) return line * lineHeight;
        // Inline glyph rectangles omit leading; remove the first line's glyph
        // offset so each point remains the textarea's visual line position.
        return glyphTop(starts[line]);
      };
      sourcePosition = position => {
        let lo = 0, hi = starts.length;
        while (lo < hi) { const mid = (lo + hi) >>> 1; if (sourceTop(starts[mid]) <= position) lo = mid + 1; else hi = mid; }
        const line = Math.max(0, lo - 1), start = starts[line];
        if (!mirror) return start;
        // A hard line can occupy many soft lines in a wrapped textarea. Locate
        // the first glyph on its current visual line instead of the paragraph's
        // first source character.
        lo = start; hi = starts[line + 1] ?? source.length;
        while (lo < hi) { const mid = (lo + hi) >>> 1; if (glyphTop(mid) <= position) lo = mid + 1; else hi = mid; }
        const last = Math.max(start, lo - 1), rowTop = glyphTop(last);
        lo = start; hi = last;
        while (lo < hi) { const mid = (lo + hi) >>> 1; if (glyphTop(mid) < rowTop - .5) lo = mid + 1; else hi = mid; }
        return lo;
      };
      const end = { source: Math.max(0, editor.scrollHeight - editor.clientHeight), rendered: Math.max(0, preview.scrollHeight - preview.clientHeight) };
      points = [{ source: 0, rendered: 0 }];
      for (const block of preview.querySelectorAll<HTMLElement>('.limr-reader-content > .limr-prose > [data-limr-block], .limr-reader-content [data-window-slot]:not([data-window-parked]) > [data-limr-block]')) {
        const point = { source: sourceTop(Number(block.dataset.sourceStart)), rendered: block.getBoundingClientRect().top - top + preview.scrollTop };
        const previous = points.at(-1)!;
        if (point.source > previous.source && point.rendered > previous.rendered && point.source < end.source && point.rendered < end.rendered) points.push(point);
      }
      points.push(end);
      if (restoreFromPreview) { restoreFromPreview = false; setScroll(editor, map(preview.scrollTop, 'rendered', 'source')); }
    };
    const scheduleMeasure = () => { cancelAnimationFrame(measureFrame); measureFrame = requestAnimationFrame(measure); };
    const map = (position: number, from: 'source' | 'rendered', to: 'source' | 'rendered') => {
      const ordered = points;
      let lo = 0, hi = ordered.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (ordered[mid][from] <= position) lo = mid + 1; else hi = mid; }
      const a = ordered[Math.max(0, lo - 1)], b = ordered[Math.min(ordered.length - 1, lo)];
      return a[to] + (b[to] - a[to]) * Math.min(1, Math.max(0, (position - a[from]) / Math.max(1, b[from] - a[from])));
    };
    const synchronize = (event: Event) => {
      const origin = event.target as HTMLElement, position = origin.scrollTop;
      const echo = echoes.get(origin);
      echoes.delete(origin);
      if (echo !== undefined && Math.abs(position - echo) < .5) return;
      if (origin === preview && previewOwnedByEditor) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const fromEditor = origin === editor, target = fromEditor ? preview : editor;
        if (preview.querySelector('[data-limr-windowed]')) {
          if (fromEditor && reader?.current) {
            // Source commands can reveal an unmounted paragraph, including
            // documents whose logical height exceeds the browser scroll limit.
            const offset = Math.min(Math.max(0, source.length - 1), sourcePosition(position));
            previewOwnedByEditor = true;
            reader.current.scrollToSource({ start: offset, end: Math.min(source.length, offset + 1) });
            return;
          }
          // Virtual blocks change while scrolling; only their bounded visible
          // geometry participates in the reverse mapping.
          measure();
        }
        setScroll(target, map(position, fromEditor ? 'source' : 'rendered', fromEditor ? 'rendered' : 'source'));
      });
    };
    const previewInput = () => { previewOwnedByEditor = false; };
    const resize = new ResizeObserver(scheduleMeasure);
    resize.observe(preview); resize.observe(editor);
    const prose = preview.querySelector('.limr-prose'); if (prose) resize.observe(prose);
    const mutation = new MutationObserver(scheduleMeasure);
    if (prose) mutation.observe(prose, { childList: true, subtree: !!prose.querySelector('[data-limr-windowed]') });
    editor.addEventListener('scroll', synchronize, { passive: true }); preview.addEventListener('scroll', synchronize, { passive: true });
    for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) preview.addEventListener(type, previewInput, { passive: true });
    document.fonts.addEventListener('loadingdone', scheduleMeasure); measure();
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame); resize.disconnect(); mutation.disconnect(); mirror?.remove(); editor.removeEventListener('scroll', synchronize); preview.removeEventListener('scroll', synchronize); for (const type of ['pointerdown', 'wheel', 'touchstart', 'keydown']) preview.removeEventListener(type, previewInput); document.fonts.removeEventListener('loadingdone', scheduleMeasure); };
  }, [editor, preview, source, wrap, reader]);
}
