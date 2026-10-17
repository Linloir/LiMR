import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Reader, chinese, standard, defineBlock, type RendererExtension, type RendererParameters, type StreamEffect, type SelectionSnapshot } from '../src';
import { inlineNotes } from '../examples/inline-notes';
import { sourceQuestionType } from '../examples/notes';
import { useRuntime } from '../src/react/context';
import type { ReaderRuntime } from '../src/react/runtime';

interface StreamInput { source: string; streaming?: boolean; effect?: StreamEffect | false; custom?: boolean; toc?: boolean; sidebar?: boolean; sidebarCollapse?: boolean; chinese?: boolean; legacyFootnotes?: boolean; editable?: boolean; typography?: 'pretty' | 'normal' | 'standard' | 'knuth-plass' | 'justify'; parameters?: RendererParameters; plugins?: readonly RendererExtension[] }
declare global { interface Window { limrStream: (input: StreamInput) => void; limrStreamRuntime?: ReaderRuntime } }
function RuntimeAudit() {
  const runtime = useRuntime();
  useEffect(() => {
    window.limrStreamRuntime = runtime;
    return () => { if (window.limrStreamRuntime === runtime) delete window.limrStreamRuntime; };
  }, [runtime]);
  return null;
}
const counter = defineBlock({ name: 'counter', component: ({ children, incomplete }) => {
  const [count, setCount] = useState(0);
  return <section data-counter-open={incomplete}><button onClick={() => setCount(value => value + 1)}>Count {count}</button>{children}</section>;
} });
const atomicCard = defineBlock({ name: 'atomic-card', selection: 'atomic', component: ({ children, renderAttribute }) => <section data-atomic-card=""><header>{renderAttribute('title')}</header>{children}</section> });
const effectPlugin: RendererExtension = { name: 'stream-effect', streaming: { effect: { className: 'custom-increment', keyframes: [{ opacity: .2 }, { opacity: 1 }], timing: { duration: 1200 } } } };
const basePlugins = [counter, atomicCard, inlineNotes(), { name: 'fixture-question', annotationTypes: [sourceQuestionType] }], customPlugins = [...basePlugins, effectPlugin];
const legacy = standard().filter(module => module.name !== 'footnotes');

export function StreamingFixture() {
  const [input, setInput] = useState<StreamInput>({ source: '', streaming: true });
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  useEffect(() => { window.limrStream = value => flushSync(() => setInput(value)); }, []);
  return <main style={{ maxWidth: input.sidebar ? 1700 : 780, padding: 24, marginInline: 'auto' }}>
    <Reader source={input.source} onSourceChange={input.editable ? source => setInput(current => ({ ...current, source })) : undefined} streaming={input.streaming ?? true} streamEffect={input.effect} typography={input.typography} parameters={input.parameters} extensions={input.legacyFootnotes ? legacy : undefined} locale={input.chinese ? chinese : undefined} plugins={input.plugins ?? (input.custom ? customPlugins : basePlugins)} toc={input.toc ?? false} sidebar={input.sidebar ?? false} sidebarCollapse={input.sidebarCollapse} onSelectionChange={setSelection}><RuntimeAudit /></Reader>
    <output id="stream-selection" hidden>{JSON.stringify(selection)}</output>
    <output id="stream-source" hidden>{input.source}</output>
  </main>;
}
