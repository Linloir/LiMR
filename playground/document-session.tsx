import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { createDocumentSession, type DocumentSessionState } from '../src/core';
import { standard } from '../src/extensions/standard';
const prose = '山间的风吹过河流。旅人在树下停留，翻开一本记载村庄故事的书。 The reader continues through the novel.\n\n'.repeat(30000);
const rich = '# Heading\n\n[Reference][later] with a footnote[^note].\n\n[later]: /correct\n\n[^note]: Complete note.\n';
function Fixture() {
  const [state, setState] = useState<DocumentSessionState>(), [error, setError] = useState(''), [prefix, setPrefix] = useState(0), [ticks, setTicks] = useState(0);
  const counter = useRef(0);
  const [session] = useState(() => createDocumentSession({ id: 'browser-worker', extensions: standard(), mode: 'progressive', worker: () => new Worker(new URL('../src/worker.ts', import.meta.url), { type: 'module' }) }));
  useEffect(() => { const remove = session.subscribe(() => { const next = session.getSnapshot(); setState(next); if (next.document && !next.complete) setPrefix(next.document.getSnapshot().source.length); }); const timer = setInterval(() => { counter.current++; setTicks(counter.current); }, 16); return () => { remove(); session.dispose(); clearInterval(timer); }; }, [session]);
  const start = (source: string) => { setError(''); setPrefix(0); void session.load(source).catch(error => setError(error.name)); };
  const snapshot = state?.document?.getSnapshot();
  return <><button onClick={() => start(prose)}>Novel</button><button onClick={() => start(rich)}>References</button><button onClick={() => session.cancel()}>Cancel</button>
    <output data-testid="state">{JSON.stringify({ status: state?.status ?? 'idle', complete: state?.complete, sourceLength: snapshot?.source.length, expected: prose.length, prefix, worker: state?.capabilities.worker, blocks: snapshot?.blocks.length, definition: snapshot?.definitions.get('later')?.url, annotations: snapshot?.annotations.length, revision: state?.revision, error, message: state?.error?.message, ticks })}</output></>;
}
createRoot(document.getElementById('root')!).render(<Fixture />);
