import { StrictMode, createContext, useContext, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Reader, chinese, english, standard, type NodeRendererProps, type RendererExtension, type SelectionSnapshot, type TranslationMode } from '../src';
import { Image } from '../src/components/Image';
import { TranslationBlock } from '../src/extensions/translations';
import '../src/styles.css';
import '../src/image-preview.css';

const picture = (color: string, width = 2400, height = 1400) => {
  const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d')!; context.fillStyle = color; context.fillRect(0, 0, width, height);
  context.fillStyle = '#fbf3da'; context.beginPath(); context.arc(width / 2, height / 2, height / 3, 0, 2 * Math.PI); context.fill();
  return canvas.toDataURL('image/png');
};
const photo = picture('#365d80'), replacement = picture('#607456', 1800, 900);
const source = `# Image preview\n\nSelectable source text.\n\n![Landscape](${photo} "Landscape title")\n\n![Reference image][picture]\n\n[picture]: ${photo} "Reference title"\n\n<figure src="${photo}" alt="Figure image" caption="A source-mapped caption." />\n\n<img src="${photo}" alt="Attribute image" />\n\n[![Linked image](${photo})](#target)\n\n![Missing image](/missing-image.png)\n\n## target\n`;
const tableSource = `| [![Landscape](${photo})](#target) ![Disabled preview](${photo}) ![Late image](/table-late-image.png) ${'ExtraordinaryHeader'.repeat(25)} | Value |\n| --- | --- |\n| Compact | ✓ |\n| Short | ✓ |`;
const failureSource = '# Image unavailable\n\n![Missing image](/missing-image.png)\n\n<figure src="/missing-image.png" alt="Missing figure" caption="Caption remains available." />\n\n| Image | Description |\n| --- | --- |\n| ![Missing table image](/missing-image.png) | Image in a table |\n\n[![Missing linked image](/missing-image.png)](#target)\n\n## target\n';
const pair = (body: string, index: number) => `<translations id="pair-${index}">\n\n<origin>\n\n${body}\n\n</origin>\n\n<translation>\n\n${body.replaceAll('Final item', '最后一项')}\n\n</translation>\n\n</translations>`;
const translationSource = ['- First item\n- Final item', '1. First item\n\n2. Final item', '- Outer item\n  - Final item', '- [ ] First item\n- [ ] Final item', '> - First item\n> - Final item', '- Final item with **strong** and a [link](#target)'].map(pair).join('\n\n');
const ControlledMode = createContext<{ mode: TranslationMode; update(mode: TranslationMode): void }>({ mode: 'origin', update() {} });
const PreviewPermission = createContext(true);
function ControlledTranslation(props: NodeRendererProps) { const { mode, update } = useContext(ControlledMode); return <TranslationBlock {...props} mode={mode} onModeChange={update} />; }
function TableImage({ node }: NodeRendererProps) { return <Image src={String(node.url ?? '')} alt={String(node.alt ?? '')} preview={useContext(PreviewPermission) && node.alt !== 'Disabled preview'} />; }
const defaults = standard(), controlledExtensions = [...defaults, { name: 'controlled-translations', components: { translations: ControlledTranslation } } satisfies RendererExtension];
const tableExtensions = [...defaults, { name: 'table-preview-fixture', components: {
  image: TableImage,
} } satisfies RendererExtension];

function Fixture() {
  const params = new URLSearchParams(location.search), translations = params.has('translations'), controlled = params.has('controlled'), table = params.has('table'), failures = params.has('failures');
  const [text, setText] = useState(failures ? failureSource : table ? tableSource : translations ? translationSource : source), [dark, setDark] = useState(true), [zh, setZh] = useState(false);
  const [repaired, setRepaired] = useState(false), [imageEvents, setImageEvents] = useState({ load: 0, error: 0 });
  const [mode, setMode] = useState<TranslationMode>('origin');
  const [imagePreview, setImagePreview] = useState(true);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  return <>
    <nav><button id="change-image" onClick={() => setText(value => value.replace(`![Landscape](${photo}`, `![Landscape](${replacement}`))}>Change image</button><button id="remove-image" onClick={() => setText(value => value.replace(/!\[Landscape\]\([^\n]+\)/, 'Removed image.'))}>Remove image</button><button id="theme" onClick={() => setDark(value => !value)}>Theme</button><button id="locale" onClick={() => setZh(value => !value)}>Locale</button>{table && <button id="toggle-preview" onClick={() => setImagePreview(value => !value)}>Toggle preview permission</button>}</nav>
    {failures && <button id="repair-images" onClick={() => { setText(value => value.replaceAll('/missing-image.png', photo)); setRepaired(true); }}>Repair images</button>}
    <div id="reader-scroll" style={{ height: 640, overflow: 'auto', border: '1px solid #888', margin: 20 }}>
      <PreviewPermission.Provider value={imagePreview}><ControlledMode.Provider value={{ mode, update: setMode }}><Reader source={text} theme={dark ? 'dark' : 'light'} locale={zh ? chinese : english} extensions={table ? tableExtensions : controlled ? controlledExtensions : defaults} toc={false} sidebar={params.has('sidebar')} sidebarCollapse={!params.has('aligned')}
        typography={params.has('kp') ? 'knuth-plass' : 'standard'} onSourceChange={setText} onSelectionChange={setSelection} /></ControlledMode.Provider></PreviewPermission.Provider>
    </div>
    {!translations && !table && <div id="standalone"><Image src={photo} alt="Standalone" style={{ width: 120 }} /><Image src={photo} alt="Disabled preview" preview={false} style={{ width: 120 }} /></div>}
    {failures && <div id="responsive-image"><Image src="/missing-image.png" srcSet={repaired ? `${photo} 1x` : '/missing-image.png 1x'} alt="Responsive image" style={{ width: 'auto', height: 'auto', maxWidth: 120, maxHeight: 60 }}
      onLoad={() => setImageEvents(value => ({ ...value, load: value.load + 1 }))} onError={() => setImageEvents(value => ({ ...value, error: value.error + 1 }))} />
      <output data-testid="image-events" hidden>{JSON.stringify(imageEvents)}</output></div>}
    <output data-testid="source" hidden>{text}</output><output data-testid="selection" hidden>{JSON.stringify(selection)}</output><output data-testid="mode" hidden>{mode}</output>
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
