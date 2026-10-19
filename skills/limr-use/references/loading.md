# Loading, host progress and large-document reading

Use the installed LiMR 1.3.5 declarations. `AsyncReader` loads a complete string, UTF-8 `Uint8Array`, or Blob/File; `Reader`/`Markdown` with accumulated `source` and `streaming` handle ongoing text generation. Progressive file loading is not append streaming.

## Pick presentation and ownership

- `loading.mode: 'blocking'` (default) waits for the complete snapshot before showing the document.
- `'progressive'` may show a proven independent prefix or explicitly permitted incomplete preview. `complete: false` and the public `provisional`/`readOnly` view state prevent editing and full-document printing. Later definitions can reinterpret a preview. The final complete engine replaces it while preserving reading position.
- `loadingFallback={null}` hides LiMR's built-in loading card. `onLoadStateChange(state, controls)` lets the host render a toolbar, native progress indicator or VS Code status item. Playground uses this API for one slim bar across both modes.
- `controls.cancel()`/`retry()` are stable session actions. A custom `loadingFallback(state, retry, controls)` remains compatible with older two-argument renderers.
- Show `state.overallProgress` as the single monotonic 0–1 value for one load. It resets on replacement/retry, remains below 1 until completion, and uses estimated work weights rather than elapsed-time prediction. Do not combine raw `progress.loaded/total` across phases: their units differ. Handle error and cancelled states explicitly.

A Vite-style consumer can bundle a local worker entry containing `import '@linloir/limr/worker';`, then create it using `new Worker(new URL('./limr.worker.ts', import.meta.url), { type: 'module' })`. Verify the host bundler emits a worker asset and serves it under its CSP/base URL. A package specifier is not automatically a browser URL; do not invent a filesystem URL inside a webview.

```tsx
import { AsyncReader } from '@linloir/limr';
import type { AsyncReaderLoadControls, DocumentSessionState } from '@linloir/limr';

function FileReader({ file, createWorker, report }: {
  file: File;
  createWorker: () => Worker;
  report: (state: DocumentSessionState, controls: AsyncReaderLoadControls) => void;
}) {
  return <AsyncReader input={file}
    loading={{ worker: createWorker, mode: 'progressive', fallback: 'error' }}
    loadingFallback={null} onLoadStateChange={report} />;
}
```

Keep the worker factory and parser extensions stable. Same-source `onSourceChange` echoes retain the loaded engine; a new input object starts a load. Keep any host progress state independent of source identity. Do not key/recreate the Reader for each progress event.

For non-React hosts, use `createDocumentSession({ extensions, worker, mode, fallback })`, subscribe to `getSnapshot()`, call `load(input, { signal })`, and unsubscribe/dispose on teardown. `load` resolves to the complete engine. `cancel` terminates a busy worker, a new load cancels the old one, and stale responses cannot replace a newer document. The session is DOM-free; native VS Code progress and webview messaging remain host code. Across a host bridge, send serializable state and route cancel/retry commands back to the owner; do not post functions or an entire engine through the bridge.

## Preserve plugin semantics

Fresh unmodified `standard()` syntax is registered with the default worker. View-only plugins stay on the host. Unknown or modified parser hooks fall back to exact main-thread parsing by default, with the reason in `state.capabilities`; `fallback: 'error'` makes this explicit. Main-thread fallback does not make a synchronous hook interruptible. Custom syntax needs matching versioned registrations and a custom worker; see the package's `docs/en/large-documents.md` and the plugin-development Skill. Never drop a plugin to force a worker capability.

## Windowed reading and resources

AsyncReader chooses DOM windows above one million UTF-16 units, 128 top-level blocks, or 2,048 visible syntax nodes. Reader keeps its normal default; pass `virtualization` explicitly when desired. `virtualization={false}` overrides the automatic choice. Observe `onVirtualizationChange` to learn when unsupported renderers or giant blocks cause a fallback. A window is only a DOM optimization: `useDocument()` still exposes the complete snapshot represented by that engine. During provisional reading that engine is explicitly incomplete.

Use public `scrollToSource`, `getReadingPosition`/`restoreReadingPosition`, and full-document indexes; do not query only mounted headings/blocks for navigation. Store a bookmark with document identity and map offsets after source edits. Long TOCs also window their DOM. Native selections, active editors and media retain necessary nodes; plugin-local state should use `useNodeState` across unmounts.

`preparePrint({ signal, onProgress })` prepares all blocks before printing a complete document. Dispose a discarded result. A full print DOM can be large; a provisional document cannot prepare it. Windowed search/copy use the visible reading projection, while source search and Copy Markdown remain source based. Opaque custom views need their text/keepAlive contracts; do not claim browser-find parity for unsupported content.

Internal built-in parsing uses grammar-confirmed root boundaries, shared source maps and a paged transferable snapshot representation to reduce temporary/transfer duplication. Source/AST/index storage still grows with the whole document. Single indivisible blocks and foreign hooks can retain full-parser cost. Do not promise a fixed memory ceiling or arbitrary parallel parsing. Compare decode/parse/index/handoff/visible content separately; JS heap is not renderer RSS. The package's `docs/en/loading-performance.md` records measured sizes, hashes, timings, environment and limits.

## Image preview

Use public `Image` for click-to-preview, or controlled `ImagePreview` for a host-owned trigger. Pass the original element when hero motion should start at its on-screen rectangle; supply intrinsic width/height and a resolvable URL. Fit/actual/fill modes, zoom, pixel copy and close use equal square buttons in a theme-aware bottom toolbar. Preserve reduced motion, Escape, focus return and light/dark appearance. Pixel copying needs a secure clipboard context and same-origin/CORS-readable pixels; URL resolution/permissions belong to the host. Avoid overriding button padding or SVG dimensions independently, which breaks equal spacing.
