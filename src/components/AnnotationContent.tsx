import { useEffect, useState } from 'react';
import { useRuntime, useStoreSelector } from '../react/context';
import type { Annotation, AnnotationOccurrence } from '../core';
import type { AnnotationPresentation } from '../react/types';

export function AnnotationContent({ annotationId, presentation, expanded = true }: { annotationId: string; presentation: AnnotationPresentation; expanded?: boolean }) {
  const runtime = useRuntime();
  const annotation = useStoreSelector(runtime.decorations, state => state.annotations.get(annotationId));
  const definition = useStoreSelector(runtime.configuration, () => runtime.annotationTypes.get(annotation?.type ?? 'citation'));
  const version = useStoreSelector(runtime.resourceVersions, versions => versions.get(annotationId) ?? 0);
  const [loaded, setLoaded] = useState<{ id: string; data?: unknown; loading: boolean; error: Error | null }>({ id: annotationId, loading: !!definition?.load, error: null });
  useEffect(() => {
    if (!definition?.load || !annotation) return;
    let disposed = false;
    setLoaded({ id: annotationId, loading: true, error: null });
    const request = runtime.resources.acquire(runtime.getResourceKey(annotation), signal => definition.load!(annotation, { signal }));
    request.promise.then(data => { if (!disposed) setLoaded({ id: annotationId, data, loading: false, error: null }); }).catch(error => { if (!disposed) setLoaded({ id: annotationId, loading: false, error: error instanceof Error ? error : new Error(String(error)) }); });
    return () => { disposed = true; request.release(); };
  }, [runtime, annotation, annotationId, definition, version]);
  const retry = () => runtime.invalidateAnnotation(annotationId);
  const Content = definition?.Content;
  const current = loaded.id === annotationId ? loaded : { loading: !!definition?.load, error: null, data: undefined };
  if (!annotation) return <span className="limr-muted">{runtime.locale.unavailable} · {annotationId}</span>;
  if (!Content) return <span className="limr-muted">{runtime.locale.unavailable} · {annotation.type}</span>;
  return <Content annotation={annotation} data={definition?.load ? current.data ?? annotation.data : annotation.data} loading={definition?.load ? current.loading : false} error={current.error} retry={retry} presentation={presentation} expanded={expanded} />;
}

export function AnnotationGroup({ occurrence, presentation, expanded = true }: { occurrence: AnnotationOccurrence; presentation: AnnotationPresentation; expanded?: boolean }) {
  return <>{occurrence.annotationIds.map(id => <div key={id} className="limr-annotation-entry"><AnnotationContent annotationId={id} presentation={presentation} expanded={expanded} /></div>)}</>;
}
