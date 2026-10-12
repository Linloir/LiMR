import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { autoUpdate, flip, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react';
import { useRuntime, useSelection, useStoreSelector, useTheme } from '../react/context';
import type { ActionContext, SelectionAction } from '../react/types';

export interface SelectionToolbarProps {
  actions?: readonly SelectionAction[];
  portalRoot?: HTMLElement | null;
  render?: (props: { context: ActionContext; actions: readonly SelectionAction[]; run: (action: SelectionAction) => Promise<void> }) => ReactNode;
}
export function SelectionToolbar({ actions = [], portalRoot, render }: SelectionToolbarProps) {
  const runtime = useRuntime();
  const theme = useTheme();
  const selection = useSelection();
  const extensions = useStoreSelector(runtime.configuration, config => config.extensions);
  const combined = useMemo(() => {
    const map = new Map((extensions ?? []).flatMap(extension => [...extension.actions ?? []]).map(action => [action.id, action]));
    actions.forEach(action => map.set(action.id, action));
    return [...map.values()];
  }, [extensions, actions]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const context: ActionContext | null = selection ? { ...runtime.commands, selection, document: runtime.document.getSnapshot(), signal: runtime.signal, clearSelection: () => runtime.clearSelection() } : null;
  const available = context ? combined.filter(action => action.visible?.(context) ?? true) : [];
  const open = !!context && selection!.settled && available.length > 0;
  const { refs, floatingStyles } = useFloating({ open, strategy: 'fixed', placement: 'top', middleware: [offset(10), flip({ padding: 10 }), shift({ padding: 10 })], whileElementsMounted: autoUpdate });
  useEffect(() => {
    const range = runtime.selectionRange;
    if (range) refs.setPositionReference({ getBoundingClientRect: () => range.getBoundingClientRect(), getClientRects: () => range.getClientRects(), contextElement: runtime.content ?? undefined });
  }, [runtime, refs, selection]);
  useEffect(() => setError(null), [selection]);
  const run = async (action: SelectionAction) => {
    if (!context || busy || action.disabled?.(context)) return;
    const captured = context;
    setBusy(action.id); setError(null);
    try { await action.run?.(captured); }
    catch (cause) { if (!runtime.signal.aborted) setError(cause instanceof Error ? cause.message : String(cause)); }
    finally { if (!runtime.signal.aborted) setBusy(null); }
  };
  if (!open || !context) return null;
  return <FloatingPortal root={portalRoot}><div ref={refs.setFloating} className="limr-selection-toolbar" style={floatingStyles} role="toolbar" aria-label="Text actions" data-limr-selection-ui="true" data-limr-theme={theme}
    onMouseDown={event => { if (!(event.target instanceof Element) || !event.target.closest('input,textarea,select')) event.preventDefault(); }}
    onKeyDown={event => {
      if (event.key === 'Escape') { runtime.clearSelection(); return; }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
      const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
      buttons[(current + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length]?.focus(); event.preventDefault();
    }}>
    {render ? render({ context, actions: available, run }) : available.map(action => action.render ? <span key={action.id}>{action.render({ ...context, busy: busy === action.id })}</span> : <button key={action.id} type="button" disabled={!!busy || action.disabled?.(context)} onClick={() => void run(action)} aria-busy={busy === action.id}>{action.icon}{action.label}</button>)}
    {error && <span role="alert" className="limr-action-error">{error}</span>}
  </div></FloatingPortal>;
}
