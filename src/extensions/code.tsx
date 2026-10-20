import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResourceCache } from '../core/cache';
import type { NodeRendererProps, RendererExtension, TextToken } from '../react/types';
import { useIsomorphicLayoutEffect, useLocale, useRendererParameter, useRuntime } from '../react/context';
import { CopyButton } from '../components/CopyButton';
import { literalValue } from '../react/literal';
import { transformCode } from './syntax-transforms';
import { CodeViewCache, exceedsCodeLines, type CodeViewState } from './code-view-state';
import type { ReaderRuntime } from '../react/runtime';
import { ToolIcon } from '../components/ToolIcon';

const cache = new ResourceCache<readonly TextToken[]>(96);
const views = new WeakMap<ReaderRuntime, CodeViewCache>();
export interface CodeBlockOptions {
  /** Start long blocks folded. Defaults to true; manual folding stays available. */
  autoCollapse?: boolean;
  /** Foldable when source line count exceeds this number. Defaults to 20. */
  collapseAfterLines?: number;
  /** Visible rows in a folded block. Defaults to 8. */
  collapsedLines?: number;
  /** Initial soft wrapping. Defaults to false. */
  wrap?: boolean;
  /** Show source line numbers, excluding them from selection/copy. Defaults to false. */
  lineNumbers?: boolean;
}
export interface CodeHighlightOptions extends CodeBlockOptions { languages?: readonly string[]; lightTheme?: string; darkTheme?: string; eager?: boolean; maxLength?: number }
declare module '@linloir/limr' {
  interface RendererParameters {
    /** Code presentation defaults. Per-block user choices survive virtual unmounts
     * in a reader-local cache of the 256 most recently used modified blocks. */
    codeBlock?: CodeBlockOptions;
  }
}
const positiveLines = (value: number | undefined, fallback: number) => typeof value === 'number' && Number.isFinite(value) && value >= 1 ? Math.floor(value) : fallback;
const aliases: Record<string, string> = { js: 'javascript', ts: 'typescript', py: 'python', sh: 'bash', yml: 'yaml', md: 'markdown', rs: 'rust', 'c++': 'cpp', text: 'text', txt: 'text' };

export function codeHighlight(options: CodeHighlightOptions = {}): RendererExtension {
  function CodeNode({ node, pending, renderValue }: NodeRendererProps) {
    const runtime = useRuntime();
    const locale = useLocale(), id = useId();
    const parameters = useRendererParameter('codeBlock');
    const threshold = positiveLines(parameters?.collapseAfterLines ?? options.collapseAfterLines, 20);
    const previewLines = Math.min(threshold, positiveLines(parameters?.collapsedLines ?? options.collapsedLines, 8));
    const code = useMemo(() => literalValue(node), [node]);
    const foldable = useMemo(() => exceedsCodeLines(code, threshold), [code, threshold]);
    const viewCache = useMemo(() => {
      let saved = views.get(runtime);
      if (!saved) { saved = new CodeViewCache(); views.set(runtime, saved); }
      return saved;
    }, [runtime]);
    const [view, setView] = useState<CodeViewState>(() => viewCache.get(node) ?? {});
    useIsomorphicLayoutEffect(() => { viewCache.set(node, view); }, [node, view, viewCache]);
    const update = (patch: CodeViewState) => {
      setView(current => ({ ...current, ...patch }));
    };
    // An unclosed streaming fence remains readable as it grows. An explicit
    // user choice still wins; the default applies when the block is complete.
    const collapsed = foldable && (view.collapsed ?? (!pending && (parameters?.autoCollapse ?? options.autoCollapse ?? true)));
    const wrap = view.wrap ?? parameters?.wrap ?? options.wrap ?? false;
    const lineNumbers = parameters?.lineNumbers ?? options.lineNumbers ?? false;
    useIsomorphicLayoutEffect(() => { runtime.requestLayout(); }, [collapsed, wrap, lineNumbers, runtime]);
    const foldLabel = collapsed ? locale.expandCode ?? 'Expand code' : locale.collapseCode ?? 'Collapse code';
    const wrapLabel = wrap ? locale.unwrapCode ?? 'Disable code wrapping' : locale.wrapCode ?? 'Wrap code';
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
      if (!visible || pending || code.length > (options.maxLength ?? 100_000)) return;
      let disposed = false;
      let release: (() => void) | undefined;
      let waiting: (() => void) | undefined;
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
        request.promise.then(tokens => {
          const apply = () => {
            if (disposed) return;
            const selection = ref.current?.ownerDocument.getSelection();
            if (selection && !selection.isCollapsed && selection.rangeCount && ref.current && selection.getRangeAt(0).intersectsNode(ref.current)) {
              if (!waiting) { waiting = apply; document.addEventListener('selectionchange', waiting); }
              return;
            }
            if (waiting) { document.removeEventListener('selectionchange', waiting); waiting = undefined; }
            setResult({ code, tokens });
          };
          apply();
        }).catch(() => { /* Plain source is a usable fallback. */ });
      }, 0);
      return () => { disposed = true; clearTimeout(timer); release?.(); if (waiting) document.removeEventListener('selectionchange', waiting); };
    }, [code, normalized, pending, visible]);
    const tokens = result?.code === code ? result.tokens : undefined;
    const content = useMemo(() => renderValue(tokens, { lines: lineNumbers }), [renderValue, tokens, lineNumbers]);
    return <div className="limr-code-block" ref={ref} data-collapsed={collapsed || undefined} data-wrap={wrap || undefined} data-line-numbers={lineNumbers || undefined}
      style={{ '--limr-code-preview-lines': previewLines } as CSSProperties}>
      <div className="limr-code-header" data-limr-ignore="true"><span>{language}</span><div className="limr-code-actions">
        <button type="button" className="limr-copy-button limr-code-wrap" aria-label={wrapLabel} title={wrapLabel} aria-pressed={wrap} aria-controls={id} onClick={() => update({ wrap: !wrap })}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 11h12a3.5 3.5 0 0 1 0 7h-5m3-3-3 3 3 3M4 16h3" /></svg>
        </button>
        <CopyButton value={code} className="limr-code-copy" />
        {foldable && <button type="button" className="limr-copy-button limr-code-fold" aria-label={foldLabel} title={foldLabel} aria-expanded={!collapsed} aria-controls={id} onClick={() => update({ collapsed: !collapsed })}><ToolIcon name="chevron" /></button>}
      </div></div>
      <pre id={id} className={tokens?.length ? 'shiki' : undefined}><code>{content}</code></pre>
    </div>;
  }
  return { name: 'code-highlight', directives: ['code', 'code-highlight'], literal: true, scope: 'local', components: { code: CodeNode }, transform: transformCode };
}
