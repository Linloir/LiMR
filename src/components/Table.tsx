import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { AnnotationOccurrence, MarkdownNode } from '../core';
import { layoutTable, type TableLayoutAlgorithm, type TableLayoutOptions, type TableLayoutPlan } from '../core/table-layout';
import { measureTable, tableCellOverflowsHorizontally, tableFontKey, type TableMeasurement } from '../react/table-measure';
import { observeInlineMath, refreshInlineMath } from '../extensions/inline-math-overflow';
import { useIsomorphicLayoutEffect, useLocale, useOwnedNodeState, useRendererParameter, useRuntime } from '../react/context';
import { AnnotationMarker } from '../react/render';
import type { AnnotationContentProps, AnnotationSidebarPreviewProps, AnnotationType } from '../react/types';
import type { ViewAnnotation } from '../react/runtime';
import { InlineMarker } from './InlineMarker';
import { ToolIcon } from './ToolIcon';
import { ImagePreview, imagePreviewLabels, type ImagePreviewSource } from './ImagePreview';
import { canActivateImage, loadedImageSource } from './image-preview-behavior';
import { type NodeStateOwner } from '../react/node-state-handoff';
import { tableStateIdentity } from '../react/module-state-identity';
import { cellContentLease, sameCellContent, claimTableViews, recordTableViews, forgetTableViews, type CellPreview } from './table-view-handoff';

const tableStateOwner: NodeStateOwner = { name: 'tableStateOwner', nativeTypes: ['table'], keys: { 'table-expanded-cells': value => value instanceof Set && [...value].every(item => typeof item === 'string' && /^\d+:\d+$/.test(item)) }, signature: tableStateIdentity };

/** Adapter configuration; omitted options preserve the built-in measured layout. */
export interface TableLayoutConfig extends TableLayoutOptions {
  /** Replace only the planner; measurement, caching and overflow UI are reused.
   * Keep the function/configuration stable; replace them to invalidate layout. */
  algorithm?: TableLayoutAlgorithm;
}
declare module '@linloir/limr' {
  interface RendererParameters { tableLayout?: false | TableLayoutConfig }
}
export interface MarkdownTableProps {
  node: MarkdownNode;
  renderChildren: (nodes: readonly MarkdownNode[]) => ReactNode;
  /** Overrides the reader/plugin parameter. false uses native browser layout. */
  options?: false | TableLayoutConfig;
}
const sameFlags = (left: boolean[][], right: boolean[][]) => left.length === right.length && left.every((row, i) => row.length === right[i]?.length && row.every((value, j) => value === right[i][j]));
function MoreIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="3.5" width="16" height="17" rx="3" /><path d="M8 8h8M8 12h5" /><circle cx="8" cy="16" r=".65" /><circle cx="12" cy="16" r=".65" /><circle cx="16" cy="16" r=".65" /></svg>; }

/** Full rich content remains in its original source-bound DOM. The preview is
 * a read-only visual clone: it never registers duplicate annotation anchors or
 * source bindings. Expanding reveals the original interactive cell in place. */
function TableCellContent({ data }: AnnotationContentProps<CellPreview>) {
  const [host, setHost] = useState<HTMLDivElement | null>(null), locale = useLocale();
  const chinese = locale.language?.startsWith('zh') ?? false;
  const [copied, setCopied] = useState<'copied' | 'failed' | null>(null);
  const [preview, setPreview] = useState<ImagePreviewSource | null>(null);
  const openLabel = imagePreviewLabels(locale).open;
  const previousLabel = useRef(openLabel);
  useIsomorphicLayoutEffect(() => {
    for (const image of host?.querySelectorAll<HTMLImageElement>('img[data-limr-image-preview="true"]') ?? []) {
      if (image.getAttribute('aria-label') === `${previousLabel.current}${image.alt ? `: ${image.alt}` : ''}`) image.setAttribute('aria-label', `${openLabel}${image.alt ? `: ${image.alt}` : ''}`);
    }
    previousLabel.current = openLabel;
  }, [host, openLabel]);
  useIsomorphicLayoutEffect(() => {
    const original = data?.content.original, target = host;
    setPreview(null);
    if (!original || !target) return;
    const clone = original.cloneNode(true) as HTMLElement;
    const sourceImages = [...original.querySelectorAll('img')], clonedImages = [...clone.querySelectorAll('img')];
    clone.querySelectorAll('[data-limr-ignore],.limr-highlight-layer,.limr-paint-layer,button,input,textarea,select').forEach(node => node.remove());
    for (const node of [clone, ...clone.querySelectorAll<HTMLElement>('*')]) {
      for (const attribute of [...node.attributes]) if (attribute.name === 'id' || attribute.name.startsWith('data-source') || ['data-limr-block', 'data-limr-document', 'data-limr-anchor', 'data-limr-marker', 'data-limr-keep-alive'].includes(attribute.name)) node.removeAttribute(attribute.name);
      if (node.hasAttribute('data-table-clipped-control')) { node.removeAttribute('inert'); node.removeAttribute('data-table-clipped-control'); }
    }
    clone.className = 'limr-table-full-content';
    clone.style.maxHeight = 'none'; clone.style.maxWidth = 'none'; clone.style.overflow = 'visible';
    const css = getComputedStyle(original);
    target.style.font = css.font; target.style.lineHeight = css.lineHeight;
    target.replaceChildren(clone);
    const mathCleanups = [...clone.querySelectorAll<HTMLElement>('.limr-math-inline')].map(formula => observeInlineMath(formula, false));
    const images = new Map(sourceImages.flatMap((source, index) => target.contains(clonedImages[index]) ? [[source, clonedImages[index]] as const] : []));
    const refresh = (image: HTMLImageElement) => {
      // The source component declares permission independently of readiness.
      // A lazy clone can finish loading after its annotation was opened.
      if (image.dataset.limrImagePreview !== 'true') return;
      const ready = !!loadedImageSource(image);
      image.classList.toggle('limr-previewable-image', ready);
      if (ready) {
        image.setAttribute('role', 'button'); image.tabIndex = 0; image.setAttribute('aria-haspopup', 'dialog');
        if (!image.getAttribute('aria-label')) image.setAttribute('aria-label', `${previousLabel.current}${image.alt ? `: ${image.alt}` : ''}`);
      } else {
        image.removeAttribute('role'); image.removeAttribute('tabindex'); image.removeAttribute('aria-haspopup');
      }
    };
    const resource = (event: Event) => {
      if (!(event.target instanceof HTMLImageElement)) return;
      refresh(event.target);
      if (event.type === 'error') setPreview(current => current?.element === event.target ? null : current);
    };
    const activate = (event: MouseEvent | KeyboardEvent) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || image.dataset.limrImagePreview !== 'true' || !canActivateImage(event, image)) return;
      const source = loadedImageSource(image); if (!source) return;
      event.preventDefault(); event.stopPropagation(); setPreview(source);
    };
    images.forEach(refresh);
    target.addEventListener('load', resource, true); target.addEventListener('error', resource, true);
    target.addEventListener('click', activate); target.addEventListener('keydown', activate);
    // Resource adapters may resolve the original image after the card opened.
    // Observe only those resources, without copying source/selection bindings.
    const resources = new MutationObserver(records => {
      for (const record of records) {
        const source = record.target as HTMLImageElement, image = images.get(source), name = record.attributeName!;
        if (!image) continue;
        const value = source.getAttribute(name);
        if (value === null) image.removeAttribute(name); else image.setAttribute(name, value);
        if (name === 'data-limr-image-preview' && value !== 'true') {
          image.classList.remove('limr-previewable-image');
          for (const attribute of ['role', 'tabindex', 'aria-haspopup', 'aria-label']) {
            const originalValue = source.getAttribute(attribute);
            if (originalValue === null) image.removeAttribute(attribute); else image.setAttribute(attribute, originalValue);
          }
          setPreview(current => current?.element === image ? null : current);
        }
        refresh(image);
      }
    });
    images.forEach((_, image) => resources.observe(image, { attributes: true, attributeFilter: ['src', 'srcset', 'sizes', 'data-limr-image-preview'] }));
    return () => {
      mathCleanups.forEach(cleanup => cleanup?.());
      resources.disconnect(); target.removeEventListener('load', resource, true); target.removeEventListener('error', resource, true);
      target.removeEventListener('click', activate); target.removeEventListener('keydown', activate); target.replaceChildren();
    };
  }, [data?.content, host]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(data?.source ?? ''); setCopied('copied'); } catch { setCopied('failed'); }
  };
  return <><div ref={setHost} className="limr-table-annotation-content limr-prose" />
    {preview && <ImagePreview image={preview} onClose={() => setPreview(null)} />}
    <div className="limr-annotation-actions">
      <button type="button" onClick={copy}><ToolIcon name={copied === 'copied' ? 'check' : 'copy'} /><span className="limr-underline">{copied === 'copied' ? locale.copied : copied === 'failed' ? locale.copyFailed : chinese ? '复制 Markdown' : 'Copy Markdown'}</span></button>
      <button type="button" onClick={data?.expand}><ToolIcon name="expand" /><span className="limr-underline">{chinese ? '在表格中展开' : 'Expand in table'}</span></button>
    </div>
  </>;
}
function TableCellSummary({ data }: AnnotationSidebarPreviewProps<CellPreview>) { return <>{data?.summary}</>; }
const tableCellType: AnnotationType<CellPreview> = {
  type: 'table-cell-overflow', label: locale => locale.language?.startsWith('zh') ? '单元格完整内容' : 'Full cell content',
  icon: MoreIcon, color: '#8a7865', Content: TableCellContent,
  sidebar: { Preview: TableCellSummary, collapseOnContentClick: false },
  overlay: { previewWidth: 420, expand: { placement: 'anchor', width: 640, maxHeight: '80dvh' } },
};

export function MarkdownTable({ node, renderChildren, options }: MarkdownTableProps) {
  const configured = useRendererParameter('tableLayout');
  const settings = options ?? configured;
  return settings === false
    ? <NativeMarkdownTable node={node} renderChildren={renderChildren} />
    : <MeasuredMarkdownTable node={node} renderChildren={renderChildren} options={settings} />;
}

/** No measurement hooks, observers, fixed tracks or derived overflow annotations.
 * Switching modes unmounts the measured adapter and releases its registrations. */
function NativeMarkdownTable({ node, renderChildren }: MarkdownTableProps) {
  const locale = useLocale(), rows = node.children ?? [], alignment = node.align as (string | null)[] | undefined;
  const renderRow = (row: MarkdownNode, rowIndex: number) => <tr key={row.position?.start.offset ?? rowIndex}>{row.children?.map((cell, column) => {
    const Tag = rowIndex === 0 ? 'th' : 'td';
    return <Tag key={cell.position?.start.offset ?? column} scope={rowIndex === 0 ? 'col' : undefined} style={{ textAlign: alignment?.[column] as CSSProperties['textAlign'] }}>{renderChildren(cell.children ?? [])}</Tag>;
  })}</tr>;
  return <div className="limr-table-scroll" data-table-layout="native" tabIndex={0} role="region" aria-label={locale.language?.startsWith('zh') ? '横向滚动表格' : 'Scrollable table'}>
    <table><thead>{rows.slice(0, 1).map(row => renderRow(row, 0))}</thead><tbody>{rows.slice(1).map((row, i) => renderRow(row, i + 1))}</tbody></table>
  </div>;
}

function MeasuredMarkdownTable({ node, renderChildren, options: settings }: Omit<MarkdownTableProps, 'options'> & { options?: TableLayoutConfig }) {
  const algorithm = settings?.algorithm ?? layoutTable;
  const runtime = useRuntime(), locale = useLocale();
  const root = useRef<HTMLDivElement>(null), table = useRef<HTMLTableElement>(null), measured = useRef<TableMeasurement | undefined>(undefined);
  const overflowMarker = useRef<HTMLButtonElement>(null);
  const controlCells = useRef<{ cell: HTMLTableCellElement; content: HTMLElement; window: HTMLElement; cut: boolean }[]>([]);
  const managedCells = useRef(new Set<HTMLTableCellElement>());
  const [plan, setPlan] = useState<TableLayoutPlan>();
  const [clipping, setClipping] = useState<{ plan?: TableLayoutPlan; flags: boolean[][] }>({ flags: [] });
  // A resized plan starts from intrinsic predictions, so a suffix from the
  // preceding narrow layout cannot perpetuate its own unnecessary truncation.
  const clipped = clipping.plan === plan ? clipping.flags : plan?.clipped ?? [];
  const [expanded, setExpanded] = useOwnedNodeState<ReadonlySet<string>>(tableStateOwner, node, 'table-expanded-cells', () => new Set());
  const previousNode = useRef({ node, runtime });
  const owner = useRef({});
  const registered = useRef<readonly ViewAnnotation[]>([]);
  const registeredRuntime = useRef(runtime);
  const id = useId(), rows = node.children ?? [], alignment = node.align as (string | null)[] | undefined;
  const occurrenceFor = (cell: MarkdownNode, row: number, column: number): AnnotationOccurrence => {
    const key = `table-cell-${id}-${row}-${column}`, range = { start: cell.position?.start.offset ?? 0, end: cell.position?.end.offset ?? 0 };
    return { id: key, range, referenceRange: range, annotationIds: [key], embedded: true };
  };
  useEffect(() => {
    const previous = previousNode.current; previousNode.current = { node, runtime };
    // A new runtime already initialized or imported the approved store. Keep
    // ordinary same-engine source edits' existing reset behavior.
    if (previous.node !== node && previous.runtime === runtime) setExpanded(new Set());
  }, [node, runtime, setExpanded]);
  useEffect(() => { const current = owner.current; return () => { forgetTableViews(runtime, current); runtime.setViewAnnotations(current, []); }; }, [runtime]);
  useIsomorphicLayoutEffect(() => {
    const host = root.current, target = table.current; if (!host || !target) return;
    let layoutOptions: TableLayoutOptions | undefined = settings;
    if (settings?.algorithm) {
      const { algorithm: _algorithm, ...options } = settings;
      layoutOptions = options;
    }
    let frame = 0, visible = typeof IntersectionObserver === 'undefined', disposed = false, lastWidth = -1;
    measured.current = undefined;
    const cache = new Map<string, TableLayoutPlan>();
    const update = () => {
      frame = 0;
      if (disposed || !visible || host.closest('[inert]')) return;
      const availableWidth = host.clientWidth;
      if (availableWidth < 1) return;
      const fontKey = tableFontKey(target, overflowMarker.current);
      if (measured.current?.fontKey !== fontKey) { measured.current = undefined; cache.clear(); }
      if (availableWidth === lastWidth && measured.current) return;
      const measurement = measured.current ??= measureTable(target, overflowMarker.current);
      lastWidth = availableWidth;
      const key = String(Math.round(availableWidth));
      let next = cache.get(key);
      if (!next) {
        next = algorithm({ rows: measurement.rows, availableWidth, options: { fontSize: measurement.fontSize, cellPadding: measurement.padding, ...layoutOptions } });
        if (cache.size > 8) cache.delete(cache.keys().next().value!);
        cache.set(key, next);
      }
      setPlan(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const invalidate = () => { measured.current = undefined; cache.clear(); lastWidth = -1; schedule(); };
    const resize = new ResizeObserver(schedule); resize.observe(host);
    if (overflowMarker.current) resize.observe(overflowMarker.current);
    const visibility = new MutationObserver(schedule);
    // Translation/collapse panels can reveal an already sized table without
    // changing its own width. Observe only visibility attributes on ancestors.
    for (let parent = host.parentElement; parent; parent = parent.parentElement) {
      visibility.observe(parent, { attributes: true, attributeFilter: ['inert', 'hidden'] });
      if (parent === runtime.content) break;
    }
    const intersection = typeof IntersectionObserver === 'undefined' ? undefined : new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting); if (visible) schedule();
    }, { root: runtime.configuration.get().scrollRoot, rootMargin: '500px' });
    intersection?.observe(host);
    const mutations = new MutationObserver(records => {
      if (records.some(record => {
        const element = record.target instanceof Element ? record.target : record.target.parentElement;
        // Our clipping controls also use inert; they do not change intrinsic
        // content. Collapsed rich content, however, changes when revealed.
        if (record.type === 'attributes' && record.attributeName === 'inert' && !element?.matches('.limr-collapse')) return false;
        return element?.closest('.limr-table-cell-content') && !element.closest('[data-limr-ignore],.limr-highlight-layer,.limr-paint-layer') &&
          !(record.type === 'childList' && [...record.addedNodes, ...record.removedNodes].every(node => node instanceof Element && node.matches('.limr-highlight-layer,.limr-paint-layer')));
      })) invalidate();
    });
    mutations.observe(target, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'aria-hidden', 'inert', 'open'] });
    target.addEventListener('load', invalidate, true);
    const fonts = target.ownerDocument.fonts;
    fonts?.addEventListener('loading', invalidate);
    fonts?.addEventListener('loadingdone', invalidate);
    fonts?.addEventListener('loadingerror', invalidate);
    schedule();
    return () => { disposed = true; cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); intersection?.disconnect(); mutations.disconnect(); target.removeEventListener('load', invalidate, true); fonts?.removeEventListener('loading', invalidate); fonts?.removeEventListener('loadingdone', invalidate); fonts?.removeEventListener('loadingerror', invalidate); };
  }, [node, runtime, settings, algorithm]);
  useIsomorphicLayoutEffect(() => {
    const element = table.current; if (!element || !plan) return;
    const flags: boolean[][] = [];
    controlCells.current = [];
    // One batched write/read phase evaluates full cell width independently of
    // an existing suffix. Its emergency-wrap rule is identical after commit.
    element.setAttribute('data-table-measuring', '');
    try {
      refreshInlineMath(element);
      for (const [rowIndex, row] of [...element.rows].entries()) {
        flags.push([...row.cells].map((cell, column) => {
          const content = cell.querySelector<HTMLElement>('.limr-table-cell-content')!, window = cell.querySelector<HTMLElement>('.limr-table-cell-window')!;
          // Scroll extents include formula/italic ink outside the line box.
          // Only an actually shortened content box is vertically truncated.
          const cut = !expanded.has(`${rowIndex}:${column}`) && (content.getBoundingClientRect().height > window.getBoundingClientRect().height + 1 || tableCellOverflowsHorizontally(content));
          if (cut || managedCells.current.has(cell)) controlCells.current.push({ cell, content, window, cut });
          return cut;
        }));
      }
    } finally { element.removeAttribute('data-table-measuring'); }
    setClipping(old => {
      const unchanged = sameFlags(old.flags, flags);
      return old.plan === plan && unchanged ? old : { plan, flags: unchanged ? old.flags : flags };
    });
  }, [plan, expanded]);
  useIsomorphicLayoutEffect(() => {
    if (clipping.plan !== plan) return;
    if (table.current) refreshInlineMath(table.current);
    const controls: { node: HTMLElement; hidden: boolean }[] = [];
    // Only confirmed clipped cells and controls previously hidden by this
    // table need final geometry. Do not rescan the whole table after commit.
    const nextManaged = new Set<HTMLTableCellElement>();
    for (const { cell, content, window, cut } of controlCells.current) {
      if (!table.current?.contains(cell)) continue;
      const bounds = window.getBoundingClientRect(), right = Math.min(bounds.right, content.getBoundingClientRect().right);
      for (const node of content.querySelectorAll<HTMLElement>('a,button,input,select,[tabindex]')) {
        const rect = node.getBoundingClientRect();
        const hidden = cut && (rect.top >= bounds.bottom - .5 || rect.left >= right - .5 || rect.bottom > bounds.bottom + 1 || rect.right > right + 1);
        controls.push({ node, hidden });
        if (hidden && (!node.hasAttribute('inert') || node.hasAttribute('data-table-clipped-control'))) nextManaged.add(cell);
      }
    }
    for (const { node, hidden } of controls) {
      if (hidden && !node.hasAttribute('inert')) { node.setAttribute('inert', ''); node.setAttribute('data-table-clipped-control', ''); }
      else if (!hidden && node.hasAttribute('data-table-clipped-control')) { node.removeAttribute('inert'); node.removeAttribute('data-table-clipped-control'); }
    }
    managedCells.current = nextManaged;
  }, [clipping, plan, expanded]);
  useIsomorphicLayoutEffect(() => {
    const element = table.current; if (!element) return;
    const entries: ViewAnnotation[] = [];
    if (registeredRuntime.current !== runtime) { registeredRuntime.current = runtime; registered.current = claimTableViews(runtime, owner.current, node, element) ?? []; }
    const previous = new Map(registered.current.map(entry => [entry.occurrence.id, entry]));
    const source = runtime.document.getSnapshot().source;
    rows.forEach((row, rowIndex) => row.children?.forEach((cell, column) => {
      if (!clipped[rowIndex]?.[column] || expanded.has(`${rowIndex}:${column}`)) return;
      const target = element.rows[rowIndex]?.cells[column]; if (!target) return;
      const occurrence = occurrenceFor(cell, rowIndex, column);
      const sourceText = source.slice(occurrence.range.start, occurrence.range.end);
      const summary = target.querySelector('.limr-table-cell-content')?.textContent?.trim().slice(0, 320) ?? '';
      const before = previous.get(occurrence.id), previousData = before?.annotation.data as CellPreview | undefined;
      if (before && previousData?.cell === target && sameCellContent(previousData.content, target) && previousData.source === sourceText && previousData.summary === summary && before.occurrence.range.start === occurrence.range.start && before.occurrence.range.end === occurrence.range.end) { entries.push(before); return; }
      const content = cellContentLease(owner.current, target); if (!content) return;
      const data: CellPreview = {
        cell: target, content, row: rowIndex, column, source: sourceText, summary,
        expand: () => { setExpanded(old => new Set([...old, `${rowIndex}:${column}`])); runtime.activate(null); runtime.hover(null); },
      };
      entries.push({ annotation: { id: occurrence.annotationIds[0], type: tableCellType.type, range: occurrence.range, data }, occurrence, type: tableCellType });
    }));
    if (entries.length !== registered.current.length || entries.some((entry, i) => entry !== registered.current[i])) {
      registered.current = entries;
      runtime.setViewAnnotations(owner.current, entries);
    }
    recordTableViews(runtime, { owner: owner.current, node, table: element, type: tableCellType, entries: registered.current });
  }, [clipped, node, expanded, runtime, id]);
  const renderRow = (row: MarkdownNode, rowIndex: number) => <tr key={row.position?.start.offset ?? rowIndex}>{row.children?.map((cell, column) => {
    const key = `${rowIndex}:${column}`, isExpanded = expanded.has(key), Tag = rowIndex === 0 ? 'th' : 'td';
    const cut = clipped[rowIndex]?.[column];
    // A row's estimate only clips cells the optimizer chose to shorten. Rich
    // inline controls can make an otherwise complete line slightly taller
    // than its CSS line-height and must remain fully visible.
    const lineHeight = measured.current?.rows[rowIndex]?.[column]?.lineHeight;
    const requestedHeight = rowIndex === 0 && lineHeight && algorithm === layoutTable ? lineHeight * 3 : plan?.heights[rowIndex];
    const maximum = isExpanded || rowIndex > 0 && !plan?.clipped[rowIndex]?.[column] ? undefined : requestedHeight && lineHeight ? Math.max(lineHeight, Math.floor(requestedHeight / lineHeight + .01) * lineHeight) : requestedHeight;
    const contentMaximum = plan && plan.contentWidths[column] < plan.widths[column] - .1 ? Math.max(1, plan.contentWidths[column] - (settings?.cellPadding ?? measured.current?.padding ?? 0)) : undefined;
    return <Tag key={cell.position?.start.offset ?? column} scope={rowIndex === 0 ? 'col' : undefined} style={{ textAlign: alignment?.[column] as CSSProperties['textAlign'] }} className="limr-table-cell" data-cell-expanded={isExpanded || undefined}>
      <div className="limr-table-cell-window" data-truncated={cut && !isExpanded || undefined} style={{ maxHeight: maximum, maxWidth: contentMaximum }}>
        <div className="limr-table-cell-content" style={{ maxHeight: cut && !isExpanded ? maximum : undefined }}>{renderChildren(cell.children ?? [])}</div>
        {cut && !isExpanded && <span className="limr-table-cell-reveal" data-limr-ignore="true"><span aria-hidden="true">…</span><AnnotationMarker occurrence={occurrenceFor(cell, rowIndex, column)} /></span>}
        {isExpanded && <span className="limr-table-cell-reveal" data-limr-ignore="true"><InlineMarker className="limr-table-cell-collapse" label={locale.collapse} color="#8a7865" aria-expanded={true}
          onClick={() => setExpanded(old => { const next = new Set(old); next.delete(key); return next; })}><ToolIcon name="collapse" /></InlineMarker></span>}
      </div>
    </Tag>;
  })}</tr>;
  return <div ref={root} className="limr-table-scroll limr-table-layout" data-table-ready={!!plan || undefined} data-table-scroll={plan?.scroll || undefined}
    tabIndex={plan?.scroll ? 0 : undefined} role={plan?.scroll ? 'region' : undefined} aria-label={plan?.scroll ? locale.language?.startsWith('zh') ? '横向滚动表格' : 'Scrollable table' : undefined}>
    <span className="limr-table-marker-measure" aria-hidden="true" data-limr-ignore="true"><InlineMarker ref={overflowMarker} label="" tabIndex={-1}><MoreIcon /></InlineMarker></span>
    <table ref={table} style={plan ? { width: plan.width, tableLayout: 'fixed' } : undefined}>
      {plan && <colgroup>{plan.widths.map((width, i) => <col key={i} style={{ width }} />)}</colgroup>}
      <thead>{rows.slice(0, 1).map(row => renderRow(row, 0))}</thead><tbody>{rows.slice(1).map((row, i) => renderRow(row, i + 1))}</tbody>
    </table>
  </div>;
}
