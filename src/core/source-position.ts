import type { ParseContext } from './types';
import { lineStarts } from './tree';

// Internal sharing only: public source points remain independent mutable
// objects, while transforms reuse the engine's already-built line index.
const indexes = new WeakMap<ParseContext, { source: string; lines: readonly number[] }>();

export function rememberSourceLines(context: ParseContext, lines: readonly number[]): void {
  indexes.set(context, { source: context.source, lines });
}

export function sourceLines(context: ParseContext): readonly number[] {
  const index = indexes.get(context);
  if (index?.source === context.source) return index.lines;
  const lines = lineStarts(context.source);
  rememberSourceLines(context, lines);
  return lines;
}
