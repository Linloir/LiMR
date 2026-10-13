import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Reader, chinese, standard, defineBlock, type RendererExtension, type StreamEffect, type SelectionSnapshot } from '../src';

interface StreamInput { source: string; streaming?: boolean; effect?: StreamEffect | false; custom?: boolean; sidebar?: boolean; chinese?: boolean; legacyFootnotes?: boolean; typography?: 'pretty' | 'normal' | 'standard' | 'knuth-plass' | 'justify' }
declare global { interface Window { limrStream: (input: StreamInput) => void } }
const counter = defineBlock({ name: 'counter', component: ({ children, incomplete }) => {
  const [count, setCount] = useState(0);
  return <section data-counter-open={incomplete}><button onClick={() => setCount(value => value + 1)}>Count {count}</button>{children}</section>;
} });
const atomicCard = defineBlock({ name: 'atomic-card', selection: 'atomic', component: ({ children, renderAttribute }) => <section data-atomic-card=""><header>{renderAttribute('title')}</header>{children}</section> });
const effectPlugin: RendererExtension = { name: 'stream-effect', streaming: { effect: { className: 'custom-increment', keyframes: [{ opacity: .2 }, { opacity: 1 }], timing: { duration: 1200 } } } };
const basePlugins = [counter, atomicCard], customPlugins = [counter, atomicCard, effectPlugin];
const legacy = standard().filter(module => module.name !== 'footnotes');

export function StreamingFixture() {
  const [input, setInput] = useState<StreamInput>({ source: '', streaming: true });
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  useEffect(() => { window.limrStream = value => flushSync(() => setInput(value)); }, []);
  return <main style={{ maxWidth: input.sidebar ? 1700 : 780, padding: 24, marginInline: 'auto' }}>
    <Reader source={input.source} streaming={input.streaming ?? true} streamEffect={input.effect} typography={input.typography} extensions={input.legacyFootnotes ? legacy : undefined} locale={input.chinese ? chinese : undefined} plugins={input.custom ? customPlugins : basePlugins} toc={false} sidebar={input.sidebar ?? false} onSelectionChange={setSelection} />
    <output id="stream-selection" hidden>{JSON.stringify(selection)}</output>
  </main>;
}
