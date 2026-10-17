import { Component, createContext, useContext, type ContextType, type ReactNode } from 'react';
import type { Annotation, DocumentEngine } from '../core';
import { useIsomorphicLayoutEffect, useRuntime } from './context';
import { captureReadingPosition, restoreReadingPosition } from './reading-position';
import type { ReaderRuntime } from './runtime';
import type { ReadingPosition } from './types';
import { NodeStateHandoffContext } from './node-state-handoff';
import { AsyncHandoffContext, type AsyncRequestIdentity, type AsyncHandoffScope } from './async-handoff-policy';

interface Props {
  session: object;
  request?: object;
  revision: number;
  document?: DocumentEngine;
  complete: boolean;
  publicAnnotations?: readonly Annotation[];
  injectedAnnotations?: readonly Annotation[];
  children: ReactNode;
}
const RuntimeBinding = createContext<(runtime: ReaderRuntime | null) => void>(() => {});
interface CaptureProps extends Omit<Props, 'children'> { capture(previous: CaptureProps): void }
class PositionCapture extends Component<CaptureProps> {
  getSnapshotBeforeUpdate(previous: CaptureProps) { this.props.capture(previous); return null; }
  componentDidUpdate() {}
  render() { return null; }
}

/** The prefix can use ordinary DOM while the completed book uses a window.
 * Capture before either that DOM or the loading banner is changed; a layout
 * effect cleanup is already too late to read the previous character geometry. */
export class AsyncReaderPositionBoundary extends Component<Props> {
  private runtime: ReaderRuntime | null = null;
  private committed: Props | undefined;
  private identity: AsyncRequestIdentity | undefined;
  private stableIdentity: AsyncRequestIdentity | undefined;
  private asyncScope: AsyncHandoffScope | null = null;
  private stateScope: NonNullable<ContextType<typeof NodeStateHandoffContext>> | null = null;
  private stateIdentity: AsyncRequestIdentity | undefined;
  private commitScope() {
    const state = this.props, identity = this.identity;
    if (!identity || identity.request !== state.request || identity.session !== state.session || identity.revision !== state.revision) this.stableIdentity = undefined;
    else if (state.document && !state.complete) this.stableIdentity = identity;
    else if (this.stableIdentity !== identity) this.stableIdentity = undefined;
  }
  private position: ReadingPosition | null = null;
  private bind = (runtime: ReaderRuntime | null) => { this.runtime = runtime; };
  private capture = (previous: CaptureProps) => {
    this.position = null;
    if (!this.props.request || previous.request !== this.props.request || previous.session !== this.props.session || previous.revision !== this.props.revision || previous.complete ||
      !previous.document || !this.props.document || previous.document === this.props.document ||
      this.runtime?.document !== previous.document) return;
    const runtime = this.runtime, content = runtime.content;
    if (!content) return;
    const edge = runtime.getViewportTop() + (runtime.configuration.get().scrollOffset ?? 24);
    const bounds = content.getBoundingClientRect();
    // An outer page still above/below this reader must not jump into its text.
    if (bounds.top > edge || bounds.bottom <= edge) return;
    this.position = captureReadingPosition(runtime);
  };
  componentDidMount() { this.committed = this.props; this.commitScope(); }
  componentDidUpdate() {
    this.committed = this.props; this.commitScope();
    const position = this.position; this.position = null;
    if (position && this.runtime && this.runtime.document === this.props.document) restoreReadingPosition(this.runtime, position);
  }
  render() {
    const { children, ...state } = this.props;
    const previous = this.committed;
    if (!state.request) this.identity = undefined;
    else if (!this.identity || this.identity.session !== state.session || this.identity.request !== state.request || this.identity.revision !== state.revision) this.identity = { session: state.session, request: state.request, revision: state.revision };
    const identity = this.identity;
    const stable = !!identity && !!state.document && (this.stableIdentity === identity || !state.complete);
    const handoff = previous && state.request && previous.request === state.request && previous.session === state.session &&
      previous.revision === state.revision && !previous.complete && state.complete &&
      previous.document && state.document && previous.document !== state.document && this.runtime?.document === previous.document
      ? this.runtime : null;
    // A progress-only parent render must not notify the root provider through
    // context and defeat AsyncReaderContent's memo boundary. Compare every
    // authority/configuration field; real request or configuration changes still
    // publish a new value. These caches perform no runtime admission or mutation.
    const cached = this.asyncScope;
    if (!stable) this.asyncScope = null;
    else if (!cached || cached.target !== state.document || cached.identity !== identity || cached.previous !== handoff ||
      cached.complete !== state.complete || cached.publicAnnotations !== state.publicAnnotations || cached.injectedAnnotations !== state.injectedAnnotations) {
      this.asyncScope = { target: state.document!, identity: identity!, previous: handoff, complete: state.complete, publicAnnotations: state.publicAnnotations, injectedAnnotations: state.injectedAnnotations };
    }
    const collect = !!state.request && !state.complete;
    if (!this.stateScope || this.stateIdentity !== identity || this.stateScope.target !== state.document ||
      this.stateScope.previous !== handoff || this.stateScope.collect !== collect) {
      this.stateScope = { target: state.document, previous: handoff, collect };
      this.stateIdentity = identity;
    }
    // React snapshots visit children first. This first sibling captures before
    // KP boundaries restore their React-owned text, while the parent's layout
    // callback restores only after all new content bindings are installed.
    return <AsyncHandoffContext.Provider value={this.asyncScope}><NodeStateHandoffContext.Provider value={this.stateScope}><RuntimeBinding.Provider value={this.bind}><PositionCapture {...state} capture={this.capture} />{children}</RuntimeBinding.Provider></NodeStateHandoffContext.Provider></AsyncHandoffContext.Provider>;
  }
}

/** Reader children run after the new content's layout bindings are installed. */
export function AsyncReaderPositionBinding() {
  const bind = useContext(RuntimeBinding), runtime = useRuntime();
  useIsomorphicLayoutEffect(() => { bind(runtime); return () => bind(null); }, [bind, runtime]);
  return null;
}
