import { memo, useCallback, useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect, useRuntime } from './context';
import { animateStream, streamEffect } from './stream-effect';

/** React owns the host and initial SSR text. This leaf owns append-only text
 * mutations: appendData preserves native Range endpoints; textContent does not.
 * Animation wrappers are compacted only after the selection leaves the leaf. */
export const StreamText = memo(function StreamText({ value, animateInitial = true }: { value: string; animateInitial?: boolean }) {
  const runtime = useRuntime();
  const initial = useRef(value), previous = useRef(value);
  const element = useRef<HTMLSpanElement>(null);
  const animations = useRef(new Set<Animation>());
  const waiting = useRef(false);
  const mounted = useRef(false);
  const compact = useCallback(() => {
    const host = element.current;
    if (!host) return;
    const selection = host.ownerDocument.getSelection();
    if (selection && !selection.isCollapsed && selection.rangeCount && selection.getRangeAt(0).intersectsNode(host)) {
      if (!waiting.current) { host.ownerDocument.addEventListener('selectionchange', compact); waiting.current = true; }
      return;
    }
    if (waiting.current) { host.ownerDocument.removeEventListener('selectionchange', compact); waiting.current = false; }
    for (const span of host.querySelectorAll('[data-limr-increment-done]')) span.replaceWith(...span.childNodes);
    host.normalize();
  }, []);
  useIsomorphicLayoutEffect(() => {
    const host = element.current;
    if (!host) return;
    const effect = streamEffect(runtime);
    const animate = (element: HTMLElement) => {
      const animation = animateStream(element, effect);
      if (!animation) return;
      animations.current.add(animation);
      void animation.finished.then(() => {
        animations.current.delete(animation);
        // An initial entrance owns no temporary wrapper. Only appended runs
        // need compaction; scanning/normalizing every completed cell entrance
        // adds avoidable work to growing tables without changing their DOM.
        if (element.hasAttribute('data-limr-increment')) { element.dataset.limrIncrementDone = ''; compact(); }
      }, () => animations.current.delete(animation));
    };
    if (!mounted.current) { mounted.current = true; if (animateInitial && value && runtime.document.getSnapshot().streaming) animate(host); }
    if (value === previous.current) return;
    let from = previous.current.length;
    if (!value.startsWith(previous.current)) {
      for (const animation of animations.current) animation.cancel();
      animations.current.clear();
      for (const span of host.querySelectorAll<HTMLElement>('[data-limr-increment]')) span.dataset.limrIncrementDone = '';
      // A fence can lose its provisional closing punctuation. Keep the common
      // prefix's actual Text nodes and adjust only the suffix, even at finish.
      from = 0;
      while (from < Math.min(previous.current.length, value.length) && previous.current[from] === value[from]) from++;
      const walker = host.ownerDocument.createTreeWalker(host, NodeFilter.SHOW_TEXT);
      const texts: Text[] = [];
      for (let node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node as Text);
      let at = 0;
      for (const text of texts) {
        const size = text.length;
        if (at >= from) text.remove();
        else if (at + size > from) text.deleteData(from - at, size);
        at += size;
      }
      for (const span of host.querySelectorAll('[data-limr-increment]')) if (!span.textContent) span.remove();
    }
    const addition = value.slice(from);
    if (addition) {
      if (effect === false || !host.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const tail = host.lastChild;
        if (tail?.nodeType === Node.TEXT_NODE) (tail as Text).appendData(addition);
        else host.append(host.ownerDocument.createTextNode(addition));
      } else {
        const span = host.ownerDocument.createElement('span');
        span.dataset.limrIncrement = '';
        span.className = `limr-stream-increment ${effect.className ?? ''}`;
        span.textContent = addition;
        host.append(span);
        animate(span);
      }
    }
    previous.current = value;
  }, [value, runtime]);
  useEffect(() => {
    const document = element.current?.ownerDocument;
    return () => { document?.removeEventListener('selectionchange', compact); for (const animation of animations.current) animation.cancel(); animations.current.clear(); };
  }, []);
  return <span ref={element} data-limr-stream-text="">{initial.current}</span>;
});
