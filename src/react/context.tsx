import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { Annotation, AnnotationOccurrence, DocumentEngine, DocumentSnapshot, SelectionSnapshot } from '../core';
import { ReaderRuntime, type Store, type InteractionState } from './runtime';
import type { RendererExtension, ViewConfiguration } from './types';
import { standard } from '../extensions/standard';

let defaults: readonly RendererExtension[] | undefined;
export const RuntimeContext = createContext<ReaderRuntime | null>(null);
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface DocumentProviderProps extends ViewConfiguration {
  source?: string;
  streaming?: boolean;
  documentId?: string;
  children: ReactNode;
}

export function DocumentProvider({ children, source = '', streaming = false, documentId, ...options }: DocumentProviderProps) {
  const generatedId = useId();
  const extensions = useMemo(() => {
    const base = options.extensions ?? (defaults ??= standard());
    return options.plugins?.length ? [...base, ...options.plugins] : base;
  }, [options.extensions, options.plugins]);
  const config: ViewConfiguration = { ...options, extensions };
  const [runtime] = useState(() => new ReaderRuntime(documentId ?? `limr-${generatedId.replace(/[^a-z\d_-]/gi, '')}`, source, streaming, config));
  const previous = useRef({ source, streaming, config });
  useIsomorphicLayoutEffect(() => {
    const old = previous.current;
    const changed = Object.keys({ ...old.config, ...config }).some(key => old.config[key as keyof ViewConfiguration] !== config[key as keyof ViewConfiguration]);
    if (changed) runtime.configure(config);
    if (old.source !== source || old.streaming !== streaming) runtime.document.update(source, { streaming });
    previous.current = { source, streaming, config };
  });
  useEffect(() => { runtime.start(); return () => runtime.dispose(); }, [runtime]);
  return <RuntimeContext.Provider value={runtime}>{children}</RuntimeContext.Provider>;
}

export function useRuntime(): ReaderRuntime {
  const runtime = useContext(RuntimeContext);
  if (!runtime) throw new Error('This LiMR component needs a DocumentProvider or Reader. Markdown can also be used on its own.');
  return runtime;
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
  return useMemo(() => ({
    ...runtime.commands,
    document: runtime.document,
    get signal() { return runtime.signal; },
    clearSelection: () => runtime.clearSelection(),
    scrollToHeading: (id: string) => runtime.scrollToHeading(id),
    scrollToAnnotation: (id: string) => runtime.scrollToOccurrence(id),
    invalidateAnnotation: (id: string) => runtime.invalidateAnnotation(id),
  }), [runtime]);
}
