import { useContext, useEffect, useMemo, useRef } from 'react';
import { useAppearance, DocumentProvider, RuntimeContext, useDocument, useIsomorphicLayoutEffect, useRuntime, useStoreSelector, type DocumentProviderProps } from './context';
import { BlockView, Footnotes } from './render';
import { useSelectionTracking } from './selection';
import type { StyledProps } from './types';
import { emptyDecorations } from './runtime';
import { SelectionPaint } from './selection-paint';
import { windowingCapability } from './windowing-capabilities';
import { WindowedBlocks } from './WindowedBlocks';
import { AsyncDocumentBlocks } from './AsyncDocumentBlocks';
import { asyncHandoffScope } from './async-handoff-policy';

export interface MarkdownProps extends Omit<DocumentProviderProps, 'children'>, StyledProps {
  interactive?: boolean;
  /** Follow generated output while the reader remains near the bottom. */
  followOutput?: boolean;
}
export function Markdown({ className, style, interactive = true, followOutput = false, justify, ...props }: MarkdownProps) {
  const parent = useContext(RuntimeContext);
  if (props.source !== undefined || props.document || !parent) return <DocumentProvider {...props} justify={justify}><MarkdownBody className={className} style={style} interactive={interactive} followOutput={followOutput} /></DocumentProvider>;
  return <MarkdownBody className={className} style={style} interactive={interactive} followOutput={followOutput} justify={justify} />;
}

function MarkdownBody({ className, style, interactive, followOutput, justify }: StyledProps & { interactive: boolean; followOutput: boolean; justify?: boolean }) {
  const runtime = useRuntime();
  const stableHost = !!asyncHandoffScope(runtime);
  const document = useDocument();
  const appearance = useAppearance();
  const theme = useStoreSelector(runtime.configuration, config => config.theme ?? 'light');
  const configuredJustify = useStoreSelector(runtime.configuration, config => config.justify ?? false);
  const typography = useStoreSelector(runtime.configuration, config => config.typography ?? 'standard');
  const virtualization = useStoreSelector(runtime.configuration, config => config.virtualization);
  const justified = justify ?? (typography === 'justify' || configuredJustify);
  const scrollRoot = useStoreSelector(runtime.configuration, config => config.scrollRoot);
  const offset = useStoreSelector(runtime.documentOffset, value => value);
  const components = useStoreSelector(runtime.configuration, config => config.components);
  const extensions = useStoreSelector(runtime.configuration, config => config.extensions);
  const rendererOverrides = useStoreSelector(runtime.configuration, config => config.rendererOverrides);
  const decorations = useStoreSelector(runtime.decorations, state => state.byBlock);
  const configuration = useStoreSelector(runtime.configuration, value => value);
  const capability = useMemo(() => windowingCapability(document, configuration), [document.blocks, virtualization, components, extensions, rendererOverrides]);
  useEffect(() => configuration.onVirtualizationChange?.(capability), [configuration.onVirtualizationChange, capability]);
  const ref = useRef<HTMLElement>(null);
  const pinned = useRef(true);
  useIsomorphicLayoutEffect(() => ref.current ? runtime.mountContent(ref.current) : undefined, [runtime, scrollRoot]);
  useIsomorphicLayoutEffect(() => runtime.requestLayout(), [runtime, justify, configuredJustify, typography]);
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
  return <article ref={ref} onClick={event => runtime.followFragment(event.nativeEvent)} className={`limr-prose ${className ?? ''}`} style={{ ...style, translate: offset ? `0 ${offset}px` : style?.translate }} data-limr-theme={theme} data-limr-appearance={appearance} data-limr-document={document.id} data-limr-justify={justified} data-limr-typography={typography}>
    {stableHost ? <AsyncDocumentBlocks blocks={document.blocks} windowed={capability.enabled} overscan={typeof virtualization === 'object' ? virtualization.overscan : undefined} /> : capability.enabled ? <WindowedBlocks blocks={document.blocks} overscan={typeof virtualization === 'object' ? virtualization.overscan : undefined} /> : document.blocks.map(block => <BlockView key={block.id} block={block} runtime={runtime} components={components} extensions={extensions} rendererOverrides={rendererOverrides} decorations={decorations.get(block.id) ?? emptyDecorations} />)}
    {!stableHost && !capability.enabled && <Footnotes />}
    <SelectionPaint runtime={runtime} interactive={interactive} />
  </article>;
}
