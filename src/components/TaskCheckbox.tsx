import { createContext, useContext, useId, type ReactNode } from 'react';
import { DiamondCheck } from './DiamondCheck';
import { rangeOf, textContent, type MarkdownNode } from '../core';
import { useLiMR } from '../react/context';

const TaskControlId = createContext<string | undefined>(undefined);

/** Every paragraph labels its own task, including wrapped and loose lists. */
export function TaskText({ children }: { children: ReactNode }) {
  return <label className="limr-task-text" htmlFor={useContext(TaskControlId)}>{children}</label>;
}

/** Native Markdown tasks participate in the same optional source transaction. */
export function SourceTaskItem({ node, source, children }: { node: MarkdownNode; source: string; children: ReactNode }) {
  const commands = useLiMR();
  const id = useId();
  const marker = /\[[ \txX]\]/.exec(source), start = rangeOf(node).start;
  const offset = start + (marker?.index ?? 0) + 1;
  const ideographic = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(textContent(node.children?.[0] ?? node));
  const editable = commands.canEditSource() && !!marker;
  return <TaskControlId.Provider value={id}><li className="limr-task-item" data-checked={node.checked === true || undefined} data-editable={editable || undefined}>
    <TaskCheckbox id={id} checked={!!node.checked} ideographic={ideographic} disabled={!editable} onChange={checked => {
      const document = commands.document.getSnapshot();
      if (!marker || document.source.slice(start, start + source.length) !== source) return;
      commands.editSource([{ range: { start: offset, end: offset + 1 }, text: checked ? 'x' : ' ' }], { revision: document.revision });
    }} />{children}
  </li></TaskControlId.Provider>;
}

/** The native input keeps checkbox semantics, keyboard handling and focus. */
export function TaskCheckbox({ id, checked, disabled = true, onChange, label = 'Task', ideographic = false }: {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  ideographic?: boolean;
}) {
  return <label className="limr-task-control" data-limr-ignore="true" data-ideographic={ideographic || undefined}>
    <input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={event => onChange?.(event.target.checked)} aria-label={label} />
    <DiamondCheck checked={checked} fit />
  </label>;
}

