import { useEffect, useState, type ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Profile } from '../options';

// react-markdown delegates rich features to plugins/components. This explicit
// integration uses the same Shiki themes as LiMR; it is not the bare default.
function Highlight({ children }: ComponentProps<'pre'>) {
  const [html, setHtml] = useState('');
  const child = children as { props?: { children?: string; className?: string } };
  const source = String(child?.props?.children ?? '');
  const lang = /language-(\S+)/.exec(child?.props?.className ?? '')?.[1] ?? 'text';
  useEffect(() => {
    let active = true;
    void import('shiki').then(shiki => shiki.codeToHtml(source, { lang, themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false })).then(value => { if (active) setHtml(value); });
    return () => { active = false; };
  }, [source, lang]);
  return <div className="comparison-code">{html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : <pre>{children}</pre>}</div>;
}
const richComponents = { pre: Highlight };
export function render(source: string, _streaming: boolean, profile: Profile) {
  return <article className="comparison-prose"><ReactMarkdown remarkPlugins={profile === 'default' ? [remarkGfm, remarkMath] : [remarkGfm]}
    rehypePlugins={profile === 'default' ? [rehypeKatex] : []} components={profile === 'default' ? richComponents : undefined}>{source}</ReactMarkdown></article>;
}
export async function styles() { await import('katex/dist/katex.min.css'); }
