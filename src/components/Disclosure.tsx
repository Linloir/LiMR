import { type ReactNode } from 'react';
import { Collapse } from './Collapse';

export function Disclosure({ title, open, onChange, children }: { title: string; open: boolean; onChange: (open: boolean) => void; children: ReactNode }) {
  // Native closed <details> skips layout of its contents. Keep the host open so
  // Collapse has a real 0fr starting state on the very first interaction too.
  // aria-expanded, aria-hidden and inert still describe the controlled state.
  return <details className="limr-disclosure" open data-expanded={open || undefined}>
    <summary aria-expanded={open} onClick={event => { event.preventDefault(); onChange(!open); }} data-limr-ignore="true">
      <span className="limr-underline">{title}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
    </summary>
    <Collapse open={open} keepMounted><div className="limr-question-detail">{children}</div></Collapse>
  </details>;
}
