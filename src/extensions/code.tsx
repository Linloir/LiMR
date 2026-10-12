import { useEffect, useRef, useState } from 'react';
import { ResourceCache } from '../core/cache';
import type { NodeRendererProps, RendererExtension, TextToken } from '../react/types';
import { useRuntime } from '../react/context';
import { CopyButton } from '../components/CopyButton';
import { literalValue } from '../react/literal';

const cache = new ResourceCache<readonly TextToken[]>(96);
export interface CodeHighlightOptions { languages?: readonly string[]; lightTheme?: string; darkTheme?: string; eager?: boolean; maxLength?: number }
const aliases: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', yml: 'yaml', md: 'markdown', rs: 'rust', 'c++': 'cpp', text: 'text', txt: 'text' };

export function codeHighlight(options: CodeHighlightOptions = {}): RendererExtension {
  function CodeNode({ node, pending, renderValue }: NodeRendererProps) {
    const runtime = useRuntime();
    const code = literalValue(node);
    const language = String(node.lang ?? 'text').toLowerCase();
    const normalized = aliases[language] ?? language;
    const [result, setResult] = useState<{ code: string; tokens: readonly TextToken[] } | null>(null);
    const [visible, setVisible] = useState(options.eager ?? false);
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (visible) return;
      if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
      }, { root: runtime.configuration.get().scrollRoot, rootMargin: '400px' });
      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [visible, runtime]);
    useEffect(() => {
      if (!visible || code.length > (options.maxLength ?? 100_000)) return;
      let disposed = false;
      let release: (() => void) | undefined;
      // A growing fence stays readable without re-highlighting its entire history
      // for every token. The final tree is highlighted as soon as it settles.
      const timer = setTimeout(() => {
        if (normalized === 'text' || options.languages && !options.languages.includes(normalized)) return;
        const request = cache.acquire(JSON.stringify([code, normalized, options.lightTheme, options.darkTheme]), async () => {
          const shiki = await import('shiki');
          if (!(normalized in shiki.bundledLanguages) && !(normalized in shiki.bundledLanguagesAlias)) return [];
          const result = await shiki.codeToTokens(code, { lang: normalized as import('shiki').BundledLanguage, themes: { light: options.lightTheme ?? 'github-light', dark: options.darkTheme ?? 'github-dark' }, defaultColor: false });
          let offset = 0;
          return result.tokens.flatMap((line, index) => {
            const tokens: TextToken[] = line.map(token => { const start = offset; offset += token.content.length; return { content: token.content, offset: start, style: token.htmlStyle }; });
            if (index < result.tokens.length - 1) {
              tokens.push({ content: '\n', offset: offset++ });
            }
            return tokens;
          });
        });
        release = request.release;
        request.promise.then(tokens => { if (!disposed) setResult({ code, tokens }); }).catch(() => { /* Plain source is a usable fallback. */ });
      }, pending ? 180 : 0);
      return () => { disposed = true; clearTimeout(timer); release?.(); };
    }, [code, normalized, pending, visible]);
    const tokens = result?.code === code ? result.tokens : undefined;
    return <div className="limr-code-block" ref={ref}>
      <div className="limr-code-header" data-limr-ignore="true"><span>{language}</span><CopyButton value={code} /></div>
      <pre className={tokens?.length ? 'shiki' : undefined}><code>{renderValue(tokens)}</code></pre>
    </div>;
  }
  return { name: 'code-highlight', scope: 'local', components: { code: CodeNode } };
}
