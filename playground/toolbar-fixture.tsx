import '../examples/packages/paper-theme/index.css';
import { useMemo, useState } from 'react';
import { Reader, chinese, type Annotation } from '../src';

const source = '# Tools, close to the words\n\nAlpha **bravo** charlie, with &amp; entities and `literal code`.\n\nA second paragraph keeps the selection and the page independent.\n\n```ts\nconst value = 42;\n```';
const at = source.indexOf('bravo');
const initial: Annotation[] = [
  { id: 'lower', range: { start: source.indexOf('Alpha'), end: source.indexOf('charlie') + 7 }, type: 'highlight', data: { color: '#F2C744', style: 'background' } },
  { id: 'upper', range: { start: at, end: at + 5 }, type: 'highlight', data: { color: '#E57373', style: 'wavy' } },
];
export function ToolbarFixture() {
  const controlled = new URLSearchParams(location.search).has('controlled');
  const wide = new URLSearchParams(location.search).has('wide');
  const [highlights, setHighlights] = useState<readonly Annotation[]>(controlled ? initial : []);
  const [hovered, setHovered] = useState('');
  const [value, setValue] = useState('');
  const [hoverCount, setHoverCount] = useState(0);
  const plugins = useMemo(() => [{ name: 'toolbar-example', actions: [{
    id: 'custom', label: wide ? 'Custom annotation integration' : 'Custom tool', icon: <span style={{ fontSize: 300 }}><svg style={{ width: 500, height: 300 }} viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" fill="currentColor" /></svg></span>,
    onHover: () => setHoverCount(count => count + 1),
    renderExpanded: (context: import('../src').ToolbarActionContext) => <div><label>Panel input<input value={value} onChange={event => setValue(event.target.value)} /></label><button onClick={() => void context.run(() => { throw new Error(wide ? 'The annotation integration could not complete this operation. Please check the document connection and retry. Reference: ' + 'long-unbroken-reference'.repeat(12) : 'Panel action failed'); })}>Fail action</button><button onClick={() => void context.run(async current => { await new Promise(resolve => setTimeout(resolve, 80)); setValue(current.selection.text); })}>Read selection</button>{wide && <p data-toolbar-details="">Custom content fills the available toolbar width. {'long-unbroken-reference'.repeat(12)}</p>}{new URLSearchParams(location.search).has('tall') && Array.from({ length: 30 }, (_, i) => <p key={i}>Plugin paragraph {i + 1}: a longer explanation that fits the reading tools panel.</p>)}</div>,
  }] }], [value, wide]);
  return <div className="demo-page" style={{ minHeight: 1800 }}>
    <Reader appearance={new URLSearchParams(location.search).has('skin') ? 'paper' : undefined} source={source} locale={wide ? undefined : chinese} plugins={plugins} annotations={controlled ? highlights : undefined} onAnnotationsChange={setHighlights} onHighlightHover={highlight => setHovered(highlight?.id ?? '')} />
    <output id="highlight-data" hidden>{JSON.stringify(highlights)}</output><output id="hovered-highlight" hidden>{hovered}</output><output id="panel-value" hidden>{value}</output><output id="hover-count" hidden>{hoverCount}</output>
  </div>;
}
