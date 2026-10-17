import { registerStandardSyntax } from './worker-syntax';
import { gfm } from './gfm';
import { math } from './math';
import { codeHighlight } from './code';
import { citation } from './annotations';
import { translations } from './translations';
import { mermaid } from './mermaid';
import { callout } from './callout';
import { inlineHighlights } from './inline-highlights';
import { footnotes } from './footnotes';
import { sourceAnnotations } from './source-annotations';
import { definition, extras, figures, question, video } from './blocks';
import type { RendererExtension } from '../react/types';

/** LiMR's default capabilities. Every item uses the public extension contract. */
export function standard(): RendererExtension[] { return [gfm(), math(), codeHighlight(), mermaid(), callout(), definition(), question(), extras(), video(), figures(), citation(), translations(), inlineHighlights(), footnotes(), sourceAnnotations()].map(registerStandardSyntax); }
