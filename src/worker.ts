import { createDocumentWorkerHandler } from './core/worker-handler';
import type { DocumentWorkerRequest, DocumentWorkerResponse } from './core/worker-protocol';
import { standardWorkerRegistry } from './extensions/worker-syntax';

const scope = globalThis as unknown as {
  document?: unknown;
  postMessage?: (message: DocumentWorkerResponse) => void;
  addEventListener?: (type: 'message', listener: (event: MessageEvent<DocumentWorkerRequest>) => void) => void;
};
// Importable by Node/custom workers without installing browser-global handlers.
if (!scope.document && scope.postMessage && scope.addEventListener) {
  const handle = createDocumentWorkerHandler(standardWorkerRegistry, { provisionalPreviewExtensions: ['limr/standard'] });
  scope.addEventListener('message', event => { void handle(event.data, response => scope.postMessage!(response)); });
}
