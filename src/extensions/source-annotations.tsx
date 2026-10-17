import type { RendererExtension } from '../react/types';
import { sourceAnnotationSyntax } from './source-annotation-syntax';
import { editSourceAnnotations } from './source-annotation-editing';

/** Paired source ranges and their module-owned editing contract. */
export function sourceAnnotations(): RendererExtension {
  return { ...sourceAnnotationSyntax(), sourceEditing: { annotations: editSourceAnnotations } };
}
