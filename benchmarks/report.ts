import { readFile, writeFile, mkdir, copyFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { quantile } from './shared/stats';
import { root, hash } from './shared/environment';
import { renderers } from './renderers/options';
import { cases, richFixture } from './renderers/fixtures';

const read = async (name: string) => JSON.parse(await readFile(`${root}/benchmarks/results/${name}.json`, 'utf8'));
const [rendererData, core, streaming, algorithm, layout, selection] = await Promise.all(['renderers', 'core', 'streaming', 'kp-algorithm', 'kp-browser', 'selection'].map(read));
const runs = rendererData.results as any[];
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
  assert.equal(data.environment.lockSHA256, rendererData.environment.lockSHA256, 'Mixed dependency locks');
  assert.equal(data.environment.mode, 'production');
  assert.deepEqual(data.environment.versions, rendererData.environment.versions);
}
const env = rendererData.environment;
let mountRepeat: any;
try {
  const candidate = await read('mount-repeat');
  if (candidate.environment.sourceSHA256 === env.sourceSHA256 && candidate.environment.lockSHA256 === env.lockSHA256 && candidate.environment.date >= env.date) {
    assert.equal(candidate.results.length, 9);
    for (const renderer of renderers) {
      const rows = candidate.results.filter((r: any) => r.renderer === renderer);
      assert.deepEqual(rows.map((r: any) => r.trial).sort(), [0, 1, 2]);
      assert.ok(rows.every((r: any) => r.scenario === 'static-large' && r.validation.valid));
    }
    mountRepeat = candidate;
  }
} catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
const f = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
const med = (values: number[]) => quantile(values, .5);
const metric = (rows: any[], get: (r: any) => number) => med(rows.map(get));
const range = (rows: any[], get: (r: any) => number) => `${f(metric(rows, get))} [${f(Math.min(...rows.map(get)))}–${f(Math.max(...rows.map(get)))}]`;
const label = (name: string) => ({ limr: 'LiMR', 'react-markdown': 'react-markdown', markstream: 'Markstream' }[name] ?? name);
const table = (headers: string[], rows: (string | number)[][]) => `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
const localDate = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Shanghai', dateStyle: 'short' }).format(new Date(env.date));
const raw = (name: string) => `[${name}.json](../../benchmarks/results/${name}.json)`;
const modes = ['standard', 'justify', 'knuth-plass'];
// Reuse checked-in evidence when regenerating a report from a fresh checkout.
await mkdir(`${root}/docs/assets/performance`, { recursive: true });
for (const renderer of ['limr', 'markstream']) {
  const source = `${root}/artifacts/benchmarks/renderers/rich-medium-${renderer}-seek-0.5.png`;
  const destination = `${root}/docs/assets/performance/${renderer}-midpoint.png`;
  try { await access(source); await copyFile(source, destination); } catch { await access(destination); }
}
for (const zh of [true, false]) {
  const locale = zh ? 'zh-CN' : 'en';
  const tr = (cn: string, en: string) => zh ? cn : en;
  const header = (title: string, page: string) => `# ${title}\n\n[${tr('文档目录', 'Documentation')}](README.md) · [${zh ? 'English' : '简体中文'}](../${zh ? 'en' : 'zh-CN'}/${page}.md)\n\n`;
  const environment = `${tr('本轮测试日期', 'Measured on')} **${localDate} (Asia/Shanghai)**. LiMR **${env.liMR}**, react-markdown **${env.versions['react-markdown']}**, Markstream React **${env.versions['markstream-react']}**, React/React DOM **${env.versions.react}**, Node **${env.node}**, Chromium **${env.browser}**. ${env.cpu}; ${env.logicalCPUs} ${tr('逻辑核', 'logical CPUs')}; ${f(env.memoryBytes / 2 ** 30, 1)} GiB; ${env.platform}.\n\n`;
  let doc = header(tr('渲染器性能报告', 'Renderer performance report'), 'performance') + environment;
  doc += tr('本文对应本轮实际执行的测试结果。使用锁文件内依赖，没有升级竞争库。测试串行执行，无 CPU/网络降速；本机仍有编辑器等常驻进程，因此结果是共享工作站上的描述性测量。窄屏是 Chromium 视口模拟，不是实体手机。每组环境、负载、源码与锁文件 SHA-256 和全部样本均在原始 JSON 中。\n\n', 'This report describes the measurements from this run. Dependencies come from the lockfile; competitor packages were not upgraded. Suites ran serially without CPU/network throttling on a shared workstation with resident editor processes. Narrow viewports are Chromium simulations, not physical phones. Each JSON records environment/load, source and lockfile SHA-256, and every sample.\n\n');
  const long = renderers.map(r => ({ name: r, time: metric(groups('full-dom', 'static-large', r), x => x.totalMs) })).sort((a, b) => a.time - b.time);
  doc += `## ${tr('本轮结论', 'Findings')}\n\n`;
  doc += tr(`87.8 万字符的受控全文挂载中，${label(long[0].name)} 的中位时间最短（${f(long[0].time)}ms）。下表同时给出范围、内存、DOM、流式更新及默认阅读验收；单项最快不能推导为所有场景最快。\n\n`, `For controlled full-DOM mounting of 877,782 characters, ${label(long[0].name)} has the lowest median (${f(long[0].time)}ms). The tables also expose ranges, memory, DOM, streaming and default-reading acceptance; a single fastest result does not imply an overall winner.\n\n`);
  const mixed = renderers.map(r => `${label(r)} ${f(metric(groups('full-dom', 'stream-mixed', r), x => x.totalMs))}ms`).join(' / ');
  const codeTimes = renderers.map(r => `${label(r)} ${f(metric(groups('full-dom', 'stream-code', r), x => x.totalMs))}ms`).join(' / ');
  doc += tr(`混合流式累计同步时间：**${mixed}**；长代码流式：**${codeTimes}**。它们与下方长表格、单长段落的结果不同，说明稳定前缀复用带来的收益取决于内容结构。\n\n`, `Mixed streaming commit totals: **${mixed}**; growing code: **${codeTimes}**. The table and single-paragraph results differ, illustrating that stable-prefix reuse benefits depend on content structure.\n\n`);
  doc += table([tr('默认阅读场景', 'Default-reading scenario'), ...renderers.map(label)], ['rich-medium', 'rich-large', 'rich-mobile'].map(s => [s, ...renderers.map(r => `${groups('default-reading', s, r).filter(x => x.readingPassed).length}/3 ${tr('通过', 'passed')}`)]));
  doc += tr('\n验收失败的帧率、内存或首屏耗时不能作为可用阅读体验的优势。KP 是可选排版模式，默认比较使用 standard；其完整报告独立列于 [KP 算法性能报告](knuth-plass-performance.md)。\n\n', '\nFrame, memory or initial timing from a failed reading run is not a usability advantage. KP is optional; renderer comparisons use standard typography. See the separate [Knuth–Plass performance report](knuth-plass-performance.md).\n\n');
  doc += `## ${tr('配置与公平性', 'Configuration and comparability')}\n\n`;
  doc += tr('LiMR 使用本仓库 `src` 经 Vite 生产编译的代码；两套对照使用 pnpm 锁定的 npm 包。这不是线上网站或已发布 npm 制品的远端测量。\n\n', 'LiMR uses this repository’s `src` compiled by production Vite; competitors use npm packages pinned by pnpm. These are local source measurements, not remote measurements of a deployed site or published LiMR artifact.\n\n');
  doc += table([tr('配置', 'Profile'), 'LiMR', 'react-markdown', 'Markstream'], [
    [tr('受控全文', 'Controlled full DOM'), 'Markdown + gfm, interactive=false', 'remark-gfm', 'maxLiveNodes=0; batch/defer/viewportPriority/smooth/typewriter/fade=false; native pre'],
    [tr('默认丰富阅读 / 流式', 'Rich reading / streaming'), tr('默认 Markdown、模块、动画、样式和字体', 'Default Markdown, modules, animations, styles and font'), 'remark-gfm + remark-math + rehype-katex + async Shiki', tr('默认 MarkdownRender、虚拟化、动画、样式；安装 stream-diffs 和 KaTeX', 'Default MarkdownRender, virtualization, animations and styles; stream-diffs and KaTeX installed')],
  ]);
  doc += tr('\nreact-markdown 的丰富配置是显式的集成方案，不是其裸默认配置。代码高亮使用 Shiki 的 github-light/github-dark，数学使用 KaTeX。各库默认 CSS/字体和延迟策略不同，所以丰富阅读比较的是实际集成体验；受控全文才使用相同中性 CSS。依赖配置依据 [react-markdown 官方说明](https://github.com/remarkjs/react-markdown)和 [Markstream React 官方说明](https://markstream.simonhe.me/frameworks/react)，实际版本以本轮 JSON 为准。\n\n', '\nThe rich react-markdown setup is an explicit integration, not its bare defaults. It uses Shiki github-light/github-dark and KaTeX. Vendor CSS/fonts and deferral differ, so rich reading compares integration behavior; controlled full DOM uses identical neutral CSS. Setup follows the [react-markdown documentation](https://github.com/remarkjs/react-markdown) and [Markstream React documentation](https://markstream.simonhe.me/frameworks/react); measured versions are in the JSON.\n\n');
  doc += `## ${tr('全文挂载与流式更新', 'Full-DOM mounting and streaming')}\n\n`;
  doc += tr('五次独立页面，两个小输入预热，循环并反转渲染器顺序；表内为中位数 [最小–最大]，单位 ms。流式按 256 个 UTF-16 字符追加，每次等待一个 rAF，最后一次非流式提交计入。同步时间包含 React flushSync 和强制布局，不含帧间空闲与异步重资源；原始数据另外记录主线程 TaskDuration、布局时间、长任务和 rAF。\n\n', 'Five independent pages, two small warmups, cyclic/reversed renderer order. Values are median [min–max] in ms. Streaming appends 256 UTF-16 characters per update with one rAF between updates and includes final nonstreaming commit. Synchronous time includes React flushSync and forced layout, excluding idle frames and async resources; raw data also records TaskDuration, layout, long tasks and rAF.\n\n');
  doc += table([tr('场景 / 字符数', 'Scenario / characters'), ...renderers.map(label)], scenarios.map(s => [ `${s} / ${groups('full-dom', s, 'limr')[0].characters.toLocaleString('en-US')}`, ...renderers.map(r => range(groups('full-dom', s, r), x => x.totalMs)) ]));
  const outliers = runs.filter(r => r.suite === 'full-dom' && r.totalMs > 5 * metric(groups('full-dom', r.scenario, r.renderer), x => x.totalMs));
  if (outliers.length) {
    doc += tr('\n本轮出现以下超过组内中位数五倍的长停顿，全部保留在统计与原始数据中。仅凭这些计时不能判定是输入、浏览器调度、系统负载还是其他原因；中位数不能表达这些尾部风险。\n\n', '\nThe following stalls exceed five times their group median and remain in all statistics and raw data. Timings alone cannot establish whether input, browser scheduling, system load or another cause is responsible; the median does not describe this tail risk.\n\n');
    doc += table([tr('场景 / 库 / 轮次', 'Scenario / renderer / trial'), tr('同步 ms', 'Commit ms'), 'TaskDuration ms', 'LayoutDuration ms'], outliers.map(r => [`${r.scenario} / ${label(r.renderer)} / ${r.trial + 1}`, f(r.totalMs), f(r.mainThreadMs), f(r.layoutMs)]));
  }
  if (mountRepeat) {
    doc += tr('\n针对大文档长停顿，另启 Node 与 Chromium 进程，复用同一生产构建，完成每库三次独立页面复核。它不替换上面的五次正式样本，也不能单独证明长停顿的原因。以下为复核的中位数 [最小–最大] ms。\n\n', '\nA follow-up for the long-document stall starts new Node and Chromium processes, reuses the same production build, and measures three fresh pages per renderer. It does not replace the five primary samples or establish the cause of the stall. Repeat values are median [min–max] ms.\n\n');
    doc += table(renderers.map(label), [renderers.map(r => range(mountRepeat.results.filter((x: any) => x.renderer === r), x => x.totalMs))]);
    doc += `\n${raw('mount-repeat')}.\n\n`;
  }
  doc += `\n### ${tr('流式单次提交 P95 / 最差提交', 'Streaming update P95 / worst update')}\n\n`;
  doc += table([tr('场景', 'Scenario'), ...renderers.map(label)], scenarios.filter(s => s.startsWith('stream')).map(s => [s, ...renderers.map(r => { const rows = groups('full-dom', s, r); return `${f(metric(rows, x => x.p95Ms))} / ${f(Math.max(...rows.map(x => x.maxMs)))}`; })]));
  doc += tr('\nP95 是每轮内所有提交的第 95 百分位，再取五轮中位；最差提交取全部样本的最大值。它不等于端到端帧时间，也不保证每帧小于 16.7ms。全部全文样本均在计时之外核对标题、段落、列表、表格与代码文本。\n\n', '\nP95 is the median of per-trial update P95s; worst update is the maximum across all trials. This is not end-to-end frame time or a 16.7ms guarantee. Every full-DOM sample validates headings, prose, lists, tables and fenced-code text outside timing.\n\n');
  doc += `### ${tr('保留堆内存与 DOM', 'Retained heap and DOM')}\n\n`;
  doc += table([tr('场景', 'Scenario'), ...renderers.map(r => `${label(r)} MiB / DOM`)], scenarios.map(s => [s, ...renderers.map(r => { const rows = groups('full-dom', s, r); return `${f(metric(rows, x => x.retainedHeapBytes) / 1048576)} / ${metric(rows, x => x.validation.elements)}`; })]));
  doc += tr('\n堆为显式 GC 后相对于预热空页面的增量，不是浏览器进程 RSS；DOM 只统计正文元素。\n\n', '\nHeap is the post-GC increment over the warmed empty page, not browser-process RSS. DOM counts cover article elements only.\n\n');
  doc += `### ${tr('主线程任务 / 布局时间', 'Main-thread tasks / layout time')}\n\n`;
  doc += table([tr('场景', 'Scenario'), ...renderers.map(r => `${label(r)} ms`)], scenarios.map(s => [s, ...renderers.map(r => { const rows = groups('full-dom', s, r); return `${f(metric(rows, x => x.mainThreadMs))} / ${f(metric(rows, x => x.layoutMs))}`; })]));
  doc += tr('\n以上为 CDP TaskDuration / LayoutDuration 增量的中位数，布局已包含在主线程任务内，不能再次相加。\n\n', '\nThese are medians of CDP TaskDuration / LayoutDuration deltas. Layout is included in task time and must not be added a second time.\n\n');
  doc += `## ${tr('保留默认功能的丰富流式输出', 'Rich streaming with defaults preserved')}\n\n`;
  doc += tr('八节独特的 TypeScript/Python/JSON、公式、表格、任务列表和本地图片；每库三次资源预热页面。最后检查八个章节、结束标记与可见特殊块就绪。同步提交与 CDP 主线程成本分开列出，后者包含异步工作及稳定检测。\n\n', 'Eight sections of unique TypeScript/Python/JSON, formulas, tables, tasks and local images; three resource-warmed pages per renderer. Final checks require eight headings, the end marker and ready visible rich blocks. Commit time is separated from CDP task cost, which includes asynchronous work and settling probes.\n\n');
  doc += table([tr('渲染器', 'Renderer'), tr('通过', 'Passed'), tr('同步总计 ms', 'Commit total ms'), 'P95 ms', 'TaskDuration ms'], renderers.map(r => { const rows = groups('default-streaming', 'rich-stream', r); return [label(r), `${rows.filter(x => x.valid).length}/3`, range(rows, x => x.totalMs), f(metric(rows, x => x.p95Ms)), f(metric(rows, x => x.mainThreadMs))]; }));
  doc += `\n## ${tr('默认阅读：冷启动、滚动、跳转', 'Default reading: cold load, scrolling and seeks')}\n\n`;
  doc += tr('rich-medium 与 rich-mobile 为 24 节，rich-large 为 240 节（831,559 字符、240 个代码块、480 个公式、30 张本地图片）。桌面 1440×900，窄屏 390×900。每库每种情况三个冷浏览器上下文，导航开始后记录首个非空正文帧与可见内容稳定时间。首屏是 DOM + 两次 rAF 代理，稳定检测需要多次一致快照；二者均不是 FCP/LCP。\n\n', 'rich-medium and rich-mobile have 24 sections; rich-large has 240 (831,559 characters, 240 code blocks, 480 formulas, 30 local images). Desktop is 1440×900 and narrow viewport 390×900. Three cold browser contexts per case record first nonempty content and stable visible content from navigation. First content is a DOM + two-rAF proxy; settling requires repeated identical snapshots. Neither is FCP/LCP.\n\n');
  doc += table([tr('场景 / 库', 'Scenario / renderer'), tr('通过', 'Passed'), tr('首屏 ms', 'First content ms'), tr('稳定 ms', 'Stable ms'), tr('滚动 P95 / 最大 ms', 'Scroll P95 / max ms'), tr('最终堆 MiB', 'Final heap MiB')], ['rich-medium', 'rich-large', 'rich-mobile'].flatMap(s => renderers.map(r => {
    const rows = groups('default-reading', s, r), good = rows.filter(x => x.readingPassed);
    const first = rows.map(x => x.initial.readableFromNavigationMs).filter(x => x != null);
    return [`${s} / ${label(r)}`, `${good.length}/3`, first.length ? f(med(first)) : '—', rows.every(x => x.initialSettle.settled) ? f(metric(rows, x => x.initialSettle.fromNavigationMs)) : tr('未稳定', 'not settled'), `${f(metric(rows, x => x.scrolling.frameP95Ms))} / ${f(Math.max(...rows.map(x => x.scrolling.frameMaxMs)))}`, f(metric(rows, x => x.heapAfterBytes) / 1048576)];
  })));
  doc += tr('\n滚动为合成鼠标滚轮，向下 15,000px、向上 6,000px，约七秒；之后跳到全文中部、末尾、顶部。rAF 采集阶段避开全 DOM 快照和 GC。各库文档高度不同，同一像素距离不代表相同章节。堆是浏览完毕后的整个页面 JS 堆（含已加载高亮等资源），不能与上表的增量堆直接相减。\n\n', '\nSynthetic mouse scrolling moves down 15,000px and up 6,000px over about seven seconds, followed by middle/end/top seeks. Scrolling telemetry excludes full DOM scans and GC. Different document heights mean the same pixel distance covers different sections. Final heap is the whole page JS heap after browsing, including resources; it is not the incremental heap reported above.\n\n');
  doc += table([tr('场景 / 库', 'Scenario / renderer'), tr('中部 / 末尾 / 顶部稳定 ms', 'Middle / end / top settle ms'), tr('本地传输 MiB', 'Local transfer MiB'), tr('滚动长任务数', 'Scroll long tasks')], ['rich-medium', 'rich-large', 'rich-mobile'].flatMap(s => renderers.map(r => {
    const rows = groups('default-reading', s, r);
    return [`${s} / ${label(r)}`, [0,1,2].map(i => rows.every(x => x.seeks[i].settled) ? f(metric(rows, x => x.seeks[i].elapsedMs)) : tr('失败', 'failed')).join(' / '), f(metric(rows, x => x.resourcesAfter.transferBytes) / 1048576), String(metric(rows, x => x.scrolling.longTasks.length))];
  })));
  const failed = runs.filter(x => x.suite === 'default-reading' && !x.readingPassed);
  doc += `\n${tr('失败样本', 'Failed samples')}: ${failed.length}/27. `;
  doc += failed.length ? tr('逐例原因如下；这些结果仅适用于当前锁定版本、输入和集成，不泛化到其他版本。\n\n', 'Details below are limited to the locked versions, inputs and integration tested here.\n\n') + table([tr('场景 / 库 / 轮次', 'Scenario / renderer / trial'), tr('首屏空白', 'Initially blank'), tr('未稳定的跳转', 'Unsettled seeks'), tr('末尾可见', 'End visible'), tr('错误', 'Errors')], failed.map(x => [`${x.scenario} / ${label(x.renderer)} / ${x.trial+1}`, String(x.initialSettle.state.blankViewport), x.seeks.filter((s: any) => !s.settled).map((s: any) => s.fraction).join(', ') || '—', String(x.seeks[1].state.endVisible), x.errors.join('; ') || '—'])) : tr('全部通过。\n\n', 'All passed.\n\n');
  doc += tr('\n本轮 rich-medium 第一轮、中部跳转后的实际视口（截图在计时之外）：\n\n', '\nActual viewports after the first rich-medium midpoint seek in this run (screenshots outside timing):\n\n');
  doc += `**LiMR**\n\n![LiMR](../assets/performance/limr-midpoint.png)\n\n**Markstream**\n\n![Markstream](../assets/performance/markstream-midpoint.png)\n\n`;
  doc += `\n## ${tr('Node 解析、SSR 与增量核心', 'Node parsing, SSR and incremental core')}\n\n`;
  doc += tr('同一 Node 进程，一次预热、五次交错采样；SSR 仅 GFM，关闭 Markstream 虚拟化，三库核对章节/表格数量和尾部文本。SSR 不包括水合、DOM 布局和异步高亮。单位 ms，中位数 [最小–最大]。\n\n', 'One Node process, one warmup and five alternating samples; GFM-only SSR with Markstream virtualization disabled. Counts and tail text are checked. SSR excludes hydration, DOM layout and async highlighting. Values are ms, median [min–max].\n\n');
  const msStat = (s: any) => `${f(s.medianMs)} [${f(s.minMs)}–${f(s.maxMs)}]`;
  doc += table([tr('字符数', 'Characters'), 'LiMR SSR', 'react-markdown SSR', 'Markstream SSR', 'LiMR core', 'mdast GFM'], core.results.map((r: any) => [r.characters, ...['limr-ssr','react-markdown-ssr','markstream-ssr','limr-core','mdast-gfm'].map(n => `${msStat(r.measurements[n])}${r.validity[n] === false ? ' (incomplete)' : ''}`)]));
  doc += '\n' + table([tr('核心追加场景', 'Core append scenario'), tr('字符 / 块大小', 'Characters / chunk'), tr('总计 ms', 'Total ms'), tr('追加 P95 ms', 'Append P95 ms'), tr('收尾 ms', 'Finish ms'), tr('完整前缀重解析 ms', 'Full-prefix parse ms')], streaming.results.map((r: any) => { const m = r.measurements.limr; return [r.scenario, `${r.characters} / ${r.chunkSize}`, msStat(m.total), f(med(m.samples.map((x: any) => x.append.p95Ms))), f(med(m.samples.map((x: any) => x.finishMs))), r.measurements['mdast-full-prefix'] ? f(r.measurements['mdast-full-prefix'].total.medianMs) : '—']; }));
  doc += tr('\n完整前缀重解析是 mdast 算法基线，不是 react-markdown 或 Markstream 的完整渲染耗时；不会用它冒充两者的浏览器性能。\n\n', '\nFull-prefix parsing is an mdast algorithm baseline, not react-markdown or Markstream rendering, and is not used to represent their browser performance.\n\n');
  doc += `## ${tr('连续拖选交互', 'Continuous pointer selection')}\n\n`;
  doc += table([tr('场景 / 库', 'Scenario / renderer'), tr('手势 ms', 'Gesture ms'), 'rAF P95 ms', tr('覆盖层 P95 ms', 'Overlay P95 ms'), tr('拖动中绘制次数', 'Paint mutations during drag')], selection.results.map((r: any) => [ `${r.kind} / ${label(r.renderer)}`, f(med(r.samples.map((x: any) => x.elapsedMs))), f(med(r.samples.map((x: any) => x.frameP95Ms))), r.renderer === 'limr' ? f(med(r.samples.map((x: any) => x.paintP95Ms))) : 'N/A', r.renderer === 'limr' ? med(r.samples.map((x: any) => x.paints)) : 'N/A' ]));
  doc += tr('\n每种情况三个独立字体就绪页面，90 次连续鼠标移动，在松开前读取结果。长文 2,000 节，代码 1,000 行。覆盖层指标为 selectionchange 到 DOM 变更，不是实际屏幕绘制或硬件延迟；react-markdown 只有原生选区，没有 LiMR 覆盖层，因此该项不比较。Markstream 未纳入此 LiMR 专属交互套件。\n\n', '\nThree isolated font-ready pages per case, 90 continuous mouse moves, results captured before pointerup. Prose has 2,000 sections; code has 1,000 lines. Overlay latency is selectionchange to DOM mutation, not screen paint or hardware latency. react-markdown has native selection without LiMR overlays; that metric is not comparable. Markstream is not part of this LiMR-specific interaction suite.\n\n');
  doc += `## ${tr('复现、数据与边界', 'Reproduction, data and limits')}\n\n\`\`\`sh\npnpm install --frozen-lockfile\npnpm exec playwright install chromium\npnpm bench\n\`\`\`\n\n`;
  doc += `${tr('原始数据', 'Raw data')}: ${['renderers','core','streaming','selection'].map(raw).join(' · ')}. [${tr('目录与单项命令', 'Layout and individual commands')}](../../benchmarks/README.md).\n\n`;
  doc += tr('表格由 `benchmarks/report.ts` 从本轮 JSON 生成，采用最近秩分位数，三/五轮样本只做描述性统计，没有显著性检验。默认阅读失败会原样呈现；完整矩阵缺失则拒绝生成报告。源码哈希 `', 'Tables are generated from this run by `benchmarks/report.ts`. Quantiles use nearest rank; three/five trials are descriptive, without significance tests. Reading failures remain visible; incomplete matrices reject report generation. Source hash `') + env.sourceSHA256 + '`.\n\n';
  doc += tr('未覆盖：真实手机、其他浏览器、慢网络、服务端并发、压缩包体积、任意第三方插件/密集标注、外部视频、所有 Mermaid 图类型。保留完整 DOM 的实现仍需支付长文初次挂载成本；增量解析对持续增长的复杂单块、中间编辑和全局定义更新仍可能昂贵。不要把这些输入上的倍率当成普遍保证。\n', 'Not covered: physical phones, other browsers, slow networks, server concurrency, compressed bundle sizes, arbitrary third-party plugins/dense annotations, external video or every Mermaid graph type. Full-DOM implementations still pay long-document mount costs; incremental parsing can remain expensive for growing complex blocks, middle edits and global definition changes. Ratios for these inputs are not universal guarantees.\n');
  await writeFile(`${root}/docs/${locale}/performance.md`, doc);

  let kp = header(tr('KP 算法性能报告', 'Knuth–Plass performance report'), 'knuth-plass-performance') + environment;
  kp += tr('KP 是 `typography="knuth-plass"` 的可选段落排版模式。本报告将纯求解器、浏览器排版与交互正确性分开；同时测量当前 standard、CSS justify 和 KP 三种排版模式。\n\n', 'KP is the optional `typography="knuth-plass"` paragraph layout mode. This report separates the pure solver, browser layout and interaction correctness. Standard, CSS justify and KP are measured as three current typography modes.\n\n');
  kp += `## ${tr('算法与执行路径', 'Algorithm and execution path')}\n\n`;
  kp += tr('实现使用 box/glue/penalty、四个松紧等级、TeX 整数 badness、相邻行和连字符罚分，通过活动节点寻找最小 demerits 路径。依次尝试 pretolerance、tolerance 和 emergency；默认阈值 100/200、emergencyStretch=16px。不可拆分的超宽对象保留可见。`prepareKnuthPlass` 缓存宽度、伸缩前缀和及断点辅助数据；重新给定行宽仍然求解，不是直接返回缓存答案。\n\n', 'The implementation uses box/glue/penalty, four fitness classes, TeX integer badness, adjacent-line and hyphen demerits, and active nodes to find a minimum-demerit path. It tries pretolerance, tolerance and emergency passes with default thresholds 100/200 and emergencyStretch=16px. Indivisible overfull content remains visible. `prepareKnuthPlass` retains width/stretch/shrink prefix sums and breakpoint helpers; a new width still invokes solving rather than returning a cached answer.\n\n');
  kp += tr('浏览器层额外执行 Unicode 换行、Knuth–Liang en-US 断词、字体测量、行 DOM 与词间距写入、选区和高亮布局。段落接近视口时排队，读写分批；已有排版节点在滚动时保留。调度器在每个任务后检查约 6ms 预算，并不是可以中断单个长段落的硬限制。活动列表大小受输入、行宽、松紧度与各遍尝试影响，本轮规模曲线不构成最坏复杂度证明。\n\n', 'Browser work additionally includes Unicode line breaking, Knuth–Liang en-US hyphenation, font measurement, line DOM/spacing writes, selection and highlight geometry. Near-viewport paragraphs are queued with batched reads/writes; typeset nodes survive scrolling. The scheduler checks an approximately 6ms budget between jobs; it cannot interrupt one costly paragraph. Active-list size depends on input, widths, looseness and passes, so the measured scaling is not a worst-case complexity proof.\n\n');
  kp += `[${tr('求解器源码', 'Solver source')}](https://github.com/Linloir/LiMR/blob/main/src/core/knuth-plass.ts) · [${tr('浏览器集成', 'Browser integration')}](https://github.com/Linloir/LiMR/blob/main/src/react/knuth-plass-layout.ts) · [${tr('独立穷举正确性测试', 'Independent exhaustive correctness tests')}](https://github.com/Linloir/LiMR/blob/main/tests/knuth-plass.test.ts).\n\n`;
  kp += `## ${tr('纯算法：规模与重新求解', 'Pure algorithm: scaling and re-solving')}\n\n`;
  kp += tr('确定性合成像素宽度输入，每项三次预热、15 次循环顺序采样；小输入批量执行后除以调用次数以降低计时噪声，批量参数和原始值均在 JSON。输入准备（造词/断词/测量）不计入。下面的“准备+求解”仅包含前缀数组准备和求解；“已准备求解”复用前缀数组，仍执行算法。单位 ms，中位数 / P95 / 最大值；15 个样本的最近秩 P95 等于最大值。\n\n', 'Deterministic synthetic pixel-width inputs, three warmups and 15 cyclic samples per operation. Small inputs are batched and normalized per call to reduce timer noise; batch sizes and raw values are in JSON. Input creation, hyphenation and glyph measurement are excluded. “Prepare + solve” includes prefix-array preparation and solving only; “Prepared solve” retains arrays but still runs the solver. Values are ms, median / P95 / max; with 15 samples, nearest-rank P95 equals the maximum.\n\n');
  const trio = (s: any) => `${f(s.medianMs,3)} / ${f(s.p95Ms,3)} / ${f(s.maxMs,3)}`;
  kp += table([tr('场景', 'Scenario'), tr('词 / item / 行', 'Words / items / lines'), tr('准备+求解', 'Prepare + solve'), tr('已准备求解', 'Prepared solve'), tr('12 次变宽总计', '12-width total'), 'pass'], algorithm.results.map((r: any) => [r.scenario, `${r.words} / ${r.items} / ${r.lines}`, trio(r.measurements['prepare-and-solve']), trio(r.measurements['prepared-solve']), trio(r.measurements['responsive-12-widths']), r.pass]));
  kp += tr('\n12 次变宽测试为 240–680px、步长 40px，总计含完整路径检查；它不是单次 resize 的浏览器耗时。覆盖窄列、自动连字符、首行缩进/变行宽、looseness、应急拉伸和超宽原子对象。每次检查路径递增、终点覆盖和有限罚分，并核对直接/准备后求解结果一致。独立单元测试另外穷举 64 个九词段落的所有分行，核对最小罚分，并检查连字符与强制换行。\n\n', '\nThe 12-width operation covers 240–680px in 40px steps and includes complete-path checks; it is not one browser resize. Cases cover narrow columns, discretionary hyphens, varying line widths, looseness, emergency stretch and overfull atomic content. Each checks increasing breaks, terminal coverage and finite demerits; direct and prepared results must agree. Separate unit tests exhaustively enumerate partitions of 64 nine-word paragraphs and check minimum cost, hyphens and forced breaks.\n\n');
  kp += `## ${tr('真实浏览器：完整论文阅读', 'Real browser: full paper reading')}\n\n`;
  kp += `${tr('输入', 'Input')}: scikit-learn, ${layout.fixture.characters.toLocaleString('en-US')} UTF-16 ${tr('字符', 'characters')}; SHA-256 \`${layout.fixture.sourceSHA256}\`.\n\n`;
  kp += tr('生产 Playground 保留 Reader 目录、侧栏和插件。standard、justify、KP 在 1380×1000 和 390×1000 下各三次独立页面，共 18 次。先载入论文、等待字体；KP 激活包含菜单操作、协议与按需模块加载，standard 只等待稳定，因此不应把激活时间当作三种算法公平的挂载对比。每页三轮各 120 步上下滚动，首轮包含首次进入视口的排版，后两轮复用已排版内容。\n\n', 'Production Playground retains Reader TOC, sidebar and plugins. Standard, justify and KP each run three fresh pages at 1380×1000 and 390×1000 (18 total). The paper and fonts load first. KP activation includes menu/protocol and lazy module loading, whereas standard only waits for stability; activation is not a fair mount-time algorithm comparison. Each page performs three 120-step down/up sweeps; the first encounters new paragraphs and the other two revisit cached layout.\n\n');
  const kg = (width: number, mode: string) => layout.results.filter((r: any) => r.viewport.width === width && r.mode === mode);
  kp += table([tr('视口 / 模式', 'Viewport / mode'), tr('通过', 'Passed'), tr('激活稳定 ms', 'Activation stable ms'), tr('首轮 rAF P95 / 最大', 'First sweep P95 / max'), tr('复访 rAF P95 / 最大', 'Revisit P95 / max'), tr('>50ms 帧', '>50ms frames')], [1380,390].flatMap(width => modes.map(mode => { const rows = kg(width,mode), first = rows.flatMap((r: any) => r.scroll[0].samples), warm = rows.flatMap((r: any) => r.scroll.slice(1).flatMap((s: any) => s.samples)); return [ `${width} / ${mode}`, `${rows.filter((r: any) => r.valid).length}/3`, f(metric(rows,r=>r.activationMs)), `${f(quantile(first,.95))} / ${f(Math.max(...first))}`, `${f(quantile(warm,.95))} / ${f(Math.max(...warm))}`, `${[...first,...warm].filter(v=>v>50).length} / ${first.length+warm.length}` ]; })));
  kp += tr('\n此表按视口和模式合并滚动帧（每组 1,080 个），rAF 从 scrollTo 到下一次回调；回调不等于最终绘制完成。完整原始序列保留，超 50ms 的帧不被删除。\n\n', '\nScroll frames are pooled by viewport/mode (1,080 per group), measured from scrollTo to the next rAF callback, not completed paint. Raw sequences retain every frame above 50ms.\n\n');
  kp += `### ${tr('窗口宽度变化与稳定布局', 'Viewport changes and stable layout')}\n\n`;
  kp += tr('每页按 1380、1200、960、800、640、480、390、480、640、800、1200、1380px 改变宽度；记录实际段落宽度，避免只改变外围空白。每次分别记录下一 rAF 和可见布局连续四帧一致的耗时。后者包括协议及稳定检测的等待下限，不是纯求解时间。\n\n', 'Each page visits widths 1380, 1200, 960, 800, 640, 480, 390, 480, 640, 800, 1200 and 1380px, recording actual paragraph widths. Each change measures next rAF and four consecutive stable visible-layout frames. Settling includes protocol and the detection delay; it is not pure solver time.\n\n');
  kp += table([tr('初始视口 / 模式', 'Initial viewport / mode'), tr('rAF P50 / P95 / 最大 ms', 'rAF P50 / P95 / max ms'), tr('稳定 P50 / P95 / 最大 ms', 'Stable P50 / P95 / max ms'), tr('段落宽度 px', 'Paragraph width px')], [1380,390].flatMap(width=>modes.map(mode=>{ const rows=kg(width,mode), samples=rows.flatMap((r:any)=>r.resize), a=samples.map((x:any)=>x.frameMs), b=samples.map((x:any)=>x.settledMs), widths=samples.map((x:any)=>x.contentWidth); return [`${width} / ${mode}`, `${f(med(a))} / ${f(quantile(a,.95))} / ${f(Math.max(...a))}`, `${f(med(b))} / ${f(quantile(b,.95))} / ${f(Math.max(...b))}`, `${f(Math.min(...widths),0)}–${f(Math.max(...widths),0)}`];})));
  kp += `\n### ${tr('主线程、内存和正确性', 'Main thread, memory and correctness')}\n\n`;
  kp += table([tr('初始视口 / 模式', 'Initial viewport / mode'), tr('滚动 TaskDuration ms', 'Scroll TaskDuration ms'), tr('最终堆 MiB', 'Final heap MiB'), 'DOM', tr('文本 / 原生选区 / 缓存保留', 'Text / native range / cache retained')], [1380,390].flatMap(width=>modes.map(mode=>{ const rows=kg(width,mode); return [`${width} / ${mode}`, f(metric(rows,r=>r.scrollMainThreadMs)), f(metric(rows,r=>r.heapBytes)/1048576), metric(rows,r=>r.nodes), ['contentPreserved','selectionPreserved','cachedNodesPreserved'].map(k=>k === 'cachedNodesPreserved' && mode !== 'knuth-plass' ? 'N/A' : `${rows.filter((r:any)=>r[k]).length}/3`).join(' / ')];})));
  kp += tr('\n内存/DOM 在滚动和变宽完成、最终 390px、显式 GC 后采样。正确性检查覆盖第一段原文、跨缩放原生 Range、滚动后的首段缓存节点、可见段落 stale 标记与页面横向溢出；原始数据保留所有失败。另由浏览器回归测试验证中英混排、行内代码/公式、选区复制、高亮几何和字号改变。\n\n', '\nHeap/DOM are sampled after scrolling and resizing, at final 390px and after explicit GC. Checks cover first-paragraph text, native Range across resize, cached first-paragraph nodes after scrolling, visible stale markers and horizontal overflow; failures remain in raw data. Browser regressions additionally verify mixed Chinese/English, inline code/math, copying, highlight geometry and font-size changes.\n\n');
  const invalid = layout.results.filter((r:any)=>!r.valid);
  kp += `${tr('本轮浏览器验收', 'Browser acceptance')}: **${18-invalid.length}/18**.\n\n`;
  if (invalid.length) kp += table([tr('失败场景', 'Failed case'), tr('详情', 'Details')], invalid.map((r:any)=>[`${r.viewport.width}/${r.mode}/${r.trial+1}`, JSON.stringify({ activation:r.activationState.settled, content:r.contentPreserved, selection:r.selectionPreserved, cache:r.cachedNodesPreserved, resizeFailures:r.resize.filter((x:any)=>!x.settled||x.horizontalOverflow>1), errors:r.errors })]));
  kp += `## ${tr('结论与使用边界', 'Interpretation and limits')}\n\n`;
  const largest = algorithm.results.find((r: any) => r.scenario === 'words-10000');
  const desktopKP = kg(1380, 'knuth-plass').flatMap((r: any) => r.scroll.flatMap((s: any) => s.samples));
  const desktopStandard = kg(1380, 'standard').flatMap((r: any) => r.scroll.flatMap((s: any) => s.samples));
  kp += tr(`本轮 10,000 词合成段落的准备+求解中位数为 **${f(largest.measurements['prepare-and-solve'].medianMs, 3)}ms**，复用准备后的求解为 **${f(largest.measurements['prepared-solve'].medianMs, 3)}ms**。完整论文桌面滚动的合并 P95 为 standard **${f(quantile(desktopStandard, .95))}ms**、KP **${f(quantile(desktopKP, .95))}ms**；KP 的 DOM 和主线程成本更高，宽度变化的额外耗时见上表。\n\n`, `For the 10,000-word synthetic paragraph, median preparation + solving is **${f(largest.measurements['prepare-and-solve'].medianMs, 3)}ms**, and solving with preparation retained is **${f(largest.measurements['prepared-solve'].medianMs, 3)}ms**. Pooled desktop paper scrolling P95 is **${f(quantile(desktopStandard, .95))}ms** for standard and **${f(quantile(desktopKP, .95))}ms** for KP. KP has higher DOM and main-thread costs; resizing adds the overhead shown above.\n\n`);
  kp += tr('算法微基准说明已测输入规模和路径的成本；实际可感知延迟还取决于字体、段落数量、DOM 和浏览器调度。KP 的长段落求解和宽度变化可能产生额外工作，不能由缓存滚动的结果推导出免费排版。需要最少排版工作时可使用默认 standard；需要段落级优化时评估 KP 的实际内容、窄列和设备表现。浏览器字形测量与 TeX PDF 不保证逐像素一致。本轮未覆盖所有语言断词词典、病态负宽度输入、任意 looseness 或物理低端手机，也未与原生 TeX 的运行速度做跨语言比较。\n\n', 'The microbenchmark describes cost for the measured inputs and paths; perceived delay also depends on fonts, paragraph count, DOM and scheduling. Long paragraphs and changing widths can add KP work; cached scrolling does not imply free typography. Standard is the default for minimal typesetting work; evaluate KP using real content, narrow columns and target devices when paragraph optimization is needed. Browser glyph measurements do not promise pixel-identical TeX PDFs. This run does not cover every language dictionary, pathological negative widths, arbitrary looseness or physical low-end phones, and does not compare execution speed with native TeX.\n\n');
  kp += `## ${tr('复现与原始数据', 'Reproduction and raw data')}\n\n\`\`\`sh\npnpm bench:kp\npnpm build:playground\npnpm preview:playground --port 4174\n# ${tr('在另一个终端；先完成构建，再测量', 'In another terminal, after the build has finished')}\npnpm bench:layout\n\`\`\`\n\n${raw('kp-algorithm')} · ${raw('kp-browser')} · [${tr('全部基准说明', 'All benchmark instructions')}](../../benchmarks/README.md) · [${tr('渲染器对比', 'Renderer comparison')}](performance.md).\n`;
  await writeFile(`${root}/docs/${locale}/knuth-plass-performance.md`, kp);
}
console.log('Generated four bilingual report pages from a complete current-source matrix.');
