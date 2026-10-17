import { useEffect, useRef, useState } from 'react';
import { ResourceCache } from '../core/cache';
import { walk } from '../core/tree';
import { CopyButton } from '../components/CopyButton';
import { LoadingRing } from '../components/LoadingRing';
import { ToolIcon } from '../components/ToolIcon';
import { useLocale, useNodeState, useOwnedNodeState, useRuntime, useTheme } from '../react/context';
import { useStreamEntrance } from '../react/stream-effect';
import type { NodeRendererProps, RendererExtension } from '../react/types';
import { transformMermaid } from './syntax-transforms';
import { declareNodeStateRenderer, completeNodeStateShape, type NodeStateOwner } from '../react/node-state-handoff';

const mermaidStateOwner: NodeStateOwner = { name: 'mermaidStateOwner', keys: { 'mermaid-source': value => typeof value === 'boolean', 'mermaid-scale': value => typeof value === 'number' && Number.isFinite(value) && value > 0 }, signature: completeNodeStateShape };


let nextId = 0;
let queue = Promise.resolve();
const cache = new ResourceCache<string>(32);
// Mermaid owns global configuration; serialize initialize + render together so
// neighboring readers with different themes cannot change one another's output.
async function diagram(id: string, code: string, dark: boolean, font: string, signal: AbortSignal) {
  let result = '';
  const work = queue.then(async () => {
    if (signal.aborted) throw signal.reason;
    const { default: mermaid } = await import('mermaid');
    await document.fonts.ready;
    if (signal.aborted) throw signal.reason;
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true, fontFamily: font,
      theme: 'base', themeVariables: dark
        ? { background: '#242321', primaryColor: '#383531', primaryTextColor: '#e2ded7', primaryBorderColor: '#7b746a', lineColor: '#a29a8e', secondaryColor: '#302e2a', tertiaryColor: '#302e2a' }
        : { background: '#f9f8f6', primaryColor: '#eeebe6', primaryTextColor: '#49443e', primaryBorderColor: '#b5aca0', lineColor: '#91877a', secondaryColor: '#f5f3ef', tertiaryColor: '#f5f3ef' },
    });
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none';
    host.style.fontFamily = font;
    document.body.append(host);
    try { result = (await mermaid.render(id, code, host)).svg; }
    finally { host.remove(); }
  });
  queue = work.catch(() => {});
  await work;
  return result;
}

function MermaidNode({ node, incomplete }: NodeRendererProps) {
  const locale = useLocale(), theme = useTheme(), runtime = useRuntime();
  const zh = locale.language?.startsWith('zh');
  const [id] = useNodeState(node, 'mermaid-id', () => `limr-mermaid-${++nextId}`);
  const [systemDark, setSystemDark] = useState(false);
  const [result, setResult] = useState<{ key: string; svg?: string; error?: boolean }>();
  const [sourceView, setSourceView] = useOwnedNodeState(mermaidStateOwner, node, 'mermaid-source', false), [scale, setScale] = useOwnedNodeState(mermaidStateOwner, node, 'mermaid-scale', 1), [attempt, setAttempt] = useState(0);
  const ref = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const code = node.value ?? '';
  const dark = theme === 'dark' || theme === 'auto' && systemDark;
  const key = JSON.stringify([id, code, dark, attempt]);
  const current = result?.key === key ? result : undefined;
  useEffect(() => {
    if (theme !== 'auto') return;
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [theme]);
  useEffect(() => {
    if (incomplete) return;
    let disposed = false;
    const font = ref.current ? getComputedStyle(ref.current).fontFamily : 'sans-serif';
    const request = cache.acquire(`${key}:${font}`, signal => diagram(id, code, dark, font, signal));
    request.promise.then(svg => { if (!disposed) setResult({ key, svg }); }, () => { if (!disposed) setResult({ key, error: true }); });
    return () => { disposed = true; request.release(); };
  }, [key, incomplete]);
  useStreamEntrance(content, !!current?.svg, current?.svg);
  const loading = incomplete || !current;
  const source = sourceView || current?.error;
  useEffect(() => {
    const viewport = content.current;
    if (!viewport || source) return;
    // React's delegated wheel listener is passive. Only take over Shift+wheel;
    // native two-axis trackpads, touch scrolling and browser zoom keep working.
    const wheel = (event: WheelEvent) => {
      if (!event.shiftKey || event.ctrlKey || event.metaKey || !event.deltaY || viewport.scrollWidth <= viewport.clientWidth) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1;
      viewport.scrollLeft += (event.deltaX || event.deltaY) * unit;
      event.preventDefault();
    };
    viewport.addEventListener('wheel', wheel, { passive: false });
    return () => viewport.removeEventListener('wheel', wheel);
  }, [loading, source]);
  const select = () => {
    const canvas = content.current?.firstElementChild;
    if (!canvas) return;
    const range = document.createRange(); range.selectNodeContents(canvas);
    const selection = canvas.ownerDocument.getSelection();
    selection?.removeAllRanges(); selection?.addRange(range);
  };
  const label = sourceView ? zh ? '显示图像' : 'Show diagram' : zh ? '显示源代码' : 'Show source';
  return <div className="limr-math-block limr-mermaid-block" ref={ref} data-mermaid-state={loading ? 'loading' : current?.error ? 'error' : 'ready'}>
    <div className="limr-math-display limr-mermaid-display">
      {loading && <div className="limr-mermaid-loading"><LoadingRing /></div>}
      {!loading && <>
        {current?.error && <div className="limr-mermaid-error" data-limr-ignore="true" role="status">{zh ? '图表暂时无法绘制' : 'Unable to render diagram'} <button type="button" onClick={() => setAttempt(value => value + 1)}>{locale.retry}</button></div>}
        <pre className="limr-mermaid-source" hidden={!source}><code>{code}</code></pre>
        <div className="limr-mermaid-viewport" hidden={!!source} ref={content} tabIndex={0} role="region"
          aria-label={zh ? '图表视口' : 'Diagram viewport'}
          aria-description={zh ? '拖动平移；方向键或滚轮移动，Shift 加滚轮横向移动；单击或按 Enter 整块选择。' : 'Drag to pan; use arrow keys or the wheel to scroll, Shift+wheel to scroll horizontally; click or press Enter to select the block.'}
          onDragStart={event => event.preventDefault()}
          onPointerDown={event => {
            suppressClick.current = false;
            if (event.button !== 0 || event.pointerType === 'touch') return;
            const viewport = event.currentTarget;
            const bounds = viewport.getBoundingClientRect();
            // Leave native scrollbar thumbs and their track clicks to the UA.
            if (event.clientX >= bounds.left + viewport.clientLeft + viewport.clientWidth || event.clientY >= bounds.top + viewport.clientTop + viewport.clientHeight) return;
            // No native SVG/text drag selection, including foreignObject labels.
            event.preventDefault(); viewport.focus({ preventScroll: true });
            drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, moved: false };
            viewport.setPointerCapture(event.pointerId);
          }}
          onPointerMove={event => {
            const gesture = drag.current;
            if (!gesture || gesture.id !== event.pointerId) return;
            const x = event.clientX - gesture.x, y = event.clientY - gesture.y;
            if (!gesture.moved && Math.hypot(x, y) <= 4) return;
            if (!gesture.moved) { gesture.moved = true; runtime.clearSelection(); event.currentTarget.dataset.dragging = 'true'; }
            event.currentTarget.scrollTo(gesture.left - x, gesture.top - y);
          }}
          onPointerUp={event => {
            if (drag.current?.id !== event.pointerId) return;
            suppressClick.current = drag.current.moved; drag.current = null;
            delete event.currentTarget.dataset.dragging;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onLostPointerCapture={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}
          onClick={event => { if (!event.defaultPrevented && !suppressClick.current && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) select(); }}
          onKeyDown={event => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            const viewport = event.currentTarget;
            const moves: Record<string, [number, number]> = { ArrowLeft: [-48, 0], ArrowRight: [48, 0], ArrowUp: [0, -48], ArrowDown: [0, 48], PageUp: [0, -viewport.clientHeight * .9], PageDown: [0, viewport.clientHeight * .9] };
            if (moves[event.key]) viewport.scrollBy(...moves[event.key]);
            else if (event.key === 'Home') viewport.scrollTo(0, 0);
            else if (event.key === 'End') viewport.scrollTo(viewport.scrollWidth, viewport.scrollHeight);
            else if (event.key === 'Enter') select();
            else return;
            event.preventDefault();
          }}>
          <div className="limr-mermaid-canvas" style={{ width: `${scale * 100}%` }} role="img" aria-label={zh ? 'Mermaid 图表' : 'Mermaid diagram'} dangerouslySetInnerHTML={{ __html: current?.svg ?? '' }} />
        </div>
      </>}
    </div>
    <div className="limr-block-tools" data-limr-ignore="true" role="group" aria-label={zh ? '图表工具' : 'Diagram tools'}>
      <CopyButton value={code} label={zh ? '复制 Mermaid 源代码' : 'Copy Mermaid source'} />
      <button type="button" disabled={loading || !!source || scale >= 3} title={zh ? '放大' : 'Zoom in'} aria-label={zh ? '放大' : 'Zoom in'} onClick={() => setScale(value => Math.min(3, +(value + .25).toFixed(2)))}><ToolIcon name="zoom-in" /></button>
      <button type="button" disabled={loading || !!source || scale <= .5} title={zh ? '缩小' : 'Zoom out'} aria-label={zh ? '缩小' : 'Zoom out'} onClick={() => setScale(value => Math.max(.5, +(value - .25).toFixed(2)))}><ToolIcon name="zoom-out" /></button>
      <button type="button" disabled={loading || current?.error} title={label} aria-label={label} aria-pressed={sourceView} onClick={() => setSourceView(value => !value)}><ToolIcon name={sourceView ? 'image' : 'source'} /></button>
    </div>
  </div>;
}

/** Lazy, atomic diagrams. An unclosed streaming fence never reaches Mermaid. */
export function mermaid(): RendererExtension {
  declareNodeStateRenderer(mermaidStateOwner, MermaidNode);
  return { name: 'mermaid', directives: ['mermaid'], literal: true, scope: 'local', components: { mermaid: MermaidNode },
    transform: transformMermaid,
  };
}
