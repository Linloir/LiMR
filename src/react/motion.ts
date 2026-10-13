const flights = new WeakMap<object, () => void>();

/** Interruptible, distance-limited scroll; pointer/wheel intent always wins. */
export function scrollWithMotion(root: HTMLElement | Window, top: number) {
  flights.get(root)?.();
  const element = root instanceof Window ? root.document.documentElement : root;
  const start = root instanceof Window ? root.scrollY : root.scrollTop;
  const target = Math.max(0, Math.min(top, element.scrollHeight - (root instanceof Window ? root.innerHeight : root.clientHeight)));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { root.scrollTo({ top: target, behavior: 'instant' }); return; }
  const duration = Math.min(560, 220 + Math.abs(target - start) * .15);
  let frame = 0, begun = 0;
  const keyboard = (event: Event) => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes((event as KeyboardEvent).key)) stop(); };
  const stop = () => { cancelAnimationFrame(frame); root.removeEventListener('wheel', stop); root.removeEventListener('touchstart', stop); root.removeEventListener('pointerdown', stop); root.removeEventListener('keydown', keyboard); flights.delete(root); };
  const step = (time: number) => {
    begun ||= time;
    const t = Math.min(1, (time - begun) / duration);
    root.scrollTo({ top: start + (target - start) * (1 - Math.pow(1 - t, 4)), behavior: 'instant' });
    if (t < 1) frame = requestAnimationFrame(step); else stop();
  };
  flights.set(root, stop);
  root.addEventListener('wheel', stop, { passive: true }); root.addEventListener('touchstart', stop, { passive: true }); root.addEventListener('pointerdown', stop, { passive: true });
  root.addEventListener('keydown', keyboard);
  frame = requestAnimationFrame(step);
}
