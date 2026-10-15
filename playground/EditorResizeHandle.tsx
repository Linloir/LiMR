import { useEffect, useRef, useState, type RefObject } from 'react';

export function EditorResizeHandle({ container, ratio }: { container: RefObject<HTMLDivElement | null>; ratio: RefObject<number> }) {
  const [value, setValue] = useState(ratio.current);
  const [dragging, setDragging] = useState(false);
  const pointer = useRef<number | null>(null);
  const bounds = () => {
    const width = Math.max(1, (container.current?.clientWidth ?? 1000) - 12);
    return { min: Math.min(.45, 240 / width), max: Math.max(.55, 1 - 320 / width), width };
  };
  const apply = (next: number) => {
    const { min, max } = bounds();
    next = Math.max(min, Math.min(max, next));
    ratio.current = next;
    container.current?.style.setProperty('--demo-editor-ratio', String(next));
    setValue(next);
  };
  const finish = () => {
    pointer.current = null; setDragging(false);
    container.current?.removeAttribute('data-resizing');
  };
  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(() => apply(ratio.current));
    observer.observe(element); apply(ratio.current);
    return () => { observer.disconnect(); element.removeAttribute('data-resizing'); };
  }, [container, ratio]);
  return <div className="demo-editor-resize" role="separator" tabIndex={0} aria-label="调整编辑器宽度" aria-orientation="vertical"
    aria-controls="demo-editor-pane demo-preview-pane" aria-valuenow={Math.round(value * 100)} aria-valuemin={Math.round(bounds().min * 100)} aria-valuemax={Math.round(bounds().max * 100)}
    title="拖动或用方向键调整宽度，双击恢复均分" data-dragging={dragging || undefined}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault(); event.currentTarget.focus({ preventScroll: true }); event.currentTarget.setPointerCapture(event.pointerId);
      pointer.current = event.pointerId; setDragging(true); container.current?.setAttribute('data-resizing', '');
    }}
    onPointerMove={event => {
      if (pointer.current !== event.pointerId || !container.current) return;
      const left = container.current.getBoundingClientRect().left + container.current.clientLeft;
      apply((event.clientX - left - 6) / bounds().width);
    }}
    onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onDoubleClick={() => apply(.5)}
    onKeyDown={event => {
      const step = event.shiftKey ? .1 : .02;
      const next = event.key === 'ArrowLeft' ? ratio.current - step : event.key === 'ArrowRight' ? ratio.current + step : event.key === 'Home' ? bounds().min : event.key === 'End' ? bounds().max : event.key === 'Enter' ? .5 : undefined;
      if (next !== undefined) { event.preventDefault(); apply(next); }
    }}><span aria-hidden="true" /></div>;
}

/** The return arrow describes soft wrapping without depending on icon fonts. */
export function EditorWrapIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 6h16M4 11h12.5a3.5 3.5 0 0 1 0 7H13m3-3-3 3 3 3M4 17h4" />
  </svg>;
}
