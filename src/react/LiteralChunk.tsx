import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { useIsomorphicLayoutEffect } from './context';

const observers = new WeakMap<Element, { observer: IntersectionObserver; targets: Map<Element, (visible: boolean) => void> }>();

/** The text never unmounts. Only source-line decorations are materialized near
 * the viewport. Preserve native selection endpoints while changing wrappers. */
export function LiteralChunk({ style, children, decorate }: { style: CSSProperties; children: ReactNode; decorate?: () => ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [detailed, setDetailed] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const element = ref.current, root = element?.closest('pre');
    if (!element || !root || !decorate) return;
    if (typeof IntersectionObserver === 'undefined') { setDetailed(true); return; }
    let visible = false, printing = false, waiting = false, current = false;
    const doc = element.ownerDocument, win = doc.defaultView!;
    const apply = () => {
      const next = visible || printing;
      if (next === current) return;
      const selection = doc.getSelection();
      if (!printing && selection?.rangeCount && !selection.isCollapsed && selection.getRangeAt(0).intersectsNode(element)) {
        if (!waiting) { waiting = true; doc.addEventListener('selectionchange', apply); }
        return;
      }
      if (waiting) { waiting = false; doc.removeEventListener('selectionchange', apply); }
      current = next; setDetailed(next);
    };
    let shared = observers.get(root);
    if (!shared) {
      const targets = new Map<Element, (visible: boolean) => void>();
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) targets.get(entry.target)?.(entry.isIntersecting);
      }, { rootMargin: '200px' });
      shared = { observer, targets }; observers.set(root, shared);
    }
    shared.targets.set(element, next => { visible = next; apply(); }); shared.observer.observe(element);
    const beforePrint = () => { printing = true; flushSync(apply); };
    const afterPrint = () => { printing = false; apply(); };
    win.addEventListener('beforeprint', beforePrint); win.addEventListener('afterprint', afterPrint);
    return () => {
      shared!.observer.unobserve(element); shared!.targets.delete(element);
      if (!shared!.targets.size) { shared!.observer.disconnect(); observers.delete(root); }
      doc.removeEventListener('selectionchange', apply);
      win.removeEventListener('beforeprint', beforePrint); win.removeEventListener('afterprint', afterPrint);
    };
  }, [!!decorate]);
  return <span ref={ref} className="limr-code-chunk" style={style}>{detailed && decorate ? decorate() : children}</span>;
}
