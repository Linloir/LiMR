import { useEffect, useLayoutEffect, useRef } from 'react';
import { AnnotationMarkdown, ToolIcon, defineExtension, useLiMR, useLocale, type AnnotationContentProps, type RendererExtension } from '@linloir/limr';

interface NoteData { text: string; draft?: string }
const kinds = [
  { type: 'margin-note', label: '旁注', icon: 'comment', color: '#81B29A', hint: '在段落旁留下一个想法', labelEn: 'Margin note', hintEn: 'Leave a thought beside this passage' },
  { type: 'reading-note', label: '笔记', icon: 'note', color: '#6B9BD2', hint: '整理这一段的阅读笔记', labelEn: 'Note', hintEn: 'Write a reading note' },
  { type: 'reader-question', label: '提问', icon: 'question', color: '#E5A06E', hint: '写下还想进一步理解的问题', labelEn: 'Question', hintEn: 'What would you like to understand?' },
  { type: 'reader-footnote', label: '脚注', icon: 'footnote', color: '#B39DDB', hint: '补充解释或参考来源', labelEn: 'Footnote', hintEn: 'Add an explanation or a source' },
] as const;

function NoteContent({ annotation, data, editing, presentation }: AnnotationContentProps<NoteData>) {
  const commands = useLiMR();
  const locale = useLocale();
  const zh = locale.language?.startsWith('zh') ?? false;
  const text = data?.draft ?? data?.text ?? '';
  const isEditing = editing || data?.draft !== undefined;
  const input = useRef<HTMLTextAreaElement>(null);
  const kind = kinds.find(kind => kind.type === annotation.type)!;
  useEffect(() => {
    if (!isEditing) return;
    if (presentation === 'preview') return;
    const frame = requestAnimationFrame(() => {
      const field = input.current;
      if (field) { field.focus({ preventScroll: true }); field.selectionStart = field.selectionEnd = field.value.length; }
    });
    return () => cancelAnimationFrame(frame);
  }, [isEditing, presentation]);
  useLayoutEffect(() => {
    const field = input.current;
    if (!field) return;
    const resize = () => { field.style.height = 'auto'; field.style.height = `${field.scrollHeight}px`; };
    resize();
    // The same draft can move between a narrow card and the wider sidebar.
    let width = field.clientWidth;
    const observer = new ResizeObserver(() => { if (field.clientWidth !== width) { width = field.clientWidth; resize(); } });
    observer.observe(field.parentElement!);
    return () => observer.disconnect();
  }, [isEditing, text]);
  const save = () => {
    if (!text.trim()) return;
    commands.updateAnnotation(annotation.id, { data: { text } }); commands.editAnnotation(null);
  };
  const cancel = () => {
    if (!data?.text.trim()) commands.removeAnnotation(annotation.id);
    else { commands.updateAnnotation(annotation.id, { data: { text: data.text } }); commands.editAnnotation(null); }
  };
  return <div className="demo-note-content" data-limr-card-interactive="true">
    {isEditing ? <form onSubmit={event => { event.preventDefault(); save(); }}>
      <textarea className="demo-note-editor" ref={input} aria-label={zh ? `${kind.label}内容` : `${kind.labelEn} content`} rows={1} value={text} onChange={event => commands.updateAnnotation(annotation.id, { data: { text: data?.text ?? '', draft: event.target.value } })} placeholder={zh ? kind.hint : kind.hintEn} onKeyDown={event => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); cancel(); }
        else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); save(); }
      }} />
      <div className="demo-note-actions"><button type="button" onClick={cancel}><ToolIcon name="close" /><span className="limr-underline">{zh ? '取消' : 'Cancel'}</span></button><button type="submit" className="demo-note-submit" disabled={!text.trim()}><ToolIcon name="check" /><span className="limr-underline">{locale.submit}</span></button></div>
    </form> : <><AnnotationMarkdown source={data?.text || (zh ? '还没有内容。' : 'No content yet.')} /><div className="demo-note-actions"><button type="button" onClick={() => { commands.updateAnnotation(annotation.id, { data: { text: data?.text ?? '', draft: data?.text ?? '' } }); commands.editAnnotation(annotation.id); }}><ToolIcon name="edit" /><span className="limr-underline">{zh ? '修改' : 'Edit'}</span></button><button type="button" className="demo-note-delete" onClick={() => commands.removeAnnotation(annotation.id)}><ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span></button></div></>}
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
    annotationTypes: kinds.map(kind => ({ type: kind.type, label: locale => locale.language?.startsWith('zh') ? kind.label : kind.labelEn, color: kind.color, icon: <ToolIcon name={kind.icon} />, Content: NoteContent,
      sidebar: { Preview: NotePreview },
      overlay: { previewWidth: 300, expand: { placement: 'center' as const, width: 400, maxHeight: '75dvh' } },
    })),
    actions: kinds.map(kind => ({ id: `reading-notes:${kind.type}`, label: context => context.locale.language?.startsWith('zh') ? kind.label : kind.labelEn, icon: <ToolIcon name={kind.icon} />, run: context => {
      context.addAnnotation({ id: `note-${crypto.randomUUID()}`, type: kind.type, data: { text: '', draft: '' } satisfies NoteData,
        anchors: context.selection.syntax.ranges.map(range => ({ range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end) })),
      }, { edit: true });
      context.clearSelection();
    } })),
  });
}
