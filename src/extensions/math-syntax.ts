import { math as syntax } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import { tableLocalSyntax } from '../core/incremental-table';
import type { SyntaxExtension } from '../core/types';
import { literalDirective } from './literal-directive';
export function mathSyntax(): SyntaxExtension {
  return { name: 'math', directives: ['math'], literal: true, micromark: [tableLocalSyntax(syntax())], mdast: [tableLocalSyntax(mathFromMarkdown())], scope: 'local', transform: (root, context) => literalDirective(root, context.source, 'math') };
}
