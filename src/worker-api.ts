/** Worker implementation API without installing any global event listeners. */
export { createDocumentWorkerHandler } from './core/worker-handler';
export type { DocumentWorkerHandlerOptions } from './core/worker-handler';
export { standardWorkerRegistry } from './extensions/worker-syntax';
export type { DocumentWorkerRequest, DocumentWorkerResponse } from './core/worker-protocol';
export type { WorkerExtensionRegistry } from './core/worker-registry';
