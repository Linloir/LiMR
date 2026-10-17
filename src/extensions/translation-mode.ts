import type { MarkdownNode } from '../core';

export type TranslationMode = 'origin' | 'translation' | 'both';
export const translationModes: readonly TranslationMode[] = ['origin', 'translation', 'both'];

/** One precedence rule for the mounted view and the complete reading projection. */
export function resolveTranslationMode(node: MarkdownNode, local: unknown, global: unknown, perNode: unknown, fallback: TranslationMode = 'origin'): TranslationMode {
  const value = perNode ?? global ?? local ?? node.attributes?.default ?? fallback;
  return translationModes.includes(value as TranslationMode) ? value as TranslationMode : fallback;
}
