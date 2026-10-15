import { useEffect, useId, useRef, useState } from 'react';
import { AnnotationOverlay, DocumentProvider, Markdown, SelectionToolbar, chinese, english, type TypographyMode } from '../src';

export interface HomeDemoProps {
  theme: 'light' | 'dark';
  locale: 'zh-CN' | 'en';
}

type RenderExample = 'article' | 'math' | 'code';

const renderSources: Record<HomeDemoProps['locale'], Record<RenderExample, string>> = {
  'zh-CN': {
    article: `### 好的内容，值得认真阅读。

从一个想法开始，让文字、公式和批注自然地组织在一起。**清晰的层次**，恰好的留白，还有 ==值得留下的灵感==。

> 阅读不只是抵达最后一行，也是与每一个想法相遇。[^reading]

用 Markdown 写下内容，把阅读体验交给 LiMR。

[^reading]: 这是一个真正的 LiMR 脚注。引用与正文共享位置，可以在阅读时打开，不必离开上下文。`,
    math: String.raw`### 让复杂，也清晰。

行内公式 $e^{i\pi} + 1 = 0$，与文字保持自然的阅读节奏。

$$
\mathcal{F}(\omega) = \int_{-\infty}^{\infty} f(t)\,e^{-i\omega t}\,dt
$$

从简单符号到完整推导，交给内置的 **KaTeX** 渲染。`,
    code: `### 从几行代码开始。

\`\`\`tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';

export function Article() {
  return <Reader source="# Hello, LiMR" />;
}
\`\`\`

语法高亮、复制代码与阅读交互，开箱即用。`,
  },
  en: {
    article: `### Good ideas deserve a little space.

Start with a thought. Let words, formulas, and annotations find their place. **A clear hierarchy**, a little breathing room, and ==an idea worth keeping==.

> Reading is more than reaching the last line. It is meeting an idea along the way.[^reading]

Write in Markdown. Let LiMR take care of the reading.

[^reading]: This is a real LiMR footnote. Open the reference while reading and keep the surrounding context in view.`,
    math: String.raw`### Make the complex feel clear.

An inline formula, $e^{i\pi} + 1 = 0$, belongs in the rhythm of a sentence.

$$
\mathcal{F}(\omega) = \int_{-\infty}^{\infty} f(t)\,e^{-i\omega t}\,dt
$$

From a single symbol to a complete derivation, rendered with built-in **KaTeX**.`,
    code: `### A few lines. A complete reader.

\`\`\`tsx
import { Reader } from '@linloir/limr';
import '@linloir/limr/styles.css';

export function Article() {
  return <Reader source="# Hello, LiMR" />;
}
\`\`\`

Syntax highlighting, code copying, and reading interactions, ready to use.`,
  },
};

/** These examples render with the same default modules as the playground. */
export function HomeRenderDemo({ theme, locale }: HomeDemoProps) {
  const zh = locale === 'zh-CN';
  const [example, setExample] = useState<RenderExample>('article');
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const panelId = useId();
  const tabs: { value: RenderExample; label: string }[] = [
    { value: 'article', label: zh ? '文章' : 'Article' },
    { value: 'math', label: zh ? '公式' : 'Math' },
    { value: 'code', label: zh ? '代码' : 'Code' },
  ];

  return <div className="home-demo home-render-demo" data-example={example}>
    <div className="home-demo-toolbar">
      <span className="home-demo-label"><span className="home-live-dot" />{zh ? '实时渲染' : 'Live rendering'}</span>
      <div className="home-segmented" role="group" aria-label={zh ? '渲染示例' : 'Rendering example'}>
        {tabs.map(tab => <button key={tab.value} type="button" aria-pressed={example === tab.value} aria-controls={panelId} onClick={() => setExample(tab.value)}><span className="limr-underline">{tab.label}</span></button>)}
      </div>
    </div>
    <div className="home-demo-reader" id={panelId} ref={setScrollRoot}>
      <DocumentProvider key={`${locale}-${example}`} source={renderSources[locale][example]} theme={theme} locale={zh ? chinese : english} scrollRoot={scrollRoot}>
        <Markdown /><AnnotationOverlay /><SelectionToolbar />
      </DocumentProvider>
    </div>
    <div className="home-demo-caption">{example === 'article'
      ? (zh ? '试试选中文字，或点击脚注标记。' : 'Select a passage, or open the footnote marker.')
      : example === 'math'
        ? (zh ? '行内公式与块级公式，共用一份 Markdown。' : 'Inline and display math, in the same Markdown document.')
        : (zh ? '代码由 Shiki 高亮，点击右上角即可复制。' : 'Highlighted with Shiki. Copy from the corner of the code block.')}</div>
  </div>;
}

const typographySources = {
  'zh-CN': `### 让每一行，都恰到好处。

阅读的节奏，藏在行与行之间。好的排版会照顾整段文字，让字词、标点与留白取得平衡。试着改变这张纸的宽度，观察同一段文字如何重新找到自己的节奏。

Typography is the quiet architecture of a page. Thoughtful line breaks give every sentence room to breathe, balancing a whole paragraph instead of considering one line at a time.`,
  en: `### A better rhythm, line by line.

Typography is the quiet architecture of a page. Thoughtful line breaks give every sentence room to breathe, balancing a whole paragraph instead of considering one line at a time.

Change the width of this page and watch the words find their rhythm again. The content stays the same; the shape of the reading changes.`,
};

export function HomeTypographyDemo({ theme, locale }: HomeDemoProps) {
  const zh = locale === 'zh-CN';
  const [typography, setTypography] = useState<TypographyMode>('knuth-plass');
  const [width, setWidth] = useState(100);
  const widthId = useId();
  const panelId = useId();

  return <div className="home-demo home-typography-demo">
    <div className="home-demo-toolbar">
      <span className="home-demo-label">{zh ? '段落的节奏' : 'The rhythm of a paragraph'}</span>
      <div className="home-segmented" role="group" aria-label={zh ? '排版模式' : 'Typography mode'}>
        <button type="button" aria-pressed={typography === 'standard'} aria-controls={panelId} onClick={() => setTypography('standard')}><span className="limr-underline">{zh ? '标准' : 'Standard'}</span></button>
        <button type="button" aria-pressed={typography === 'knuth-plass'} aria-controls={panelId} onClick={() => setTypography('knuth-plass')}><span className="limr-underline">Knuth–Plass</span></button>
      </div>
    </div>
    <div className="home-typography-stage" id={panelId}>
      <div className="home-typography-page" style={{ width: `${width}%` }}>
        <Markdown source={typographySources[locale]} theme={theme} locale={zh ? chinese : english} typography={typography} />
      </div>
    </div>
    <div className="home-width-control">
      <label htmlFor={widthId}>{zh ? '调整纸张宽度' : 'Adjust the page width'}</label>
      <input id={widthId} type="range" min={64} max={100} step={1} value={width} aria-controls={panelId} aria-valuetext={`${width}%`} onChange={event => setWidth(Number(event.target.value))} />
      <output htmlFor={widthId}>{width}%</output>
    </div>
  </div>;
}

const streamSources = {
  'zh-CN': `### 想法，一点一点成形。

每一次增量，都成为完整阅读体验的一部分。**文字自然浮现**，而还未闭合的语法，被妥善照顾。

- 保持已经呈现的内容稳定
- 让公式与代码自然进入正文

$$
e^{i\\pi} + 1 = 0
$$

\`\`\`tsx
<Markdown source={text} streaming={loading} />
\`\`\`

现在，这段内容已经完整。`,
  en: `### An idea, coming into focus.

Every new chunk becomes part of the reading experience. **Words arrive gently**, while unfinished syntax stays out of the way.

- Keep previously rendered content stable
- Let math and code settle into the page

$$
e^{i\\pi} + 1 = 0
$$

\`\`\`tsx
<Markdown source={text} streaming={loading} />
\`\`\`

And now, the thought is complete.`,
};

/** Changing the locale starts a new, independent local stream. */
export function HomeStreamDemo(props: HomeDemoProps) {
  return <StreamDemo key={props.locale} {...props} />;
}

function StreamDemo({ theme, locale }: HomeDemoProps) {
  const zh = locale === 'zh-CN';
  const source = streamSources[locale];
  const root = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const complete = cursor >= source.length;
  const panelId = useId();

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion || hasPlayed.current || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || hasPlayed.current) return;
      hasPlayed.current = true;
      setPlaying(true);
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || complete) return;
    const timer = window.setInterval(() => setCursor(value => Math.min(source.length, value + (zh ? 3 : 5))), 45);
    return () => window.clearInterval(timer);
  }, [playing, complete, source.length, zh]);

  useEffect(() => { if (complete) setPlaying(false); }, [complete]);

  const replay = () => {
    hasPlayed.current = true;
    setCursor(0);
    setPlaying(true);
  };
  const toggle = () => {
    hasPlayed.current = true;
    if (complete) replay();
    else setPlaying(value => !value);
  };
  const status = complete ? (zh ? '已完成' : 'Complete') : playing ? (zh ? '正在生成' : 'Streaming') : cursor ? (zh ? '已暂停' : 'Paused') : (zh ? '准备就绪' : 'Ready');
  const action = complete ? (zh ? '重播' : 'Replay') : playing ? (zh ? '暂停' : 'Pause') : cursor ? (zh ? '继续' : 'Resume') : (zh ? '播放' : 'Play');

  return <div className="home-demo home-stream-demo" ref={root} data-playing={playing || undefined}>
    <div className="home-demo-toolbar">
      <span className="home-demo-label"><span className="home-live-dot" /><span role="status" aria-live="polite">{status}</span></span>
      <div className="home-demo-actions">
        <button className="home-text-button" type="button" aria-controls={panelId} onClick={toggle}><span className="limr-underline">{action}</span></button>
        {!complete && <button className="home-text-button" type="button" disabled={cursor === 0 && !playing} aria-controls={panelId} onClick={replay}><span className="limr-underline">{zh ? '重播' : 'Replay'}</span></button>}
      </div>
    </div>
    <div className="home-stream-progress" role="progressbar" aria-label={zh ? '流式演示进度' : 'Streaming demo progress'} aria-valuemin={0} aria-valuemax={source.length} aria-valuenow={cursor}>
      <span style={{ width: `${cursor / source.length * 100}%` }} />
    </div>
    <div className="home-demo-reader home-stream-reader" id={panelId} ref={setScrollRoot}>
      {!cursor && <p className="home-stream-placeholder">{zh ? '一个想法，即将开始。点击播放，看看它如何成形。' : 'A thought is about to begin. Press play to watch it take shape.'}</p>}
      <Markdown source={source.slice(0, cursor)} streaming={!complete} streamEffect={reducedMotion ? false : undefined} theme={theme} locale={zh ? chinese : english} scrollRoot={scrollRoot} followOutput={!!scrollRoot} />
    </div>
    <div className="home-demo-caption">{zh ? '本地模拟流 · 无需 API 或网络请求' : 'Simulated locally · No API or network request'}</div>
  </div>;
}
