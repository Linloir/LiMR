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

export type Renderer = 'limr' | 'markstream';
export type Profile = 'full-dom' | 'default';
