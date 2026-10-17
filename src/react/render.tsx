import type { PaintHighlight } from './runtime';
import { cloneElement, Component, createElement, Fragment, isValidElement, memo, useCallback, useMemo, useRef, type ComponentType, type CSSProperties, type ErrorInfo, type ReactElement, type ReactNode } from 'react';
import { mapText, rangeOf, safeUrl, walk, type AnnotationOccurrence, type Block, type MarkdownNode, type TextMapping } from '../core';
import { intersects } from '../core/tree';
import { useDocumentSelector, useIsomorphicLayoutEffect, useRuntime, useStoreSelector } from './context';
import { emptyDecorations, emptyList, type BlockDecorations, type ReaderRuntime } from './runtime';
import type { TextToken, ViewConfiguration } from './types';
import { bindCompactText, compactTextNodes } from './text-binding';
import { literalValue, mapLiteral } from './literal';
import { StreamText } from './stream-text';
import { StreamSelectionBoundary } from './stream-selection';
import { StreamEntrance } from './stream-effect';
import { KnuthPlassBoundary } from './knuth-plass-boundary';
import { SourceTaskItem, TaskText } from '../components/TaskCheckbox';
import { Image } from '../components/Image';
import { MarkdownTable } from '../components/Table';
import { orderedListStyle } from './ordered-list';

interface RenderContext {
  runtime: ReaderRuntime;
  block: Block;
  marks: Map<MarkdownNode, readonly AnnotationOccurrence[]>;
  afterMarks: Map<MarkdownNode, readonly AnnotationOccurrence[]>;
  highlights: readonly PaintHighlight[];
  occurrences: readonly AnnotationOccurrence[];
  tightList?: boolean;
  compact?: boolean;
  live?: boolean;
  revealFrom: number;
  ancestors?: readonly MarkdownNode[];
  blockElement?: BlockElement;
}
interface BlockElement { id: string; range: Block['range']; pending: boolean; ref: (element: HTMLElement | null) => void }
const blockAttributes = (block?: BlockElement) => block ? { 'data-limr-block': block.id, 'data-source-start': block.range.start, 'data-source-end': block.range.end, 'data-pending': block.pending || undefined } : {};

function EmbeddedAnnotationMarkers({ id }: { id: string }) {
  const runtime = useRuntime();
  const occurrences = useStoreSelector(runtime.decorations, state => state.occurrences);
  return <>{occurrences.filter(item => item.markerId === id).map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}</>;
}

export function AnnotationMarker({ occurrence: supplied }: { occurrence: AnnotationOccurrence }) {
  const runtime = useRuntime();
  const occurrence = useStoreSelector(runtime.decorations, state => state.occurrences.find(item => item.id === supplied.id));
  const annotation = useStoreSelector(runtime.decorations, state => state.annotations.get(occurrence?.annotationIds[0] ?? ''));
  const active = useStoreSelector(runtime.interaction, state => state.active === supplied.id);
  const hovered = useStoreSelector(runtime.interaction, state => state.hovered === supplied.id);
  const definition = useStoreSelector(runtime.configuration, () => runtime.annotationTypes.get(annotation?.type ?? 'citation'));
  const Icon = definition?.icon;
  const Custom = definition?.Marker;
  const icon = typeof Icon === 'function' || Icon && typeof Icon === 'object' && !isValidElement(Icon) && '$$typeof' in Icon
    ? createElement(Icon as ComponentType) : Icon;
  if (!occurrence?.annotationIds.length || !definition) return null;
  return <span className="limr-mark-wrap" data-limr-ignore="true" data-limr-marker={occurrence.id} data-source-start={occurrence.range.start} data-source-end={occurrence.range.end}><button type="button"
    ref={element => runtime.registerAnchor(occurrence.id, element)}
    className="limr-mark" data-limr-anchor={occurrence.id} data-active={active || hovered || undefined}
    style={{ '--limr-mark-color': definition?.color } as CSSProperties}
    aria-label={definition?.label ?? annotation?.type ?? 'Annotation'} aria-expanded={active}
    onPointerEnter={event => { if (event.pointerType !== 'touch') runtime.hover(occurrence.id); }}
    onPointerLeave={event => { if (event.pointerType !== 'touch' && runtime.interaction.get().hovered === occurrence.id && runtime.interaction.get().hoverSource === 'marker') runtime.hover(null); }}
    onFocus={event => { if (event.currentTarget.matches(':focus-visible')) runtime.hover(occurrence.id); }} onBlur={event => {
      // Focus can move from a marker into its hovered sidebar card on mousedown.
      // That blur must not erase the card's hover before its click toggles it.
      if (event.relatedTarget instanceof Element && event.relatedTarget.closest('[data-occurrence]')?.getAttribute('data-occurrence') === occurrence.id) return;
      if (runtime.interaction.get().hovered === occurrence.id && runtime.interaction.get().hoverSource === 'marker') runtime.hover(null);
    }}
    onClick={() => {
      const hovering = runtime.interaction.get().hovered === occurrence.id;
      runtime.clearSelection();
      runtime.activate(active ? null : occurrence.id);
      // A click does not move the pointer. Preserve hover across both toggles.
      if (hovering) runtime.hover(occurrence.id);
    }}>
    <span className="limr-mark-icon">{Custom && annotation ? <Custom annotation={annotation} active={active} /> : icon ?? '•'}</span>
  </button></span>;
}

function Text({ node, context, mapping: literalMapping, marks: literalMarks, style, className }: { node: MarkdownNode; context: RenderContext; mapping?: TextMapping | (() => TextMapping); marks?: readonly AnnotationOccurrence[]; style?: CSSProperties; className?: string }) {
  const { runtime } = context;
  const value = node.value ?? '';
  const range = rangeOf(node);
  const source = runtime.document.getSnapshot().source;
  const mapped = useMemo(() => {
    let mapping: ReturnType<typeof mapText> | undefined;
    const raw = source.slice(range.start, range.end);
    return () => {
      if (literalMapping) return typeof literalMapping === 'function' ? literalMapping() : literalMapping;
      if (!mapping) {
        const omissions = node.sourceOmissions?.map(span => ({ start: span.start - range.start, end: span.end - range.start }));
        const relative = mapText(raw, value, { start: 0, end: raw.length }, { escapes: node.verbatimEscapes !== true, omissions });
        mapping = { starts: relative.starts.map(offset => offset + range.start), ends: relative.ends.map(offset => offset + range.start), exact: relative.exact };
      }
      return mapping;
    };
  }, [node, literalMapping]);
  const marks = literalMarks ?? context.marks.get(node) ?? emptyList;
  const highlights = context.highlights.filter(highlight => intersects(highlight.range, range));
  if (!marks.length && !highlights.length) {
    // Most text is undecorated. Build character maps only when an actual
    // selection needs decoded entity/escape positions, never during SSR.
    const direct = !literalMapping && source.slice(range.start, range.end) === value;
    return <span style={style} className={className} data-limr-text="" data-source-start={range.start} data-source-end={range.end} ref={element => {
      if (element) runtime.bindings.set(element, {
        range, atomic: false,
        get exact() { return direct || mapped().exact; },
        resolve: (offset, edge) => direct ? Math.max(range.start, Math.min(range.end, range.start + offset)) : edge === 'start' ? mapped().starts[offset] ?? range.end : mapped().ends[offset - 1] ?? range.start,
      });
    }}>{context.live ? <StreamText value={value} animateInitial={range.end > context.revealFrom} /> : value}</span>;
  }
  const mapping = mapped();
  const markerAt = new Map<number, AnnotationOccurrence[]>();
  const boundaries = new Set([0, value.length]);
  for (const mark of marks) {
    let index = mapping.starts.findIndex(start => start >= mark.range.end);
    index = index < 0 ? value.length : index;
    boundaries.add(index); markerAt.set(index, [...markerAt.get(index) ?? [], mark]);
  }
  for (const highlight of highlights) {
    const start = mapping.ends.findIndex(end => end > highlight.range.start);
    const end = mapping.starts.findIndex(start => start >= highlight.range.end);
    boundaries.add(Math.max(0, start)); boundaries.add(end < 0 ? value.length : end);
  }
  const points = [...boundaries].sort((a, b) => a - b);
  return <>{markerAt.get(0)?.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}{points.slice(1).map((end, index) => {
    const start = points[index];
    const segmentRange = { start: mapping.starts[start] ?? range.start, end: mapping.ends[end - 1] ?? range.end };
    const styles = highlights.filter(highlight => intersects(highlight.range, segmentRange));
    let text: ReactNode = context.live ? <StreamText value={value.slice(start, end)} animateInitial={segmentRange.end > context.revealFrom} /> : value.slice(start, end);
    for (const highlight of styles) text = <mark key={highlight.id} data-limr-highlight={highlight.id} data-hidden={highlight.hidden || undefined} className={`limr-highlight limr-highlight-${highlight.style ?? 'background'}`} style={{ '--limr-highlight': highlight.color ?? '#f3ce7380' } as CSSProperties}>{text}</mark>;
    return <span key={start} style={style} className={className} ref={element => {
      if (element) runtime.bindings.set(element, { range: segmentRange, atomic: false, exact: mapping.exact, resolve: (offset, edge) => {
        const at = Math.max(start, Math.min(end, start + offset));
        return edge === 'start' ? mapping.starts[at] ?? segmentRange.end : mapping.ends[at - 1] ?? segmentRange.start;
      } });
    }} data-limr-text="" data-source-start={segmentRange.start} data-source-end={segmentRange.end}>
      {text}{markerAt.get(end)?.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}
    </span>;
  })}</>;
}

function LiteralValue({ node, context, tokens }: { node: MarkdownNode; context: RenderContext; tokens?: readonly TextToken[] }) {
  const source = context.runtime.document.getSnapshot().source;
  const mapped = useMemo(() => { let value: TextMapping | undefined; return () => value ??= mapLiteral(source, node); }, [node]);
  const value = literalValue(node);
  const marks = context.marks.get(node) ?? emptyList;
  if (!tokens?.length) return <Text key={0} node={{ ...node, type: 'text', value }} context={context} mapping={mapped} marks={marks} />;
  const mapping = mapped();
  const segments = tokens?.length ? tokens : [{ content: value, offset: 0 }];
  const markerOffsets = marks.map(mark => {
    const offset = mapping.starts.findIndex(start => start >= mark.range.end);
    return { mark, offset: offset < 0 ? value.length : offset };
  });
  return <>{segments.map((token, index) => {
    const start = token.offset, end = start + token.content.length;
    const mapped = { starts: mapping.starts.slice(start, end), ends: mapping.ends.slice(start, end), exact: mapping.exact };
    const range = { start: mapped.starts[0] ?? rangeOf(node).start, end: mapped.ends.at(-1) ?? rangeOf(node).end };
    const leaf: MarkdownNode = { type: 'text', value: token.content, position: { start: { offset: range.start, line: 0, column: 0 }, end: { offset: range.end, line: 0, column: 0 } } };
    return <Text key={index} className={token.style ? 'limr-code-token' : undefined} style={token.style} node={leaf} context={context} mapping={mapped} marks={markerOffsets.filter(item => (item.offset > start || start === 0 && item.offset === 0) && item.offset <= end).map(item => item.mark)} />;
  })}</>;
}

function Atomic({ node, context, children, inline, blockElement }: { node: MarkdownNode; context: RenderContext; children: ReactNode; inline: boolean; blockElement?: BlockElement }) {
  const range = rangeOf(node);
  const selected = useStoreSelector(context.runtime.interaction, state => state.selection?.raw.ranges.some(selection => intersects(selection, range)) ?? false);
  const highlights = context.highlights.filter(highlight => !highlight.hidden && intersects(highlight.range, range));
  const Tag = inline ? 'span' : 'div';
  const image = ['image', 'imageReference'].includes(node.type) || node.type === 'component' && node.name === 'img';
  const corner = image || !inline;
  const marks = [...context.marks.get(node) ?? [], ...corner ? context.afterMarks.get(node) ?? [] : []];
  const markers = marks.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />);
  return <><Tag {...blockAttributes(blockElement)} className={`limr-atomic${image ? ' limr-atomic-image' : ''}${corner ? ' limr-atomic-corner' : ''}${highlights.length ? ' limr-atomic-highlight' : ''}`} data-selected={selected || undefined}
    data-limr-media={image ? 'image' : undefined}
    data-limr-atomic={inline ? 'inline' : 'block'} data-source-start={range.start} data-source-end={range.end}
    style={{ '--limr-highlight': highlights[0]?.color ?? '#f3ce7380' } as CSSProperties}
    ref={element => { if (element) context.runtime.bindings.set(element, { range, atomic: true }); blockElement?.ref(element); }}>
    {children}
    {corner && !!marks.length && <span className="limr-corner-marks" data-limr-ignore="true">{markers}</span>}
  </Tag>{!corner && markers}</>;
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
  return image ? <Image src={safeUrl(definition.url, true)} alt={String(node.alt ?? '')} title={definition.title ? String(definition.title) : undefined} /> : <a href={safeUrl(definition.url)} title={definition.title ? String(definition.title) : undefined}>{children}</a>;
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

function lastVisibleChild(nodes: readonly MarkdownNode[]): number {
  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index];
    if (!['definition', 'footnoteDefinition', 'annotationDefinition', 'streamPending'].includes(node.type)
      && !(node.type === 'text' && !node.value?.trim())) return index;
  }
  return -1;
}

function renderNode(node: MarkdownNode, context: RenderContext, index = 0, trailing?: ReactNode): ReactNode {
  const { runtime } = context;
  if (node.type === 'text' && context.compact) {
    const text = context.live ? <StreamText key={`text-${node.position?.start.offset ?? index}`} value={node.value ?? ''} animateInitial={rangeOf(node).end > context.revealFrom} /> : node.value ?? '';
    return trailing ? <Fragment key={`text-${node.position?.start.offset ?? index}`}>{text}{trailing}</Fragment> : text;
  }
  if (node.type === 'streamPending') return null;
  const blockElement = node === context.block.node ? context.blockElement : undefined;
  const key = `${node.type}-${node.position?.start.offset ?? index}-${index}`;
  let childContext = node.type === 'list' ? { ...context, tightList: !node.spread } : context;
  if (runtime.rendererOverrides.size) childContext = { ...childContext, ancestors: [...context.ancestors ?? [], node] };
  const renderChildren = (nodes: readonly MarkdownNode[], options?: { trailing?: ReactNode }) => {
    const last = lastVisibleChild(nodes);
    if (last < 0 && options?.trailing) return [<Fragment key="trailing">{options.trailing}</Fragment>];
    return nodes.map((child, i) => renderNode(child, childContext, i, i === last ? options?.trailing : undefined));
  };
  const componentName = node.type === 'component' ? node.name ?? '' : node.type;
  const rules = runtime.rendererOverrides.get(componentName);
  const override = rules?.slice().reverse().find(rule => !rule.when || rule.when(node, { pending: context.block.pending, incomplete: !!node.incomplete, ancestors: context.ancestors ?? [] }));
  const owner = node.incomplete && !override ? runtime.configuration.get().extensions?.slice().reverse().find(extension => extension.components?.[componentName]) : undefined;
  const Renderer = override?.component ?? (node.incomplete && owner?.streaming?.Loading || runtime.components[componentName]);
  // A trailing action belongs to the last flow inside a structural container,
  // not a sibling after the entire list/quote. Inline formatting and arbitrary
  // extension renderers retain their existing outside-marker behavior.
  const nestedTrailing = !Renderer && (['list', 'listItem', 'blockquote'].includes(node.type) || node.type === 'paragraph' && containsBlock(node)) ? trailing : undefined;
  if (nestedTrailing) trailing = undefined;
  const lastChild = nestedTrailing ? lastVisibleChild(node.children ?? []) : -1;
  const children = node.type === 'table' ? [] : node.type === 'listItem'
    ? (node.children ?? []).flatMap((child, index) => {
      const tail = index === lastChild ? nestedTrailing : undefined;
      const taskParagraph = !Renderer && typeof node.checked === 'boolean' && child.type === 'paragraph' && !containsBlock(child);
      const tightParagraph = child.type === 'paragraph' && context.tightList;
      const rendered = tightParagraph ? renderChildren(child.children ?? []) : renderNode(child, childContext, index, taskParagraph ? undefined : tail);
      // Keep paragraph/list structure and text bindings intact. The inline
      // wrapper shares the question option's per-line underline animation.
      if (taskParagraph) {
        if (context.tightList) return <Fragment key={`task-text-${index}`}><TaskText>{rendered}</TaskText>{tail}</Fragment>;
        if (isValidElement<{ children?: ReactNode }>(rendered) && rendered.type === 'p') return cloneElement(rendered, {}, <TaskText>{rendered.props.children}</TaskText>, tail);
      }
      return tightParagraph && tail ? <Fragment key={`list-text-${index}`}>{rendered}{tail}</Fragment> : rendered;
    }) : renderChildren(node.children ?? [], { trailing: nestedTrailing });
  let element: ReactNode;
  if (Renderer) {
    const range = rangeOf(node);
    const renderAttribute = (name: string) => {
      const attribute = node.attributeNodes?.[name];
      if (!attribute) return String(node.attributes?.[name] ?? '');
      const range = rangeOf(attribute);
      return <Text node={attribute} context={context} marks={context.occurrences.filter(item => item.range.end > range.start && item.range.end <= range.end)} />;
    };
    element = <ExtensionBoundary key={key} fallback={runtime.document.getSnapshot().source.slice(range.start, range.end)}><Renderer node={node} children={children} pending={context.block.pending} incomplete={!!node.incomplete} source={runtime.document.getSnapshot().source.slice(range.start, range.end)} renderChildren={renderChildren} renderValue={tokens => <LiteralValue node={node} context={context} tokens={tokens} />} renderAttribute={renderAttribute} /></ExtensionBoundary>;
  } else {
    switch (node.type) {
      case 'text': return <Fragment key={key}>{context.compact ? node.value ?? '' : <Text node={node} context={context} />}{trailing}</Fragment>;
      case 'paragraph': element = containsBlock(node) ? <div className="limr-paragraph">{children}{trailing}</div> : <p>{children}{trailing}</p>; trailing = undefined; break;
      case 'heading': return <HeadingNode key={key} node={node} runtime={runtime} blockElement={blockElement}>{children}{trailing}</HeadingNode>;
      case 'strong': element = <strong>{children}</strong>; break;
      case 'emphasis': element = <em>{children}</em>; break;
      case 'delete': element = <del>{children}</del>; break;
      case 'inlineCode': element = <code className="limr-inline-code" data-limr-inline-syntax="" data-source-start={rangeOf(node).start} data-source-end={rangeOf(node).end}>{context.compact
        ? context.live ? <StreamText value={literalValue(node)} animateInitial={rangeOf(node).end > context.revealFrom} /> : literalValue(node)
        : <LiteralValue node={node} context={context} />}</code>; break;
      case 'code': element = <pre><code><LiteralValue node={node} context={context} /></code></pre>; break;
      case 'math': case 'inlineMath': element = <code>{node.value}</code>; break;
      case 'blockquote': element = <blockquote className="limr-note"><div className="limr-card-label" data-limr-ignore="true">{runtime.locale.note}</div><div className="limr-block-content">{children}</div></blockquote>; break;
      case 'list': element = node.ordered ? <ol start={Number(node.start ?? 1)} style={orderedListStyle(Number(node.start ?? 1), node.children?.length ?? 0)}>{children}</ol> : <ul>{children}</ul>; break;
      case 'listItem': element = typeof node.checked === 'boolean' ? <SourceTaskItem node={node} source={runtime.document.getSnapshot().source.slice(rangeOf(node).start, rangeOf(node).end)}>{children}</SourceTaskItem> : <li>{children}</li>; break;
      case 'link': element = <a href={safeUrl(node.url)} title={node.title ? String(node.title) : undefined}>{children}</a>; break;
      case 'image': element = <Image src={safeUrl(node.url, true)} alt={String(node.alt ?? '')} title={node.title ? String(node.title) : undefined} />; break;
      case 'linkReference': element = <Reference node={node} image={false}>{children}</Reference>; break;
      case 'imageReference': element = <Reference node={node} image>{children}</Reference>; break;
      case 'thematicBreak': element = <hr />; break;
      case 'break': element = <br data-limr-break="" data-source-start={rangeOf(node).start} data-source-end={rangeOf(node).end} />; break;
      case 'table': {
        element = <MarkdownTable node={node} renderChildren={renderChildren} />; break;
      }
      case 'definition': case 'footnoteDefinition': case 'annotationDefinition': return null;
      case 'footnoteReference': return <Fragment key={key}><FootnoteReference node={node} />{trailing}</Fragment>;
      case 'annotationReference': {
        const Tag = node.inline ? 'span' : 'div';
        element = <Tag>{children}<EmbeddedAnnotationMarkers id={`${runtime.document.id}-ref-${rangeOf(node).start}`} /></Tag>; break;
      }
      case 'html': element = <span className="limr-literal">{node.value}</span>; break;
      case 'component': element = children; break;
      default: element = children.length ? children : node.value ?? null;
    }
  }
  const atomic = node.selection === 'atomic' || ['math', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type);
  const corner = atomic && (!node.inline && !['inlineCode', 'inlineMath', 'html'].includes(node.type) || ['image', 'imageReference'].includes(node.type) || node.name === 'img');
  const after = corner ? undefined : context.afterMarks.get(node);
  const withMarkers = (element: ReactNode) => {
    const result = after?.length || trailing ? <Fragment key={key}>{element}{after?.map(occurrence => <AnnotationMarker key={occurrence.id} occurrence={occurrence} />)}{trailing}</Fragment> : element;
    return context.live && !node.inline && (node.type === 'component' || ['code', 'math', 'mermaid', 'callout', 'blockquote', 'table'].includes(node.type))
      ? <StreamEntrance key={key} state={node.type === 'component' ? !!node.incomplete : true}>{result}</StreamEntrance> : result;
  };
  if (atomic) return withMarkers(<Atomic key={key} node={node} context={context} blockElement={blockElement} inline={node.inline || ['inlineCode', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type)}>{element}</Atomic>);
  if (blockElement) {
    const attributes = { ...blockAttributes(blockElement), ref: blockElement.ref };
    // Ordinary blocks carry their own metadata; only arbitrary custom renderers
    // need an outer host element to participate in layout and selection.
    return withMarkers(isValidElement(element) && typeof element.type === 'string'
      ? cloneElement(element as ReactElement<Record<string, unknown>>, { ...attributes, key })
      : <div key={key} {...attributes}>{element}</div>);
  }
  return withMarkers(isValidElement(element) ? cloneElement(element, { key }) : <Fragment key={key}>{element}</Fragment>);
}

export const BlockView = memo(function BlockView({ block, runtime, components, extensions, rendererOverrides, decorations, footnoteId }: { block: Block; runtime: ReaderRuntime; decorations: BlockDecorations; footnoteId?: string } & Pick<ViewConfiguration, 'components' | 'extensions' | 'rendererOverrides'>) {
  const streamed = useRef(runtime.document.getSnapshot().streaming);
  if (block.pending) streamed.current = true;
  const revealed = useRef(block.range.start);
  const revealFrom = revealed.current;
  useIsomorphicLayoutEffect(() => { revealed.current = Math.max(revealed.current, block.range.end); }, [block.range.end]);
  const element = useRef<HTMLElement | null>(null);
  const getElement = useCallback(() => element.current, []);
  const typography = useStoreSelector(runtime.configuration, config => config.typography);
  const knuthPlass = useStoreSelector(runtime.configuration, config => config.knuthPlass);
  const clearBindings = useRef<(() => void) | undefined>(undefined);
  const { occurrences } = decorations;
  // Transient reference paint belongs to the shared paint layer. It must not
  // split text, add editable <mark> elements, or appear in SSR/print output.
  const highlights = useMemo(() => decorations.highlights.filter(highlight => !highlight.occurrenceId), [decorations.highlights]);
  const root = useMemo(() => footnoteId ? { ...block.node, type: 'listItem' } : block.node, [block, footnoteId]);
  const texts = useMemo(() => compactTextNodes(root, runtime.components, runtime.rendererOverrides), [root, runtime, components, extensions, rendererOverrides]);
  const compact = typography !== 'knuth-plass' && !!texts && !occurrences.length && !highlights.length;
  const observe = useCallback((next: HTMLElement | null) => {
    clearBindings.current?.(); clearBindings.current = undefined;
    if (element.current) runtime.textBinders.delete(element.current);
    if (element.current && element.current !== next) runtime.unobserveBlock(element.current);
    element.current = next;
    runtime.observeBlock(next);
    if (next && compact && texts!.length) runtime.textBinders.set(next, () => { clearBindings.current = bindCompactText(next, texts!, runtime); });
  }, [runtime, compact, texts]);
  const { marks, afterMarks } = useMemo(() => {
    const map = new Map<MarkdownNode, AnnotationOccurrence[]>();
    const after = new Map<MarkdownNode, AnnotationOccurrence[]>();
    if (!occurrences.length) return { marks: map, afterMarks: after };
    const leaves: MarkdownNode[] = [];
    const attributes: MarkdownNode[] = [];
    const paths = new Map<MarkdownNode, readonly MarkdownNode[]>();
    const outside = new Set(['strong', 'emphasis', 'delete', 'link', 'linkReference', 'inlineCode', 'code', 'math', 'inlineMath', 'image', 'imageReference', 'html']);
    function collect(node: MarkdownNode, ancestors: readonly MarkdownNode[] = []) {
      if (node.attributeNodes) attributes.push(...Object.values(node.attributeNodes));
      const path = [...ancestors, node];
      if (node.selection === 'atomic' || ['text', 'inlineCode', 'code', 'math', 'inlineMath', 'image', 'imageReference', 'html'].includes(node.type)) { leaves.push(node); paths.set(node, path); }
      else node.children?.forEach(child => collect(child, path));
    }
    collect(block.node);
    for (const occurrence of occurrences) {
      const target = [...leaves].reverse().find(node => rangeOf(node).start < occurrence.range.end) ?? leaves[0];
      // An attribute can supply an atomic image, or text rendered separately as
      // its caption. Only the latter is handled by renderAttribute's Text node.
      const image = target && (['image', 'imageReference'].includes(target.type) || target.name === 'img') && rangeOf(target).end >= occurrence.range.end;
      if (!image && attributes.some(attribute => { const range = rangeOf(attribute); return occurrence.range.end > range.start && occurrence.range.end <= range.end; })) continue;
      if (target) {
        // An absorbed closing delimiter places the marker after its outermost
        // completed format. A partial code selection keeps its exact inner end.
        const outer = paths.get(target)?.find(node => (outside.has(node.type) || node.selection === 'atomic') && rangeOf(node).end <= occurrence.range.end);
        const destination = outer ? after : map, node = outer ?? target;
        destination.set(node, [...destination.get(node) ?? [], occurrence]);
      }
    }
    return { marks: map, afterMarks: after };
  }, [block, occurrences]);
  if (!footnoteId && ['definition', 'footnoteDefinition', 'annotationDefinition'].includes(block.node.type)) return null;
  const context: RenderContext = { runtime, block, marks, afterMarks, highlights, occurrences, compact, live: streamed.current, revealFrom, blockElement: { id: block.id, range: block.range, pending: block.pending, ref: observe } };
  const content = footnoteId ? <li id={`${runtime.document.id}-fn-${encodeURIComponent(footnoteId)}`} {...blockAttributes(context.blockElement)} ref={observe}>{block.node.children?.map((child, index) => renderNode(child, { ...context, blockElement: undefined }, index))}</li> : renderNode(block.node, context);
  return <StreamSelectionBoundary element={getElement} enabled={streamed.current}><KnuthPlassBoundary element={getElement} runtime={runtime} enabled={typography === 'knuth-plass'} pending={block.pending} options={knuthPlass}>{content}</KnuthPlassBoundary></StreamSelectionBoundary>;
});

export function Footnotes() {
  const runtime = useRuntime();
  const doc = useDocumentSelector(snapshot => snapshot);
  const components = useStoreSelector(runtime.configuration, config => config.components);
  const extensions = useStoreSelector(runtime.configuration, config => config.extensions);
  const rendererOverrides = useStoreSelector(runtime.configuration, config => config.rendererOverrides);
  const decorations = useStoreSelector(runtime.decorations, state => state.byBlock);
  const blocks = useMemo(() => new Map(doc.blocks.filter(block => block.node.type === 'footnoteDefinition').map(block => [String(block.node.identifier), block])), [doc.blocks]);
  if (!doc.footnoteOrder.length) return null;
  return <section className="limr-footnotes" aria-label={runtime.locale.footnotes}><hr /><ol style={orderedListStyle(1, doc.footnoteOrder.length)}>{doc.footnoteOrder.map(id => {
    const node = doc.footnotes.get(id);
    if (!node) return null;
    const block: Block = blocks.get(id) ?? { id: `${doc.id}-fn-${id}`, range: rangeOf(node), node, pending: false };
    return <BlockView key={id} block={block} runtime={runtime} components={components} extensions={extensions} rendererOverrides={rendererOverrides} footnoteId={id} decorations={decorations.get(block.id) ?? emptyDecorations} />;
  })}</ol></section>;
}
