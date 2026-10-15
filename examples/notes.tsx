import { AnnotationCard, AnnotationEditor, AnnotationMarkdown, ToolIcon, defineExtension, footnotes, useAnnotationState, useAnnotations, useLiMR, useLocale, type AnnotationContentProps, type AnnotationOverlayCardProps, type LiMRLocale, type RendererExtension } from '@linloir/limr';

interface NoteData { text: string; draft?: string }
const kinds = [
  { type: 'margin-note', label: '旁注', icon: 'comment', color: '#81B29A', hint: '在段落旁留下一个想法', labelEn: 'Margin note', hintEn: 'Leave a thought beside this passage' },
  { type: 'reading-note', label: '笔记', icon: 'note', color: '#6B9BD2', hint: '整理这一段的阅读笔记', labelEn: 'Note', hintEn: 'Write a reading note' },
  { type: 'reader-question', label: '提问', icon: 'question', color: '#E5A06E', hint: '写下还想进一步理解的问题', labelEn: 'Question', hintEn: 'What would you like to understand?' },
  { type: 'reader-footnote', label: '脚注', icon: 'footnote', color: '#B39DDB', hint: '补充解释或参考来源', labelEn: 'Footnote', hintEn: 'Add an explanation or a source' },
] as const;

function SourceQuestionCard(props: AnnotationOverlayCardProps) { return <AnnotationCard {...props} title={useLocale().question} />; }
/** The generic source syntax does not choose a renderer for application types. */
export const sourceQuestionType = footnotes({ type: 'question', label: locale => locale.question, icon: <ToolIcon name="question" />, color: '#B38B4E', overlay: { Card: SourceQuestionCard } }).annotationTypes![0];

function NoteContent({ annotation, data, editing, presentation }: AnnotationContentProps<NoteData>) {
  const commands = useLiMR();
  const locale = useLocale();
  const { active } = useAnnotationState(), { occurrences } = useAnnotations();
  const activeHere = occurrences.some(occurrence => occurrence.id === active && occurrence.annotationIds.includes(annotation.id));
  const zh = locale.language?.startsWith('zh') ?? false;
  const text = data?.draft ?? data?.text ?? '';
  const isEditing = editing || data?.draft !== undefined;
  const kind = kinds.find(kind => kind.type === annotation.type)!;
  const save = () => {
    if (!text.trim()) return;
    commands.updateAnnotation(annotation.id, { data: { text } }); commands.editAnnotation(null);
  };
  const cancel = () => {
    if (!data?.text.trim()) commands.removeAnnotation(annotation.id);
    else { commands.updateAnnotation(annotation.id, { data: { text: data.text } }); commands.editAnnotation(null); }
  };
  return <div className="demo-note-content" data-limr-card-interactive="true">
    {isEditing ? <AnnotationEditor value={text} label={zh ? `${kind.label}内容` : `${kind.labelEn} content`} placeholder={zh ? kind.hint : kind.hintEn} autoFocus={presentation !== 'preview' || activeHere}
      onChange={draft => commands.updateAnnotation(annotation.id, { data: { text: data?.text ?? '', draft } })} onSubmit={save} onCancel={cancel} submitDisabled={!text.trim()} cancelLabel={zh ? '取消' : 'Cancel'} submitLabel={locale.submit} />
      : <><AnnotationMarkdown source={data?.text || (zh ? '还没有内容。' : 'No content yet.')} /><div className="limr-annotation-actions"><button type="button" onClick={() => { commands.updateAnnotation(annotation.id, { data: { text: data?.text ?? '', draft: data?.text ?? '' } }); commands.editAnnotation(annotation.id); }}><ToolIcon name="edit" /><span className="limr-underline">{zh ? '修改' : 'Edit'}</span></button><button type="button" className="demo-note-delete" onClick={() => commands.removeAnnotation(annotation.id)}><ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span></button></div></>}
  </div>;
}

function NotePreview({ data }: { data?: NoteData }) {
  const locale = useLocale();
  return <span>{data?.text || (locale.language?.startsWith('zh') ? '正在编辑…' : 'Editing…')}</span>;
}

/** Modules bind every footnote/note/question through the same annotation API. */
export function readingNotes(): RendererExtension {
  return defineExtension({
    name: 'reading-notes',
    annotationTypes: [...kinds.map(kind => ({ type: kind.type, label: (locale: LiMRLocale) => locale.language?.startsWith('zh') ? kind.label : kind.labelEn, color: kind.color, icon: <ToolIcon name={kind.icon} />, Content: NoteContent,
      sidebar: { Preview: NotePreview },
      overlay: { previewWidth: 300 },
    })), sourceQuestionType],
    actions: kinds.map(kind => ({ id: `reading-notes:${kind.type}`, label: context => context.locale.language?.startsWith('zh') ? kind.label : kind.labelEn, icon: <ToolIcon name={kind.icon} />, run: context => {
      context.addAnnotation({ id: `note-${crypto.randomUUID()}`, type: kind.type, data: { text: '', draft: '' } satisfies NoteData,
        anchors: context.selection.syntax.ranges.map(range => ({ range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end) })),
      }, { edit: true });
      context.clearSelection();
    } })),
  });
}
