import type { CSSProperties } from 'react';

/** Keep native outside markers inside the reader's clipped content column.
 * Size in the list's own font so large text and nested lists retain a gutter. */
export function orderedListStyle(start: number, count: number): CSSProperties {
  const end = start + Math.max(0, count - 1);
  const digits = Math.max(String(start).length, String(end).length);
  return { '--limr-list-marker-width': `${digits}ch` } as CSSProperties;
}
