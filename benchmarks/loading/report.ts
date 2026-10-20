import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { root, environment } from '../shared/environment';
import { quantile } from '../shared/stats';
import { validateLargeComparison, largeComparisonSection } from '../large-comparison/report';

type Row = Record<string, any>;
export async function writeExtendedReports(base: Row) {
  const load = async (name: string) => JSON.parse(await readFile(`${root}/benchmarks/results/${name}.json`, 'utf8'));
  const [loading, reading, comparison, current] = await Promise.all([load('loading'), load('reading'), load('large-comparison'), environment()]);
  validateLargeComparison(comparison);
  for (const data of [loading, reading, comparison]) assert.equal(data.environment.mode, 'production');
  for (const data of [loading.environment, reading.environment, comparison.environment, current]) {
    for (const key of ['sourceSHA256', 'harnessSHA256', 'playgroundSHA256', 'examplesSHA256', 'lockSHA256', 'liMR']) {
      assert.equal(data[key], base[key], `Mixed ${key} in extended benchmark matrix`);
    }
    assert.deepEqual(data.versions, base.versions);
  }
  assert.ok(loading.complete && reading.complete, 'Extended results must be complete');
  assert.ok(!loading.configuration.partial && loading.configuration.repeats === 3);
  assert.equal(loading.configuration.cases.length, 8); assert.equal(loading.runs.length, 24);
  for (const item of loading.configuration.cases) {
    const rows = loading.runs.filter((row: Row) => row.corpus === item.corpus && row.mode === item.mode && row.typography === item.typography);
    assert.deepEqual(rows.map((row: Row) => row.trial).sort(), [0, 1, 2]);
    assert.ok(rows.every((row: Row) => row.corpusSHA256 === loading.corpora.find((corpus: Row) => corpus.id === item.corpus).sha256));
  }
  assert.equal(reading.runs.length, 36);
  for (const document of loading.papers) for (const typography of ['standard', 'justify', 'knuth-plass']) for (const sidebarCollapse of [true, false]) {
    const rows = reading.runs.filter((row: Row) => row.document === document.name && row.typography === typography && row.sidebarCollapse === sidebarCollapse);
    assert.deepEqual(rows.map((row: Row) => row.repeat).sort(), [0, 1, 2]);
    assert.ok(rows.every((row: Row) => row.renderer === 'async' && row.sidebar && row.documentSHA256 === document.sha256));
  }
  const f = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : '—';
  const med = (rows: Row[], fn: (row: Row) => number) => quantile(rows.map(fn), .5);
  const span = (rows: Row[], fn: (row: Row) => number) => `${f(med(rows, fn))} [${f(Math.min(...rows.map(fn)))}–${f(Math.max(...rows.map(fn)))}]`;
  const table = (headers: string[], rows: (string | number)[][]) => `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
  const valid = (row: Row) => Object.values(row.checks).every(Boolean);
  const observed = (row: Row) => row.browserEnvironment.performanceEnvironmentVerified;
  for (const zh of [true, false]) {
    const tr = (cn: string, en: string) => zh ? cn : en;
    const groups = loading.configuration.cases.map((item: Row) => ({ ...item, rows: loading.runs.filter((row: Row) => row.corpus === item.corpus && row.mode === item.mode && row.typography === item.typography) }));
    const label = (item: Row) => `${item.corpus} / ${item.mode}${item.typography === 'knuth-plass' ? ' / KP' : ''}`;
    let text = `# ${tr('加载与内存性能', 'Loading and memory performance')}\n\n[${tr('文档目录', 'Documentation')}](README.md) · [${zh ? 'English' : '简体中文'}](../${zh ? 'en' : 'zh-CN'}/loading-performance.md)\n\n`;
    text += tr('本报告测量完整输入通过 `AsyncReader`、真实 Worker 和默认阅读功能的加载、内存及交互。加载模式决定正文何时可以开始显示；默认 Worker 的解析策略、完整源文档和索引不会因为渐进显示而省略。\n\n', 'This report measures complete inputs through `AsyncReader`, a real worker and default reading features. Loading mode controls when reading can begin; progressive display does not omit parsing, full source storage or global indexes.\n\n');
    text += `LiMR **${base.liMR}** · React **${base.versions.react}** · Chromium **${loading.environment.browser}** · Node **${base.node}**. ${base.cpu}; ${base.logicalCPUs} ${tr('逻辑核', 'logical CPUs')}; ${f(base.memoryBytes / 2 ** 30, 1)} GiB; ${base.platform}.\n\n`;
    text += largeComparisonSection(comparison, zh);
    text += `## ${tr('输入与测试边界', 'Inputs and boundaries')}\n\n`;
    text += tr('每个加载组合使用三个全新浏览器进程，1440×1000 CSS 视口。正文、目录、折叠侧栏、动画、代码高亮、公式、图片与自动 DOM 窗口均保留；没有通过关闭功能降低成本。输入文件先取得为 Blob，计时从交给组件开始，包含 UTF-8 解码、Worker 解析和索引、结果传输与接收、React 正文挂载，不含磁盘/网络获取和样本生成。\n\n', 'Each loading combination uses three fresh browser processes at a 1440×1000 CSS viewport. Body, TOC, folded sidebar, animations, highlighting, math, images and automatic DOM windows stay enabled. The file is fetched as a Blob before timing; timing starts when it is passed to the component and includes UTF-8 decoding, worker parsing/indexing, transport/adoption and React mounting. Disk/network acquisition and corpus construction are excluded.\n\n');
    text += table([tr('样本', 'Corpus'), 'UTF-8 MiB', 'UTF-16', tr('完整单元数', 'Complete units')], loading.corpora.map((corpus: Row) => [corpus.id, f(corpus.bytes / 1048576), corpus.utf16.toLocaleString('en-US'), corpus.units]));
    text += tr('\n`prose` 是中文纯段落；`papers` 反复拼接 Transformer 与 GPT 综述的完整双语标注文档，保留表格、数学、代码、图片和重复定义 ID，达到目标体积后不截断最后一份论文；它不是独立撰写的 50/75 MiB 文档。`unique-rich` 是 10 MiB 确定性合成内容，每节有独立编号、引用定义和脚注，覆盖去重收益较小的情况。原始 JSON 保存字节数、UTF-16 长度、单元数、内容哈希和所有计数；论文正文与媒体来自本地语料，不随仓库分发。\n\n', '\n`prose` consists of Chinese paragraphs. `papers` repeats the complete annotated Transformer and GPT survey documents, retaining tables, math, code, images and repeated definition IDs; the final paper is never truncated at the size target. It is not a uniquely authored 50/75 MiB document. `unique-rich` is 10 MiB of deterministic synthetic content with distinct section IDs, reference definitions and footnotes, testing a less deduplicable graph. Raw JSON retains byte/UTF-16 counts, units, hashes and structural counts. Paper text and media come from a local corpus and are not distributed with the repository.\n\n');
    text += `## ${tr('从输入到可阅读正文', 'From input to readable content')}\n\n`;
    text += tr('单位秒，中位数 [最小–最大]。预览必须有当前 provisional engine 的可见标题和段落，再经过一帧；完整可读要求完整 engine 的相同可见性检查、字体就绪及下一帧。DOM/帧代理不等同于像素实际呈现，也不是 FCP/LCP。`blocking` 不提供预览；最终就绪时进度才到 100%。\n\n', 'Seconds, median [min–max]. Preview requires visible heading and paragraph from the current provisional engine followed by another frame. Complete readability requires the full engine, the same visibility checks, font readiness and another frame. DOM/frame proxies do not measure physical presentation or FCP/LCP. Blocking mode has no preview; progress reaches 100% only when the complete snapshot is ready.\n\n');
    text += table([tr('场景', 'Case'), tr('预览可读 s', 'Preview readable s'), tr('完整就绪 s', 'Complete ready s'), tr('完整正文可见 s', 'Complete visible s'), tr('验收', 'Checks')], groups.map((item: Row) => [label(item), item.rows.every((row: Row) => row.load.prefix?.nextFrameAtMs != null) ? span(item.rows, row => row.load.prefix.nextFrameAtMs / 1000) : '—', span(item.rows, row => row.load.readyMs / 1000), span(item.rows, row => row.load.completeVisibleMs / 1000), `${item.rows.filter(valid).length}/${item.rows.length}`]));
    text += `\n## ${tr('内存：进程、堆和缓冲区', 'Memory: process, heap and buffers')}\n\n`;
    text += tr('MiB，中位数 [最小–最大]。外部每 25ms 读取 Linux `/proc`，峰值覆盖加载、空闲及后续阅读探测；空闲值在完整正文可见后等待 5 秒取得，不强制 GC。Renderer RSS 包括主线程与 Worker、引擎空间及原生分配，并不等于 JS 活对象大小；采样峰值可能漏过更短的尖峰。主 isolate 堆和 backing storage 另由 CDP 读取，不含独立 Worker 的 JS 堆，不能与 RSS 相加。\n\n', 'MiB, median [min–max]. Linux `/proc` is sampled externally every 25ms across loading, idle and subsequent reading probes. Idle values follow five seconds after complete visible content; there is no forced GC. Renderer RSS includes main/worker threads, engine spaces and native allocations, rather than only live JS objects; sampling can miss shorter peaks. Main-isolate heap and backing storage are separately observed through CDP, exclude a separate worker heap and must not be added to RSS.\n\n');
    text += table([tr('场景', 'Case'), tr('峰值 Renderer RSS', 'Peak renderer RSS'), tr('5s 空闲 RSS', '5s idle RSS'), tr('主线程 JS 堆', 'Main JS heap'), tr('主线程 backing storage', 'Main backing storage')], groups.map((item: Row) => [label(item), span(item.rows, row => row.peakRendererRSS / 1048576), span(item.rows, row => row.idle.rendererRSS / 1048576), f(med(item.rows, row => row.idle.mainIsolate.usedSize) / 1048576), f(med(item.rows, row => row.idle.mainIsolate.backingStorageSize) / 1048576)]));
    text += tr('\n这些结果没有 2 GiB 的硬性上限。完整源文本、AST 和全局索引仍随文档复杂度增长；分页打包和字符串/形状去重减少传输重叠，并没有把公开快照改成按需解压的磁盘存储。DOM 窗口减少挂载成本，不会把整个语法树从内存移走。单个巨大列表、表格、围栏或自定义语法还可能超出窗口化/有界解析条件。\n\n', '\nThere is no hard 2 GiB bound. Complete source, AST and indexes still grow with document complexity. Paged transport and string/shape deduplication reduce transfer overlap; the public snapshot is not an on-demand compressed disk store. DOM windows reduce mounting costs without removing the full syntax tree from memory. A single enormous list, table, fence or custom syntax can also exceed the windowing/bounded-parsing conditions.\n\n');
    text += `## ${tr('加载后的长文阅读', 'Reading after loading')}\n\n`;
    text += tr('每个大文档完成后跳至顶部、25%、50%、75%、结尾和顶部，验证视口中有正文、结尾标记可见且无水平溢出。随后分别执行 60 帧常速与 60 帧快速滚动；数值为各次运行 rAF 间隔 P95 的中位数，不是完整文档每一处内容的覆盖率或输入延迟。\n\n', 'After each large load, source seeks visit the top, 25%, 50%, 75%, end and top, checking visible body content, the final sentinel and horizontal overflow. Then 60 steady and 60 fast scroll frames are recorded. Values are medians of per-run rAF interval P95s, not exhaustive document coverage or input latency.\n\n');
    text += table([tr('场景', 'Case'), tr('常速 P95 ms', 'Steady P95 ms'), tr('快速 P95 ms', 'Fast P95 ms'), tr('首屏 DOM 元素', 'Initial DOM elements')], groups.map((item: Row) => [label(item), f(med(item.rows, row => row.probes.steadyFrames.p95Ms)), f(med(item.rows, row => row.probes.fastFrames.p95Ms)), med(item.rows, row => row.load.nodes)]));
    text += `\n## ${tr('完整论文与交互矩阵', 'Complete papers and interaction matrix')}\n\n`;
    text += tr('另使用两个完整原始论文、三种排版、两种侧栏折叠方式，各三个独立页面，共 36 次 AsyncReader 阅读。Worker 与自动窗口化开启，保留默认功能；每页测试 480px/s 阅读、快速滚动、120 次全文跳转、静止及滚动中切换译文、两次变宽。下表按论文与排版合并两种侧栏，共六次运行；值为每次运行 P95 的中位数。\n\n', 'A separate 36-run AsyncReader matrix uses two complete original papers, three typography modes and two sidebar-folding settings, with three fresh pages per combination. Real workers, automatic windowing and default features stay enabled. Each page tests 480px/s reading, fast scrolling, 120 full-document seeks, translation switches at rest and during scrolling, and two resizes. Rows pool the two sidebar configurations into six runs per paper/typography; values are medians of per-run P95s.\n\n');
    text += table([tr('论文 / 排版', 'Paper / typography'), tr('内容验收', 'Content checks'), tr('环境核实', 'Environment verified'), tr('常速 P95 ms', 'Steady P95 ms'), tr('快速 P95 ms', 'Fast P95 ms'), tr('跳转 P95 ms', 'Seek P95 ms')], loading.papers.flatMap((paper: Row) => ['standard', 'justify', 'knuth-plass'].map(mode => {
      const rows = reading.runs.filter((row: Row) => row.document === paper.name && row.typography === mode);
      return [`${paper.name.startsWith('1706') ? 'Transformer' : 'GPT survey'} / ${mode}`, `${rows.filter(valid).length}/${rows.length}`, `${rows.filter(observed).length}/${rows.length}`, f(med(rows, row => row.steady.frames.p95Ms)), f(med(rows, row => row.fast.frames.p95Ms)), f(med(rows, row => row.seeks.frames.p95Ms))];
    })));
    const loadingGPU = loading.runs[0].browserEnvironment.before.gpu.value.gpu;
    const readingGPU = reading.runs[0].browserEnvironment.before.gpu.value.gpu;
    text += tr(`\n大输入运行在 **${loading.runs[0].browserIdentity.requested.mode}**；完整论文矩阵运行在 **${reading.environment.browserEnvironment.requested.mode}**。两组不合并计时。实际 GPU renderer 分别为 \`${loadingGPU.auxAttributes.glRenderer}\` 与 \`${readingGPU.auxAttributes.glRenderer}\`；compositing 状态分别为 \`${loadingGPU.featureStatus.gpu_compositing}\`、\`${readingGPU.featureStatus.gpu_compositing}\`。窗口模式本身不代表硬件加速。\n\n`, `\nLarge inputs run **${loading.runs[0].browserIdentity.requested.mode}**; the paper matrix runs **${reading.environment.browserEnvironment.requested.mode}**. Their timings are not pooled. Observed GPU renderers are \`${loadingGPU.auxAttributes.glRenderer}\` and \`${readingGPU.auxAttributes.glRenderer}\`, with compositing status \`${loadingGPU.featureStatus.gpu_compositing}\` and \`${readingGPU.featureStatus.gpu_compositing}\`. Window mode does not itself establish hardware acceleration.\n\n`);
    const failures = [...loading.runs, ...reading.runs].filter(row => !valid(row) || !observed(row));
    if (failures.length) text += table([tr('未通过项', 'Failed checks'), tr('详情', 'Details')], failures.map(row => [row.corpus ?? row.document, JSON.stringify({ trial: row.trial ?? row.repeat, typography: row.typography, mode: row.mode, checks: row.checks, environment: row.browserEnvironment.issues })]));
    text += `## ${tr('复现与原始数据', 'Reproduction and raw data')}\n\n`;
    text += tr('下列命令串行运行基础比较矩阵、大输入加载与完整论文阅读，并校验源代码、测试代码、Playground、示例插件、锁文件及版本哈希一致后生成报告和首页指标。完整论文阶段默认使用 headed Chromium，需要可用图形会话；设置 `BENCH_BROWSER_MODE=headless` 可单独生成明确标注的 headless 数据。不要同时运行构建或其他测试。\n\n', 'The following command serially runs the comparison matrix, large-input loading and full-paper reading, then checks source, harness, Playground, example-plugin, lockfile and version fingerprints before generating reports and Home metrics. The paper stage defaults to headed Chromium and requires a graphical session; `BENCH_BROWSER_MODE=headless` can explicitly generate headless evidence instead. Do not run builds or other tests concurrently.\n\n');
    text += '```sh\npnpm install --frozen-lockfile\npnpm exec playwright install chromium\nBENCH_READING_SOURCE_DIR=/path/to/test-reading pnpm bench --extended\n# Regenerate only, after all matching results exist:\nBENCH_EXTENDED=1 pnpm bench:report\n```\n\n';
    text += `[loading.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/loading.json) · [reading.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/reading.json) · [${tr('测试说明', 'Benchmark guide')}](https://github.com/Linloir/LiMR/blob/main/benchmarks/README.md) · [${tr('加载 API 与限制', 'Loading API and limits')}](large-documents.md) · [${tr('渲染与流式性能', 'Rendering and streaming')}](performance.md).\n`;
    await writeFile(`${root}/docs/${zh ? 'zh-CN' : 'en'}/loading-performance.md`, text);
  }
}
