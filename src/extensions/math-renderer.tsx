import katex from 'katex';
import { LruCache } from '../core/cache';
import type { MathOptions } from './math';
import { useRef } from 'react';
import { useIsomorphicLayoutEffect, useRuntime, useStoreSelector } from '../react/context';
import { observeInlineMath } from './inline-math-overflow';

const cache = new LruCache<string, string>(256);
export default function MathContent({ value, display, options }: { value: string; display: boolean; options: MathOptions }) {
  const ref = useRef<HTMLSpanElement>(null);
  const knuthPlass = useStoreSelector(useRuntime().configuration, config => config.typography === 'knuth-plass');
  const key = JSON.stringify([value, display, options]);
  let html = cache.get(key);
  if (html === undefined) {
    html = katex.renderToString(value, { ...options, macros: { ...options.macros }, displayMode: display, output: 'htmlAndMathml', throwOnError: false, trust: false });
    cache.set(key, html);
  }
  useIsomorphicLayoutEffect(() => !display && ref.current ? observeInlineMath(ref.current, knuthPlass) : undefined, [html, display, knuthPlass]);
  return <span ref={ref} className={display ? 'limr-math-display' : 'limr-math-inline'} data-limr-selection-surface={display || undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
