import { inlineHighlightSyntax } from './inline-highlight-syntax';
import { rangeOf, type Annotation, type HighlightData, type MarkdownNode, type SourceRange } from '../core';
import type { NodeRenderer, RendererExtension } from '../react/types';
import { point, sliceChildren, textTokens } from './inline-source';

export interface InlineHighlightOptions { color?: string; component?: NodeRenderer }
const Content: NodeRenderer = ({ children }) => <>{children}</>;

/** Markdown-authored highlights share the normal paint/hover/copy machinery,
 * while their source remains the authority for editing. */
export function inlineHighlights(options: InlineHighlightOptions = {}): RendererExtension {
  return { ...inlineHighlightSyntax(options), components: { embeddedHighlight: options.component ?? Content } };
}
