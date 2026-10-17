import { AsyncReader, useLiMR } from '../../src';
import '../../src/styles.css';
import 'katex/dist/katex.min.css';
function Bridge({ state }: { state: any }) { state.api = useLiMR(); return null; }
const worker = () => new Worker(new URL('../../src/worker.ts', import.meta.url), { type: 'module' });
export function render(input: Blob, state: any) {
  return <AsyncReader input={input} loading={{ worker, mode: 'blocking', fallback: 'error' }} loadingFallback={null}
    onLoadStateChange={value => { state.loading = { status: value.status, worker: value.capabilities.worker, progress: value.overallProgress };
      if (value.status === 'error') state.error = value.error?.message;
      if (value.status === 'ready') state.sessionReadyMs = performance.now() - state.start;
    }}><Bridge state={state} /></AsyncReader>;
}
