import { useMemo, useState } from 'react';
import { AnnotationOverlay, AnnotationSidebar, DocumentProvider, Markdown, Reader, SelectionToolbar, TableOfContents, chinese, standard, useLiMR, type AnnotationContentProps, type AnnotationType, type SelectionSnapshot } from '../src';
import { assistant } from '../examples/assistant';

function wait(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const aborted = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', aborted); resolve(); }, milliseconds);
    signal.addEventListener('abort', aborted, { once: true });
  });
}

export function PluginFixture() {
  const [mounted, setMounted] = useState(true);
  const [status, setStatus] = useState('尚未请求');
  const [selection, setSelection] = useState<SelectionSnapshot | null>(null);
  const extensions = useMemo(() => [...standard(), assistant({
    label: '询问助手',
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
  return <div className="demo-page">
    <p>应用插件示例 · 使用本地模拟回答，可替换为应用自己的 Codex 或其他服务适配器。</p>
    <p><button onClick={() => setMounted(!mounted)}>{mounted ? '卸载阅读器' : '挂载阅读器'}</button> <output id="adapter-status">{status}</output></p>
    {mounted && <Reader documentId="plugin-demo" source={'# 插件示例\n\n选中 **重要内容**，再从工具菜单询问助手。\n\n## 另一个章节\n\n正文保持独立。'} extensions={extensions} locale={chinese} onSelectionChange={setSelection} />}
    <output id="selection-data" hidden>{selection ? JSON.stringify(selection) : ''}</output>
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
  return <div className="demo-page"><DocumentProvider source={'Read once.\n\n<video provider="youtube" url="https://www.youtube.com/watch?v=example" />'} annotationTypes={resourceTypes}><ResourceBody /></DocumentProvider></div>;
}
