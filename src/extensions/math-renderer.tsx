import katex from 'katex';
import { LruCache } from '../core/cache';
import type { MathOptions } from './math';

const cache = new LruCache<string, string>(256);
export default function MathContent({ value, display, options }: { value: string; display: boolean; options: MathOptions }) {
  const key = JSON.stringify([value, display, options]);
  let html = cache.get(key);
  if (html === undefined) {
    html = katex.renderToString(value, { ...options, macros: { ...options.macros }, displayMode: display, output: 'htmlAndMathml', throwOnError: false, trust: false });
    cache.set(key, html);
  }
  return <span className={display ? 'limr-math-display' : 'limr-math-inline'} data-limr-selection-surface={display || undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
