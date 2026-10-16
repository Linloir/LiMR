import { AnnotationCard, AnnotationMarkdown, defineBlock, defineExtension, ToolIcon, useLiMR, useLocale,
  type AnnotationContentProps, type AnnotationOverlayCardProps, type AnnotationSidebarPreviewProps,
  type AnnotationType, type LiMRLocale, type RendererExtension } from '@linloir/limr';

export interface ReadingNoteData { text: string }
export interface ReadingToolsOptions { label?: string }
const isChinese = (locale: LiMRLocale) => locale.language?.startsWith('zh') ?? false;

export function readingTools(options: ReadingToolsOptions = {}): RendererExtension {
  const label = (locale: LiMRLocale) => options.label ?? (isChinese(locale) ? '阅读笔记' : 'Reading note');
  function Content({ annotation, data }: AnnotationContentProps<ReadingNoteData>) {
    const commands = useLiMR(), locale = useLocale();
    return <><AnnotationMarkdown source={data?.text ?? ''} />
      {commands.canEditAnnotation(annotation.id) && <div className="limr-annotation-actions"><button type="button" className="limr-annotation-delete" onClick={() => commands.removeAnnotation(annotation.id)}><ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span></button></div>}
    </>;
  }
  function Card(props: AnnotationOverlayCardProps<ReadingNoteData>) {
    return <AnnotationCard {...props} title={label(useLocale())} />;
  }
  function Preview({ data }: AnnotationSidebarPreviewProps<ReadingNoteData>) {
    return data?.text ? <span>{data.text}</span> : null;
  }
  const note: AnnotationType<ReadingNoteData> = {
    type: 'example:note', label, icon: <ToolIcon name="note" />, color: '#548b74', Content,
    sidebar: { Preview },
    overlay: { Card, previewWidth: 320, expand: { placement: 'center', width: 600, maxHeight: '80dvh' } },
  };
  const tip = defineBlock({
    name: 'reading-tip',
    component: ({ children, renderAttribute, node }) => <aside className="example-reading-tip">
      {node.attributes?.title && <header>{renderAttribute('title')}</header>}
      {children}
    </aside>,
  });
  return defineExtension({
    ...tip, name: 'example:reading-tools', annotationTypes: [note],
    actions: [{
      id: 'example:save-passage', label: context => label(context.locale), icon: <ToolIcon name="note" />,
      visible: ({ selection }) => selection.settled && selection.quality !== 'unmapped'
        && selection.syntax.ranges.some(range => range.end > range.start),
      run(context) {
        const id = `example-note-${crypto.randomUUID()}`;
        context.addAnnotation({ id, type: note.type, data: { text: context.selection.text } satisfies ReadingNoteData,
          anchors: context.selection.syntax.ranges.map(range => ({
            range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end),
          })),
        });
        context.activateAnnotation(id);
        context.clearSelection();
      },
    }],
  });
}
