import { useEffect, useState, type ReactNode } from 'react';
import { Collapse } from './Collapse';

export function Disclosure({ title, open, onChange, children }: { title: string; open: boolean; onChange: (open: boolean) => void; children: ReactNode }) {
  const [present, setPresent] = useState(open);
  useEffect(() => {
    if (open) { setPresent(true); return; }
    const timer = setTimeout(() => setPresent(false), 420);
    return () => clearTimeout(timer);
  }, [open]);
  return <details className="limr-disclosure" open={present || open} data-expanded={open || undefined}>
    <summary aria-expanded={open} onClick={event => { event.preventDefault(); onChange(!open); }} data-limr-ignore="true">
      <span className="limr-underline">{title}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
    </summary>
    <Collapse open={open} keepMounted><div className="limr-question-detail">{children}</div></Collapse>
  </details>;
}
