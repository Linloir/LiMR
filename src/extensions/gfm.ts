import { gfm as syntax } from 'micromark-extension-gfm';
import { gfmFromMarkdown } from 'mdast-util-gfm';
import type { RendererExtension } from '../react/types';

export function gfm(): RendererExtension { return { name: 'gfm', directives: ['gfm'], micromark: [syntax()], mdast: gfmFromMarkdown(), scope: 'local', components: { gfm: ({ children }) => children } }; }
