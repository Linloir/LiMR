import { useEffect, useState, type ReactNode } from 'react';

/** Keep content mounted through exit, then release loaders and hidden controls. */
export function Collapse({ open, children, className = '', keepMounted = false }: { open: boolean; children: ReactNode; className?: string; keepMounted?: boolean }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);
  useEffect(() => {
    // Always-mounted panels can reverse their CSS transition in this render,
    // without a delayed frame or an unmount timer fighting the latest intent.
    if (keepMounted) return;
    if (open) {
      setMounted(true);
      let next = 0;
      const frame = requestAnimationFrame(() => { next = requestAnimationFrame(() => setVisible(true)); });
      return () => { cancelAnimationFrame(frame); cancelAnimationFrame(next); };
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 420);
    return () => clearTimeout(timer);
  }, [open, keepMounted]);
  return <div ref={element => { element?.toggleAttribute('inert', !open); }} className={`limr-collapse ${className}`} data-open={(keepMounted ? open : visible) || undefined} aria-hidden={!open}>
    <div className="limr-collapse-inner">{mounted || keepMounted ? children : null}</div>
  </div>;
}
