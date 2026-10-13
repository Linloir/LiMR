import { createContext, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { safeUrl, type MarkdownNode } from '../core';
import { CopyButton } from '../components/CopyButton';
import type { NodeRendererProps, RendererExtension } from '../react/types';
import { defaultFigureLimits, dimension, figureColumns, figureLimits, figureWidths, type FigureLimits, type FigureMeasure } from './figure-layout';
import { useLocale } from '../react/context';

export interface FiguresOptions {
  minWidth?: number; maxWidth?: number | false;
  minHeight?: number; maxHeight?: number | false;
  columns?: number; rows?: number; responsive?: boolean; gap?: number;
}
const FigureContext = createContext<FigureLimits>(defaultFigureLimits);
const captionNode = (node: MarkdownNode) => node.name === 'figcaption' || node.name === 'caption';
const flatten = (nodes: readonly MarkdownNode[]) => nodes.flatMap(node => node.type === 'paragraph' && node.children?.some(child => child.name === 'figure' || captionNode(child)) ? node.children : [node]);
const identifier = (node: MarkdownNode) => node.attributes?.id ? String(node.attributes.id) : undefined;
const ratioOf = (width: unknown, height: unknown) => { const ratio = Number(width) / Number(height); return Number.isFinite(ratio) && ratio > 0 ? ratio : 1; };

export function figures(options: FiguresOptions = {}): RendererExtension {
  const defaults = figureLimits({ 'min-width': options.minWidth, 'max-width': options.maxWidth, 'min-height': options.minHeight, 'max-height': options.maxHeight });
  function Figures({ node, renderChildren, renderAttribute, source }: NodeRendererProps) {
    const locale = useLocale();
    const nodes = flatten(node.children ?? []);
    const panels = nodes.filter(child => child.name === 'figure');
    const captions = nodes.filter(captionNode);
    const body = nodes.filter(child => !captionNode(child));
    const limits = useMemo(() => figureLimits(node.attributes, defaults), [node.attributes]);
    const grid = useRef<HTMLDivElement>(null);
    const [columns, setColumns] = useState(1);
    const gap = Math.min(100, dimension(node.attributes?.gap, options.gap ?? 16));
    const rows = dimension(node.attributes?.rows, options.rows ?? 0);
    const requested = dimension(node.attributes?.columns ?? node.attributes?.cols, options.columns ?? 0) || (rows > 0 ? Math.ceil(panels.length / rows) : undefined);
    const responsive = String(node.attributes?.responsive ?? options.responsive ?? true) !== 'false';
    useEffect(() => {
      const element = grid.current;
      if (!element) return;
      const measure = () => {
        const elements = [...element.querySelectorAll<HTMLElement>(':scope > .limr-figure')];
        const items: FigureMeasure[] = panels.map((panel, index) => {
          const image = elements[index]?.querySelector('img');
          const ratio = image?.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight : ratioOf(panel.attributes?.width, panel.attributes?.height);
          return { ratio, limits: figureLimits(panel.attributes, limits) };
        });
        setColumns(figureColumns(element.clientWidth, items, gap, requested, responsive));
      };
      const observer = new ResizeObserver(measure);
      observer.observe(element); element.addEventListener('load', measure, true); element.addEventListener('error', measure, true); measure();
      return () => { observer.disconnect(); element.removeEventListener('load', measure, true); element.removeEventListener('error', measure, true); };
    }, [node, limits, gap, requested, responsive]);
    return <figure id={identifier(node)} className="limr-figures" data-limr-selection-order="visual" data-columns={columns} data-responsive={responsive}>
      <CopyButton value={source} label={locale.copyFigures} variant="glass" className="limr-figures-copy" />
      <FigureContext.Provider value={limits}><div ref={grid} className="limr-figures-grid" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gridTemplateRows: rows ? `repeat(${Math.max(1, Math.min(24, Math.floor(rows)))}, auto auto)` : undefined, gap }}>
        {renderChildren(body)}
      </div></FigureContext.Provider>
      {captions.length ? renderChildren(captions) : node.attributes?.caption ? <figcaption>{renderAttribute('caption')}</figcaption> : null}
    </figure>;
  }
  function Figure({ node, renderChildren, renderAttribute }: NodeRendererProps) {
    const locale = useLocale();
    const inherited = useContext(FigureContext);
    const limits = figureLimits(node.attributes, inherited === defaultFigureLimits ? defaults : inherited);
    const media = useRef<HTMLDivElement>(null);
    const [ratio, setRatio] = useState(ratioOf(node.attributes?.width, node.attributes?.height));
    const nodes = flatten(node.children ?? []);
    const captions = nodes.filter(captionNode);
    const body = nodes.filter(child => !captionNode(child));
    useEffect(() => {
      const element = media.current;
      if (!element) return;
      const measure = () => { const image = element.querySelector('img'); if (image?.naturalWidth && image.naturalHeight) setRatio(image.naturalWidth / image.naturalHeight); };
      measure(); element.addEventListener('load', measure, true);
      return () => element.removeEventListener('load', measure, true);
    }, [node]);
    const maximum = figureWidths({ ratio, limits }).maximum;
    return <figure id={identifier(node)} className="limr-figure" data-limr-selection-order="visual" style={{
      '--limr-figure-width': Number.isFinite(maximum) ? `${maximum}px` : '100%',
      '--limr-figure-min-height': `${Math.min(limits.minHeight, limits.maxHeight)}px`,
      '--limr-figure-max-height': Number.isFinite(limits.maxHeight) ? `${limits.maxHeight}px` : 'none',
    } as CSSProperties}>
      <div ref={media} className="limr-figure-media">
        {renderChildren(body)}
      </div>
      <CopyButton onCopy={async () => {
        const url = media.current?.querySelector('img')?.getAttribute('src');
        if (!url) throw new Error('Image URL unavailable');
        await navigator.clipboard.writeText(url);
      }} label={locale.copyImage} variant="glass" className="limr-figure-copy" />
      {captions.length ? renderChildren(captions) : node.attributes?.caption ? <figcaption>{renderAttribute('caption')}</figcaption> : null}
    </figure>;
  }
  const Caption = ({ children }: NodeRendererProps) => <figcaption>{children}</figcaption>;
  return {
    name: 'figures', tags: ['figures', 'figure', 'figcaption', 'caption', 'img'], directives: ['figures', 'figure', 'figcaption'], scope: 'local', display: 'block',
    components: { figures: Figures, figure: Figure, figcaption: Caption, caption: Caption,
      img: ({ node }) => <img src={safeUrl(node.attributes?.src, true)} alt={String(node.attributes?.alt ?? '')} loading="lazy" decoding="async" /> },
    transform(root) {
      // Attribute images retain a source binding just like Markdown images.
      const visit = (node: MarkdownNode) => {
        if (node.type === 'component' && node.name === 'img') { node.selection = 'atomic'; node.inline = true; }
        if (node.type === 'component' && node.name === 'figure' && (node.attributes?.src || node.attributes?.url)) {
          const image = node.attributeNodes?.[node.attributes.src ? 'src' : 'url'];
          node.children = [{ type: 'image', url: node.attributes.src ?? node.attributes.url, alt: node.attributes.alt ?? '', position: image?.position ?? node.position }, ...(node.children ?? [])];
        }
        node.children?.forEach(visit);
      };
      visit(root);
    },
  };
}
