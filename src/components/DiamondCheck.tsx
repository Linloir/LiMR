/** The original pointed diamond and center-fill transition, using skin colors. */
export function DiamondCheck({ checked }: { checked: boolean }) {
  return <svg className="limr-choice-diamond" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true" data-limr-ignore="true" data-checked={checked || undefined}>
    <path className="limr-diamond-outline" d="M9 1.5L16.5 9L9 16.5L1.5 9Z" fill="none" />
    <path className="limr-diamond-fill" d="M9 5L13 9L9 13L5 9Z" fill="currentColor" />
  </svg>;
}
