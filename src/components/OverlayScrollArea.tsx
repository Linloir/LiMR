import { useRef, type PointerEvent, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';

/** Keep native wheel/touch/keyboard scrolling, with a thumb outside text flow. */
export function OverlayScrollArea({ children, active, resetKey, label }: { children: ReactNode; active: boolean; resetKey?: string; label: string }) {
  const area = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; y: number; scroll: number; scale: number } | null>(null);
  const show = useRef<() => void>(() => {});

  useIsomorphicLayoutEffect(() => {
    const element = area.current!, wrapper = element.parentElement!;
    delete wrapper.dataset.scrolling;
    if (!active) return;
    element.scrollTop = 0;
    let frame = 0, timeout: ReturnType<typeof setTimeout> | undefined, previous = 0;
    const update = () => {
      frame = 0;
      const height = track.current!.clientHeight;
      const overflow = element.scrollHeight - element.clientHeight;
      const size = Math.min(height, Math.max(20, height * element.clientHeight / Math.max(1, element.scrollHeight)));
      wrapper.toggleAttribute('data-overflow', overflow > 1);
      thumb.current!.style.height = `${size}px`;
      thumb.current!.style.transform = `translateY(${overflow > 0 ? Math.max(0, Math.min(1, element.scrollTop / overflow)) * (height - size) : 0}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    show.current = () => {
      clearTimeout(timeout);
      if (wrapper.closest('[data-motion]')) return;
      wrapper.dataset.scrolling = 'true';
      timeout = setTimeout(() => { if (!drag.current) delete wrapper.dataset.scrolling; }, 800);
    };
    const scroll = () => {
      schedule();
      if (element.scrollTop === previous) return;
      previous = element.scrollTop;
      show.current();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(element); observer.observe(content.current!);
    element.addEventListener('scroll', scroll, { passive: true });
    update();
    return () => {
      observer.disconnect(); element.removeEventListener('scroll', scroll);
      cancelAnimationFrame(frame); clearTimeout(timeout); drag.current = null;
      show.current = () => {}; delete wrapper.dataset.scrolling;
    };
  }, [active, resetKey]);

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    const element = area.current!, bar = thumb.current!;
    const travel = track.current!.clientHeight - bar.offsetHeight;
    if (travel <= 0) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    const scale = (element.scrollHeight - element.clientHeight) / travel;
    if (event.target !== bar) element.scrollTop = (event.clientY - track.current!.getBoundingClientRect().top - bar.offsetHeight / 2) * scale;
    drag.current = { pointerId: event.pointerId, y: event.clientY, scroll: element.scrollTop, scale };
    show.current();
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (current?.pointerId === event.pointerId) area.current!.scrollTop = current.scroll + (event.clientY - current.y) * current.scale;
  };
  const end = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    show.current();
  };
  return <div className="limr-overlay-scroll">
    <div ref={area} className="limr-overlay-content" data-limr-card-body="" tabIndex={0} role="region" aria-label={label}><div ref={content} className="limr-overlay-scroll-inner">{children}</div></div>
    <div ref={track} className="limr-overlay-scrollbar" aria-hidden="true" onPointerDown={startDrag} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}>
      <div ref={thumb} className="limr-overlay-scroll-thumb" />
    </div>
  </div>;
}
