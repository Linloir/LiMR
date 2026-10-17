import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { DocumentEngine, rangeOf, type Block } from '../core';
import { RuntimeContext } from './context';
import { BlockView } from './render';
import { ReaderRuntime, emptyDecorations } from './runtime';
import { orderedListStyle } from './ordered-list';

export interface PreparePrintOptions {
  signal?: AbortSignal;
  onProgress?: (progress: { loaded: number; total: number }) => void;
}
export interface PreparedDocumentPrint {
  revision: number;
  blocks: number;
  /** Print this complete prepared revision. Release it after the native dialog. */
  print(): void;
  dispose(): void;
}
/** Printing needs a complete DOM. Prepare it in bounded independent React roots
 * while retaining the interactive reader; no beforeprint handler mounts a book. */
export async function prepareDocumentPrint(runtime: ReaderRuntime, options: PreparePrintOptions = {}): Promise<PreparedDocumentPrint> {
  const source = runtime.document.getSnapshot(), config = runtime.configuration.get();
  if (config.provisional || source.streaming) throw new Error('Finish loading the complete document before preparing print output.');
  const document = DocumentEngine.fromSnapshot({ ...source, id: `${source.id}-print`, headings: source.headings.map(heading => ({ ...heading, id: `${heading.id}-print` })) }, { extensions: config.extensions });
  const printed = new ReaderRuntime(document.id, '', false, { ...config, virtualization: false, typography: 'standard', onSourceChange: undefined, onAnnotationsChange: undefined, onSelectionChange: undefined, onDocumentChange: undefined }, document, runtime.nodeStates);
  const element = window.document.createElement('article'); element.className = 'limr-prose limr-print-document';
  element.dataset.limrTheme = config.theme ?? 'light'; element.dataset.limrAppearance = config.appearance ?? 'classic';
  element.style.width = `${runtime.content?.clientWidth || 800}px`;
  window.document.body.append(element);
  const roots: Root[] = []; let disposed = false;
  const dispose = () => { if (disposed) return; disposed = true; roots.forEach(root => root.unmount()); printed.dispose(); element.remove(); window.document.body.classList.remove('limr-printing-document'); };
  const aborted = () => { if (options.signal?.aborted) throw new DOMException('Print preparation cancelled.', 'AbortError'); };
  const definitions = new Map(source.blocks.filter(block => block.node.type === 'footnoteDefinition').map(block => [String(block.node.identifier), block]));
  const entries: (Block & { footnoteId?: string; order?: number })[] = source.blocks.filter(block => !['definition', 'footnoteDefinition', 'annotationDefinition', 'streamPending'].includes(block.node.type));
  source.footnoteOrder.forEach((id, order) => { const node = source.footnotes.get(id); if (node) entries.push({ ...(definitions.get(id) ?? { id: `${source.id}-fn-${id}`, node, range: rangeOf(node), pending: false }), footnoteId: id, order }); });
  try {
    options.onProgress?.({ loaded: 0, total: entries.length });
    for (let at = 0; at < entries.length; at += 24) {
      aborted(); const batch = window.document.createElement('div'); batch.dataset.limrPrintBatch = String(at); element.append(batch);
      const root = createRoot(batch); roots.push(root);
      flushSync(() => root.render(<RuntimeContext.Provider value={printed}>{entries.slice(at, at + 24).map(block => {
        const view = <BlockView key={block.id} block={block} runtime={printed} components={config.components} extensions={config.extensions} rendererOverrides={config.rendererOverrides} footnoteId={block.footnoteId} decorations={printed.decorations.get().byBlock.get(block.id) ?? emptyDecorations} />;
        return block.footnoteId ? <ol key={block.id} className="limr-footnotes" start={block.order! + 1} style={orderedListStyle(1, source.footnoteOrder.length)}>{view}</ol> : view;
      })}</RuntimeContext.Provider>));
      options.onProgress?.({ loaded: Math.min(entries.length, at + 24), total: entries.length });
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
    aborted();
    if (element.querySelectorAll('[data-limr-block]').length !== entries.length) throw new Error('The prepared print document is missing rendered blocks.');
    return { revision: source.revision, blocks: entries.length, dispose, print() {
      if (disposed) throw new Error('The prepared print document has been disposed.');
      window.document.body.classList.add('limr-printing-document');
      window.addEventListener('afterprint', dispose, { once: true }); window.print();
    } };
  } catch (error) { dispose(); throw error; }
}
