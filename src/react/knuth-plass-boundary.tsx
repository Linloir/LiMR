import { Component, type ReactNode } from 'react';
import type { KnuthPlassOptions } from '../core/knuth-plass';
import type { ReaderRuntime } from './runtime';
import { finishTypographyLayout, initializeTypographyLayout } from './typography-layout-state';

let implementation: Promise<typeof import('./knuth-plass-layout')> | undefined;
interface Props { children: ReactNode; element: () => HTMLElement | null; runtime: ReaderRuntime; enabled: boolean; pending: boolean; options?: KnuthPlassOptions }
/** No extra DOM. The pre-commit lifecycle restores React-owned text before
 * React changes it. Standard mode loads and observes nothing. */
export class KnuthPlassBoundary extends Component<Props> {
  private release?: () => void;
  private version = 0;
  private initializing?: HTMLElement;
  private clearInitializing() {
    if (this.initializing) initializeTypographyLayout(this.initializing, false);
    this.initializing = undefined;
  }
  private start() {
    const version = ++this.version;
    if (!this.props.enabled || this.props.pending) return;
    const root = this.props.element(); if (!root) return;
    this.initializing = root; initializeTypographyLayout(root, true);
    implementation ??= import('./knuth-plass-layout');
    void implementation.then(module => {
      if (version !== this.version) return;
      this.clearInitializing();
      this.release = module.typeset(root, this.props.runtime, this.props.options);
      // Even a heading/code block with no typography jobs has now completed
      // initialization, so a waiting source reveal must be allowed to finish.
      finishTypographyLayout(this.props.runtime);
    }).catch(error => {
      if (version === this.version) { this.clearInitializing(); finishTypographyLayout(this.props.runtime); }
      throw error;
    });
  }
  componentDidMount() { this.start(); }
  getSnapshotBeforeUpdate() { this.version++; this.clearInitializing(); this.release?.(); this.release = undefined; return null; }
  componentDidUpdate() { this.start(); }
  componentWillUnmount() { this.version++; this.clearInitializing(); this.release?.(); }
  render() { return this.props.children; }
}
