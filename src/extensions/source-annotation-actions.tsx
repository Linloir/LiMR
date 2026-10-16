import { useEffect, useMemo, useRef } from 'react';
import { useLocale, useRuntime, useStoreSelector } from '../react/context';
import { Store, type ReaderRuntime } from '../react/runtime';
import type { AnnotationContentProps } from '../react/types';
import { AnnotationMarkdown } from './annotations';
import { ToolIcon } from '../components/ToolIcon';
import { AnnotationEditor } from '../components/AnnotationEditor';

interface Draft { base: string; draft: string; error: string | null }
const drafts = new WeakMap<ReaderRuntime, Map<string, Store<Draft>>>();
function draftFor(runtime: ReaderRuntime, id: string, body: string): Store<Draft> {
  let entries = drafts.get(runtime);
  if (!entries) { entries = new Map(); drafts.set(runtime, entries); }
  let entry = entries.get(id);
  if (!entry) { entry = new Store({ base: body, draft: body, error: null }); entries.set(id, entry); }
  return entry;
}

/** Optional editor supplied by the annotation module, using the reader's shared
 * edit state and persistence commands. The host still owns saving the file. */
export function SourceAnnotationBody({ annotation, data, editing, presentation }: AnnotationContentProps<{ body?: string }>) {
  const runtime = useRuntime(), locale = useLocale();
  const canDelete = useStoreSelector(runtime.configuration, () => runtime.commands.canEditAnnotation(annotation.id));
  const canEdit = !!annotation.source && canDelete;
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const activeHere = runtime.decorations.get().occurrences.some(occurrence => occurrence.id === active && occurrence.annotationIds.includes(annotation.id));
  const body = data?.body ?? '';
  // Drafts belong to this module and reader, rather than a sidebar/overlay
  // component instance. Responsive presentation changes never discard input.
  const store = useMemo(() => draftFor(runtime, annotation.id, body), [runtime, annotation.id]);
  const draft = useStoreSelector(store, value => value);
  const zh = locale.language?.startsWith('zh');
  const conflict = body !== draft.base && body !== draft.draft;
  const conflictMessage = zh ? '原文已在其他位置修改。草稿已保留，请载入当前内容后重新编辑。' : 'The source changed elsewhere. Your draft is retained; load the current content before editing again.';
  useEffect(() => {
    const current = store.get();
    if (body !== current.base && (current.draft === current.base || current.draft === body)) store.set({ base: body, draft: body, error: null });
  }, [body, store]);
  const finish = () => {
    const current = store.get();
    try {
      const latest = runtime.decorations.get().annotations.get(annotation.id);
      if (!latest) return;
      const latestData = latest.data as { body?: string } | undefined, latestBody = latestData?.body ?? '';
      // Leaving an untouched empty draft is cancellation. The runtime knows
      // whether it was just created or is an existing empty annotation.
      if (!current.base.trim() && !current.draft.trim() && !latestBody.trim()) { cancel(); return; }
      if (current.draft !== current.base) {
        if (latestBody !== current.base && latestBody !== current.draft) throw new Error(conflictMessage);
        if (!runtime.commands.canEditAnnotation(annotation.id)) throw new Error(zh ? '源码编辑已关闭，草稿已保留。' : 'Source editing is disabled; your draft is retained.');
        if (latestBody !== current.draft) {
          const revision = runtime.document.getSnapshot().revision;
          runtime.commands.updateAnnotation(annotation.id, { data: { ...latestData, body: current.draft } });
          // Parsing can normalize surrounding blank lines. Acceptance is an
          // accepted source revision, not equality with normalized card data.
          if (runtime.document.getSnapshot().revision === revision) throw new Error(zh ? '原文修改未被接受，草稿已保留。' : 'The source change was not accepted; your draft is retained.');
        }
      }
      const saved = runtime.decorations.get().annotations.get(annotation.id)?.data as { body?: string } | undefined;
      const savedBody = saved?.body ?? latestBody;
      store.set({ base: savedBody, draft: savedBody, error: null });
      // A blur from the previous card must not close another card's editor.
      runtime.commands.commitAnnotationEdit(annotation.id);
    } catch (cause) { store.set({ ...store.get(), error: cause instanceof Error ? cause.message : String(cause) }); }
  };
  const finishRef = useRef(finish); finishRef.current = finish;
  const cancel = () => {
    const discarded = store.get();
    const saved = runtime.decorations.get().annotations.get(annotation.id)?.data as { body?: string } | undefined;
    const savedBody = saved?.body ?? body;
    // Reset before leaving edit mode: its exit listener must not save a
    // discarded draft, including when the source changed during editing.
    store.set({ base: savedBody, draft: savedBody, error: null });
    try {
      if (!runtime.commands.cancelAnnotationEdit(annotation.id)) throw new Error(zh ? '取消未被接受，草稿已保留。' : 'Cancellation was not accepted; your draft is retained.');
    } catch (cause) { store.set({ ...discarded, error: cause instanceof Error ? cause.message : String(cause) }); }
  };
  const remove = () => {
    try {
      runtime.commands.removeAnnotation(annotation.id);
      if (runtime.decorations.get().annotations.has(annotation.id)) throw new Error(zh ? '删除未被接受，请重试。' : 'Deletion was not accepted; please try again.');
    } catch (cause) { store.set({ ...store.get(), error: cause instanceof Error ? cause.message : String(cause) }); }
  };
  useEffect(() => {
    const ownsActive = () => runtime.decorations.get().occurrences.find(item => item.id === runtime.interaction.get().active)?.annotationIds.includes(annotation.id) ?? false;
    let wasEditing = runtime.interaction.get().editing === annotation.id, wasActive = ownsActive();
    const unsubscribe = runtime.interaction.subscribe(() => {
      const isEditing = runtime.interaction.get().editing === annotation.id, isActive = ownsActive();
      const leaving = wasEditing && (!isEditing || wasActive && !isActive);
      wasEditing = isEditing; wasActive = isActive;
      if (leaving) finishRef.current();
    });
    return () => { unsubscribe(); };
  }, [runtime, annotation.id]);
  return <div className="limr-source-annotation-body">
    {canEdit && editing ? <AnnotationEditor label={zh ? '注释 Markdown' : 'Annotation Markdown'} placeholder={zh ? '记录你的想法，可以使用 Markdown。' : 'Write a note using Markdown.'} value={draft.draft} autoFocus={presentation !== 'preview' || activeHere}
      onChange={value => store.set({ ...store.get(), draft: value, error: null })} onSubmit={finish} onCancel={cancel} onBlur={finish} cancelLabel={zh ? '取消' : 'Cancel'} submitLabel={locale.submit} /> : <>
      <AnnotationMarkdown source={body} />
      {canDelete && <div className="limr-annotation-actions">
        {canEdit && <button type="button" onClick={() => runtime.commands.editAnnotation(annotation.id)}><ToolIcon name="edit" /><span className="limr-underline">{zh ? '编辑' : 'Edit'}</span></button>}
        <button type="button" className="limr-annotation-delete" onClick={remove}><ToolIcon name="trash" /><span className="limr-underline">{locale.deleteAnnotations}</span></button>
      </div>}
    </>}
    {(conflict || draft.error) && <span role="alert" className="limr-action-error">{conflict ? conflictMessage : draft.error}</span>}
    {conflict && <div className="limr-annotation-actions"><button type="button" onClick={() => store.set({ base: body, draft: body, error: null })}><span className="limr-underline">{zh ? '载入当前内容' : 'Load current content'}</span></button></div>}
  </div>;
}

