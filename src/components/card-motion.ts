import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';

const moving = (animation: Animation | null) => animation?.playState === 'running' || animation?.playState === 'paused';
const durationOf = (value: string, fallback: number) => {
  const duration = parseFloat(value) * (value.endsWith('ms') ? 1 : 1000);
  return Number.isFinite(duration) && duration > 0 ? duration : fallback;
};
/** Measure a stationary host, and animate its surface from the live frame.
 * Each direction starts a fresh easing curve: reversing an ease-out entrance would
 * otherwise leave the card apparently motionless at the start of its exit. */
export function useCardMotion(element: HTMLElement | null, host: HTMLElement | null, anchor: HTMLElement | undefined, open: boolean, expanded: boolean, ready: boolean, id: string | undefined, edge: 'top' | 'bottom', previewRect: DOMRect | undefined, onExit: () => void) {
  const previous = useRef<DOMRect | null>(null);
  const reveal = useRef<Animation | null>(null);
  const content = useRef<Animation | null>(null);
  const hero = useRef<Animation | null>(null);
  const shape = useRef<Animation | null>(null);
  const state = useRef<{ id?: string; expanded: boolean; open: boolean } | null>(null);
  const latest = useRef({ open, onExit });
  latest.current = { open, onExit };
  useIsomorphicLayoutEffect(() => {
    if (!element || !host || !ready) return;
    const sameCard = state.current?.id === id;
    const presentationChanged = sameCard && state.current?.expanded !== expanded;
    const intentChanged = !sameCard || state.current?.open !== open || presentationChanged;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!intentChanged && !reduced) return;
    const computed = getComputedStyle(element);
    const shell = element.querySelector<HTMLElement>('.limr-overlay-surface');
    const card = element.querySelector<HTMLElement>('.limr-overlay-card');
    const previousBody = sameCard ? (content.current?.effect as KeyframeEffect | null)?.target as HTMLElement | null : null;
    const body = presentationChanged || expanded ? card : previousBody?.isConnected ? previousBody : element.querySelector<HTMLElement>('[data-limr-card-body], .limr-overlay-content');
    const bodyStyle = body ? getComputedStyle(body) : null;
    // Snapshot before cancelling any effects; interruption never jumps to an
    // endpoint, even during a preview-to-dialog morph or an unfinished exit.
    const liveSurface = { opacity: computed.opacity, clipPath: computed.clipPath };
    const liveTransform = computed.transform;
    const liveBody = { opacity: bodyStyle?.opacity ?? '1', transform: bodyStyle?.transform ?? 'none', clipPath: bodyStyle?.clipPath ?? 'none' };
    let before = sameCard ? previous.current : expanded ? previewRect ?? null : null;
    // React has moved the host; apply the live transform to its OLD rectangle.
    if (before && sameCard && hero.current && computed.transform !== 'none') {
      const matrix = new DOMMatrixReadOnly(computed.transform);
      before = new DOMRect(before.x + matrix.m41, before.y + matrix.m42, before.width, before.height);
    }
    if (before && sameCard && shell && shape.current) {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(shell).transform);
      before = new DOMRect(before.x, before.y, before.width * matrix.a, before.height * matrix.d);
    }
    const target = host.getBoundingClientRect();
    const anchorRect = anchor?.getBoundingClientRect() ?? target;
    const originX = Math.max(0, Math.min(100, ((anchorRect.left + anchorRect.right) / 2 - target.left) / Math.max(1, target.width) * 100));
    const radius = computed.borderRadius || '8px';
    const collapsed = `inset(${edge === 'bottom' ? 100 : 0}% ${100 - originX}% ${edge === 'bottom' ? 0 : 100}% ${originX}% round ${radius})`;
    // Leave room for the old, larger shell while it shrinks to a preview.
    const overflow = Math.max(48, (before?.width ?? 0) - target.width + 48, (before?.height ?? 0) - target.height + 48);
    const revealed = `inset(-${overflow}px -${overflow}px -${overflow}px -${overflow}px round ${radius})`;
    const cancel = () => {
      reveal.current?.cancel(); content.current?.cancel(); hero.current?.cancel(); shape.current?.cancel();
      reveal.current = content.current = hero.current = shape.current = null;
    };
    cancel();
    state.current = { id, expanded, open };
    previous.current = target;
    if (reduced || !open && !sameCard) {
      delete element.dataset.motion;
      if (!open) latest.current.onExit();
      return;
    }
    const previewDuration = durationOf((computed.getPropertyValue('--limr-overlay-duration') || computed.getPropertyValue('--limr-overlay-enter-duration')).trim(), 560);
    const morphDuration = durationOf(computed.getPropertyValue('--limr-overlay-morph-duration').trim(), 480);
    const morph = open && !!before && (presentationChanged || !sameCard && expanded);
    const returning = !open && expanded && !!previewRect;
    const destination = returning ? previewRect : target;
    const duration = morph || expanded ? morphDuration : previewDuration;
    const easing = computed.getPropertyValue('--limr-overlay-ease').trim() || 'cubic-bezier(.22,1,.36,1)';
    element.dataset.motion = !open ? 'closing' : morph ? 'morphing' : 'opening';
    reveal.current = element.animate([
      sameCard ? { ...liveSurface, ...(morph ? { clipPath: revealed } : {}) } : { opacity: 0, clipPath: morph ? revealed : collapsed },
      { opacity: open ? 1 : 0, clipPath: open || returning ? revealed : collapsed },
    ], { duration, easing, fill: 'both' });
    if (before && (morph || liveTransform !== 'none' || returning)) {
      const x = before.left - target.left, y = before.top - target.top;
      const sx = before.width / Math.max(1, target.width), sy = before.height / Math.max(1, target.height);
      hero.current = element.animate([
        { transform: `translate(${x}px, ${y}px)` },
        { transform: `translate(${destination.left - target.left}px, ${destination.top - target.top}px)` },
      ], { duration, easing, fill: 'both' });
      // Only the painted background changes scale. The entire module UI,
      // including titles, inputs and controls, retains its natural text metrics.
      shape.current = shell?.animate([
        { transform: `scale(${sx}, ${sy})` },
        { transform: `scale(${destination.width / Math.max(1, target.width)}, ${destination.height / Math.max(1, target.height)})` },
      ], { duration, easing, fill: 'both' }) ?? null;
    }
    const delay = open ? morph ? 50 : !sameCard ? 35 : 0 : 0;
    content.current = body?.animate([
      sameCard && !morph ? liveBody : { opacity: 0, transform: 'translateY(6px)', clipPath: morph ? `inset(0px ${Math.max(0, target.width - before!.width)}px ${Math.max(0, target.height - before!.height)}px 0px)` : 'inset(0px)' },
      { opacity: open ? 1 : 0, transform: open ? 'translateY(0px)' : 'translateY(-4px)', clipPath: returning ? `inset(0px ${Math.max(0, target.width - destination.width)}px ${Math.max(0, target.height - destination.height)}px 0px)` : 'inset(0px)' },
    ], {
      // Content and surface settle together in either direction.
      duration: duration - delay, delay, easing, fill: 'both',
    }) ?? null;
    const current = reveal.current;
    const finish = () => {
      if (reveal.current !== current) return;
      if (![reveal.current, content.current, hero.current, shape.current].some(moving)) {
        delete element.dataset.motion;
        if (!latest.current.open) latest.current.onExit();
        else previous.current = host.getBoundingClientRect();
      }
    };
    for (const animation of [reveal.current, content.current, hero.current, shape.current]) if (animation) animation.onfinish = finish;
    finish();
  }, [element, host, anchor, open, expanded, ready, id, edge, previewRect]);
  useIsomorphicLayoutEffect(() => {
    if (host && open && ready && !moving(hero.current)) previous.current = host.getBoundingClientRect();
  });
  useIsomorphicLayoutEffect(() => {
    if (!host || !open) return;
    const observer = new ResizeObserver(() => { if (!moving(hero.current)) previous.current = host.getBoundingClientRect(); });
    observer.observe(host);
    return () => observer.disconnect();
  }, [host, open, id]);
  useIsomorphicLayoutEffect(() => () => {
    reveal.current?.cancel(); content.current?.cancel(); hero.current?.cancel(); shape.current?.cancel();
    reveal.current = content.current = hero.current = shape.current = null;
    state.current = null; previous.current = null;
    if (element) delete element.dataset.motion;
  }, [element]);
}
