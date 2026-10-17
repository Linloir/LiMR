import { memo, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createDocumentSession, type DocumentInput, type DocumentSessionOptions, type DocumentSessionState, type DocumentSnapshot, type DocumentEngine, type Annotation } from '../core';
import { standard } from '../extensions/standard';
import { hasDocumentSyntax } from '../core/worker-registry';
import { Reader, ReaderInitialWidthContext, type ReaderProps } from './Reader';
import { useIsomorphicLayoutEffect } from '../react/context';
import { AsyncReaderPositionBinding, AsyncReaderPositionBoundary } from '../react/AsyncReaderPositionBoundary';

export interface AsyncReaderProps extends Omit<ReaderProps, 'source' | 'document' | 'streaming'> {
  input: DocumentInput;
  /** Blocking is the default. Worker creation remains a bundler/host concern. */
  loading?: Omit<DocumentSessionOptions, 'id' | 'extensions'>;
  loadingFallback?: (state: DocumentSessionState, retry: () => void) => ReactNode;
  onLoadStateChange?: (state: DocumentSessionState) => void;
}

function benefitsFromWindowing(snapshot: DocumentSnapshot): boolean {
  if (snapshot.source.length > 1_000_000 || snapshot.blocks.length > 128) return true;
  let count = 0;
  const visit = (node: DocumentSnapshot['blocks'][number]['node']) => { if (++count > 2048) return; node.children?.forEach(visit); };
  for (const block of snapshot.blocks) { if (!['annotationDefinition', 'footnoteDefinition', 'definition'].includes(block.node.type)) visit(block.node); if (count > 2048) return true; }
  return false;
}
// Progress updates keep the loading UI and observer current without rendering
// an unchanged reading surface. Real Reader props and its own stores still update.
const AsyncReaderContent = memo(function AsyncReaderContent({ children, ...props }: ReaderProps) {
  return <Reader {...props}><AsyncReaderPositionBinding />{children}</Reader>;
});

/** Load a complete semantic document before mounting the reader, or explicitly
 * request a provisional prefix. The same Reader provides all reading features. */
export function AsyncReader({ input, loading, loadingFallback, onLoadStateChange, ...reader }: AsyncReaderProps) {
  const generatedId = useId(), [attempt, setAttempt] = useState(0);
  // Identity is private to this instance. Public annotations are never normalized.
  const emptyAnnotations = useMemo<readonly Annotation[]>(() => Object.freeze([]), []);
  const baseExtensions = useMemo(() => reader.extensions ?? standard(), [reader.extensions]);
  const extensions = useMemo(() => reader.plugins?.length ? [...baseExtensions, ...reader.plugins] : baseExtensions, [baseExtensions, reader.plugins]);
  // A pure presentation plugin never changes the parser session. The engine
  // receives its current view configuration through the regular Reader path.
  const parserExtensions = extensions.filter(hasDocumentSyntax);
  const parserIdentity = useRef(parserExtensions);
  if (parserIdentity.current.length !== parserExtensions.length || parserIdentity.current.some((extension, index) => extension !== parserExtensions[index])) parserIdentity.current = parserExtensions;
  const session = useMemo(() => createDocumentSession({ ...loading, id: reader.documentId ?? `limr-async-${generatedId.replace(/[^a-z\d_-]/gi, '')}`, extensions }), [loading?.registry ? extensions : parserIdentity.current, reader.documentId, loading?.mode, loading?.worker, loading?.fallback, loading?.registry]);
  const state = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getSnapshot);
  const lastLoad = useRef<{ session: typeof session; input: DocumentInput; effectiveInput: DocumentInput; attempt: number } | undefined>(undefined);
  const lastDocument = useRef<{ document: DocumentEngine; input: DocumentInput } | undefined>(undefined);
  // Associate a completed engine with the request that produced it, never the
  // incoming prop which can already refer to the next file before load runs.
  if (state.complete && state.document && lastLoad.current?.session === session) lastDocument.current = { document: state.document, input: lastLoad.current.input };
  const automaticWindowing = useMemo(() => !!state.document && benefitsFromWindowing(state.document.getSnapshot()), [state.document]);
  useEffect(() => {
    const previous = lastLoad.current, current = session.getSnapshot();
    const echoed = previous?.session === session && previous.attempt === attempt && current.complete && typeof input === 'string' && input === current.document?.getSnapshot().source;
    const sameInput = previous?.input === input;
    // A changed parser/worker configuration must parse the latest accepted edit,
    // not rewind to the originally opened Blob. A genuinely new input wins.
    const effectiveInput = sameInput && previous?.session !== session && lastDocument.current?.input === input
      ? lastDocument.current.document.getSnapshot().source
      : sameInput && previous?.attempt !== attempt ? previous!.effectiveInput : input;
    lastLoad.current = { session, input, effectiveInput, attempt };
    if (echoed && current.document) lastDocument.current = { document: current.document, input };
    if (!echoed) void session.load(effectiveInput).catch(() => { /* The subscribed state owns errors. */ });
    // cancel permits StrictMode setup/cleanup/setup and terminates abandoned work.
    return () => session.cancel();
  }, [session, input, attempt]);
  const loadObserver = useRef(onLoadStateChange); loadObserver.current = onLoadStateChange;
  useEffect(() => loadObserver.current?.(state), [state]);
  const retry = () => setAttempt(value => value + 1);
  const chinese = reader.locale?.language?.startsWith('zh');
  const labels = chinese ? { read: '读取文档', parse: '解析文档', index: '建立文档索引', ready: '文档已就绪', error: '文档加载失败', cancelled: '已取消加载', retry: '重试', cancel: '取消', background: '正在继续加载后续内容' }
    : { read: 'Reading document', parse: 'Parsing document', index: 'Indexing document', ready: 'Document ready', error: 'Unable to load document', cancelled: 'Loading cancelled', retry: 'Retry', cancel: 'Cancel', background: 'Loading the rest of the document' };
  const progress = state.progress.total ? Math.min(1, state.progress.loaded / state.progress.total) : undefined;
  const label = state.status === 'error' ? labels.error : state.status === 'cancelled' ? labels.cancelled : labels[state.phase];
  const pending = state.status !== 'ready';
  // Measure the eventual reader's own width while loading. Its first content
  // commit can then use the right TOC/sidebar columns without a second reflow.
  // Normal Reader observers remain responsible for all subsequent changes.
  const shell = useRef<HTMLDivElement>(null), [initialWidth, setInitialWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    const element = shell.current; if (!element) return;
    const measure = () => setInitialWidth(element.clientWidth);
    const observer = new ResizeObserver(measure); observer.observe(element); measure();
    return () => observer.disconnect();
  }, [!!state.document, reader.className, reader.style]);
  const acceptedRequest = lastLoad.current?.session === session && lastLoad.current.input === input && lastLoad.current.attempt === attempt ? lastLoad.current : undefined;
  return <AsyncReaderPositionBoundary session={session} request={acceptedRequest} revision={state.revision} document={state.document} complete={state.complete} publicAnnotations={reader.annotations} injectedAnnotations={!state.complete && reader.annotations === undefined ? emptyAnnotations : undefined}><div className="limr-async-reader" data-limr-theme={reader.theme} data-limr-appearance={reader.appearance}>
    {pending && (loadingFallback ? loadingFallback(state, retry) : <div className="limr-document-loading" data-provisional={!!state.document || undefined} role="status" aria-live="polite">
      <div className="limr-document-loading-label">{state.document ? labels.background : label}</div>
      {state.status === 'error' ? <p>{state.error?.message}</p> : state.status !== 'cancelled' && <progress max={1} value={progress} aria-label={label} />}
      <div className="limr-document-loading-footer"><span>{state.status !== 'error' && state.status !== 'cancelled' && progress !== undefined ? `${Math.round(progress * 100)}%` : ''}</span>
        {state.status === 'error' || state.status === 'cancelled' ? <button type="button" onClick={retry}>{labels.retry}</button> : <button type="button" onClick={session.cancel}>{labels.cancel}</button>}
      </div>
    </div>)}
    {!state.document && <div ref={shell} className={`limr-reader ${reader.className ?? ''}`} style={{ ...reader.style, height: 0, minHeight: 0, visibility: 'hidden', overflow: 'hidden' }} aria-hidden="true" />}
    {state.document && <ReaderInitialWidthContext.Provider value={initialWidth}><AsyncReaderContent {...reader} document={state.document} extensions={extensions} plugins={undefined} readOnly={!state.complete || reader.readOnly} provisional={!state.complete || reader.provisional}
      onSourceChange={state.complete ? reader.onSourceChange : undefined}
      annotations={state.complete ? reader.annotations : reader.annotations ?? emptyAnnotations}
      onAnnotationsChange={state.complete ? reader.onAnnotationsChange : undefined}
      virtualization={reader.virtualization ?? automaticWindowing} /></ReaderInitialWidthContext.Provider>}
  </div></AsyncReaderPositionBoundary>;
}
