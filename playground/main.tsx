import { StreamingFixture } from './streaming-fixture';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { Reader, ToolIcon, chinese, english, type Annotation, type SelectionSnapshot, type TypographyMode, type TranslationMode } from '../src';
import { Dropdown } from './Dropdown';
import { Documentation, docsHref, readDocsRoute } from './Documentation';
import { MediaAnnotationFixture, MediaFixture, TranslationDetailsFixture } from './media-fixture';
import { assistant } from '../examples/assistant';
import { readingNotes } from '../examples/notes';
import { sample } from './sample';
import { presets } from './presets';
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
import { ToolbarFixture } from './toolbar-fixture';

const storageKey = 'limr-playground-document';
const localeStorageKey = 'limr-playground-locale';
function savedLocale(): 'zh-CN' | 'en' {
  try { return localStorage.getItem(localeStorageKey) === 'en' ? 'en' : 'zh-CN'; }
  catch { return 'zh-CN'; }
}
function savedDocument(): { source: string; annotations: readonly Annotation[] } | null {
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
    if (!data || typeof data.source !== 'string' || !Array.isArray(data.annotations)) return null;
    if (data.version === 2) return data;
    if (data.version === 1 && Array.isArray(data.highlights)) return { source: data.source, annotations: [...data.annotations, ...data.highlights.map(({ id, range, ...appearance }: any) => ({ id, range, type: 'highlight', data: appearance }))] };
  } catch { /* A fresh document remains usable if browser storage is unavailable. */ }
  return null;
}
function App() {
  const [source, setSource] = useState(sample);
  const [streaming, setStreaming] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [dark, setDark] = useState(false);
  const [localeName, setLocaleName] = useState(savedLocale);
  const [docsRoute, setDocsRoute] = useState(() => readDocsRoute(savedLocale()));
  const [typography, setTypography] = useState<TypographyMode>('standard');
  const [translationMode, setTranslationMode] = useState<TranslationMode | undefined>();
  const [editor, setEditor] = useState(false);
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const [annotations, setAnnotations] = useState<readonly Annotation[]>([]);
  const [textarea, setTextarea] = useState<HTMLTextAreaElement | null>(null);
  const [preview, setPreview] = useState<HTMLDivElement | null>(null);
  const [notesEnabled, setNotesEnabled] = useState(true);
  const [assistantEnabled, setAssistantEnabled] = useState(true);
  const [menu, setMenu] = useState<'load' | 'plugins' | 'translation' | 'locale' | 'typography' | null>(null);
  const [status, setStatus] = useState('');
  const [answerStatus, setAnswerStatus] = useState('');
  const [documentVersion, setDocumentVersion] = useState(0);
  const [preset, setPreset] = useState<string>('welcome');
  const fileInput = useRef<HTMLInputElement>(null);
  const loadRoot = useRef<HTMLDivElement>(null);
  const pluginRoot = useRef<HTMLDivElement>(null);
  const translationRoot = useRef<HTMLDivElement>(null);
  const localeRoot = useRef<HTMLDivElement>(null);
  const typographyRoot = useRef<HTMLDivElement>(null);
  const typographyModes = [{ value: 'knuth-plass', label: 'Knuth–Plass' }, { value: 'standard', label: '标准' }, { value: 'justify', label: '两端对齐' }] as const;
  const locales = [{ value: 'zh-CN', label: '中文' }, { value: 'en', label: 'English' }] as const;
  const translationModes = [{ value: undefined, label: '随段落' }, { value: 'origin', label: '原文' }, { value: 'translation', label: '译文' }, { value: 'both', label: '对照' }] as const;
  useScrollSync(textarea, preview, source);
  const plugins = useMemo(() => {
    const notes = readingNotes();
    const zh = localeName === 'zh-CN';
    const ai = assistant({ label: zh ? '询问助手' : 'Ask assistant', icon: <ToolIcon name="sparkles" />, color: '#B39DDB', prompt: selection => zh ? `请解释「${selection.text}」。` : `Explain “${selection.text}”.`,
      adapter: { async *answer({ selection, signal }) {
        setAnswerStatus(zh ? '回答中' : 'Answering…');
        try {
          for (const chunk of (zh ? ['关于 **', selection.text, '** 的思考。\n\n', '先试着用自己的话概括这段内容，', '再找一个生活中的例子与它联系起来。\n\n', '> 这是一段本地模拟回答，用于体验插件的流式交互。'] : ['Thoughts on **', selection.text, '**.\n\n', 'Try summarizing the passage in your own words, ', 'then connect it to an everyday example.\n\n', '> This is a local simulated response demonstrating streaming plugin interaction.'])) {
            await new Promise<void>((resolve, reject) => {
              if (signal.aborted) { reject(signal.reason); return; }
              const abort = () => { clearTimeout(timer); reject(signal.reason); };
              const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, 160);
              signal.addEventListener('abort', abort, { once: true });
            });
            yield chunk;
          }
          setAnswerStatus(zh ? '回答已完成' : 'Answer complete');
        } catch (error) { setAnswerStatus(signal.aborted ? '' : zh ? '回答失败' : 'Answer failed'); throw error; }
      } },
    });
    // Keep renderers installed so disabling an entry never hides saved notes.
    return [{ ...notes, actions: notesEnabled && !streaming ? notes.actions : [] }, { ...ai, actions: assistantEnabled && !streaming ? ai.actions : [] }];
  }, [notesEnabled, assistantEnabled, streaming, localeName]);
  useEffect(() => {
    if (!streaming) return;
    let position = 0;
    const interval = setInterval(() => { position = Math.min(source.length, position + 5); setCursor(position); if (position === source.length) { setStreaming(false); setStatus('流式演示完成，文本已保留'); } }, 90);
    return () => clearInterval(interval);
  }, [streaming, source]);
  useEffect(() => {
    const navigate = () => {
      const route = readDocsRoute(savedLocale());
      setDocsRoute(route);
      if (route) { setLocaleName(route.language); setStreaming(false); }
      setMenu(null);
      setSelection(null);
    };
    navigate();
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; }, [dark]);
  useEffect(() => {
    try { localStorage.setItem(localeStorageKey, localeName); }
    catch { /* The current locale still works when storage is unavailable. */ }
  }, [localeName]);
  useEffect(() => {
    if (!menu) return;
    const root = menu === 'load' ? loadRoot : menu === 'plugins' ? pluginRoot : menu === 'locale' ? localeRoot : menu === 'typography' ? typographyRoot : translationRoot;
    const outside = (event: PointerEvent) => { if (event.target instanceof Node && !root.current?.contains(event.target)) setMenu(null); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setMenu(null); root.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [menu]);
  const replaceSource = (text: string, id = '') => {
    setStreaming(false); setCursor(0); setSource(text); setPreset(id); setAnnotations([]); setSelection(null); setAnswerStatus(''); setDocumentVersion(value => value + 1); setMenu(null);
  };
  const save = () => {
    try { localStorage.setItem(storageKey, JSON.stringify({ version: 2, source, annotations })); setStatus('已保存到此浏览器，可从加载菜单手动打开'); }
    catch { setStatus('保存失败，请下载 Markdown 保留文本'); }
  };
  const load = () => {
    const data = savedDocument();
    if (!data) { setStatus('还没有可加载的文本'); return; }
    replaceSource(data.source); setAnnotations(data.annotations); setStatus('已加载保存的文本与标记');
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([source], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'limr-notes.md'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus('已下载 Markdown'); setMenu(null);
  };
  return <>
    <header className="demo-header" data-limr-appearance="classic"><a className="demo-brand" href={import.meta.env.BASE_URL}>LiMR <span>Linloir’s limr Is a Markdown Renderer</span></a><div className="demo-header-end"><nav className="demo-controls demo-mode-nav" aria-label="页面 / Pages"><a href="#/playground" aria-current={!docsRoute ? 'page' : undefined}><span className="limr-underline">Playground</span></a><a href={docsHref(localeName, docsRoute?.page)} aria-current={docsRoute ? 'page' : undefined}><span className="limr-underline">Docs</span></a><a href="https://github.com/Linloir/LiMR" target="_blank" rel="noopener noreferrer"><span className="limr-underline">GitHub</span></a></nav><div className="demo-controls demo-header-settings">        <div className="demo-dropdown" ref={localeRoot}>
          <button aria-label="界面语言 / Reader language" title="切换阅读器内置文案 / Reader UI language" aria-expanded={menu === 'locale'} aria-controls="demo-locale-menu" onClick={() => setMenu(value => value === 'locale' ? null : 'locale')}><span className="limr-underline">{locales.find(item => item.value === localeName)!.label}</span><ToolIcon name="chevron" /></button>
          <Dropdown open={menu === 'locale'} id="demo-locale-menu" role="group" aria-label="界面语言 / Reader language">
            {locales.map(item => <button key={item.value} lang={item.value} aria-pressed={localeName === item.value} onClick={() => { setLocaleName(item.value); if (docsRoute) location.hash = docsHref(item.value, docsRoute.page); setMenu(null); localeRoot.current?.querySelector('button')?.focus(); }}><span className="limr-underline">{item.label}</span></button>)}
          </Dropdown>
        </div>
<button className="demo-theme" onClick={() => setDark(!dark)} aria-label={dark ? '浅色' : '深色'} title={dark ? '切换到浅色' : '切换到深色'}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></> : <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.5 8.5 0 1 0 20 14.2Z" />}</svg><span className="limr-underline">{dark ? '浅色' : '深色'}</span></button></div></div></header>
    {docsRoute ? <Documentation route={docsRoute} theme={dark ? 'dark' : 'light'} /> : <>
    <div className="demo-commandbar" data-limr-appearance="classic">
      <nav className="demo-controls demo-document-controls" aria-label="文本操作">
        <button onClick={() => { setStreaming(false); setEditor(!editor); setMenu(null); if (editor) save(); }}><span className="limr-underline">{editor ? '保存' : '编辑'}</span></button>
        <span className="demo-control-divider" />
        <div className="demo-dropdown" ref={loadRoot}><button aria-expanded={menu === 'load'} aria-controls="demo-load-menu" onClick={() => setMenu(value => value === 'load' ? null : 'load')}><span className="limr-underline">加载</span><ToolIcon name="chevron" /></button>
          <Dropdown open={menu === 'load'} id="demo-load-menu" className="demo-load-menu">
            <div role="group" aria-label="文本文件"><button onClick={load}><span className="limr-underline">加载已保存文本</span><small>此浏览器中的文本与标记</small></button><button onClick={() => { fileInput.current?.click(); setMenu(null); }}><span className="limr-underline">打开 Markdown 文件</span><small>从本地 .md 或 .txt 文件载入</small></button><button onClick={download}><span className="limr-underline">下载 Markdown</span><small>导出当前的完整文本</small></button></div>
            <div role="group" aria-label="预设文本" className="demo-dropdown-section"><p className="demo-small-label">预设文本</p>{presets.map(item => <button key={item.id} aria-pressed={preset === item.id} onClick={() => { replaceSource(item.source, item.id); setStatus(`已加载「${item.label}」`); }}><span className="limr-underline">{item.label}</span><small>{item.description}</small></button>)}</div>
          </Dropdown>
        </div>
        <div className="demo-dropdown" ref={pluginRoot}><button aria-expanded={menu === 'plugins'} aria-controls="demo-plugin-menu" onClick={() => setMenu(value => value === 'plugins' ? null : 'plugins')}><span className="limr-underline">插件</span><ToolIcon name="chevron" /></button>
          <Dropdown open={menu === 'plugins'} id="demo-plugin-menu" role="group" aria-label="插件">
            <label className="demo-plugin-option"><input type="checkbox" checked={notesEnabled} onChange={event => setNotesEnabled(event.target.checked)} aria-label="启用旁注与笔记" /><span><strong className="limr-underline">旁注与笔记</strong><small>旁注、笔记、提问与脚注</small></span></label>
            <label className="demo-plugin-option"><input type="checkbox" checked={assistantEnabled} onChange={event => setAssistantEnabled(event.target.checked)} aria-label="启用 AI 问答" /><span><strong className="limr-underline">AI 问答</strong><small>本地模拟回答，无需配置服务</small></span></label>
          </Dropdown>
        </div>
        <input hidden ref={fileInput} type="file" accept=".md,.markdown,.txt,text/plain,text/markdown" aria-label="打开 Markdown 文件" onChange={async event => {
          const file = event.currentTarget.files?.[0]; event.currentTarget.value = ''; if (!file) return;
          try { replaceSource(await file.text()); setStatus(`已加载 ${file.name}`); } catch { setStatus('文件读取失败'); }
        }} />
      </nav>
      <div className="demo-controls demo-session-controls">
        <div className="demo-dropdown demo-translation-control" ref={translationRoot}>
          <button aria-label="全局翻译展示模式" aria-expanded={menu === 'translation'} aria-controls="demo-translation-menu" onClick={() => setMenu(value => value === 'translation' ? null : 'translation')}><span className="limr-underline">{translationModes.find(item => item.value === translationMode)!.label}</span><ToolIcon name="chevron" /></button>
          <Dropdown open={menu === 'translation'} id="demo-translation-menu" role="group" aria-label="全局翻译展示模式">
            {translationModes.map(item => <button key={item.value ?? 'local'} aria-pressed={translationMode === item.value} onClick={() => { setTranslationMode(item.value); setMenu(null); translationRoot.current?.querySelector('button')?.focus(); }}><span className="limr-underline">{item.label}</span></button>)}
          </Dropdown>
        </div>
        <div className="demo-dropdown demo-typography-control" ref={typographyRoot}>
          <button aria-label="排版模式" aria-expanded={menu === 'typography'} aria-controls="demo-typography-menu" onClick={() => setMenu(value => value === 'typography' ? null : 'typography')}><span className="limr-underline">{typographyModes.find(item => item.value === typography)!.label}</span><ToolIcon name="chevron" /></button>
          <Dropdown open={menu === 'typography'} id="demo-typography-menu" role="group" aria-label="排版模式">
            {typographyModes.map(item => <button key={item.value} aria-pressed={typography === item.value} onClick={() => { setTypography(item.value); setMenu(null); typographyRoot.current?.querySelector('button')?.focus(); }}><span className="limr-underline">{item.label}</span></button>)}
          </Dropdown>
        </div><button className="demo-stream-button" disabled={!source.length} aria-pressed={streaming} onClick={() => {
        if (streaming) { setStreaming(false); setStatus('已结束演示，完整文本已恢复'); }
        else { setCursor(0); setStreaming(true); setEditor(false); setStatus(''); setSelection(null); setDocumentVersion(value => value + 1); }
      }}><span className="limr-underline">{streaming ? '结束演示' : '流式演示'}</span></button>
      </div>
    </div>
    <div className="demo-context-line"><span>{editor ? '在左侧写作，在右侧看见变化。' : streaming ? '正在播放当前文本，随时可以结束。' : '选中文字，给想法一点颜色。悬浮色块调整样式，点击工具留下批注。'}</span><output aria-live="polite">{status || answerStatus || `${source.length.toLocaleString()} 字符 · ${annotations.filter(item => item.type === 'highlight').length} 处高亮 · ${annotations.filter(item => item.type !== 'highlight').length} 条注释`}</output></div>
    {streaming && <div className="demo-stream-progress" role="progressbar" aria-label="流式演示进度" aria-valuemin={0} aria-valuemax={source.length} aria-valuenow={cursor}><span style={{ width: `${cursor / Math.max(1, source.length) * 100}%` }} /></div>}
    <div className={editor ? 'demo-workbench' : 'demo-reading'}>
      {editor && <section className="demo-editor-pane"><div className="demo-pane-label">Markdown <span>直接编辑 · 双向滚动同步</span></div><textarea ref={setTextarea} wrap="off" spellCheck={false} className="demo-editor" aria-label="Markdown source" value={source} onChange={event => { setStreaming(false); setSource(event.target.value); setPreset(''); setAnnotations([]); setStatus(''); }} /></section>}
      <section className={editor ? 'demo-preview-pane' : undefined}>{editor && <div className="demo-pane-label">实时预览 <span>选区工具同样可用</span></div>}<div ref={editor ? setPreview : undefined} className={editor ? 'demo-preview-scroll' : undefined}>
        <div className="demo-page"><Reader key={documentVersion} source={streaming ? source.slice(0, cursor) : source} streaming={streaming} theme={dark ? 'dark' : 'light'} typography={typography} parameters={{ translationMode, onTranslationModeChange: setTranslationMode }} locale={localeName === 'zh-CN' ? chinese : english} scrollRoot={editor ? preview : null} toc={!editor} sidebar={!editor} actions={streaming ? [] : undefined} plugins={plugins} annotations={annotations} onAnnotationsChange={setAnnotations} onSelectionChange={setSelection} documentId="demo" /></div>
      </div></section>
    </div>
    <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output>
    </>}
    <footer className="demo-footer">LiMR · A quiet place for words.</footer>
  </>;
}
const fixture = new URLSearchParams(location.search).get('fixture');
if (fixture === 'hydrate') hydrateRoot(document.getElementById('root')!, <HydrationFixture />, { onRecoverableError: error => { document.documentElement.dataset.hydrationError = String(error); } });
else createRoot(document.getElementById('root')!).render(fixture === 'streaming' ? <StreamingFixture /> : fixture === 'media-annotations' ? <MediaAnnotationFixture /> : fixture === 'translation-details' ? <TranslationDetailsFixture /> : fixture === 'media' ? <MediaFixture /> : fixture === 'toolbar' ? <ToolbarFixture /> : fixture === 'assistant-test' ? <PluginFixture /> : fixture === 'sidebar' ? <SidebarFixture /> : fixture === 'selection-bench' ? <SelectionBenchmarkFixture /> : fixture === 'video' ? <VideoFixture /> : fixture === 'overlay' ? <OverlayFixture /> : fixture === 'markers' ? <MarkerFixture /> : fixture === 'visual' ? <VisualFixture /> : fixture === 'scroll' ? <ScrollFixture /> : fixture === 'multiple' ? <MultipleFixture /> : fixture === 'bench' ? <BenchmarkFixture /> : fixture === 'resource' ? <ResourceFixture /> : <App />);
