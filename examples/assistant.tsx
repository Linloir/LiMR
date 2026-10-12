import { AnnotationMarkdown, defineExtension, type AnnotationContentProps, type RendererExtension, type SelectionSnapshot } from 'limr';
import type { ReactNode } from 'react';

/** Your application owns transport, authentication and conversation storage. */
export interface AssistantAdapter {
  answer: (request: { selection: SelectionSnapshot; signal: AbortSignal }) => AsyncIterable<string>;
}
interface AnswerData { text: string; status: 'streaming' | 'complete' | 'error'; error?: string }

/** Example application plugin. This is deliberately not a LiMR default module. */
export function assistant({ adapter, type = 'assistant', label = 'Ask assistant', icon = '✦' }: {
  adapter: AssistantAdapter; type?: string; label?: string; icon?: ReactNode;
}): RendererExtension {
  function Answer({ data }: AnnotationContentProps<AnswerData>) {
    return <div aria-busy={data?.status === 'streaming'}>
      <AnnotationMarkdown source={data?.text || '…'} streaming={data?.status === 'streaming'} />
      {data?.status === 'error' && <p role="alert">{data.error}</p>}
    </div>;
  }
  return defineExtension({
    name: type,
    annotationTypes: [{ type, label, icon, color: '#8b5cf6', Content: Answer }],
    actions: [{ id: `${type}:ask`, label, icon, async run(context) {
      const id = `${type}-${crypto.randomUUID()}`;
      let text = '';
      context.addAnnotation({ id, type, data: { text, status: 'streaming' } satisfies AnswerData, anchors: context.selection.raw.ranges.map(range => ({
        range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end),
      })) });
      context.activateAnnotation(id);
      context.clearSelection();
      try {
        for await (const chunk of adapter.answer({ selection: context.selection, signal: context.signal })) {
          if (context.signal.aborted) return;
          text += chunk;
          context.updateAnnotation(id, { data: { text, status: 'streaming' } satisfies AnswerData });
        }
        if (!context.signal.aborted) context.updateAnnotation(id, { data: { text, status: 'complete' } satisfies AnswerData });
      } catch (error) {
        if (!context.signal.aborted) context.updateAnnotation(id, { data: { text, status: 'error', error: error instanceof Error ? error.message : String(error) } satisfies AnswerData });
      }
    } }],
  });
}
