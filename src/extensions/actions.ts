import type { SelectionAction } from '../react/types';

export function copyText(options: { label?: string; format?: 'text' | 'raw' | 'syntax' | 'blocks' } = {}): SelectionAction {
  return {
    id: `copy-${options.format ?? 'text'}`, label: options.label ?? 'Copy',
    run: async ({ selection }) => { const format = options.format ?? 'text'; await navigator.clipboard.writeText(format === 'text' ? selection.text : selection[format].sourceText); },
  };
}

export function highlightSelection(options: { label?: string; color?: string; style?: 'background' | 'underline' | 'dotted' | 'wavy' } = {}): SelectionAction {
  return {
    id: 'highlight', label: options.label ?? 'Highlight',
    run: ({ selection, addHighlight }) => { for (const range of selection.raw.ranges) addHighlight({ id: `highlight-${crypto.randomUUID()}`, range, color: options.color, style: options.style }); },
  };
}
