import type { ReaderRuntime } from './runtime';

const owners = new WeakMap<Document, HTMLElement>();
/** Remember the last reader deliberately addressed by the pointer. A page or
 * another reader selection always wins over this remembered owner. */
export function rememberReaderOwner(runtime: ReaderRuntime, target: EventTarget | null) {
  const content = runtime.content; if (!content || !(target instanceof Node)) return;
  const shell = content.closest('.limr-reader') ?? content;
  if (shell.contains(target)) owners.set(content.ownerDocument, content);
  else if (owners.get(content.ownerDocument) === content) owners.delete(content.ownerDocument);
}
export function ownsReaderInteraction(runtime: ReaderRuntime): boolean {
  const content = runtime.content; if (!content) return false;
  const doc = content.ownerDocument, selection = doc.getSelection();
  if (selection && !selection.isCollapsed && selection.anchorNode) return content.contains(selection.anchorNode) && !!selection.focusNode && content.contains(selection.focusNode);
  const active = doc.activeElement;
  if (active && active !== doc.body) {
    const owner = active.closest('[data-limr-document]') ?? active.closest('.limr-reader')?.querySelector('[data-limr-document]');
    if (owner) return owner === content;
    return false;
  }
  const remembered = owners.get(doc);
  if (remembered?.isConnected) return remembered === content;
  return doc.querySelectorAll('[data-limr-document]').length === 1;
}
