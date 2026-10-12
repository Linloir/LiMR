import { useState } from 'react';
import { defineBlock } from './define';
import { rangeOf, safeUrl, textContent, walk } from '../core/tree';
import { useRuntime } from '../react/context';
import type { MarkdownNode } from '../core';
import type { NodeRenderer, NodeRendererProps, RendererExtension } from '../react/types';

function parts(node: MarkdownNode, name: string): MarkdownNode[] {
  const result: MarkdownNode[] = [];
  walk(node, child => { if (child !== node && child.name === name) result.push(child); });
  return result;
}
const PassThrough: NodeRenderer = ({ children }) => <>{children}</>;
export function definition(options: { component?: NodeRenderer } = {}): RendererExtension {
  function Definition({ node, children, renderChildren }: NodeRendererProps) {
    const runtime = useRuntime();
    const title = parts(node, 'title')[0];
    const content = parts(node, 'content')[0];
    return <aside className="limr-definition">
      <div className="limr-card-label" data-limr-ignore="true">{runtime.locale.definition}</div>
      {(title || node.attributes?.title) && <div className="limr-definition-title">{title ? renderChildren(title.children ?? []) : String(node.attributes?.title)}</div>}
      <div>{content ? renderChildren(content.children ?? []) : children}</div>
    </aside>;
  }
  return { ...defineBlock({ name: 'definition', component: options.component ?? Definition }), tags: ['definition', 'title', 'content'], components: { definition: options.component ?? Definition, title: PassThrough, content: PassThrough } };
}

export function question(options: { component?: NodeRenderer } = {}): RendererExtension {
  function Question({ node, children, renderChildren }: NodeRendererProps) {
    const runtime = useRuntime();
    const [showHint, setHint] = useState(false), [showAnswer, setAnswer] = useState(false);
    const [selected, setSelected] = useState<number[]>([]), [checked, setChecked] = useState(false);
    const content = parts(node, 'question-content')[0];
    const hint = parts(node, 'question-hint')[0];
    const answer = parts(node, 'question-answer')[0];
    const group = parts(node, 'question-sel-grp')[0];
    const selections = parts(node, 'question-sel');
    const multi = String(group?.attributes?.multi ?? node.attributes?.multi ?? 'false') === 'true';
    let correct: number[] = [];
    try { const value = JSON.parse(String(group?.attributes?.answer ?? node.attributes?.answer ?? '[]')); correct = (Array.isArray(value) ? value : [value]).map(Number); } catch { /* Missing answers still allow a practice question. */ }
    const success = correct.length === selected.length && correct.every(index => selected.includes(index));
    return <section className="limr-question">
      {node.attributes?.title && <div className="limr-question-title">{String(node.attributes.title)}</div>}
      <div>{content ? renderChildren(content.children ?? []) : !selections.length && !hint && !answer ? children : null}</div>
      {selections.length > 0 && <fieldset className="limr-question-options"><legend className="limr-sr-only">{String(node.attributes?.title ?? 'Question')}</legend>{selections.map((selection, index) => <label key={index}>
        <input type={multi ? 'checkbox' : 'radio'} name={`${runtime.document.id}-question-${rangeOf(node).start}`} checked={selected.includes(index)} onChange={() => { setChecked(false); setSelected(multi ? selected.includes(index) ? selected.filter(item => item !== index) : [...selected, index] : [index]); }} />
        <span>{renderChildren(selection.children ?? [])}</span>
      </label>)}</fieldset>}
      <div className="limr-question-actions" data-limr-ignore="true">
        {hint && <button type="button" aria-expanded={showHint} onClick={() => setHint(!showHint)}>{runtime.locale.hint}</button>}
        {selections.length > 0 && correct.length > 0 && <button type="button" disabled={!selected.length} onClick={() => { setChecked(true); if (success) setAnswer(true); }}>{runtime.locale.submit}</button>}
        {answer && <button type="button" aria-expanded={showAnswer} onClick={() => setAnswer(!showAnswer)}>{runtime.locale.answer}</button>}
        {checked && <span role="status" className={success ? 'limr-success' : 'limr-error'}>{success ? runtime.locale.correct : runtime.locale.incorrect}</span>}
      </div>
      {showHint && hint && <div className="limr-question-detail">{renderChildren(hint.children ?? [])}</div>}
      {showAnswer && answer && <div className="limr-question-detail">{renderChildren(answer.children ?? [])}</div>}
    </section>;
  }
  const names = ['question-content', 'question-hint', 'question-answer', 'question-sel-grp', 'question-sel'];
  return { ...defineBlock({ name: 'question', component: options.component ?? Question }), tags: ['question', ...names], components: { question: options.component ?? Question, ...Object.fromEntries(names.map(name => [name, PassThrough])) } };
}

export function extras(options: { component?: NodeRenderer } = {}): RendererExtension {
  const Extra: NodeRenderer = ({ node, children }) => <div className="limr-extra">
    <a href={safeUrl(node.attributes?.url)} target="_blank" rel="noreferrer">{String(node.attributes?.title ?? node.attributes?.url ?? '')}</a>
    {node.attributes?.desc && <p>{String(node.attributes.desc)}</p>}{children}
  </div>;
  const Extras: NodeRenderer = ({ children }) => { const runtime = useRuntime(); return <aside className="limr-extras"><div className="limr-card-label" data-limr-ignore="true">{runtime.locale.extra}</div>{children}</aside>; };
  return { ...defineBlock({ name: 'extras', component: options.component ?? Extras }), tags: ['extras', 'extra'], components: { extras: options.component ?? Extras, extra: Extra } };
}

export function video(options: { component?: NodeRenderer; resolveUrl?: (provider: string, url: string) => string | undefined } = {}): RendererExtension {
  function Video({ node }: NodeRendererProps) {
    const runtime = useRuntime();
    const [playing, setPlaying] = useState(false);
    const provider = String(node.attributes?.provider ?? 'native');
    const source = String(node.attributes?.url ?? node.attributes?.src ?? '');
    let url = options.resolveUrl?.(provider, source);
    if (!url) {
      try {
        const parsed = new URL(source);
        if (provider === 'youtube' && /^(?:www\.)?(?:youtube\.com|youtu\.be)$/.test(parsed.hostname)) {
          const id = parsed.hostname.endsWith('youtu.be') ? parsed.pathname.slice(1) : parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop();
          if (id && /^[\w-]+$/.test(id)) url = `https://www.youtube-nocookie.com/embed/${id}`;
        } else if (provider === 'bilibili' && /(?:^|\.)bilibili\.com$/.test(parsed.hostname)) {
          const id = /\/(BV[\w]+|av\d+)/.exec(parsed.pathname)?.[1];
          if (id) url = `https://player.bilibili.com/player.html?${id.startsWith('BV') ? `bvid=${id}` : `aid=${id.slice(2)}`}&autoplay=0`;
        } else if (provider === 'native') url = source;
      } catch { if (provider === 'native') url = source; }
    }
    url = safeUrl(url);
    return <div className="limr-video">{!playing ? <button type="button" disabled={!url} onClick={() => setPlaying(true)}>{runtime.locale.play}{node.attributes?.title ? ` · ${String(node.attributes.title)}` : ''}</button> : provider === 'native' ? <video controls preload="metadata" src={url} /> : <iframe src={url} title={String(node.attributes?.title ?? 'Video')} allow="fullscreen; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="no-referrer" />}</div>;
  }
  return defineBlock({ name: 'video', tags: ['video', 'md-video'], component: options.component ?? Video, selection: 'atomic' });
}

export function figures(): RendererExtension {
  return {
    name: 'figures', tags: ['figure', 'figcaption'], scope: 'local', display: 'block',
    components: { figure: ({ children }) => <figure>{children}</figure>, figcaption: ({ children }) => <figcaption>{children}</figcaption> },
  };
}
