import { useEffect, useRef, useState } from 'react';
import { useLocale } from '../react/context';

/** Shared skin primitive; glyphs are original SVG, independent of an icon font. */
export function CopyButton({ value, label, variant = 'plain', className = '' }: { value: string; label?: string; variant?: 'plain' | 'glass'; className?: string }) {
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; clearTimeout(timer.current); }; }, []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      if (!mounted.current) return;
      setStatus('copied');
    } catch { if (!mounted.current) return; setStatus('error'); }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2200);
  };
  return <button type="button" className={`limr-copy-button ${className}`} data-variant={variant} data-status={status} data-limr-ignore="true"
    aria-label={status === 'copied' ? locale.copied : label ?? locale.copy} title={status === 'copied' ? locale.copied : label ?? locale.copy} onClick={copy}>
    <svg className="limr-copy-glyph" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g className="limr-copy-sheets"><rect x="8.5" y="8" width="10.5" height="12" rx="3" /><path d="M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5" /></g>
      <path className="limr-copy-check" d="m5.5 12 4.2 4.2 8.8-9" pathLength="1" />
    </svg>
    <span className="limr-sr-only" role="status">{status === 'copied' ? locale.copied : status === 'error' ? locale.unavailable : ''}</span>
  </button>;
}
