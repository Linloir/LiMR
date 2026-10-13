import { useRef, type ReactNode, type RefObject } from 'react';
import { useIsomorphicLayoutEffect, useRuntime } from './context';
import type { ReaderRuntime } from './runtime';
import type { StreamEffect } from './types';

export const defaultStreamEffect: StreamEffect = {
  keyframes: [{ opacity: 0 }, { opacity: 1 }],
  timing: { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' },
};
export function streamEffect(runtime: ReaderRuntime): StreamEffect | false {
  const config = runtime.configuration.get();
  if (config.streamEffect !== undefined) return config.streamEffect;
  let effect: StreamEffect | false = defaultStreamEffect;
  for (const extension of config.extensions ?? []) if (extension.streaming?.effect !== undefined) effect = extension.streaming.effect;
  return effect;
}
export function animateStream(element: HTMLElement, effect: StreamEffect | false): Animation | undefined {
  if (effect === false || !element.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  return element.animate(effect.keyframes ?? defaultStreamEffect.keyframes!, { ...defaultStreamEffect.timing, ...effect.timing });
}
/** One entrance per mounted block/state, never per appended token. */
export function useStreamEntrance(ref: RefObject<HTMLElement | null>, enabled: boolean, state: unknown = true, contents = false) {
  const runtime = useRuntime();
  useIsomorphicLayoutEffect(() => {
    const host = ref.current;
    const target = contents ? host?.firstElementChild as HTMLElement | null : host;
    if (!enabled || !target) return;
    const effect = streamEffect(runtime);
    const classes = effect && effect.className?.split(/\s+/).filter(Boolean);
    if (classes) target.classList.add(...classes);
    target.dataset.limrEntrance = '';
    const animation = animateStream(target, effect);
    return () => { animation?.cancel(); if (classes) target.classList.remove(...classes); };
  }, [runtime, enabled, state]);
}
export function StreamEntrance({ children, state }: { children: ReactNode; state: unknown }) {
  const ref = useRef<HTMLDivElement>(null);
  useStreamEntrance(ref, true, state, true);
  return <div ref={ref} className="limr-stream-block">{children}</div>;
}
