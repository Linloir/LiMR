import { useEffect, useRef } from 'react';

/** Piecewise mapping between source lines and rendered top-level blocks. */
export function useScrollSync(editor: HTMLTextAreaElement | null, preview: HTMLElement | null, source: string, wrap = false) {
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
      const sourceTop = (offset: number) => {
        const line = lineAt(offset);
        if (!mirror) return line * lineHeight;
        const at = starts[line], range = document.createRange();
        range.setStart(mirror.firstChild!, at); range.setEnd(mirror.firstChild!, at + 1);
        // Inline glyph rectangles omit leading; remove the first line's glyph
        // offset so each point remains the textarea's visual line position.
        return range.getBoundingClientRect().top - firstGlyphTop;
      };
      const end = { source: Math.max(0, editor.scrollHeight - editor.clientHeight), rendered: Math.max(0, preview.scrollHeight - preview.clientHeight) };
      points = [{ source: 0, rendered: 0 }];
      for (const block of preview.querySelectorAll<HTMLElement>('.limr-reader-content > .limr-prose > [data-limr-block]')) {
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
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const fromEditor = origin === editor, target = fromEditor ? preview : editor;
        setScroll(target, map(position, fromEditor ? 'source' : 'rendered', fromEditor ? 'rendered' : 'source'));
      });
    };
    const resize = new ResizeObserver(scheduleMeasure);
    resize.observe(preview); resize.observe(editor);
    const prose = preview.querySelector('.limr-prose'); if (prose) resize.observe(prose);
    const mutation = new MutationObserver(scheduleMeasure);
    if (prose) mutation.observe(prose, { childList: true });
    editor.addEventListener('scroll', synchronize, { passive: true }); preview.addEventListener('scroll', synchronize, { passive: true });
    document.fonts.addEventListener('loadingdone', scheduleMeasure); measure();
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(measureFrame); resize.disconnect(); mutation.disconnect(); mirror?.remove(); editor.removeEventListener('scroll', synchronize); preview.removeEventListener('scroll', synchronize); document.fonts.removeEventListener('loadingdone', scheduleMeasure); };
  }, [editor, preview, source, wrap]);
}
