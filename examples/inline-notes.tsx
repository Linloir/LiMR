import { AnnotationCard, footnotes, ToolIcon, useLocale, type AnnotationContentProps, type AnnotationOverlayCardProps, type RendererExtension } from '@linloir/limr';

const FootnoteContent = footnotes().annotationTypes![0].Content!;
function InlineNoteContent(props: AnnotationContentProps) { return <div className="demo-note-content" data-limr-card-interactive="true"><FootnoteContent {...props} /></div>; }

function InlineNoteCard(props: AnnotationOverlayCardProps) {
  const zh = useLocale().language?.startsWith('zh');
  return <AnnotationCard {...props} title={zh ? '内联笔记' : 'Inline note'} />;
}

/** A source-backed note action alongside ordinary external reading notes. */
export function inlineNotes(): RendererExtension {
  const type = footnotes({ type: 'inline-note', label: locale => locale.language?.startsWith('zh') ? '内联笔记' : 'Inline note', Content: InlineNoteContent, overlay: { Card: InlineNoteCard } }).annotationTypes!;
  return {
    name: 'playground-inline-notes', annotationTypes: type,
    actions: [{
      id: 'inline-note', icon: <ToolIcon name="note" />,
      label: context => {
        const existing = context.annotations.some(annotation => annotation.source && ['inline-note', 'footnote'].includes(annotation.type));
        return context.locale.language?.startsWith('zh') ? existing ? '修改内联笔记' : '添加内联笔记' : existing ? 'Edit inline note' : 'Add inline note';
      },
      visible: context => context.canEditSource(),
      run: context => {
        const existing = context.annotations.find(annotation => annotation.source && ['inline-note', 'footnote'].includes(annotation.type));
        if (existing) context.editAnnotation(existing.id);
        else context.addAnnotation({ id: `inline-note-${crypto.randomUUID()}`, type: 'inline-note', data: { body: '' },
          anchors: context.selection.syntax.ranges.map(range => ({ range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end) })),
        }, { edit: true, target: 'source' });
        context.clearSelection();
      },
    }],
  };
}
