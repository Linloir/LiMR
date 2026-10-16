import { AnnotationCard, AnnotationMarkdown, ToolIcon, defineExtension, useLiMR, useLocale, type AnnotationContentProps, type AnnotationOverlayCardProps, type AnnotationSidebarPreviewProps, type RendererExtension, type SelectionSnapshot } from '@linloir/limr';
import type { ReactNode } from 'react';

/** Your application owns transport, authentication and conversation storage. */
export interface AssistantAdapter {
  answer: (request: { selection: SelectionSnapshot; question: string; signal: AbortSignal }) => AsyncIterable<string>;
}
interface AnswerData { text: string; question?: string; status: 'streaming' | 'complete' | 'error'; error?: string }
const assistantIcon = <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m8 2 1.8 4.2L14 8l-4.2 1.8L8 14l-1.8-4.2L2 8l4.2-1.8L8 2Z" fill="currentColor" /></svg>;

/** Example application plugin. This is deliberately not a LiMR default module. */
export function assistant({ adapter, type = 'assistant', label = 'Ask assistant', icon = assistantIcon, color = '#8b5cf6', prompt = selection => `Explain “${selection.text}”` }: {
  adapter: AssistantAdapter; type?: string; label?: string; icon?: ReactNode; color?: string; prompt?: (selection: SelectionSnapshot) => string;
}): RendererExtension {
  function Card(props: AnnotationOverlayCardProps<AnswerData>) {
    return <AnnotationCard {...props} title={label} />;
  }
  function Answer({ annotation, data }: AnnotationContentProps<AnswerData>) {
    const commands = useLiMR(), locale = useLocale();
    return <div aria-busy={data?.status === 'streaming'}>
      <AnnotationMarkdown source={data?.text || '…'} streaming={data?.status === 'streaming'} />
      {data?.status === 'error' && <p role="alert">{data.error}</p>}
      {commands.canEditAnnotation(annotation.id) && <div className="limr-annotation-actions"><button type="button" className="limr-annotation-delete" onClick={() => commands.removeAnnotation(annotation.id)}><ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span></button></div>}
    </div>;
  }
  function Preview({ data, referenceText }: AnnotationSidebarPreviewProps<AnswerData>) {
    const question = data?.question || referenceText;
    return question ? <span title={question}>{question}</span> : null;
  }
  return defineExtension({
    name: type,
    annotationTypes: [{ type, label, icon, color, Content: Answer, sidebar: { Preview }, overlay: { Card, expand: { placement: 'center', width: 680, height: '80dvh' } } }],
    actions: [{ id: `${type}:ask`, label, icon: icon ?? assistantIcon, async run(context) {
      const id = `${type}-${crypto.randomUUID()}`;
      const question = prompt(context.selection);
      let text = '';
      context.addAnnotation({ id, type, data: { text, question, status: 'streaming' } satisfies AnswerData, anchors: context.selection.syntax.ranges.map(range => ({
        range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end),
      })) });
      context.activateAnnotation(id);
      context.clearSelection();
      try {
        for await (const chunk of adapter.answer({ selection: context.selection, question, signal: context.signal })) {
          if (context.signal.aborted) return;
          text += chunk;
          context.updateAnnotation(id, { data: { text, question, status: 'streaming' } satisfies AnswerData });
        }
        if (!context.signal.aborted) context.updateAnnotation(id, { data: { text, question, status: 'complete' } satisfies AnswerData });
      } catch (error) {
        if (!context.signal.aborted) context.updateAnnotation(id, { data: { text, question, status: 'error', error: error instanceof Error ? error.message : String(error) } satisfies AnswerData });
      }
    } }],
  });
}
