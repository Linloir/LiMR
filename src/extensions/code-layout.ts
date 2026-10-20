import { useRef, useState } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';
import { countCodeLines } from './code-view-state';

/** Measure full content after layout changes, never on every animation frame.
 * Height transitions retain stable text while distant layout stays deferred. */
export function useCodeLayout({ code, total, preview, threshold, wrap, collapsed }: {
  code: string; total: number; preview: number; threshold: number; wrap: boolean; collapsed: boolean;
}) {
  const ref = useRef<HTMLPreElement>(null);
  const [visualFoldable, setVisualFoldable] = useState(false);
  const [hidden, setHidden] = useState(Math.max(0, total - preview));
  useIsomorphicLayoutEffect(() => {
    const pre = ref.current, content = pre?.firstElementChild as HTMLElement | null;
    if (!pre || !content) return;
    if (collapsed) pre.scrollTop = 0;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const style = getComputedStyle(pre), lineHeight = parseFloat(style.lineHeight);
      const height = content.getBoundingClientRect().height;
      // Classic horizontal scrollbars occupy layout space. Preserve the full
      // row budget on those platforms as well as with overlay scrollbars.
      const scrollbar = Math.max(0, pre.offsetHeight - pre.clientHeight - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth));
      pre.style.setProperty('--limr-code-scrollbar-height', `${scrollbar}px`);
      pre.style.setProperty('--limr-code-full-height', `${height + scrollbar}px`);
      setVisualFoldable(wrap && height > (threshold + .5) * lineHeight);
      let complete = Math.min(total, preview);
      if (wrap) {
        // A wrapped source line can occupy several visual rows. The footer
        // counts source lines with hidden text, including a partial last row.
        // Hit-test only the end of the preview, rather than measuring a huge
        // source line (or requesting rects for every character).
        const rect = pre.getBoundingClientRect();
        const x = rect.right - parseFloat(style.paddingRight) - 1;
        const y = rect.top + preview * lineHeight - lineHeight / 2;
        const doc = pre.ownerDocument;
        const caret = (doc as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null }).caretPositionFromPoint?.(x, y);
        const native = caret ? undefined : doc.caretRangeFromPoint?.(x, y);
        const node = caret?.offsetNode ?? native?.startContainer, offset = caret?.offset ?? native?.startOffset;
        if (node && offset !== undefined && content.contains(node)) {
          const range = doc.createRange(); range.setStart(content, 0); range.setEnd(node, offset);
          const prefix = range.toString();
          complete = countCodeLines(prefix) - 1 + (code[prefix.length] === '\n' || prefix.length === code.length ? 1 : 0);
        }
      }
      setHidden(Math.max(0, total - complete));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    let width = pre.clientWidth;
    const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(entries => {
      // Height-only frames of the animation do not need a new measurement.
      if (entries.some(entry => entry.target === content) || width !== pre.clientWidth) { width = pre.clientWidth; schedule(); }
    });
    observer?.observe(content);
    // Width changes can rewrap while the viewport remains height-limited.
    observer?.observe(pre);
    // Hit testing is unavailable outside the viewport. Recount as the preview
    // or footer enters view, including already-mounted, non-windowed Readers.
    const visible = wrap && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) schedule(); }, { threshold: [0, 1] }) : undefined;
    visible?.observe(pre);
    const footer = pre.closest('.limr-code-block')?.querySelector('.limr-code-footer');
    if (footer) visible?.observe(footer);
    pre.ownerDocument.fonts?.addEventListener('loadingdone', schedule);
    return () => { observer?.disconnect(); visible?.disconnect(); cancelAnimationFrame(frame); pre.ownerDocument.fonts?.removeEventListener('loadingdone', schedule); };
  }, [code, total, preview, threshold, wrap, collapsed]);
  return { ref, visualFoldable, hidden };
}
