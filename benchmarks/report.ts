import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { quantile } from './shared/stats';
import { root, hash, environment } from './shared/environment';
import { renderers } from './renderers/options';
import { cases, richFixture } from './renderers/fixtures';
import { writeExtendedReports } from './loading/report';

const read = async (name: string) => JSON.parse(await readFile(`${root}/benchmarks/results/${name}.json`, 'utf8'));
const [rendererData, core, streaming, algorithm, layout, selection] = await Promise.all(['renderers', 'core', 'streaming', 'kp-algorithm', 'kp-browser', 'selection'].map(read));
const runs = rendererData.results as any[];
assert.ok(!rendererData.configuration.profiling && runs.every(run => !run.profile), 'Profiling samples are diagnostic only');
const groups = (suite: string, scenario: string, renderer: string) => runs.filter(r => r.suite === suite && r.scenario === scenario && r.renderer === renderer);
const scenarios = ['static-small', 'static-medium', 'static-large', 'stream-mixed', 'stream-code', 'stream-table', 'stream-paragraph'];
for (const scenario of scenarios) for (const renderer of renderers) assert.equal(groups('full-dom', scenario, renderer).length, 5, `${scenario}/${renderer}: need five trials`);
for (const scenario of ['rich-medium', 'rich-large', 'rich-mobile']) for (const renderer of renderers) assert.equal(groups('default-reading', scenario, renderer).length, 3);
for (const renderer of renderers) assert.equal(groups('default-streaming', 'rich-stream', renderer).length, 3);
assert.equal(runs.length, 141); assert.equal(core.results.length, 3); assert.equal(streaming.results.length, 4);
assert.equal(algorithm.results.length, 11); assert.equal(layout.results.length, 18); assert.equal(selection.results.length, 3);
for (const scenario of cases) for (const renderer of renderers) {
  const rows = groups('full-dom', scenario.id, renderer);
  assert.deepEqual(rows.map(r => r.trial).sort(), [0, 1, 2, 3, 4]);
  assert.ok(rows.every(r => r.sourceSHA256 === hash(scenario.source) && r.validation.valid && !r.errors.length));
}
for (const scenario of ['rich-medium', 'rich-large', 'rich-mobile']) for (const renderer of renderers) {
  const rows = groups('default-reading', scenario, renderer);
  assert.deepEqual(rows.map(r => r.trial).sort(), [0, 1, 2]);
  assert.ok(rows.every(r => r.sourceSHA256 === hash(richFixture(scenario === 'rich-large' ? 240 : 24))));
}
for (const renderer of renderers) assert.deepEqual(groups('default-streaming', 'rich-stream', renderer).map(r => r.trial).sort(), [0, 1, 2]);
for (const width of [1380, 390]) for (const mode of ['standard', 'justify', 'knuth-plass']) {
  assert.deepEqual(layout.results.filter((r: any) => r.viewport.width === width && r.mode === mode).map((r: any) => r.trial).sort(), [0, 1, 2]);
}
for (const data of [core, streaming, algorithm, layout, selection]) {
  assert.equal(data.environment.sourceSHA256, rendererData.environment.sourceSHA256, 'Mixed source revisions');
  assert.equal(data.environment.harnessSHA256, rendererData.environment.harnessSHA256, 'Mixed benchmark revisions');
  assert.equal(data.environment.playgroundSHA256, rendererData.environment.playgroundSHA256, 'Mixed Playground revisions');
  assert.equal(data.environment.examplesSHA256, rendererData.environment.examplesSHA256, 'Mixed example plugin revisions');
  assert.equal(data.environment.lockSHA256, rendererData.environment.lockSHA256, 'Mixed dependency locks');
  assert.equal(data.environment.liMR, rendererData.environment.liMR, 'Mixed LiMR versions');
  assert.equal(data.environment.mode, 'production');
  assert.deepEqual(data.environment.versions, rendererData.environment.versions);
}
const env = rendererData.environment;
const current = await environment();
for (const key of ['sourceSHA256', 'harnessSHA256', 'playgroundSHA256', 'examplesSHA256', 'lockSHA256', 'liMR'] as const) assert.equal(current[key], env[key], `Results do not match current ${key}`);
if (process.env.BENCH_EXTENDED === '1') await writeExtendedReports(env);
const f = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
const med = (values: number[]) => quantile(values, .5);
const metric = (rows: any[], get: (r: any) => number) => med(rows.map(get));
const range = (rows: any[], get: (r: any) => number) => `${f(metric(rows, get))} [${f(Math.min(...rows.map(get)))}–${f(Math.max(...rows.map(get)))}]`;
const label = (name: string) => ({ limr: 'LiMR', 'react-markdown': 'react-markdown', markstream: 'Markstream' }[name] ?? name);
const table = (headers: string[], rows: (string | number)[][]) => `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
const raw = (name: string) => `[${name}.json](../../benchmarks/results/${name}.json)`;
const modes = ['standard', 'justify', 'knuth-plass'];
for (const zh of [true, false]) {
  const locale = zh ? 'zh-CN' : 'en';
  const tr = (cn: string, en: string) => zh ? cn : en;
  const header = (title: string, page: string) => `# ${title}\n\n[${tr('文档目录', 'Documentation')}](README.md) · [${zh ? 'English' : '简体中文'}](../${zh ? 'en' : 'zh-CN'}/${page}.md)\n\n`;
  const environment = `LiMR **${env.liMR}** · React **${env.versions.react}** · Node **${env.node}** · Chromium **${env.browser}**. ${env.cpu}; ${env.logicalCPUs} ${tr('逻辑核', 'logical CPUs')}; ${f(env.memoryBytes / 2 ** 30, 1)} GiB; ${env.platform}.\n\n`;
  const full = (scenario: string, renderer = 'limr') => groups('full-dom', scenario, renderer);
  const richStream = (renderer = 'limr') => groups('default-streaming', 'rich-stream', renderer);
  const readingCases = ['rich-medium', 'rich-large', 'rich-mobile'];
  const scene = (name: string) => ({
    'static-small': tr('短文档', 'Short document'),
    'static-medium': tr('中等文档', 'Medium document'),
    'static-large': tr('长文档', 'Long document'),
    'stream-mixed': tr('混合内容', 'Mixed content'),
    'stream-code': tr('代码块', 'Code block'),
    'stream-table': tr('表格', 'Table'),
    'stream-paragraph': tr('长段落', 'Long paragraph'),
    'rich-medium': tr('桌面阅读', 'Desktop reading'),
    'rich-large': tr('桌面长文', 'Long desktop document'),
    'rich-mobile': tr('窄屏阅读', 'Narrow-screen reading'),
  }[name] ?? name);
  const large = full('static-large');
  const rich = richStream();
  const reading = runs.filter(r => r.suite === 'default-reading' && r.renderer === 'limr');
  const streamCases = scenarios.filter(s => s.startsWith('stream'));
  const streamLeads = streamCases.filter(s => renderers.every(r => metric(full(s), x => x.totalMs) <= metric(full(s, r), x => x.totalMs))).length;
  let doc = header(tr('渲染器性能报告', 'Renderer performance report'), 'performance');
  doc += tr('LiMR 面向流式输出、长文阅读和交互式标注，在提供丰富 Markdown 能力的同时保持轻快的更新与阅读体验。以下数据覆盖完整文档挂载、逐块流式更新，以及开启默认模块和动画的实际阅读。\n\n', 'LiMR combines rich Markdown, streaming output and interactive annotations with responsive updates and reading. The measurements below cover full-document mounting, incremental streaming, and reading with default modules and animations enabled.\n\n');
  doc += `## ${tr('性能概览', 'Performance at a glance')}\n\n`;
  doc += tr(`- **长文档约 ${f(metric(large, x => x.totalMs) / 1000, 2)} 秒挂载**：完整渲染 877,782 个 UTF-16 字符。\n- **${streamLeads}/${streamCases.length} 类流式场景累计同步耗时最低**：与相同输入下的 react-markdown、Markstream 对比，涵盖混合内容、代码、表格和长段落。\n- **丰富内容流式更新 P95 为 ${f(metric(rich, x => x.p95Ms), 1)}ms**：保留默认模块、动画、样式与字体。\n- **桌面、长文和窄屏阅读 ${reading.filter(x => x.readingPassed).length}/${reading.length} 通过**：覆盖首屏内容、滚动及文档跳转。\n\n`, `- **About ${f(metric(large, x => x.totalMs) / 1000, 2)} seconds to mount a long document**: all 877,782 UTF-16 characters rendered.\n- **Lowest cumulative synchronous time in ${streamLeads}/${streamCases.length} streaming scenarios**: compared with react-markdown and Markstream on identical mixed-content, code, table and paragraph inputs.\n- **${f(metric(rich, x => x.p95Ms), 1)}ms rich-stream update P95**: default modules, animations, styles and fonts remain enabled.\n- **${reading.filter(x => x.readingPassed).length}/${reading.length} desktop, long-document and narrow-screen reading checks passed**: covering initial content, scrolling and document seeks.\n\n`);

  doc += `## ${tr('流式输出', 'Streaming output')}\n\n`;
  doc += tr('按每次 256 个 UTF-16 字符追加内容，适合观察连续生成 Markdown 时的更新成本。每个场景使用相同输入和中性样式，展示五次独立页面的中位数 [最小–最大]，单位 ms；数值为同步提交累计耗时，包含 React 提交和布局。\n\n', 'Content arrives in chunks of 256 UTF-16 characters, measuring the update cost of continuously generated Markdown. Each scenario uses identical input and neutral styling. Values are median [min–max] across five independent pages, in ms: cumulative synchronous commit time including React updates and layout.\n\n');
  doc += table([tr('内容 / 字符数', 'Content / characters'), ...renderers.map(label)], streamCases.map(s => [
    `${scene(s)} / ${full(s)[0].characters.toLocaleString('en-US')}`,
    ...renderers.map(r => range(full(s, r), x => x.totalMs)),
  ]));
  doc += `\n### ${tr('单次更新响应', 'Per-update responsiveness')}\n\n`;
  doc += tr('下表为各次运行的单次提交 P95，再取五次运行的中位数，单位 ms。同步提交耗时不包含更新之间的帧等待及异步资源加载。\n\n', 'The table shows the median of five per-run update P95s, in ms. Synchronous commit timing excludes the frame waits between updates and asynchronous resource loading.\n\n');
  doc += table([tr('内容', 'Content'), ...renderers.map(label)], streamCases.map(s => [scene(s), ...renderers.map(r => f(metric(full(s, r), x => x.p95Ms)))]));

  doc += `\n## ${tr('长文档挂载与资源占用', 'Long-document mounting and resource use')}\n\n`;
  doc += tr('从短文到约 87.8 万字符的长文，全文挂载保留完整正文 DOM，支持浏览器原生选区和文档定位。以下同样使用五次独立页面，列出挂载中位数 [最小–最大]，单位 ms。\n\n', 'From short articles to approximately 878,000 characters, full-document mounting retains the complete article DOM for native browser selection and document navigation. Values are mount-time median [min–max] across five independent pages, in ms.\n\n');
  doc += table([tr('文档 / 字符数', 'Document / characters'), ...renderers.map(label)], scenarios.filter(s => s.startsWith('static')).map(s => [
    `${scene(s)} / ${full(s)[0].characters.toLocaleString('en-US')}`,
    ...renderers.map(r => range(full(s, r), x => x.totalMs)),
  ]));
  doc += tr('\n同一长文档下的保留 JS 堆与正文 DOM：\n\n', '\nRetained JS heap and article DOM for the same long document:\n\n');
  doc += table([tr('渲染器', 'Renderer'), tr('增量 JS 堆 MiB', 'Incremental JS heap MiB'), tr('正文元素', 'Article elements')], renderers.map(r => [label(r), f(metric(full('static-large', r), x => x.retainedHeapBytes) / 1048576), metric(full('static-large', r), x => x.validation.elements)]));
  doc += tr('\nJS 堆是显式 GC 后相对于预热空页面的增量；DOM 统计正文元素。\n\n', '\nJS heap is the post-GC increment over a warmed empty page; DOM counts cover article elements.\n\n');

  doc += `## ${tr('完整功能下的阅读体验', 'Reading with rich features enabled')}\n\n`;
  doc += tr('丰富流式场景同时包含 TypeScript、Python、JSON、公式、表格、任务列表和本地图片。LiMR 保留默认模块、动画、样式与字体；每库运行三个资源预热页面，并检查章节与特殊块内容。\n\n', 'Rich streaming combines TypeScript, Python, JSON, formulas, tables, tasks and local images. LiMR retains its default modules, animations, styles and fonts. Each renderer runs on three resource-warmed pages, with section and rich-content validation.\n\n');
  doc += table([tr('渲染器', 'Renderer'), tr('内容验证', 'Content checks'), tr('累计同步耗时 ms', 'Cumulative commit time ms'), tr('更新 P95 ms', 'Update P95 ms')], renderers.map(r => { const rows = richStream(r); return [label(r), `${rows.filter(x => x.valid).length}/${rows.length}`, f(metric(rows, x => x.totalMs)), f(metric(rows, x => x.p95Ms))]; }));
  doc += tr('\nLiMR 的阅读场景覆盖桌面 1440×900 和窄屏 390×900。长文包含 240 个章节、240 个代码块、480 个公式和 30 张本地图片；每种场景使用三个冷浏览器上下文，完成上下滚动以及中部、末尾、顶部跳转。\n\n', '\nLiMR reading scenarios cover a 1440×900 desktop viewport and a 390×900 narrow viewport. The long document contains 240 sections, 240 code blocks, 480 formulas and 30 local images. Each scenario uses three cold browser contexts, scrolling in both directions and seeking to the middle, end and top.\n\n');
  doc += table([tr('LiMR 阅读场景', 'LiMR reading scenario'), tr('内容验证', 'Content checks'), tr('首个正文可读 ms', 'First readable content ms'), tr('滚动帧间隔 P95 ms', 'Scroll frame interval P95 ms')], readingCases.map(s => {
    const rows = groups('default-reading', s, 'limr');
    const first = rows.map(x => x.initial.readableFromNavigationMs).filter(x => x != null);
    return [scene(s), `${rows.filter(x => x.readingPassed).length}/${rows.length}`, first.length ? f(med(first)) : '—', f(metric(rows, x => x.scrolling.frameP95Ms))];
  }));
  doc += tr('\n首个正文可读由 DOM 与两次 rAF 确认，从页面导航开始计时；滚动 P95 统计 rAF 间隔。窄屏使用 Chromium 视口模拟。\n\n', '\nFirst readable content is confirmed by DOM checks and two rAF callbacks, timed from navigation. Scroll P95 measures rAF intervals. Narrow screens are simulated with a Chromium viewport.\n\n');

  doc += tr('完整输入的 Worker 加载、渐进预览、50/75 MiB 峰值与空闲内存，以及真实论文交互矩阵见 [加载与内存性能](loading-performance.md)。该报告单独计量完整管线，不与上述同步提交耗时混用。\n\n', 'For complete-input worker loading, progressive previews, 50/75 MiB peak and idle memory, and real-paper interactions, see [Loading and memory performance](loading-performance.md). Those end-to-end pipeline measurements are separate from synchronous commit timings above.\n\n');
  doc += `## ${tr('交互式选区与标注', 'Interactive selection and annotations')}\n\n`;
  doc += tr('在 2,000 节长文和 1,000 行代码中连续拖选，LiMR 随选区变化更新高亮覆盖层。每种情况在三个字体就绪页面上执行连续鼠标移动。\n\n', 'LiMR updates its highlight overlay while selections are dragged through 2,000 prose sections or 1,000 lines of code. Each scenario performs continuous pointer movement on three font-ready pages.\n\n');
  doc += table([tr('LiMR 场景', 'LiMR scenario'), tr('帧间隔 P95 ms', 'Frame interval P95 ms'), tr('覆盖层更新 P95 ms', 'Overlay update P95 ms')], selection.results.filter((r: any) => r.renderer === 'limr').map((r: any) => [tr(r.kind === 'prose' ? '长文拖选' : '代码拖选', r.kind === 'prose' ? 'Prose selection' : 'Code selection'), f(med(r.samples.map((x: any) => x.frameP95Ms))), f(med(r.samples.map((x: any) => x.paintP95Ms)))]));
  doc += tr('\n覆盖层更新从 selectionchange 事件计至 DOM 变更。段落排版能力及相关数据见 [Knuth–Plass 性能报告](knuth-plass-performance.md)。\n\n', '\nOverlay updates are timed from selectionchange to DOM mutation. For paragraph typography and its measurements, see the [Knuth–Plass performance report](knuth-plass-performance.md).\n\n');

  doc += `## ${tr('测试方法与复现', 'Methodology and reproduction')}\n\n` + environment;
  doc += `react-markdown **${env.versions['react-markdown']}** · Markstream React **${env.versions['markstream-react']}**.\n\n`;
  doc += tr('同机 Chromium、生产构建、无 CPU 或网络降速。版本由锁文件固定；表格使用最近秩分位数，除另有说明外取独立运行的中位数。三至五次采样用于描述这些输入下的表现。\n\n', 'Production builds run in Chromium on the same machine, without CPU or network throttling. Versions are pinned by the lockfile. Tables use nearest-rank quantiles and medians of independent runs unless stated otherwise. Three to five trials describe performance on these inputs.\n\n');
  doc += table([tr('配置', 'Profile'), 'LiMR', 'react-markdown', 'Markstream'], [
    [tr('全文与受控流式', 'Full DOM and controlled streaming'), 'Markdown + gfm; interactive=false; streamEffect=false', 'remark-gfm', tr('关闭虚拟化、批处理、延迟渲染与动画；原生 pre', 'Virtualization, batching, deferred rendering and effects off; native pre')],
    [tr('丰富内容', 'Rich content'), tr('默认模块、动画、样式与字体', 'Default modules, effects, styles and font'), 'remark-gfm + remark-math + rehype-katex + async Shiki', tr('默认 MarkdownRender；stream-diffs 与 KaTeX', 'Default MarkdownRender; stream-diffs and KaTeX')],
  ]);
  doc += tr('\n受控场景使用相同中性 CSS；丰富场景采用各自集成的样式、字体和加载策略。计时外检查正文结构与文本。原始数据提供逐次计时、资源和配置详情。\n\n', '\nControlled scenarios share neutral CSS. Rich scenarios use each integration’s styles, fonts and loading strategy. Structure and text are validated outside timing. Raw data includes per-run timings, resources and configuration.\n\n');
  doc += '```sh\npnpm install --frozen-lockfile\npnpm exec playwright install chromium\npnpm bench\n```\n\n';
  doc += `${tr('原始数据', 'Raw data')}: ${['renderers', 'selection'].map(raw).join(' · ')}. [${tr('基准说明与单项命令', 'Benchmark guide and individual commands')}](../../benchmarks/README.md).\n`;
  await writeFile(`${root}/docs/${locale}/performance.md`, doc);

  let kp = header(tr('Knuth–Plass 排版性能', 'Knuth–Plass typography performance'), 'knuth-plass-performance');
  const kpGroups = (width: number, mode: string) => layout.results.filter((r: any) => r.viewport.width === width && r.mode === mode);
  const kpP95 = (values: number[]) => [...values].sort((a, b) => a - b)[Math.max(0, Math.ceil(values.length * .95) - 1)];
  const kpTrio = (s: any) => `${f(s.medianMs, 3)} / ${f(s.p95Ms, 3)} / ${f(s.maxMs, 3)}`;
  const kpLargest = algorithm.results.find((r: any) => r.scenario === 'words-10000');
  const kpScroll = (width: number) => kpGroups(width, 'knuth-plass').flatMap((r: any) => r.scroll.flatMap((s: any) => s.samples));
  const kpInvalid = layout.results.filter((r: any) => !r.valid);
  kp += tr('LiMR 的 `typography="knuth-plass"` 提供段落级优化排版，将断行、词间距与连字符一起纳入求解，同时保留原文选区、复制和高亮交互。本文展示求解器吞吐，以及完整论文在桌面、窄屏和连续变宽过程中的阅读表现。\n\n', 'LiMR’s `typography="knuth-plass"` provides paragraph-level optimization of line breaks, spacing and hyphenation while retaining native text selection, copying and highlights. This page covers solver throughput and full-paper reading on desktop, narrow viewports and changing widths.\n\n');
  kp += tr(`10,000 词合成段落的准备与求解中位数为 **${f(kpLargest.measurements['prepare-and-solve'].medianMs, 3)}ms**，复用准备数据后为 **${f(kpLargest.measurements['prepared-solve'].medianMs, 3)}ms**。完整论文的 KP 滚动 rAF P95 为桌面 **${f(kpP95(kpScroll(1380)))}ms**、窄屏 **${f(kpP95(kpScroll(390)))}ms**；三种模式的浏览器验收共通过 **${layout.results.length - kpInvalid.length}/${layout.results.length}**。\n\n`, `A 10,000-word synthetic paragraph takes a median **${f(kpLargest.measurements['prepare-and-solve'].medianMs, 3)}ms** to prepare and solve, or **${f(kpLargest.measurements['prepared-solve'].medianMs, 3)}ms** with preparation retained. KP’s pooled scrolling rAF P95 for the full paper is **${f(kpP95(kpScroll(1380)))}ms** on desktop and **${f(kpP95(kpScroll(390)))}ms** in the narrow viewport. Browser acceptance passes **${layout.results.length - kpInvalid.length}/${layout.results.length}** across all three modes.\n\n`);
  kp += `## ${tr('算法吞吐与宽度复用', 'Solver throughput and width reuse')}\n\n`;
  kp += tr('求解器以 box/glue/penalty 表达内容，通过活动节点寻找段落的最小罚分路径，综合行松紧程度、相邻行差异和连字符。`prepareKnuthPlass` 复用宽度与伸缩前缀和及断点辅助数据，便于同一段落按不同宽度重新求解。\n\n', 'The solver represents content as boxes, glue and penalties. Active nodes find a minimum-demerit path across the paragraph, accounting for line fitness, adjacent-line differences and hyphens. `prepareKnuthPlass` retains width/stretch/shrink prefix sums and breakpoint helpers for solving the same paragraph at different widths.\n\n');
  kp += tr('输入采用确定性的合成像素宽度，每项预热 3 次、采样 15 次；小输入批量执行并折算为单次调用。下表单位为 ms，显示中位数 / P95 / 最大值。“准备”指求解器前缀数据准备；造词、断词和字体测量属于浏览器集成阶段。\n\n', 'Inputs use deterministic synthetic pixel widths, with 3 warmups and 15 samples per operation. Small inputs are batched and normalized per call. Values below are ms: median / P95 / maximum. “Prepare” means building solver prefix data; input creation, hyphenation and glyph measurement are separate integration work.\n\n');
  kp += table([
    tr('场景', 'Scenario'), tr('词 / item / 行', 'Words / items / lines'),
    tr('准备与求解', 'Prepare + solve'), tr('复用准备数据', 'Prepared solve'),
    tr('12 次变宽总计', '12-width total'), tr('求解阶段', 'Pass'),
  ], algorithm.results.map((r: any) => [
    r.scenario, `${r.words} / ${r.items} / ${r.lines}`,
    kpTrio(r.measurements['prepare-and-solve']), kpTrio(r.measurements['prepared-solve']),
    kpTrio(r.measurements['responsive-12-widths']), r.pass,
  ]));
  kp += tr('\n12 次变宽覆盖 240–680px、步长 40px，列出全部求解及路径检查的总耗时。场景包括窄列、连字符、变行宽、looseness、应急拉伸和不可拆分对象；每次校验断点顺序、完整覆盖、有限罚分，以及直接求解与复用准备数据的结果一致性。\n\n', '\nThe 12-width operation spans 240–680px in 40px steps and reports the total for solving and path checks. Cases include narrow columns, hyphens, varying line widths, looseness, emergency stretch and indivisible objects. Checks verify ordered breaks, complete coverage, finite demerits and agreement between direct and prepared solving.\n\n');
  kp += `## ${tr('桌面与窄屏阅读', 'Desktop and narrow-viewport reading')}\n\n`;
  kp += tr(`浏览器场景采用 ${layout.fixture.characters.toLocaleString('en-US')} 个 UTF-16 代码单元的 scikit-learn 完整论文，运行于生产构建的 Playground，保留 Reader 目录、侧栏与插件。standard、CSS justify 和 KP 分别在 1380×1000 与 390×1000 的 Chromium 视口下运行，每组 3 个独立页面。\n\n`, `The browser scenario uses the complete scikit-learn paper (${layout.fixture.characters.toLocaleString('en-US')} UTF-16 code units) in the production Playground, retaining the Reader TOC, sidebar and plugins. Standard, CSS justify and KP each run in 1380×1000 and 390×1000 Chromium viewports, with 3 fresh pages per group.\n\n`);
  kp += tr('KP 按段落接近视口的顺序调度排版，批量执行字体测量和布局写入，并保留已排版节点供滚动复访。每页执行 3 轮、每轮 120 步的上下滚动；首轮经过新段落，后两轮复访已排版内容。\n\n', 'KP schedules paragraphs as they approach the viewport, batches font measurements and layout writes, and retains typeset nodes for revisiting. Each page performs three 120-step down/up sweeps: the first reaches new paragraphs, and the next two revisit existing layout.\n\n');
  kp += table([
    tr('视口 / 模式', 'Viewport / mode'), tr('验收', 'Passed'),
    tr('首轮 rAF P95 / 最大 ms', 'First sweep rAF P95 / max ms'),
    tr('复访 rAF P95 / 最大 ms', 'Revisit rAF P95 / max ms'), tr('>50ms 帧', '>50ms frames'),
  ], [1380, 390].flatMap(width => modes.map(mode => {
    const rows = kpGroups(width, mode);
    const first = rows.flatMap((r: any) => r.scroll[0].samples);
    const warm = rows.flatMap((r: any) => r.scroll.slice(1).flatMap((s: any) => s.samples));
    return [`${width} / ${mode}`, `${rows.filter((r: any) => r.valid).length}/${rows.length}`,
      `${f(kpP95(first))} / ${f(Math.max(...first))}`,
      `${f(kpP95(warm))} / ${f(Math.max(...warm))}`,
      `${[...first, ...warm].filter(v => v > 50).length} / ${first.length + warm.length}`];
  })));
  kp += tr('\n滚动统计按视口与模式合并，每组 1,080 帧；rAF 表示 scrollTo 至下一次动画帧回调的时间。纯求解器耗时见前表。\n\n', '\nScroll statistics pool 1,080 frames per viewport/mode group. rAF measures scrollTo to the next animation-frame callback. Pure solver timings appear in the preceding table.\n\n');
  kp += `## ${tr('连续变宽与自适应排版', 'Responsive layout across changing widths')}\n\n`;
  kp += tr('每页依次使用 1380、1200、960、800、640、480、390、480、640、800、1200、1380px 的视口宽度，并记录段落的实际宽度。rAF 反映首次回调，稳定时间要求可见布局连续 4 帧一致，包含浏览器协议与检测等待。\n\n', 'Each page visits viewport widths of 1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200 and 1380px, recording actual paragraph widths. rAF measures the first callback; settling requires four consecutive matching visible-layout frames and includes browser-protocol and detection waits.\n\n');
  kp += table([
    tr('初始视口 / 模式', 'Initial viewport / mode'), tr('rAF P50 / P95 / 最大 ms', 'rAF P50 / P95 / max ms'),
    tr('稳定 P50 / P95 / 最大 ms', 'Settled P50 / P95 / max ms'), tr('段落宽度 px', 'Paragraph width px'),
  ], [1380, 390].flatMap(width => modes.map(mode => {
    const samples = kpGroups(width, mode).flatMap((r: any) => r.resize);
    const frames = samples.map((r: any) => r.frameMs), settled = samples.map((r: any) => r.settledMs);
    const widths = samples.map((r: any) => r.contentWidth);
    return [`${width} / ${mode}`, `${f(med(frames))} / ${f(kpP95(frames))} / ${f(Math.max(...frames))}`,
      `${f(med(settled))} / ${f(kpP95(settled))} / ${f(Math.max(...settled))}`,
      `${f(Math.min(...widths), 0)}–${f(Math.max(...widths), 0)}`];
  })));
  kp += `\n## ${tr('交互完整性与资源使用', 'Interaction integrity and resource use')}\n\n`;
  kp += tr('排版过程同时校验原文内容、跨宽度变化的原生选区、滚动复访后的 KP 缓存节点、可见段落布局完成状态与页面横向溢出。浏览器回归测试另覆盖中英混排、行内代码与公式、选区复制、高亮几何和字号变化。\n\n', 'Layout checks cover source text, native selections across width changes, retained KP nodes after revisiting, settled visible paragraphs and horizontal overflow. Browser regression tests also cover mixed Chinese/English, inline code and math, copying, highlight geometry and font-size changes.\n\n');
  kp += table([
    tr('初始视口 / 模式', 'Initial viewport / mode'), tr('滚动主线程 ms', 'Scroll main thread ms'),
    tr('最终 JS 堆 MiB', 'Final JS heap MiB'), 'DOM', tr('文本 / 原生选区 / 缓存保留', 'Text / native range / cache retained'),
  ], [1380, 390].flatMap(width => modes.map(mode => {
    const rows = kpGroups(width, mode);
    return [`${width} / ${mode}`, f(metric(rows, r => r.scrollMainThreadMs)),
      f(metric(rows, r => r.heapBytes) / 1048576), metric(rows, r => r.nodes),
      ['contentPreserved', 'selectionPreserved', 'cachedNodesPreserved'].map(key =>
        key === 'cachedNodesPreserved' && mode !== 'knuth-plass' ? 'N/A' : `${rows.filter((r: any) => r[key]).length}/${rows.length}`).join(' / ')];
  })));
  kp += tr('\n主线程列为三轮滚动累计 TaskDuration 的页面间中位数。JS 堆与 DOM 在滚动、变宽完成后，于 390px 视口和显式 GC 后采样；表中资源数据取各组页面的中位数。\n\n', '\nMain-thread values are medians across pages of cumulative TaskDuration for all three sweeps. JS heap and DOM are sampled after scrolling and resizing, at a 390px viewport and after explicit GC; resource values are medians across pages.\n\n');
  if (kpInvalid.length) kp += table([tr('验收场景', 'Acceptance case'), tr('详情', 'Details')], kpInvalid.map((r: any) => [
    `${r.viewport.width}/${r.mode}/${r.trial + 1}`, JSON.stringify({ activation: r.activationState.settled,
      content: r.contentPreserved, selection: r.selectionPreserved, cache: r.cachedNodesPreserved,
      resize: r.resize.filter((s: any) => !s.settled || s.horizontalOverflow > 1), errors: r.errors }),
  ]));
  kp += `## ${tr('测量环境与复现', 'Environment and reproduction')}\n\n`;
  kp += environment;
  kp += tr('使用本地生产构建，按顺序执行，无 CPU 或网络降速；窄屏使用同一 Chromium 的视口模拟。P95 使用最近秩计算，算法表的 15 个样本中 P95 与最大值相同。\n\n', 'Measurements run sequentially against a local production build without CPU or network throttling. Narrow-screen results use Chromium viewport simulation. P95 uses nearest-rank calculation; with 15 algorithm samples, P95 equals the maximum.\n\n');
  kp += `\`\`\`sh\npnpm bench:kp\npnpm build:playground\npnpm preview:playground --port 4174\n# ${tr('预览服务启动后，在另一个终端执行', 'Once the preview server is ready, run in another terminal')}\npnpm bench:layout\n\`\`\`\n\n`;
  kp += `${raw('kp-algorithm')} · ${raw('kp-browser')} · [${tr('基准方法', 'Benchmark methodology')}](../../benchmarks/README.md) · [${tr('渲染性能', 'Rendering performance')}](performance.md).\n`;
  await writeFile(`${root}/docs/${locale}/knuth-plass-performance.md`, kp);
}
await writeFile(`${root}/benchmarks/results/home-performance.json`, JSON.stringify({
  version: env.liMR, cpu: env.cpu,
  fullMountSeconds: f(metric(groups('full-dom', 'static-large', 'limr'), row => row.totalMs) / 1000),
  richStreamP95Ms: f(metric(groups('default-streaming', 'rich-stream', 'limr'), row => row.p95Ms), 1),
  kpPrepareSolveMs: f(algorithm.results.find((row: any) => row.scenario === 'words-10000').measurements['prepare-and-solve'].medianMs, 3),
  sourceSHA256: env.sourceSHA256, harnessSHA256: env.harnessSHA256, lockSHA256: env.lockSHA256,
}, null, 2) + '\n');
console.log('Generated public performance pages and Home metrics from the complete benchmark matrix.');
