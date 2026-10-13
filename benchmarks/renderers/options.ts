export const fullDOMOptions = {
  maxLiveNodes: 0,
  batchRendering: false,
  deferNodesUntilVisible: false,
  viewportPriority: false,
  smoothStreaming: false,
  typewriter: false,
  fade: false,
  renderCodeBlocksAsPre: true,
} as const;

export const renderers = ['limr', 'react-markdown', 'markstream'] as const;
export type Renderer = typeof renderers[number];
export type Profile = 'full-dom' | 'default';
