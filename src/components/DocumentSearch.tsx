import { useId, useRef, useState } from 'react';
import { useIsomorphicLayoutEffect, useLocale } from '../react/context';
import { useDocumentSearch, type DocumentSearchController, type UseDocumentSearchOptions } from '../react/use-document-search';
import type { StyledProps } from '../react/types';
import { ToolIcon } from './ToolIcon';
import { LoadingRing } from './LoadingRing';

export interface DocumentSearchProps extends StyledProps, UseDocumentSearchOptions {
  /** Handle reader-owned Ctrl/Cmd+F and F3. Defaults to true for an owned
   * controller; use false when the host forwards commands through useLiMR().find.
   * With an external controller, configure this on useDocumentSearch instead. */
  shortcuts?: boolean;
  /** Share a controller with a custom trigger or other search UI. */
  controller?: DocumentSearchController;
  /** Inline mode participates in a host toolbar; floating mode anchors right. */
  placement?: 'floating' | 'inline';
}
/** Optional, independently composable search UI inside DocumentProvider.
 * Replace it entirely with useDocumentSearch, or override its class/style. */
export function DocumentSearch(props: DocumentSearchProps) {
  return props.controller ? <SearchView {...props} controller={props.controller} /> : <OwnedSearch {...props} />;
}
function OwnedSearch(props: DocumentSearchProps) {
  const controller = useDocumentSearch({ ...props, shortcuts: props.shortcuts ?? true });
  return <SearchView {...props} controller={controller} />;
}
function SearchView({ controller: search, className, style, placement = 'floating' }: DocumentSearchProps & { controller: DocumentSearchController }) {
  const locale = useLocale(), chinese = locale.language?.startsWith('zh'), errorId = useId();
  const [mounted, setMounted] = useState(search.open), [visible, setVisible] = useState(false);
  const panel = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null);
  useIsomorphicLayoutEffect(() => {
    if (search.open) {
      if (!mounted) { setMounted(true); return; }
      panel.current?.getBoundingClientRect(); setVisible(true);
      input.current?.focus({ preventScroll: true }); input.current?.select();
      return;
    }
    setVisible(false);
    const timer = setTimeout(() => setMounted(false), 460);
    return () => clearTimeout(timer);
  }, [search.open, mounted, search.focusRequest]);
  if (!mounted) return null;
  const count = `${search.current < 0 ? 0 : search.current + 1}/${search.matches.length}${search.partial ? '+' : ''}`;
  const scope = search.partial ? (chinese ? '已搜索附近文本；使用上一个或下一个继续搜索' : 'Nearby text searched; use Previous or Next to scan further') : (chinese ? '已搜索全文' : 'Complete document searched');
  const canMove = !search.busy && !search.error && (!!search.matches.length || search.partial);
  return <div ref={element => { panel.current = element; element?.toggleAttribute('inert', !search.open); }}
    className={`limr-document-search ${className ?? ''}`} style={style} role="search" aria-hidden={!search.open} aria-busy={search.busy}
    data-placement={placement} data-open={visible || undefined} data-loading={search.loading || undefined} data-error={!!search.error || undefined}
    data-limr-selection-ui="true" data-limr-ignore="true" onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); search.close(); }
      if (event.key === 'Enter') { event.preventDefault(); if (event.shiftKey) search.previous(); else search.next(); }
    }}>
    <span className="limr-search-loading" aria-hidden={!search.loading}><LoadingRing /></span>
    <div className="limr-search-body">
      <div className="limr-search-field">
        <input ref={input} value={search.query} onChange={event => search.setQuery(event.target.value)}
          placeholder={chinese ? '搜索文档' : 'Search document'} aria-label={chinese ? '搜索文档' : 'Search document'}
          aria-invalid={!!search.error} aria-describedby={search.error ? errorId : undefined} autoComplete="off" spellCheck={false} />
        <span className="limr-search-count" role="status" title={scope} aria-label={`${count}. ${scope}`}>{search.busy ? '…' : search.error ? '!' : count}</span>
      </div>
      <button type="button" aria-pressed={search.caseSensitive} onClick={() => search.setCaseSensitive(!search.caseSensitive)}
        aria-label={chinese ? '区分大小写' : 'Match case'} title={chinese ? '区分大小写' : 'Match case'}><ToolIcon name="match-case" /></button>
      <button className="limr-search-regex" type="button" aria-pressed={search.regex} onClick={() => search.setRegex(!search.regex)}
        aria-label={chinese ? '使用正则表达式' : 'Use regular expression'} title={chinese ? '使用正则表达式' : 'Use regular expression'}><ToolIcon name="regex" /></button>
      <button className="limr-search-previous" type="button" onClick={search.previous} disabled={!canMove} aria-label={chinese ? '上一个结果' : 'Previous result'}><ToolIcon name="search-up" /></button>
      <button className="limr-search-next" type="button" onClick={search.next} disabled={!canMove} aria-label={chinese ? '下一个结果' : 'Next result'}><ToolIcon name="search-down" /></button>
      <button className="limr-search-close" type="button" onClick={search.close} aria-label={locale.close}><ToolIcon name="close" /></button>
    </div>
    {search.error && <span id={errorId} className="limr-search-error" role="alert">{search.error}</span>}
  </div>;
}
