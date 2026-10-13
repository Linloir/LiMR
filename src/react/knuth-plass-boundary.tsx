import { Component, type ReactNode } from 'react';
import type { KnuthPlassOptions } from '../core/knuth-plass';
import type { ReaderRuntime } from './runtime';

let implementation: Promise<typeof import('./knuth-plass-layout')> | undefined;
interface Props { children: ReactNode; element: () => HTMLElement | null; runtime: ReaderRuntime; enabled: boolean; pending: boolean; options?: KnuthPlassOptions }
/** No extra DOM. The pre-commit lifecycle restores React-owned text before
 * React changes it. Standard mode loads and observes nothing. */
export class KnuthPlassBoundary extends Component<Props> {
  private release?: () => void;
  private version = 0;
  private start() {
    const version = ++this.version;
    if (!this.props.enabled || this.props.pending) return;
    implementation ??= import('./knuth-plass-layout');
    void implementation.then(module => {
      if (version !== this.version) return;
      const root = this.props.element();
      if (root) this.release = module.typeset(root, this.props.runtime, this.props.options);
    });
  }
  componentDidMount() { this.start(); }
  getSnapshotBeforeUpdate() { this.version++; this.release?.(); this.release = undefined; return null; }
  componentDidUpdate() { this.start(); }
  componentWillUnmount() { this.version++; this.release?.(); }
  render() { return this.props.children; }
}
