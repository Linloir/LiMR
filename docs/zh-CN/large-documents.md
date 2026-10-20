# 大文档：加载与阅读

[文档目录](README.md) · [English](../en/large-documents.md)

## 选择加载方式

| 入口 | 输入与显示时机 | 进度与编辑 |
| --- | --- | --- |
| AsyncReader / blocking | 一次完整输入，完整解析和索引后显示正文；默认模式 | 同一个 overallProgress；就绪后按宿主配置编辑 |
| AsyncReader / progressive | 一次完整输入，可先显示明确标注为不完整的预览，再交接完整文档 | 同一个 overallProgress；预览只读，不可准备全文打印 |
| Reader / Markdown streaming | 应用持续传入不断增长的累计 source，最后 streaming=false | 生成进度由传输应用决定；生成中不可编辑 |

两种文件加载模式最终都得到完整 source、AST 和全局索引。progressive 改变首次可读时机，不是跳过剩余解析；blocking 也不表示必须阻塞主线程，Worker 可用于两者。默认卡片来自 LiMR，Playground 已通过公开回调改为由自身渲染统一进度条。实际加载与内存边界见[加载与内存性能](loading-performance.md)。

## React 接入

先从[快速开始的文件选择器与 Worker 入口](getting-started.md#加载大文档)开始。普通字符串阅读用 Reader；完整输入需要进度和异步解析时用 AsyncReader；不断生成的累计文本使用 streaming。下面展示如何替换内置加载卡片：

```tsx
import { AsyncReader } from '@linloir/limr';

const loading = {
  worker: () => new Worker(new URL('./limr-worker.ts', import.meta.url), { type: 'module' }),
  mode: 'progressive' as const,
};

export function Book({ file, id }: { file: File; id: string }) {
  return <AsyncReader key={id} documentId={id} input={file} loading={loading}
    loadingFallback={(state, retry, { cancel }) => <div role="status">
      <span>{state.phase}</span>
      {state.status === 'error' ? <p>{state.error?.message}</p>
        : <progress max={1} value={state.overallProgress} aria-label="Loading document" />}
      {state.status === 'error' || state.status === 'cancelled'
        ? <button onClick={retry}>Retry</button>
        : <button onClick={cancel}>Cancel</button>}
    </div>} />;
}
```

`limr-worker.ts` 只需导入 `@linloir/limr/worker`，构建方式见快速开始。组件获得的 File、扩展列表和 Worker 工厂应保持稳定。预览仍在继续加载，只有 `state.complete` 才表示完整文档；不要用“已有正文”代替完成状态。

## 宿主进度与取消

`AsyncReader` 接受 `input`、`loading` 中的会话选项、`loadingFallback(state, retry, controls)` 以及 `onLoadStateChange(state, controls)`。默认加载卡片由 LiMR 提供；传入 `loadingFallback={null}` 后，宿主可在任意位置展示进度。两个回调都提供当前会话内稳定的 `controls.cancel()` 和 `controls.retry()`，原有单参数观察回调、双参数 fallback 保持兼容。

```tsx
<AsyncReader
  input={file}
  loading={{ worker: createWorker, mode: 'progressive' }}
  loadingFallback={null}
  onLoadStateChange={(state, { cancel, retry }) => {
    // hostProgress 由应用实现：可连接工具栏、状态栏或原生宿主接口。
    hostProgress.update({
      status: state.status, phase: state.phase,
      fraction: state.overallProgress, error: state.error?.message,
      cancel, retry,
    });
  }}
/>
```

`state.overallProgress` 是当前加载请求内单调递增的 `[0, 1]` 总进度，与是否已经显示预览无关。读取、解析、索引和结果传递采用阶段权重估计，不代表剩余耗时；完整快照被接收前始终小于 `1`，替换输入或重试才归零。`state.progress.loaded/total` 仍提供当前阶段的原始计数：读取时为字节或源码单位，解析时为源码单位，索引时为块数，不能跨阶段直接比较。不提供中间进度的解析器会停留在上一进度，直到进入下一阶段。取消、失败通过独立状态表示，同一组 controls 可重试。Playground 使用该接口在两种加载方式中共用一条细进度条，样式也与流式演示一致。

## 阅读窗口与渲染契约

当源码超过一百万个 UTF-16 单元、顶层块超过 128 个，或可见语法节点超过 2,048 个时，`AsyncReader` 会自动尝试 DOM 窗口化。原有 `Reader` 默认行为不变，可通过 `virtualization` 显式启用；`false` 会关闭自动窗口化。DOM 窗口不裁剪 `useDocument()` 的快照：它仍包含当前 engine 的完整源码、全部块与索引；渐进预览的 engine 会明确标为 provisional，并不代表完整输入。

窗口保留附近块，并保留原生选择的两端、获得焦点的控件、活动注释编辑器、已打开图片预览的原图，以及已经访问的媒体 DOM。这样既保留播放与原生状态，也不会因为跨越很远的拖选而挂载中间所有段落。普通节点界面状态通过 `useNodeState` 保存，卸载后恢复仍有效。渐进加载完成时保留当前源码阅读锚点；临时前缀只读，完整文档到达后才开放源码和注释写入。

未知渲染器需要先声明呈现契约，才能安全卸载其 DOM：

```tsx
import type { NodeRendererProps, RendererOverride } from '@linloir/limr';

function MyParagraph({ children }: NodeRendererProps) {
  return <p>{children}</p>;
}
const override: RendererOverride = {
  type: 'paragraph', component: MyParagraph,
  virtualization: {
    copyText: (_node, { children }) => children,
    searchText: (_node, { children }) => children, // 可选：搜索文字与复制文字不同
    keepAlive: true, // 可选：编辑器、媒体等需要保留真实 DOM
  },
};
```

扩展也可在 `RendererExtension.virtualization` 中按组件名提供契约。覆盖渲染器必须实际匹配其 `when` 条件并使用自己的契约，不能借用另一个同名渲染器的契约。上下文中惰性读取的 `value` 已完成选区源码映射，能正确处理只选中部分代码的情况；`source` 是节点完整 Markdown，`children` 是选中且可见的子节点投影。除下述内置分段代码渲染器外，未知渲染器，以及超过 4,096 个节点或包含长度超过 262,144 个 UTF-16 单元的文本叶的单一语义块，目前会回退到原有完整渲染；`onVirtualizationChange({ enabled, reason })` 会说明这个边界。当前实现不承诺任意巨型段落、列表、表格、自定义插件或无限数量媒体的 DOM 都有固定上界；完整源码和 AST 的内存仍随文档规模增长。

### 阅读搜索与复制

如何启用可选界面、组合工具栏与完全替换控件，见[阅读搜索](search.md)。

普通复制基于可见文字，遵循当前翻译语言和折叠状态，不复制 Markdown 定界符或隐藏定义。图片、数学公式和 `selection: 'atomic'` 节点仍按既有契约复制完整原始源码；显式“复制 Markdown”仍是源码操作。跨窗口选择根据逻辑源码区间补足未挂载的中间内容。在另一个 Reader、页面外文字或外部控件上操作时，旧 Reader 不会继续接管复制。

显式启用的阅读搜索（`Reader search`、`DocumentSearch` 或 `useDocumentSearch`）搜索可见文字投影，包括未挂载文字、折叠代码、图片标签和数学载荷，排除隐藏翻译与源码定义。普通文本和正则都支持大小写开关。正则使用 JavaScript Unicode、多行语义，在独立 Worker 中执行，每批执行超时为 750 ms。非法表达式和超时显示在搜索框内；零宽匹配按完整码点前进并忽略。更换查询、关闭和卸载都会取消旧工作。默认使用 Blob Worker；CSP 要求静态 Worker 的宿主可提供 `worker: () => SearchWorkerPort`，并在构建时把导出的 `searchWorkerSource` 保存为该脚本。不会回退到主线程执行任意正则。

超过 4 Mi UTF-16 单元时，首次从阅读位置开始扫描约 256 Ki 单元，点击上一个／下一个时按需延伸扫描区间，确认相关未知区域后才循环。计数中的 `+` 表示尚未扫描全文或已达到 100,000 条结果上限；达到上限时请缩小查询范围。文字投影约每四毫秒让出主线程，向 Worker 传输按语义块聚合为约 128 Ki 单元一批。为保留正则前后查找与无界匹配，单个超大语义块保持完整处理，可能超过附近扫描预算或触发超时。目前不拼接跨块短语。标准投影能为跨行内格式、解码实体保留精确源码边界；自定义合成文字无法精确映射时退回块范围。当前与其他命中仅绘制已挂载、可见部分，输入期间持续可见。`searchDocument()` 仍为独立的全文源码字面搜索 API。自定义状态若不经过 `useNodeState` 或配置，应调用 `useLiMR().invalidatePresentation()`。

生产构建浏览器基准 `benchmarks/search/run.mjs` 使用精确 50/75 MiB UTF-8 文档，分别测量文档加载、附近正则、手动远距离扫描、缓存导航和字面搜索，并记录挂载块数、长任务和源码不变性。这是浏览器测量，不代表 VS Code 或 Cursor 验收。

### 超大代码块

代码折叠与换行使用当前 Reader 内的 LRU，最多记录最近使用的 256 个已修改块，并以弱节点标识关联。未修改的块不占条目，被淘汰后重新挂载恢复默认值；缓存不持有源码或 AST。切换视图不重新解析或重建全文索引。

从 1.3.9 起，内置代码超过 400 行源码或 50,000 个 UTF-16 单元时，会分为适量源码组并应用 `content-visibility: auto`。单行超过 8,192 单元时，在换行模式中再以约 4,096 单元划分续行组，边界避开完整字素；组边界可能使软换行略微提前，但不会插入换行符或连字符。完整文字仍保留在 DOM 中，支持原生选择、复制、查找和无障碍读取；仅在可见组挂载逐行装饰，选区涉及的组保留现有包装，直到选区释放。这是延迟排版和有界装饰 DOM，并非源码文字常量内存的虚拟列表。不支持 containment 的浏览器仍保留完整可读内容。

从 1.3.10 起，代码默认完整展开（`maxExpandedLines: false`）并跟随文档滚动，展开和收起过程中也不出现内部竖向滚动条；延迟排版与按需行号装饰继续生效。宿主可主动设置正数行上限来启用块内滚动；1.3.9 的默认值为 40 行。打印恢复完整排版与行号装饰。源码定位会展开折叠块并将目标代码对齐页面或嵌套滚动容器；若宿主明确启用了限高，则先滚动代码内部。仅实际内置代码渲染器可豁免旧的 262,144 单元文本叶限制，任意替换组件仍执行原来的能力检查。应同时验证巨型代码、长文卸载、折叠/换行恢复、源码定位及滚动锚点。

方案依据 [CSS containment](https://www.w3.org/TR/css-contain-2/#using-cv-auto) 保留文字供浏览器工具访问；类似 [CodeMirror](https://codemirror.net/docs/ref/#view.EditorView.viewport) 的 DOM 窗口还需配套自己的选区与查找机制，LiMR 在此保留原生文字契约。可复现数据见[代码块基准](../../benchmarks/code-blocks/README.md)。

## 阅读书签

较长的目录只挂载当前滚动窗口内的列表项，仍保留完整标题索引、自动跟随、换行标题和键盘访问（方向键、Home/End、Tab）。正文的批注和高亮按源码区间分配到块，避免每个块重复扫描全文批注。侧栏引用摘要只在对应卡片需要显示时计算并缓存。

普通 `#heading-slug` 链接和引用式链接会通过全局标题索引定位未挂载的目标。精确 ID 优先于当前文档的标题别名，支持重复标题后缀和编码后的 Unicode。宿主为相对资源设置的 `<base>` 不会把纯片段链接导向阅读文档之外；旧式脚注也沿用同一文档内导航路径。

宿主保存阅读书签可调用 `useLiMR().getReadingPosition()`，返回 `{ source, offset }`，内容未挂载时返回 `null`。`source` 是当前可见文本行或原子内容的 UTF-16 位置，`offset` 是其距离视口顶部的像素差。`restoreReadingPosition(position)` 先定位该源码，再恢复视觉偏移，适用于宽度变化及超大文档的压缩滚动范围；普通 Reader 也支持。宿主应同时保存文档身份，源码修改后必要时将旧偏移映射到新内容。

## 准备完整打印内容

`useLiMR().isDocumentComplete()` 区分完整文档与加载前缀或流式内容。`AsyncReader` 在完整加载前设置公开的 `provisional` 标记；暂态前缀不能准备打印，命令会拒绝，Ctrl+P 会提示等待加载完成。浏览器打印菜单也只显示该说明，不会把前缀当作完整内容打印；禁用 DOM 窗口时同样适用。完整的 `readOnly` 文档仍可打印。

浏览器的 `beforeprint` 事件不能等待异步任务。窗口模式下 Ctrl+P/⌘P 会先分批准备完整文档，展示可取消的进度，再打开打印对话框。宿主可以调用 `useLiMR().preparePrint({ signal, onProgress })`，得到 `{ revision, blocks, print, dispose }`；放弃已准备结果时应调用 `dispose()`。准备过程中保留交互阅读窗口，并验证所有预期块均已渲染；打印使用普通排版重新分页。完整打印必然需要完整 DOM，可能占用较多内存，因此只在显式打印操作时创建。未准备时直接调用浏览器打印菜单，会显示明确说明，避免悄悄打印不完整窗口。

执行 `node benchmarks/large-reading/run.mjs` 可冻结当前源码并测量生产 React、真实浏览器 Worker 和完整 Reader。`LIMR_LARGE_CASES=novels` 测量 50/75 MiB 小说，`LIMR_LARGE_CASES=papers` 测量两篇样例论文，并从 `../test-reading` 提供真实图片资源。报告分别记录加载帧间隔和长任务、ready 切换、普通/快速滚动、源码跳转与改宽，写入 `/tmp/limr-large-reading-*.json`。结果仅代表本机验证；rAF 帧间隔不等同物理输入到屏幕显示的延迟。

## 输入、编辑与插件更新

只有视图、批注类型、操作或源码编辑 UI 的插件保留在宿主，不需要 Worker 注册；真正的语法声明和解析 hooks 仍必须注册或明确回退。`onSourceChange` 受控回传值与当前引擎源码一致时，保留引擎，不重新加载、不重复触发 ready 通知。纯视图插件变化保留源码和 AST；解析器或 Worker 配置变化而 input 未改变时，重新加载最后接受的编辑内容，包括原始 input 为 Blob 的场景。新的 input 字符串值或 Blob 对象始终表示新文档，替换文件取消或失败以后修改配置不会恢复上一文件。

渐进加载前缀会启用公开的 `readOnly` 视图选项；普通 Reader 也可显式使用，默认行为不变。源码及批注增删改命令统一检查只读，翻译模式、折叠、图片预览和导航仍可使用。只显示声明 `SelectionAction.readOnly: true` 的选区操作，内建复制已声明；未知插件操作等完整加载以后恢复，避免显示无法提交的写入按钮。

完整浏览器测量使用 `pnpm bench --extended`，串行执行基础矩阵、24 次大输入加载、36 次三组件大文档横向比较和 36 次完整论文交互，生成双语性能报告。输入、时钟边界、Worker 与 GPU 环境、RSS/堆差异和复现命令见[性能报告](loading-performance.md)与[基准说明](../../benchmarks/README.md)。

## Session API 与自定义 Worker

`DocumentSession` 将加载与阅读分开。默认 `blocking` 模式等完整解析和全局索引完成后才发布文档；可选 `progressive` 模式可以提前发布经过独立语法证明的正文前缀，或由 Worker 明确授权的不完整预览。前缀的 `complete` 始终为 `false`，随后由完整文档替换；后续引用定义或闭合语法可能改变预览的含义。它是独立的暂态文档，不会把窗口或前缀冒充完整 `DocumentSnapshot`。

```ts
import { createDocumentSession, standard } from '@linloir/limr';

const extensions = standard();
const session = createDocumentSession({
  id: 'book', extensions,
  worker: () => new Worker(new URL('./limr-worker.js', import.meta.url), { type: 'module' }),
  mode: 'blocking',
  fallback: 'error',
});
const unsubscribe = session.subscribe(() => {
  const state = session.getSnapshot();
  // status、phase、progress、overallProgress、complete、document、error、capabilities
});
const file = new File(['# Chapter 1\n\nA short example.\n'], 'book.md', { type: 'text/markdown' });
const document = await session.load(file); // string、UTF-8 Uint8Array、Blob/File
// <Reader document={document} extensions={extensions} />
unsubscribe();
session.dispose();
```

上面的 `limr-worker.js` 是宿主资源地址。可复制已发布的 `@linloir/limr/worker` 独立资源，或将该包入口打包为 worker。发布的默认 worker 已完整打包，并采用依赖的 `worker` 导出条件。文件访问、CSP、资源 URL 与 worker 创建属于宿主；LiMR 不引入编辑器 API。`worker-api` 入口只提供工厂，不自动安装全局消息处理。

`load(input, { signal })` 返回完整的 `DocumentEngine`。新加载会取消上一次加载；`cancel()` 与 `dispose()` 会终止正在解析的 worker，旧 revision 的消息不能覆盖新结果。销毁后的 session 不再接受加载。`getSnapshot()` 在状态变化前保持同一对象，可直接用于 `useSyncExternalStore`。`DocumentEngine.fromSnapshot(snapshot, { extensions })` 共享已有 source/AST，不重复解析，首次编辑时才重建内部增量缓存。

### 扩展注册与回退

`standard()` 为新建的默认语法实例注册默认 worker 能力。React 组件与浏览器回调留在主线程。修改已注册实例的语法函数或嵌套 tokenizer 配置会使注册失效。未知扩展不会被静默丢弃：默认 `fallback: 'main-thread'` 先让出一次主线程供 loading UI 绘制，再在主线程运行完整的原扩展，并通过 `capabilities.reason` 说明；`fallback: 'error'` 则拒绝加载。兼容回退不能让任意同步插件钩子变得可中断。

自定义语法可以显式注册到自定义 Worker。下面的宿主模块注册局部 `<my-note>` 语法：

```ts
import { registerWorkerExtension, type SyntaxExtension } from '@linloir/limr/core';

const myExtension: SyntaxExtension = {
  name: 'my-syntax', tags: ['my-note'], scope: 'local',
};
registerWorkerExtension(myExtension, {
  id: 'my-syntax/v1', options: { dialect: 'example' },
});
// 将 myExtension 加入宿主 session 的 extensions。
```

独立的自定义 Worker 入口实现相同语法，并校验 descriptor 配置。构建时启用依赖的 `worker` 导出条件：

```ts
import {
  createDocumentWorkerHandler, standardWorkerRegistry,
  type DocumentWorkerRequest, type DocumentWorkerResponse,
  type WorkerExtensionRegistry,
} from '@linloir/limr/worker-api';

const registry: WorkerExtensionRegistry = {
  ...standardWorkerRegistry,
  'my-syntax/v1': options => {
    if (!options || typeof options !== 'object' ||
        !('dialect' in options) || options.dialect !== 'example') {
      throw new Error('Unsupported my-syntax dialect');
    }
    return { name: 'my-syntax', tags: ['my-note'], scope: 'local' };
  },
};
const handle = createDocumentWorkerHandler(registry);
self.addEventListener('message', (event: MessageEvent<DocumentWorkerRequest>) => {
  void handle(event.data, (message: DocumentWorkerResponse, transfer?: Transferable[]) => self.postMessage(message, { transfer: transfer ?? [] }));
});
```

descriptor 只能包含可结构化克隆的配置，不序列化 JavaScript 函数；两端必须实现同一版本的语法契约。仅更改视图时可保留已注册的语法实例；插件名称本身不是兼容证明。

Worker 作者还可单独声明经过证明的局部语法支持独立正文前缀及分包结果传输：

只有证明满足下面的契约后，才将上面的 handler 构造替换为 `createDocumentWorkerHandler(registry, { independentProseExtensions: ['my-syntax/v1'] })`。

可选的 `DocumentWorkerHandlerOptions` 契约按完整 registry ID 精确匹配，内置 `limr/standard` 继续受支持；只有整篇源码通过 `isIndependentProse` 扫描才生效。声明中的每个工厂及其所有受支持的 descriptor 配置，都必须保证完整段落前缀与全文解析一致、原文 UTF-16 偏移稳定，且不能在不同块或块与文档元信息之间引入需要保留同一对象身份的引用。声明前应验证前缀/全文语义和分别克隆各块后的等价性，语义改变时升级 ID。即使列出 ID，`scope: 'document'` 仍禁用这条路径；完整快照还必须不含定义、脚注、批注、批注范围或 occurrence 才能分包。未知或未声明的 ID 保留完整解析及单次快照克隆，不根据扩展名称猜测，也不允许 load 请求自行打开能力。`blocking` 模式仍不发布暂态前缀，收到并组装全部分包后才进入 ready。

### 解析与内存边界

解析分批与提前发布前缀、结果分包是不同能力。使用已验证且未修改的内置语法时，大文档采用两遍解析：第一遍通过 Markdown 解析器确认根级空行处的容器和块已结束，记录分块位置并收集全文引用、脚注定义；第二遍使用这些全局定义逐块解析，生成 AST 后释放该块的临时 token 工作区。列表、围栏、HTML、公式和指令内部的空行不会被误当成分块边界。源码位置保留，文档转换在合并整树后执行一次。注释预解析和正文解析共用同一解析上下文；准备后的输入精确匹配时，复用源码映射与原始树，转换和索引仍只执行一次。自定义或被修改的语法、编译钩子保留完整解析路径。

内部源码映射将删除标记的边界保存为紧凑数值数组，并在同一次解析中共享行索引；注释预解析与正文解析的删除区间完全一致时，直接复用处理后的文本和映射。公开源码、节点、位置和快照仍维持原有格式；这些优化不会通过删除位置或批注来减少内存。临时 tokenizer/event 工作区取决于分块大小和最大的不可拆分语义块，单个巨型列表、围栏或容器仍可能需要较大内存。分块解析遇到语法异常时会回退到完整解析，以保留原有错误顺序和恢复行为；此时不保证临时工作区受分块大小约束。

上述解析优化不额外授权前缀发布或传输分包。经过证明且没有跨块语义对象的正文采用分批 source/block 消息，降低一次性克隆大结果的停顿。

发布的标准 Worker 对较大的复杂文档启用紧凑快照传输：将对象属性形状、重复字符串和图内引用编码到分块 TypedArray，通过 transferable 缓冲区转移。内置 Worker 按深度优先顺序分批编码独占的临时快照，并释放已编码对象的引用，避免大量节点同时排队；对象编码结束、查找索引释放后，再分批生成字符串缓冲区，减少各阶段内存同时驻留。宿主收到数据后先终止解析 Worker，再以可取消的协作任务还原完整快照，避免同时持有两份完整对象树。UTF-16 源码、对象别名、Map 和节点位置均保留。该能力由请求与 Worker 双方协商；旧 Worker 和未知 registry ID 仍使用原有协议。通用 handler 遇到不支持的对象载荷时回退；内置 handler 独占并消耗其标准快照，遇到意外的不支持对象会报错，避免发布已被部分消耗的图。自定义 Worker 只有使用原版 `standardWorkerRegistry` 时才应显式设置 `packedSnapshots: true`，并向 `postMessage` 转发回调的第二个 transfer 参数。公开快照仍是完整 source 和 AST，压缩传输不会使最终内存与文档大小无关，也不是任意大文件的固定内存保证。

不完整预览使用另一项独立权限 `DocumentWorkerHandlerOptions.provisionalPreviewExtensions`。发布的标准 Worker 明确允许 `limr/standard`，自定义 handler 默认不授予这项权限。审查示例 registry 的工厂后，可传入 `{ provisionalPreviewExtensions: ['limr/standard', 'my-syntax/v1'] }`；请求中的每个 descriptor ID 都必须列出，包括标准 ID。该权限不保证前缀语义稳定、不授权结果分包，也不能由加载请求自行开启。

每个被授权的工厂都必须允许新的实例解析流式前缀，不对其他实例、全局状态或原始 descriptor 配置产生可观察的影响。共享底层资源必须保持只读，hooks 和范围不能越出所提供的源码。handler 在调用任何工厂前，一次性克隆整个预览 descriptor 图并保留内部别名关系。若没有发布稳定正文前缀，且源码超过 128 Ki 个 UTF-16 单元，则尝试最多 32 Ki 单元的预览，避免切断代理对或 CRLF。预览使用新的工厂实例和 `streaming: true`；可选预览失败时继续完整解析，完整解析失败仍报告错误。默认 blocking 模式不会进入这条预览路径。

公共范围仍使用原文 UTF-16 偏移。UTF-8 输入保留 BOM、CRLF、非 BMP 字符和替换解码行为，`state.sourceIndex` 提供稀疏的字节/原文索引。`utf8ByteToSourceOffset(bytes, index, byteOffset)` 与 `sourceOffsetToUtf8Byte(bytes, index, sourceOffset)` 使用原字节映射；处于多字节字符或代理对内部时映射到对应起始边界。字符串输入不重新编码解码，调用者传入的字节数组也不会被 detach。公开解码器默认仍在各块之间让出主线程，保持取消响应；专用 Worker handler 使用 `decodeDocumentInput(input, signal, progress, { cooperative: false })`，避免每块定时器等待，取消会话时直接终止 Worker。分包背压仍让出接收端主线程。

复测加载性能：运行 `pnpm build`，再运行 `node --expose-gc benchmarks/core/large-document.mjs 50 blocking` 或 `node --expose-gc benchmarks/core/large-document.mjs 75 progressive`。基准在真实 worker thread 中解析 50/75 MiB UTF-8 小说正文，记录加载/前缀时间、完整块数、进程内存和主线程计时间隔。实际浏览器中的阅读和滚动性能须单独测试。
