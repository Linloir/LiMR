import type { ReactNode } from 'react';
import { useLocale } from '../react/context';
import type { AnnotationOverlayCardProps } from '../react/types';
import { OverlayScrollArea } from './OverlayScrollArea';

export interface AnnotationCardProps extends AnnotationOverlayCardProps {
  title: ReactNode;
  /** Accessible name for the scrollable body when the title is rich content. */
  bodyLabel?: string;
}

/** Optional card layout for modules. The overlay itself renders no header or controls. */
export function AnnotationCard({ title, bodyLabel, occurrence, expanded, pinned, canExpand, expand, collapse, close, children }: AnnotationCardProps) {
  const locale = useLocale();
  return <>
    <div className="limr-overlay-header"><span>{title}</span><div className="limr-overlay-controls">
      {expanded ? <button type="button" onClick={collapse}><span className="limr-underline">{locale.collapse}</span></button> : canExpand && <button type="button" onClick={expand}><span className="limr-underline">{locale.expand}</span></button>}
      {pinned && <button type="button" className="limr-overlay-close" onClick={close} aria-label={locale.close}>×</button>}
    </div></div>
    <OverlayScrollArea active resetKey={occurrence.id} label={bodyLabel ?? (typeof title === 'string' ? title : locale.annotations)}>{children}</OverlayScrollArea>
  </>;
}
