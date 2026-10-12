import { useEffect, useRef, useState } from 'react';
import { DocumentProvider, useLocale, useTheme, type DocumentProviderProps } from '../react/context';
import { Markdown } from '../react/Markdown';
import type { SelectionAction, StyledProps } from '../react/types';
import { TableOfContents } from './TableOfContents';
import { AnnotationSidebar } from './AnnotationSidebar';
import { AnnotationOverlay } from './AnnotationOverlay';
import { SelectionToolbar } from './SelectionToolbar';

export interface ReaderProps extends Omit<DocumentProviderProps, 'children'>, StyledProps {
  actions?: readonly SelectionAction[];
  toc?: boolean;
  sidebar?: boolean;
  followOutput?: boolean;
  sidebarBreakpoint?: number;
}
export function Reader({ actions, toc = true, sidebar = true, followOutput = false, sidebarBreakpoint = 1120, className, style, ...provider }: ReaderProps) {
  return <DocumentProvider {...provider}><ReaderLayout actions={actions} toc={toc} sidebar={sidebar} followOutput={followOutput} sidebarBreakpoint={sidebarBreakpoint} className={className} style={style} /></DocumentProvider>;
}
function ReaderLayout({ actions, toc, sidebar, followOutput, sidebarBreakpoint, className, style }: Pick<ReaderProps, 'actions' | 'toc' | 'sidebar' | 'followOutput' | 'className' | 'style'> & { sidebarBreakpoint: number }) {
  const theme = useTheme(), locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    setWidth(element.clientWidth);
    return () => observer.disconnect();
  }, [sidebarBreakpoint]);
  const sidebarVisible = !!sidebar && width >= sidebarBreakpoint;
  return <div ref={ref} className={`limr-reader ${className ?? ''}`} style={style} data-sidebar={sidebarVisible || undefined} data-toc={toc && width >= 800 || undefined} data-limr-theme={theme}>
    {toc && <><div className="limr-reader-toc"><TableOfContents /></div><details className="limr-reader-mobile-toc"><summary>{locale.contents}</summary><TableOfContents /></details></>}
    <main className="limr-reader-content"><Markdown followOutput={followOutput} /></main>
    {sidebarVisible && <AnnotationSidebar />}
    <AnnotationOverlay disabled={sidebarVisible} />
    <SelectionToolbar actions={actions} />
  </div>;
}
