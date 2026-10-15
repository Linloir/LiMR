import { Component, type ReactNode } from 'react';

interface Endpoint { node: Node; offset: number; prefix?: string }
interface Snapshot { anchor: Endpoint; focus: Endpoint }
interface Props { children: ReactNode; element: () => HTMLElement | null; enabled: boolean }

function textsIn(root: HTMLElement): Text[] {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: node => node.parentElement?.closest('[data-limr-ignore], [inert]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  const texts: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) texts.push(node as Text);
  return texts;
}

/** Finishing inline syntax can replace a decoration's DOM while leaving its
 * text intact. Preserve only unchanged selected prefixes across that commit;
 * ordinary append-only streaming keeps its original native text endpoints. */
export class StreamSelectionBoundary extends Component<Props, object, Snapshot | null> {
  getSnapshotBeforeUpdate(): Snapshot | null {
    const root = this.props.element(), selection = root?.ownerDocument.getSelection();
    if (!this.props.enabled || !root || !selection?.anchorNode || !selection.focusNode || selection.isCollapsed
      || !root.contains(selection.anchorNode) && !root.contains(selection.focusNode)) return null;
    const texts = textsIn(root);
    const capture = (node: Node, offset: number): Endpoint => {
      let prefix = '';
      for (const text of texts) {
        if (text === node) return { node, offset, prefix: prefix + text.data.slice(0, offset) };
        prefix += text.data;
      }
      return { node, offset };
    };
    return { anchor: capture(selection.anchorNode, selection.anchorOffset), focus: capture(selection.focusNode, selection.focusOffset) };
  }
  componentDidUpdate(_props: Props, _state: object, snapshot: Snapshot | null) {
    const root = this.props.element(), selection = root?.ownerDocument.getSelection();
    if (!snapshot || !root || !selection?.anchorNode || !selection.focusNode) return;
    const { anchor, focus } = snapshot;
    if (selection.anchorNode === anchor.node && selection.anchorOffset === anchor.offset && selection.focusNode === focus.node && selection.focusOffset === focus.offset) return;
    const texts = textsIn(root), value = texts.map(text => text.data).join('');
    const restore = (saved: Endpoint, node: Node, offset: number): Endpoint => {
      const length = saved.node.nodeType === Node.TEXT_NODE ? (saved.node as Text).length : saved.node.childNodes.length;
      if (saved.node.isConnected && saved.offset <= length && (saved.prefix === undefined || value.startsWith(saved.prefix))) return saved;
      if (saved.prefix !== undefined && value.startsWith(saved.prefix)) {
        let remaining = saved.prefix.length;
        for (const text of texts) {
          if (remaining <= text.length) return { node: text, offset: remaining };
          remaining -= text.length;
        }
      }
      return { node, offset };
    };
    const start = restore(anchor, selection.anchorNode, selection.anchorOffset), end = restore(focus, selection.focusNode, selection.focusOffset);
    selection.setBaseAndExtent(start.node, start.offset, end.node, end.offset);
  }
  render() { return this.props.children; }
}
