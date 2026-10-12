import { useEffect, useRef } from 'react';
import { useDocumentSelector, useLocale, useRuntime, useStoreSelector, useTheme } from '../react/context';
import type { StyledProps } from '../react/types';

export interface TableOfContentsProps extends StyledProps { title?: string; maxDepth?: number; followActive?: boolean; topInset?: number; updateHash?: boolean }
export function TableOfContents({ title, maxDepth = 6, followActive = true, topInset = 12, updateHash = false, className, style }: TableOfContentsProps) {
  const runtime = useRuntime();
  const theme = useTheme(), locale = useLocale();
  const headings = useDocumentSelector(doc => doc.headings);
  const active = useStoreSelector(runtime.interaction, state => state.activeHeading);
  const list = useRef<HTMLDivElement>(null);
  const manualUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const visible = headings.filter(heading => heading.level <= maxDepth);
  const minimum = Math.min(...visible.map(heading => heading.level), 6);
  useEffect(() => {
    if (!followActive || !active) return;
    const follow = () => {
      const container = list.current;
      if (!container || container.clientHeight === 0) return;
      const element = Array.from(container.querySelectorAll<HTMLElement>('[data-heading]')).find(item => item.dataset.heading === active);
      if (!element) return;
      const top = element.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - topInset;
      const target = Math.max(0, Math.min(top, container.scrollHeight - container.clientHeight));
      if (Math.abs(target - container.scrollTop) > 1) container.scrollTo({ top: target, behavior: 'auto' });
    };
    const delay = Math.max(0, manualUntil.current - Date.now());
    timer.current = setTimeout(follow, delay);
    return () => clearTimeout(timer.current);
  }, [active, headings, followActive, topInset]);
  const manual = () => { manualUntil.current = Date.now() + 1200; clearTimeout(timer.current); };
  return <nav className={`limr-toc ${className ?? ''}`} style={style} data-limr-theme={theme} aria-label={title ?? locale.contents}>
    <div className="limr-toc-title">{title ?? locale.contents}</div>
    <div className="limr-toc-scroll" ref={list} onWheel={manual} onTouchStart={manual} onKeyDown={manual} tabIndex={0}>
      <ol>{visible.map(heading => <li key={heading.id}><a data-heading={heading.id} href={`#${heading.id}`} aria-current={heading.id === active ? 'location' : undefined}
        style={{ paddingInlineStart: 12 + Math.min(heading.level - minimum, 4) * 14 }}
        onClick={event => { event.preventDefault(); runtime.scrollToHeading(heading.id); if (updateHash) history.replaceState(history.state, '', `#${heading.id}`); }}>{heading.text}</a></li>)}</ol>
    </div>
  </nav>;
}
