# Large documents: loading and reading

[Documentation](README.md) · [简体中文](../zh-CN/large-documents.md)

## Choose a loading mode

| Entry | Input and presentation | Progress and editing |
| --- | --- | --- |
| AsyncReader / blocking | One complete input; displays after full parsing and indexing; default mode | One overallProgress; edits follow host configuration after ready |
| AsyncReader / progressive | One complete input; can show an explicitly incomplete preview before the full handoff | The same overallProgress; preview is read-only and cannot prepare full printing |
| Reader / Markdown streaming | App supplies a growing accumulated source, then streaming=false | Generation progress belongs to transport; no edits while generating |

Both file-loading modes ultimately retain full source, AST and global indexes. Progressive changes first readability rather than skipping the rest of parsing; blocking does not require blocking the main thread, since both modes can use a worker. LiMR owns the default loading card; Playground uses the public callback to render its own single bar. See [loading and memory performance](loading-performance.md) for measured loading and resource boundaries.

## React integration

Start with the [quick-start file picker and Worker entry](getting-started.md#load-large-documents). Reader handles ordinary strings; AsyncReader adds progress and asynchronous loading for complete inputs; streaming handles accumulated generated text. This example replaces the built-in loading card:

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

`limr-worker.ts` imports `@linloir/limr/worker`; see the quick start for bundling. Keep File objects, extension lists and Worker factories stable. A visible preview is still loading; only `state.complete` denotes the complete document.

## Host progress and cancellation

`AsyncReader` accepts `input`, the session options under `loading`, a `loadingFallback(state, retry, controls)` renderer, and `onLoadStateChange(state, controls)`. The built-in loading card belongs to LiMR; pass `loadingFallback={null}` to hide it and render progress anywhere in your application. Both callbacks receive stable `controls.cancel()` and `controls.retry()` actions for the current session. Existing one-argument observers and two-argument fallback renderers remain supported.

```tsx
<AsyncReader
  input={file}
  loading={{ worker: createWorker, mode: 'progressive' }}
  loadingFallback={null}
  onLoadStateChange={(state, { cancel, retry }) => {
    // Your app owns hostProgress: a toolbar, status bar or native host adapter.
    hostProgress.update({
      status: state.status, phase: state.phase,
      fraction: state.overallProgress, error: state.error?.message,
      cancel, retry,
    });
  }}
/>
```

`state.overallProgress` is one monotonic fraction in `[0, 1]` for the current load, independent of whether a preview is visible. Reading, parsing, indexing and result transfer use estimated stage weights; this is not an elapsed-time estimate. It stays below `1` until the complete snapshot is accepted, and resets on replacement or retry. `state.progress.loaded/total` remain the raw current-phase counts (bytes or source units for reading, source units for parsing, blocks for indexing); do not compare these counts across phases. A parser without intermediate progress can keep the bar at its last value until the next stage. Cancellation and errors are explicit statuses, with retry available through the same controls. The Playground uses this API for one slim bar shared by both loading modes, and the same bar styling for its streaming demo.

## Reading windows and presentation contracts

`AsyncReader` enables DOM windows when the source exceeds one million UTF-16 units, the snapshot has more than 128 top-level blocks, or visible syntax exceeds 2,048 nodes. `Reader` keeps its existing default; set `virtualization` explicitly to opt in. `false` overrides automatic windowing. DOM windows do not truncate `useDocument()`: subscribers receive the complete source, blocks and indexes represented by the current engine. A progressive preview engine is explicitly provisional and does not represent the complete input.

A window retains nearby blocks plus native selection endpoints, focused controls, active annotation editors, open image previews, and visited media DOM. This preserves playback and native state without mounting every paragraph between distant selection endpoints. Ordinary node UI state uses `useNodeState`; it survives an offscreen unmount. Completed progressive loading preserves the current source anchor. A provisional prefix sets the public `readOnly` view option: source edits and annotation writes become available only after the complete document arrives. The same option is available on ordinary readers without changing their default. Public source/annotation mutation commands enforce it, while translation, expansion, image preview and navigation remain available. Only selection actions declaring `readOnly: true` are shown; built-in clipboard actions do so. Unknown plugin actions stay hidden until completion. This avoids offering write controls that cannot commit to a provisional document.

Unknown renderers must declare a presentation contract before their DOM can be windowed:

```tsx
import type { NodeRendererProps, RendererOverride } from '@linloir/limr';

function MyParagraph({ children }: NodeRendererProps) {
  return <p>{children}</p>;
}
const override: RendererOverride = {
  type: 'paragraph', component: MyParagraph,
  virtualization: {
    copyText: (_node, { children }) => children,
    // Optional when reading search differs from clipboard text:
    searchText: (_node, { children }) => children,
    // Optional for opaque editors/media that must retain their actual DOM:
    keepAlive: true,
  },
};
```

The same contracts can be registered by component name in `RendererExtension.virtualization`. A renderer override's contract belongs to that exact override and its matching `when` condition; another renderer's contract is not borrowed by name. The context's lazy `value` field contains the selected text value with source mapping already applied, including partial code selections; `source` contains the entire node's Markdown and `children` contains the selected visible child projection. An unrecognized renderer or a single oversized semantic block (more than 4,096 nodes or a text leaf longer than 262,144 UTF-16 units) currently falls back to the ordinary complete renderer. `onVirtualizationChange({ enabled, reason })` reports this boundary. This release does not promise bounded DOM for arbitrary giant paragraphs, lists, tables, custom plugins, or unlimited media. Source/AST memory remains proportional to the complete document.

Plain clipboard copy projects visible text, respecting the selected translation language and collapsed content. Markdown delimiters and hidden definitions are omitted. Image/math/`selection: 'atomic'` nodes retain their complete original source copy contract; an explicit **Copy Markdown** action remains source based. Cross-window selections use their logical source interval to include unmounted middle paragraphs. Selecting another reader, page text or an external control releases the old reader's ownership.

Windowed Ctrl+F searches the complete visible reading projection: image alt text, video titles and math payloads, not hidden translation panels or source definitions. It yields after about 65,536 UTF-16 units or four milliseconds and supports cancellation. A contiguous source spelling gives an exact UTF-16 range; a phrase crossing inline Markdown styling navigates to its containing block. Mixed formatting or entities that prevent unambiguous occurrence mapping also use block navigation. Cross-block phrases are not currently joined. Math search uses the LaTeX payload, not KaTeX's visual/accessibility tree; opaque diagrams require a `searchText`/`copyText` adapter. This is not a claim of complete equivalence with browser find. `searchDocument()` remains the separate complete-source search API. Custom presentation whose state changes outside `useNodeState` or reader configuration should call `useLiMR().invalidatePresentation()` so open search results and the TOC refresh without coupling them to scroll geometry.

Code fold/wrap choices use a separate bounded view cache: only the 256 most recently used modified blocks, without retaining source or AST references. Evicted blocks return to defaults on remount. These changes trigger neither parsing nor whole-document indexing. Folding limits visible height; it does not virtualize code internals, and enabled line numbers still create source-line containers.

## Reading bookmarks

Long tables of contents mount only the current scroll window while retaining the complete heading index, active-heading following, wrapped titles and keyboard access (arrow keys, Home/End and Tab). Annotation and highlight intervals are indexed against blocks, avoiding a complete annotation scan for every block. Sidebar reference excerpts are computed and cached only for cards being rendered.

Ordinary `#heading-slug` links and reference-style links navigate through the global heading index when their destination is outside the mounted window. Exact IDs take precedence over document-local slug aliases; duplicate heading suffixes and encoded Unicode remain supported. A host `<base>` for relative resources does not redirect fragment-only links away from the reader. Legacy footnotes use the same document-local navigation path.

For host reading bookmarks, `useLiMR().getReadingPosition()` returns `{ source, offset }` or `null` before content is mounted. `source` is the UTF-16 position of the visible text line (or atomic content); `offset` is its pixel distance from the viewport top. `restoreReadingPosition(position)` reveals that source and restores its visual offset, including after a width change or a seek within a compressed book scroll range. Store bookmarks with the document identity; source edits may require the host to map old source offsets through edits. The same API works in ordinary readers.

## Preparing complete print output

`useLiMR().isDocumentComplete()` distinguishes a complete document from a loading prefix or stream. `AsyncReader` sets the public `provisional` flag until full loading completes. Prefixes cannot prepare print output: the command rejects and Ctrl+P explains that loading must finish. The browser print menu shows that explanation instead of prefix content, including when DOM windowing is disabled. A complete `readOnly` document can still be printed.

A browser's `beforeprint` event cannot await asynchronous work. Windowed Ctrl+P/⌘P therefore prepares the complete document in small batches with visible progress and cancellation before opening the print dialog. `useLiMR().preparePrint({ signal, onProgress })` provides the same operation to hosts and returns `{ revision, blocks, print, dispose }`. Call `dispose()` when a prepared result is discarded. Preparation retains the interactive window, verifies every expected block, and uses standard typography for print reflow. A full print document necessarily requires a full DOM and can consume substantial memory; it is created only for this explicit operation. Invoking the browser's print menu before preparation displays an explanatory print notice instead of silently printing a partial window.

Run `node benchmarks/large-reading/run.mjs` for a frozen production React build with a real browser worker and the complete reader. `LIMR_LARGE_CASES=novels` measures 50/75 MiB novels; `LIMR_LARGE_CASES=papers` measures both sample papers and serves their actual assets from `../test-reading`. Loading frame intervals and long tasks, the ready transition, steady/fast scrolling, source seeks and resize are reported separately under `/tmp/limr-large-reading-*.json`. These are local machine measurements; rAF intervals are not physical input-to-photon latency.

Use `pnpm bench --extended` for the complete browser matrix: baseline suites, 24 large-input loads, 36 large-document cross-renderer trials and 36 full-paper interaction runs, executed serially to generate bilingual reports. See [the report](loading-performance.md) and [benchmark guide](../../benchmarks/README.md) for inputs, timing boundaries, worker/GPU environment, RSS versus heap and reproduction commands.

## Inputs, edits and plugin updates

A controlled `onSourceChange` echo equal to the current engine source retains the loaded engine and does not restart loading or repeat the ready notification. Pure presentation plugin changes preserve its source and AST. Changing parser/worker configuration reloads the latest accepted source when the input is unchanged, including an edited Blob; a new input value or Blob object starts a new document. Cancelled or failed replacement inputs cannot restore a previous file by changing configuration.

## Session API and custom workers

`DocumentSession` separates loading from reading. Its default `blocking` mode publishes a document only after parsing and global indexes are complete. `progressive` mode may publish a proven independent prose prefix or an explicitly permitted incomplete preview sooner; the session reports `complete: false` until the final document replaces it. A preview can change meaning when later references or closing syntax arrive. It is a separate provisional document, never a window presented as the full `DocumentSnapshot`.

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
  // status, phase, progress, overallProgress, complete, document, error, capabilities
});
const file = new File(['# Chapter 1\n\nA short example.\n'], 'book.md', { type: 'text/markdown' });
const document = await session.load(file); // string, UTF-8 Uint8Array or Blob/File
// <Reader document={document} extensions={extensions} />
unsubscribe();
session.dispose();
```

`limr-worker.js` above is a host-owned asset URL. Copy the published `@linloir/limr/worker` asset, or bundle that package entry as a worker entry point. The published worker is self contained and uses dependency `worker` export conditions. File access, CSP, URLs and worker creation remain the host's responsibility; LiMR does not import editor APIs. The package's `worker-api` entry provides factories without installing global handlers.

`load(input, { signal })` returns the materialized `DocumentEngine`. A new load cancels the previous one. `cancel()` and `dispose()` terminate a busy worker; stale responses cannot publish over a newer revision. Calling `load()` after `dispose()` rejects. `getSnapshot()` is stable until a state change and works with `useSyncExternalStore`. `DocumentEngine.fromSnapshot(snapshot, { extensions })` adopts the original source/AST without reparsing and rebuilds its private incremental caches on the first edit.

### Extension registration and fallback

`standard()` registers its freshly constructed default syntax with the default worker registry. Rendering components and browser-only callbacks stay on the main thread. Changing a registered syntax function or nested tokenizer configuration invalidates the registration. Modules containing only presentation, annotation types, actions or source-editing UI remain on the host and do not require worker registration. An unregistered extension with actual parser hooks or syntax declarations is never silently dropped: `fallback: 'main-thread'` (the default) runs the exact extension on the main thread after yielding for loading UI, and explains this in `state.capabilities.reason`; `fallback: 'error'` rejects. Main-thread fallback cannot make arbitrary synchronous plugin hooks interruptible.

A custom extension can opt into a custom worker explicitly. This host module registers a local `<my-note>` syntax:

```ts
import { registerWorkerExtension, type SyntaxExtension } from '@linloir/limr/core';

const myExtension: SyntaxExtension = {
  name: 'my-syntax', tags: ['my-note'], scope: 'local',
};
registerWorkerExtension(myExtension, {
  id: 'my-syntax/v1', options: { dialect: 'example' },
});
// Include myExtension in the host session's extensions.
```

The separate custom worker entry implements the same syntax and validates the descriptor options. Build it with the `worker` export condition:

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

The descriptor contains structured-cloneable configuration; it does not serialize JavaScript functions. Both sides must implement the same versioned syntax contract. View-only overrides can keep an existing registered syntax object; unknown plugin names are not treated as proof of compatibility.

A worker author can separately opt proven local syntax into independent-prose prefix publication and bounded result transport:

In the worker entry above, replace the handler construction with `createDocumentWorkerHandler(registry, { independentProseExtensions: ['my-syntax/v1'] })` only after proving the contract below.

This optional `DocumentWorkerHandlerOptions` contract matches exact registry IDs, in addition to the built-in `limr/standard`. It applies only after `isIndependentProse` has checked the entire source. Every declared factory, for every supported descriptor option, must preserve completed paragraph prefixes and absolute UTF-16 ranges and must not introduce shared object identity across blocks or between blocks and metadata. Test prefix/full-parse parity and separately cloned block packets before declaring the contract; change the versioned ID when its semantics change. An extension with `scope: 'document'` remains excluded even when listed. The final snapshot must also have no definitions, footnotes, annotations, annotation ranges or occurrences before packets are used. Unknown or unlisted IDs retain the complete parse and single-snapshot clone; neither an extension name nor a load request can enable this capability. Blocking mode still publishes no provisional document: eligible packets are assembled before readiness.

### Parsing and memory boundaries

Parser batching is separate from early prefix publication and result packets. With verified, unmodified built-in syntax, large documents use two passes. The first uses the Markdown parser to confirm that containers and blocks have closed at a root-level blank line, recording window boundaries and collecting global reference and footnote definitions. The second parses each window with those definitions, builds its AST, and releases its temporary token workspace. Blank lines inside lists, fences, HTML, math or directives do not become split points. Source positions are preserved, and document transforms run once over the merged tree. Annotation discovery and body parsing share the same parse context. When the prepared input matches exactly, they reuse source mappings and the raw tree; normalization and indexing still run once. Foreign or modified syntax and compiler hooks retain the complete parsing path.

Internal source mappings store removed-marker boundaries in compact numeric arrays and share the line index within a parse. When annotation discovery and body parsing remove exactly the same ranges, they reuse the resulting text and mapping. Public source, nodes, positions and snapshots retain their existing shapes; memory savings do not discard positions or annotations. Temporary tokenizer/event workspace depends on the window size and the largest indivisible semantic block. A single enormous list, fence or container can still require substantial memory. A syntax error in bounded parsing retries the complete parser to preserve existing error ordering and recovery behavior; that fallback does not bound temporary workspace by the window size.

This parsing optimization grants no additional prefix or transport capability. Proven independent prose results without cross-block semantic objects use bounded source/block transport packets to avoid one large result-cloning task.

The shipped standard Worker uses compact snapshot transport for larger complex documents. It encodes object property shapes, repeated strings and graph references in paged TypedArrays and transfers their backing buffers. The shipped Worker encodes its exclusively owned temporary snapshot cooperatively in depth-first order and releases encoded references, limiting the queued object frontier. It emits string buffers in bounded tasks after object encoding has released its lookup indexes, reducing overlap between allocation phases. The host terminates the parser Worker before rebuilding the complete snapshot in cancellable cooperative tasks, avoiding two complete object graphs alive at once. UTF-16 source, object aliases, Maps and node positions are preserved. Both the request and Worker negotiate this capability. Older Workers and unknown registry IDs retain the original protocol. The generic handler falls back for unsupported object payloads; the shipped handler owns and consumes its built-in snapshot, so an unexpected unsupported payload fails instead of publishing a partially consumed graph. A custom Worker should explicitly enable `packedSnapshots: true` only with the unmodified `standardWorkerRegistry`, forwarding the send callback's second transfer argument to `postMessage`. Public snapshots still contain the complete source and AST. Compact transport does not make final memory independent of document size or guarantee fixed memory for arbitrary files.

Incomplete previews have a separate `DocumentWorkerHandlerOptions.provisionalPreviewExtensions` permission. The published standard worker explicitly permits `limr/standard`; custom handlers default to no such permission. To permit the example registry after auditing its factories, pass `{ provisionalPreviewExtensions: ['limr/standard', 'my-syntax/v1'] }`. Every descriptor ID in the request must be listed, including the standard ID. This does not assert prefix stability or authorize result packets, and requests cannot grant themselves this permission.

Each permitted factory must support a fresh streaming parse without observable effects on other instances, global state or the original descriptor options. Shared backing resources must remain read-only, and hooks and ranges must stay within the supplied source. Before invoking any factory, the handler clones the entire preview descriptor graph together, preserving internal aliases. If no stable prose prefix was published and the source exceeds 128 Ki UTF-16 units, it attempts a preview of at most 32 Ki units without splitting a surrogate pair or CRLF. The preview uses fresh factory instances and `streaming: true`. An optional preview failure falls back to the complete parse; a complete-parse failure remains an error. Blocking mode never takes this preview path.

All public source ranges remain UTF-16 offsets. UTF-8 inputs preserve BOM, CRLF, astral characters and replacement decoding; `state.sourceIndex` contains sparse byte/source checkpoints. `utf8ByteToSourceOffset(bytes, index, byteOffset)` and `sourceOffsetToUtf8Byte(bytes, index, sourceOffset)` map against the original bytes, including offsets inside multibyte or surrogate sequences. Passing a string does not encode and decode it again. Typed-array input remains owned and usable by the caller. The public decoder yields between chunks by default so main-thread cancellation stays responsive. Dedicated worker handlers use `decodeDocumentInput(input, signal, progress, { cooperative: false })` to avoid per-chunk timer delays; cancelling their session terminates the worker. Packet backpressure still yields to the receiving main thread.

Reproduce the large-input loading benchmark with `pnpm build` followed by `node --expose-gc benchmarks/core/large-document.mjs 50 blocking` or `node --expose-gc benchmarks/core/large-document.mjs 75 progressive`. It runs a real worker thread with 50/75 MiB UTF-8 novel text and reports loading/prefix times, complete block counts, process memory and main-thread timer gaps. Reading/scrolling performance must be measured separately in the actual browser host.
