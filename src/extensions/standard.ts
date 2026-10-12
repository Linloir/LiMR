import { gfm } from './gfm';
import { math } from './math';
import { codeHighlight } from './code';
import { citation } from './annotations';
import { definition, extras, figures, question, video } from './blocks';
import type { RendererExtension } from '../react/types';

/** LiMR's default capabilities. Every item uses the public extension contract. */
export function standard(): RendererExtension[] { return [gfm(), math(), codeHighlight(), definition(), question(), extras(), video(), figures(), citation()]; }
