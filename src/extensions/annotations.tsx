import { safeUrl, walk } from '../core/tree';
import type { AnnotationContentProps, AnnotationType, RendererExtension } from '../react/types';
import { Markdown, type MarkdownProps } from '../react/Markdown';
import { useRuntime, useStoreSelector } from '../react/context';

export interface CitationData { title?: string; url?: string; description?: string }
export function AnnotationMarkdown({ source, className, ...props }: MarkdownProps & { source: string }) {
  const runtime = useRuntime();
  const config = useStoreSelector(runtime.configuration, config => config);
  return <Markdown source={source} extensions={config.extensions} components={config.components} annotationTypes={config.annotationTypes} theme={config.theme} locale={config.locale} interactive={false} {...props} className={`limr-annotation-markdown ${className ?? ''}`} />;
}

export function citation(options: Partial<AnnotationType<CitationData>> = {}): RendererExtension {
  function Content({ data }: AnnotationContentProps<CitationData>) {
    return <div className="limr-citation-content">
      <a href={safeUrl(data?.url)} target="_blank" rel="noreferrer">{data?.title ?? data?.url ?? 'Citation'}</a>
      {data?.description && <AnnotationMarkdown source={data.description} />}
    </div>;
  }
  return {
    name: 'citation', tags: ['citation', 'ref'], scope: 'local',
    annotationTypes: [{ type: 'citation', label: 'Citation', icon: '❞', color: '#6366f1', Content, ...options }],
    transform(root) {
      walk(root, node => {
        if (node.type !== 'component') return;
        if (node.name === 'citation') {
          const attributes = node.attributes ?? {};
          const id = String(attributes['cite-id'] ?? attributes.id ?? '');
          node.type = 'annotationDefinition';
          node.annotation = { id, type: 'citation', data: { title: attributes.title, url: attributes.url, description: attributes.desc ?? attributes.description } };
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
