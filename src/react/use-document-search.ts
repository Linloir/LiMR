import { useCallback, useEffect, useRef, useState } from 'react';
import type { SourceRange } from '../core';
import type { SearchWorkerPort } from '../core/search-worker';
import { useDocumentSelector, useRuntime, useStoreSelector } from './context';
import { ownsReaderInteraction } from './reader-ownership';
import { captureReadingPosition } from './reading-position';
import { ReadingSearch } from './reading-search';
import { useSearchLoading } from './search-loading';
import { selectedSearchText } from './search-selection';

export interface UseDocumentSearchOptions {
  /** Capture reader-owned Ctrl/Cmd+F and F3. Default false for custom UIs. */
  shortcuts?: boolean;
  defaultOpen?: boolean;
  worker?: () => SearchWorkerPort;
}
export interface DocumentSearchController {
  open: boolean; query: string; regex: boolean; caseSensitive: boolean;
  busy: boolean; loading: boolean; partial: boolean; error: string | null;
  matches: readonly SourceRange[]; current: number; focusRequest: number;
  setQuery: (query: string) => void;
  setRegex: (enabled: boolean) => void;
  setCaseSensitive: (enabled: boolean) => void;
  show: () => void; close: () => void; next: () => void; previous: () => void;
}

/** Headless reader-local search. Mount one controller per DocumentProvider and
 * compose any UI around it; reading projection, cancellation and navigation
 * remain identical to the default component. */
export function useDocumentSearch(options: UseDocumentSearchOptions = {}): DocumentSearchController {
  const runtime = useRuntime(), source = useDocumentSelector(document => document.source);
  const presentation = useStoreSelector(runtime.presentation, value => value);
  const configuration = useStoreSelector(runtime.configuration, value => value);
  const [open, setOpen] = useState(options.defaultOpen ?? false), [query, setQuery] = useState('');
  const [regex, setRegex] = useState(false), [caseSensitive, setCaseSensitive] = useState(false);
  const [busy, setBusy] = useState(false), loading = useSearchLoading(busy);
  const [matches, setMatches] = useState<SourceRange[]>([]), [current, setCurrent] = useState(-1);
  const [partial, setPartial] = useState(false), [error, setError] = useState<string | null>(null), [focusRequest, setFocusRequest] = useState(0);
  const session = useRef<ReadingSearch | null>(null), active = useRef(-1), pending = useRef(false), previousFocus = useRef<Element | null>(null);
  const reveal = useCallback((seedSelection: boolean) => {
    if (runtime.configuration.get().provisional) return;
    const selected = seedSelection ? selectedSearchText(runtime) : '';
    if (selected) { setQuery(selected); runtime.clearSelection(); }
    setOpen(value => { if (!value) previousFocus.current = document.activeElement; return true; });
    setFocusRequest(value => value + 1);
  }, [runtime]);
  const show = useCallback(() => reveal(true), [reveal]);
  const close = useCallback(() => {
    session.current?.dispose(); session.current = null;
    setOpen(false);
    if (previousFocus.current instanceof HTMLElement && previousFocus.current.isConnected) previousFocus.current.focus({ preventScroll: true });
  }, []);
  const publish = useCallback((search: ReadingSearch, index: number) => {
    if (session.current !== search) return;
    active.current = index; setCurrent(index); setMatches(search.matches.map(match => match.range)); setPartial(search.partial);
    pending.current = false; setBusy(false);
    if (search.matches[index]) runtime.scrollToSource(search.matches[index].range);
  }, [runtime]);
  const fail = useCallback((search: ReadingSearch, error: unknown) => {
    if (session.current !== search) return;
    pending.current = false; setBusy(false);
    if (!(error instanceof Error && error.name === 'AbortError')) { setError(error instanceof Error ? error.message : String(error)); search.dispose(); }
  }, []);
  useEffect(() => {
    setMatches([]); setCurrent(-1); active.current = -1; setPartial(false); setError(null);
    if (!open || !query || configuration.provisional) { pending.current = false; setBusy(false); return; }
    const controller = new AbortController();
    let search: ReadingSearch;
    try { search = new ReadingSearch(runtime, query, { regex, caseSensitive, signal: controller.signal, worker: options.worker }); }
    catch (error) { setError(error instanceof Error ? error.message : String(error)); setBusy(false); return; }
    session.current = search; pending.current = true; setBusy(false);
    const timer = setTimeout(() => {
      setBusy(true);
      const anchor = captureReadingPosition(runtime)?.source ?? 0;
      void search.initialize(anchor).then(() => publish(search, search.matches.length ? 0 : -1)).catch(error => fail(search, error));
    }, 90);
    return () => { clearTimeout(timer); controller.abort(); search.dispose(); if (session.current === search) session.current = null; };
  }, [open, query, regex, caseSensitive, source, runtime, presentation, configuration, options.worker, publish, fail]);
  const move = useCallback((direction: number) => {
    const search = session.current;
    if (!search || pending.current) return;
    pending.current = true; setBusy(true); setError(null);
    void search.move(active.current, direction).then(index => publish(search, index)).catch(error => fail(search, error));
  }, [publish, fail]);
  useEffect(() => {
    runtime.searchHighlights.set({ ranges: open ? [...matches].sort((a, b) => a.start - b.start || a.end - b.end) : [], current: open ? matches[current] ?? null : null });
    return () => { runtime.searchHighlights.set({ ranges: [], current: null }); };
  }, [runtime, matches, current, open]);
  useEffect(() => {
    const unsubscribe = runtime.searchCommand.subscribe(() => {
      const command = runtime.searchCommand.get().command;
      if (command === 'close') close();
      else { reveal(command === 'open'); if (command !== 'open') move(command === 'next' ? 1 : -1); }
    });
    return () => { unsubscribe(); };
  }, [runtime, reveal, close, move]);
  useEffect(() => {
    if (!options.shortcuts) return;
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !ownsReaderInteraction(runtime) || !runtime.content?.getBoundingClientRect().height) return;
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'f') { event.preventDefault(); show(); }
      else if (open && event.key === 'F3') { event.preventDefault(); move(event.shiftKey ? -1 : 1); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [runtime, options.shortcuts, open, show, move]);
  return { open, query, regex, caseSensitive, busy, loading, matches, current, partial, error, focusRequest,
    setQuery, setRegex, setCaseSensitive, show, close, next: () => move(1), previous: () => move(-1) };
}
