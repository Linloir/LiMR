import { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AsyncReader, standard, useLiMR, type NodeRendererProps, type RendererExtension, type VirtualizedRenderer } from '../src';
import '../src/styles.css';

type Mode = 'keep' | 'conditional' | 'owner';
const mode = (new URLSearchParams(location.search).get('mode') ?? 'keep') as Mode;
const source = '# Stateful renderer\n\n```stateful\nOriginal widget payload.\n```\n\n'
  + Array.from({ length: 1800 }, (_, index) => `Paragraph ${index}. Ordinary windowed prose surrounding a stateful custom renderer.\n\n`).join('');
const audit: any = (window as any).lifetime = { mode, source, state: null, capability: null, api: null };
const worker = () => new Worker(new URL('../src/worker.ts', import.meta.url), { type: 'module' });
const copy: VirtualizedRenderer = { copyText: (_node, { value }) => value };
const keep: VirtualizedRenderer = { ...copy, keepAlive: true };
function Widget({ node }: NodeRendererProps) {
  const [count, setCount] = useState(0), identity = useRef(crypto.randomUUID());
  return <section data-widget={mode} data-instance={identity.current}><p>{node.value}</p><button type="button" onClick={() => setCount(value => value + 1)}>Count {count}</button></section>;
}
function Bridge() { audit.api = useLiMR(); return null; }
function Fixture() {
  const extensions = useMemo<RendererExtension[]>(() => [...standard(),
    { name: 'stateful-owner', components: { code: Widget }, virtualization: { code: keep } },
    ...(mode === 'owner' ? [{ name: 'replacement-owner', components: { code: Widget }, virtualization: { code: copy } }] : []),
  ], []);
  const rendererOverrides = useMemo(() => mode === 'conditional' ? [{ type: 'code', component: Widget, virtualization: copy, when: (node: NodeRendererProps['node']) => node.lang === 'stateful' }] : undefined, []);
  return <AsyncReader input={source} extensions={extensions} rendererOverrides={rendererOverrides} loading={{ worker, fallback: 'error' }} virtualization toc={false} sidebar={false}
    onLoadStateChange={state => { audit.state = state; }} onVirtualizationChange={capability => { audit.capability = capability; }}><Bridge /></AsyncReader>;
}
document.body.style.cssText = 'margin:0;background:#fffefa';
document.getElementById('root')!.style.cssText = 'max-width:900px;margin:auto;padding:24px';
createRoot(document.getElementById('root')!).render(<Fixture />);
