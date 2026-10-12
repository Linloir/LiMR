import { useEffect, useMemo, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Reader, Markdown, chinese, copyText, highlightSelection, type SelectionSnapshot } from '../src';
import { sample } from './sample';
import { MultipleFixture, PluginFixture, ResourceFixture, ScrollFixture } from './fixtures';
import { BenchmarkFixture } from './benchmark';
import { HydrationFixture } from './hydration';
import '../src/styles.css';
import 'katex/dist/katex.min.css';
import './playground.css';
import '@fontsource-variable/noto-serif-sc';

function App() {
  const [source, setSource] = useState(sample);
  const [streaming, setStreaming] = useState(false);
  const [dark, setDark] = useState(false);
  const [editor, setEditor] = useState(false);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const actions = useMemo(() => [copyText({ label: '复制文字' }), copyText({ label: '复制 Markdown', format: 'syntax' }), highlightSelection({ label: '高亮' })], []);
  useEffect(() => {
    if (!streaming) return;
    let offset = 0;
    const interval = setInterval(() => { offset = Math.min(sample.length, offset + 24); setSource(sample.slice(0, offset)); if (offset === sample.length) setStreaming(false); }, 25);
    return () => clearInterval(interval);
  }, [streaming]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  return <><header className="demo-header"><a className="demo-brand" href="#">LiMR <span>Linloir's liMR is a Markdown Renderer</span></a><div className="demo-controls">
    <a href="?fixture=plugin">插件演示</a>
    <button onClick={() => { setSource(''); setStreaming(true); }} disabled={streaming}>{streaming ? '生成中…' : '流式演示'}</button>
    <button onClick={() => { setStreaming(false); setSource(Array.from({ length: 100 }, (_, i) => `## 第 ${i + 1} 节 · 足够长的标题需要自动换行以保持目录宽度\n\n第 ${i + 1} 节内容。`.concat('\n\n', '长文阅读需要保持清晰、稳定和流畅。'.repeat(30))).join('\n\n')); }}>长文演示</button>
    <button onClick={() => { setStreaming(false); setSource(sample); }}>示例</button>
    <button onClick={() => setEditor(!editor)}>编辑</button><button onClick={() => setDark(!dark)}>{dark ? '浅色' : '深色'}</button>
  </div></header>
  {editor && <textarea className="demo-editor" aria-label="Markdown source" value={source} onChange={event => { setStreaming(false); setSource(event.target.value); }} />}
  <div className="demo-page"><Reader source={source} streaming={streaming} theme={dark ? 'dark' : 'light'} locale={chinese} actions={actions} onSelectionChange={setSelection} documentId="demo" /></div>
  <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output>
  <footer className="demo-footer">LiMR · A quiet place for words.</footer></>;
}
const fixture = new URLSearchParams(location.search).get('fixture');
if (fixture === 'hydrate') hydrateRoot(document.getElementById('root')!, <HydrationFixture />, { onRecoverableError: error => { document.documentElement.dataset.hydrationError = String(error); } });
else createRoot(document.getElementById('root')!).render(fixture === 'plugin' ? <PluginFixture /> : fixture === 'scroll' ? <ScrollFixture /> : fixture === 'multiple' ? <MultipleFixture /> : fixture === 'bench' ? <BenchmarkFixture /> : fixture === 'resource' ? <ResourceFixture /> : <App />);
