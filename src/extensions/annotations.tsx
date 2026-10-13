import { useMemo, useRef } from 'react';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { safeUrl, textContent, walk } from '../core/tree';
import type { MarkdownNode } from '../core/types';
import type { AnnotationContentProps, AnnotationOverlayCardProps, AnnotationSidebarPreviewProps, AnnotationType, NodeRenderer, RendererExtension } from '../react/types';
import { Markdown, type MarkdownProps } from '../react/Markdown';
import { useLocale, useRuntime, useStoreSelector } from '../react/context';
import { AnnotationCard } from '../components/AnnotationCard';

export interface CitationData { title?: string; url?: string; description?: string; summary?: string }
const CitationParagraph: NodeRenderer = ({ children }) => <p><span className="limr-underline">{children}</span></p>;
function CitationIcon() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><path d="M2.5 4.2h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H2.5V4.2Zm6.7 0h4.3v4.3c0 2.1-1.2 3.3-3.5 3.8l-.5-1.4c1.4-.4 2-1 2-2H9.2V4.2Z" /></svg>;
}
export function AnnotationMarkdown({ source, className, ...props }: MarkdownProps & { source: string }) {
  const runtime = useRuntime();
  const config = useStoreSelector(runtime.configuration, config => config);
  return <Markdown source={source} extensions={config.extensions} parameters={config.parameters} components={config.components} annotationTypes={config.annotationTypes} theme={config.theme} appearance={config.appearance} locale={config.locale} interactive={false} {...props} className={`limr-annotation-markdown ${className ?? ''}`} />;
}

export function citation(options: Partial<AnnotationType<CitationData>> = {}): RendererExtension {
  function Preview({ annotations }: AnnotationSidebarPreviewProps<CitationData>) {
    const summary = useMemo(() => annotations.filter(annotation => annotation.type === (options.type ?? 'citation')).map(annotation => {
      const data = annotation.data as CitationData | undefined;
      const source = data?.summary?.trim() || data?.description?.trim();
      // Summaries need readable text, without mounting another interactive
      // reader or exposing Markdown punctuation in a two-line preview.
      if (source) return (fromMarkdown(source) as unknown as MarkdownNode).children?.map(textContent).join(' ').replace(/\s+/g, ' ').trim();
      return safeUrl(data?.url) || data?.title;
    }).filter(Boolean).join(' · '), [annotations]);
    return summary ? <span title={summary}>{summary}</span> : null;
  }
  function Card(props: AnnotationOverlayCardProps<CitationData>) {
    const locale = useLocale();
    return <AnnotationCard {...props} title={locale.citation ?? locale.annotations} />;
  }
  function Content({ data }: AnnotationContentProps<CitationData>) {
    const runtime = useRuntime();
    const configured = useStoreSelector(runtime.configuration, () => runtime.components);
    const components = useMemo(() => ({ ...configured, paragraph: configured.paragraph ?? CitationParagraph }), [configured]);
    const link = useRef<HTMLAnchorElement>(null);
    const url = safeUrl(data?.url);
    return <div className="limr-citation-content" data-linked={!!url || undefined} onClick={event => {
      if (url && !event.defaultPrevented && !(event.target as Element).closest('a,button,input,textarea,select,summary,[role="button"],[contenteditable="true"],[data-limr-card-interactive]') && window.getSelection()?.isCollapsed !== false) link.current?.click();
    }}>
      <a ref={link} className="limr-citation-title" href={url} target="_blank" rel="noopener noreferrer"><span className="limr-underline">{data?.title ?? data?.url ?? 'Citation'}</span></a>
      {(data?.description || data?.summary) && <AnnotationMarkdown source={data.description || data.summary!} components={components} />}
    </div>;
  }
  return {
    name: 'citation', tags: ['citation', 'ref'], scope: 'local',
    annotationTypes: [{ type: 'citation', label: locale => locale.citation ?? 'Citation', icon: CitationIcon, color: '#6366f1', highlight: 'hover', Content, ...options, sidebar: { Preview, collapseOnContentClick: false, ...options.sidebar }, overlay: { Card, expand: false, ...options.overlay } }],
    transform(root) {
      walk(root, node => {
        if (node.type !== 'component') return;
        if (node.name === 'citation') {
          const attributes = node.attributes ?? {};
          const id = String(attributes['cite-id'] ?? attributes.id ?? '');
          node.type = 'annotationDefinition';
          node.annotation = { id, type: 'citation', data: { title: attributes.title, url: attributes.url, description: attributes.desc ?? attributes.description, summary: attributes.summary } };
        } else if (node.name === 'ref') {
          const value = String(node.attributes?.['cite-from-ids'] ?? node.attributes?.ids ?? node.attributes?.id ?? '');
          let ids: string[];
          try { const parsed = JSON.parse(value); ids = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)]; }
          catch { ids = value.split(',').map(id => id.trim()).filter(Boolean); }
          node.type = 'annotationReference'; node.annotationIds = ids;
        }
      });
    },
  };
}
