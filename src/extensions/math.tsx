import { lazy, Suspense, type ComponentType } from 'react';
import { math as syntax } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import type { KatexOptions } from 'katex';
import type { NodeRendererProps, RendererExtension } from '../react/types';
import { CopyButton } from '../components/CopyButton';

let loaded: ComponentType<{ value: string; display: boolean; options: MathOptions }> | undefined;
let loading: Promise<typeof import('./math-renderer')> | undefined;
const load = () => loading ??= import('./math-renderer').then(module => { loaded = module.default; return module; });
const MathContent = lazy(load);
/** Optional: await before synchronous server rendering to include formula HTML. */
export async function preloadMath(): Promise<void> { await load(); }
export interface MathOptions { macros?: Record<string, string>; strict?: KatexOptions['strict'] }

export function math(options: MathOptions = {}): RendererExtension {
  function MathNode({ node }: NodeRendererProps) {
    const display = node.type === 'math';
    const fallback = <code className="limr-math-source">{node.value}</code>;
    const Renderer = loaded ?? MathContent;
    const content = <Suspense fallback={fallback}><Renderer value={node.value ?? ''} display={display} options={options} /></Suspense>;
    return display ? <div className="limr-math-block">{content}<CopyButton className="limr-math-copy" variant="glass" label="Copy LaTeX" value={`$$\n${node.value ?? ''}\n$$`} /></div> : content;
  }
  return { name: 'math', micromark: [syntax()], mdast: [mathFromMarkdown()], scope: 'local', components: { math: MathNode, inlineMath: MathNode } };
}
