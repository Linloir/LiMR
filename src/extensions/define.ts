import type { AnnotationType, NodeRenderer, RendererExtension } from '../react/types';
import type { SyntaxExtension } from '../core';

export interface BlockExtensionOptions {
  name: string;
  component: NodeRenderer;
  tags?: readonly string[];
  directives?: readonly string[];
  selection?: 'content' | 'atomic';
}
/** A tag/directive adapter with original source positions and streaming recovery. */
export function defineBlock({ name, component, tags = [name], directives = [name], selection = 'content' }: BlockExtensionOptions): RendererExtension {
  return { name, tags, directives, selection, display: 'block', scope: 'local', components: Object.fromEntries([...new Set([...tags, ...directives])].map(tag => [tag, component])) };
}
export function defineAnnotation<T>(type: AnnotationType<T>): RendererExtension {
  return { name: `annotation:${type.type}`, annotationTypes: [type], scope: 'local' };
}
export function defineExtension(extension: RendererExtension): RendererExtension { return extension; }
