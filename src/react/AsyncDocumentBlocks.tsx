import { useMemo, useRef } from 'react';
import type { Block } from '../core';
import { useIsomorphicLayoutEffect, useRuntime } from './context';
import { asyncHandoffScope } from './async-handoff-policy';
import { capturePrefix, proveFinal } from '../stable-block-proof';
import { useTableViewHandoff } from '../components/table-view-handoff';
import { WindowedBlocks } from './WindowedBlocks';
import type { ReaderRuntime } from './runtime';

// Only the actually committed host supplies keys for a later same-request
// handoff. An abandoned render never publishes a key or a source-DOM proof.
const committedHosts = new WeakMap<ReaderRuntime, { key(block: Block): string }>();

/** One component/slot tree for this accepted progressive request, regardless
 * of its current windowing capability. Ordinary Reader never enters this path. */
export function AsyncDocumentBlocks({ blocks, windowed, overscan }: {
  blocks: readonly Block[]; windowed: boolean; overscan?: number;
}) {
  const runtime = useRuntime(), epoch = useRef(0);
  const proof = useMemo(() => {
    const scope = asyncHandoffScope(runtime), previous = scope?.previous;
    const committed = previous && committedHosts.get(previous);
    const identity = scope?.identity, previousScope = previous && asyncHandoffScope(previous);
    const saved = previous && committed && identity && previousScope?.identity === identity && !previousScope.complete
      ? capturePrefix(previous, identity, identity.revision, committed.key) : undefined;
    const generation = `async-slot-${++epoch.current}`;
    return identity ? proveFinal(saved, runtime, identity, identity.revision, generation)
      : { key: (block: Block) => `${generation}:${block.id}`, retain: [], refused: [], viewGrant: undefined };
  }, [runtime]);
  useTableViewHandoff(proof.viewGrant);
  useIsomorphicLayoutEffect(() => {
    committedHosts.set(runtime, { key: proof.key });
    return () => { committedHosts.delete(runtime); };
  }, [runtime, proof]);
  return <WindowedBlocks blocks={blocks} windowed={windowed} overscan={overscan} proof={proof} />;
}
