import { useRef, useState, type ReactNode } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';

/** Keep content mounted through exit, then release loaders and hidden controls. */
export function Collapse({ open, children, className = '', keepMounted = false }: { open: boolean; children: ReactNode; className?: string; keepMounted?: boolean }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  const panel = useRef<HTMLDivElement>(null);
  useIsomorphicLayoutEffect(() => {
    // Always-mounted panels can reverse their CSS transition in this render,
    // without a delayed frame or an unmount timer fighting the latest intent.
    if (keepMounted) return;
    if (open) {
      if (!mounted) { setMounted(true); return; }
      // Establish the newly mounted content's collapsed geometry before opening.
      // An interrupted exit can reverse immediately from its current frame.
      panel.current?.getBoundingClientRect();
      setVisible(true);
      return;
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 420);
    return () => clearTimeout(timer);
  }, [open, keepMounted, mounted]);
  return <div ref={element => { panel.current = element; element?.toggleAttribute('inert', !open); }} className={`limr-collapse ${className}`} data-open={(keepMounted ? open : visible) || undefined} aria-hidden={!open}>
    <div className="limr-collapse-inner">{mounted || keepMounted ? children : null}</div>
  </div>;
}
