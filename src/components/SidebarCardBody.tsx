import { memo, useRef, useState, type ComponentType } from 'react';
import type { Annotation, AnnotationOccurrence } from '../core';
import type { AnnotationSidebarPreviewProps } from '../react/types';
import { useIsomorphicLayoutEffect } from '../react/context';
import { AnnotationGroup } from './AnnotationContent';
import { Collapse } from './Collapse';
import { fitPointReference } from './annotation-reference';

function SidebarReference({ reference, point }: { reference: string; point?: boolean }) {
  const element = useRef<HTMLParagraphElement>(null);
  const [fitted, setFitted] = useState(reference);
  useIsomorphicLayoutEffect(() => {
    const target = element.current;
    if (!point || !target) return;
    const context = document.createElement('canvas').getContext('2d');
    if (!context) return;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      const css = getComputedStyle(target);
      context.font = css.font || `${css.fontSize} ${css.fontFamily}`;
      const spacing = parseFloat(css.letterSpacing) || 0;
      setFitted(fitPointReference(reference, target.clientWidth, text => context.measureText(text).width + spacing * Array.from(text).length));
    };
    const observer = new ResizeObserver(fit); observer.observe(target);
    document.fonts?.addEventListener('loadingdone', fit);
    void document.fonts?.ready.then(fit); fit();
    return () => { disposed = true; observer.disconnect(); document.fonts?.removeEventListener('loadingdone', fit); };
  }, [reference, point]);
  return <div className="limr-sidebar-reference" title={reference} data-context={point || undefined}><p ref={element} className="limr-sidebar-excerpt">{point ? fitted : reference}</p></div>;
}

/** Position changes on scroll do not change a card's content. Keep its nested
 * renderer, disclosure controls and plugin preview out of the scroll render. */
export const SidebarCardBody = memo(function SidebarCardBody({ occurrence, annotation, annotations, reference, point, active, title, toggleLabel, Preview, activate }: {
  occurrence: AnnotationOccurrence; annotation?: Annotation; annotations: readonly Annotation[]; reference: string; point?: boolean; active: boolean; title: string; toggleLabel: string;
  Preview?: ComponentType<AnnotationSidebarPreviewProps<any>> | false; activate: (id: string) => void;
}) {
  return <>
    {reference && <SidebarReference reference={reference} point={point} />}
    <div className="limr-sidebar-card-body">
      <button type="button" className="limr-sidebar-card-heading" onClick={() => activate(occurrence.id)} aria-expanded={active}>{title}<span className="limr-sidebar-toggle"><span key={String(active)} className="limr-button-label limr-underline">{toggleLabel}</span></span></button>
      {Preview && annotation && <Collapse open={!active} keepMounted className="limr-sidebar-preview-panel"><div className="limr-sidebar-preview"><Preview annotation={annotation} data={annotation.data} occurrence={occurrence} annotations={annotations} referenceText={reference} /></div></Collapse>}
      <Collapse open={active} className="limr-sidebar-expansion"><div className="limr-sidebar-card-content"><AnnotationGroup occurrence={occurrence} presentation="sidebar" enabled={active} /></div></Collapse>
    </div>
  </>;
});
