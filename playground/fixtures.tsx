import { useMemo, useState } from 'react';
import { AnnotationOverlay, AnnotationSidebar, DocumentProvider, Markdown, Reader, SelectionToolbar, TableOfContents, chinese, standard, useLiMR, type Annotation, type AnnotationContentProps, type AnnotationType, type SelectionSnapshot } from '../src';
import { assistant } from '../examples/assistant';

function wait(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const aborted = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', aborted); resolve(); }, milliseconds);
    signal.addEventListener('abort', aborted, { once: true });
  });
}

export function PluginFixture({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const [mounted, setMounted] = useState(true);
  const [status, setStatus] = useState('尚未请求');
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const plugins = useMemo(() => [assistant({
    label: '询问助手',
    prompt: selection => `请解释「${selection.text}」。`,
    adapter: { async *answer({ selection, signal }) {
      setStatus('回答中');
      try {
        for (const chunk of ['关于 **', selection.text, '** 的说明。\n\n', '这段回答使用 LiMR 渲染，', '并通过同一个插件持续更新。']) {
          await wait(350, signal);
          yield chunk;
        }
        setStatus('已完成');
      } catch (error) { setStatus(signal.aborted ? '已取消' : '请求失败'); throw error; }
    } },
  })], []);
  return <div className="demo-page demo-plugin-page">
    <div className="demo-plugin-intro"><p>选中正文，试试在阅读中发起一次问答。</p><p>插件提供菜单、角标和流式卡片。这里使用本地模拟回答。</p>
    <div className="demo-controls"><button onClick={() => setMounted(!mounted)}>{mounted ? '卸载阅读器' : '挂载阅读器'}</button> <output id="adapter-status">{status}</output></div></div>
    {mounted && <Reader documentId="plugin-demo" theme={theme} source={'# 插件示例\n\n选中 **重要内容**，再从工具菜单询问助手。\n\n## 另一个章节\n\n正文保持独立。'} plugins={plugins} locale={chinese} onSelectionChange={setSelection} />}
    <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output>
  </div>;
}

const sidebarSource = '# 插件示例\n\n选中 **重要内容**，再从工具菜单询问助手。\n\n单条引用<ref id="single" />与多条引用<ref ids="one,two" />。\n\n## 另一个章节\n\n正文保持独立。\n\n<citation id="single" title="CommonMark Specification" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />\n\n<citation id="one" title="First citation" description="第一条引用的描述。" />\n\n<citation id="two" title="Last citation" description="Markdown 的语法与参考示例。支持 **富文本** 描述。" />';
const sidebarPlugins = [assistant({ label: '询问助手', adapter: { async *answer() { yield '本地回答'; } } })];
const sidebarAnnotations: Annotation[] = Array.from({ length: 12 }, (_, index) => ({
  id: `answer-${index}`, type: 'assistant', range: { start: sidebarSource.indexOf('重要内容'), end: sidebarSource.indexOf('重要内容') + 4 },
  data: { text: `关于 **重要内容** 的说明 ${index + 1}。\n\n这段回答使用 LiMR 渲染，并通过同一个插件持续更新。`, question: `问题 ${index + 1}：请解释这段内容，并给出一个具体的例子。`, status: 'complete' },
}));
const paletteTypes: AnnotationType[] = [{
  type: 'palette', label: 'Custom palette', color: '#d97706',
  sidebar: { color: '#2563eb', borderColor: '#9333ea', titleColor: '#059669', textColor: '#be185d', excerptColor: '#4f46e5', previewColor: '#0f766e', previewLines: 3,
    Preview: ({ data }) => data === 'hide' ? null : <p>Module preview <span style={{ color: '#b45309' }}>Inline preview</span> {'Long subtitle for configurable preview lines. '.repeat(12)}</p> },
  Content: () => <p>Module text <span style={{ color: '#0369a1' }}>Inline color</span></p>,
}];
export function SidebarFixture() {
  const [annotations, setAnnotations] = useState<readonly Annotation[]>(sidebarAnnotations);
  const [long, setLong] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [preview, setPreview] = useState<'custom' | 'disabled' | 'empty'>('custom');
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const nested = new URLSearchParams(location.search).has('nested');
  const previewExamples = new URLSearchParams(location.search).has('previews') ? '\n\n摘要<ref id="summary" />，链接<ref id="url" />，标题<ref id="title" />。\n\n<citation id="summary" summary="简短**摘要** &amp; 示例" description="完整描述不覆盖摘要。" url="https://example.com/full" />\n\n<citation id="url" url="https://example.com/reference" />\n\n<citation id="title" title="Title fallback" />' : '';
  const source = long ? sidebarSource + '\n\n' + Array.from({ length: 12 }, (_, index) => `## Section ${index}\n\n${'正文跟随页面滚动。'.repeat(30)}\n\n引用<ref id="single" />。`).join('\n\n') : sidebarSource + previewExamples;
  const content = <Reader documentId="sidebar-fixture" source={source} annotations={annotations} onAnnotationsChange={setAnnotations} plugins={sidebarPlugins} theme={theme} locale={chinese} scrollRoot={scrollRoot} />;
  return <div className="demo-page">
    <div className="demo-controls">
      <button onClick={() => setAnnotations(values => [...values, { ...sidebarAnnotations[0], id: `added-${values.length}` }])}>Add annotation</button>
      <button onClick={() => setAnnotations(values => values.map(value => ({ ...value, data: { ...(value.data as object), text: '流式回答中的更多内容。\n\n'.repeat(40), status: 'streaming' } })))}>Stream answer</button>
      <button onClick={() => setLong(value => !value)}>Toggle long document</button>
      <button onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')}>Theme</button>
      <button onClick={() => setPreview(value => value === 'custom' ? 'disabled' : value === 'disabled' ? 'empty' : 'custom')}>Toggle preview</button>
    </div>
    {nested ? <div id="sidebar-scroll-root" ref={setScrollRoot} style={{ height: 520, overflow: 'auto', border: '1px solid #aaa' }}>{content}</div> : content}
    <Reader documentId="palette-fixture" source={'# 颜色配置\n\nModule palette.\n\n第二段正文。\n\n第三段正文。'} annotationTypes={preview === 'disabled' ? [{ ...paletteTypes[0], sidebar: { ...paletteTypes[0].sidebar, Preview: false } }] : paletteTypes} annotations={[{ id: 'palette', type: 'palette', data: preview === 'empty' ? 'hide' : undefined, range: { start: 8, end: 14 } }]} toc={false} theme={theme} />
  </div>;
}

export function ScrollFixture() {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const source = useMemo(() => Array.from({ length: 30 }, (_, i) => `## Section ${i + 1}\n\n${'A paragraph in a shared scrolling region. '.repeat(25)} <ref id="ref-${i}" />\n\n<citation id="ref-${i}" title="Reference ${i + 1}" description="A **nested** description." />`).join('\n\n'), []);
  return <div className="demo-page"><div ref={setScrollRoot} id="scroll-root" style={{ height: 520, overflowY: 'auto', border: '1px solid #aaa' }}>
    <DocumentProvider documentId="scroller" source={source} scrollRoot={scrollRoot} locale={chinese}>
      <div style={{ display: 'grid', gridTemplateColumns: '190px minmax(0,1fr) 260px', gap: 24, padding: 20, alignItems: 'start' }}>
        <TableOfContents style={{ position: 'sticky', top: 0, height: 420 }} /><Markdown /><AnnotationSidebar />
      </div><AnnotationOverlay disabled /><SelectionToolbar />
    </DocumentProvider>
  </div></div>;
}

export function MultipleFixture() {
  const source = '# Same heading\n\n<question answer="[0]"><question-content>Choose</question-content><question-sel>A</question-sel><question-sel>B</question-sel></question>\n\n## Next';
  return <div className="demo-page"><Markdown source={source} /><Markdown source={source} /></div>;
}

interface RemoteData { version: number; title?: string }
const remoteType: AnnotationType<RemoteData> = {
  type: 'remote', label: 'Remote', icon: '◎',
  overlay: { expand: { placement: 'center', height: '80dvh' } },
  load: async (annotation, { signal }) => {
    const response = await fetch(`/mock/annotation?version=${annotation.data?.version ?? 1}`, { signal });
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  },
  Content: ({ data, loading, error, retry }: AnnotationContentProps<RemoteData>) => <div>{loading ? 'Loading resource' : error ? <button onClick={retry}>Retry</button> : <span>{data?.title}</span>}</div>,
};
function ResourceControls() {
  const commands = useLiMR();
  return <div><button onClick={() => commands.invalidateAnnotation('remote')}>Refresh resource</button><button onClick={() => commands.updateAnnotation('remote', { data: { version: 2 } })}>Change resource</button></div>;
}
function ResourceBody() {
  const commands = useLiMR();
  // The fixture uses a callback ref so creation belongs to the document scope.
  const attach = useMemo(() => (element: HTMLDivElement | null) => {
    if (element) commands.addAnnotation({ id: 'remote', type: 'remote', range: { start: 0, end: 10 }, data: { version: 1 } });
  }, [commands]);
  return <div ref={attach}><ResourceControls /><Markdown /><AnnotationOverlay /></div>;
}
const resourceTypes = [remoteType];
export function ResourceFixture() {
  return <div className="demo-page"><DocumentProvider source={'Read once.\n\n<video provider="youtube" url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" loading="click" />'} annotationTypes={resourceTypes}><ResourceBody /></DocumentProvider></div>;
}
