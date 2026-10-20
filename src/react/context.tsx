import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useSyncExternalStore, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { Annotation, AnnotationOccurrence, DocumentEngine, DocumentSnapshot, MarkdownNode, SelectionSnapshot } from '../core';
import { ReaderRuntime, Store, type InteractionState } from './runtime';
import type { RendererExtension, RendererParameters, ViewConfiguration } from './types';
import { standard } from '../extensions/standard';
import { captureReadingPosition, restoreReadingPosition } from './reading-position';
import { NodeStateHandoffContext, collectNodeState, inheritNodeState, publishNodeStateHandoff, registerNodeState, type NodeStateOwner } from './node-state-handoff';

import { AsyncHandoffContext, admitAsyncHandoff } from './async-handoff-policy';

let defaults: readonly RendererExtension[] | undefined;
export const RuntimeContext = createContext<ReaderRuntime | null>(null);
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface DocumentProviderProps extends ViewConfiguration {
  source?: string;
  /** Use an existing document, for example one loaded by a DocumentSession.
   * The engine owns its source; source/streaming props are ignored in this mode. */
  document?: DocumentEngine;
  streaming?: boolean;
  documentId?: string;
  children: ReactNode;
}

export function DocumentProvider({ children, source = '', streaming = false, documentId, document: suppliedDocument, ...options }: DocumentProviderProps) {
  const generatedId = useId();
  const extensions = useMemo(() => {
    const base = options.extensions ?? (defaults ??= standard());
    return options.plugins?.length ? [...base, ...options.plugins] : base;
  }, [options.extensions, options.plugins]);
  const config: ViewConfiguration = { ...options, extensions };
  const handoff = useContext(NodeStateHandoffContext);
  const asyncHandoff = useContext(AsyncHandoffContext);
  const runtime = useMemo(() => {
    const next = new ReaderRuntime(suppliedDocument?.id ?? documentId ?? `limr-${generatedId.replace(/[^a-z\d_-]/gi, '')}`, source, streaming, config, suppliedDocument);
    if (handoff && suppliedDocument && handoff.target === suppliedDocument) {
      if (handoff.collect) collectNodeState(next);
      if (handoff.previous) inheritNodeState(next, handoff.previous);
    }
    if (asyncHandoff && suppliedDocument === asyncHandoff.target) admitAsyncHandoff(next, asyncHandoff);
    return next;
  }, [suppliedDocument]);
  useIsomorphicLayoutEffect(() => publishNodeStateHandoff(runtime), [runtime]);
  const previous = useRef({ source, streaming, config, runtime });
  useIsomorphicLayoutEffect(() => {
    const old = previous.current;
    const changed = Object.keys({ ...old.config, ...config }).some(key => old.config[key as keyof ViewConfiguration] !== config[key as keyof ViewConfiguration]);
    if (old.runtime === runtime && changed) runtime.configure(config);
    if (!suppliedDocument && old.runtime === runtime && (old.source !== source || old.streaming !== streaming)) runtime.document.update(source, { streaming });
    previous.current = { source, streaming, config, runtime };
  });
  useEffect(() => { runtime.start(); return () => runtime.dispose(); }, [runtime]);
  return <AsyncHandoffContext.Provider value={null}><NodeStateHandoffContext.Provider value={null}><RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider></NodeStateHandoffContext.Provider></AsyncHandoffContext.Provider>;
}

export function useRuntime(): ReaderRuntime {
  const runtime = useContext(RuntimeContext);
  if (!runtime) throw new Error('This LiMR component needs a DocumentProvider or Reader. Markdown can also be used on its own.');
  return runtime;
}

/** Node-owned UI state survives a virtual block leaving the DOM. Values are
 * collected with their AST node and stay isolated between readers. */
export function useNodeState<T>(node: MarkdownNode, key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  return useNodeStateStore(node, key, initial);
}
/** Internal module declaration. Not exported from the package's public hooks. */
export function useOwnedNodeState<T>(owner: NodeStateOwner, node: MarkdownNode, key: string, initial: T | (() => T)): [T, Dispatch<SetStateAction<T>>] {
  return useNodeStateStore(node, key, initial, owner);
}
function useNodeStateStore<T>(node: MarkdownNode, key: string, initial: T | (() => T), owner?: NodeStateOwner): [T, Dispatch<SetStateAction<T>>] {
  const runtime = useRuntime();
  const store = useMemo(() => {
    let states = runtime.nodeStates.get(node);
    if (!states) { states = new Map(); runtime.nodeStates.set(node, states); }
    let saved = states.get(key);
    if (!saved) { saved = new Store<unknown>(typeof initial === 'function' ? (initial as () => T)() : initial); states.set(key, saved); }
    return saved as Store<T>;
  }, [runtime, key, owner]);
  // A streaming edit may replace the AST node while React keeps this mounted
  // component. Preserve normal useState continuity, and associate the current
  // node with that state for a later virtual unmount/remount.
  let states = runtime.nodeStates.get(node);
  if (!states) { states = new Map(); runtime.nodeStates.set(node, states); }
  states.set(key, store as Store<unknown>);
  if (owner) registerNodeState(runtime, owner, node, key, store as Store<unknown>);
  const value = useStoreSelector(store, state => state);
  const set = useCallback<Dispatch<SetStateAction<T>>>(update => { const previous = store.get(), next = typeof update === 'function' ? (update as (previous: T) => T)(previous) : update; if (Object.is(previous, next)) return; store.set(next); runtime.presentation.set(runtime.presentation.get() + 1); }, [store, runtime]);
  return [value, set];
}

/** Only the requested value is subscribed; changing a parameter never reparses source. */
export function useRendererParameter<K extends keyof RendererParameters>(name: K): RendererParameters[K] {
  const runtime = useRuntime();
  return useStoreSelector(runtime.configuration, config => {
    if (config.parameters?.[name] !== undefined) return config.parameters[name];
    for (let index = (config.extensions?.length ?? 0) - 1; index >= 0; index--) {
      const parameters = config.extensions![index].parameters;
      if (parameters && name in parameters) return parameters[name];
    }
    return undefined as RendererParameters[K];
  });
}

/** Selective subscription: unchanged values do not re-render the subscriber. */
export function useStoreSelector<T, R>(store: { subscribe: (listener: () => void) => () => void; get: () => T }, select: (state: T) => R): R {
  const selectRef = useRef(select);
  selectRef.current = select;
  const cache = useRef<{ state: T; select: typeof select; value: R } | undefined>(undefined);
  const get = useCallback(() => {
    const state = store.get();
    if (cache.current && cache.current.state === state && cache.current.select === selectRef.current) return cache.current.value;
    const value = selectRef.current(state);
    cache.current = { state, select: selectRef.current, value };
    return value;
  }, [store]);
  return useSyncExternalStore(store.subscribe, get, get);
}

export function useDocument(): DocumentSnapshot {
  const runtime = useRuntime();
  return useSyncExternalStore(runtime.document.subscribe, runtime.document.getSnapshot, runtime.document.getSnapshot);
}
export function useDocumentSelector<R>(select: (snapshot: DocumentSnapshot) => R): R {
  const runtime = useRuntime();
  const store = useMemo(() => ({ subscribe: runtime.document.subscribe, get: runtime.document.getSnapshot }), [runtime]);
  return useStoreSelector(store, select);
}
export function useSelection(): SelectionSnapshot | null { return useStoreSelector(useRuntime().interaction, state => state.selection); }
export function useTheme() { return useStoreSelector(useRuntime().configuration, config => config.theme ?? 'light'); }
export function useAppearance() { return useStoreSelector(useRuntime().configuration, config => config.appearance ?? 'classic'); }
export function useLocale() {
  const runtime = useRuntime();
  useStoreSelector(runtime.configuration, config => config.locale);
  return runtime.locale;
}
export function useAnnotation(id: string): Annotation | undefined { return useStoreSelector(useRuntime().decorations, state => state.annotations.get(id)); }
export function useAnnotations() {
  const state = useStoreSelector(useRuntime().decorations, state => state);
  return useMemo(() => ({ annotations: state.annotations, occurrences: state.occurrences }), [state.annotations, state.occurrences]);
}
export function useAnnotationState() {
  const runtime = useRuntime();
  const active = useStoreSelector(runtime.interaction, state => state.active);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered);
  return { active, hovered, activate: (id: string | null) => runtime.activate(id), hover: (id: string | null) => runtime.hover(id) };
}
export function useAnchor(id: string) {
  const runtime = useRuntime();
  useSyncExternalStore(runtime.layout.subscribe, runtime.layout.get, runtime.layout.get);
  useSyncExternalStore(runtime.viewport.subscribe, runtime.viewport.get, runtime.viewport.get);
  const element = runtime.anchors.get(id);
  return { element: element ?? null, rect: element?.getBoundingClientRect() ?? null, contentRect: runtime.content?.getBoundingClientRect() ?? null };
}
export function useLiMR() {
  const runtime = useRuntime();
  // Commands keep stable identities, while controls that query the source
  // capability still refresh when the host enables editing or streaming ends.
  useStoreSelector(runtime.configuration, config => !!config.onSourceChange && !config.readOnly);
  useStoreSelector(runtime.configuration, config => !!config.provisional);
  useDocumentSelector(document => document.streaming);
  return useMemo(() => ({
    ...runtime.commands,
    document: runtime.document,
    get signal() { return runtime.signal; },
    isDocumentComplete: () => !runtime.configuration.get().provisional && !runtime.document.getSnapshot().streaming,
    getReadingPosition: () => captureReadingPosition(runtime),
    restoreReadingPosition: (position: import('./types').ReadingPosition) => restoreReadingPosition(runtime, position),
    clearSelection: () => runtime.clearSelection(),
    /** Send commands to the mounted default or custom search controller. */
    find: (command: 'open' | 'next' | 'previous' | 'close' = 'open') => runtime.searchCommand.set({ command, sequence: runtime.searchCommand.get().sequence + 1 }),
    invalidatePresentation: () => runtime.presentation.set(runtime.presentation.get() + 1),
    preparePrint: (options?: import('./document-print').PreparePrintOptions) => import('./document-print').then(module => module.prepareDocumentPrint(runtime, options)),
    scrollToHeading: (id: string) => runtime.scrollToHeading(id),
    scrollToSource: (range: import('../core').SourceRange) => runtime.scrollToSource(range),
    scrollToAnnotation: (id: string) => runtime.scrollToOccurrence(id),
    invalidateAnnotation: (id: string) => runtime.invalidateAnnotation(id),
  }), [runtime]);
}
