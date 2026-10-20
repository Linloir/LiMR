import { useEffect, useRef, useState, type ReactNode } from 'react';
import { docsHref } from './Documentation';
import { HomeRenderDemo, HomeStreamDemo, HomeTypographyDemo } from './HomeDemos';
import './homepage.css';
import performanceMetrics from '../benchmarks/results/home-performance.json';

type Language = 'zh-CN' | 'en';
type HomeProps = { locale: Language; theme: 'light' | 'dark' };

type HomeIconName = 'source' | 'annotation' | 'type' | 'plugin';

/** One optical grid, stroke, and fixed slot for the homepage's feature icons. */
function HomeIcon({ name }: { name: HomeIconName }) {
  const shapes: Record<HomeIconName, ReactNode> = {
    source: <path d="m8 5-4 7 4 7m8-14 4 7-4 7M14 4l-4 16" />,
    annotation: <><path d="M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3l-3-3-3 3Z" /><path d="M8 9h8M8 13h5" /></>,
    type: <><path d="m4 20 3.75-16 3.75 16M5.4 14h4.7" /><ellipse cx="17" cy="15.5" rx="3" ry="4.5" /><path d="M20 11v9" /></>,
    plugin: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" /></>,
  };
  return <svg className="home-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}

function Arrow({ diagonal = false, direction = 'right' }: { diagonal?: boolean; direction?: 'right' | 'down' | 'up' }) {
  return <svg className="home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : direction === 'down' ? 'M12 4v16m-6-6 6 6 6-6' : direction === 'up' ? 'M12 20V4m-6 6 6-6 6 6' : 'M4 12h16m-6-6 6 6-6 6'} /></svg>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <div className="home-eyebrow"><span className="home-section-number">{number}</span>{children}</div>;
}

function CopyButton({ value, zh }: { value: string; zh: boolean }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  useEffect(() => { setStatus('idle'); }, [value]);
  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2500);
    return () => window.clearTimeout(timer);
  }, [status]);
  return <button type="button" className="home-copy" onClick={async () => {
    try { await navigator.clipboard.writeText(value); setStatus('copied'); }
    catch { setStatus('error'); }
  }} aria-label={zh ? '复制代码' : 'Copy code'}>
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">{status === 'copied' ? <path d="m4 10 4 4 8-8" /> : <><rect x="6" y="6" width="10" height="11" rx="1.5" /><path d="M12 6V3H3v10h3" /></>}</svg>
    <span role="status" className="limr-underline">{status === 'copied' ? (zh ? '已复制' : 'Copied') : status === 'error' ? (zh ? '请手动选择复制' : 'Select to copy') : (zh ? '复制' : 'Copy')}</span>
  </button>;
}

function Code({ source }: { source: string }) {
  return <pre className="home-code"><code>{source.split('\n').map((line, index) => <span className="home-code-line" key={index}><span className="home-line-number" aria-hidden="true">{index + 1}</span><span>{line.split(/('[^']*'|"[^"]*"|\b(?:import|from|const|return|export|function)\b)/g).map((part, token) => <span key={token} className={/^['"]/.test(part) ? 'home-token-string' : /^(import|from|const|return|export|function)$/.test(part) ? 'home-token-keyword' : undefined}>{part}</span>)}</span></span>)}</code></pre>;
}

function PaperArt({ zh }: { zh: boolean }) {
  const art = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  return <div className="home-art" ref={art} aria-hidden="true" onPointerMove={event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      art.current?.style.setProperty('--paper-x', `${x * 7}deg`);
      art.current?.style.setProperty('--paper-y', `${-y * 7}deg`);
    });
  }} onPointerLeave={() => {
    cancelAnimationFrame(frame.current);
    art.current?.style.setProperty('--paper-x', '0deg');
    art.current?.style.setProperty('--paper-y', '0deg');
  }}>
    <div className="home-art-grid" />
    <span className="home-art-coordinate home-art-coordinate-top">FIG. 01 — THE READING SURFACE</span>
    <svg className="home-orbit" viewBox="0 0 600 520" fill="none"><ellipse cx="310" cy="270" rx="274" ry="191" transform="rotate(-27 310 270)" /><ellipse cx="310" cy="270" rx="240" ry="231" transform="rotate(32 310 270)" /><path d="M18 270h27m-13-13v26M550 270h27m-13-13v26" /><circle cx="497" cy="100" r="4" /></svg>
    <div className="home-paper-stack">
      <div className="home-paper-back home-paper-back-two" /><div className="home-paper-back" />
      <div className="home-paper">
        <div className="home-paper-meta"><span>LiMR JOURNAL</span><span>001</span></div>
        <span className="home-paper-kicker">THE ART OF READING</span>
        <h2>{zh ? <>文字之间，<br />大有可为。</> : <>A little space.<br />A world of ideas.</>}</h2>
        <p>{zh ? <>好的阅读体验，藏在每一次自然的断行、<mark>恰到好处的注解</mark>，和流动的思绪里。</> : <>A good reading experience lives in a thoughtful line break, <mark>a note in the margin</mark>, and an uninterrupted thought.</>}</p>
        <div className="home-paper-lines"><i /><i /><i /></div>
        <div className="home-paper-equation">E = mc<sup>2</sup><span>(1)</span></div>
        <div className="home-paper-bottom"><span>Markdown, thoughtfully rendered.</span><span>↗</span></div>
      </div>
      <div className="home-paper-note"><span className="home-note-label"><i />{zh ? '一条旁注' : 'A MARGIN NOTE'}</span><p>{zh ? '让想法停在它发生的地方。' : 'Keep a thought where it belongs.'}</p><span className="home-note-rule" /></div>
      <div className="home-paper-source"><span className="home-source-dot" /><code>&lt;<b>Reader</b> source={'{'}ideas{'}'} /&gt;</code><span className="home-source-cursor" /></div>
    </div>
    <span className="home-art-coordinate home-art-coordinate-bottom">SOURCE → MEANING → EXPERIENCE</span>
  </div>;
}

function ExtensionExplorer({ locale }: { locale: Language }) {
  const zh = locale === 'zh-CN';
  const [active, setActive] = useState(0);
  const options = [
    { label: zh ? '语法扩展' : 'Syntax', icon: 'source' as const, title: zh ? '给内容一种新的表达。' : 'A new language for your content.', description: zh ? '用 defineBlock 定义内容块，让自定义标签、指令语法和 React 组件自然相连。公式、图表之外，还可以是你自己的交互。' : 'Connect custom tags and directives to React components with defineBlock. Go beyond formulas and diagrams to interactions of your own.', page: 'extensions', code: "import { defineBlock, Reader } from '@linloir/limr';\n\nconst thought = defineBlock({\n  name: 'thought',\n  component: ({ children }) => (\n    <aside className=\"thought\">{children}</aside>\n  ),\n});\n\n<Reader source={source} plugins={[thought]} />" },
    { label: zh ? '旁注扩展' : 'Annotations', icon: 'annotation' as const, title: zh ? '让每个想法，都有落点。' : 'Give every thought a place.', description: zh ? '为笔记、引用或提问定义独立的标注类型。插件掌管卡片内容，LiMR 负责选区、定位、浮层与动效。' : 'Define your own notes, references, and questions. Your plugin owns the card; LiMR handles selection, positioning, overlays, and motion.', page: 'annotations', code: "import { defineAnnotation, Reader } from '@linloir/limr';\n\nconst note = defineAnnotation<{ text: string }>({\n  type: 'my:note',\n  label: 'Note',\n  color: '#81967a',\n  Content: ({ data }) => <p>{data?.text}</p>,\n});\n\n<Reader source={source} plugins={[note]} />" },
    { label: zh ? '样式扩展' : 'Appearance', icon: 'type' as const, title: zh ? '带上你自己的审美。' : 'Make room for your aesthetic.', description: zh ? '从字体、行距到色彩与侧栏，以 CSS 变量塑造阅读界面。appearance 会同步到浮层，让细节保持一致。' : 'Shape typography, color, and layout through CSS variables. The appearance follows portalled controls, keeping every detail consistent.', page: 'styles', code: "/* paper.css */\n[data-limr-appearance='paper'] {\n  --limr-font-text: Georgia, serif;\n  --limr-content-width: 820px;\n  --limr-accent: #8b6548;\n  --limr-line-height: 1.9;\n}\n\n/* Your reader */\n<Reader source={source} appearance=\"paper\" />" },
    { label: zh ? '插件能力' : 'Plugins', icon: 'plugin' as const, title: zh ? '从阅读器，生长为你的产品。' : 'From a reader to your product.', description: zh ? '组合语法、渲染组件、标注、选区动作与参数，封装为可复用插件。用公开接口接入笔记工具或你自己的 AI 服务。' : 'Package syntax, renderers, annotations, selection actions, and parameters into reusable extensions. Connect reading tools or your own AI service through public APIs.', page: 'extensions', code: "import { defineExtension, Reader } from '@linloir/limr';\n\nconst readingTools = defineExtension({\n  name: 'my:reading-tools',\n  // Combine your extension modules\n  components: {},\n  annotationTypes: [],\n  actions: [],\n});\n<Reader source={source} plugins={[readingTools]} />" },
  ];
  const selected = options[active];
  return <div className="home-extension-explorer">
    <div className="home-extension-tabs" role="tablist" aria-label={zh ? '扩展能力' : 'Extension capabilities'}>{options.map((option, index) => <button type="button" key={option.page + index} role="tab" id={`home-extension-tab-${index}`} aria-selected={index === active} aria-controls="home-extension-panel" tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
      let next: number | undefined;
      if (event.key === 'ArrowRight') next = (active + 1) % options.length;
      if (event.key === 'ArrowLeft') next = (active + options.length - 1) % options.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = options.length - 1;
      if (next !== undefined) { event.preventDefault(); setActive(next); document.getElementById(`home-extension-tab-${next}`)?.focus(); }
    }}><span className="home-extension-symbol"><HomeIcon name={option.icon} /></span><span className="limr-underline">{option.label}</span><span className="home-tab-index">0{index + 1}</span></button>)}</div>
    <div className="home-extension-panel" role="tabpanel" id="home-extension-panel" aria-labelledby={`home-extension-tab-${active}`} tabIndex={0}>
      <div className="home-extension-copy home-panel-enter" key={`${active}-copy`}><div className="home-extension-glyph" aria-hidden="true"><HomeIcon name={selected.icon} /><span>+</span></div><h3>{selected.title}</h3><p>{selected.description}</p><a className="home-link" href={docsHref(locale, selected.page)}><span className="limr-underline">{zh ? '探索开发接口' : 'Explore the API'}</span><Arrow /></a></div>
      <div className="home-extension-code home-panel-enter" key={`${active}-code`}><div className="home-code-heading"><span>{active === 2 ? 'paper.css · Reader.tsx' : 'extension.tsx'}</span><CopyButton value={selected.code} zh={zh} /></div><Code source={selected.code} /></div>
    </div>
    <p className="home-extension-footnote"><span>+</span>{zh ? 'plugins 追加你的能力，保留默认模块。也可以用 extensions 完整定义渲染组合。' : 'plugins adds your capabilities to the defaults. Use extensions when you want to compose the entire renderer.'}</p>
  </div>;
}

function QuickStart({ locale }: { locale: Language }) {
  const zh = locale === 'zh-CN';
  const [manager, setManager] = useState('npm');
  const command = `${manager} ${manager === 'npm' ? 'install' : 'add'} @linloir/limr`;
  const source = `import { Reader${zh ? ', chinese' : ''} } from '@linloir/limr';\nimport '@linloir/limr/styles.css';\nimport '@linloir/limr/math.css';\n\nconst source = '# ${zh ? '你好，LiMR' : 'Hello, LiMR'}\\n\\n${zh ? '让想法自然呈现。' : 'Give your ideas room to breathe.'}';\n\nexport default function App() {\n  return <Reader source={source}${zh ? ' locale={chinese}' : ''} />;\n}`;
  return <section className="home-section home-start" id="home-start" data-home-reveal>
    <div className="home-start-copy"><SectionLabel number="05">START BUILDING</SectionLabel><h2>{zh ? <>好的阅读体验，<br />从这一行开始。</> : <>A better reading<br />experience starts here.</>}</h2><p>{zh ? '默认模块与阅读界面已就绪。把 Markdown 交给 LiMR，把时间留给你的产品。' : 'The modules and reading interface are ready. Bring your Markdown, and keep your focus on the product.'}</p>
      <ol className="home-start-steps"><li><span>01</span><div><strong>{zh ? '安装到 React 项目' : 'Add to your React app'}</strong><small>React 18.3 / 19 · ESM · Node.js 20+</small></div></li><li><span>02</span><div><strong>{zh ? '引入样式，传入文本' : 'Import styles. Pass your text.'}</strong><small>{zh ? '公式内容额外引入 math.css' : 'Include math.css for mathematical notation'}</small></div></li><li><span>03</span><div><strong>{zh ? '按需拓展你的阅读体验' : 'Make the experience your own'}</strong><small>{zh ? '接入流式输出、主题与插件' : 'Add streaming, your theme, and plugins'}</small></div></li></ol>
      <a href={docsHref(locale, 'getting-started')} className="home-link"><span className="limr-underline">{zh ? '阅读完整接入指南' : 'Read the getting started guide'}</span><Arrow /></a>
    </div>
    <div className="home-start-code"><div className="home-install"><div className="home-code-heading"><div className="home-manager-tabs" role="group" aria-label={zh ? '包管理器' : 'Package manager'}>{['npm', 'pnpm', 'yarn'].map(item => <button type="button" key={item} aria-pressed={manager === item} onClick={() => setManager(item)}><span className="limr-underline">{item}</span></button>)}</div><CopyButton value={command} zh={zh} /></div><div className="home-install-command"><span aria-hidden="true">$</span><code>{command}</code></div></div>
      <div className="home-code-heading"><span><i className="home-file-dot" />App.tsx</span><CopyButton value={source} zh={zh} /></div><Code source={source} />
      <a className="home-start-skill" href={docsHref(locale, 'ai-skills')}><span>✳</span><span className="limr-underline">{zh ? '和 AI 一起开发？为你的 Agent 安装 LiMR Skills。' : 'Building with AI? Give your agent LiMR Skills.'}</span><Arrow diagonal /></a>
    </div>
  </section>;
}

export default function HomePage({ locale, theme }: HomeProps) {
  const zh = locale === 'zh-CN';
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('home-in-view'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    root.current?.querySelectorAll('[data-home-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => {
    const target = document.getElementById(id);
    target?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    target?.querySelector<HTMLElement>('button, a')?.focus({ preventScroll: true });
  };
  return <main ref={root} className="home" lang={locale} data-limr-appearance="classic">
    <section className="home-hero">
      <div className="home-hero-copy"><div className="home-eyebrow"><span className="home-star">✳</span>MADE FOR WORDS. BUILT FOR REACT.</div>
        <h1>{zh ? <>让文字，<br />成为<span className="home-title-accent">阅读体验<svg viewBox="0 0 360 17" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11C93 2 227 1 357 6M31 15c92-8 204-9 302-5" /></svg></span>。</> : <>Words, made<br /><span className="home-title-accent">wonderful.<svg viewBox="0 0 360 17" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11C93 2 227 1 357 6M31 15c92-8 204-9 302-5" /></svg></span></> }</h1>
        <p className="home-hero-description">{zh ? <>一个为阅读而生的 React Markdown 渲染器。<br />细致的排版、自由的扩展、流畅的生成，<br className="home-desktop-break" />让每一次表达，都值得细读。</> : <>A React Markdown renderer made for reading.<br />Thoughtful typography, expressive extensions, and fluid streaming. Give every idea room to breathe.</>}</p>
        <div className="home-hero-actions"><a href="#/playground" className="home-button home-button-primary"><span className="limr-underline">{zh ? '进入 Playground' : 'Open Playground'}</span><Arrow /></a><button type="button" className="home-button home-button-secondary" onClick={() => scrollTo('home-start')}><span className="limr-underline">{zh ? '快速开始' : 'Get started'}</span><Arrow direction="down" /></button></div>
        <button type="button" className="home-hero-install" onClick={() => scrollTo('home-start')}><span aria-hidden="true">$</span><code className="limr-underline">npm install @linloir/limr</code><Arrow diagonal /></button>
      </div>
      <PaperArt zh={zh} />
      <div className="home-hero-bottom"><span>LINLOIR’S limr IS A MARKDOWN RENDERER</span><button type="button" onClick={() => scrollTo('home-render')}><span className="limr-underline">{zh ? '向下，遇见更多可能' : 'Scroll to explore'}</span><Arrow direction="down" /></button></div>
    </section>
    <div className="home-principles"><span>{zh ? '为你的下一次创造准备好' : 'READY FOR YOUR NEXT IDEA'}</span><span className="home-principle"><span>React 18.3 / 19</span></span><span className="home-principle"><span>TypeScript</span></span><span className="home-principle"><span>{zh ? '自由扩展' : 'Extensible'}</span></span><a className="home-principle" href="https://github.com/Linloir/LiMR/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><span className="limr-underline">MIT {zh ? '开源' : 'Open source'}</span></a></div>
    <section className="home-section home-render" id="home-render" data-home-reveal><div className="home-section-heading"><div><SectionLabel number="01">BEYOND PLAIN TEXT</SectionLabel><h2>{zh ? <>不止呈现文字。<br />让内容，丰盛起来。</> : <>More than text.<br />A richer way to read.</>}</h2></div><div className="home-section-intro"><p>{zh ? '从一段随笔到一篇论文，代码、公式、表格、引用与图表自然共处。默认模块开箱即用，每一种内容都有自己的位置。' : 'From a short note to a research paper, code, math, tables, references, and diagrams live together. Built-in modules give each kind of content its place.'}</p><a className="home-link" href={docsHref(locale, 'syntax')}><span className="limr-underline">{zh ? '查看完整语法' : 'Explore the syntax'}</span><Arrow /></a></div></div>
      <div className="home-render-stage"><div className="home-stage-caption"><span><i className="home-live-dot" />LIVE RENDERING</span><span>{zh ? '真实组件，可以交互' : 'Real components. Real interactions.'}</span></div><HomeRenderDemo theme={theme} locale={locale} /></div>
      <div className="home-capabilities">{['CommonMark + GFM', 'Shiki', 'KaTeX', 'Mermaid', zh ? '引用与脚注' : 'Citations & footnotes', zh ? '交互内容块' : 'Interactive blocks'].map(item => <span key={item}>{item}</span>)}</div>
    </section>
    <section className="home-section home-extend" data-home-reveal><div className="home-section-heading"><div><SectionLabel number="02">YOURS TO EXTEND</SectionLabel><h2>{zh ? <>恰好够用。<br />也可以，无限延展。</> : <>Everything you need.<br />Room for everything else.</>}</h2></div><p className="home-section-intro">{zh ? '一个统一的扩展接口，把你的想法接进阅读流程。从一个内容块，到一套完整的阅读工具。' : 'One extension model connects your ideas to the reading experience. Start with a content block. Build a complete set of reading tools.'}</p></div><ExtensionExplorer locale={locale} /></section>
    <section className="home-section home-reading" data-home-reveal><div className="home-section-heading"><div><SectionLabel number="03">EVERY DETAIL, CONSIDERED</SectionLabel><h2>{zh ? '静下来的精致，流动时的从容。' : 'Beautiful at rest. Fluent in motion.'}</h2></div></div>
      <div className="home-reading-grid"><article className="home-reading-panel"><div className="home-reading-heading"><span className="home-mini-label">01 / TYPOGRAPHY</span><h3>{zh ? '让每一行，都恰如其分。' : 'Every line, in its right place.'}</h3><p>{zh ? 'Knuth–Plass 从整段文字寻找更均衡的断行，兼顾字词间距与连字符。调整版宽，感受排版的呼吸。' : 'Knuth–Plass balances line breaks, word spacing, and hyphenation across the paragraph. Adjust the width and feel the difference.'}</p></div><HomeTypographyDemo theme={theme} locale={locale} /><a className="home-link home-panel-link" href={docsHref(locale, 'knuth-plass-performance')}><span className="limr-underline">{zh ? '了解 KP 排版' : 'Inside Knuth–Plass'}</span><Arrow /></a></article>
      <article className="home-reading-panel"><div className="home-reading-heading"><span className="home-mini-label">02 / STREAMING</span><h3>{zh ? '思绪在生成，阅读已开始。' : 'Ideas are forming. Reading begins.'}</h3><p>{zh ? '逐步传入累积文本，LiMR 接住每一次更新。未完成语法平稳过渡，文字、代码与公式自然浮现。' : 'Pass the accumulated text as it arrives. LiMR handles incomplete syntax while text, code, and formulas come into view.'}</p></div><HomeStreamDemo theme={theme} locale={locale} /><a className="home-link home-panel-link" href={docsHref(locale, 'integration')}><span className="limr-underline">{zh ? '接入你的 AI 输出' : 'Connect your AI output'}</span><Arrow /></a></article></div>
    </section>
    <section className="home-performance" data-home-reveal><div className="home-performance-top"><div><SectionLabel number="04">LIGHT ON ITS FEET</SectionLabel><h2>{zh ? <>内容尽管丰富。<br />阅读，依然轻快。</> : <>Rich in possibility.<br />Light in motion.</>}</h2></div><p>{zh ? '从长篇文档到持续生成的回答，给丰富的内容一个从容的界面。公开基准、可复现测试，让体验有据可依。' : 'From long documents to streaming answers, give rich content a responsive home. Open benchmarks and reproducible tests back up the experience.'}</p></div>
      <div className="home-metrics"><a href={docsHref(locale, 'performance')}><span className="home-metric-value">{performanceMetrics.fullMountSeconds}<small>s</small></span><strong>{zh ? '约 87.8 万字符全文挂载' : '877,782-character full document mount'}</strong><span>{zh ? '完整正文 DOM · 五次运行中位数' : 'Full document DOM · median of five runs'}</span><Arrow diagonal /></a><a href={docsHref(locale, 'performance')}><span className="home-metric-value">{performanceMetrics.richStreamP95Ms}<small>ms</small></span><strong>{zh ? '丰富内容流式更新 P95' : 'Rich-content streaming update P95'}</strong><span>{zh ? '保留默认模块、动画、样式与字体' : 'Default modules, motion, styles, and fonts'}</span><Arrow diagonal /></a><a href={docsHref(locale, 'knuth-plass-performance')}><span className="home-metric-value">{performanceMetrics.kpPrepareSolveMs}<small>ms</small></span><strong>{zh ? '10,000 词 KP 准备与求解' : 'KP preparation + solve for 10,000 words'}</strong><span>{zh ? '纯算法中位数 · 不含浏览器字体测量' : 'Algorithm median · excludes font measurement'}</span><Arrow diagonal /></a></div>
      <p className="home-performance-loading">{zh ? '从 50/75 MiB 完整输入到可阅读正文，Worker 加载、可自定义的进度和按需挂载共同支撑长文阅读。解析耗时与内存占用单独公开。' : 'From complete 50/75 MiB inputs to readable content, worker loading, host-owned progress and windowed rendering support long documents. Loading time and memory use are reported separately.'} <a className="home-link" href={docsHref(locale, 'loading-performance')}><span className="limr-underline">{zh ? '加载与内存实测' : 'Loading & memory measurements'}</span><Arrow /></a></p>
      <div className="home-performance-footnote"><span>{zh ? `v${performanceMetrics.version} 本地生产基准 · Chromium · ${performanceMetrics.cpu}。实际表现随内容和设备变化。` : `v${performanceMetrics.version} local production benchmarks · Chromium · ${performanceMetrics.cpu}. Results vary with content and hardware.`}</span><a className="home-link" href={docsHref(locale, 'performance')}><span className="limr-underline">{zh ? '测试方法与完整报告' : 'Methodology & full report'}</span><Arrow /></a></div>
    </section>
    <QuickStart locale={locale} />
    <footer className="home-footer"><div className="home-footer-top"><a href="#/home" className="home-footer-brand">LiMR<span>{zh ? '给文字空间，让想法生长。' : 'Space for words. Room for ideas.'}</span></a><nav aria-label={zh ? '首页页脚' : 'Home footer'}><a href="#/playground"><span className="limr-underline">Playground</span><Arrow diagonal /></a><a href={docsHref(locale)}><span className="limr-underline">Docs</span><Arrow diagonal /></a><a href="https://github.com/Linloir/LiMR" target="_blank" rel="noopener noreferrer"><span className="limr-underline">GitHub</span><Arrow diagonal /></a></nav></div><div className="home-footer-bottom"><span>Made with care, by Linloir.</span><span>OPEN SOURCE · MIT LICENSE</span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}><span className="limr-underline">{zh ? '回到顶部' : 'Back to top'}</span><Arrow direction="up" /></button></div></footer>
  </main>;
}
