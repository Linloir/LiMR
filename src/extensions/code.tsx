import { useEffect, useRef, useState } from 'react';
import { ResourceCache } from '../core/cache';
import type { NodeRendererProps, RendererExtension } from '../react/types';
import { useRuntime } from '../react/context';

const cache = new ResourceCache<string>(96);
export interface CodeHighlightOptions { languages?: readonly string[]; lightTheme?: string; darkTheme?: string; eager?: boolean; maxLength?: number }
const aliases: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', yml: 'yaml', md: 'markdown', rs: 'rust', 'c++': 'cpp', text: 'text', txt: 'text' };

export function codeHighlight(options: CodeHighlightOptions = {}): RendererExtension {
  function CodeNode({ node, pending }: NodeRendererProps) {
    const runtime = useRuntime();
    const code = node.value ?? '';
    const language = String(node.lang ?? 'text').toLowerCase();
    const normalized = aliases[language] ?? language;
    const [result, setResult] = useState<{ code: string; html: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
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
          if (!(normalized in shiki.bundledLanguages) && !(normalized in shiki.bundledLanguagesAlias)) return '';
          return shiki.codeToHtml(code, { lang: normalized, themes: { light: options.lightTheme ?? 'github-light', dark: options.darkTheme ?? 'github-dark' }, defaultColor: false });
        });
        release = request.release;
        request.promise.then(html => { if (!disposed) setResult({ code, html }); }).catch(() => { /* Plain source is a usable fallback. */ });
      }, pending ? 180 : 0);
      return () => { disposed = true; clearTimeout(timer); release?.(); };
    }, [code, normalized, pending, visible]);
    useEffect(() => { if (!copied) return; const id = setTimeout(() => setCopied(false), 1400); return () => clearTimeout(id); }, [copied]);
    const html = result?.code === code ? result.html : '';
    return <div className="limr-code-block" ref={ref}>
      <div className="limr-code-header" data-limr-ignore="true"><span>{language}</span><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(code); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}>{copied ? runtime.locale.copied : runtime.locale.copy}</button>{copyError && <span role="status">{runtime.locale.unavailable}</span>}</div>
      {html ? <div className="limr-code-highlight" dangerouslySetInnerHTML={{ __html: html }} /> : <pre><code>{code}</code></pre>}
    </div>;
  }
  return { name: 'code-highlight', scope: 'local', components: { code: CodeNode } };
}
