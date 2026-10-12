import { useEffect, useMemo, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Reader, Markdown, chinese, copyText, highlightSelection, type SelectionSnapshot } from '../src';
import { sample } from './sample';
import { MultipleFixture, PluginFixture, ResourceFixture, ScrollFixture, SidebarFixture } from './fixtures';
import { BenchmarkFixture } from './benchmark';
import { HydrationFixture } from './hydration';
import '../src/styles.css';
import 'katex/dist/katex.min.css';
import './playground.css';
import '@fontsource-variable/noto-serif-sc';
import { useScrollSync } from './scroll-sync';
import { MarkerFixture, OverlayFixture, VideoFixture, VisualFixture } from './visual';
import { SelectionBenchmarkFixture } from './selection-benchmark';

function App() {
  const [source, setSource] = useState(sample);
  const [streaming, setStreaming] = useState(false);
  const [dark, setDark] = useState(false);
  const [editor, setEditor] = useState(false);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  const plugin = new URLSearchParams(location.search).get('fixture') === 'plugin';
  useScrollSync(textarea, preview, source);
  const actions = useMemo(() => [copyText({ label: '复制文字' }), copyText({ label: '复制 Markdown', format: 'syntax' }), highlightSelection({ label: '高亮' })], []);
  useEffect(() => {
    if (!streaming) return;
    let offset = 0;
    const interval = setInterval(() => { offset = Math.min(sample.length, offset + 24); setSource(sample.slice(0, offset)); if (offset === sample.length) setStreaming(false); }, 25);
    return () => clearInterval(interval);
  }, [streaming]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  return <><header className="demo-header"><a className="demo-brand" href="/">LiMR <span>Linloir's limr Is a Markdown Renderer</span></a><nav className="demo-controls" aria-label="Playground">
    <a href={plugin ? '/' : '?fixture=plugin'} aria-current={plugin ? 'page' : undefined}>{plugin ? '返回示例' : '插件演示'}</a>
    {!plugin && <>
    <button onClick={() => { setSource(''); setStreaming(true); }} disabled={streaming}>{streaming ? '生成中…' : '流式演示'}</button>
    <button onClick={() => { setStreaming(false); setSource(Array.from({ length: 100 }, (_, i) => `## 第 ${i + 1} 节 · 足够长的标题需要自动换行以保持目录宽度\n\n第 ${i + 1} 节内容。`.concat('\n\n', '长文阅读需要保持清晰、稳定和流畅。'.repeat(30))).join('\n\n')); }}>长文演示</button>
    <button onClick={() => { setStreaming(false); setSource(sample); }}>示例</button>
    <button aria-pressed={editor} onClick={() => setEditor(!editor)}>{editor ? '阅读' : '编辑'}</button></>}
    <button onClick={() => setDark(!dark)}>{dark ? '浅色' : '深色'}</button>
  </nav></header>
  {plugin ? <PluginFixture theme={dark ? 'dark' : 'light'} /> : <div className={editor ? 'demo-workbench' : 'demo-reading'}>
    {editor && <section className="demo-editor-pane"><div className="demo-pane-label">Markdown <span>直接编辑 · 双向滚动同步</span></div><textarea ref={setTextarea} wrap="off" spellCheck={false} className="demo-editor" aria-label="Markdown source" value={source} onChange={event => { setStreaming(false); setSource(event.target.value); }} /></section>}
    <section className={editor ? 'demo-preview-pane' : undefined}>{editor && <div className="demo-pane-label">预览</div>}<div ref={editor ? setPreview : undefined} className={editor ? 'demo-preview-scroll' : undefined}>
      <div className="demo-page"><Reader source={source} streaming={streaming} theme={dark ? 'dark' : 'light'} locale={chinese} scrollRoot={editor ? preview : null} toc={!editor} sidebar={!editor} actions={actions} onSelectionChange={setSelection} documentId="demo" /></div>
    </div></section>
  </div>}
  <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output>
  <footer className="demo-footer">LiMR · A quiet place for words.</footer></>;
}
const fixture = new URLSearchParams(location.search).get('fixture');
if (fixture === 'hydrate') hydrateRoot(document.getElementById('root')!, <HydrationFixture />, { onRecoverableError: error => { document.documentElement.dataset.hydrationError = String(error); } });
else createRoot(document.getElementById('root')!).render(fixture === 'sidebar' ? <SidebarFixture /> : fixture === 'selection-bench' ? <SelectionBenchmarkFixture /> : fixture === 'video' ? <VideoFixture /> : fixture === 'overlay' ? <OverlayFixture /> : fixture === 'markers' ? <MarkerFixture /> : fixture === 'visual' ? <VisualFixture /> : fixture === 'scroll' ? <ScrollFixture /> : fixture === 'multiple' ? <MultipleFixture /> : fixture === 'bench' ? <BenchmarkFixture /> : fixture === 'resource' ? <ResourceFixture /> : <App />);
