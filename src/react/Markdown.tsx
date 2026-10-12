import { useContext, useEffect, useRef } from 'react';
import { DocumentProvider, RuntimeContext, useDocument, useIsomorphicLayoutEffect, useRuntime, useStoreSelector, type DocumentProviderProps } from './context';
import { BlockView, Footnotes } from './render';
import { useSelectionTracking } from './selection';
import type { StyledProps } from './types';
import { emptyDecorations } from './runtime';

export interface MarkdownProps extends Omit<DocumentProviderProps, 'children'>, StyledProps {
  interactive?: boolean;
  /** Follow generated output while the reader remains near the bottom. */
  followOutput?: boolean;
}
export function Markdown({ className, style, interactive = true, followOutput = false, ...props }: MarkdownProps) {
  const parent = useContext(RuntimeContext);
  if (props.source !== undefined || !parent) return <DocumentProvider {...props}><MarkdownBody className={className} style={style} interactive={interactive} followOutput={followOutput} /></DocumentProvider>;
  return <MarkdownBody className={className} style={style} interactive={interactive} followOutput={followOutput} />;
}

function MarkdownBody({ className, style, interactive, followOutput }: StyledProps & { interactive: boolean; followOutput: boolean }) {
  const runtime = useRuntime();
  const document = useDocument();
  const theme = useStoreSelector(runtime.configuration, config => config.theme ?? 'light');
  const scrollRoot = useStoreSelector(runtime.configuration, config => config.scrollRoot);
  const components = useStoreSelector(runtime.configuration, config => config.components);
  const extensions = useStoreSelector(runtime.configuration, config => config.extensions);
  const decorations = useStoreSelector(runtime.decorations, state => state.byBlock);
  const ref = useRef<HTMLElement>(null);
  const pinned = useRef(true);
  useIsomorphicLayoutEffect(() => ref.current ? runtime.mountContent(ref.current) : undefined, [runtime, scrollRoot]);
  useSelectionTracking(runtime, interactive);
  useEffect(() => {
    if (!followOutput) return;
    const root = scrollRoot ?? window;
    const onScroll = () => {
      const element = scrollRoot ?? window.document.documentElement;
      const viewport = scrollRoot?.clientHeight ?? window.innerHeight;
      pinned.current = element.scrollHeight - runtime.getScrollTop() - viewport < 48;
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    return () => root.removeEventListener('scroll', onScroll);
  }, [runtime, followOutput, scrollRoot]);
  useIsomorphicLayoutEffect(() => {
    if (!followOutput || !document.streaming || !pinned.current) return;
    const frame = requestAnimationFrame(() => runtime.scrollTo(scrollRoot?.scrollHeight ?? window.document.documentElement.scrollHeight, 'instant'));
    return () => cancelAnimationFrame(frame);
  }, [document, runtime, followOutput, scrollRoot]);
  return <article ref={ref} className={`limr-prose ${className ?? ''}`} style={style} data-limr-theme={theme} data-limr-document={document.id}>
    {document.blocks.map(block => <BlockView key={block.id} block={block} runtime={runtime} components={components} extensions={extensions} decorations={decorations.get(block.id) ?? emptyDecorations} />)}
    <Footnotes />
  </article>;
}
