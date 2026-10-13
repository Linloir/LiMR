import type { CSSProperties } from 'react';
import { defaultHighlight, type HighlightData } from '../core';
import type { SelectionAction, ToolbarActionContext } from '../react/types';
import { ToolIcon } from '../components/ToolIcon';

/** The first five colors match infilearn's reading palette. */
export const highlightColors = [
  { color: '#E57373', label: 'Rose', labelZh: '玫瑰' },
  { color: '#F2C744', label: 'Gold', labelZh: '暖黄' },
  { color: '#81B29A', label: 'Sage', labelZh: '鼠尾草' },
  { color: '#6B9BD2', label: 'Blue', labelZh: '雾蓝' },
  { color: '#B39DDB', label: 'Lavender', labelZh: '薰衣草' },
  { color: '#E5A06E', label: 'Apricot', labelZh: '杏橙' },
  { color: '#61AAA5', label: 'Teal', labelZh: '青瓷' },
] as const;

export function copyText(options: { label?: string; format?: 'text' | 'raw' | 'syntax' | 'blocks' } = {}): SelectionAction {
  return {
    id: `copy-${options.format ?? 'text'}`, label: options.label ?? (context => context.locale.copy), icon: <ToolIcon name="copy" />,
    successLabel: context => context.locale.copied, successIcon: <ToolIcon name="check" />,
    run: async ({ selection }) => { const format = options.format ?? 'text'; await navigator.clipboard.writeText(format === 'text' ? selection.text : selection[format].sourceText); },
  };
}

export interface HighlightOptions {
  colors?: readonly { color: string; label: string; labelZh?: string }[];
}
function HighlightSettings({ context, options }: { context: ToolbarActionContext; options: HighlightOptions }) {
  const { locale, highlight, highlightAppearance } = context;
  const color = highlightAppearance.color ?? defaultHighlight.color!;
  const style = highlightAppearance.style ?? 'background';
  const styles = [
    ['background', locale.highlightBackground], ['underline', locale.highlightUnderline],
    ['dotted', locale.highlightDotted], ['wavy', locale.highlightWavy],
  ] as const;
  const change = (nextColor: string, nextStyle: HighlightData['style']) => {
    const appearance = { ...highlightAppearance, color: nextColor, style: nextStyle };
    context.setHighlightAppearance(appearance);
    if (highlight) void context.run(current => current.updateAnnotation(highlight.id, { data: appearance }));
  };
  return <div className="limr-highlight-settings">
    <fieldset disabled={context.busy}><legend>{locale.highlightStyle}</legend>
      <div className="limr-highlight-styles">{styles.map(([value, label]) => <button key={value} type="button" aria-pressed={style === value} onClick={() => change(color, value)}><ToolIcon name={value} /><span className="limr-highlight-style-label"><span className="limr-underline">{label}</span></span></button>)}</div>
    </fieldset>
    <fieldset disabled={context.busy}><legend>{locale.highlightColor}</legend>
      <div className="limr-highlight-colors">{(options.colors ?? highlightColors).map(item => <button key={item.color} type="button" className="limr-color-swatch" aria-label={locale.highlight === '高亮' ? item.labelZh ?? item.label : item.label} title={locale.highlight === '高亮' ? item.labelZh ?? item.label : item.label} aria-pressed={color.toLowerCase() === item.color.toLowerCase()} style={{ '--swatch': item.color } as CSSProperties} onClick={() => change(item.color, style)}><ToolIcon name="check" /></button>)}</div>
    </fieldset>
  </div>;
}

/** A single swatch owns all style choices; the highlight action never expands. */
export function highlightPalette(options: HighlightOptions = {}): SelectionAction {
  return {
    id: 'highlight-palette', label: context => context.locale.editHighlight, icon: <ToolIcon name="background" />, placement: 'start',
    render: context => <button type="button" className="limr-toolbar-swatch" aria-label={context.locale.editHighlight} aria-expanded={context.expanded} disabled={context.busy} onClick={() => context.expanded ? context.collapse() : context.expand()} style={{ '--swatch': context.highlightAppearance.color ?? defaultHighlight.color } as CSSProperties} />,
    renderExpanded: context => <HighlightSettings context={context} options={options} />,
  };
}

export function highlightSelection(): SelectionAction {
  return {
    id: 'highlight',
    label: context => !context.highlight ? context.locale.addHighlight : context.highlight.data?.hidden ? context.locale.showHighlight : context.locale.hideHighlight,
    icon: context => <ToolIcon name={!context.highlight ? 'highlight' : context.highlight.data?.hidden ? 'eye' : 'eye-off'} />,
    visible: context => !context.highlight || context.annotations.some(annotation => annotation.type !== 'highlight'),
    run: context => {
      if (context.highlight) context.updateAnnotation(context.highlight.id, { data: { ...context.highlight.data, hidden: !context.highlight.data?.hidden } });
      else {
        context.addAnnotation({ id: `highlight-${crypto.randomUUID()}`, type: 'highlight', data: { ...context.highlightAppearance, hidden: false }, anchors: context.selection.syntax.ranges.map(range => ({ range, documentId: context.document.id, quote: context.document.source.slice(range.start, range.end) })) });
        context.clearSelection();
      }
    },
  };
}

export function deleteAnnotations(): SelectionAction {
  return {
    id: 'delete-annotations', label: context => context.locale.deleteAnnotations, icon: <ToolIcon name="trash" />, placement: 'end', tone: 'danger',
    visible: context => context.annotations.length > 0,
    run: context => { context.removeAnnotationsAt([...context.selection.raw.ranges, ...context.selection.syntax.ranges]); context.activateAnnotation(null); context.clearSelection(); },
  };
}
