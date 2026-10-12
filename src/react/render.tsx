import { cloneElement, Component, createElement, Fragment, isValidElement, memo, useCallback, useMemo, useRef, type ComponentType, type CSSProperties, type ErrorInfo, type ReactElement, type ReactNode } from 'react';
import { mapText, rangeOf, safeUrl, walk, type AnnotationOccurrence, type Block, type Highlight, type MarkdownNode } from '../core';
import { intersects } from '../core/tree';
import { useDocumentSelector, useRuntime, useStoreSelector } from './context';
import { emptyList, type BlockDecorations, type ReaderRuntime } from './runtime';
import type { ViewConfiguration } from './types';
import { bindCompactText, compactTextNodes } from './text-binding';

interface RenderContext {
  runtime: ReaderRuntime;
  block: Block;
  marks: Map<MarkdownNode, readonly AnnotationOccurrence[]>;
  highlights: readonly Highlight[];
  tightList?: boolean;
  compact?: boolean;
  blockElement?: BlockElement;
}
interface BlockElement { id: string; pending: boolean; ref: (element: HTMLElement | null) => void }
const blockAttributes = (block?: BlockElement) => block ? { 'data-limr-block': block.id, 'data-pending': block.pending || undefined } : {};

export function AnnotationMarker({ occurrence }: { occurrence: AnnotationOccurrence }) {
  const runtime = useRuntime();
  const annotation = useStoreSelector(runtime.decorations, state => state.annotations.get(occurrence.annotationIds[0]));
  const active = useStoreSelector(runtime.interaction, state => state.active === occurrence.id);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered === occurrence.id);
  const definition = useStoreSelector(runtime.configuration, () => runtime.annotationTypes.get(annotation?.type ?? 'citation'));
  const Icon = definition?.icon;
  const Custom = definition?.Marker;
  const icon = typeof Icon === 'function' || Icon && typeof Icon === 'object' && !isValidElement(Icon) && '$$typeof' in Icon
    ? createElement(Icon as ComponentType) : Icon;
  return <sup className="limr-mark-wrap" data-limr-ignore="true"><button type="button"
    ref={element => runtime.registerAnchor(occurrence.id, element)}
    className="limr-mark" data-limr-anchor={occurrence.id} data-active={active || hovered || undefined}
    style={{ '--limr-mark-color': definition?.color } as CSSProperties}
    aria-label={definition?.label ?? annotation?.type ?? 'Annotation'} aria-expanded={active}
    onPointerEnter={event => { if (event.pointerType !== 'touch') runtime.hover(occurrence.id); }}
    onPointerLeave={event => { if (event.pointerType !== 'touch') runtime.hover(null); }}
    onFocus={() => runtime.hover(occurrence.id)} onBlur={() => runtime.hover(null)}
    onClick={() => runtime.activate(active ? null : occurrence.id)}>
    {Custom && annotation ? <Custom annotation={annotation} active={active} /> : icon ?? '•'}
    {occurrence.annotationIds.length > 1 && <span className="limr-mark-count">{occurrence.annotationIds.length}</span>}
  </button></sup>;
}

function Text({ node, context }: { node: MarkdownNode; context: RenderContext }) {
  const { runtime } = context;
  const value = node.value ?? '';
  const range = rangeOf(node);
  const source = runtime.document.getSnapshot().source;
  const mapped = useMemo(() => {
    let mapping: ReturnType<typeof mapText> | undefined;
    const raw = source.slice(range.start, range.end);
    return () => {
      if (!mapping) {
        const relative = mapText(raw, value, { start: 0, end: raw.length });
        mapping = { starts: relative.starts.map(offset => offset + range.start), ends: relative.ends.map(offset => offset + range.start), exact: relative.exact };
      }
      return mapping;
    };
  }, [node]);
  const marks = context.marks.get(node) ?? emptyList;
  const highlights = context.highlights.filter(highlight => intersects(highlight.range, range));
  if (!marks.length && !highlights.length) {
    // Most text is undecorated. Build character maps only when an actual
    // selection needs decoded entity/escape positions, never during SSR.
    const direct = source.slice(range.start, range.end) === value;
    return <span data-limr-text="" data-source-start={range.start} data-source-end={range.end} ref={element => {
      if (element) runtime.bindings.set(element, {
        range, atomic: false,
        get exact() { return direct || mapped().exact; },
        resolve: (offset, edge) => direct ? Math.max(range.start, Math.min(range.end, range.start + offset)) : edge === 'start' ? mapped().starts[offset] ?? range.end : mapped().ends[offset - 1] ?? range.start,
      });
    }}>{value}</span>;
  }
  const mapping = mapped();
  const markerAt = new Map<number, AnnotationOccurrence[]>();
  const boundaries = new Set([0, value.length]);
  for (const mark of marks) {
    let index = mapping.ends.findIndex(end => end >= mark.range.end);
    index = index < 0 ? value.length : index + 1;
    boundaries.add(index); markerAt.set(index, [...markerAt.get(index) ?? [], mark]);
  }
  for (const highlight of highlights) {
    const start = mapping.ends.findIndex(end => end > highlight.range.start);
    const end = mapping.starts.findIndex(start => start >= highlight.range.end);
    boundaries.add(Math.max(0, start)); boundaries.add(end < 0 ? value.length : end);
  }
  const points = [...boundaries].sort((a, b) => a - b);
  return <>{points.slice(1).map((end, index) => {
    const start = points[index];
    const segmentRange = { start: mapping.starts[start] ?? range.start, end: mapping.ends[end - 1] ?? range.end };
    const styles = highlights.filter(highlight => intersects(highlight.range, segmentRange));
    let text: ReactNode = value.slice(start, end);
    for (const highlight of styles) text = <mark key={highlight.id} data-limr-highlight={highlight.id} className={`limr-highlight limr-highlight-${highlight.style ?? 'background'}`} style={{ '--limr-highlight': highlight.color ?? '#f3ce7380' } as CSSProperties}>{text}</mark>;
    return <span key={start} ref={element => {
      if (element) runtime.bindings.set(element, { range: segmentRange, atomic: false, exact: mapping.exact, resolve: (offset, edge) => {
        const at = Math.max(start, Math.min(end, start + offset));
        return edge === 'start' ? mapping.starts[at] ?? segmentRange.end : mapping.ends[at - 1] ?? segmentRange.start;
      } });
    }} data-limr-text="" data-source-start={segmentRange.start} data-source-end={segmentRange.end}>
      {text}{markerAt.get(end)?.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}
    </span>;
  })}</>;
}

function Atomic({ node, context, children, inline, blockElement }: { node: MarkdownNode; context: RenderContext; children: ReactNode; inline: boolean; blockElement?: BlockElement }) {
  const range = rangeOf(node);
  const selected = useStoreSelector(context.runtime.interaction, state => state.selection?.raw.ranges.some(selection => intersects(selection, range)) ?? false);
  const highlights = context.highlights.filter(highlight => intersects(highlight.range, range));
  const Tag = inline ? 'span' : 'div';
  return <Tag {...blockAttributes(blockElement)} className={`limr-atomic${highlights.length ? ' limr-atomic-highlight' : ''}`} data-selected={selected || undefined}
    style={{ '--limr-highlight': highlights[0]?.color ?? '#f3ce7380' } as CSSProperties}
    ref={element => { if (element) context.runtime.bindings.set(element, { range, atomic: true }); blockElement?.ref(element); }}>
    {children}{context.marks.get(node)?.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}
  </Tag>;
}

function HeadingNode({ node, children, runtime, blockElement }: { node: MarkdownNode; children: ReactNode; runtime: ReaderRuntime; blockElement?: BlockElement }) {
  const id = (() => {
    const doc = runtime.document.getSnapshot();
    const offset = node.position?.start.offset ?? 0;
    let lo = 0, hi = doc.headings.length;
    while (lo < hi) { const mid = (lo + hi) >>> 1; if (doc.headings[mid].range.start < offset) lo = mid + 1; else hi = mid; }
    return doc.headings[lo]?.range.start === offset ? doc.headings[lo].id : undefined;
  })();
  return createElement(`h${node.depth}`, { ...blockAttributes(blockElement), id, ref: (element: HTMLElement | null) => { if (id) runtime.registerHeading(id, element); blockElement?.ref(element); } }, children);
}
function Reference({ node, children, image }: { node: MarkdownNode; children: ReactNode; image: boolean }) {
  const definition = useDocumentSelector(doc => doc.definitions.get(String(node.identifier)));
  if (!definition) return <>{children || String(node.alt ?? node.label ?? '')}</>;
  return image ? <img src={safeUrl(definition.url, true)} alt={String(node.alt ?? '')} title={definition.title ? String(definition.title) : undefined} loading="lazy" decoding="async" /> : <a href={safeUrl(definition.url)} title={definition.title ? String(definition.title) : undefined}>{children}</a>;
}
function FootnoteReference({ node }: { node: MarkdownNode }) {
  const runtime = useRuntime();
  const identifier = String(node.identifier);
  const number = useDocumentSelector(doc => doc.footnoteOrder.indexOf(identifier) + 1);
  return <sup data-limr-ignore="true"><a href={`#${runtime.document.id}-fn-${encodeURIComponent(identifier)}`} id={`${runtime.document.id}-fnref-${rangeOf(node).start}`} aria-label={`Footnote ${number}`}>{number}</a></sup>;
}

class ExtensionBoundary extends Component<{ children: ReactNode; fallback: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Isolate a third-party rendering failure to its source block. */ }
  componentDidUpdate(previous: Readonly<{ children: ReactNode; fallback: string }>) {
    if (this.state.failed && previous.fallback !== this.props.fallback) this.setState({ failed: false });
  }
  render() { return this.state.failed ? <pre className="limr-extension-error">{this.props.fallback}</pre> : this.props.children; }
}

function containsBlock(node: MarkdownNode): boolean {
  return (node.type === 'component' && !node.inline) || ['math', 'code', 'list', 'table', 'blockquote'].includes(node.type) || (node.children?.some(containsBlock) ?? false);
}

function renderNode(node: MarkdownNode, context: RenderContext, index = 0): ReactNode {
  const { runtime } = context;
  if (node.type === 'text' && context.compact) return node.value ?? '';
  const blockElement = node === context.block.node ? context.blockElement : undefined;
  const key = `${node.type}-${node.position?.start.offset ?? index}-${index}`;
  const childContext = node.type === 'list' ? { ...context, tightList: !node.spread } : context;
  const renderChildren = (nodes: readonly MarkdownNode[]) => nodes.map((child, i) => renderNode(child, childContext, i));
  const children = node.type === 'table' ? [] : node.type === 'listItem' && context.tightList
    ? (node.children ?? []).flatMap((child, index) => child.type === 'paragraph' ? renderChildren(child.children ?? []) : renderNode(child, context, index))
    : renderChildren(node.children ?? []);
  const Renderer = runtime.components[node.type === 'component' ? node.name ?? '' : node.type];
  let element: ReactNode;
  if (Renderer) {
    const range = rangeOf(node);
    element = <ExtensionBoundary key={key} fallback={runtime.document.getSnapshot().source.slice(range.start, range.end)}><Renderer node={node} children={children} pending={context.block.pending} source={runtime.document.getSnapshot().source.slice(range.start, range.end)} renderChildren={renderChildren} /></ExtensionBoundary>;
  } else {
    switch (node.type) {
      case 'text': return context.compact ? node.value ?? '' : <Text key={key} node={node} context={context} />;
      case 'paragraph': element = containsBlock(node) ? <div className="limr-paragraph">{children}</div> : <p>{children}</p>; break;
      case 'heading': return <HeadingNode key={key} node={node} runtime={runtime} blockElement={blockElement}>{children}</HeadingNode>;
      case 'strong': element = <strong>{children}</strong>; break;
      case 'emphasis': element = <em>{children}</em>; break;
      case 'delete': element = <del>{children}</del>; break;
      case 'inlineCode': element = <code>{node.value}</code>; break;
      case 'code': element = <pre><code>{node.value}</code></pre>; break;
      case 'math': case 'inlineMath': element = <code>{node.value}</code>; break;
      case 'blockquote': element = <blockquote>{children}</blockquote>; break;
      case 'list': element = node.ordered ? <ol start={Number(node.start ?? 1)}>{children}</ol> : <ul>{children}</ul>; break;
      case 'listItem': element = <li className={typeof node.checked === 'boolean' ? 'limr-task-item' : undefined}>{typeof node.checked === 'boolean' && <input type="checkbox" checked={node.checked} disabled aria-label="Task" />}{children}</li>; break;
      case 'link': element = <a href={safeUrl(node.url)} title={node.title ? String(node.title) : undefined}>{children}</a>; break;
      case 'image': element = <img src={safeUrl(node.url, true)} alt={String(node.alt ?? '')} title={node.title ? String(node.title) : undefined} loading="lazy" decoding="async" />; break;
      case 'linkReference': element = <Reference node={node} image={false}>{children}</Reference>; break;
      case 'imageReference': element = <Reference node={node} image>{children}</Reference>; break;
      case 'thematicBreak': element = <hr />; break;
      case 'break': element = <br />; break;
      case 'table': {
        const rows = node.children ?? [], alignment = node.align as (string | null)[];
        element = <div className="limr-table-scroll"><table><thead>{rows.slice(0, 1).map((row, i) => <tr key={i}>{row.children?.map((cell, j) => <th key={j} style={{ textAlign: alignment?.[j] as CSSProperties['textAlign'] }}>{renderChildren(cell.children ?? [])}</th>)}</tr>)}</thead><tbody>{rows.slice(1).map((row, i) => <tr key={i}>{row.children?.map((cell, j) => <td key={j} style={{ textAlign: alignment?.[j] as CSSProperties['textAlign'] }}>{renderChildren(cell.children ?? [])}</td>)}</tr>)}</tbody></table></div>; break;
      }
      case 'definition': case 'footnoteDefinition': case 'annotationDefinition': return null;
      case 'footnoteReference': return <FootnoteReference key={key} node={node} />;
      case 'annotationReference': {
        const Tag = node.inline ? 'span' : 'div';
        element = <Tag>{children}<AnnotationMarker occurrence={{ id: `${runtime.document.id}-ref-${rangeOf(node).start}`, range: rangeOf(node), annotationIds: node.annotationIds as string[], embedded: true }} /></Tag>; break;
      }
      case 'html': element = <span className="limr-literal">{node.value}</span>; break;
      case 'component': element = children; break;
      default: element = children.length ? children : node.value ?? null;
    }
  }
  const atomic = node.selection === 'atomic' || ['inlineCode', 'code', 'math', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type);
  if (atomic) return <Atomic key={key} node={node} context={context} blockElement={blockElement} inline={node.inline || ['inlineCode', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type)}>{element}</Atomic>;
  if (blockElement) {
    const attributes = { ...blockAttributes(blockElement), ref: blockElement.ref };
    // Ordinary blocks carry their own metadata; only arbitrary custom renderers
    // need an outer host element to participate in layout and selection.
    return isValidElement(element) && typeof element.type === 'string'
      ? cloneElement(element as ReactElement<Record<string, unknown>>, { ...attributes, key })
      : <div key={key} {...attributes}>{element}</div>;
  }
  return isValidElement(element) ? cloneElement(element, { key }) : <Fragment key={key}>{element}</Fragment>;
}

export const BlockView = memo(function BlockView({ block, runtime, components, extensions, decorations }: { block: Block; runtime: ReaderRuntime; decorations: BlockDecorations } & Pick<ViewConfiguration, 'components' | 'extensions'>) {
  const element = useRef<HTMLElement | null>(null);
  const clearBindings = useRef<(() => void) | undefined>(undefined);
  const { occurrences, highlights } = decorations;
  const texts = useMemo(() => compactTextNodes(block.node, runtime.components), [block, runtime, components, extensions]);
  const compact = !!texts && !occurrences.length && !highlights.length;
  const observe = useCallback((next: HTMLElement | null) => {
    clearBindings.current?.(); clearBindings.current = undefined;
    if (element.current) runtime.textBinders.delete(element.current);
    if (element.current && element.current !== next) runtime.unobserveBlock(element.current);
    element.current = next;
    runtime.observeBlock(next);
    if (next && compact && texts!.length) runtime.textBinders.set(next, () => { clearBindings.current = bindCompactText(next, texts!, runtime); });
  }, [runtime, compact, texts]);
  const marks = useMemo(() => {
    const map = new Map<MarkdownNode, AnnotationOccurrence[]>();
    if (!occurrences.length) return map;
    const leaves: MarkdownNode[] = [];
    function collect(node: MarkdownNode) {
      if (node.selection === 'atomic' || ['text', 'inlineCode', 'code', 'math', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type)) leaves.push(node);
      else node.children?.forEach(collect);
    }
    collect(block.node);
    for (const occurrence of occurrences) {
      const target = [...leaves].reverse().find(node => rangeOf(node).start < occurrence.range.end) ?? leaves[0];
      if (target) map.set(target, [...map.get(target) ?? [], occurrence]);
    }
    return map;
  }, [block, occurrences]);
  if (['definition', 'footnoteDefinition', 'annotationDefinition'].includes(block.node.type)) return null;
  const context: RenderContext = { runtime, block, marks, highlights, compact, blockElement: { id: block.id, pending: block.pending, ref: observe } };
  return renderNode(block.node, context);
});

export function Footnotes() {
  const runtime = useRuntime();
  const doc = useDocumentSelector(snapshot => snapshot);
  if (!doc.footnoteOrder.length) return null;
  return <section className="limr-footnotes" aria-label={runtime.locale.footnotes}><hr /><ol>{doc.footnoteOrder.map(id => {
    const node = doc.footnotes.get(id);
    if (!node) return null;
    const block: Block = { id: `${doc.id}-fn-${id}`, range: rangeOf(node), node, pending: false };
    const context: RenderContext = { runtime, block, marks: new Map(), highlights: [] };
    return <li key={id} id={`${doc.id}-fn-${encodeURIComponent(id)}`}>{node.children?.map((child, index) => renderNode(child, context, index))}</li>;
  })}</ol></section>;
}
