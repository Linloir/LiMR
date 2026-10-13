import { useRef, useState, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';

/** Keep both faces measurable during a crossfade; only the active face sets
 * the width. CSS animates real geometry, including an interrupted reversal. */
export function ToolFaces({ state, children }: { state: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();
  useIsomorphicLayoutEffect(() => {
    const element = ref.current; if (!element) return;
    const faces = [...element.querySelectorAll<HTMLElement>('.limr-tool-face')];
    const measure = () => {
      const face = faces.find(face => face.hasAttribute('data-visible'));
      if (face) setWidth(face.offsetWidth);
    };
    measure();
    const observer = new ResizeObserver(measure); faces.forEach(face => observer.observe(face));
    return () => observer.disconnect();
  }, [state]);
  return <span className="limr-tool-faces" ref={ref} style={{ width }}>{children}</span>;
}
