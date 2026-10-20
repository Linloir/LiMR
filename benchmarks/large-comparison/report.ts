import assert from 'node:assert/strict';
import { quantile } from '../shared/stats';
type Row = Record<string, any>;
export function validateLargeComparison(data: Row) {
  assert.ok(data.complete && !data.configuration.partial);
  assert.equal(data.configuration.trialTimeoutMs, 180000);
  assert.equal(data.configuration.rendererRSSGuardBytes, 6 * 1024 ** 3);
  assert.equal(data.configuration.repeats, 3); assert.equal(data.runs.length, 36);
  for (const kind of ['prose', 'rich']) for (const size of [50, 75]) for (const renderer of ['limr', 'react-markdown', 'markstream']) {
    const corpus = data.corpora.find((row: Row) => row.id === `${kind}-${size}`);
    assert.ok(corpus && corpus.bytes >= size * 1048576);
    const rows = data.runs.filter((row: Row) => row.corpus === corpus.id && row.renderer === renderer);
    assert.deepEqual(rows.map((row: Row) => row.trial).sort(), [0, 1, 2]);
    assert.ok(rows.every((row: Row) => row.corpusSHA256 === corpus.sha256 && row.outcome && row.samples.length));
  }
}
export function largeComparisonSection(data: Row, zh: boolean) {
  const tr = (cn: string, en: string) => zh ? cn : en;
  const f = (number: number) => Number.isFinite(number) ? number.toFixed(2) : '—';
  const table = (headers: string[], rows: (string | number)[][]) => `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
  const median = (rows: Row[], fn: (row: Row) => number) => rows.length ? f(quantile(rows.map(fn), .5)) : '—';
  const span = (rows: Row[], fn: (row: Row) => number) => rows.length ? `${median(rows, fn)} [${f(Math.min(...rows.map(fn)))}–${f(Math.max(...rows.map(fn)))}]` : '—';
  const label = (renderer: string) => ({ limr: 'LiMR', 'react-markdown': 'react-markdown', markstream: 'Markstream' }[renderer] ?? renderer);
  const outcomes: Record<string, string> = {
    completed: tr('通过', 'Passed'), 'memory-guard': tr('6 GiB RSS 保护中止', '6 GiB RSS guard'), timeout: tr('180s 超时', '180s timeout'),
    'unreadable-timeout': tr('170s 内首屏不可读', 'No readable start within 170s'), 'renderer-crash': tr('渲染进程退出', 'Renderer crashed'),
    'incomplete-content': tr('首/中/尾内容未通过', 'Content checks failed'), 'resource-or-page-error': tr('资源/页面错误', 'Resource/page error'),
    'unverified-environment': tr('环境未核实', 'Environment unverified'), error: tr('运行错误', 'Run error'),
  };
  const first = data.runs[0];
  const gpu = first.environmentBefore?.before?.gpu?.value?.gpu;
  const groups = data.corpora.flatMap((corpus: Row) => ['limr', 'react-markdown', 'markstream'].map(renderer => ({ corpus, renderer,
    rows: data.runs.filter((row: Row) => row.corpus === corpus.id && row.renderer === renderer) })));
  let doc = `## ${tr('50/75 MiB 横向比较', '50/75 MiB renderer comparison')}\n\n`;
  doc += tr(`相同完整输入，LiMR **${data.environment.liMR}**、react-markdown **${data.environment.versions['react-markdown']}**、Markstream **${data.environment.versions['markstream-react']}**，四类输入各运行三个全新浏览器进程，共 36 次。共同语法包含 Markdown/GFM、代码、公式和本地图片，不把 LiMR 独有的翻译/批注语法放进横向排名。保留各自默认动画、延迟渲染与窗口化策略。\n\n`, `Identical complete inputs are tested with LiMR **${data.environment.liMR}**, react-markdown **${data.environment.versions['react-markdown']}** and Markstream **${data.environment.versions['markstream-react']}**. Four inputs each use three fresh browser processes per renderer, for 36 trials. Shared syntax covers Markdown/GFM, code, math and local images; LiMR-only translation/annotation syntax is excluded from comparative claims. Default animations, deferred rendering and windowing policies remain enabled.\n\n`);
  doc += table([tr('共同输入', 'Shared input'), 'UTF-8 MiB', 'UTF-16', tr('完整单元数', 'Complete units')], data.corpora.map((row: Row) => [row.id, f(row.bytes / 1048576), row.utf16.toLocaleString('en-US'), row.units]));
  doc += tr('\n`prose` 为中文段落；`rich` 每节使用独立编号、代码与公式，另含格式化正文、表格、任务列表、引用与本地图。所有输入保留完整最后一节和结尾校验标记。共同输入由仓库脚本确定性生成，不依赖外部论文文件。\n\n', '\n`prose` contains Chinese paragraphs. Each `rich` section has distinct IDs, code and formulas plus formatted prose, tables, tasks, quotes and local diagrams. All inputs retain complete final units and a tail sentinel. These shared corpora are generated deterministically by the repository script without external paper files.\n\n');
  doc += table([tr('集成', 'Integration'), tr('实际配置', 'Configuration')], [
    ['LiMR', tr('AsyncReader 默认 blocking + 标准 Worker；默认模块、目录、侧栏和动画；自动正文窗口', 'AsyncReader default blocking + standard worker; default modules, TOC, sidebar and motion; automatic body windows')],
    ['react-markdown', 'ReactMarkdown + remark-gfm + remark-math + rehype-katex + async Shiki; full DOM'],
    ['Markstream', 'MarkdownRender content + final=true; default virtualization/batching/lazy rendering/effects; package CSS + KaTeX + stream-diffs'],
  ]);
  doc += tr('\n这是各组件公开接口的应用接入比较，各自承担的 DOM 与 UI 工作并不相同。没有给对比库补写 Worker 或窗口系统，也没有禁用 LiMR 的默认阅读功能。字体/样式沿用各自集成；正文实际宽度在原始数据中记录。统一 1440×1000 视口，文件预先取得为 Blob；首屏计时包含解码、解析、渲染、字体就绪及两帧，要求开头标题与段落在视口可见。只出现空壳或末尾内容不算首屏可读；若滚动位置为顶部、结尾已挂载而开头持续缺失 5 秒，也记录首次阅读失败。\n\n', '\nThis compares application integrations through public APIs; DOM/UI work differs. No custom worker/windowing layer is added to peers and no default LiMR reading features are disabled. Each integration retains its styles/fonts, and actual body widths are recorded. All use 1440×1000 viewports with a prefetched Blob. First readability includes decoding, parsing, rendering, fonts and two frames, requiring the opening heading and paragraph to be visible; a shell or only the document end does not qualify. A mounted document end at scroll position zero with the opening still absent for five seconds also fails initial reading.\n\n');
  doc += table([tr('输入 / 渲染器', 'Input / renderer'), tr('完整阅读验收', 'Reading checks'), tr('首屏可读 s', 'First readable s'), tr('已观测峰值 RSS MiB', 'Observed peak RSS MiB'), tr('首屏后 5s RSS MiB', 'RSS after 5s MiB')], groups.map(({ corpus, renderer, rows }: Row) => {
    const successful = rows.filter((row: Row) => row.outcome === 'completed');
    const details = [...new Set(rows.filter((row: Row) => row.outcome !== 'completed').map((row: Row) => outcomes[row.outcome] ?? row.outcome))].join('; ');
    return [`${corpus.id} / ${label(renderer)}`, `${successful.length}/3${details ? '; ' + details : ''}`, span(successful, row => row.load.firstReadableMs / 1000), span(rows, row => row.peakRendererRSS / 1048576), span(successful, row => row.idle.rendererRSS / 1048576)];
  }));
  doc += tr('\n表格为三次运行的中位数 [最小–最大]。首屏、空闲内存和下面的滚动数值仅统计通过内容与环境检查的运行；失败原始样本完整保留。每次统一限制 180 秒与 6 GiB Renderer RSS，保护中止的已观测峰值只是停止点，不是成功渲染的完整峰值，不能据此宣称更省内存。未能显示开头的可响应页面会在 170 秒报告失败；完全阻塞时由外部超时保护结束。该保护是本测试预算，不是库的理论大小上限。\n\n', '\nValues are median [min–max] across three trials. Readability, idle memory and scrolling below include only runs passing content/environment checks; failed raw samples remain available. Every trial has the same 180-second and 6 GiB renderer-RSS guards. Observed peaks from interrupted runs are stopping points, not successful full-render peaks, and cannot establish lower memory cost. A responsive page without readable opening content fails at 170 seconds; an externally blocked page reaches the outer timeout. These guards are benchmark budgets, not theoretical library limits.\n\n');
  doc += table([tr('输入 / 渲染器', 'Input / renderer'), tr('常速 P95 ms', 'Steady P95 ms'), tr('快速 P95 ms', 'Fast P95 ms'), tr('首屏 DOM 元素', 'Initial DOM elements')], groups.map(({ corpus, renderer, rows }: Row) => {
    const successful = rows.filter((row: Row) => row.outcome === 'completed');
    return [`${corpus.id} / ${label(renderer)}`, median(successful, row => row.probes.steady.p95Ms), median(successful, row => row.probes.fast.p95Ms), median(successful, row => row.load.initial.elements)];
  }));
  doc += tr('\n阅读检查访问开头、中部、结尾与开头，要求正文覆盖视口、开头标记正确、末尾标记可见。LiMR 使用公开 source 导航跨越压缩滚动范围，其他集成使用原生滚动条比例；跳转耗时不做横向排名。常速/快速各采 60 帧。RSS 无强制 GC，包含 Worker 与原生分配；rAF 不代表物理显示延迟。完整原始数据包含 GPU/浏览器身份、每次结果、错误、帧与采样轨迹。\n\n', '\nReading checks visit the start, middle, end and start, requiring viewport content, the correct opening marker and visible tail sentinel. LiMR uses public source navigation across its compressed scroll range; peers use native scrollbar fractions, so seek timings are not ranked. Steady/fast scrolling each samples 60 frames. RSS includes workers/native allocations without forced GC; rAF is not physical display latency. Raw data includes GPU/browser identity, outcomes, errors, frames and sampling traces.\n\n');
  doc += tr(`横向矩阵环境：**${first.browserIdentity.requested.mode}**；GPU renderer 为 \`${gpu?.auxAttributes?.glRenderer ?? 'unobserved'}\`，compositing 为 \`${gpu?.featureStatus?.gpu_compositing ?? 'unobserved'}\`。\n\n`, `Comparison environment: **${first.browserIdentity.requested.mode}**; GPU renderer \`${gpu?.auxAttributes?.glRenderer ?? 'unobserved'}\`, compositing \`${gpu?.featureStatus?.gpu_compositing ?? 'unobserved'}\`.\n\n`);
  doc += '[large-comparison.json](https://github.com/Linloir/LiMR/blob/main/benchmarks/results/large-comparison.json)\n\n';
  return doc;
}
