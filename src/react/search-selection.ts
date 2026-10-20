import type { ReaderRuntime } from './runtime';
import { windowedReadingText } from './windowed-copy';

/** Only the live document selection can seed find. A retained toolbar snapshot
 * or the search field's own selected value must not replace a newer query. */
export function selectedSearchText(runtime: ReaderRuntime): string {
  const content = runtime.content, document = content?.ownerDocument;
  if (!content || !document) return '';
  if (document.activeElement?.closest('input,textarea,[contenteditable="true"]')) return '';
  const native = document.getSelection();
  if (!native?.rangeCount || native.isCollapsed || !content.contains(native.anchorNode) || !content.contains(native.focusNode)) return '';
  const captured = runtime.interaction.get().selection, range = runtime.selectionRange, current = native.getRangeAt(0);
  const sameSelection = range && range.startContainer === current.startContainer && range.startOffset === current.startOffset
    && range.endContainer === current.endContainer && range.endOffset === current.endOffset;
  // Virtual selections can span unmounted content. Atomic copy text can contain
  // Markdown delimiters; search needs the same plain projection as its matcher.
  if (captured && sameSelection && (runtime.virtualSelection || captured.quality === 'atomic'))
    return windowedReadingText(runtime, captured.raw.ranges).trim();
  return native.toString().trim();
}
