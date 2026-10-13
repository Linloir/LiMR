import type { Locator } from '@playwright/test';

/** First text character of an embedded reference's paragraph, not its superscript. */
export function referenceTop(marker: Locator) {
  return marker.evaluate(element => {
    const block = element.closest('p,h1,h2,h3,h4,h5,h6,li,td,th')!;
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, {
      acceptNode: node => node.textContent?.trim() && !node.parentElement?.closest('[data-limr-ignore]') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const text = walker.nextNode()!;
    const range = document.createRange(); range.setStart(text, 0); range.setEnd(text, 1);
    return range.getBoundingClientRect().top;
  });
}
