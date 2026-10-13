import { useEffect, useState, type HTMLAttributes } from 'react';

/** Keep the panel through its exit; reopening reverses the same transition. */
export function Dropdown({ open, children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { open: boolean }) {
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!open) {
      setVisible(false);
      const timer = setTimeout(() => setPresent(false), 360);
      return () => clearTimeout(timer);
    }
    setPresent(true);
    let second = 0;
    const frame = requestAnimationFrame(() => { second = requestAnimationFrame(() => setVisible(true)); });
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(second); };
  }, [open]);
  if (!present) return null;
  return <div {...props} className={`demo-dropdown-menu ${className}`} data-open={visible || undefined} aria-hidden={!open} ref={element => { element?.toggleAttribute('inert', !open); }}>
    <div className="demo-dropdown-content">{children}</div>
  </div>;
}
