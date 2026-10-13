import { useState } from 'react';
import { Reader, chinese, highlightSelection, type AnnotationType, type SelectionSnapshot } from '../src';

export const visualSource = [
  '# Selection and motion',
  'Left<ref id="between" /> right with `inline code` and $x^2$ end.<ref id="last" />',
  '```typescript\nconst total = 12;\nconst 你好 = total + 1;\n// next line: α Я é \uf120\n```',
  '$$\n\\int_0^1 x^2\\,dx = \\frac13\n$$',
  '<definition title="In a special block">\n\nInside **rich text** with `code here`<ref id="inside" /> after $x+1$ and more text.\n\nSecond paragraph.\n\n</definition>',
  '> A note with **rich content**.\n>\n> A second paragraph.',
  '<question answer="[0]">\n<question-content>Choose a component.</question-content>\n<question-sel>Markdown</question-sel>\n<question-sel>TableOfContents</question-sel>\n<question-hint>A useful hint.</question-hint>\n<question-answer>A complete answer.</question-answer>\n</question>',
  '<extras><extra title="More to read" url="https://example.com" desc="An extended description with balanced spacing." /></extras>',
  '<citation id="between" title="Middle citation" description="First paragraph.&#10;&#10;Second paragraph with **detail**.&#10;&#10;Third paragraph." />',
  '<citation id="last" title="Trailing citation" />',
  '<citation id="inside" title="Nested citation" />',
].join('\n\n');
const annotation = [{ id: 'code-note', type: 'citation', range: { start: visualSource.indexOf('total ='), end: visualSource.indexOf('total =') + 5 }, data: { title: 'Code annotation', description: 'A card inserted into code.' } }];
const actions = [highlightSelection()];

export function VisualFixture() {
  const [annotations, setAnnotations] = useState<readonly import("../src").Annotation[]>(annotation);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const [dark, setDark] = useState(false);
  return <div className="demo-page"><div className="demo-controls"><button onClick={() => setDark(!dark)}>Theme</button></div>
    <Reader source={visualSource} documentId="visual" theme={dark ? 'dark' : 'light'} locale={chinese} annotations={annotations} onAnnotationsChange={setAnnotations} actions={actions} onSelectionChange={setSelection} />
    <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output><output id="source-data" hidden>{visualSource}</output>
  </div>;
}

const largeSvg = <svg width="256" height="256" style={{ width: 256, height: 256 }} viewBox="0 0 16 16"><path d="M8 1 15 8 8 15 1 8Z" fill="currentColor" /></svg>;
const markerTypes: AnnotationType[] = [
  { type: 'large-svg', label: 'Large SVG', icon: largeSvg },
  { type: 'nested-icon', label: 'Nested icon', icon: <div style={{ width: 200, height: 200, fontSize: 100 }}>{largeSvg}</div> },
  { type: 'large-image', label: 'Large image', icon: <img width="200" height="200" alt="" src={'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6"/></svg>')} /> },
  { type: 'custom-marker', label: 'Custom marker', Marker: () => <div style={{ width: 160, height: 160 }}>{largeSvg}</div> },
  { type: 'text-icon', label: 'Text icon', icon: '✦' },
];
const markerSource = 'Reference<ref id="reference" /> **Bold plugin text**.\n\n<citation id="reference" title="Reference" />';
const markerAnnotations = markerTypes.map((type, i) => ({ id: `plugin-${i}`, type: type.type, range: { start: 32, end: 38 } }));
export function MarkerFixture() {
  return <div className="demo-page"><Reader source={markerSource} annotations={markerAnnotations} annotationTypes={markerTypes} toc={false} sidebar={false} /></div>;
}

const overlayTypes: AnnotationType<{ placement?: 'center' | 'anchor'; height?: string; text: string }>[] = [{
  type: 'detail', label: 'Detail', icon: '✦',
  overlay: { expand: annotation => ({ placement: annotation.data?.placement ?? 'anchor', height: annotation.data?.height }) },
  Content: ({ data, expanded }) => <div><p>Preview content</p>{expanded && <><p>{data?.text}</p><label>Message <input aria-label="Card draft" defaultValue="Draft stays mounted" /></label></>}</div>,
}, { type: 'click-detail', label: 'Click detail', sidebar: { collapseOnContentClick: true }, Content: () => <p>Click to collapse this module.</p> }, {
  type: 'custom-card', label: 'Custom card',
  overlay: {
    previewWidth: 286, expand: { placement: 'center', width: 512 },
    Card: ({ expanded, expand, collapse, close, children }) => <>
      <header data-testid="module-card-header" style={{ padding: 16 }}><strong>{expanded ? 'Expanded by module' : 'Preview by module'}</strong><button onClick={expanded ? collapse : expand}>{expanded ? 'Less detail' : 'More detail'}</button></header>
      <section data-limr-card-body="" style={{ padding: 16 }}>{children}</section>
      <footer><button onClick={close}>Dismiss module</button></footer>
    </>,
  },
  Content: () => <label>Module draft <input aria-label="Module draft" defaultValue="Keep my state" /></label>,
}];
const overlayAnnotations = [
  { id: 'center', type: 'detail', range: { start: 0, end: 6 }, data: { placement: 'center' as const, height: '80dvh', text: 'A conversation with a large centered surface.' } },
  { id: 'anchor', type: 'detail', range: { start: 8, end: 14 }, data: { placement: 'anchor' as const, text: 'More detail. The card only grows to fit these extra lines, keeping its anchored edge fixed.' } },
  { id: 'click-detail', type: 'click-detail', range: { start: 16, end: 21 } },
  { id: 'custom-card', type: 'custom-card', range: { start: 23, end: 29 } },
];
export function OverlayFixture() {
  return <div className="demo-page"><Reader source={'Center. Anchor. Plain. Custom.\n\nReference<ref id="ref" />\n\n<citation id="ref" title="A citation without expansion" description="Clickable sidebar content." url="https://example.com" />'} annotations={overlayAnnotations} annotationTypes={overlayTypes} locale={chinese} toc={false} /></div>;
}

export const videoSource = '<md-video provider="youtube" url="https://www.youtube.com/watch?v=M7lc1UVf-VE" title="YouTube video" />';
export function VideoFixture() {
  const source = [videoSource, ...Array.from({ length: 40 }, (_, index) => `Paragraph ${index}. Space before the next player.`), '<video url="https://www.bilibili.com/video/BV1xx411c7mD?p=2" />', '<video url="https://youtu.be/M7lc1UVf-VE" loading="click" />'].join('\n\n');
  return <div className="demo-page"><Reader source={source} toc={false} sidebar={false} locale={chinese} /></div>;
}
