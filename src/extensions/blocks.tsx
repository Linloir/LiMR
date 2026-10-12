import { useState } from 'react';
import { defineBlock } from './define';
import { rangeOf, safeUrl, textContent, walk } from '../core/tree';
import { useRuntime } from '../react/context';
import type { MarkdownNode } from '../core';
import type { NodeRenderer, NodeRendererProps, RendererExtension } from '../react/types';
import { Disclosure } from '../components/Disclosure';
import { Collapse } from '../components/Collapse';
import { DiamondCheck } from '../components/DiamondCheck';

function parts(node: MarkdownNode, name: string): MarkdownNode[] {
  const result: MarkdownNode[] = [];
  walk(node, child => { if (child !== node && child.name === name) result.push(child); });
  return result;
}
const PassThrough: NodeRenderer = ({ children }) => <>{children}</>;
export function definition(options: { component?: NodeRenderer } = {}): RendererExtension {
  function Definition({ node, children, renderChildren, renderAttribute }: NodeRendererProps) {
    const runtime = useRuntime();
    const title = parts(node, 'title')[0];
    const content = parts(node, 'content')[0];
    return <aside className="limr-definition">
      <div className="limr-card-label" data-limr-ignore="true">{runtime.locale.definition}</div>
      {(title || node.attributes?.title) && <div className="limr-definition-title">{title ? renderChildren(title.children ?? []) : renderAttribute('title')}</div>}
      <div className="limr-block-content">{content ? renderChildren(content.children ?? []) : children}</div>
    </aside>;
  }
  return { ...defineBlock({ name: 'definition', component: options.component ?? Definition }), tags: ['definition', 'title', 'content'], components: { definition: options.component ?? Definition, title: PassThrough, content: PassThrough } };
}

export function question(options: { component?: NodeRenderer } = {}): RendererExtension {
  function Question({ node, children, renderChildren, renderAttribute }: NodeRendererProps) {
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
      <div className="limr-card-label" data-limr-ignore="true">{runtime.locale.question}</div>
      {node.attributes?.title && <div className="limr-question-title">{renderAttribute('title')}</div>}
      <div className="limr-block-content">{content ? renderChildren(content.children ?? []) : !selections.length && !hint && !answer ? children : null}</div>
      {selections.length > 0 && <fieldset className="limr-question-options"><legend className="limr-sr-only">{String(node.attributes?.title ?? runtime.locale.question)}</legend>{selections.map((selection, index) => <label key={index} data-selected={selected.includes(index) || undefined} data-result={checked ? correct.includes(index) ? 'correct' : selected.includes(index) ? 'incorrect' : undefined : undefined}>
        <input type={multi ? 'checkbox' : 'radio'} name={`${runtime.document.id}-question-${rangeOf(node).start}`} checked={selected.includes(index)} disabled={checked} onChange={() => { setSelected(multi ? selected.includes(index) ? selected.filter(item => item !== index) : [...selected, index] : [index]); }} />
        <DiamondCheck checked={selected.includes(index) || checked && correct.includes(index)} />
        <span className="limr-choice-text">{renderChildren(selection.children ?? [])}</span>
      </label>)}</fieldset>}
      {selections.length > 0 && correct.length > 0 && <div className="limr-question-actions" data-limr-ignore="true">
        <button type="button" data-checked={checked || undefined} disabled={!checked && !selected.length} onClick={() => {
          if (checked) { setChecked(false); setSelected([]); setAnswer(false); }
          else { setChecked(true); setAnswer(true); }
        }}><span key={checked ? 'retry' : 'submit'} className="limr-button-label">{checked ? runtime.locale.retry : runtime.locale.submit}</span></button>
        <Collapse open={checked}><span role="status" className={`limr-question-result ${success ? 'limr-success' : 'limr-error'}`}>{success ? runtime.locale.correct : runtime.locale.incorrect}</span></Collapse>
      </div>}
      {hint && <Disclosure title={runtime.locale.hint} open={showHint} onChange={setHint}>{renderChildren(hint.children ?? [])}</Disclosure>}
      {answer && <Disclosure title={runtime.locale.answer} open={showAnswer} onChange={setAnswer}>{renderChildren(answer.children ?? [])}</Disclosure>}
    </section>;
  }
  const names = ['question-content', 'question-hint', 'question-answer', 'question-sel-grp', 'question-sel'];
  return { ...defineBlock({ name: 'question', component: options.component ?? Question }), tags: ['question', ...names], components: { question: options.component ?? Question, ...Object.fromEntries(names.map(name => [name, PassThrough])) } };
}

export function extras(options: { component?: NodeRenderer } = {}): RendererExtension {
  const Extra: NodeRenderer = ({ node, children, renderAttribute }) => <div className="limr-extra">
    <a className="limr-extra-link" href={safeUrl(node.attributes?.url)} target="_blank" rel="noreferrer"><span className="limr-underline">{renderAttribute(node.attributes?.title ? 'title' : 'url')}</span>
    {node.attributes?.desc && <p><span className="limr-underline">{renderAttribute('desc')}</span></p>}</a>{children}
  </div>;
  const Extras: NodeRenderer = ({ children }) => { const runtime = useRuntime(); return <aside className="limr-extras"><div className="limr-card-label" data-limr-ignore="true">{runtime.locale.extra}</div>{children}</aside>; };
  return { ...defineBlock({ name: 'extras', component: options.component ?? Extras }), tags: ['extras', 'extra'], components: { extras: options.component ?? Extras, extra: Extra } };
}

export { video, type VideoOptions } from './video';

export function figures(): RendererExtension {
  return {
    name: 'figures', tags: ['figure', 'figcaption'], scope: 'local', display: 'block',
    components: { figure: ({ children }) => <figure>{children}</figure>, figcaption: ({ children }) => <figcaption>{children}</figcaption> },
  };
}
