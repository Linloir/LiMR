// Internal request provenance. This is deliberately absent from ViewConfiguration
// and package exports: matching public []/undefined never grants continuity.
import { createContext } from 'react';
import type { Annotation, DocumentEngine } from '../core';
import type { ReaderRuntime } from './runtime';

export interface AsyncRequestIdentity {
  readonly session: object;
  readonly request: object;
  readonly revision: number;
}
export interface AsyncHandoffScope {
  readonly target: DocumentEngine;
  readonly identity: AsyncRequestIdentity;
  readonly previous: ReaderRuntime | null;
  readonly complete: boolean;
  readonly publicAnnotations: readonly Annotation[] | undefined;
  readonly injectedAnnotations: readonly Annotation[] | undefined;
}
export const AsyncHandoffContext = createContext<AsyncHandoffScope | null>(null);
const scopes = new WeakMap<ReaderRuntime, AsyncHandoffScope>();

/** The root provider consumes this once and resets context for descendants. */
export function admitAsyncHandoff(runtime: ReaderRuntime, scope: AsyncHandoffScope): void {
  if (runtime.document !== scope.target || scopes.has(runtime)) return;
  const annotations = runtime.configuration.get().annotations;
  // Both the issuer and actual receiving configuration must agree. No inference
  // from an empty external array, matching document id, or equal source text.
  if (scope.injectedAnnotations !== undefined) {
    if (scope.complete || scope.publicAnnotations !== undefined || annotations !== scope.injectedAnnotations ||
        !Object.isFrozen(scope.injectedAnnotations) || scope.injectedAnnotations.length) return;
  } else if (annotations !== scope.publicAnnotations) return;
  scopes.set(runtime, scope);
}
export function asyncHandoffScope(runtime: ReaderRuntime): AsyncHandoffScope | undefined { return scopes.get(runtime); }

export function sameAsyncAnnotationPolicy(previous: ReaderRuntime, target: ReaderRuntime): boolean {
  const before = previous.configuration.get().annotations, after = target.configuration.get().annotations;
  if (Object.is(before, after)) return true;
  const left = scopes.get(previous), right = scopes.get(target);
  return !!left && !!right && left.identity === right.identity && right.previous === previous &&
    left.target === previous.document && right.target === target.document && !left.complete && right.complete &&
    left.publicAnnotations === undefined && right.publicAnnotations === undefined &&
    left.injectedAnnotations !== undefined && before === left.injectedAnnotations && after === undefined;
}
