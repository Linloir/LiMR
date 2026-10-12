import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { useAppearance, DocumentProvider, useIsomorphicLayoutEffect, useLocale, useRuntime, useStoreSelector, useTheme, type DocumentProviderProps } from '../react/context';
import { Markdown } from '../react/Markdown';
import type { SelectionAction, StyledProps } from '../react/types';
import { TableOfContents } from './TableOfContents';
import { AnnotationSidebar } from './AnnotationSidebar';
import { AnnotationOverlay } from './AnnotationOverlay';
import { SelectionToolbar } from './SelectionToolbar';
import { Collapse } from './Collapse';

export interface ReaderProps extends Omit<DocumentProviderProps, 'children'>, StyledProps {
  actions?: readonly SelectionAction[];
  toc?: boolean;
  sidebar?: boolean;
  followOutput?: boolean;
  sidebarBreakpoint?: number;
  /** Fill unused viewport height without deriving the layout from annotations. */
  fillHeight?: boolean;
}
export function Reader({ actions, toc = true, sidebar = true, followOutput = false, sidebarBreakpoint = 1120, fillHeight = true, className, style, ...provider }: ReaderProps) {
  return <DocumentProvider {...provider}><ReaderLayout actions={actions} toc={toc} sidebar={sidebar} followOutput={followOutput} sidebarBreakpoint={sidebarBreakpoint} fillHeight={fillHeight} className={className} style={style} /></DocumentProvider>;
}
function ReaderLayout({ actions, toc, sidebar, followOutput, sidebarBreakpoint, fillHeight, className, style }: Pick<ReaderProps, 'actions' | 'toc' | 'sidebar' | 'followOutput' | 'className' | 'style' | 'fillHeight'> & { sidebarBreakpoint: number }) {
  const runtime = useRuntime();
  const scrollRoot = useStoreSelector(runtime.configuration, config => config.scrollRoot);
  const layout = useStoreSelector(runtime.layout, value => value);
  const appearance = useAppearance();
  const theme = useTheme();
  const ref = useRef<HTMLDivElement>(null);
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
  const sidebarVisible = !!sidebar && width >= sidebarBreakpoint;
  return <div ref={ref} className={`limr-reader ${className ?? ''}`} style={{ '--limr-reader-available-height': fillHeight ? `${availableHeight}px` : undefined, ...style } as CSSProperties} data-fill-height={fillHeight || undefined} data-sidebar={sidebarVisible || undefined} data-toc={toc && width >= 800 || undefined} data-limr-theme={theme} data-limr-appearance={appearance}>
    {toc && <><div className="limr-reader-toc"><TableOfContents /></div><MobileContents /></>}
    <main className="limr-reader-content"><Markdown followOutput={followOutput} /></main>
    {sidebarVisible && <AnnotationSidebar />}
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
      <span>{locale.contents}</span><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
    </button>
    <div id={id}><Collapse open={open} keepMounted><TableOfContents /></Collapse></div>
  </div>;
}
