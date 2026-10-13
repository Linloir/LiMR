import { useEffect, type RefObject } from 'react';
import type { ReaderRuntime } from './runtime';

/** Follow actual clipping edges, including a nested viewport and in-flight
 * document/card motion. Masks never reserve space or change scroll geometry. */
export function useOverflowFade(ref: RefObject<HTMLElement | null>, runtime: ReaderRuntime, contentSelector: string, beforeMeasure?: () => void) {
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let frame = 0;
    const transitions = new Map<Element, Map<string, number>>();
    const measure = () => {
      frame = 0;
      // Constraint-driven cards must finish positioning with this frame's
      // heights before clipping is tested. Even a transient mask toggle can
      // invalidate the composited layer while a footer card grows upward.
      beforeMeasure?.();
      const box = host.getBoundingClientRect();
      const viewport = window.visualViewport;
      let top = Math.max(box.top, viewport?.offsetTop ?? 0);
      let bottom = Math.min(box.bottom, (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight));
      const root = runtime.configuration.get().scrollRoot;
      if (root) { const bounds = root.getBoundingClientRect(); top = Math.max(top, bounds.top + root.clientTop); bottom = Math.min(bottom, bounds.top + root.clientTop + root.clientHeight); }
      const contents = [...host.querySelectorAll<HTMLElement>(contentSelector)].map(element => element.getBoundingClientRect());
      const clipsTop = bottom > top && contents.some(rect => rect.top < top - .5);
      const clipsBottom = bottom > top && contents.some(rect => rect.bottom > bottom + .5);
      host.toggleAttribute('data-overflow-top', clipsTop);
      host.toggleAttribute('data-overflow-bottom', clipsBottom);
      const set = (name: string, value: number) => { const css = `${Math.max(0, value).toFixed(2)}px`; if (host.style.getPropertyValue(name) !== css) host.style.setProperty(name, css); };
      set('--limr-fade-start', top - box.top);
      set('--limr-fade-end', bottom - box.top);
      const now = performance.now();
      for (const [target, properties] of transitions) {
        for (const [property, end] of properties) if (end <= now || !host.contains(target)) properties.delete(property);
        if (!properties.size) transitions.delete(target);
      }
      // Enumerating animations across the entire subtree forces style/layout
      // after the mask writes above, once per frame. Track geometry transitions
      // from their lifecycle events instead; detached nodes expire as well.
      if (transitions.size) schedule();
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const refresh = () => { cancelAnimationFrame(frame); measure(); };
    const start = (event: TransitionEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !/^(top|bottom|left|right|height|max-height|min-height|width|max-width|transform|translate|grid-template-rows|padding.*|margin.*)$/.test(event.propertyName)) return;
      const css = getComputedStyle(target), properties = css.transitionProperty.split(',').map(value => value.trim());
      const index = Math.max(0, properties.indexOf(event.propertyName));
      const milliseconds = (value: string) => { const list = value.split(','); const item = list[index % list.length].trim(); return parseFloat(item) * (item.endsWith('ms') ? 1 : 1000); };
      const pending = transitions.get(target) ?? new Map<string, number>();
      pending.set(event.propertyName, performance.now() + milliseconds(css.transitionDuration) + milliseconds(css.transitionDelay) + 34);
      transitions.set(target, pending); schedule();
    };
    const end = (event: TransitionEvent) => {
      if (event.target instanceof Element) transitions.get(event.target)?.delete(event.propertyName);
      schedule();
    };
    host.addEventListener('transitionrun', start);
    host.addEventListener('transitionend', end);
    host.addEventListener('transitioncancel', end);
    const resize = new ResizeObserver(refresh); resize.observe(host);
    const mutation = new MutationObserver(records => {
      // ResizeObserver can synchronously reposition growing sidebar cards.
      // Read that committed geometry before paint, not on the next frame after
      // their CSS heights have advanced again and outrun the stored positions.
      if (records.some(record => {
        const element = record.target instanceof Element ? record.target : record.target.parentElement;
        return element && element !== host && !element.closest('.limr-highlight-layer,.limr-paint-layer');
      })) {
        if (beforeMeasure) refresh(); else schedule();
      }
    });
    mutation.observe(host, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['style', 'class'] });
    const unsubscribe = [runtime.layout.subscribe(schedule), runtime.viewport.subscribe(refresh), runtime.documentOffset.subscribe(schedule), runtime.configuration.subscribe(schedule)];
    const scroll = (event: Event) => {
      const target = event.target;
      if (target === window.document || target === window || target instanceof Element && target.contains(host)) refresh();
    };
    // Capture nested scrolling directly; routing it through the runtime's frame
    // notification and then another rAF makes a viewport-fixed fade trail text.
    window.addEventListener('scroll', scroll, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', refresh);
    schedule();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect(); unsubscribe.forEach(fn => fn());
      host.removeEventListener('transitionrun', start); host.removeEventListener('transitionend', end); host.removeEventListener('transitioncancel', end);
      window.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('scroll', refresh);
      host.removeAttribute('data-overflow-top'); host.removeAttribute('data-overflow-bottom');
      host.style.removeProperty('--limr-fade-start'); host.style.removeProperty('--limr-fade-end');
    };
  }, [ref, runtime, contentSelector, beforeMeasure]);
}
