import { expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { createDocument, type Annotation } from '../src/core';
import { Reader } from '../src/components/Reader';
import { useRuntime } from '../src/react/context';
import { ReaderRuntime } from '../src/react/runtime';
import { AsyncHandoffContext, admitAsyncHandoff, asyncHandoffScope, type AsyncHandoffScope } from '../src/react/async-handoff-policy';

const make = () => {
  const document = createDocument('A complete source owner.', { id: 'same-engine', extensions: [] });
  const injected = Object.freeze([]) as readonly Annotation[];
  const scope: AsyncHandoffScope = { target: document, identity: { session: {}, request: {}, revision: 1 }, previous: null, complete: false, publicAnnotations: undefined, injectedAnnotations: injected };
  return { document, injected, scope };
};

it('refuses provenance when the actual runtime configuration does not contain the exact issued array', () => {
  const { document, scope } = make(), external = Object.freeze([]) as readonly Annotation[];
  const runtime = new ReaderRuntime(document.id, '', false, { extensions: [], annotations: external }, document);
  admitAsyncHandoff(runtime, scope);
  expect(runtime.configuration.get().annotations).toBe(external);
  expect(asyncHandoffScope(runtime)).toBeUndefined();
  runtime.dispose();
});

it('does not overwrite an admitted runtime scope with a later issuer or request', () => {
  const { document, injected, scope } = make();
  const runtime = new ReaderRuntime(document.id, '', false, { extensions: [], annotations: injected }, document);
  admitAsyncHandoff(runtime, scope);
  const other: AsyncHandoffScope = { ...scope, identity: { ...scope.identity, request: {} } };
  admitAsyncHandoff(runtime, other);
  expect(asyncHandoffScope(runtime)).toBe(scope);
  expect(asyncHandoffScope(runtime)).not.toBe(other);
  runtime.dispose();
});

it('consumes provenance only for the root reader, isolating a nested reader using the same engine', () => {
  const { document, injected, scope } = make(), observed = new Map<string, ReaderRuntime>();
  function Probe({ name }: { name: string }) { observed.set(name, useRuntime()); return <output>{name}</output>; }
  const html = renderToString(<AsyncHandoffContext.Provider value={scope}>
    <Reader document={document} extensions={[]} annotations={injected} toc={false} sidebar={false} virtualization={false}>
      <Probe name="outer" />
      <Reader document={document} extensions={[]} annotations={injected} toc={false} sidebar={false} virtualization={false}><Probe name="nested" /></Reader>
    </Reader>
  </AsyncHandoffContext.Provider>);
  const outer = observed.get('outer')!, nested = observed.get('nested')!;
  expect(html).toContain('<output>outer</output>'); expect(html).toContain('<output>nested</output>');
  expect(outer).not.toBe(nested); expect(outer.document).toBe(nested.document);
  expect(asyncHandoffScope(outer)).toBe(scope); expect(asyncHandoffScope(nested)).toBeUndefined();
  outer.dispose(); nested.dispose();
});
