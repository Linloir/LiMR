import type { DocumentInput, Utf8SourceIndex } from './source-input';
import type { Block, DocumentProgress, DocumentSnapshot } from './types';
import type { WorkerExtensionDescriptor } from './worker-registry';
export type DocumentWorkerRequest = { type: 'continue'; revision: number } | {
  type: 'load'; revision: number; id: string; input: DocumentInput; mode: 'blocking' | 'progressive'; extensions: readonly WorkerExtensionDescriptor[];
}
export type DocumentWorkerResponse =
  | { type: 'progress'; revision: number; progress: DocumentProgress }
  | { type: 'snapshot'; revision: number; snapshot: DocumentSnapshot; complete: boolean; sourceIndex?: Utf8SourceIndex; progressive: boolean }
  | { type: 'snapshot-start'; revision: number; metadata: Omit<DocumentSnapshot, 'source' | 'blocks'>; sourceLength: number; blockCount: number; sourceIndex?: Utf8SourceIndex; progressive: boolean }
  | { type: 'snapshot-source'; revision: number; value: string }
  | { type: 'snapshot-blocks'; revision: number; blocks: Block[] }
  | { type: 'snapshot-yield'; revision: number }
  | { type: 'snapshot-end'; revision: number }
  | { type: 'error'; revision: number; message: string };
/** Browser Worker or a host adapter (for example worker_threads). */
export interface DocumentWorkerPort {
  postMessage(message: DocumentWorkerRequest, transfer?: Transferable[]): void;
  addEventListener(type: 'message', listener: (event: MessageEvent<DocumentWorkerResponse>) => void): void;
  addEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  removeEventListener(type: 'message', listener: (event: MessageEvent<DocumentWorkerResponse>) => void): void;
  removeEventListener(type: 'error', listener: (event: ErrorEvent) => void): void;
  terminate(): void;
}
