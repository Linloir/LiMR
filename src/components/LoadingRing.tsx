import { useLocale } from '../react/context';

/** Shared by default modules; plugins remain free to supply their own state. */
export function LoadingRing() {
  const locale = useLocale();
  return <span className="limr-loading" role="status" aria-label={locale.loading} data-limr-ignore="true">
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle className="limr-loading-track" cx="16" cy="16" r="12" />
      <g className="limr-loading-orbit"><circle className="limr-loading-arc" cx="16" cy="16" r="12" pathLength="100" /></g>
    </svg>
  </span>;
}
export function BlockLoading() { return <div className="limr-block-loading"><LoadingRing /></div>; }
