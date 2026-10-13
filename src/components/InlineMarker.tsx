import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react';

export interface InlineMarkerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label: string;
  color?: string;
}

/** An action-only marker. It does not create an annotation, sidebar card or overlay. */
export const InlineMarker = forwardRef<HTMLButtonElement, InlineMarkerProps>(function InlineMarker({ label, color, children, className = '', style, ...props }, ref) {
  return <span className="limr-mark-wrap" data-limr-ignore="true"><button {...props} ref={ref} type="button" aria-label={label} title={props.title ?? label}
    className={`limr-mark limr-action-mark ${className}`} style={{ '--limr-mark-color': color, ...style } as CSSProperties}><span className="limr-mark-icon">{children}</span></button></span>;
});
