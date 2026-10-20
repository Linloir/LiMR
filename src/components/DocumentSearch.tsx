import { useEffect, useRef, useState } from 'react';
import { type SourceRange } from '../core';
import { useDocumentSelector, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector } from '../react/context';
import { searchWindowedDocument } from '../react/windowed-search';
import { ownsReaderInteraction } from '../react/reader-ownership';
import { ToolIcon } from './ToolIcon';
import { LoadingRing } from './LoadingRing';
import { useSearchLoading } from '../react/search-loading';

/** Native browser find cannot inspect unmounted DOM. A windowed reader searches
 * its complete visible reading text and uses the same global source-navigation adapter. */
export function DocumentSearch() {
  const runtime = useRuntime(), locale = useLocale(), chinese = locale.language?.startsWith('zh');
  const source = useDocumentSelector(document => document.source);
  const presentation = useStoreSelector(runtime.presentation, revision => revision);
  const configuration = useStoreSelector(runtime.configuration, value => value);
  const [open, setOpen] = useState(false), [query, setQuery] = useState(''), [busy, setBusy] = useState(false);
  const [matches, setMatches] = useState<SourceRange[]>([]), [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false), [visible, setVisible] = useState(false);
  const panel = useRef<HTMLDivElement>(null), loading = useSearchLoading(busy);
  const input = useRef<HTMLInputElement>(null), previousFocus = useRef<Element | null>(null);
  const close = () => { setOpen(false); if (previousFocus.current instanceof HTMLElement && previousFocus.current.isConnected) previousFocus.current.focus({ preventScroll: true }); };
  useIsomorphicLayoutEffect(() => {
    if (open) {
      if (!mounted) { setMounted(true); return; }
      panel.current?.getBoundingClientRect();
      setVisible(true); input.current?.focus({ preventScroll: true }); input.current?.select();
      return;
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 340);
    return () => clearTimeout(timer);
  }, [open, mounted]);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== 'f') return;
      const active = document.activeElement;
      if (runtime.configuration.get().provisional || !ownsReaderInteraction(runtime) || !runtime.content?.getBoundingClientRect().height) return;
      event.preventDefault(); previousFocus.current = active; setOpen(true); requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [runtime]);
  useEffect(() => {
    if (open && configuration.provisional) { setOpen(false); setMatches([]); setBusy(false); return; }
    if (!open || !query) { setMatches([]); setBusy(false); return; }
    const controller = new AbortController(); setBusy(true); setMatches([]); setCurrent(0);
    const timer = setTimeout(() => {
      void searchWindowedDocument(runtime, query, { signal: controller.signal, limit: 100_000 }).then(found => {
        if (controller.signal.aborted) return;
        setMatches(found); setCurrent(0); setBusy(false);
        if (found[0]) runtime.scrollToSource(found[0]);
      }).catch(() => { if (!controller.signal.aborted) setBusy(false); });
    }, 90);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, source, open, runtime, presentation, configuration]);
  const move = (delta: number) => {
    if (busy || !matches.length) return;
    const next = (current + delta + matches.length) % matches.length; setCurrent(next); runtime.scrollToSource(matches[next]);
  };
  if (!mounted) return null;
  return <div ref={element => { panel.current = element; element?.toggleAttribute('inert', !open); }}
    className="limr-document-search" role="search" aria-hidden={!open} aria-busy={busy}
    data-open={visible || undefined} data-loading={loading || undefined} data-limr-selection-ui="true" data-limr-ignore="true" onKeyDown={event => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    if (event.key === 'Enter') { event.preventDefault(); move(event.shiftKey ? -1 : 1); }
  }}>
    <span className="limr-search-loading" aria-hidden={!loading}><LoadingRing /></span>
    <div className="limr-search-body">
    <input ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder={chinese ? '搜索全文' : 'Search document'} aria-label={chinese ? '搜索全文' : 'Search document'} />
    <span className="limr-search-count" role="status">{busy ? '…' : `${matches.length ? current + 1 : 0}/${matches.length}${matches.length === 100_000 ? '+' : ''}`}</span>
    <button className="limr-search-previous" type="button" onClick={() => move(-1)} disabled={busy || !matches.length} aria-label={chinese ? '上一个结果' : 'Previous result'}><ToolIcon name="chevron" /></button>
    <button type="button" onClick={() => move(1)} disabled={busy || !matches.length} aria-label={chinese ? '下一个结果' : 'Next result'}><ToolIcon name="chevron" /></button>
    <button type="button" onClick={close} aria-label={locale.close}><ToolIcon name="close" /></button>
    </div>
  </div>;
}
