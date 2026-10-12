import { useEffect } from 'react';

/** Piecewise mapping between source lines and rendered top-level blocks. */
export function useScrollSync(editor: HTMLTextAreaElement | null, preview: HTMLElement | null, source: string) {
  useEffect(() => {
    if (!editor || !preview) return;
    const starts = [0];
    for (let at = 0; at < source.length; at++) if (source[at] === '\n') starts.push(at + 1);
    const lineAt = (offset: number) => { let lo = 0, hi = starts.length; while (lo < hi) { const mid = (lo + hi) >>> 1; if (starts[mid] <= offset) lo = mid + 1; else hi = mid; } return Math.max(0, lo - 1); };
    let points: { source: number; rendered: number }[] = [];
    let suppressed: EventTarget | null = null, until = 0, frame = 0;
    const measure = () => {
      const top = preview.getBoundingClientRect().top;
      const lineHeight = parseFloat(getComputedStyle(editor).lineHeight);
      const end = { source: editor.scrollHeight - editor.clientHeight, rendered: preview.scrollHeight - preview.clientHeight };
      points = [{ source: 0, rendered: 0 }];
      for (const block of preview.querySelectorAll<HTMLElement>('.limr-reader-content > .limr-prose > [data-limr-block]')) {
        const point = { source: lineAt(Number(block.dataset.sourceStart)) * lineHeight, rendered: block.getBoundingClientRect().top - top + preview.scrollTop };
        const previous = points.at(-1)!;
        if (point.source > previous.source && point.rendered > previous.rendered && point.source < end.source && point.rendered < end.rendered) points.push(point);
      }
      points.push(end);
    };
    const map = (position: number, from: 'source' | 'rendered', to: 'source' | 'rendered') => {
      const ordered = points;
      let lo = 0, hi = ordered.length;
      while (lo < hi) { const mid = (lo + hi) >>> 1; if (ordered[mid][from] <= position) lo = mid + 1; else hi = mid; }
      const a = ordered[Math.max(0, lo - 1)], b = ordered[Math.min(ordered.length - 1, lo)];
      return a[to] + (b[to] - a[to]) * Math.min(1, Math.max(0, (position - a[from]) / Math.max(1, b[from] - a[from])));
    };
    const synchronize = (event: Event) => {
      if (event.target === suppressed && performance.now() < until) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const fromEditor = event.target === editor, target = fromEditor ? preview : editor;
        suppressed = target; until = performance.now() + 100;
        target.scrollTop = map(fromEditor ? editor.scrollTop : preview.scrollTop, fromEditor ? 'source' : 'rendered', fromEditor ? 'rendered' : 'source');
      });
    };
    const intent = () => { suppressed = null; until = 0; };
    const resize = new ResizeObserver(measure);
    resize.observe(preview); resize.observe(editor);
    const prose = preview.querySelector('.limr-prose'); if (prose) resize.observe(prose);
    const mutation = new MutationObserver(measure);
    if (prose) mutation.observe(prose, { childList: true });
    editor.addEventListener('scroll', synchronize, { passive: true }); preview.addEventListener('scroll', synchronize, { passive: true });
    editor.addEventListener('wheel', intent, { passive: true }); preview.addEventListener('wheel', intent, { passive: true });
    editor.addEventListener('pointerdown', intent); preview.addEventListener('pointerdown', intent);
    document.fonts.addEventListener('loadingdone', measure); measure();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect(); editor.removeEventListener('scroll', synchronize); preview.removeEventListener('scroll', synchronize); editor.removeEventListener('wheel', intent); preview.removeEventListener('wheel', intent); editor.removeEventListener('pointerdown', intent); preview.removeEventListener('pointerdown', intent); document.fonts.removeEventListener('loadingdone', measure); };
  }, [editor, preview, source]);
}
