import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../react/context';
import { ToolIcon } from './ToolIcon';

export interface AnnotationEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  /** Called only when focus leaves the entire editor, including its buttons. */
  onBlur?: () => void;
  label: string;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
  autoFocus?: boolean;
}

/** Controlled editing UI; annotation state and persistence belong to its caller. */
export function AnnotationEditor({ value, onChange, onSubmit, onCancel, onBlur, label, placeholder, submitLabel = 'Submit', cancelLabel = 'Cancel', submitDisabled = false, autoFocus = true }: AnnotationEditorProps) {
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!autoFocus) return;
    const frame = requestAnimationFrame(() => {
      const field = input.current;
      if (field && document.activeElement !== field) { field.focus({ preventScroll: true }); field.selectionStart = field.selectionEnd = field.value.length; }
    });
    return () => cancelAnimationFrame(frame);
  }, [autoFocus]);
  useIsomorphicLayoutEffect(() => {
    const field = input.current;
    if (!field) return;
    const resize = () => { field.style.height = 'auto'; field.style.height = `${field.scrollHeight}px`; };
    resize();
    let width = field.clientWidth;
    const observer = new ResizeObserver(() => { if (field.clientWidth !== width) { width = field.clientWidth; resize(); } });
    observer.observe(field.parentElement!);
    return () => observer.disconnect();
  }, [value]);
  return <form className="limr-annotation-editor" onSubmit={event => { event.preventDefault(); if (!submitDisabled) onSubmit(); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBlur?.(); }}>
    <textarea ref={input} className="limr-annotation-editor-input" aria-label={label} placeholder={placeholder} rows={1} value={value}
      onChange={event => onChange(event.target.value)} onKeyDown={event => {
        if (event.nativeEvent.isComposing) return;
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onCancel(); }
        else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) { event.preventDefault(); if (!submitDisabled) onSubmit(); }
      }} />
    <div className="limr-annotation-actions">
      <button type="button" onClick={onCancel}><ToolIcon name="close" /><span className="limr-underline">{cancelLabel}</span></button>
      <button type="submit" className="limr-annotation-submit" disabled={submitDisabled}><ToolIcon name="check" /><span className="limr-underline">{submitLabel}</span></button>
    </div>
  </form>;
}
