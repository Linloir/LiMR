import type { SourceRange } from './types';
import { throwIfAborted } from './source-input';

export interface SearchWorkerPort {
  postMessage(message: unknown): void;
  addEventListener(type: 'message' | 'error', listener: (event: any) => void): void;
  removeEventListener(type: 'message' | 'error', listener: (event: any) => void): void;
  terminate(): void;
}
export interface SearchPatternOptions {
  regex?: boolean;
  caseSensitive?: boolean;
  signal?: AbortSignal;
  /** Optional factory for hosts whose CSP disallows blob workers. */
  worker?: () => SearchWorkerPort;
  /** Maximum execution time per worker batch, excluding worker startup. Default 750 ms. */
  timeoutMs?: number;
}
export interface SearchBatch { matches: SourceRange[][]; limited: boolean }

// Self-contained worker source: no imports, eval, document, or host resources.
// A single RegExp.exec can backtrack forever; cooperative cancellation alone
// cannot protect the UI. The owner terminates this worker on abort or deadline.
export const searchWorkerSource = String.raw`
self.onmessage = ({ data }) => {
  try {
    const pattern = data.regex ? data.query : data.query.replace(/[.*+?^{}()|[\]\\$]/g, '\\$&');
    const expression = new RegExp(pattern, data.regex ? (data.caseSensitive ? 'gmu' : 'gmiu') : (data.caseSensitive ? 'gu' : 'giu'));
    let remaining = data.limit, limited = false;
    const matches = data.texts.map(text => {
      const ranges = []; expression.lastIndex = 0;
      if (remaining <= 0) { limited = true; return ranges; }
      for (let match = expression.exec(text); match; match = expression.exec(text)) {
        if (!match[0].length) {
          expression.lastIndex = match.index + (text.codePointAt(match.index) > 65535 ? 2 : 1);
          continue;
        }
        ranges.push({ start: match.index, end: match.index + match[0].length });
        if (--remaining <= 0) { limited = true; break; }
      }
      return ranges;
    });
    self.postMessage({ matches, limited });
  } catch (error) { self.postMessage({ error: { name: error.name, message: error.message } }); }
};
self.postMessage({ ready: true });
`;

function defaultWorker(): SearchWorkerPort {
  const url = URL.createObjectURL(new Blob([searchWorkerSource], { type: 'text/javascript' }));
  try { return new Worker(url); } finally { URL.revokeObjectURL(url); }
}

/** One interruptible matcher per query. Only a bounded projection batch crosses
 * the worker boundary; no duplicate full-document string or lowercase index. */
export class SearchMatcher {
  private port?: SearchWorkerPort;
  private ready?: Promise<void>;
  private pending?: (error: Error) => void;
  private disposed = false;
  constructor(private query: string, private options: SearchPatternOptions = {}) {
    // Validate before starting a worker, without executing the expression.
    if (options.regex) new RegExp(query, options.caseSensitive ? 'mu' : 'miu');
    throwIfAborted(options.signal);
    options.signal?.addEventListener('abort', this.abort, { once: true });
  }
  private abort = () => this.dispose();
  dispose() {
    this.disposed = true;
    this.options.signal?.removeEventListener('abort', this.abort);
    this.pending?.(Object.assign(new Error('Search cancelled.'), { name: 'AbortError' }));
    this.port?.terminate(); this.port = undefined;
  }
  private start() {
    if (this.ready) return this.ready;
    this.port = (this.options.worker ?? defaultWorker)();
    this.ready = new Promise<void>((resolve, reject) => {
      const port = this.port!;
      const cleanup = () => { clearTimeout(timer); port.removeEventListener('message', message); port.removeEventListener('error', failed); this.pending = undefined; };
      const fail = (error: Error) => { cleanup(); reject(error); };
      const message = (event: MessageEvent) => { if (event.data.ready) { cleanup(); resolve(); } };
      const failed = () => fail(new Error('Search worker could not start. Check worker-src or provide a worker factory.'));
      const timer = setTimeout(() => fail(new Error('Search worker did not start.')), 5000);
      this.pending = fail; port.addEventListener('message', message); port.addEventListener('error', failed);
    });
    return this.ready;
  }
  async scan(texts: string[], limit: number): Promise<SearchBatch> {
    throwIfAborted(this.options.signal);
    if (this.disposed) throw Object.assign(new Error('Search cancelled.'), { name: 'AbortError' });
    // Keep the existing literal-only API usable in SSR/Node. Never execute a
    // user-supplied regular expression on the main thread as a fallback.
    if (!this.options.worker && typeof Worker === 'undefined') {
      if (this.options.regex) throw new Error('Regular expression search requires a Worker or a worker factory.');
      const expression = new RegExp(this.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), this.options.caseSensitive ? 'gu' : 'giu');
      let remaining = limit;
      return { matches: texts.map(text => {
        const results: SourceRange[] = []; expression.lastIndex = 0;
        for (let match = expression.exec(text); match && remaining > 0; match = expression.exec(text)) {
          results.push({ start: match.index, end: match.index + match[0].length }); remaining--;
        }
        return results;
      }), limited: remaining === 0 };
    }
    await this.start();
    throwIfAborted(this.options.signal);
    if (this.disposed) throw Object.assign(new Error('Search cancelled.'), { name: 'AbortError' });
    return new Promise<SearchBatch>((resolve, reject) => {
      const port = this.port!;
      const cleanup = () => { clearTimeout(timer); port.removeEventListener('message', message); port.removeEventListener('error', failed); this.pending = undefined; };
      const fail = (error: Error) => { cleanup(); reject(error); this.dispose(); };
      const message = (event: MessageEvent) => {
        if (event.data.ready) return;
        cleanup();
        if (event.data.error) reject(Object.assign(new Error(event.data.error.message), { name: event.data.error.name }));
        else resolve(event.data);
      };
      const failed = () => fail(new Error('Search worker failed.'));
      const timer = setTimeout(() => fail(Object.assign(new Error('Search timed out. Simplify the regular expression.'), { name: 'SearchTimeoutError' })), this.options.timeoutMs ?? 750);
      this.pending = fail; port.addEventListener('message', message); port.addEventListener('error', failed);
      port.postMessage({ texts, query: this.query, regex: this.options.regex, caseSensitive: this.options.caseSensitive, limit });
    });
  }
}
