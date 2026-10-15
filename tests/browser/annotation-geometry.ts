import type { Locator } from '@playwright/test';

/** Explicit ref content anchors to its first glyph; point refs anchor to the
 * marker itself. Externally anchored markers retain the paragraph fallback. */
export function referenceTop(marker: Locator) {
  return marker.evaluate(element => {
    const wrapper = element.closest('.limr-mark-wrap')?.parentElement;
    const scoped = wrapper?.tagName === 'SPAN' || wrapper?.tagName === 'DIV' && wrapper.className === '';
    const block = scoped ? wrapper! : element.closest('p,h1,h2,h3,h4,h5,h6,li,td,th')!;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.textContent?.trim() && !node.parentElement?.closest('[data-limr-ignore]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const text = walker.nextNode();
    if (!text) return element.getBoundingClientRect().top;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, 1);
    return range.getBoundingClientRect().top;
  });
}
