import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ResourceCache } from '../core/cache';
import type { NodeRenderer, NodeRendererProps, RendererExtension, TextToken } from '../react/types';
import { useIsomorphicLayoutEffect, useLocale, useRendererParameter, useRuntime } from '../react/context';
import { CopyButton } from '../components/CopyButton';
import { literalValue } from '../react/literal';
import { transformCode } from './syntax-transforms';
import { CodeViewCache, countCodeLines, type CodeViewState } from './code-view-state';
import { useCodeLayout } from './code-layout';
import { Collapse } from '../components/Collapse';
import { rangeOf } from '../core/tree';
import { registerSourceReveal } from '../react/source-reveal';
import { sourceRangeStartRect } from '../react/source-geometry';
import type { ReaderRuntime } from '../react/runtime';
import { ToolIcon } from '../components/ToolIcon';

const cache = new ResourceCache<readonly TextToken[]>(96);
const views = new WeakMap<ReaderRuntime, CodeViewCache>();
const chunkedRenderers = new WeakSet<NodeRenderer>();
/** Identity proof for the large-block windowing exception. Replacing a
 * component, even on a standard-named extension, cannot inherit this proof. */
export const isChunkedCodeRenderer = (renderer: NodeRenderer | undefined): boolean => !!renderer && chunkedRenderers.has(renderer);
export interface CodeBlockOptions {
  /** Start long blocks folded. Defaults to true; manual folding stays available. */
  autoCollapse?: boolean;
  /** Foldable above this many source lines or wrapped visual rows. Defaults to 20. */
  collapseAfterLines?: number;
  /** Visible rows in a folded block. Defaults to 8. */
  collapsedLines?: number;
  /** Limit expanded height to this many visual rows, then scroll locally.
   * Defaults to false: fully expand and scroll with the document. */
  maxExpandedLines?: number | false;
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
    const total = useMemo(() => countCodeLines(code), [code]);
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
    const shouldCollapse = view.collapsed ?? (!pending && (parameters?.autoCollapse ?? options.autoCollapse ?? true));
    const wrap = view.wrap ?? parameters?.wrap ?? options.wrap ?? false;
    const layout = useCodeLayout({ code, total, preview: previewLines, threshold, wrap, collapsed: shouldCollapse });
    const foldable = total > threshold || layout.visualFoldable;
    const collapsed = foldable && shouldCollapse;
    useEffect(() => {
      const pre = layout.ref.current;
      if (!collapsed || !pre) return;
      let frame = 0;
      const revealSelection = () => {
        const selection = pre.ownerDocument.getSelection();
        if (!selection?.rangeCount || selection.isCollapsed) return;
        const range = selection.getRangeAt(0);
        if (!pre.contains(range.startContainer) || !pre.contains(range.endContainer)) return;
        const target = range.getBoundingClientRect(), bounds = pre.getBoundingClientRect();
        if (target.top >= bounds.top && target.bottom <= bounds.bottom) return;
        // Browser find can select clipped text without scrolling an
        // overflow:hidden preview. Reveal it while retaining native endpoints.
        setView(current => ({ ...current, collapsed: false }));
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (!pre.isConnected || !pre.contains(range.startContainer)) return;
          pre.scrollTop += range.getBoundingClientRect().top - pre.getBoundingClientRect().top - 12;
          pre.scrollIntoView({ block: 'nearest' });
        });
      };
      pre.ownerDocument.addEventListener('selectionchange', revealSelection);
      return () => { pre.ownerDocument.removeEventListener('selectionchange', revealSelection); if (frame && !pre.isConnected) cancelAnimationFrame(frame); };
    }, [collapsed]);
    useIsomorphicLayoutEffect(() => {
      let settled = 0, previous = -1;
      return registerSourceReveal(runtime, rangeOf(node), range => {
        if (range.start !== previous) { previous = range.start; settled = 0; }
        if (collapsed) { setView(current => ({ ...current, collapsed: false })); return true; }
        const pre = layout.ref.current, target = sourceRangeStartRect(runtime, range);
        if (!pre || !target) return false;
        const bounds = pre.getBoundingClientRect(), top = pre.scrollTop, left = pre.scrollLeft;
        if (target.top < bounds.top || target.bottom > bounds.bottom) pre.scrollTop += target.top - bounds.top - 12;
        if (target.left < bounds.left || target.right > bounds.right) pre.scrollLeft += target.left - bounds.left - 24;
        // Arrival must outlive both the height transition and the observer
        // commit that adds line decorations to the newly visible chunk.
        if (Math.abs(top - pre.scrollTop) > .5 || Math.abs(left - pre.scrollLeft) > .5 || pre.getAnimations().some(animation =>
          'transitionProperty' in animation && animation.transitionProperty === 'max-height' && animation.playState === 'running')) settled = 0;
        return ++settled < 3;
      });
    }, [runtime, node, collapsed]);
    const expanded = parameters?.maxExpandedLines ?? options.maxExpandedLines;
    const maxLines = typeof expanded === 'number' && Number.isFinite(expanded) && expanded >= 1
      ? Math.max(previewLines, Math.floor(expanded)) : false;
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
    const chunked = total > 400 || code.length > 50_000;
    const content = useMemo(() => renderValue(tokens, { lines: lineNumbers, chunked }), [renderValue, tokens, lineNumbers, chunked]);
    const foldedText = (locale.foldedCode ?? '{hidden} folded / {total} lines').replace('{hidden}', String(layout.hidden)).replace('{total}', String(total));
    return <div className="limr-code-block" ref={ref} data-collapsed={collapsed || undefined} data-wrap={wrap || undefined} data-line-numbers={lineNumbers || undefined} data-unbounded={maxLines === false || undefined} data-chunked={chunked || undefined}
      style={{ '--limr-code-preview-lines': previewLines, '--limr-code-max-lines': maxLines || undefined } as CSSProperties}>
      <div className="limr-code-header" data-limr-ignore="true"><span>{language}</span><div className="limr-code-actions">
        <button type="button" className="limr-copy-button limr-code-wrap" aria-label={wrapLabel} title={wrapLabel} aria-pressed={wrap} aria-controls={id} onClick={() => update({ wrap: !wrap })}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 6h16M4 11h12a3.5 3.5 0 0 1 0 7h-5m3-3-3 3 3 3M4 16h3" /></svg>
        </button>
        <CopyButton value={code} className="limr-code-copy" />
        {foldable && <button type="button" className="limr-copy-button limr-code-fold" aria-label={foldLabel} title={foldLabel} aria-expanded={!collapsed} aria-controls={id} onClick={() => update({ collapsed: !collapsed })}><ToolIcon name="chevron" /></button>}
      </div></div>
      <div className="limr-code-body"><pre ref={layout.ref} id={id} className={tokens?.length ? 'shiki' : undefined} tabIndex={0}><code>{content}</code></pre></div>
      {foldable && <Collapse open={collapsed} keepMounted className="limr-code-footer">
        <button type="button" data-limr-ignore="true" aria-label={`${foldLabel}: ${foldedText}`} aria-controls={id} tabIndex={collapsed ? 0 : -1} onClick={() => update({ collapsed: false })}>
          <span className="limr-underline">{foldedText}</span><ToolIcon name="chevron" />
        </button>
      </Collapse>}
    </div>;
  }
  chunkedRenderers.add(CodeNode);
  return { name: 'code-highlight', directives: ['code', 'code-highlight'], literal: true, scope: 'local', components: { code: CodeNode }, transform: transformCode,
    virtualization: { code: { copyText: (_node, { value }) => value } } };
}
