import type { SyntaxExtension } from '../core/types';
import { registerWorkerExtension, type WorkerExtensionRegistry } from '../core/worker-registry';
import { gfm } from './gfm';
import { mathSyntax } from './math-syntax';
import { footnoteSyntax } from './footnote-syntax';
import { inlineHighlightSyntax } from './inline-highlight-syntax';
import { sourceAnnotationSyntax } from './source-annotation-syntax';
import { transformCallout, transformCitation, transformCode, transformFigures, transformMermaid } from './syntax-transforms';

const transforms: Readonly<Record<string, SyntaxExtension['transform']>> = { callout: transformCallout, citation: transformCitation, 'code-highlight': transformCode, figures: transformFigures, mermaid: transformMermaid };
const syntaxFactories: Readonly<Record<string, () => SyntaxExtension>> = { gfm, math: mathSyntax, footnotes: footnoteSyntax, 'inline-highlights': inlineHighlightSyntax, 'source-annotations': sourceAnnotationSyntax };
/** DOM-free standard grammar. Renderer factories and browser resource loaders
 * never enter the parser worker's dependency graph. */
export const standardWorkerRegistry: WorkerExtensionRegistry = {
  'limr/standard': options => {
    const declaration = options as SyntaxExtension;
    const base = syntaxFactories[declaration.name]?.();
    return { ...declaration, ...base, ...(transforms[declaration.name] ? { transform: transforms[declaration.name] } : {}) };
  },
};
const standardRenderers = new WeakMap<SyntaxExtension, Readonly<Record<string, unknown>>>();
export function standardRendererIsUnchanged(extension: SyntaxExtension): boolean {
  const original = standardRenderers.get(extension), current = (extension as SyntaxExtension & {components?: Record<string, unknown>}).components ?? {};
  return !!original && Object.keys(original).length === Object.keys(current).length && Object.keys(original).every(key => original[key] === current[key]);
}
/** Only standard() calls this for its freshly constructed default modules.
 * Custom options or replacement functions require an explicit registration. */
export function registerStandardSyntax<T extends SyntaxExtension>(extension: T): T {
  standardRenderers.set(extension, { ...(extension as T & { components?: Record<string, unknown> }).components });
  const { name, tags, directives, literal, selection, display, scope } = extension;
  return registerWorkerExtension(extension, { id: 'limr/standard', options: { name, tags, directives, literal, selection, display, scope } });
}
