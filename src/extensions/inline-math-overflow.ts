// Only mounted formulas participate. One observer per module measures their
// containing blocks on resize/font changes, never scans the document on scroll.
const containers = new Map<HTMLElement, Set<HTMLElement>>();
const formulaContainers = new WeakMap<HTMLElement, HTMLElement>();
let observer: ResizeObserver | undefined;

function measure(targets: Iterable<HTMLElement>, only?: HTMLElement) {
  const writes: (() => void)[] = [];
  for (const container of targets) {
    const formulas = containers.get(container);
    if (!formulas) continue;
    const style = getComputedStyle(container);
    const width = Math.max(1, container.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0) - Math.max(0, parseFloat(style.textIndent) || 0));
    for (const formula of only ? [only] : formulas) {
      const bases = [...formula.querySelectorAll<HTMLElement>('.katex-html > .katex-base')];
      const states = bases.map(base => Math.max(base.scrollWidth, base.getBoundingClientRect().width) > width + .5);
      writes.push(() => {
        formula.style.setProperty('--limr-inline-math-width', `${width}px`);
        bases.forEach((base, index) => {
          if (base.hasAttribute('data-limr-math-scroll') === states[index]) return;
          base.toggleAttribute('data-limr-math-scroll', states[index]);
          if (states[index]) base.tabIndex = 0; else base.removeAttribute('tabindex');
        });
      });
    }
  }
  writes.forEach(write => write());
}
const fontsChanged = () => measure(containers.keys());

/** Tables temporarily remove their suffix track to check full-width content.
 * Update local math scrolling in that same phase, before overflow is read. */
export function refreshInlineMath(root: HTMLElement): void {
  const targets = new Set<HTMLElement>();
  for (const formula of root.querySelectorAll<HTMLElement>('.limr-math-inline')) {
    const container = formulaContainers.get(formula);
    if (container) targets.add(container);
  }
  measure(targets);
}

export function observeInlineMath(formula: HTMLElement, knuthPlass: boolean): (() => void) | undefined {
  const container = formula.closest<HTMLElement>('p,.limr-paragraph,li,.limr-table-cell-content,td,th,figcaption,h1,h2,h3,h4,h5,h6,.limr-prose');
  if (!container || typeof ResizeObserver === 'undefined') return;
  // KP already budgets indivisible bases alongside the surrounding prose.
  // Headings/captions still use native wrapping even in a KP document.
  if (knuthPlass && container.matches('p,.limr-paragraph,li')) return;
  if (!observer) {
    observer = new ResizeObserver(entries => measure(entries.map(entry => entry.target as HTMLElement)));
    document.fonts?.addEventListener('loadingdone', fontsChanged);
  }
  let formulas = containers.get(container);
  if (!formulas) { formulas = new Set(); containers.set(container, formulas); observer.observe(container); }
  formulas.add(formula); formulaContainers.set(formula, container); measure([container], formula);
  return () => {
    for (const base of formula.querySelectorAll('[data-limr-math-scroll]')) {
      base.removeAttribute('data-limr-math-scroll'); base.removeAttribute('tabindex');
    }
    formula.style.removeProperty('--limr-inline-math-width');
    formulas.delete(formula); formulaContainers.delete(formula);
    if (!formulas.size) { containers.delete(container); observer?.unobserve(container); }
    if (!containers.size) {
      observer?.disconnect(); observer = undefined;
      document.fonts?.removeEventListener('loadingdone', fontsChanged);
    }
  };
}
