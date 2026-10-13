import { useEffect, useMemo, useRef, useState } from 'react';
import { Reader, ToolIcon, chinese, english, safeUrl, type NodeRendererProps } from '../src';

export type DocsLanguage = 'zh-CN' | 'en';
export interface DocsRoute { language: DocsLanguage; page: string; heading?: string }
const documents = import.meta.glob<string>('../docs/{zh-CN,en}/*.md', { query: '?raw', import: 'default', eager: true });
const assets = import.meta.glob<string>('../docs/assets/*.svg', { query: '?url', import: 'default', eager: true });
const entries = [
  ['README', '文档概览', 'Overview'],
  ['getting-started', '快速开始', 'Getting started'],
  ['modules', '内置模块', 'Built-in modules'],
  ['syntax', '默认语法', 'Default syntax'],
  ['integration', '项目集成', 'Application integration'],
  ['annotations', '标注与选区', 'Annotations and selection'],
  ['extensions', '扩展开发', 'Extension development'],
  ['plugin-packages', '插件模块包', 'Plugin packages'],
  ['styles', '样式与字体', 'Styles and fonts'],
  ['api', 'API 参考', 'API reference'],
  ['architecture', '架构与行为', 'Architecture and behavior'],
  ['performance', '性能与限制', 'Performance and limits'],
  ['ai-skills', 'AI Skills', 'AI Skills'],
] as const;

export function docsHref(language: DocsLanguage, page = 'README', heading?: string) {
  return `#/docs/${language}/${page}${heading ? `?heading=${encodeURIComponent(heading)}` : ''}`;
}

export function readDocsRoute(language: DocsLanguage = 'zh-CN'): DocsRoute | null {
  if (!location.hash.startsWith('#/docs')) return null;
  const [path, query = ''] = location.hash.slice(1).split('?');
  const parts = path.split('/');
  return {
    language: parts[2] === 'en' ? 'en' : parts[2] === 'zh-CN' ? 'zh-CN' : language,
    page: entries.some(([id]) => id === parts[3]) ? parts[3] : 'README',
    heading: new URLSearchParams(query).get('heading') ?? undefined,
  };
}

function resolveLink(value: unknown, route: DocsRoute): string | undefined {
  const href = safeUrl(value);
  if (!href) return undefined;
  const download = /^https:\/\/linloir\.github\.io\/LiMR\/downloads\/(limr-[\w.-]+\.zip)$/.exec(href);
  if (download) return `${import.meta.env.BASE_URL}downloads/${download[1]}`;
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) return href;
  const url = new URL(href, `https://docs.local/docs/${route.language}/${route.page}.md`);
  const match = /^\/docs\/(zh-CN|en)\/([\w-]+)\.md$/.exec(url.pathname);
  if (match && entries.some(([id]) => id === match[2])) return docsHref(match[1] as DocsLanguage, match[2], url.hash.slice(1));
  if (url.pathname === '/README.md' || url.pathname === '/docs/README.md') return docsHref('zh-CN');
  if (url.pathname === '/README.en.md') return docsHref('en');
  return `https://github.com/Linloir/LiMR/blob/main${url.pathname}${url.hash}`;
}

/** Documentation navigation is an application concern, independent of LiMR. */
export function Documentation({ route, theme }: { route: DocsRoute; theme: 'light' | 'dark' }) {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const content = useRef<HTMLDivElement>(null);
  const zh = route.language === 'zh-CN';
  const source = documents[`../docs/${route.language}/${route.page}.md`];
  const documentId = `docs-${route.language}-${route.page}`;
  const components = useMemo(() => ({
    image: ({ node }: NodeRendererProps) => {
      const path = new URL(String(node.url ?? ''), `https://docs.local/docs/${route.language}/${route.page}.md`).pathname;
      return <img src={assets[`..${path}`] ?? safeUrl(node.url, true)} alt={String(node.alt ?? '')} title={node.title ? String(node.title) : undefined} loading="lazy" decoding="async" />;
    },
    link: ({ node, children }: NodeRendererProps) => {
      const href = resolveLink(node.url, route);
      const external = href?.startsWith('https://');
      return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
    },
  }), [route.language, route.page]);

  useEffect(() => {
    setNavigationOpen(false);
    const frame = requestAnimationFrame(() => {
      const heading = route.heading && document.getElementById(`${documentId}-${route.heading}`);
      if (heading) heading.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: 'instant' });
      content.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [documentId, route.heading]);

  return <div className="demo-docs" data-limr-appearance="classic">
    <aside className="demo-docs-directory">
      <div className="demo-docs-directory-heading">{zh ? '文档目录' : 'Documentation'}</div>
      <button type="button" className="demo-docs-toggle" aria-controls="demo-docs-navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(value => !value)}>
        <span className="limr-underline">{zh ? '文档目录' : 'Documentation'} · {entries.find(([id]) => id === route.page)?.[zh ? 1 : 2]}</span><ToolIcon name="chevron" />
      </button>
      <nav id="demo-docs-navigation" className="demo-docs-links" data-open={navigationOpen || undefined} aria-label={zh ? '文档目录' : 'Documentation'}>
        {entries.map(([id, titleZh, titleEn]) => <a key={id} href={docsHref(route.language, id)} aria-current={route.page === id ? 'page' : undefined}><span className="limr-underline">{zh ? titleZh : titleEn}</span></a>)}
      </nav>
    </aside>
    <div className="demo-docs-article" ref={content} tabIndex={-1} lang={route.language}>
      {route.page === 'ai-skills' && <div className="demo-controls demo-docs-downloads">
        <a href={`${import.meta.env.BASE_URL}downloads/limr-use.zip`} download><ToolIcon name="note" /><span className="limr-underline">{zh ? '下载' : 'Download'} limr-use</span></a>
        <a href={`${import.meta.env.BASE_URL}downloads/limr-plugin-development.zip`} download><ToolIcon name="note" /><span className="limr-underline">{zh ? '下载' : 'Download'} limr-plugin-development</span></a>
      </div>}
      <Reader key={documentId} documentId={documentId} source={source ?? '# Document unavailable'} components={components}
        locale={zh ? chinese : english} theme={theme} toc={false} sidebar={false} fillHeight={false} />
    </div>
  </div>;
}
