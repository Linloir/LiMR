import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useAppearance, DocumentProvider, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme, type DocumentProviderProps } from '../react/context';
import { Markdown } from '../react/Markdown';
import type { SelectionAction, StyledProps } from '../react/types';
import { TableOfContents } from './TableOfContents';
import { AnnotationSidebar } from './AnnotationSidebar';
import { AnnotationOverlay } from './AnnotationOverlay';
import { SelectionToolbar } from './SelectionToolbar';
import { Collapse } from './Collapse';
import { useOverflowFade } from '../react/overflow-fade';

export interface ReaderProps extends Omit<DocumentProviderProps, 'children'>, StyledProps {
  actions?: readonly SelectionAction[];
  toc?: boolean;
  sidebar?: boolean;
  /** Fold crowded consecutive annotation ranges; default false. */
  sidebarCollapse?: boolean;
  followOutput?: boolean;
  sidebarBreakpoint?: number;
  /** Fill unused viewport height without deriving the layout from annotations. */
  fillHeight?: boolean;
}
export function Reader({ actions, toc = true, sidebar = true, sidebarCollapse = false, followOutput = false, sidebarBreakpoint = 1120, fillHeight = true, className, style, ...provider }: ReaderProps) {
  return <DocumentProvider {...provider}><ReaderLayout actions={actions} toc={toc} sidebar={sidebar} sidebarCollapse={sidebarCollapse} followOutput={followOutput} sidebarBreakpoint={sidebarBreakpoint} fillHeight={fillHeight} className={className} style={style} /></DocumentProvider>;
}
function ReaderLayout({ actions, toc, sidebar, sidebarCollapse, followOutput, sidebarBreakpoint, fillHeight, className, style }: Pick<ReaderProps, 'actions' | 'toc' | 'sidebar' | 'sidebarCollapse' | 'followOutput' | 'className' | 'style' | 'fillHeight'> & { sidebarBreakpoint: number }) {
  const runtime = useRuntime();
  const scrollRoot = useStoreSelector(runtime.configuration, config => config.scrollRoot);
  const layout = useStoreSelector(runtime.layout, value => value);
  const appearance = useAppearance();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const tocRail = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLElement>(null);
  useOverflowFade(content, runtime, ':scope > .limr-prose');
  const [width, setWidth] = useState(0);
  const [availableHeight, setAvailableHeight] = useState(0);
  useIsomorphicLayoutEffect(() => {
    if (!fillHeight || !ref.current) return;
    // Use the origin in scroll coordinates. Scrolling must not grow/shrink the
    // reading canvas and feed back into the page's scroll range.
    const origin = ref.current.getBoundingClientRect().top - runtime.getViewportTop() - (scrollRoot?.clientTop ?? 0) + runtime.getScrollTop();
    setAvailableHeight(Math.max(0, (scrollRoot?.clientHeight ?? window.innerHeight) - origin));
  }, [runtime, scrollRoot, fillHeight, layout, width]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => { setWidth(element.clientWidth); runtime.requestLayout(); });
    observer.observe(element);
    if (scrollRoot) observer.observe(scrollRoot);
    if (element.parentElement) observer.observe(element.parentElement);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, [runtime, scrollRoot, sidebarBreakpoint]);
  useIsomorphicLayoutEffect(() => {
    const rail = tocRail.current;
    if (!rail) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!rail.clientWidth) return;
      const viewport = window.visualViewport;
      let top = viewport?.offsetTop ?? 0, bottom = top + (viewport?.height ?? window.innerHeight);
      if (scrollRoot) {
        const origin = scrollRoot.getBoundingClientRect().top + scrollRoot.clientTop;
        top = Math.max(top, origin); bottom = Math.min(bottom, origin + scrollRoot.clientHeight);
      }
      const reader = ref.current!.getBoundingClientRect();
      // A reader that has left the viewport must not cover the next reader.
      rail.toggleAttribute('inert', reader.bottom <= top || reader.top >= bottom);
      const height = `${Math.max(0, bottom - Math.max(top, rail.getBoundingClientRect().top)).toFixed(2)}px`;
      if (rail.style.getPropertyValue('--limr-toc-available-height') !== height) rail.style.setProperty('--limr-toc-available-height', height);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    const unsubscribe = [runtime.layout.subscribe(schedule), runtime.viewport.subscribe(schedule)];
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('resize', schedule);
    window.visualViewport?.addEventListener('scroll', schedule);
    measure();
    return () => {
      cancelAnimationFrame(frame); unsubscribe.forEach(fn => fn());
      window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
      window.visualViewport?.removeEventListener('resize', schedule); window.visualViewport?.removeEventListener('scroll', schedule);
      rail.removeAttribute('inert'); rail.style.removeProperty('--limr-toc-available-height');
    };
  }, [runtime, scrollRoot, toc]);
  const sidebarVisible = !!sidebar && width >= sidebarBreakpoint;
  return <div ref={ref} className={`limr-reader ${className ?? ''}`} style={{ '--limr-reader-available-height': fillHeight ? `${availableHeight}px` : undefined, ...style } as CSSProperties} data-fill-height={fillHeight || undefined} data-sidebar={sidebarVisible || undefined} data-toc={toc && width >= 800 || undefined} data-limr-theme={theme} data-limr-appearance={appearance}>
    {toc && <><div ref={tocRail} className="limr-reader-toc"><TableOfContents /></div><MobileContents /></>}
    <main ref={content} className="limr-reader-content"><Markdown followOutput={followOutput} /></main>
    {sidebarVisible && <AnnotationSidebar collapseOverflow={sidebarCollapse} />}
    <AnnotationOverlay disabled={sidebarVisible} />
    <SelectionToolbar actions={actions} />
  </div>;
}

function MobileContents() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const id = useId();
  return <div className="limr-reader-mobile-toc">
    <button type="button" className="limr-mobile-toc-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
      <span className="limr-underline">{locale.contents}</span>
    </button>
    <div id={id}><Collapse open={open} keepMounted><TableOfContents /></Collapse></div>
  </div>;
}
